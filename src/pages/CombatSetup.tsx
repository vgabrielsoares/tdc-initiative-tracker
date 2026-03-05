import { useState } from "react";
import { Plus, Swords, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterForm } from "@/components/CharacterForm";
import { CharacterList } from "@/components/CharacterList";
import { useCombatStore } from "@/store/combatStore";
import type { Character, NewCharacterData } from "@/types/character";

export function CombatSetup() {
  const {
    combat,
    characters,
    savedCharacters,
    addCharacter,
    updateCharacter,
    removeCharacter,
    addSavedCharacter,
    removeSavedCharacter,
    startCombat,
  } = useCombatStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<
    Character | undefined
  >();

  function handleAddCharacter(data: NewCharacterData) {
    addCharacter(data);
    // Auto-save to library if not already there
    const exists = savedCharacters.some(
      (s) => s.name === data.name && s.role === data.role,
    );
    if (!exists) {
      if (data.role === "npc") {
        addSavedCharacter({
          name: data.name,
          role: "npc",
          guard: data.guard,
          vitality: data.vitality,
          defense: data.defense,
        });
      } else {
        addSavedCharacter({ name: data.name, role: "pj" });
      }
    }
  }

  function handleImportSaved(saved: (typeof savedCharacters)[number]) {
    const data: NewCharacterData =
      saved.role === "npc"
        ? {
            role: "npc",
            name: saved.name,
            guard: saved.guard ?? 0,
            vitality: saved.vitality ?? 0,
            defense: saved.defense ?? 0,
          }
        : { role: "pj", name: saved.name };
    addCharacter(data);
    // No longer preventing duplicates - allow multiple instances
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
            Novo Personagem
          </Button>
        </div>

        {/* Saved characters library */}
        {savedCharacters.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Personagens Salvos
            </h2>
            <div className="flex flex-col gap-1.5">
              {savedCharacters.map((saved) => {
                return (
                  <div
                    key={saved.id}
                    className="flex items-center justify-between rounded-md border bg-gradient-to-r from-card to-background px-3 py-2 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-medium truncate">{saved.name}</span>
                      <span className="shrink-0 text-xs font-medium uppercase text-muted-foreground">
                        {saved.role}
                      </span>
                      {saved.role === "npc" && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          🛡 {saved.guard} ❤ {saved.vitality} Def{" "}
                          {saved.defense}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleImportSaved(saved)}
                      >
                        Adicionar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeSavedCharacter(saved.id)}
                        aria-label="Remover da biblioteca"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
