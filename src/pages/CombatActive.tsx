import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Flag,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CombatOrder } from "@/components/CombatOrder";
import { CharacterSidebar } from "@/components/CharacterSidebar";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ConditionPicker } from "@/components/ConditionPicker";
import { useCombatStore } from "@/store/combatStore";
import { PHASE_CONFIG } from "@/types/combat";
import type { ConditionName } from "@/types/conditions";
import {
  getAvailableCharacters,
  isLastPhase,
  isFirstPhase,
} from "@/utils/combatLogic";

export function CombatActive() {
  const {
    combat,
    characters,
    conditions,
    npcReactions,
    toggleCharacterActed,
    toggleNPCReaction,
    updateCharacter,
    addCondition,
    removeCondition,
    advancePhase,
    goToPreviousPhase,
    advanceRound,
    endCombat,
  } = useCombatStore();

  const [endPhaseOpen, setEndPhaseOpen] = useState(false);
  const [endRoundOpen, setEndRoundOpen] = useState(false);
  const [endCombatOpen, setEndCombatOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conditionPickerCharId, setConditionPickerCharId] = useState<
    string | null
  >(null);

  if (!combat) return null;

  const phaseConfig = PHASE_CONFIG[combat.currentPhase];
  const available = getAvailableCharacters(
    combat.currentPhase,
    characters,
    combat.fastTurnCharacterIds,
  );
  const actedCount = combat.actedCharacterIds.length;
  const lastPhase = isLastPhase(combat.currentPhase);
  const firstPhase = isFirstPhase(combat.currentPhase);
  const noOneActed = actedCount === 0;

  function handleEndPhaseClick() {
    if (lastPhase) {
      setEndRoundOpen(true);
    } else {
      setEndPhaseOpen(true);
    }
  }

  function handleConfirmEndPhase() {
    advancePhase();
  }

  function handleConfirmEndRound() {
    advanceRound();
  }

  function handleGoBack() {
    goToPreviousPhase();
  }

  function handleEndCombat() {
    endCombat();
  }

  function handleApplyCondition(
    conditionName: ConditionName,
    remainingTurns?: number,
  ) {
    if (!conditionPickerCharId) return;
    addCondition(conditionPickerCharId, conditionName, remainingTurns);
  }

  const pickerCharacter = conditionPickerCharId
    ? characters.find((c) => c.id === conditionPickerCharId)
    : null;

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)]">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex flex-col gap-6">
            {/* Header: round & phase info */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Combate Ativo</h1>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-secondary px-3 py-1 text-sm font-semibold">
                  Rodada {combat.currentRound}
                </span>
                <span className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                  {phaseConfig.label}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Abrir painel de personagens"
                >
                  <Users className="size-4" />
                </Button>
              </div>
            </div>

            {/* Phase info */}
            <div className="text-sm text-muted-foreground">
              {phaseConfig.turnType === "fast"
                ? "Turno Rápido - 2 ações"
                : "Turno Lento - 3 ações"}
              {" · "}
              {actedCount} de {available.length} personagem(ns) agiram
            </div>

            {/* Character selection grid */}
            <CombatOrder
              availableCharacters={available}
              actedCharacterIds={combat.actedCharacterIds}
              turnType={phaseConfig.turnType}
              conditions={conditions}
              npcReactions={npcReactions}
              onToggle={toggleCharacterActed}
              onToggleNPCReaction={toggleNPCReaction}
              onUpdateCharacter={updateCharacter}
              onAddCondition={setConditionPickerCharId}
              onRemoveCondition={removeCondition}
            />

            {/* Action bar */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex gap-2">
                {noOneActed && !firstPhase && (
                  <Button variant="outline" size="sm" onClick={handleGoBack}>
                    <ChevronLeft />
                    Fase Anterior
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEndCombatOpen(true)}
                >
                  <Flag />
                  Encerrar Combate
                </Button>

                <Button size="sm" onClick={handleEndPhaseClick}>
                  {lastPhase ? (
                    <>
                      <RotateCcw />
                      Encerrar Rodada
                    </>
                  ) : (
                    <>
                      Encerrar Fase
                      <ChevronRight />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 border-l bg-card overflow-y-auto">
        <CharacterSidebar
          characters={characters}
          conditions={conditions}
          npcReactions={npcReactions}
          onUpdateCharacter={updateCharacter}
          onToggleNPCReaction={toggleNPCReaction}
          onAddCondition={setConditionPickerCharId}
          onRemoveCondition={removeCondition}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-14 bottom-0 right-0 z-50 w-80 bg-card border-l overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="font-semibold text-sm">Personagens</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <CharacterSidebar
              characters={characters}
              conditions={conditions}
              npcReactions={npcReactions}
              onUpdateCharacter={updateCharacter}
              onToggleNPCReaction={toggleNPCReaction}
              onAddCondition={setConditionPickerCharId}
              onRemoveCondition={removeCondition}
            />
          </aside>
        </>
      )}

      {/* End phase confirmation */}
      <ConfirmationModal
        open={endPhaseOpen}
        onOpenChange={setEndPhaseOpen}
        title="Encerrar Fase?"
        description={
          noOneActed
            ? "Nenhum personagem agiu nesta fase. Deseja encerrar mesmo assim?"
            : `${actedCount} personagem(ns) agiram nesta fase. Confirma o encerramento?`
        }
        confirmLabel="Encerrar Fase"
        onConfirm={handleConfirmEndPhase}
      />

      {/* End round confirmation */}
      <ConfirmationModal
        open={endRoundOpen}
        onOpenChange={setEndRoundOpen}
        title="Encerrar Rodada?"
        description={`Fim da Rodada ${combat.currentRound}. Todos os personagens terão sua disponibilidade resetada para a próxima rodada.`}
        confirmLabel="Próxima Rodada"
        onConfirm={handleConfirmEndRound}
      />

      {/* End combat confirmation */}
      <ConfirmationModal
        open={endCombatOpen}
        onOpenChange={setEndCombatOpen}
        title="Encerrar Combate?"
        description="O combate será finalizado. Esta ação não pode ser desfeita."
        confirmLabel="Encerrar"
        variant="destructive"
        onConfirm={handleEndCombat}
      />

      {/* Condition picker */}
      <ConditionPicker
        open={conditionPickerCharId !== null}
        onOpenChange={(open) => {
          if (!open) setConditionPickerCharId(null);
        }}
        characterName={pickerCharacter?.name ?? ""}
        onApply={handleApplyCondition}
      />
    </div>
  );
}
