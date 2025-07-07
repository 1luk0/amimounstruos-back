import router from '@adonisjs/core/services/router'
import NivelesController from '#controllers/niveles_controller'

router.get('/niveles', [NivelesController, 'getAll'])
router.get('/niveles/:id', [NivelesController, 'getById'])
router.post('/niveles', [NivelesController, 'post'])
router.put('/niveles/:id', [NivelesController, 'put'])
router.delete('/niveles/:id', [NivelesController, 'delete'])
