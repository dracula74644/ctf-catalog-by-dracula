---
slug: re-obfuscated-binary
title: Reverse a scrambled program to find its secret
category: Reverse Engineering
source_ctf: First Shift
skills: reverse-engineering, binary
difficulty: hard
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A small native binary has all its strings obfuscated (XOR/rolling mask). The player reverses the tiny unmask routine (Ghidra) and applies it to the embedded blobs to recover a gate password + secrets. Running it with the right input prints more. One secret is read-only (never printed) — you must read the code.

## Player solve path
1. Load the binary; find the unmask function.
2. Apply it to the masked arrays → gate password + secrets.
3. Run with the gate input to reveal the rest.
