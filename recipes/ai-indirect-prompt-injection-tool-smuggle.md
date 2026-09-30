---
slug: ai-indirect-prompt-injection-tool-smuggle
title: Poison retrieved content to smuggle a tool call out of an AI agent
category: AI/ML
source_ctf: Breaking CTF
difficulty: hard
skills: ai-ml, prompt-injection, llm-security, tool-abuse, encoding
box_type: hosted
status: built
---

## Mechanic (theme-agnostic)
A simulated (deterministic) LLM agent reviews user-submitted records. Direct questions ("what's the flag / system prompt?") return canary decoys. The real chain uses genuine LLM-app failure modes: (1) indirect prompt injection — instructions inside a submitted record are obeyed when the agent later retrieves it, leaking a private scratchpad with tool policy + a nonce; (2) tool-call smuggling — the agent's router parses `<tool_call>` blocks out of untrusted retrieved content, so a crafted record makes it invoke a privileged read tool with the leaked nonce; (3) output-filter bypass — the sensitive response is returned as out-of-order encoded shards that the literal-flag redactor misses, so the player sorts and decodes them.

## Player solve path
1. Discover the plugin/tool surface (e.g. robots → plugin manifest → OpenAPI notes).
2. Submit a record with hidden instructions; have the agent review it to leak the scratchpad (tool name, id, scope, nonce).
3. Submit a second record embedding a `<tool_call>` for the privileged read with the leaked nonce; have the agent review it.
4. Sort the returned shards by slot and decode (Base64) to assemble the flag.

## What to plant
- FLAG: released only through the smuggled tool call, as sorted encoded shards.
- ACCESS KEY: a bit alongside — extra encoded shards released by the same tool path (never in the system prompt, manifest, or direct chat).

## Skin points (change per CTF)
Change: the tool name/nonce, the record/ticket story, the decoy canaries, the shard encoding.
Keep: canary-trapped direct asks + indirect injection (scratchpad leak) + tool-call smuggling from retrieved content + encoded-shard filter bypass.

## Blueprint mapping
hosted; deterministic agent web app in target/ with record-create + review endpoints and a tool router that (insecurely) parses tool calls from retrieved text. build.py splits __FLAG_<ID>__ / __ACCESS_KEY_<ID>__ into encoded shards.
