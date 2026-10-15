import { useState } from "react";
import { Check, ExternalLink, FolderKanban, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pushToProjectManage } from "@/lib/server-fns";
import type { PushToHubInput } from "@/lib/project-hub.server";
import { cn } from "@/lib/utils";

export function PushToManageButton({
  idea,
  className,
  size = "default",
  variant = "default",
  label = "Push to Project Hub",
}: {
  idea: PushToHubInput;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary" | "ghost";
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [pushed, setPushed] = useState(false);

  async function handlePush(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (loading) return;
    setLoading(true);

    try {
      const res = await pushToProjectManage({ data: idea });
      setPushed(true);
      if (res.manageUrl) {
        window.open(res.manageUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Push to Project Hub error:", err);
      const params = new URLSearchParams();
      params.set("action", "import-idea");
      params.set("name", idea.betterName || idea.name);
      if (idea.thesis || idea.description) {
        params.set("desc", (idea.thesis || idea.description).slice(0, 1000));
      }
      if (idea.sourceUrl) params.set("sourceUrl", idea.sourceUrl);
      if (idea.tag) params.set("tag", idea.tag);
      window.open(
        `https://project-manage-z6u.pages.dev/?${params.toString()}`,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handlePush}
      disabled={loading}
      variant={variant}
      size={size}
      className={cn(
        "transition-all font-medium",
        pushed
          ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50"
          : variant === "outline"
          ? "border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 hover:text-white"
          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950/40",
        className
      )}
      title="Track and build this project with 817 launch tasks in Project Manage"
    >
      {loading ? (
        <>
          <Loader2 className="size-3.5 animate-spin mr-1.5" />
          <span>Syncing to Hub...</span>
        </>
      ) : pushed ? (
        <>
          <Check className="size-3.5 text-emerald-400 mr-1.5" />
          <span>Pushed to Hub</span>
          <ExternalLink className="size-3 ml-1 opacity-70" />
        </>
      ) : (
        <>
          <FolderKanban className="size-3.5 mr-1.5 text-emerald-300" />
          <span>{label}</span>
          <ExternalLink className="size-3 ml-1 opacity-60" />
        </>
      )}
    </Button>
  );
}
