var express = require("express");
var index = require("./db/index");
const passport = require('passport')
const session = require('express-session')
const flash=require('connect-flash')
const secret=require('./service/key')
const app = express();
app.use(flash())

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
