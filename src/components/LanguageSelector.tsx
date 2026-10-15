"use client";

import { useState, useEffect } from "react";

export default function LanguageSelector() {
  const [lang, setLang] = useState<"it" | "en">("it");

  useEffect(() => {
    const saved = localStorage.getItem("mineralb_lang") as "it" | "en" | null;
    if (saved) setLang(saved);
  }, []);

  const changeLanguage = (newLang: "it" | "en") => {
    setLang(newLang);
    localStorage.setItem("mineralb_lang", newLang);
    document.cookie = `mineralb_lang=${newLang}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#A3A09A]">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
          lang === "en"
            ? "bg-[#C5A880] text-[#141516] font-bold"
            : "hover:text-white"
        }`}
      >
        EN
      </button>
      <span className="text-white/20">/</span>
      <button
        onClick={() => changeLanguage("it")}
        className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
          lang === "it"
            ? "bg-[#C5A880] text-[#141516] font-bold"
            : "hover:text-white"
        }`}
      >
        IT
      </button>
    </div>
  );
}
