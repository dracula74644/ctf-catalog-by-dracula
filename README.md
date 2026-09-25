# CTF Challenge Catalog

A personal, growing library of challenge **recipes** — reused across every CTF you
build on the blueprint. It stores *mechanics, not code*: the vulnerability and the
player's solve path in the abstract, separated from any one CTF's story. That's why
it works even though your past CTFs had different architectures — you reuse the
mechanic and re-skin it, you never port old code.

## Layout
```
README.md            this file
RECIPE-TEMPLATE.md   copy this to add a recipe
index.md             one-line list of every recipe (auto-generated)
recipes/             one file per challenge recipe
```

## Browse it in your browser

```
./serve.sh            # then open http://localhost:8099/web/
```
A local, offline web viewer: every recipe as a card with a plain-words title, filtered
by just two things — **Category** (Reverse Engineering, Mobile Security, Digital
Forensics, Web Application Security, Cryptography, Network Security, Secure Coding,
Exploitation, AI/ML) and **Difficulty** (easy/medium/hard) — and per recipe **View**,
**Download .md**, and **Copy reuse prompt** (a ready-to-paste prompt with the full
mechanic embedded — paste it into Claude in any CTF to build that challenge). It
reads your recipe files directly, so it is always current; `serve.sh` regenerates the
data each run. Nothing leaves your machine.

## How to use it when building a CTF

1. Browse `index.md`, pick a recipe that fits the CTF you're building.
2. Tell Claude (in the CTF's own repo): *"add catalog recipe `<slug>`, themed to
   this CTF's <story>."*
3. Claude reads the recipe, re-skins the **mechanic** to your theme, and wires it as
   a normal blueprint challenge (fresh flag + prefix/postfix, placed per your call).
   The recipe is the reference; the wiring is always blueprint-native.

**Only the mechanic crosses over.** Every name, filename, hostname, account, and
story is invented fresh for the new CTF. Never carry a name, string, or line of
code from a past CTF — the recipe holds no old names on purpose, so there is
nothing to copy but the technique. Reimplement from the technical description.

## How to grow it

- After you build a genuinely new challenge, add a recipe: `cp RECIPE-TEMPLATE.md
  recipes/<slug>.md`, fill it in (mechanic + solve + skin points, no story), then
  regenerate the index: `python3 gen-index.py`.
- To pull in a challenge from an OLD CTF (even one Claude has never seen), run the
  **recipe-extractor** agent (`.claude/agents/`) or just prompt from this folder:
  *"add a recipe from this challenge"* and point it at the source — a repo/folder on
  disk, pasted files, a host to SSH into, or a written description. It distills the
  mechanic, strips every name, writes the recipe, and updates the index.
- Keep each recipe theme-agnostic. If you're writing a company name or a filename,
  that's a *skin point*, not part of the mechanic.

## Field notes
- **category** and **difficulty** are the only two filters. `category` is a fixed
  list (Reverse Engineering, Mobile Security, Digital Forensics, Web Application
  Security, Cryptography, Network Security, Secure Coding, Exploitation, AI/ML);
  `difficulty` is easy/medium/hard. Give each recipe a **plain-words title** that says
  what the player does (e.g. "Log in as admin using SQL injection").
- **box_type** maps to the blueprint: `hosted` (a service on a port) or `download`
  (a file the portal serves). `either` = works both ways.
- **category** is `with_key` (flag + rotating access key) or `without_key` (flag only).
- **status** `idea` = a recipe you want to build but haven't yet; write the mechanic
  now, flesh it out when you use it.
