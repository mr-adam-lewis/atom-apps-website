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
      carousel: String,
      googlePlayLink: String,
      appStoreLink: String,
      windowsStoreLink: String,
      amazonLink: String,
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

// Get json app profile
router.get('/app/:id', function (req, res) {
  App.findOne ({id: req.params.id}).exec (function (error, results) {
    console.log ("Sending app json");
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
var upload = upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'carousel', maxCount: 1}, { name: 'screenshot', maxCount: 20 }]);

// Get the admin app list page
router.get ('/admin-app-list', checkAuth, function (req, res) {
  res.render ('admin-app-list', {title: 'Atom Apps - Admin'});
});

// Get the admin add app page
router.get ('/admin-add-app', checkAuth, function (req, res) {
  res.render ('admin-add-app', {title: 'Atom Apps - Admin'});
});

// Get the delete app request
router.get('/delete-app/:id', checkAuth, function (req, res) {
  var id = req.params.id;
  console.log ('Deleting app with id ' + id);
  App.find ({id: id}).remove ().exec ();
  DeleteFolderRecursive (process.env.PWD + '/public/img/' + id);
  res.redirect ('/admin-app-list');
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
  if (!fs.existsSync(serverPath))
    fs.mkdir (serverPath);
  if (!fs.existsSync (serverPath + '/screenshots'))
    fs.mkdir (serverPath + '/screenshots');

  // Copy app icon
  fs.rename (
    req.files.icon[0].path,
    serverPath + '/icon' + path.extname(req.files.icon[0].originalname)
  );

  // Copy carousel image
  if (req.files.carousel !== undefined)
    fs.rename (
      req.files.carousel[0].path,
      serverPath + '/carousel' + path.extname(req.files.carousel[0].originalname)
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
  app.description = post.description.replace (/(?:\r\n|\r|\n)/g, '<br>');
  app.features = post.features.replace (/(?:\r\n|\r|\n)/g, '<br>');
  app.screenshots = [];

  if (req.files.carousel !== undefined)
    app.carousel = 'carousel' + path.extname (req.files.carousel[0].originalname);
  else
    app.carousel = '';

  // For all screenshots, copy to correct location
  if (req.files.screenshot != undefined)
    for (var i=0; i<req.files.screenshot.length; i++) {
      var name = 'screenshot' + GenerateRandomString(10) + path.extname(req.files.screenshot[i].originalname);
      app.screenshots.push (name);
      fs.rename (
        req.files.screenshot[i].path,
        serverPath + '/screenshots/' + name
      );
    }

  app.save ();

  res.redirect ('/admin-app-list');

});

// Edit the app
router.post ('/edit-app', checkAuth, upload, function (req, res) {
  console.log ('Receiving edit-app form data.');

  var post = req.body;

  // Get posted variables
  var re = new RegExp(' ', 'g');
  var id = post.id;

  var removedScreenshots = [];
  if (req.body.removeScreenshots != undefined)
    removedScreenshots = req.body.removeScreenshots.split(',');
  var keepScreenshots = [];
  if (req.body.keepScreenshots != undefined)
    keepScreenshots = req.body.keepScreenshots.split(',');

  for (var i=0; i<keepScreenshots.length; i++) {
    for (var j=0; j<removedScreenshots.length; j++)
      if (keepScreenshots[i] == removedScreenshots[j]) {
        keepScreenshots.splice (i, 1);
        i--;
      }
  }

  // Get posted variables
  var screenshotCount = post.screenshotCount;

  // Declare the new server path
  var serverPath = process.env.PWD + '/public/img/' + id;

  var fs = require ('fs');
  var path = require ('path');

  // Create folder in public/img for app
  if (!fs.existsSync(serverPath))
    fs.mkdir (serverPath);
  if (!fs.existsSync (serverPath + '/screenshots'))
    fs.mkdir (serverPath + '/screenshots');

  for (var i=0; i<removedScreenshots.length; i++)
    if (fs.existsSync (serverPath + '/screenshots/' + removedScreenshots[i])
      && !fs.lstatSync (serverPath + '/screenshots/' + removedScreenshots[i]).isDirectory())
      fs.unlinkSync (serverPath + '/screenshots/' + removedScreenshots[i]);

  // Copy app icon
  if (req.files.icon !== undefined)
    fs.rename (
      req.files.icon[0].path,
      serverPath + '/icon' + path.extname(req.files.icon[0].originalname)
    );

  var carousel = undefined;
  // Copy carousel image
  if (req.files.carousel !== undefined) {
    carousel = 'carousel' + path.extname (req.files.carousel[0].originalname);
    fs.rename (
      req.files.carousel[0].path,
      serverPath + '/carousel' + path.extname(req.files.carousel[0].originalname)
    );
  }

  // For all screenshots, copy to correct location
  if (req.files.screenshot !== undefined)
    for (var i=0; i<req.files.screenshot.length; i++) {
      var name = 'screenshot' + GenerateRandomString(10) + path.extname(req.files.screenshot[i].originalname);
      keepScreenshots.push (name);
      fs.rename (
        req.files.screenshot[i].path,
        serverPath + '/screenshots/' + name
      );
    }

  App.findOne({id: id}, function (error, app) {
    app.review = parseFloat(post.review);
    app.googlePlayLink = post.googlePlayLink;
    app.appStoreLink = post.appStoreLink;
    app.windowsStoreLink = post.windowsStoreLink;
    app.amazonLink = post.amazonLink;
    app.steamLink = post.steamLink;
    app.description = post.description.replace (/(?:\r\n|\r|\n)/g, '<br>');
    app.features = post.features.replace (/(?:\r\n|\r|\n)/g, '<br>');
    app.screenshots = keepScreenshots;
    app.carousel = carousel;
    app.save ();
  });

  res.redirect ('/admin-app-list');

});

// Get the admin edit page
router.get ('/admin-edit-app/:id', checkAuth, function (req, res) {
  var id = req.params.id;
  res.render ('admin-edit-app', {title: 'Atom Apps - '});
});

// Log in page
router.get ('/login', function (req, res) {
  if (req.session.user_id == 'a5256addfe4166ba20fbe81274accafcee24b0107ccaf84e64590acdc9e8e0c1')
    res.render ('admin-app-list');
  else
    res.render ('admin-login', {title: 'Atom Apps - Login', failed: false});
});

// Log in
router.post ('/login', function (req, res) {
  var post = req.body;
  if ((post.username === 'mr_adam_lewis@sky.com' && post.password === '55C4W23j?')
      || (post.username === 'tomvardy.home@googlemail.com' && post.password === '70Mv4rDy')) {
    req.session.user_id = 'a5256addfe4166ba20fbe81274accafcee24b0107ccaf84e64590acdc9e8e0c1';
    res.redirect('../admin-app-list');
  } else {
    res.render ('admin-login', {failed: true});
  }
});

// Log out
router.get ('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('../login');
});

// Coming Soon Page
router.get('/coming-soon', function (req, res) {
  res.render ('coming-soon', {title: 'Atom Apps - Coming Soon'});
});

// About Page
router.get('/about', function (req, res) {
  res.render ('about', {title: 'Atom Apps - About'});
});

// Contact Page
router.get('/contact', function (req, res) {
  res.render ('contact', {title: 'Atom Apps - Contact'});
});

/**
 * Checks the authorization of the user
 */
function checkAuth(req, res, next) {
  if (req.session.user_id !== 'a5256addfe4166ba20fbe81274accafcee24b0107ccaf84e64590acdc9e8e0c1') {
    res.render ('admin-login', {title: 'Atom Apps - Login', failed: true})
  } else {
    next();
  }
}

/**
 * Deletes a folder and its contents
 */
function DeleteFolderRecursive (path) {
  var fs = require ('fs');
  console.log (path);
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        DeleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

/**
 * Generates a random string of the given length
 * @param length the length of the string to generate
 */
function GenerateRandomString (length) {
  var alphanum = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var str = '';
  for (var i=0; i<length; i++)
    str += alphanum.charAt (Math.floor (Math.random () * alphanum.length));
  return str;
}

module.exports = router;
