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
A hosted service emits a continuous stream of plaintext telemetry records over HTTP.
Most records are benign readings, but two special record types are mixed in: a NOTE
record that carries the flag and a KEY record that carries the access token. Nothing is
written to disk and the secrets are not shown in any UI — the record only exists on the
wire while the stream is open. So the player must run a packet capture on their own
interface, pull the stream to generate traffic, then recover the secrets from the saved
capture by filtering for the two special record types. The box page itself does not
stream secrets; it prints the exact capture commands to run.

## Player solve path
1. Read the box page for the instructions and the stream endpoint.
2. Start a capture on your own interface (`netsniff-ng --in <iface> --out cap.pcap`, or
   `tcpdump -i <iface> -w cap.pcap`).
3. In a second terminal, open the stream to generate traffic (`curl -N http://<host>/stream`
   or `nc`), and let it run ~30 s.
4. Stop the capture and grep the records: `strings cap.pcap | grep -E 'kind=(NOTE|KEY)'`
   (or `tcpdump -A -r cap.pcap | grep -E 'NOTE|KEY'`).
5. Take the flag from the NOTE record and the access key from the KEY record.
