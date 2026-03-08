import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateEventSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(1000).optional(),
    budgetPerPerson: z.number().min(10000).max(10000000).optional(),
    status: z.enum(["DRAFT", "OPEN", "VOTING_CLOSED", "COMPLETED", "CANCELLED"]).optional(),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const parsed = updateEventSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        // Verify ownership
        const existingEvent = await prisma.event.findFirst({
            where: { id, organizerId: session.user.id },
        });

        if (!existingEvent) {
            return NextResponse.json(
                { error: "Acara tidak ditemukan atau Anda tidak memiliki akses" },
                { status: 404 }
            );
        }

        // Prevent updating if event is already cancelled or completed
        if (existingEvent.status === "CANCELLED" || existingEvent.status === "COMPLETED") {
            return NextResponse.json(
                { error: "Acara ini sudah tidak dapat diubah" },
                { status: 400 }
            );
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: parsed.data,
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error("Update event error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
