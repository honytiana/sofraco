const express = require('express');
const router = express.Router();

const accessControl = require('../middlewares/accessControl');
const clientController =  require('../controllers/client');

router.route('/').get(accessControl, clientController.getClients);
router.route('/:id').get(accessControl, clientController.getClient);
router.route('/').post(accessControl, clientController.createClient);
router.route('/courtier/:courtier').get(accessControl, clientController.getClientsOfCourtier);
router.route('/:id').put(accessControl, clientController.updateClient);
router.route('/').put(clientController.deleteAllClients);
router.route('/:id').post(accessControl, clientController.deleteClient);


module.exports = router;