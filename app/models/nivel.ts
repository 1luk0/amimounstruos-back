// app/models/nivel.ts
import { BaseModel, column, belongsTo, hasMany, } from '@adonisjs/lucid/orm'
import Curso from './curso.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Progreso from './progreso.js'


export default class Nivel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare numero: number

  @column()
  declare cursoId: number

  @belongsTo(() => Curso)
  declare curso: BelongsTo<typeof Curso>

  @hasMany(() => Progreso)
  declare progresos: HasMany<typeof Progreso>
}
