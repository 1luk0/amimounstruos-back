import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'progresos'

  async up () {
    this.schema.createTable('progresos', (table) => {
      table.increments('id')
      table.integer('usuario_id').unsigned().references('id').inTable('usuarios').onDelete('CASCADE')
      table.integer('curso_id').unsigned().references('id').inTable('cursos').onDelete('CASCADE')
      table.integer('nivel_id').unsigned().references('id').inTable('nivels').onDelete('SET NULL')
      table.string('estado').notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}