import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.add.text(0, 0, "Ready", { fontSize: "32px", color: "000" });
  }
}
