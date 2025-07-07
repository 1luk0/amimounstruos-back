import vine from '@vinejs/vine'

export const createCursoValidator = vine.object({
  nombre: vine.string().minLength(2),
})
