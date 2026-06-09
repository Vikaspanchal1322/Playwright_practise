// ============================================================
// FILE: tests/cheapFlights.api.spec.js
// PURPOSE: API test suite for Cheap Flights Domestic Search
// COVERAGE: All 19 SSR APIs + client autocomplete proxy
// AUTHOR: Learning Playwright — API Testing
// ============================================================

const { test, expect, request } = require('@playwright/test');

// ============================================================
// CONSTANTS — replace these with your actual environment URLs
// before running. In real projects these come from .env file
// ============================================================
const BASE_URL = 'http://172.31.94.59:32567/flight-seo';        // NEXT_PUBLIC_BASE_URL
const SEO_CMS_BASE_URL = 'http://172.31.94.59:31789'; // NEXT_PUBLIC_SEO_CONTENT_BASE_URL
const SITE_URL = 'https://www.yatra.com';                 // live site base

// Test data — source and destination used across all tests
const SOURCE           = 'delhi';
const DESTINATION      = 'mumbai';

// Common headers sent with every API call (as per your API doc)
const COMMON_HEADERS = {
  'Content-Type'    : 'application/json',
  'X-Request-Type'  : 'real-user',
  'X-Crawler-Type'  : 'Real User',
  'User-Agent'      : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

// ============================================================
// SECTION 1 — CITY VALIDATION APIs (API #1 and #2)
// Endpoint: GET /api/city/checkTheCityName?input={city}
// Purpose : Validates whether a city name exists in the system
// ============================================================
test.describe('1. City Validation API', () => {

  // Test 1a — validate source city
  test('should validate source city name — delhi', async ({ request }) => {

    // Send GET request to city validation endpoint
    const response = await request.get(`${BASE_URL}/api/city/checkTheCityName`, {
      params : { input: SOURCE },   // query param: ?input=delhi
      headers: COMMON_HEADERS,
    });

    // Step 1: check HTTP status is 200 OK
    expect(response.status()).toBe(200);

    // Step 2: parse the JSON response body
    const body = await response.json();
    console.log('Source city validation response:', body);

    // Step 3: confirm the response body is not empty
    expect(body).toBeTruthy();
  });

  // Test 1b — validate destination city
  test('should validate destination city name — mumbai', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/city/checkTheCityName`, {
      params : { input: DESTINATION }, // query param: ?input=mumbai
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Destination city validation response:', body);

    expect(body).toBeTruthy();
  });

  // Test 1c — negative test: pass an invalid city name
  test('should handle invalid city name gracefully', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/city/checkTheCityName`, {
      params : { input: 'xyzinvalidcity123' },
      headers: COMMON_HEADERS,
    });

    // API should still respond — either 200 with empty result or 404
    // It should NOT crash with 500
    expect([200, 404]).toContain(response.status());
    console.log('Invalid city response status:', response.status());
  });

});

// ============================================================
// SECTION 2 — CITY CODE APIs (API #3 and #4)
// Endpoint: GET /api/city/code?input={city}
// Purpose : Fetches IATA code or city code for a given city
// ============================================================
test.describe('2. City Code API', () => {

  test('should return IATA code for source city — delhi', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/city/code`, {
      params : { input: SOURCE },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Source city code:', body);

    // City code must exist and not be empty
    expect(body).toBeTruthy();
  });

  test('should return IATA code for destination city — mumbai', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/city/code`, {
      params : { input: DESTINATION },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Destination city code:', body);

    expect(body).toBeTruthy();
  });

});

// ============================================================
// SECTION 3 — TOP ROUTES APIs (API #5, #6, #7, #8)
// Endpoint: GET /flights/top-routes?cityCodeOrName={city}&routeType={type}
// Purpose : Fetches top flight routes FROM/TO source and destination
// routeType values: FROM_SOURCE | TO_SOURCE | FROM_DESTINATION | TO_DESTINATION
// ============================================================
test.describe('3. Top Routes API', () => {

  // All 4 route types to be tested — we loop through them
  const routeTests = [
    { city: SOURCE,      routeType: 'FROM_SOURCE',      label: 'routes FROM source (delhi)'           },
    { city: SOURCE,      routeType: 'TO_SOURCE',        label: 'routes TO source (delhi)'             },
    { city: DESTINATION, routeType: 'FROM_DESTINATION', label: 'routes FROM destination (mumbai)'     },
    { city: DESTINATION, routeType: 'TO_DESTINATION',   label: 'routes TO destination (mumbai)'       },
  ];

  for (const { city, routeType, label } of routeTests) {

    test(`should return ${label}`, async ({ request }) => {

      const response = await request.get(`${BASE_URL}/flights/top-routes`, {
        params: {
          cityCodeOrName: city,      // city name or IATA code
          routeType     : routeType, // type of route direction
        },
        headers: COMMON_HEADERS,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      console.log(`Top routes [${routeType}]:`, body);

      // Response should be an array or an object with routes
      expect(body).toBeTruthy();
    });
  }

});

// ============================================================
// SECTION 4 — MOST POPULAR ROUTES API (API #9)
// Endpoint: GET /flights/most-popular-flight-route?tenant=dom
// Purpose : Returns most searched domestic flight routes
// ============================================================
test.describe('4. Most Popular Flight Routes API', () => {

  test('should return most searched domestic routes', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/flights/most-popular-flight-route`, {
      params : { tenant: 'dom' }, // 'dom' = domestic
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Most popular routes:', body);

    // Should return a non-empty response
    expect(body).toBeTruthy();

    // If response is an array, it should have at least 1 route
    if (Array.isArray(body)) {
      expect(body.length).toBeGreaterThan(0);
    }
  });

});

// ============================================================
// SECTION 5 — LOWEST FARE CALENDAR API (API #10)
// Endpoint: GET /flights/get-lowest-fare-calender?origin={src}&destination={dest}
// Purpose : Returns cheapest available fares across a calendar view
// ============================================================
test.describe('5. Lowest Fare Calendar API', () => {

  test('should return lowest fare calendar for delhi to mumbai', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/flights/get-lowest-fare-calender`, {
      params: {
        origin     : SOURCE,      // e.g. delhi
        destination: DESTINATION, // e.g. mumbai
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Lowest fare calendar data:', body);

    expect(body).toBeTruthy();
  });

});

// ============================================================
// SECTION 6 — FLIGHT CARDS / FARES API (API #11)
// Endpoint: GET /flights/seo-dom-trigger?origin={src}&destination={dest}
// Purpose : Returns actual flight cards with prices shown on SEO page
// This is the MOST IMPORTANT API — it drives the main listing
// Optional param: clearCache=true — busts server-side cache
// ============================================================
test.describe('6. Flight Cards (seo-dom-trigger) API', () => {

  test('should return flight cards data for delhi to mumbai', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/flights/seo-dom-trigger`, {
      params: {
        origin     : SOURCE,
        destination: DESTINATION,
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Flight cards (fcd) response:', JSON.stringify(body).slice(0, 300)); // show first 300 chars only

    // Response must exist
    expect(body).toBeTruthy();

    // The API doc says response maps to 'fcd' — check that key exists
    // Adjust this assertion based on actual response shape
    // expect(body.fcd).toBeDefined();
  });

  test('should return flight cards with clearCache=true param', async ({ request }) => {

    // clearCache=true forces server to bypass cached data and fetch fresh
    const response = await request.get(`${BASE_URL}/flights/seo-dom-trigger`, {
      params: {
        origin     : SOURCE,
        destination: DESTINATION,
        clearCache : true, // cache bust — as per API doc section 7
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toBeTruthy();
    console.log('Flight cards with cache bust:', body);
  });

});

// ============================================================
// SECTION 7 — SEO CONTENT API (API #12)
// Endpoint: GET {SEO_CMS_BASE_URL}/seo-cms/cms/getTheContentsForTheRoute
// Purpose : Returns SEO text block + FAQs for the route page
// Note    : Has a 2-second timeout in production — test covers that
// ============================================================
test.describe('7. SEO Route Content API', () => {

  test('should return SEO content and FAQs for route', async ({ request }) => {

    const response = await request.get(
      `${SEO_CMS_BASE_URL}/seo-cms/cms/getTheContentsForTheRoute`,
      {
        params: {
          source     : SOURCE,
          destination: DESTINATION,
          contentType: 'CHEAP_FLIGHTS', // fixed value as per doc
        },
        headers : COMMON_HEADERS,
        timeout : 5000, // 5s timeout — doc says 2s in prod, we give extra buffer in test
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('SEO content response:', body);

    expect(body).toBeTruthy();
  });

  test('should handle clearCache=true on SEO content API', async ({ request }) => {

    const response = await request.get(
      `${SEO_CMS_BASE_URL}/seo-cms/cms/getTheContentsForTheRoute`,
      {
        params: {
          source     : SOURCE,
          destination: DESTINATION,
          contentType: 'CHEAP_FLIGHTS',
          clearCache : true, // cache bust param as per doc section 7
        },
        headers: COMMON_HEADERS,
        timeout: 5000,
      }
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeTruthy();
  });

});

// ============================================================
// SECTION 8 — PRIMARY CONTENT API (API #13)
// Endpoint: GET {SEO_CMS_BASE_URL}/seo-cms/cms/primary-content
// Purpose : Returns H1 heading and main description for the page
// ============================================================
test.describe('8. Primary Content API', () => {

  test('should return H1 title and description for route', async ({ request }) => {

    const response = await request.get(`${SEO_CMS_BASE_URL}/seo-cms/cms/primary-content`, {
      params: {
        source     : SOURCE,
        destination: DESTINATION,
        contentType: 'CHEAP_FLIGHTS',
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Primary content (H1/description):', body);

    // title and description should be present as per response mapping in doc
    expect(body).toBeTruthy();
    // Uncomment once you know exact response shape:
    // expect(body.title).toBeDefined();
    // expect(body.description).toBeDefined();
  });

});

// ============================================================
// SECTION 9 — OFFER BANNER API (API #14)
// Endpoint: GET {SEO_CMS_BASE_URL}/seo-cms/cms/getTheOfferBanner
// Purpose : Returns bank offers / promotional carousel data
// ============================================================
test.describe('9. Offer Banner API', () => {

  test('should return offer banner data', async ({ request }) => {

    const response = await request.get(`${SEO_CMS_BASE_URL}/seo-cms/cms/getTheOfferBanner`, {
      headers: COMMON_HEADERS,
      // No required params — works without source/destination
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Offer banner response:', body);

    expect(body).toBeTruthy();
  });

  test('should return fresh offer banner with clearCache=true', async ({ request }) => {

    const response = await request.get(`${SEO_CMS_BASE_URL}/seo-cms/cms/getTheOfferBanner`, {
      params : { clearCache: true },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeTruthy();
  });

});

// ============================================================
// SECTION 10 — NEARBY AIRPORTS APIs (API #15 and #16)
// Endpoint: GET /api/airports/nearby-by-city?city={city}&radiusKm=50&limit=50
// Purpose : Returns airports within 50km radius of source and destination
// ============================================================
test.describe('10. Nearby Airports API', () => {

  test('should return nearby airports for source city — delhi', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/airports/nearby-by-city`, {
      params: {
        city    : SOURCE,
        radiusKm: 50,  // 50km radius — fixed as per doc
        limit   : 50,  // max 50 results — fixed as per doc
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Nearby airports — source:', body);

    expect(body).toBeTruthy();

    // If array, should have at least 1 nearby airport
    if (Array.isArray(body)) {
      expect(body.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('should return nearby airports for destination city — mumbai', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/api/airports/nearby-by-city`, {
      params: {
        city    : DESTINATION,
        radiusKm: 50,
        limit   : 50,
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Nearby airports — destination:', body);

    expect(body).toBeTruthy();
  });

});

// ============================================================
// SECTION 11 — PAGE-LEVEL CMS APIs (API #17, #18, #19)
// These 3 APIs are called at the page level (not inside fetchFlightData)
// ============================================================
test.describe('11. Page-level CMS APIs', () => {

  // API #17 — Flight Meta Tags (used for <head> SEO tags)
  test('should return flight meta tags for SEO head', async ({ request }) => {

    const response = await request.get(`${SEO_CMS_BASE_URL}/seo-cms/cms/flight-meta-tag`, {
      params: {
        source     : SOURCE,
        destination: DESTINATION,
        contentType: 'CHEAP_FLIGHTS',
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Meta tags response:', body);

    expect(body).toBeTruthy();
  });

  // API #18 — Footer Routes (links shown in page footer)
  test('should return footer route links', async ({ request }) => {

    const response = await request.get(`${SEO_CMS_BASE_URL}/seo-cms/cms/getFooterRoutes`, {
      params: {
        contentType: 'CHEAP_FLIGHTS',
        source     : SOURCE,
        destination: DESTINATION,
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Footer routes response:', body);

    expect(body).toBeTruthy();
  });

  // API #19 — Module Interlinks (internal link modules on page)
  test('should return module interlinks for route page', async ({ request }) => {

    const response = await request.get(`${SEO_CMS_BASE_URL}/seo-cms/cms/moduleInterlink`, {
      params: {
        contentType                   : 'CHEAP_FLIGHTS',
        sourceCityNameOrCityCode      : SOURCE,       // note: different param name vs other APIs
        destinationCityNameOrCityCode : DESTINATION,  // note: different param name vs other APIs
      },
      headers: COMMON_HEADERS,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Module interlinks response:', body);

    expect(body).toBeTruthy();
  });

});

// ============================================================
// SECTION 12 — CLIENT-SIDE CITY AUTOCOMPLETE (API #20)
// This is the PROXY endpoint — browser calls Next.js proxy
// Next.js proxy then calls: yatra.com/nearby-service/autoSuggest
// Purpose: Powers the city search dropdown when user types
// ============================================================
test.describe('12. City Autocomplete Proxy API', () => {

  test('should return city suggestions for search query "del"', async ({ request }) => {

    // This hits the Next.js proxy route — not BASE_URL directly
    const response = await request.get(
      `${SITE_URL}/cheap-flights/api/flights/search`,
      {
        params : { text: 'del' }, // partial city name typed by user
        headers: COMMON_HEADERS,
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('City autocomplete results for "del":', body);

    expect(body).toBeTruthy();

    // Should return a list — at least 1 suggestion for a real city
    if (Array.isArray(body)) {
      expect(body.length).toBeGreaterThan(0);
    }
  });

  test('should return empty or handled response for gibberish input', async ({ request }) => {

    const response = await request.get(
      `${SITE_URL}/cheap-flights/api/flights/search`,
      {
        params : { text: 'zzzzxxx999' },
        headers: COMMON_HEADERS,
      }
    );

    // Should not crash — graceful empty response expected
    expect([200, 204]).toContain(response.status());
    console.log('Autocomplete gibberish status:', response.status());
  });

});

// ============================================================
// SECTION 13 — RESPONSE TIME (PERFORMANCE) CHECKS
// Check that critical APIs respond within acceptable time
// ============================================================
test.describe('13. API Response Time Checks', () => {

  test('flight cards API should respond within 3 seconds', async ({ request }) => {

    const startTime = Date.now(); // record start time

    const response = await request.get(`${BASE_URL}/flights/seo-dom-trigger`, {
      params : { origin: SOURCE, destination: DESTINATION },
      headers: COMMON_HEADERS,
    });

    const responseTime = Date.now() - startTime; // calculate time taken

    console.log(`Flight cards API response time: ${responseTime}ms`);

    // Assert API responded within 3000ms (3 seconds)
    expect(responseTime).toBeLessThan(3000);
    expect(response.status()).toBe(200);
  });

  test('city validation API should respond within 1 second', async ({ request }) => {

    const startTime = Date.now();

    const response = await request.get(`${BASE_URL}/api/city/checkTheCityName`, {
      params : { input: SOURCE },
      headers: COMMON_HEADERS,
    });

    const responseTime = Date.now() - startTime;

    console.log(`City validation API response time: ${responseTime}ms`);
    expect(responseTime).toBeLessThan(1000);
    expect(response.status()).toBe(200);
  });

});

// ============================================================
// SECTION 14 — STATUS CODE VALIDATION (NEGATIVE TESTS)
// Confirm APIs return correct HTTP codes for bad requests
// ============================================================
test.describe('14. Negative Tests — Wrong/Missing Params', () => {

  test('flight cards API with missing origin should not return 200', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/flights/seo-dom-trigger`, {
      params : { destination: DESTINATION }, // origin is intentionally missing
      headers: COMMON_HEADERS,
    });

    // Should return 400 Bad Request or similar — NOT 200
    console.log('Missing origin — response status:', response.status());
    expect(response.status()).not.toBe(200);
  });

  test('lowest fare calendar with missing destination should not return 200', async ({ request }) => {

    const response = await request.get(`${BASE_URL}/flights/get-lowest-fare-calender`, {
      params : { origin: SOURCE }, // destination is intentionally missing
      headers: COMMON_HEADERS,
    });

    console.log('Missing destination — response status:', response.status());
    expect(response.status()).not.toBe(200);
  });

});