// Smoke test: TYPESAFE_API_KEY is valid and Jev answers sensibly.
import { expect, test } from "bun:test";
import { choice, noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient();
const BILLING = "I was charged twice. Please refund me today.";
const FRUSTRATED = "Third time you've double-charged me. I'm fed up, refund me NOW.";

async function billingNoul(document: string) {
  const { answers } = await client.systemOne({
    state: { document },
    questions: { billing: noul("Is this ticket about billing?") },
  });
  return answers.billing.noul;
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
