var express = require('express');
var router = express.Router();
var mongoose = require ('mongoose');
var multer = require ('multer');
var upload = multer({ dest: 'uploads/' });

// Set up database connection
var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/atom-apps-website';
// Set up the port
var theport = process.env.PORT || 5000;

// Connect to the database
mongoose.connect(uristring, function (err, res) {
  if (err)
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  else
    console.log ('Succeeded connected to: ' + uristring);
});

// Define app schema
var appSchema = new mongoose.Schema({
      title: String,
      id: {
        type: String,
        index: { unique: true }
      },
      review: {
        type: Number, min: 0, max: 5
      },
      description: String,
      features: String,
      screenshots: [String],
      googlePlayLink: String,
      appStoreLink: String,
      windowsStoreLink: String,
      amazonStoreLink: String,
      steamLink: String
    });

// Define the schema in mongoose and get the model
var App = mongoose.model ('app', appSchema);

// Get json list of all apps
router.get('/all-apps', function (req, res) {
    // Get top 10 apps
    App.find ().sort ({review: -1}).exec (function (error, results) {
      console.log ("Sending app list json");
      res.json (results);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Atom Apps - Home' });

});

/* GET home page. */
router.get('/apps/*', function(req, res, next) {

  var id = req.url.substring(6);

  if (id == '' || id == undefined)
  	res.render('app-list', {
  		title: 'Atom Apps - All Apps'
  	});
  else {

  	res.render('app-profile', {
  		title: 'Atom Apps - ',
  	});
  }

});

// The upload object
var upload = upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'screenshot', maxCount: 20 }]);

// Get the app edit form page
router.get ('/app-edit', checkAuth, function (req, res) {
  res.render ('app-edit');
});

// Get the delete app request
router.get('/delete-app/:id', checkAuth, function (req, res) {
  var id = req.params.id;
  console.log (id);
  App.find ({id: id}).remove ().exec ();
  res.redirect ('/app-edit');
});

// Get the added app
router.post('/add-app', checkAuth, upload, function (req, res) {
  console.log ('Receiving add-app form data.');

  var post = req.body;

  // Get posted variables
  var re = new RegExp(' ', 'g');
  var id = post.title.replace (re, '').toLowerCase();
  var screenshotCount = post.screenshotCount;

  // Declare the new server path
  var serverPath = process.env.PWD + '/public/img/' + id;

  var fs = require ('fs');
  var path = require ('path');

  // Create folder in public/img for app
  fs.mkdir (serverPath);
  fs.mkdir (serverPath + '/screenshots');

  // Copy app icon
  fs.rename (
    req.files.icon[0].path,
    serverPath + '/icon' + path.extname(req.files.icon[0].originalname)
  );

  // Construct new app
  var app = new App;
  app.title = post.title;
  app.id = id;
  app.review = parseFloat(post.review);
  app.googlePlayLink = post.googlePlayLink;
  app.appStoreLink = post.appStoreLink;
  app.windowsStoreLink = post.windowsStoreLink;
  app.amazonLink = post.amazonLink;
  app.steamLink = post.steamLink;
  app.description = post.description;
  app.features = post.features;
  app.screenshots = [];

  // For all screenshots, copy to correct location
  for (var i=0; i<req.files.screenshot.length; i++) {
    var name = 'screenshot' + i + path.extname(req.files.screenshot[i].originalname);
    console.log (name);
    app.screenshots.push (name);
    fs.rename (
      req.files.screenshot[i].path,
      serverPath + '/screenshots/' + name
    );
  }

  app.save ();

  res.redirect ('/app-edit');

});

// Log in page
router.get ('/login', function (req, res) {
  res.render ('admin-login', {failed: false});
});

// Log in
router.post ('/login', function (req, res) {
  var post = req.body;
  if (post.username === 'mr_adam_lewis@sky.com' && post.password === '55C4W23j?') {
    req.session.user_id = 'a5256addfe4166ba20fbe81274accafcee24b0107ccaf84e64590acdc9e8e0c1';
    res.redirect('/app-edit');
  } else {
    res.render ('admin-login', {failed: true});
  }
});

// Log out
router.get ('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});

/**
 * Checks the authorization of the user
 */
function checkAuth(req, res, next) {
  if (req.session.user_id !== 'a5256addfe4166ba20fbe81274accafcee24b0107ccaf84e64590acdc9e8e0c1') {
    res.render ('admin-login', {failed: true})
  } else {
    next();
  }
}

module.exports = router;
