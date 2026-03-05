import { useState } from "react";
import { Plus, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterForm } from "@/components/CharacterForm";
import { CharacterList } from "@/components/CharacterList";
import { useCombatStore } from "@/store/combatStore";
import type { Character, NewCharacterData } from "@/types/character";

export function CombatSetup() {
  const {
    combat,
    characters,
    addCharacter,
    updateCharacter,
    removeCharacter,
    startCombat,
  } = useCombatStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<
    Character | undefined
  >();

  function handleAddCharacter(data: NewCharacterData) {
    addCharacter(data);
  }

  function handleEditCharacter(character: Character) {
    setEditingCharacter(character);
    setFormOpen(true);
  }

  function handleUpdateCharacter(
    id: string,
    updates: {
      name: string;
      guard?: number;
      vitality?: number;
      defense?: number;
    },
  ) {
    updateCharacter(id, updates);
    setEditingCharacter(undefined);
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingCharacter(undefined);
  }

  function handleStartCombat() {
    startCombat();
  }

  if (!combat) return null;

  const hasCharacters = characters.length > 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Preparação de Combate</h1>
          <Button
            size="sm"
            onClick={() => {
              setEditingCharacter(undefined);
              setFormOpen(true);
            }}
          >
            <Plus />
            Adicionar Personagem
          </Button>
        </div>

        <CharacterList
          characters={characters}
          onEdit={handleEditCharacter}
          onRemove={removeCharacter}
        />

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            disabled={!hasCharacters}
            onClick={handleStartCombat}
          >
            <Swords />
            Iniciar Combate
          </Button>
        </div>
      </div>

      <CharacterForm
        open={formOpen}
        onOpenChange={handleOpenChange}
        onSubmit={handleAddCharacter}
        editingCharacter={editingCharacter}
        onUpdate={handleUpdateCharacter}
      />
    </div>
  );
}
