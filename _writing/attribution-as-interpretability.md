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
  Permutation-based feature attribution on a neural decoder, and how it connects,
  honestly, to ablation and activation patching in mechanistic interpretability.
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
which parts of the signal it actually used. The method I used, **shuffle an input and measure how far
accuracy falls**, is the same basic move that mechanistic interpretability makes when it ablates a
component of a neural network and watches the output change. This piece draws that connection, and it
is honest about where the connection ends: I have done this on my own neural decoders and on real
neural data, not on transformers or language models.

## A decoder hides its reasons {#problem}

A trained [decoder]({{ '/writing/decoding-with-a-grvae/' | relative_url }}) is a black box in a
familiar way. It tells you that the information is in the signal, because it can read the choice back
out, but it does not tell you *what* it leaned on to do so. Which electrodes carried the signal? Which
brain regions? Which of the model's own internal units? Answering that is a small interpretability
problem, and it is the one I actually worked on.

## The method: remove and measure {#method}

The approach, which I call **Importance Analysis**, is permutation and removal-based attribution. Take
the trained model, break one part of its input or its internal representation, run it again, and
measure how much worse it does. If breaking something costs a lot of accuracy, the model was relying
on it.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 210" role="img" aria-labelledby="attr-fig-title">
  <title id="attr-fig-title">Permutation attribution: perturb one component, measure the accuracy drop, compare to a null</title>
  <defs>
    <marker id="ah2" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead" d="M0,0 L6.5,3 L0,6 Z"/></marker>
  </defs>
  <rect class="box" x="8" y="70" width="128" height="70" rx="8"/>
  <text class="t-title" x="72" y="98" text-anchor="middle">Trained decoder</text>
  <text class="t-muted" x="72" y="118" text-anchor="middle">baseline accuracy</text>

  <line class="flow" x1="136" y1="105" x2="176" y2="105" marker-end="url(#ah2)"/>

  <rect class="box-accent" x="180" y="60" width="170" height="90" rx="8"/>
  <text class="t-accent" x="265" y="86" text-anchor="middle">Perturb one part</text>
  <text class="t-muted" x="265" y="106" text-anchor="middle">a channel, a region,</text>
  <text class="t-muted" x="265" y="123" text-anchor="middle">or a latent unit</text>

  <line class="flow" x1="350" y1="105" x2="390" y2="105" marker-end="url(#ah2)"/>

  <rect class="box" x="394" y="70" width="150" height="70" rx="8"/>
  <text class="t-title" x="469" y="98" text-anchor="middle">Re-run, measure</text>
  <text class="t-muted" x="469" y="118" text-anchor="middle">accuracy drop</text>

  <line class="flow" x1="544" y1="105" x2="584" y2="105" marker-end="url(#ah2)"/>

  <rect class="box-2" x="588" y="70" width="124" height="70" rx="8"/>
  <text class="t-title" x="650" y="94" text-anchor="middle">Importance</text>
  <text class="t-muted" x="650" y="112" text-anchor="middle">vs. permutation</text>
  <text class="t-muted" x="650" y="128" text-anchor="middle">null</text>
</svg>
<figcaption><b>The loop.</b> Perturb one component, measure how much accuracy falls, and only count the result if the drop exceeds what random reshuffling produces. Running it over every channel, region, and latent unit turns the decoder into a map of what it depends on.</figcaption>
</figure>

The important detail is the last box. A drop only means something if it is bigger than the drop you
would get from meaningless reshuffling, so I compare every result against a null distribution built by
Monte Carlo and permutation testing. That keeps the analysis from mistaking noise for signal.

## What it found {#found}

Run over the input channels, the whole brain regions, and the model's latent units, the attribution
pointed to **area-specific contributions**. The anterior cingulate cortex mattered most for joint,
population-level contributions; the prefrontal cortex mattered most for individual-channel
contributions; the caudate contributed as well. Interrogating the model this way also surfaced
something I had not designed in: the decoder **sharpens for particular feature dimensions on
particular trials**, a kind of attentional filtering that only became visible once I probed the
trained network.

## The bridge to interpretability {#bridge}

Now put my method next to the standard tools of mechanistic interpretability:

<div class="table-scroll" markdown="1">

| What I did on a neural decoder | The analogous move on an artificial network |
| :--- | :--- |
| Shuffle an input channel, measure accuracy drop | Ablate an input feature or a neuron, measure the effect |
| Remove a whole brain region | Zero or knock out an attention head or an MLP block |
| Perturb a latent unit and watch the output | Activation patching: swap an activation and watch the logits |
| Validate the drop against a permutation null | Test whether the effect is real and not a coincidence |

</div>

The shared idea is causal by construction: you do not just correlate a component with the output, you
**intervene** on it and measure what changes. That is the same reason activation patching is trusted
in interpretability. My version operates on brain recordings and a decoder rather than on a
transformer, but the epistemics are the same, and so is the discipline of checking the result against
a null.

## Where the bridge ends {#ends}

I want to be precise about the limit, because overclaiming here is both checkable and self-defeating.

I have **not** done mechanistic interpretability of transformers or large language models. I have not
trained sparse autoencoders on an LLM, built attribution or circuit graphs, or studied superposition.
The attribution I have done is on my **own** neural decoders and on real neural data. What transfers is
the way of thinking: intervene and measure, validate against a null, treat the model as an object of
study. I am deliberately moving that skill toward artificial networks. The claim I can stand behind is
that I do this neuroscience-of-networks work on biological systems, and I am learning the
transformer-specific tools now.

## How I read the results {#caveats}

Permutation attribution has real limitations, and reading it well means respecting them. Correlated
inputs share credit, so removing one channel can look unimportant simply because a neighbor carries
the same information. Importance is always relative to *this* trained model, not proof of causal
structure in the brain itself. And attribution tells you what the model uses, which is not always what
the system computes. So I treat these results as attribution under a validated null, a map of the
decoder's dependencies, not a claim to have found the mechanism.

## References {#refs}

- Gerrity, C. G., Treuting, R. L., Peters, R. A., &amp; Womelsdorf, T. (2025).
  [bioRxiv 2025.08.20.671126]({{ site.links.preprint }}). The decoder and its importance analysis.
- The [project overview]({{ '/projects/importance-analysis/' | relative_url }}) summarizes the method.
- For the interpretability side of the analogy, the Transformer Circuits thread
  (<a href="https://transformer-circuits.pub/">transformer-circuits.pub</a>) is the canonical
  reference for the transformer-specific version of this work.
