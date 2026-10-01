---
slug: crypto-vault-decrypt
title: Unlock an encrypted file one layer at a time
category: Cryptography
source_ctf: First Shift
skills: crypto, openssl
difficulty: medium
box_type: download
status: built
---

## Mechanic (theme-agnostic)
Two files are supplied together: an encrypted blob and a notes file listing ten base64-encoded strings, each of which decodes to a complete `openssl enc -d ... -pbkdf2` command that differs from the others ONLY in the chosen symmetric cipher. The correct passphrase is deliberately not in the notes — it must be carried over from an earlier challenge (a stage-gating dependency), and every command carries a `PASSPHRASE` placeholder, never the real value, so this stage cannot be skipped. All ten candidates are CBC-mode block ciphers (AES, Camellia, ARIA at 128/192/256, plus 3DES) chosen so they behave uniformly: on the wrong cipher they exit non-zero and write binary garbage, while exactly one (aes-256-cbc) exits 0 and writes readable text. Stream ciphers (e.g. aes-128-ctr) are excluded because they exit 0 on any key and would blur the signal; ciphers that fail with "error setting cipher" (bf/cast5/rc2) are excluded because that error would reveal they were never real candidates. The decrypted first layer is itself a note that states in plain text that openssl is the only tool that reads its embedded payload, and names the payload's password as an identifier quoted in the same note (e.g. an incident reference). That payload is a second base64 openssl block — same aes-256-cbc with `-pbkdf2 -a` (ASCII-armored) — keyed on that identifier. A decoy lead (a shell-history line naming a custom packing script, not openssl) points at where the archive was created but never reveals the cipher: a real lead for locating the file, a dead end for opening it.

## Player solve path
1. Obtain the outer passphrase from the prior challenge — it is not present in these two files.
2. Base64-decode the ten strings in the notes file; observe they are the same openssl decrypt command varying only by cipher, each with a passphrase placeholder.
3. Substitute the carried-over passphrase and run each; nine exit 1 and emit binary garbage, one (aes-256-cbc, `-pbkdf2`) exits 0 and writes readable text.
4. Read the recovered first-layer note: it says openssl reads its payload and names the payload's password as an identifier quoted in the note.
5. Extract the ASCII-armored payload block and decrypt the inner layer: `openssl enc -d -aes-256-cbc -pbkdf2 -a -pass pass:<identifier>`.
6. The inner plaintext carries the flag and the submission key; ignore the shell-history lead that names a packing script but no cipher.
