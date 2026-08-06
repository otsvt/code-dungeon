import Phaser from "phaser";
import { DEPTH_INDEX, getTechnologyTextureKey, SPRITE_NAMES } from "../types/consts";
import { type BuffId, type EffectId } from "@/game";
import { type TechnologyId } from "@/entities/technology";

type Point = {
  x: number;
  y: number;
};

export class Pedestal extends Phaser.GameObjects.Container {
  private base: Phaser.GameObjects.Image;
  private flame: Phaser.GameObjects.Sprite;
  private technologyIcon?: Phaser.GameObjects.Image;
  private technologyGlow?: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, technologyId?: TechnologyId) {
    const { width, height } = scene.scale;

    super(scene, width / 2, height * 0.51);

    this.base = scene.add.image(0, 0, SPRITE_NAMES.pedestal);
    this.flame = scene.add.sprite(0, -150, SPRITE_NAMES.flame.base, 0);
    this.technologyIcon = technologyId
      ? scene.add
          .image(0, -128, getTechnologyTextureKey(technologyId))
          .setDisplaySize(52, 52)
          .setAlpha(0.96)
          .setDepth(1)
      : undefined;
    this.technologyGlow = technologyId
      ? scene.add
          .circle(0, -128, 34, 0xe5c398, 0.12)
          .setStrokeStyle(1, 0xe5c398, 0.55)
          .setBlendMode(Phaser.BlendModes.ADD)
      : undefined;

    scene.add.existing(this);

    this.base.setScale(0.19);
    this.flame.setScale(5);

    this.add(this.base);

    this.add(this.flame);

    if (this.technologyIcon) {
      if (this.technologyGlow) {
        this.add(this.technologyGlow);
      }

      this.add(this.technologyIcon);
    }

    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.pedestal]);

    this.playFlameAnimation(SPRITE_NAMES.flame.base);
  }

  private playFlameAnimation(texture: string) {
    const animationKey = `${texture}-burning`;

    if (!this.scene.anims.exists(animationKey)) {
      this.scene.anims.create({
        key: animationKey,
        frames: this.scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    this.flame.play(animationKey);
  }

  public giveBuff(buffId: BuffId, hudTarget: Point, reducedMotion = false): Promise<void> {
    return this.giveEffect(buffId, hudTarget, reducedMotion, false);
  }

  public giveEffect(effectId: EffectId, hudTarget: Point, reducedMotion = false, isDebuff = false): Promise<void> {
    this.playFlameAnimation(isDebuff ? SPRITE_NAMES.flame.debuff : SPRITE_NAMES.flame.buff);

    if (reducedMotion) {
      return this.pulseFlame(160);
    }

    const effectColor = isDebuff ? 0xb44c43 : 0xe5c398;
    const start = {
      x: this.x + this.flame.x,
      y: this.y + this.flame.y,
    };
    const ejectEnd = {
      x: start.x,
      y: start.y - 118,
    };
    const effectIcon = this.scene.add.image(start.x, start.y, effectId);
    const burstRing = this.scene.add.circle(start.x, start.y, 28, effectColor, 0);

    effectIcon.setDepth(6);
    effectIcon.setScale(0.018);
    effectIcon.setAlpha(0);

    burstRing.setDepth(5);
    burstRing.setStrokeStyle(3, effectColor, 0.9);

    this.scene.tweens.add({
      targets: burstRing,
      scale: 2.3,
      alpha: 0,
      duration: 360,
      ease: "Cubic.easeOut",
      onComplete: () => burstRing.destroy(),
    });

    void this.pulseFlame(360);

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: effectIcon,
        x: ejectEnd.x,
        y: ejectEnd.y,
        scaleX: 0.082,
        scaleY: 0.082,
        alpha: 1,
        angle: -7,
        duration: 430,
        ease: "Back.easeOut",
        onComplete: () => {
          this.scene.time.delayedCall(100, () => {
            this.flyEffectToHud(effectIcon, ejectEnd, hudTarget, effectColor, resolve);
          });
        },
      });
    });
  }

  public hideTechnologyIcon(reducedMotion = false): Promise<void> {
    if (!this.technologyIcon || !this.technologyIcon.visible) {
      return Promise.resolve();
    }

    if (reducedMotion) {
      this.technologyIcon.setVisible(false);
      this.technologyGlow?.setVisible(false);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: [this.technologyIcon, this.technologyGlow],
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 220,
        ease: "Cubic.easeIn",
        onComplete: () => {
          this.technologyIcon?.setVisible(false);
          this.technologyGlow?.setVisible(false);
          resolve();
        },
      });
    });
  }

  public playResult(reducedMotion = false): Promise<void> {
    const restingY = this.flame.y;
    const resultGlow = this.scene.add.circle(0, restingY, 24, 0xf7f5e9, 0).setBlendMode(Phaser.BlendModes.ADD);

    this.addAt(resultGlow, 1);
    this.flame.anims.timeScale = 0.6;

    if (!reducedMotion) {
      this.scene.cameras.main.shake(1000, 0.001);
    }

    return new Promise((resolve) => {
      this.scene.time.delayedCall(160, () => {
        this.scene.tweens.add({
          targets: this.flame,
          alpha: 0.48,
          duration: 700,
          ease: "Sine.easeIn",
          onComplete: () => {
            this.scene.time.delayedCall(140, () => {
              this.flame.anims.timeScale = 1;
              this.playFlameAnimation(SPRITE_NAMES.flame.none);
              this.flame.setScale(5).setPosition(0, restingY).setAlpha(1);
              resultGlow.setScale(0.65).setAlpha(0.52);

              this.scene.tweens.add({
                targets: resultGlow,
                scaleX: 3.2,
                scaleY: 3.2,
                alpha: 0,
                duration: 340,
                ease: "Cubic.easeOut",
                onComplete: () => resultGlow.destroy(),
              });

              void this.pulseFlame(520).then(resolve);
            });
          },
        });
      });
    });
  }

  private pulseFlame(duration: number): Promise<void> {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.flame,
        scaleX: 7.8,
        scaleY: 8.6,
        y: this.flame.y - 42,
        alpha: 1,
        duration: duration / 2,
        ease: "Sine.easeOut",
        yoyo: true,
        onComplete: () => resolve(),
      });
    });
  }

  private flyEffectToHud(
    effectIcon: Phaser.GameObjects.Image,
    start: Point,
    target: Point,
    color: number,
    onComplete: () => void,
  ) {
    const flight = { progress: 0 };
    const trail = this.scene.add.graphics().setDepth(5);
    const trailPoints: Point[] = [];
    const control = {
      x: start.x + (target.x - start.x) * 0.34,
      y: Math.min(start.y, target.y) - 82,
    };

    this.scene.tweens.add({
      targets: flight,
      progress: 1,
      duration: 820,
      ease: "Cubic.easeInOut",
      onUpdate: () => {
        const progress = flight.progress;
        const inverse = 1 - progress;
        const x = inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * target.x;
        const y = inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * target.y;

        effectIcon.setPosition(x, y);
        effectIcon.setScale(Phaser.Math.Linear(0.082, 0.048, progress));
        effectIcon.setAngle(Phaser.Math.Linear(-7, 9, progress));

        trailPoints.unshift({ x, y });
        trailPoints.splice(7);

        trail.clear();

        trailPoints.forEach((point, index) => {
          const strength = 1 - index / trailPoints.length;
          trail.fillStyle(color, 0.12 * strength);
          trail.fillCircle(point.x, point.y, 12 * strength + 2);
        });
      },
      onComplete: () => {
        trail.destroy();

        this.scene.tweens.add({
          targets: effectIcon,
          scaleX: 0.02,
          scaleY: 0.02,
          alpha: 0,
          duration: 10,
          ease: "Cubic.easeIn",
          onComplete: () => {
            effectIcon.destroy();
            onComplete();
          },
        });
      },
    });
  }
}
