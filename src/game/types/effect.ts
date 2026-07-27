import { type BuffId } from "./buff";
import { type DebuffId } from "./debuff";

export type EffectId = BuffId | DebuffId;

export type ActiveEffect<TId extends EffectId = EffectId> = {
  id: TId;
  stacks: number;
};

export function addEffectStacks<TId extends EffectId>(
  effects: readonly ActiveEffect<TId>[],
  id: TId,
  stacks = 1,
): ActiveEffect<TId>[] {
  if (stacks <= 0) {
    return [...effects];
  }

  const existingEffect = effects.find((effect) => effect.id === id);

  if (!existingEffect) {
    return [...effects, { id, stacks }];
  }

  return effects.map((effect) =>
    effect.id === id ? { ...effect, stacks: effect.stacks + stacks } : effect,
  );
}

export function consumeEffectStacks<TId extends EffectId>(
  effects: readonly ActiveEffect<TId>[],
  id: TId,
  stacks = 1,
): ActiveEffect<TId>[] {
  if (stacks <= 0) {
    return [...effects];
  }

  return effects.flatMap((effect) => {
    if (effect.id !== id) {
      return [effect];
    }

    const remainingStacks = effect.stacks - stacks;
    return remainingStacks > 0 ? [{ ...effect, stacks: remainingStacks }] : [];
  });
}
