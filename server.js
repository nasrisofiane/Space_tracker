const express = require('express');
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const app = express();
const headers = require('./headers');
const router = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => headers.allowOrigins('*', req, res, next));
app.use(router);

app.listen(port, () => {
    console.log(`Listen on ${port}`);
});