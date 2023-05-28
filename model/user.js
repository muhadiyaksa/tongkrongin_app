const mongoose = require("mongoose");

//Schema
const User = mongoose.model("User", {
  id: {
    type: String,
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  notelp: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordChecked: {
    type: String,
    required: true,
  },
  jeniskelamin: {
    type: String,
  },
  kota: {
    type: String,
  },
  fotoprofil: {
    type: String,
  },
  fotoprofilLama: {
    type: String,
  },
});

module.exports = User;
