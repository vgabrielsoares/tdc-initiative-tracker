export const ConditionCategory = {
  Corporal: "corporal",
  Mental: "mental",
  Sensorial: "sensorial",
  Espiritual: "espiritual",
} as const;

export type ConditionCategory =
  (typeof ConditionCategory)[keyof typeof ConditionCategory];

export const ConditionName = {
  // Corporais (19)
  Abatido: "Abatido",
  Agarrado: "Agarrado",
  Asfixiado: "Asfixiado",
  Avariado: "Avariado",
  Caido: "Caído",
  Doente: "Doente",
  EmChamas: "Em Chamas",
  Enjoado: "Enjoado",
  Enraizado: "Enraizado",
  Envenenado: "Envenenado",
  Exausto: "Exausto",
  Fraco: "Fraco",
  Invisivel: "Invisível",
  Lento: "Lento",
  Machucado: "Machucado",
  Morrendo: "Morrendo",
  Petrificado: "Petrificado",
  Sangrando: "Sangrando",
  Sobrecarregado: "Sobrecarregado",

  // Mentais (7)
  Abalado: "Abalado",
  Amedrontado: "Amedrontado",
  Enfeiticado: "Enfeitiçado",
  Incapacitado: "Incapacitado",
  Inconsciente: "Inconsciente",
  Perplexo: "Perplexo",
  Perturbado: "Perturbado",

  // Sensoriais (9)
  Atordoado: "Atordoado",
  Cego: "Cego",
  Desequilibrado: "Desequilibrado",
  Desprevenido: "Desprevenido",
  Fotossensivel: "Fotossensível",
  Indefeso: "Indefeso",
  Paralisado: "Paralisado",
  Surdo: "Surdo",
  Vulneravel: "Vulnerável",

  // Espirituais (4)
  Desconexo: "Desconexo",
  Dissonante: "Dissonante",
  Esgotado: "Esgotado",
  Manipulado: "Manipulado",
} as const;

export type ConditionName = (typeof ConditionName)[keyof typeof ConditionName];

export const CONDITION_CATEGORIES: Record<ConditionName, ConditionCategory> = {
  // Corporais
  [ConditionName.Abatido]: ConditionCategory.Corporal,
  [ConditionName.Agarrado]: ConditionCategory.Corporal,
  [ConditionName.Asfixiado]: ConditionCategory.Corporal,
  [ConditionName.Avariado]: ConditionCategory.Corporal,
  [ConditionName.Caido]: ConditionCategory.Corporal,
  [ConditionName.Doente]: ConditionCategory.Corporal,
  [ConditionName.EmChamas]: ConditionCategory.Corporal,
  [ConditionName.Enjoado]: ConditionCategory.Corporal,
  [ConditionName.Enraizado]: ConditionCategory.Corporal,
  [ConditionName.Envenenado]: ConditionCategory.Corporal,
  [ConditionName.Exausto]: ConditionCategory.Corporal,
  [ConditionName.Fraco]: ConditionCategory.Corporal,
  [ConditionName.Invisivel]: ConditionCategory.Corporal,
  [ConditionName.Lento]: ConditionCategory.Corporal,
  [ConditionName.Machucado]: ConditionCategory.Corporal,
  [ConditionName.Morrendo]: ConditionCategory.Corporal,
  [ConditionName.Petrificado]: ConditionCategory.Corporal,
  [ConditionName.Sangrando]: ConditionCategory.Corporal,
  [ConditionName.Sobrecarregado]: ConditionCategory.Corporal,

  // Mentais
  [ConditionName.Abalado]: ConditionCategory.Mental,
  [ConditionName.Amedrontado]: ConditionCategory.Mental,
  [ConditionName.Enfeiticado]: ConditionCategory.Mental,
  [ConditionName.Incapacitado]: ConditionCategory.Mental,
  [ConditionName.Inconsciente]: ConditionCategory.Mental,
  [ConditionName.Perplexo]: ConditionCategory.Mental,
  [ConditionName.Perturbado]: ConditionCategory.Mental,

  // Sensoriais
  [ConditionName.Atordoado]: ConditionCategory.Sensorial,
  [ConditionName.Cego]: ConditionCategory.Sensorial,
  [ConditionName.Desequilibrado]: ConditionCategory.Sensorial,
  [ConditionName.Desprevenido]: ConditionCategory.Sensorial,
  [ConditionName.Fotossensivel]: ConditionCategory.Sensorial,
  [ConditionName.Indefeso]: ConditionCategory.Sensorial,
  [ConditionName.Paralisado]: ConditionCategory.Sensorial,
  [ConditionName.Surdo]: ConditionCategory.Sensorial,
  [ConditionName.Vulneravel]: ConditionCategory.Sensorial,

  // Espirituais
  [ConditionName.Desconexo]: ConditionCategory.Espiritual,
  [ConditionName.Dissonante]: ConditionCategory.Espiritual,
  [ConditionName.Esgotado]: ConditionCategory.Espiritual,
  [ConditionName.Manipulado]: ConditionCategory.Espiritual,
};

export interface AppliedCondition {
  id: string;
  characterId: string;
  conditionName: ConditionName;
  remainingRounds?: number;
}
