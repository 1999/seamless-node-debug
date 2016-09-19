#!/usr/bin/env python

import struct
import sys

# On Windows, the default I/O mode is O_TEXT. Set this to O_BINARY
# to avoid unwanted modifications of the input/output streams.
if sys.platform == 'win32':
    import os
    import msvcrt

    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)


# Helper function that sends a message to the webapp.
def send_message(message):
    # write message size
    sys.stdout.write(struct.pack('I', len(message)))

    # write message itself
    sys.stdout.write(message)
    sys.stdout.flush()


# Thread that reads messages from the webapp
def read_thread_func():
    while True:
        # read the message length (first 4 bytes)
        message_length_bytes = sys.stdin.read(4)
        print str(message_length_bytes)

        if len(message_length_bytes) == 0:
            sys.exit(0)

        # unpack message length as 4 byte integer
        message_length = struct.unpack('i', message_length_bytes)[0]

        # read the text (JSON object) of the message
        message = sys.stdin.read(message_length).decode('utf-8')
        send_message('{"echo": %s}' % text)


def main():
    read_thread_func()
    sys.exit(0)

if __name__ == '__main__':
    main()
