import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { client } from "@/sanity/schemaTypes/client";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] font-sans selection:bg-[#8C7A6B] selection:text-white flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      
      {/* TESTATA RESPONSIVE UNIFICATA */}
      <Navbar t={t} />

      {/* 2. HERO EDITORIALE IMMERSIVA: LA FOTO FA DA AMBIENTAZIONE A TUTTO SCHERMO */}
      <main className="relative flex-grow min-h-[calc(100vh-100px)] flex flex-col justify-between overflow-hidden">
        
        {/* FOTO DI SFONDO CONTINUA (ZERO BOX SEPARATI O RITAGLIATI) */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageSrc}
            alt="Golden Breccia Monolithic Stone"
            fill
            priority
            className="object-cover object-[70%_center] lg:object-right"
          />
          {/* Sfumatura calibrata: densa in alto per i testi, trasparente in basso per valorizzare il blocco di pietra */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6]/75 to-transparent lg:bg-gradient-to-r lg:from-[#FAF9F6] lg:via-[#FAF9F6]/80 lg:to-transparent lg:w-[60%]" />
        </div>

        {/* CONTENUTO IN PRIMO PIANO */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 w-full py-10 sm:py-16 md:py-20 relative z-10 flex flex-col justify-between flex-grow">
          
          {/* BLOCCO TESTO E PULSANTI SUPERIORI */}
          <div className="max-w-xl space-y-4 sm:space-y-6">
            <span className="inline-block text-[9px] sm:text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.25em]">
              {t.home.tag}
            </span>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#1A1A1A] leading-[1.12]">
              {t.home.titleStart} <br />
              <span className="italic font-serif text-[#8C7A6B]">{t.home.titleItalic}</span>
            </h1>
            
            <p className="text-xs sm:text-base text-[#4A4A4A] font-light leading-relaxed">
              {t.home.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/materials/golden-breccia"
                className="bg-[#141516] text-white px-6 sm:px-8 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#8C7A6B] transition shadow-md flex items-center justify-center gap-2"
              >
                <span>{t.home.exploreBtn}</span>
                <span className="text-xs">&#8599;</span>
              </Link>

              <OpenRfqButton className="border border-[#141516]/30 bg-white/80 backdrop-blur-xs text-[#2B2D2F] px-6 sm:px-8 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] hover:border-[#8C7A6B] hover:text-[#8C7A6B] transition shadow-xs">
                {t.home.rfqBtn}
              </OpenRfqButton>
            </div>
          </div>

          {/* PLACCA NERA ANCORATA IN BASSO SUL BLOCCO DI PIETRA */}
          <div className="pt-16 sm:pt-20 flex justify-start lg:justify-end">
            <Link
              href="/materials/golden-breccia"
              className="group block bg-[#141516]/95 backdrop-blur-md border border-white/20 text-white p-4 sm:p-6 rounded-sm shadow-2xl transition-all duration-300 hover:border-[#C5A880] hover:-translate-y-1 max-w-[280px] sm:max-w-xs w-full"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse"></span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                  {t.home.cardBadge}
                </span>
              </div>

              <div className="leading-tight">
                <span className="text-[9px] font-mono font-medium tracking-[0.18em] text-[#A3A09A] uppercase block mb-0.5">
                  {t.home.cardFamily}
                </span>
                <div className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                  Golden <span className="font-serif italic font-normal text-[#E8DCC4] tracking-normal">Breccia</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C5A880] group-hover:text-white transition-colors">
                <span>{t.home.cardCta}</span>
                <span className="text-sm">&#8599;</span>
              </div>
            </Link>
          </div>

        </div>
      </main>

      {/* 3. SEZIONE FINALE */}
      <section className="py-16 sm:py-20 bg-[#141516] text-white border-t border-[#2B2D2F]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 sm:space-y-6">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-[0.25em] block">
            {t.home.ctaTag}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight">
            {t.home.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A09A] font-light max-w-xl mx-auto leading-relaxed">
            {t.home.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <OpenRfqButton className="w-full sm:w-auto bg-[#C5A880] text-[#141516] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#d8be9a] transition flex items-center justify-center gap-2 shadow-lg">
              <span>{t.home.ctaRfqBtn}</span>
              <span>&#8599;</span>
            </OpenRfqButton>

            <Link
              href="/materials/golden-breccia"
              className="w-full sm:w-auto border border-white/20 bg-transparent text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-white/10 transition text-center"
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
