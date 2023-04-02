require("dotenv").config();

const fs = require("fs");
const PDFKit = require("pdfkit");

const { Builder, Browser, By } = require("selenium-webdriver");

const URL = process.env.PUC_LIBRARY_HOST_SITE;

async function getBooksText(driver, id) {
  const booksContainer = await driver.findElement(By.className("result-list"));
  const booksList = await booksContainer.findElements(
    By.className("result-list-li")
  );

  return booksList.map(async (book, index) => {
    return await book.findElement(By.css(".title-link")).getText();
  });
}

(async function init() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  const pdf = new PDFKit();

  try {
    await driver.get(URL);
    const input = driver.findElement(By.css("#searchboxholdingsid"));
    const originalWindow = await driver.getWindowHandle();

    input.sendKeys("Teste de Software");
    await input.submit();

    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      4000
    );
    const windows = await driver.getAllWindowHandles();

    windows.forEach(async (handle) => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });

    const proceed = await driver.findElement(By.css("#proceed-button"));

    await proceed.click();

    // EXEC 01
    await driver.wait(async function () {
      return (
        (await driver.executeScript("return document.readyState")) ===
        "complete"
      );
    }, 10000);
    const booksTexts = await Promise.all(await getBooksText(driver, 0));
    console.log("01: " + booksTexts.length);

    // // EXEC 02
    // let nextPage = await driver.findElement(
    //   By.css(
    //     "#ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext"
    //   )
    // );
    // nextPage.click();
    // await driver.wait(async function () {
    //   return (
    //     (await driver.executeScript("return document.readyState")) ===
    //     "complete"
    //   );
    // }, 10000);
    // booksTexts.push(...(await Promise.all(await getBooksText(driver))));
    // console.log("02: " + booksTexts.length);

    // // EXEC 03
    // nextPage = await driver.findElement(
    //   By.css(
    //     "#ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext"
    //   )
    // );
    // nextPage.click();
    // await driver.wait(async function () {
    //   return (
    //     (await driver.executeScript("return document.readyState")) ===
    //     "complete"
    //   );
    // }, 10000);
    // booksTexts.push(...(await Promise.all(await getBooksText(driver))));
    // console.log("03: " + booksTexts.length);

    // // EXEC 04
    // nextPage = await driver.findElement(
    //   By.css(
    //     "#ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext"
    //   )
    // );
    // nextPage.click();
    // await driver.wait(async function () {
    //   return (
    //     (await driver.executeScript("return document.readyState")) ===
    //     "complete"
    //   );
    // }, 10000);
    // booksTexts.push(...(await Promise.all(await getBooksText(driver))));
    // console.log("04: " + booksTexts.length);

    // // EXEC 05
    // nextPage = await driver.findElement(
    //   By.css(
    //     "#ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext"
    //   )
    // );
    // nextPage.click();
    // await driver.wait(async function () {
    //   return (
    //     (await driver.executeScript("return document.readyState")) ===
    //     "complete"
    //   );
    // }, 10000);
    // booksTexts.push(...(await Promise.all(await getBooksText(driver))));
    // console.log("03: " + booksTexts.length);

    // fs.appendFile("mynewfile1.txt", JSON.stringify(booksTexts), function (err) {
    //   if (err) throw err;
    //   console.log("Saved!");
    // });

    pdf.fontSize("13").fillColor("#6155a4").text(JSON.stringify(booksTexts), {
      align: "center",
    });
    console.log(pdf);

    pdf.pipe(fs.createWriteStream("output.pdf"));
    pdf.end();

    //await driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN);
    // await driver.wait(until.titleIs("webdriver - Google Search"), 1000);
  } finally {
    await driver.quit();
  }
})();
