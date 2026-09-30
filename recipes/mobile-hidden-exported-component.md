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
An Android app gates a reward behind a condition the player can't meet directly —
a far-future date lock whose reference time is fixed in native code, so changing
the device clock does nothing. The real unlock is a developer/back-door **exported**
component (activity/service/receiver) that flips a persisted flag (SharedPreferences)
when triggered by an intent. Because it's exported, it can be launched from outside
the app with `adb shell am start -a <action>` (or a crafted intent), bypassing the
lock. The flag/reward is stored obfuscated (XOR+Base64) and decoded at runtime.

## Player solve path
1. Decompile the APK; find the lock logic and note the reference time is fixed in a
   native lib (clock changes won't work).
2. Read the manifest; spot an `exported="true"` component with a custom action that
   sets the unlock flag.
3. Fire it: `adb shell am start -a <action>` (or matching intent) to set the
   persisted unlock flag.
4. Re-open the app — now unlocked; it decodes and displays the reward/flag.

## What to plant
- FLAG: XOR/Base64-sealed in the app, decoded only after the unlock flag is set.
- ACCESS KEY: a bit alongside — in a separate resource/string or a second pref key,
  not in the same sealed blob as the flag.

## Skin points (change per CTF)
Change: the lock premise (date/geofence/counter), the component type/action name,
the reward screen's look.
Keep: an unmeetable gate defeated only via a hidden exported component + intent; a
persisted unlock flag; obfuscated reward decoded at runtime.

## Blueprint mapping
- box_type: download; portal serves the `.apk`.
- build.py seals `__FLAG_<ID>__` (XOR+Base64) behind the exported-component unlock
  and plants `__ACCESS_KEY_<ID>__` in a separate resource; native reference time
  compiled in so clock edits fail.
