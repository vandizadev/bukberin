import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateEventDescription } from "@/lib/openai";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hr

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const now = Date.now();
        const userLimit = rateLimit.get(userId);

        if (userLimit && now < userLimit.resetAt) {
            if (userLimit.count >= MAX_REQUESTS) {
                return NextResponse.json(
                    { error: "Limit penggunaan AI tercapai. Coba lagi dalam 1 jam." },
                    { status: 429 }
                );
            }
            userLimit.count++;
        } else {
            rateLimit.set(userId, { count: 1, resetAt: now + WINDOW_MS });
        }

        const body = await req.json();
        const { eventName, context } = body;

        if (!eventName || typeof eventName !== "string") {
            return NextResponse.json(
                { error: "Nama acara wajib diisi" },
                { status: 400 }
            );
        }

        // Input length limits — prevent abuse and excessive API costs
        const sanitizedName = eventName.trim().substring(0, 100);
        const sanitizedContext = typeof context === "string"
            ? context.trim().substring(0, 300)
            : undefined;

        if (sanitizedName.length < 3) {
            return NextResponse.json(
                { error: "Nama acara minimal 3 karakter" },
                { status: 400 }
            );
        }

        const description = await generateEventDescription(
            sanitizedName,
            sanitizedContext
        );

        return NextResponse.json({ description });
    } catch (error) {
        console.error("AI generate error:", error);
        return NextResponse.json(
            { error: "Gagal generate deskripsi" },
            { status: 500 }
        );
    }
}
