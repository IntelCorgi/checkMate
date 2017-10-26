var express = require("express");
var router = express.Router();
var db = require("../models");

//get route -> redirect to login
router.get("/", function(req, res) {
  res.redirect("/login");
});

// get route to grab all prospect data
router.get("/prospects", function(req, res) {
  db.entities_db.findAll({
    include: [db.prospectInfo],
    // Here we specify we want to return our burgers in ordered by ascending burger_name
    order: [
      ["prospectName", "ASC"]
    ]
  })
  .then(function(entities_db) {
    var hbsObject = {
      prospects: entities_db
    };
    return res.render("home", hbsObject);
  });
});

// post route to create burgers
router.post("/prospects/create", function(req, res) {
  db.entities_db.create({
    prospectName: req.body.prospect_name
  })
  // pass the result of our call
  .then(function(dbBurger) {
    // log the result to our terminal/bash window
    console.log(dbBurger);
    // redirect
    res.redirect("/");
  });
});

// put route to devour a burger
router.put("/burgers/update", function(req, res) {
  // If we are given a customer, create the customer and give them this devoured burger
  if (req.body.customer) {
    db.Customer.create({
      customer: req.body.customer,
      BurgerId: req.body.burger_id
    })
    .then(function(dbCustomer) {
      return db.Burger.update({
        devoured: true
      }, {
        where: {
          id: req.body.burger_id
        }
      });
    })
    .then(function(dbBurger) {
      res.redirect("/");
    });
  }
  // If we aren't given a customer, just update the burger to be devoured
  else {
    db.Burger.update({
      devoured: true
    }, {
      where: {
        id: req.body.burger_id
      }
    })
    .then(function(dbBurger) {
      res.redirect("/");
    });
  }
});

//Passport routing
app.post('/login',
passport.authenticate('local', { successRedirect: '/',
                                 failureRedirect: '/login',
                                 failureFlash: true }))
//exports routing data
module.exports = router;