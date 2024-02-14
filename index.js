'use strict';

import * as Hapi from '@hapi/hapi';
import * as crypto from 'crypto';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium'


// Create a hash from a string
function hashString(str) {
  // Create a SHA-256 hasher instance
  const hasher = crypto.createHash('sha256');

  // Update the hasher with the string you want to hash
  hasher.update(str);

  // Calculate the hash as a hex string
  const hash = hasher.digest('hex');

  return hash;
}

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: { cors: true }
    });

    server.connection({ routes: { cors: true } })


    //root path
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello Hapi!';
        }
    });

    // me
    server.route({
        method: 'GET',
        path: '/me',
        handler: (request, h) => {

            return {name:"Mike", token: hashString("mike")};
        }
    });

    server.route({
        method: 'GET',
        path: '/screenshot',
        handler: async (request, h) => {
          const { url } = request.query;
            
          console.log(url)
          chromium.setGraphicsMode = false
           const browser = await puppeteer.launch({
              args: chromium.args,
              defaultViewport: chromium.defaultViewport,
              executablePath: await chromium.executablePath(),
              headless: chromium.headless,
            })
          // Launch a new browser instance
        //   const browser = await puppeteer.launch({executablePath: "/bin/google-chrome",
        //     args: ['--disable-gpu',
        //     '--disable-dev-shm-usage',
        //     '--disable-setuid-sandbox',
        //     '--no-first-run',
        //     '--no-sandbox',
        //     '--no-zygote',
        //     '--single-process',]
        // });
    
          // Create a new page
          const page = await browser.newPage();
            
          console.log("navigating to page: ", url, page)
          // Navigate to the URL
          await page.goto(url);
    
          // Take a screenshot and get it as a base64 string
          const screenshot = await page.screenshot({ encoding: 'base64' });
            
          console.log("screenshot taken! ", screenshot)
          // Close the browser
          await browser.close();
    
          // Send the screenshot as a response
          return {img: screenshot}
          //h.response(screenshot).header('Content-Type', 'image/png');
        },
      });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();