import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
            <div className="text-center">
                {/* Crescent */}
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mx-auto mb-6 text-[var(--color-primary)] animate-crescent"
                >
                    <path
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        fill="currentColor"
                    />
                </svg>

                <h1 className="text-6xl font-extrabold text-white mb-2">404</h1>
                <h2 className="text-xl font-bold text-gray-300 mb-4">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
                </p>

                <Link
                    href="/"
                    className="btn btn-primary btn-lg"
                >
                    ☪ Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
