//For Photo Upload
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

//Database
require("../utils/db");
const User = require("../model/user");
const Cafe = require("../model/cafe");
const Capacity = require("../model/capacity");
const FormCapacity = require("../model/form-capacity");
const Food = require("../model/food");
const FormFood = require("../model/form-food");
const Checkout = require("../model/checkout");
const { checkedDuplicate, returnNoDuplicate, changeDateFormat } = require("../utils/func");
const { checkAuthenticated, checkNotAuthenticatedSecond, checkNotAuthenticated } = require("../utils/passportCheck");

const router = express.Router();
const app = express();
app.use(bodyParser.json());

//For GridFS
const mongoUrl = `mongodb+srv://tongkrongin:tongkrongin2022@tongkrongin.i1nix.mongodb.net/tongkrongin?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

//Init gfs
let gfs;
let gridFSBucket;
conn.once("open", async () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploadPayment",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploadPayment");
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
          bucketName: "uploadPayment",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.post("/payment", upload.single("file"), async (req, res) => {
  let tahunIni = new Date().getFullYear();
  let bulanIni = Number(new Date().getMonth()) + 1;
  let tanggalIni = new Date().getDate();
  let jamIni = new Date().getHours();
  let menitIni = new Date().getMinutes();
  let jamBayar = `${jamIni.length == 1 ? `0${jamIni}` : jamIni}:${menitIni.length == 1 ? `0${menitIni}` : menitIni}`;
  let idCafe = req.body.idcafe;
  let idUser = req.body.iduser;
  let jumlahCheckout = await Checkout.find({ idUser: req.body.iduser });

  let invoice;
  try {
    invoice = ["INV", `${tahunIni}${bulanIni}${tanggalIni}`, jumlahCheckout.length, idCafe, idUser].join("_");
  } catch (error) {
    console.log(error);
  }

  console.log(req.body.namaRekening);

  Checkout.updateOne(
    {
      idUser: req.body.iduser,
      idCafe: req.body.idcafe,
      status: "pending",
    },
    {
      $set: {
        kodeInv: invoice,
        tanggalBayar: changeDateFormat([tahunIni, bulanIni, tanggalIni].join("-")),
        jamBayar: jamBayar,
        status: "waiting",
        fileImage: imageFileName[0],
        namaBank: req.body.namaBank,
        namaRekening: req.body.namaRekening,
        nomorRekening: req.body.nomorRekening,
      },
    }
  ).then((result) => {
    FormCapacity.updateOne(
      {
        idUser: req.body.iduser,
        idCafe: req.body.idcafe,
        status: "pending",
      },
      {
        $set: {
          status: "waiting",
        },
      }
    ).then((result) => {
      FormFood.updateMany(
        {
          idUser: req.body.iduser,
          idCafe: req.body.idcafe,
          status: "pending",
        },
        {
          $set: {
            status: "waiting",
          },
        }
      ).then((result) => {
        res.redirect("/invoice/" + invoice);
      });
    });
  });
});

router.get("/pay", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;
  let formCheckout = await Checkout.findOne({ idUser: dataUser.id, status: "pending" });
  let formFoods = [];
  let foods = [];

  let formCapacities, caves;
  if (formCheckout) {
    formCapacities = await FormCapacity.findOne({ idUser: formCheckout.idUser, status: "pending" });
    caves = await Cafe.findOne({ idCafe: formCheckout.idCafe });
    for (let i = 0; i < formCheckout.idMenu.length; i++) {
      try {
        let formFood = await FormFood.find({ idCafe: formCheckout.idCafe, idUser: dataUser.id, idMenu: formCheckout.idMenu[i], status: "pending" });
        let food = await Food.find({ idCafe: formCheckout.idCafe, idMenu: formCheckout.idMenu[i] });
        if (food && formFood) {
          formFoods.push(...formFood);
          foods.push(...food);
        }
      } catch (err) {
        if (err) throw err;
      }
    }
  }

  res.render("pay", {
    layout: "layouts/main-layout-pay",
    title: "Form Pembayaran",
    dataUser,
    formCheckout,
    formFoods,
    foods,
    formCapacities,
    caves,
  });
});
module.exports = { routes: router };
