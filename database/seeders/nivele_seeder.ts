import Nivel from '#models/nivel'

export default class NivelSeeder {
  async run() {
    const niveles = []

    for (let cursoId = 1; cursoId <= 10; cursoId++) {
      for (let numero = 1; numero <= 3; numero++) {
        niveles.push({ numero, cursoId })
      }
    }

    await Nivel.createMany(niveles)
  }
}
