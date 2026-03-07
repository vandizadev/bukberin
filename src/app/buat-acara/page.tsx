"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
    Moon,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Plus,
    X,
    Loader2,
    Calendar,
    MapPin,
    Wallet,
    Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/utils";

export default function BuatAcaraPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        budgetPerPerson: 50000,
        dateOptions: [""] as string[],
        locationOptions: [""] as string[],
    });

    const handleAIGenerate = async () => {
        if (!form.name) {
            toast.error("Isi nama acara dulu!");
            return;
        }
        setAiLoading(true);
        try {
            const res = await fetch("/api/ai/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventName: form.name }),
            });
            const data = await res.json();
            if (data.description) {
                setForm({ ...form, description: data.description });
                toast.success("Deskripsi berhasil di-generate! ✨");
            } else {
                toast.error(data.error || "Gagal generate deskripsi");
            }
        } catch {
            toast.error("Gagal generate deskripsi");
        } finally {
            setAiLoading(false);
        }
    };

    const addDateOption = () => {
        setForm({ ...form, dateOptions: [...form.dateOptions, ""] });
    };

    const removeDateOption = (index: number) => {
        if (form.dateOptions.length <= 1) return;
        const newDates = form.dateOptions.filter((_, i) => i !== index);
        setForm({ ...form, dateOptions: newDates });
    };

    const addLocationOption = () => {
        setForm({ ...form, locationOptions: [...form.locationOptions, ""] });
    };

    const removeLocationOption = (index: number) => {
        if (form.locationOptions.length <= 1) return;
        const newLocations = form.locationOptions.filter((_, i) => i !== index);
        setForm({ ...form, locationOptions: newLocations });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const dateOpts = form.dateOptions.filter((d) => d.trim());
            const locOpts = form.locationOptions.filter((l) => l.trim());

            if (dateOpts.length === 0 || locOpts.length === 0) {
                toast.error("Minimal 1 opsi tanggal dan 1 opsi lokasi");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    budgetPerPerson: form.budgetPerPerson,
                    dateOptions: dateOpts,
                    locationOptions: locOpts,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Gagal membuat acara");
                return;
            }

            toast.success("Acara berhasil dibuat! 🎉");
            router.push(`/dashboard`);
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-3xl font-bold mb-2">Buat Acara Bukber 🌙</h1>
                        <p className="text-[var(--text-muted)]">
                            Isi detail acara, pilih opsi voting, dan share ke peserta!
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s
                                        ? "bg-gradient-to-br from-amber-400 to-violet-500 text-white scale-110"
                                        : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {step > s ? <Check className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`w-12 h-1 rounded-full transition-all ${step > s ? "bg-gradient-to-r from-amber-400 to-violet-500" : "bg-gray-200"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="card p-6 sm:p-8 animate-slide-up">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Moon className="w-5 h-5 text-[var(--color-primary)]" />
                                    Info Dasar
                                </h2>

                                <div>
                                    <label htmlFor="eventName" className="label">Nama Acara</label>
                                    <input
                                        id="eventName"
                                        type="text"
                                        className="input"
                                        placeholder="contoh: Bukber Angkatan 2020"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="budget" className="label">
                                        Budget per Orang: {formatRupiah(form.budgetPerPerson)}
                                    </label>
                                    <input
                                        id="budget"
                                        type="range"
                                        className="w-full accent-[var(--color-primary)]"
                                        min={10000}
                                        max={500000}
                                        step={5000}
                                        value={form.budgetPerPerson}
                                        onChange={(e) =>
                                            setForm({ ...form, budgetPerPerson: Number(e.target.value) })
                                        }
                                    />
                                    <div className="flex justify-between text-xs text-[var(--text-muted)]">
                                        <span>Rp 10.000</span>
                                        <span>Rp 500.000</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label htmlFor="desc" className="label mb-0">Deskripsi Acara</label>
                                        <button
                                            type="button"
                                            onClick={handleAIGenerate}
                                            disabled={aiLoading}
                                            className="btn btn-sm btn-secondary"
                                        >
                                            {aiLoading ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Sparkles className="w-3 h-3" />
                                            )}
                                            Generate AI
                                        </button>
                                    </div>
                                    <textarea
                                        id="desc"
                                        className="input min-h-[100px] resize-y"
                                        placeholder="Tulis deskripsi acara atau klik Generate AI..."
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                        maxLength={1000}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        if (!form.name || !form.description) {
                                            toast.error("Nama dan deskripsi wajib diisi");
                                            return;
                                        }
                                        setStep(2);
                                    }}
                                    className="btn btn-primary w-full btn-lg"
                                >
                                    Lanjut
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Voting Options */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                                    Opsi Voting
                                </h2>

                                {/* Date Options */}
                                <div>
                                    <label className="label flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Opsi Tanggal
                                    </label>
                                    <div className="space-y-2">
                                        {form.dateOptions.map((date, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="date"
                                                    className="input flex-1"
                                                    value={date}
                                                    onChange={(e) => {
                                                        const newDates = [...form.dateOptions];
                                                        newDates[i] = e.target.value;
                                                        setForm({ ...form, dateOptions: newDates });
                                                    }}
                                                />
                                                {form.dateOptions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDateOption(i)}
                                                        className="btn btn-ghost text-red-500 px-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addDateOption}
                                            className="btn btn-outline btn-sm w-full"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Tambah Tanggal
                                        </button>
                                    </div>
                                </div>

                                {/* Location Options */}
                                <div>
                                    <label className="label flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Opsi Lokasi
                                    </label>
                                    <div className="space-y-2">
                                        {form.locationOptions.map((loc, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="input flex-1"
                                                    placeholder="contoh: Restoran Padang Sederhana"
                                                    value={loc}
                                                    onChange={(e) => {
                                                        const newLocs = [...form.locationOptions];
                                                        newLocs[i] = e.target.value;
                                                        setForm({ ...form, locationOptions: newLocs });
                                                    }}
                                                />
                                                {form.locationOptions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLocationOption(i)}
                                                        className="btn btn-ghost text-red-500 px-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addLocationOption}
                                            className="btn btn-outline btn-sm w-full"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Tambah Lokasi
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep(1)} className="btn btn-ghost flex-1">
                                        <ArrowLeft className="w-4 h-4" />
                                        Kembali
                                    </button>
                                    <button
                                        onClick={() => {
                                            const validDates = form.dateOptions.filter((d) => d.trim());
                                            const validLocs = form.locationOptions.filter((l) => l.trim());
                                            if (validDates.length === 0 || validLocs.length === 0) {
                                                toast.error("Minimal 1 opsi tanggal dan 1 opsi lokasi");
                                                return;
                                            }
                                            setStep(3);
                                        }}
                                        className="btn btn-primary flex-1"
                                    >
                                        Lanjut
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Preview & Confirm */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[var(--color-success)]" />
                                    Preview Acara
                                </h2>

                                <div className="space-y-4 p-4 bg-amber-50 rounded-xl border border-amber-200/50">
                                    <div>
                                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Nama Acara</span>
                                        <p className="font-bold text-lg">{form.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Deskripsi</span>
                                        <p className="text-sm">{form.description}</p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div>
                                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold flex items-center gap-1">
                                                <Wallet className="w-3 h-3" />
                                                Budget/Orang
                                            </span>
                                            <p className="font-bold text-[var(--color-primary-dark)]">
                                                {formatRupiah(form.budgetPerPerson)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Opsi Tanggal
                                            </span>
                                            <ul className="mt-1 space-y-1">
                                                {form.dateOptions
                                                    .filter((d) => d.trim())
                                                    .map((d, i) => (
                                                        <li key={i} className="text-sm badge badge-info">
                                                            {d}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                Opsi Lokasi
                                            </span>
                                            <ul className="mt-1 space-y-1">
                                                {form.locationOptions
                                                    .filter((l) => l.trim())
                                                    .map((l, i) => (
                                                        <li key={i} className="text-sm badge badge-purple">
                                                            {l}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setStep(2)} className="btn btn-ghost flex-1">
                                        <ArrowLeft className="w-4 h-4" />
                                        Kembali
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="btn btn-primary flex-1 btn-lg"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                🚀 Buat Acara
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
