import { Engine } from "matter-js";

const engine = Engine.create();
const world = engine.world;

engine.gravity.x = 0;
engine.gravity.y = 0;

export { engine, world };
