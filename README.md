# Pixi Tanks 🎮🚀

**Short summary:** Pixi Tanks is a modular, TypeScript-based 2D demo game built with Pixi.js and an ECS-like architecture. The repository is a monorepo (apps + packages) that keeps gameplay logic in `packages/game-core` and a web UI in `apps/web`.

---

## Table of contents

- ✅ Overview
- 🔧 Architecture & Key Concepts
- 📁 Project structure
- 🚀 Getting started (setup & run)
- 🛠 Development workflow & commands
- 🧭 How the game works (key modules)
- ➕ Extending the game (add turrets, bullets, tanks, AI)
- 🐞 Troubleshooting & common fixes
- 🤝 Contributing
- 📜 License & credits

---

## ✅ Overview

Pixi Tanks is designed to be easy to extend, testable, and maintainable:

- Core gameplay and rules live in `packages/game-core`.
- The web client (`apps/web`) boots the Pixi render loop, manages input, and renders the game world.
- The code favors composition (Entities + Components + Systems) and base classes (`BaseTank`, `BaseBullet`, `BaseTurret`) so new behaviours can be added with minimal friction.

Goals:

- Make it straightforward to add new turrets, bullets, tanks, or AI behaviours.
- Keep rendering code separated from game logic (systems and components).

---

## 🔧 Architecture & Key Concepts

- Monorepo layout (turbo-compatible): apps + packages. This makes it easy to share code between client and server or to create multiple clients.
- `packages/game-core` contains the engine pieces: entities, components, systems, factories, and utilities.
- `apps/web` contains the Pixi + React/Vite UI that creates the `GameWorld`, handles input, and runs the game loop.

Design patterns used:

- Base classes for common behaviour (`BaseTank`, `BaseBullet`, `BaseTurret`).
- Factories for creating configured instances of entities (e.g., `spawnTank`, `BulletFactory`).
- Systems that iterate and update entities every tick (e.g., `MovementSystem`, `ShootingSystem`, `CollisionSystem`).

---

## 📁 Project structure (important paths)

- `apps/web` - client app (Vite + React + Pixi)
  - `src/components/game-canvas.tsx` - boots the Pixi Application, creates `GameWorld`
  - `src/components/start-screen.tsx` - UI entry screen
- `packages/game-core` - core game engine
  - `src/entities/` - `Tank/`, `Bullet/`, `Turret/` (base classes + types)
  - `src/systems/` - game systems (Movement, Shooting, Collision, AI, etc.)
  - `src/factories/` - factories for Tanks and Bullets
  - `src/ecs/` - `EntityManager`, `Component`, `System` abstractions

---

## 🚀 Getting started (setup & run)

Prerequisites:

- Node.js >= 18
- pnpm (recommended) or npm / yarn

Install dependencies (from repo root):

```powershell
pnpm install
```

Start the client (web):

```powershell
cd apps/web; pnpm run dev
```

Start the server (if present):

```powershell
cd apps/server; pnpm run dev
```

Run monorepo dev script (if defined):

```powershell
pnpm -w dev
```

Build for production:

```powershell
pnpm -w build
```

Run tests (if available):

```powershell
pnpm -w test
```

---

## 🛠 Development workflow & tips

- Use TypeScript with strict checks. When you encounter `TS2564` (property has no initializer), either initialize the property, assign it in the constructor, or use the definite-assignment operator (`prop!: Type`) for properties guaranteed to be set by subclasses (used in `BaseTank.turret`).
- Use `EntityManager` to query entities for debugging.
- Keep rendering code in entities (visual helpers) and game logic in Systems.

Tips:

- Prefer small, composable components that can be attached/removed at runtime (e.g., `HealthComponent`).
- Add unit tests for core logic in `packages/game-core`.

---

## 🧭 How the game works (key modules)

- Boot: `apps/web` creates a Pixi `Application`, sets up a `Viewport`, then constructs `GameWorld`.
- `GameWorld.init()` spawns player and AI tanks and registers systems.
- Main loop: Pixi `ticker` calls `game.update(deltaMS)` -> iterates Systems.

Entities & components:

- `BaseTank` provides movement, health, turret control, and rendering helpers.
- `BaseBullet` captures lifetime, speed, damage, and provides `isExpired()`.
- `BaseTurret` provides `fire(tank)` and `aimAt(angle)` interface and a `lastFiredAt` cooldown helper.

Systems:

- `ShootingSystem` handles firing, reading turret state, and adding bullets to the world.
- `MovementSystem` updates positions from velocities.
- `CollisionSystem` detects bullet/tank collisions and applies damage.
- `AISystem` controls AI tanks (movement, target finding, firing).

---

## ➕ Extending the game (examples)

Add a new turret:

1. Create `packages/game-core/src/entities/Turret/MyTurret.ts`:

```ts
import { BaseTurret } from "./BaseTurret";
import { BaseTank } from "../Tank/base-tank";
import { BulletFactory, BulletType } from "../../factories/BulletFactory";

export class MyTurret extends BaseTurret {
  fire(owner: BaseTank) {
    const now = performance.now();
    const cooldown = 1000 / owner.getStats().fireRate;
    if (now - this.lastFiredAt < cooldown) return [];
    this.lastFiredAt = now;
    return [
      BulletFactory.create(
        BulletType.SNIPER,
        owner.position.x,
        owner.position.y,
        owner.rotation + this.rotation,
        owner.id
      ),
    ];
  }
  aimAt(angle: number) {
    this.rotation = angle;
  }
}
```

2. Use it in a tank (e.g., `MissileLauncherTank`):

```ts
this.turret = new MyTurret();
this.addChild(this.turret);
```

Add a new bullet:

1. Create a subclass of `BaseBullet`, implement `update(delta)`.
2. Register the bullet type in `BulletFactory`.

Spawn an AI on startup (example in `GameWorld.init()`):

```ts
spawnTank({
  id: "enemy-1",
  em: this.entityManager,
  viewport: this.viewport,
  x: 800,
  y: 600,
  options: { health: 100, color: 0xff0000 },
  isAI: true,
});
```

---

## 🐞 Troubleshooting & common fixes

- TS2564: initialize properties, assign in constructors, or use `!` when subclass will set it.
- Missing assets: ensure imports/paths like `@/public/...` are correct and files exist in `apps/web/public`.
- Turrets not firing: verify `lastFiredAt`, `owner.getStats().fireRate`, and system wiring.

---

## 🤝 Contributing

- Branch from `develop` and open PRs against `develop`.
- Include tests for logic changes and screenshots for visual work.
- Keep PR descriptions focused on rationale.

If you'd like, I can also add a `CONTRIBUTING.md`, test scaffolding for `game-core`, or developer recipes for adding bullets/turrets.

---

## 📜 License & credits

Add or confirm the project license (e.g., MIT) and note any asset attributions.

---

Thanks for checking out Pixi Tanks — happy hacking! 💡
