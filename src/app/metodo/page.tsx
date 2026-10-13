import Link from "next/link";
import Image from "next/image";

export default function SourcingPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-[#E2DFD8] bg-[#F7F5F0]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#2B2D2F]">
            MINERAL<span className="text-[#8C7A6B]">B</span>
          </Link>
          <nav className="flex space-x-8 text-sm font-medium text-[#4A4A4A]">
            <Link href="/" className="hover:text-[#1A1A1A]">← Torna alla Home</Link>
          </nav>
        </div>
      </header>

      {/* Hero della Pagina */}
      <section className="relative pt-24 pb-16 px-6 bg-[#141516] text-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#C5A880] text-xs font-mono font-bold tracking-widest block mb-4">01. IL METODO</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Selezione alla Cava</h1>
          <p className="text-lg text-[#E2DFD8] font-light max-w-2xl mx-auto">
            Identificazione diretta dei blocchi e delle bancate di materiale con resa estetica e strutturale superiore.
          </p>
        </div>
      </section>

      {/* Contenuto Testuale */}
      <main className="flex-grow max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg text-[#4A4A4A] font-light leading-relaxed">
          <p className="mb-6">
            Nel settore delle pietre naturali, la qualità del progetto finale si decide nel momento esatto in cui il blocco viene staccato dalla montagna. Per questo motivo, MineralB non delega la selezione a terzi.
          </p>
          <h2 className="text-2xl font-medium text-[#2B2D2F] mt-10 mb-4">Presenza sul campo</h2>
          <p className="mb-6">
            I nostri ispettori visitano fisicamente le cave balcaniche per mappare le bancate estrattive. Valutiamo l'omogeneità del colore, la presenza di venature, la direzione di taglio e l'assenza di micro-fratture direttamente sul blocco grezzo.
          </p>
          <h2 className="text-2xl font-medium text-[#2B2D2F] mt-10 mb-4">Solo Prima Scelta</h2>
          <p className="mb-6">
            Scartiamo a priori il materiale commerciale generico. Selezioniamo esclusivamente blocchi che garantiscono le grandi dimensioni e la stabilità visiva necessarie per rivestimenti di facciata di pregio e interior design di lusso.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E2DFD8] text-center">
          <Link href="/request-a-quote" className="inline-block bg-[#2B2D2F] text-white px-8 py-3 rounded text-sm font-medium hover:bg-[#1A1A1A] transition">
            Richiedi Quotazione per il tuo Progetto
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2DFD8] bg-[#EAE7E1] py-8 text-center text-xs text-[#6B6862]">
        &copy; 2026 MineralB B2B Platform.
      </footer>
    </div>
  );
}
