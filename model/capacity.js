const mongoose = require("mongoose");

//Schema
const Capacity = mongoose.model("Capacity", {
  idCafe: {
    type: String,
    required: true,
  },
  kapKategori: {
    type: String,
  },
  deskripsi: {
    type: String,
  },
  jumlah: {
    type: String,
  },
  harga: {
    type: String,
  },
});

module.exports = Capacity;

// const capacity1 = new Capacity({
//   idCafe: "001010",
//   kapKategori: "1-3",
//   deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//   jumlah: "5",
//   harga: "11000",
// });

// const capacity2 = new Capacity({
//   idCafe: "001010",
//   kapKategori: "4-6",
//   deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//   jumlah: "15",
//   harga: "16000",
// });
// const capacity3 = new Capacity({
//   idCafe: "001010",
//   kapKategori: "7-12",
//   deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//   jumlah: "5",
//   harga: "21000",
// });

// //Simpan Ke COllection
// capacity1.save().then((capacity) => console.log(capacity));
// capacity2.save().then((capacity) => console.log(capacity));
// capacity3.save().then((capacity) => console.log(capacity));
