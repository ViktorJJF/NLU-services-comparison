const express = require("express");
const router = express.Router();
const { Wit, log } = require("node-wit");
const client = new Wit({ accessToken: process.env.WITAI_TOKEN });

router.post("/message", async (req, res) => {
  let message = req.body.message || " ";
  client
    .message(message, {})
    .then((data) => {
      let message = data.text;
      if (data.intents.length > 0 && data.intents[0].confidence >= 0.5) {
        let intent = data.intents[0].name;
        let confidence = data.intents[0].confidence;
        return res.json({ message, intent, confidence });
      }
      res.json({ message, intent: "Default Fallback Intent", confidence: 1 });
    })
    .catch(console.error);
});

module.exports = router;
