import { useCombatStore } from "@/store/combatStore";
import { PHASE_CONFIG } from "@/types/combat";

export function CombatActive() {
  const { combat } = useCombatStore();

  if (!combat) return null;

  const phaseConfig = PHASE_CONFIG[combat.currentPhase];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Combate Ativo</h1>
          <div className="flex items-center gap-4">
            <span className="rounded-md bg-secondary px-3 py-1 text-sm font-semibold">
              Rodada {combat.currentRound}
            </span>
            <span className="rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
              {phaseConfig.label}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-center py-12">
          Motor de combate será implementado na Fase 4.
        </p>
      </div>
    </div>
  );
}
