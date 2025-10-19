import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Usuario from '#models/usuario'
import { createUsuarioValidator } from '#validators/create_usuario'


export default class UsuariosController {
  async getAll() {
    return await Usuario.all()
  }

  async getById({ params, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ error: 'Usuario no encontrado' })
    return usuario
  }

  async getByName({ params, response }: HttpContext) {
  const usuario = await Usuario.query().whereILike('nombre', params.nombre).first()

  if (!usuario) {
    return response.notFound({ error: 'Usuario no encontrado' })
  }

  return usuario
}


async verificarNombre({ params, response }: HttpContext) {
  const usuario = await Usuario.findBy('nombre', params.nombre)

  if (usuario) {
    // 200 → ya existe
    return response.status(200)
  } else {
    // 204 → disponible
    return response.status(204)
  }
}



  async post({ request }: HttpContext) {
    const payload = await vine.validate({
      schema: createUsuarioValidator,
      data: request.all(),
    })
    const usuario = await Usuario.create(payload)
    return usuario
  }

  async put({ request, params, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ error: 'Usuario no encontrado' })

    const payload = await vine.validate({
      schema: createUsuarioValidator,
      data: request.all(),
    })

    usuario.merge(payload)
    await usuario.save()
    return usuario
  }

  async delete({ params, response }: HttpContext) {
    const usuario = await Usuario.find(params.id)
    if (!usuario) return response.notFound({ error: 'Usuario no encontrado' })

    await usuario.delete()
    return { message: 'Usuario eliminado' }
  }
}
