import Progreso from '#models/progreso'

export default class ProgresoSeeder {
  async run() {
    await Progreso.createMany([
      { usuarioId: 1, cursoId: 1, nivelId: 1, estado: 'en curso' },
      { usuarioId: 2, cursoId: 2, nivelId: 4, estado: 'completado' },
      { usuarioId: 3, cursoId: 3, nivelId: 7, estado: 'en curso' },
      { usuarioId: 4, cursoId: 4, nivelId: 10, estado: 'completado' },
      { usuarioId: 5, cursoId: 5, nivelId: 13, estado: 'en curso' },
      { usuarioId: 6, cursoId: 6, nivelId: 16, estado: 'completado' },
      { usuarioId: 7, cursoId: 7, nivelId: 19, estado: 'en curso' },
      { usuarioId: 8, cursoId: 8, nivelId: 22, estado: 'completado' },
      { usuarioId: 9, cursoId: 9, nivelId: 25, estado: 'en curso' },
      { usuarioId: 10, cursoId: 10, nivelId: 28, estado: 'completado' },
    ])
  }
}
