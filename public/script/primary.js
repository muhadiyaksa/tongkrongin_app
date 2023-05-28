const inputCafe = document.querySelectorAll("input.alamat-cafe");
const wadahCafe = document.querySelectorAll("section.highlight .card-text");

const inputCafeSec = document.querySelectorAll("input.alamat-cafe-sec");
const wadahCafeSec = document.querySelectorAll("section.highlight .card-text-sec");

const inputCafeRes = document.querySelectorAll("input.alamat-cafe-res");
const wadahCafeRes = document.querySelectorAll("section.highlight .card-text-res");

let valueNilai = [];
inputCafe.forEach((el) => {
  valueNilai.push(el.value);
});

wadahCafe.forEach((el, i) => {
  el.innerHTML = valueNilai[i].substring(0, 40) + "...";
});

let valueSec = [];
inputCafeSec.forEach((el) => {
  valueSec.push(el.value);
});

wadahCafeSec.forEach((el, i) => {
  el.innerHTML = valueNilai[i].substring(0, 40) + "...";
});

let valueRes = [];
inputCafeRes.forEach((el) => {
  valueRes.push(el.value);
});

wadahCafeRes.forEach((el, i) => {
  el.innerHTML = valueNilai[i].substring(0, 60) + "...";
});

const inputSearch = document.querySelector(".navbar-nav input.submit-input");
const imgSearch = document.querySelector(".navbar-nav img.search-button");
const inputSearchRes = document.querySelector(".nav-res input.submit-search");
const imgSearchRes = document.querySelector(".nav-res img.search-input");
console.log(inputSearchRes);
console.log(imgSearchRes);
imgSearch.addEventListener("click", function () {
  inputSearch.click();
});

imgSearchRes.addEventListener("click", function () {
  inputSearchRes.click();
});
