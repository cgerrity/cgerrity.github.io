---
title: "Beyond persistent coding: confidence-gated decoding"
order: 6
date: 2026-07-16
status: Work in progress
dek: >-
  If the neural code for a feature comes and goes, a decoder that assumes it is
  always present is the wrong tool. My current method reads the feature when it is
  there, reports when it is not, and does so without behavioral labels.
tags: [Current work, Neural decoding]
description: >-
  Current, in-progress method: confidence-gated multiple-instance learning on the
  gated-recurrent VAE, motivated by attentional filtering during learning.
  Targeting a machine-learning venue.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "persistent", label: "Why persistent coding breaks" }
  - { id: "mil", label: "Multiple instance learning" }
  - { id: "confidence", label: "Confidence gating" }
  - { id: "stitching", label: "Stitching sessions together" }
  - { id: "status", label: "What it is for, and where it stands" }
  - { id: "refs", label: "References" }
---

<div class="callout">
  <span class="callout-title">Work in progress</span>
  This describes active, unpublished work. The method is built and still being refined; the numbers and
  claims here are current directions, not settled results.
</div>

## The short version {#short-version}

My [dissertation decoder]({{ '/writing/decoding-with-a-grvae/' | relative_url }}) assumed, like most
neural decoders, that the information it needs is present at every moment of a trial. The neuroscience
says otherwise. The [attentional-filtering result]({{ '/writing/attentional-filtering/' | relative_url }})
shows that the brain's explicit code for the rewarded feature is strong while an animal is learning a
block and fades once the choice becomes automatic, and within a single trial the decisive signal is
there at some moments and not others. My current work rebuilds the decoder to handle both: a
**confidence-gated, multiple-instance** model that reads the feature when it is there, and tells you when
it is not, without needing behavioral labels to do so.

## Why persistent coding breaks {#persistent}

Most sequence decoders assume **persistent coding**: that the thing you are reading is present at every
time step, so every window of the trial can be treated as equally informative. If the signal actually
comes and goes, that assumption costs you twice. You dilute the informative moments by averaging them
with uninformative ones, and you have no way to tell, on a given trial, whether the information was
there at all. The attentional-filtering finding is exactly this problem made visible: the code is strong
in some conditions and some moments and absent in others.

So the redesign has two jobs: find the informative moments, and know when there are none.

## Multiple instance learning {#mil}

The first job is **multiple instance learning (MIL)**. Instead of demanding that the model classify the
feature correctly at every window of the trial, MIL treats the whole trial as a **bag** of time-windows
and asks only that the *bag* be classifiable. Concretely, the model produces raw scores across all
classes and all windows, applies a single softmax over both at once, and then pools over windows. That
lets it concentrate on the windows that actually carry the signal instead of being forced to assume a
uniform distribution over time.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 180" role="img" aria-labelledby="mil-title">
  <title id="mil-title">Multiple instance learning treats a trial as a bag of time-windows and finds the few that carry the decodable signal</title>
  <defs><marker id="milah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead" d="M0,0 L6.5,3 L0,6 Z"/></marker></defs>
  <path class="flow" d="M70 44 L70 34 L620 34 L620 44"/>
  <text class="t-muted" x="345" y="26" text-anchor="middle">one trial = a bag of time-windows</text>
  <rect class="box-2" x="70" y="50" width="46" height="46" rx="5"/>
  <rect class="box-2" x="120" y="50" width="46" height="46" rx="5"/>
  <rect class="box-2" x="170" y="50" width="46" height="46" rx="5"/>
  <rect class="box-accent" x="220" y="50" width="46" height="46" rx="5"/>
  <rect class="box-accent" x="270" y="50" width="46" height="46" rx="5"/>
  <rect class="box-2" x="320" y="50" width="46" height="46" rx="5"/>
  <rect class="box-2" x="370" y="50" width="46" height="46" rx="5"/>
  <rect class="box-2" x="420" y="50" width="46" height="46" rx="5"/>
  <rect class="box-accent" x="470" y="50" width="46" height="46" rx="5"/>
  <rect class="box-2" x="520" y="50" width="46" height="46" rx="5"/>
  <rect class="box-2" x="570" y="50" width="46" height="46" rx="5"/>
  <line class="flow" x1="70" y1="116" x2="640" y2="116" marker-end="url(#milah)"/>
  <text class="t-muted" x="345" y="134" text-anchor="middle">time within the trial</text>
  <text class="t-accent" x="70" y="164" font-weight="650">informative windows</text>
  <text class="t-muted" x="222" y="164" font-size="12">the model finds these, instead of assuming every window carries the signal</text>
</svg>
<figcaption><b>The trial as a bag.</b> Standard decoders weight every time-window equally. Multiple instance learning treats the trial as a bag of windows and lets the model concentrate on the few that actually carry the decodable feature, which is what you want when the signal is sparse in time.</figcaption>
</figure>

## Confidence gating {#confidence}

The second job is knowing when the signal is absent. I add **confidence heads** to the classifier that
do selective classification at three levels: per **feature dimension** (is this feature encoded in the
latent state right now?), per **trial** (is this trial informative at all?), and per **dataset**. These
are trained as an extra output, a bounded confidence between zero and one, so the model can decline to
commit when the code is not there rather than guessing.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 244" role="img" aria-labelledby="cg-title">
  <title id="cg-title">The confidence-gated architecture: the GR-VAE latent feeds a multi-branch classifier with MIL-pooled classification heads plus task- and trial-confidence heads</title>
  <defs>
    <marker id="cgah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead" d="M0,0 L6.5,3 L0,6 Z"/></marker>
    <marker id="cgaha" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead-accent" d="M0,0 L6.5,3 L0,6 Z"/></marker>
  </defs>
  <rect class="box-accent" x="8" y="92" width="132" height="60" rx="8"/>
  <text class="t-accent" x="74" y="118" text-anchor="middle">GR-VAE latent z</text>
  <text class="t-muted" x="74" y="136" text-anchor="middle">250-d manifold</text>
  <line class="flow-accent" x1="140" y1="122" x2="172" y2="122" marker-end="url(#cgaha)"/>
  <rect class="box" x="176" y="92" width="150" height="60" rx="8"/>
  <text class="t-title" x="251" y="116" text-anchor="middle">Multi-branch LSTM</text>
  <text class="t-muted" x="251" y="134" text-anchor="middle">one branch per feature</text>
  <line class="flow" x1="326" y1="118" x2="372" y2="46" marker-end="url(#cgah)"/>
  <line class="flow" x1="326" y1="122" x2="372" y2="122" marker-end="url(#cgah)"/>
  <line class="flow" x1="326" y1="126" x2="372" y2="198" marker-end="url(#cgah)"/>
  <rect class="box-accent" x="376" y="20" width="336" height="52" rx="8"/>
  <text class="t-title" x="392" y="44" font-size="12.5">Feature classes → MIL pool over windows</text>
  <text class="t-muted" x="392" y="62" font-size="11">reads the chosen feature</text>
  <rect class="box" x="376" y="96" width="336" height="52" rx="8"/>
  <text class="t-title" x="392" y="120" font-size="12.5">Task confidence · one per feature</text>
  <text class="t-muted" x="392" y="138" font-size="11">is this feature encoded right now?</text>
  <rect class="box" x="376" y="172" width="336" height="52" rx="8"/>
  <text class="t-title" x="392" y="196" font-size="12.5">Trial confidence</text>
  <text class="t-muted" x="392" y="214" font-size="11">is this trial informative at all?</text>
</svg>
<figcaption><b>Confidence gating.</b> The latent manifold from the gated-recurrent VAE feeds a branch per feature dimension. Each branch reads the feature (pooled over time by multiple instance learning) and, separately, reports a confidence: whether that feature is encoded, and whether the trial carries information at all.</figcaption>
</figure>

The payoff I am after is twofold. Practically, gating on confidence lets you read out only the trials
and features that carry information, instead of checking every one by hand. Scientifically, the
confidence heads are a way to **probe trial-by-trial shifts in feature information without post-hoc
behavioral labels**, which is what makes them a link back to the attentional-filtering result: task and
trial confidence should track when the animal is attending and where it is in learning.

## Stitching sessions together {#stitching}

The dissertation decoder trained on a single session. To pool information across the 25 sessions, the
framework includes a **session-specific stitching-and-fusion module** that maps each session's
recordings into a shared latent space, so one model can learn across sessions with different probe
layouts. This is the piece that would let the method scale to new datasets, and it is the part still
being stabilized.

## What it is for, and where it stands {#status}

Stated honestly: the goal here is not necessarily a higher raw accuracy than the original decoder. It
is a decoder that **knows what it knows**, that can find information sparse in time and flag trials
where there is none, and that gives a label-free readout of when the brain is representing the feature
it cares about. That readout is the bridge from the neuroscience finding
([attentional filtering]({{ '/writing/attentional-filtering/' | relative_url }})) to a usable method.

Where it stands: the method is implemented and being refined, with the stitching-and-fusion module the
main piece still being stabilized. I am targeting a machine-learning submission on the method, with a
workshop version along the way. The
[PyTorch reimplementation]({{ '/projects/neural-data-decoding/' | relative_url }}) is part of getting
there. This is the "understand" step of my
[longer arc]({{ '/writing/decode-understand-alter/' | relative_url }}), pushed toward asking, trial by
trial, exactly what information the signal carries.

## References {#refs}

- Gerrity, C. G., Treuting, R. L., Peters, R. A., &amp; Womelsdorf, T. (2025). *Neuronal decoding of
  decisions in multidimensional feature space using a gated recurrent variational autoencoder.*
  [bioRxiv 2025.08.20.671126]({{ site.links.preprint }}). The base decoder this work extends.
- Ilse, M., Tomczak, J., &amp; Welling, M. (2018). *Attention-based deep multiple instance learning.*
  [arXiv:1802.04712](https://arxiv.org/abs/1802.04712). Background on the MIL objective.
