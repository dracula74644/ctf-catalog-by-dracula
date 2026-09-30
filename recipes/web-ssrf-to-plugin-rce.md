---
slug: web-ssrf-to-plugin-rce
title: Chain SSRF into an internal upload API and unsandboxed plugin RCE
category: Web Application Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: hard
skills: web, ssrf, api-enumeration, parameter-fuzzing, rce, deserialization
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A public service fetches a user-supplied URL and reflects the result (SSRF). Behind
it, on a private network, sits an internal-only service with no host port. Through
the SSRF the player reaches the internal service and reads its API spec
(`/openapi.json`), which documents an upload and a process endpoint — but hides one
capability: an undocumented `developer_mode` upload parameter. Fuzzing the upload
reveals it; it accepts a user-supplied "plugin" that the process endpoint imports and
runs with no sandbox → arbitrary code execution. The flag is a file readable only by
that internal container (no HTTP route), so RCE is mandatory.

## Player solve path
1. Confirm the public endpoint fetches arbitrary URLs (SSRF).
2. Point it at the internal service; pull `/openapi.json` and enumerate endpoints.
3. Fuzz the upload for the hidden `developer_mode` (or equivalent) parameter.
4. Upload a plugin defining the expected hook; trigger process → RCE.
5. Read the flag file from the internal container.

## What to plant
- FLAG: a file inside the internal container reachable only via RCE (no HTTP route).
- ACCESS KEY: a bit alongside — an env var or a second file the RCE can read, or in
  the public service's config, not the same file as the flag.

## Skin points (change per CTF)
Change: what the services "do", the hidden parameter name, the plugin interface, story.
Keep: SSRF → internal-only service → spec enumeration → hidden upload flag →
unsandboxed plugin execution → flag only via RCE.

## Blueprint mapping
- box_type: hosted; two services on a private network — a public one (exposed) and an
  internal one (no host port).
- build.py places `__FLAG_<ID>__` as a file in the internal container and
  `__ACCESS_KEY_<ID>__` as an env/second file; public service proxies fetches to the
  internal one.
