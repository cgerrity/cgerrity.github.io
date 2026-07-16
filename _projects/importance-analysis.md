---
title: Feature attribution on my own decoders
category: research
order: 2
kicker: Interpretability, one level down
summary: >-
  Permutation-based attribution that asks which channels, brain regions, and latent
  units a trained neural decoder actually relies on, validated against a null.
card_desc: >-
  Shuffle a neural input, a region, or a latent unit and measure how far decoding
  accuracy falls. The same question ablation and activation patching ask of
  artificial networks.
role: Sole author of the analysis and its code.
period: 2022–2024
stack: [MATLAB, Monte Carlo, Permutation testing]
tags: [Attribution, Explainability, Interpretability]
links:
  - { label: "Explainer: the bridge to interpretability", url: "/writing/attribution-as-interpretability/", primary: true }
  - { label: "Preprint", url: "https://www.biorxiv.org/content/10.1101/2025.08.20.671126v1" }
description: >-
  Permutation and removal-based feature attribution on a neural decoder, framed
  as the honest bridge from systems neuroscience to mechanistic interpretability.
---

## A decoder is not an explanation

A trained decoder tells you the information is in the signal. It does not tell you *where* it lives
or *what* the model leans on to read it. Once the [GRVAE decoder]({{ '/projects/grvae-decoder/' | relative_url }})
worked, the more interesting question was which channels, which brain regions, and which latent units
it actually used.

## Remove, then measure

The method I call **Importance Analysis** is permutation and removal-based attribution. Shuffle or
remove one input channel, one whole brain region, or one latent unit, run the decoder again, and
measure how far accuracy falls. A large drop means the model was relying on what you removed. To keep
this honest, I compare each drop against a null built by Monte Carlo and permutation testing, so a
result only counts when it exceeds what random reshuffling produces.

## What it found

The attribution pointed to **area-specific contributions**: the anterior cingulate cortex mattered
most for joint, population-level contributions, the prefrontal cortex for individual-channel
contributions, and the caudate contributed as well. Analyzing the model this way also surfaced an
**emergent behavior I did not build in**: the decoder sharpens for particular feature dimensions on
particular trials, a kind of attentional filtering that only showed up once I interrogated the
trained network.

## Why this is my bridge to interpretability

Perturb a component, measure the effect on the output, attribute function. That is exactly the move
that **ablation and activation patching** make in mechanistic interpretability of artificial
networks. I have done it on my own neural decoders and on real neural data, which is the honest
version of the claim. I have **not** trained sparse autoencoders on a transformer, built circuit
graphs, or studied superposition; that is the work I am moving toward, and the [full explainer]({{ '/writing/attribution-as-interpretability/' | relative_url }})
draws the line between the two carefully.

## What I would flag

Permutation attribution has real limits, and I read it accordingly. Correlated inputs share credit,
so removing one channel can look unimportant simply because a neighbor compensates. Importance is
always relative to the trained model, not proof of causal structure in the brain. I treat these
results as attribution under a validated null, not as a mechanism I have proven.
