const mongoose = require("mongoose");

//Schema
const FormCapacity = mongoose.model("FormCapacity", {
  idCafe: {
    type: String,
    required: true,
  },
  idUser: {
    type: String,
    required: true,
  },
  kapKategori: {
    type: String,
    required: true,
  },
  namaPemesan: {
    type: String,
  },
  waktu: {
    type: String,
  },
  tanggalPesan: {
    type: String,
  },
  jamPesan: {
    type: String,
  },
  harga: {
    type: String,
  },
  status: {
    type: String,
  },
});

module.exports = FormCapacity;

// const capacity1 = new Capacity({
//   idCafe: "001080",
//   kapasitas: [
//     {
//       kapKategori: "1-3",
//       deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//       jumlah: "5",
//       harga: "10000",
//     },
//     {
//       kapKategori: "4-6",
//       deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//       jumlah: "15",
//       harga: "15000",
//     },
//     {
//       kapKategori: "7-12",
//       deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//       jumlah: "5",
//       harga: "20000",
//     },
//   ],
// });

// //Simpan Ke COllection
// capacity1.save().then((capacity) => console.log(capacity));
