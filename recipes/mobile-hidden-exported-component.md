---
slug: mobile-hidden-exported-component
title: Unlock a time-locked Android app through a hidden exported component
category: Mobile Security
source_ctf: Digital Museum: The Archive of a Breach
difficulty: hard
skills: mobile, android, apk, exported-activity, intents, adb, static-analysis
box_type: download
status: built
---

## Mechanic (theme-agnostic)
An Android app gates a reward behind a far-future date lock, but the lock is a decoy:
the unlock check is roughly `if (dateReached()) return true; return
prefs.getBoolean("<gate>")`, and the date branch uses a fixed reference clock, so
changing the device time does nothing. The real gate is a persisted boolean
(SharedPreferences) that is written **only** by a developer/back-door activity. That
activity is button-less inside the app but declared `exported="true"` in the manifest
with a custom intent action, so it can be launched from outside the app via `adb` with
a matching intent — flipping the gate. The reward/flag is stored obfuscated
(Base64 of the flag XORed with a fixed key) and decoded at runtime, so it never
appears in `strings`; it can also be recovered statically by reversing that sealed
constant.

## Player solve path
1. Decompile the APK; trace the reward flow to the unlock check and see the date
   branch uses a fixed reference time (clock changes won't help).
2. Find that the gate is a SharedPreferences boolean and search xrefs for where it is
   written — only the developer activity sets it.
3. Read the manifest: that activity has no in-app launcher but is `exported="true"`
   with a custom action.
4. Install the app and launch the hidden activity from outside:
   `adb shell am start -a <action>` (or `-n <pkg>/<activity> -a <action>`), then
   trigger its "enable" action to set the gate.
5. Re-open the app — now unlocked; it decodes and shows the flag. (Static shortcut:
   Base64-decode the sealed constant and XOR with the fixed key to print the flag
   without running the app.)
