---
slug: web-page-clone-source-leak
title: Recover secrets that a site-clone drags out of page source and its linked assets
category: Web Application Security
source_ctf: RED RANGE
difficulty: easy
skills: web, information-disclosure, site-cloning, recon, view-source
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A website leaks secrets into the static material a site-cloner pulls down. The landing
page's HTML hides one secret in a developer/debug HTML comment that never renders
visibly (the flag), and a linked JavaScript asset embeds a second secret as an
"asset-integrity token" dressed up as a CI/CD value (the access key). Because both live
in page source and a linked file, cloning the site (e.g. the Social-Engineer Toolkit
Site Cloner, which fetches the page plus its linked assets into a local web root) and
grepping the result surfaces both — exactly the information-disclosure the challenge
teaches. Fetching the page and its asset directly with curl is the equivalent.

## Player solve path
1. Clone the site with a site-cloner (or just fetch the landing page and its linked JS).
2. Grep the cloned HTML for a debug/developer comment → the flag.
3. Grep the linked JS asset for the "integrity token" value → the access key.
4. (Equivalent check: `curl -s <url>/ | grep -i debug` and
   `curl -s <url>/assets/app.js | grep -i 'integrity token'`.)
