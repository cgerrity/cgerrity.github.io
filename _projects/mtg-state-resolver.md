---
title: A deterministic rules engine
category: side
order: 2
kicker: Side project · reliability
summary: >-
  A deterministic Magic: The Gathering rules engine that resolves a board state
  step by step, with the language model confined to offline authoring, never the runtime.
card_desc: >-
  A deterministic rules engine where the LLM is confined to offline authoring and
  never touches the runtime path. A study in putting determinism where it matters.
role: Designer and director. Built with AI coding tools.
period: 2025
stack: [Python]
tags: [Deterministic systems, Reliability, LLM tooling]
links:
  - { label: "Code (GitHub)", url: "https://github.com/cgerrity/mtg-state-resolver", primary: true }
description: >-
  A side project: a deterministic rules engine that keeps the language model out of
  the runtime path, a small study in reliability judgment.
---

## What it is

A deterministic Magic: The Gathering rules engine. You give it a board state and a set of actions, and
it tells you what happens next, letting you step through how everything resolves with a plain-English
explanation.

## The design decision worth noting

The engine is **fully deterministic**: the same input always produces the same result, so its behavior
can be locked down with tests. A language model is used **only as an offline authoring tool**, to help
translate a card's printed text into a structured "card script" that a human reviews and saves as plain
data. The model never runs during actual game resolution.

That boundary is why I keep this project on the site. Deciding where a model belongs, and keeping it
out of the path that has to be correct, is a small version of a judgment that matters a great deal
more in production systems.
