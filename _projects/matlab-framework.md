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

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 960 424" role="img" aria-labelledby="pipe-title">
  <title id="pipe-title">The full pipeline: preprocessing turns raw voltage into continuous multi-unit activity, processing turns it into behavior-aligned tensors, then hierarchical stratified cross-validation feeds the decoder</title>
  <defs>
    <marker id="pah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead-accent" d="M0,0 L6.5,3 L0,6 Z"/></marker>
  </defs>

  <rect class="box-2" x="8" y="8" width="456" height="316" rx="10"/>
  <text class="t-accent" x="30" y="38" font-weight="650">Preprocessing → continuous MUA</text>
  <circle class="dot" cx="34" cy="72" r="3"/><text x="48" y="76">Align data sources <tspan class="t-muted">· task (Unity) + recorder via sync box</tspan></text>
  <circle class="dot" cx="34" cy="108" r="3"/><text x="48" y="112">Apply channel map</text>
  <circle class="dot" cx="34" cy="144" r="3"/><text x="48" y="148">Split into trials</text>
  <circle class="dot" cx="34" cy="180" r="3"/><text x="48" y="184">Identify bad channels <tspan class="t-muted">· PCA + K-means</tspan></text>
  <circle class="dot" cx="34" cy="216" r="3"/><text x="48" y="220">Notch filter <tspan class="t-muted">· 60 / 120 / 180 Hz</tspan></text>
  <circle class="dot" cx="34" cy="252" r="3"/><text x="48" y="256">Median re-reference</text>
  <circle class="dot" cx="34" cy="288" r="3"/><text x="48" y="292">Continuous MUA</text>
  <text class="t-muted" x="48" y="308" font-size="11">band-pass · rectify · low-pass · resample · smooth</text>

  <rect class="box-2" x="488" y="8" width="464" height="316" rx="10"/>
  <text class="t-accent" x="510" y="38" font-weight="650">Processing → tensors</text>
  <circle class="dot" cx="514" cy="72" r="3"/><text x="528" y="76">Epoch + baseline segments <tspan class="t-muted">· ±1.5 s</tspan></text>
  <circle class="dot" cx="514" cy="108" r="3"/><text x="528" y="112">Remove aborted trials</text>
  <circle class="dot" cx="514" cy="144" r="3"/><text x="528" y="148">Detrend <tspan class="t-muted">· baseline trend line</tspan></text>
  <circle class="dot" cx="514" cy="180" r="3"/><text x="528" y="184">Normalize</text>
  <circle class="dot" cx="514" cy="216" r="3"/><text x="528" y="220">Keep task-modulated channels</text>
  <circle class="dot" cx="514" cy="252" r="3"/><text x="528" y="256">Concatenate areas <tspan class="t-muted">· C × T × A</tspan></text>
  <text class="t-muted" x="528" y="292" font-size="11">then window in 100 ms steps, every 50 ms</text>

  <line class="flow-accent" x1="236" y1="324" x2="236" y2="356" marker-end="url(#pah)"/>
  <line class="flow-accent" x1="720" y1="324" x2="720" y2="356" marker-end="url(#pah)"/>
  <rect class="box-accent" x="230" y="360" width="500" height="52" rx="10"/>
  <text class="t-accent" x="480" y="384" text-anchor="middle" font-weight="650">Hierarchical stratified 10-fold cross-validation</text>
  <text class="t-muted" x="480" y="402" text-anchor="middle">balanced across feature, area, outcome, gain/loss, learning, session, then to the decoder</text>
</svg>
<figcaption><b>The full pipeline.</b> Preprocessing turns raw 30 kHz voltage into continuous multi-unit activity; processing turns that into behavior-aligned, channel-by-time-by-area tensors; and a hierarchical stratified cross-validation splits them into balanced folds for the decoder. Each step is walked through below.</figcaption>
</figure>

- A signal-processing pipeline that turns raw recordings into windowed multi-unit activity and roughly
  30,000 behavior-aligned trials ([walked through step by step here]({{ '/writing/neural-data-pipeline/' | relative_url }})).
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
