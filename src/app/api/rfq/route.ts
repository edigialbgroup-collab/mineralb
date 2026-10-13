import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_MIME_TYPES = [
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Helper: Verifica Turnstile Anti-Spam
async function verifyTurnstileToken(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // Se la secret key non è ancora configurata in env, bypassa per lo sviluppo

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });
    const outcome = await res.json();
    return outcome.success;
  } catch {
    return false;
  }
}

// Helper: Sincronizzazione Lead / Contatto con HubSpot CRM
async function syncHubSpotContact(data: {
  email: string;
  name: string;
  company: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
}) {
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!hubspotToken) return;

  const [firstName, ...lastNameParts] = data.name.trim().split(" ");
  const lastName = lastNameParts.join(" ") || "";

  try {
    // 1. Inserimento/Aggiornamento contatto su HubSpot CRM
    const contactPayload = {
      properties: {
        email: data.email,
        firstname: firstName,
        lastname: lastName,
        company: data.company,
        phone: data.phone || "",
        website: data.website || "",
        country: data.country || "",
        city: data.city || "",
        lifecyclestage: "lead",
      },
    };

    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hubspotToken}`,
      },
      body: JSON.stringify(contactPayload),
    });

    // In caso di contatto già esistente (HTTP 409 Conflict), aggiorniamo il record
    if (res.status === 409) {
      const errorData = await res.json();
      const existingId = errorData.message?.match(/ID: (\d+)/)?.[1];
      if (existingId) {
        await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hubspotToken}`,
          },
          body: JSON.stringify(contactPayload),
        });
      }
    }
  } catch (err) {
    console.error("HubSpot Sync Warning (non bloccante):", err);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const product = formData.get("product") as string;
    const quantity = formData.get("quantity") as string;
    const unit = formData.get("unit") as string;
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const destinationCountry = formData.get("destinationCountry") as string;
    const destinationCity = (formData.get("destinationCity") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const companyWebsite = (formData.get("companyWebsite") as string) || "";
    const message = (formData.get("message") as string) || "";
    const privacyConsent = formData.get("privacyConsent") === "true";
    const marketingConsent = formData.get("marketingConsent") === "true";
    const turnstileToken = formData.get("cf-turnstile-response") as string;
    const file = formData.get("attachment") as File | null;

    // Validation dei campi obbligatori
    if (!company || !email || !product || !privacyConsent) {
      return NextResponse.json(
        { error: "Campi obbligatori o consenso privacy mancanti." },
        { status: 400 }
      );
    }

    // Verifica anti-spam Turnstile
    if (turnstileToken) {
      const isValidCaptcha = await verifyTurnstileToken(turnstileToken);
      if (!isValidCaptcha) {
        return NextResponse.json(
          { error: "Verifica anti-bot fallita. Ricarica la pagina e riprova." },
          { status: 400 }
        );
      }
    }

    let attachmentPath = null;
    let signedUrl = null;

    // 1. Caricamento Allegato Tecnico su Private Supabase Storage Bucket
    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "La dimensione del file supera il limite massimo di 10 MB." },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Tipo di file non supportato. Caricare solo PDF, CAD o immagini." },
          { status: 400 }
        );
      }

      const fileExt = file.name.split(".").pop();
      const sanitizedFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      attachmentPath = sanitizedFileName;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from("rfq-attachments")
        .upload(attachmentPath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Errore caricamento allegato su Storage:", uploadError);
        return NextResponse.json(
          { error: "Impossibile caricare l'allegato tecnico." },
          { status: 500 }
        );
      }

      // Generazione di un URL firmato a scadenza (7 giorni)
      const { data: signedUrlData } = await supabase.storage
        .from("rfq-attachments")
        .createSignedUrl(attachmentPath, 604800);

      signedUrl = signedUrlData?.signedUrl || null;
    }

    const rfqCode = `RFQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestampISO = new Date().toISOString();

    // 2. Salvataggio Persistente su Supabase Database (Operazione Critica)
    const insertPayload: Record<string, unknown> = {
      id: rfqCode,
      product,
      quantity,
      unit,
      name,
      company,
      email,
      destination_country: destinationCountry,
      destination_city: destinationCity,
      phone,
      company_website: companyWebsite,
      message,
      attachment_url: attachmentPath,
      status: "New RFQ",
      privacy_consent: privacyConsent,
      privacy_consent_timestamp: timestampISO,
      privacy_policy_version: "1.0",
      marketing_consent: marketingConsent,
    };

    const { error: dbError } = await supabase
      .from("rfqs")
      .insert([insertPayload]);

    if (dbError) {
      console.error("Errore salvataggio database:", dbError);
      return NextResponse.json(
        { error: `Errore salvataggio database: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 3. Notifiche esterne (E-mail e CRM) gestite in modalita' "Fail-safe"
    // L'RFQ è già memorizzata su DB, l'eventuale errore di Resend/HubSpot non fa fallire l'invio al cliente.
    
    // A. HubSpot Sync
    syncHubSpotContact({
      email,
      name,
      company,
      phone,
      website: companyWebsite,
      country: destinationCountry,
      city: destinationCity,
    }).catch((err) => console.error("Errore asincrono HubSpot:", err));

    // B. Email tramite Resend
    try {
      if (process.env.RESEND_API_KEY) {
        const attachmentHtml = signedUrl
          ? `<p><strong>Allegato Tecnico:</strong> <a href="${signedUrl}">Scarica Disegno/PDF (Link Sicuro Scadenza 7gg)</a></p>`
          : `<p><strong>Allegato Tecnico:</strong> Nessun allegato presente.</p>`;

        // Email interna di notifica al Sales Team
        await resend.emails.send({
          from: "MineralB Platform <info@mineralb.com>",
          to: [process.env.NOTIFICATION_EMAIL || "info@mineralb.com"],
          subject: `New RFQ - ${product} - ${company}`,
          html: `
            <h2>Nuova Richiesta di Quotazione (${rfqCode})</h2>
            <p><strong>Prodotto:</strong> ${product}</p>
            <p><strong>Quantità:</strong> ${quantity} ${unit}</p>
            <p><strong>Azienda:</strong> ${company}</p>
            <p><strong>Sito Web:</strong> ${companyWebsite || "N/D"}</p>
            <p><strong>Contatto:</strong> ${name} (${email})</p>
            <p><strong>Telefono/WhatsApp:</strong> ${phone || "N/D"}</p>
            <p><strong>Destinazione:</strong> ${destinationCountry} ${destinationCity ? `(${destinationCity})` : ""}</p>
            <p><strong>Note Progetto:</strong> ${message || "Nessuna nota fornita."}</p>
            <hr>
            <p><strong>Consenso Privacy GDPR:</strong> Accettato il ${timestampISO} (v1.0)</p>
            <p><strong>Consenso Marketing:</strong> ${marketingConsent ? "SI" : "NO"}</p>
            ${attachmentHtml}
          `,
        });

        // Email automatica di conferma inviata al cliente
        await resend.emails.send({
          from: "MineralB Sourcing <info@mineralb.com>",
          to: [email],
          subject: "Your quotation request has been received - MineralB",
          html: `
            <h3>Gentile ${name},</h3>
            <p>Abbiamo ricevuto la tua richiesta di quotazione per <strong>${product}</strong> (Rif: <strong>${rfqCode}</strong>).</p>
            <p>Il nostro team commerciale valuterà le specifiche fornite e ti risponderà con un'offerta dedicata nel più breve tempo possibile.</p>
            <br>
            <p>Cordiali saluti,<br><strong>MineralB Commercial Team</strong></p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Errore non bloccante invio e-mail Resend:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Richiesta di quotazione inviata con successo.",
      rfqId: rfqCode,
    });
  } catch (error) {
    console.error("Errore API RFQ:", error);
    return NextResponse.json(
      { error: "Errore durante l'elaborazione della richiesta." },
      { status: 500 }
    );
  }
}