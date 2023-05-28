const express = require("express");
const { checkNotAuthenticated } = require("../utils/passportCheck");
const passport = require("passport");
const bcrypt = require("bcrypt");
// const bcrypt = require("bcrypt-nodejs");
const { body, validationResult, check } = require("express-validator");

require("../utils/db");
const User = require("../model/user");

const router = express.Router();

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", {
    layout: "layouts/main-layout-login",
    title: "Login",
    msg: req.flash("msg"),
  });
});

//Form Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//Halaman Menuju Form Regist
router.get("/regist", checkNotAuthenticated, (req, res) => {
  res.render("regist", {
    layout: "layouts/main-layout-login",
    title: "Regist",
  });
});

//Proses Tambah Data user
router.post(
  "/regist",

  [
    body("email").custom(async (value) => {
      const duplikat = await User.findOne({ email: value });
      if (duplikat) {
        throw new Error("Email Sudah Pernah DiDaftarkan!");
      }
      return true;
    }),
    check("email", "Email tidak Valid!").isEmail(),
    check("notelp", "Nomor Handphone Tidak Valid!").isMobilePhone("id-ID"),
    check("password").isLength({ min: 8 }).withMessage("Password Minimal Karakter adalah 8").matches(/\d/).withMessage("Password Harus Berisi Nomor"),
    body("passwordChecked").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Konfirmasi Password tidak sama dengan Password Utama");
      }
      return true;
    }),
  ],
  checkNotAuthenticated,
  async (req, res) => {
    //tulisan dalam ('email') harus sama persis dengan name(di html)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("regist", {
        title: "Regist",
        layout: "layouts/main-layout-login",
        errors: errors.array(),
      });
    } else {
      // const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedPasswordChecked = await bcrypt.hash(req.body.passwordChecked, 10);
      const dataMasuk = {
        id: Date.now().toString(),
        nama: req.body.nama.toLowerCase(),
        email: req.body.email,
        notelp: req.body.notelp,
        password: req.body.password,
        passwordChecked: hashedPasswordChecked,
      };
      User.insertMany(dataMasuk, (error, result) => {
        req.flash("msg", "Pendaftaran Berhasil, Silahkan Login Terlebih Dahulu");
        res.redirect("/login");
      });
    }
  }
);

module.exports = { routes: router };
