const {test, expect} = require('@playwright/test')

test ("Test name is File uploader " , async({page}) => {

await page.goto("https://automationtesting.co.uk/fileupload.html")
await page.locator("#fileToUpload").setInputFiles("./files/VikasYatraResume.pdf");
page.waitForTimeout(5000);
await page.locator("#submit").click();

});