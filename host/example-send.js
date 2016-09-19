'use strict';

const os = require('os');
const net = require('net');

const SOCKET_FILE_PATH = `${os.tmpdir()}/chr-chr-chr.sock`;
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
    client.write(`${JSON.stringify({url})}\n`);
}, 1000)
