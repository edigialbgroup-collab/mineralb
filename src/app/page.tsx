"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [product, setProduct] = useState("Calcare Premium / Limestone");
  const [unit, setUnit] = useState("m²");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setStatusMessage({
          type: "success",
          text: `Richiesta inviata con successo! Codice riferimento: ${result.rfqId}`,
        });
        form.reset();
        setProduct("Calcare Premium / Limestone");
        setUnit("m²");
        setFile(null);
      } else {
        setStatusMessage({ type: "error", text: result.error || "Si è verificato un errore." });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Errore di connessione. Riprova più tardi." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="border-b border-[#E2DFD8] bg-[#F7F5F0]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight text-[#2B2D2F]">
            MINERAL<span className="text-[#8C7A6B]">B</span>
          </div>
          <nav className="flex space-x-8 text-sm font-medium text-[#4A4A4A]">
            <Link href="#materials" className="hover:text-[#1A1A1A]">Materiali</Link>
            <Link href="#about" className="hover:text-[#1A1A1A]">Chi Siamo</Link>
            <Link href="#rfq" className="hover:text-[#1A1A1A]">Richiedi Quotazione</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-[#2B2D2F] max-w-4xl mx-auto leading-tight">
          Pietre Naturali, Direttamente dalla Fonte.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[#6B6862] max-w-2xl mx-auto">
          Connettiamo cave verificate con acquirenti internazionali e distributori in tutta Europa.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#rfq"
            className="bg-[#2B2D2F] text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-[#3D3F42] transition"
          >
            Richiedi Quotazione (RFQ)
          </a>
          <a
            href="#materials"
            className="border border-[#2B2D2F] text-[#2B2D2F] px-8 py-3 rounded-md text-sm font-medium hover:bg-[#EAE7E1] transition"
          >
            Esplora Catalogo
          </a>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="bg-[#EAE7E1] py-20 border-t border-b border-[#DCD8D0]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-light text-[#2B2D2F] mb-2">Catalogo Selezionato</h2>
          <p className="text-[#6B6862] text-sm mb-10">Materiali naturali verificati di alta qualità</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F7F5F0] p-6 rounded-lg border border-[#DCD8D0] shadow-sm">
              <div className="h-48 bg-[#D3CEC5] rounded-md mb-4 flex items-center justify-center text-[#6B6862]">
                [Foto Materiale 1]
              </div>
              <h3 className="text-xl font-medium text-[#2B2D2F]">Calcare Premium / Limestone</h3>
              <p className="text-sm text-[#8C7A6B] mt-1">Origine: Cava Verificata</p>
              <p className="text-sm text-[#6B6862] mt-3">
                Materiale lapideo ideale per grandi rivestimenti, edilizia commerciale e pavimentazioni esterne.
              </p>
              <a
                href="#rfq"
                onClick={() => setProduct("Calcare Premium / Limestone")}
                className="inline-block mt-4 text-sm font-semibold text-[#2B2D2F] underline"
              >
                Richiedi quotazione per questo materiale &rarr;
              </a>
            </div>

            <div className="bg-[#F7F5F0] p-6 rounded-lg border border-[#DCD8D0] shadow-sm">
              <div className="h-48 bg-[#C8C2B7] rounded-md mb-4 flex items-center justify-center text-[#6B6862]">
                [Foto Materiale 2]
              </div>
              <h3 className="text-xl font-medium text-[#2B2D2F]">Pietra Naturale Strutturata</h3>
              <p className="text-sm text-[#8C7A6B] mt-1">Origine: Cava Verificata</p>
              <p className="text-sm text-[#6B6862] mt-3">
                Lavorazione ad alta precisione per progetti architettonici e forniture industriali B2B.
              </p>
              <a
                href="#rfq"
                onClick={() => setProduct("Pietra Naturale Strutturata")}
                className="inline-block mt-4 text-sm font-semibold text-[#2B2D2F] underline"
              >
                Richiedi quotazione per questo materiale &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RFQ Form Section */}
      <section id="rfq" className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-[#2B2D2F]">Richiesta di Quotazione B2B (RFQ)</h2>
          <p className="text-sm text-[#6B6862] mt-2">
            Compila il modulo per ricevere un'offerta commerciale personalizzata per il tuo progetto.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 mb-6 rounded-md text-sm ${
              statusMessage.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border border-[#E2DFD8] shadow-sm space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Materiale *</label>
              <select
                name="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
                required
              >
                <option value="Calcare Premium / Limestone">Calcare Premium / Limestone</option>
                <option value="Pietra Naturale Strutturata">Pietra Naturale Strutturata</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Quantità *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  placeholder="Es. 500"
                  className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
                  required
                />
                <select
                  name="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
                >
                  <option value="m²">m²</option>
                  <option value="m³">m³</option>
                  <option value="tonnes">ton</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Nome Completo *</label>
              <input
                type="text"
                name="name"
                placeholder="Nome e Cognome"
                className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Azienda *</label>
              <input
                type="text"
                name="company"
                placeholder="Nome Azienda"
                className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Email Aziendale *</label>
              <input
                type="email"
                name="email"
                placeholder="nome@azienda.com"
                className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Paese / Città di Destinazione *</label>
            <input
              type="text"
              name="destinationCountry"
              placeholder="Es. Germania (Monaco) / Italia (Milano)"
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Note / Specifiche Progetto</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Finitura superficiale, spessore dei blocchi/lastre, tempi di consegna..."
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
            ></textarea>
          </div>

          {/* Allegato File CAD / Scheda Tecnica */}
          <div className="p-4 bg-[#F7F5F0] rounded-md border border-dashed border-[#DCD8D0]">
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">
              Allegato Tecnico / Disegno CAD (Opzionale)
            </label>
            <input
              type="file"
              name="attachment"
              accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.webp,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-xs text-[#6B6862] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2B2D2F] file:text-white hover:file:bg-[#3D3F42] cursor-pointer"
            />
            <p className="text-[11px] text-[#8C7A6B] mt-2">
              Supportati: PDF, DWG, DXF, PNG, JPG (max 10MB). Documenti protetti e riservati.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2B2D2F] text-white py-3 rounded-md text-sm font-medium hover:bg-[#3D3F42] transition disabled:opacity-50"
          >
            {loading ? "Invio in corso..." : "Invia Richiesta Quotazione"}
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2DFD8] bg-[#EAE7E1] py-8 text-center text-xs text-[#6B6862]">
        &copy; 2026 MineralB - Natural Stone & Mineral Sourcing Platform. Tutti i diritti riservati.
      </footer>
    </div>
  );
}