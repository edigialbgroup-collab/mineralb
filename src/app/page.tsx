import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/schemaTypes/client";
import RfqForm from "@/components/RfqForm";

interface Material {
  _id: string;
  title: string;
  slug?: { current: string };
  origin?: string;
  shortDescription?: string;
  galleryUrls?: string[];
}

interface ProcessStep {
  stepNumber?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string; // Nuovo campo
}

interface SiteSettings {
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  processSteps?: ProcessStep[];
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    stepNumber: "01. SOURCING",
    title: "Selezione alla Cava",
    description: "Identificazione diretta dei blocchi e delle bancate di materiale con resa estetica e strutturale superiore.",
  },
  {
    stepNumber: "02. VERIFICA",
    title: "Test di Laboratorio",
    description: "Analisi meccaniche e fisiche certificate ASTM/EN su densità, assorbimento e resistenza alla compressione.",
  },
  {
    stepNumber: "03. QUOTAZIONE",
    title: "Offerta Dedicata",
    description: "Elaborazione di quotazioni B2B trasparenti calibrate su quantità, specifiche di taglio e destinazione.",
  },
  {
    stepNumber: "04. FORNITURA",
    title: "Logistica e Spedizione",
    description: "Coordinamento delle spedizioni internazionali per blocchi grezzi, lastre o progetti cut-to-size.",
  },
];

async function getHomePageData(): Promise<{ materials: Material[]; settings: SiteSettings | null }> {
  const query = `{
    "materials": *[_type == "material"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      origin,
      shortDescription,
      "galleryUrls": gallery[].asset->url
    },
    "settings": *[_type == "siteSettings"][0] {
      "heroImageUrl": heroImage.asset->url,
      heroTitle,
      heroSubtitle,
      processSteps[] {
        stepNumber,
        title,
        description,
        "imageUrl": image.asset->url,
        linkUrl
      }
    }
  }`;

  try {
    const data = await client.fetch(query);
    return {
      materials: data?.materials || [],
      settings: data?.settings || null,
    };
  } catch (error) {
    console.error("Errore recupero dati Home Page:", error);
    return { materials: [], settings: null };
  }
}

export default async function Home() {
  const { materials, settings } = await getHomePageData();

  const heroImageSrc = settings?.heroImageUrl;
  const heroTitle = settings?.heroTitle || "Pietre Naturali,\nDirettamente dalla Fonte.";
  const heroSubtitle = settings?.heroSubtitle || "Connettiamo cave verificate con acquirenti B2B e distributori internazionali. Trasparenza tecnica, certificazioni e supporto alla fornitura.";

  const processSteps = DEFAULT_STEPS.map((defaultStep, idx) => {
    const sanityStep = settings?.processSteps?.[idx];
    return {
      stepNumber: sanityStep?.stepNumber || defaultStep.stepNumber,
      title: sanityStep?.title || defaultStep.title,
      description: sanityStep?.description || defaultStep.description,
      imageUrl: sanityStep?.imageUrl,
      linkUrl: sanityStep?.linkUrl, // Recupero Link
    };
  });

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans selection:bg-[#8C7A6B] selection:text-white">
         {/* Header - Menu Aggiornato Home Page (Testo Chiaro su Sfondo Scuro) */}
      <header className="fixed w-full border-b border-white/10 bg-[#141516]/90 backdrop-blur-md z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            MINERAL<span className="text-[#C5A880]">B</span>
          </Link>
          <nav className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#A3A09A]">
            <Link href="/about" className="hover:text-white transition">Chi Siamo</Link>
            <Link href="/#process" className="hover:text-white transition">Il Metodo</Link>
            <Link href="/#materials" className="hover:text-white transition">Materiali</Link>
            <Link href="/request-a-quote" className="hover:text-white transition text-white border-b border-[#C5A880] pb-1">Richiedi Quotazione</Link>
          </nav>
        </div>
      </header>


      {/* Hero Section */}
      <section className="relative pt-36 pb-28 md:pt-48 md:pb-36 px-6 bg-[#141516] text-white overflow-hidden min-h-[85vh] flex items-center justify-center">
        {heroImageSrc ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImageSrc}
              alt="Pietra naturale MineralB"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#111213] to-[#1C1E20]"></div>
        )}

        <div className="max-w-4xl mx-auto text-center relative z-10 drop-shadow-sm">
          <span className="inline-block px-3.5 py-1 bg-black/50 border border-[#C5A880]/50 rounded-full text-[11px] font-semibold text-[#C5A880] uppercase tracking-[0.2em] mb-6 backdrop-blur">
            B2B Natural Stone Sourcing
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.15] mb-6 whitespace-pre-line">
            {heroTitle}
          </h1>
          
          <p className="text-base md:text-xl text-[#E2DFD8] max-w-2xl mx-auto font-light leading-relaxed mb-10">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="#materials"
              className="w-full sm:w-auto bg-[#C5A880] text-[#141516] px-8 py-3.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#d6ba93] transition shadow-lg"
            >
              Esplora Catalogo
            </a>
            <Link
              href="/request-a-quote" // ANCHE QUI AGGIORNATO
              className="w-full sm:w-auto border border-white/40 bg-black/30 text-white px-8 py-3.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition backdrop-blur"
            >
              Richiedi Quotazione
            </Link>
          </div>
        </div>
      </section>

      {/* Il Metodo - Ora Dinamicamente Cliccabile */}
      <section id="process" className="py-20 bg-white border-b border-[#E2DFD8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-light text-[#2B2D2F]">Trasparenza dalla Cava al Cantiere</h2>
            <p className="text-[#6B6862] text-xs uppercase tracking-wider mt-2">
              Il nostro processo di selezione e fornitura B2B
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => {
              // Contenuto interno della card
              const CardContent = (
                <div className={`h-full bg-[#F7F5F0] rounded-lg border overflow-hidden flex flex-col justify-between transition-all duration-300 ${step.linkUrl ? 'border-[#E2DFD8] hover:border-[#8C7A6B] hover:shadow-lg group' : 'border-[#E2DFD8] hover:shadow-md'}`}>
                  <div>
                    <div className="h-44 bg-[#D3CEC5] relative overflow-hidden">
                      {step.imageUrl ? (
                        <Image
                          src={step.imageUrl}
                          alt={step.title || `Fase ${idx + 1}`}
                          fill
                          className={`object-cover transition duration-700 ${step.linkUrl ? 'group-hover:scale-105' : 'hover:scale-105'}`}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[11px] text-[#8C7A6B] uppercase font-semibold bg-[#EAE7E1] px-4 text-center">
                          Carica foto su Sanity Studio
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-mono font-bold text-[#8C7A6B] block mb-1">
                        {step.stepNumber}
                      </span>
                      <h3 className={`text-sm font-semibold mb-2 transition-colors ${step.linkUrl ? 'text-[#2B2D2F] group-hover:text-[#8C7A6B]' : 'text-[#2B2D2F]'}`}>
                        {step.title} {step.linkUrl && <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>}
                      </h3>
                      <p className="text-xs text-[#6B6862] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );

              // Se c'è un link in Sanity, avvolgi la card in un tag <Link>
              return step.linkUrl ? (
                <Link href={step.linkUrl} key={idx} className="block h-full">
                  {CardContent}
                </Link>
              ) : (
                <div key={idx} className="block h-full">
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalogo Materiali */}
      {/* ... IL RESTO DELLA PAGINA RIMANE UGUALE ... */}
      <section id="materials" className="py-20 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-[#2B2D2F]">Catalogo Selezionato</h2>
              <p className="text-[#6B6862] text-xs mt-1">Materiali naturali verificati e certificati</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {materials.map((mat) => (
              <div key={mat._id} className="bg-white rounded-lg border border-[#E2DFD8] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="h-64 bg-[#D3CEC5] relative overflow-hidden">
                    {mat.galleryUrls && mat.galleryUrls[0] ? (
                      <Image
                        src={mat.galleryUrls[0]}
                        alt={mat.title}
                        fill
                        className="object-cover hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#8C7A6B] uppercase font-semibold">
                        Campione Visivo In Arrivo
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest block mb-1">
                      Origine: {mat.origin || "Balkans"}
                    </span>
                    <h3 className="text-2xl font-light text-[#2B2D2F] mb-3">{mat.title}</h3>
                    <p className="text-xs text-[#6B6862] leading-relaxed">
                      {mat.shortDescription || "Informazioni e specifiche tecniche disponibili su richiesta."}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#F7F5F0] flex justify-between items-center">
                  {mat.slug?.current ? (
                    <Link
                      href={`/materials/${mat.slug.current}`}
                      className="text-xs font-semibold text-[#2B2D2F] hover:text-[#8C7A6B] uppercase tracking-wider transition"
                    >
                      Scheda Tecnica &rarr;
                    </Link>
                  ) : (
                    <Link href="/request-a-quote" className="text-xs font-semibold text-[#2B2D2F] uppercase">
                      Richiedi RFQ &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form RFQ Section */}
      <div className="bg-white border-t border-[#E2DFD8]">
        <RfqForm materials={materials} />
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E2DFD8] bg-[#EAE7E1] py-8 text-center text-xs text-[#6B6862]">
        &copy; 2026 MineralB - Natural Stone & Mineral Sourcing Platform. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
