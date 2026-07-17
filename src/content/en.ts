import type { LandingCopy } from "./types";

export const en = {
  meta: {
    title: "memo — Local-first memory for AI agents",
    description:
      "Persistent semantic memory for every AI coding agent. Local, private, searchable, and stored as Markdown.",
  },
  nav: {
    how: "How it works",
    features: "Features",
    install: "Install",
    github: "GitHub",
  },
  hero: {
    eyebrow: "Local-first memory for AI",
    title: "Your AI should remember.",
    body: "Persistent semantic memory for every agent. Private, local, and yours.",
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
