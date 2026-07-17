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
period: 2026
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

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 960 250" role="img" aria-labelledby="res-title">
<title id="res-title">The language model authors card scripts offline; the deterministic engine resolves the game at runtime without it</title>
<defs><marker id="rah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead" d="M0,0 L6.5,3 L0,6 Z"/></marker></defs>
<rect class="box-2" x="8" y="8" width="460" height="234" rx="10"/>
<text class="t-accent" x="238" y="34" text-anchor="middle" font-weight="650">Offline · authoring</text>
  <rect class="box" x="88" y="54" width="300" height="42" rx="8"/><text class="t-title" x="238" y="81" text-anchor="middle" font-size="12.5">Card text</text>
  <line class="flow" x1="238" y1="96" x2="238" y2="112" marker-end="url(#rah)"/>
  <rect class="box-accent" x="88" y="114" width="300" height="42" rx="8"/><text class="t-title" x="238" y="140" text-anchor="middle" font-size="12.5">Language model</text><text class="t-muted" x="238" y="152" text-anchor="middle" font-size="10.5">translates text to a card script</text>
  <line class="flow" x1="238" y1="160" x2="238" y2="176" marker-end="url(#rah)"/>
  <rect class="box" x="88" y="178" width="300" height="42" rx="8"/><text class="t-title" x="238" y="204" text-anchor="middle" font-size="12.5">Card script</text><text class="t-muted" x="238" y="216" text-anchor="middle" font-size="10.5">reviewed by a human, saved as data</text>
<rect class="box-2" x="492" y="8" width="460" height="234" rx="10"/>
<text class="t-accent" x="722" y="34" text-anchor="middle" font-weight="650">Runtime · resolution</text>
  <rect class="box" x="572" y="54" width="300" height="42" rx="8"/><text class="t-title" x="722" y="81" text-anchor="middle" font-size="12.5">Board state + actions</text>
  <line class="flow" x1="722" y1="96" x2="722" y2="112" marker-end="url(#rah)"/>
  <rect class="box" x="572" y="114" width="300" height="42" rx="8"/><text class="t-title" x="722" y="140" text-anchor="middle" font-size="12.5">Deterministic engine</text><text class="t-muted" x="722" y="152" text-anchor="middle" font-size="10.5">no language model here</text>
  <line class="flow" x1="722" y1="160" x2="722" y2="176" marker-end="url(#rah)"/>
  <rect class="box" x="572" y="178" width="300" height="42" rx="8"/><text class="t-title" x="722" y="205" text-anchor="middle" font-size="12.5">Result, step by step</text>
</svg>
<figcaption><b>Where the model belongs.</b> A language model is used only offline, to translate a card's printed text into a structured "card script" that a human reviews and saves as plain data. During actual game resolution the deterministic engine reads the board state and actions and produces the result, and the model never runs.</figcaption>
</figure>

That boundary is why I keep this project on the site. Deciding where a model belongs, and keeping it
out of the path that has to be correct, is a small version of a judgment that matters a great deal
more in production systems.
