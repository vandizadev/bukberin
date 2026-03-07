import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, LogOut } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/auth/login");

    return (
        <div className="min-h-screen flex">
            {/* Sidebar — Night theme */}
            <aside className="w-64 bg-[var(--color-night)] hidden lg:flex flex-col border-r border-white/5">
                <div className="p-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--color-primary)]">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                        </svg>
                        <span className="gradient-text font-extrabold">Bukberin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-[var(--color-primary)] transition-colors"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/buat-acara"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-[var(--color-primary)] transition-colors"
                    >
                        <CalendarDays className="w-4 h-4" />
                        Buat Acara Baru
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-sm">
                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-200 truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--color-night)] border-b border-white/5 px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--color-primary)]">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                    </svg>
                    <span className="gradient-text text-sm font-extrabold">Bukberin</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/buat-acara" className="btn btn-primary btn-sm">
                        + Acara
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-auto bg-[var(--color-background)]">
                <div className="lg:p-8 p-4 pt-16 lg:pt-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
