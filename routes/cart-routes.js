const express = require("express");
const { checkAuthenticated } = require("../utils/passportCheck");
const { changeDateFormat } = require("../utils/func");

require("../utils/db");
const Cafe = require("../model/cafe");
const FormCapacity = require("../model/form-capacity");
const Capacity = require("../model/capacity");
const Food = require("../model/food");
const FormFood = require("../model/form-food");
const Checkout = require("../model/checkout");

const router = express.Router();

//Halaman Keranjang
router.get("/cart", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;

  let formCapacities, formFoods, capacities, foods, caves, formCheckout;

  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });

    if (formCapacities) {
      formFoods = await FormFood.find({ idCafe: formCapacities.idCafe, idUser: dataUser.id, status: "pending" });
      foods = await Food.find({ idCafe: formCapacities.idCafe });
      caves = await Cafe.findOne({ idCafe: formCapacities.idCafe });
      capacities = await Capacity.findOne({ idCafe: formCapacities.idCafe, idUser: req.user.id, kapKategori: formCapacities.kapKategori });
    }
  } else {
    formCapacities = null;
  }

  res.render("keranjang", {
    layout: "layouts/main-layout-cart",
    title: "Keranjang",
    formFoods,
    formCapacities,
    dataUser,
    capacities,
    foods,
    caves,
    formCheckout: !formCheckout ? [] : formCheckout,
  });
});

router.delete("/cart", (req, res) => {
  FormCapacity.deleteOne({ idUser: req.body.iduser, status: "pending" }).then((result) => {
    FormFood.deleteMany({ idUser: req.body.iduser, status: "pending" }).then((error, result) => {
      res.redirect("/cart");
    });
  });
});

router.delete("/cart/food", (req, res) => {
  FormFood.deleteOne({ idUser: req.body.iduser, idMenu: req.body.idmenu, idCafe: req.body.idcafe, status: "pending" }).then((error, result) => {
    res.redirect("/cart");
  });
});

router.put("/cart/qtymin", async (req, res) => {
  let formFoods = await FormFood.findOne({ idCafe: req.body.idcafe, idUser: req.body.iduser, idMenu: req.body.idmenu, status: "pending" });
  let foods = await Food.findOne({ idCafe: req.body.idcafe, idMenu: req.body.idmenu });

  let qtyUpdate = Number(formFoods.quantity) - 1;
  let priceUpdate = Number(formFoods.harga) - Number(foods.harga);

  FormFood.updateOne(
    {
      idUser: req.body.iduser,
      idCafe: req.body.idcafe,
      idMenu: req.body.idmenu,
      status: "pending",
    },
    {
      $set: {
        quantity: qtyUpdate.toString(),
        harga: priceUpdate.toString(),
      },
    }
  ).then((result) => {
    res.redirect("/cart");
  });
});

router.put("/cart/qtyplus", async (req, res) => {
  let formFoods = await FormFood.findOne({ idCafe: req.body.idcafe, idUser: req.body.iduser, idMenu: req.body.idmenu, status: "pending" });
  let foods = await Food.findOne({ idCafe: req.body.idcafe, idMenu: req.body.idmenu });

  let qtyUpdate = Number(formFoods.quantity) + 1;
  let priceUpdate = Number(formFoods.harga) + Number(foods.harga);

  FormFood.updateOne(
    {
      idUser: req.body.iduser,
      idCafe: req.body.idcafe,
      idMenu: req.body.idmenu,
      status: "pending",
    },
    {
      $set: {
        quantity: qtyUpdate.toString(),
        harga: priceUpdate.toString(),
      },
    }
  ).then((result) => {
    res.redirect("/cart");
  });
});

router.post("/cart", async (req, res) => {
  const dataOldCart = await Checkout.find({ idUser: req.body.iduser, idCafe: req.body.idcafe, status: "pending" });
  let tanggal = new Date().getDate();
  let bulan = Number(new Date().getMonth()) + 1;
  let tahun = new Date().getFullYear();

  const dataMasuk = {
    idUser: req.body.iduser,
    idCafe: req.body.idcafe,
    idMenu: req.body.idmenu.split(","),
    catatan: req.body.catatan,
    total: req.body.total,
    tanggalPesan: changeDateFormat(req.body.waktu),
    waktuPesan: req.body.waktu,
    jamPesan: req.body.jamPesan,
    tanggalCheckout: changeDateFormat([tahun, bulan, tanggal].join("-")),
    waktuCheckout: [tahun, bulan, tanggal].join("-"),
    jamCheckout: `${new Date().getHours()}:${new Date().getMinutes()}`,
    status: "pending",
  };
  if (dataOldCart.length !== 0 || dataOldCart !== null) {
    Checkout.deleteMany({ idUser: req.body.iduser, status: "pending" }).then((result) => {
      Checkout.insertMany(dataMasuk, (error, result) => {
        if (error) throw error;
        res.redirect("/pay");
      });
    });
  } else {
    Checkout.insertMany(dataMasuk, (error, result) => {
      if (error) throw error;
      res.redirect("/pay");
    });
  }
});

module.exports = { routes: router };
