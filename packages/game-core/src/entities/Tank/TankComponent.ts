import { BaseTank } from "./base-tank";

export abstract class TankComponent {
  abstract update(delta: number, tank: BaseTank): void;

  // Optional lifecycle hook
  onAttach?(tank: BaseTank): void;
  onDetach?(tank: BaseTank): void;
}
