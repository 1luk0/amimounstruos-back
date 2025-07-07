import Amigo from '#models/amigo'

export default class AmigoSeeder {
  async run() {
    await Amigo.createMany([
      { usuarioId: 1, amigoId: 2 },
      { usuarioId: 1, amigoId: 3 },
      { usuarioId: 2, amigoId: 4 },
      { usuarioId: 2, amigoId: 5 },
      { usuarioId: 3, amigoId: 6 },
      { usuarioId: 4, amigoId: 7 },
      { usuarioId: 5, amigoId: 8 },
      { usuarioId: 6, amigoId: 9 },
      { usuarioId: 7, amigoId: 10 },
      { usuarioId: 8, amigoId: 1 },
    ])
  }
}
