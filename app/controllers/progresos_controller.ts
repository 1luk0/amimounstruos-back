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

  async getByCursoYUsuario({ params, response }: HttpContext) {
    // 1. Cargar el progreso, asegurando que incluya la información del nivel.
    const progreso = await Progreso.query()
      .where('usuarioId', params.usuarioId)
      .andWhere('cursoId', params.cursoId)
      .preload('nivel') // <-- Carga la relación Nivel
      .first()

    // 2. Diagnóstico: Mostrar el progreso completo antes de enviarlo
    if (progreso) {
      console.log('----------------------------------------------------')
      console.log(`[GET /progresos/usuario/${params.usuarioId}] Progreso encontrado:`)
      // .toJSON() convierte el objeto Lucide a un objeto JavaScript simple para logging.
      console.log('Resultado del Preload:', progreso.toJSON()) 
      console.log('Número de Nivel (Extracto):', progreso.nivel.numero)
      console.log('----------------------------------------------------')
    }
    
    // 3. Respuesta final
    if (!progreso) {
      return response.notFound({ error: 'Progreso no encontrado' })
    }

    // Retorna el objeto Progreso con la relación 'nivel' adjunta
    return progreso
  }

async post({ request, response }: HttpContext) {
  
  console.log('----------------------------------------------------')
  console.log('[POST /progresos] Solicitud de CREACIÓN Recibida.')
  const requestPayload = request.all()
  console.log('Body (Payload):', requestPayload)

  try {
    const payload = await vine.validate({
      schema: createProgresoValidator,
      data: requestPayload,
    })

    // --- PASO 1: Verificar existencia de IDs ---
    console.log(`[VERIFICACIÓN] Buscando IDs: Usuario=${payload.usuarioId}, Curso=${payload.cursoId}`)
    const usuario = await db.from('usuarios').where('id', payload.usuarioId).first()
    const curso = await db.from('cursos').where('id', payload.cursoId).first()

    // --- PASO 2: Buscar el Nivel por Número ---
    console.log(`[BÚSQUEDA DE NIVEL] Buscando Nivel Número: ${payload.numero}`)
    const nivel = await db
      .from('nivels')
      .where('numero', payload.numero)
      .andWhere('curso_id', payload.cursoId)
      .first()

    if (!usuario || !curso || !nivel) {
      // --- Logging si alguna entidad falla ---
      console.error(`[ERROR 400] Fallo en la validación de Entidades.`)
      console.error(`  Usuario encontrado: ${!!usuario}`)
      console.error(`  Curso encontrado: ${!!curso}`)
      console.error(`  Nivel ${payload.numero} encontrado: ${!!nivel}`)

      return response.badRequest({ error: 'Usuario, curso o nivel inválido' })
    }
    
    // --- PASO 3: Intentar Crear Progreso ---
    const progreso = await Progreso.create({
      usuarioId: payload.usuarioId,
      cursoId: payload.cursoId,
      nivelId: nivel.id, // Usamos el ID de la tabla 'nivels'
      estado: payload.estado
    })
    
    // --- Logging de éxito ---
    console.log(`[ÉXITO 201] Nuevo Progreso Creado. Progreso ID: ${progreso.id}`)

    return response.status(201).json(progreso)

  } catch (error) {
    // Manejo de errores de validación
    if (error.messages) {
      console.error('[ERROR 422 - VALIDACIÓN FALLIDA]', error.messages)
      return response.status(422).send({ errors: error.messages })
    }
    
    // Manejo de otros errores (DB, etc.)
    console.error('[ERROR 500 - BASE DE DATOS O DESCONOCIDO]', error)
    return response.internalServerError({ error: 'Error interno del servidor.' });
  } finally {
    console.log('----------------------------------------------------')
  }
}


async put({ request, params, response }: HttpContext) {
    console.log('----------------------------------------------------')
    console.log(`[PUT /progresos/${params.userId}] Solicitud de Actualización Recibida.`)
    
    try {
      // 1. Validar el payload
      const payload = await vine.validate({
        schema: createProgresoValidator,
        data: request.all(),
      })
      
      console.log(`Body: Nivel ${payload.numero}, Curso ${payload.cursoId}`)

      // 2. Buscar el Progreso del usuario (lo necesitamos para actualizarlo)
      let progreso = await Progreso.query()
        .where('usuarioId', params.userId)
        .andWhere('cursoId', payload.cursoId)
        .first()
      
      if (!progreso) {
         // Si el progreso no existe, fallamos o creamos el registro inicial (POST).
         console.warn(`[ADVERTENCIA] Progreso no encontrado. Intentando crear registro inicial (UPSERT).`)
         
         // La alternativa es llamar al método POST aquí o usar la lógica que implementamos anteriormente
         // para crear el registro si no existe. Para fines de estabilidad, asumimos que
         // el POST inicial (HistoriaAguaActivity) sí funcionó.
         return response.notFound({ error: 'Progreso no encontrado para actualización. Intente iniciar el Nivel 1 primero.' })
      }
      
      // 3. Buscar el ID Primario del Nivel que se acaba de COMPLETAR
      // Necesitamos el ID del Nivel (ej: 63) para la tabla progreso.
      const nivelCompletado = await db
        .from('nivels')
        .where('numero', payload.numero) 
        .andWhere('curso_id', payload.cursoId)
        .first()

      if (!nivelCompletado) {
        console.error(`[ERROR 400] Nivel Número ${payload.numero} no encontrado en la tabla 'nivels'.`)
        return response.badRequest({ error: `Nivel número ${payload.numero} no existe en la base de datos.` })
      }
      
      // 4. Lógica de Seguridad (Solo actualiza si el nuevo nivel es más alto o igual)
      // Opcional, pero vital para evitar que se pisen los progresos.
      if (nivelCompletado.id < progreso.nivelId) {
           console.warn(`[IGNORADO] Nuevo nivel (${nivelCompletado.id}) es menor que el progreso actual (${progreso.nivelId}).`)
           return response.json(progreso)
      }


      // 5. Actualizar el registro del progreso con el ID primario del nivel
      progreso.merge({
        estado: payload.estado,
        nivelId: nivelCompletado.id // <-- El ID primario del nivel completado (e.g., 63 o 64)
      })

      await progreso.save()
      
      console.log(`[ÉXITO] Progreso actualizado. Nuevo nivelId: ${progreso.nivelId}`)
      console.log('----------------------------------------------------')
      return response.json(progreso)

    } catch (error) {
      if (error.messages) {
        console.error('[ERROR 422 - VALIDACIÓN FALLIDA]', error.messages)
        return response.status(422).send({ errors: error.messages })
      }
      console.error('[ERROR 500 - DESCONOCIDO]', error)
      return response.internalServerError({ error: 'Error interno del servidor.' })
    }
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
}
