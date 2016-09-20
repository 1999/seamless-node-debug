'use strict';

const os = require('os');
const net = require('net');

const SOCKET_FILE_PATH = `${os.tmpdir()}/seamless-node-debug.sock`;
const client = net.createConnection(SOCKET_FILE_PATH);

client
    .on('connect', () => {
        console.log('Connected to Unix socket!');
    })
    .on('error', (err) => {
        console.error(`Error occured: ${err.message}`);
    });

setInterval(() => {
    const url = `chrome-devtools://devtools/remote/${Date.now()}`;
    client.write(`${url}\n`);
}, 1000)
