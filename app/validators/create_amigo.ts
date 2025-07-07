import vine from '@vinejs/vine'

export const createAmigoValidator = vine.object({
  usuarioId: vine.number().exists(async (db, value) => {
    const usuario = await db.from('usuarios').where('id', value).first()
    return !!usuario
  }),
  amigoId: vine.number().exists(async (db, value) => {
    const amigo = await db.from('usuarios').where('id', value).first()
    return !!amigo
  }),
})
