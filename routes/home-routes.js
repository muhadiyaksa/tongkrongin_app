//Landing Page
const express = require("express");
const { checkAuthenticated, checkNotAuthenticatedSecond, checkNotAuthenticated } = require("../utils/passportCheck");

require("../utils/db");
const Cafe = require("../model/cafe");
const FormCapacity = require("../model/form-capacity");
const Checkout = require("../model/checkout");

const router = express.Router();

router.get("/", checkNotAuthenticatedSecond, async (req, res) => {
  const caves = await Cafe.find();

  res.render("index", {
    layout: "layouts/main-layout-primary",
    title: "Tongkrongin",
    formCapacities: null,
    dataUser: null,
    caves,
    formCheckout: [],
  });
});

//Home Page
router.get("/home", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;
  const caves = await Cafe.find();
  let formCapacities, formCheckout;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });
  }
  res.render("index", {
    layout: "layouts/main-layout-primary",
    title: "Tongkrongin",
    dataUser,
    caves,
    formCapacities,
    formCheckout: !formCheckout ? [] : formCheckout,
  });
});

router.get("/about", async (req, res) => {
  const dataUser = await req.user;
  const caves = await Cafe.find();

  let formCapacities, formCheckout;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });
  }
  res.render("about", {
    title: "Tentang Kami",
    layout: "layouts/main-layout-primary",
    dataUser,
    caves,
    formCapacities,
    formCheckout: !formCheckout ? [] : formCheckout,
  });
});

router.post("/search", async (req, res) => {
  const cafeSearch = await Cafe.find();
  let pattern = new RegExp(req.body.search);
  let caves = cafeSearch.filter((el) => pattern.test(el.nama.toLowerCase()));

  const dataUser = await req.user;
  let formCapacities, formCheckout;
  if (dataUser) {
    formCheckout = await Checkout.find({ idUser: dataUser.id });
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
  }

  if (caves) {
    res.render("cafe", {
      layout: "layouts/main-layout-list",
      title: "List Cafe",
      dataUser,
      caves,
      formCapacities,
      formCheckout: !formCheckout ? [] : formCheckout,
    });
  }
});

module.exports = { routes: router };
