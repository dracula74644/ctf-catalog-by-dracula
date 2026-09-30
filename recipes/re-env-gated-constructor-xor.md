---
slug: re-env-gated-constructor-xor
title: Reverse a binary that crashes until the right environment is set
category: Reverse Engineering
source_ctf: Breaking CTF
difficulty: hard
skills: reverse-engineering, binary, ghidra, xor, anti-strings
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A stripped native binary crashes immediately on startup with an intentional illegal instruction (e.g. `ud2` / SIGILL). The crash is not in `main` — it lives in a constructor-style function that runs before `main`: it reads a specific environment variable via `getenv`, compares it (`strcmp`) to a required value, and only skips the illegal-instruction path when they match. Both the environment-variable name and its required value are stored as XOR-encoded byte arrays (each byte XORed with a single constant, e.g. `0x5a`) that the constructor copies into a local buffer and decodes at runtime, so a plain `strings` pass reveals neither the name, the value, nor the flag. The recovered value does double duty: once the gate passes, the same string is used as the XOR key to decode the flag material at runtime. The binary may be shipped standalone or wrapped in a small bootable initramfs image (kernel + init + cpio rootfs + a launcher) that runs it as the boot process.

## Player solve path
1. Run it (or boot the provided image) — it dies instantly with an illegal-instruction-style crash; `strings` shows no flag, env-var name, or value.
2. If it is packaged in an initramfs, extract the rootfs archive (e.g. `cpio -idmv`) to pull out the standalone binary.
3. In a disassembler, locate the pre-`main` constructor: find the code path that calls `getenv`/`strcmp` and reaches the invalid instruction.
4. Recover the two embedded byte arrays and XOR each with the constant → the environment-variable name and its required value.
5. Re-run with that environment variable set to the decoded value; the gate no longer crashes and the same value keys the flag decode, which prints on success.
