import Phaser from "phaser";
import { type NextRoomChoice } from "@/game";
import { getTechnologyTextureKey, SPRITE_NAMES } from "../types/consts";

const SIGN_Y_OFFSET = 120;
const SIGN_APPEAR_DURATION = 260;
const SEAL_OUTER_RADIUS = 34;
const SEAL_INNER_RADIUS = 22;
const SEAL_TICK_START = 38;
const SEAL_TICK_END = 46;

const UNKNOWN_COLOR = 0x3c8299;
const REVEALED_COLOR = 0x3f7d4b;
const HOVER_COLOR = 0xb8893f;
const ACCENT_COLOR = 0xe5c398;
const SELECTED_FLASH_COLOR = 0xf8f2ec;
const PROJECTION_CORE_COLOR = 0x2e2c29;

type DoorSelectHandler = (choice: NextRoomChoice) => void;

function toCssColor(color: number) {
  return `#${color.toString(16).padStart(6, "0")}`;
}

export class Door extends Phaser.GameObjects.Container {
  private doorImage: Phaser.GameObjects.Image;
  private projection: Phaser.GameObjects.Container;
  private projectionSeal: Phaser.GameObjects.Container;
  private projectionGlow: Phaser.GameObjects.Arc;
  private projectionCore: Phaser.GameObjects.Arc;
  private projectionGraphics: Phaser.GameObjects.Graphics;
  private projectionLabel: Phaser.GameObjects.Text;
  private projectionTechnologyIcon: Phaser.GameObjects.Image | null;
  private hitArea: Phaser.GameObjects.Rectangle;
  private isRevealed = false;
  private isSelectable = false;
  private onSelect: DoorSelectHandler;

  public readonly doorIndex: number;
  public readonly choice: NextRoomChoice;

  constructor(
    scene: Phaser.Scene,
    x: number,
    doorIndex: number,
    choice: NextRoomChoice,
    scale: number,
    onSelect: DoorSelectHandler,
  ) {
    super(scene, x, 0);

    this.doorIndex = doorIndex;
    this.choice = choice;
    this.onSelect = onSelect;

    this.doorImage = scene.add.image(0, 0, SPRITE_NAMES.door);
    this.doorImage.setOrigin(0.5, 1);
    this.doorImage.setScale(scale);

    this.projectionGlow = scene.add.circle(
      0,
      0,
      SEAL_TICK_END + 3,
      UNKNOWN_COLOR,
      0.035,
    );
    this.projectionGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.projectionCore = scene.add.circle(
      0,
      0,
      SEAL_OUTER_RADIUS - 3,
      PROJECTION_CORE_COLOR,
      0.84,
    );

    this.projectionGraphics = scene.add.graphics();
    this.projectionSeal = scene.add.container(0, 0, [
      this.projectionGlow,
      this.projectionCore,
      this.projectionGraphics,
    ]);
    this.projectionLabel = scene.add
      .text(0, 0, "?", {
        fontFamily: "Geist Mono, monospace",
        fontSize: "29px",
        fontStyle: "bold",
        color: toCssColor(UNKNOWN_COLOR),
        stroke: toCssColor(PROJECTION_CORE_COLOR),
        strokeThickness: 3,
        align: "center",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, toCssColor(UNKNOWN_COLOR), 7, true, true);

    this.projectionTechnologyIcon = choice.technologyId
      ? scene.add
          .image(0, 0, getTechnologyTextureKey(choice.technologyId))
          .setDisplaySize(28, 28)
          .setVisible(false)
      : null;

    const projectionChildren: Phaser.GameObjects.GameObject[] = [
      this.projectionSeal,
      this.projectionLabel,
    ];

    if (this.projectionTechnologyIcon) {
      projectionChildren.push(this.projectionTechnologyIcon);
    }

    this.projection = scene.add.container(0, -SIGN_Y_OFFSET, projectionChildren);
    this.projection.setVisible(false);

    this.hitArea = scene.add
      .rectangle(0, 0, this.doorImage.displayWidth, this.doorImage.displayHeight, 0xffffff, 0)
      .setOrigin(0.5, 1);
    this.hitArea.disableInteractive();

    this.add([this.doorImage, this.projection, this.hitArea]);

    this.drawProjection(UNKNOWN_COLOR, 1);
    this.bindInteraction();
  }

  public showSign(revealed: boolean, delay: number) {
    this.isRevealed = revealed;
    this.setProjectionContent();

    this.projection.setVisible(true);
    this.projection.setAlpha(0);
    this.projection.setScale(0.86);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.scene.tweens.add({
      targets: this.projection,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      delay: reducedMotion ? 0 : delay,
      duration: reducedMotion ? 0 : SIGN_APPEAR_DURATION,
      ease: "Back.easeOut",
      onComplete: () => this.enableSelection(),
    });
  }

  public select(onComplete: () => void) {
    if (!this.isSelectable) {
      return;
    }

    this.disableSelection();
    this.scene.tweens.killTweensOf(this.projectionSeal);
    this.drawProjection(ACCENT_COLOR, 1.18);
    this.projectionLabel.setColor(toCssColor(ACCENT_COLOR));
    this.projectionLabel.setShadow(0, 0, toCssColor(ACCENT_COLOR), 8, true, true);

    const selectionRing = this.scene.add.circle(
      0,
      0,
      SEAL_OUTER_RADIUS,
      SELECTED_FLASH_COLOR,
      0,
    );
    selectionRing.setStrokeStyle(2, SELECTED_FLASH_COLOR, 0.95);
    this.projection.addAt(selectionRing, 1);

    const coreFlash = this.scene.add
      .rectangle(0, 0, 13, 13, SELECTED_FLASH_COLOR, 0.88)
      .setRotation(Phaser.Math.DegToRad(45))
      .setBlendMode(Phaser.BlendModes.ADD);
    this.projection.addAt(coreFlash, 2);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.scene.tweens.add({
      targets: selectionRing,
      scale: reducedMotion ? 1 : 2.25,
      alpha: 0,
      duration: reducedMotion ? 0 : 320,
      ease: "Cubic.easeOut",
      onComplete: () => selectionRing.destroy(),
    });

    this.scene.tweens.add({
      targets: coreFlash,
      scale: reducedMotion ? 1 : 2.6,
      alpha: 0,
      duration: reducedMotion ? 0 : 190,
      ease: "Cubic.easeOut",
      onComplete: () => coreFlash.destroy(),
    });

    this.scene.tweens.add({
      targets: this.projectionSeal,
      scaleX: reducedMotion ? 1 : 1.13,
      scaleY: reducedMotion ? 1 : 1.13,
      duration: reducedMotion ? 0 : 145,
      ease: "Sine.easeOut",
      yoyo: !reducedMotion,
      onComplete,
    });
  }

  public dim() {
    this.disableSelection();

    this.scene.tweens.add({
      targets: this.projection,
      alpha: 0.28,
      scaleX: 0.92,
      scaleY: 0.92,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180,
      ease: "Sine.easeOut",
    });
  }

  private bindInteraction() {
    this.hitArea.on("pointerover", () => {
      if (!this.isSelectable) {
        return;
      }

      this.drawProjection(HOVER_COLOR, 1.18);
      this.projectionLabel.setColor(toCssColor(HOVER_COLOR));
      this.projectionLabel.setShadow(0, 0, toCssColor(HOVER_COLOR), 8, true, true);

      this.scene.tweens.add({
        targets: this.projectionSeal,
        scaleX: 1.09,
        scaleY: 1.09,
        duration: 120,
        ease: "Sine.easeOut",
      });
    });

    this.hitArea.on("pointerout", () => {
      if (!this.isSelectable) {
        return;
      }

      this.setProjectionContent();

      this.scene.tweens.add({
        targets: this.projectionSeal,
        scaleX: 1,
        scaleY: 1,
        duration: 120,
        ease: "Sine.easeOut",
      });
    });

    this.hitArea.on("pointerdown", () => {
      if (this.isSelectable) {
        this.onSelect(this.choice);
      }
    });
  }

  private enableSelection() {
    this.isSelectable = true;
    this.hitArea.setInteractive({ useHandCursor: true });
  }

  private disableSelection() {
    this.isSelectable = false;
    this.hitArea.disableInteractive();
    this.scene.input.setDefaultCursor("default");
    this.scene.game.canvas.style.cursor = "default";
  }

  private setProjectionContent() {
    const color = this.isRevealed ? REVEALED_COLOR : UNKNOWN_COLOR;
    const showTechnologyIcon = this.isRevealed && this.projectionTechnologyIcon !== null;

    this.projectionTechnologyIcon?.setVisible(showTechnologyIcon);
    this.projectionLabel.setVisible(!showTechnologyIcon);
    this.projectionLabel.setText(this.isRevealed ? this.getRoomLabel() : "?");
    this.projectionLabel.setFontSize(this.isRevealed ? 14 : 29);
    this.projectionLabel.setColor(toCssColor(color));
    this.projectionLabel.setShadow(0, 0, toCssColor(color), 7, true, true);
    this.drawProjection(color, 1);
  }

  private getRoomLabel() {
    const labels: Record<NextRoomChoice["type"], string> = {
      battle: "?",
      hr: "HR",
      final: "FINAL",
    };

    return labels[this.choice.type];
  }

  private drawProjection(color: number, intensity: number) {
    this.projectionGlow.setFillStyle(color, 0.035 * intensity);

    this.projectionGraphics.clear();
    this.projectionGraphics.lineStyle(1, color, 0.66 * intensity);
    this.projectionGraphics.strokeCircle(0, 0, SEAL_OUTER_RADIUS);
    this.projectionGraphics.lineStyle(2, color, 0.9 * intensity);
    this.projectionGraphics.strokeCircle(0, 0, SEAL_INNER_RADIUS);

    for (let index = 0; index < 4; index += 1) {
      const angle = Phaser.Math.DegToRad(index * 90);

      this.projectionGraphics.lineStyle(1, color, 0.56 * intensity);
      this.projectionGraphics.lineBetween(
        Math.cos(angle) * SEAL_TICK_START,
        Math.sin(angle) * SEAL_TICK_START,
        Math.cos(angle) * SEAL_TICK_END,
        Math.sin(angle) * SEAL_TICK_END,
      );
    }

    const diamondRadius = 7;
    const diamondPoints = [
      new Phaser.Math.Vector2(0, -diamondRadius),
      new Phaser.Math.Vector2(diamondRadius, 0),
      new Phaser.Math.Vector2(0, diamondRadius),
      new Phaser.Math.Vector2(-diamondRadius, 0),
    ];

    this.projectionGraphics.fillStyle(color, 0.12 * intensity);
    this.projectionGraphics.fillPoints(diamondPoints, true);
    this.projectionGraphics.lineStyle(1, color, 0.72 * intensity);
    this.projectionGraphics.strokePoints(diamondPoints, true);
  }
}
