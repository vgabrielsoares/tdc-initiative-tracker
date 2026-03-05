import type { Character } from "@/types/character";
import type { Phase } from "@/types/combat";
import { PHASE_ORDER, PHASE_CONFIG } from "@/types/combat";

/**
 * Returns characters available for selection in the given phase.
 * Filters by role match, excludes defeated NPCs, and excludes
 * characters who already acted in a fast-turn phase.
 */
export function getAvailableCharacters(
  phase: Phase,
  characters: Character[],
  fastTurnCharacterIds: string[],
): Character[] {
  const config = PHASE_CONFIG[phase];
  const fastSet = new Set(fastTurnCharacterIds);

  return characters.filter((c) => {
    if (c.role !== config.role) return false;
    if (c.role === "npc" && c.defeated) return false;
    // In slow phases, exclude characters who already acted in the fast phase
    if (config.turnType === "slow" && fastSet.has(c.id)) return false;
    return true;
  });
}

/**
 * Returns the next phase in order, or null if we're at the last phase.
 */
export function getNextPhase(currentPhase: Phase): Phase | null {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  if (idx >= PHASE_ORDER.length - 1) return null;
  return PHASE_ORDER[idx + 1];
}

/**
 * Returns the previous phase in order, or null if we're at the first phase.
 */
export function getPreviousPhase(currentPhase: Phase): Phase | null {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  if (idx <= 0) return null;
  return PHASE_ORDER[idx - 1];
}

/**
 * Checks whether the current phase is the last one in the round.
 */
export function isLastPhase(currentPhase: Phase): boolean {
  return PHASE_ORDER.indexOf(currentPhase) === PHASE_ORDER.length - 1;
}

/**
 * Checks whether the current phase is the first one in the round.
 */
export function isFirstPhase(currentPhase: Phase): boolean {
  return PHASE_ORDER.indexOf(currentPhase) === 0;
}
