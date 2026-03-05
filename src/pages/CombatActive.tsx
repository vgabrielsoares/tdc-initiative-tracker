import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CombatOrder } from "@/components/CombatOrder";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useCombatStore } from "@/store/combatStore";
import { PHASE_CONFIG } from "@/types/combat";
import {
  getAvailableCharacters,
  isLastPhase,
  isFirstPhase,
} from "@/utils/combatLogic";

export function CombatActive() {
  const {
    combat,
    characters,
    toggleCharacterActed,
    updateCharacter,
    advancePhase,
    goToPreviousPhase,
    advanceRound,
    endCombat,
  } = useCombatStore();

  const [endPhaseOpen, setEndPhaseOpen] = useState(false);
  const [endRoundOpen, setEndRoundOpen] = useState(false);
  const [endCombatOpen, setEndCombatOpen] = useState(false);

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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header: round & phase info */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Combate Ativo</h1>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-secondary px-3 py-1 text-sm font-semibold">
              Rodada {combat.currentRound}
            </span>
            <span className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
              {phaseConfig.label}
            </span>
          </div>
        </div>

        {/* Phase info */}
        <div className="text-sm text-muted-foreground">
          {phaseConfig.turnType === "fast"
            ? "▶▶ Turno Rápido — 2 ações"
            : "▶▶▶ Turno Lento — 3 ações"}
          {" · "}
          {actedCount} de {available.length} personagem(ns) agiram
        </div>

        {/* Character selection grid */}
        <CombatOrder
          availableCharacters={available}
          actedCharacterIds={combat.actedCharacterIds}
          turnType={phaseConfig.turnType}
          onToggle={toggleCharacterActed}
          onUpdateCharacter={updateCharacter}
        />

        {/* Action bar */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex gap-2">
            {/* Go back to previous phase (only if no one acted & not first phase) */}
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
    </div>
  );
}
