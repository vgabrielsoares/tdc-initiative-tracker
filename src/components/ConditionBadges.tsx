import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppliedCondition } from "@/types/conditions";
import { CONDITION_CATEGORIES, ConditionCategory } from "@/types/conditions";

const CATEGORY_COLORS: Record<ConditionCategory, string> = {
  [ConditionCategory.Corporal]:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  [ConditionCategory.Mental]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  [ConditionCategory.Sensorial]:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  [ConditionCategory.Espiritual]:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
};

interface ConditionBadgesProps {
  conditions: AppliedCondition[];
  onRemove: (conditionId: string) => void;
}

export function ConditionBadges({
  conditions,
  onRemove,
}: ConditionBadgesProps) {
  if (conditions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {conditions.map((c) => {
        const category = CONDITION_CATEGORIES[c.conditionName];
        return (
          <span
            key={c.id}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              CATEGORY_COLORS[category],
            )}
          >
            {c.conditionName}
            {c.remainingRounds !== undefined && (
              <span className="opacity-70">({c.remainingRounds}r)</span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(c.id);
              }}
              className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
              aria-label={`Remover ${c.conditionName}`}
            >
              <X className="size-3" />
            </button>
          </span>
        );
      })}
    </div>
  );
}
