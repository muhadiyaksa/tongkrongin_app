const hargaKapasitasForm = document.querySelectorAll(".kapasitas h3.harga");
const valueHargaKapasitas = document.querySelectorAll(".kapasitas input.harga-kapasitas");

let value = [];
valueHargaKapasitas.forEach((el) => {
  value.push(el.value);
});

hargaKapasitasForm.forEach((el, i) => {
  el.innerHTML = formatRupiah(value[i], "Rp. ");
});

const idCafe = document.querySelector("input.id-cafe");
const kapKategori = document.querySelector(".modal .kotak");
const inputKategori = document.querySelector("input.kapkategori");

function tampilHarga(harga) {
  const hasilHarga = formatRupiah(harga, "Rp. ");
  hargaKapasitasForm.innerHTML = hasilHarga;
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay")) {
    const kategori = e.target.getAttribute("kategori");

    inputKategori.value = kategori;
    kapKategori.innerHTML = `${kategori} Orang`;
  }
});

const jamBuka = document.querySelector("input.jam-buka");
const jamTutup = document.querySelector("input.jam-tutup");
const tanggalIsi = document.querySelector("input.tanggal-pesan");
const jamIsi = document.querySelector("input.jam-pesan");
const waktuCheckoutUser = document.querySelector("input.waktuPesan");

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("tanggal-pesan")) {
    let valueE = e.target.value.split("-");
    let jamIni = new Date().getHours();
    let hariIni = new Date().getDate();
    let bulanIni = Number(new Date().getMonth()) + 1;
    let tahunIni = new Date().getFullYear();

    let valueJamTutup = jamTutup.value;
    let batasPesan = Number(valueJamTutup.toString().split(":")[0]) - 2;

    const kirimkapasitas = document.querySelector("button.kirim-kapasitas");
    const info = document.querySelector("span.info-tanggal");
    const infoJam = document.querySelector("span.info-jam");

    let waktuCheckoutValue = waktuCheckoutUser.value.split(",");
    console.log(waktuCheckoutValue);
    let nilai = waktuCheckoutValue.filter((el) => el == e.target.value);
    console.log(nilai);

    if (valueE[0] >= tahunIni) {
      if (valueE[1] >= bulanIni) {
        if (valueE[2] > hariIni) {
          if (nilai.length !== 0) {
            info.innerHTML = "Kamu sudah memesan sebelumnya di tanggal ini";
            kirimkapasitas.setAttribute("disabled", "true");
            jamIsi.setAttribute("disabled", "true");
          } else {
            info.innerHTML = "";
            infoJam.innerHTML = "";
            jamIsi.value = "";
            kirimkapasitas.removeAttribute("disabled");
            jamIsi.removeAttribute("disabled");
          }
        } else if (valueE[2] == hariIni) {
          if (batasPesan <= jamIni) {
            info.innerHTML = "Hari ini sudah melewati Batas Jam Pemesanan";
            kirimkapasitas.setAttribute("disabled", "true");
            jamIsi.setAttribute("disabled", "true");
          } else {
            info.innerHTML = "";
            infoJam.innerHTML = "";
            jamIsi.value = "";
            kirimkapasitas.removeAttribute("disabled");
            jamIsi.removeAttribute("disabled");
          }
        } else {
          info.innerHTML = "Masukan Tanggal Hari ini atau Setelah Hari ini";
          kirimkapasitas.setAttribute("disabled", "true");
          jamIsi.setAttribute("disabled", "true");
        }
      } else if (valueE[1] < bulanIni && valueE[0] > tahunIni) {
        info.innerHTML = "";
        infoJam.innerHTML = "";
        jamIsi.value = "";
        kirimkapasitas.removeAttribute("disabled");
        jamIsi.removeAttribute("disabled");
      } else {
        info.innerHTML = "Masukan Tanggal Hari ini atau Hari Setelah Hari ini";
        kirimkapasitas.setAttribute("disabled", "true");
        jamIsi.removeAttribute("disabled");
      }
    } else {
      info.innerHTML = "Masukan Tanggal Hari ini atau Hari Setelah Hari ini";
      kirimkapasitas.setAttribute("disabled", "true");
    }
  }

  if (e.target.classList.contains("jam-pesan")) {
    let valueJamBuka, valueJamTutup;
    if (jamBuka && jamTutup) {
      const info = document.querySelector("span.info-jam");
      const kirimkapasitas = document.querySelector("button.kirim-kapasitas");

      valueJamBuka = jamBuka.value;
      valueJamTutup = jamTutup.value;
      let batasPesan = Number(valueJamTutup.toString().split(":").join("")) - 200;
      let arrayBatasPesan = batasPesan.toString().split("");

      let tanggalValue = tanggalIsi.value.split("-");

      let hariIni = Number(new Date().getDate());
      let jamIni = new Date().getHours();
      let menitIni = new Date().getMinutes();
      let batasJamSekarang = Number(`${jamIni}${menitIni.length == 1 ? `0${menitIni}` : `${menitIni}`}`);
      let batasJamKedepan = Number(`${jamIni + 1}${menitIni.length == 1 ? `0${menitIni}` : `${menitIni}`}`);
      let valueIsi = Number(e.target.value.toString().split(":").join(""));
      console.log(batasJamSekarang);
      console.log(batasJamKedepan);
      arrayBatasPesan.splice(2, 0, ":");

      let valueBatasPesan = arrayBatasPesan.join("");

      if (tanggalValue.length === 1) {
        info.innerHTML = "Pilihlah Tanggal Terlebih dahulu";
        kirimkapasitas.setAttribute("disabled", "true");
      } else {
        if (tanggalValue[2] == hariIni) {
          if (e.target.value >= valueJamBuka && e.target.value <= valueJamTutup) {
            if (valueIsi >= batasJamSekarang && valueIsi < batasJamKedepan) {
              info.innerHTML = "Pilihlah Waktu minimal 1 jam Dari sekarang";
              kirimkapasitas.setAttribute("disabled", "true");
            } else if (e.target.value > valueBatasPesan) {
              info.innerHTML = "Pilihlah Waktu minimal 2 Jam sebelum Cafe Tutup";
              kirimkapasitas.setAttribute("disabled", "true");
            } else {
              info.innerHTML = "";
              kirimkapasitas.removeAttribute("disabled");
            }
          } else {
            info.innerHTML = "Pilihlah Waktu sesuai jam Buka dan Jam Tutup Cafe";
            kirimkapasitas.setAttribute("disabled", "true");
          }
        } else {
          if (e.target.value >= valueJamBuka && e.target.value <= valueJamTutup) {
            if (e.target.value > valueBatasPesan) {
              info.innerHTML = "Pilihlah Waktu minimal 2 Jam sebelum Cafe Tutup";
              kirimkapasitas.setAttribute("disabled", "true");
            } else {
              info.innerHTML = "";
              kirimkapasitas.removeAttribute("disabled");
            }
          } else {
            info.innerHTML = "Pilihlah Waktu sesuai jam Buka dan Jam Tutup Cafe";
            kirimkapasitas.setAttribute("disabled", "true");
          }
        }
      }
    }
  }
});

/* Fungsi formatRupiah */
function formatRupiah(angka, prefix) {
  var number_string = angka.replace(/[^,\d]/g, "").toString(),
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
