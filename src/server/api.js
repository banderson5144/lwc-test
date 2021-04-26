// Simple Express server setup to serve for local testing/dev API server
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const obApi = require('../../utils/obApi');
const theTest = require('../../utils/async');

const app = express();
app.use(helmet());
app.use(compression());

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;

app.get('/api/v1/endpoint', (req, res) => {
    res.json({ success: true });
});

app.get('/myapi', (req, res) => {
    return res.send('Received a GET HTTP method');
});

app.get('/obTest', async (req, res) => {
    await obApi.loginOb();
    const stuff = await obApi.getBkupObjs();
    await obApi.logoutOb();

    res.contentType('text/plain');

    return res.send(stuff);
});

app.get('/mytest', async (req, res) => {
    const stuff = await theTest.start();

    res.contentType('application/json');

    return res.send(stuff);
});

app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
    )
);
