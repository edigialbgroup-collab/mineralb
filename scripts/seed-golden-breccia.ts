import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-01-01",
});

const goldenBrecciaDocument = {
  _type: "material",
  _id: "material-golden-breccia",
  title: "Golden Breccia",
  slug: {
    _type: "slug",
    current: "golden-breccia",
  },
  commercialName: "Golden Breccia",
  materialType: "limestone",
  origin: "Balkans",
  availableFormats: ["raw_blocks", "slabs", "cut_to_size", "tiles"],
  availability: "Available upon request",
  shortDescription:
    "Calcare naturale di provenienza balcanica caratterizzato da toni beige e sabbia dorati, raffinata tessitura brecciata ed elevate prestazioni meccaniche certificate ASTM.",
  applications: [
    "Facciate ventilate e rivestimenti esterni",
    "Pavimentazioni ad elevato calpestio",
    "Rivestimenti interni di pregio",
    "Elementi d'arredo su misura (Cut-to-size)",
  ],
  featured: true,
  technicalSpecifications: {
    bulkSpecificGravity: 2.675,
    waterAbsorption: 0.44,
    compressiveStrengthDry: 153.11,
    compressiveStrengthWet: 130.18,
    modulusOfRuptureDry: 12.31,
    modulusOfRuptureWet: 11.92,
    flexuralStrengthDry: 8.17,
    flexuralStrengthWet: 7.88,
    testingStandards: "ASTM C170 / ASTM C880",
    labCertification: "ISO/IEC 17025 Accredited Laboratory",
  },
};

async function seedMaterial() {
  try {
    console.log("⏳ Inserimento di Golden Breccia su Sanity CMS...");
    const result = await client.createOrReplace(goldenBrecciaDocument);
    console.log("✅ Materiale 'Golden Breccia' inserito/aggiornato con successo!");
    console.log("ID Documento:", result._id);
  } catch (error) {
    console.error("❌ Errore durante l'inserimento:", error);
  }
}

seedMaterial();