const express = require("express");
const app = express();
const port = process.env.port || 8080;
const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const user_list = require("./db/user-list.json");

passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: "xsuaa" } }).uaa));

app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false }));

app.get("/", (req, res, next) => {
  res.send("Welcome to management dashboard");
});

app.get("/getUserlist", checkScope, (req, res, next) => {
  var result = [];
  for (let user in user_list) {
    result.push(user_list[user]);
  }
  res.send(result);
});

app.get("/getUserByEmail", (req, res, next) => {
  var result = [];
  for (let user in user_list) {
    if (req.query.email == user.email) {
      result.push(user_list[user]);
      break;
    }
  }
  res.send(result);
});

function checkScope(req, res, next) {
  if (req.authInfo.checkLocalScope("read")) {
    next();
  } else {
    res.status(403).end("Forbidden");
  }
}
app.listen(port, console.log(`Listening on port ${port}`));
