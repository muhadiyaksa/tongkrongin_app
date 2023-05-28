const checkedDuplicate = (formFood) => {
  let pembanding = [];
  let noDuplicate = [];
  for (let i = 0; i < formFood.length; i++) {
    pembanding.push(formFood[i]);
    if (pembanding[i - 1]) {
      if (formFood[i + 1]) {
        if (formFood[i] !== pembanding[i - 1] && formFood[i] !== formFood[i + 1]) {
          noDuplicate.push(formFood[i]);
        }
      } else {
        if (formFood[i] !== pembanding[i - 1]) {
          noDuplicate.push(formFood[i]);
        }
      }
    } else {
      if (pembanding[i] !== formFood[i + 1]) {
        noDuplicate.push(formFood[i]);
      }
    }
  }
  return noDuplicate;
};

const returnNoDuplicate = (formFood) => {
  let pembanding = [];
  let noDuplicate = [];
  for (let i = 0; i < formFood.length; i++) {
    pembanding.push(formFood[i]);
    if (pembanding[i - 1]) {
      if (formFood[i + 1]) {
        if (formFood[i] == pembanding[i - 1] && formFood[i] == formFood[i + 1]) {
          noDuplicate.push(formFood[i]);
        }
      } else {
        if (formFood[i] == pembanding[i - 1]) {
          noDuplicate.push(formFood[i]);
        }
      }
    } else {
      if (pembanding[i] == formFood[i + 1]) {
        noDuplicate.push(formFood[i]);
      }
    }
  }
  return noDuplicate;
};

const changeDateFormat = (tanggal) => {
  let arr = tanggal.split("-");
  let bulan = ["", "januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
  let bulanIndex;
  if (arr[1].split("")[0] == "0") {
    bulanIndex = arr[1].slice(1, 2);
  } else {
    bulanIndex = arr[1];
  }

  detailTanggal = `${arr[2]} ${bulan[bulanIndex]} ${arr[0]}`;
  return detailTanggal;
};

module.exports = { checkedDuplicate, returnNoDuplicate, changeDateFormat };
