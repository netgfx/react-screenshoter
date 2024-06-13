'use strict';

import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import cors from "cors";
import express from "express";

const app = express();
const port = 3001;

app.use(cors());

app.get("/screenshot", async (request, res) => {
  const { url } = request.query;

  chromium.setGraphicsMode = false
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  })

  // Create a new page
  const page = await browser.newPage();

  console.log("navigating to page: ", url, page)
  // Navigate to the URL
  await page.goto(url);

  // Take a screenshot and get it as a base64 string
  const screenshot = await page.screenshot({ encoding: 'base64' });

  // Close the browser
  await browser.close();

  // Send the screenshot as a response
  return res.status(200).json({ img: screenshot })
},)


//root path
app.get("/", (request, res) => {
  return res.status(200).json({ health: "good" });
});

app.listen(port, () => {
  console.log(`Screenshoter API listening at http://localhost:${port}`);
});