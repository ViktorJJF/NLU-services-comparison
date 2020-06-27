const express = require("express");
const router = express.Router();
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const credentials = {
  client_email: process.env.DF_GOOGLE_CLIENT_EMAIL,
  private_key: process.env.DF_GOOGLE_PRIVATE_KEY,
};

const sessionClient = new dialogflow.SessionsClient({
  projectId: process.env.DF_GOOGLE_PROJECT_ID,
  credentials,
});

router.post("/message", async (req, res) => {
  let message = req.body.message;
  try {
    const sessionPath = sessionClient.sessionPath(
      process.env.DF_GOOGLE_PROJECT_ID,
      uuid.v1()
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: process.env.DF_LANGUAGE_CODE,
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    if (result.intentDetectionConfidence >= 0.5)
      res.json({
        message: result.queryText,
        intent: result.intent.displayName,
        confidence: result.intentDetectionConfidence,
      });
    else
      res.json({
        message: result.queryText,
        intent: "Default Fallback Intent",
        confidence: 1,
      });
  } catch (e) {
    console.log("error");
    console.log(e);
  }
});

module.exports = router;
