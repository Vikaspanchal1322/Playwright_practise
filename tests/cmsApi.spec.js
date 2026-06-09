const {test, expect ,request } = require ("@playwright/test")

test("Testing chaining of filters ", async({page}) =>
    {
await page.goto("https://testsheepnz.github.io/BasicCalculator.html")
await page.getByTestId('selectBuild').selectOption('5');


})