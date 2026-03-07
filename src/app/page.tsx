import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Calendar, MapPin, Wallet, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ===== HERO — Night Sky ===== */}
      <section className="relative pt-16 overflow-hidden gradient-hero min-h-[90vh] flex items-center">
        {/* Stars */}
        <div className="absolute inset-0 pattern-stars" />

        {/* Decorative floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Crescent Moon */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute top-20 right-[15%] text-[var(--color-primary)] animate-crescent hidden sm:block"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
          </svg>

          {/* Small Crescent for mobile */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute top-24 right-8 text-[var(--color-primary)] animate-crescent sm:hidden"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
          </svg>

          {/* Stars scattered */}
          <div className="absolute top-16 left-[10%] w-2 h-2 bg-[var(--color-primary-light)] rounded-full animate-twinkle" />
          <div className="absolute top-32 left-[25%] w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-twinkle delay-300" />
          <div className="absolute top-24 right-[35%] w-1 h-1 bg-white/60 rounded-full animate-twinkle delay-500" />
          <div className="absolute top-40 left-[60%] w-1.5 h-1.5 bg-[var(--color-primary-light)] rounded-full animate-twinkle delay-700" />
          <div className="absolute top-12 left-[45%] w-1 h-1 bg-white/40 rounded-full animate-twinkle delay-200" />
          <div className="absolute top-36 right-[20%] w-1 h-1 bg-[var(--color-primary)] rounded-full animate-twinkle delay-400" />

          {/* Lanterns */}
          <div className="absolute top-0 left-[8%] animate-lantern hidden lg:block">
            <svg width="40" height="70" viewBox="0 0 40 70" fill="none" className="opacity-40">
              <line x1="20" y1="0" x2="20" y2="15" stroke="#D4A843" strokeWidth="1.5" />
              <rect x="10" y="15" width="20" height="30" rx="8" fill="#D4A843" fillOpacity="0.25" stroke="#D4A843" strokeWidth="1" />
              <ellipse cx="20" cy="30" rx="4" ry="6" fill="#D4A843" fillOpacity="0.4" />
            </svg>
          </div>
          <div className="absolute top-0 right-[12%] animate-lantern delay-500 hidden lg:block">
            <svg width="35" height="60" viewBox="0 0 40 70" fill="none" className="opacity-30">
              <line x1="20" y1="0" x2="20" y2="15" stroke="#D4A843" strokeWidth="1.5" />
              <rect x="10" y="15" width="20" height="30" rx="8" fill="#D4A843" fillOpacity="0.2" stroke="#D4A843" strokeWidth="1" />
              <ellipse cx="20" cy="30" rx="4" ry="6" fill="#D4A843" fillOpacity="0.35" />
            </svg>
          </div>

          {/* Mosque silhouette at bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
              {/* Mosque dome center */}
              <ellipse cx="720" cy="120" rx="80" ry="60" fill="#0A5A49" fillOpacity="0.3" />
              <rect x="715" y="55" width="10" height="20" fill="#0A5A49" fillOpacity="0.3" />
              <ellipse cx="720" cy="55" rx="4" ry="6" fill="#D4A843" fillOpacity="0.25" />
              {/* Minarets */}
              <rect x="620" y="60" width="8" height="60" fill="#0A5A49" fillOpacity="0.25" />
              <ellipse cx="624" cy="60" rx="6" ry="8" fill="#0A5A49" fillOpacity="0.25" />
              <rect x="812" y="60" width="8" height="60" fill="#0A5A49" fillOpacity="0.25" />
              <ellipse cx="816" cy="60" rx="6" ry="8" fill="#0A5A49" fillOpacity="0.25" />
              {/* Ground */}
              <rect x="0" y="100" width="1440" height="20" fill="#0A5A49" fillOpacity="0.2" />
            </svg>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10 pb-32">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 badge-night mb-6 text-sm px-4 py-1.5 rounded-full bg-white/5 border border-[var(--color-primary)]/30 text-[var(--color-primary-light)] backdrop-blur-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              AI-Powered Bukber Organizer
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white">
              Atur Bukber
              <br />
              <span className="gradient-text">Tanpa Ribet</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Buat halaman acara, voting tempat & tanggal, dan bayar patungan —
              semua dalam satu platform yang pintar dan ceria untuk Ramadan-mu.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/buat-acara" className="btn btn-primary btn-lg group text-base">
                ☪ Buat Acara Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auth/login" className="btn btn-outline-light btn-lg">
                Masuk ke Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-4 sm:px-6 pattern-islamic relative">
        <div className="max-w-6xl mx-auto">
          {/* Section title with ornament */}
          <div className="text-center mb-14">
            <div className="divider-ornament text-sm max-w-xs mx-auto mb-4">☪</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Fitur Lengkap untuk <span className="gradient-text">Bukber-mu</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">
              Dari undangan sampai patungan, semuanya beres dalam satu tempat.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✨",
                title: "Deskripsi AI",
                desc: "Generate deskripsi acara otomatis yang menarik dan ceria dengan bantuan AI.",
                gradient: "from-[#D4A843] to-[#B8922F]",
              },
              {
                icon: "📅",
                title: "Voting Tanggal",
                desc: "Peserta bisa voting tanggal yang paling cocok. Tidak perlu chat panjang!",
                gradient: "from-[#0D6E5B] to-[#0A5A49]",
              },
              {
                icon: "📍",
                title: "Voting Lokasi",
                desc: "Tentukan tempat bukber favorit lewat voting interaktif dengan progress bar.",
                gradient: "from-[#7C3AED] to-[#6D28D9]",
              },
              {
                icon: "👥",
                title: "Pendaftaran Peserta",
                desc: "Halaman publik yang bisa di-share. Cukup isi nama dan nomor HP.",
                gradient: "from-[#0891B2] to-[#0E7490]",
              },
              {
                icon: "💰",
                title: "Patungan Online",
                desc: "Bayar patungan lewat Mayar. Tidak perlu transfer manual satu-satu.",
                gradient: "from-[#D4A843] to-[#92400E]",
              },
              {
                icon: "📊",
                title: "Dashboard Panitia",
                desc: "Pantau peserta, hasil voting, dan status pembayaran dalam satu tampilan.",
                gradient: "from-[#0F1729] to-[#1A2744]",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card card-interactive animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 sm:px-6 gradient-night text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-stars opacity-50" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="divider-ornament text-sm max-w-xs mx-auto mb-4">✦</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-14">
            Cara Kerja <span className="gradient-text">Bukberin</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                emoji: "📝",
                title: "Buat Acara",
                desc: "Isi form, generate deskripsi AI, dan dapatkan link halaman acara.",
              },
              {
                step: "2",
                emoji: "🗳️",
                title: "Share & Vote",
                desc: "Bagikan link ke peserta. Mereka daftar lalu voting tanggal & lokasi.",
              },
              {
                step: "3",
                emoji: "💸",
                title: "Bayar Patungan",
                desc: "Peserta bayar patungan online. Kamu pantau semuanya dari dashboard.",
              },
            ].map((item, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
                <div className="text-5xl mb-4">{item.emoji}</div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-[var(--color-night)] font-bold text-sm mb-3 shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4 sm:px-6 pattern-islamic">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-8 sm:p-12 bg-gradient-to-br from-[var(--color-night)] to-[var(--color-night-light)] text-white relative overflow-hidden">
            <div className="absolute inset-0 pattern-stars opacity-40" />

            <div className="relative z-10">
              {/* Small crescent */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-[var(--color-primary)] animate-crescent">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
              </svg>

              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Siap Atur <span className="gradient-text">Bukber</span>?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Gratis dan langsung bisa dipakai. Buat acara bukber pertamamu sekarang!
              </p>

              <div className="divider-ornament text-xs max-w-[200px] mx-auto mb-8">✦</div>

              <Link href="/buat-acara" className="btn btn-primary btn-lg text-base">
                ☪ Mulai Sekarang — Gratis!
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
