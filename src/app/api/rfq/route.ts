import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

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

    const { error } = await supabase.from("rfqs").insert([
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

    if (error) {
      console.error("Errore Supabase:", error);
      return NextResponse.json(
        { error: "Impossibile salvare la richiesta nel database." },
        { status: 500 }
      );
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