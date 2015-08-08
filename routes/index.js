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

/* GET home page. */
router.get('/apps/*', function(req, res, next) {

	var app = {
		title: 'Gravity Sim 3D',
    id: 'gravitysim3d',
    android: true,
    ios: true,
    windowsphone: true,
    reviewstars: 5,
    description: 'Gravity Sim 3D lets you create beautiful little universes that fit in your pocket! <br>Using a realistic model of gravity and an efficient algorithm, Gravity Sim 3D allows you to make huge simulations with numerous bodies. You can also create utterly ridiculous scenarios by locking specific objects in a position. Using black holes and wormholes makes for an interesting time and its really fun too! <br><br>There is currently no universe simulation game that rivals gravity sim on both physical realism and breathtaking beauty.',
    screenshots: ['Screenshot0.jpg', 'Screenshot1.jpg', 'Screenshot2.jpg', 'Screenshot3.jpg', 'Screenshot4.jpg', 'Screenshot5.jpg']
	};

	res.render('app-profile', {
		title: 'Atom Apps - ' + app.title,
		apps: apps,
		app: app
	});

});

module.exports = router;
