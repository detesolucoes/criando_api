const express = require('express');
const app = express();
//onst bodyParser = require("body-parser");

//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Indrodução a API");
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.post("/post", (req, res) => {
    //return 'ok';
    return res.json({teste:"ok"});
});

app.post("/post2", (req, res) => {
    return res.json(req.body);
});

app.listen(3333, () => {
    console.log("Servidor iniciado na porta.");
});


