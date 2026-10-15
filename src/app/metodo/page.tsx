import Link from "next/link";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import OpenRfqButton from "@/components/OpenRfqButton";
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] font-sans selection:bg-[#8C7A6B] selection:text-white flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      
      {/* TESTATA RESPONSIVE UNIFICATA (CON LOGO COMPATTO, LINGUA E MENU HAMBURGER) */}
      <Navbar t={t} />

      {/* 1. HERO DELLA PAGINA */}
      <section className="pt-16 pb-14 md:pt-28 md:pb-20 px-5 sm:px-6 max-w-7xl mx-auto border-b border-[#EAE7E1] w-full">
        <div className="max-w-4xl space-y-4 sm:space-y-6">
          <span className="inline-block text-[9px] sm:text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.25em]">
            {m.heroTag}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#1A1A1A] tracking-tight leading-[1.15]">
            {m.heroTitleStart} <br />
            <span className="font-serif italic text-[#8C7A6B]">{m.heroTitleItalic}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#6B6862] font-light leading-relaxed max-w-2xl">
            {m.heroDesc}
          </p>
        </div>
      </section>

      {/* 2. I 5 PASSAGGI DEL METODO + POST-VENDITA */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-5 sm:px-6 border-b border-[#EAE7E1] w-full">
        <div className="mb-10 sm:mb-14">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-1.5 sm:mb-2">
            {m.protocolTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#1A1A1A]">{m.protocolTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {m.steps.map((step, idx) => {
            const isDark = idx === 5;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-8 border rounded-sm shadow-xs flex flex-col justify-between transition-colors ${
                  isDark
                    ? "bg-[#141516] text-white border-[#2B2D2F]"
                    : "bg-white text-[#2B2D2F] border-[#EAE7E1] hover:border-[#8C7A6B]"
                }`}
              >
                <div>
                  <span
                    className={`text-xs font-mono font-bold block mb-2 sm:mb-3 ${
                      isDark ? "text-[#C5A880]" : "text-[#8C7A6B]"
                    }`}
                  >
                    {step.num}
                  </span>
                  <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs font-light leading-relaxed ${isDark ? "text-[#A3A09A]" : "text-[#6B6862]"}`}>
                    {step.desc}
                  </p>
                </div>
                <div
                  className={`mt-5 sm:mt-6 pt-3 sm:pt-4 border-t text-[9px] sm:text-[10px] font-mono uppercase ${
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

      {/* 3. CONFRONTO: FILIERA TRADIZIONALE VS IL METODO MINERALB (SCROLL TOUCH PROTETTO) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-5 sm:px-6 border-b border-[#EAE7E1] w-full">
        <div className="mb-8 sm:mb-14">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-1.5 sm:mb-2">
            {m.diffTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#1A1A1A]">{m.diffTitle}</h2>
          <span className="text-[10px] font-mono text-[#8C7A6B] block mt-1 sm:hidden">
            &larr; Scorri la tabella in orizzontale &rarr;
          </span>
        </div>

        <div className="overflow-x-auto w-full border border-[#EAE7E1] bg-white rounded-sm">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-[#F7F5F0] border-b border-[#EAE7E1] font-mono text-[#1A1A1A] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 sm:p-5 w-1/4">{m.tableHeaderPhase}</th>
                <th className="p-3.5 sm:p-5 w-3/8 text-[#6B6862]">{m.tableHeaderTrad}</th>
                <th className="p-3.5 sm:p-5 w-3/8 text-[#141516] bg-[#FAF9F6] border-l border-[#EAE7E1] font-bold">
                  {m.tableHeaderMineral}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7E1] font-light text-[#4A4A4A]">
              {m.tableRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3.5 sm:p-5 font-semibold text-[#1A1A1A] font-mono">{row.phase}</td>
                  <td className="p-3.5 sm:p-5">{row.trad}</td>
                  <td className="p-3.5 sm:p-5 bg-[#FAF9F6] border-l border-[#EAE7E1] font-medium text-[#1A1A1A]">
                    {row.mineral}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. PERCORSI DEDICATI PER PROFILO B2B */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-5 sm:px-6 border-b border-[#EAE7E1] w-full">
        <div className="mb-10 sm:mb-14">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#8C7A6B] uppercase tracking-[0.2em] block mb-1.5 sm:mb-2">
            {m.targetsTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#1A1A1A]">{m.targetsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {m.targets.map((item, idx) => (
            <div
              key={idx}
              className={`border-t-2 pt-5 sm:pt-6 space-y-2.5 sm:space-y-3 ${
                idx === 0
                  ? "border-[#141516]"
                  : idx === 1
                  ? "border-[#8C7A6B]"
                  : "border-[#D3CEC5]"
              }`}
            >
              <span className="text-xs font-mono font-bold text-[#8C7A6B] block">{item.profile}</span>
              <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">{item.title}</h3>
              <p className="text-xs text-[#6B6862] font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA FINALE (CON POP-UP ATTRAVERSO OPENRFQBUTTON) */}
      <section className="py-16 sm:py-20 bg-[#141516] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 sm:space-y-6">
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-[0.25em] block">
            {m.ctaTag}
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight">
            {m.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#A3A09A] font-light max-w-xl mx-auto leading-relaxed">
            {m.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4">
            <OpenRfqButton className="w-full sm:w-auto bg-[#C5A880] text-[#141516] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#d8be9a] transition flex items-center justify-center gap-2 shadow-lg">
              <span>{m.ctaRfqBtn}</span>
              <span>&#8599;</span>
            </OpenRfqButton>
            <Link
              href="/materials/golden-breccia"
              className="w-full sm:w-auto border border-white/20 bg-transparent text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-white/10 transition text-center"
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
