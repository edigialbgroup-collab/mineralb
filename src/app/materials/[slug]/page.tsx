import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/schemaTypes/client";
import RfqForm from "@/components/RfqForm";

// 1. Aggiorna l'interfaccia Typescript
interface VisualDetail {
  name: string;
  description?: string;
  imageUrl?: string;
}

interface MaterialDetail {
  _id: string;
  title: string;
  commercialName?: string;
  materialType?: string;
  origin?: string;
  shortDescription?: string;
  galleryUrls?: string[];
  applications?: string[];
  selections?: VisualDetail[]; // Novità
  finishes?: VisualDetail[]; // Novità
  formats?: VisualDetail[]; // Novità
  technicalSpecifications?: {
    isVerified?: boolean;
    bulkSpecificGravity?: number;
    waterAbsorption?: number;
    compressiveStrengthDry?: number;
    compressiveStrengthWet?: number;
    testingStandards?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}

// 2. Aggiorna la query GROQ per estrarre le nuove immagini
async function getMaterialBySlug(slug: string): Promise<MaterialDetail | null> {
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
    },
    seoTitle,
    seoDescription
  }`;

  try {
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Errore nel recupero del materiale:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const material = await getMaterialBySlug(resolvedParams.slug);

  if (!material) return { title: "Materiale non trovato | MineralB" };

  return {
    title: material.seoTitle || `${material.title} | Specifiche Tecniche | MineralB`,
    description: material.seoDescription || material.shortDescription,
  };
}

export default async function MaterialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const material = await getMaterialBySlug(resolvedParams.slug);

  if (!material) notFound();

  const allMaterials = [{ title: material.title }];
  const validApplications = material.applications?.filter((app) => Boolean(app) && app.trim() !== "") || [];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans selection:bg-[#8C7A6B] selection:text-white">
      {/* Header Unificato */}
      <header className="border-b border-[#E2DFD8] bg-[#F7F5F0]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#2B2D2F]">
            MINERAL<span className="text-[#8C7A6B]">B</span>
          </Link>
          <nav className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#6B6862]">
            <Link href="/" className="hover:text-[#2B2D2F] transition">Home</Link>
            <a href="#details" className="hover:text-[#2B2D2F] transition">Dettagli</a>
            <a href="#specifications" className="hover:text-[#2B2D2F] transition">Dati Tecnici</a>
            <a href="#rfq" className="text-[#2B2D2F] border-b border-[#8C7A6B] pb-1">Richiedi Quotazione</a>
          </nav>
        </div>
      </header>

      {/* Main Material Hero */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Main Visual Gallery */}
          <div className="h-[500px] bg-[#D3CEC5] rounded-lg overflow-hidden relative border border-[#E2DFD8] shadow-sm">
            {material.galleryUrls && material.galleryUrls[0] ? (
              <Image src={material.galleryUrls[0]} alt={material.title} fill priority className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#8C7A6B] uppercase tracking-wider font-semibold">
                Visual In Aggiornamento
              </div>
            )}
          </div>

          {/* Details & Commercial Specs */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.15em]">
                {material.materialType || "Pietra Naturale"} • {material.origin || "Origine Verificata"}
              </p>
              <h1 className="text-4xl md:text-5xl font-light text-[#2B2D2F] mt-2 mb-4">{material.title}</h1>
              {material.commercialName && (
                <p className="text-sm text-[#6B6862] italic border-l-2 border-[#C5A880] pl-3">Nome Comm: {material.commercialName}</p>
              )}
            </div>

            <p className="text-base text-[#4A4A4A] leading-relaxed font-light">
              {material.shortDescription || "Informazioni e campionature di questo materiale sono disponibili su richiesta diretta."}
            </p>

            {validApplications.length > 0 && (
              <div className="pt-6 border-t border-[#E2DFD8]">
                <h3 className="text-[10px] font-bold uppercase text-[#8C7A6B] mb-3 tracking-widest">Applicazioni Suggerite</h3>
                <div className="flex flex-wrap gap-2">
                  {validApplications.map((app, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-[#E2DFD8] text-[#4A4A4A] text-xs rounded-full">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6">
              <a href="#rfq" className="inline-block bg-[#2B2D2F] text-white px-8 py-3 rounded text-sm font-medium hover:bg-[#1A1A1A] transition shadow-md">
                Richiedi Quotazione
              </a>
            </div>
          </div>
        </div>

        {/* NUOVA SEZIONE: APPROFONDIMENTI VISIVI (Categorie, Lavorazioni, Formati) */}
        <div id="details" className="space-y-24 mt-16 pt-16 border-t border-[#E2DFD8]">
          
          {/* Selezioni / Categorie */}
          {material.selections && material.selections.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-light text-[#2B2D2F] mb-2">Selezioni Disponibili</h2>
              <p className="text-[#6B6862] text-sm mb-8">Varianti cromatiche e strutturali estratte dalla cava.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {material.selections.map((sel, idx) => (
                  <div key={idx} className="bg-white rounded-lg overflow-hidden border border-[#E2DFD8] shadow-sm">
                    <div className="h-48 bg-[#EAE7E1] relative">
                      {sel.imageUrl && <Image src={sel.imageUrl} alt={sel.name} fill className="object-cover" />}
                    </div>
                    <div className="p-5">
                      <h4 className="text-sm font-semibold text-[#2B2D2F]">{sel.name}</h4>
                      {sel.description && <p className="text-xs text-[#6B6862] mt-2">{sel.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Finiture */}
          {material.finishes && material.finishes.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-light text-[#2B2D2F] mb-2">Lavorazioni e Finiture</h2>
              <p className="text-[#6B6862] text-sm mb-8">Finiture superficiali ideali per esaltare le caratteristiche della pietra.</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {material.finishes.map((fin, idx) => (
                  <div key={idx} className="bg-white rounded-lg overflow-hidden border border-[#E2DFD8] shadow-sm group">
                    <div className="h-32 bg-[#EAE7E1] relative">
                      {fin.imageUrl && <Image src={fin.imageUrl} alt={fin.name} fill className="object-cover group-hover:scale-105 transition duration-500" />}
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2B2D2F]">{fin.name}</h4>
                      {fin.description && <p className="text-[11px] text-[#8C7A6B] mt-1">{fin.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formati */}
          {material.formats && material.formats.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-light text-[#2B2D2F] mb-2">Formati di Fornitura</h2>
              <p className="text-[#6B6862] text-sm mb-8">Soluzioni B2B per distributori e cantieri.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {material.formats.map((fmt, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg border border-[#E2DFD8] shadow-sm flex items-center space-x-4">
                    {fmt.imageUrl && (
                      <div className="w-20 h-20 bg-[#EAE7E1] relative rounded-md overflow-hidden flex-shrink-0">
                        <Image src={fmt.imageUrl} alt={fmt.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-[#2B2D2F]">{fmt.name}</h4>
                      {fmt.description && <p className="text-xs text-[#6B6862] mt-1 line-clamp-2">{fmt.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Technical Specifications (Se presenti) */}
        {material.technicalSpecifications?.isVerified && (
          <section id="specifications" className="mt-24 pt-16 border-t border-[#E2DFD8]">
            <h2 className="text-2xl md:text-3xl font-light text-[#2B2D2F] mb-2">Specifiche Tecniche Certificate</h2>
            <p className="text-sm text-[#6B6862] mb-8">
              Certificazioni ufficiali condotte secondo standard {material.technicalSpecifications.testingStandards || "ASTM/EN"}.
            </p>

            <div className="bg-white p-8 rounded-lg border border-[#E2DFD8] shadow-sm grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
              {material.technicalSpecifications.bulkSpecificGravity && (
                <div>
                  <span className="block text-[10px] text-[#8C7A6B] uppercase font-bold tracking-widest">Peso Specifico</span>
                  <span className="text-[#2B2D2F] text-xl font-light mt-1 block">{material.technicalSpecifications.bulkSpecificGravity} g/cm³</span>
                </div>
              )}
              {material.technicalSpecifications.waterAbsorption && (
                <div>
                  <span className="block text-[10px] text-[#8C7A6B] uppercase font-bold tracking-widest">Assorbimento</span>
                  <span className="text-[#2B2D2F] text-xl font-light mt-1 block">{material.technicalSpecifications.waterAbsorption} %</span>
                </div>
              )}
              {material.technicalSpecifications.compressiveStrengthDry && (
                <div>
                  <span className="block text-[10px] text-[#8C7A6B] uppercase font-bold tracking-widest">Compressione (Dry)</span>
                  <span className="text-[#2B2D2F] text-xl font-light mt-1 block">{material.technicalSpecifications.compressiveStrengthDry} MPa</span>
                </div>
              )}
              {material.technicalSpecifications.compressiveStrengthWet && (
                <div>
                  <span className="block text-[10px] text-[#8C7A6B] uppercase font-bold tracking-widest">Compressione (Wet)</span>
                  <span className="text-[#2B2D2F] text-xl font-light mt-1 block">{material.technicalSpecifications.compressiveStrengthWet} MPa</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Embedded RFQ Form */}
      <div className="bg-white border-t border-[#E2DFD8] mt-12">
        <RfqForm materials={allMaterials} selectedProduct={material.title} />
      </div>

      <footer className="border-t border-[#E2DFD8] bg-[#EAE7E1] py-8 text-center text-xs text-[#6B6862]">
        &copy; 2026 MineralB B2B Platform.
      </footer>
    </div>
  );
}
