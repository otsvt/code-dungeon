import Phaser from "phaser";
import { selectRevealedRoomIds, type NextRoomChoice } from "@/game";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";
import { Door } from "./Door";

const DOOR_ROW_BOTTOM_Y_RATIO = 0.36;
const DOOR_SCALE = 1.08;
const DOOR_GAP = 18;
const SIGN_STAGGER = 80;

export const DOOR_SELECTED_EVENT = "door-selected";

export class Doors extends Phaser.GameObjects.Container {
  private doors: Door[] = [];
  private selectedDoorIndex: number | null = null;
  private choices: readonly NextRoomChoice[];

  public doorCount = 0;

  constructor(scene: Phaser.Scene, choices: readonly NextRoomChoice[]) {
    const { width, height } = scene.scale;

    super(scene, width / 2, height * DOOR_ROW_BOTTOM_Y_RATIO);

    this.choices = choices;
    scene.add.existing(this);

    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.door]);
    this.regenerate();
  }

  public regenerate() {
    this.removeAll(true);
    this.doors = [];
    this.selectedDoorIndex = null;

    this.doorCount = this.choices.length;

    const doorWidth = this.scene.textures.get(SPRITE_NAMES.door).getSourceImage().width * DOOR_SCALE;
    const step = doorWidth + DOOR_GAP;

    this.choices.forEach((choice, index) => {
      const offsetFromCenter = index - (this.doorCount - 1) / 2;
      const door = new Door(
        this.scene,
        offsetFromCenter * step,
        index,
        choice,
        DOOR_SCALE,
        () => {
          this.selectDoor(index);
        },
      );

      this.doors.push(door);
      this.add(door);
    });
  }

  public showSigns(revealCount: number) {
    const revealedRoomIds = selectRevealedRoomIds(this.choices, revealCount);

    this.doors.forEach((door, index) => {
      door.showSign(revealedRoomIds.has(door.choice.id), index * SIGN_STAGGER);
    });
  }

  private selectDoor(doorIndex: number) {
    if (this.selectedDoorIndex !== null) {
      return;
    }

    this.selectedDoorIndex = doorIndex;

    this.doors.forEach((door) => {
      if (door.doorIndex !== doorIndex) {
        door.dim();
      }
    });

    this.doors[doorIndex]?.select(() => {
      this.emit(DOOR_SELECTED_EVENT, this.doors[doorIndex].choice);
    });
  }
}
