export interface MarkdownTemplate {
  id: string;
  title: string;
  category: 'Engineering' | 'Product' | 'Team' | 'Academic' | 'Personal';
  desc: string;
  badge?: string;
  content: string;
}

export const MARKDOWN_TEMPLATES: MarkdownTemplate[] = [
  {
    id: 'readme',
    title: 'Project README.md',
    category: 'Engineering',
    desc: 'Production-ready GitHub project documentation with badges, installation, quickstart, and architecture overview.',
    badge: 'Popular',
    content: `# Project Name

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> A concise, high-impact summary describing the core mission and purpose of this project.

---

## ⚡ Key Highlights
- **Blazing Fast**: Optimized 60-144fps rendering with zero forced layout reflows.
- **Offline First**: Instant persistence in IndexedDB with background cloud reconciliation.
- **Developer First**: Fully typed TypeScript architecture with modular components.

---

## 🚀 Quickstart

### Prerequisites
- Node.js \`>= 20.0.0\`
- npm or pnpm

### Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/organization/project-name.git

# Navigate into project directory
cd project-name

# Install dependencies
npm install

# Start local development server
npm run dev
\`\`\`

---

## 📐 Architecture & Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 19 + Tailwind CSS | Component tree & responsive styling |
| **State** | Zustand 5 | Global state slices & reactive stores |
| **Local Cache** | Dexie.js (IndexedDB) | Zero-latency client persistence |
| **Cloud Sync** | Supabase | Multi-device synchronization |

---

## 🤝 Contributing
Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.
`
  },
  {
    id: 'rfc',
    title: 'Technical Architecture RFC.md',
    category: 'Engineering',
    desc: 'Formal Request for Comments (RFC) template covering problem space, technical design, alternatives, and rollout.',
    badge: 'Standard',
    content: `# RFC: [Title of Proposed Architecture / Feature]

- **Author(s)**: [Your Name] (@handle)
- **Status**: Draft | Under Review | Accepted | Deprecated
- **Created**: ${new Date().toISOString().split('T')[0]}
- **Target Release**: v2.6

---

## 1. Executive Summary
Provide a 2–3 paragraph high-level summary of the architectural change, the motivation, and the expected operational impact.

---

## 2. Problem Statement & Motivation
- What concrete limitation or bottleneck are we addressing?
- What happens if we do nothing?
- What are the explicit non-goals of this initiative?

> [!IMPORTANT]
> **Guiding Principle**: Prioritize zero-latency client interactions and deterministic state recovery.

---

## 3. Proposed Technical Specification

### 3.1 Data Flow Diagram
\`\`\`mermaid
graph TD
    Client[Client UI Event] --> Store[Zustand Store]
    Store --> Cache[(IndexedDB Cache)]
    Store -.->|Async Debounce| Cloud[(Supabase Cloud)]
    Cloud --> Webhook[Telemetry / Audit Log]
\`\`\`

### 3.2 Schema & Interface Contracts
\`\`\`typescript
export interface SystemTelemetryEvent {
  eventId: string;
  timestamp: number;
  payload: Record<string, unknown>;
  acknowledged: boolean;
}
\`\`\`

---

## 4. Alternative Solutions Considered

| Approach | Trade-offs | Decision Rationale |
| :--- | :--- | :--- |
| **Option A (In-Memory State)** | Fast but loses unsaved work on reload | Rejected due to persistence requirements |
| **Option B (Immediate Cloud Writes)** | High network cost & offline breakage | Rejected in favor of offline-first cache |
| **Option C (Local-First Sync Engine)** | Minimal latency, resilient to outages | **Selected Approach** |

---

## 5. Security, Observability & Rollout Plan
1. **Phase 1 (Canary)**: Deploy behind feature flag to 5% of active sessions.
2. **Phase 2 (Telemetry Review)**: Monitor latency percentiles (p95 < 16ms).
3. **Phase 3 (General Availability)**: Full rollout with migration guide.
`
  },
  {
    id: 'prd',
    title: 'Product Requirements (PRD).md',
    category: 'Product',
    desc: 'Comprehensive PRD for product managers detailing user personas, functional specs, user journeys, and success metrics.',
    content: `# Product Requirements Document (PRD)

## 📌 Document Overview
- **Feature Name**: [Feature Title]
- **Product Manager**: [Name]
- **Lead Engineer**: [Name]
- **Designer**: [Name]
- **Target Launch**: Q3 2026

---

## 🎯 Vision & Business Objective
Why does this feature exist, and how does it advance our product strategy and user retention?

### Primary Target Persona
- **Persona Name**: The Power Technical Writer
- **Core Frustration**: Context switching between heavy IDEs and slow web markdown editors.
- **Desired Outcome**: An ultra-fast, offline-first workspace with instant PDF generation.

---

## 📋 User Stories & Acceptance Criteria

### User Story 1: Fast Outline Navigation
> As a writer working on long documents, I want a live table of contents so that I can jump to any section with one click.

- [ ] **Given** a document with H1–H6 headings,
- [ ] **When** the outline drawer is opened,
- [ ] **Then** all headings render hierarchically with section counts,
- [ ] **And** clicking a heading smoothly scrolls the editor directly to that line.

---

## 📊 Key Performance Indicators (KPIs)

| Metric | Baseline | Target Goal | Measurement Source |
| :--- | :--- | :--- | :--- |
| **Daily Active Time** | 18 mins | 35 mins | Product Analytics |
| **Export Completion Rate** | 68% | > 92% | PDF Studio Telemetry |
| **Crash-Free Sessions** | 99.1% | 99.9% | Error Monitoring |

---

## 🚫 Out of Scope (V1)
- Real-time video embedding inside PDF print engine.
- Biometric hardware authentication keys.
`
  },
  {
    id: 'executive',
    title: 'Weekly Executive Summary & OKRs.md',
    category: 'Product',
    desc: 'High-level status reporting template for founders, VPs, and engineering directors with OKR progress tracking.',
    content: `# Weekly Executive Briefing — Week of ${new Date().toLocaleDateString()}

## 🚀 TL;DR / Executive Takeaway
A 3-bullet snapshot of this week's primary achievements, critical blockers, and runway status.

- **Shipped**: v2.5 Canvas Writing FX & Idempotent Cloud Sync.
- **In Flight**: Redesigned breathable editor header and expanded template suite.
- **Watch Item**: Supabase storage quota headroom before upcoming product hunt launch.

---

## 🎯 OKR Status Tracker

### Objective 1: Build the Most Fluid Markdown Experience on Web
- **KR 1.1**: Maintain 0ms typing input latency across all device tiers (Current: **100% achieved**).
- **KR 1.2**: Reach 10,000 active offline documents created (Current: **7,850 / 10,000**).
- **KR 1.3**: Reduce customer-reported PDF formatting bugs to zero (Current: **In Progress**).

---

## 📈 Metric Dashboard Snapshot

| KPI | Last Week | This Week | Delta |
| :--- | :--- | :--- | :--- |
| **Weekly Active Writers (WAU)** | 4,210 | 5,140 | **+22.0%** 🟢 |
| **Cloud Sync Success Rate** | 99.4% | 99.92% | **+0.52%** 🟢 |
| **Avg. Session Duration** | 22m 14s | 28m 40s | **+29.0%** 🟢 |

---

## ⚠️ Risks & Mitigation
> [!WARNING]
> High typing frequency on ultra-low-end devices may trigger CPU throttling if particle effects are maxed.
> **Mitigation**: Auto-engage Master Low-Power Mode when framerate dips below 45fps.

---

## 🗓️ Next Week Priorities
1. Deploy breathable 3-zone editor header to production.
2. Launch 8-template preset library in Documents page.
3. Finalize Apple-grade homepage Bento visual overhaul.
`
  },
  {
    id: 'meeting',
    title: 'Meeting Notes & Action Items.md',
    category: 'Team',
    desc: 'Structured meeting template with agenda items, decision logs, timestamped discussion, and task ownership.',
    content: `# Team Sync & Decision Log

- **Meeting Title**: [e.g., Sprint Planning / Architecture Sync]
- **Date & Time**: ${new Date().toLocaleDateString()} at 10:00 AM UTC
- **Facilitator**: [Name]
- **Attendees**: @alice, @bob, @carol, @rahul

---

## 📌 Agenda Topics
1. Review sprint commitments and blockers (10 mins).
2. Architecture discussion: Local IndexedDB Snapshot Engine (20 mins).
3. Design sign-off: Breathable 3-zone editor header (15 mins).

---

## 💡 Key Discussion Notes
- **Topic 1**: Supabase rate limits on hobby tier make frequent cloud writes inadvisable.
  - Solution: Keep revision snapshots strictly inside client Dexie IndexedDB.
- **Topic 2**: Editor header is overcrowded with 12 adjacent buttons.
  - Solution: Consolidate secondary tools into a unified "Tools" menu.

---

## ⚖️ Formal Decisions Made
- [x] **Decision 1**: All snapshot revisions will be kept local-first with zero cloud API overhead.
- [x] **Decision 2**: Keep Gemini AI Copilot marked as "Coming Soon" for a focused v2.6 milestone.

---

## ✅ Action Items & Owners

| Task | Owner | Due Date | Status |
| :--- | :--- | :--- | :--- |
| Implement \`src/data/templates.ts\` | @rahul | Tomorrow | In Progress |
| Refactor Editor header into 3 zones | @rahul | Friday | Planned |
| Update pricing tier comparison grid | @rahul | Friday | Planned |
`
  },
  {
    id: 'academic',
    title: 'Research Paper & Academic Notes.md',
    category: 'Academic',
    desc: 'Academic research format complete with abstract, KaTeX math equations, methodology, and formatted citations.',
    content: `# High-Performance Input Event Dispatching in Browser Engines

**Author**: [Your Name]  
*Department of Computer Science & Software Engineering*  
**Date**: ${new Date().toLocaleDateString()}

---

## Abstract
Modern web applications frequently experience input latency degradation during sustained typing due to forced synchronous layout recalculation and garbage collection pauses. This paper presents an evaluation of off-screen mirror singletons combined with hardware-accelerated 2D canvas particle pooling to preserve 120Hz display refresh rates.

---

## 1. Mathematical Formulation

The total frame dispatch time \(T_{\text{frame}}\) is bounded by:

$$
T_{\text{frame}} = T_{\text{input}} + T_{\text{layout}} + T_{\text{paint}} \le \frac{1000}{R_{\text{refresh}}} \text{ ms}
$$

Where \(R_{\text{refresh}} = 120\text{ Hz}\), yielding a strict budget of \(8.33\text{ ms}\) per frame.

Under traditional DOM-based particle generation:

$$
\lim_{N \to \infty} \sum_{i=1}^{N} \text{Alloc}(p_i) \implies \text{GC Spike} > 24\text{ ms}
$$

By enforcing an invariant object pool of fixed capacity \(K = 256\):

$$
\Delta \text{HeapMemory} = 0 \text{ bytes/keystroke}
$$

---

## 2. Experimental Methodology
We benchmarked keystroke event latency across three execution strategies:
1. **Unoptimized React State**: Re-rendering root DOM nodes on every \`onChange\` event.
2. **DOM Mirror Queries**: Synchronously invoking \`window.getComputedStyle()\` on temporary elements.
3. **Canvas Engine**: Persistent singleton measurement with GPU-composited 2D canvas layers.

---

## 3. Results & Observations
The canvas-based pooling strategy demonstrated a 98.4% reduction in main thread blocking duration during 100 WPM typing bursts.

---

## References
[^1]: W3C Web Performance Working Group. *Frame Timing API Specification*, 2024.  
[^2]: Google Chrome Developers. *Avoid Large, Complex Layouts and Layout Thrashing*, 2023.
`
  },
  {
    id: 'postmortem',
    title: 'Incident Post-Mortem (RCA).md',
    category: 'Engineering',
    desc: 'Engineering root cause analysis (RCA) template detailing incident timeline, root cause, impact, and preventive action items.',
    content: `# Post-Mortem: Incident #[INC-2026-08]

- **Incident Date**: ${new Date().toLocaleDateString()}
- **Severity Level**: SEV-2 (Degraded User Experience)
- **Incident Commander**: [Name]
- **Duration**: 42 minutes

---

## 🚨 Incident Summary
Between 14:10 UTC and 14:52 UTC, users attempting to save documents experienced transient synchronization delays. Local IndexedDB storage continued operating normally with 0% data loss.

---

## ⏱️ Detailed Timeline (UTC)
- **14:10**: Alert triggered: Cloud sync queue backlog exceeding threshold (> 500 items).
- **14:18**: On-call engineer investigated Supabase auth token expiry handlers.
- **14:26**: Identified an idempotent SQL policy conflict preventing profile updates.
- **14:38**: Applied idempotent migration script with \`DROP POLICY IF EXISTS\`.
- **14:48**: Cloud sync queue drained completely; telemetry returned to baseline.
- **14:52**: Incident declared fully resolved.

---

## 🔍 Root Cause Analysis (5 Whys)
1. **Why did cloud sync fail?** The API rejected updates to the \`profiles\` table.
2. **Why was it rejected?** The migration attempted to re-create an already existing policy.
3. **Why did the migration fail?** The script lacked \`DROP POLICY IF EXISTS\` guards.
4. **Why was it executed without guards?** Manual query run bypassed the migration safety linter.
5. **Why was manual query run?** Urgent hotfix required direct dashboard execution.

---

## 🛡️ Preventive Action Items

| Action Item | Type | Owner | Target Date |
| :--- | :--- | :--- | :--- |
| Enforce idempotent SQL migrations across all environments | Prevent | @rahul | Completed |
| Add client-side retry backoff on 42710 SQL errors | Mitigate | @rahul | This Sprint |
| Implement local Dexie revision fallback if remote is unavailable | Resiliency | @rahul | Completed |
`
  },
  {
    id: 'journal',
    title: 'Daily Focus Journal & Habit Tracker.md',
    category: 'Personal',
    desc: 'Mindful daily productivity journal with top 3 priorities, time-blocking log, gratitude, and evening retrospective.',
    badge: 'Daily',
    content: `# Daily Focus & Productivity Log — ${new Date().toLocaleDateString()}

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

---

## 🎯 Top 3 High-Impact Priorities (Must Win Today)
- [ ] **1. Deep Work Block**: Refactor Editor header into clean, breathable 3-zone architecture.
- [ ] **2. Product Polish**: Implement Apple-grade tactile Bento cards with living micro-UIs.
- [ ] **3. Quality Assurance**: Verify 0 TypeScript errors and test local Dexie snapshot rollbacks.

---

## ⏱️ Time-Blocking Schedule

| Time Window | Planned Activity | Outcome / Reflection |
| :--- | :--- | :--- |
| **09:00 - 11:00** | Deep Focus: Code Architecture | 2 hours uninterrupted sprint completed |
| **11:30 - 12:30** | Code Review & Planning | Reviewed PRDs and technical RFCs |
| **14:00 - 16:30** | Feature Implementation | Deployed new templates and slash commands |
| **17:00 - 17:30** | Daily Wrap-up & Retro | Prepared tomorrow's high-impact goals |

---

## 🧠 Brain Dump & Stream of Consciousness
Write down any random thoughts, ideas, or tangents here to free up mental RAM:
- Idea: Add keyboard shortcut \`Ctrl+Shift+T\` for instant template summoning.
- Note: Keep all animations hardware-composited on the GPU.

---

## 🌙 Evening Retrospective
- **What went exceptionally well today?**:
- **What caused friction or unexpected delay?**:
- **One thing I will improve tomorrow**:
`
  }
];
