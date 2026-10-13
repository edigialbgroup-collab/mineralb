import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans flex flex-col">
      <header className="border-b border-[#E2DFD8] bg-[#F7F5F0]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#2B2D2F]">
            MINERAL<span className="text-[#8C7A6B]">B</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-[#4A4A4A] hover:text-[#1A1A1A]">← Home</Link>
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-light text-[#2B2D2F] mb-8">Privacy Policy</h1>
        <div className="prose prose-sm md:prose-base text-[#4A4A4A]">
          <p className="mb-4">Ultimo aggiornamento: Ottobre 2026</p>
          <h2 className="text-xl font-medium text-[#2B2D2F] mt-8 mb-4">1. Titolare del Trattamento</h2>
          <p className="mb-4">MineralB tratta i dati personali raccolti tramite il sito in conformità al Regolamento (UE) 2016/679 (GDPR).</p>
          
          <h2 className="text-xl font-medium text-[#2B2D2F] mt-8 mb-4">2. Dati Raccolti e Finalità</h2>
          <p className="mb-4">Raccogliamo i dati inseriti nel modulo RFQ (Nome, Email, Azienda, Nazione) al solo scopo di elaborare e fornire la quotazione commerciale richiesta, e gestire la comunicazione B2B in merito ai nostri materiali.</p>

          <h2 className="text-xl font-medium text-[#2B2D2F] mt-8 mb-4">3. Condivisione dei Dati</h2>
          <p className="mb-4">I dati vengono elaborati tramite sistemi sicuri di terze parti (inclusi HubSpot CRM per la gestione dei lead e Supabase per l'archiviazione sicura dei database e dei documenti allegati).</p>

          <h2 className="text-xl font-medium text-[#2B2D2F] mt-8 mb-4">4. Diritti dell'Utente</h2>
          <p className="mb-4">Hai il diritto di richiedere l'accesso, la rettifica o la cancellazione dei tuoi dati in qualsiasi momento contattandoci all'indirizzo email designato.</p>
        </div>
      </main>

      <footer className="border-t border-[#E2DFD8] bg-[#EAE7E1] py-8 text-center text-xs text-[#6B6862]">
        &copy; 2026 MineralB.
      </footer>
    </div>
  );
}
