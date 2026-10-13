import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans selection:bg-[#8C7A6B] selection:text-white flex flex-col">
          {/* Header - Menu Pagine Secondarie (Testo Scuro su Sfondo Chiaro) */}
      <header className="border-b border-[#E2DFD8] bg-[#F7F5F0]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#2B2D2F]">
            MINERAL<span className="text-[#8C7A6B]">B</span>
          </Link>
          <nav className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#6B6862]">
            <Link href="/about" className="hover:text-[#2B2D2F] transition">Chi Siamo</Link>
            <Link href="/#process" className="hover:text-[#2B2D2F] transition">Il Metodo</Link>
            <Link href="/#materials" className="hover:text-[#2B2D2F] transition">Materiali</Link>
            <Link href="/request-a-quote" className="hover:text-[#2B2D2F] transition text-[#2B2D2F] border-b border-[#8C7A6B] pb-1">Richiedi Quotazione</Link>
          </nav>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-24">
        <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-widest block mb-4">Chi Siamo</span>
        <h1 className="text-4xl md:text-5xl font-light text-[#2B2D2F] mb-12">Il ponte diretto tra l'origine geologica e i grandi progetti.</h1>
        
        <div className="space-y-8 text-[#4A4A4A] leading-relaxed text-lg font-light">
          <p>
            MineralB nasce da un'esigenza specifica del mercato B2B della pietra naturale: superare l'opacità della filiera tradizionale e garantire agli acquirenti internazionali l'accesso diretto alle migliori cave, supportato da dati tecnici oggettivi.
          </p>
          <p>
            Non siamo un semplice marketplace o un intermediario commerciale. Siamo un partner tecnico che seleziona alla fonte, convalida il materiale secondo standard internazionali (ASTM/EN) e coordina la fornitura fino al cantiere o al magazzino del distributore.
          </p>
          
          <div className="py-8 border-t border-b border-[#E2DFD8] my-12">
            <h2 className="text-2xl font-medium text-[#2B2D2F] mb-4">La Nostra Missione</h2>
            <p className="text-base">
              Digitalizzare, semplificare e rendere trasparente il processo di approvvigionamento di pietre naturali. Assicuriamo che ogni blocco o lastra quotata corrisponda esattamente alle specifiche estetiche e meccaniche richieste dai capitolati dei vostri progetti.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2DFD8] bg-[#EAE7E1] py-8 text-center text-xs text-[#6B6862]">
        &copy; 2026 MineralB - Natural Stone & Mineral Sourcing Platform. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
