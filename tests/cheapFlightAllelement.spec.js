const {test , page, expect } = require("@playwright/test")

test("Drop down functionality " , async ({page}) => {

await page.goto('https://www.yatra.com/cms-seo/login')
await page.locator('#email').type("Admin@gmail.com")
await page.locator('#password').fill("Admin@1234")
await page.getByRole('button', { name: 'Sign in' }).click()

await page.waitForTimeout(5000)
//await page.getByAltText('Non Stop').nth(0).click();

await page.pause();





//await page.locator('.checkmark').first().click();
//await page.getByPlaceholder('Select Origin')
// const check =expect(page.locator('.checkmark').first()).toBeChecked();
//console.log(check);
//await page.pause();
});
