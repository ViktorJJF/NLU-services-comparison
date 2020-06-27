const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/message", async (req, res) => {
  let baseURL = "http://localhost:3000";
  let luis, watson, witai, lex, rasa, dialogflow;
  let message = req.body.message;
  try {
    p1 = axios.post(baseURL + "/api/luis/message", { message });
    p2 = axios.post(baseURL + "/api/watson/message", { message });
    p3 = axios.post(baseURL + "/api/witai/message", { message });
    p4 = axios.post(baseURL + "/api/lex/message", { message });
    p5 = axios.post(baseURL + "/api/dialogflow/message", { message });
    p6 = axios.post(baseURL + "/api/rasa/message", { message });
    let responses = await Promise.all([p1, p2, p3, p4, p5, p6]);
    luis = responses[0].data;
    watson = responses[1].data;
    witai = responses[2].data;
    lex = responses[3].data;
    dialogflow = responses[4].data;
    rasa = responses[5].data;
    res.json({ luis, watson, witai, lex, dialogflow, rasa });
  } catch (err) {
    res.json({ msg: "Algo salio mal..." });
    console.log("algo salio mal testeando...", err);
  }
});

module.exports = router;
