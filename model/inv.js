const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/tongkrongin", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//Schema
const Invoice = mongoose.model("Invoice", {
  idCafe: {
    type: String,
    required: true,
  },
  idUser: {
    type: String,
  },
  kodeInv: {
    type: String,
  },
  kodeBooking: {
    type: String,
  },
});

module.exports = Invoice;
