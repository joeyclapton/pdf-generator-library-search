const { Builder, Browser } = require("selenium-webdriver");

const initDriver = async () => {
  return await new Builder().forBrowser(Browser.CHROME).build();
};

module.exports = { initDriver };
