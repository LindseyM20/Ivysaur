// put api routes here
// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/user');
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/newuser", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    };
  });

  app.get("/api/tasks/:id", function (req, res) {
    db.Task.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  app.post("/api/newEvent", function (req, res) {
    db.Task.create(req.body).then(function (data) {
      res.json(data);
    });
  })

  app.post("/api/comic", function (req, res) {
    console.log(req.body);
    db.Calendar.findAll({
      where: {
        postNum: req.body.postNum
      }
    }).then(function (data) {
      if (data.length > 0) {
        res.json(data);
      }
      else {
        return db.Calendar.create(req.body)
      }
    }).then(function (data) {
      res.json(data);
    });
  })
  
  // Deletes task when delete button is pressed.
  app.post("/api/task", function (req, res) {
    console.log(req.body.id);
    db.Task.destroy({
      where: {
        id: req.body.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  // Gets all dates and tasks based on the user's email.

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // // Route for getting some data about our user to be used client side
  app.get("/api/saved_comic/:date", function (req, res) {
    console.log(req.params);
    db.Calendar.findAll({
      where: {
        date: req.params.date
      },
      order: 
        [['id', 'DESC']]
    }).then(function(data) {
      console.log(data)
      if (data.length > 0){
      res.json(data[0]);
      }
      else {
        res.json({date: ""})
      }
    });
  });
};