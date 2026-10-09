import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'technicalSpecification',
  title: 'Technical Specification',
  type: 'object',
  fields: [
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
      description: 'Rezistenca në shtypje - dry (es. 153.11)',
    }),
    defineField({
      name: 'compressiveStrengthWet',
      title: 'Compressive Strength - Wet (MPa)',
      type: 'number',
      description: 'Rezistenca në shtypje - wet (es. 130.18)',
    }),
    defineField({
      name: 'modulusOfRuptureDry',
      title: 'Modulus of Rupture - Dry (MPa)',
      type: 'number',
      description: 'Moduli i thyerjes në përkulje - dry (es. 12.31)',
    }),
    defineField({
      name: 'modulusOfRuptureWet',
      title: 'Modulus of Rupture - Wet (MPa)',
      type: 'number',
      description: 'Moduli i thyerjes në përkulje - wet (es. 11.92)',
    }),
    defineField({
      name: 'flexuralStrengthDry',
      title: 'Flexural Strength - Dry (MPa)',
      type: 'number',
      description: 'Rezistenca në përkulje - dry (es. 8.17)',
    }),
    defineField({
      name: 'flexuralStrengthWet',
      title: 'Flexural Strength - Wet (MPa)',
      type: 'number',
      description: 'Rezistenca në përkulje - wet (es. 7.88)',
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
      initialValue: 'ALTEA & GEOSTUDIO 2000 (ISO/IEC 17025)',
    }),
  ],
});