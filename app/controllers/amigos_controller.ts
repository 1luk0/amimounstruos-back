import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import Amigo from '#models/amigo'
import { createAmigoValidator } from '#validators/create_amigo'
import Usuario from '#models/usuario'


export default class AmigosController {
  async getAll() {
    return await Amigo.all()
  }

  async getById({ params, response }: HttpContext) {
    const amigo = await Amigo.find(params.id)
    if (!amigo) return response.notFound({ error: 'Relación no encontrada' })
    return amigo
  }
   public async getByUsuarioId({ params, response }: HttpContext) {
    const usuarioId = Number(params.id)

    if (isNaN(usuarioId)) {
      return response.badRequest({ error: 'ID de usuario inválido' })
    }

    // Busca las relaciones donde el usuario es el solicitante
    const relaciones = await Amigo.query().where('usuario_id', usuarioId)

    const amigoIds = relaciones.map((r) => r.amigoId)

    if (amigoIds.length === 0) {
      return []
    }

    // Retorna la info básica de los amigos (puedes personalizar los campos)
    const amigos = await Usuario.query().whereIn('id', amigoIds).select('id', 'nombre', 'amimounstruo')

    return amigos
  }

  async post({ request, response }: HttpContext) {
    const payload = await vine.validate({
      schema: createAmigoValidator,
      data: request.all(),
    })

    if (payload.usuarioId === payload.amigoId) {
      return response.badRequest({ error: 'Un usuario no puede agregarse a sí mismo como amigo' })
    }

    const usuario = await db.from('usuarios').where('id', payload.usuarioId).first()
    const amigo = await db.from('usuarios').where('id', payload.amigoId).first()
    if (!usuario || !amigo) {
      return response.badRequest({ error: 'Usuario o amigo no existe' })
    }

    return await Amigo.create(payload)
  }

  async put({}: HttpContext) {
    // PUT no aplica en una relación pivote simple como esta.
    return { warning: 'Actualizar una relación de amistad no tiene sentido en este contexto' }
  }

  async delete({ params, response }: HttpContext) {
    const amigo = await Amigo.find(params.id)
    if (!amigo) return response.notFound({ error: 'Relación no encontrada' })

    await amigo.delete()
    return { message: 'Amigo eliminado' }
  }
}
