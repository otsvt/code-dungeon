import Phaser from "phaser";

import {
  createBattleRoomReward,
  resolveGameplayEffects,
  type ChallengeOutcome,
  type NextRoomChoice,
  useGameUiStore,
  useRunStore,
} from "@/game";
import { Room } from "../entities/Room";
import { Hero } from "../entities/Hero";
import { Pedestal } from "../entities/Pedestal";
import { Doors, DOOR_SELECTED_EVENT } from "../entities/Doors";

const HERO_ENTRY_DURATION = 2000;
const ROOM_FADE_DURATION = 420;
const ROOM_FADE_COLOR = { red: 248, green: 242, blue: 236 };

type GameSceneData = {
  enteringFromDoor?: boolean;
};

export class GameScene extends Phaser.Scene {
  private hero?: Hero;
  private pedestal?: Pedestal;
  private room?: Room;
  private doors?: Doors;
  private isEnteringFromDoor = false;
  private isTransitioning = false;

  public locale: "ru" | "en";

  constructor() {
    super("GameScene");

    this.locale = window.location.pathname.split("/")[1] === "en" ? "en" : "ru";
  }

  init(data: GameSceneData) {
    this.isEnteringFromDoor = data.enteringFromDoor === true;
    this.isTransitioning = false;
  }

  create() {
    const currentRun = useRunStore.getState().currentRun;
    const technologyId =
      currentRun?.currentRoom.type === "battle"
        ? currentRun.currentRoom.technologyId
        : undefined;

    this.room = new Room(this);
    this.doors = new Doors(this, currentRun?.nextRoomChoices ?? []);
    this.doors.on(DOOR_SELECTED_EVENT, this.handleDoorSelected, this);
    this.pedestal = new Pedestal(this, technologyId);
    this.hero = new Hero(this);

    this.startRoomIntro();
  }

  private async startRoomIntro() {
    if (!this.hero || !this.pedestal) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (this.isEnteringFromDoor) {
      await this.fadeCameraIn(reducedMotion);
    }

    await this.hero.moveTo(
      this.scale.width * 0.48,
      this.scale.height * 0.8,
      reducedMotion ? 0 : HERO_ENTRY_DURATION,
    );

    const runStore = useRunStore.getState();
    const activeRun = runStore.currentRun;

    if (!activeRun) {
      return;
    }

    if (activeRun.currentRoom.type === "battle") {
      if (activeRun.resolvedRoomIds.includes(activeRun.currentRoom.id)) {
        await this.pedestal.hideTechnologyIcon(true);
        this.showDoorSigns();
        return;
      }

      await this.runBattleChallenge(
        activeRun.currentRoom.id,
        activeRun.currentRoom.technologyId,
        reducedMotion,
      );
      return;
    }

    if (activeRun.currentRoom.type !== "start") {
      return;
    }

    const buff = runStore.prepareStartBuff();

    if (!buff) {
      return;
    }

    const hudTarget = this.getEffectHudTarget();

    await this.pedestal.giveBuff(buff.id, hudTarget, reducedMotion);

    useRunStore.getState().completeStartBuffGrant();
    this.showDoorSigns();
  }

  private async runBattleChallenge(
    roomId: string,
    technologyId: NonNullable<NextRoomChoice["technologyId"]>,
    reducedMotion: boolean,
  ) {
    if (!this.pedestal) {
      return;
    }

    const outcome = await this.waitForChallengeResult(roomId, technologyId);

    await this.pedestal.hideTechnologyIcon(reducedMotion);

    const reward = createBattleRoomReward(outcome);
    const hudTarget = this.getEffectHudTarget();

    if (reward.kind === "none") {
      await this.pedestal.playResult(reducedMotion);
    } else {
      await this.pedestal.giveEffect(
        reward.effectId,
        hudTarget,
        reducedMotion,
        reward.kind === "debuff",
      );
    }

    const appliedReward = useRunStore
      .getState()
      .completeBattleRoom(outcome, reward);

    if (appliedReward) {
      this.showDoorSigns();
    }
  }

  private waitForChallengeResult(
    roomId: string,
    technologyId: NonNullable<NextRoomChoice["technologyId"]>,
  ): Promise<ChallengeOutcome> {
    return new Promise((resolve) => {
      const unsubscribe = useGameUiStore.subscribe((state) => {
        if (state.challengeResult?.roomId !== roomId) {
          return;
        }

        const outcome = state.challengeResult.outcome;
        unsubscribe();
        useGameUiStore.getState().clearChallengeResult();
        resolve(outcome);
      });

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
      useGameUiStore.getState().openChallenge(roomId, technologyId);
    });
  }

  private showDoorSigns() {
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

  private async handleDoorSelected(choice: NextRoomChoice) {
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    this.registry.set("selectedNextRoom", choice);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    await this.fadeCameraOut(reducedMotion);

    const didAdvance = useRunStore.getState().advanceToRoom(choice);

    if (!didAdvance) {
      await this.fadeCameraIn(reducedMotion);
      this.isTransitioning = false;
      return;
    }

    this.scene.restart({ enteringFromDoor: true });
  }

  private fadeCameraOut(reducedMotion: boolean) {
    if (reducedMotion) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.cameras.main.once("camerafadeoutcomplete", () => resolve());
      this.cameras.main.fadeOut(
        ROOM_FADE_DURATION,
        ROOM_FADE_COLOR.red,
        ROOM_FADE_COLOR.green,
        ROOM_FADE_COLOR.blue,
      );
    });
  }

  private fadeCameraIn(reducedMotion: boolean) {
    if (reducedMotion) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.cameras.main.once("camerafadeincomplete", () => resolve());
      this.cameras.main.fadeIn(
        ROOM_FADE_DURATION,
        ROOM_FADE_COLOR.red,
        ROOM_FADE_COLOR.green,
        ROOM_FADE_COLOR.blue,
      );
    });
  }

  private getEffectHudTarget() {
    const target = document.querySelector<HTMLElement>("[data-effect-flight-target]");
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
