"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <html lang="id">
            <body className="min-h-screen flex items-center justify-center bg-[#0F1729]">
                <div className="text-center px-4">
                    <div className="text-6xl mb-4">🌙</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Terjadi Kesalahan
                    </h1>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
                    </p>
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-[#D4A843] text-[#0F1729] font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Coba Lagi
                    </button>
                </div>
            </body>
        </html>
    );
}
