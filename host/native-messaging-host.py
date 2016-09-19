#!/usr/bin/env python

import os
import socket
import sys
import tempfile

# On Windows, the default I/O mode is O_TEXT. Set this to O_BINARY
# to avoid unwanted modifications of the input/output streams.
if sys.platform == 'win32':
    import os
    import msvcrt

    msvcrt.setmode(sys.stdin.fileno(), os.O_BINARY)
    msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)


# Listen to incoming connections to UNIX socket
def listen_unix_socket():
    # @see https://docs.python.org/3/library/tempfile.html#tempfile.gettempdir
    tmp_dir = tempfile.gettempdir()
    socket_file_path = os.path.join(tmp_dir, 'chr-chr-chr.sock')

    if os.path.exists(socket_file_path):
        os.remove(socket_file_path)

    print 'Start listening to incoming connections to %s...' % socket_file_path

    server = socket.socket(socket.AF_UNIX)
    server.bind(socket_file_path)
    server.listen(5)

    conn, addr = server.accept()
    print 'Connected by %s' % addr

    while True:
        message = conn.recv(1024)
        if not message:
            break

        print message

    conn.close()
    os.remove(socket_file_path)
    print 'Shutting down...'


def main():
    listen_unix_socket()
    sys.exit(0)


if __name__ == '__main__':
    main()
