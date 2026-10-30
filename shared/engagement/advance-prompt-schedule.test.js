import { test } from "node:test";
import assert from "node:assert/strict";
import { advancePromptSchedule } from "./advance-prompt-schedule.js";
import { createPromptState } from "./create-prompt-state.js";
import { getActivePrompt } from "./get-active-prompt.js";

function succeed(state, times = 1) {
  let next = state;
  for (let i = 0; i < times; i += 1) {
    next = advancePromptSchedule(next, { type: "success" });
  }
  return next;
}

function answer(state, type) {
  return advancePromptSchedule(state, { type });
}

// Runs successes until a card is up and returns the success count it rose on.
function successesUntilCard(state, limit = 50) {
  let next = state;
  for (let i = 0; i < limit; i += 1) {
    next = succeed(next);
    if (next.activeCard) {
      return { state: next, at: next.successCount };
    }
  }
  return { state: next, at: null };
}

test("a fresh profile shows nothing for the first two successes", () => {
  const state = succeed(createPromptState(), 2);
  assert.equal(getActivePrompt(state), null);
});

test("the first review card shows at the 3rd success without I already did", () => {
  const state = succeed(createPromptState(), 3);
  assert.deepEqual(getActivePrompt(state), { card: "review", offerAlreadyDid: false });
});

test("Not now snoozes the review for 5 successes: 3, 8, 13", () => {
  let state = succeed(createPromptState(), 3);
  state = answer(state, "review-not-now");

  // Share takes the 6th success; dismiss it so only the review schedule shows.
  let run = successesUntilCard(state);
  assert.equal(run.at, 6);
  assert.equal(run.state.activeCard, "share");
  state = answer(run.state, "share-dismiss");

  run = successesUntilCard(state);
  assert.equal(run.at, 8);
  assert.deepEqual(getActivePrompt(run.state), { card: "review", offerAlreadyDid: true });

  state = answer(run.state, "review-not-now");
  run = successesUntilCard(state);
  assert.equal(run.at, 13);
  assert.deepEqual(getActivePrompt(run.state), { card: "review", offerAlreadyDid: true });
});

test("Not now counts five successes from when it is answered", () => {
  let state = succeed(createPromptState(), 5); // card raised at 3, left open
  state = answer(state, "review-not-now");
  assert.equal(state.review.nextAt, 10);
});

for (const type of ["review-rate", "review-already-did"]) {
  test(`${type} ends the review prompt for good`, () => {
    let state = succeed(createPromptState(), 3);
    state = answer(state, "review-not-now");
    state = succeed(state, 5); // share at 6, still open at 8
    state = answer(state, "share-dismiss");
    state = succeed(state); // 9: review is due again
    assert.equal(state.activeCard, "review");

    state = answer(state, type);
    assert.equal(getActivePrompt(state), null);
    assert.equal(successesUntilCard(state, 100).at, null);
  });
}

test("share shows on the 6th success when the review is snoozed", () => {
  let state = succeed(createPromptState(), 3);
  state = answer(state, "review-not-now");
  state = succeed(state, 2);
  assert.equal(state.activeCard, null);
  state = succeed(state);
  assert.equal(state.successCount, 6);
  assert.deepEqual(getActivePrompt(state), { card: "share" });
});

test("share shows on the first success after the review is rated", () => {
  let state = succeed(createPromptState(), 3);
  state = answer(state, "review-rate");
  assert.equal(state.activeCard, null);
  state = succeed(state);
  assert.equal(state.successCount, 4);
  assert.deepEqual(getActivePrompt(state), { card: "share" });
});

test("share shows on the first success after rating from the footer early", () => {
  let state = succeed(createPromptState());
  state = answer(state, "review-rate");
  state = succeed(state);
  assert.equal(state.successCount, 2);
  assert.deepEqual(getActivePrompt(state), { card: "share" });
});

test("share never shows while the review card is waiting", () => {
  let state = succeed(createPromptState(), 10); // review raised at 3, never answered
  assert.equal(state.activeCard, "review");
  assert.equal(state.review.showings, 1);

  state = answer(state, "review-not-now");
  assert.equal(state.activeCard, null);
  state = succeed(state);
  assert.equal(state.activeCard, "share");
});

test("share never shows on the success that raises the review card", () => {
  let state = succeed(createPromptState(), 3);
  state = answer(state, "review-not-now"); // next review at 8
  state = succeed(state, 3); // share at 6
  state = answer(state, "review-not-now"); // no review card up: no effect
  assert.equal(state.activeCard, "share");
  state = answer(state, "share-dismiss");
  state = succeed(state, 2); // 8
  assert.equal(state.activeCard, "review");

  // Fresh: review due on the same success the share would be due.
  let late = createPromptState();
  late = succeed(late, 3);
  late = answer(late, "review-not-now");
  late = { ...late, review: { ...late.review, nextAt: 6 } };
  late = succeed(late, 3);
  assert.equal(late.successCount, 6);
  assert.equal(late.activeCard, "review");
});

test("the review waits behind an unanswered share card", () => {
  let state = succeed(createPromptState(), 3);
  state = answer(state, "review-not-now");
  state = succeed(state, 5); // share at 6, still up at 8
  assert.equal(state.activeCard, "share");
  state = answer(state, "share-copy");
  state = succeed(state); // 9 >= 8
  assert.deepEqual(getActivePrompt(state), { card: "review", offerAlreadyDid: true });
});

for (const type of ["share-copy", "share-dismiss"]) {
  test(`${type} means the share card never comes back`, () => {
    let state = succeed(createPromptState(), 3);
    state = answer(state, "review-rate");
    state = succeed(state);
    assert.equal(state.activeCard, "share");
    state = answer(state, type);
    assert.equal(successesUntilCard(state, 100).at, null);
  });
}

test("an unanswered card survives a round trip through storage", () => {
  const state = succeed(createPromptState(), 3);
  const restored = JSON.parse(JSON.stringify(state));
  const next = succeed(restored);
  assert.deepEqual(getActivePrompt(next), { card: "review", offerAlreadyDid: false });
  assert.equal(next.review.showings, 1);
});

test("missing or broken stored state starts a fresh schedule", () => {
  assert.deepEqual(advancePromptSchedule(undefined, { type: "unknown" }), createPromptState());
  assert.deepEqual(
    advancePromptSchedule({ successCount: "x", activeCard: "ad" }, { type: "unknown" }),
    createPromptState()
  );
});

test("does not mutate the state it is given", () => {
  const state = succeed(createPromptState(), 2);
  const frozen = JSON.parse(JSON.stringify(state));
  succeed(state);
  assert.deepEqual(state, frozen);
});
