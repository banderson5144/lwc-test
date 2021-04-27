// Simple Express server setup to serve the build output
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const { Server } = require('ws');

const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const obApi = require('../utils/obApi');
const theTest = require('../utils/async');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';

const app = express()
.use(helmet())
.use(compression())
.use(express.static(DIST_DIR))
.get('/', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
})
.get('/myapi', (req, res) => {
    return res.send('Received a GET HTTP method');
})
.get('/obTest', async (req, res) => {
    await obApi.loginOb();
    const stuff = await obApi.getBkupObjs();
    await obApi.logoutOb();

    res.contentType('text/plain');

    return res.send(stuff);
})
.get('/mytest', async (req, res) => {
    const stuff = await theTest.start();

    res.contentType('application/json');

    return res.send(stuff);
})
.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);

const wss = new Server({ server: app });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);