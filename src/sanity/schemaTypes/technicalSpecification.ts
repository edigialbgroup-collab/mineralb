import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'technicalSpecification',
  title: 'Technical Specification',
  type: 'object',
  fields: [
    defineField({
      name: 'isVerified',
      title: 'Dato Verificato e Certificato',
      type: 'boolean',
      description: 'Spunta solo se le specifiche provengono da test di laboratorio o certificazioni ufficiali.',
      initialValue: true,
    }),
    defineField({
      name: 'bulkSpecificGravity',
      title: 'Bulk Specific Gravity (g/cm³)',
      type: 'number',
      description: 'Peso specifico apparente (es. 2.675)',
    }),
    defineField({
      name: 'waterAbsorption',
      title: 'Water Absorption (%)',
      type: 'number',
      description: 'Assorbimento d’acqua in percentuale (es. 0.44)',
    }),
    defineField({
      name: 'compressiveStrengthDry',
      title: 'Compressive Strength - Dry (MPa)',
      type: 'number',
    }),
    defineField({
      name: 'compressiveStrengthWet',
      title: 'Compressive Strength - Wet (MPa)',
      type: 'number',
    }),
    defineField({
      name: 'modulusOfRuptureDry',
      title: 'Modulus of Rupture - Dry (MPa)',
      type: 'number',
    }),
    defineField({
      name: 'modulusOfRuptureWet',
      title: 'Modulus of Rupture - Wet (MPa)',
      type: 'number',
    }),
    defineField({
      name: 'flexuralStrengthDry',
      title: 'Flexural Strength - Dry (MPa)',
      type: 'number',
    }),
    defineField({
      name: 'flexuralStrengthWet',
      title: 'Flexural Strength - Wet (MPa)',
      type: 'number',
    }),
    defineField({
      name: 'testingStandards',
      title: 'Testing Standards',
      type: 'string',
      initialValue: 'ASTM C170 / ASTM C880',
    }),
    defineField({
      name: 'labCertification',
      title: 'Laboratory Certification',
      type: 'string',
    }),
  ],
});