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
