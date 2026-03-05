import { useEffect } from "react";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CombatSetup } from "@/pages/CombatSetup";
import { CombatActive } from "@/pages/CombatActive";
import { useCombatStore } from "@/store/combatStore";

function App() {
  const { combat, createCombat, initializeFromDB } = useCombatStore();

  useEffect(() => {
    initializeFromDB();
  }, [initializeFromDB]);

  // No combat loaded - show landing
  if (!combat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">TDC Initiative Tracker</h1>
        <p className="text-muted-foreground">
          Gerenciador de Iniciativa - Tabuleiro do Caos RPG
        </p>
        <Button size="lg" onClick={createCombat}>
          <Swords />
          Novo Combate
        </Button>
      </div>
    );
  }

  // State-based routing
  if (combat.status === "preparing") {
    return <CombatSetup />;
  }

  if (combat.status === "active") {
    return <CombatActive />;
  }

  // Finished - allow starting a new combat
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Combate Encerrado</h1>
      <Button size="lg" onClick={createCombat}>
        <Swords />
        Novo Combate
      </Button>
    </div>
  );
}

export default App;
