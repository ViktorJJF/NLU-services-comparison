const express = require("express");
const router = express.Router();
const axios = require("axios");
const uuid = require("uuid");

let rasaURL = "http://35.202.105.130/rasa/model/parse";

console.log("rasa on");

router.post("/message", async (req, res) => {
  let message = req.body.message || " ";
  try {
    let response = await axios({
      method: "post",
      url: rasaURL,
      data: {
        text: message,
        message_id: uuid.v1(),
      },
    });
    console.log(response.data);
    let intent = response.data.intent.name;
    let confidence = response.data.intent.confidence;
    if (confidence >= 0.5)
      res.json({
        message: response.data.text,
        intent,
        confidence,
      });
    else
      res.json({
        message: response.data.text,
        intent: "Default Fallback Intent",
        confidence: 1,
      });
  } catch (err) {
    console.log("hubo un error en RASA...", err);
  }
});

module.exports = router;
