import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDate } from "@/lib/utils";
import PublicEventClient from "./client";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const event = await prisma.event.findFirst({
        where: { OR: [{ slug }, { id: slug }] },
    });

    if (!event) return { title: "Acara Tidak Ditemukan - Bukberin" };

    return {
        title: `${event.name} | Bukberin`,
        description: event.description.substring(0, 160),
        openGraph: {
            title: event.name,
            description: event.description.substring(0, 160),
            siteName: "Bukberin",
            locale: "id_ID",
            type: "website",
        },
    };
}

export default async function PublicEventPage({ params }: Props) {
    const { slug } = await params;

    const event = await prisma.event.findFirst({
        where: { OR: [{ slug }, { id: slug }] },
        include: {
            organizer: { select: { name: true } },
            voteOptions: {
                include: { _count: { select: { votes: true } } },
                orderBy: { createdAt: "asc" },
            },
            _count: { select: { participants: true } },
        },
    });

    if (!event) notFound();

    const dateOptions = event.voteOptions.filter((v) => v.type === "DATE");
    const locationOptions = event.voteOptions.filter((v) => v.type === "LOCATION");
    const totalVoters = event._count.participants;

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Header */}
            <div className="gradient-hero text-white relative overflow-hidden">
                <div className="absolute inset-0 pattern-stars" />
                {/* Crescent */}
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="absolute top-6 right-[10%] text-[var(--color-primary)] animate-crescent hidden sm:block opacity-60">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                </svg>
                <div className="absolute top-8 left-[15%] w-1.5 h-1.5 bg-[var(--color-primary-light)] rounded-full animate-twinkle" />
                <div className="absolute top-16 right-[30%] w-1 h-1 bg-white/50 rounded-full animate-twinkle delay-300" />

                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
                    <div className="animate-fade-in">
                        <span className="badge bg-white/10 text-[var(--color-primary-light)] backdrop-blur-sm mb-4 border border-[var(--color-primary)]/20">
                            ☪ Bukber Event
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
                            {event.name}
                        </h1>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1">
                                👤 Oleh: {event.organizer.name}
                            </span>
                            <span className="flex items-center gap-1">
                                💰 Budget: {formatRupiah(event.budgetPerPerson)}/orang
                            </span>
                            <span className="flex items-center gap-1">
                                👥 {totalVoters} peserta terdaftar
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client-side interactive part */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 pb-16">
                <PublicEventClient
                    eventId={event.id}
                    eventSlug={event.slug}
                    budgetPerPerson={event.budgetPerPerson}
                    dateOptions={dateOptions.map((d) => ({
                        id: d.id,
                        label: d.label,
                        voteCount: d._count.votes,
                    }))}
                    locationOptions={locationOptions.map((l) => ({
                        id: l.id,
                        label: l.label,
                        voteCount: l._count.votes,
                    }))}
                    totalVoters={totalVoters}
                    eventStatus={event.status}
                />
            </div>
        </div>
    );
}
