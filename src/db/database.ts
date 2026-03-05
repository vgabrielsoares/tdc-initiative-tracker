import Dexie, { type Table } from "dexie";
import type { Combat } from "@/types/combat";
import type { Character, SavedCharacter } from "@/types/character";
import type { AppliedCondition } from "@/types/conditions";

class TDCDatabase extends Dexie {
  combats!: Table<Combat>;
  characters!: Table<Character>;
  conditions!: Table<AppliedCondition>;
  savedCharacters!: Table<SavedCharacter>;

  constructor() {
    super("tdc-initiative-tracker");
    this.version(1).stores({
      combats: "id",
      characters: "id, combatId",
      conditions: "id, characterId",
    });
    this.version(2).stores({
      combats: "id",
      characters: "id, combatId",
      conditions: "id, characterId",
      savedCharacters: "id",
    });
  }
}

export const db = new TDCDatabase();
