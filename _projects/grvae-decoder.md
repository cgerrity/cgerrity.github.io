---
title: Decoding value-based decisions with a gated-recurrent VAE
category: research
order: 1
kicker: Doctoral research · first-author preprint
summary: >-
  A variational autoencoder with a recurrent encoder and per-feature classifiers
  that reads a monkey's chosen object, along four visual feature dimensions, from
  hundreds of simultaneously recorded intracranial channels.
card_desc: >-
  A recurrent VAE that reads a monkey's chosen object, along four feature
  dimensions, from 300+ intracranial channels. About 62% balanced accuracy across
  all four features; about 80% on the rewarded feature alone.
role: Sole first author. Ran the experiments, wrote the framework, built and interpreted the model.
period: 2021–2024
stack: [MATLAB, Deep Learning Toolbox, SLURM / HPC]
tags: [Variational autoencoders, Neural decoding, GRU / LSTM, Electrophysiology]
links:
  - { label: "Read the preprint", url: "https://www.biorxiv.org/content/10.1101/2025.08.20.671126v1", primary: true }
  - { label: "Explainer: how it works", url: "/writing/decoding-with-a-grvae/" }
  - { label: "Code (PyTorch port)", url: "https://github.com/cgerrity/neural_data_decoding" }
description: >-
  A first-author gated-recurrent variational autoencoder that decodes value-based
  feature choices from 300+ simultaneously recorded intracranial channels in awake
  non-human primates.
---

## The problem

An animal is learning which visual feature is worth choosing. On each trial it sees three objects
and picks one by looking at it; a correct choice earns a token that later cashes out for juice.
Every object varies along four feature dimensions, **shape, pattern, color, and arm type**, and in a
given session three of those dimensions vary while one is held neutral. Within a block, one feature
is the rewarded one, and the animal has to figure out which.

The question I set out to answer: as that decision forms, can we read the chosen object's features
straight out of the neural activity, and can we tell where and when in the brain that information
lives?

## The data

I recorded from awake, behaving non-human primates using acute high-density depth probes. This is
**intracranial electrophysiology, not EEG**. Across the project I ran more than 25 recording
sessions; the session analyzed here had **321 simultaneously recorded channels** (I pitch this as
300+, since simultaneous counts vary across sessions) spanning frontal cortex and striatum. I
performed the acute implantations and ran the recordings myself, on a rig I tested and used but did
not design.

The model's input is windowed multi-unit activity from **1.5 seconds before to 1.5 seconds after**
the recorded choice.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 250" role="img" aria-labelledby="grvae-fig-title">
  <title id="grvae-fig-title">Architecture of the gated-recurrent variational autoencoder</title>
  <defs>
    <marker id="ah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead" d="M0,0 L6.5,3 L0,6 Z"/></marker>
    <marker id="aha" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead-accent" d="M0,0 L6.5,3 L0,6 Z"/></marker>
  </defs>

  <!-- Input -->
  <rect class="box" x="8" y="92" width="120" height="78" rx="8"/>
  <text class="t-title" x="68" y="122" text-anchor="middle">Neural input</text>
  <text class="t-muted" x="68" y="140" text-anchor="middle">300+ channels</text>
  <text class="t-muted" x="68" y="156" text-anchor="middle">MUA time windows</text>

  <line class="flow" x1="128" y1="131" x2="162" y2="131" marker-end="url(#ah)"/>

  <!-- Encoder -->
  <rect class="box" x="166" y="92" width="120" height="78" rx="8"/>
  <text class="t-title" x="226" y="126" text-anchor="middle">GRU encoder</text>
  <text class="t-muted" x="226" y="146" text-anchor="middle">recurrent, temporal</text>

  <line class="flow-accent" x1="286" y1="131" x2="320" y2="131" marker-end="url(#aha)"/>

  <!-- Latent -->
  <rect class="box-accent" x="324" y="86" width="150" height="90" rx="8"/>
  <text class="t-accent" x="399" y="118" text-anchor="middle">Latent space</text>
  <text class="t-muted" x="399" y="138" text-anchor="middle">encode to μ, σ</text>
  <text class="t-muted" x="399" y="156" text-anchor="middle">sample z = μ + σ·ε</text>

  <!-- Decoder (auxiliary, dashed) -->
  <path class="flow" d="M420 86 C420 50, 470 40, 512 40" stroke-dasharray="5 4" marker-end="url(#ah)"/>
  <rect class="box-2" x="516" y="14" width="196" height="52" rx="8"/>
  <text class="t-title" x="614" y="36" text-anchor="middle">GRU decoder</text>
  <text class="t-muted" x="614" y="54" text-anchor="middle">reconstruction (auxiliary)</text>

  <!-- Classifier -->
  <line class="flow-accent" x1="474" y1="140" x2="512" y2="150" marker-end="url(#aha)"/>
  <rect class="box" x="516" y="92" width="196" height="146" rx="8"/>
  <text class="t-title" x="614" y="114" text-anchor="middle">Per-feature classifiers</text>
  <circle class="dot" cx="540" cy="138" r="3"/><text x="552" y="142">Shape</text>
  <circle class="dot" cx="540" cy="162" r="3"/><text x="552" y="166">Pattern</text>
  <circle class="dot" cx="540" cy="186" r="3"/><text x="552" y="190">Color</text>
  <circle class="dot" cx="540" cy="210" r="3"/><text x="552" y="214">Arm type</text>
</svg>
<figcaption><b>The decoder.</b> A GRU encoder compresses windowed multi-unit activity into a probabilistic latent space. A sampled latent vector feeds two paths: a GRU decoder that reconstructs the input (an auxiliary, unsupervised objective) and a set of per-feature classifiers, one for each feature dimension. Schematic; the optimal configuration used a GRU encoder with an LSTM classifier.</figcaption>
</figure>

## The model

The decoder is a **variational autoencoder**. A recurrent (GRU) encoder maps the multi-unit activity
into a latent space defined by a mean and a variance; a latent vector is sampled from that
distribution using the reparameterization trick; and two things read from that sample. A recurrent
decoder reconstructs the input as an auxiliary objective, and a set of classifiers on the latent
space predicts the chosen object's features, one small sub-network per feature dimension.

I chose recurrent units so the model could use the temporal structure of the signal as evidence
accumulates toward the choice. I swept six model families (feedforward, GRU, LSTM, convolutional,
ResNet, and a multi-scale convolutional variant); the GRU encoder with an LSTM classifier came out on
top, and the non-neural baselines (logistic regression, SVMs, naive Bayes) could not beat chance.

Training ran in a MATLAB deep-learning framework I wrote by hand, on a SLURM cluster, with a
composite loss (reconstruction, classification, and a KL term), class-weighted cross-entropy to
handle the over-represented neutral feature, and **hierarchical stratified k-fold cross-validation**
that balances every fold across feature, region, and outcome.

## The results

The dissertation reports **chance-corrected (scaled) balanced accuracy**, where 0 is chance and 1 is
perfect.

- **Overall, across all four feature dimensions: about 62% balanced accuracy (raw), which is roughly
  15% above chance once chance-corrected.** These are the same result stated two ways.
- **About 80% when decoding is restricted to the rewarded feature** on trials where the animal chose
  it (for example, green versus blue, red, or neutral on a green-rewarded block). This is a genuine
  capability of the model on the target feature; it is not the overall number, and reward here is a
  property of the block, not a class the decoder outputs.
- Decoding is stronger on low-attentional-load trials, stronger and less variable on correct trials
  than errors, and rises around the point where the animal's behavior shows it has learned the block.

## Where it leads

This decoder is the "read" side of a longer arc I set out in my qualifying exam: **decode a choice,
understand what in the signal drives the decode, then use that understanding to steer the choice with
stimulation.** I executed the decoding and the understanding; the stimulation piece was a proposal, and
I did not carry it out. The [attribution work]({{ '/projects/importance-analysis/' | relative_url }})
is how I studied what the decoder relies on, and the [full write-up]({{ '/writing/decoding-with-a-grvae/' | relative_url }})
walks through the model in detail. I lay out the whole arc, and where it stops, in
[this essay]({{ '/writing/decode-understand-alter/' | relative_url }}).
