const { z } = require('zod')

const modifierSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, 'El nombre del modificador es obligatorio'),
  price: z.number().min(0).optional(),
  is_required: z.boolean().optional(),
  max_selection: z.number().int().nullable().optional(),
  sort_order: z.number().int().optional(),
  status: z.enum(['active', 'draft']).optional(),
})

const variantSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, 'El nombre de la variante es obligatorio'),
  price: z.number().min(0).optional(),
  duration_minutes: z.number().int().nullable().optional(),
  sort_order: z.number().int().optional(),
  status: z.enum(['active', 'draft']).optional(),
  modifiers: z.array(modifierSchema).optional(),
})

const serviceSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['active', 'draft']).optional(),
  variants: z.array(variantSchema).optional(),
})

const serviceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'draft']).optional(),
})

function validateService(body) {
  const result = serviceSchema.safeParse(body)
  if (!result.success) {
    const message = result.error.errors.map(e => e.message).join(', ')
    throw Object.assign(new Error(message), { status: 400 })
  }
  return result.data
}

function validateServiceQuery(query) {
  const result = serviceQuerySchema.safeParse(query)
  if (!result.success) {
    const message = result.error.errors.map(e => e.message).join(', ')
    throw Object.assign(new Error(message), { status: 400 })
  }
  return result.data
}

module.exports = { serviceSchema, variantSchema, modifierSchema, serviceQuerySchema, validateService, validateServiceQuery }
