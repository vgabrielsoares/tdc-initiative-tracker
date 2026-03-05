import { cn } from "@/lib/utils";
import { NPCCard } from "@/components/NPCCard";
import type { Character } from "@/types/character";
import type { TurnType } from "@/types/combat";

interface CombatOrderProps {
  availableCharacters: Character[];
  actedCharacterIds: string[];
  turnType: TurnType;
  onToggle: (characterId: string) => void;
  onUpdateCharacter: (
    id: string,
    updates: { guard?: number; vitality?: number; defeated?: boolean },
  ) => void;
}

export function CombatOrder({
  availableCharacters,
  actedCharacterIds,
  turnType,
  onToggle,
  onUpdateCharacter,
}: CombatOrderProps) {
  const actedSet = new Set(actedCharacterIds);

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

        if (character.role === "npc") {
          return (
            <NPCCard
              key={character.id}
              character={character}
              acted={acted}
              isInActiveTurn={true}
              turnType={turnType}
              onToggle={() => onToggle(character.id)}
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
            />
          );
        }

        return (
          <button
            key={character.id}
            type="button"
            onClick={() => onToggle(character.id)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border-2 px-4 py-3 text-left transition-colors",
              acted
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-semibold">{character.name}</span>
              <span className="text-xs font-medium uppercase text-blue-600 dark:text-blue-400">
                PJ
              </span>
            </div>
            {acted && (
              <span className="text-xs text-muted-foreground">
                ✓ Agiu nesta fase
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
