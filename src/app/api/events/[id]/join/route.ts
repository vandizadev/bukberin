import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { joinEventSchema } from "@/lib/validators";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const body = await req.json();
        const parsed = joinEventSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, phone } = parsed.data;

        // Check event exists and is open
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event || event.status === "CANCELLED") {
            return NextResponse.json(
                { error: "Acara tidak ditemukan atau sudah ditutup" },
                { status: 404 }
            );
        }

        // Check duplicate
        const existing = await prisma.participant.findUnique({
            where: { eventId_phone: { eventId, phone } },
        });
        if (existing) {
            return NextResponse.json(existing);
        }

        const participant = await prisma.participant.create({
            data: { name, phone, eventId },
        });

        return NextResponse.json(participant, { status: 201 });
    } catch (error) {
        console.error("Join event error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
