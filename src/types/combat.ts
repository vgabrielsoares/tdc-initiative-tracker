import type { CharacterRole } from "./character";

export type TurnType = "fast" | "slow";

export type CombatStatus = "preparing" | "active" | "finished";

export const Phase = {
  PlayerFast: "playerFast",
  NPCFast: "npcFast",
  PlayerSlow: "playerSlow",
  NPCSlow: "npcSlow",
} as const;

export type Phase = (typeof Phase)[keyof typeof Phase];

export const PHASE_ORDER: Phase[] = [
  Phase.PlayerFast,
  Phase.NPCFast,
  Phase.PlayerSlow,
  Phase.NPCSlow,
];

export interface PhaseConfig {
  role: CharacterRole;
  turnType: TurnType;
  label: string;
}

export const PHASE_CONFIG: Record<Phase, PhaseConfig> = {
  [Phase.PlayerFast]: {
    role: "pj",
    turnType: "fast",
    label: "Turno Rápido dos Jogadores",
  },
  [Phase.NPCFast]: {
    role: "npc",
    turnType: "fast",
    label: "Turno Rápido dos NPCs",
  },
  [Phase.PlayerSlow]: {
    role: "pj",
    turnType: "slow",
    label: "Turno Lento dos Jogadores",
  },
  [Phase.NPCSlow]: {
    role: "npc",
    turnType: "slow",
    label: "Turno Lento dos NPCs",
  },
};

export const ACTIONS_PER_TURN: Record<TurnType, number> = {
  fast: 2,
  slow: 3,
};

export interface Combat {
  id: string;
  status: CombatStatus;
  currentRound: number;
  currentPhase: Phase;
  actedCharacterIds: string[];
  fastTurnCharacterIds: string[];
  pendingCharacterIds: string[];
}
