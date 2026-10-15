import Link from "next/link";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import { translations, Locale } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Chi Siamo | MinerAlb B2B Natural Stone",
  description:
    "La visione e la missione di MinerAlb: collegare direttamente i mercati internazionali con le cave di pietra naturale balcaniche.",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const currentLang = (cookieStore.get("mineralb_lang")?.value as Locale) || "it";
  const t = translations[currentLang] || translations.it;
  const a = t.aboutPage;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] font-sans selection:bg-[#8C7A6B] selection:text-white flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      
      {/* NAVBAR RESPONSIVE UNIFICATA CON MENU MOBILE */}
      <Navbar t={t} />

      {/* CONTENUTO CHI SIAMO */}
      <main className="flex-grow max-w-4xl mx-auto px-5 sm:px-6 py-16 sm:py-24 space-y-10 sm:space-y-12">
        <div>
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.25em] block mb-2 sm:mb-3">
            {a.tag}
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight leading-tight mb-4 sm:mb-6">
            {a.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#6B6862] font-light leading-relaxed">
            {a.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-[#EAE7E1]">
          <div className="bg-white p-6 sm:p-7 border border-[#EAE7E1] rounded-sm">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-2 sm:mb-3">{a.boxAboutTitle}</h3>
            <p className="text-xs text-[#6B6862] font-light leading-relaxed">
              {a.boxAboutDesc}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 border border-[#EAE7E1] rounded-sm">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-2 sm:mb-3">{a.boxMissionTitle}</h3>
            <p className="text-xs text-[#6B6862] font-light leading-relaxed">
              {a.boxMissionDesc}
            </p>
          </div>
        </div>

        <div className="bg-[#141516] text-white p-6 sm:p-10 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-light">{a.bannerTitle}</h3>
            <p className="text-xs text-[#A3A09A] mt-1 font-light">
              {a.bannerDesc}
            </p>
          </div>
          <Link
            href="/metodo"
            className="bg-[#C5A880] text-[#141516] px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#d8be9a] transition whitespace-nowrap"
          >
            {a.bannerBtn}
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#EAE7E1] bg-white py-8 text-center text-xs text-[#6B6862]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 MinerAlb — B2B Natural Stone Sourcing & Quarry Supply.</p>
          <div className="flex space-x-6 text-[11px] font-medium">
            <Link href="/privacy" className="hover:text-[#1A1A1A]">{t.home.privacy}</Link>
            <Link href="/cookie-policy" className="hover:text-[#1A1A1A]">{t.home.cookie}</Link>
            <Link href="/metodo" className="hover:text-[#1A1A1A]">{t.nav.method}</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
