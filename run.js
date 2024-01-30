const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const urls = require('./urls.js');

// Configuratie
const outputPath = 'screenshots'; // Het pad waar de screenshots moeten worden opgeslagen

// Functie om screenshots te maken en op te slaan
async function takeScreenshot(url) {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Genereer een bestandsnaam op basis van de URL (verwijder ongeldige tekens)
  const filename = url.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
  const filePath = path.join(outputPath, filename);

  // Maak een screenshot en sla het op
  await page.screenshot({ path: filePath });

  console.log(`Screenshot voor ${url} opgeslagen op ${filePath}`);

  await browser.close();

  await new Promise(resolve => setTimeout(resolve, 1000));
}

// Maak de output map als deze nog niet bestaat
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

// Loop door de lijst van URLs en maak screenshots
(async () => {
  for (const url of urls) {
    await takeScreenshot(url);
  }
})();