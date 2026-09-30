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
A served web page hides sensitive tokens in the delivered client source rather than
on the rendered screen: one token sits in an HTML comment in the page itself, and a
second token sits in a static asset the page links (a script/style bundle). Neither
is visible in the browser, but both are fully readable in the source — and, crucially,
a recursive site-cloner or mirror (or plain view-source plus fetching the linked file)
pulls the page AND its linked assets together, so cloning the page hands the player
both tokens at once. Exploitable because everything shipped to the client — page
source and bundled assets — is readable by anyone who looks past the rendered UI.

## Player solve path
1. Mirror/clone the page (recursive fetch) or open view-source.
2. Read the token left in an HTML comment near the top of the page source.
3. Follow the linked static asset the clone also fetched; read the token in its
   header/comment.
