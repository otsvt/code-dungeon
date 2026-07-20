import Phaser from "phaser";

import { useRunStore } from "@/game";
import { Room } from "../entities/Room";
import { Hero } from "../entities/Hero";
import { Pedestal } from "../entities/Pedestal";

export class GameScene extends Phaser.Scene {
  private hero?: Hero;
  private pedestal?: Pedestal;
  private room?: Room;

  public locale: "ru" | "en";

  constructor() {
    super("GameScene");

    this.locale = window.location.pathname.split("/")[1] === "en" ? "en" : "ru";
  }

  create() {
    this.room = new Room(this);
    this.pedestal = new Pedestal(this);
    this.hero = new Hero(this);

    this.startRoomIntro();
  }

  private async startRoomIntro() {
    if (!this.hero || !this.pedestal) {
      return;
    }

    await this.hero.moveTo(this.scale.width * 0.48, this.scale.height * 0.8, 2000);

    const buff = useRunStore.getState().grantStartBuff();

    if (!buff) {
      return;
    }

    this.pedestal.giveBuff(buff.id);
  }
}
