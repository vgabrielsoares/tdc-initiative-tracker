import { useState } from "react";
import { Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type {
  Character,
  NewCharacterData,
  CharacterRole,
} from "@/types/character";

interface CharacterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewCharacterData) => void;
  editingCharacter?: Character;
  onUpdate?: (
    id: string,
    data: { name: string; guard?: number; vitality?: number; defense?: number },
  ) => void;
}

export function CharacterForm({
  open,
  onOpenChange,
  onSubmit,
  editingCharacter,
  onUpdate,
}: CharacterFormProps) {
  const isEditing = !!editingCharacter;

  const [name, setName] = useState("");
  const [role, setRole] = useState<CharacterRole>("pj");
  const [guard, setGuard] = useState(0);
  const [vitality, setVitality] = useState(0);
  const [defense, setDefense] = useState(0);

  function resetForm() {
    setName("");
    setRole("pj");
    setGuard(0);
    setVitality(0);
    setDefense(0);
  }

  function populateFromCharacter(character: Character) {
    setName(character.name);
    setRole(character.role);
    if (character.role === "npc") {
      setGuard(character.guard);
      setVitality(character.vitality);
      setDefense(character.defense);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && isEditing) {
      populateFromCharacter(editingCharacter);
    } else if (nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (isEditing && onUpdate) {
      const updates: {
        name: string;
        guard?: number;
        vitality?: number;
        defense?: number;
      } = {
        name: trimmedName,
      };
      if (editingCharacter.role === "npc") {
        updates.guard = guard;
        updates.vitality = vitality;
        updates.defense = defense;
      }
      onUpdate(editingCharacter.id, updates);
    } else {
      const data: NewCharacterData =
        role === "npc"
          ? { role: "npc", name: trimmedName, guard, vitality, defense }
          : { role: "pj", name: trimmedName };
      onSubmit(data);
    }

    resetForm();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Personagem" : "Novo Personagem"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="char-name">Nome</Label>
            <Input
              id="char-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do personagem"
              autoFocus
            />
          </div>

          {!isEditing && (
            <div className="flex flex-col gap-2">
              <Label>Tipo</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={role === "pj" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRole("pj")}
                >
                  PJ
                </Button>
                <Button
                  type="button"
                  variant={role === "npc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRole("npc")}
                >
                  NPC
                </Button>
              </div>
            </div>
          )}

          {(role === "npc" ||
            (isEditing && editingCharacter.role === "npc")) && (
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="char-guard"
                  className="flex items-center gap-1.5"
                >
                  <Shield className="size-4 text-blue-500" />
                  Guarda
                </Label>
                <Input
                  id="char-guard"
                  type="number"
                  min={0}
                  value={guard}
                  onChange={(e) => setGuard(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="char-vitality"
                  className="flex items-center gap-1.5"
                >
                  <Heart className="size-4 text-red-500" />
                  Vitalidade
                </Label>
                <Input
                  id="char-vitality"
                  type="number"
                  min={0}
                  value={vitality}
                  onChange={(e) => setVitality(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="char-defense">Defesa</Label>
                <Input
                  id="char-defense"
                  type="number"
                  min={0}
                  value={defense}
                  onChange={(e) => setDefense(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={!name.trim()}>
              {isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
