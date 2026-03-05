import { db } from "./database";
import type { Combat } from "@/types/combat";
import type { Character, SavedCharacter } from "@/types/character";
import type { AppliedCondition } from "@/types/conditions";

export function persistCombat(combat: Combat) {
  return db.combats.put(combat);
}

export function persistCharacter(character: Character) {
  return db.characters.put(character);
}

export async function deletePersistedCharacter(id: string) {
  await db.transaction("rw", [db.characters, db.conditions], async () => {
    await db.conditions.where("characterId").equals(id).delete();
    await db.characters.delete(id);
  });
}

export function persistCondition(condition: AppliedCondition) {
  return db.conditions.put(condition);
}

export function deletePersistedCondition(id: string) {
  return db.conditions.delete(id);
}

export function persistConditionsBulk(conditions: AppliedCondition[]) {
  return db.conditions.bulkPut(conditions);
}

export function deletePersistedConditionsBulk(ids: string[]) {
  return db.conditions.bulkDelete(ids);
}

export async function loadCombatData(combatId: string) {
  const combat = await db.combats.get(combatId);
  if (!combat) return null;

  const characters = await db.characters
    .where("combatId")
    .equals(combatId)
    .toArray();

  const characterIds = characters.map((c) => c.id);
  const conditions =
    characterIds.length > 0
      ? await db.conditions.where("characterId").anyOf(characterIds).toArray()
      : [];

  return { combat, characters, conditions };
}

export function persistSavedCharacter(character: SavedCharacter) {
  return db.savedCharacters.put(character);
}

export function deletePersistedSavedCharacter(id: string) {
  return db.savedCharacters.delete(id);
}

export async function loadAllSavedCharacters(): Promise<SavedCharacter[]> {
  return db.savedCharacters.toArray();
}
