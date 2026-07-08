import Phaser from "phaser";

import { Room } from "../entities/Room";

export class GameScene extends Phaser.Scene {
  private room?: Room;

  constructor() {
    super("GameScene");
  }

  create() {
    this.room = new Room(this);
  }
}
