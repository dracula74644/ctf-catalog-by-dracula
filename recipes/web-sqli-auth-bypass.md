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
The login handler builds its authentication query by string-concatenating the submitted username and password directly into a single `SELECT ... WHERE username='<u>' AND password='<p>'` statement, so injected SQL rewrites the WHERE clause — a boolean/auth-bypass SQLi against a single-statement query (no stacked queries). The row's stored role is trusted for authorization, so the attacker must authenticate specifically as the admin account, not just any row; the admin username is not the obvious one and is leaked through exposed config/recon (an exposed `.env` naming the admin user, and `.git` history hinting the query is built inline). A deliberately shallow request filter ("WAF") sits in front: it normalises all whitespace to single spaces and case-insensitively rejects a signature list — inline comments (`--`, `#`, `/* */`), statement separators (`;`), spaced boolean logic (` or `, `1=1`), `union`, time/`information_schema`/`xp_` markers — returning a 403 security alert. The filter is bypassable because it only catches *those shapes*: a payload with no inline comment (let a trailing quote balance the statement) and `OR` written with no surrounding spaces (e.g. `<admin>'OR'1'='1`) slips past the spaced-OR and comment rules while still forcing the admin row to match. The flag and a separate per-deploy access key are both printed on the admin page but are distinct tokens.

## Player solve path
1. Recon the app's exposed files (`/.env`, `/.git/` metadata) to learn the admin account name and confirm the query is concatenated inline (injectable).
2. Probe the login with textbook payloads (`<user>' -- `, `' OR '1'='1' -- `, even a spaced `' OR '`) and watch each get a 403 "security alert" — map what the filter blocks (inline comments, `;`, spaced `OR`, `1=1`, `union`).
3. Craft an evading payload against the discovered admin user: drop the comment and remove the spaces around `OR`, e.g. username `<admin>'OR'1'='1`, any password — the WHERE clause reduces to `username='<admin>' OR (...)` and matches the admin row.
4. Submit it, follow the session cookie to the admin-only page (ordinary non-admin creds found elsewhere in the exercise authenticate but 403 here — a decoy).
5. On the admin page read the flag, then separately grab the 64-hex access key shown alongside it.
