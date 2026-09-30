---
slug: net-sniff-live-stream
title: Capture a live data stream and pick the secrets out of it
category: Network Security
source_ctf: The Locker Network
difficulty: easy
skills: packet-capture, netsniff-ng, tcpdump, curl, nc, network
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A service streams a long run of plaintext telemetry frames, one per second for a couple
of minutes, down a TCP connection the player opens. Most frames are sensor noise. In
every cycle one frame carries the flag and a few frames later another carries the access
key. The player runs a packet capture on their own machine while the stream flows, then
reads the two frames out of the capture.

The service root serves an instructions page that streams nothing and prints the exact
commands, filled in with the host and port the player actually typed.

## Player solve path
1. Open the service root in a browser or with curl and read the instructions.
2. Find the capture interface with `ip link`, then start a capture with
   `sudo netsniff-ng --in <iface> --out stream.pcap`.
3. Open the stream: `curl -N http://<host>:<port>/<stream-path>`, a browser, or a bare `nc`.
4. After about thirty seconds, stop the capture.
5. Read it: `netsniff-ng --in stream.pcap`, or pull whole frames with
   `strings stream.pcap | grep` on the frame type. The flag frame and the key frame are
   separate.
