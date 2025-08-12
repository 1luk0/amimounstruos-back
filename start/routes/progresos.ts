import router from '@adonisjs/core/services/router'
import ProgresosController from '#controllers/progresos_controller'

router.get('/progresos', [ProgresosController, 'getAll'])
router.get('/progresos/:id', [ProgresosController, 'getById'])
router.post('/progresos', [ProgresosController, 'post'])
router.put('/progresos/:userId', [ProgresosController, 'put'])
router.delete('/progresos/:id', [ProgresosController, 'delete'])
router.get('/progresos/usuario/:usuarioId/curso/:cursoId', [ProgresosController,'getByCursoYUsuario'])
router.patch('/progresos/:userId', [ProgresosController, 'patch'])
