const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const connectToDatabase = require("./config/connection");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const hbs = require("express-handlebars");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("view engine", "hbs");

connectToDatabase();

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  })
);

app.use((req, res, next) => {
  if (!req.user) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.header("Express", "-2");
  }
  next();
});

app.use("/", userRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.message === "not enough Images") {
    return res.render("admin/add-images", {
      loggedIn: true,
      layout: "admin-layout",
      imgErr: "Please Add All Images",
    });
  }
  if (err.message === "File too large") {
    return res.render("admin/add-images", {
      loggedIn: true,
      layout: "admin-layout",
      imgErr: "Please Add Images with size less than 11 Mb",
    });
  }
  if (err.message === "Invalid file type") {
    return res.render("admin/add-images", {
      loggedIn: true,
      layout: "admin-layout",
      imgErr: "Please Add Only Image Files",
    });
  }
  if (err.message === "Invalid single file type") {
    return res.render("admin/edit-images", {
      loggedIn: true,
      layout: "admin-layout",
      imgErr: "Please Add Only Image Files",
    });
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
