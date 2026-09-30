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
A stripped native binary crashes on startup with an intentional invalid instruction (e.g. `ud2`). The crash lives in a constructor that runs before `main`: it reads an environment variable and compares it to a required value, both of which are XOR-encoded byte arrays in the binary (so `strings` reveals nothing useful). Only when the env var is set to the decoded value does the constructor skip the crash — and that same value is then used as the XOR key to decode the flag. Players must open the binary in a disassembler, recover the env-var name and expected value from the constructor, and run with the right environment.

## Player solve path
1. Run it — immediate startup crash; `strings` shows no flag, env name, or value.
2. In a disassembler, find the pre-main constructor calling getenv/strcmp before the invalid instruction.
3. Recover the two byte arrays and XOR each with the constant → env-var name + required value.
4. Run with that env var set; the gate passes and the value keys the flag decode.
