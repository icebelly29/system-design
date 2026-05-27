import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  Search, Sun, Moon, Menu, X, ChevronRight, ChevronDown, 
  Check, ArrowLeft, ArrowRight, BookOpen, Clock, ExternalLink, 
  Award, CheckCircle2, ChevronUp, Sparkles, BookOpenCheck,
  Code2, Database, Network, Compass, HelpCircle, Copy, Share2,
  Printer, Download
} from 'lucide-react';

// 1. Chapters & Topics Metadata definition
const chaptersData = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Compass,
    topics: [
      { id: 'what-is-system-design', title: 'What is system design?', header: 'What is system design?' }
    ]
  },
  {
    id: 'chapter-i',
    title: 'Chapter I: Fundamentals',
    icon: Network,
    topics: [
      { id: 'ip', title: 'IP Address & Versions', header: 'IP' },
      { id: 'osi-model', title: 'OSI Model Layers', header: 'OSI Model' },
      { id: 'tcp-udp', title: 'TCP and UDP Protocols', header: 'TCP and UDP' },
      { id: 'dns', title: 'Domain Name System (DNS)', header: 'Domain Name System (DNS)' },
      { id: 'load-balancing', title: 'Load Balancing', header: 'Load Balancing' },
      { id: 'clustering', title: 'Clustering & Clusters', header: 'Clustering' },
      { id: 'caching', title: 'Caching & Eviction', header: 'Caching' },
      { id: 'cdn', title: 'Content Delivery Network (CDN)', header: 'Content Delivery Network (CDN)' },
      { id: 'proxy', title: 'Forward & Reverse Proxies', header: 'Proxy' },
      { id: 'availability', title: 'System Availability & 9s', header: 'Availability' },
      { id: 'scalability', title: 'Scalability & Performance', header: 'Scalability' },
      { id: 'storage', title: 'Storage & Hardware', header: 'Storage' }
    ]
  },
  {
    id: 'chapter-ii',
    title: 'Chapter II: Databases',
    icon: Database,
    topics: [
      { id: 'db-dbms', title: 'Databases & DBMS', header: 'Databases and DBMS' },
      { id: 'sql-db', title: 'SQL Databases', header: 'SQL databases' },
      { id: 'nosql-db', title: 'NoSQL Databases', header: 'NoSQL databases' },
      { id: 'sql-vs-nosql', title: 'SQL vs NoSQL Databases', header: 'SQL vs NoSQL databases' },
      { id: 'db-replication', title: 'Database Replication', header: 'Database Replication' },
      { id: 'indexes', title: 'Database Indexes', header: 'Indexes' },
      { id: 'norm-denorm', title: 'Normalization & Denorm', header: 'Normalization and Denormalization' },
      { id: 'acid-base', title: 'ACID and BASE Models', header: 'ACID and BASE consistency models' },
      { id: 'cap-theorem', title: 'CAP Theorem', header: 'CAP theorem' },
      { id: 'pacelc-theorem', title: 'PACELC Theorem', header: 'PACELC Theorem' },
      { id: 'transactions', title: 'Transactions & Concurrency', header: 'Transactions' },
      { id: 'dist-transactions', title: 'Distributed Transactions', header: 'Distributed Transactions' },
      { id: 'sharding', title: 'Database Sharding', header: 'Sharding' },
      { id: 'consistent-hashing', title: 'Consistent Hashing', header: 'Consistent Hashing' },
      { id: 'db-federation', title: 'Database Federation', header: 'Database Federation' }
    ]
  },
  {
    id: 'chapter-iii',
    title: 'Chapter III: Architecture',
    icon: Code2,
    topics: [
      { id: 'n-tier-arch', title: 'N-Tier Architecture', header: 'N-tier architecture' },
      { id: 'message-brokers', title: 'Message Brokers', header: 'Message Brokers' },
      { id: 'message-queues', title: 'Message Queues', header: 'Message Queues' },
      { id: 'pub-sub', title: 'Publish-Subscribe Pattern', header: 'Publish-Subscribe' },
      { id: 'esb', title: 'Enterprise Service Bus (ESB)', header: 'Enterprise Service Bus (ESB)' },
      { id: 'monoliths-microservices', title: 'Monoliths vs Microservices', header: 'Monoliths and Microservices' },
      { id: 'eda', title: 'Event-Driven Architecture', header: 'Event-Driven Architecture (EDA)' },
      { id: 'event-sourcing', title: 'Event Sourcing Pattern', header: 'Event Sourcing' },
      { id: 'cqrs', title: 'CQRS Design Pattern', header: 'Command and Query Responsibility Segregation (CQRS)' },
      { id: 'api-gateway', title: 'API Gateway Pattern', header: 'API Gateway' },
      { id: 'protocols', title: 'REST, GraphQL, and gRPC', header: 'REST, GraphQL, gRPC' },
      { id: 'polling-sockets-sse', title: 'Long Polling, WebSockets, SSE', header: 'Long polling, WebSockets, Server-Sent Events (SSE)' }
    ]
  },
  {
    id: 'chapter-iv',
    title: 'Chapter IV: Advanced Concepts',
    icon: Award,
    topics: [
      { id: 'geohashing-quadtrees', title: 'Geohashing and Quadtrees', header: 'Geohashing and Quadtrees' },
      { id: 'circuit-breaker', title: 'Circuit Breaker Pattern', header: 'Circuit breaker' },
      { id: 'rate-limiting', title: 'Rate Limiting Algorithms', header: 'Rate Limiting' },
      { id: 'service-discovery', title: 'Service Discovery', header: 'Service Discovery' },
      { id: 'sla-slo-sli', title: 'SLA, SLO, and SLI', header: 'SLA, SLO, SLI' },
      { id: 'disaster-recovery', title: 'Disaster Recovery Systems', header: 'Disaster recovery' },
      { id: 'vm-containers', title: 'VMs and Containers', header: 'Virtual Machines (VMs) and Containers' },
      { id: 'oauth-oidc', title: 'OAuth 2.0 and OIDC Security', header: 'OAuth 2.0 and OpenID Connect (OIDC)' },
      { id: 'sso', title: 'Single Sign-On (SSO)', header: 'Single Sign-On (SSO)' },
      { id: 'ssl-tls-mtls', title: 'SSL, TLS, and mTLS', header: 'SSL, TLS, mTLS' }
    ]
  },
  {
    id: 'chapter-v',
    title: 'Chapter V: System Case Studies',
    icon: Sparkles,
    topics: [
      { id: 'interviews', title: 'System Design Interviews', header: 'System Design Interviews' },
      { id: 'url-shortener', title: 'Design: URL Shortener', header: 'URL Shortener' },
      { id: 'whatsapp', title: 'Design: WhatsApp Messenger', header: 'WhatsApp' },
      { id: 'twitter', title: 'Design: Twitter Feed', header: 'Twitter' },
      { id: 'netflix', title: 'Design: Netflix Video Stream', header: 'Netflix' },
      { id: 'uber', title: 'Design: Uber Ride Sharing', header: 'Uber' }
    ]
  },
  {
    id: 'appendix',
    title: 'Appendix',
    icon: HelpCircle,
    topics: [
      { id: 'next-steps', title: 'Next Steps', header: 'Next Steps' },
      { id: 'references', title: 'References', header: 'References' }
    ]
  }
];

// Helper to compute reading time (words / 200 wpm)
const computeReadTime = (markdownText) => {
  if (!markdownText) return 3;
  const words = markdownText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Beautiful Interactive Code block Component with copying animation
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm bg-slate-900 text-zinc-100 group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-slate-950/80 text-xs font-mono select-none">
        <span className="text-zinc-400 font-medium tracking-wide uppercase">{language || 'code'}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-zinc-50 transition-all cursor-pointer font-sans"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Container */}
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-zinc-950 select-text">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function App() {
  // --- Core States ---
  const [markdownSections, setMarkdownSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTopicId, setActiveTopicId] = useState('what-is-system-design');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // PDF Export-related states
  const [isPrintView, setIsPrintView] = useState(false);
  const [printReady, setPrintReady] = useState(false);
  
  // Chapter collapse state
  const [collapsedChapters, setCollapsedChapters] = useState({
    'getting-started': false,
    'chapter-i': false,
    'chapter-ii': true,
    'chapter-iii': true,
    'chapter-iv': true,
    'chapter-v': true,
    'appendix': true,
  });

  // Dark/Light Mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Completion Progress (stored in localStorage)
  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('completed-system-design-topics');
    return saved ? JSON.parse(saved) : {};
  });

  const contentAreaRef = useRef(null);

  // --- Theme Syncing ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme-mode', 'light');
    }
  }, [isDarkMode]);

  // --- Fetch and Parse Monolithic README.md ---
  useEffect(() => {
    fetch('/README.md')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load system-design course content.');
        }
        return res.text();
      })
      .then((rawText) => {
        const parsed = parseMarkdown(rawText);
        setMarkdownSections(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- Markdown Parsing Logic (Ignores comment headers inside code blocks) ---
  const parseMarkdown = (rawText) => {
    const lines = rawText.split('\n');
    const sections = {};
    let currentHeader = '';
    let currentContent = [];
    let inCodeBlock = false;

    for (let line of lines) {
      // Toggle code blocks state to avoid false header parsing
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }

      // Check if we hit a level-1 heading outside a code block
      if (!inCodeBlock && line.startsWith('# ')) {
        // Save previous section content before switching
        if (currentHeader) {
          sections[currentHeader] = currentContent.join('\n');
        }
        // Start a new section
        currentHeader = line.substring(2).trim();
        currentContent = [];
      } else {
        if (currentHeader) {
          currentContent.push(line);
        }
      }
    }

    // Save final section
    if (currentHeader) {
      sections[currentHeader] = currentContent.join('\n');
    }

    return sections;
  };

  // --- Flattened list of all topics for navigation ---
  const allTopicsFlat = useMemo(() => {
    return chaptersData.flatMap(chapter => 
      chapter.topics.map(topic => ({
        ...topic,
        chapterId: chapter.id,
        chapterTitle: chapter.title
      }))
    );
  }, []);

  // Current Active Topic and Content
  const activeTopic = useMemo(() => {
    return allTopicsFlat.find(t => t.id === activeTopicId) || allTopicsFlat[0];
  }, [activeTopicId, allTopicsFlat]);

  const activeTopicContent = useMemo(() => {
    if (!activeTopic) return '';
    const rawContent = markdownSections[activeTopic.header];
    if (!rawContent) return '';
    
    // Clean up availability LaTeX notation to a nice CSS-rendered format if it's there
    return rawContent.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (match, formula) => {
      return `<div class="math-block">${formula.replace(/\\frac{([\s\S]*?)}{([\s\S]*?)}/g, '$1 / $2')}</div>`;
    });
  }, [activeTopic, markdownSections]);

  // --- Right Table of Contents (TOC) for active topic ---
  const activeTopicTOC = useMemo(() => {
    if (!activeTopicContent) return [];
    const lines = activeTopicContent.split('\n');
    const toc = [];
    let inCodeBlock = false;
    
    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }
      if (!inCodeBlock) {
        if (line.startsWith('## ')) {
          const title = line.substring(3).trim();
          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          toc.push({ level: 2, title, slug });
        } else if (line.startsWith('### ')) {
          const title = line.substring(4).trim();
          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          toc.push({ level: 3, title, slug });
        }
      }
    }
    return toc;
  }, [activeTopicContent]);

  // Next & Previous topic helpers
  const currentIndex = allTopicsFlat.findIndex(t => t.id === activeTopic?.id);
  const previousTopic = currentIndex > 0 ? allTopicsFlat[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopicsFlat.length - 1 ? allTopicsFlat[currentIndex + 1] : null;

  // --- Scroll to top on active topic change ---
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTopicId]);

  // --- Toggle Chapter Collapse ---
  const toggleChapter = (chapterId) => {
    setCollapsedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // Auto-expand current active topic's chapter
  useEffect(() => {
    if (activeTopic) {
      setCollapsedChapters(prev => ({
        ...prev,
        [activeTopic.chapterId]: false
      }));
    }
  }, [activeTopic]);

  // --- Progress Tracking Math ---
  const totalTopicsCount = allTopicsFlat.length;
  const completedCount = useMemo(() => {
    return Object.values(completedTopics).filter(Boolean).length;
  }, [completedTopics]);
  
  const completionPercentage = useMemo(() => {
    if (totalTopicsCount === 0) return 0;
    return Math.round((completedCount / totalTopicsCount) * 100);
  }, [completedCount, totalTopicsCount]);

  const toggleTopicCompletion = (topicId, e) => {
    if (e) e.stopPropagation();
    const updated = {
      ...completedTopics,
      [topicId]: !completedTopics[topicId]
    };
    setCompletedTopics(updated);
    localStorage.setItem('completed-system-design-topics', JSON.stringify(updated));
  };

  // --- Multi-dimensional Search Logic ---
  // Filters through topic title, chapter name, or markdown content body!
  const filteredChapters = useMemo(() => {
    if (!searchQuery) return chaptersData;

    const query = searchQuery.toLowerCase();
    return chaptersData.map(chapter => {
      const matchingTopics = chapter.topics.filter(topic => {
        const titleMatch = topic.title.toLowerCase().includes(query);
        const headerMatch = topic.header.toLowerCase().includes(query);
        
        // Search content match
        const content = markdownSections[topic.header] || '';
        const contentMatch = content.toLowerCase().includes(query);
        
        return titleMatch || headerMatch || contentMatch;
      });

      return {
        ...chapter,
        topics: matchingTopics
      };
    }).filter(chapter => chapter.topics.length > 0);
  }, [searchQuery, markdownSections]);

  // --- Keyboard Shortcuts helper ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search on Ctrl+K or /
      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        const searchInput = document.getElementById('toc-search-bar');
        if (searchInput && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- PDF Print Trigger Hook ---
  // Pre-caches and loads ALL images before prompting browser system print!
  useEffect(() => {
    if (isPrintView) {
      const handleAfterPrint = () => {
        setIsPrintView(false);
        setPrintReady(false);
      };
      window.addEventListener('afterprint', handleAfterPrint);
      
      // Let React initial paint render the continuous nodes, then audit images
      const timer = setTimeout(() => {
        const images = document.querySelectorAll('.print-container img');
        
        if (images.length === 0) {
          setPrintReady(true);
          return;
        }

        const promises = Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // Resolve errors so it doesn't freeze
          });
        });

        Promise.all(promises).then(() => {
          // Extra layout painting delay
          setTimeout(() => {
            setPrintReady(true);
          }, 300);
        });
      }, 500);

      return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
        clearTimeout(timer);
      };
    }
  }, [isPrintView]);

  // Trigger print dialog as soon as printReady becomes true
  useEffect(() => {
    if (printReady) {
      window.print();
    }
  }, [printReady]);

  // --- Custom Markdown Render Components ---
  const markdownComponents = useMemo(() => ({
    h1: ({ children }) => (
      <h1 className="text-3xl font-extrabold tracking-tight mt-2 mb-6 bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent border-b border-slate-200 dark:border-zinc-800 pb-3">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const text = String(children || '');
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h2 id={slug} className="text-2xl font-bold mt-10 mb-4 border-b border-slate-100 dark:border-zinc-900 pb-2 text-slate-800 dark:text-zinc-100 flex items-center group scroll-mt-20">
          {children}
          <a href={`#${slug}`} className="ml-2 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-normal print:hidden">#</a>
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = String(children || '');
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return (
        <h3 id={slug} className="text-xl font-semibold mt-8 mb-3 text-slate-800 dark:text-zinc-200 flex items-center group scroll-mt-20">
          {children}
          <a href={`#${slug}`} className="ml-2 text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-normal print:hidden">#</a>
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="text-slate-600 dark:text-zinc-300 leading-relaxed my-4 text-[15px] md:text-base font-normal">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 my-4 space-y-2 text-slate-600 dark:text-zinc-300 text-[15px] md:text-base">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-600 dark:text-zinc-300 text-[15px] md:text-base">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    a: ({ href, children }) => {
      const isInternal = href.startsWith('#');
      return (
        <a 
          href={href}
          target={isInternal ? '_self' : '_blank'}
          rel={isInternal ? '' : 'noopener noreferrer'}
          className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
        >
          {children}
          {!isInternal && <ExternalLink className="w-3 h-3 inline-block print:hidden" />}
        </a>
      );
    },
    img: ({ src, alt }) => (
      <div className="flex flex-col items-center my-8 bg-slate-100/40 dark:bg-zinc-900/30 p-4 md:p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/40 shadow-sm transition-all duration-300 hover:shadow-md max-w-full overflow-hidden break-inside-avoid">
        <img 
          src={src} 
          alt={alt || 'System Design Diagram'} 
          className="max-h-[460px] object-contain rounded-lg shadow-sm hover:scale-[1.01] transition-transform duration-300"
          loading="eager" 
        />
        {alt && (
          <span className="text-xs text-slate-400 dark:text-zinc-500 mt-4 font-mono font-medium tracking-wider uppercase text-center">
            {alt}
          </span>
        )}
      </div>
    ),
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');
      
      return inline ? (
        <code className="bg-slate-100 dark:bg-zinc-800/80 text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      ) : (
        <CodeBlock code={codeString} language={language} />
      );
    }
  }), []);

  // --- Render 1: DYNAMIC PDF CONTINUOUS BOOK VIEW ---
  if (isPrintView) {
    return (
      <div className="min-h-screen bg-white">
        
        {/* Compilation HUD Loader Overlay (Excluded from print output) */}
        {!printReady && (
          <div className="fixed inset-0 z-50 bg-slate-900 text-zinc-100 flex flex-col items-center justify-center p-8 select-none print-exclude">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-sky-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Printer className="w-8 h-8 text-sky-400 animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Compiling System Design Handbook</h2>
            <p className="text-sm text-slate-400 text-center max-w-sm leading-relaxed">
              Fetching illustrations and caching layouts. The print dialog will open automatically when all diagrams are fully pre-loaded...
            </p>
            <div className="mt-8 flex items-center gap-2 px-3 py-1 rounded bg-slate-800 text-[10px] font-bold text-sky-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fetching CDN Assets</span>
            </div>
          </div>
        )}

        {/* Printable continuous content wrapper */}
        <div className="print-container bg-white text-black p-12 max-w-[800px] mx-auto prose">
          
          {/* Book Cover Page */}
          <div className="text-center py-20 flex flex-col justify-center min-h-[85vh] print-page-break">
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              System Design Masterclass
            </h1>
            <p className="text-xl font-medium text-slate-500 tracking-wide uppercase mt-2">
              A Comprehensive Guide to Scalable, High-Availability Systems
            </p>
            <div className="w-24 h-1.5 bg-sky-500 mx-auto my-8 rounded-full"></div>
            <p className="text-base text-slate-700 font-mono mt-10">
              Authored by Karan Pratap Singh
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Generated dynamically as a high-fidelity PDF handbook from markdown.
            </p>
          </div>

          {/* Table of Contents Page */}
          <div className="py-12 print-page-break">
            <h2 className="text-3xl font-bold mb-8 border-b pb-3 text-slate-900">Table of Contents</h2>
            <div className="space-y-6">
              {chaptersData.map((chapter) => (
                <div key={chapter.id} className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">{chapter.title}</h3>
                  <ul className="list-none pl-4 space-y-1 text-sm text-slate-600 font-medium">
                    {chapter.topics.map((topic) => (
                      <li key={topic.id} className="flex justify-between border-b border-dotted border-slate-200 pb-0.5">
                        <span>{topic.title}</span>
                        <span className="text-xs text-slate-400">Lesson</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Continuous rendering of all chapters */}
          {allTopicsFlat.map((topic) => {
            const content = markdownSections[topic.header] || '';
            return (
              <div key={topic.id} className="print-page-break py-8">
                <div className="mb-6">
                  <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest block mb-1">
                    {topic.chapterTitle}
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 border-b border-slate-200 pb-2 leading-tight">
                    {topic.header}
                  </h2>
                </div>
                
                {content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={markdownComponents}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-slate-400 italic text-sm">Loading topic text content...</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Render 2: STANDARD LMS INTERACTIVE VIEW ---
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-500">
      
      {/* 1. TOP HEADER BAR (Glassmorphism layout) */}
      <header className="sticky top-0 z-40 w-full glass-nav flex items-center justify-between px-4 lg:px-8 py-3.5 h-[64px]">
        {/* Left Brand Brand Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2 select-none group cursor-pointer" onClick={() => setActiveTopicId('what-is-system-design')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent leading-none">
                System Design
              </span>
              <span className="text-[10px] font-extrabold text-sky-500 dark:text-sky-400 uppercase tracking-widest leading-none mt-0.5">
                Masterclass
              </span>
            </div>
          </div>
        </div>

        {/* Center search bar */}
        <div className="hidden md:flex items-center relative w-96 max-w-lg">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-zinc-500" />
          <input 
            type="text" 
            id="toc-search-bar"
            placeholder="Search concepts... (Press '/' to focus)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs md:text-sm bg-slate-100 hover:bg-slate-200/60 focus:bg-white dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:focus:bg-zinc-900/60 border border-transparent focus:border-slate-300 dark:focus:border-zinc-800 text-slate-700 dark:text-zinc-300 placeholder-slate-400 dark:placeholder-zinc-500 rounded-lg outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right buttons (Theme, Progress circle) */}
        <div className="flex items-center gap-4">
          
          {/* Progress Circular Gauge */}
          <div className="flex items-center gap-2" title={`${completionPercentage}% Completed`}>
            <div className="relative w-8 h-8 flex items-center justify-center select-none">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="16" cy="16" r="13" 
                  className="stroke-slate-200 dark:stroke-zinc-800"
                  strokeWidth="2.5" fill="transparent" 
                />
                <circle 
                  cx="16" cy="16" r="13" 
                  className="stroke-sky-500 transition-all duration-500"
                  strokeWidth="2.5" fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 13}`}
                  strokeDashoffset={`${2 * Math.PI * 13 * (1 - completionPercentage / 100)}`}
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-slate-600 dark:text-zinc-400">
                {completionPercentage}%
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Your Progress</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                {completedCount}/{totalTopicsCount} Completed
              </span>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-zinc-800" />

          {/* Theme Toggle Button */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </header>

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden glass-panel px-4 py-2 w-full flex items-center sticky top-[64px] z-30">
        <Search className="w-4 h-4 text-slate-400 absolute left-7" />
        <input 
          type="text" 
          placeholder="Search course topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-zinc-900 border border-transparent focus:border-slate-300 dark:focus:border-zinc-800 text-slate-700 dark:text-zinc-300 placeholder-slate-400 rounded-lg outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-7">
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-zinc-950">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-sky-200 dark:border-sky-950"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-sky-500 animate-spin"></div>
          </div>
          <h2 className="text-lg font-bold text-slate-700 dark:text-zinc-300">Parsing course structures...</h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Generating textbook index and layout</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-zinc-950">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <X className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Oops, something went wrong</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-md">{error}</p>
        </div>
      ) : (
        
        // --- 2. MAIN LAYOUT SHELL ---
        <div className="flex-1 flex relative">
          
          {/* A. LEFT SIDEBAR: Persistent & Drawer for Mobile */}
          <aside className={`
            fixed lg:sticky top-[64px] lg:top-[64px] bottom-0 left-0 z-35
            w-[290px] h-[calc(100vh-64px)] 
            border-r border-slate-200/60 dark:border-zinc-900
            bg-slate-50 dark:bg-zinc-950/95
            transition-transform duration-300 ease-out transform
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto select-none
          `}>
            
            {/* Navigation Outline Header */}
            <div className="p-4 border-b border-slate-200/50 dark:border-zinc-900 bg-slate-100/30 dark:bg-zinc-900/10 space-y-3">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpenCheck className="w-3.5 h-3.5 text-sky-500" />
                  <span>Course Syllabus</span>
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Click checkboxes to mark concept completed.
                </p>
              </div>

              {/* Download PDF Book Button */}
              <button
                onClick={() => setIsPrintView(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
                title="Download full textbook as a beautiful PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Download as PDF Book</span>
              </button>
            </div>

            {/* Chapters Navigation List */}
            <nav className="p-3 space-y-3 pb-8">
              {filteredChapters.map((chapter) => {
                const ChapterIcon = chapter.icon || HelpCircle;
                const isCollapsed = collapsedChapters[chapter.id];
                const activeTopicInChapter = chapter.topics.some(t => t.id === activeTopicId);

                // Compute completion count for this chapter
                const chapterCompletedCount = chapter.topics.filter(t => completedTopics[t.id]).length;
                const chapterTotalCount = chapter.topics.length;
                const isChapterDone = chapterCompletedCount === chapterTotalCount && chapterTotalCount > 0;

                return (
                  <div key={chapter.id} className="rounded-xl overflow-hidden border border-slate-100/50 dark:border-zinc-900/40 bg-white/40 dark:bg-zinc-900/10">
                    
                    {/* Chapter Header Toggle */}
                    <button 
                      onClick={() => toggleChapter(chapter.id)}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-3 text-left font-medium rounded-lg
                        transition-all duration-200 cursor-pointer group
                        ${activeTopicInChapter 
                          ? 'bg-sky-500/5 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' 
                          : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-900/50'}
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`
                          w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors
                          ${isChapterDone 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : activeTopicInChapter 
                              ? 'bg-sky-500/10 text-sky-500' 
                              : 'bg-slate-100 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500'}
                        `}>
                          {isChapterDone ? <Check className="w-3.5 h-3.5" /> : <ChapterIcon className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate leading-tight group-hover:text-sky-500 transition-colors">
                            {chapter.title}
                          </span>
                          <span className="text-[9px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
                            {chapterCompletedCount}/{chapterTotalCount} Lessons Done
                          </span>
                        </div>
                      </div>
                      
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Chapter Topic Items */}
                    {!isCollapsed && (
                      <div className="mt-1 border-t border-slate-100/50 dark:border-zinc-900/30 bg-slate-50/50 dark:bg-zinc-950/20 py-1.5 px-1 space-y-0.5">
                        {chapter.topics.map((topic) => {
                          const isActive = topic.id === activeTopicId;
                          const isDone = !!completedTopics[topic.id];

                          return (
                            <div 
                              key={topic.id}
                              onClick={() => {
                                setActiveTopicId(topic.id);
                                setSidebarOpen(false); // Close sidebar on mobile select
                              }}
                              className={`
                                flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-xs
                                ${isActive 
                                  ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/20' 
                                  : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-900/60 hover:text-slate-900 dark:hover:text-zinc-200'}
                              `}
                            >
                              <span className="truncate pr-2 font-medium">{topic.title}</span>
                              
                              {/* Completion Checkbox inside sidebar item */}
                              <button
                                onClick={(e) => toggleTopicCompletion(topic.id, e)}
                                className={`
                                  w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all cursor-pointer
                                  ${isDone 
                                    ? isActive
                                      ? 'bg-white border-white text-sky-500'
                                      : 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                    : isActive
                                      ? 'border-white/50 hover:bg-white/20'
                                      : 'border-slate-300 dark:border-zinc-800 hover:border-sky-500'
                                  }
                                `}
                                title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                              >
                                {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* MOBILE SIDEBAR OVERLAY BACKGROUND */}
          {sidebarOpen && (
            <div 
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 top-[64px] bg-slate-950/40 backdrop-blur-sm z-30 lg:hidden"
            />
          )}

          {/* B. MAIN READING AND TECHNICAL CONTENT AREA */}
          <main 
            ref={contentAreaRef}
            className="flex-1 bg-white dark:bg-zinc-950 p-6 md:p-8 lg:p-12 overflow-y-auto"
          >
            <div className="max-w-[820px] mx-auto">
              
              {/* Active topic navigation path */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500 mb-4 select-none font-medium">
                <span className="hover:text-slate-600 transition-colors uppercase tracking-wider">{activeTopic?.chapterTitle}</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-600 dark:text-zinc-300 truncate">{activeTopic?.title}</span>
              </div>

              {/* Course Article Title Banner */}
              <div className="mb-8 border-b border-slate-200/50 dark:border-zinc-900 pb-6">
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                    SYSTEM DESIGN LESSON
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 dark:text-zinc-500 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{computeReadTime(activeTopicContent)} min read</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 leading-tight">
                  {activeTopic?.header}
                </h1>
              </div>

              {/* RENDER ACTIVE TOPIC MARKDOWN CONTENT */}
              <article className="prose dark:prose-invert prose-slate dark:prose-zinc max-w-none text-slate-700 dark:text-zinc-300">
                {activeTopicContent ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                    components={markdownComponents}
                  >
                    {activeTopicContent}
                  </ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl">
                    <BookOpen className="w-8 h-8 text-slate-400 dark:text-zinc-500 mb-3" />
                    <h3 className="text-base font-bold text-slate-700 dark:text-zinc-300">Content loading failed</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs">
                      The requested concept markdown text could not be extracted from the source files.
                    </p>
                  </div>
                )}
              </article>

              {/* 3. LESSON ACTION BAR (Mark Complete, Next/Prev navigation) */}
              <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-zinc-900 space-y-6">
                
                {/* Complete lesson button card */}
                <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-zinc-900/60 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm
                      ${completedTopics[activeTopic?.id]
                        ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/20'
                        : 'bg-slate-200/50 text-slate-400 dark:bg-zinc-800'
                      }
                    `}>
                      <CheckCircle2 className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                        {completedTopics[activeTopic?.id] ? 'Lesson completed!' : 'Done reading this chapter?'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {completedTopics[activeTopic?.id] 
                          ? 'Excellent work! Mark it as incomplete to revisit later.' 
                          : 'Track your progress by marking this lesson as finished.'
                        }
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTopicCompletion(activeTopic?.id)}
                    className={`
                      w-full md:w-auto px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm
                      ${completedTopics[activeTopic?.id]
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
                        : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/10'
                      }
                    `}
                  >
                    {completedTopics[activeTopic?.id] ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Completed!</span>
                      </>
                    ) : (
                      <span>Mark Lesson Finished</span>
                    )}
                  </button>
                </div>

                {/* TEXTBOOK PREVIOUS AND NEXT NAVIGATION BUTTONS */}
                <div className="flex items-center justify-between gap-4">
                  {previousTopic ? (
                    <button
                      onClick={() => setActiveTopicId(previousTopic.id)}
                      className="flex-1 max-w-[240px] flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200/80 hover:border-sky-500 dark:border-zinc-800 dark:hover:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/20 text-slate-700 dark:text-zinc-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all cursor-pointer text-left min-w-0"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">PREVIOUS</span>
                        <span className="text-xs font-bold truncate leading-tight mt-0.5">{previousTopic.title}</span>
                      </div>
                    </button>
                  ) : (
                    <div className="flex-1 max-w-[240px]" />
                  )}

                  {nextTopic ? (
                    <button
                      onClick={() => setActiveTopicId(nextTopic.id)}
                      className="flex-1 max-w-[240px] flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-sky-500/40 dark:border-sky-500/20 hover:border-sky-500 dark:hover:border-sky-400 bg-sky-50/5 dark:bg-sky-950/10 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-all cursor-pointer text-right min-w-0"
                    >
                      <div className="flex flex-col text-left min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-sky-500 dark:text-sky-400 uppercase tracking-widest">NEXT LESSON</span>
                        <span className="text-xs font-bold truncate leading-tight mt-0.5">{nextTopic.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 text-sky-500" />
                    </button>
                  ) : (
                    <div className="flex-1 max-w-[240px]" />
                  )}
                </div>
              </div>

              {/* Course Footer credit info */}
              <footer className="mt-20 pt-8 border-t border-slate-100 dark:border-zinc-900 text-center text-xs text-slate-400 dark:text-zinc-500 space-y-2">
                <p>Designed and built with ❤️ as a System Design masterclass dashboard.</p>
                <p>Original source material authored by <a href="https://github.com/karanpratapsingh" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 dark:hover:text-zinc-400 underline inline-flex items-center gap-0.5">Karan Pratap Singh <ExternalLink className="w-2.5 h-2.5" /></a></p>
              </footer>
            </div>
          </main>

          {/* C. FLOATING RIGHT SIDEBAR: Outline TOC of active section headers */}
          {activeTopicTOC.length > 0 && (
            <aside className="hidden xl:block w-[240px] h-[calc(100vh-64px)] sticky top-[64px] border-l border-slate-200/50 dark:border-zinc-900/60 p-5 bg-slate-50/20 dark:bg-zinc-950/10 overflow-y-auto select-none">
              <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <ChevronUp className="w-3.5 h-3.5 rotate-90 text-sky-500" />
                <span>On this page</span>
              </h4>
              
              <ul className="space-y-3 text-xs font-medium border-l border-slate-200 dark:border-zinc-800/80 pl-1.5 ml-1">
                {activeTopicTOC.map((headerItem, idx) => (
                  <li 
                    key={idx}
                    style={{ paddingLeft: `${(headerItem.level - 2) * 12}px` }}
                  >
                    <a 
                      href={`#${headerItem.slug}`}
                      className="text-slate-500 hover:text-sky-500 dark:text-zinc-400 dark:hover:text-sky-400 transition-colors block py-0.5 leading-tight truncate"
                      title={headerItem.title}
                    >
                      {headerItem.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

        </div>
      )}
    </div>
  );
}
