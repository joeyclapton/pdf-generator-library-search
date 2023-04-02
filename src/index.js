require("dotenv").config();

const { Builder, Browser, By } = require("selenium-webdriver");
const fs = require("fs");
const PDFKit = require("pdfkit");

const URL = process.env.PUC_LIBRARY_HOST_SITE;

async function getBooksTitles(driver, id) {
  const booksContainer = await driver.findElement(By.className("result-list"));
  const booksList = await booksContainer.findElements(
    By.className("result-list-li")
  );

  const booksTitles = [];
  for (const book of booksList) {
    const bookTitle = await book.findElement(By.css(".title-link")).getText();
    booksTitles.push(bookTitle);
  }

  return booksTitles;
}

async function waitForPageLoad(driver) {
  return driver.wait(async function () {
    return (
      (await driver.executeScript("return document.readyState")) === "complete"
    );
  }, 10000);
}

async function init() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  const pdf = new PDFKit();

  try {
    await driver.get(URL);
    const inputField = driver.findElement(By.css("#searchboxholdingsid"));
    const originalWindow = await driver.getWindowHandle();

    inputField.sendKeys("Teste de Software");
    await inputField.submit();

    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      4000
    );
    const windows = await driver.getAllWindowHandles();

    for (const window of windows) {
      if (window !== originalWindow) {
        await driver.switchTo().window(window);
      }
    }

    const proceedButton = await driver.findElement(By.css("#proceed-button"));
    await proceedButton.click();

    const booksTitles = [];

    // EXEC 01
    await waitForPageLoad(driver);
    booksTitles.push(...(await getBooksTitles(driver, 0)));
    console.log("01: " + booksTitles.length);

    // EXEC 02-05
    for (let i = 2; i <= 5; i++) {
      const nextPage = await driver.findElement(
        By.css(
          `#ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext`
        )
      );
      await nextPage.click();
      await waitForPageLoad(driver);
      booksTitles.push(...(await getBooksTitles(driver)));
      console.log(`${i}: ${booksTitles.length}`);
    }

    pdf.fontSize("13").fillColor("#6155a4").text(JSON.stringify(booksTitles), {
      align: "center",
    });
    console.log(pdf);

    pdf.pipe(fs.createWriteStream("output.pdf"));
    pdf.end();
  } finally {
    await driver.quit();
  }
}

init();
