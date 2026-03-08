import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/mayar";

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get("x-mayar-signature") || "";

        let payload;
        try {
            payload = JSON.parse(bodyText);
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const transactionId = payload.data?.id || payload.transactionId;
        const status = payload.event || payload.status;

        if (!transactionId) {
            return NextResponse.json(
                { error: "Missing transaction ID" },
                { status: 400 }
            );
        }

        // Find payment before verifying signature to get the organizer's webhook secret
        const existingPayment = await prisma.payment.findUnique({
            where: { mayarTransactionId: transactionId },
            include: {
                participant: {
                    include: {
                        event: {
                            include: {
                                organizer: true,
                            },
                        },
                    },
                },
            },
        });

        if (!existingPayment) {
            console.warn(`Webhook: payment not found for txn ${transactionId}`);
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        // Use Organizer's Webhook Secret or fallback to Env Var
        const webhookSecret = existingPayment.participant.event.organizer.mayarWebhookSecret || process.env.MAYAR_WEBHOOK_SECRET || "";

        // Verify signature with correct secret
        if (!verifyWebhookSignature(bodyText, signature, webhookSecret)) {
            console.warn("Webhook: invalid signature attempt");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        // Prevent updating already-finalized payments
        if (existingPayment.status === "PAID") {
            return NextResponse.json({ received: true, status: "already_paid" });
        }

        if (status === "payment.completed" || status === "PAID") {
            await prisma.payment.update({
                where: { mayarTransactionId: transactionId },
                data: {
                    status: "PAID",
                    paidAt: new Date(),
                },
            });
        } else if (status === "payment.failed" || status === "FAILED") {
            await prisma.payment.update({
                where: { mayarTransactionId: transactionId },
                data: { status: "FAILED" },
            });
        } else if (status === "payment.expired" || status === "EXPIRED") {
            await prisma.payment.update({
                where: { mayarTransactionId: transactionId },
                data: { status: "EXPIRED" },
            });
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook processing error" },
            { status: 500 }
        );
    }
}
