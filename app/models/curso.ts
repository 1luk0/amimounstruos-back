// app/models/curso.ts
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Nivel from './nivel.js'
import Usuario from './usuario.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'


export default class Curso extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @hasMany(() => Nivel)
  declare niveles: HasMany<typeof Nivel>

  @manyToMany(() => Usuario, {
    pivotTable: 'progresos',
  })
  declare usuarios: ManyToMany<typeof Usuario>
}
