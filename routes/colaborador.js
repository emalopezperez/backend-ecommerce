const { Router } = require('express');
const colaboradorControllers = require('../controllers/colaborador')
const authenticate = require('../middlewares/authenticate')

const router = Router()

router.post('/registro_colaborador_admin', authenticate.decodeToken, colaboradorControllers.registro_colaborador_admin)
router.post('/login_colaborador_admin', colaboradorControllers.login_colaborador_admin)

module.exports = router;