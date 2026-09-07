import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  X, 
  Send, 
  CheckCircle2,
  FileEdit
} from 'lucide-react';
import { Navbar } from '../components/home/Navbar';
import { Footer } from '../components/home/Footer';

const MarkdownPreview = React.lazy(() =>
  import('../components/editor/MarkdownPreview').then((m) => ({ default: m.MarkdownPreview }))
);

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'Engineering' | 'Productivity' | 'Guides' | 'Architecture' | 'Design';
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featured?: boolean;
  content: string;
}

const ARTICLES: Article[] = [
  {
    id: 'local-first-future',
    title: 'Why Local-First Architecture with Dexie.js and Supabase is the Future of Note-Taking',
    excerpt: 'Cloud-only tools feel sluggish when connections drop. Here is how combining browser IndexedDB with PostgreSQL background sync provides instantaneous writing with bulletproof backup.',
    category: 'Architecture',
    readTime: '8 min read',
    date: 'Sep 2, 2026',
    featured: true,
    author: {
      name: 'Rahul Mehta',
      role: 'Founding Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    content: `# Why Local-First Architecture is the Future of Note-Taking

Note-taking is one of the most intimate, low-latency creative activities you do on a computer. When inspiration strikes, waiting even 400 milliseconds for a network spinner creates cognitive friction that disrupts flow state.

## The Problem with Cloud-Only Software
Most modern document editors make a round-trip network request on every keystroke:
1. Client makes network call to centralized API
2. Database writes are throttled or queued
3. If Wi-Fi drops, document locking fails

## The Local-First Pattern in MD Writer
Instead of treating local storage as an afterthought, MD Writer treats **IndexedDB via Dexie.js as the primary source of truth**:

\`\`\`typescript
// Every keystroke saves instantly to local Dexie IndexedDB
await db.documents.put({
  id: docId,
  title,
  snippet: content.slice(0, 180),
  updatedAt: Date.now()
});
\`\`\`

### Key Benefits:
- **0 ms Latency**: Typing never lags, even on high-refresh 120Hz displays.
- **100% Offline**: Open your laptop on an airplane or train and keep writing.
- **Background Cloud Sync**: When connected, changes automatically replicate to Supabase PostgreSQL without blocking user input.
`
  },
  {
    id: 'katex-math-guide',
    title: 'Mastering LaTeX Math and KaTeX in Technical Documentation',
    excerpt: 'From inline physics notations to multi-line matrix algebra, learn how to embed clean mathematical formulas effortlessly into your markdown.',
    category: 'Engineering',
    readTime: '6 min read',
    date: 'Aug 28, 2026',
    author: {
      name: 'Elena Rostova',
      role: 'Open Source Maintainer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    content: `# Mastering LaTeX Math and KaTeX in Technical Documentation

Technical writing frequently demands precision that standard ASCII characters cannot express. With KaTeX integration, MD Writer renders complex LaTeX equations instantly in the live preview.

## Inline Math
Surround equations with single dollar signs: '$E = mc^2$' or '$\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J}$'.

## Block Math
Use double dollar signs for standalone equation blocks:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Matrix Notation
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}^{-1} = \frac{1}{ad - bc} \begin{pmatrix}
d & -b \\
-c & a
\end{pmatrix}
$$
`
  },
  {
    id: 'zen-mode-flow',
    title: 'The Distraction-Free Flow State: How Zen Mode Transforms Deep Writing',
    excerpt: 'How hiding navigational chrome, toolbars, and status meters stimulates deep work and uninterrupted creative momentum.',
    category: 'Productivity',
    readTime: '5 min read',
    date: 'Aug 22, 2026',
    author: {
      name: 'David Chen',
      role: 'Technical Writer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    content: `# The Distraction-Free Flow State

Cognitive psychology research shows that visual clutter inside an application drains subconscious working memory.

## What Zen Mode Eliminates
- Unnecessary sidebar navigations
- Persistent blinking counters and status meters
- Multiple panes competing for visual dominance

## Entering the Zone
In MD Writer, switching to **Zen Mode** expands the editor into full window real estate, centers your typography into an optimal reading width (65-75 characters per line), and hides all controls until you move your mouse or press 'Esc'.
`
  },
  {
    id: 'markdown-shortcuts-cheatsheet',
    title: 'Markdown Cheat Sheet: From Tables to Task Lists and Callouts',
    excerpt: 'The complete visual reference for formatting GitHub Flavored Markdown (GFM) with speed and elegance.',
    category: 'Guides',
    readTime: '4 min read',
    date: 'Aug 15, 2026',
    author: {
      name: 'Elena Rostova',
      role: 'Open Source Maintainer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    content: `# Markdown Cheat Sheet & Shortcuts

Markdown is the lingua franca of technical communication. Here is the fast track to utilizing all GFM features.

## Task Checklists
Interactive checkboxes allow you to track todos directly inside your preview:
- [x] Create project repository
- [x] Configure Tailwind v4 custom dark variant
- [ ] Review documentation spec

## Callout Quotes
> **Important Note**
> Blockquotes provide visual emphasis for key takeaways and architectural warnings.

## Formatted Tables
| Feature | Supported | Latency |
| :--- | :--- | :--- |
| IndexedDB | Yes | < 2ms |
| Supabase | Yes | Cloud |
| KaTeX | Yes | Instant |
`
  },
  {
    id: 'senior-typography-ui',
    title: 'Senior UI/UX for Note Taking: Why Typography and Contrast Matter',
    excerpt: 'An inside look at color theory, font hierarchy, and accessibility guidelines that make text effortless to read in both Light and Dark mode.',
    category: 'Design',
    readTime: '5 min read',
    date: 'Aug 08, 2026',
    author: {
      name: 'Rahul Mehta',
      role: 'Founding Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    content: `# Senior UI/UX for Note Taking

A great writing application should feel like high-grade stationery: quiet, dependable, and aesthetically inspiring.

## Visual Hierarchy
1. **Headings**: Plus Jakarta Sans with distinct font weight hierarchy (900 -> 700 -> 600).
2. **Body**: Inter for maximum legibility at 14px-16px sizes.
3. **Monospace**: JetBrains Mono for code blocks and raw markdown syntax.

## Theme Contrast Standards
In light mode, pure '#000000' text on pure '#ffffff' causes eye strain during long writing sessions. MD Writer uses 'oklch(0.205 0 none)' on a soft paper tint for sustained comfort.
`
  },
  {
    id: 'publication-grade-pdf',
    title: 'How to Turn Markdown into Publication-Grade Print PDFs',
    excerpt: 'How our specialized print media stylesheet strips UI chrome, balances page breaks, and outputs pristine A4 documents.',
    category: 'Guides',
    readTime: '6 min read',
    date: 'Aug 01, 2026',
    author: {
      name: 'David Chen',
      role: 'Technical Writer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    content: `# Publication-Grade Print PDFs

Exporting Markdown usually results in awkward web page screenshots with cut-off lines and header bars.

## Print CSS Architecture
MD Writer implements an isolated \`@media print\` stylesheet:
- Forces pure white paper background regardless of active dark mode.
- Injects smart \`break-inside: avoid\` rules on tables, figures, and code blocks.
- Hides status bars, navigation menus, and editing toolbars.
`
  }
];

const CATEGORIES = ['All', 'Architecture', 'Engineering', 'Productivity', 'Guides', 'Design'];

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const navigate = useNavigate();

  const filteredArticles = ARTICLES.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = ARTICLES.find(art => art.featured) || ARTICLES[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput('');
      setTimeout(() => setEmailSubscribed(false), 4000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        
        {/* Header Hero Section */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-5 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>The MD Writer Journal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 dark:text-white tracking-tight mb-5 leading-tight">
            Writing, Engineering &amp;<br />Productivity Insights.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Explorations into offline-first software architecture, Markdown workflows, typography craft, and distraction-free creative tooling.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles and guides..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white shadow-2xs transition-all"
            />
          </div>
        </section>

        {/* Featured Article Card (Only when no search query and 'All' category) */}
        {!searchQuery && selectedCategory === 'All' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <div 
              onClick={() => setActiveArticle(featuredArticle)}
              className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 p-8 sm:p-12 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 px-2.5 py-1 rounded-full">
                  Featured Story
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {featuredArticle.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 dark:text-white tracking-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {featuredArticle.title}
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed mb-8">
                {featuredArticle.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredArticle.author.avatar}
                    alt={featuredArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      {featuredArticle.author.name}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {featuredArticle.date} • {featuredArticle.readTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform">
                  <span>Read full story</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Filter Pills */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-2xs font-bold'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {filteredArticles.length === 0 ? (
            <div className="p-16 text-center text-sm text-neutral-400">
              No articles found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setActiveArticle(article)}
                  className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-7 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                >
                  <div>
                    {/* Category & Time */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-lg">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-950 dark:text-white tracking-tight mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3 mb-6">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Author & Footer */}
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                      />
                      <div>
                        <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          {article.author.name}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {article.date}
                        </div>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Subscription Strip */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 p-8 sm:p-10 text-center">
            <h3 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight mb-2">
              Stay in the writing flow.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              Subscribe to get notified about new markdown guides, architecture deep dives, and editor feature updates.
            </p>

            {emailSubscribed ? (
              <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Thank you for subscribing! Check your inbox for confirmation.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      <Footer />

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-3xl max-h-[85vh] bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:px-8 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/40">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2.5 py-1 rounded-lg">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-neutral-400">
                  {activeArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const snippet = activeArticle.content;
                    const encoded = encodeURIComponent(snippet);
                    setActiveArticle(null);
                    navigate(`/editor?content=${encoded}`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open this article in the editor"
                >
                  <FileEdit className="w-3.5 h-3.5 text-blue-500" />
                  <span className="hidden sm:inline">Open in Editor</span>
                </button>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                <img
                  src={activeArticle.author.avatar}
                  alt={activeArticle.author.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                />
                <div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white">
                    {activeArticle.author.name}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {activeArticle.author.role} • {activeArticle.date}
                  </div>
                </div>
              </div>

              {/* Rendered Markdown Article */}
              <div className="prose dark:prose-invert max-w-none">
                <React.Suspense fallback={
                  <div className="space-y-4 py-4 animate-pulse">
                    <div className="h-8 bg-neutral-200/50 dark:bg-neutral-800/60 rounded-lg w-2/3" />
                    <div className="h-4 bg-neutral-200/40 dark:bg-neutral-800/50 rounded w-full" />
                    <div className="h-4 bg-neutral-200/40 dark:bg-neutral-800/50 rounded w-5/6" />
                    <div className="h-4 bg-neutral-200/40 dark:bg-neutral-800/50 rounded w-4/5" />
                    <div className="h-28 bg-neutral-200/30 dark:bg-neutral-800/40 rounded-xl mt-6" />
                  </div>
                }>
                  <MarkdownPreview content={activeArticle.content} />
                </React.Suspense>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>Published by MD Writer Journal. Free to read and share.</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="font-semibold text-neutral-800 dark:text-neutral-200 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
