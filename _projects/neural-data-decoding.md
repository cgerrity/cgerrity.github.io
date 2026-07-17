---
title: A PyTorch reimplementation, verified to parity
category: research
order: 3
kicker: Research engineering
summary: >-
  A ground-up PyTorch port of the MATLAB decoding pipeline that I designed, directed,
  and verified, matching the original to roughly 1e-9 on a composite forward pass.
card_desc: >-
  A ground-up PyTorch port of the decoding pipeline, designed and verified to
  roughly 1e-9 composite forward-pass parity with the MATLAB original.
role: Designer, director, and verifier. Built with heavy use of AI coding tools.
period: 2025–present
stack: [PyTorch, OmegaConf, SLURM, pytest]
tags: [PyTorch, Reproducibility, Research engineering]
links:
  - { label: "Code (GitHub)", url: "https://github.com/cgerrity/neural_data_decoding", primary: true }
  - { label: "The decoder it reproduces", url: "/projects/grvae-decoder/" }
description: >-
  A PyTorch reimplementation of the MATLAB neural decoding pipeline, designed and
  verified by Charles Gerrity to roughly 1e-9 composite forward-pass parity.
---

## Why port it at all

The [decoder]({{ '/projects/grvae-decoder/' | relative_url }}) and its training framework were
written in MATLAB. To keep the science moving and to run on modern tooling, I moved the active
production path into PyTorch: the VAE sampling, the composite loss, the confidence and
multiple-instance-learning pooling, the two-stage training lifecycle, and the data pipeline.

## How it was built

I **designed, directed, and verified** this port, and I built it with heavy use of AI coding tools
(Claude Code). The design and the verification are mine because it reproduces a pipeline I already
knew intimately; the line-by-line implementation was AI-assisted. I think working fluently with these
tools is a strength, and I would rather describe how the code was made than imply I hand-wrote every
line. (By contrast, the [original MATLAB framework]({{ '/projects/matlab-framework/' | relative_url }})
is my own hand-written code.)

## Verification is the point

Porting a numerical model is only useful if you can prove the new one behaves like the old one, so I
verified it **component by component**: encoder, bottleneck, classifier, and the full composite path.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 200" role="img" aria-labelledby="par-title">
  <title id="par-title">Forward-pass parity to the MATLAB original: encoder stacks about 1e-7 and the composite about 1e-9, both far tighter than the 1e-5 automated test gate</title>
  <line class="grid-line" x1="80" y1="120" x2="690" y2="120"/>
  <line class="grid-line" x1="90" y1="116" x2="90" y2="124" opacity="0.6"/><text class="t-muted" x="90" y="140" text-anchor="middle" font-size="11">1e-3</text>
  <line class="grid-line" x1="238" y1="116" x2="238" y2="124" opacity="0.6"/><text class="t-muted" x="238" y="140" text-anchor="middle" font-size="11">1e-5</text>
  <line class="grid-line" x1="385" y1="116" x2="385" y2="124" opacity="0.6"/><text class="t-muted" x="385" y="140" text-anchor="middle" font-size="11">1e-7</text>
  <line class="grid-line" x1="532" y1="116" x2="532" y2="124" opacity="0.6"/><text class="t-muted" x="532" y="140" text-anchor="middle" font-size="11">1e-9</text>
  <line class="grid-line" x1="680" y1="116" x2="680" y2="124" opacity="0.6"/><text class="t-muted" x="680" y="140" text-anchor="middle" font-size="11">1e-11</text>
  <line x1="238" y1="52" x2="238" y2="120" stroke="var(--color-text-muted)" stroke-width="1.4" stroke-dasharray="4 3"/><text class="t-muted" x="238" y="46" text-anchor="middle">test gate (1e-5)</text>
  <circle class="dot" cx="385" cy="120" r="6"/>
  <text class="t-accent" x="385" y="86" text-anchor="middle" font-weight="650">encoder stacks</text><text class="t-muted" x="385" y="102" text-anchor="middle" font-size="11">~1e-7</text>
  <circle class="dot" cx="532" cy="120" r="6"/>
  <text class="t-accent" x="532" y="164" text-anchor="middle" font-weight="650">composite forward pass</text><text class="t-muted" x="532" y="180" text-anchor="middle" font-size="11">~1e-9</text>
  <text class="t-muted" x="385" y="196" text-anchor="middle" font-size="11">max absolute difference vs MATLAB, smaller (further right) is better</text>
</svg>
<figcaption><b>Verified to parity.</b> Loading the MATLAB-trained weights into the PyTorch modules and forwarding the same input, the recurrent encoder stacks agree to about 1e-7 and the full composite forward pass to about 1e-9, both far tighter than the 1e-5 tolerance the automated tests require.</figcaption>
</figure>

- The **full composite forward pass matches the MATLAB original to roughly 1e-9** (maximum absolute
  difference), the tightest of the checks; the recurrent encoder stacks agree to about 1e-7. The
  automated test gate is set at a looser **1e-5**, so the observed agreement is far inside it.
- A separate general suite of **roughly 800 tests** covers the data pipeline, stratified sampling,
  checkpointing, and the MATLAB-to-PyTorch weight conversion.

These are two different things and I keep them distinct: the ~1e-9 figure is the measured
composite forward-pass parity, and the ~800 tests are the general suite, not a certification of that number.

## Engineering choices

Configuration is **composable and OmegaConf-based** (Hydra-style layering, resolved at runtime
through OmegaConf rather than Hydra's own API). The repository includes a SLURM sweep dispatcher for
cluster runs and writes `.mat`-compatible output where the downstream MATLAB analysis still consumes
it. Some of the docs are scaffolds rather than finished reference, which I would rather state than
oversell.
