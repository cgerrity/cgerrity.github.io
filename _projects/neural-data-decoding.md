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
