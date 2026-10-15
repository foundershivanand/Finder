import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bot,
  Check,
  ChevronDown,
  Compass,
  CornerDownLeft,
  ExternalLink,
  FolderKanban,
  Maximize2,
  Minimize2,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { chatWithAdvisor } from "@/lib/server-fns";
import type { ChatMessage, CurrentIdeaContext } from "@/lib/advisor-chat.server";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "finder_chat_messages_v1";

const STARTER_PROMPTS = [
  "🔥 What are the best app ideas on this site right now?",
  "⚡ Which idea is easiest to build for a solo developer?",
  "💰 What are the highest MRR SaaS to flank?",
  "📱 Best mobile app opportunities from 1-star reviews?",
  "🚀 How do I push an idea to Project Manage?",
];

export function FinderChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(STARTER_PROMPTS.slice(0, 3));
  const location = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-save messages to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
      } catch {
        /* ignore */
      }
    }
  }, [messages]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Detect current idea context from URL path (/hit/$kind/$id)
  const ideaContext = getCurrentIdeaContext(location.pathname);

  async function handleSend(textToSend?: string) {
    const raw = (textToSend || input).trim();
    if (!raw || loading) return;

    const userMessage: ChatMessage = { role: "user", content: raw };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await chatWithAdvisor({
        data: {
          messages: updatedMessages,
          context: ideaContext,
        },
      });

      if (res && res.reply) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: res.reply,
        };
        setMessages([...updatedMessages, assistantMessage]);
        if (res.suggestions && res.suggestions.length > 0) {
          setSuggestions(res.suggestions);
        }
      }
    } catch (err) {
      console.error("[FinderChatbot] Error:", err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "I ran into a temporary connection issue. Here are top validated opportunities on Finder:\n\n" +
            "- **[Typeframes](/hit/trustmrr/typeframes)** ($15.8k MRR) — Video creator with automated zoom flank.\n" +
            "- **[Freelance Micro-CRM](/hit/reddit/freelance-crm)** (Reddit Demand) — Minimalist client pipeline.\n" +
            "- **[Offline Calorie Tracker](/hit/appstore/calorie-counter)** (App Store 1-Star) — 100% local-first.\n\n" +
            "Feel free to ask again or select a suggested topic below!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    setSuggestions(STARTER_PROMPTS.slice(0, 3));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {/* Floating Widget Trigger Pill */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={cn(
            "fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 group",
            "flex items-center gap-2.5 px-4 py-3 sm:py-2.5 rounded-full",
            "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500",
            "hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs sm:text-sm",
            "shadow-xl shadow-emerald-950/60 border border-emerald-400/30",
            "transition-all duration-300 hover:scale-105 active:scale-95"
          )}
          title="Chat with Finder AI Advisor"
          aria-label="Open Finder AI Advisor"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="size-4 animate-pulse text-amber-200" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-300 animate-ping" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-200" />
          </div>
          <span className="tracking-tight font-medium">Ask Finder AI</span>
          <span className="hidden md:inline text-[10px] uppercase font-mono tracking-wider bg-black/25 px-1.5 py-0.5 rounded-full border border-white/10">
            Advisor
          </span>
        </button>
      )}

      {/* Expanded Chatbot Modal / Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300 flex flex-col shadow-2xl",
            "border border-emerald-500/30 bg-slate-950/95 backdrop-blur-2xl text-foreground",
            isMinimized
              ? "bottom-20 sm:bottom-6 right-4 sm:right-6 w-80 h-14 rounded-2xl overflow-hidden"
              : "bottom-4 sm:bottom-6 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-[440px] h-[calc(100dvh-2rem)] sm:h-[620px] max-h-[700px] rounded-3xl overflow-hidden"
          )}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 shrink-0">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                    Finder AI Advisor
                  </h3>
                  <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="hidden sm:inline text-[10px] text-emerald-400 font-medium">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate">
                  Grounded strictly in Finder startup ideas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && !isMinimized && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-slate-800/80 transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="size-3.5" /> : <Minimize2 className="size-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Banner if on an idea page */}
              {ideaContext && ideaContext.name && (
                <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-3.5 py-1.5 flex items-center justify-between text-xs text-emerald-300 shrink-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <Compass className="size-3 shrink-0 text-emerald-400" />
                    <span className="text-muted-foreground text-[11px]">Discussing:</span>
                    <span className="font-semibold truncate">{ideaContext.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                    {ideaContext.kind}
                  </span>
                </div>
              )}

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
                {messages.length === 0 ? (
                  <div className="py-4 space-y-4">
                    {/* Welcome Card */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                        <Bot className="size-4" />
                        <span>Welcome to Finder Intelligence</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        I am your resident startup intelligence advisor. I have full knowledge of all{" "}
                        <strong className="text-foreground">13 Opportunity Desks</strong>, verified MRRs,
                        1-star complaint breakdowns, and vibe-coding blueprints.
                      </p>
                      <p className="text-xs text-muted leading-relaxed">
                        Ask me what to build, which idea is most profitable, or how to launch!
                      </p>
                    </div>

                    {/* Starter Prompts */}
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold px-1">
                        Suggested questions:
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {STARTER_PROMPTS.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => handleSend(prompt)}
                            className="text-left text-xs bg-slate-900 hover:bg-slate-800 border border-border/80 hover:border-emerald-500/40 text-foreground/90 hover:text-white rounded-xl px-3 py-2 transition-all group flex items-center justify-between"
                          >
                            <span>{prompt}</span>
                            <CornerDownLeft className="size-3 opacity-0 group-hover:opacity-70 text-emerald-400 shrink-0 ml-1.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex gap-2.5",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === "assistant" && (
                          <div className="size-6 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                            <Sparkles className="size-3" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl px-3.5 py-2.5 max-w-[85%] leading-relaxed text-xs sm:text-sm",
                            msg.role === "user"
                              ? "bg-emerald-600 text-white rounded-br-xs font-medium shadow-md shadow-emerald-950/40"
                              : "bg-slate-900 border border-border/90 text-foreground rounded-bl-xs shadow-sm"
                          )}
                        >
                          <ChatMessageContent content={msg.content} onLinkClick={() => setIsOpen(false)} />
                        </div>
                      </div>
                    ))}

                    {/* Loading bubble */}
                    {loading && (
                      <div className="flex gap-2.5 justify-start">
                        <div className="size-6 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                          <Sparkles className="size-3 animate-spin" />
                        </div>
                        <div className="rounded-2xl rounded-bl-xs px-3.5 py-2.5 bg-slate-900 border border-border text-muted flex items-center gap-2 text-xs">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>Consulting Finder catalog...</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Follow-up Quick Chips */}
              {messages.length > 0 && suggestions.length > 0 && !loading && (
                <div className="px-3 py-1.5 border-t border-border/50 bg-slate-950 flex flex-wrap gap-1.5 shrink-0">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-border hover:border-emerald-500/40 text-muted hover:text-white rounded-full px-2.5 py-1 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <div className="p-3 border-t border-border/80 bg-slate-900/90 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      ideaContext?.name
                        ? `Ask about ${ideaContext.name}...`
                        : "Ask about app ideas, MRR, solo build..."
                    }
                    disabled={loading}
                    className="flex-1 bg-slate-950 border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className={cn(
                      "size-9 rounded-xl flex items-center justify-center transition-all shrink-0",
                      input.trim() && !loading
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50"
                        : "bg-slate-800 text-muted cursor-not-allowed"
                    )}
                    title="Send message"
                  >
                    <Send className="size-3.5" />
                  </button>
                </form>
                <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-faint">
                  <span>Grounded in Finder database</span>
                  <span>Shift+Enter or Enter to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Parses markdown-like text including bolding, lists, and links [label](path)
 */
function ChatMessageContent({
  content,
  onLinkClick,
}: {
  content: string;
  onLinkClick: () => void;
}) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1" />;

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={lineIdx} className="font-bold text-emerald-400 text-xs sm:text-sm mt-2 mb-1">
              {formatInlineText(trimmed.replace(/^###\s+/, ""), onLinkClick)}
            </h4>
          );
        }

        // Heading 2 or 1
        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          return (
            <h3 key={lineIdx} className="font-bold text-white text-sm mt-2 mb-1">
              {formatInlineText(trimmed.replace(/^#+\s+/, ""), onLinkClick)}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || trimmed.startsWith("•")) {
          const itemText = trimmed.replace(/^[-*•]\s*/, "");
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1 my-1">
              <span className="text-emerald-400 font-bold shrink-0 leading-relaxed">•</span>
              <div className="flex-1">{formatInlineText(itemText, onLinkClick)}</div>
            </div>
          );
        }

        // Numbered item
        const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1 my-1">
              <span className="text-emerald-400 font-mono text-[11px] font-bold shrink-0 mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{formatInlineText(numMatch[2], onLinkClick)}</div>
            </div>
          );
        }

        // Regular line
        return <p key={lineIdx} className="my-0.5">{formatInlineText(trimmed, onLinkClick)}</p>;
      })}
    </div>
  );
}

/**
 * Formats inline bold text (**bold**), code (`code`), and markdown links ([text](url))
 */
function formatInlineText(rawText: string, onLinkClick: () => void): React.ReactNode {
  // Normalize **[label](url)** -> [label](url)
  const text = rawText.replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, "[$1]($2)");

  // Regex matches: [label](url) OR `code` OR **bold**
  const regex = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      // Markdown link
      const label = match[1];
      const url = match[2];
      const isInternal = url.startsWith("/") || url.includes("finder-d17.pages.dev");

      if (isInternal) {
        const path = url.replace("https://finder-d17.pages.dev", "");
        elements.push(
          <Link
            key={match.index}
            to={path as any}
            onClick={onLinkClick}
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-semibold transition-colors inline-flex items-center gap-0.5 hover:scale-[1.02]"
          >
            <span>{label}</span>
          </Link>
        );
      } else {
        elements.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-semibold transition-colors inline-flex items-center gap-0.5"
          >
            <span>{label}</span>
            <ExternalLink className="size-2.5 opacity-70" />
          </a>
        );
      }
    } else if (match[3]) {
      // Inline code
      elements.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[11px] border border-border/60">
          {match[3]}
        </code>
      );
    } else if (match[4]) {
      // Bold text
      elements.push(
        <strong key={match.index} className="font-bold text-foreground">
          {match[4]}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

function getCurrentIdeaContext(pathname: string): CurrentIdeaContext | undefined {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "hit" && parts[1] && parts[2]) {
    const kind = parts[1];
    const id = parts[2];
    const name = id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      id,
      kind,
      name,
      url: `https://finder-d17.pages.dev${pathname}`,
    };
  }
  return undefined;
}
