// const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/tongkrongin", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const mongoose = require("mongoose");

const url = `mongodb+srv://tongkrongin:tongkrongin2022@tongkrongin.i1nix.mongodb.net/tongkrongin?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// module.exports = Food;

// const food1 = new Food({
//   idCafe: "001080",
//   idMenu: "11223801",
//   namaMenu: "Burger dan Kentang",
//   deskripsi: "Burger daging sapi dengan lapisan keju , serta kentang goreng spesial",
//   status: "tersedia",
//   harga: "37000",
//   gambar: "food2.png",
// });
// const food2 = new Food({
//   idCafe: "001080",
//   idMenu: "11223802",
//   namaMenu: "Shushi dan Bakmi",
//   deskripsi: "Shushi dengan daging premium ditambah bakmi kuah dengan toping lengkap",
//   status: "tersedia",
//   harga: "50000",
//   gambar: "food1.png",
// });
// const food3 = new Food({
//   idCafe: "001080",
//   idMenu: "11223803",
//   namaMenu: "Coffee Late",
//   deskripsi: "Minuman Coffee Late dengan rasa pait dan manis yang pas",
//   status: "tersedia",
//   harga: "18000",
//   gambar: "food3.png",
// });
// const food4 = new Food({
//   idCafe: "001080",
//   idMenu: "11223804",
//   namaMenu: "Barbeque dan Kentang",
//   deskripsi: "Barbeque Daging dengan saus asam manis dan Kentang Goreng Bumbu Spesial",
//   status: "tersedia",
//   harga: "50000",
//   gambar: "food4.png",
// });
// const food5 = new Food({
//   idCafe: "001080",
//   idMenu: "11223805",
//   namaMenu: "Matcha",
//   deskripsi: "Minuman spesial daun teh hijau yang dapat dihidangkan panas atau dingin",
//   status: "tersedia",
//   harga: "26000",
//   gambar: "matcha.jpg",
// });
// const food6 = new Food({
//   idCafe: "001080",
//   idMenu: "11223806",
//   namaMenu: "Chocolate Milk Special",
//   deskripsi: "Minuman spesial campuran coklat swiss dan susu murni nasional",
//   status: "tersedia",
//   harga: "23000",
//   gambar: "chocolate.jpg",
// });
// const food7 = new Food({
//   idCafe: "001080",
//   idMenu: "11223807",
//   namaMenu: "Cappucino Frappucino",
//   deskripsi: "Minuman spesial Kopi dengan citarasa Cappucino",
//   status: "tersedia",
//   harga: "25000",
//   gambar: "cappucino.jpg",
// });

// // //Simpan Ke COllection
// food1.save().then((food) => console.log(food));
// food2.save().then((food) => console.log(food));
// food3.save().then((food) => console.log(food));
// food4.save().then((food) => console.log(food));
// food5.save().then((food) => console.log(food));
// food6.save().then((food) => console.log(food));
// food7.save().then((food) => console.log(food));
