import Phaser from "phaser";

import { resolveGameplayEffects, type NextRoomChoice, useRunStore } from "@/game";
import { Room } from "../entities/Room";
import { Hero } from "../entities/Hero";
import { Pedestal } from "../entities/Pedestal";
import { Doors, DOOR_SELECTED_EVENT } from "../entities/Doors";

export class GameScene extends Phaser.Scene {
  private hero?: Hero;
  private pedestal?: Pedestal;
  private room?: Room;
  private doors?: Doors;

  public locale: "ru" | "en";

  constructor() {
    super("GameScene");

    this.locale = window.location.pathname.split("/")[1] === "en" ? "en" : "ru";
  }

  create() {
    const currentRun = useRunStore.getState().currentRun;

    this.room = new Room(this);
    this.doors = new Doors(this, currentRun?.nextRoomChoices ?? []);
    this.doors.on(DOOR_SELECTED_EVENT, this.handleDoorSelected, this);
    this.pedestal = new Pedestal(this);
    this.hero = new Hero(this);

    this.startRoomIntro();
  }

  private async startRoomIntro() {
    if (!this.hero || !this.pedestal) {
      return;
    }

    await this.hero.moveTo(this.scale.width * 0.48, this.scale.height * 0.8, 2000);

    const runStore = useRunStore.getState();
    const buff = runStore.prepareStartBuff();

    if (!buff) {
      return;
    }

    const hudTarget = this.getBuffHudTarget();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    await this.pedestal.giveBuff(buff.id, hudTarget, reducedMotion);

    useRunStore.getState().completeStartBuffGrant();
    const currentRun = useRunStore.getState().currentRun;

    if (!currentRun) {
      return;
    }

    const modifiers = resolveGameplayEffects(
      currentRun.activeBuffs,
      currentRun.activeDebuffs,
    );

    this.doors?.showSigns(modifiers.doorsToReveal);
  }

  private handleDoorSelected(choice: NextRoomChoice) {
    this.registry.set("selectedNextRoom", choice);
  }

  private getBuffHudTarget() {
    const target = document.querySelector<HTMLElement>("[data-buff-flight-target]");
    const canvasRect = this.game.canvas.getBoundingClientRect();

    if (!target || canvasRect.width === 0 || canvasRect.height === 0) {
      return {
        x: this.scale.width * 0.42,
        y: 76,
      };
    }

    const targetRect = target.getBoundingClientRect();

    return {
      x: ((targetRect.left + targetRect.width / 2 - canvasRect.left) / canvasRect.width) * this.scale.width,
      y: ((targetRect.top + targetRect.height / 2 - canvasRect.top) / canvasRect.height) * this.scale.height,
    };
  }
}
