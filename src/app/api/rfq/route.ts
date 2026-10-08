import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.company || !data.email || !data.product) {
      return NextResponse.json(
        { error: "Campi obbligatori mancanti." },
        { status: 400 }
      );
    }

    const rfqId = `RFQ-${Math.floor(Math.random() * 1000000)}`;

    // 1. Salvataggio persistente su Supabase
    const { error: dbError } = await supabase.from("rfqs").insert([
      {
        id: rfqId,
        product: data.product,
        quantity: data.quantity,
        unit: data.unit,
        name: data.name,
        company: data.company,
        email: data.email,
        destination_country: data.destinationCountry,
        message: data.message,
        status: "New RFQ",
      },
    ]);

    if (dbError) {
      console.error("Errore Supabase:", dbError);
      return NextResponse.json(
        { error: "Impossibile salvare la richiesta nel database." },
        { status: 500 }
      );
    }

    // 2. Invio Email di notifica tramite Resend
    try {
      if (process.env.RESEND_API_KEY) {
        // Notifica interna per il team commerciale
        await resend.emails.send({
          from: "MineralB Platform <onboarding@resend.dev>",
          to: [process.env.NOTIFICATION_EMAIL || "commerciale@mineralb.com"],
          subject: `New RFQ - ${data.product} - ${data.company}`,
          html: `
            <h2>Nuova Richiesta di Quotazione (${rfqId})</h2>
            <p><strong>Prodotto:</strong> ${data.product}</p>
            <p><strong>Quantità:</strong> ${data.quantity} ${data.unit}</p>
            <p><strong>Azienda:</strong> ${data.company}</p>
            <p><strong>Contatto:</strong> ${data.name} (${data.email})</p>
            <p><strong>Destinazione:</strong> ${data.destinationCountry}</p>
            <p><strong>Note:</strong> ${data.message || "Nessuna nota fornita."}</p>
          `,
        });

        // Conferma automatica inviata al cliente B2B
        await resend.emails.send({
          from: "MineralB Sourcing <onboarding@resend.dev>",
          to: [data.email],
          subject: "Your quotation request has been received - MineralB",
          html: `
            <h3>Gentile ${data.name},</h3>
            <p>Abbiamo ricevuto la tua richiesta di quotazione per <strong>${data.product}</strong> (Rif: <strong>${rfqId}</strong>).</p>
            <p>Il nostro team commerciale valuterà i requisiti tecnici e la logistica di spedizione per fornirti un'offerta dedicata nel più breve tempo possibile.</p>
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
    return NextResponse.json(
      { error: "Errore durante l'elaborazione della richiesta." },
      { status: 500 }
    );
  }
}