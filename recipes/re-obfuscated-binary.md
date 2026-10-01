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
A small unstripped native ELF (x86-64) demands a single passphrase argument and denies everything else. Its sensitive strings are deliberately non-greppable: the gate password is stored base64-encoded but held as a 16-bit-per-character array (one char per `short`), so on disk every second byte is 0x00 and there is no contiguous printable run for `strings` to report — while a decompiler shows the array and its values plainly. At startup `main` runs a `narrow` routine that collapses the 16-bit array back to ordinary bytes, then a `b64decode` routine that base64-decodes that text into the expected passphrase before the `strcmp` gate. The protected secrets (the flag, the submission key, and a further passphrase that gates a downstream challenge) are additionally masked at rest by a reversible `unmask` transform — a rotate-right-by-3 (`(e>>3)|(e<<5)`) followed by a position-dependent XOR against `0x5A + i*7` — so none can be lifted from the raw bytes without driving the program through the correct password. The design closes both opposite failure modes: the base64 must not be greppable (or the challenge is trivial) and the 16-bit array must be present (or it is impossible). Supplying the recovered passphrase unmasks and prints all protected values at once.

## Player solve path
1. Run the binary: it prints a usage/version banner, asks for a passphrase, and rejects any wrong input with a "denied" message.
2. Confirm static shortcuts fail — `strings` yields no base64 blob and no keyword — so a decompiler or debugger is required.
3. Load it in a decompiler (e.g. Ghidra, default ELF x86-64 analysis); since it is unstripped, navigate to `main` and the `narrow` / `b64decode` / `unmask` helpers by name.
4. Read `main`: it narrows a 16-bit data array to text, then base64-decodes that text to produce the value compared against the argument.
5. In the Listing/data view, read the 16-bit array (every other byte is 0x00); take every other byte to recover the base64 string, then base64-decode it to the gate passphrase. (Alternatively, break in a debugger after the decode and read the buffer directly.)
6. Run the binary with the recovered passphrase; it applies `unmask` (rotate-right-3 then position-dependent XOR) and prints the flag, the submission key, and a further passphrase used by a later challenge.
