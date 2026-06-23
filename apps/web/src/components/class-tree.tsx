import {
  TankClassId,
  getClassDef,
} from "@pixi-tanks/game-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/store/gameStore";

const BRANCHES: { root: TankClassId; path: TankClassId[] }[] = [
  { root: "twin", path: ["twin", "triple", "quad"] },
  { root: "sniper", path: ["sniper", "assassin", "ranger"] },
  { root: "machineGun", path: ["machineGun", "gunner", "sprayer"] },
  { root: "flankGuard", path: ["flankGuard", "triAngle", "booster"] },
  { root: "brawler", path: ["brawler", "destroyer", "annihilator"] },
];

function ClassNode({
  classId,
  highlight,
}: {
  classId: TankClassId;
  highlight?: boolean;
}) {
  const def = getClassDef(classId);
  const color = `#${def.bodyStyle.color.toString(16).padStart(6, "0")}`;
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg border ${
        highlight ? "border-yellow-400 bg-yellow-400/10" : "border-white/10 bg-white/5"
      }`}
    >
      <img
        src={`/assets/tanks/${classId}.svg`}
        alt=""
        className="w-10 h-10 object-contain"
        draggable={false}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div
        className="w-8 h-8 rounded-full shrink-0 border border-white/20"
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="text-sm font-medium">{def.name}</div>
        <div className="text-xs text-white/60">Lv {def.evolveAt ?? 1}</div>
      </div>
    </div>
  );
}

export function ClassTree({ onClose }: { onClose: () => void }) {
  const currentClassId = useGameStore((s) => s.hud.classId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900/95 text-white border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tank Class Tree</CardTitle>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClassNode classId="basic" highlight={currentClassId === "basic"} />
          <p className="text-xs text-white/60 text-center">Level 15 — pick a branch</p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {BRANCHES.map((branch) => (
              <div key={branch.root} className="space-y-2">
                <ClassNode
                  classId={branch.root}
                  highlight={currentClassId === branch.root}
                />
                <div className="text-center text-white/40 text-xs">↓ Lv 30</div>
                <ClassNode
                  classId={branch.path[1]}
                  highlight={currentClassId === branch.path[1]}
                />
                <div className="text-center text-white/40 text-xs">↓ Lv 45</div>
                <ClassNode
                  classId={branch.path[2]}
                  highlight={currentClassId === branch.path[2]}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50 pt-2">
            Evolve at levels 15, 30, and 45. Stat upgrades fill the levels between.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
