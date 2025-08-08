// 📁 server.js (Node.js + Express server)
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

const config = require("./config");
const IpLog = require("./models/iplogs");
const UrlMap = require("./models/url-maps");

// MongoDB connection
mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");   
});
// Route: logs visitor info
app.post("/log-info", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  let location = {};
  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${config.ipInfo_token}`
    );
    location = response.data;
  } catch (err) {
    console.error("Failed to fetch location:", err);
  }

  const log = new IpLog({
    ip,
    location,
    userAgent: req.body.userAgent,
    screen: req.body.screen,
    battery: req.body.battery,
  });
  await log.save();

  res.send({ status: "Logged successfully" });
});

// Route: handle create short link
app.post("/create-short-link", async (req, res) => {
  const { destination } = req.body;
  if (!destination) {
    return res.status(400).send({ error: "Destination URL is required" });
  }
  // store the destination URL and generate a unique code
  const code = uuidv4();
  const urlMap = new UrlMap({
    code: code,
    destination,
  });
  try {
    await urlMap.save();
    const shortLinkUrl = `http://localhost:${PORT}/${code}`;
    res.send({
      shortUrl: shortLinkUrl,
      originalUrl: destination,
      message: `Short link created: ${shortLinkUrl}`,
    });
  } catch (err) {
    console.error("Error saving URL map:", err);
    res.status(500).send({ error: "Failed to create short link" });
  }
});

// Route: handle short link
app.get("/:code", (req, res) => {
  // You can look up actual destination by code
  const code = req.params.code;
  UrlMap.findOne({ code })
    .then((urlMap) => {
      if (!urlMap) {
        return res.status(404).send({ error: "Short link not found" });
      }
      // Serve logger.html with redirect URL as query param
      res.redirect(
        `/logger.html?redirect=${encodeURIComponent(urlMap.destination)}`
      );
    })
    .catch((err) => {
      console.error("Error finding URL map:", err);
      res.status(500).send({ error: "Failed to retrieve short link" });
    });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
