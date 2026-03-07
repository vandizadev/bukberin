"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function MockPaymentContent() {
    const searchParams = useSearchParams();
    const txn = searchParams.get("txn") || "";
    const amount = searchParams.get("amount") || "0";
    const name = searchParams.get("name") || "Peserta";

    const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

    const formatRupiah = (val: string) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(val));
    };

    const handlePay = async () => {
        setStatus("processing");
        await new Promise((r) => setTimeout(r, 2500));

        try {
            const res = await fetch("/api/webhooks/mayar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-mayar-signature": "",
                },
                body: JSON.stringify({
                    event: "payment.completed",
                    data: { id: txn },
                    transactionId: txn,
                    status: "PAID",
                }),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("failed");
            }
        } catch {
            setStatus("failed");
        }
    };

    const handleFail = async () => {
        setStatus("processing");
        await new Promise((r) => setTimeout(r, 1500));

        try {
            await fetch("/api/webhooks/mayar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-mayar-signature": "",
                },
                body: JSON.stringify({
                    event: "payment.failed",
                    data: { id: txn },
                    transactionId: txn,
                    status: "FAILED",
                }),
            });
        } catch {
            // ignore
        }
        setStatus("failed");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Mock Banner */}
                <div className="bg-amber-500 text-white text-center py-2 px-4 rounded-t-2xl text-sm font-semibold">
                    🧪 MOCK PAYMENT SIMULATOR — Ini bukan halaman Mayar asli
                </div>

                <div className="bg-white rounded-b-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                        <div className="flex items-center gap-2 mb-4 opacity-80">
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm font-medium">Mayar Checkout (Mock)</span>
                        </div>
                        <p className="text-sm opacity-80 mb-1">Total Pembayaran</p>
                        <p className="text-3xl font-bold">{formatRupiah(amount)}</p>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {status === "idle" && (
                            <div className="space-y-4">
                                {/* Order Summary */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Detail Pembayaran</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nama</span>
                                            <span className="font-medium">{decodeURIComponent(name)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Transaction ID</span>
                                            <span className="font-mono text-xs text-gray-400">
                                                {txn.substring(0, 20)}...
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="font-semibold">Total</span>
                                            <span className="font-bold text-blue-600">{formatRupiah(amount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Payment Methods */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Metode Pembayaran</h3>
                                    <div className="space-y-2">
                                        {["💳 Virtual Account BCA", "📱 GoPay", "💰 OVO", "🏧 QRIS"].map((method) => (
                                            <label key={method} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all">
                                                <input type="radio" name="method" className="accent-blue-600" defaultChecked={method.includes("BCA")} />
                                                <span className="text-sm">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2">
                                    <button
                                        onClick={handlePay}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:translate-y-[-1px] transition-all"
                                    >
                                        ✅ Simulasi Bayar Berhasil
                                    </button>
                                    <button
                                        onClick={handleFail}
                                        className="w-full py-3 px-4 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all text-sm"
                                    >
                                        ❌ Simulasi Bayar Gagal
                                    </button>
                                </div>
                            </div>
                        )}

                        {status === "processing" && (
                            <div className="text-center py-12">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                                <p className="font-semibold text-lg">Memproses Pembayaran...</p>
                                <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <p className="font-bold text-xl text-green-600 mb-1">Pembayaran Berhasil! 🎉</p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Status pembayaran sudah diupdate di database.
                                </p>
                                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                                    Webhook <code>payment.completed</code> sudah dikirim ke{" "}
                                    <code>/api/webhooks/mayar</code> dan status berubah ke <strong>PAID</strong>.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 mt-6 text-sm text-blue-600 font-medium hover:underline"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Bukberin
                                </Link>
                            </div>
                        )}

                        {status === "failed" && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">❌</span>
                                </div>
                                <p className="font-bold text-xl text-red-600 mb-1">Pembayaran Gagal</p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Status pembayaran diupdate ke FAILED.
                                </p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 text-center">
                        <p className="text-xs text-gray-400">
                            🧪 Mock Payment Simulator oleh <span className="font-semibold">Bukberin</span>
                            <br />
                            Ini akan diganti halaman Mayar asli saat API key sudah tersedia.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MockPaymentPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                </div>
            }
        >
            <MockPaymentContent />
        </Suspense>
    );
}
