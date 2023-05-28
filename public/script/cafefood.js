const pesanButton = document.querySelectorAll("h3.pesan");
const quantityMenu = document.querySelectorAll(".menu .quantity");
const foodMenu = document.querySelectorAll("section.makanan .menu");
const qtyFormFoods = document.querySelector("span.jml-pesanan");

const quantity = document.querySelectorAll("section.makanan .menu .quantity-value");
const wadahQuantity = document.querySelectorAll("section.makanan .menu .quantity h2 span");
const wadahCart = document.querySelector(".wadahCart");

const buttonCart = document.querySelector(".pesanan input.addtocart");

//Data Food (Dalam Array)
const foodImg = document.querySelectorAll(".menu .image img");
const foodName = document.querySelectorAll(".menu .makanan h4");
const foodPrice = document.querySelectorAll(".value-harga");
const cartPrice = document.querySelectorAll("section.makanan .menu h3.harga");

let valuePrice = [];
foodPrice.forEach((el) => {
  valuePrice.push(el.value);
});

cartPrice.forEach((el, i) => {
  el.innerHTML = formatRupiah(valuePrice[i], "Rp. ");
});

const hargaKapasitasValue = document.querySelector("input.harga-kapasitas");
const hargaKapasitas = document.querySelector("span.harga-kapasitas");

let hargaKap = hargaKapasitasValue.value;
if (hargaKapasitas) {
  hargaKapasitas.innerHTML = formatRupiah(hargaKap, "Rp. ");
}

const qtyForm = document.querySelector("input.jmlFormFoods");
let cartsArray = [];
let foodObject;

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("addtocartres")) {
    buttonCart.click();
  }
  if (e.target.classList.contains("pesan")) {
    e.preventDefault();
    e.target.style.display = "none";
    const targetNumber = e.target.getAttribute("number");

    quantityMenu[targetNumber].style.display = "block";

    const idcafe = e.target.getAttribute("idcafe");
    const iduser = e.target.getAttribute("iduser");
    const idmenu = e.target.getAttribute("idmenu");

    const imgFood = foodImg[targetNumber].getAttribute("src");
    const nameFood = foodName[targetNumber].innerHTML;
    const priceFood = foodPrice[targetNumber].value;

    let qValue = Number(quantity[targetNumber].value);
    let hasilTambah = qValue + 1;
    quantity[targetNumber].value = hasilTambah;

    foodObject = new Foods(idcafe, iduser, idmenu, imgFood, nameFood, priceFood, hasilTambah, targetNumber);
    cartsArray.push(foodObject);
    addToArray(cartsArray);

    // console.log(cartsArray);

    foodMenu[targetNumber].classList.add("foodactive");

    let totalPesanan = cartsArray.length + Number(qtyForm.value) + 1;

    qtyFormFoods.innerHTML = totalPesanan;
    wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
  }

  if (e.target.classList.contains("tambah")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    const hasilTambah = Number(quantity[targetNumber].value) + 1;
    quantity[targetNumber].value = hasilTambah;

    const qtyCart = document.querySelectorAll(".qty h4");
    const quantityFood = document.querySelectorAll("input.quantity-food");
    const priceFood = document.querySelectorAll("input.price-food");

    let totalTambah;
    let totalQty;

    cartsArray.forEach((el) => {
      if (el.target == targetNumber) {
        totalQty = el.changeQty(quantity[targetNumber].value);
        totalTambah = el.changePrice(quantity[targetNumber].value);
      }
    });

    qtyCart.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.innerHTML = hasilTambah;
      }
    });

    priceFood.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.value = totalTambah;
      }
    });
    quantityFood.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.value = totalQty;
      }
    });

    wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
  }

  if (e.target.classList.contains("kurang")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    const namaMenu = e.target.getAttribute("food-name");

    const hasilKurang = Number(quantity[targetNumber].value) - 1;
    quantity[targetNumber].value = hasilKurang;

    const qtyCart = document.querySelectorAll(".qty h4");
    const quantityFood = document.querySelectorAll("input.quantity-food");
    const priceFood = document.querySelectorAll("input.price-food");

    if (hasilKurang == 0 || hasilKurang < 0) {
      quantity[targetNumber].value = 0;
      pesanButton[targetNumber].style.display = "block";
      quantityMenu[targetNumber].style.display = "none";

      let filtered = cartsArray.filter((el) => el.name != namaMenu);
      cartsArray.splice(0);
      cartsArray = [...filtered];

      addToArray(cartsArray);

      foodMenu[targetNumber].classList.remove("foodactive");

      let totalPesanan = cartsArray.length + Number(qtyForm.value) + 1;

      qtyFormFoods.innerHTML = totalPesanan;
      wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
    } else {
      let totalKurang;
      let totalQty;
      cartsArray.forEach((el, i) => {
        if (el.target == targetNumber) {
          totalQty = el.changeQty(quantity[targetNumber].value);
          totalKurang = el.changePrice(quantity[targetNumber].value);
        }
      });

      qtyCart.forEach((el) => {
        if (el.getAttribute("target") == targetNumber) {
          el.innerHTML = quantity[targetNumber].value;
        }
      });
      priceFood.forEach((el) => {
        if (el.getAttribute("target") == targetNumber) {
          el.value = totalKurang;
        }
      });
      quantityFood.forEach((el) => {
        if (el.getAttribute("target") == targetNumber) {
          el.value = totalQty;
        }
      });

      wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
    }
  }
});

class Foods {
  constructor(idcafe, iduser, idmenu, img, name, price, qty, target) {
    this.idcafe = idcafe;
    this.iduser = iduser;
    this.idmenu = idmenu;
    this.img = img;
    this.name = name;
    this.price = price;
    this.qty = qty;
    this.target = target;
    this.totalPrice = this.price;
    this.totalQty = this.qty;
  }

  changeQty(qty) {
    this.totalQty = this.qty * Number(qty);
    return this.totalQty;
  }

  changePrice(qty) {
    this.totalPrice = this.price * qty;
    return this.totalPrice;
  }
}

function addToArray(carts) {
  let card = "";
  carts.forEach((el) => {
    card += cart(el.idcafe, el.iduser, el.idmenu, el.img, el.name, el.price, el.qty, el.target, el.totalPrice, el.totalQty);
  });
  wadahCart.innerHTML = card;
}

function cart(idcafe, iduser, idmenu, img, name, price, qty, target, totalPrice, totalQty) {
  return `<div class="kapasitas">
            <input type="hidden" value="${idcafe}" name="idcafe" />
            <input type="hidden" value="${iduser}" name="iduser" />
            <input type="hidden" value="${idmenu}" name="idmenu" />
            <input type="hidden" value="${totalQty}" name="quantity" class="quantity-food" target="${target}"/>
            <input type="hidden" value="${totalPrice}" name="harga" class="price-food" target="${target}"/>
            
            <div class="row">
            <div class="col-3 image">
                <img src="${img}" alt="food 2" class="img-fluid" />
              </div>
              <div class="col-auto ">
                <h4><span>${name}</span></h4>
                <span class="harga" >${formatRupiah(price, "Rp. ")}</span>
              </div>
              <div class="col my-auto text-end qty">
                <h4 target="${target}">${totalQty}</h4>
              </div>
            </div>
          </div>`;
}
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

const listCart = document.querySelector("section.makanan .pesanan .list-group");
const indikator = document.querySelector("section.makanan .pesanan p.indikator");
const indikatorList = document.querySelector("section.makanan .list-makanan");

// let listMakanan = indikatorList.getBoundingClientRect();
// let paragraf = listCart.getBoundingClientRect();

// document.addEventListener("scroll", function () {
//   const windowS = window.scrollY;

//   let posisiKanan = window.innerWidth - indikator.getBoundingClientRect().right;
//   let widthCartList = indikator.getBoundingClientRect().width;

//   if (listMakanan.height > paragraf.height) {
//     if (windowS >= paragraf.top) {
//       listCart.classList.add("fixed-active");
//       listCart.classList.remove("static-active");
//       listCart.style.right = `${posisiKanan}px`;
//       listCart.style.width = widthCartList + "px";
//     } else {
//       listCart.classList.add("static-active");
//       listCart.classList.remove("remove-active");
//       listCart.style.right = `none`;
//     }
//   } else {
//     listCart.classList.remove("fixed-active");
//     listCart.classList.add("static-active");
//   }
// });

// function getOffset(el) {
//   var _x = 0;
//   var _y = 0;
//   while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
//     _x += el.offsetLeft - el.scrollLeft;
//     _y += el.offsetTop - el.scrollTop;
//     el = el.offsetParent;
//   }
//   return { top: _y, left: _x };
// }
// var x = getOffset(listCart).top;
// console.log(x);
