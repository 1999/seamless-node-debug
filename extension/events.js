/* global chrome */
'use strict';

const HOST_NAME = 'com.yandex.media.domino.frontend.snd';
const RECONNECT_TIMEOUT_SEC = 5;
const CONNECT_WAIT_TIMEOUT_SEC = 1;
const DEVTOOLS_URL_PREFIX = 'chrome-devtools://devtools/remote';

let lastDevtoolsTabId;
let connectionTimeoutId;

/**
 * Select best devtools tab to update.
 * Decision is made by checking tab activity and tab's window focus
 *
 * @param {array} tabs
 * @return {number} tab id
 */
const selectTabToUpdate = (tabs) => {
    // try to use previous devtools tab id
    const lastUsedTabIndex = tabs.findIndex(tab => (tab.id === lastDevtoolsTabId));
    if (lastUsedTabIndex !== -1) {
        return tabs[lastUsedTabIndex].id;
    }

    tabs.sort((a, b) => {
        // focused windows should be used first
        const windowFocusDiff = Number(b.windowFocused) - Number(a.windowFocused);
        if (windowFocusDiff !== 0) {
            return windowFocusDiff;
        }

        // active tabs should be used first
        const tabActiveDiff = Number(b.tabActive) - Number(a.tabActive);
        if (tabActiveDiff !== 0) {
            return tabActiveDiff;
        }

        // tabs with greater id should be used first
        return a.id - b.id;
    });

    return tabs[0].id;
};

/**
 * Search through windows and tabs inside them for inspector tab
 * Then navigate it to newUrl
 *
 * @param {string} newUrl
 */
const updateDevToolsTab = (newUrl) => {
    chrome.windows.getAll({populate: true, windowTypes: ['normal']}, (windows) => {
        const devToolsTabs = [];

        for (let window of windows) {
            for (let tab of window.tabs) {
                if (tab.url.startsWith(DEVTOOLS_URL_PREFIX)) {
                    devToolsTabs.push({
                        id: tab.id,
                        tabActive: tab.active,
                        windowFocused: window.focused
                    });
                }
            }
        }

        if (devToolsTabs.length) {
            const tabIdToUpdate = selectTabToUpdate(devToolsTabs);
            lastDevtoolsTabId = tabIdToUpdate;

            chrome.tabs.update(tabIdToUpdate, {
                url: newUrl,
                highlighted: true
            });
        } else {
            chrome.tabs.create({url: newUrl}, tab => {
                lastDevtoolsTabId = tab.id;
            });
        }
    });
};

/**
 * Process native host messages
 *
 * @param {string} message
 */
const onNativeMessage = (message) => {
    console.log(`Got message from host: ${JSON.stringify(message)}`);

    updateDevToolsTab(message.url);
};

/**
 * Process naive host disconnect: log and reconnect after interval
 */
const onDisconnected = () => {
    console.log(`Failed to connect to host: ${chrome.runtime.lastError.message}`);
    console.log(`Reconnect in ${RECONNECT_TIMEOUT_SEC} seconds...`);

    setTimeout(tryConnectToPort, RECONNECT_TIMEOUT_SEC * 1000);
    clearTimeout(connectionTimeoutId);
};

const onConnected = () => {
    console.log('Connected!');
};

const tryConnectToPort = () => {
    console.log('Trying to connect to port...');

    const port = chrome.runtime.connectNative(HOST_NAME);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);

    connectionTimeoutId = setTimeout(onConnected, CONNECT_WAIT_TIMEOUT_SEC * 1000);
};

// connect to host when extension is loaded
tryConnectToPort();
