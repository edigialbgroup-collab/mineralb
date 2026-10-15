import Link from "next/link";
import { Metadata } from "next";
import { cookies } from "next/headers";
import LanguageSelector from "@/components/LanguageSelector";
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] font-sans selection:bg-[#8C7A6B] selection:text-white flex flex-col justify-between">
      
      {/* TOP UTILITY BAR ISTITUZIONALE CON SELETTORE LINGUA */}
      <div className="bg-[#141516] text-[#A3A09A] text-[10px] font-mono border-b border-white/10 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
            <span className="text-[#E2DFD8] tracking-wider uppercase font-semibold">{t.topBar.quarry}</span>
            <span className="text-white/20">•</span>
            <span className="hidden md:inline uppercase text-[#8C7A6B]">{t.topBar.b2b}</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <a href="mailto:info@mineralb.com" className="hover:text-[#C5A880] transition">info@mineralb.com</a>
            <span className="text-white/20">•</span>
            <span className="text-[#C5A880] font-semibold tracking-wider">{t.topBar.location}</span>
            <span className="text-white/20">•</span>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* HEADER UNIFICATO CON MENU DISTANZIATO */}
      <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE7E1] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3 group" title="Torna alla Home MinerAlb">
            <div className="w-8 h-8 bg-[#141516] text-[#C5A880] flex items-center justify-center font-serif text-base font-semibold rounded-[2px] shadow-sm group-hover:bg-[#8C7A6B] group-hover:text-white transition-colors duration-300 border border-white/10 flex-shrink-0">
              M
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-light tracking-[0.22em] text-[#141516] uppercase leading-none">
                MINER<span className="font-semibold text-[#8C7A6B]">ALB</span>
              </span>
              <span className="text-[8px] font-mono tracking-[0.3em] text-[#8C7A6B] uppercase mt-1 leading-none font-semibold">
                Natural Stone
              </span>
            </div>
          </Link>

                  <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6862]">
            <Link
              href="/"
              className="text-[#1A1A1A] hover:text-[#8C7A6B] transition flex items-center gap-1.5 border-b border-[#8C7A6B] pb-0.5"
            >
              <span>&larr;</span>
              <span>{t.nav.home}</span>
            </Link>
            <span className="text-black/15">|</span>
            <span className="text-[#1A1A1A] border-b border-[#8C7A6B] pb-0.5">
              {t.nav.about}
            </span>
            <Link href="/metodo" className="hover:text-[#1A1A1A] transition">
              {t.nav.method}
            </Link>
            <Link href="/materials/golden-breccia" className="hover:text-[#1A1A1A] transition">
              {t.nav.materials}
            </Link>
          </nav>


          <Link
            href="/request-a-quote"
            className="border border-[#141516] bg-[#141516] text-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-transparent hover:text-[#141516] transition flex items-center gap-1.5 shadow-sm"
          >
            <span>{t.nav.requestSupply}</span>
            <span className="text-xs">&#8599;</span>
          </Link>
        </div>
      </header>

      {/* CONTENUTO CHI SIAMO DINAMICO */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 sm:py-24 space-y-12">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.25em] block mb-3">
            {a.tag}
          </span>
          <h1 className="text-4xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight leading-tight mb-6">
            {a.title}
          </h1>
          <p className="text-base sm:text-lg text-[#6B6862] font-light leading-relaxed">
            {a.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-[#EAE7E1]">
          <div className="bg-white p-7 border border-[#EAE7E1] rounded-sm">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">{a.boxAboutTitle}</h3>
            <p className="text-xs text-[#6B6862] font-light leading-relaxed">
              {a.boxAboutDesc}
            </p>
          </div>

          <div className="bg-white p-7 border border-[#EAE7E1] rounded-sm">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-3">{a.boxMissionTitle}</h3>
            <p className="text-xs text-[#6B6862] font-light leading-relaxed">
              {a.boxMissionDesc}
            </p>
          </div>
        </div>

        <div className="bg-[#141516] text-white p-8 sm:p-10 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-light">{a.bannerTitle}</h3>
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
