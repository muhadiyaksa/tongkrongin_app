const fs = require("fs");
const path = require("path");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const readFile = utils.promisify(fs.readFile);

async function getTemplateHtml() {
  console.log("Loading template file in memory");
  try {
    const invoicePath = path.resolve("./views/template.html");
    return await readFile(invoicePath, "utf8");
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}

async function generatePdf(filename, dataDB) {
  getTemplateHtml()
    .then(async (res) => {
      const template = hb.compile(res, { strict: true });
      const result = template(dataDB);
      const html = result;

      const browser = await puppeteer.launch({ headless: false, args: ["--no-sandbox", "--disabled-setupid-sandbox"] });
      const page = await browser.newPage();

      await page.setContent(html);
      await page.pdf({ path: "./public/docs/" + filename, format: "A4" });
      await browser.close();
      console.log("PDF Generated");
    })
    .catch((err) => {
      console.error(err);
    });
}

async function getTemplateHtmlBooking() {
  console.log("Loading template file in memory");
  try {
    const invoicePath = path.resolve("./views/templateKodeBooking.html");
    return await readFile(invoicePath, "utf8");
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}
async function generatePdfBooking(filename, dataDB) {
  getTemplateHtmlBooking()
    .then(async (res) => {
      const template = hb.compile(res, { strict: true });
      const result = template(dataDB);
      const html = result;

      const browser = await puppeteer.launch({ headless: false, args: ["--no-sandbox", "--disabled-setupid-sandbox"] });

      const page = await browser.newPage();

      await page.setContent(html);
      await page.pdf({ path: "./public/docs-booking/" + filename, format: "A4" });
      await browser.close();
      console.log("PDF Booking Generated ");
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { generatePdf, generatePdfBooking };
