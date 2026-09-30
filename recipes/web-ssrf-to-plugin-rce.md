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
