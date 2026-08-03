import Phaser from "phaser";

import {
  type ChallengeRequest,
  type ChallengeResult,
  type NextRoomChoice,
  useRunStore,
} from "@/game";
import { useChallengeStore } from "@/features/play-challenge";
import { Room } from "../entities/Room";
import { Hero } from "../entities/Hero";
import { Pedestal } from "../entities/Pedestal";
import { Doors, DOOR_SELECTED_EVENT } from "../entities/Doors";
import { HrDesk } from "../entities/HrDesk";

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
  private hrDesk?: HrDesk;
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
    const isHrRoom = currentRun?.currentRoom.type === "hr";

    this.room = new Room(this);
    this.doors = new Doors(this, currentRun?.nextRoomChoices ?? []);
    this.doors.on(DOOR_SELECTED_EVENT, this.handleDoorSelected, this);
    this.pedestal = isHrRoom ? undefined : new Pedestal(this, technologyId);
    this.hrDesk = isHrRoom ? new HrDesk(this) : undefined;
    this.hero = new Hero(this);

    this.startRoomIntro();
  }

  private async startRoomIntro() {
    if (!this.hero) {
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
      if (!this.pedestal) {
        return;
      }

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

    if (activeRun.currentRoom.type === "hr") {
      if (activeRun.resolvedRoomIds.includes(activeRun.currentRoom.id)) {
        this.showDoorSigns();
        return;
      }

      await this.runHrEvent(activeRun.currentRoom.id, activeRun.impression, reducedMotion);
      return;
    }

    if (activeRun.currentRoom.type !== "start") {
      return;
    }

    if (!this.pedestal) {
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

  private async runHrEvent(
    roomId: string,
    impression: -1 | 0 | 1,
    reducedMotion: boolean,
  ) {
    if (!this.hrDesk) {
      return;
    }

    const result = await this.waitForChallengeResult({
      kind: "hr",
      roomId,
      impression,
      activeEffectIds:
        useRunStore
          .getState()
          .currentRun?.activeEffects.map((effect) => effect.id) ?? [],
    });

    if (result.kind !== "hr") {
      return;
    }

    const visualImpression = result.outcome === "strong" ? 1 : -1;

    const activeRun = useRunStore.getState().currentRun;

    if (
      activeRun?.currentRoom.type !== "hr" ||
      activeRun.currentRoom.id !== roomId
    ) {
      return;
    }

    await this.hrDesk.playEvaluation(visualImpression, reducedMotion);

    const appliedReward = useRunStore
      .getState()
      .completeChallengeRoom(result);

    if (!appliedReward) {
      return;
    }

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

    const result = await this.waitForChallengeResult({
      kind: "battle",
      roomId,
      technologyId,
      activeEffectIds:
        useRunStore
          .getState()
          .currentRun?.activeEffects.map((effect) => effect.id) ?? [],
    });

    if (result.kind !== "battle") {
      return;
    }

    const activeRun = useRunStore.getState().currentRun;

    if (
      activeRun?.currentRoom.type !== "battle" ||
      activeRun.currentRoom.id !== roomId
    ) {
      return;
    }

    await this.pedestal.hideTechnologyIcon(reducedMotion);
    const hudTarget = this.getEffectHudTarget();

    if (result.reward.kind === "none") {
      await this.pedestal.playResult(reducedMotion);
    } else {
      await this.pedestal.giveEffect(
        result.reward.effectId,
        hudTarget,
        reducedMotion,
        result.reward.kind === "debuff",
      );
    }

    const appliedReward = useRunStore
      .getState()
      .completeChallengeRoom(result);

    if (!appliedReward) {
      return;
    }

    this.showDoorSigns();
  }

  private waitForChallengeResult(
    request: ChallengeRequest,
  ): Promise<ChallengeResult> {
    return new Promise((resolve) => {
      const unsubscribe = useChallengeStore.subscribe((state) => {
        if (state.challengeResult?.roomId !== request.roomId) {
          return;
        }

        const result = state.challengeResult;
        unsubscribe();
        useChallengeStore.getState().clearChallengeResult();
        resolve(result);
      });

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
      void useChallengeStore.getState().openChallenge(request).catch(() => {
        unsubscribe();
      });
    });
  }

  private showDoorSigns() {
    const currentRun = useRunStore.getState().currentRun;

    if (!currentRun) {
      return;
    }

    this.doors?.showSigns(currentRun.nextRoomChoices.length);
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
