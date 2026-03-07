import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[var(--color-night)] text-[var(--color-text-on-dark)] pattern-stars">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col items-center text-center gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--color-primary)]">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                        </svg>
                        <span className="font-extrabold text-lg gradient-text">Bukberin</span>
                    </div>

                    {/* Ornamental Divider */}
                    <div className="divider-ornament text-xs w-48">✦</div>

                    {/* Nav Links */}
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
                            Beranda
                        </Link>
                        <Link href="/buat-acara" className="hover:text-[var(--color-primary)] transition-colors">
                            Buat Acara
                        </Link>
                        <Link href="/dashboard" className="hover:text-[var(--color-primary)] transition-colors">
                            Dashboard
                        </Link>
                    </div>

                    <p className="text-xs text-gray-500">
                        © 2026 Bukberin — AI-Powered Bukber Organizer. Made with 💛 & 🤲
                    </p>
                </div>
            </div>
        </footer>
    );
}
