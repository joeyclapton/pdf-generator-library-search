const { By } = require("selenium-webdriver");

const getBooksTitles = async (driver) => {
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
};

const waitForPageLoad = async (driver) => {
  return driver.wait(async function () {
    return (
      (await driver.executeScript("return document.readyState")) === "complete"
    );
  }, 10000);
};

module.exports = { getBooksTitles, waitForPageLoad };
