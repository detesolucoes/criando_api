const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send("Indrodução a API");
});

app.post("/post", (req, res) => {
    return res.json(req.body);
});

app.listen(3333, () => {
    console.log("Servidor iniciado na porta.");
});


