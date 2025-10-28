const { By, Builder, Browser } = require('selenium-webdriver');


(async function firstTest() {
  let driver;

  const upload_dates = [
    // "01/07/2025",
    // "03/07/2025",
    // "04/07/2025",
    "07/07/2025",
    "08/07/2025",
    "09/07/2025",
    "10/07/2025",
    "11/07/2025",
    "14/07/2025",
    "15/07/2025",
    "17/07/2025",
    "18/07/2025",
    "21/07/2025",
    "22/07/2025",
    "25/07/2025",
    "28/07/2025",
    "29/07/2025",
    "01/08/2025",
    "18/08/2025",
    "19/08/2025",
    "22/08/2025",
    "26/08/2025",
    "29/08/2025",
    "01/09/2025",
    "02/09/2025",
    "05/09/2025",
    "09/09/2025",
    "12/09/2025",
    "15/09/2025",
    "16/09/2025",
    "19/09/2025",
    "23/09/2025",
    "26/09/2025",
    "29/09/2025",
  ]

  try {
    // let options = new chrome.Options();
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    // await new Promise(r => setTimeout(r, 10000));
    // await driver.manage().setTimeouts({ implicit: 3000 });
    await driver.get('https://www.selenium.dev/selenium/web/web-form.html')
    // await driver.get('https://eu2.concursolutions.com/nui/expense/report/E842B8482BE044B8BBF3');



    // await new Promise(r => setTimeout(r, 5000));

    // for (let index = 0; index < upload_dates.length; index++) {
    //   const upload_dt_i = upload_dates[index];
    await driver.get("https://eu2.concursolutions.com/nui/expense/report/E842B8482BE044B8BBF3")
    await driver.manage().window().setRect(1294, 1392)
    //   await driver.findElement(By.css(".sapcnqr-button__text:nth-child(2)")).click()
    //   await driver.findElement(By.css(".create-new-expense-menu-item .sapcnqr-menu-button-item__start-content")).click()
    //   await driver.findElement(By.css(".sapcnqr-list-item:nth-child(1) .sapcnqr-list-item:nth-child(1) .sapcnqr-button__inner")).click()
    //   await driver.findElement(By.id("transactionDate-date-input-field-input")).sendKeys(upload_dt_i)
    //   await driver.findElement(By.css(".form-field-render-wrapper__row")).click()
    //   await driver.findElement(By.css(".sapcnqr-toolbar__start > .sapcnqr-button:nth-child(1) .sapcnqr-button__text")).click()  
    // }
  } catch (e) {
    console.log(e)
  } finally {
    // await driver.quit();
  }
}())
