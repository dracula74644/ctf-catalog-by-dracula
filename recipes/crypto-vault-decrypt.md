---
slug: crypto-vault-decrypt
title: Unlock an encrypted file one layer at a time
category: Cryptography
skills: crypto, openssl
difficulty: medium
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A sealed blob opens only with a passphrase obtained from an earlier challenge. Inside is a note plus a second encrypted block whose password is stated in the note (e.g. an incident number). Peel the layers with openssl to reach the flag+key.

## Player solve path
1. Get the outer passphrase (from a prior stage).
2. openssl aes-256-cbc -d the outer blob → a note.
3. The note names the inner password; decrypt the inner block.

## What to plant
- FLAG: in the innermost plaintext.
- ACCESS KEY: a bit alongside — a separate line of the inner plaintext, or the note between layers.

## Skin points (change per CTF)
Change: cipher params, the passwords, the note story, layer count.
Keep: a passphrase-gated blob whose note reveals the next password.

## Blueprint mapping
download; build.py encrypts the layers with placeholders in the plaintext.
