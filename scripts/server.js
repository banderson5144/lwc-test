// Simple Express server setup to serve the build output
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const { Server } = require('ws');

let Queue = require('bull');
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const obApi = require('../utils/obApi');
const theTest = require('../utils/async');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const DIST_DIR = './dist';

let workQueue = new Queue('work', REDIS_URL);

const app = express()
.use(helmet())
.use(compression())
.use(express.static(DIST_DIR))
.get('/', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
})
.get('/myapi', (req, res) => {
    res.send('Received a GET HTTP method');
})
.get('/obTest', async (req, res) => {
    await obApi.loginOb();
    const stuff = await obApi.getBkupObjs();
    await obApi.logoutOb();

    res.contentType('text/plain');

    res.send(stuff);
})
.get('/mytest', async (req, res) => {
    // const stuff = await theTest.start();

    // res.contentType('application/json');

    // doThis();

    let job = await workQueue.add();
    res.json({ id: job.id });
})
.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);

const wss = new Server({ server: app });

// You can listen to global events to get notified when jobs are processed
workQueue.on('global:completed', (jobId, result) => {
    // console.log(`Job completed with result ${result}`);
    wss.clients.forEach((client) => {
        // console.log(typeof(result));
        // console.log(result);
        client.send(result);
    });
});

wss.on('connection', (ws) => {
    console.log('Client connected');
});

function noop() {}

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
  
      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 5000);

wss.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
});

// setInterval(() => {
//     wss.clients.forEach((client) => {
//         client.send(new Date().toTimeString());
//     });
// }, 5000);

function doThis()
{
    theTest.start()
    .then(val => {
        wss.clients.forEach((client) => {
            client.send(val);
        });
    });
}