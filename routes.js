const router = require('express').Router();
const controller = require('./controller');

router.route('/planets/:name').post((req, res) => controller.getPlanetPosition(req, res));

router.route('/planets').get((req, res) => controller.getPlanetsName(req, res));

module.exports = router;