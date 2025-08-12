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

    // Buscar el nivel por número y cursoId
    const nivel = await db
      .from('nivels')
      .where('numero', payload.numero)
      .andWhere('curso_id', payload.cursoId)
      .first()

    if (!usuario || !curso || !nivel) {
      return response.badRequest({ error: 'Usuario, curso o nivel inválido' })
    }

    // Crear el progreso con el ID del nivel encontrado
    const progreso = await Progreso.create({
      usuarioId: payload.usuarioId,
      cursoId: payload.cursoId,
      nivelId: nivel.id,
      estado: payload.estado
    })

    return response.status(201).json(progreso)
  }

    // PUT
  async put({ request, params, response }: HttpContext) {
    // Buscar el progreso del usuario por userId
    const progreso = await Progreso.query()
      .where('usuarioId', params.userId)
      .first();

    if (!progreso) {
      return response.notFound({ error: 'Progreso no encontrado para este usuario' });
    }

    const payload = await vine.validate({
      schema: createProgresoValidator,
      data: request.all(),
    });

    // Extraer solo el número para buscar el nivel
    const { numero, ...rest } = payload;

    const nivel = await db
      .from('nivels')
      .where('numero', numero)
      .andWhere('curso_id', progreso.cursoId)
      .first();

    if (!nivel) {
      return response.badRequest({ error: 'Nivel no encontrado' });
    }

    // Actualizar progreso usando nivelId y el resto de datos válidos
    progreso.merge({
      ...rest,
      nivelId: nivel.id
    });

    await progreso.save();
    return response.json(progreso);
  }


  // PATCH
  async patch({ request, params, response }: HttpContext) {
    // Buscar el progreso del usuario por userId
    const progreso = await Progreso.query()
      .where('usuarioId', params.userId)
      .first();

    if (!progreso) {
      return response.notFound({ error: 'Progreso no encontrado para este usuario' });
    }

    const { numero } = request.only(['numero']);

    const nivel = await db
      .from('nivels')
      .where('numero', numero)
      .andWhere('curso_id', progreso.cursoId)
      .first();

    if (!nivel) {
      return response.badRequest({ error: 'Nivel no encontrado' });
    }

    // Actualizar solo el nivelId
    progreso.nivelId = nivel.id;

    await progreso.save();
    return response.json(progreso);
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
