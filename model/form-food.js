const mongoose = require("mongoose");

//Schema
const FormFood = mongoose.model("FormFood", {
  idCafe: {
    type: String,
    required: true,
  },
  idUser: {
    type: String,
    required: true,
  },
  idMenu: {
    type: String,
  },
  quantity: {
    type: String,
  },
  harga: {
    type: String,
  },
  status: {
    type: String,
  },
});

// const food1 = new FormFood({
//   idCafe: "110908",
//   idUser: "111212124",
//   idMenu: "124135124",
//   quantity: "1",
//   harga: "12000",
// });

// food1.save().then((foodform) => console.log(foodform));
module.exports = FormFood;
