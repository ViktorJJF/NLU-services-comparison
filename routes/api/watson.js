const express = require("express");
const router = express.Router();
const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

const assistant = new AssistantV2({
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_ASSISTANT_APIKEY,
  }),
  url: process.env.WATSON_ASSISTANT_URL,
  version: "2019-02-28",
});

router.get("/session", async (req, res) => {
  try {
    const session = await assistant.createSession({
      assistantId: process.env.WATSON_ASSISTANT_ID,
    });
    res.json(session["result"]);
  } catch (error) {
    console.log("algo salio mal creando la sesion...", error);
  }
});

router.post("/message", async (req, res) => {
  let message = req.body.message;
  const payload = {
    assistantId: process.env.WATSON_ASSISTANT_ID,
    sessionId: "3704bb3e-0d74-4049-bb76-fa788df1a984", //dynamic
    input: {
      message_type: "text",
      text: message,
    },
  };
  try {
    const result = (await assistant.message(payload))["result"];
    if (
      result.output.intents.length > 0 &&
      result.output.intents[0].confidence >= 0.5
    ) {
      let intent = result.output.intents[0].intent;
      let confidence = result.output.intents[0].confidence;
      res.json({ message, intent, confidence });
    } else {
      res.json({ message, intent: "Default fallback intent", confidence: 1 });
    }
  } catch (err) {
    res.json({ err: "Acualizar Session" });
    console.log("algo salio mal enviando el mensaje ibm...", err);
  }
});

module.exports = router;
