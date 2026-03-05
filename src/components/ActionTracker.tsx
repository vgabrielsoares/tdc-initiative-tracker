import { Play, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TurnType } from "@/types/combat";
import { ACTIONS_PER_TURN } from "@/types/combat";

interface ActionTrackerProps {
  turnType: TurnType;
  usedActions: number;
  usedReaction: boolean;
  onToggleAction: (index: number) => void;
  onToggleReaction: () => void;
}

export function ActionTracker({
  turnType,
  usedActions,
  usedReaction,
  onToggleAction,
  onToggleReaction,
}: ActionTrackerProps) {
  const totalActions = ACTIONS_PER_TURN[turnType];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md bg-gradient-to-r from-secondary/50 to-secondary/30 px-3 py-2.5 border border-secondary/40">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Ações
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalActions }, (_, i) => {
            const used = i < usedActions;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onToggleAction(i)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 shadow-sm",
                  used
                    ? "bg-muted text-muted-foreground opacity-50"
                    : "bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow hover:scale-105",
                )}
                aria-label={`Ação ${i + 1}${used ? " (usada)" : ""}`}
              >
                <Play className="size-4" fill="currentColor" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Reação
        </span>
        <button
          type="button"
          onClick={onToggleReaction}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 shadow-sm",
            usedReaction
              ? "bg-muted text-muted-foreground opacity-50"
              : "bg-amber-500 text-white hover:bg-amber-600 hover:shadow hover:scale-105",
          )}
          aria-label={`Reação${usedReaction ? " (usada)" : ""}`}
        >
          <RotateCw className="size-4" />
        </button>
      </div>
    </div>
  );
}
