const express = require("express");
const { checkAuthenticated } = require("../utils/passportCheck");
const { checkedDuplicate, returnNoDuplicate, changeDateFormat } = require("../utils/func");

require("../utils/db");
const Cafe = require("../model/cafe");
const FormCapacity = require("../model/form-capacity");
const Capacity = require("../model/capacity");
const Food = require("../model/food");
const FormFood = require("../model/form-food");
const Checkout = require("../model/checkout");

const router = express.Router();

//Halaman Cafe
router.get("/cafe", async (req, res) => {
  const dataUser = await req.user;
  const caves = await Cafe.find();
  let formCapacities, formCheckout;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });
  }
  console.log(formCheckout);
  res.render("cafe", {
    layout: "layouts/main-layout-list",
    title: "List Cafe",
    dataUser,
    caves,
    formCapacities,
    formCheckout: !formCheckout ? [] : formCheckout,
  });
});

router.post("/cafe", async (req, res) => {
  var caves;
  if (req.body.kota == "semua") {
    caves = await Cafe.find();
  } else {
    caves = await Cafe.find({ kategori: req.body.kota });
  }

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

//Halaman Cafe Details (SEMENTARA)
router.get("/cafe/details/:id", async (req, res) => {
  const caves = await Cafe.findOne({ idCafe: req.params.id });
  const capacities = await Capacity.find({ idCafe: req.params.id });
  const dataUser = await req.user;
  let formCapacities, formFoods, formCheckout;
  let tanggalCheckout = [];

  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });

    for (let i = 0; i < formCheckout.length; i++) {
      tanggalCheckout.push(formCheckout[i].waktuPesan);
    }
    if (formCapacities) {
      formFoods = await FormFood.find({ idCafe: formCapacities.idCafe, idUser: formCapacities.idUser, status: "pending" });
    }
  } else {
    formCapacities = null;
  }

  console.log(formCheckout);
  res.render("cafe-details", {
    layout: "layouts/main-layout-booking",
    title: "Detail Cafe",
    dataUser,
    caves,
    capacities,
    formCapacities,
    formFoods,
    tanggalCheckout,
    formCheckout: !formCheckout ? [] : formCheckout,
  });
});

router.post("/cafe/details", async (req, res) => {
  const capacities = await Capacity.findOne({ idCafe: req.body.idcafe, kapKategori: req.body.kapkategori });
  const formFoods = await FormFood.find({ idCafe: req.body.idcafe, idUser: req.body.iduser, status: "pending" });
  const formCapacities = await FormCapacity.findOne({ idCafe: req.body.idcafe, idUser: req.body.iduser, status: "pending" });
  const dataMasuk = {
    idCafe: req.body.idcafe,
    idUser: req.body.iduser,
    kapKategori: req.body.kapkategori,
    namaPemesan: req.body.namapemesan.toLowerCase(),
    waktu: req.body.tanggalpesan,
    tanggalPesan: changeDateFormat(req.body.tanggalpesan),
    jamPesan: req.body.jampesan,
    harga: capacities.harga,
    status: "pending",
  };

  if (req.body.kapkategorilama && !formCapacities) {
    FormCapacity.deleteOne({ idUser: req.body.iduser, status: "pending" }).then((result) => {
      if (formFoods) {
        FormFood.deleteMany({ idUser: req.body.iduser, status: "pending" }).then((error, result) => {
          FormCapacity.insertMany(dataMasuk, (error, result) => {
            res.redirect("/cafe/food/" + req.body.idcafe);
          });
        });
      } else {
        FormCapacity.insertMany(dataMasuk, (error, result) => {
          res.redirect("/cafe/food/" + req.body.idcafe);
        });
      }
    });
  } else {
    if (!formCapacities) {
      FormCapacity.insertMany(dataMasuk, (error, result) => {
        res.redirect("/cafe/food/" + req.body.idcafe);
      });
    } else {
      FormCapacity.updateOne(
        {
          idUser: req.body.iduser,
          idCafe: req.body.idcafe,
          status: "pending",
        },
        {
          $set: {
            kapKategori: req.body.kapkategori,
            namaPemesan: req.body.namapemesan.toLowerCase(),
            waktu: req.body.tanggalpesan,
            tanggalPesan: changeDateFormat(req.body.tanggalpesan),
            jamPesan: req.body.jampesan,
            harga: capacities.harga,
          },
        }
      ).then((result) => {
        res.redirect("/cafe/food/" + req.body.idcafe);
      });
    }
  }
});

//Halaman Pesan
router.get("/cafe/food/:idCafe", checkAuthenticated, async (req, res) => {
  const foods = await Food.find({ idCafe: req.params.idCafe });
  const dataUser = await req.user;
  let formCapacities, formFoods, idMenuFood, idMenuForm, formCheckout;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    formCheckout = await Checkout.find({ idUser: dataUser.id });
    if (formCapacities) {
      formFoods = await FormFood.find({ idCafe: formCapacities.idCafe, idUser: dataUser.id, status: "pending" });

      idMenuFood = foods.map((el) => el.idMenu);
      idMenuForm = formFoods.map((el) => el.idMenu);
    }
  } else {
    formCapacities = null;
  }

  let idMix = [...idMenuFood, ...idMenuForm];
  let formFoodsResult = idMix.sort((a, b) => a - b);

  let noDuplicate = checkedDuplicate(formFoodsResult);
  let hslFormFoods = noDuplicate.map((el) => foods.find((food) => food.idMenu == el));

  res.render("cafe-food", {
    layout: "layouts/main-layout-booking",
    title: "Detail Food",
    dataUser,
    foods,
    formCapacities,
    formFoods,
    hslFormFoods,
    formCheckout: !formCheckout ? [] : formCheckout,
  });
});

router.post("/cafe/food", async (req, res) => {
  const dataUser = await req.user;
  const formFoods = await FormFood.find({ idUser: dataUser.id, status: "pending" });

  let arrIDMenu = formFoods.map((el) => el.idMenu);

  function datamasuk(el) {
    return {
      idCafe: req.body.idcafe[el],
      idUser: req.body.iduser[el],
      idMenu: req.body.idmenu[el],
      quantity: req.body.quantity[el],
      harga: req.body.harga[el],
      status: "pending",
    };
  }

  const dataMasuk = {
    idCafe: req.body.idcafe,
    idUser: req.body.iduser,
    idMenu: req.body.idmenu,
    quantity: req.body.quantity,
    harga: req.body.harga,
    status: "pending",
  };

  let reqIDMenu;
  let lengthIDMenu = [];
  let dataReq = [];
  let moreReqIDMenu = [];
  try {
    reqIDMenu = [req.body.idmenu];

    reqIDMenu.forEach((el) => {
      let len = [];
      el.forEach((item) => {
        len.push(item);
      });
      lengthIDMenu = [...len];
    });

    for (let i = 0; i < lengthIDMenu.length; i++) {
      let hsl = datamasuk(i);
      dataReq.push(hsl);
      moreReqIDMenu.push(dataReq[i].idMenu);
    }
  } catch {
    reqIDMenu = [req.body.idmenu];
  }

  let oneData = [...arrIDMenu, ...reqIDMenu].sort((a, b) => a - b);
  let moreData = [...arrIDMenu, ...moreReqIDMenu].sort((a, b) => a - b);

  if (lengthIDMenu.length > 1 && reqIDMenu.length === 1) {
    try {
      if (returnNoDuplicate(moreData).length === 0) {
        FormFood.insertMany(dataReq);
        res.redirect("/cart");
      } else {
        res.redirect("/cart");
      }
    } catch (e) {
      console.error(e);
    }
  } else if (lengthIDMenu.length === 0 && reqIDMenu.length === 1) {
    if (returnNoDuplicate(oneData).length === 0) {
      FormFood.insertMany(dataMasuk, (error, result) => {
        res.redirect("/cart");
      });
    } else {
      res.redirect("/cart");
    }
  } else {
    res.redirect("/cart");
  }
});

module.exports = { routes: router };
