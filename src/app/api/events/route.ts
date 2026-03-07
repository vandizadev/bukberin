import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = createEventSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, description, budgetPerPerson, dateOptions, locationOptions } =
            parsed.data;

        const slug = slugify(name);

        const event = await prisma.$transaction(async (tx) => {
            const newEvent = await tx.event.create({
                data: {
                    slug,
                    name,
                    description,
                    budgetPerPerson,
                    organizerId: session.user!.id,
                },
            });

            // Create date vote options
            const dateVoteOptions = dateOptions.map((label) => ({
                type: "DATE" as const,
                label,
                eventId: newEvent.id,
            }));

            // Create location vote options
            const locationVoteOptions = locationOptions.map((label) => ({
                type: "LOCATION" as const,
                label,
                eventId: newEvent.id,
            }));

            await tx.voteOption.createMany({
                data: [...dateVoteOptions, ...locationVoteOptions],
            });

            return newEvent;
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Create event error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const events = await prisma.event.findMany({
            where: { organizerId: session.user.id },
            include: {
                _count: { select: { participants: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("List events error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
