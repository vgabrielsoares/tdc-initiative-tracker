import { useState } from "react";
import { Plus, Play, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NPCCard } from "@/components/NPCCard";
import { ConditionBadges } from "@/components/ConditionBadges";
import type { Character } from "@/types/character";
import type { CharacterUpdateData } from "@/types/character";
import type { AppliedCondition } from "@/types/conditions";
import type { TurnType } from "@/types/combat";

interface CombatOrderProps {
  availableCharacters: Character[];
  actedCharacterIds: string[];
  turnType: TurnType;
  conditions: AppliedCondition[];
  npcReactions: Record<string, boolean>;
  onToggle: (characterId: string) => void;
  onToggleNPCReaction: (characterId: string) => void;
  onUpdateCharacter: (id: string, updates: CharacterUpdateData) => void;
  onAddCondition: (characterId: string) => void;
  onRemoveCondition: (conditionId: string) => void;
}

export function CombatOrder({
  availableCharacters,
  actedCharacterIds,
  turnType,
  conditions,
  npcReactions,
  onToggle,
  onToggleNPCReaction,
  onUpdateCharacter,
  onAddCondition,
  onRemoveCondition,
}: CombatOrderProps) {
  const actedSet = new Set(actedCharacterIds);
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  if (availableCharacters.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Nenhum personagem disponível nesta fase.
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {availableCharacters.map((character) => {
        const acted = actedSet.has(character.id);

        const charConditions = conditions.filter(
          (c) => c.characterId === character.id,
        );

        if (character.role === "npc") {
          return (
            <NPCCard
              key={character.id}
              character={character}
              acted={acted}
              isInActiveTurn={true}
              turnType={turnType}
              conditions={charConditions}
              usedReaction={npcReactions[character.id] ?? false}
              onToggle={() => onToggle(character.id)}
              onToggleReaction={() => onToggleNPCReaction(character.id)}
              onUpdateGuard={(v) =>
                onUpdateCharacter(character.id, { guard: v })
              }
              onUpdateVitality={(v) =>
                onUpdateCharacter(character.id, { vitality: v })
              }
              onToggleDefeated={() =>
                onUpdateCharacter(character.id, {
                  defeated: !character.defeated,
                })
              }
              onUpdateName={(name) => onUpdateCharacter(character.id, { name })}
              onAddCondition={() => onAddCondition(character.id)}
              onRemoveCondition={onRemoveCondition}
            />
          );
        }

        const isEditing = editingIds.has(character.id);
        const displayName = editedNames[character.id] ?? character.name;

        return (
          <div
            key={character.id}
            className={cn(
              "flex flex-col gap-2 rounded-lg border-2 px-4 py-3 transition-all duration-200",
              acted
                ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm"
                : "border-border bg-gradient-to-br from-card to-background hover:shadow-md",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={displayName}
                    onChange={(e) =>
                      setEditedNames((prev) => ({
                        ...prev,
                        [character.id]: e.target.value,
                      }))
                    }
                    onBlur={() => {
                      if (
                        displayName.trim() &&
                        displayName !== character.name
                      ) {
                        onUpdateCharacter(character.id, { name: displayName });
                      }
                      setEditingIds((prev) => {
                        const next = new Set(prev);
                        next.delete(character.id);
                        return next;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    className="flex-1 min-w-0 px-2 py-1 text-sm font-semibold bg-background border border-input rounded"
                  />
                ) : (
                  <>
                    <span className="font-semibold truncate">
                      {displayName}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setEditingIds(
                          (prev) => new Set([...prev, character.id]),
                        )
                      }
                      className="shrink-0"
                      aria-label="Editar nome"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                  </>
                )}
                <span className="shrink-0 text-xs font-medium uppercase text-blue-600 dark:text-blue-400">
                  PJ
                </span>
              </div>
              <Button
                variant={acted ? "secondary" : "default"}
                size="sm"
                onClick={() => onToggle(character.id)}
                className="shrink-0 gap-1.5"
              >
                <Play className="size-4" fill="currentColor" />
                {acted ? "Desfazer" : "Agir"}
              </Button>
            </div>
            {charConditions.length > 0 && (
              <ConditionBadges
                conditions={charConditions}
                onRemove={onRemoveCondition}
              />
            )}
            <Button
              variant="outline"
              size="xs"
              onClick={() => onAddCondition(character.id)}
              className="self-start gap-1"
            >
              <Plus className="size-3" />
              Condição
            </Button>
          </div>
        );
      })}
    </div>
  );
}
