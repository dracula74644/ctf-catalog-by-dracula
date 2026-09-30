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
A deterministic simulated LLM agent reviews user-submitted records (tickets). Asking it directly for the flag, system prompt, or secrets returns canary decoy flags, so the intended path chains four genuine LLM-application failure modes. (1) Discovery: `robots.txt` points at an AI-plugin manifest and an OpenAPI spec; the manifest warns of "indirect prompt injection in retrieved content" and the OpenAPI `x-agent-notes` disclose that the agent keeps a private scratchpad (leaked by legacy debug requests), that its tool router parses `<tool_call>` JSON blocks out of retrieved content, and that retrieved record text is untrusted. (2) Indirect prompt injection: instructions embedded in a submitted record are obeyed when the agent later retrieves that record during review, so a record carrying a debug/scratchpad directive makes the agent dump its private scratchpad — revealing a privileged read tool's name, a case/resource id, a scope, and a nonce. (3) Tool-call smuggling / confused deputy: because the router parses `<tool_call>` JSON from untrusted retrieved content, a second record embedding a crafted `<tool_call>` block (naming the privileged read tool with the leaked id, scope, nonce, and an `encode:base64` option) makes the agent actually invoke that tool. (4) Output-filter bypass: the tool's sensitive response is returned as Base64 shards emitted out of slot order, defeating the literal-flag redactor; the player sorts by slot and Base64-decodes.

## Player solve path
1. Fetch `robots.txt`, then the AI-plugin manifest and OpenAPI spec it references; read the `x-agent-notes` to learn about the scratchpad, the `<tool_call>` router, and the record-review endpoints.
2. Create a record whose body contains hidden instructions / a debug directive telling the agent to include its scratchpad, then ask the agent to review that record; it leaks the privileged tool name, resource id, scope, and nonce.
3. Create a second record embedding a `<tool_call>` JSON block that invokes the leaked read tool with the leaked id/scope/nonce and requests Base64 encoding, then ask the agent to review it so the router executes the tool.
4. Take the returned shards, sort them by their slot number (not display order), Base64-decode each, and concatenate to assemble the flag; direct prompts still return only canary decoys.
