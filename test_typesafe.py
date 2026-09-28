"""Smoke test: TYPESAFE_API_KEY is valid and Jev answers sensibly."""
import pytest
from typesafe_sdk import Choice, Noul, TypeSafeClient

BILLING_Q = Noul(instructions="Is this ticket about billing?")


@pytest.fixture(scope="module")
def client():
    with TypeSafeClient() as c:
        yield c


def billing_noul(client, text):
    r = client.system_one(state={"document": text}, questions={"billing": BILLING_Q})
    return r.nouls["billing"].noul


def test_billing_ticket_is_billing(client):
    assert billing_noul(client, "I was charged twice. Please refund me today.") > 0.5


def test_praise_is_not_billing(client):
    assert billing_noul(client, "Thanks, the toaster works great!") < 0.5


def test_tone_choice(client):
    r = client.system_one(
        state={"document": "I was charged twice. Please refund me today."},
        questions={
            "tone": Choice(
                instructions="What is the customer's tone?",
                criteria={"calm": None, "frustrated": None, "angry": None},
            )
        },
    )
    assert r.choices["tone"].choice in {"frustrated", "angry"}


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
