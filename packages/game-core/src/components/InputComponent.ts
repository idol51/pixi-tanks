export interface InputState {
  moveX: number; // -1 to 1
  moveY: number;
  isShooting: boolean;
  pointerPosition: { x: number; y: number };
}

export class InputComponent implements InputState {
  moveX = 0;
  moveY = 0;
  isShooting = false;
  pointerPosition = { x: 0, y: 0 };

  updateInput(input: InputState) {
    this.moveX = input.moveX;
    this.moveY = input.moveY;
    this.isShooting = input.isShooting;
    this.pointerPosition = input.pointerPosition;
  }
}
