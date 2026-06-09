const {test , page, expect } = require ('@playwright/test');
const { text } = require('node:stream/consumers');

test ("cheap flight domestic index page all url display   " , async ({page}) => {

await page.goto("https://www.yatra.com/cheap-flights")

const Allroutes =  await page.locator('[class="block w-[190px] text-[14px] text-[#4D4D4D] hover:text-red-600 transition-colors"]')
 await Allroutes.first().waitFor() // maine yhn pr first nhi likha its good practise to write the first()
const Allroutesname = await Allroutes.allTextContents();


});

test ("Desired route booking page " ,async ({page}) => {
await page.goto("https://www.yatra.com/cheap-flights")

const Allroutes =  await page.locator('[class="block w-[190px] text-[14px] text-[#4D4D4D] hover:text-red-600 transition-colors"]')
 await Allroutes.first().waitFor() 
const urlcount = await Allroutes.count(); // 


for (let i=0 ; i < urlcount ; i++ ){

      // every route text print
     const routename = await Allroutes.nth(i).textContent(); // this for text content right but im using in if loop other make sure its tectcontnent one.

    if (routename  === 'Cheap Mumbai to Goa Flights') {
      
      //await Allroutes.nth(i).click();
     
      await Allroutes.nth(i).click();
      break; 
 
    }
await page.locator('[class="text-[#333333] font-bold mt-8 text-2xl leading-none"]')
  //await expect(Urlheading).toHaveText('Cheap flights from Mumbai to Goa, Cheapest Fares @₹3846')
    
}



// Using of hasText () we dont use loop for this but but its very high level approch and i'm heading towards
//test("Desired route booking page", async ({ page }) => {

  // Cleaner approach — no loop needed
  //await page.locator(
   // '[class="block w-[190px] text-[14px] text-[#4D4D4D] hover:text-red-600 transition-colors"]',{ hasText: 'Cheap Mumbai to Goa Flights' }).click();});


