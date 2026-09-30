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
A shippable Android APK hides a hidden login screen and its real credentials in code,
not in plaintext. The credentials are lightly obfuscated and split across helper
classes: a credential-store class holds the encoded username/password strings, and a
separate crypto-helper class holds the reversing routine — typically
`decode(v) = Base64.decode(reverse(v))` (string reversed, then Base64-decoded). A
naive `strings` scan misses them because the stored blobs are reversed Base64. A decoy
credential pair sits in an obvious config/test class that is never referenced by the
real auth manager, to bait a shallow look. The app is framework-only (no AndroidX), so
the whole secret is recoverable statically in a decompiler — no root, Frida, or
emulator needed. The flag is likewise stored obfuscated and decoded at runtime, shown
(with a separate access key) once you log in.

## Player solve path
1. Open the APK in JADX (or apktool) and browse the package; note the activity that
   drives login and the auth manager it calls.
2. Spot the decoy creds in an obvious config/test class and confirm the auth manager
   never references them — ignore them.
3. Trace login → auth manager → credential-store + crypto-helper. Read the transform
   (reverse then Base64-decode).
4. Apply the transform to the stored blobs to recover the real username/password
   (e.g. `base64.b64decode(stored[::-1])`).
5. Either read the flag decoded the same way, or install the APK and log in with the
   recovered credentials to reveal the flag (and its access key).
