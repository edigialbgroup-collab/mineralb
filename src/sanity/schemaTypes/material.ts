import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'commercialName',
      title: 'Commercial Name',
      type: 'string',
    }),
    defineField({
      name: 'materialType',
      title: 'Material Type',
      type: 'string',
      options: {
        list: [
          { title: 'Limestone / Calcare', value: 'limestone' },
          { title: 'Marble / Marmo', value: 'marble' },
          { title: 'Granite / Granito', value: 'granite' },
          { title: 'Travertine / Travertino', value: 'travertine' },
          { title: 'Other / Altro', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'origin',
      title: 'Origin / Cava',
      type: 'string',
      description: 'Origine o cava di estrazione verificata (es. Balkans, Italia)',
    }),
    defineField({
      name: 'availableFormats',
      title: 'Available Formats (List)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Blocchi Grezzi (Raw Blocks)', value: 'raw_blocks' },
          { title: 'Lastre (Slabs)', value: 'slabs' },
          { title: 'Tagliato su Misura (Cut-to-size)', value: 'cut_to_size' },
          { title: 'Piastrelle (Tiles)', value: 'tiles' },
        ],
      },
    }),
    defineField({
      name: 'availability',
      title: 'Availability Status',
      type: 'string',
      initialValue: 'Available upon request',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'applications',
      title: 'Applications',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    /* --- NUOVI CAMPI VISIVI B2B --- */

    // 1. Categorie / Selezioni (Cromatiche e di Taglio)
    defineField({
      name: 'selections',
      title: 'Categorie / Selezioni del Materiale',
      type: 'array',
      description: 'Varianti cromatiche o di falda (es. Light, Dark, Vein Cut, Cross Cut)',
      of: [
        {
          type: 'object',
          name: 'selectionItem',
          title: 'Selezione',
          fields: [
            defineField({ name: 'name', title: 'Nome Selezione', type: 'string' }),
            defineField({ name: 'description', title: 'Descrizione Breve', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Foto della Selezione', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
    }),

    // 2. Lavorazioni e Finiture Superficiali
    defineField({
      name: 'finishes',
      title: 'Lavorazioni / Finiture',
      type: 'array',
      description: 'Tipologie di lavorazione superficiale applicabili (es. Lucido, Levigato, Spazzolato)',
      of: [
        {
          type: 'object',
          name: 'finishItem',
          title: 'Finitura',
          fields: [
            defineField({ name: 'name', title: 'Nome Finitura', type: 'string' }),
            defineField({ name: 'description', title: 'Descrizione Effetto Visivo/Tattile', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Foto della Finitura', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
    }),

    // 3. Formati e Disponibilità Visive
    defineField({
      name: 'formats',
      title: 'Formati di Fornitura (Visivi)',
      type: 'array',
      description: 'Formati acquistabili con foto dedicata (es. Blocco in Cava, Lastra 2cm, Cut-to-size)',
      of: [
        {
          type: 'object',
          name: 'formatItem',
          title: 'Formato',
          fields: [
            defineField({ name: 'name', title: 'Nome Formato', type: 'string' }),
            defineField({ name: 'description', title: 'Info su Dimensioni o Packaging', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Foto del Formato', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
    }),

    /* ---------------------------------- */

    defineField({
      name: 'technicalSpecifications',
      title: 'Technical Specifications',
      type: 'technicalSpecification',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'downloadableDocuments',
      title: 'Downloadable Technical Documents',
      type: 'array',
      of: [
        {
          type: 'file',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Document Title (es. Scheda Tecnica ASTM 2026)',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Material',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
