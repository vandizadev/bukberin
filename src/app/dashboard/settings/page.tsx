"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const [mayarApiKey, setMayarApiKey] = useState("");
    const [mayarWebhookSecret, setMayarWebhookSecret] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/user/settings");
                if (res.ok) {
                    const data = await res.json();
                    setMayarApiKey(data.mayarApiKey || "");
                    setMayarWebhookSecret(data.mayarWebhookSecret || "");
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mayarApiKey, mayarWebhookSecret }),
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Pengaturan berhasil disimpan!" });
            } else {
                const data = await res.json();
                setMessage({ type: "error", text: data.error || "Gagal menyimpan pengaturan" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Pengaturan Akun ⚙️</h1>
            <p className="text-[var(--text-muted)] mb-8">
                Konfigurasi integrasi pembayaran dan preferensi akun Anda.
            </p>

            <form onSubmit={handleSave} className="card space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Integrasi Mayar</h2>
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                        Masukkan API Key dan Webhook Secret dari akun Mayar Anda untuk menerima pembayaran patungan langsung ke rekening bisnis Anda.
                        <br />
                        <span className="text-[var(--color-primary-dark)] font-medium">Jangan biarkan kosong.</span>
                    </p>

                    {message && (
                        <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm">{message.text}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Mayar API Key</span>
                            </label>
                            <input
                                type="password"
                                className="input"
                                placeholder="sk_live_..."
                                value={mayarApiKey}
                                onChange={(e) => setMayarApiKey(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Mayar Webhook Token</span>
                            </label>
                            <input
                                type="password"
                                className="input"
                                placeholder="whsec_..."
                                value={mayarWebhookSecret}
                                onChange={(e) => setMayarWebhookSecret(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn btn-primary"
                    >
                        {isSaving ? (
                            "Menyimpan..."
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Simpan Pengaturan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
