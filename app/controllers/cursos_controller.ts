import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Curso from '#models/curso'
import { createCursoValidator } from '#validators/create_curso'

export default class CursosController {
  async getAll() {
    return await Curso.all()
  }

  async getById({ params, response }: HttpContext) {
    const curso = await Curso.find(params.id)
    if (!curso) return response.notFound({ error: 'Curso no encontrado' })
    return curso
  }

  async post({ request }: HttpContext) {
    const payload = await vine.validate({
      schema: createCursoValidator,
      data: request.all(),
    })
    return await Curso.create(payload)
  }

  async put({ request, params, response }: HttpContext) {
    const curso = await Curso.find(params.id)
    if (!curso) return response.notFound({ error: 'Curso no encontrado' })

    const payload = await vine.validate({
      schema: createCursoValidator,
      data: request.all(),
    })

    curso.merge(payload)
    await curso.save()
    return curso
  }

  async delete({ params, response }: HttpContext) {
    const curso = await Curso.find(params.id)
    if (!curso) return response.notFound({ error: 'Curso no encontrado' })

    await curso.delete()
    return { message: 'Curso eliminado' }
  }
}
