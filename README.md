# Skills

[![test](https://github.com/Manuel-SouFer/Skills/actions/workflows/test.yml/badge.svg)](https://github.com/Manuel-SouFer/Skills/actions/workflows/test.yml)

Smoke tests for [TypeSafe](https://typesafe.ai)'s Jev model. Both files ask Jev the
same three questions and assert it answers sensibly: a refund request is about
billing, a thank-you note is not, and the refund request's tone is frustrated or angry.

## Setup

Set `TYPESAFE_API_KEY` in your environment. Never write it to a file.

```bash
pip install --require-hashes -r requirements.txt   # Python
bun install                                        # TypeScript
```

To update Python deps, edit `requirements.in` and re-run the `uv pip compile` command at the top of `requirements.txt`.

## Run

```bash
python -m pytest -v test_typesafe.py
bun test
```

## Windows + Norton

Norton's Web Shield intercepts HTTPS with its own certificate. Python trusts it; Bun
and Node do not, and fail with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. Fix by setting a
user environment variable:

```
NODE_EXTRA_CA_CERTS=C:\ProgramData\Norton\Antivirus\wscert.pem
```
