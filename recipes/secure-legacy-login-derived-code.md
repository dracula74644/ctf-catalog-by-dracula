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
Source review shows the strict admin login is a deliberate dead end (its real password isn't in the bundle). The exploitable path is a "legacy recovery" branch with weak, self-referential checks: the username must start with / contain certain substrings, the password is a hard-coded constant, and the "case code" is computed deterministically from the (normalized) username itself — e.g. `len-first4-last5`. Because every input is derived from values the player controls or can read, they can construct a username, read off the constant password, and compute the matching code.

## Player solve path
1. Read the source; skip the strict admin path (password not present).
2. Find the legacy branch and its substring rules + constant password + case-code formula.
3. Pick a username satisfying the substring rules; compute the case code from the normalized name.
4. Submit username + constant password + computed code to reach the restricted page.
