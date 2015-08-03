var express = require('express');
var router = express.Router();

var apps = [
  {
  	title: 'Gravity Sim 3D', 
  	id: 'gravitysim3d',
  	android: true,
  	ios: true,
  	windowsphone: true
  },
  {
  	title: 'Ball Bounce',
  	id: 'ballbounce',
  	android: true,
  	ios: false,
  	windowsphone: false
  },
  {
  	title: 'Word Link',
  	id: 'wordlink',
  	android: true,
  	ios: false,
  	windowsphone: false
  },
  {
  	title: 'Gravity Sim',
  	id: 'gravitysim',
  	android: true,
  	ios: false,
  	windowsphone: false
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Atom Apps - Home', apps: apps });

});

module.exports = router;