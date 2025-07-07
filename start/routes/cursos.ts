import router from '@adonisjs/core/services/router'
import CursosController from '#controllers/cursos_controller'

router.get('/cursos', [CursosController, 'getAll'])
router.get('/cursos/:id', [CursosController, 'getById'])
router.post('/cursos', [CursosController, 'post'])
router.put('/cursos/:id', [CursosController, 'put'])
router.delete('/cursos/:id', [CursosController, 'delete'])
