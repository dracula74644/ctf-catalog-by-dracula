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
A public web service takes a user-supplied URL and fetches it server-side, returning
the HTTP status plus a preview of the response body (SSRF). It enforces only an
`http(s)://` scheme — no allowlist and no block on internal/private hosts. On the same
private container network sits an internal-only service with no published port,
reachable only by its network name (127.0.0.1/localhost from the SSRF hit the *public*
container, not the internal one, so the internal hostname is required). Through the
SSRF the player queries the internal service and pulls its self-documenting API spec
(`/openapi.json`), which describes an upload endpoint and a process endpoint but
deliberately omits one parameter: an undocumented `developer_mode` flag (accepts
`1/true/yes/on`) that unlocks uploads — the documented upload returns 403 "uploads
disabled" without it. Fuzzing the upload reveals the flag; the upload accepts a
base64-encoded Python "plugin" module that must define a known hook (e.g.
`process(image)`), which the process endpoint dynamically imports and executes with no
sandbox, signing, or integrity check → arbitrary code execution in the internal
container. The secret file lives only on that internal container with no HTTP route,
so RCE is the only path to it.

## Player solve path
1. Confirm SSRF: the fetch endpoint retrieves arbitrary URLs and reflects the body.
2. Reach the internal service by its private network name (not localhost/127.0.0.1);
   read its banner and enumerate `/`, `/health`, `/status`, `/api`.
3. Follow the API spec (`/openapi.json`): find the upload + process endpoints; the
   upload as documented returns 403 (disabled).
4. Fuzz the upload for the hidden enabling parameter (`developer_mode=1`) → uploads on.
5. Base64-encode (URL-safe, to survive the query string) a small module defining the
   expected hook that reads the secret file (e.g. `os.popen('cat <secret>').read()`);
   upload it (name + code) through the SSRF.
6. Call the process endpoint against your plugin → it imports/runs the module → its
   returned output contains the secret/flag.
