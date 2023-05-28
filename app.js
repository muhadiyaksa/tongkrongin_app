if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//For Express
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

//For Validation
const methodOverride = require("method-override");
// const { unlinkSync } = require("fs");

//For Message
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const passport = require("passport");

//For Schema Database
require("./utils/db");
const User = require("./model/user");

//For Photo Upload
const bodyParser = require("body-parser");

//For Regist
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  async (email) => await User.findOne({ email: email }),
  async (id) => await User.findOne({ id: id })
);

//For Function
const paymentRoutes = require("./routes/payment-routes");
const userRoutes = require("./routes/user-routes");
const homeRoutes = require("./routes/home-routes");
const loginRegistRoutes = require("./routes/login-regist");
const cafeRoutes = require("./routes/cafe-routes");
const cartRoutes = require("./routes/cart-routes");
const invoiceRoutes = require("./routes/invoice-routes");

//Running Server
const app = express();
const port = process.env.PORT || 3000;

//Reset delimeter dari % ke ? (supaya mirip PHP)
ejs.delimiter = "?";

//Penggunaan EJS
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

//Use Express
app.use(expressLayouts); //Third-party middleware
app.use(express.static("public")); //Built in middleware
app.use(express.urlencoded({ extended: true })); //Built In Middleware
// app.use(busboy());
// app.use(fileupload());k

//konfigurasi flash
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//For Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//For Express req.body
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------
//ROUTES

//HOME ROUTES
app.use(homeRoutes.routes);

//USER ROUTES
app.use(userRoutes.routes);

//CAFE ROUTES
app.use(cafeRoutes.routes);

//CART ROUTES
app.use(cartRoutes.routes);

//PAYMENT ROUTES
app.use(paymentRoutes.routes);

//INVOICE ROUTES
app.use(invoiceRoutes.routes);

//LOGIN REGIST ROUTES
app.use(loginRegistRoutes.routes);

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("Halaman Tidak Ditemukan");
});

//Menjalankan LocalHost
app.listen(port, () => {
  console.log(`Tongkrongin App | Listening at http://localhost:${port}`);
});
