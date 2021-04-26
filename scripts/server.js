// Simple Express server setup to serve the build output
require('dotenv').config()
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const obApi = require('../utils/obApi');
const theTest = require('../utils/async');

const app = express();
app.use(helmet());
app.use(compression());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';

app.use(express.static(DIST_DIR));

app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
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
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
