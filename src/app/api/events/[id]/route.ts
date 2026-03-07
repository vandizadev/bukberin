import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Try to find by slug first, then by id
        const event = await prisma.event.findFirst({
            where: {
                OR: [{ slug: id }, { id }],
            },
            include: {
                organizer: { select: { name: true } },
                voteOptions: {
                    include: {
                        _count: { select: { votes: true } },
                    },
                    orderBy: { createdAt: "asc" },
                },
                participants: {
                    include: {
                        votes: true,
                        payment: { select: { status: true, amount: true } },
                    },
                    orderBy: { createdAt: "desc" },
                },
                _count: { select: { participants: true } },
            },
        });

        if (!event) {
            return NextResponse.json(
                { error: "Acara tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Get event error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
