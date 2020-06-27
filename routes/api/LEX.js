const express = require("express");
const router = express.Router();
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

var lexruntime = new AWS.LexRuntime();

var params = {
  botAlias: "$LATEST" /* required, has to be '$LATEST' */,
  botName: "LexTest" /* required, the name of you bot */,
  inputText: " " /* required, your text */,
  userId: "12" /* required, arbitrary identifier */,
  //   sessionAttributes: {
  //     someKey: "STRING_VALUE",
  //     /* anotherKey: ... */
  //   },
};

router.post("/message", async (req, res) => {
  let message = req.body.message || " ";
  params.inputText = message;
  lexruntime.postText(params, function (err, data) {
    if (err) {
      return console.log(err, err.stack);
    }
    // an error occurred
    if (data.intentName) {
      res.json({ message, intent: data.intentName });
    } else {
      res.json({ message, intent: "Default Fallback Intent", confidence: "?" });
    }
  });
});

module.exports = router;
