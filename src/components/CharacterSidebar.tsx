import { useState } from "react";
import { Shield, Heart, Skull, Plus, Edit2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConditionBadges } from "@/components/ConditionBadges";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import type {
  Character,
  NpcCharacter,
  CharacterUpdateData,
} from "@/types/character";
import type { AppliedCondition } from "@/types/conditions";

interface CharacterSidebarProps {
  characters: Character[];
  conditions: AppliedCondition[];
  npcReactions: Record<string, boolean>;
  onUpdateCharacter: (id: string, updates: CharacterUpdateData) => void;
  onToggleNPCReaction: (characterId: string) => void;
  onAddCondition: (characterId: string) => void;
  onRemoveCondition: (conditionId: string) => void;
}

export function CharacterSidebar({
  characters,
  conditions,
  npcReactions,
  onUpdateCharacter,
  onToggleNPCReaction,
  onAddCondition,
  onRemoveCondition,
}: CharacterSidebarProps) {
  const pjs = characters.filter((c) => c.role === "pj");
  const npcs = characters.filter((c) => c.role === "npc");
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
