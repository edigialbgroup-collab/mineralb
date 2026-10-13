"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.dwg",
  "application/x-dwg",
  "application/dxf",
  "application/x-dxf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const rfqSchema = z.object({
  product: z.string().min(1, "Seleziona un materiale"),
  quantity: z.string().min(1, "La quantità è obbligatoria"),
  unit: z.enum(["m²", "m³", "tonnes", "units"]),
  name: z.string().min(2, "Inserisci il nome e cognome"),
  company: z.string().min(2, "Inserisci il nome dell'azienda"),
  email: z.string().email("Inserisci un'email aziendale valida"),
  destinationCountry: z.string().min(2, "Inserisci il paese di destinazione"),
  destinationCity: z.string().optional(),
  phone: z.string().optional(),
  companyWebsite: z.string().optional(),
  message: z.string().optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "È necessario accettare la politica sulla privacy per inviare la richiesta",
  }),
  marketingConsent: z.boolean().optional(),
});

export type RfqFormData = z.infer<typeof rfqSchema>;

interface RfqFormProps {
  materials: { title: string }[];
  selectedProduct?: string;
}

export default function RfqForm({ materials, selectedProduct }: RfqFormProps) {
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const defaultProduct = selectedProduct || materials[0]?.title || "Golden Breccia";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RfqFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      product: defaultProduct,
      unit: "m²",
      privacyConsent: false,
      marketingConsent: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFileError(null);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileError("Il file supera il limite massimo di 10MB");
        setFile(null);
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
        setFileError("Formato non supportato. Carica PDF, DWG, DXF o immagini");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const onSubmit = async (data: RfqFormData) => {
    setStatusMessage(null);

    if (!turnstileToken) {
      setStatusMessage({ type: "error", text: "Verifica di sicurezza anti-bot mancante o fallita." });
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (file) {
      formData.append("attachment", file);
    }
    formData.append("cf-turnstile-response", turnstileToken);

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
        reset();
        setFile(null);
        setTurnstileToken("");
      } else {
        setStatusMessage({ type: "error", text: result.error || "Si è verificato un errore." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Errore di connessione. Riprova più tardi." });
    }
  };

  return (
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg border border-[#E2DFD8] shadow-sm space-y-6">
        {/* Materiale e Quantità */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Materiale *</label>
            <select
              {...register("product")}
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
            >
              {materials.map((mat) => (
                <option key={mat.title} value={mat.title}>
                  {mat.title}
                </option>
              ))}
            </select>
            {errors.product && <p className="text-xs text-red-600 mt-1">{errors.product.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Quantità *</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Es. 500"
                {...register("quantity")}
                className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
              />
              <select
                {...register("unit")}
                className="border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
              >
                <option value="m²">m²</option>
                <option value="m³">m³</option>
                <option value="tonnes">ton</option>
                <option value="units">unità</option>
              </select>
            </div>
            {errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity.message}</p>}
          </div>
        </div>

        {/* Dati Aziendali */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Nome Completo *</label>
            <input
              type="text"
              placeholder="Nome e Cognome"
              {...register("name")}
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Azienda *</label>
            <input
              type="text"
              placeholder="Nome Azienda"
              {...register("company")}
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
            />
            {errors.company && <p className="text-xs text-red-600 mt-1">{errors.company.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Email Aziendale *</label>
            <input
              type="email"
              placeholder="nome@azienda.com"
              {...register("email")}
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Destinazione e Dettagli Opzionali */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Paese di Destinazione *</label>
            <input
              type="text"
              placeholder="Es. Germania / Italia"
              {...register("destinationCountry")}
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
            />
            {errors.destinationCountry && (
              <p className="text-xs text-red-600 mt-1">{errors.destinationCountry.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Città / CAP (Opzionale)</label>
            <input
              type="text"
              placeholder="Es. Monaco (80331)"
              {...register("destinationCity")}
              className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">Note / Specifiche Progetto</label>
          <textarea
            rows={4}
            placeholder="Finitura superficiale, spessore delle lastre, tempistiche di consegna..."
            {...register("message")}
            className="w-full border border-[#DCD8D0] p-3 rounded-md text-sm bg-[#F7F5F0]"
          ></textarea>
        </div>

        {/* Allegati */}
        <div className="p-4 bg-[#F7F5F0] rounded-md border border-dashed border-[#DCD8D0]">
          <label className="block text-xs font-semibold text-[#4A4A4A] uppercase mb-2">
            Allegato Tecnico / Disegno CAD (Opzionale)
          </label>
          <input
            type="file"
            accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.webp,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-xs text-[#6B6862] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2B2D2F] file:text-white hover:file:bg-[#3D3F42] cursor-pointer"
          />
          {fileError && <p className="text-xs text-red-600 mt-1">{fileError}</p>}
          <p className="text-[11px] text-[#8C7A6B] mt-2">
            Supportati: PDF, DWG, DXF, PNG, JPG (max 10MB). Documenti protetti e riservati.
          </p>
        </div>

        {/* Consensi GDPR */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacyConsent"
              {...register("privacyConsent")}
              className="mt-1 h-4 w-4 rounded border-[#DCD8D0] text-[#2B2D2F] focus:ring-0"
            />
            <label htmlFor="privacyConsent" className="text-xs text-[#6B6862]">
              Acconsento al trattamento dei dati personali per la gestione della richiesta di quotazione in conformità alla nostra <a href="/privacy" className="underline hover:text-[#2B2D2F]">Privacy Policy</a>. *
            </label>
          </div>
          {errors.privacyConsent && (
            <p className="text-xs text-red-600">{errors.privacyConsent.message}</p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="marketingConsent"
              {...register("marketingConsent")}
              className="mt-1 h-4 w-4 rounded border-[#DCD8D0] text-[#2B2D2F] focus:ring-0"
            />
            <label htmlFor="marketingConsent" className="text-xs text-[#6B6862]">
              Desidero ricevere aggiornamenti commerciali sui nuovi materiali e disponibilità da cava (Opzionale).
            </label>
          </div>
        </div>

        {/* Captcha */}
        <div className="my-4 flex justify-center">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            onSuccess={(token: string) => setTurnstileToken(token)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2B2D2F] text-white py-3 rounded-md text-sm font-medium hover:bg-[#3D3F42] transition disabled:opacity-50"
        >
          {isSubmitting ? "Invio in corso..." : "Invia Richiesta Quotazione"}
        </button>
      </form>
    </section>
  );
}