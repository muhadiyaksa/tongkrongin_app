const showPassword = document.querySelectorAll(".show-password");
const password = document.getElementById("password");
const passwordChecked = document.getElementById("passwordChecked");

showPassword.forEach((el, i) => {
  el.addEventListener("click", function () {
    if (i == 0) {
      if (password.type == "password") {
        password.setAttribute("type", "text");
      } else {
        password.setAttribute("type", "password");
      }
    } else {
      if (passwordChecked.type == "password") {
        passwordChecked.setAttribute("type", "text");
      } else {
        passwordChecked.setAttribute("type", "password");
      }
    }
  });
});

//--------------------------------------------------------------

const dropArea = document.querySelector(".konten-upload");
const submitPhoto = document.querySelector(".konten-upload input.submit-photo");
const kirimPhoto = document.querySelector(".kirim input.button-kirim");
console.log(submitPhoto);
console.log(kirimPhoto);

const notifArea = document.querySelector(".notif-area");
const overlayLoc = document.querySelector(".kirim .overlay-loc");

let input, hasilFile, h2DropArea, pDropArea, labelDropArea, file;
if (dropArea) {
  input = dropArea.querySelector("input.upload-photo");

  hasilFile = dropArea.querySelector(".hasil-file");
  h2DropArea = dropArea.querySelector("h2");
  pDropArea = dropArea.querySelector("p");
  labelDropArea = dropArea.querySelector("label");

  input.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropArea.classList.add("active");
  });

  input.addEventListener("dragleave", function (e) {
    e.preventDefault();
    dropArea.classList.remove("active");
  });

  input.addEventListener("change", function (e) {
    e.preventDefault();
    showFile(this);
  });
}

if (kirimPhoto !== null) {
  kirimPhoto.addEventListener("click", function (e) {
    submitPhoto.click();
  });
}
function notifError() {
  return `<div class="alert alert-danger" role="alert">
            Format File harus PNG , JPG atau JPEG
          </div>`;
}
function notifErrorDouble() {
  return `<div class="alert alert-danger" role="alert">
            Foto/Gambar tidak dapat menerima lebih dari 1 Foto!
          </div>`;
}
function notifErrorSize() {
  return `<div class="alert alert-danger" role="alert">
            Foto/Gambar tidak boleh melebihi ukuran maks. 2 MB
          </div>`;
}

function showFile(input) {
  if (input.files && input.files[0]) {
    let card = "";
    let fileType = input.files[0].type;

    if (input.files.length > 1) {
      notifArea.style.display = "block";
      notifArea.innerHTML = notifErrorDouble();
    } else {
      let validExtensions = ["image/jpg", "image/jpeg", "image/png"];

      var reader = new FileReader();

      if (validExtensions.includes(fileType) && input.files[0].size <= 2000000) {
        reader.onload = function (e) {
          hasilFile.style.display = "block";
          h2DropArea.style.display = "none";
          pDropArea.style.display = "none";
          labelDropArea.style.display = "none";
          notifArea.style.display = "none";
          let cards = (card += resultFile(input.files[0].name));
          hasilFile.innerHTML = cards;
          console.log(input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);
        overlayLoc.classList.remove("overlay-upload");
      } else if (validExtensions.includes(fileType) && input.files[0].size > 2000000) {
        notifArea.style.display = "block";
        notifArea.innerHTML = notifErrorSize();
        overlayLoc.classList.add("overlay-upload");
      } else {
        notifArea.style.display = "block";
        notifArea.innerHTML = notifError();
        overlayLoc.classList.add("overlay-upload");
      }
    }
  } else {
    overlayLoc.classList.add("overlay-upload");
  }
}

function resultFile(namafile) {
  return `<div class="alert alert-secondary tampil-file" role="alert">
            <div class="row">
              <div class="col-3">
                <h3><i class="bi bi-image"></i><h3>
              </div>
              <div class="col-9 text-start">
                ${namafile}
              </div>
            </div>
          </div>`;
}

const statusPesanan = document.querySelectorAll("input.status-pesanan");
const statusWadah = document.querySelectorAll("h5.status-loc");

function changeStatus(param, wadah) {
  if (param == "pending") {
    wadah.innerHTML = "Belum Bayar";
    wadah.style.color = "#ff810b";
  } else if (param == "waiting") {
    wadah.innerHTML = "Menunggu";
    wadah.style.color = "#00c431";
  } else if (param == "confirmed") {
    wadah.innerHTML = "Selesai";
    wadah.style.color = "#00c431";
  }
}
console.log(statusPesanan.value);
console.log(statusWadah);
if (statusPesanan !== null) {
  statusPesanan.forEach((el, i) => {
    changeStatus(el.value, statusWadah[i]);
  });
}

// CADANGAN
// ----------------------------
// function showFileMore1() {
//   let card = "";
//   for (let i = 0; i < file.length; i++) {
//     let fileType = file[i].type;
//     let validExtensions = ["image/jpg", "image/jpeg", "image/png"];
//     if (validExtensions.includes(fileType)) {
//       hasilFile.style.display = "block";
//       h2DropArea.style.display = "none";
//       pDropArea.style.display = "none";
//       labelDropArea.style.display = "none";
//       notifArea.style.display = "none";
//       let cards = (card += resultFile(file[i].name));
//       hasilFile.innerHTML = cards;
//       console.log(file[i].name);
//       console.log(file[i].type);
//     } else {
//       notifArea.style.display = "block";
//       notifArea.innerHTML = notifError();
//     }
//   }
// }
