---
title: Feature attribution on my own decoders
category: research
order: 2
kicker: Interpretability, one level down
summary: >-
  Removal-based attribution that asks which input channels and brain regions a
  trained neural decoder actually relies on.
card_desc: >-
  Zero out an input channel, or a group of channels, and measure how far decoding
  accuracy falls. The same move ablation makes on an artificial network.
role: Sole author of the analysis and its code.
period: 2022–2024
stack: [MATLAB, Channel ablation, Monte Carlo search]
tags: [Attribution, Explainability, Interpretability]
links:
  - { label: "Explainer: the bridge to interpretability", url: "/writing/attribution-as-interpretability/", primary: true }
  - { label: "Preprint", url: "https://www.biorxiv.org/content/10.1101/2025.08.20.671126v1" }
description: >-
  Removal-based feature attribution on a neural decoder, framed as the honest
  bridge from systems neuroscience to mechanistic interpretability.
---

## A decoder is not an explanation

A trained decoder tells you the information is in the signal. It does not tell you *where* it lives
or *what* the model leans on to read it. Once the [GRVAE decoder]({{ '/projects/grvae-decoder/' | relative_url }})
worked, the more interesting question was which channels and which brain regions it actually used.

## Remove, then measure

The method I call **Importance Analysis** is removal-based attribution. Take the trained decoder,
**zero out an input channel** (or a group of channels), run it again, and measure how far accuracy
falls. A large drop means the model was relying on what you removed. There are far too many channel
combinations to test exhaustively, so I ordered the removals two ways: a **random search** that
samples many combinations at each removal count and keeps the most damaging one, and a **ranked**
order built from each channel's own single-removal effect. Comparing the two tells you whether a
channel matters on its own or only in combination with others.

## What it found

Region importance comes from **which areas the removed channels come from**: if an area's channels get
selected early, that area matters more to the decode. The result was **area-specific**. The anterior
cingulate cortex was most relevant for **joint, population-level** contributions (the random search
degraded accuracy faster than the ranked one, so importance is best explained by channels acting
together), while the prefrontal cortex was most relevant for **individual-channel** contributions.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 250" role="img" aria-labelledby="ia-bar-title">
  <title id="ia-bar-title">Relative importance of ACC, PFC, and caudate for random (joint) and ranked (individual) channel removal</title>
  <line class="grid-line" x1="70" y1="128" x2="680" y2="128"/>
  <text class="t-muted" x="46" y="60" text-anchor="middle" transform="rotate(-90 46 60)">more important</text>
  <text class="t-muted" x="46" y="196" text-anchor="middle" transform="rotate(-90 46 196)">less important</text>
  <!-- Random group -->
  <rect x="140" y="56" width="46" height="72" fill="#c0504d"/>
  <rect x="194" y="128" width="46" height="27" fill="#3b5a9a"/>
  <rect x="248" y="128" width="46" height="36" fill="#4a9b5e"/>
  <text class="t-muted" x="240" y="210" text-anchor="middle">Random  (joint)</text>
  <!-- Rank group -->
  <rect x="440" y="116" width="46" height="12" fill="#c0504d"/>
  <rect x="494" y="71" width="46" height="57" fill="#3b5a9a"/>
  <rect x="548" y="128" width="46" height="63" fill="#4a9b5e"/>
  <text class="t-muted" x="540" y="210" text-anchor="middle">Ranked  (individual)</text>
  <!-- legend -->
  <rect x="470" y="30" width="12" height="12" fill="#c0504d"/><text x="488" y="40">ACC</text>
  <rect x="536" y="30" width="12" height="12" fill="#3b5a9a"/><text x="554" y="40">PFC</text>
  <rect x="600" y="30" width="12" height="12" fill="#4a9b5e"/><text x="618" y="40">caudate</text>
</svg>
<figcaption><b>Which areas mattered</b> (redrawn from the dissertation). Under random removal, which measures joint contributions, the anterior cingulate cortex was most important; under ranked removal, which measures individual contributions, the prefrontal cortex was. The caudate sat below average in both, which is why I do not list it among the important areas.</figcaption>
</figure>

In later work, analyzing the trained model further surfaced a property I had not built in: it sharpens
for particular feature dimensions on particular trials, a kind of attentional filtering. That is an
ongoing analysis rather than a result of the removal study above.

## Why this is my bridge to interpretability

Perturb a component, measure the effect on the output, attribute function. **Zeroing a channel and
watching accuracy fall is ablation**, one of the core tools of mechanistic interpretability. I have
done it on my own neural decoders and on real neural data, which is the honest version of the claim. I
have **not** trained sparse autoencoders on a transformer, built circuit graphs, or studied
superposition; the natural next step, **activation patching** inside a network, is exactly the kind of
work I am moving toward, and the [full explainer]({{ '/writing/attribution-as-interpretability/' | relative_url }})
draws the line between the two carefully.

## What I would flag

Removal-based attribution has real limits, and I read it accordingly. Correlated inputs share credit,
so removing one channel can look unimportant simply because a neighbor carries the same information.
Importance is always relative to *this* trained model, not proof of causal structure in the brain. I
treat these results as attribution, not a mechanism I have proven.
