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

## What to plant
- FLAG: one frame type per cycle, as readable text.
- ACCESS KEY: a different frame type a few frames later, as the 64-hex blob.

## Skin points (change per CTF)
Change: what the stream pretends to be, the frame format and field names, the noise
frame types, the stream path, the port, the cycle length.
Keep: TCP, player-initiated; mostly noise; flag and key in separate frames a few seconds
apart; an instructions page that starts nothing.

Do not push traffic at the player. An earlier version sent a UDP stream to the player's
address after a knock. It failed for anyone behind NAT, the router drops unsolicited
datagrams, and even with source-port replies the UDP stream proved awkward to capture.
Streaming down the connection the player opened crosses NAT with no special handling, and
any sniffer captures it.

`netsniff-ng --in` wraps a long payload across several output lines, so grep on its output
returns part of a frame. Point players at `strings <pcap> | grep` or `tcpdump -A -r` for
whole frames.

Known shortcut: whoever opens the stream also sees the frames in their own terminal.
Forcing a capture is impossible without pushing traffic, which breaks NAT, so the box
teaches capture and filtering. Say so in the solution notes.

## Blueprint mapping
- hosted: a small Python service on one TCP port with two routes. The root serves the
  instructions. The stream path, or a bare `nc` connection that sends no request, gets the
  frames. Send HTTP headers only to clients that spoke HTTP, so `nc` gets clean frames.
  Build the printed commands from the request's Host header so they stay right when the
  box is published on a different host port.
- `build.py` writes two seed files, one with `__FLAG_<ID>__` and one with
  `__ACCESS_KEY_<ID>__`. The entrypoint reads them into the environment, deletes the seed,
  and starts the service. No runtime mounts.
- Open only the TCP port on the cloud firewall.
- Test without host root by running tcpdump in a container attached to the stack's docker
  network with the NET_RAW capability, then read the pcap back on the host.
