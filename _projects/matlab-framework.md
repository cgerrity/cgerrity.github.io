---
title: A hand-written deep-learning framework for neural data
category: research
order: 4
kicker: Doctoral research · research engineering
summary: >-
  A 200+ function MATLAB framework I wrote to turn multi-terabyte intracranial
  recordings into behavior-aligned trials and to train deep decoders on a cluster.
card_desc: >-
  The 200+ function MATLAB framework I wrote by hand: signal pipeline, modular
  architecture engine, cross-validation, and the fix that unblocked a stalled dataset.
role: Sole author. Hand-written code.
period: 2019–2024
stack: [MATLAB, Deep Learning Toolbox, SLURM / HPC]
tags: [MATLAB, Signal processing, Training infrastructure]
links:
  - { label: "Code (GitHub)", url: "https://github.com/cgerrity/Neural-Data-Reading", primary: true }
description: >-
  Neural-Data-Reading, a 200+ function MATLAB deep-learning framework hand-written
  by Charles Gerrity for processing intracranial recordings and training decoders.
---

## Why build a framework

Turning raw, multi-terabyte intracranial recordings into clean, behavior-aligned training data, and
then training deep decoders on a compute cluster, needed infrastructure that did not exist off the shelf
for this kind of data. So I wrote it. Unlike my later
[PyTorch port]({{ '/projects/neural-data-decoding/' | relative_url }}), **this is my own
hand-written code**, predating my heavy use of AI coding tools.

## What it is

A MATLAB framework of **200+ functions** (600+ `cgg_` entries in the repository) built on top of the
Deep Learning Toolbox. It covers the whole path:

- A signal-processing pipeline that turns raw recordings into windowed multi-unit activity and roughly
  30,000 behavior-aligned trials.
- A modular architecture engine (ResNet paths, depthwise-separable convolutions, multi-scale temporal
  kernels) so I could sweep model families cleanly.
- Numerically stable classification heads, a PD-controller loss scheduler, and Monte-Carlo stratified
  benchmarking.
- Hierarchical stratified k-fold cross-validation that balances folds across feature, region, and
  outcome.

## Scale, stated precisely

My own dissertation dataset is **over 2 TB**. A second lab's dataset is **also over 2 TB**, and this
pipeline processed both, so it has handled **more than 4 TB across the two datasets**. My single
dataset is over 2 TB, not 4.

On the cluster I used **gradient accumulation to emulate large effective batches within limited
memory**. That is a memory technique, not a speedup. A **separate refactor during my postdoc moved
training onto the GPU**, and that migration is what produced roughly a **4x speedup**; the gradient
accumulation only made the larger batches fit, and did not cause the speedup. I keep those two facts
distinct because they are different things.

## The channel-map fix

This one is my own account, from lab experience rather than the dissertation. An inverted
probe-to-EIB (electrode interface board) routing transform scrambled channel order and had **stalled two prior researchers**
on the foundational dataset. I reverse-engineered the full signal path, from the probe through the
electrode interface board, the Intan headstage, and the Open Ephys recorder, rebuilt the channel map
programmatically from first principles, and validated it against the spatial-correlation structure you
expect from neighboring channels. That unblocked the dataset.

## Used beyond my own project

Three other lab members adopted the pipeline, and the same code processed the second lab's dataset.
Along the way it supported two conference presentations and three manuscripts in preparation.
