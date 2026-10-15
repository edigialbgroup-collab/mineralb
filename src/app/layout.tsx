import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import RfqModal from "@/components/RfqModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MinerAlb | B2B Natural Stone Sourcing & Quarry Supply",
  description:
    "Estrazione diretta e fornitura da cava di pietre calcaree e marmi balcanici di prima scelta.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden w-full max-w-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F6] text-[#2B2D2F] overflow-x-hidden w-full max-w-full relative">
        {children}
        <RfqModal />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
