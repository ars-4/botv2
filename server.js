const server = require("express")();
const bodyParser = require('body-parser');
const cors = require("cors");

const Bot = require("./index").Bot;


let acer = new Bot("handler.psd");



const port = process.env.PORT || 8080;

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));


server.get('/', (req, res) => {
    res.send("Welcome");
})


server.post('/', (req, res) => {
    let data = req.body;
    res.send('Data Received: ' + JSON.stringify(data));
})



server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})