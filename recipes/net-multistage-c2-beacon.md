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
Players get a capture plus firewall and DNS resolver logs and a topology diagram.
Several hosts are active but only ONE is compromised, and it only stands out when you
correlate all three sources on one timeline. The implant runs in stages. Stage A: a
bare-domain DNS A lookup on an *exact* fixed interval (e.g. every 60 s — machine-regular
cadence is the primary IOC; a real user is bursty). Stage B: ~2 s after each lookup, an
HTTPS session to the C2 IP whose TLS ClientHello is byte-identical every time — same
SNI, same cipher list, same extensions → one constant JA3 fingerprint and constant
packet size (a machine, not a person); the firewall log corroborates with an
allow-to-443 flow at the same once-a-minute cadence. Stage C: later, a burst of DNS
queries to the *same* domain but with long Base32 (`A-Z2-7`) subdomain labels — that
burst is the data leaving. Benign HTTPS, AV and CDN lookups are present as noise. The
Base32 payload decodes to a record naming an authentication phrase a gate exchanges for
the flag.

## Player solve path
1. Baseline DNS and look for exact periodicity: one host does a bare-domain lookup on a
   fixed interval. Confirm with `tshark -T fields -e frame.time_relative` that every
   gap is identical.
2. Show the beacon: ~2 s after each lookup the host opens HTTPS to one IP; collapse the
   ClientHellos to prove one profile —
   `tshark -Y 'tls.handshake.type==1' -T fields -e ip.dst -e tls.handshake.extensions_server_name -e tls.handshake.ciphersuite | sort | uniq -c`
   folds them to a single line (constant SNI + cipher set = one JA3). The firewall log
   shows the matching once-a-minute ALLOW to 443.
3. Find Stage C: the same destination reappears as a UDP/53 burst of long
   `<label>.<domain>` queries (the firewall log flags the burst); this is the exfil,
   distinct from the bare-domain beacon.
4. Select only the labelled subdomains from the compromised host in time order
   (exclude the bare-domain beacon, e.g. `dns.qry.name contains "<domain>" &&
   dns.qry.name != "<domain>"`; in Wireshark 4.x write literal dots in a regex filter
   as `[.]`, not `\.`). Strip the suffix, concatenate, re-pad to a multiple of 8, and
   Base32-decode → the record → the auth phrase.
5. Submit the phrase to the authentication gate → flag.
