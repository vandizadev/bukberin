import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { voteSchema } from "@/lib/validators";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const body = await req.json();
        const parsed = voteSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { participantId, selectedDateId, selectedLocationId } = parsed.data;

        // Verify participant belongs to this event
        const participant = await prisma.participant.findFirst({
            where: { id: participantId, eventId },
        });
        if (!participant) {
            return NextResponse.json(
                { error: "Peserta tidak ditemukan" },
                { status: 404 }
            );
        }

        // Check event is open for voting
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event || event.status === "VOTING_CLOSED" || event.status === "COMPLETED" || event.status === "CANCELLED") {
            return NextResponse.json(
                { error: "Voting sudah ditutup" },
                { status: 400 }
            );
        }

        // Verify vote options belong to this event
        const voteOptions = await prisma.voteOption.findMany({
            where: {
                id: { in: [selectedDateId, selectedLocationId] },
                eventId,
            },
        });

        if (voteOptions.length !== 2) {
            return NextResponse.json(
                { error: "Opsi vote tidak valid" },
                { status: 400 }
            );
        }

        const dateOption = voteOptions.find((v) => v.type === "DATE" && v.id === selectedDateId);
        const locationOption = voteOptions.find((v) => v.type === "LOCATION" && v.id === selectedLocationId);

        if (!dateOption || !locationOption) {
            return NextResponse.json(
                { error: "Pilih satu tanggal dan satu lokasi" },
                { status: 400 }
            );
        }

        // Use transaction to prevent race condition between delete + create
        await prisma.$transaction(async (tx) => {
            await tx.vote.deleteMany({
                where: { participantId },
            });

            await tx.vote.createMany({
                data: [
                    { participantId, voteOptionId: selectedDateId },
                    { participantId, voteOptionId: selectedLocationId },
                ],
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Vote error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
