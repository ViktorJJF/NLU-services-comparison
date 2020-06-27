const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const watsonRoutes = require("./routes/api/watson");
const witai = require("./routes/api/witai");
const LUIS = require("./routes/api/LUIS");
const testBots = require("./routes/api/testBots");
const LEX = require("./routes/api/LEX");
const dialogflow = require("./routes/api/dialogflow");
const rasa = require("./routes/api/RASA");

app.use("/api/watson", watsonRoutes);
app.use("/api/witai", witai);
app.use("/api/luis", LUIS);
app.use("/api/test", testBots);
app.use("/api/lex", LEX);
app.use("/api/dialogflow", dialogflow);
app.use("/api/rasa", rasa);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
