const {test , expect } = require('@playwright/test')

test ("locating element " , async ({page})=> {

await page.goto("https://www.yatra.com/flight-schedule")

await page.click('title="Bangalore to Delhi Flight"')

await page.title().

});