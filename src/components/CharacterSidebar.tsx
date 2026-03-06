import { useState } from "react";
import {
  Shield,
  Heart,
  Skull,
  Plus,
  Edit2,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Clock,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConditionBadges } from "@/components/ConditionBadges";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import type {
  Character,
  CharacterRole,
  NpcCharacter,
  CharacterUpdateData,
  NewCharacterData,
  SavedCharacter,
} from "@/types/character";
import type { AppliedCondition } from "@/types/conditions";

interface CharacterSidebarProps {
  characters: Character[];
  conditions: AppliedCondition[];
  npcReactions: Record<string, boolean>;
  pendingCharacterIds?: string[];
  savedCharacters?: SavedCharacter[];
  onUpdateCharacter: (id: string, updates: CharacterUpdateData) => void;
  onToggleNPCReaction: (characterId: string) => void;
  onAddCondition: (characterId: string) => void;
  onRemoveCondition: (conditionId: string) => void;
  onAddPendingCharacter?: (data: NewCharacterData) => void;
  onRemovePendingCharacter?: (id: string) => void;
  onAddSavedCharacter?: (data: Omit<SavedCharacter, "id">) => void;
}

export function CharacterSidebar({
  characters,
  conditions,
  npcReactions,
  pendingCharacterIds = [],
  savedCharacters = [],
  onUpdateCharacter,
  onToggleNPCReaction,
  onAddCondition,
  onRemoveCondition,
  onAddPendingCharacter,
  onRemovePendingCharacter,
  onAddSavedCharacter,
}: CharacterSidebarProps) {
  const pendingSet = new Set(pendingCharacterIds);
  const activeCharacters = characters.filter((c) => !pendingSet.has(c.id));
  const pendingCharacters = characters.filter((c) => pendingSet.has(c.id));

  const pjs = activeCharacters.filter((c) => c.role === "pj");
  const npcs = activeCharacters.filter((c) => c.role === "npc");
  const activeNpcs = npcs.filter((c) => !(c as NpcCharacter).defeated);
  const defeatedNpcs = npcs.filter((c) => (c as NpcCharacter).defeated);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-bold">Personagens</h2>

      {pjs.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            PJs ({pjs.length})
          </h3>
          {pjs.map((pj) => {
            const charConds = conditions.filter((c) => c.characterId === pj.id);
            return (
              <div
                key={pj.id}
                className="flex flex-col gap-1.5 rounded-md border bg-background px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{pj.name}</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    PJ
                  </span>
                </div>
                {charConds.length > 0 && (
                  <ConditionBadges
                    conditions={charConds}
                    onRemove={onRemoveCondition}
                  />
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  className="self-start"
                  onClick={() => onAddCondition(pj.id)}
                >
                  <Plus className="size-3" />
                  Condição
                </Button>
              </div>
            );
          })}
        </section>
      )}

      {activeNpcs.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            NPCs ({activeNpcs.length})
          </h3>
          {activeNpcs.map((npc) => (
            <SidebarNPCCard
              key={npc.id}
              character={npc as NpcCharacter}
              conditions={conditions.filter((c) => c.characterId === npc.id)}
              usedReaction={npcReactions[npc.id] ?? false}
              onUpdateCharacter={(updates) =>
                onUpdateCharacter(npc.id, updates)
              }
              onToggleReaction={() => onToggleNPCReaction(npc.id)}
              onAddCondition={() => onAddCondition(npc.id)}
              onRemoveCondition={onRemoveCondition}
            />
          ))}
        </section>
      )}

      {defeatedNpcs.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Derrotados ({defeatedNpcs.length})
          </h3>
          {defeatedNpcs.map((npc) => (
            <div
              key={npc.id}
              className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2 opacity-60"
            >
              <span className="text-sm line-through">{npc.name}</span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onUpdateCharacter(npc.id, { defeated: false })}
              >
                Restaurar
              </Button>
            </div>
          ))}
        </section>
      )}

      {characters.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum personagem no combate.
        </p>
      )}

      {/* Pending characters section */}
      {pendingCharacters.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Clock className="size-3.5" />
            Aguardando próxima rodada ({pendingCharacters.length})
          </h3>
          {pendingCharacters.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border border-dashed border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="size-3 shrink-0 text-amber-500" />
                <span className="text-sm font-medium truncate">{c.name}</span>
                <span className="shrink-0 text-xs font-medium uppercase text-muted-foreground">
                  {c.role}
                </span>
              </div>
              {onRemovePendingCharacter && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onRemovePendingCharacter(c.id)}
                  aria-label="Remover personagem pendente"
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Add character panel */}
      {onAddPendingCharacter && (
        <AddCharacterPanel
          savedCharacters={savedCharacters}
          onAddCharacter={onAddPendingCharacter}
          onAddSavedCharacter={onAddSavedCharacter}
        />
      )}
    </div>
  );
}

function SidebarNPCCard({
  character,
  conditions,
  usedReaction,
  onUpdateCharacter,
  onToggleReaction,
  onAddCondition,
  onRemoveCondition,
}: {
  character: NpcCharacter;
  conditions: AppliedCondition[];
  usedReaction: boolean;
  onUpdateCharacter: (updates: CharacterUpdateData) => void;
  onToggleReaction: () => void;
  onAddCondition: () => void;
  onRemoveCondition: (id: string) => void;
}) {
  const [defeatOpen, setDefeatOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState(character.name);

  return (
    <div className="flex flex-col gap-1.5 rounded-md border bg-gradient-to-br from-background to-muted/20 px-3 py-2.5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between gap-2">
        {editingName ? (
          <input
            type="text"
            autoFocus
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={() => {
              if (editedName.trim() && editedName !== character.name) {
                onUpdateCharacter({ name: editedName });
              }
              setEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="flex-1 px-2 py-1 text-sm font-semibold bg-background border border-input rounded"
          />
        ) : (
          <>
            <span className="text-sm font-semibold flex-1 truncate">
              {character.name}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setEditingName(true)}
              className="shrink-0"
              aria-label="Editar nome"
            >
              <Edit2 className="size-3" />
            </Button>
          </>
        )}
        <span className="shrink-0 text-xs font-medium text-orange-600 dark:text-orange-400">
          NPC
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Shield className="size-3.5 text-blue-500" />
          <Input
            type="number"
            min={0}
            value={character.guard}
            onChange={(e) =>
              onUpdateCharacter({ guard: Number(e.target.value) })
            }
            className="h-6 w-14 px-1.5 text-xs"
            aria-label="Guarda"
          />
        </div>
        <div className="flex items-center gap-1">
          <Heart className="size-3.5 text-red-500" />
          <Input
            type="number"
            min={0}
            value={character.vitality}
            onChange={(e) =>
              onUpdateCharacter({ vitality: Number(e.target.value) })
            }
            className="h-6 w-14 px-1.5 text-xs"
            aria-label="Vitalidade"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Def{" "}
          <span className="font-semibold text-foreground">
            {character.defense}
          </span>
        </span>
      </div>

      {conditions.length > 0 && (
        <ConditionBadges conditions={conditions} onRemove={onRemoveCondition} />
      )}

      {/* Reaction button - always visible */}
      <div className="flex items-center gap-2 rounded-md bg-gradient-to-r from-secondary/50 to-secondary/30 px-2 py-1.5 border border-secondary/40">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Reação:
        </span>
        <button
          type="button"
          onClick={onToggleReaction}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 shadow-sm",
            usedReaction
              ? "bg-muted text-muted-foreground opacity-50"
              : "bg-amber-500 text-white hover:bg-amber-600 hover:shadow hover:scale-105",
          )}
          aria-label={`Reação${usedReaction ? " (usada)" : ""}`}
        >
          <RotateCw className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="xs"
          className="self-start"
          onClick={onAddCondition}
        >
          <Plus className="size-3" />
          Condição
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="text-destructive hover:text-destructive"
          onClick={() => setDefeatOpen(true)}
        >
          <Skull className="size-3" />
          Derrotar
        </Button>
      </div>

      <ConfirmationModal
        open={defeatOpen}
        onOpenChange={setDefeatOpen}
        title="Derrotar NPC?"
        description={`${character.name} será marcado como derrotado e removido da ordem de combate.`}
        confirmLabel="Derrotar"
        variant="destructive"
        onConfirm={() => onUpdateCharacter({ defeated: true })}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible panel for adding characters mid-combat
// ---------------------------------------------------------------------------

// Collapsible panel for adding characters mid-combat
// ---------------------------------------------------------------------------

function AddCharacterPanel({
  savedCharacters,
  onAddCharacter,
  onAddSavedCharacter,
}: {
  savedCharacters: SavedCharacter[];
  onAddCharacter: (data: NewCharacterData) => void;
  onAddSavedCharacter?: (data: Omit<SavedCharacter, "id">) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<CharacterRole>("npc");
  const [guard, setGuard] = useState(0);
  const [vitality, setVitality] = useState(0);
  const [defense, setDefense] = useState(0);

  function resetForm() {
    setName("");
    setRole("npc");
    setGuard(0);
    setVitality(0);
    setDefense(0);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const data: NewCharacterData =
      role === "npc"
        ? { role: "npc", name: trimmedName, guard, vitality, defense }
        : { role: "pj", name: trimmedName };

    onAddCharacter(data);

    // Auto-save to library
    if (onAddSavedCharacter) {
      const exists = savedCharacters.some(
        (s) => s.name === trimmedName && s.role === role,
      );
      if (!exists) {
        if (role === "npc") {
          onAddSavedCharacter({
            name: trimmedName,
            role: "npc",
            guard,
            vitality,
            defense,
          });
        } else {
          onAddSavedCharacter({ name: trimmedName, role: "pj" });
        }
      }
    }

    resetForm();
  }

  function handleImportSaved(saved: SavedCharacter) {
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
    onAddCharacter(data);
  }

  return (
    <div className="border-t mt-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <UserPlus className="size-3.5" />
          Adicionar ao Combate
        </span>
        {expanded ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronUp className="size-4" />
        )}
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 px-4 pb-4">
          <p className="text-xs text-muted-foreground">
            Personagens adicionados entram no início da próxima rodada.
          </p>

          {/* Saved characters quick-add */}
          {savedCharacters.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">
                Biblioteca
              </span>
              <div className="max-h-32 overflow-y-auto flex flex-col gap-1">
                {savedCharacters.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-center justify-between rounded-md border bg-background px-2 py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-medium truncate">
                        {saved.name}
                      </span>
                      <span className="shrink-0 text-[10px] font-medium uppercase text-muted-foreground">
                        {saved.role}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      className="h-6 text-xs"
                      onClick={() => handleImportSaved(saved)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline form toggle */}
          {!showForm ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowForm(true)}
            >
              <Plus className="size-3.5" />
              Criar Novo
            </Button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 rounded-md border bg-background p-3"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pending-name" className="text-xs">
                  Nome
                </Label>
                <Input
                  id="pending-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do personagem"
                  className="h-7 text-xs"
                  autoFocus
                />
              </div>

              <div className="flex gap-1.5">
                <Button
                  type="button"
                  variant={role === "pj" ? "default" : "outline"}
                  size="xs"
                  onClick={() => setRole("pj")}
                >
                  PJ
                </Button>
                <Button
                  type="button"
                  variant={role === "npc" ? "default" : "outline"}
                  size="xs"
                  onClick={() => setRole("npc")}
                >
                  NPC
                </Button>
              </div>

              {role === "npc" && (
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="pending-guard"
                      className="flex items-center gap-1 text-[10px]"
                    >
                      <Shield className="size-3 text-blue-500" />
                      Guarda
                    </Label>
                    <Input
                      id="pending-guard"
                      type="number"
                      min={0}
                      value={guard}
                      onChange={(e) => setGuard(Number(e.target.value))}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="pending-vitality"
                      className="flex items-center gap-1 text-[10px]"
                    >
                      <Heart className="size-3 text-red-500" />
                      Vitalidade
                    </Label>
                    <Input
                      id="pending-vitality"
                      type="number"
                      min={0}
                      value={vitality}
                      onChange={(e) => setVitality(Number(e.target.value))}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="pending-defense" className="text-[10px]">
                      Defesa
                    </Label>
                    <Input
                      id="pending-defense"
                      type="number"
                      min={0}
                      value={defense}
                      onChange={(e) => setDefense(Number(e.target.value))}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-1.5 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="xs" disabled={!name.trim()}>
                  Adicionar
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
