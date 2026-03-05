import { useState, useEffect } from "react";
import {
  Shield,
  Heart,
  Skull,
  Plus,
  Play,
  Edit2,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionTracker } from "@/components/ActionTracker";
import { ConditionBadges } from "@/components/ConditionBadges";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import type { NpcCharacter } from "@/types/character";
import type { AppliedCondition } from "@/types/conditions";
import type { TurnType } from "@/types/combat";

interface NPCCardProps {
  character: NpcCharacter;
  acted: boolean;
  isInActiveTurn: boolean;
  turnType: TurnType;
  conditions: AppliedCondition[];
  usedReaction: boolean;
  onToggle: () => void;
  onToggleReaction: () => void;
  onUpdateGuard: (value: number) => void;
  onUpdateVitality: (value: number) => void;
  onUpdateName: (name: string) => void;
  onToggleDefeated: () => void;
  onAddCondition: () => void;
  onRemoveCondition: (conditionId: string) => void;
}

export function NPCCard({
  character,
  acted,
  isInActiveTurn,
  turnType,
  conditions,
  usedReaction,
  onToggle,
  onToggleReaction,
  onUpdateGuard,
  onUpdateVitality,
  onUpdateName,
  onToggleDefeated,
  onAddCondition,
  onRemoveCondition,
}: NPCCardProps) {
  const [usedActions, setUsedActions] = useState(0);
  const [defeatConfirmOpen, setDefeatConfirmOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState(character.name);

  // Reset actions when no longer acted
  useEffect(() => {
    if (!acted) {
      setUsedActions(0);
    }
  }, [acted]);

  function handleToggleAction(index: number) {
    if (index < usedActions) {
      setUsedActions(index);
    } else {
      setUsedActions(index + 1);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border-2 px-4 py-3 transition-all duration-200",
        character.defeated
          ? "border-border bg-gradient-to-br from-muted to-muted/50 opacity-50"
          : acted
            ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm"
            : "border-border bg-gradient-to-br from-card to-background hover:shadow-md",
      )}
    >
      {/* Header: name + act button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {editingName && !character.defeated ? (
            <input
              type="text"
              autoFocus
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={() => {
                if (editedName.trim() && editedName !== character.name) {
                  onUpdateName(editedName);
                }
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="flex-1 min-w-0 px-2 py-1 text-sm font-semibold bg-background border border-input rounded"
            />
          ) : (
            <>
              <span
                className={cn(
                  "font-semibold truncate",
                  character.defeated && "line-through",
                )}
              >
                {character.name}
              </span>
              {!character.defeated && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setEditingName(true)}
                  className="shrink-0"
                  aria-label="Editar nome"
                >
                  <Edit2 className="size-3" />
                </Button>
              )}
            </>
          )}
          <span className="shrink-0 text-xs font-medium uppercase text-orange-600 dark:text-orange-400">
            NPC
          </span>
        </div>

        {isInActiveTurn && !character.defeated && (
          <Button
            variant={acted ? "secondary" : "default"}
            size="sm"
            onClick={onToggle}
            className="shrink-0 gap-1.5"
          >
            <Play className="size-4" fill="currentColor" />
            {acted ? "Desfazer" : "Agir"}
          </Button>
        )}
      </div>

      {/* Resources */}
      {!character.defeated && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Shield className="size-4 text-blue-500" />
            <Input
              type="number"
              min={0}
              value={character.guard}
              onChange={(e) => onUpdateGuard(Number(e.target.value))}
              className="h-7 w-16 px-2 text-sm"
              aria-label="Guarda"
            />
          </div>
          <div className="flex items-center gap-1">
            <Heart className="size-4 text-red-500" />
            <Input
              type="number"
              min={0}
              value={character.vitality}
              onChange={(e) => onUpdateVitality(Number(e.target.value))}
              className="h-7 w-16 px-2 text-sm"
              aria-label="Vitalidade"
            />
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Def{" "}
            <span className="font-semibold text-foreground">
              {character.defense}
            </span>
          </div>
        </div>
      )}

      {/* Action tracker - visible when in active turn and acted, or always if showing reaction */}
      {!character.defeated &&
        (isInActiveTurn && acted ? (
          <ActionTracker
            turnType={turnType}
            usedActions={usedActions}
            usedReaction={usedReaction}
            onToggleAction={handleToggleAction}
            onToggleReaction={onToggleReaction}
          />
        ) : !isInActiveTurn ? (
          <div className="flex items-center gap-2 rounded-md bg-gradient-to-r from-secondary/50 to-secondary/30 px-3 py-2.5 border border-secondary/40">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Reação:
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
        ) : null)}

      {/* Conditions + add button */}
      {!character.defeated && (
        <div className="flex flex-wrap items-center gap-1.5">
          <ConditionBadges
            conditions={conditions}
            onRemove={onRemoveCondition}
          />
          <Button variant="outline" size="xs" onClick={onAddCondition}>
            <Plus className="size-3" />
            Condição
          </Button>
        </div>
      )}

      {/* Defeat / restore */}
      <div className="flex justify-end border-t pt-2 mt-1">
        {character.defeated ? (
          <Button variant="outline" size="xs" onClick={onToggleDefeated}>
            Restaurar
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="xs"
            className="text-destructive hover:text-destructive"
            onClick={() => setDefeatConfirmOpen(true)}
          >
            <Skull className="size-3" />
            Derrotar
          </Button>
        )}
      </div>

      <ConfirmationModal
        open={defeatConfirmOpen}
        onOpenChange={setDefeatConfirmOpen}
        title="Derrotar NPC?"
        description={`${character.name} será marcado como derrotado e removido da ordem de combate.`}
        confirmLabel="Derrotar"
        variant="destructive"
        onConfirm={onToggleDefeated}
      />
    </div>
  );
}
