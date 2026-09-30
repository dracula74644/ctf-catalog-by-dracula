---
slug: mobile-apk-static-secrets
title: Recover obfuscated credentials and a flag from an Android APK in a decompiler
category: Mobile Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: easy
skills: mobile, android, apk, static-analysis, jadx, deobfuscation
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A shippable Android APK hides its real credentials and the flag in code, not in
plaintext. The secrets are lightly obfuscated (string reversal + Base64, split
across helper classes) so a naive `strings` scan misses them, but they fall out to
anyone who decompiles the app and reads the deobfuscation routine. A decoy
credential pair sits in an obvious config/test class to bait a shallow look.

## Player solve path
1. Decompile the APK (JADX / apktool) and browse the sources.
2. Spot the decoy creds in an obvious config class — note they don't unlock anything.
3. Find the credential/crypto helper classes; read how strings are transformed
   (reverse, Base64, XOR, etc.).
4. Reverse the transform on the stored blobs to recover the real credentials and the
   flag.
