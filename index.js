const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const Sequelize = require("sequelize");
const psSolver = require('./pushswapsolver.js')

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

app.post('/solve', function (req, res) {
  let stringResult = []
  let smallest = []
  for (let y = 4; y < 10; y++) {
    let ps = new psSolver.PushswapSolver([...req.body.startArray.map(Number)], y)
    let state = ps.solve()
    let res = state.result

    if (res.length < smallest.length || smallest.length === 0) {
      result = res
      stringResult = state.calculateResult()
    }
  }
  res.send(stringResult)
})


const host = '127.0.0.1';
const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log("Server started on port " + port);
});