import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-01-01",
});

const initialMaterials = [
  {
    _type: "material",
    _id: "material-golden-breccia",
    title: "Golden Breccia",
    slug: { _type: "slug", current: "golden-breccia" },
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
      isVerified: true,
      bulkSpecificGravity: 2.675,
      waterAbsorption: 0.44,
      compressiveStrengthDry: 153.11,
      compressiveStrengthWet: 130.18,
      modulusOfRuptureDry: 12.31,
      modulusOfRuptureWet: 11.92,
      flexuralStrengthDry: 8.17,
      flexuralStrengthWet: 7.88,
      testingStandards: "ASTM C170 / ASTM C880",
      labCertification: "ALTEA & GEOSTUDIO 2000 (ISO/IEC 17025)",
    },
    seoTitle: "Golden Breccia - Calcare Naturale B2B",
    seoDescription: "Sourcing diretto di Golden Breccia dalla cava. Disponibile in blocchi, lastre e tagliati su misura.",
  },
  {
    _type: "material",
    _id: "material-grigio-balcanico",
    title: "Grigio Balcanico",
    slug: { _type: "slug", current: "grigio-balcanico" },
    commercialName: "Grigio Balcanico",
    materialType: "limestone",
    origin: "Balkans",
    availableFormats: ["raw_blocks", "slabs", "cut_to_size"],
    availability: "Available upon request",
    shortDescription:
      "Pietra calcarea grigia ad alta densità con sottili venature calcite candide. Eccellente resistenza agli sbalzi termici per architettura moderna e urbana.",
    applications: [
      "Pavimentazioni urbane ed esterne",
      "Rivestimenti per facciate strutturali",
      "Progetti di architettura contemporanea",
    ],
    featured: true,
    technicalSpecifications: {
      isVerified: true,
      bulkSpecificGravity: 2.710,
      waterAbsorption: 0.32,
      compressiveStrengthDry: 162.40,
      compressiveStrengthWet: 141.50,
      modulusOfRuptureDry: 13.10,
      modulusOfRuptureWet: 12.80,
      flexuralStrengthDry: 9.05,
      flexuralStrengthWet: 8.60,
      testingStandards: "ASTM C170 / ASTM C880",
      labCertification: "ISO/IEC 17025 Accredited Laboratory",
    },
    seoTitle: "Grigio Balcanico - Pietra Naturale da Cava",
    seoDescription: "Pietra calcarea grigia ad alta resistenza per progetti di architettura e pavimentazione urbana.",
  },
];

async function seedMaterials() {
  try {
    console.log("⏳ Inserimento dei materiali iniziali per l'MVP su Sanity CMS...");
    for (const mat of initialMaterials) {
      const result = await client.createOrReplace(mat);
      console.log(`✅ Materiale '${mat.title}' inserito/aggiornato con successo! (ID: ${result._id})`);
    }
  } catch (error) {
    console.error("❌ Errore durante il seeding:", error);
  }
}

seedMaterials();