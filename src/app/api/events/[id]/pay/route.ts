import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCheckoutLink } from "@/lib/mayar";
import { z } from "zod";

const paySchema = z.object({
    participantId: z.string().min(1, "participantId wajib diisi"),
});

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const body = await req.json();
        const parsed = paySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { participantId } = parsed.data;

        // Get participant and event data
        const participant = await prisma.participant.findFirst({
            where: { id: participantId, eventId },
            include: {
                event: true,
                payment: true,
            },
        });

        if (!participant) {
            return NextResponse.json(
                { error: "Peserta tidak ditemukan" },
                { status: 404 }
            );
        }

        // Check event is still active
        if (participant.event.status === "CANCELLED") {
            return NextResponse.json(
                { error: "Acara sudah dibatalkan" },
                { status: 400 }
            );
        }

        // If already paid, return existing
        if (participant.payment?.status === "PAID") {
            return NextResponse.json(
                { error: "Sudah membayar", payment: participant.payment },
                { status: 400 }
            );
        }

        // If existing pending payment, return its URL
        if (
            participant.payment?.status === "PENDING" &&
            participant.payment.mayarCheckoutUrl
        ) {
            return NextResponse.json({
                checkoutUrl: participant.payment.mayarCheckoutUrl,
                paymentId: participant.payment.id,
            });
        }

        const amount = participant.event.budgetPerPerson;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const { checkoutUrl, transactionId } = await createCheckoutLink({
            name: `Patungan: ${participant.event.name}`.substring(0, 200),
            amount,
            description: `Patungan bukber "${participant.event.name}" - ${participant.name}`.substring(0, 500),
            redirectUrl: `${appUrl}/acara/${participant.event.slug}?payment=success`,
            customerName: participant.name,
            customerPhone: participant.phone || undefined,
        });

        // Create or update payment record
        const payment = await prisma.payment.upsert({
            where: { participantId },
            create: {
                amount,
                participantId,
                mayarCheckoutUrl: checkoutUrl,
                mayarTransactionId: transactionId,
            },
            update: {
                mayarCheckoutUrl: checkoutUrl,
                mayarTransactionId: transactionId,
                status: "PENDING",
            },
        });

        return NextResponse.json({
            checkoutUrl,
            paymentId: payment.id,
        });
    } catch (error) {
        console.error("Payment error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
