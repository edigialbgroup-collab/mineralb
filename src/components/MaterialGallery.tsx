"use client";

import { useState } from "react";
import Image from "next/image";

interface MaterialGalleryProps {
  images: { url: string; caption?: string }[];
  materialTitle: string;
}

export default function MaterialGallery({ images, materialTitle }: MaterialGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    { url: "/hero-block.png", caption: "Volume Monolitico • Isola massello a 45°" },
    { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80", caption: "Top Cucina & Schienale continuo" },
    { url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80", caption: "Rivestimento Bagno Wellness" },
    { url: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1600&q=80", caption: "Facciata Architettonica Ventilata" },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-[#EAE7E1] rounded-sm overflow-hidden shadow-2xl border border-[#EAE7E1] group">
      <Image
        src={displayImages[currentIndex].url}
        alt={`${materialTitle} - Immagine ${currentIndex + 1}`}
        fill
        priority
        className="object-cover object-center transition-transform duration-700 ease-out"
      />

      {/* Velatura leggera al passaggio del mouse */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Frecce di Scorrimento Laterali */}
      <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none z-10">
        <button
          onClick={prevSlide}
          aria-label="Precedente"
          className="pointer-events-auto w-9 h-9 rounded-full bg-[#141516]/75 hover:bg-[#141516] text-white flex items-center justify-center backdrop-blur transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 shadow-lg"
        >
          <span className="text-sm">&larr;</span>
        </button>
        <button
          onClick={nextSlide}
          aria-label="Successivo"
          className="pointer-events-auto w-9 h-9 rounded-full bg-[#141516]/75 hover:bg-[#141516] text-white flex items-center justify-center backdrop-blur transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 shadow-lg"
        >
          <span className="text-sm">&rarr;</span>
        </button>
      </div>

      {/* Indicatori Geometrici Circolari Ispirati a Fimar Stone */}
      <div className="absolute bottom-4 right-5 flex items-center gap-2 z-10 bg-[#141516]/65 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {displayImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Foto ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? "w-2.5 h-2.5 bg-white scale-110"
                : "w-2 h-2 border border-white/70 bg-transparent hover:border-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
