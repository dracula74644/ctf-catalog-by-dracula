---
slug: re-embedded-audio-morse
title: Pull a hidden audio clip out of a compiled binary and decode it
category: Reverse Engineering
source_ctf: Digital Museum: The Archive of a Breach
difficulty: easy
skills: reversing, resource-extraction, audio-stego, morse
box_type: download
status: built
---

## Mechanic (theme-agnostic)
A compiled binary (DLL/EXE/shared object) carries an audio file embedded as an
in-binary resource or an appended blob. The audio itself is the payload: a tone
or beep pattern (e.g. Morse code) that spells the secret. Nothing in the program's
visible behaviour hints at it — the resource is only found by inspecting the file,
carving out the audio, and decoding the sound rather than the code.

## Player solve path
1. Inspect the binary (strings, a resource viewer, or a file-carver) and notice an
   embedded/appended audio stream (magic bytes like `RIFF`/`WAVE`).
2. Carve the audio out to a standalone file.
3. Listen / view the waveform or spectrogram: the tone pattern is Morse (or similar).
4. Decode the tones to text to recover the secret.
