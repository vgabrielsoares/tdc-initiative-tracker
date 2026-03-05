import { useState } from "react";
import { Shield, Heart, Skull, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionTracker } from "@/components/ActionTracker";
import { ConditionBadges } from "@/components/ConditionBadges";
import type { NpcCharacter } from "@/types/character";
import type { AppliedCondition } from "@/types/conditions";
import type { TurnType } from "@/types/combat";

interface NPCCardProps {
  character: NpcCharacter;
  acted: boolean;
  isInActiveTurn: boolean;
  turnType: TurnType;
  conditions: AppliedCondition[];
  onToggle: () => void;
  onUpdateGuard: (value: number) => void;
  onUpdateVitality: (value: number) => void;
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
  onToggle,
  onUpdateGuard,
  onUpdateVitality,
  onToggleDefeated,
  onAddCondition,
  onRemoveCondition,
}: NPCCardProps) {
  const [usedActions, setUsedActions] = useState(0);
  const [usedReaction, setUsedReaction] = useState(false);

  // Reset action state when the character's acted status changes to false
  // (new phase started)
  const [prevActed, setPrevActed] = useState(acted);
  if (!acted && prevActed) {
    setUsedActions(0);
    setUsedReaction(false);
  }
  if (acted !== prevActed) setPrevActed(acted);

  function handleToggleAction(index: number) {
    // Clicking the last used action un-uses it; clicking an unused one uses up to it
    if (index < usedActions) {
      setUsedActions(index);
    } else {
      setUsedActions(index + 1);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border-2 px-4 py-3 transition-colors",
        character.defeated
          ? "border-border bg-muted opacity-50"
          : acted
            ? "border-primary bg-primary/10"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent",
      )}
    >
      {/* Top row: name + toggle + defeated */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={character.defeated}
          onClick={onToggle}
          className="flex items-center gap-2 text-left disabled:cursor-not-allowed"
        >
          <span
            className={cn(
              "font-semibold",
              character.defeated && "line-through",
            )}
          >
            {character.name}
          </span>
          <span className="text-xs font-medium uppercase text-orange-600 dark:text-orange-400">
            NPC
          </span>
          {acted && !character.defeated && (
            <span className="text-xs text-muted-foreground">✓ Agiu</span>
          )}
        </button>

        <Button
          variant={character.defeated ? "outline" : "ghost"}
          size="icon-xs"
          onClick={onToggleDefeated}
          aria-label={
            character.defeated ? "Restaurar NPC" : "Marcar como derrotado"
          }
        >
          <Skull className={cn(character.defeated && "text-destructive")} />
        </Button>
      </div>

      {/* Resource row: guard, vitality, defense */}
      {!character.defeated && (
        <div className="flex items-center gap-4">
          <ResourceInput
            icon={<Shield className="size-4 text-blue-500" />}
            label="Guarda"
            value={character.guard}
            onChange={onUpdateGuard}
          />
          <ResourceInput
            icon={<Heart className="size-4 text-red-500" />}
            label="Vitalidade"
            value={character.vitality}
            onChange={onUpdateVitality}
          />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Def</span>
            <span className="font-semibold text-foreground">
              {character.defense}
            </span>
          </div>
        </div>
      )}

      {/* Action tracker — only visible when NPC is in active turn and has acted */}
      {isInActiveTurn && acted && !character.defeated && (
        <ActionTracker
          turnType={turnType}
          usedActions={usedActions}
          usedReaction={usedReaction}
          onToggleAction={handleToggleAction}
          onToggleReaction={() => setUsedReaction((v) => !v)}
        />
      )}

      {/* Conditions */}
      {!character.defeated && (
        <div className="flex items-center gap-2">
          <ConditionBadges
            conditions={conditions}
            onRemove={onRemoveCondition}
          />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              onAddCondition();
            }}
            aria-label="Adicionar condição"
          >
            <Plus className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

function ResourceInput({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-7 w-16 px-2 text-sm"
        aria-label={label}
      />
    </div>
  );
}
