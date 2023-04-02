require("dotenv").config();

const { createPdf } = require("./helpers/pdf/pdf");
const { initDriver } = require("./helpers/selenium/driver");
const {
  getBooksTitles,
  waitForPageLoad,
} = require("./helpers/selenium/scraper");
const URL = process.env.BASE_URL;

async function init() {
  const driver = await initDriver();
  const booksTitles = [];

  try {
    await driver.get("https://portal.pucminas.br/biblioteca/index_padrao.php");
    const inputField = await driver.findElement({
      css: "#searchboxholdingsid",
    });
    const originalWindow = await driver.getWindowHandle();

    await inputField.sendKeys("Teste de Software");
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

    const proceedButton = await driver.findElement({ css: "#proceed-button" });
    await proceedButton.click();

    // EXEC 01
    await waitForPageLoad(driver);
    booksTitles.push(...(await getBooksTitles(driver, 0)));
    console.log("01: " + booksTitles.length);

    // EXEC 02-05
    for (let i = 2; i <= 5; i++) {
      const nextPage = await driver.findElement({
        css: `#ctl00_ctl00_MainContentArea_MainContentArea_bottomMultiPage_lnkNext`,
      });
      await nextPage.click();
      await waitForPageLoad(driver);
      booksTitles.push(...(await getBooksTitles(driver)));
      console.log(`${i}: ${booksTitles.length}`);
    }

    await createPdf(booksTitles);
  } finally {
    await driver.quit();
  }
}

init();
