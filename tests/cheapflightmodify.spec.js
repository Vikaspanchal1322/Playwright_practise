const { test, expect } = require('@playwright/test');

// पहला टेस्ट: सिर्फ सारे रूट्स प्रिंट करने के लिए
test("cheap flight domestic index page all url display", async ({ page }) => {
  await page.goto("https://www.yatra.com/cheap-flights");
  
  const Allroutes = page.locator('[class="block w-[190px] text-[14px] text-[#4D4D4D] hover:text-red-600 transition-colors"]');
  await Allroutes.first().waitFor();// wait till all the url complete display 
  
  const textContents = await Allroutes.allTextContents();
  console.log(textContents);
});

// दूसरा टेस्ट: मनपसंद रूट ढूंढकर क्लिक करने के लिए
test("Desired route booking page", async ({ page }) => {
  await page.goto("https://www.yatra.com/cheap-flights");

  // सुधार (Fix): दूसरे टेस्ट को भी बताना पड़ेगा कि 'Allroutes' और 'urlcount' क्या हैं
  const Allroutes = page.locator('[class="block w-[190px] text-[14px] text-[#4D4D4D] hover:text-red-600 transition-colors"]');
  await Allroutes.first().waitFor();
  
  const urlcount = await Allroutes.count(); // अब यह एरर नहीं देगा!

  for (let i = 0; i < urlcount; i++) {
    const routename = await Allroutes.nth(i).textContent();
    const cleanRouteName = routename ? routename.trim() : "";

    if (cleanRouteName === 'Cheap Mumbai to Goa Flights') {
      console.log(`मैच मिल गया! इंडेक्स ${i} पर क्लिक कर रहे हैं...`);
      await Allroutes.nth(i).click();
      break; 
    }
  }

  //test("Desired route booking page", async ({ page }) => {

  // Cleaner approach — no loop needed
  //await page.locator(
   // '[class="block w-[190px] text-[14px] text-[#4D4D4D] hover:text-red-600 transition-colors"]',
    //{ hasText: 'Cheap Mumbai to Goa Flights' }
  //).click();
});