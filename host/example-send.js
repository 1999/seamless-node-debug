'use strict';

const assert = require('assert');
const os = require('os');
const net = require('net');

const SOCKET_FILE_PATH = `${os.tmpdir()}/seamless-node-debug.sock`;
const DEVTOOLS_URL_PREFIX = 'chrome-devtools://devtools/remote/';
const url = process.argv[2] || '';

assert(url.startsWith(DEVTOOLS_URL_PREFIX), 'Supplied URL is invalid');

const client = net.createConnection(SOCKET_FILE_PATH);

client
    .on('connect', () => {
        console.log('Connected to Unix socket!');

        client.write(`${url}\n`);
        client.unref();
        client.end();
    })
    .on('error', (err) => {
        console.error(`Error occured: ${err.message}`);
    });
