"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";

const rfqSchema = z.object({
  product: z.string().min(1, "Seleziona un materiale"),
  variant: z.string().optional(),
  quantity: z.string().min(1, "Specificare quantità"),
  unit: z.enum(["m²", "m³", "tonnes", "units"]),
  name: z.string().min(2, "Inserisci nome e cognome"),
  company: z.string().min(2, "Inserisci nome azienda"),
  email: z.string().email("Email non valida"),
  destinationCountry: z.string().min(2, "Paese di destinazione obbligatorio"),
  destinationCity: z.string().optional(),
  message: z.string().optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Consenso obbligatorio",
  }),
});

type RfqData = z.infer<typeof rfqSchema>;

export default function RfqModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"it" | "en">("it");
  const [selectedProduct, setSelectedProduct] = useState("Golden Breccia");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RfqData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      product: "Golden Breccia",
      unit: "m²",
      privacyConsent: false,
    },
  });

  // Ascolta l'evento di apertura senza alcun cambio pagina
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ variant?: string; product?: string }>;
      const product = customEvent.detail?.product || "Golden Breccia";
      const variant = customEvent.detail?.variant || "";

      setSelectedProduct(product);
      setSelectedVariant(variant);
      setValue("product", product);
      setValue("variant", variant);
      setStatus(null);
      setIsOpen(true);
    };

    const handleCookie = () => {
      const match = document.cookie.match(/mineralb_lang=(it|en)/);
      if (match) setLang(match[1] as "it" | "en");
    };
    handleCookie();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("open-rfq-modal", handleOpen);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-rfq-modal", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setValue]);

  // Blocca lo scroll del body quando il pop-up è visibile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const onSubmit = async (data: RfqData) => {
    setStatus(null);

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, v.toString());
    });

    if (file) formData.append("attachment", file);
    formData.append("cf-turnstile-response", turnstileToken || "bypass");

    try {
      const res = await fetch("/api/rfq", { method: "POST", body: formData });
      const result = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          text: lang === "en"
            ? `Request submitted successfully! Code: ${result.rfqId}`
            : `Richiesta registrata con successo! Codice: ${result.rfqId}`,
        });
        reset();
        setFile(null);
      } else {
        setStatus({ type: "error", text: result.error || "Errore durante l'invio" });
      }
    } catch {
      setStatus({ type: "error", text: "Errore di connessione" });
    }
  };

  if (!isOpen) return null;

  const isEn = lang === "en";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF9F6] border border-[#EAE7E1] rounded-sm shadow-2xl p-6 sm:p-8 my-auto text-[#2B2D2F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tasto Chiudi */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#141516]/5 hover:bg-[#141516] hover:text-white flex items-center justify-center text-sm font-mono transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Intestazione */}
        <div className="mb-6 border-b border-[#EAE7E1] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C7A6B]">
              MinerAlb • B2B Fast Quotation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-[#141516] tracking-tight">
            {isEn ? "Request Formal Quotation" : "Richiesta Quotazione Formale"}
          </h2>
          <p className="text-xs text-[#6B6862] font-light mt-1">
            {isEn
              ? "Quarry gate pricing, yield analysis, and lead time schedule."
              : "Prezzi diretti alla cava, stima delle rese per m² e pianificazione logistica."}
          </p>
        </div>

        {status && (
          <div
            className={`p-3.5 mb-5 text-xs font-mono rounded-sm border ${
              status.type === "success"
                ? "bg-green-50 text-green-900 border-green-200"
                : "bg-red-50 text-red-900 border-red-200"
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          {/* Materiale & Selezione */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                {isEn ? "Selected Material *" : "Materiale Selezionato *"}
              </label>
              <input
                type="text"
                readOnly
                {...register("product")}
                className="w-full border border-[#DCD8D0] bg-[#F0EDE6] p-2.5 rounded-sm text-[#141516] font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                {isEn ? "Quarry Selection" : "Selezione / Variante"}
              </label>
              <input
                type="text"
                placeholder={isEn ? "All selections / To discuss" : "Tutte le selezioni / Da concordare"}
                {...register("variant")}
                className="w-full border border-[#DCD8D0] bg-white p-2.5 rounded-sm text-[#141516]"
              />
            </div>
          </div>

          {/* Quantità & Destinazione */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                {isEn ? "Quantity & Formats *" : "Fabbisogno Stimato *"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={isEn ? "e.g. 500" : "Es. 500"}
                  {...register("quantity")}
                  className="w-full border border-[#DCD8D0] bg-white p-2.5 rounded-sm"
                />
                <select
                  {...register("unit")}
                  className="border border-[#DCD8D0] bg-white p-2.5 rounded-sm font-mono text-xs w-28"
                >
                  <option value="m²">m² (lastre)</option>
                  <option value="m³">m³ (blocchi)</option>
                  <option value="tonnes">Ton</option>
                  <option value="units">Cut-to-size</option>
                </select>
              </div>
              {errors.quantity && <p className="text-red-600 text-[10px] mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                {isEn ? "Country *" : "Paese Destinazione *"}
              </label>
              <input
                type="text"
                placeholder={isEn ? "e.g. Germany" : "Es. Germania / Italia"}
                {...register("destinationCountry")}
                className="w-full border border-[#DCD8D0] bg-white p-2.5 rounded-sm"
              />
              {errors.destinationCountry && <p className="text-red-600 text-[10px] mt-1">{errors.destinationCountry.message}</p>}
            </div>
          </div>

          {/* Dati Azienda */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                {isEn ? "Contact Name *" : "Nome & Cognome *"}
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full border border-[#DCD8D0] bg-white p-2.5 rounded-sm"
              />
              {errors.name && <p className="text-red-600 text-[10px] mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                {isEn ? "Company Name *" : "Nome Azienda *"}
              </label>
              <input
                type="text"
                {...register("company")}
                className="w-full border border-[#DCD8D0] bg-white p-2.5 rounded-sm"
              />
              {errors.company && <p className="text-red-600 text-[10px] mt-1">{errors.company.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
                {isEn ? "Work Email *" : "Email Aziendale *"}
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-[#DCD8D0] bg-white p-2.5 rounded-sm"
              />
              {errors.email && <p className="text-red-600 text-[10px] mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Note / Specifiche */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C7A6B] mb-1.5">
              {isEn ? "Project Specifications" : "Specifiche Tecniche / Finiture"}
            </label>
            <textarea
              rows={2}
              placeholder={isEn ? "Spessore lastre, finiture superficiali, vincoli di capitolato..." : "Spessori (2/3cm), lavorazioni, tempistiche di cantiere..."}
              {...register("message")}
              className="w-full border border-[#DCD8D0] bg-white p-2.5 rounded-sm"
            ></textarea>
          </div>

          {/* Caricamento File */}
          <div className="p-3 bg-white border border-dashed border-[#DCD8D0] rounded-sm flex items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase text-[#141516]">
                {isEn ? "Attach Architectural Drawings" : "Allega Disegni / Capitolato"}
              </span>
              <span className="text-[10px] text-[#8C7A6B]">PDF, DWG, DXF (Max 10MB)</span>
            </div>
            <input
              type="file"
              accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-[10px] text-[#6B6862] file:mr-2 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-mono file:bg-[#141516] file:text-white cursor-pointer"
            />
          </div>

          {/* Privacy */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="privacyModalCheck"
              {...register("privacyConsent")}
              className="mt-0.5 rounded border-[#DCD8D0] text-[#141516]"
            />
            <label htmlFor="privacyModalCheck" className="text-[11px] text-[#6B6862] leading-tight">
              {isEn
                ? "I agree to the processing of personal data for B2B quotation purposes."
                : "Acconsento al trattamento dei dati personali per la gestione della richiesta di quotazione."}
            </label>
          </div>
          {errors.privacyConsent && <p className="text-red-600 text-[10px]">{errors.privacyConsent.message}</p>}

          {/* Captcha */}
          <div className="flex justify-center py-1">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onSuccess={(token: string) => setTurnstileToken(token)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#141516] text-white py-3 rounded-sm text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#8C7A6B] transition shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? (isEn ? "Submitting..." : "Invio in corso...")
              : (isEn ? "Submit Official RFQ ↗" : "Invia Richiesta di Quotazione ↗")}
          </button>
        </form>
      </div>
    </div>
  );
}
