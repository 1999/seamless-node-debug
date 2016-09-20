#!/bin/bash

set -e

HOST_NAME=com.yandex.media.domino.frontend.snd
DIR="$( cd "$( dirname "$0" )" && cd "../" && pwd )"

PS3="Please enter your choice: "
BRO_OPTIONS=("Yandex Browser" "Google Chrome" "Chromium")

select opt in "${BRO_OPTIONS[@]}"
do
    case $opt in
        "Yandex Browser")
            BRO="Yandex/YandexBrowser"
            break
            ;;
        "Google Chrome")
            BRO="Google/Chrome"
            break
            ;;
        "Chromium")
            BRO="Chromium"
            break
            ;;
        *) echo invalid option;;
    esac
done

if [ "$(uname -s)" = "Darwin" ]; then
    if [ "$(whoami)" = "root" ]; then
        TARGET_DIR="/Library/$BRO/NativeMessagingHosts"
    else
        TARGET_DIR="$HOME/Library/Application Support/$BRO/NativeMessagingHosts"
    fi
else
    # Linux
    echo "Unsupported OS. Sorry"
    exit 1
fi

# create directory to store native messaging host
mkdir -p "$TARGET_DIR"

# copy native messaging host manifest
cp "$DIR/extension/native-messaging-manifest.json" "$TARGET_DIR/$HOST_NAME.json"

# update host path in the manifest
HOST_PATH=$DIR/host/native-messaging-host.py
ESCAPED_HOST_PATH=${HOST_PATH////\\/}
sed -i -e "s/HOST_PATH/$ESCAPED_HOST_PATH/" "$TARGET_DIR/$HOST_NAME.json"

# Set permissions for the manifest so that all users can read it.
chmod o+r "$TARGET_DIR/$HOST_NAME.json"
echo "Native messaging host $HOST_NAME has been installed!"
