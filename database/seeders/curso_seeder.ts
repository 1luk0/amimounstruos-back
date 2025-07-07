import Curso from '#models/curso'

export default class CursoSeeder {
  async run() {
    await Curso.createMany([
      { nombre: 'Matemáticas' },
      { nombre: 'Física' },
      { nombre: 'Programación' },
      { nombre: 'Historia' },
      { nombre: 'Biología' },
      { nombre: 'Química' },
      { nombre: 'Inglés' },
      { nombre: 'Literatura' },
      { nombre: 'Filosofía' },
      { nombre: 'Arte' },
    ])
  }
}
