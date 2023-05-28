const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/tongkrongin", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
//Schema
const Cafe = mongoose.model("Cafe", {
  idCafe: {
    type: String,
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
  fasilitas: [{ fasilitasIcon: { type: String }, fasilitasJudul: { type: String } }],
  kategori: {
    type: String,
    required: true,
  },
  jamBuka: {
    type: String,
    required: true,
  },
  jamTutup: {
    type: String,
    required: true,
  },
  gambar: [{ namaGambar: { type: String } }, { namaGambar: { type: String } }, { namaGambar: { type: String } }],
  rekening: [
    {
      namaBank: { type: String },
      nomorRekening: { type: String },
      namaRekening: { type: String },
    },
  ],
});

// //Simpan Ke COllection
// cafe1.save().then((cafe) => console.log(cafe));
module.exports = Cafe;
