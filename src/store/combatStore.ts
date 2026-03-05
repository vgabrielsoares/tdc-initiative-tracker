import { create } from "zustand";
import type { Combat } from "@/types/combat";
import { Phase, PHASE_ORDER, PHASE_CONFIG } from "@/types/combat";
import type {
  Character,
  NewCharacterData,
  CharacterUpdateData,
} from "@/types/character";
import type { AppliedCondition, ConditionName } from "@/types/conditions";
import {
  persistCombat,
  persistCharacter,
  deletePersistedCharacter,
  persistCondition,
  deletePersistedCondition,
  persistConditionsBulk,
  deletePersistedConditionsBulk,
  loadCombatData,
} from "@/db/persistence";

// ---------------------------------------------------------------------------
// Store type
// ---------------------------------------------------------------------------

interface CombatState {
  // State
  combat: Combat | null;
  characters: Character[];
  conditions: AppliedCondition[];

  // Combat lifecycle
  createCombat: () => void;
  startCombat: () => void;
  endCombat: () => void;

  // Phase / Round
  advancePhase: () => void;
  goToPreviousPhase: () => void;
  advanceRound: () => void;

  // Characters
  addCharacter: (data: NewCharacterData) => void;
  updateCharacter: (id: string, updates: CharacterUpdateData) => void;
  removeCharacter: (id: string) => void;

  // Turn selection
  toggleCharacterActed: (characterId: string) => void;

  // Conditions
  addCondition: (
    characterId: string,
    conditionName: ConditionName,
    remainingRounds?: number,
  ) => void;
  removeCondition: (conditionId: string) => void;
  decrementConditionDurations: () => void;

  // Persistence
  loadCombat: (combatId: string) => Promise<void>;
  initializeFromDB: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCombatStore = create<CombatState>()((set, get) => ({
  // -- Initial state --------------------------------------------------------
  combat: null,
  characters: [],
  conditions: [],

  // -- Combat lifecycle -----------------------------------------------------

  createCombat: () => {
    const combat: Combat = {
      id: crypto.randomUUID(),
      status: "preparing",
      currentRound: 1,
      currentPhase: Phase.PlayerFast,
      actedCharacterIds: [],
      fastTurnCharacterIds: [],
    };
    set({ combat, characters: [], conditions: [] });
    persistCombat(combat);
    localStorage.setItem("lastCombatId", combat.id);
  },

  startCombat: () => {
    const { combat } = get();
    if (!combat || combat.status !== "preparing") return;

    const updatedCombat: Combat = { ...combat, status: "active" };
    set({ combat: updatedCombat });
    persistCombat(updatedCombat);
  },

  endCombat: () => {
    const { combat } = get();
    if (!combat) return;

    const updatedCombat: Combat = { ...combat, status: "finished" };
    set({ combat: updatedCombat });
    persistCombat(updatedCombat);
  },

  // -- Phase / Round --------------------------------------------------------

  advancePhase: () => {
    const { combat } = get();
    if (!combat) return;

    const currentIndex = PHASE_ORDER.indexOf(combat.currentPhase);
    if (currentIndex >= PHASE_ORDER.length - 1) return;

    const isFastPhase = PHASE_CONFIG[combat.currentPhase].turnType === "fast";
    const nextPhase = PHASE_ORDER[currentIndex + 1];

    const updatedCombat: Combat = {
      ...combat,
      currentPhase: nextPhase,
      actedCharacterIds: [],
      fastTurnCharacterIds: isFastPhase
        ? [...combat.fastTurnCharacterIds, ...combat.actedCharacterIds]
        : combat.fastTurnCharacterIds,
    };

    set({ combat: updatedCombat });
    persistCombat(updatedCombat);
  },

  goToPreviousPhase: () => {
    const { combat, characters } = get();
    if (!combat) return;

    const currentIndex = PHASE_ORDER.indexOf(combat.currentPhase);
    if (currentIndex <= 0) return;

    const previousPhase = PHASE_ORDER[currentIndex - 1];
    const wasPreviousFast = PHASE_CONFIG[previousPhase].turnType === "fast";

    // If going back to a fast phase, remove that phase's role characters
    // from fastTurnCharacterIds so they become available again.
    let { fastTurnCharacterIds } = combat;
    if (wasPreviousFast) {
      const previousRole = PHASE_CONFIG[previousPhase].role;
      const roleCharacterIds = new Set(
        characters.filter((c) => c.role === previousRole).map((c) => c.id),
      );
      fastTurnCharacterIds = fastTurnCharacterIds.filter(
        (id) => !roleCharacterIds.has(id),
      );
    }

    const updatedCombat: Combat = {
      ...combat,
      currentPhase: previousPhase,
      actedCharacterIds: [],
      fastTurnCharacterIds,
    };

    set({ combat: updatedCombat });
    persistCombat(updatedCombat);
  },

  advanceRound: () => {
    const { combat } = get();
    if (!combat) return;

    const updatedCombat: Combat = {
      ...combat,
      currentRound: combat.currentRound + 1,
      currentPhase: Phase.PlayerFast,
      actedCharacterIds: [],
      fastTurnCharacterIds: [],
    };

    set({ combat: updatedCombat });
    persistCombat(updatedCombat);
    get().decrementConditionDurations();
  },

  // -- Characters -----------------------------------------------------------

  addCharacter: (data: NewCharacterData) => {
    const { combat } = get();
    if (!combat) return;

    const character = {
      ...data,
      id: crypto.randomUUID(),
      combatId: combat.id,
      ...(data.role === "npc" ? { defeated: false } : {}),
    } as Character;

    set((state) => ({ characters: [...state.characters, character] }));
    persistCharacter(character);
  },

  updateCharacter: (id: string, updates: CharacterUpdateData) => {
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === id ? ({ ...c, ...updates } as Character) : c,
      ),
    }));
    const updated = get().characters.find((c) => c.id === id);
    if (updated) persistCharacter(updated);
  },

  removeCharacter: (id: string) => {
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== id),
      conditions: state.conditions.filter((c) => c.characterId !== id),
    }));
    deletePersistedCharacter(id);
  },

  // -- Turn selection -------------------------------------------------------

  toggleCharacterActed: (characterId: string) => {
    const { combat } = get();
    if (!combat) return;

    const isActed = combat.actedCharacterIds.includes(characterId);
    const actedCharacterIds = isActed
      ? combat.actedCharacterIds.filter((id) => id !== characterId)
      : [...combat.actedCharacterIds, characterId];

    const updatedCombat: Combat = { ...combat, actedCharacterIds };
    set({ combat: updatedCombat });
    persistCombat(updatedCombat);
  },

  // -- Conditions -----------------------------------------------------------

  addCondition: (
    characterId: string,
    conditionName: ConditionName,
    remainingRounds?: number,
  ) => {
    const condition: AppliedCondition = {
      id: crypto.randomUUID(),
      characterId,
      conditionName,
      remainingRounds,
    };

    set((state) => ({ conditions: [...state.conditions, condition] }));
    persistCondition(condition);
  },

  removeCondition: (conditionId: string) => {
    set((state) => ({
      conditions: state.conditions.filter((c) => c.id !== conditionId),
    }));
    deletePersistedCondition(conditionId);
  },

  decrementConditionDurations: () => {
    const { conditions } = get();
    const kept: AppliedCondition[] = [];
    const expiredIds: string[] = [];

    for (const c of conditions) {
      if (c.remainingRounds === undefined) {
        kept.push(c);
      } else if (c.remainingRounds <= 1) {
        expiredIds.push(c.id);
      } else {
        kept.push({ ...c, remainingRounds: c.remainingRounds - 1 });
      }
    }

    set({ conditions: kept });
    if (kept.length > 0) persistConditionsBulk(kept);
    if (expiredIds.length > 0) deletePersistedConditionsBulk(expiredIds);
  },

  // -- Persistence ----------------------------------------------------------

  loadCombat: async (combatId: string) => {
    const data = await loadCombatData(combatId);
    if (data) {
      set({
        combat: data.combat,
        characters: data.characters,
        conditions: data.conditions,
      });
    }
  },

  initializeFromDB: async () => {
    const lastCombatId = localStorage.getItem("lastCombatId");
    if (lastCombatId) {
      await get().loadCombat(lastCombatId);
    }
  },
}));
