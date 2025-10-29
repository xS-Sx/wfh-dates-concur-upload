const fs = require('fs');
const Chrome = require('selenium-webdriver/chrome');
const { Browser, Builder, By } = require("selenium-webdriver");


(async function firstTest() {
  let driver

  const data = fs.readFileSync('wfh-upload.config.json')
  const config = JSON.parse(data)
  const browserPath = config.BROWSER_PATH
  const webDriverPath = config.WEB_DRIVER_PATH
  const uploadDates = config.UPLOAD_DATES
  const entryUrl = config.ENTRY_URL

  try {
    let options = new Chrome.Options()
    options.setChromeBinaryPath(browserPath)

    let service = new Chrome.ServiceBuilder(webDriverPath)

    driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).setChromeService(service).build()
    await driver.manage().setTimeouts({ implicit: 15000 })
    originalWindow = await driver.getWindowHandle()

    await driver.get(entryUrl)
    await driver.manage().window().setRect(1225, 993)
    await driver.findElement(By.css("#d6473769-f43b-41a8-975c-4bd2a835a952-cardContent .ThumbnailIcon_thumbnailIconContainer__bZOCP")).click()

    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      10000
    );
    //Loop through until we find a new window handle
    const windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });

    await driver.findElement(By.css(".hhsg-tasks-left-side")).click()


    for (let index = 0; index < uploadDates.length; index++) {
      const upload_dt_i = uploadDates[index];

      await driver.findElement(By.css(".sapcnqr-button__text:nth-child(2)")).click()
      await driver.findElement(By.css(".create-new-expense-menu-item .sapcnqr-menu-button-item__start-content")).click()
      await driver.findElement(By.css(".sapcnqr-list-item:nth-child(1) .sapcnqr-list-item:nth-child(1) .sapcnqr-button__inner")).click()
      await driver.findElement(By.id("transactionDate-date-input-field-input")).click()
      await driver.findElement(By.id("transactionDate-date-input-field-input")).sendKeys(upload_dt_i)
      await driver.findElement(By.css(".sapcnqr-toolbar__start > .sapcnqr-button:nth-child(1) .sapcnqr-button__text")).click()
    }
  } catch (e) {
    console.log(e)
  } finally {
    // await driver.quit();
  }
}())
