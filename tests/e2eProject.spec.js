const { test, expect } = require("@playwright/test");

test("End to End flow of Ecom", async ({ page }) => {
  // 1. Go to the web application
  await page.goto("https://www.saucedemo.com/");

  // 2. Log in using precise ID selectors
  await page.locator("#user-name").fill("standard_user");
  await page.locator("#password").fill("secret_sauce");
  await page.locator("#login-button").click();
  
  // 3. Verify successful login (Playwright auto-waits here dynamically)
  await expect(page).toHaveURL(/.*inventory.html/);
  
  // Clean way to print the URL if needed for debugging:
  console.log("Logged in successfully. Current URL:", page.url());

  // 4. Add item to cart using fixed attribute selector syntax
  // Note the single quotes inside the double quotes: '[data-test="..."]'
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

  // Optional: Verify item was added by checking the shopping cart badge
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');

  await page.locator('[class="shopping_cart_link"]').click()
  await page.locator('[class="cart_list"]').waitFor(); // this is for the check or wait till the all add to cart  item display using Waitfor() this
   const text =await page.locator('[class="title"]').textContent()
   console.log('text present is '+text)
 // await expect(page).toHaveURL('/cart.html');
await page.locator('[id="checkout"]').click();

 const urlvali =await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html')
console.log('url is confirm and it is '+ urlvali )
await page.pause();

});