import { type BuffId } from "./buff";
import { type CurseId } from "./curse";
import { type DebuffId } from "./debuff";

export type EffectId = BuffId | DebuffId | CurseId;

export type ActiveEffect<TId extends EffectId = EffectId> = {
  id: TId;
};

export function addUniqueEffect<TId extends EffectId>(
  effects: readonly ActiveEffect<TId>[],
  id: TId,
): ActiveEffect<TId>[] {
  if (effects.some((effect) => effect.id === id)) {
    return [...effects];
  }

  return [...effects, { id }];
}

export function removeEffect<TId extends EffectId>(
  effects: readonly ActiveEffect<TId>[],
  id: TId,
): ActiveEffect<TId>[] {
  return effects.filter((effect) => effect.id !== id);
}
