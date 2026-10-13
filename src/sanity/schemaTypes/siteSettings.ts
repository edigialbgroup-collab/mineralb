import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Impostazioni Sito / Hero e Metodo',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Immagine di Sfondo Hero',
      type: 'image',
      description: 'Foto principale della copertina.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitle',
      title: 'Titolo Hero',
      type: 'string',
      initialValue: 'Pietre Naturali, Direttamente dalla Fonte.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Sottotitolo Hero',
      type: 'text',
      rows: 2,
      initialValue: 'Connettiamo cave verificate con acquirenti B2B e distributori internazionali.',
    }),

    // Sezione per le 4 Fasi del Metodo
    defineField({
      name: 'processSteps',
      title: 'Fasi del Metodo (Processo B2B)',
      type: 'array',
      description: 'Aggiungi o modifica le 4 fasi del processo di sourcing con relative immagini.',
      of: [
        {
          type: 'object',
          name: 'step',
          title: 'Fase del Processo',
          fields: [
            defineField({
              name: 'stepNumber',
              title: 'Numero e Tag (es. 01. SOURCING)',
              type: 'string',
            }),
            defineField({
              name: 'title',
              title: 'Titolo Fase (es. Selezione alla Cava)',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Descrizione Breve',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'image',
              title: 'Immagine della Fase',
              type: 'image',
              options: { hotspot: true },
            }),
            // Campo aggiunto per rendere la scheda un link
            defineField({
              name: 'linkUrl',
              title: 'Link Pagina Dedicata (Opzionale)',
              type: 'string',
              description: 'Inserisci il link (es. /about). Se compilato, la scheda diventerà un link cliccabile.',
            }),
          ],
        },
      ],
    }),
  ],
});
