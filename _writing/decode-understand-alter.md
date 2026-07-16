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

## Decode (done) {#decode}

The first step was the forward map: the best model of the chosen object's features given the neural
signal. That became the [gated-recurrent variational autoencoder]({{ '/projects/grvae-decoder/' | relative_url }}),
a first-author preprint. It reads the choice from 300+ simultaneously recorded intracranial channels
at well above chance. This is the "read" side of a brain-computer interface, taken end to end: I
collected the data, wrote the pipeline, and built and validated the decoder.

## Understand (done) {#understand}

The second step was to interrogate the decoder and the data: which task variables are present in the
activity, and which channels, regions, and latent units the model relies on. That is the regression
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
