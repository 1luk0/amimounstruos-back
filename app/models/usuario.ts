// app/models/usuario.ts
import  { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Curso from './curso.js'


export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare amimounstruo: number

  @manyToMany(() => Curso, {
    pivotTable: 'progresos',
  })
  declare cursos: ManyToMany<typeof Curso>

  @manyToMany(() => Usuario, {
    pivotTable: 'amigos',
    pivotForeignKey: 'usuario_id',
    pivotRelatedForeignKey: 'amigo_id',
  })
  declare amigos: ManyToMany<typeof Usuario>
}
