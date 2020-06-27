const express = require("express");
const router = express.Router();
const axios = require("axios");

let luisURL =
  "https://westus.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/d9499ed4-2016-4ed7-bc8c-6272cd735d29/slots/production/predict";

let params = {
  "subscription-key": process.env.LUIS_KEY,
  verbose: true,
  "show-all-intents": true,
  log: true,
  query: "",
};

router.post("/message", async (req, res) => {
  params.query = req.body.message || " ";
  try {
    let response = (await axios.get(luisURL, { params })).data;
    let intent = response.prediction.topIntent;
    if (response.prediction.intents[intent].score >= 0.5)
      res.json({
        message: response.query,
        intent,
        confidence: response.prediction.intents[intent].score,
      });
    else
      res.json({
        message: response.query,
        intent: "Default Fallback Intent",
        confidence: 1,
      });
  } catch (err) {
    console.log("hubo un error en LUIS...", err);
  }
});

module.exports = router;
