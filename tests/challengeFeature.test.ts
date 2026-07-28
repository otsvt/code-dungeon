import assert from "node:assert/strict";
import test from "node:test";

import {
  createChallengeViewModel,
  useChallengeStore,
} from "../src/features/play-challenge";

test("feature-store проходит полный flow через локальный repository", async () => {
  useChallengeStore.getState().resetChallenge();

  await useChallengeStore.getState().openChallenge({
    kind: "battle",
    roomId: "feature-room",
    technologyId: "html",
    activeEffectIds: [],
  });

  const challenge = useChallengeStore.getState().activeChallenge;

  assert.ok(challenge);
  assert.equal(challenge.kind, "battle");
  assert.equal(challenge.questions.length, 2);

  const viewModel = createChallengeViewModel(challenge, "ru");

  assert.equal(
    Object.hasOwn(viewModel.questions[0] ?? {}, "correctOptionId"),
    false,
  );

  useChallengeStore.getState().completeChallenge(
    challenge.questions.map((question) => ({
      questionId: question.id,
      optionId: question.correctOptionId,
    })),
  );

  const state = useChallengeStore.getState();

  assert.equal(state.activeChallenge, null);
  assert.equal(state.challengeResult?.roomId, "feature-room");
  assert.equal(state.challengeResult?.outcome, "strong");

  useChallengeStore.getState().resetChallenge();
});
