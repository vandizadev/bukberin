"use client";

import { useState, useEffect } from "react";
import {
    Calendar,
    MapPin,
    Wallet,
    Loader2,
    Check,
    UserPlus,
    Vote,
} from "lucide-react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

interface VoteOptionDisplay {
    id: string;
    label: string;
    voteCount: number;
}

interface Props {
    eventId: string;
    eventSlug: string;
    budgetPerPerson: number;
    dateOptions: VoteOptionDisplay[];
    locationOptions: VoteOptionDisplay[];
    totalVoters: number;
    eventStatus: string;
}

export default function PublicEventClient({
    eventId,
    eventSlug,
    budgetPerPerson,
    dateOptions,
    locationOptions,
    totalVoters,
    eventStatus,
}: Props) {
    const [phase, setPhase] = useState<"register" | "vote" | "done">("register");
    const [participantId, setParticipantId] = useState("");
    const [loading, setLoading] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [isRestored, setIsRestored] = useState(false); // To handle hydration mismatch

    const [joinForm, setJoinForm] = useState({ name: "", phone: "" });
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [localDateOptions, setLocalDateOptions] = useState(dateOptions);
    const [localLocationOptions, setLocalLocationOptions] = useState(locationOptions);

    const maxVotes = Math.max(
        ...localDateOptions.map((d) => d.voteCount),
        ...localLocationOptions.map((l) => l.voteCount),
        1
    );

    // Restore Participant Session from localStorage
    useEffect(() => {
        const savedSession = localStorage.getItem(`bukberin_session_${eventId}`);
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                if (parsed.participantId && parsed.phase) {
                    setParticipantId(parsed.participantId);
                    setPhase(parsed.phase);
                }
            } catch (e) {
                console.error("Failed to parse saved session", e);
            }
        }
        setIsRestored(true);
    }, [eventId]);

    const saveSession = (pId: string, currentPhase: string) => {
        localStorage.setItem(`bukberin_session_${eventId}`, JSON.stringify({
            participantId: pId,
            phase: currentPhase
        }));
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/events/${eventId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(joinForm),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Gagal mendaftar");
                return;
            }
            setParticipantId(data.id);
            setPhase("vote");
            saveSession(data.id, "vote");
            toast.success("Berhasil terdaftar! Sekarang vote pilihanmu 🗳️");
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (!selectedDate || !selectedLocation) {
            toast.error("Pilih tanggal dan lokasi dulu!");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/events/${eventId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participantId,
                    selectedDateId: selectedDate,
                    selectedLocationId: selectedLocation,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Gagal submit vote");
                return;
            }

            // Update local counts
            setLocalDateOptions((prev) =>
                prev.map((d) =>
                    d.id === selectedDate ? { ...d, voteCount: d.voteCount + 1 } : d
                )
            );
            setLocalLocationOptions((prev) =>
                prev.map((l) =>
                    l.id === selectedLocation ? { ...l, voteCount: l.voteCount + 1 } : l
                )
            );

            setPhase("done");
            saveSession(participantId, "done");
            toast.success("Vote berhasil disimpan! ✅");
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        setPayLoading(true);
        try {
            const res = await fetch(`/api/events/${eventId}/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participantId }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Gagal membuat link pembayaran");
                return;
            }
            if (data.checkoutUrl) {
                window.open(data.checkoutUrl, "_blank");
                toast.success("Link pembayaran dibuka di tab baru 💸");
            }
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setPayLoading(false);
        }
    };

    if (!isRestored) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Registration Card */}
            {phase === "register" && (
                <div className="card p-6 sm:p-8 animate-slide-up">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <UserPlus className="w-5 h-5 text-[var(--color-primary)]" />
                        Daftar Peserta
                    </h2>
                    <form onSubmit={handleJoin} className="space-y-4">
                        <div>
                            <label htmlFor="joinName" className="label">Nama Lengkap</label>
                            <input
                                id="joinName"
                                type="text"
                                className="input"
                                placeholder="Nama kamu"
                                value={joinForm.name}
                                onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                                required
                                minLength={2}
                            />
                        </div>
                        <div>
                            <label htmlFor="joinPhone" className="label">Nomor HP</label>
                            <input
                                id="joinPhone"
                                type="tel"
                                className="input"
                                placeholder="08xxxxxxxxxx"
                                value={joinForm.phone}
                                onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar & Lanjut Vote 🗳️"}
                        </button>
                    </form>
                </div>
            )}

            {/* Voting Section */}
            {phase === "vote" && (
                <div className="card p-6 sm:p-8 animate-slide-up">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <Vote className="w-5 h-5 text-[var(--color-secondary)]" />
                        Vote Pilihanmu
                    </h2>

                    {/* Date Voting */}
                    <div className="mb-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                            Pilih Tanggal
                        </h3>
                        <div className="space-y-2">
                            {localDateOptions.map((opt) => (
                                <label
                                    key={opt.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedDate === opt.id
                                        ? "border-[var(--color-primary)] bg-amber-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="date"
                                        value={opt.id}
                                        checked={selectedDate === opt.id}
                                        onChange={() => setSelectedDate(opt.id)}
                                        className="accent-[var(--color-primary)]"
                                    />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium">{opt.label}</span>
                                        <div className="mt-1 progress-bar">
                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${totalVoters > 0 ? (opt.voteCount / maxVotes) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)] font-semibold">
                                        {opt.voteCount} vote
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Location Voting */}
                    <div className="mb-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-[var(--color-secondary)]" />
                            Pilih Lokasi
                        </h3>
                        <div className="space-y-2">
                            {localLocationOptions.map((opt) => (
                                <label
                                    key={opt.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedLocation === opt.id
                                        ? "border-[var(--color-secondary)] bg-violet-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="location"
                                        value={opt.id}
                                        checked={selectedLocation === opt.id}
                                        onChange={() => setSelectedLocation(opt.id)}
                                        className="accent-[var(--color-secondary)]"
                                    />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium">{opt.label}</span>
                                        <div className="mt-1 progress-bar">
                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${totalVoters > 0 ? (opt.voteCount / maxVotes) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)] font-semibold">
                                        {opt.voteCount} vote
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleVote} disabled={loading} className="btn btn-secondary w-full btn-lg">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Vote ✅"}
                    </button>
                </div>
            )}

            {/* Done - Vote result + Payment */}
            {phase === "done" && (
                <div className="space-y-6 animate-slide-up">
                    <div className="card p-6 sm:p-8 text-center">
                        <div className="text-5xl mb-3">🎉</div>
                        <h2 className="text-xl font-bold mb-2">Vote Berhasil!</h2>
                        <p className="text-[var(--text-muted)] mb-6">
                            Terima kasih sudah voting. Jangan lupa bayar patungannya ya!
                        </p>

                        <button
                            onClick={handlePay}
                            disabled={payLoading}
                            className="btn btn-primary btn-lg w-full sm:w-auto"
                        >
                            {payLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Wallet className="w-5 h-5" />
                                    Bayar Patungan {formatRupiah(budgetPerPerson)}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Live Results */}
                    <div className="card p-6">
                        <h3 className="font-bold mb-4">📊 Hasil Sementara</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Tanggal
                                </h4>
                                <div className="space-y-2">
                                    {localDateOptions.map((d) => (
                                        <div key={d.id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{d.label}</span>
                                                <span className="font-semibold">{d.voteCount}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{
                                                        width: `${maxVotes > 0 ? (d.voteCount / maxVotes) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Lokasi
                                </h4>
                                <div className="space-y-2">
                                    {localLocationOptions.map((l) => (
                                        <div key={l.id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{l.label}</span>
                                                <span className="font-semibold">{l.voteCount}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{
                                                        width: `${maxVotes > 0 ? (l.voteCount / maxVotes) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Voting Results (always visible) */}
            {phase !== "done" && totalVoters > 0 && (
                <div className="card p-6 animate-fade-in">
                    <h3 className="font-bold mb-4">📊 Hasil Voting ({totalVoters} peserta)</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">📅 Tanggal</h4>
                            <div className="space-y-2">
                                {localDateOptions.map((d) => (
                                    <div key={d.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{d.label}</span>
                                            <span className="font-semibold">{d.voteCount}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${maxVotes > 0 ? (d.voteCount / maxVotes) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-2">📍 Lokasi</h4>
                            <div className="space-y-2">
                                {localLocationOptions.map((l) => (
                                    <div key={l.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{l.label}</span>
                                            <span className="font-semibold">{l.voteCount}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${maxVotes > 0 ? (l.voteCount / maxVotes) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
