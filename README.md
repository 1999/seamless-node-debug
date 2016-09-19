# chr-chr-chr
Chromium extension for seamless node debug

## Develop
```bash
$ # clone repo
$ git clone git@github.yandex-team.ru:kino/chr-chr-chr.git
$ cd chr-chr-chr
$ nvm use # in case you're osx user
$ npm install
```

## Chromium extension
Chromium extension id is `lfmolhfcmmgnacfibfpbemchjmcekkii`. Extension listens to native host app which is started by Chromium. Native host app emits new devtools URL to stdout.

## Native host app
Python native messaging app which is started by Chromium. It emits new devtools URL to stdout and listens to messages from unix socket.

## How-to (live example)
1. Install native messaging app with `npm run install:native_host_app`
2. Restart Chromium-based browser
3. Install chrome extension to chrome://extensions directory

That's it. Starting from now you can send new devtools URL to unix socket `\`${os.tmpdir()}/chr-chr-chr.sock\``. It will be transmitted to chromium extension which will replace existing devtools tab with this new URL.
