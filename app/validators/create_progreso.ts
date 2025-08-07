import vine from '@vinejs/vine'

export const createProgresoValidator = vine.object({
  usuarioId: vine.number(),
  cursoId: vine.number(),
  numero: vine.number(),
  estado: vine.string(),
})
