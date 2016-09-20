#!/usr/bin/env python

import os
import socket
import struct
import sys
import tempfile

# On Windows, the default I/O mode is O_TEXT. Set this to O_BINARY
# to avoid unwanted modifications of the input/output streams.
if sys.platform == 'win32':
    import os
    import msvcrt

    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)


def print_debug(message):
    sys.stderr.write(message)
    sys.stderr.flush()


# Helper function that sends a message to the webapp.
def send_message(message):
    # write message size
    sys.stdout.write(struct.pack('I', len(message)))

    # write the message itself
    sys.stdout.write(message)
    sys.stdout.flush()


# Listen to incoming connections to UNIX socket
def listen_unix_socket():
    # @see https://docs.python.org/3/library/tempfile.html#tempfile.gettempdir
    tmp_dir = tempfile.gettempdir()
    socket_file_path = os.path.join(tmp_dir, 'chr-chr-chr.sock')

    if os.path.exists(socket_file_path):
        os.remove(socket_file_path)

    print_debug(
        'Start listening to incoming connections to %s...' % socket_file_path
    )

    server = socket.socket(socket.AF_UNIX)
    server.bind(socket_file_path)
    server.listen(5)

    conn, addr = server.accept()
    print_debug('Connected by %s' % addr)

    while True:
        message = conn.recv(1024)
        if not message:
            break

        print_debug('Got message: %s' % message)
        send_message(message)

    conn.close()
    os.remove(socket_file_path)
    print_debug('Shutting down...')


def main():
    listen_unix_socket()
    sys.exit(0)


if __name__ == '__main__':
    print_debug('Starting host app...')
    main()
