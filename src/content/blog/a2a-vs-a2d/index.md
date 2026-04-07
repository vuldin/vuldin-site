---
title: "Agent-to-Agent vs Agent-to-Database Communication"
description: "Why agent-to-database is a better approach than agent-to-agent communication for multi-agent AI systems"
date: "Apr 06 2026"
---

Agentic tools like OpenClaw and Hermes are awesome because they enable agent orchestration. But when someone says "agent orchestration", what exactly do they mean? There are a few different use cases that fall into this category:

1. A single human with their many agents: A single app instance on your local system can handle this use case.
2. Multiple humans and all their agents: More than one computer is involved, so we need a shared database of some type.
3. Autonomous agents: Also requires a shared database. For the purposes of this blog, this option is the same as number 2 above.

To me it seems like most people are referring to use case 1 when they discuss agent orchestration, but I see both use cases being discussed. The issue is the technology you need to handle each use case is very different. And even if you do have multiple humans and computers in the loop, many humans will still want to have a local-first solution that doesn't rely on always being connected to a shared database and being online.

Regardless of the use case though, the requirement is the same: agents need to share context. The thing is that many popular tools today go about sharing context between agents in a very human-centric way. These tools create systems for agents to communicate directly with each other, referred to as agent-to-agent (A2A) communication. I'll be comparing A2A to another approach for sharing context, called agent-to-database (A2D), and make the argument that this latter approach is better for many use cases (and I'll give a few examples). With A2D, agents will no longer need to know about every other agent and how to send messages to them; instead agents automatically have shared context, and they automatically add to and query for any updates as they go on about their work.

## A2A communication

First let's look at some implementation details for A2A. I'll focus on a few popular implementations (Google A2A, OpenClaw, and Hermes), then I'll outline similarities between these three approaches.

### Google A2A

A2A seems to be the most complete specification out there. Every agent runs an HTTP server and publishes an agent card, which is a JSON file declaring its name, skills, security requirements, etc. When Agent A wants to talk to Agent B, it first resolves the agent card and then sends a JSON-RPC 2.0 request over HTTP:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "SendMessage",
  "params": {
    "message": {
      "message_id": "abc-123",
      "role": "ROLE_USER",
      "parts": [{ "text": "Summarize this document" }],
      "context_id": "ctx-456"
    },
    "configuration": {
      "accepted_output_modes": ["text/plain", "application/json"],
      "return_immediately": false
    }
  }
}
```

Messages contain typed `Parts` each with MIME types and metadata. Tasks follow a state machine: `SUBMITTED → WORKING → COMPLETED | FAILED | CANCELED | REJECTED`, with interrupt states like `INPUT_REQUIRED` and `AUTH_REQUIRED`. Streaming runs over SSE. Push notifications require webhook registration.

The security layer supports OAuth2, OpenID Connect, API keys, HTTP Basic/Bearer auth, and mTLS.

This is well-engineered, but at the same time this is a lot of infrastructure just to move a piece of context from one place to another.

### OpenClaw

OpenClaw has a multi-layer agent communication stack. Agents communicate through a Gateway WebSocket server rather than an HTTP server. Messages are typed JSON frames validated with TypeBox schemas. The handshake involves protocol version negotiation, client identity, Ed25519 device signatures, and capability advertisement.

Agents are addressed via session keys like `agent:coder:bug-123` or `agent:design:main`. Spawning a subagent means constructing a parameter object with the task description, agent ID, model override, thinking level, timeout, sandbox configuration, and any file attachments encoded in base64.

When a subagent finishes, results flow back through a push-based announcement system with transient error detection, permanent error classification, retry logic, and idempotency keys to prevent duplicate deliveries.

That's just the internal layer. For IDE integration there's an ACP bridge over stdio with NDJSON. For cross-server communication, a community plugin implements Google's A2A protocol with DNS-SD discovery, adaptive transport selection (JSON-RPC → REST → gRPC fallback), and routing based on Hill equation affinity scoring -- a formula borrowed from biochemistry.

### Hermes

Hermes handles multi-agent communication via a Python function call. The parent sends a goal string and a context string. The child returns a JSON summary. Subagents start with completely blank context with no shared files or shared memory. The project calls this "L0: Isolated." The future roadmap however describes four levels of context sharing:

| Level | Name | What it means |
|-------|------|---------------|
| L0 | Isolated | No sharing. Parent relays results. (Current state) |
| L1 | Result passing | Upstream results auto-injected into downstream context |
| L2 | Shared scratchpad | Read/write shared key-value store |
| L3 | Live dialogue | Turn-based agent-to-agent conversation |

Only L0 works today in Hermes. A2A support is tracked in a GitHub issue, and remote agent connections are proposed but not built. Even the "shared state" proposal imagines agents reading and writing markdown files in a directory.

The way Hermes handles A2A communication, and the fact that it doesn't yet have much A2A implemented, is not a criticism of the project. Instead I think this shows that even a well-funded project with clear multi-agent ambitions can struggle with this, because it can get very complicated fast. It's not easy to come up with a good A2A approach that is secure, simple, and fast.

## The A2A pattern

Let's take a step back and look at what these projects are either building or plan to build:

| Capability | Details |
| --- | --- |
| **Discovery** | Agent cards, DNS-SD, mDNS, Bonjour, Tailscale DNS integration, well-known URLs, static agent registries |
| **Addressing** | Session keys, agent IDs, topic IDs, context IDs, peer URLs, routing tables |
| **Message schemas** | MIME types, protobuf definitions, models, TypeBox-validation, newline-delimited JSON over Unix domain sockets |
| **Transport** | WebSockets, JSON-RPC, gRPC, REST, SSE, stdio/NDJSON, HTTP+JSON |
| **Resilience** | Circuit breakers, retry with backoff, idempotency keys, push notification webhooks with signal-decay, soft concurrency limiting |
| **Security** | OAuth2, OIDC, mTLS, Ed25519 device identity, bearer tokens with zero-downtime rotation, SSRF protection |

All of this exists to solve one problem: sharing context between agents. Agent A knows something, and agent B needs it. So these tools are building infrastructure to connect these agents. But with more agents means there is more complexity that each agent must navigate. Agents must know about all other agents, determine the level of trust, know how to communicate with them, learn about their capabilities, etc. This is additional context that is unrelated to the actual project you are working on. These tools can do a good job at hiding this complexity and your agent only loads these details into context when they need to. But your agents must interact with these complicated layers on an ongoing basis and the other agents must be active at the same time.

## Repeating mistakes from the past

Why does any agent need to know everything about every other agent you, or your organization, are using? Each of us may have a handful of agents, so the problem may not get too unwieldly as long as we are always focused on use case 1. But increasingly we want to interact with agents from other people, all working on shared projects. In that case it can get complicated to connect all agents together directly.

A2A seems like the wrong approach from a general architecture standpoint for most use cases... and it reminds me of why Kafka was invented. Before Kafka you had lots of point-to-point integrations where every app had a direct connection to the other apps. The number of connections needed in a system multiplied by the number overall apps in the system each time you had to add in another app. This was brittle and error-prone as the apps changed over time.

A2A is similar to this pre-kafka approach, and A2D applies something similar to the Kafka pattern to agentic communication. This means Agent A stores what it learned and then any other agent can just query for what it needs. Agents never need to directly interact with each other... they may not even run at the same time. Agents no longer need to care about all other agents, so no discovery is needed. Rather than asking various agents about what the status is or who knows what, agents can just ask "what do we know about X?". We no longer need a complicated message schema because agents store data in their context as it makes sense to them, and any agent can then use natural language to query the data. A transport protocol is no longer needed as shared context is just a database read. New agents can be added in at any time, and they have all the access to historical context.

YAPA is yet another personal assistant that implements this A2D approach.

## A2D: How YAPA works

YAPA is an MCP server that gives AI agents persistent, shared memory. This MCP server runs alongside Claude Code, OpenCode, or any other MCP-compatible agentic tool. As you work it watches for useful context and stores it, then before the agent responds to any prompt it queries memory for anything relevant. The local database is a fast vector database that is perfect for the types of queries agents make for context as they work.

There's no A2A communication in YAPA, and there's also no protocol, message format, or routing. There's just a shared knowledge layer.

### Storage: vector embeddings, not messages

Every memory is stored as a vector embedding in ChromaDB. Search is semantic, so asking about "Company A's DR strategy" finds memories related to that company's DR strategy even if those words never appeared in the original memory. Long content gets chunked into 2000-character segments with a 200-character overlap, and each segment is independently searchable.

This matters because the retrieval problem is fundamentally different from the communication problem. Communication is a routing problem: you need to know where something is and how to get it there. Retrieval is a relevance problem: you need to figure out what matters even when you don't know exactly how to ask for it.

With A2A, Agent A must know that Agent B has the answer, formulate a precise request, and hope Agent B is online to respond. If Agent B misunderstands the request or returns the wrong information or is offline, the whole chain fails. With A2D, Agent A stores what it knows in a format optimized for discovery. Agent B doesn't need to know anything about Agent A -- it just describes what it needs and semantic search surfaces the most relevant context from any agent. The retrieval problem demands handling ambiguous queries, ranking relevance across multiple sources, and synthesizing partial matches into coherent answers. These are hard problems that don't map onto the "send message and wait for reply" model of A2A.

### Organization: collections, not addresses

Memories go into specific collections based the related project. Collections will be named something like `project-a`, `customer-alpha`, `project-b`, etc. There is also a global collection that can be used, but the appropriate collection is inferred from context. If you discuss project-a or customer-alpha, then the memories land in the related collection. No routing decisions are required.

You can also keep your personal context locally stored, and not shared with any other agent that isn't local. Collections prefixed with `private-` or `local-` never leave your machine and everything else syncs to the team. This means agents that run on your system have access to all relevant data, but other agents from the broader org only have access to the data you chose to share.

### Relevance: salience, not priority queues

Every memory gets a salience score from 1.0 to 5.0. A project that has a critical bug or a customer threatening to churn scores high while a routine config value scores lower. And over time salience decays, so episodic memories (what happened in Tuesday's meeting) fade faster than semantic memories (the customer's architecture requires active-active).

Retrieving a memory makes its salience gets a small boost, which means that important context used stays prominent. Context that stops being relevant quietly fades. Nothing is ever deleted; instead low-salience memories just stop surfacing as readily as the memories with higher salience scores.

While you can curate this context if you like, it isn't needed. The system figures it out from usage patterns what is important.

### Team sharing

Up to this point we've discussed the local-first feature of YAPA's implementation of A2D. While this relates to one of the three agent-sharing use cases mentioned at the beginning (multiple local agents managed by one human on a single system), YAPA also enables sharing to a remote database for organization-wide context sharing. This is where the contrast with other tools becomes more interesting.

Every team member runs their own local ChromaDB instance and has no cloud dependency. This means YAPA always has zero latency and works offline. But every five minutes, non-private collections are synced to a shared PostgreSQL database with pgvector in the background. This is how the sync implementation works:

- **Push:** Scans local collections for documents marked `is_synced: false`. This data is uploaded to Postgres with embeddings.
- **Pull:** Fetches remote documents since last `pull_timestamp`. Any documents authored by you are ignored, and found docs are inserted locally.
- **Deduplication:** There is a cosine similarity that defaults to a 0.95 threshold. Near-duplicate memories from different people get linked via `related_ids` (not merged or discarded). Both perspectives are preserved.

That's it. There are no WebSockets, JSON-RPC, Agent Cards, circuit breakers, Ed25519 device authentication, or Hill equation affinity scoring. The entire "communication" layer is a background database sync. And it handles every scenario that the A2A approach handles:

- **Agent A learns something, Agent B needs it later** → Agent A's memory syncs to Postgres. Agent B's next query finds it.
- **Someone goes on PTO** → Their accumulated context is already in the shared database.
- **New person joins the team** → They subscribe to relevant collections and immediately have the full history.
- **Agent is offline** → Local ChromaDB works fine. Sync catches up when reconnected.
- **Two people store the same insight** → Deduplication links them. No conflicts.

## Side by side

| Dimension | Agent-to-Agent (A2A/OpenClaw) | Agent-to-Database (YAPA) |
|---|---|---|
| For context to flow | Agent A must discover, address, and message Agent B | Agent A stores knowledge. Agent B queries whenever. |
| Discovery | Agent Cards, DNS-SD, mDNS, registries | Not needed |
| Message format | Typed Parts, protobuf, JSON-RPC frames | Not needed, text + embeddings |
| Transport | HTTP, WebSocket, gRPC, SSE, stdio | Local DB read + background Postgres sync |
| If receiving agent is down | Message fails. Needs retry or queue. | Knowledge is in the database. Query it anytime. |
| If agents use different frameworks | Need protocol bridges | Doesn't matter as they query the same DB |
| Scales with team size | N agents = N² potential channels | N agents = N readers of one knowledge layer |
| Offline capability | Requires network | Full local operation. Sync when online. |
| Implementation complexity | Protocols, auth, routing, resilience | Store, embed, query, sync |

## What this looks like in practice

After a few weeks of normal use, context accumulates passively and YAPA builds a searchable knowledge base from the work you're already doing. I bet tools like this will take the place of how org's make use of wikis or other internal docs tools: rather than relying on constantly outdated wikis, anyone can get up-to-date information or details on where things are for any project the humans or agents across the org are working on from their agentic tool.

Some real prompts I use regularly:

- **"prep for the upcoming customer meeting"**: YAPA pulls stored context (contacts, open issues, past decisions). Google Calendar finds the meeting. Slack finds recent channel activity. Claude synthesizes it into a prep doc.
- **"what's the latest on customer A's big project plans?"**: finds a decision from three weeks ago plus recent Slack threads
- **"tell me about customer B's cost sensitivity"**: business context from past conversations that no one would have thought to "send" to another agent
- **"remind me what we decided about project A's architecture options"**: finds a decision I'd forgotten about entirely

## When A2A communication makes sense

I'm not arguing that agent-to-agent communication is never useful. There are real use cases:

- **Real-time inter-system collaboration** where two agents on different systems need to coordinate on simultaneous work
- **Approval chains** where a human or agent must explicitly authorize the next step
- **Cross-organizational interaction** where a shared database isn't feasible
- **Live negotiation** where agents need back-and-forth dialogue to reach a decision

But these feel like edge cases to me. For the vast majority of knowledge work -- accumulating context and sharing this as institutional memory, surviving team turnover -- A2D is way simpler. It is also more resilient and scales better.

---

*YAPA is open source under the MIT license. [GitHub →](https://github.com/vuldin/yapa)*
