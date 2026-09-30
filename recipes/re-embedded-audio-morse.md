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
A front-end program prompts for an unlock code; a companion library it imports holds
the real logic. Embedded in that library as a binary resource (on PE, an `RCDATA`
resource — type 10 — under a named blob) is a WAV audio clip. The audio *is* the
payload: it beeps the unlock code in International Morse. Secrets are hardened so
`strings`/`grep` can't shortcut the solve — the code is stored only as a hash
(e.g. FNV-1a) and the flag is XOR-sealed with the code, so neither the code nor the
flag exists as plaintext anywhere. Entering the decoded code into the front-end
unseals and prints the flag. A useful gotcha: the current (v3) `binwalk` rewrite only
reports the PE header and will NOT carve this embedded WAV, so extraction is done by
reading the resource directory or carving the RIFF chunk by hand.

## Player solve path
1. Note the front-end imports a library; enumerate that library's exports and
   resources — an unused "hint" export points at media/archives hiding the code.
2. Extract the embedded WAV. Reliable options: a resource tool (`wrestool -t RCDATA`,
   Resource Hacker, pe-tree), or a manual carve — find the `RIFF` marker, read the
   4-byte little-endian chunk size, and copy `size + 8` bytes out to a `.wav`.
3. Play the WAV / view its waveform or spectrogram: the tone pattern is Morse.
4. Decode the Morse to recover the unlock code.
5. Enter the code into the front-end program → it prints the flag.
