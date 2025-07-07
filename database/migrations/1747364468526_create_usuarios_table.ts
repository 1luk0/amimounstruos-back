import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up () {
    this.schema.createTable('usuarios', (table) => {
      table.increments('id')
      table.string('nombre').notNullable().unique()
      table.integer('amimounstruo').notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}