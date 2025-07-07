import Usuario from '#models/usuario'

export default class UsuarioSeeder {
  async run() {
    await Usuario.createMany([
      { nombre: 'Juan', amimounstruo: 1 },
      { nombre: 'Ana', amimounstruo: 2 },
      { nombre: 'Carlos', amimounstruo: 3 },
      { nombre: 'Luisa', amimounstruo:4  },
      { nombre: 'Mateo', amimounstruo:1 },
      { nombre: 'María', amimounstruo:2 },
      { nombre: 'Andrés', amimounstruo: 3 },
      { nombre: 'Laura', amimounstruo: 4},
      { nombre: 'Pedro', amimounstruo: 1},
      { nombre: 'Camila', amimounstruo: 2 },
    ])
  }
}
