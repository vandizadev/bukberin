import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import {
    Calendar,
    MapPin,
    Users,
    Wallet,
    CheckCircle2,
    Clock,
    XCircle,
} from "lucide-react";
import CopyLinkButton from "./copy-link";
import EventActions from "./event-actions";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
    const session = await auth();
    if (!session?.user?.id) return null;

    const { id } = await params;

    const event = await prisma.event.findFirst({
        where: { id, organizerId: session.user.id },
        include: {
            voteOptions: {
                include: { _count: { select: { votes: true } } },
                orderBy: { createdAt: "asc" },
            },
            participants: {
                include: {
                    votes: { include: { voteOption: true } },
                    payment: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!event) notFound();

    const dateOptions = event.voteOptions.filter((v) => v.type === "DATE");
    const locationOptions = event.voteOptions.filter((v) => v.type === "LOCATION");
    const maxVotes = Math.max(
        ...event.voteOptions.map((v) => v._count.votes),
        1
    );

    const totalParticipants = event.participants.length;
    const paidCount = event.participants.filter(
        (p) => p.payment?.status === "PAID"
    ).length;
    const totalCollected = event.participants
        .filter((p) => p.payment?.status === "PAID")
        .reduce((sum, p) => sum + (p.payment?.amount || 0), 0);
    const totalTarget = totalParticipants * event.budgetPerPerson;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const publicLink = `${appUrl}/acara/${event.slug}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card p-6 bg-gradient-to-br from-amber-50 to-violet-50 border border-amber-200/50">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 relative">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{event.name}</h1>
                        <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2 pr-8 sm:pr-0">
                            {event.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className="badge badge-success">
                                {event.status === "OPEN" ? "Dibuka" : event.status}
                            </span>
                            <span className="flex items-center gap-1 text-[var(--text-muted)]">
                                <Users className="w-3 h-3" /> {totalParticipants} peserta
                            </span>
                            <span className="flex items-center gap-1 text-[var(--text-muted)]">
                                💰 {formatRupiah(event.budgetPerPerson)}/orang
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-start w-full sm:w-auto justify-end mt-2 sm:mt-0">
                        <CopyLinkButton link={publicLink} />
                        <EventActions event={{
                            id: event.id,
                            name: event.name,
                            description: event.description,
                            budgetPerPerson: event.budgetPerPerson,
                            status: event.status
                        }} />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-[var(--color-secondary)]" />
                    <p className="text-2xl font-bold">{totalParticipants}</p>
                    <p className="text-xs text-[var(--text-muted)]">Peserta</p>
                </div>
                <div className="card p-4 text-center">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-[var(--color-success)]" />
                    <p className="text-2xl font-bold">{paidCount}</p>
                    <p className="text-xs text-[var(--text-muted)]">Sudah Bayar</p>
                </div>
                <div className="card p-4 text-center">
                    <Wallet className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" />
                    <p className="text-2xl font-bold">{formatRupiah(totalCollected)}</p>
                    <p className="text-xs text-[var(--text-muted)]">Terkumpul</p>
                </div>
                <div className="card p-4 text-center">
                    <Wallet className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-bold">{formatRupiah(totalTarget)}</p>
                    <p className="text-xs text-[var(--text-muted)]">Target</p>
                </div>
            </div>

            {/* Payment Progress */}
            <div className="card p-6">
                <h2 className="font-bold mb-3">💰 Progress Pembayaran</h2>
                <div className="progress-bar h-4 mb-2">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${totalTarget > 0 ? (totalCollected / totalTarget) * 100 : 0}%`,
                        }}
                    />
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                    {formatRupiah(totalCollected)} dari {formatRupiah(totalTarget)} (
                    {totalTarget > 0
                        ? Math.round((totalCollected / totalTarget) * 100)
                        : 0}
                    %)
                </p>
            </div>

            {/* Voting Results */}
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                        Hasil Voting Tanggal
                    </h2>
                    <div className="space-y-3">
                        {dateOptions.map((opt, i) => (
                            <div key={opt.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="flex items-center gap-2">
                                        {i === 0 && opt._count.votes > 0 && "🏆 "}
                                        {opt.label}
                                    </span>
                                    <span className="font-bold">{opt._count.votes} vote</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${maxVotes > 0 ? (opt._count.votes / maxVotes) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6">
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[var(--color-secondary)]" />
                        Hasil Voting Lokasi
                    </h2>
                    <div className="space-y-3">
                        {locationOptions.map((opt, i) => (
                            <div key={opt.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="flex items-center gap-2">
                                        {i === 0 && opt._count.votes > 0 && "🏆 "}
                                        {opt.label}
                                    </span>
                                    <span className="font-bold">{opt._count.votes} vote</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${maxVotes > 0 ? (opt._count.votes / maxVotes) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Participants Table */}
            <div className="card p-6 overflow-x-auto">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[var(--color-primary)]" />
                    Daftar Peserta
                </h2>

                {event.participants.length === 0 ? (
                    <p className="text-center text-[var(--text-muted)] py-8">
                        Belum ada peserta terdaftar
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 font-semibold">Nama</th>
                                <th className="text-left py-2 px-2 font-semibold">HP</th>
                                <th className="text-left py-2 px-2 font-semibold">Vote</th>
                                <th className="text-left py-2 px-2 font-semibold">Bayar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.participants.map((p) => {
                                const dateVote = p.votes.find(
                                    (v) => v.voteOption.type === "DATE"
                                );
                                const locVote = p.votes.find(
                                    (v) => v.voteOption.type === "LOCATION"
                                );
                                const paymentStatus = p.payment?.status;

                                return (
                                    <tr key={p.id} className="border-b border-gray-100">
                                        <td className="py-3 px-2 font-medium">{p.name}</td>
                                        <td className="py-3 px-2 text-[var(--text-muted)]">
                                            {p.phone}
                                        </td>
                                        <td className="py-3 px-2">
                                            {dateVote || locVote ? (
                                                <div className="space-y-1">
                                                    {dateVote && (
                                                        <span className="badge badge-info text-xs">
                                                            📅 {dateVote.voteOption.label}
                                                        </span>
                                                    )}
                                                    {locVote && (
                                                        <span className="badge badge-purple text-xs ml-1">
                                                            📍 {locVote.voteOption.label}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[var(--text-muted)]">
                                                    Belum vote
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-2">
                                            {paymentStatus === "PAID" ? (
                                                <span className="badge badge-success flex items-center gap-1 w-fit">
                                                    <CheckCircle2 className="w-3 h-3" /> Lunas
                                                </span>
                                            ) : paymentStatus === "PENDING" ? (
                                                <span className="badge badge-warning flex items-center gap-1 w-fit">
                                                    <Clock className="w-3 h-3" /> Pending
                                                </span>
                                            ) : paymentStatus === "FAILED" ? (
                                                <span className="badge badge-danger flex items-center gap-1 w-fit">
                                                    <XCircle className="w-3 h-3" /> Gagal
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-muted)]">
                                                    Belum bayar
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
