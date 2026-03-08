"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Route error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1729] px-4">
            <div className="text-center">
                <div className="text-6xl mb-4">🌙</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Terjadi Kesalahan
                </h1>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Maaf, halaman ini mengalami masalah. Silakan coba lagi nanti.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-[#D4A843] text-[#0F1729] font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );
}
