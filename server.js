const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');

const bot = require("./index");
const seth = new bot.Bot("handler.pds");

app.engine('html', require('ejs').renderFile);


const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

app.use(express.static(path.join(__dirname, '/')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


app.get('/', async (req, res) => {
    var name = 'hello';
    res.render(__dirname + "/web/index.html", { name: name })
})


app.post('/', async (req, res) => {
    let data = req.body;
    seth.getData(data["query"], (result) => {
        res.send({"res":result["reply"]});
    })
})


app.post('/teach', (req, res) => {
    let data = req.body;
    seth.writeData(data["query"], data["context"]);
    res.send({ "res":`Got it! Answer to ${data["query"]} is ${data["context"]}` });
})



app.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})