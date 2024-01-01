const express = require("express");
const app = express();
const expressSession = require("express-session");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const { connectMongoose, User } = require("./database");
connectMongoose();

const passport = require("passport");
const { initializingPassport, isAuthenticated } = require("./passportConfig");
initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

// Views
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

/* Auth endpoints */

// Create User
app.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    return res.status(400).send("User already exist.");
  }

  const newUser = await User.create(req.body);
  res.status(201).send(newUser);
});

// Login user
app.post("/login", passport.authenticate("local"), function (req, res) {
  res.json(req.user);
});

// get current user (Private route)
app.get("/profile", isAuthenticated, (req, res) => {
  res.send(req.user);
});

// Logout user
app.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Logged out.");
    }
  });
});

app.listen(3000, () => {
  console.log("app listening at http://localhost:3000");
});
