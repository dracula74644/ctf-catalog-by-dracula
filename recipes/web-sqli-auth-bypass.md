---
slug: web-sqli-auth-bypass
title: Log in as admin using SQL injection
category: Web Application Security
source_ctf: Breach Response
skills: web, sqli, auth-bypass
difficulty: medium
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A login form builds its SQL query by concatenating user input, so a crafted payload makes the WHERE clause always true and logs the attacker in as an admin. Optionally a naive request filter (rejects `--`, spaced `OR`, `1=1`) that a cleverer payload evades.

## Player solve path
1. Recon leaks the admin username and a hint that the query is built inline.
2. Craft an injection that bypasses the filter and authenticates as the admin.
3. Land on the admin-only page.
