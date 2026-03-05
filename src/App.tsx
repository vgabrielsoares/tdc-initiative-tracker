import { useEffect } from "react";
import { Moon, Sun, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CombatSetup } from "@/pages/CombatSetup";
import { CombatActive } from "@/pages/CombatActive";
import { useCombatStore } from "@/store/combatStore";
import { useTheme } from "@/hooks/useTheme";

function App() {
  const { combat, createCombat, initializeFromDB } = useCombatStore();
  const { isDark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    initializeFromDB();
  }, [initializeFromDB]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Global header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Swords className="size-5 text-primary" />
            <span className="text-lg font-bold">TDC Initiative Tracker</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        {!combat ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <h1 className="text-3xl font-bold">TDC Initiative Tracker</h1>
            <p className="text-muted-foreground">
              Gerenciador de Iniciativa - Tabuleiro do Caos RPG
            </p>
            <Button size="lg" onClick={createCombat}>
              <Swords />
              Novo Combate
            </Button>
          </div>
        ) : combat.status === "preparing" ? (
          <CombatSetup />
        ) : combat.status === "active" ? (
          <CombatActive />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <h1 className="text-3xl font-bold">Combate Encerrado</h1>
            <Button size="lg" onClick={createCombat}>
              <Swords />
              Novo Combate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
