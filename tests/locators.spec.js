const {test , expect } = require('@playwright/test')
 test.use({viewport:{width:1200, height:1800}})

test("Launch-flight-schedule " , async({page }) => {

 await page.goto('https://www.yatra.com/') 
 //await page.getByRole("button", {name:"search"}).click();
  await page.getByTitle("Join Yatra Prime").click();
await page.pause();




});
