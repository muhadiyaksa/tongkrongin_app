//For Photo Upload
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

//Database
require("../utils/db");
const User = require("../model/user");
const Cafe = require("../model/cafe");
const FormCapacity = require("../model/form-capacity");
const Checkout = require("../model/checkout");

const { body, validationResult, check } = require("express-validator");
const { checkAuthenticated } = require("../utils/passportCheck");

const router = express.Router();

//For GridFS
const mongoUrl = `mongodb+srv://tongkrongin:tongkrongin2022@tongkrongin.i1nix.mongodb.net/tongkrongin?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

//Init gfs
let gfs;
let gridFSBucket;
conn.once("open", async () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploadUserProfile",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploadUserProfile");
});

//Create Storage Engine
let imageFileName = [];
const storage = new GridFsStorage({
  url: mongoUrl,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        imageFileName.push(filename);
        const fileInfo = {
          filename: filename,
          bucketName: "uploadUserProfile",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.put("/uploadfoto", upload.single("file"), (req, res) => {
  User.updateOne(
    { id: req.body.id },
    {
      $set: {
        nama: req.body.nama,
        email: req.body.email,
        notelp: req.body.notelp,
        password: req.body.password,
        passwordChecked: req.body.passwordChecked,
        fotoprofil: imageFileName[0],
        fotoprofilLama: req.body.fotoprofilLama,
      },
    }
  ).then((result) => {
    req.flash("msg", "Foto Profil kamu Berhasil diUbah! ");
    res.redirect("/user/update/" + req.body.id);
  });
});

router.get("/image/:filename", checkAuthenticated, (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file Exist",
      });
    } else {
      if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
        const readStream = gridFSBucket.openDownloadStream(file._id);
        readStream.pipe(res);
      } else {
        res.status(404).json({
          err: "not an image",
        });
      }
    }
  });
});

//Halaman User
router.get("/user/:id", checkAuthenticated, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const formCheckout = await Checkout.find({ idUser: req.params.id });

  const dataUser = await req.user;
  let caves = [];
  let formCap = [];
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });

    for (let i = 0; i < formCheckout.length; i++) {
      try {
        let cafe = await Cafe.find({ idCafe: formCheckout[i].idCafe });
        let formCapacity = await FormCapacity.find({ idCafe: formCheckout[i].idCafe, idUser: dataUser.id });
        if (cafe && formCapacity) {
          caves.push(...cafe);
          formCap.push(...formCapacity);
        }
      } catch (err) {
        if (err) throw err;
      }
    }
  }

  try {
    gfs.files.findOne({ filename: user ? user.fotoprofil : "" }, (err, file) => {
      res.render("user-profile", {
        title: "Halaman User",
        layout: "layouts/main-layout-user",
        user,
        dataUser,
        msg: req.flash("msg"),
        formCapacities,
        formCap,
        formCheckout,
        caves,
        files: file,
      });
    });
  } catch (err) {
    console.log(err);
  }
});

//Menuju Halaman Edit Profle
router.get("/user/update/:id", checkAuthenticated, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const dataUser = await req.user;
  let formCheckout;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });
  }
  try {
    gfs.files.findOne({ filename: user ? user.fotoprofil : "" }, (err, file) => {
      res.render("user-update", {
        title: "Halaman Update",
        layout: "layouts/main-layout-user",
        user,
        dataUser,
        msg: req.flash("msg"),
        formCapacities,
        files: file,
        formCheckout,
      });
    });
  } catch (err) {
    console.log(err);
  }
});

//Proses Ubah Data
router.put("/user/update", [check("notelp", "Nomor Handphone Tidak Valid!").isMobilePhone("id-ID")], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render("user-update", {
      title: "Halaman Update",
      layout: "layouts/main-layout-user",
      errors: errors.array(),
      user: req.body,
    });
  } else {
    User.updateOne(
      { id: req.body.id },
      {
        $set: {
          nama: req.body.nama,
          email: req.body.email,
          notelp: req.body.notelp,
          password: req.body.password,
          passwordChecked: req.body.passwordChecked,
          jeniskelamin: req.body.jeniskelamin,
          kota: req.body.kota,
          fotoprofil: req.body.filetoupload,
        },
      }
    ).then((result) => {
      req.flash("msg", "Data kamu Berhasil diUbah! ");
      res.redirect("/user/" + req.body.id);
    });
  }
});

//Menuju Halaman Edit Password
router.get("/user/password/:id", checkAuthenticated, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const dataUser = await req.user;
  let formCheckout;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });
  }
  res.render("user-password", {
    title: "Halaman Update",
    layout: "layouts/main-layout-user",
    user,
    dataUser,
    formCapacities,
    formCheckout,
  });
});

//Proses Ubah Data
router.put(
  "/user/password",
  check("password").isLength({ min: 8 }).withMessage("Minimal Panjang Karakter adalah 8").matches(/\d/).withMessage("Harus Berisi Nomor"),
  body("passwordChecked").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Konfirmasi Password tidak sama dengan Password Utama");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("user-password", {
        title: "Halaman Password",
        layout: "layouts/main-layout-user",
        errors: errors.array(),
        user: req.body,
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedPasswordChecked = await bcrypt.hash(req.body.passwordChecked, 10);
      User.updateOne(
        { id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            notelp: req.body.notelp,
            password: hashedPassword,
            passwordChecked: hashedPasswordChecked,
          },
        }
      ).then((result) => {
        req.flash("msg", "Password kamu Berhasil diUbah! ");
        res.redirect("/user/" + req.body.id);
      });
    }
  }
);

module.exports = { routes: router };
