import { z } from 'zod';
import { categories } from '../data/categories';
const optionalText = (max = 160) =>
  z.string().trim().max(max, 'form.lengthError').optional().default('');
export const contactSchema = z
  .object({
    locale: z.enum(['es', 'ca']),
    name: z.string().trim().min(2, 'form.nameError').max(120, 'form.lengthError'),
    email: z.email('form.emailError').max(254, 'form.lengthError'),
    phone: optionalText(40),
    type: z.enum(['general', 'spare', 'professional', 'classic']),
    category: z
      .string()
      .refine((v) => v === '' || categories.some((c) => c.id === v && c.active), 'form.required'),
    message: z.string().trim().min(20, 'form.messageError').max(4000, 'form.messageError'),
    consent: z.boolean().refine((v) => v, 'form.consentError'),
    company: optionalText(),
    brand: optionalText(),
    model: optionalText(),
    year: optionalText(4),
    engine: optionalText(),
    part: optionalText(300),
    reference: optionalText(),
    website: z.string().max(200).optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'professional' && data.company.length < 2)
      ctx.addIssue({ code: 'custom', path: ['company'], message: 'form.required' });
    if (data.type === 'spare' || data.type === 'classic') {
      for (const field of ['brand', 'model', 'part'] as const)
        if (data[field].length < 2)
          ctx.addIssue({ code: 'custom', path: [field], message: 'form.required' });
      if (
        !/^\d{4}$/.test(data.year) ||
        +data.year < 1900 ||
        +data.year > new Date().getFullYear() + 1
      )
        ctx.addIssue({ code: 'custom', path: ['year'], message: 'form.yearError' });
    }
  });
export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
