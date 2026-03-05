export type CharacterRole = "pj" | "npc";

interface BaseCharacter {
  id: string;
  name: string;
  combatId: string;
}

export interface PjCharacter extends BaseCharacter {
  role: "pj";
}

export interface NpcCharacter extends BaseCharacter {
  role: "npc";
  guard: number;
  vitality: number;
  defense: number;
  defeated: boolean;
}

export type Character = PjCharacter | NpcCharacter;

export type NewCharacterData =
  | Omit<PjCharacter, "id" | "combatId">
  | Omit<NpcCharacter, "id" | "combatId" | "defeated">;

export type CharacterUpdateData = {
  name?: string;
  guard?: number;
  vitality?: number;
  defense?: number;
  defeated?: boolean;
};
