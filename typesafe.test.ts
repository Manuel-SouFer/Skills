// Smoke test: TYPESAFE_API_KEY is valid and Jev answers sensibly.
import { expect, setDefaultTimeout, test } from "bun:test";
import { choice, noul, TypeSafeClient } from "@typesafe-ai/sdk";

// Bun's 5s default would fail a slow-but-successful request; budget for every attempt plus retry waits.
const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
const MAX_WAIT_MS = 5_000;
setDefaultTimeout((MAX_RETRIES + 1) * TIMEOUT_MS + MAX_RETRIES * MAX_WAIT_MS + 5_000);

const client = new TypeSafeClient({
  timeout: TIMEOUT_MS,
  retry: { maxRetries: MAX_RETRIES, backoffMaxMs: MAX_WAIT_MS, maxRetryAfterMs: MAX_WAIT_MS },
});
const BILLING = "I was charged twice. Please refund me today.";
const FRUSTRATED = "Third time you've double-charged me. I'm fed up, refund me NOW.";

async function billingNoul(document: string) {
  const { answers } = await client.systemOne({
    state: { document },
    questions: { billing: noul("Is this ticket about billing?") },
  });
  const p = answers.billing.noul;
  expect(p).toBeGreaterThanOrEqual(0); // also rejects NaN
  expect(p).toBeLessThanOrEqual(1);
  return p;
}

test("billing ticket is billing", async () => {
  expect(await billingNoul(BILLING)).toBeGreaterThan(0.5);
});

test("praise is not billing", async () => {
  expect(await billingNoul("Thanks, the toaster works great!")).toBeLessThan(0.5);
});

test("tone choice", async () => {
  const { answers } = await client.systemOne({
    state: { document: FRUSTRATED },
    questions: {
      tone: choice("What is the customer's tone?", { calm: null, frustrated: null, angry: null }),
    },
  });
  expect(["frustrated", "angry"]).toContain(answers.tone.choice);
});
