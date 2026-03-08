"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { data: session, status } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[var(--color-primary)]">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                        </svg>
                        <span className="gradient-text font-extrabold tracking-tight">Bukberin</span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="theme-toggle"
                            aria-label="Toggle dark mode"
                        >
                            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </button>

                        <Link href="/buat-acara" className="btn btn-primary">
                            ✨ Buat Acara
                        </Link>

                        {status === "loading" ? (
                            <div className="w-20 h-8 bg-white/5 animate-pulse rounded-full" />
                        ) : session ? (
                            <>
                                <Link href="/dashboard" className="btn btn-ghost hover:bg-[var(--bg-muted)]">
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/settings" className="btn btn-ghost hover:bg-[var(--bg-muted)]">
                                    ⚙️ Pengaturan
                                </Link>
                                <button onClick={() => signOut()} className="btn btn-ghost text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors">
                                    <LogOut className="w-4 h-4 rounded-full mr-1" />
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/login" className="btn btn-ghost">
                                Masuk
                            </Link>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="theme-toggle"
                            aria-label="Toggle dark mode"
                        >
                            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </button>
                        <button
                            className="p-2 rounded-lg hover:bg-[var(--bg-muted)] transition-colors"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-[var(--border-default)] bg-[var(--bg-surface)]/95 backdrop-blur-lg">
                    <div className="px-4 py-3 space-y-2">
                        <Link href="/buat-acara" className="block btn btn-primary w-full text-center" onClick={() => setOpen(false)}>
                            ✨ Buat Acara
                        </Link>

                        {status === "authenticated" ? (
                            <>
                                <Link href="/dashboard" className="block btn btn-ghost w-full text-left" onClick={() => setOpen(false)}>
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/settings" className="block btn btn-ghost w-full text-left" onClick={() => setOpen(false)}>
                                    ⚙️ Pengaturan
                                </Link>
                                <button onClick={() => { signOut(); setOpen(false); }} className="block btn btn-ghost w-full text-left text-red-500">
                                    Keluar
                                </button>
                            </>
                        ) : status === "unauthenticated" && (
                            <Link href="/auth/login" className="block btn btn-ghost w-full text-center" onClick={() => setOpen(false)}>
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
