var express = require("express");
var index = require("./db/index");
const passport = require('passport')
const session = require('express-session')
const flash=require('connect-flash')
const secret=require('./service/key')
const app = express();
app.use(flash())
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.use(session({
  secret:secret.sessionsecret
}))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use("/student", require("./routes/studentRoutes"));
app.use("/company", require("./routes/companyRoutes"));
module.exports = app;
// app.listen(3001);
