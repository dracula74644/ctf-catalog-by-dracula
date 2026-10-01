---
slug: web-backup-leak-recon
title: Find secrets in a leaked website backup file
category: Web Application Security
source_ctf: Deep Access
skills: web, recon, information-disclosure
difficulty: easy
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A nightly backup job drops a snapshot of the application's server-side config file under the web root with a `.bak` extension. Because the server only executes the live config's language extension (e.g. `.php`), the backup is served as **plaintext source** — so secrets that the running app never emits are fully exposed just by fetching the file. The snapshot directory is reachable over HTTP but **not linked** from any page: the lead is a developer comment left in the homepage HTML source admitting the cron writes config snapshots to a web-served folder, and directory indexing is (mis)configured ON so the folder lists its contents. The real backup leaks a maintenance **username** and a password **policy/scheme** — the *shape* of the password, not the password itself — plus the stage token, so it feeds a downstream targeted brute-force. Decoys are planted alongside: an older/superseded `.bak` with a stale token (a decoy key that decrypts cleanly but is rejected), a SQL dump, a scratch notes file, and a set of reporting-only database credentials that are a rabbit hole (not the login that matters).

## Player solve path
1. **Read the HTML source** of the homepage (not the rendered page) — e.g. `curl -s <url>/ | grep -i TODO` — and find the dev comment pointing at web-reachable config snapshots under the docroot.
2. **Check `robots.txt`** (cheap): it lists only decoy disallowed paths, none of them the backup folder — so the folder is unlisted and must be discovered.
3. **Directory-brute-force** for the snapshot folder (e.g. `ffuf`/`gobuster` with a common wordlist); it returns as a real directory.
4. **List the directory** (indexing left on) and spot the config `.bak` among the decoys.
5. **Fetch the `.bak`** — it comes back as plaintext source. Confirm the *live* config at its real path executes and leaks nothing, proving the backup was the mistake.
6. **Extract the username + password scheme** (the inputs to the later SSH brute-force), ignoring the reporting-only DB creds and the superseded `.bak`.
7. The **flag and the access key both sit in that same backup file** (the key on the line just above the flag).
