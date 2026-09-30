---
slug: re-custom-vm-render-qr
title: Repair a crippled renderer so a custom file format draws the secret
category: Reverse Engineering
source_ctf: Digital Museum: The Archive of a Breach
difficulty: hard
skills: reversing, file-format, bytecode-vm, patching, image-recovery
box_type: download
status: built
---

## Mechanic (theme-agnostic)
Players get a native viewer executable and a proprietary data file whose format
documentation is "lost". The file decodes through stacked layers: a small header,
then a payload that is `XOR(RLE(scene))`. A typical header is little-endian — a
4-byte magic, a version byte, canvas width/height (u16 each), a one-byte scene
checksum, a u32 payload length, then the payload. The XOR layer uses a positional
keystream (e.g. `key(i) = ((i*7) ^ 0x3F) & 0xFF`), the compression is a custom RLE
keyed on a marker byte (`0x90 0x00` = literal marker; `0x90 NN` = repeat previous
byte NN more times), and the decompressed scene is a stream of drawing opcodes for a
tiny stack/cursor VM (move-cursor, draw-line, set-color, rotate, scale, draw-circle,
fill-rect, end). Rendered correctly the scene paints a scannable image (a QR/barcode)
that encodes the flag. The catch: the viewer ships "damaged" — the stored checksum
byte is deliberately corrupted (e.g. `stored = real ^ 0xFF`), so an integrity compare
(`sum(scene_bytes) & 0xFF == header_checksum`) fails and the program renders a
meaningless dot preview instead of the real image. Optimised builds inline the
checksum loop, and the flag/QR never appears in `strings`, so there is no shortcut.

## Player solve path
1. Reverse the loader to recover the header layout, the positional XOR key, the RLE
   marker scheme, and the VM opcode set (operand sizes, cursor/color state).
2. Run the shipped viewer: it renders garbage. In a decompiler, find the integrity
   gate — a loop summing scene bytes compared against the header checksum byte, then
   a conditional jump into the "damaged preview" branch.
3. Take either accepted path:
   - **Patch:** NOP or invert the conditional jump after the compare (or turn it into
     an unconditional jump into the render branch) and save the patched binary.
   - **Reimplement:** write a solver that un-XORs, RLE-decompresses, and runs the
     opcode VM to draw the scene yourself.
4. Render the true image and scan it (phone camera / `zbarimg`) to read the flag.
