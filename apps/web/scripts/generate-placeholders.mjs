import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "public", "assets");

const tanks = {
  basic: { color: "#00ff00", r: 20 },
  twin: { color: "#66ff66", r: 20 },
  sniper: { color: "#66ccff", r: 19 },
  machineGun: { color: "#ffcc00", r: 20 },
  flankGuard: { color: "#ff9966", r: 20 },
  brawler: { color: "#ff8800", r: 24 },
  triple: { color: "#55ee55", r: 21 },
  assassin: { color: "#5599ff", r: 18 },
  gunner: { color: "#ffdd33", r: 20 },
  triAngle: { color: "#ff7744", r: 20 },
  destroyer: { color: "#ff6600", r: 24 },
  quad: { color: "#44dd44", r: 22 },
  ranger: { color: "#4488ff", r: 18 },
  sprayer: { color: "#ffee22", r: 21 },
  booster: { color: "#ff5522", r: 20 },
  annihilator: { color: "#ff4400", r: 26 },
};

const shapes = {
  triangle: { color: "#ff4444", sides: 3 },
  square: { color: "#ffff44", sides: 4 },
  pentagon: { color: "#4444ff", sides: 5 },
  hexagon: { color: "#de00ff", sides: 6 },
};

function tankSvg(color, r) {
  const cx = 32;
  const cy = 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="#ffffff" stroke-width="2"/>
  <circle cx="${cx + 8}" cy="${cy - 4}" r="3" fill="#ffffff" opacity="0.35"/>
</svg>`;
}

function shapeSvg(color, sides) {
  const cx = 24;
  const cy = 24;
  const r = 18;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <polygon points="${points.join(" ")}" fill="${color}" stroke="#ffffff" stroke-width="2"/>
</svg>`;
}

mkdirSync(join(root, "tanks"), { recursive: true });
mkdirSync(join(root, "shapes"), { recursive: true });

for (const [id, { color, r }] of Object.entries(tanks)) {
  writeFileSync(join(root, "tanks", `${id}.svg`), tankSvg(color, r));
}

for (const [id, { color, sides }] of Object.entries(shapes)) {
  writeFileSync(join(root, "shapes", `${id}.svg`), shapeSvg(color, sides));
}

console.log("Generated placeholder SVG assets");
