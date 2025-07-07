import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'nivels'

  async up () {
    this.schema.createTable('nivels', (table) => {
      table.increments('id')
      table.integer('numero').unsigned().notNullable()
      table.integer('curso_id').unsigned().references('id').inTable('cursos').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}