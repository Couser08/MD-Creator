import { db, saveDocument } from './index';

export const INITIAL_SEED_DOCUMENTS = [
  {
    id: 'doc-getting-started',
    title: 'Getting Started.md',
    tags: ['Guide', 'Welcome'],
    content: `# Your Ideas, Better

Write **faster**, stay organized, and create beautiful documents with Markdown.

## Why MD Writer?
- Clean interface
- Real-time preview
- Powerful tools
- Export in multiple formats

> Good writing builds a better you.

### Quick Shortcuts
- Type \`/\` anywhere to open the action menu
- Use \`**bold**\` for strong text and \`*italic*\` for emphasis
- Create checklists with \`- [ ] todo\`
`
  },
  {
    id: 'doc-technical-spec',
    title: 'App Architecture & Roadmap.md',
    tags: ['Architecture', 'Tech'],
    content: `# MD Writer Architecture Specification

This document details the multi-tiered client-side architecture of MD Writer.

## Core Pillars
1. **IndexedDB Lazy Cache**: Only metadata and snippets are indexed for instant listing.
2. **Dual-Pane Rendering**: Fast synchronous parsing with zero keystroke lag.
3. **Multi-Format Export**: Client-side conversion to pristine PDF, MD, and HTML.

### Planned Sprints
- Sprint 1: Base & Home Workspace
- Sprint 2: Split Editor & Slash Palette
- Sprint 3: Export Engine
`
  },
  {
    id: 'doc-meeting-notes',
    title: 'Design System Guidelines.md',
    tags: ['Design', 'Tokens'],
    content: `# Design System & Style Tokens

Minimalist slate aesthetic inspired by Raycast and Linear.

## Typography
- Headings: Plus Jakarta Sans / Inter Display
- Body: Inter Sans
- Code & Monospace: JetBrains Mono

## Surface Colors
- Light: #FFFFFF, Neutral-50 (#F9FAFB), Neutral-100 (#F3F4F6)
- Dark: #0A0A0A, Neutral-900 (#171717), Neutral-800 (#262626)
`
  }
];

export async function seedInitialDocuments(): Promise<void> {
  const count = await db.documents.count();
  if (count === 0) {
    for (const doc of INITIAL_SEED_DOCUMENTS) {
      await saveDocument(doc.id, doc.title, doc.content, doc.tags);
    }
  }
}
