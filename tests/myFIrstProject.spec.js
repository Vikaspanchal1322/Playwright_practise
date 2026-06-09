const {test , expect } = require('@playwright/test')

test("Launch-flight-schedule " , async({page }) => {

 await page.goto('https://www.yatra.com/flight-schedule/mumbai-to-varanasi-flights.html') ,
  await expect(page).toHaveTitle('Mumbai to Varanasi Flights - Lowest Fares @ ₹6556 + ₹5000 OFF | Yatra.com')
  await page.locator("xpath = /html/body/div/div/div/div[4]/div/div/main/section/section[1]/article[1]/article/div[2]/div[2]/button").click()
  //await expect(page).toHaveTitle
})
