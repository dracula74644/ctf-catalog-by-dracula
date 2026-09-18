---
slug: web-sqli-auth-bypass
title: SQL injection auth bypass to an admin area
skills: web, sqli, auth-bypass
difficulty: medium
box_type: hosted
category: with_key
status: built
---

## Mechanic (theme-agnostic)
A login form builds its SQL query by concatenating user input, so a crafted payload makes the WHERE clause always true and logs the attacker in as an admin. Optionally a naive request filter (rejects `--`, spaced `OR`, `1=1`) that a cleverer payload evades.

## Player solve path
1. Recon leaks the admin username and a hint that the query is built inline.
2. Craft an injection that bypasses the filter and authenticates as the admin.
3. Land on the admin-only page.

## What to plant
- FLAG: on the admin page the bypass unlocks.
- ACCESS KEY: a bit alongside — an admin 'config'/'notes' field or a linked settings page next to the flag.

## Skin points (change per CTF)
Change: company/app name, admin username, page copy, the filter's exact blocked patterns.
Keep: the concatenated query + the bypass being possible.

## Blueprint mapping
hosted; small web app in target/ (Flask or PHP). build.py renders login + admin templates with __FLAG_<ID>__ and __ACCESS_KEY_<ID>__.
