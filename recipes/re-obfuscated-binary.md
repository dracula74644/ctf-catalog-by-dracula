---
slug: re-obfuscated-binary
title: Reverse an obfuscated binary to recover a secret
skills: reverse-engineering, binary
difficulty: hard
box_type: download
category: with_key
source: CTF1 "First Shift" — flag 3
status: built
---

## Mechanic (theme-agnostic)
A small native binary has all its strings obfuscated (XOR/rolling mask). The player reverses the tiny unmask routine (Ghidra) and applies it to the embedded blobs to recover a gate password + secrets. Running it with the right input prints more. One secret is read-only (never printed) — you must read the code.

## Player solve path
1. Load the binary; find the unmask function.
2. Apply it to the masked arrays → gate password + secrets.
3. Run with the gate input to reveal the rest.

## What to plant
- FLAG: printed when the binary is run with the recovered input.
- ACCESS KEY: a bit alongside — a masked value you only get by *reading* the code (never printed).

## Skin points (change per CTF)
Change: the mask/algorithm, strings, the gate word.
Keep: obfuscated strings + a reversible unmask routine; one read-only secret.

## Blueprint mapping
download; build.py compiles/obfuscates the binary with placeholders masked in. Reference: CTF1 build/flag3_binary.py + build/flag3/analyser.c.
