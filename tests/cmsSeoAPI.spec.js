import { test, expect } from "@playwright/test"
import { request } from "node:http"

test("Get Primary conmtent ", async function ({ request }) {

    const response01 = await request.get('http://172.31.94.59:31789/seo-cms/cms/airportInfo?cityName=delhi')

    const body = await response01.json()
    const body1 = await response01.headers()

    console.log(body, body1)

})


test("post request  ", async function ({ request }) {

    const authdata = {
        "airportName": "vikas_airlines",
        "iataCode": "vip",
        "icaoCode": "tjs",
        "city": "vipp",
        "country": "vip",
        "state": "vip",
        "airportType": "strvikasing",
       // "latitude": "strvvving",
      //  "longitude": "stsssring",
        "airlinesServing": "stssssring",
        "keyRoutes": "ssss",
        "operator": "ss",
        "nearestRailwayStation": "ss",
        "airportContactInfo": "32",
        "airportAddress": "23"
//"Gitanchsu": "fullstack acting baaz"
    }

    const response01 = await request.post("http://172.31.94.59:31789/seo-cms/cms/airportInfo", { headers: { "Content-Type": "application/json" }, data: authdata })
   
const statuscode = await response01.status()


const statuscodetext = await response01.statusText()
    console.log("status:",response01.status())

    // const resdata = await response01.json()
const resdata = await response01.json()
    console.log(resdata)
    console.log((resdata.country))
expect(resdata.country).toBe("vip")

expect(statuscode).toBe(201)
expect(statuscodetext).toBe("created")


})



//put request url //http://172.31.94.59:31789/seo-cms/cms/airportInfo?cityName=pune
