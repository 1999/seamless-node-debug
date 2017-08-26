# seamless-node-debug

[![Greenkeeper badge](https://badges.greenkeeper.io/1999/seamless-node-debug.svg)](https://greenkeeper.io/)
Seamless node debug with chromium extension

## Develop
```bash
$ # clone repo
$ git clone git@github.yandex-team.ru:kino/seamless-node-debug.git
$ cd seamless-node-debug
$ nvm use # in case you're osx user
$ npm install
```

## How-to (live example)
1. Add `seamless-node-debug` to devDependencies of your app.
2. Clone this project and install chromium extension from "extension" directory to your browser.
3. Send new URLs to Unix socket `{os.tmpdir}/seamless-node-debug.sock` and browser tab with devtools inspector will be replaced with it immediately.
4. Profit (Вигода)!

## How does it all work
This repo consists of three parts: chromium extension, native host app and example of node.js script which communicates to Unix socket. Native host app is started by browser when first extension starts listening to events from this app.

### Chromium extension
Chromium extension id is `lfmolhfcmmgnacfibfpbemchjmcekkii`. Extension listens to native host app which is started by Chromium. Native host app emits new devtools URL to stdout.

### Native host app
Python native messaging app which is started by Chromium. It emits new devtools URL to stdout and listens to messages from unix socket.

### Example of node.js script
Run it like this: `node host/example-send.js chrome-devtools://devtools/remote/...` where second argument is URL of devtools tab. It will be transmitted to chromium extension through native host app.
