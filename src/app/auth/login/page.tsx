"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });
            if (result?.error) {
                toast.error("Email atau password salah");
            } else {
                toast.success("Login berhasil! 🎉");
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Night sky background */}
            <div className="absolute inset-0 gradient-hero -z-10" />
            <div className="absolute inset-0 pattern-stars -z-10" />

            {/* Decorative stars */}
            <div className="absolute top-20 left-[15%] w-2 h-2 bg-[var(--color-primary-light)] rounded-full animate-twinkle" />
            <div className="absolute top-32 right-[20%] w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-twinkle delay-300" />
            <div className="absolute bottom-40 left-[30%] w-1 h-1 bg-white/50 rounded-full animate-twinkle delay-500" />

            {/* Crescent Moon */}
            <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                className="absolute top-12 right-[10%] text-[var(--color-primary)] animate-crescent hidden sm:block"
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
            </svg>

            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[var(--color-primary)]">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                        </svg>
                        <span className="text-2xl font-extrabold gradient-text">Bukberin</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Assalamu&apos;alaikum! 👋</h1>
                    <p className="text-gray-400 mt-2">
                        Masuk ke akunmu untuk mengelola acara bukber
                    </p>
                </div>

                <div className="card p-6 sm:p-8 glass-dark border border-[var(--color-primary)]/10">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="label text-gray-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    className="input pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[var(--color-primary)]"
                                    placeholder="kamu@email.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="label text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    id="password"
                                    type="password"
                                    className="input pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[var(--color-primary)]"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Belum punya akun?{" "}
                        <Link href="/auth/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
