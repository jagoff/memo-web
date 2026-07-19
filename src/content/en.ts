import type { LandingCopy } from "./types";

export const en = {
  meta: {
    title: "Persistent Memory for AI Agents, Local & Private | memo",
    description:
      "Give Claude Code, Codex, Cursor, and any MCP agent persistent semantic memory. memo runs locally, keeps data private, and stores knowledge as Markdown.",
  },
  nav: {
    how: "How it works",
    features: "Features",
    faq: "FAQ",
    install: "Install",
    github: "GitHub",
  },
  hero: {
    eyebrow: "Persistent memory for AI agents",
    title: "Your AI should remember.",
    body: "Give Claude Code, Codex, Cursor, and every MCP agent persistent semantic memory. Private, local, searchable, and stored as readable Markdown.",
    install: "Install memo",
    github: "View on GitHub",
  },
  problem: {
    eyebrow: "Sessions end. Knowledge should not.",
    title: "Stop starting over.",
    body: "memo carries durable decisions, facts, and preferences into the next session before your agent answers.",
    lost: "A fresh agent reconstructs yesterday from scratch.",
    kept: "A memo-aware agent starts with what already matters.",
  },
  loop: {
    eyebrow: "One local loop",
    title: "Save once. Recall everywhere.",
    body: "Durable knowledge becomes readable Markdown, a hybrid index, and precise context for any MCP-aware agent.",
    steps: [
      "Capture durable knowledge",
      "Index Markdown locally",
      "Recall it in the next session",
    ],
  },
  featuresHeading: {
    eyebrow: "More than a vector store",
    title: "Memory with judgment.",
    body: "memo knows when knowledge changed, where it came from, and which agent needs it.",
  },
  features: [
    {
      id: "time-machine",
      title: "Time-machine",
      body: "Rewind the corpus and ask what was known on any date.",
    },
    {
      id: "contradictions",
      title: "Contradiction radar",
      body: "Find stale decisions and resolve conflicts without erasing history.",
    },
    {
      id: "capture",
      title: "Auto-capture",
      body: "Extract durable insights from real work without constant remember commands.",
    },
    {
      id: "cross-agent",
      title: "Cross-agent continuity",
      body: "Claude Code, Codex, Cursor, Devin, and other MCP clients share one memory.",
    },
  ],
  evidence: {
    eyebrow: "Smaller context. Stronger continuity.",
    title: "Useful memory, measurable.",
    body: "A compact MCP surface and tight recall budget reduce repeated model work while public project activity stays verifiable.",
    illustration: "Conceptual memory graph",
    updated: "Public data updated",
  },
  install: {
    eyebrow: "Runs on your machine",
    title: "One command. No cloud account.",
    body: "Use MLX on Apple Silicon or the CPU backend on Linux. Your prompts and memories stay local.",
    macos: "macOS / Apple Silicon",
    linux: "Linux / CPU",
    copy: "Copy command",
    copied: "Copied",
    copyFailed: "Copy failed. Select the command manually.",
    docs: "Read full installation guide",
  },
  comparison: {
    eyebrow: "Why memo",
    title: "Local is not a feature. It is the foundation.",
    body: "A compact comparison; the repository contains the sourced capability matrix.",
    headers: ["Capability", "memo", "Cloud memory", "Vector store"],
    rows: [
      {
        capability: "Local by default",
        memo: "Yes",
        cloud: "No",
        vector: "Sometimes",
      },
      { capability: "Time travel", memo: "Yes", cloud: "Rare", vector: "No" },
      {
        capability: "Contradiction handling",
        memo: "Yes",
        cloud: "Partial",
        vector: "No",
      },
      {
        capability: "Cross-agent recall",
        memo: "Yes",
        cloud: "Partial",
        vector: "Custom",
      },
    ],
    full: "See full sourced comparison",
  },
  faq: {
    eyebrow: "AI agent memory FAQ",
    title: "Persistent AI memory, explained.",
    body: "Straight answers about local storage, MCP compatibility, privacy, retrieval, and supported platforms.",
    items: [
      {
        question: "What is memory for AI agents?",
        answer:
          "AI agent memory preserves useful knowledge beyond one chat or coding session. memo is an open-source MCP server that saves durable decisions, facts, and preferences so future sessions can reuse them.",
      },
      {
        question: "Which AI coding agents work with memo?",
        answer:
          "memo works with MCP-aware clients including Claude Code, Codex, Cursor, Cline, Devin, OpenCode, and Continue. They can all use the same local memory store.",
      },
      {
        question: "Is memo private and fully local?",
        answer:
          "Core save, search, recall, and indexing workflows run on your machine without a cloud account or API keys. Explicit actions such as installation, model downloads, updates, or a sync remote can use the network.",
      },
      {
        question: "How does memo store and retrieve knowledge?",
        answer:
          "Plain Markdown files are the source of truth. memo builds a local, rebuildable index and combines semantic and keyword search with reranking to return focused context.",
      },
      {
        question: "Does memory carry across agents and sessions?",
        answer:
          "Yes. Compatible agents connect through MCP and recall from one local knowledge base, so a decision saved in Claude Code can be available later in Codex, Cursor, or another client.",
      },
      {
        question: "Can I run memo on macOS and Linux?",
        answer:
          "Yes. memo uses MLX on Apple Silicon and provides a CPU sentence-transformers backend for Linux, Ubuntu, and Intel Macs. Both installation options are shown above.",
      },
    ],
  },
  final: {
    eyebrow: "Your agents already learn",
    title: "Let them remember.",
    body: "Install memo once and give every session a durable starting point.",
    install: "Install memo",
    github: "Star on GitHub",
  },
  footer: {
    source: "Source",
    pypi: "PyPI",
    license: "MIT License",
    by: "Built by Fernando Ferrari",
  },
} satisfies LandingCopy;
