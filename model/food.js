const mongoose = require("mongoose");

//Schema
const Food = mongoose.model("Food", {
  idCafe: {
    type: String,
    required: true,
  },
  idMenu: {
    type: String,
    required: true,
  },
  namaMenu: {
    type: String,
    required: true,
  },
  deskripsi: { type: String },
  status: {
    type: String,
    required: true,
  },
  harga: {
    type: String,
    required: true,
  },
  gambar: { type: String },
});

module.exports = Food;

// const food1 = new Food({
//   idCafe: "001070",
//   idMenu: "11223701",
//   namaMenu: "Burger dan Kentang",
//   deskripsi: "Burger daging sapi dengan lapisan keju , serta kentang goreng spesial",
//   status: "tersedia",
//   harga: "45000",
//   gambar: "food2.png",
// });
// const food2 = new Food({
//   idCafe: "001070",
//   idMenu: "11223702",
//   namaMenu: "Shushi dan Bakmi",
//   deskripsi: "Shushi dengan daging premium ditambah bakmi kuah dengan toping lengkap",
//   status: "tersedia",
//   harga: "77000",
//   gambar: "food1.png",
// });
// const food3 = new Food({
//   idCafe: "001070",
//   idMenu: "11223703",
//   namaMenu: "Coffee Late",
//   deskripsi: "Minuman Coffee Late dengan rasa pait dan manis yang pas",
//   status: "tersedia",
//   harga: "27000",
//   gambar: "food3.png",
// });
// const food4 = new Food({
//   idCafe: "001070",
//   idMenu: "11223704",
//   namaMenu: "Barbeque dan Kentang",
//   deskripsi: "Barbeque Daging dengan saus asam manis dan Kentang Goreng Bumbu Spesial",
//   status: "tersedia",
//   harga: "80000",
//   gambar: "food4.png",
// });

// // //Simpan Ke COllection
// food1.save().then((food) => console.log(food));
// food2.save().then((food) => console.log(food));
// food3.save().then((food) => console.log(food));
// food4.save().then((food) => console.log(food));
