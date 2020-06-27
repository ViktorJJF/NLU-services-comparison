var Excel = require("exceljs");
var workbook = new Excel.Workbook();

let getData = () => {
  return new Promise((resolve, reject) => {
    let inputs = [];
    workbook.xlsx.readFile("chatbot.xlsx").then(function () {
      ws = workbook.getWorksheet("Hoja1");
      for (let i = 5; i <= 104; i++) {
        cell = ws.getCell("C" + i).value;
        inputs.push(cell);
      }
      resolve(inputs);
    });
  });
};

module.exports = {
  getData,
};
