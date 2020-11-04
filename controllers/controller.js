// put api routes here
// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/user/' + req.user.username);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/newuser", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/user");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  app.post("/api/comic", function(req, res) {
    db.Calendar.create(req)
  })
  // app.get("/api/current_comic", function(req, res) {

  // })

  app.post("/api/newEvent", function(req, res) {
    db.Task.create(req.body).then(function(data) {
      res.json(data);
    });
  })

  // Deletes task when delete button is pressed.
  app.delete("/api/task/", function(req, res) {
    db.task.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  // Gets all dates and tasks based on the user's email.
  app.get("/api/tasks", function(req, res) {
    db.User.findAll({
      where: {
        email: req.user.email
      },
      include: [db.Calendar, db.Task]
    }).then(function(data) {
      res.json(data);
    });
  });
  // // Route for logging user out
  // app.get("/logout", function(req, res) {
  //   req.logout();
  //   res.redirect("/");
  // });

  // // Route for getting some data about our user to be used client side
 app.get("/api/user_data", function(req, res) {
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
    }
  });
};