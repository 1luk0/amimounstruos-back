import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import Progreso from '#models/progreso'
import { createProgresoValidator } from '#validators/create_progreso'


export default class ProgresosController {
  async getAll() {
    return await Progreso.all()
  }

  async getById({ params, response }: HttpContext) {
    const progreso = await Progreso.find(params.id)
    if (!progreso) return response.notFound({ error: 'Progreso no encontrado' })
    return progreso
  }

  async post({ request, response }: HttpContext) {
    const payload = await vine.validate({
      schema: createProgresoValidator,
      data: request.all(),
    })

    const usuario = await db.from('usuarios').where('id', payload.usuarioId).first()
    const curso = await db.from('cursos').where('id', payload.cursoId).first()
    const nivel = payload.nivelId
      ? await db.from('nivels').where('id', payload.nivelId).first()
      : true

    if (!usuario || !curso || !nivel) {
      return response.badRequest({ error: 'Usuario, curso o nivel inválido' })
    }

    return await Progreso.create(payload)
  }

  async put({ request, params, response }: HttpContext) {
    const progreso = await Progreso.find(params.id)
    if (!progreso) return response.notFound({ error: 'Progreso no encontrado' })

    const payload = await vine.validate({
      schema: createProgresoValidator,
      data: request.all(),
    })

    progreso.merge(payload)
    await progreso.save()
    return progreso
  }

  async delete({ params, response }: HttpContext) {
    const progreso = await Progreso.find(params.id)
    if (!progreso) return response.notFound({ error: 'Progreso no encontrado' })

    await progreso.delete()
    return { message: 'Progreso eliminado' }
  }

  public async getByCursoYUsuario({ params }: HttpContext) {
    const { cursoId, usuarioId } = params

    const progreso = await Progreso
      .query()
      .where('curso_id', cursoId)
      .andWhere('usuario_id', usuarioId)
      .first()

    return progreso || null
  }
}
