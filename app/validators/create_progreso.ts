import vine from '@vinejs/vine'

export const createProgresoValidator = vine.object({
  usuarioId: vine.number(),
  cursoId: vine.number(),
  nivelId: vine.number().optional(),
  estado: vine.string(),
})
