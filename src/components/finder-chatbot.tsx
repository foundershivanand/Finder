import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bot,
  Boxes,
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
  "📦 What reusable modules can I pull from the Code Library?",
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
            "h-10 px-3.5 rounded-full flex items-center gap-2 shadow-2xl transition-all duration-200",
            "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 hover:border-white/20",
            "hover:scale-[1.02] active:scale-[0.98] backdrop-blur-xl"
          )}
          title="Chat with Finder AI"
          aria-label="Open Finder AI"
        >
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium tracking-tight">Ask Finder AI</span>
          <span className="text-[10px] font-mono text-zinc-500 pl-0.5">⌘J</span>
        </button>
      )}

      {/* Expanded Chatbot Modal / Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300 flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.85)]",
            "border border-white/[0.08] bg-[#0b0c0f]/95 backdrop-blur-3xl text-zinc-100",
            isMinimized
              ? "bottom-20 sm:bottom-6 right-4 sm:right-6 w-80 h-13 rounded-xl overflow-hidden"
              : "bottom-4 sm:bottom-6 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-[420px] h-[calc(100dvh-2rem)] sm:h-[580px] max-h-[640px] rounded-2xl overflow-hidden"
          )}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.06] bg-zinc-900/30 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-6 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="size-3" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-zinc-200 tracking-tight truncate">
                    Finder AI
                  </h3>
                  <span className="size-1 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-zinc-500 font-mono">Advisor</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              {messages.length > 0 && !isMinimized && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="size-3" />
                </button>
              )}
              <a
                href="https://reusable-library.foundershivanand.workers.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md text-zinc-500 hover:text-emerald-400 hover:bg-white/[0.04] transition-colors"
                title="Open Reusable Code Library (33 modules)"
              >
                <Boxes className="size-3" />
              </a>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="size-3" /> : <Minimize2 className="size-3" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
                title="Close chat"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Banner if on an idea page */}
              {ideaContext && ideaContext.name && (
                <div className="bg-white/[0.02] border-b border-white/[0.05] px-3.5 py-1.5 flex items-center justify-between text-xs text-zinc-300 shrink-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <Compass className="size-3 shrink-0 text-zinc-500" />
                    <span className="text-zinc-500 text-[10px] font-mono">CONTEXT:</span>
                    <span className="font-medium text-xs truncate text-zinc-200">{ideaContext.name}</span>
                  </div>
                  <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                    {ideaContext.kind}
                  </span>
                </div>
              )}

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs sm:text-[13px]">
                {messages.length === 0 ? (
                  <div className="py-2 space-y-3">
                    {/* Welcome Card */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-zinc-200 font-medium text-xs">
                        <Bot className="size-3.5 text-emerald-400" />
                        <span>Startup Intelligence Advisor</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Grounded in all <span className="text-zinc-200">13 Opportunity Desks</span>, verified MRR metrics,
                        1-star review flanks, and developer launch blueprints.
                      </p>
                    </div>

                    {/* Starter Prompts */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                        Suggested prompts:
                      </p>
                      <div className="flex flex-col gap-1">
                        {STARTER_PROMPTS.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => handleSend(prompt)}
                            className="text-left text-xs bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.12] text-zinc-300 hover:text-white rounded-lg px-2.5 py-2 transition-all flex items-center justify-between"
                          >
                            <span>{prompt}</span>
                            <CornerDownLeft className="size-3 opacity-40 text-zinc-500 shrink-0 ml-1.5" />
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
                          "flex gap-2",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === "assistant" && (
                          <div className="size-5 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <Sparkles className="size-2.5" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "rounded-xl px-3 py-2 max-w-[88%] leading-relaxed text-xs sm:text-[13px]",
                            msg.role === "user"
                              ? "bg-zinc-800 text-zinc-100 rounded-br-xs font-normal border border-white/[0.08]"
                              : "bg-white/[0.025] border border-white/[0.06] text-zinc-200 rounded-bl-xs"
                          )}
                        >
                          <ChatMessageContent content={msg.content} onLinkClick={() => setIsOpen(false)} />
                        </div>
                      </div>
                    ))}

                    {/* Loading bubble */}
                    {loading && (
                      <div className="flex gap-2 justify-start">
                        <div className="size-5 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                          <Sparkles className="size-2.5 animate-spin" />
                        </div>
                        <div className="rounded-xl rounded-bl-xs px-3 py-2 bg-white/[0.02] border border-white/[0.05] text-zinc-400 flex items-center gap-2 text-xs">
                          <span className="size-1 rounded-full bg-emerald-400 animate-ping" />
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
                <div className="px-3 py-1.5 border-t border-white/[0.05] bg-zinc-950 flex flex-wrap gap-1.5 shrink-0">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="text-[10px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-zinc-400 hover:text-white rounded-full px-2.5 py-0.5 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <div className="p-2.5 border-t border-white/[0.06] bg-zinc-950/80 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSend();
                  }}
                  className="flex items-center gap-1.5"
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
                    className="flex-1 bg-zinc-900/60 border border-white/[0.08] focus:border-white/20 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center transition-all shrink-0",
                      input.trim() && !loading
                        ? "bg-zinc-100 hover:bg-white text-zinc-950"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    )}
                    title="Send message"
                  >
                    <Send className="size-3" />
                  </button>
                </form>
                <div className="mt-1 flex items-center justify-between px-1 text-[9px] text-zinc-500 font-mono">
                  <span>Grounded in Finder catalog</span>
                  <span>Enter to send</span>
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
