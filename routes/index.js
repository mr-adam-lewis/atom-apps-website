var express = require('express');
var router = express.Router();

var apps = [
  {title: 'Gravity Sim 3D', id: 'gravitysim3d'},
  {title: 'Gravity Sim', id: 'gravitysim'},
  {title: 'Word Link', id: 'wordlink'}
];

/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Atom Apps - Home', apps: apps });

});

module.exports = router;