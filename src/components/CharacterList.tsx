import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Character } from "@/types/character";

interface CharacterListProps {
  characters: Character[];
  onEdit: (character: Character) => void;
  onRemove: (id: string) => void;
}

export function CharacterList({
  characters,
  onEdit,
  onRemove,
}: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        Nenhum personagem cadastrado. Adicione PJs e NPCs para começar.
      </p>
    );
  }

  const pjs = characters.filter((c) => c.role === "pj");
  const npcs = characters.filter((c) => c.role === "npc");

  return (
    <div className="flex flex-col gap-4">
      {pjs.length > 0 && (
        <CharacterGroup
          title="PJs - Personagens Jogadores"
          characters={pjs}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      )}
      {npcs.length > 0 && (
        <CharacterGroup
          title="NPCs"
          characters={npcs}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      )}
    </div>
  );
}

function CharacterGroup({
  title,
  characters,
  onEdit,
  onRemove,
}: {
  title: string;
  characters: Character[];
  onEdit: (character: Character) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {characters.map((character) => (
          <CharacterRow
            key={character.id}
            character={character}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

function CharacterRow({
  character,
  onEdit,
  onRemove,
}: {
  character: Character;
  onEdit: (character: Character) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex items-center gap-3">
        <span className="font-medium">{character.name}</span>
        {character.role === "npc" && (
          <span className="text-xs text-muted-foreground">
            🛡 {character.guard} &nbsp; ❤ {character.vitality} &nbsp; Def{" "}
            {character.defense}
          </span>
        )}
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onEdit(character)}
          aria-label="Editar"
        >
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onRemove(character.id)}
          aria-label="Remover"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
