import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
    mayarApiKey: z.string().optional().or(z.literal("")),
    mayarWebhookSecret: z.string().optional().or(z.literal("")),
});

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                mayarApiKey: true,
                mayarWebhookSecret: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Fetch settings error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = settingsSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { mayarApiKey, mayarWebhookSecret } = parsed.data;

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                mayarApiKey: mayarApiKey || null,
                mayarWebhookSecret: mayarWebhookSecret || null,
            },
            select: {
                mayarApiKey: true,
                mayarWebhookSecret: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Update settings error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
