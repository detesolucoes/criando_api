const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send("Indrodução a API");
});

app.listen(3333, () => {
    console.log("Servidor iniciado na porta  8080: http://localhost:8080/");
});

