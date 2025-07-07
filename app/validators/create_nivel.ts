import vine from '@vinejs/vine'

export const createNivelValidator = vine.object({
  numero: vine.number().positive(),
  cursoId: vine.number().exists(async (db, value) => {
    const curso = await db.from('cursos').where('id', value).first()
    return !!curso
  }),
})
