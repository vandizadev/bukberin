# 🌙 Bukberin — AI-Powered Bukber Organizer

![Bukberin Banner](https://via.placeholder.com/1200x600?text=Bukberin+-+Atur+Bukber+Tanpa+Ribet) 
*(Catatan: Kamu bisa mengganti URL gambar di atas dengan screenshot aplikasimu nanti)*

**Bukberin** adalah aplikasi *micro-SaaS* inovatif yang dirancang khusus untuk menghilangkan "drama" kepanitiaan Buka Bersama (Bukber). Dari menentukan tanggal, memilih tempat, hingga menagih uang patungan—semuanya diotomatisasi dengan kecerdasan buatan (AI) dan integrasi pembayaran instan.

Proyek ini dibangun sebagai *submission* untuk **Mayar Vibecoding Competition 2026**.

---

## ✨ Fitur Utama

- 🤖 **AI-Generated Event Descriptions**: Panitia cukup memasukkan nama acara dan konteks singkat. AI akan secara otomatis merangkaikan deskripsi acara yang *catchy* dan menarik (didukung oleh OpenAI).
- 📊 **Sistem Voting Interaktif**: Peserta dapat melakukan *voting* untuk menentukan tanggal dan lokasi bukber secara demokratis dan hasilnya terlihat secara *real-time*.
- 💳 **Pembayaran Patungan Instan (Mayar Integration)**: Tidak ada lagi tagih-menagih manual atau verifikasi mutasi rekening! Tombol "Bayar Patungan" langsung mengarahkan peserta ke *checkout* Mayar. Status pembayaran peserta (Lunas/Belum) akan ter-update otomatis di *dashboard* panitia melalui sistem Webhook.
- 📱 **Desain Mobile-First & Ceria**: Antarmuka pengguna (UI) yang responsif, modern, dan bernuansa hangat khas Ramadhan.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan tumpukan teknologi modern untuk memastikan performa dan skalabilitas:
- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS v4.
- **Backend**: Next.js Route Handlers (API).
- **Database**: PostgreSQL dengan Prisma ORM.
- **Authentication**: NextAuth.js (Auth.js).
- **Third-Party Integrations**: Mayar Headless API (Payment & Webhook), OpenAI API.

---

## 🚀 Cara Menjalankan di Local (Development)

Jika Anda juri atau *developer* yang ingin mencoba menjalankan Bukberin di mesin lokal, ikuti langkah-langkah berikut:

1. **Clone Repository**
   ```bash
   git clone [https://github.com/username/bukberin-app.git](https://github.com/username/bukberin-app.git)
   cd bukberin-app

    Install Dependencies
    Bash

    npm install

    Konfigurasi Environment Variables
    Duplikat file .env.example menjadi .env dan isi dengan kredensial Anda:
    Bash

    cp .env.example .env

    (Pastikan Anda memasukkan MAYAR_API_KEY, MAYAR_WEBHOOK_SECRET, OPENAI_API_KEY, dan DATABASE_URL yang valid)

    Setup Database
    Jalankan perintah sinkronisasi Prisma untuk menyiapkan skema database:
    Bash

    npx prisma db push

    Jalankan Development Server
    Bash

    npm run dev

    Buka http://localhost:3000 di browser Anda untuk melihat hasilnya.

💡 Di Balik Layar: Agentic Vibecoding

Proyek Bukberin ini tidak ditulis baris-demi-baris dengan cara konvensional, melainkan dieksekusi menggunakan pendekatan Agentic Vibecoding.

Memanfaatkan agen AI yang mampu membaca keseluruhan struktur workspace, peran saya bergeser dari sekadar coder menjadi Product Architect. Fokus pengembangan diutamakan pada perancangan blueprint logika bisnis, memastikan integrasi Mayar API berjalan mulus dengan penanganan edge cases (seperti mock payment untuk development), dan memoles User Experience (UX) agar terasa natural dan bebas hambatan. AI menerjemahkan visi tersebut menjadi arsitektur Next.js 15 yang kokoh dan fungsional dalam waktu rekor.

<div align="center">
<p>Dikembangkan dengan ❤️ untuk inovasi di bulan suci.</p>
<b>© 2026 <a href="https://www.google.com/url?sa=E&source=gmail&q=https://github.com/username">Vandiza Dev</a></b>
</div>