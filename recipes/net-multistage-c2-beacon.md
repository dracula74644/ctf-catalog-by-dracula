---
slug: net-multistage-c2-beacon
title: Spot a multi-stage C2 beacon by correlating capture and logs, then decode exfil
category: Network Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: hard
skills: network, pcap, c2-beacon, ja3, tls-fingerprint, log-correlation, dns-exfil
box_type: download
status: built
---

## Mechanic (theme-agnostic)
One compromised host among clean ones runs a multi-stage command-and-control pattern
that only stands out when you correlate the capture with firewall and DNS logs. Stage
A: a bare-domain DNS lookup on an *exact* fixed interval (machine-regular — the IOC).
Stage B: immediately after each lookup, an HTTPS beacon whose TLS ClientHello has a
fixed SNI/cipher/extension profile → a constant fingerprint (JA3) and constant size.
Stage C: later, a DNS-tunnel burst of Base32 subdomain labels to the same C2. The
player finds the host by behaviour, correlates the three sources, extracts the exfil
labels in order, and Base32-decodes them to a record naming an auth phrase for a gate.

## Player solve path
1. Profile hosts; find the one with perfectly periodic DNS lookups to one domain.
2. Correlate with firewall (ALLOW 443 cadence) and DNS logs; note identical TLS
   ClientHellos (constant fingerprint/size) right after each lookup.
3. Locate the later DNS-tunnel burst to the same C2.
4. Extract labels in time order; Base32-decode → record → auth phrase.
5. Submit the phrase to the gate → flag.
