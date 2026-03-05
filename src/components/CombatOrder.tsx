import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";

interface CombatOrderProps {
  availableCharacters: Character[];
  actedCharacterIds: string[];
  onToggle: (characterId: string) => void;
}

export function CombatOrder({
  availableCharacters,
  actedCharacterIds,
  onToggle,
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
              <span
                className={cn(
                  "text-xs font-medium uppercase",
                  character.role === "pj"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-orange-600 dark:text-orange-400",
                )}
              >
                {character.role === "pj" ? "PJ" : "NPC"}
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
