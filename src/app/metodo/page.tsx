import Link from "next/link";
import { Metadata } from "next";
import { cookies } from "next/headers";
import LanguageSelector from "@/components/LanguageSelector";
import { translations, Locale } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Il Metodo MinerAlb | Sourcing Diretto e Garanzia di Filiera B2B",
  description:
    "Dalla selezione fisica delle bancate in cava fino allo sdoganamento in cantiere: il processo integrato di MinerAlb per marmisti, grossisti e progettisti internazionali.",
};

export default async function MetodoPage() {
  const cookieStore = await cookies();
  const currentLang = (cookieStore.get("mineralb_lang")?.value as Locale) || "it";
  const t = translations[currentLang] || translations.it;
  const m = t.methodPage;

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

      {/* HEADER UNIFICATO CON LOGO E MENU DISTANZIATO */}
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
            <Link href="/about" className="hover:text-[#1A1A1A] transition">
              {t.nav.about}
            </Link>
            <span className="text-[#1A1A1A] border-b border-[#8C7A6B] pb-0.5">
              {t.nav.method}
            </span>
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

      {/* 1. HERO DELLA PAGINA */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 px-6 max-w-7xl mx-auto border-b border-[#EAE7E1]">
        <div className="max-w-4xl space-y-6">
          <span className="inline-block text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.25em]">
            {m.heroTag}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1A1A] tracking-tight leading-[1.15]">
            {m.heroTitleStart} <br />
            <span className="font-serif italic text-[#8C7A6B]">{m.heroTitleItalic}</span>
          </h1>
          <p className="text-base sm:text-lg text-[#6B6862] font-light leading-relaxed max-w-2xl">
            {m.heroDesc}
          </p>
        </div>
      </section>

      {/* 2. I 5 PASSAGGI DEL METODO + POST-VENDITA */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-[#EAE7E1]">
        <div className="mb-14">
          <span className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-2">
            {m.protocolTag}
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A]">{m.protocolTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {m.steps.map((step, idx) => {
            const isDark = idx === 5;
            return (
              <div
                key={idx}
                className={`p-8 border rounded-sm shadow-xs flex flex-col justify-between transition-colors ${
                  isDark
                    ? "bg-[#141516] text-white border-[#2B2D2F]"
                    : "bg-white text-[#2B2D2F] border-[#EAE7E1] hover:border-[#8C7A6B]"
                }`}
              >
                <div>
                  <span
                    className={`text-xs font-mono font-bold block mb-3 ${
                      isDark ? "text-[#C5A880]" : "text-[#8C7A6B]"
                    }`}
                  >
                    {step.num}
                  </span>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs font-light leading-relaxed ${isDark ? "text-[#A3A09A]" : "text-[#6B6862]"}`}>
                    {step.desc}
                  </p>
                </div>
                <div
                  className={`mt-6 pt-4 border-t text-[10px] font-mono uppercase ${
                    isDark ? "border-white/10 text-[#C5A880]" : "border-[#F2EFE9] text-[#8C7A6B]"
                  }`}
                >
                  {step.guarantee}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CONFRONTO: FILIERA TRADIZIONALE VS IL METODO MINERALB */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-[#EAE7E1]">
        <div className="mb-14">
          <span className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-2">
            {m.diffTag}
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A]">{m.diffTitle}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#EAE7E1] bg-white">
            <thead className="bg-[#F7F5F0] border-b border-[#EAE7E1] font-mono text-[#1A1A1A] uppercase tracking-wider">
              <tr>
                <th className="p-4 sm:p-5 w-1/4">{m.tableHeaderPhase}</th>
                <th className="p-4 sm:p-5 w-3/8 text-[#6B6862]">{m.tableHeaderTrad}</th>
                <th className="p-4 sm:p-5 w-3/8 text-[#141516] bg-[#FAF9F6] border-l border-[#EAE7E1] font-bold">
                  {m.tableHeaderMineral}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7E1] font-light text-[#4A4A4A]">
              {m.tableRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-4 sm:p-5 font-semibold text-[#1A1A1A] font-mono">{row.phase}</td>
                  <td className="p-4 sm:p-5">{row.trad}</td>
                  <td className="p-4 sm:p-5 bg-[#FAF9F6] border-l border-[#EAE7E1] font-medium text-[#1A1A1A]">
                    {row.mineral}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. PERCORSI DEDICATI PER PROFILO B2B */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-[#EAE7E1]">
        <div className="mb-14">
          <span className="text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-2">
            {m.targetsTag}
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A]">{m.targetsTitle}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {m.targets.map((item, idx) => (
            <div
              key={idx}
              className={`border-t-2 pt-6 space-y-3 ${
                idx === 0
                  ? "border-[#141516]"
                  : idx === 1
                  ? "border-[#8C7A6B]"
                  : "border-[#D3CEC5]"
              }`}
            >
              <span className="text-xs font-mono font-bold text-[#8C7A6B] block">{item.profile}</span>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">{item.title}</h3>
              <p className="text-xs text-[#6B6862] font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA FINALE */}
      <section className="py-20 bg-[#141516] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-[0.25em] block">
            {m.ctaTag}
          </span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight">
            {m.ctaTitle}
          </h2>
          <p className="text-sm md:text-base text-[#A3A09A] font-light max-w-xl mx-auto leading-relaxed">
            {m.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/request-a-quote"
              className="w-full sm:w-auto bg-[#C5A880] text-[#141516] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#d8be9a] transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{m.ctaRfqBtn}</span>
              <span>&#8599;</span>
            </Link>
            <Link
              href="/materials/golden-breccia"
              className="w-full sm:w-auto border border-white/20 bg-transparent text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white/10 transition"
            >
              {m.ctaMatBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#EAE7E1] bg-white py-8 text-center text-xs text-[#6B6862]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 MinerAlb — B2B Natural Stone Sourcing & Quarry Supply.</p>
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
