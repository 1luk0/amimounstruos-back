import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Nivel from '#models/nivel'
import db from '@adonisjs/lucid/services/db'
import { createNivelValidator } from '#validators/create_nivel'

export default class NivelesController {
  async getAll() {
    return await Nivel.all()
  }

  async getById({ params, response }: HttpContext) {
    const nivel = await Nivel.find(params.id)
    if (!nivel) return response.notFound({ error: 'Nivel no encontrado' })
    return nivel
  }

  async post({ request, response }: HttpContext) {
    const payload = await vine.validate({
      schema: createNivelValidator,
      data: request.all(),
    })

    const curso = await db.from('cursos').where('id', payload.cursoId).first()
    if (!curso) return response.badRequest({ error: 'Curso no existe' })

    return await Nivel.create(payload)
  }

  async put({ request, params, response }: HttpContext) {
    const nivel = await Nivel.find(params.id)
    if (!nivel) return response.notFound({ error: 'Nivel no encontrado' })

    const payload = await vine.validate({
      schema: createNivelValidator,
      data: request.all(),
    })

    nivel.merge(payload)
    await nivel.save()
    return nivel
  }

  async delete({ params, response }: HttpContext) {
    const nivel = await Nivel.find(params.id)
    if (!nivel) return response.notFound({ error: 'Nivel no encontrado' })

    await nivel.delete()
    return { message: 'Nivel eliminado' }
  }
}
