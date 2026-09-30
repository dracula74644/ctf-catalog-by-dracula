---
slug: net-dns-tunnel-exfil
title: Reassemble data exfiltrated over DNS-tunnel subdomains in a capture
category: Network Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: medium
skills: network, pcap, dns-tunneling, base32, wireshark, exfiltration
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A packet capture hides a DNS-tunneling exfiltration among realistic benign traffic.
One host Base32-encodes a stolen record (DNS-safe charset, no padding chars) and
splits it across many long subdomain labels, sent as A queries to one attacker domain
at an abnormally high rate. The player filters DNS, spots the odd host + domain +
Base32 charset, pulls the labels **in time order**, concatenates and Base32-decodes
them (re-padding to a multiple of 8) to recover the record — which names an
authentication phrase submitted to a gate that releases the flag. Benign length
red herrings (DKIM/SPF/telemetry) mean the tell is behaviour, not label length alone.

## Player solve path
1. Open the capture; filter DNS and profile query volume per host/domain.
2. Identify the abnormal host + single attacker domain + Base32-looking labels.
3. Extract labels in timestamp order; strip the domain suffix; concatenate.
4. Base32-decode (re-pad) → the stolen record → the auth phrase.
5. Submit the phrase to the gate → flag.

## What to plant
- FLAG: released by the gate on the correct decoded phrase (not in the capture).
- ACCESS KEY: a bit alongside — in the shipped incident README or a companion log,
  separate from the exfil stream and the flag.

## Skin points (change per CTF)
Change: the encoding (Base32/hex), attacker domain, record contents, the phrase, noise.
Keep: DNS-tunnel exfil split across ordered subdomain labels at an abnormal rate;
decode → phrase → gate; length alone isn't the tell.

## Blueprint mapping
- box_type: download (pcap + logs) + a tiny hosted unlock page.
- build.py encodes the record (carrying the phrase) into the tunnel, self-verifies
  decode==record and rate>baseline; gate holds `__FLAG_<ID>__`, `__ACCESS_KEY_<ID>__`
  in the README/log.
