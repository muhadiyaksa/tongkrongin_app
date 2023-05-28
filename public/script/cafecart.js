const checkForPrice = document.querySelectorAll("input.check-for-price");
const checkForCapacity = document.querySelector("input.check-capacity");
const totalForPrice = document.querySelector(".total h3 span");

const priceFood = document.querySelectorAll(".makanan .harga h4");
const valuePriceFood = document.querySelectorAll("input.value-harga");

const pricePlace = document.querySelector(".tempat .harga h4");
const valuePricePlace = document.querySelector("input.value-harga-tempat");

const tombolKurangCart = document.querySelectorAll("button.qty-min");

checkForPrice.forEach((el) => {
  el.addEventListener("change", function (e) {
    e.preventDefault;
    if (el.checked) {
      if (!checkForCapacity.checked) {
        checkForCapacity.click();
      }
    }
  });
});

let price = [];

valuePriceFood.forEach((el) => {
  price.push(el.value);
});

priceFood.forEach((el, i) => {
  el.innerHTML = formatRupiah(price[i], "Rp. ");
});

if (valuePricePlace) {
  pricePlace.innerHTML = formatRupiah(valuePricePlace.value, "Rp. ");
}

function unCheckedFood() {
  checkForPrice.forEach((el) => {
    if (!checkForCapacity.checked) {
      if (el.checked) {
        el.click();
      }
    }
  });
}

function countPriceCheck(totalParam) {
  let totalHarga = 0;
  if (totalParam.length !== 0) {
    totalParam.forEach((el) => {
      totalHarga += Number(el);
    });
  } else {
    totalHarga = "-";
  }
  return totalHarga;
}

function disabledButton() {
  const inputQty = document.querySelectorAll("input.quantity-food");
  let inputArr = [];
  inputQty.forEach((el) => {
    inputArr.push(el.value);
  });

  tombolKurangCart.forEach((el, i) => {
    if (inputArr[i] == 1) {
      el.setAttribute("disabled", "true");
    }
  });
}

disabledButton();
let total = [];
let totalCapacity = [];
let idMenu = [];

const bayarKeranjang = document.querySelector("input.bayar-keranjang");
const idMenuArray = document.querySelector(".total input.idmenu-array");
const totalHargaKeranjang = document.querySelector(".total input.total-harga");

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("check-capacity")) {
    e.preventDefault();
    const eValue = e.target.value;
    if (e.target.checked) {
      totalCapacity.push(eValue);
      total.push(...totalCapacity);
      bayarKeranjang.removeAttribute("disabled");
    } else {
      unCheckedFood();
      totalCapacity.splice(0);
      total.splice(0);
      bayarKeranjang.setAttribute("disabled", "true");
    }

    let totalHarga = countPriceCheck(total).toString();
    totalHargaKeranjang.value = totalHarga;

    totalForPrice.innerHTML = formatRupiah(totalHarga);
  } else if (e.target.classList.contains("check-for-price")) {
    e.preventDefault();
    const eValue = e.target.value.split(",");
    console.log(eValue[3]);

    if (e.target.checked) {
      total.unshift(eValue[2]);
      idMenu.unshift(eValue[1]);
    } else {
      let kurang = total.filter((el) => el !== eValue[2]);
      let idMenuFilter = idMenu.filter((el) => el !== eValue[1]);
      total = [...kurang];
      idMenu = [...idMenuFilter];
    }

    //ubah value
    idMenuArray.value = idMenu;
    let totalHarga = countPriceCheck(total).toString();
    totalHargaKeranjang.value = totalHarga;

    totalForPrice.innerHTML = formatRupiah(totalHarga);
  }
});

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

// const tanggalPesan = document.querySelector("input.tanggal-pesan");
// const wadahTanggal = document.querySelector("span.wadah-tanggal");

// function ubahTanggal(tanggal) {
//   if (wadahTanggal !== null) {
//     let arr = tanggal.value.split("-");
//     let bulan = ["", "januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
//     let bulanIndex = arr[1];

//     wadahTanggal.innerHTML = `${arr[2]} ${bulan[bulanIndex]} ${arr[0]}`;
//   }
// }

// ubahTanggal(tanggalPesan);

const waktuPesan = document.querySelector("input.waktu-pesan");
const jamPesan = document.querySelector("input.jam-pesan");
const kadaluarsa = document.querySelector("section.keranjang .kadaluarsa");
const checkboxInput = document.querySelectorAll("section.keranjang input.form-check-input");

function cekKadaluarsa(tanggal, jam) {
  let tanggalSekarang = new Date().getDate();
  let bulanSekarang = Number(new Date().getMonth()) + 1;
  let tahunSekarang = new Date().getFullYear();
  let jamSekarang = new Date().getHours();
  let menitSekarang = new Date().getMinutes();

  let arrSekarang = [tahunSekarang, cekLength(bulanSekarang), cekLength(tanggalSekarang), cekLength(jamSekarang), cekLength(menitSekarang)].join("");
  let arrTanggal, arrJam, arrPesan;

  if (!waktuPesan) {
    if (kadaluarsa !== null) {
      kadaluarsa.classList.add("displayNone");
    }
  } else {
    arrTanggal = tanggal.value.split("-");
    arrJam = jam.value.split(":");
    arrPesan = [arrTanggal[0], cekLength(arrTanggal[1]), cekLength(arrTanggal[2]), cekLength(arrJam[0]), cekLength(arrJam[1])].join("");

    if (Number(arrPesan) <= Number(arrSekarang)) {
      checkboxInput.forEach((el) => {
        el.setAttribute("disabled", "true");
      });
      kadaluarsa.classList.remove("displayNone");
    } else {
      kadaluarsa.classList.add("displayNone");
      checkboxInput.forEach((el) => {
        el.removeAttribute("disabled", "true");
      });
    }
  }
}

cekKadaluarsa(waktuPesan, jamPesan);

function cekLength(param) {
  if (param.length == 1) {
    return `0${param}`;
  } else {
    return param;
  }
}
