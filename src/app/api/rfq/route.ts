import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

// Formati e MIME type consentiti per allegati tecnici B2B (PDF, CAD, PNG, JPG, WEBP)
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // Limitato a 10 MB

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
    const message = formData.get("message") as string;
    const file = formData.get("attachment") as File | null;

    if (!company || !email || !product) {
      return NextResponse.json(
        { error: "Campi obbligatori mancanti." },
        { status: 400 }
      );
    }

    let attachmentPath = null;
    let signedUrl = null;

    // 1. Gestione caricamento allegato su Supabase Storage
    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "La dimensione del file supera il limite massimo di 10 MB." },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Tipo di file non supportato. Caricare solo file PDF, CAD o Immagini." },
          { status: 400 }
        );
      }

      const fileExt = file.name.split(".").pop();
      const sanitizedFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      attachmentPath = `${sanitizedFileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload nel bucket privato 'rfq-attachments'
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

      // Generazione di un link firmato valido per 7 giorni per la visione interna
      const { data: signedUrlData } = await supabase.storage
        .from("rfq-attachments")
        .createSignedUrl(attachmentPath, 604800);

      signedUrl = signedUrlData?.signedUrl || null;
    }

    const rfqId = `RFQ-${Math.floor(Math.random() * 1000000)}`;

    // 2. Salvataggio record RFQ su Supabase Database
    const { error: dbError } = await supabase.from("rfqs").insert([
      {
        id: rfqId,
        product: product,
        quantity: quantity,
        unit: unit,
        name: name,
        company: company,
        email: email,
        destination_country: destinationCountry,
        message: message,
        attachment_url: attachmentPath,
        status: "New RFQ",
      },
    ]);

    if (dbError) {
      console.error("Errore salvataggio database:", dbError);
      return NextResponse.json(
        { error: "Impossibile salvare la richiesta nel database." },
        { status: 500 }
      );
    }

    // 3. Invio notifiche via email tramite Resend
    try {
      if (process.env.RESEND_API_KEY) {
        const attachmentHtml = signedUrl
          ? `<p><strong>Allegato Tecnico:</strong> <a href="${signedUrl}">Download Disegno/PDF (Link Sicuro)</a></p>`
          : `<p><strong>Allegato Tecnico:</strong> Nessun allegato presente.</p>`;

        // Email per il team commerciale
        await resend.emails.send({
          from: "MineralB Platform <onboarding@resend.dev>",
          to: [process.env.NOTIFICATION_EMAIL || "commerciale@mineralb.com"],
          subject: `New RFQ - ${product} - ${company}`,
          html: `
            <h2>Nuova Richiesta di Quotazione (${rfqId})</h2>
            <p><strong>Prodotto:</strong> ${product}</p>
            <p><strong>Quantità:</strong> ${quantity} ${unit}</p>
            <p><strong>Azienda:</strong> ${company}</p>
            <p><strong>Contatto:</strong> ${name} (${email})</p>
            <p><strong>Destinazione:</strong> ${destinationCountry}</p>
            <p><strong>Note:</strong> ${message || "Nessuna nota fornita."}</p>
            ${attachmentHtml}
          `,
        });

        // Email di conferma al cliente B2B
        await resend.emails.send({
          from: "MineralB Sourcing <onboarding@resend.dev>",
          to: [email],
          subject: "Your quotation request has been received - MineralB",
          html: `
            <h3>Gentile ${name},</h3>
            <p>Abbiamo ricevuto la tua richiesta di quotazione per <strong>${product}</strong> (Rif: <strong>${rfqId}</strong>).</p>
            <p>Il nostro team commerciale valuterà i requisiti tecnici forniti e la logistica di spedizione per fornirti un'offerta dedicata nel più breve tempo possibile.</p>
            <br>
            <p>Cordiali saluti,<br><strong>MineralB Commercial Team</strong></p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Errore invio e-mail Resend:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Richiesta di quotazione inviata con successo.",
      rfqId: rfqId,
    });
  } catch (error) {
    console.error("Errore API RFQ:", error);
    return NextResponse.json(
      { error: "Errore durante l'elaborazione della richiesta." },
      { status: 500 }
    );
  }
}