import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cursos'

  async up () {
    this.schema.createTable('cursos', (table) => {
      table.increments('id')
      table.string('nombre').notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}