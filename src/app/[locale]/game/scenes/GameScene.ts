import Phaser from "phaser";

import { Room } from "../entities/Room";
import { Hero } from "../entities/Hero";
import { Pedestal } from "../entities/Pedestal";

export class GameScene extends Phaser.Scene {
  private hero?: Hero;
  private pedestal?: Pedestal;
  private room?: Room;

  constructor() {
    super("GameScene");
  }

  create() {
    this.room = new Room(this);
    this.pedestal = new Pedestal(this);
    this.hero = new Hero(this);
  }
}
