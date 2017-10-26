///// Dependencies & Setup //////

//Requirements
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

//hook models
var db = require("./models");

//establish express
var app = express();
app.use(express.static(__dirname + "./public"));

//establish parser
app.use(bodyParser.urlencoded({
  extended: false
}));

//override POST
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

//establish Handlebars
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));

app.set("view engine", "handlebars");

///// Routing /////

var routes = require("./controllers/entities_controller");

app.use("/", routes);
//NOTE: "/" will be the landing / login page
app.use("/login", routes);
app.use("/home", routes);
app.use("/screen", routes);

///// Passport Auth /////

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}
));

///// Server setup /////

//listen port 3000
var port = process.env.PORT || 3000;
db.sequelize.sync().then(function() {
  app.listen(port);
});