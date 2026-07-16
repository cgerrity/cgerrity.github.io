---
title: Feature attribution as a bridge to interpretability
order: 2
date: 2026-07-16
dek: >-
  The method I used to ask what my neural decoder relies on is the same move
  mechanistic interpretability makes on artificial networks. Here is the bridge,
  drawn carefully, including where it ends.
tags: [Interpretability, Attribution]
description: >-
  Removal-based feature attribution on a neural decoder, and how it connects,
  honestly, to ablation in mechanistic interpretability.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "problem", label: "A decoder hides its reasons" }
  - { id: "method", label: "The method: remove and measure" }
  - { id: "found", label: "What it found" }
  - { id: "bridge", label: "The bridge to interpretability" }
  - { id: "ends", label: "Where the bridge ends" }
  - { id: "caveats", label: "How I read the results" }
  - { id: "refs", label: "References" }
---

## The short version {#short-version}

Once I had a decoder that could read a monkey's choice from its neural activity, the next question was
which parts of the signal it actually used. The method I used, **remove an input and measure how far
accuracy falls**, is the same basic move that mechanistic interpretability makes when it ablates a
component of a neural network and watches the output change. This piece draws that connection, and it
is honest about where the connection ends: I have done this on my own neural decoders and on real
neural data, not on transformers or language models.

## A decoder hides its reasons {#problem}

A trained [decoder]({{ '/writing/decoding-with-a-grvae/' | relative_url }}) is a black box in a
familiar way. It tells you that the information is in the signal, because it can read the choice back
out, but it does not tell you *what* it leaned on to do so. Which electrodes carried the signal, and
which brain regions? Answering that is a small interpretability problem, and it is the one I actually
worked on.

## The method: remove and measure {#method}

The approach, which I call **Importance Analysis**, is removal-based attribution. Take the trained
model, **zero out one of its input channels** (or a group of them), run it again, and measure how much
worse it does. If removing something costs a lot of accuracy, the model was relying on it. The decoder
already handled unused channels as zeros, so setting a channel to zero is a clean way to take it away.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 210" role="img" aria-labelledby="attr-fig-title">
  <title id="attr-fig-title">Removal-based attribution: zero out channels, measure the accuracy drop, order the removals</title>
  <defs>
    <marker id="ah2" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead" d="M0,0 L6.5,3 L0,6 Z"/></marker>
  </defs>
  <rect class="box" x="8" y="70" width="128" height="70" rx="8"/>
  <text class="t-title" x="72" y="98" text-anchor="middle">Trained decoder</text>
  <text class="t-muted" x="72" y="118" text-anchor="middle">baseline accuracy</text>

  <line class="flow" x1="136" y1="105" x2="176" y2="105" marker-end="url(#ah2)"/>

  <rect class="box-accent" x="180" y="60" width="170" height="90" rx="8"/>
  <text class="t-accent" x="265" y="90" text-anchor="middle">Zero out one part</text>
  <text class="t-muted" x="265" y="112" text-anchor="middle">a channel or a</text>
  <text class="t-muted" x="265" y="129" text-anchor="middle">group of channels</text>

  <line class="flow" x1="350" y1="105" x2="390" y2="105" marker-end="url(#ah2)"/>

  <rect class="box" x="394" y="70" width="150" height="70" rx="8"/>
  <text class="t-title" x="469" y="98" text-anchor="middle">Re-run, measure</text>
  <text class="t-muted" x="469" y="118" text-anchor="middle">accuracy drop</text>

  <line class="flow" x1="544" y1="105" x2="584" y2="105" marker-end="url(#ah2)"/>

  <rect class="box-2" x="588" y="70" width="124" height="70" rx="8"/>
  <text class="t-title" x="650" y="94" text-anchor="middle">Order removals</text>
  <text class="t-muted" x="650" y="112" text-anchor="middle">random &amp;</text>
  <text class="t-muted" x="650" y="128" text-anchor="middle">ranked</text>
</svg>
<figcaption><b>The loop.</b> Zero out channels, measure how much accuracy falls, and repeat as you remove more of them. Ordering the removals two ways, a random search over combinations and a ranked list built from single-channel effects, turns the decoder into a map of what it depends on.</figcaption>
</figure>

The catch is that no single channel tells the whole story, and there are far too many channel
combinations to test them all. So I ordered the removals two ways: a **random search** that samples
many combinations at each step and keeps the most damaging one, and a **ranked** order built from each
channel's own single-removal effect. Whether the random or the ranked order degrades accuracy faster
tells you whether channels matter on their own or only in combination.

## What it found {#found}

Grouping the removed channels by brain region shows which areas the decoder leans on: if an area's
channels are selected early, that area matters more. The result was **area-specific**. The anterior
cingulate cortex was most relevant for **joint, population-level** contributions (the random search
hurt accuracy faster than the ranked one, so importance is best explained by channels acting
together), while the prefrontal cortex was most relevant for **individual-channel** contributions.

## The bridge to interpretability {#bridge}

Now put my method next to the standard tools of mechanistic interpretability:

<div class="table-scroll" markdown="1">

| What I did on a neural decoder | The analogous move on an artificial network |
| :--- | :--- |
| Zero out an input channel, measure the accuracy drop | Ablate a neuron or feature, measure the effect |
| Remove channels grouped by brain region | Knock out an attention head or an MLP block |
| Rank channels by how much removing them hurts | Rank components by their ablation effect |

</div>

The shared idea is causal by construction: you do not just correlate a component with the output, you
**intervene** on it and measure what changes. Zeroing a channel and watching accuracy fall is
ablation, and ablation is a core interpretability tool. The finer-grained version, **activation
patching**, swaps one internal activation for another and watches the output move; I have not done that
inside a network yet, and it is exactly the next step I am moving toward. My version operates on brain
recordings and a decoder rather than on a transformer, but the logic is the same: intervene, then
measure.

## Where the bridge ends {#ends}

I want to be precise about the limit, because overclaiming here is both checkable and self-defeating.

I have **not** done mechanistic interpretability of transformers or large language models. I have not
trained sparse autoencoders on an LLM, built attribution or circuit graphs, or studied superposition.
The attribution I have done is on my **own** neural decoders and on real neural data. What transfers is
the way of thinking: intervene and measure, treat the model as an object of study. I am deliberately
moving that skill toward artificial networks. The claim I can stand behind is that I do this
neuroscience-of-networks work on biological systems, and I am learning the transformer-specific tools
now.

## How I read the results {#caveats}

Removal-based attribution has real limitations, and reading it well means respecting them. Correlated
inputs share credit, so removing one channel can look unimportant simply because a neighbor carries
the same information. Importance is always relative to *this* trained model, not proof of causal
structure in the brain itself. And attribution tells you what the model uses, which is not always what
the system computes. So I treat these results as attribution, a map of the decoder's dependencies, not
a claim to have found the mechanism.

## References {#refs}

- Gerrity, C. G., Treuting, R. L., Peters, R. A., &amp; Womelsdorf, T. (2025).
  [bioRxiv 2025.08.20.671126]({{ site.links.preprint }}). The decoder and its importance analysis.
- The [project overview]({{ '/projects/importance-analysis/' | relative_url }}) summarizes the method.
- For the interpretability side of the analogy, the Transformer Circuits thread
  (<a href="https://transformer-circuits.pub/">transformer-circuits.pub</a>) is the canonical
  reference for the transformer-specific version of this work.
