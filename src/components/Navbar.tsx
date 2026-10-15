"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import OpenRfqButton from "@/components/OpenRfqButton";

interface NavbarProps {
  t: {
    topBar: { quarry: string; b2b: string; location: string };
    nav: { home: string; about: string; method: string; materials: string; requestQuote: string };
  };
}

export default function Navbar({ t }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* TOP UTILITY BAR: COMPATTA SU MOBILE */}
      <div className="bg-[#141516] text-[#A3A09A] text-[9px] sm:text-[10px] font-mono border-b border-white/10 py-2 px-4 sm:px-6 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] flex-shrink-0"></span>
            <span className="text-[#E2DFD8] tracking-wider uppercase font-semibold truncate">
              {t.topBar.quarry}
            </span>
          </div>
          <div className="flex items-center gap-3 text-white flex-shrink-0">
            <span className="text-[#C5A880] font-semibold tracking-wider hidden sm:inline">
              {t.topBar.location}
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* HEADER PRINCIPALE: SEMPRE PRESENTE CON MENU HAMBURGER SU SMARTPHONE */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE7E1] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          
          {/* Logo aziendale compatto */}
          <Link href="/" className="flex items-center gap-2.5 group" title="MinerAlb Home">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#141516] text-[#C5A880] flex items-center justify-center font-serif text-sm sm:text-base font-semibold rounded-[2px] shadow-sm border border-white/10 flex-shrink-0">
              M
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-light tracking-[0.2em] sm:tracking-[0.22em] text-[#141516] uppercase leading-none">
                MINER<span className="font-semibold text-[#8C7A6B]">ALB</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono tracking-[0.25em] text-[#8C7A6B] uppercase mt-1 leading-none font-semibold">
                Natural Stone
              </span>
            </div>
          </Link>

          {/* Navigazione Desktop: About Us -> The Method -> Materials */}
          <nav className="hidden md:flex space-x-8 lg:space-x-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6862]">
            <Link href="/about" className="hover:text-[#1A1A1A] transition">{t.nav.about}</Link>
            <Link href="/metodo" className="hover:text-[#1A1A1A] transition">{t.nav.method}</Link>
            <Link href="/materials/golden-breccia" className="hover:text-[#1A1A1A] transition">{t.nav.materials}</Link>
          </nav>

          {/* Azioni Destra: Tasto RFQ compatto + Tasto Menu Hamburger sempre visibile */}
          <div className="flex items-center gap-2">
            <OpenRfqButton className="border border-[#141516] bg-[#141516] text-white px-3 sm:px-5 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-[#8C7A6B] transition flex items-center gap-1 shadow-sm">
              <span className="hidden sm:inline">{t.nav.requestQuote}</span>
              <span className="sm:hidden">RFQ</span>
              <span className="text-xs">&#8599;</span>
            </OpenRfqButton>

            {/* PULSANTE HAMBURGER MOBILE */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-[#141516] border border-[#EAE7E1] rounded-sm bg-white cursor-pointer shadow-xs active:bg-[#F7F5F0]"
              aria-label="Menu"
            >
              {menuOpen ? (
                <span className="text-base font-mono leading-none">✕</span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MENU A TENDINA COMPLETO SU SMARTPHONE */}
        {menuOpen && (
          <div className="md:hidden bg-[#FAF9F6] border-b border-[#EAE7E1] px-6 py-5 space-y-3 shadow-xl">
            <div className="flex flex-col space-y-2 font-semibold uppercase tracking-widest text-xs text-[#2B2D2F]">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 border-b border-[#EAE7E1] flex justify-between items-center"
              >
                <span>{t.nav.home}</span>
                <span className="text-[#8C7A6B]">&rarr;</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 border-b border-[#EAE7E1] flex justify-between items-center"
              >
                <span>{t.nav.about}</span>
                <span className="text-[#8C7A6B]">&rarr;</span>
              </Link>
              <Link
                href="/metodo"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 border-b border-[#EAE7E1] flex justify-between items-center"
              >
                <span>{t.nav.method}</span>
                <span className="text-[#8C7A6B]">&rarr;</span>
              </Link>
              <Link
                href="/materials/golden-breccia"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 border-b border-[#EAE7E1] flex justify-between items-center"
              >
                <span>{t.nav.materials}</span>
                <span className="text-[#8C7A6B]">&rarr;</span>
              </Link>
            </div>
            
            <div className="pt-2">
              <OpenRfqButton className="w-full bg-[#141516] text-white py-3 text-xs font-semibold uppercase tracking-[0.16em] text-center shadow-md">
                {t.nav.requestQuote} &#8599;
              </OpenRfqButton>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
