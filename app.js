var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override"),
    models = require('./models/index'),
    // ejs-locals, for layouts
    engine = require('ejs-locals'),
    flash = require('connect-flash'),
    session = require("cookie-session");

var app = express();

app.set("view engine", "ejs");

// this is different from setting the view engine
// it enables the layout functionality
app.engine('ejs', engine);

app.use(methodOverride("_method"));

app.use(express.static(__dirname + '/public'));

// enable the session
// the session needs a key
// with which to encode the session values
// exposed to us by require('connect-flash')
app.use(session({
  keys: ['key']
}));

app.use(flash());

// Modules to use with Passport
var passport = require("passport"),
    localStrategy = require("passport-local").Strategy;

// Setup passport
app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  maxage: 3600000
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    models.User.find({
        where: {
            id: id
        }
    }).done(function(error,user){
        done(error, user);
    });
});


app.set("view engine", "ejs");

// use body parser to use req.body.
app.use(bodyParser.urlencoded({
  extended: true
}));

/********************************************************************************/


app.get("/", function(req, res) {
  res.redirect("/managers");
});

app.get("/managers", function(req, res) {
  // console.log(req.flash('info'));
  models.Manager.findAll().then(function(managers) { 
    res.render('index', { 
      managers: managers,
      messages: req.flash('info')
       });
  });
});

app.get("/managers/:id/tenants", function(req, res) {
  var managerId = req.params.id;
  models.Tenant.findAll(
    { where: { manager_id: parseInt(managerId, 10) } }
  ).then(function(tenants) {
    res.render('tenants', { 
      tenants: tenants,
      managerID: managerId,
      messages: req.flash('info')
     });
  });
});

app.post("/managers", function(req, res) {
  models.Manager.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    property: req.body.property
  }).then(function(manager) {
    res.redirect('/managers');
  }, function(error){
    // console.log(error);
    req.flash('info', error);
    res.redirect('/managers');
  });
});

app.post("/managers/:id/tenants", function(req, res) {
  // console.log(req.body.ten_first_name, req.body.ten_last_name, parseInt(req.params.id, 10));
  var managerId = parseInt(req.params.id, 10),
      path = ['/managers/', managerId, '/tenants'].join(''),
      tenant = models.Tenant.build({
          firstname: req.body.ten_first_name,
          lastname: req.body.ten_last_name,
          manager_id: managerId
        });


  models.Manager
    .find(managerId)
    .then(function(manager){
      manager.addTenant(tenant)
      .catch(function(error){
            req.flash('info', error);
      })
      .finally(function(){
            res.redirect(path);
      });
    });
});

/********************************************************************************/



app.listen(3000);















