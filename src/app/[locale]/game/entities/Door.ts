import Phaser from "phaser";
import { type NextRoomChoice } from "@/game";
import { getTechnologyTextureKey, SPRITE_NAMES } from "../types/consts";

const SIGN_Y_OFFSET = 120;
const SIGN_APPEAR_DURATION = 260;
const SEAL_HALO_RADIUS = 52;
const SEAL_OUTER_RADIUS = 36;
const SEAL_MIDDLE_RADIUS = 29;
const SEAL_INNER_RADIUS = 23;
const SEAL_NODE_RADIUS = 43;
const SEAL_BEAM_RADIUS = 48;

const UNKNOWN_COLOR = 0x3c8299;
const REVEALED_COLOR = 0x87dfa0;
const HOVER_COLOR = 0xc8ffd4;
const SELECTED_COLOR = 0xf4c86a;
const SELECTED_FLASH_COLOR = 0xfff4cd;
const PROJECTION_CORE_COLOR = 0x17231d;

type ProjectionVisualState = "unknown" | "revealed" | "hover" | "selected";

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
      SEAL_HALO_RADIUS,
      UNKNOWN_COLOR,
      0.07,
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

    this.drawProjection("unknown");
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
    this.drawProjection("selected");
    this.projectionLabel.setColor(toCssColor(SELECTED_COLOR));
    this.projectionLabel.setShadow(0, 0, toCssColor(SELECTED_COLOR), 10, true, true);

    const selectionWave = this.scene.add.graphics();
    selectionWave.lineStyle(2, SELECTED_FLASH_COLOR, 0.95);
    selectionWave.strokePoints(this.getPolygonPoints(43, 6), true);
    selectionWave.setBlendMode(Phaser.BlendModes.ADD);
    this.projection.addAt(selectionWave, 1);

    const coreFlash = this.scene.add
      .rectangle(0, 0, 13, 13, SELECTED_FLASH_COLOR, 0.88)
      .setRotation(Phaser.Math.DegToRad(45))
      .setBlendMode(Phaser.BlendModes.ADD);
    this.projection.addAt(coreFlash, 2);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.createSelectionBurst(reducedMotion);

    this.scene.tweens.add({
      targets: selectionWave,
      scale: reducedMotion ? 1 : 1.75,
      alpha: 0,
      duration: reducedMotion ? 0 : 320,
      ease: "Cubic.easeOut",
      onComplete: () => selectionWave.destroy(),
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

      this.drawProjection("hover");
      this.projectionLabel.setColor(toCssColor(HOVER_COLOR));
      this.projectionLabel.setShadow(0, 0, toCssColor(HOVER_COLOR), 10, true, true);

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
    const state: ProjectionVisualState = this.isRevealed ? "revealed" : "unknown";
    const color = this.isRevealed ? REVEALED_COLOR : UNKNOWN_COLOR;
    const showTechnologyIcon = this.isRevealed && this.projectionTechnologyIcon !== null;

    this.projectionTechnologyIcon?.setVisible(showTechnologyIcon);
    this.projectionLabel.setVisible(!showTechnologyIcon);
    this.projectionLabel.setText(this.isRevealed ? this.getRoomLabel() : "?");
    this.projectionLabel.setFontSize(this.isRevealed ? 14 : 29);
    this.projectionLabel.setColor(toCssColor(color));
    this.projectionLabel.setShadow(0, 0, toCssColor(color), 7, true, true);
    this.drawProjection(state);
  }

  private getRoomLabel() {
    const labels: Record<NextRoomChoice["type"], string> = {
      battle: "?",
      hr: "HR",
      final: "FINAL",
    };

    return labels[this.choice.type];
  }

  private drawProjection(state: ProjectionVisualState) {
    const isHover = state === "hover";
    const isSelected = state === "selected";
    const color =
      state === "unknown"
        ? UNKNOWN_COLOR
        : state === "revealed"
          ? REVEALED_COLOR
          : state === "hover"
            ? HOVER_COLOR
            : SELECTED_COLOR;
    const intensity = isSelected ? 1.25 : isHover ? 1.12 : 1;

    this.projectionGlow.setFillStyle(
      color,
      (isSelected ? 0.2 : isHover ? 0.14 : 0.075) * intensity,
    );
    this.projectionCore.setFillStyle(
      PROJECTION_CORE_COLOR,
      isSelected ? 0.94 : isHover ? 0.9 : 0.86,
    );

    this.projectionGraphics.clear();

    if (isSelected) {
      this.projectionGraphics.fillStyle(SELECTED_COLOR, 0.08);
      this.projectionGraphics.fillRect(-5, -SEAL_BEAM_RADIUS - 8, 10, (SEAL_BEAM_RADIUS + 8) * 2);
      this.projectionGraphics.lineStyle(2, SELECTED_FLASH_COLOR, 0.6);
      this.projectionGraphics.lineBetween(-SEAL_BEAM_RADIUS, 0, SEAL_BEAM_RADIUS, 0);
      this.projectionGraphics.lineBetween(0, -SEAL_BEAM_RADIUS, 0, SEAL_BEAM_RADIUS);

      this.projectionGraphics.lineStyle(3, SELECTED_COLOR, 0.95);
      this.projectionGraphics.strokePoints(this.getPolygonPoints(42, 6), true);
      this.projectionGraphics.lineStyle(1, SELECTED_FLASH_COLOR, 0.9);
      this.projectionGraphics.strokePoints(this.getPolygonPoints(31, 6), true);
      this.projectionGraphics.lineStyle(2, SELECTED_COLOR, 0.95);
      this.projectionGraphics.strokeCircle(0, 0, SEAL_INNER_RADIUS);

      const particleAngles = [18, 72, 126, 164, 218, 274, 322];
      particleAngles.forEach((angle, index) => {
        const radians = Phaser.Math.DegToRad(angle);
        const radius = index % 2 === 0 ? 49 : 45;
        this.projectionGraphics.fillStyle(
          index % 2 === 0 ? SELECTED_FLASH_COLOR : SELECTED_COLOR,
          0.9,
        );
        this.projectionGraphics.fillCircle(
          Math.cos(radians) * radius,
          Math.sin(radians) * radius,
          index % 3 === 0 ? 2 : 1.4,
        );
      });

      return;
    }

    this.projectionGraphics.lineStyle(isHover ? 2 : 1, color, 0.72 * intensity);
    this.projectionGraphics.strokeCircle(0, 0, isHover ? 40 : SEAL_OUTER_RADIUS);

    if (isHover) {
      this.projectionGraphics.lineStyle(1, REVEALED_COLOR, 0.72);
      this.projectionGraphics.strokeCircle(0, 0, SEAL_MIDDLE_RADIUS);
    }

    this.projectionGraphics.lineStyle(isHover ? 3 : 2, color, 0.92 * intensity);
    this.projectionGraphics.strokeCircle(0, 0, SEAL_INNER_RADIUS);

    for (let index = 0; index < 4; index += 1) {
      const angle = Phaser.Math.DegToRad(index * 90);
      const nodeX = Math.cos(angle) * SEAL_NODE_RADIUS;
      const nodeY = Math.sin(angle) * SEAL_NODE_RADIUS;

      this.drawDiamond(nodeX, nodeY, isHover ? 4.5 : 3.5, color, isHover ? 0.95 : 0.76);
    }
  }

  private drawDiamond(
    x: number,
    y: number,
    radius: number,
    color: number,
    alpha: number,
  ) {
    const points = [
      new Phaser.Math.Vector2(x, y - radius),
      new Phaser.Math.Vector2(x + radius, y),
      new Phaser.Math.Vector2(x, y + radius),
      new Phaser.Math.Vector2(x - radius, y),
    ];

    this.projectionGraphics.fillStyle(color, alpha * 0.32);
    this.projectionGraphics.fillPoints(points, true);
    this.projectionGraphics.lineStyle(1, color, alpha);
    this.projectionGraphics.strokePoints(points, true);
  }

  private getPolygonPoints(radius: number, sides: number) {
    return Array.from({ length: sides }, (_, index) => {
      const angle = -Math.PI / 2 + (index / sides) * Math.PI * 2;

      return new Phaser.Math.Vector2(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
      );
    });
  }

  private createSelectionBurst(reducedMotion: boolean) {
    const beam = this.scene.add
      .rectangle(0, 0, 8, 112, SELECTED_COLOR, reducedMotion ? 0 : 0.16)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.projection.addAt(beam, 0);

    this.scene.tweens.add({
      targets: beam,
      alpha: 0,
      scaleX: 2.2,
      duration: reducedMotion ? 0 : 260,
      ease: "Cubic.easeOut",
      onComplete: () => beam.destroy(),
    });

    const angles = [-78, -43, -12, 24, 58, 104, 142, 188, 226];

    angles.forEach((angle, index) => {
      const radians = Phaser.Math.DegToRad(angle);
      const startRadius = 24 + (index % 3) * 4;
      const endRadius = 54 + (index % 2) * 8;
      const particle = this.scene.add
        .circle(
          Math.cos(radians) * startRadius,
          Math.sin(radians) * startRadius,
          index % 3 === 0 ? 2.4 : 1.6,
          index % 2 === 0 ? SELECTED_FLASH_COLOR : SELECTED_COLOR,
          reducedMotion ? 0 : 0.95,
        )
        .setBlendMode(Phaser.BlendModes.ADD);

      this.projection.add(particle);
      this.scene.tweens.add({
        targets: particle,
        x: Math.cos(radians) * endRadius,
        y: Math.sin(radians) * endRadius,
        alpha: 0,
        scale: 0.35,
        duration: reducedMotion ? 0 : 230 + index * 9,
        ease: "Cubic.easeOut",
        onComplete: () => particle.destroy(),
      });
    });
  }
}
