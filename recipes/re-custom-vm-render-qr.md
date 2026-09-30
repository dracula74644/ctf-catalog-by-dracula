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
A proprietary data file is decoded through several stacked layers — an obfuscation
pass (XOR), a compression pass (custom RLE), and finally an instruction stream fed
to a tiny drawing virtual machine that renders an image. A viewer program ships
that *can* render it, but is deliberately shipped in a "damaged" mode: a checksum /
integrity gate fails, so the VM draws garbage instead of the real picture. The
rendered image (e.g. a scannable code) encodes the secret. The player must reverse
the format and the VM, then either patch out the wrong-checksum gate or reimplement
the renderer to produce the true image.

## Player solve path
1. Reverse the file loader: identify the XOR key, the RLE scheme, then the opcode
   format the drawing VM consumes.
2. Run the shipped viewer — observe it renders garbage; locate the checksum/integrity
   check that forces the "damaged" path.
3. Patch the binary to pass the check, or reimplement the decode+VM from scratch.
4. Render the real image (a QR/barcode/picture) and read/scan it for the secret.

## What to plant
- FLAG: encoded in the correctly rendered image.
- ACCESS KEY: a bit alongside — e.g. a plaintext string in the viewer binary or a
  side file, not inside the rendered image.

## Skin points (change per CTF)
Change: the layer choices (XOR/RLE/opcodes), the file extension, what the image is
(QR vs ASCII art vs bitmap), the reason the renderer is "broken".
Keep: layered decode → a mini drawing VM → an integrity gate that must be patched or
bypassed → the image carries the flag.

## Blueprint mapping
- box_type: download; portal serves the custom file + the (crippled) renderer.
- build.py encodes `__FLAG_<ID>__` into the image, emits the VM instruction stream,
  applies RLE+XOR, and bakes the failing checksum into the shipped viewer;
  `__ACCESS_KEY_<ID>__` planted as a side string.
