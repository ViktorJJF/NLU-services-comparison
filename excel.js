// Require library
var xl = require("excel4node");
const axios = require("axios");

(async () => {
  //fetching bots data
  let data = [];
  let inputs = await require("./inputPhrases").getData(); //get phrases from excel

  console.log("las frases son: ", inputs);
  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet("Sheet 1");

  // Create a reusable style
  var style = wb.createStyle({
    font: {
      color: "#000000",
      bold: true,
      size: 15,
    },
    numberFormat: "$#,##0.00; ($#,##0.00); -",
  });

  let NLUservices = ["DIALOGFLOW", "LUIS", "WATSON", "WITAI", "LEX", "RASA"];

  ws.cell(2, 1).string("INPUT").style(style);

  for (let i = 1; i <= NLUservices.length; i++) {
    ws.cell(1, i + i, 1, i + (i + 1), true)
      .string(NLUservices[i - 1])
      .style(style);
  }

  // second row
  for (let i = 1; i <= NLUservices.length; i++) {
    ws.cell(2, i + i)
      .string("Intent")
      .style(style);
    ws.cell(2, i + i + 1)
      .string("Confidence")
      .style(style);
  }

  for (var j = 0; j < inputs.length; j++) {
    const input = inputs[j];
    let res = await axios.post("http://localhost:3000/api/test/message", {
      message: input,
    });
    console.log("TERMINADO ", j + 1, input);
    data.push(res.data.dialogflow.intent);
    data.push(res.data.dialogflow.confidence);
    data.push(res.data.luis.intent);
    data.push(res.data.luis.confidence);
    data.push(res.data.watson.intent);
    data.push(res.data.watson.confidence);
    data.push(res.data.witai.intent);
    data.push(res.data.witai.confidence);
    data.push(res.data.lex.intent);
    data.push(res.data.lex.confidence);
    data.push(res.data.rasa.intent);
    data.push(res.data.rasa.confidence);
    //input cell
    ws.cell(j + 3, 1).string(input);

    //third row
    for (let i = 1; i <= data.length; i++) {
      if (typeof data[i - 1] === "string") {
        ws.cell(3 + j, i + 1).string(data[i - 1]);
      } else if (typeof data[i - 1] === "number") {
        ws.cell(3 + j, i + 1).number(data[i - 1]);
      } else {
        ws.cell(3 + j, i + 1).string("?");
      }
    }
    data = [];
  }

  wb.write("Excel.xlsx");
  console.log("se genero el excel");
})();
