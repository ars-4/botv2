const fs = require("fs");
const natural = require("natural");
const say = require("say");

const tokenizer = new natural.WordPunctTokenizer();



class Bot {
    constructor(file) {
        this.file = file;
        this.data = [];
        let comma_string = new RegExp(' comma', 'g');

        this.getAllData = (callback) => {
            this.data = [];
            fs.readFile(this.file, {
                encoding: "utf-8"
            }, (err, data) => {
                if (err) { throw new Error(err) }
                else {
                    data = data.split(',');
                    for (let i = 0; i < data.length; i++) {
                        this.data.push({
                            "query": data[i],
                            "context": data[i + 1]
                        })
                        i++;
                    }
                    callback(this.data);
                }
            });
        }


        this.getData = (query, callback) => {
            query = query.toLowerCase();
            this.data = [];
            fs.readFile(this.file, {
                encoding: "utf-8"
            }, (err, data) => {
                if (err) { throw new Error(err) }
                else {
                    data = data.split(',');
                    for (let i = 0; i < data.length; i++) {
                        data[i] = data[i].toLowerCase();
                        if (data[i].includes(query)) {
                            this.data.push({
                                "reply": data[i+1].replace(comma_string, ','),
                                "query": data[i].replace(comma_string, ',')
                            })
                        }
                    }

                    let results_array = [];
                    let query_tokens = tokenizer.tokenize(query.toLowerCase());
                    for (let i = 0; i < this.data.length; i++) {
                        let points = 0;
                        let tokens = tokenizer.tokenize(this.data[i]["query"].toLowerCase());
                        for (let j = 0; j < tokens.length; j++) {
                            for (let k = 0; k < query_tokens.length; k++) {
                                if (query_tokens[k] === tokens[j]) {
                                    points++;
                                }
                            }
                        }
                        results_array.push({
                            "reply": this.data[i]["reply"],
                            "points": points
                        })
                    }

                    const result = results_array[results_array.length - 1]
                    callback(result);

                }
            });
        }


        this.writeData = (query, context) => {
            let comma = new RegExp(',', 'g');
            query = query.replace(comma, ' comma ');
            context = context.replace(comma, ' comma ');
            fs.appendFile(this.file, `${query},${context},`, (err) => {
                if (err) { throw new Error(err) }
            });
        }

    }
}



// let f = new Bot('handler.pds');
// let operation = process.argv[2];
// let query = process.argv[3];


// if (operation === "1" || operation === 1) {
//     let context = process.argv[4]
//     f.writeData(query, context);
//     say.speak(`got it, ${query} answer is ${context}`);
// } else {
//     f.getData(query, (result) => {
//         let res = "";
//         if (result != undefined) {
//             res = result["reply"];
//         } else {
//             res = "Sorry, I don't know the answer to that. Please teach me!";
//         }
//         setTimeout(() => { console.log(res); }, 2500);
//         say.speak(res);
//     });
// }


module.exports.Bot = Bot;

