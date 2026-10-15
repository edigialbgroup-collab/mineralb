import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { client } from "@/sanity/schemaTypes/client";
import LanguageSelector from "@/components/LanguageSelector";
import OpenRfqButton from "@/components/OpenRfqButton";
import { translations, Locale } from "@/lib/translations";

interface SiteSettings {
  heroImageUrl?: string;
  showcaseImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

async function getHomePageData(): Promise<{ settings: SiteSettings | null }> {
  const query = `{
    "settings": *[_type == "siteSettings"][0] {
      "heroImageUrl": heroImage.asset->url,
      "showcaseImageUrl": showcaseImage.asset->url,
      heroTitle,
      heroSubtitle
    }
  }`;

  try {
    const data = await client.fetch(query);
    return { settings: data?.settings || null };
  } catch (error) {
    console.error("Errore recupero dati Home Page:", error);
    return { settings: null };
  }
}

export default async function Home() {
  const { settings } = await getHomePageData();

  const cookieStore = await cookies();
  const currentLang = (cookieStore.get("mineralb_lang")?.value as Locale) || "it";
  const t = translations[currentLang] || translations.it;

  const heroImageSrc = settings?.heroImageUrl || "/hero-block.png";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] font-sans selection:bg-[#8C7A6B] selection:text-white flex flex-col justify-between">
      
      {/* TOP UTILITY BAR ISTITUZIONALE */}
      <div className="bg-[#141516] text-[#A3A09A] text-[10px] font-mono border-b border-white/10 py-2.5 px-6 relative z-50">
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

      {/* HEADER EDITORIALE (ORDINE: ABOUT US -> THE METHOD -> MATERIALS) */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#EAE7E1] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3 group" title="MinerAlb Home">
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

          <nav className="hidden md:flex space-x-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6862]">
            <Link href="/about" className="hover:text-[#1A1A1A] transition">{t.nav.about}</Link>
            <Link href="/metodo" className="hover:text-[#1A1A1A] transition">{t.nav.method}</Link>
            <Link href="/materials/golden-breccia" className="hover:text-[#1A1A1A] transition">{t.nav.materials}</Link>
          </nav>

          {/* PULSANTE CHE APRE IL POP-UP SENZA NAVIGAZIONE */}
          <OpenRfqButton className="border border-[#141516] bg-[#141516] text-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-transparent hover:text-[#141516] transition flex items-center gap-1.5 shadow-sm">
            <span>{t.nav.requestQuote}</span>
            <span className="text-xs">&#8599;</span>
          </OpenRfqButton>
        </div>
      </header>

      {/* 2. HERO IMMERSIVA */}
      <main className="relative min-h-[calc(100vh-105px)] flex items-center overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageSrc}
            alt="Golden Breccia Monolithic Stone"
            fill
            priority
            className="object-cover object-center lg:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/85 to-transparent lg:bg-gradient-to-r lg:from-[#FAF9F6] lg:via-[#FAF9F6]/75 lg:to-transparent lg:w-[62%]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center min-h-[65vh]">
            
            {/* Colonna Testo */}
            <div className="lg:col-span-6 space-y-8 max-w-xl">
              <span className="inline-block text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.25em]">
                {t.home.tag}
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#1A1A1A] leading-[1.12]">
                {t.home.titleStart} <br />
                <span className="italic font-serif text-[#8C7A6B]">{t.home.titleItalic}</span>
              </h1>
              
              <p className="text-base text-[#4A4A4A] font-light leading-relaxed">
                {t.home.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                {/* EXPLORE MATERIALS PORTA ALLA SCHEDA DIRETTA DEL MATERIALE */}
                <Link
                  href="/materials/golden-breccia"
                  className="bg-[#141516] text-white px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#8C7A6B] transition shadow-xl flex items-center justify-center gap-2"
                >
                  <span>{t.home.exploreBtn}</span>
                  <span className="text-xs">&#8599;</span>
                </Link>

                {/* SUBMIT PROJECT APRE IL POP-UP SUBITO */}
                <OpenRfqButton className="border border-[#141516]/40 bg-white/70 backdrop-blur-xs text-[#2B2D2F] px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] hover:border-[#8C7A6B] hover:text-[#8C7A6B] transition shadow-sm">
                  {t.home.rfqBtn}
                </OpenRfqButton>
              </div>
            </div>

            {/* Placca Fluttuante */}
            <div className="lg:col-span-6 flex justify-start lg:justify-end items-end self-end pt-12 lg:pt-0">
              <Link
                href="/materials/golden-breccia"
                className="group block bg-[#141516] border border-white/20 text-white px-7 py-6 rounded-sm shadow-2xl transition-all duration-300 hover:border-[#C5A880] hover:-translate-y-1 max-w-[300px] w-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse"></span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                    {t.home.cardBadge}
                  </span>
                </div>

                <div className="leading-tight">
                  <span className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#A3A09A] uppercase block mb-1">
                    {t.home.cardFamily}
                  </span>
                  <div className="text-3xl font-light tracking-tight text-white">
                    Golden <span className="font-serif italic font-normal text-[#E8DCC4] tracking-normal">Breccia</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C5A880] group-hover:text-white transition-colors">
                  <span>{t.home.cardCta}</span>
                  <span className="text-base group-hover:translate-x-1.5 transition-transform duration-300">&#8599;</span>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* 3. SEZIONE FINALE: HAI UN PROGETTO? */}
      <section className="py-20 bg-[#141516] text-white border-t border-[#2B2D2F]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-[0.25em] block mb-4">
            {t.home.ctaTag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
            {t.home.ctaTitle}
          </h2>
          <p className="text-sm md:text-base text-[#A3A09A] font-light max-w-xl mx-auto mb-10 leading-relaxed">
            {t.home.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* APRE IL POP-UP DIRETTAMENTE */}
            <OpenRfqButton className="w-full sm:w-auto bg-[#C5A880] text-[#141516] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#d8be9a] transition flex items-center justify-center gap-2 shadow-lg">
              <span>{t.home.ctaRfqBtn}</span>
              <span>&#8599;</span>
            </OpenRfqButton>

            <Link
              href="/materials/golden-breccia"
              className="w-full sm:w-auto border border-white/20 bg-transparent text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-white/10 transition"
            >
              {t.home.ctaTechBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-[#FAF9F6] border-t border-[#EAE7E1] py-8 text-center text-xs text-[#6B6862]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>{t.home.footerCopy}</p>
          <div className="flex space-x-6 text-[11px] font-medium">
            <Link href="/privacy" className="hover:text-[#1A1A1A]">{t.home.privacy}</Link>
            <Link href="/cookie-policy" className="hover:text-[#1A1A1A]">{t.home.cookie}</Link>
            <Link href="/about" className="hover:text-[#1A1A1A]">{t.nav.about}</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
