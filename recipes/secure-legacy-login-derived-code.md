---
slug: secure-legacy-login-derived-code
title: Bypass login through a legacy recovery path with a computable code
category: Secure Coding
source_ctf: Breaking CTF
difficulty: easy
skills: secure-coding, auth-bypass, source-review
box_type: download
status: built
---

## Mechanic (theme-agnostic)
The app is shipped as a downloadable source bundle, and review reveals two login paths. The strict/production admin login is a deliberate dead end — its real password is never included in the bundle, so it cannot be brute-forced from the source. The exploitable path is a second "legacy recovery" branch with weak, self-referential checks that all resolve to values the attacker controls or can read: the submitted username (first normalized to lowercase alphanumerics) must satisfy simple substring rules (start with one fixed substring and contain another), the password is compared against a hard-coded constant string sitting right there in the source, and a third "case code" field must equal a value computed deterministically from the normalized username itself — e.g. `f"{len(name)}-{name[:4]}-{name[-5:]}"` (its character length, its first four characters, and its last five, joined by hyphens). Because none of the three inputs is a secret, the player can craft a conforming username, copy the constant password, and compute the matching case code offline.

## Player solve path
1. Download and read the source; confirm the strict admin path is unusable because its password is not in the bundle.
2. Find the legacy recovery branch and note its three checks: the username substring rules, the hard-coded constant password, and the case-code formula, plus the username normalization (lowercase alphanumeric) applied first.
3. Pick a username that satisfies the substring rules and normalizes cleanly; compute the case code from the normalized name using the formula (length, first-4, last-5).
4. Submit that username, the constant password read from the source, and the computed case code to pass the legacy login and reach the restricted page where the flag is rendered.
