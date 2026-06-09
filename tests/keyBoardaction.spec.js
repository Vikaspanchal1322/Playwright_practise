const { test , page } = require ('@playwright/test')

test ("keyboard actions performs ", async({page}) =>{

await page.goto("https://www.google.com/?zx=1778756808650")
await page.locator("textarea[name='q']").type("Vikas Panchal google  ")
//await page.keyboard.press("Enter")
await page.keyboard.press("Control+A")
await page.keyboard.press("Backspace")

});
