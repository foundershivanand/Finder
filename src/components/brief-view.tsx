import { Check, Copy, Download, FileCode, Layers, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Complaint, DeskKind, RiposteBrief, ReviewSnippet, VibeStep } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BriefView({
  brief,
  reviews = [],
  showPlan = true,
  kind = "trustmrr",
}: {
  brief: RiposteBrief;
  reviews?: ReviewSnippet[];
  showPlan?: boolean;
  kind?: DeskKind;
}) {
  const isAskDesk = kind === "reddit" || kind === "twitter" || kind === "hackernews";
  const isStore = kind === "appstore" || kind === "playstore";

  return (
    <div className="flex flex-col gap-10">
      {/* Thesis & Market Wedge */}
      <section className="rounded-2xl bg-card border border-border/80 p-6 sm:p-8 shadow-xl shadow-black/40">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-400" />
          <Kicker>The Market Opportunity</Kicker>
        </div>
        <p className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
          {brief.thesis}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 pt-6 border-t border-border/70">
          <Field label="Recommended Name" value={brief.opportunity.betterName} />
          <Field label="Target Customer" value={brief.opportunity.whoItsFor} />
          <Field label="Positioning Wedge" value={brief.opportunity.positioning} />
          <Field label="Why Build Now" value={brief.opportunity.whyNow} />
        </div>
      </section>

      {/* Raw Traces / Reviews */}
      {reviews.length > 0 ? (
        <section>
          <div className="flex items-center justify-between">
            <div>
              <Kicker>{isAskDesk ? "The Public Asks" : "Negative Review Traces"}</Kicker>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
                {isAskDesk ? "What real buyers typed" : "What users complained about"}
              </h2>
            </div>
            <span className="text-xs font-mono text-faint">{reviews.length} mined signals</span>
          </div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {reviews.slice(0, 6).map((r) => (
              <li key={r.url + r.body.slice(0, 24)} className="rounded-xl bg-card/80 border border-border/70 p-4 transition-colors hover:border-border">
                <p className="text-[10px] uppercase font-mono tracking-wider text-faint">
                  {r.source} {r.title ? `• ${r.title}` : ""}
                </p>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-foreground/90 font-sans">
                  "{r.body}"
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Mined Complaints / Flanks */}
      <section>
        <Kicker>{isAskDesk ? "The Unmet Requests" : "The 1-Star Review Flanks"}</Kicker>
        <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
          {isAskDesk ? "Where you win the market" : "Weaknesses you can kill"}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted">
          {isAskDesk
            ? "Mined directly from user comments and feature requests. Beat these and you own the cohort."
            : "Direct quotes from store reviews and user grievances. Build the antidote that fixes them on day 1."}
        </p>
        <ol className="mt-4 flex flex-col gap-3">
          {brief.complaints.map((c) => (
            <ComplaintCard key={c.theme} complaint={c} />
          ))}
        </ol>
      </section>

      {/* Gaps Left Open */}
      {brief.gaps.length > 0 ? (
        <section>
          <Kicker>Market White Space</Kicker>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">Gaps left wide open</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {brief.gaps.map((gap) => (
              <li
                key={gap}
                className="rounded-xl bg-card border border-border/70 p-3.5 text-xs sm:text-sm leading-relaxed text-foreground"
              >
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{gap}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showPlan ? <PlanSections brief={brief} /> : null}
    </div>
  );
}

export function PlanSections({ brief }: { brief: RiposteBrief }) {
  function downloadMarkdown() {
    const content = serializeFullMarkdown(brief);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.opportunity.betterName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-vibe-plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div id="vibe-plan" className="flex flex-col gap-12">
      {/* Master Blueprint */}
      {brief.masterBlueprint ? (
        <section className="rounded-2xl bg-card border border-emerald-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <Kicker>Agent Constitution</Kicker>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
                Master 27-Section Blueprint
              </h2>
              <p className="mt-1 text-xs text-muted">
                Complete architecture, schema, security rules, and prompt instructions for Cursor, Windsurf, or Claude Code.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadMarkdown}
                className="text-xs h-9 border-border bg-card-2 hover:bg-card"
              >
                <Download className="size-3.5 mr-1 text-muted" />
                Export .md
              </Button>
              <CopyButton
                text={brief.masterBlueprint}
                label="Copy Master Prompt"
                className="h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              />
            </div>
          </div>
          <div className="mt-5">
            <PromptBlock
              title="Full Constitution & Architecture Specification"
              text={brief.masterBlueprint}
              defaultOpen={false}
            />
          </div>
        </section>
      ) : null}

      {/* Sequenced Vibe Coding Prompts */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <Kicker>Step-By-Step Vibe Code Sequence</Kicker>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
              Implementation Prompts
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-muted">
              Paste each prompt sequentially into your coding agent. Verify the "Done when" checklist before proceeding.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full shrink-0">
            {brief.vibeGuide.length} sequenced prompts
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {brief.vibeGuide.map((step) => (
            <StepCard key={step.step} step={step} />
          ))}
        </div>
      </section>

      {/* Tech Stack & Scope */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-card border border-border/80 p-5">
          <Kicker>Recommended Stack</Kicker>
          <p className="mt-2 text-sm font-semibold text-foreground">{brief.stack.recommendation}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{brief.stack.reason}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {brief.stack.pieces.map((p) => (
              <Badge key={p} variant="outline" className="text-[10px] py-0 px-2 font-mono">
                {p}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border/80 p-5">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-400" />
            <Kicker>MVP Scope (Ship Fast)</Kicker>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground">
            {brief.mvpScope.map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-card border border-border/80 p-5">
          <div className="flex items-center gap-1.5 text-faint">
            <span className="size-2 rounded-full bg-faint" />
            <Kicker>Out of Scope (Post-MVP)</Kicker>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
            {brief.outOfScope.map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="text-faint font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Go-to-Market Strategy */}
      <section className="rounded-2xl bg-card border border-border/80 p-6 sm:p-7">
        <Kicker>Go-To-Market & First Users</Kicker>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Field label="First 100 Users Channel" value={brief.launch.firstUsers} />
          <Field label="Monetization & Pricing" value={brief.launch.pricing} />
          <Field label="The Moat / Differentiator" value={brief.launch.differentiator} />
        </div>
      </section>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] uppercase font-mono tracking-wider text-faint font-semibold">{children}</p>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-mono tracking-wider text-faint">{label}</p>
      <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-foreground">{value}</p>
    </div>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <li className="rounded-2xl bg-card border border-border/80 p-5 transition-all hover:border-border">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={complaint.severity} />
          <h3 className="text-sm font-semibold text-foreground">{complaint.theme}</h3>
        </div>
        <span className="text-[11px] font-mono text-faint">
          {complaint.sourced ? complaint.source : "Inferred Flank"}
        </span>
      </div>
      <blockquote className="mt-3 border-l-2 border-rose-500/60 pl-3.5 text-sm sm:text-base leading-snug text-foreground/90 italic">
        "{complaint.quote}"
      </blockquote>
      <div className="mt-3 rounded-xl bg-card-2 p-3 border border-border/50 flex items-start gap-2">
        <span className="text-emerald-400 font-bold text-xs shrink-0 mt-0.5">Antidote:</span>
        <p className="text-xs leading-relaxed text-muted-foreground">{complaint.howToFix}</p>
      </div>
    </li>
  );
}

function SeverityBadge({ severity }: { severity: Complaint["severity"] }) {
  if (severity === "critical")
    return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
  if (severity === "high")
    return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
  return <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">MEDIUM</span>;
}

function StepCard({ step }: { step: VibeStep }) {
  return (
    <article className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 transition-all hover:border-emerald-500/30 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="size-8 rounded-xl bg-card-2 border border-border flex items-center justify-center shrink-0 font-mono text-xs font-bold text-emerald-400">
          0{step.step}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">{step.title}</h3>
          <p className="mt-0.5 text-xs text-muted leading-relaxed">{step.why}</p>
        </div>
      </div>
      <div className="mt-4">
        <PromptBlock title={`Prompt ${step.step} — Click to copy into coding agent`} text={step.prompt} defaultOpen={false} />
      </div>
      <div className="mt-3.5 flex items-center gap-2 text-xs text-muted border-t border-border/60 pt-3">
        <Check className="size-3.5 text-emerald-400 shrink-0" />
        <span className="text-foreground font-medium">Done when:</span>
        <span className="text-muted-foreground truncate">{step.doneWhen}</span>
      </div>
    </article>
  );
}

function PromptBlock({ title, text, defaultOpen = false }: { title: string; text: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const words = text.trim().split(/\s+/).length;

  return (
    <div className="overflow-hidden rounded-xl bg-card-2 border border-border/80">
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3.5 py-2.5 bg-card/60">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="size-3.5 text-faint shrink-0" />
          <span className="truncate text-[11px] font-mono uppercase tracking-wider text-muted font-medium">
            {title}
          </span>
          <span className="text-[10px] font-mono text-faint shrink-0">({words} words)</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            className="text-[11px] text-muted hover:text-foreground font-mono px-2 py-1 rounded hover:bg-card transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Collapse" : "Expand"}
          </button>
          <CopyButton text={text} className="h-7 text-xs bg-card hover:bg-card-2" />
        </div>
      </div>
      <pre
        className={cn(
          "overflow-auto p-3.5 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap select-all",
          open ? "max-h-[500px]" : "max-h-36"
        )}
      >
        {text}
      </pre>
    </div>
  );
}

export function CopyButton({
  text,
  label = "Copy Prompt",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className={cn("h-8 px-2.5 text-xs font-medium inline-flex items-center gap-1.5 transition-all", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* ignore */
        }
      }}
    >
      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5 text-muted" />}
      <span>{copied ? "Copied!" : label}</span>
    </Button>
  );
}

function serializeFullMarkdown(brief: RiposteBrief): string {
  const lines = [
    `# Finder Vibe Coding Blueprint: ${brief.opportunity.betterName}`,
    `Generated for: ${brief.productName}`,
    `Thesis: ${brief.thesis}`,
    "",
    "## 1. Positioning",
    `- **Product Name**: ${brief.opportunity.betterName}`,
    `- **Target Audience**: ${brief.opportunity.whoItsFor}`,
    `- **Positioning Angle**: ${brief.opportunity.positioning}`,
    `- **Why Now**: ${brief.opportunity.whyNow}`,
    "",
    "## 2. Incumbent Flanks & Complaints Solved",
    ...brief.complaints.map((c) => `- [${c.severity.toUpperCase()}] **${c.theme}**: "${c.quote}" -> Antidote: ${c.howToFix}`),
    "",
    "## 3. Tech Stack",
    `- **Recommendation**: ${brief.stack.recommendation}`,
    `- **Reason**: ${brief.stack.reason}`,
    `- **Libraries**: ${brief.stack.pieces.join(", ")}`,
    "",
    "## 4. Master Blueprint",
    brief.masterBlueprint ?? "None",
    "",
    "## 5. Implementation Sequence",
    ...brief.vibeGuide.flatMap((s) => [
      `### Step ${s.step}: ${s.title}`,
      `*Why*: ${s.why}`,
      "",
      "```text",
      s.prompt,
      "```",
      `*Done When*: ${s.doneWhen}`,
      "",
    ]),
  ];
  return lines.join("\n");
}
