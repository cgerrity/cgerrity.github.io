---
title: "Decode, understand, alter: the shape of the work"
order: 3
date: 2026-07-16
dek: >-
  The through-line of my doctoral work, from reading a decision out of the brain to
  a stimulation idea I proposed but did not carry out, and where the thread points now.
tags: [Research arc, Brain-computer interfaces]
description: >-
  Charles Gerrity's research arc: decoding decisions, understanding the decode, and
  the proposed stimulation experiment, stated with a clear line between what was
  executed and what was designed.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "one-question", label: "One question, three steps" }
  - { id: "decode", label: "Decode (done)" }
  - { id: "understand", label: "Understand (done)" }
  - { id: "alter", label: "Alter (proposed, not done)" }
  - { id: "flanks", label: "What I have, and what I don't" }
  - { id: "now", label: "Where it points now" }
---

## The short version {#short-version}

My doctoral work was organized around a single question: **can a decision be altered in a
feature-specific way?** The plan had three steps. Decode a choice from neural activity, understand
what in the signal drives the decode, then use that understanding to steer the choice with
stimulation. I executed the first two. The third, the stimulation experiment, was a design I proposed
and did not carry out. I lay the arc out here with that line drawn clearly, because the honest version
is more useful than an inflated one.

## One question, three steps {#one-question}

The setup is the value-based feature-learning task described in the
[decoder write-up]({{ '/writing/decoding-with-a-grvae/' | relative_url }}): a monkey chooses among
objects that vary along four features, learning which feature is rewarded. My qualifying exam proposed
a dependent, three-experiment pipeline aimed at one motivating question. Decode the choice, understand
the decode, alter the choice. The dissertation carried out the first two and reported the third only as
a single future-work sentence.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 960 210" role="img" aria-labelledby="arc-title">
  <title id="arc-title">The three-step arc: decode the choice (done), understand the decode (done), and alter the choice with stimulation (proposed, not carried out)</title>
  <defs>
    <marker id="arcah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead-accent" d="M0,0 L6.5,3 L0,6 Z"/></marker>
  </defs>

  <rect class="box-accent" x="12" y="34" width="286" height="122" rx="10"/>
  <text class="t-accent" x="30" y="64" font-weight="650">1 · Decode</text>
  <rect x="228" y="48" width="56" height="20" rx="10" fill="#2e9e6b"/>
  <text x="256" y="62" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="650">DONE</text>
  <text class="t-muted" x="30" y="96">Read the chosen object's</text>
  <text class="t-muted" x="30" y="114">features from neural activity.</text>
  <text class="t-accent" x="30" y="140" font-size="11">the GRVAE decoder</text>

  <line class="flow-accent" x1="298" y1="95" x2="332" y2="95" marker-end="url(#arcah)"/>

  <rect class="box-accent" x="337" y="34" width="286" height="122" rx="10"/>
  <text class="t-accent" x="355" y="64" font-weight="650">2 · Understand</text>
  <rect x="553" y="48" width="56" height="20" rx="10" fill="#2e9e6b"/>
  <text x="581" y="62" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="650">DONE</text>
  <text class="t-muted" x="355" y="96">Find which regions and</text>
  <text class="t-muted" x="355" y="114">signals drive the decode.</text>
  <text class="t-accent" x="355" y="140" font-size="11">importance analysis</text>

  <line class="flow-accent" x1="623" y1="95" x2="657" y2="95" marker-end="url(#arcah)"/>

  <rect class="box-2" x="662" y="34" width="286" height="122" rx="10" stroke-dasharray="6 4"/>
  <text class="t-title" x="680" y="64" font-weight="650">3 · Alter</text>
  <rect class="box" x="856" y="48" width="80" height="20" rx="10" stroke-dasharray="3 3"/>
  <text x="896" y="62" text-anchor="middle" class="t-muted" font-size="10.5" font-weight="650">PROPOSED</text>
  <text class="t-muted" x="680" y="96">Steer the choice with</text>
  <text class="t-muted" x="680" y="114">model-derived stimulation.</text>
  <text class="t-muted" x="680" y="140" font-size="11">designed, not carried out</text>
</svg>
<figcaption><b>Decode, understand, alter.</b> I executed the first two steps: a decoder that reads the choice, and an analysis of what drives it. The third, steering the choice with stimulation, was a design I proposed in my qualifying exam and did not carry out.</figcaption>
</figure>

## Decode (done) {#decode}

The first step was the forward map: the best model of the chosen object's features given the neural
signal. That became the [gated-recurrent variational autoencoder]({{ '/projects/grvae-decoder/' | relative_url }}),
a first-author preprint. It reads the choice from 300+ simultaneously recorded intracranial channels
above chance. This is the "read" side of a brain-computer interface, taken end to end: I
collected the data, wrote the pipeline, and built and validated the decoder.

## Understand (done) {#understand}

The second step was to interrogate the decoder and the data: which task variables are present in the
activity, which channels and regions the model relies on, and what its latent space encodes. That is the regression
and correlation analysis in the dissertation plus the
[Importance Analysis]({{ '/writing/attribution-as-interpretability/' | relative_url }}). It located
area-specific contributions across the anterior cingulate cortex, prefrontal cortex, and caudate, and
it is the same interrogate-the-model discipline that carries over to interpretability of artificial
networks.

One attribution point matters for what comes next. The learning model that supplied latent variables
for the correlation analysis was fit by my advisor; my executed contribution there was correlating
those variables against the recorded activity, along with the regressions and the importance analysis.

## Alter (proposed, not done) {#alter}

The third step was the point of the whole thing, and it is the one I did not execute. The idea was to
take an inverse map, from a chosen feature back to the neural pattern that represents it, and use it to
deliver **biomimetic, per-site electrical stimulation** that mimics the brain's own activity for a
target feature, steering the choice. The proposal defined itself against earlier high-energy caudate
stimulation by using model-derived, brain-mimicking patterns instead.

Two things did not happen, and I state them plainly. **I never built the inverse map** (proposed as a
generative model), and because the stimulation experiment stands entirely on that map, **no
stimulation was performed**. I did not stimulate a brain, alter an animal's learning, or build a
closed-loop or biomimetic stimulator. In fact the dissertation's own stated next step is not
stimulation at all; it is scaling the decoder across sessions by stitching data together. The
stimulation idea is a longer-horizon design, not a result.

## What I have, and what I don't {#flanks}

I have executed the two pieces that flank the stimulation project, but not the project
itself.

- **The read and target-identification side (done).** The decoder plus the attribution is exactly the
  machinery that would tell you which sites carry a given feature, which is where you would stimulate.
- **The stimulation-parameter side (done, but earlier and separate).** My
  [Masters framework]({{ '/projects/beta-burst/' | relative_url }}) is an offline benchmarking and
  tuning system for the burst-detection and phase-characterization methods a phase-locked stimulator
  would depend on. It is offline; real-time stimulation was only its motivation.
- **The write side (not built).** The inverse map and any stimulation system remain something I
  designed and am moving toward, not something I have implemented.

## Where it points now {#now}

Two directions follow from this. One is **mechanistic interpretability of artificial networks**, which
is the same understand step aimed at a network whose weights are fully visible. The other is the current
neuroscience work: **confidence-gated decoding** that asks, trial by trial, how much information the
signal actually carries, along with stitching multiple sessions into one model, aimed at a machine
learning venue.

I write these explainers as part of that same arc, to keep the boundary between what was proven and
what was proposed visible, to myself as much as to a reader.
