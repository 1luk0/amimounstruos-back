import vine from '@vinejs/vine'

export const createUsuarioValidator = vine.object({
  nombre: vine.string().minLength(2),
  amimounstruo: vine.number(),
})
