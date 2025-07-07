// app/models/amigo.ts
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Amigo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare usuarioId: number

  @column()
  declare amigoId: number
}
