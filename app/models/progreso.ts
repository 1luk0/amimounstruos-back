// app/models/progreso.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Usuario from './usuario.js'
import Curso from './curso.js'
import Nivel from './nivel.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Progreso extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare usuarioId: number

  @column()
  declare cursoId: number

  @column()
  declare nivelId: number  // Nuevo campo para guardar el nivel alcanzado

  @column()
  declare estado: string

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  @belongsTo(() => Curso)
  declare curso: BelongsTo<typeof Curso>

  @belongsTo(() => Nivel)
  declare nivel: BelongsTo<typeof Nivel>
}
