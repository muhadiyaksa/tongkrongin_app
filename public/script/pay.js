const itemBank = document.querySelectorAll(".jenis-bank .item-bank");

const wadahNamaRekening = document.querySelector("section.pay span.nama-rekening");
const wadahNomorRekening = document.querySelector("section.pay span.nomor-rekening");
const wadahNamaBank = document.querySelector("section.pay span.nama-bank");

const imageBank = document.querySelector(".jenis-bank .item-bank img");
const imageBankBig = document.querySelector(".img-bank img");
const inputNamaBank = document.querySelector("input.namabank");
const inputNamaRekening = document.querySelector("input.namarekening");
const inputNomorRekening = document.querySelector("input.nomorrekening");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay")) {
    const valueNoRek = e.target.getAttribute("nomorRekening");
    const valueNamaRek = e.target.getAttribute("namaRekening");
    const valueNamaBank = e.target.getAttribute("namaBank");

    wadahNamaRekening.innerHTML = valueNamaRek;
    wadahNomorRekening.innerHTML = valueNoRek;

    inputNamaRekening.value = valueNamaRek;
    inputNamaRekening.value = valueNoRek;
    // wadahNamaBank.innerHTML = valueNamaBank;
    namaBank(valueNamaBank);

    imageBankBig.src = `/img/bank/${valueNamaBank}.png`;
  }
});

// function ubahTanggal(tanggal) {
//   let arr = tanggal.value.split("-");
//   let bulan = ["", "januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
//   let bulanIndex = arr[1];

//   wadahTanggal.innerHTML = `${arr[2]} ${bulan[bulanIndex]} ${arr[0]}`;
//   wadahTanggal.style.fontWeight = "600";
// }

// ubahTanggal(tanggalPesan);

const totalPembayaran = document.querySelector("input.total-pembayaran");
const totalCheckout = document.querySelector("input.price-checkout");

const totalBayar = document.querySelector("strong.totalbayar");
const totalCheckoutLoc = document.querySelector("span.price-checkout-loc");

/* Fungsi formatRupiah */
function formatRupiah(angka, prefix) {
  console.log(angka);
  let number_string = angka.replace(/[^,\d]/g, ""),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
}
if (totalPembayaran !== null) {
  totalBayar.textContent = formatRupiah(totalPembayaran.value, "Rp. ");
}
if (totalCheckout !== null) {
  totalCheckoutLoc.textContent = formatRupiah(totalCheckout.value, "Rp. ");
}

const menitPesan = document.querySelector("input.menit-pesan");
const menitWadah = document.querySelector("span.menit-wadah");

function cekMenit(param) {
  if (param.length == 1) {
    return `0${param}`;
  } else {
    return param;
  }
}
if (menitPesan !== null) {
  menitWadah.textContent = cekMenit(menitPesan.value);
}

const valueNamaBank = document.querySelector("input.nama-bank");

function namaBank(param) {
  if (param == "bca") {
    wadahNamaBank.textContent = "Bank Central Asia";
    inputNamaBank.value = "Bank Central Asia";
  } else if (param == "bni") {
    wadahNamaBank.textContent = "Bank Negeri Indonesia";
    inputNamaBank.value = "Bank Negeri Indonesia";
  } else if (param == "bri") {
    wadahNamaBank.textContent = "Bank Rakyat Indonesia";
    inputNamaBank.value = "Bank Rakyat Indonesia";
  } else if (param == "dana") {
    wadahNamaBank.textContent = "Dana";
    inputNamaBank.value = "Dana";
  } else if (param == "mandiri") {
    wadahNamaBank.textContent = "Bank Mandiri";
    inputNamaBank.value = "Bank Mandiri";
  } else {
    wadahNamaBank.textContent = "-";
    inputNamaBank.value = "-";
  }
}

if (valueNamaBank !== null) {
  namaBank(valueNamaBank.value);
}

const buttonKirim = document.querySelector("input.upload-kirim");
const buttonUpload = document.querySelector("input.upload-button");

if (buttonKirim !== null) {
  buttonKirim.addEventListener("click", function () {
    buttonUpload.click();
  });
}
