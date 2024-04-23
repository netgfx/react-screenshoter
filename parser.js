import express from "express";
import ogs from "open-graph-scraper";

const app = express();
const port = 3002;

app.get("/og-metadata", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  console.log("fetching for: ", url);
  try {
    const options = { url: url };
    ogs(options)
      .then((data) => {
        const { error, html, result, response } = data;
        console.log("error:", error); // This returns true or false. True if there was an error. The error itself is inside the result object.
        console.log("html:", html); // This contains the HTML of page
        console.log("result:", result); // This contains all of the Open Graph results
        console.log("response:", response); // This contains response from the Fetch API

        if (error) {
          console.log(error);
          return res.status(500).json({
            error: `Error scraping metadata ,${JSON.stringify(error)}`,
          });
        } else {
          res.status(200).json(result);
        }
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .json({ error: `Error scraping metadata ,${JSON.stringify(error)}` });
      });

    // if (result.error) {
    //   return res.status(500).json({ error: `Error scraping metadata ,${error}` });
    // }

    // const metadata = {
    //   title: result.result.ogTitle || '',
    //   image: result.result.ogImage && result.result.ogImage[0].url || '',
    //   description: result.result.ogDescription || ''
    // };
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Error scraping metadata ${JSON.stringify(error)}` });
  }
});

app.listen(port, () => {
  console.log(`OG metadata API listening at http://localhost:${port}`);
});
