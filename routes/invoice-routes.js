const express = require("express");
const { checkAuthenticated } = require("../utils/passportCheck");
const { checkedDuplicate, returnNoDuplicate, changeDateFormat } = require("../utils/func");
const { generatePdf, generatePdfBooking } = require("../utils/generate");

require("../utils/db");
const Cafe = require("../model/cafe");
const FormCapacity = require("../model/form-capacity");
const Capacity = require("../model/capacity");
const Food = require("../model/food");
const FormFood = require("../model/form-food");
const Checkout = require("../model/checkout");

const router = express.Router();

router.get("/invoice/:kodeinv", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;
  let formCheckout = await Checkout.findOne({ idUser: dataUser.id, kodeInv: req.params.kodeinv }).lean();
  let formFoods = [];
  let foods = [];

  //ADA PR
  //UNTUK MENGUBAH FORMFOODS STATUS YANG HANYA CONFIRMED
  let formCapacities, caves;
  if (formCheckout) {
    formCapacities = await FormCapacity.findOne({ idCafe: formCheckout.idCafe, idUser: formCheckout.idUser, status: "waiting" }).lean();
    caves = await Cafe.findOne({ idCafe: formCheckout.idCafe }).lean();
    for (let i = 0; i < formCheckout.idMenu.length; i++) {
      console.log("hai geyss");
      try {
        let formFood = await FormFood.find({ idCafe: formCheckout.idCafe, idUser: dataUser.id, idMenu: formCheckout.idMenu[i] }).lean();
        let food = await Food.find({ idCafe: formCheckout.idCafe, idMenu: formCheckout.idMenu[i] }).lean();
        if (food && formFood) {
          formFoods.push(...formFood);
          foods.push(...food);
        }
      } catch (err) {
        if (err) throw err;
      }
    }
  } else {
    formCheckout = null;
  }

  for (let i = 0; i < formFoods.length; i++) {
    if (foods[i]) {
      formFoods[i].namaMenu = foods[i].namaMenu;
      formFoods[i].hargaMenu = foods[i].harga;
    }
  }

  let data = {
    dataUser: dataUser,
    formCheckout: formCheckout,
    formFoods: formFoods,
    foods: foods,
    formCapacities: formCapacities,
    caves: caves,
  };

  let filename;
  let filenameBooking;
  try {
    filename = req.params.kodeinv + "_doc" + ".pdf";
    generatePdf(filename, data);
  } catch (err) {
    console.log(err);
  }

  try {
    if (formCheckout.kodeBooking) {
      filenameBooking = formCheckout.kodeBooking + "_doc" + ".pdf";
      generatePdfBooking(filenameBooking, data);
    } else {
      console.log("waiting for Booking Code from admin");
    }
  } catch (err) {
    console.log(err);
  }

  res.render("invoice", {
    layout: "layouts/main-layout-pay",
    title: "Kode Invoice",
    dataUser,
    formCheckout,
    formFoods,
    foods,
    formCapacities,
    caves,
    filename: filename,
    filenameBooking: filenameBooking,
  });
});

module.exports = { routes: router };
