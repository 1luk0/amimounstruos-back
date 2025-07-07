import router from '@adonisjs/core/services/router'
import AmigosController from '#controllers/amigos_controller'

router.get('/amigos', [AmigosController, 'getAll'])
router.get('/amigos/:id', [AmigosController, 'getById'])
router.post('/amigos', [AmigosController, 'post'])
router.put('/amigos/:id', [AmigosController, 'put']) // ⚠️ si PUT no aplica, puede responder 405
router.delete('/amigos/:id', [AmigosController, 'delete'])
router.get('/amigos/usuario/:id', [AmigosController, 'getByUsuarioId'])

