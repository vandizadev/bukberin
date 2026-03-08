import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/providers/theme-provider";
import AuthProvider from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Bukberin — AI-Powered Bukber Organizer",
  description:
    "Atur acara buka bersama tanpa ribet! Voting tempat, tanggal, dan bayar patungan dalam satu platform.",
  openGraph: {
    title: "Bukberin — Atur Bukber Tanpa Ribet 🌙🍽️",
    description:
      "Platform cerdas untuk mengatur buka bersama: voting, pendaftaran, dan patungan otomatis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: { borderRadius: "0.75rem" },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
