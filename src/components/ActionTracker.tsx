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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Ações:</span>
        {Array.from({ length: totalActions }, (_, i) => {
          const used = i < usedActions;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onToggleAction(i)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded text-sm font-bold transition-colors",
                used
                  ? "bg-muted text-muted-foreground line-through"
                  : "bg-primary text-primary-foreground hover:bg-primary/80",
              )}
              aria-label={`Ação ${i + 1}${used ? " (usada)" : ""}`}
            >
              ▶
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Reação:</span>
        <button
          type="button"
          onClick={onToggleReaction}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded text-sm font-bold transition-colors",
            usedReaction
              ? "bg-muted text-muted-foreground line-through"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
          aria-label={`Reação${usedReaction ? " (usada)" : ""}`}
        >
          ↩
        </button>
      </div>
    </div>
  );
}
