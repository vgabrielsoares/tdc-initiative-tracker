import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ConditionName,
  ConditionCategory,
  CONDITION_CATEGORIES,
} from "@/types/conditions";
import type { ConditionName as ConditionNameType } from "@/types/conditions";

const ALL_CONDITIONS = Object.values(ConditionName) as ConditionNameType[];

const CATEGORY_LABELS: Record<ConditionCategory, string> = {
  [ConditionCategory.Corporal]: "Corporais",
  [ConditionCategory.Mental]: "Mentais",
  [ConditionCategory.Sensorial]: "Sensoriais",
  [ConditionCategory.Espiritual]: "Espirituais",
};

const CATEGORY_ORDER: ConditionCategory[] = [
  ConditionCategory.Corporal,
  ConditionCategory.Mental,
  ConditionCategory.Sensorial,
  ConditionCategory.Espiritual,
];

interface ConditionPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterName: string;
  onApply: (conditionName: ConditionNameType, remainingRounds?: number) => void;
}

export function ConditionPicker({
  open,
  onOpenChange,
  characterName,
  onApply,
}: ConditionPickerProps) {
  const [selected, setSelected] = useState<ConditionNameType | null>(null);
  const [hasDuration, setHasDuration] = useState(false);
  const [duration, setDuration] = useState(1);

  function handleApply() {
    if (!selected) return;
    onApply(selected, hasDuration ? duration : undefined);
    resetAndClose();
  }

  function resetAndClose() {
    setSelected(null);
    setHasDuration(false);
    setDuration(1);
    onOpenChange(false);
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    conditions: ALL_CONDITIONS.filter((c) => CONDITION_CATEGORIES[c] === cat),
  }));

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetAndClose();
        else onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Aplicar Condição — {characterName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {grouped.map((group) => (
            <div key={group.category}>
              <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                {group.label}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {group.conditions.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setSelected(cond)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      selected === cond
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-accent",
                    )}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {selected && (
            <div className="flex items-center gap-3 border-t pt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasDuration}
                  onChange={(e) => setHasDuration(e.target.checked)}
                  className="rounded"
                />
                Duração em rodadas
              </label>
              {hasDuration && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="cond-duration" className="sr-only">
                    Rodadas
                  </Label>
                  <Input
                    id="cond-duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) =>
                      setDuration(Math.max(1, Number(e.target.value)))
                    }
                    className="h-7 w-16 px-2 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">
                    rodada(s)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancelar
          </Button>
          <Button disabled={!selected} onClick={handleApply}>
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
