import router from '@adonisjs/core/services/router'
import UsuariosController from '#controllers/usuarios_controller'

router.get('/usuarios', [UsuariosController, 'getAll'])
router.get('/usuarios/:id', [UsuariosController, 'getById'])
router.get('/usuarios/nombre/:nombre', [UsuariosController, 'getByName'])
router.post('/usuarios', [UsuariosController, 'post'])
router.put('/usuarios/:id', [UsuariosController, 'put'])
router.delete('/usuarios/:id', [UsuariosController, 'delete'])
