import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { client } from "@/sanity/schemaTypes/client";
import MaterialGallery from "@/components/MaterialGallery";
import LanguageSelector from "@/components/LanguageSelector";
import OpenRfqButton from "@/components/OpenRfqButton";
import { translations, Locale } from "@/lib/translations";

interface VisualItem {
  name: string;
  description?: string;
  imageUrl?: string;
}

interface MaterialData {
  _id: string;
  title: string;
  commercialName?: string;
  materialType?: string;
  origin?: string;
  shortDescription?: string;
  galleryUrls?: string[];
  applications?: string[];
  selections?: VisualItem[];
  finishes?: VisualItem[];
  formats?: VisualItem[];
  technicalSpecifications?: {
    isVerified?: boolean;
    bulkSpecificGravity?: number;
    waterAbsorption?: number;
    compressiveStrengthDry?: number;
    compressiveStrengthWet?: number;
    testingStandards?: string;
  };
}

async function getMaterial(slug: string): Promise<MaterialData | null> {
  const query = `*[_type == "material" && slug.current == $slug][0] {
    _id,
    title,
    commercialName,
    materialType,
    origin,
    shortDescription,
    applications,
    "galleryUrls": gallery[].asset->url,
    selections[]{ name, description, "imageUrl": image.asset->url },
    finishes[]{ name, description, "imageUrl": image.asset->url },
    formats[]{ name, description, "imageUrl": image.asset->url },
    technicalSpecifications {
      isVerified,
      bulkSpecificGravity,
      waterAbsorption,
      compressiveStrengthDry,
      compressiveStrengthWet,
      testingStandards
    }
  }`;

  try {
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Errore fetch materiale:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  return {
    title: `${resolved.slug.replace("-", " ").toUpperCase()} | Catalogo Tecnico B2B | MinerAlb`,
    description: "Specifiche tecniche verificate, varianti estratte, finiture e quotazioni B2B.",
  };
}

export default async function MaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const material = await getMaterial(resolved.slug);

  if (!material) notFound();

  const cookieStore = await cookies();
  const currentLang = (cookieStore.get("mineralb_lang")?.value as Locale) || "it";
  const t = translations[currentLang] || translations.it;

  const rawVariants = material.selections && material.selections.length > 0 ? material.selections : [];
  const rawFinishes = material.finishes && material.finishes.length > 0 ? material.finishes : [];
  const rawFormats = material.formats && material.formats.length > 0 ? material.formats : [];

  const galleryImages = (material.galleryUrls && material.galleryUrls.length > 0)
    ? material.galleryUrls.map((url, i) => ({ url, caption: `Project Reference 0${i + 1}` }))
    : [];

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

      {/* HEADER DI NAVIGAZIONE CON LOGO E MODAL TRIGGER */}
      <header className="sticky top-0 left-0 w-full z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE7E1] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3 group" title="Torna alla Home MinerAlb">
            <div className="w-8 h-8 bg-[#141516] text-[#C5A880] flex items-center justify-center font-serif text-base font-semibold rounded-[2px] shadow-sm group-hover:bg-[#8C7A6B] group-hover:text-white transition-colors duration-300 border border-white/10 flex-shrink-0">
              M
            </div>
            <div className="flex flex-col">
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
            <a href="#overview" className="hover:text-[#1A1A1A] transition">{t.nav.overview}</a>
            <a href="#variants" className="hover:text-[#1A1A1A] transition">{t.nav.variants}</a>
            <a href="#finishes" className="hover:text-[#1A1A1A] transition">{t.nav.finishes}</a>
          </nav>

          <OpenRfqButton
            product={material.title}
            className="border border-[#141516] bg-[#141516] text-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-[#8C7A6B] transition flex items-center gap-1.5 shadow-sm"
          >
            <span>{t.nav.requestSupply}</span>
            <span className="text-xs">&#8599;</span>
          </OpenRfqButton>
        </div>
      </header>

      {/* 01. SCHERMATA MONOGRAFICA */}
      <section
        id="overview"
        className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-10 px-6 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center flex-grow">
          
          <div className="lg:col-span-6 w-full">
            <MaterialGallery images={galleryImages} materialTitle={material.title} />
          </div>

          <div className="lg:col-span-6 w-full space-y-6">
            
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.25em] block mb-2">
                {t.hero.tag}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1A1A] tracking-tight leading-tight">
                Golden <span className="font-serif italic text-[#8C7A6B] font-normal">Breccia</span>
              </h1>
              <p className="text-[11px] font-mono text-[#6B6862] uppercase tracking-[0.18em] mt-2">
                {t.hero.origin}
              </p>
            </div>

            {/* METRICHE DI LABORATORIO AGGIORNATE CON DATI REALI */}
            <div className="border-y border-[#EAE7E1] py-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C7A6B]">
                  {t.hero.specsTag}
                </span>
                <a
                  href="mailto:info@mineralb.com?subject=Technical%20Dossier%20Request%20-%20Golden%20Breccia"
                  className="text-[10px] font-mono text-[#1A1A1A] hover:text-[#8C7A6B] uppercase tracking-wider transition underline"
                >
                  {t.hero.dossierLink}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <span className="text-[9px] font-mono text-[#6B6862] uppercase block tracking-wider">{t.hero.compression}</span>
                  <div className="text-2xl font-light text-[#1A1A1A] mt-0.5">
                    {t.hero.compressionValue} <span className="text-xs font-mono text-[#8C7A6B]">MPa</span>
                  </div>
                  <span className="text-[9px] text-[#A3A09A] font-mono block mt-0.5">{t.hero.compressionRating}</span>
                </div>

                <div className="border-l border-[#EAE7E1] pl-6">
                  <span className="text-[9px] font-mono text-[#6B6862] uppercase block tracking-wider">{t.hero.absorption}</span>
                  <div className="text-2xl font-light text-[#1A1A1A] mt-0.5">
                    {t.hero.absorptionValue} <span className="text-xs font-mono text-[#8C7A6B]">%</span>
                  </div>
                  <span className="text-[9px] text-[#A3A09A] font-mono block mt-0.5">{t.hero.absorptionRating}</span>
                </div>

                <div className="border-l border-[#EAE7E1] pl-6">
                  <span className="text-[9px] font-mono text-[#6B6862] uppercase block tracking-wider">{t.hero.behavior}</span>
                  <div className="text-2xl font-light text-[#1A1A1A] mt-0.5 font-serif italic text-[#8C7A6B]">
                    {t.hero.frostResistant}
                  </div>
                  <span className="text-[9px] text-[#A3A09A] font-mono block mt-0.5">{t.hero.outdoor}</span>
                </div>
              </div>
            </div>

            {/* FORMATI DI FORNITURA CON ICONE */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C7A6B]">
                  {t.hero.formatsTag}
                </span>
                <span className="text-[9px] font-mono text-[#A3A09A] uppercase tracking-wider">
                  {t.hero.verified}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* 01. BLOCCHI */}
                <OpenRfqButton
                  product={material.title}
                  variant="Blocchi Grezzi da Cava"
                  className="bg-white border border-[#EAE7E1] rounded-sm p-3 flex flex-col justify-between hover:border-[#8C7A6B] transition-all group shadow-sm text-left w-full"
                >
                  <div className="w-full h-16 bg-[#F7F5F0] rounded-sm mb-2.5 relative overflow-hidden flex items-center justify-center border border-[#EAE7E1]/60">
                    {rawFormats[0]?.imageUrl ? (
                      <Image src={rawFormats[0].imageUrl} alt="Blocks" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-[#8C7A6B] group-hover:scale-110 transition-transform duration-300">
                        <path d="M16 4L27 10.3V21.7L16 28L5 21.7V10.3L16 4Z" fill="#FAF9F6" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M16 4V28" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M27 10.3L16 16.5L5 10.3" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M10 13L21 6.8" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2" opacity="0.6" />
                        <path d="M10 19.5L21 13.3" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2" opacity="0.6" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8C7A6B] block uppercase tracking-wider font-semibold">{t.hero.blockTitle}</span>
                    <span className="text-xs font-medium text-[#1A1A1A] block mt-0.5">{t.hero.blockSub}</span>
                    <span className="text-[10px] text-[#6B6862] font-light block mt-0.5 leading-snug">{t.hero.blockDesc}</span>
                  </div>
                </OpenRfqButton>

                {/* 02. LASTRE */}
                <OpenRfqButton
                  product={material.title}
                  variant="Lastre Selezionate"
                  className="bg-white border border-[#EAE7E1] rounded-sm p-3 flex flex-col justify-between hover:border-[#8C7A6B] transition-all group shadow-sm text-left w-full"
                >
                  <div className="w-full h-16 bg-[#F7F5F0] rounded-sm mb-2.5 relative overflow-hidden flex items-center justify-center border border-[#EAE7E1]/60">
                    {rawFormats[1]?.imageUrl ? (
                      <Image src={rawFormats[1].imageUrl} alt="Slabs" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-[#8C7A6B] group-hover:scale-110 transition-transform duration-300">
                        <path d="M4 27H28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M7 25L12 6H19L14 25H7Z" fill="#FAF9F6" stroke="#D3CEC5" strokeWidth="1.2" />
                        <path d="M10 25L15 6H22L17 25H10Z" fill="#F4EFEA" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
                        <path d="M13 25L18 6H25L20 25H13Z" fill="#FAF9F6" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M25 6L26.5 7.5V23.5L20 25" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8C7A6B] block uppercase tracking-wider font-semibold">{t.hero.slabTitle}</span>
                    <span className="text-xs font-medium text-[#1A1A1A] block mt-0.5">{t.hero.slabSub}</span>
                    <span className="text-[10px] text-[#6B6862] font-light block mt-0.5 leading-snug">{t.hero.slabDesc}</span>
                  </div>
                </OpenRfqButton>

                {/* 03. CUT-TO-SIZE */}
                <OpenRfqButton
                  product={material.title}
                  variant="Cut-to-Size & Progetti"
                  className="bg-white border border-[#EAE7E1] rounded-sm p-3 flex flex-col justify-between hover:border-[#8C7A6B] transition-all group shadow-sm text-left w-full"
                >
                  <div className="w-full h-16 bg-[#F7F5F0] rounded-sm mb-2.5 relative overflow-hidden flex items-center justify-center border border-[#EAE7E1]/60">
                    {rawFormats[2]?.imageUrl ? (
                      <Image src={rawFormats[2].imageUrl} alt="Cut-to-Size" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-[#8C7A6B] group-hover:scale-110 transition-transform duration-300">
                        <rect x="5" y="5" width="10" height="10" rx="0.5" fill="#FAF9F6" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="17" y="5" width="10" height="10" rx="0.5" fill="#F4EFEA" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="5" y="17" width="10" height="10" rx="0.5" fill="#F4EFEA" stroke="currentColor" strokeWidth="1.2" />
                        <rect x="17" y="17" width="10" height="10" rx="0.5" fill="#FAF9F6" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M3 16H29" stroke="#C5A880" strokeDasharray="1.5 2" strokeWidth="1" />
                        <path d="M16 3V29" stroke="#C5A880" strokeDasharray="1.5 2" strokeWidth="1" />
                        <circle cx="16" cy="16" r="1.5" fill="#8C7A6B" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#8C7A6B] block uppercase tracking-wider font-semibold">{t.hero.cutTitle}</span>
                    <span className="text-xs font-medium text-[#1A1A1A] block mt-0.5">{t.hero.cutSub}</span>
                    <span className="text-[10px] text-[#6B6862] font-light block mt-0.5 leading-snug">{t.hero.cutDesc}</span>
                  </div>
                </OpenRfqButton>
              </div>
            </div>

            {/* TESTO DESCRITTIVO */}
            <p className="text-xs sm:text-sm text-[#4A4A4A] font-light leading-relaxed">
              {t.hero.description}
            </p>

            {/* DESTINAZIONI D'USO */}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C7A6B] block mb-1.5">
                {t.hero.destinationsTag}
              </span>
              <p className="text-xs text-[#2B2D2F] font-light leading-relaxed">
                {t.hero.destinationsList}
              </p>
            </div>

            {/* PULSANTI DI AZIONE */}
            <div className="pt-1 flex flex-wrap gap-4">
              <a
                href="#variants"
                className="bg-[#141516] text-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8C7A6B] transition shadow-sm"
              >
                {t.hero.exploreBtn}
              </a>
              <a
                href="#finishes"
                className="border border-[#D3CEC5] bg-transparent text-[#2B2D2F] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] hover:border-[#8C7A6B] hover:text-[#8C7A6B] transition"
              >
                {t.hero.finishesBtn}
              </a>
            </div>

          </div>

        </div>

        {/* INDICATORE DI SCORRIMENTO */}
        <div className="w-full pt-8 flex flex-col items-center justify-center">
          <a
            href="#variants"
            className="group flex flex-col items-center gap-1.5 text-[10px] font-mono text-[#8C7A6B] uppercase tracking-[0.25em] hover:text-[#1A1A1A] transition"
          >
            <span>{t.hero.scrollHint}</span>
            <span className="text-sm group-hover:translate-y-1 transition-transform">&darr;</span>
          </a>
        </div>
      </section>

      {/* 02. DISCOVER THE VARIANTS (BADGE AZIENDALI MINERALB • PREMIUM / CLASSIC / NATURAL / MEGA) */}
      <section id="variants" className="py-24 max-w-7xl mx-auto px-6 border-t border-[#EAE7E1]">
        <div className="max-w-2xl mb-14">
          <span className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-2">
            {t.variantsSection.tag}
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A]">{t.variantsSection.title}</h2>
          <p className="text-xs text-[#6B6862] mt-2 font-light leading-relaxed">
            {t.variantsSection.desc}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {t.variantsItems.map((variantTranslated, i) => {
            const sanityImage = rawVariants[i]?.imageUrl;

            return (
              <div
                key={i}
                className="bg-white border border-[#EAE7E1] rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#8C7A6B] transition shadow-sm h-full"
              >
                <div className="flex flex-col flex-grow">
                  <div className="relative w-full aspect-square bg-[#EAE7E1] overflow-hidden">
                    {sanityImage ? (
                      <Image
                        src={sanityImage}
                        alt={variantTranslated.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-mono text-[#8C7A6B] p-4 text-center">
                        Photo {i + 1}
                      </div>
                    )}
                    {/* BADGE ELEGANTE MINERALB • NOME */}
                    <span className="absolute top-3 left-3 bg-[#141516]/90 backdrop-blur-md text-[#E8DCC4] text-[9px] font-mono px-2.5 py-1 tracking-[0.2em] uppercase border border-white/10 z-10 rounded-[1px] shadow-sm">
                      {variantTranslated.badge}
                    </span>
                  </div>

                  <div className="p-5 flex-grow">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">{variantTranslated.name}</h3>
                    <p className="text-xs text-[#6B6862] font-light leading-relaxed">{variantTranslated.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto">
                  <OpenRfqButton
                    product={material.title}
                    variant={variantTranslated.name}
                    className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-wider group-hover:text-[#1A1A1A] transition flex items-center pt-3 border-t border-[#F2EFE9] w-full text-left"
                  >
                    <span>{t.variantsSection.quoteBtn}</span>
                  </OpenRfqButton>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 03. FINISHES & APPLICATIONS (RIVISTE CON DATI ANALITICI E FATTIBILITÀ) */}
      <section id="finishes" className="py-24 max-w-7xl mx-auto px-6 border-t border-[#EAE7E1]">
        <div className="max-w-3xl mb-14">
          <span className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-2">
            {t.finishesSection.tag}
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A]">{t.finishesSection.title}</h2>
          <p className="text-xs text-[#6B6862] mt-2 font-light leading-relaxed">
            {t.finishesSection.desc}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {t.finishesItems.map((finishTranslated, i) => {
            const sanityImage = rawFinishes[i]?.imageUrl;

            return (
              <div
                key={i}
                className="bg-white border border-[#EAE7E1] rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#8C7A6B] transition shadow-sm h-full"
              >
                <div className="flex flex-col flex-grow">
                  <div className="relative w-full aspect-[16/10] bg-[#EAE7E1] overflow-hidden">
                    {sanityImage ? (
                      <Image
                        src={sanityImage}
                        alt={finishTranslated.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-mono text-[#8C7A6B] uppercase p-4 text-center">
                        {currentLang === "en" ? "Finish Sample Coming Soon" : "Foto Finitura in Arrivo"}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-grow space-y-2">
                    <span className="inline-block text-[9px] font-mono font-semibold uppercase tracking-wider text-[#8C7A6B] bg-[#FAF9F6] border border-[#EAE7E1] px-2 py-0.5 rounded-[1px]">
                      {finishTranslated.feasibility}
                    </span>
                    <h3 className="text-sm font-semibold text-[#1A1A1A]">{finishTranslated.name}</h3>
                    <p className="text-xs text-[#6B6862] font-light leading-relaxed pt-1">
                      {finishTranslated.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#EAE7E1] bg-white py-10 text-center text-xs text-[#6B6862]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 MinerAlb — Natural Stone Sourcing & Quarry Supply. Materiale e dati soggetti a verifica per lotto.</p>
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
