import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, Users, ArrowRight, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const statusLabels: Record<string, { label: string; class: string }> = {
    DRAFT: { label: "Draft", class: "badge-warning" },
    OPEN: { label: "Dibuka", class: "badge-success" },
    VOTING_CLOSED: { label: "Voting Ditutup", class: "badge-info" },
    COMPLETED: { label: "Selesai", class: "badge-purple" },
    CANCELLED: { label: "Dibatalkan", class: "badge-danger" },
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const events = await prisma.event.findMany({
        where: { organizerId: session.user.id },
        include: {
            _count: { select: { participants: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard 📊</h1>
                    <p className="text-[var(--text-muted)] text-sm">
                        Halo, {session.user.name}! Kelola acara bukbermu di sini.
                    </p>
                </div>
                <Link href="/buat-acara" className="btn btn-primary hidden sm:inline-flex">
                    <Plus className="w-4 h-4" />
                    Buat Acara
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="text-6xl mb-4">🌙</div>
                    <h2 className="text-xl font-bold mb-2">Belum Ada Acara</h2>
                    <p className="text-[var(--text-muted)] mb-6">
                        Buat acara bukber pertamamu sekarang!
                    </p>
                    <Link href="/buat-acara" className="btn btn-primary btn-lg">
                        ✨ Buat Acara Pertama
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                    {events.map((event) => {
                        const status = statusLabels[event.status] || statusLabels.DRAFT;
                        return (
                            <Link
                                key={event.id}
                                href={`/dashboard/acara/${event.id}`}
                                className="card card-interactive group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-lg group-hover:text-[var(--color-primary-dark)] transition-colors line-clamp-1">
                                        {event.name}
                                    </h3>
                                    <span className={`badge ${status.class} shrink-0 ml-2`}>
                                        {status.label}
                                    </span>
                                </div>

                                <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">
                                    {event.description}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4 text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {event._count.participants} peserta
                                        </span>
                                        <span className="flex items-center gap-1">
                                            💰 {formatRupiah(event.budgetPerPerson)}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all" />
                                </div>

                                <div className="text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-gray-100 flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" />
                                    {new Date(event.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
