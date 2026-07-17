---
title: "Attentional filtering during learning"
order: 5
date: 2026-07-16
status: In preparation
dek: >-
  A neuroscience finding from my current work: as an animal learns which feature
  is rewarded, its brain represents that feature strongly while it is figuring the
  block out, then stops representing it once the choice becomes automatic.
tags: [Current work, Neuroscience]
description: >-
  Current, in-progress neuroscience: using the gated-recurrent VAE decoder as a
  probe, the rewarded feature is decodable during learning and not after, with
  area-specific timing across caudate, anterior cingulate, and prefrontal cortex.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "setup", label: "The task, and the decoder as a probe" }
  - { id: "finding", label: "The finding" }
  - { id: "areas", label: "Which areas, and when" }
  - { id: "dimensionality", label: "How many features are in play" }
  - { id: "meaning", label: "What it means" }
  - { id: "status", label: "Where it stands" }
  - { id: "refs", label: "References" }
---

<div class="callout">
  <span class="callout-title">In preparation</span>
  This describes active, unpublished work being written up for a neuroscience audience. The comparisons
  shown here are pre-statistics: the figures are redrawn from current analyses and the significance tests
  are still being finalized. Treat the directions as the result, not the exact magnitudes.
</div>

## The short version {#short-version}

When a monkey is learning which visual feature earns reward, its brain represents that feature clearly.
Once the animal has learned the block and its choices have gone automatic, the explicit representation
of that same feature fades, even though the animal keeps choosing correctly. I find this by using my
[dissertation decoder]({{ '/writing/decoding-with-a-grvae/' | relative_url }}) as a read-out probe:
the rewarded feature is decodable from neural activity during learning and close to undecodable after.
I call the effect **attentional filtering**, because it looks like attention gating which feature is
explicitly encoded, and it is filtered by where the animal is in learning.

## The task, and the decoder as a probe {#setup}

The setup is the value-based feature-learning task from the decoder write-up: on each trial the animal
chooses among objects that vary along four feature dimensions (shape, pattern, color, arm type), and
across a block it learns which single feature is rewarded. When the reward rule reverses, behavior drops
to chance and then climbs back over roughly a dozen trials as the animal relearns.

The decoder is trained to read all four features of the chosen object on every trial, regardless of what
is rewarded. That makes it a measuring instrument rather than a controller: if a feature is decodable
from the neural activity, the brain is representing it in a form the model can read. Asking how that
readout changes with learning turns the decoder into a probe of what the brain is explicitly encoding at
each point in a block.

## The finding {#finding}

Split the trials by whether the animal is still learning the block or has already learned it, and decode
the **target** (rewarded) feature. The two curves come apart cleanly. On learning trials the target
feature climbs well above chance through the choice and stays there. On learned trials it sits at or
below chance for the whole trial.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 250" role="img" aria-labelledby="af-title">
<title id="af-title">Target-feature decoding accuracy over the trial: high during learning trials, near chance once the feature is learned</title>
<line class="grid-line" x1="70" y1="30" x2="70" y2="205"/>
<line class="grid-line" x1="70" y1="161" x2="680" y2="161"/>
<text class="t-muted" x="676" y="155" text-anchor="end" font-size="11">chance</text>
<line class="grid-line" x1="246" y1="30" x2="246" y2="205" stroke-dasharray="3 3" opacity="0.6"/><text class="t-muted" x="246" y="224" text-anchor="middle" font-size="11">fixation</text>
<line class="grid-line" x1="494" y1="30" x2="494" y2="205" stroke-dasharray="3 3" opacity="0.6"/><text class="t-muted" x="494" y="224" text-anchor="middle" font-size="11">choice</text>
<text class="t-muted" x="64" y="122" text-anchor="end" font-size="11">0.05</text>
<text class="t-muted" x="64" y="78" text-anchor="end" font-size="11">0.10</text>
<polyline fill="none" stroke="#3b5a9a" stroke-width="2.6" stroke-linejoin="round" points="70.0,161.2 105.3,156.9 140.6,143.8 175.9,117.5 211.2,121.9 246.5,117.5 281.8,107.0 317.1,98.2 352.4,78.1 387.6,86.9 422.9,73.7 458.2,82.5 493.5,84.2 528.8,91.2 564.1,88.6 599.4,86.0 634.7,89.5 670.0,86.9"/>
<polyline fill="none" stroke="#d1682f" stroke-width="2.6" stroke-linejoin="round" points="70.0,187.5 140.6,187.5 211.2,180.5 246.5,178.8 299.4,174.4 352.4,170.0 422.9,165.6 493.5,168.2 564.1,174.4 599.4,178.8 670.0,183.1"/>
<text class="t-muted" x="18" y="115" text-anchor="middle" transform="rotate(-90 18 115)" font-size="11">scaled accuracy</text>
<line x1="500" y1="46" x2="524" y2="46" stroke="#3b5a9a" stroke-width="2.6"/><text x="530" y="50">Learning</text>
<line x1="600" y1="46" x2="624" y2="46" stroke="#d1682f" stroke-width="2.6"/><text x="630" y="50">Learned</text>
</svg>
<figcaption><b>Attentional filtering during learning</b> (redrawn from current work; statistics pending). The decoder reads the target (rewarded) feature well above chance on trials where the animal is still learning the block (blue), and at or below chance once the feature is learned and behavior is automatic (orange). The relevant feature is strongly represented while it is being attended, then its explicit representation fades.</figcaption>
</figure>

The direction is worth sitting with. The animal is performing *better* on learned trials, and yet the
feature that drives the reward is *less* readable from the neural activity. Explicit representation of
the rewarded feature is a signature of the learning phase, not of good performance. It behaves like an
attentional spotlight that is bright while the animal is working out what matters and dims once the
behavior no longer needs it.

## Which areas, and when {#areas}

Splitting the same target-feature decode by recording region gives an area-specific timing pattern. The
caudate carries the rewarded feature earliest in the trial. The anterior cingulate cortex rises more
slowly and ends up carrying it most strongly by the time of the choice. The prefrontal cortex lags
throughout.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 250" role="img" aria-labelledby="area-title">
<title id="area-title">Target-feature decoding by brain area during learning: caudate rises earliest, the anterior cingulate cortex catches up and ends highest, prefrontal cortex lags</title>
<line class="grid-line" x1="70" y1="30" x2="70" y2="205"/>
<line class="grid-line" x1="70" y1="205" x2="680" y2="205"/>
<line class="grid-line" x1="246" y1="30" x2="246" y2="205" stroke-dasharray="3 3" opacity="0.6"/><text class="t-muted" x="246" y="224" text-anchor="middle" font-size="11">fixation</text>
<line class="grid-line" x1="494" y1="30" x2="494" y2="205" stroke-dasharray="3 3" opacity="0.6"/><text class="t-muted" x="494" y="224" text-anchor="middle" font-size="11">choice</text>
<text class="t-muted" x="64" y="142" text-anchor="end" font-size="11">0.05</text>
<text class="t-muted" x="64" y="74" text-anchor="end" font-size="11">0.10</text>
<polyline fill="none" stroke="#8b5fae" stroke-width="2.6" stroke-linejoin="round" points="70.0,137.7 140.6,104.0 211.2,86.5 246.5,79.8 317.1,71.7 352.4,69.0 422.9,69.0 458.2,73.1 493.5,100.0 546.5,83.8 599.4,70.4 670.0,70.4"/>
<polyline fill="none" stroke="#4a9b5e" stroke-width="2.6" stroke-linejoin="round" points="70.0,178.1 140.6,160.6 211.2,144.4 246.5,135.0 317.1,116.2 352.4,105.4 422.9,89.2 493.5,78.5 564.1,70.4 599.4,66.3 670.0,62.3"/>
<polyline fill="none" stroke="#3b82c4" stroke-width="2.6" stroke-linejoin="round" points="70.0,178.1 140.6,167.3 211.2,160.6 246.5,156.5 317.1,147.1 352.4,141.7 422.9,135.0 493.5,129.6 528.8,141.7 581.8,131.0 599.4,126.9 670.0,124.2"/>
<text class="t-muted" x="18" y="115" text-anchor="middle" transform="rotate(-90 18 115)" font-size="11">scaled accuracy</text>
<line x1="420" y1="46" x2="444" y2="46" stroke="#8b5fae" stroke-width="2.6"/><text x="450" y="50">caudate</text>
<line x1="536" y1="46" x2="560" y2="46" stroke="#4a9b5e" stroke-width="2.6"/><text x="566" y="50">ACC</text>
<line x1="620" y1="46" x2="644" y2="46" stroke="#3b82c4" stroke-width="2.6"/><text x="650" y="50">PFC</text>
</svg>
<figcaption><b>Which areas carry the target feature</b> (redrawn from current work; statistics pending). On learning trials, the caudate represents the rewarded feature earliest in the trial, the anterior cingulate cortex rises more slowly and ends highest, and the prefrontal cortex lags throughout. The timing is area-specific, consistent with a striatal-first, cortical-later readout of what is currently relevant.</figcaption>
</figure>

A striatum-first, cortex-later ordering is the kind of thing you would expect if the caudate is
signalling relevance early and cortical areas are picking it up over the course of the decision. I am
stating that as a description of the timing, not a claim about the circuit mechanism, which the current
analysis does not establish.

## How many features are in play {#dimensionality}

The task varies how many feature dimensions are relevant in a block: one, two, or three. Decoding the
target feature during learning is weakest in one-dimensional blocks and much stronger in two- and
three-dimensional ones.

<figure class="fig">
<svg class="diagram" viewBox="0 0 720 260" role="img" aria-labelledby="dim-title">
<title id="dim-title">Target-feature decoding accuracy by number of relevant dimensions: lowest for one-dimensional blocks, highest for two-dimensional, high for three-dimensional</title>
<line class="grid-line" x1="150" y1="30" x2="150" y2="205"/>
<line class="grid-line" x1="150" y1="205" x2="620" y2="205"/>
<line class="grid-line" x1="150" y1="170" x2="620" y2="170" opacity="0.35"/><text class="t-muted" x="144" y="174" text-anchor="end" font-size="11">0.1</text>
<line class="grid-line" x1="150" y1="135" x2="620" y2="135" opacity="0.35"/><text class="t-muted" x="144" y="139" text-anchor="end" font-size="11">0.2</text>
<line class="grid-line" x1="150" y1="100" x2="620" y2="100" opacity="0.35"/><text class="t-muted" x="144" y="104" text-anchor="end" font-size="11">0.3</text>
<line class="grid-line" x1="150" y1="65" x2="620" y2="65" opacity="0.35"/><text class="t-muted" x="144" y="69" text-anchor="end" font-size="11">0.4</text>
<line class="grid-line" x1="150" y1="30" x2="620" y2="30" opacity="0.35"/><text class="t-muted" x="144" y="34" text-anchor="end" font-size="11">0.5</text>
<rect x="165" y="184" width="90" height="21" rx="3" fill="#3b5a9a"/>
<line x1="210" y1="216" x2="210" y2="152" stroke="var(--color-text)" stroke-width="1.6"/>
<line x1="203" y1="152" x2="217" y2="152" stroke="var(--color-text)" stroke-width="1.6"/>
<line x1="203" y1="216" x2="217" y2="216" stroke="var(--color-text)" stroke-width="1.6"/>
<text class="t-muted" x="210" y="224" text-anchor="middle" font-size="12">Learning 1-D</text>
<rect x="315" y="93" width="90" height="112" rx="3" fill="#d1682f"/>
<line x1="360" y1="114" x2="360" y2="72" stroke="var(--color-text)" stroke-width="1.6"/>
<line x1="353" y1="72" x2="367" y2="72" stroke="var(--color-text)" stroke-width="1.6"/>
<line x1="353" y1="114" x2="367" y2="114" stroke="var(--color-text)" stroke-width="1.6"/>
<text class="t-muted" x="360" y="224" text-anchor="middle" font-size="12">Learning 2-D</text>
<rect x="465" y="124" width="90" height="80" rx="3" fill="#e0a82e"/>
<line x1="510" y1="140" x2="510" y2="109" stroke="var(--color-text)" stroke-width="1.6"/>
<line x1="503" y1="109" x2="517" y2="109" stroke="var(--color-text)" stroke-width="1.6"/>
<line x1="503" y1="140" x2="517" y2="140" stroke="var(--color-text)" stroke-width="1.6"/>
<text class="t-muted" x="510" y="224" text-anchor="middle" font-size="12">Learning 3-D</text>
<text class="t-muted" x="96" y="118" text-anchor="middle" transform="rotate(-90 96 118)" font-size="11">scaled accuracy</text>
</svg>
<figcaption><b>Target-feature decoding by task dimensionality</b> (redrawn from current work; statistics pending). Blocks where two or three feature dimensions are relevant give a much stronger target-feature readout than one-dimensional blocks, even though one-dimensional blocks are the simplest behaviorally. Error bars are wide and the statistics are not yet finalized; the direction of the effect is what is shown here, not a settled magnitude.</figcaption>
</figure>

That one-dimensional blocks give the weakest readout is not what you would guess from behavior, where a
single relevant feature is the easiest thing to learn. One reading is that when more dimensions compete,
the brain has to represent the winning feature more explicitly to pick it out, so there is more for the
decoder to read. I put that forward as a candidate, not a conclusion, and the error bars here are wide
enough that the honest statement is about the ordering, not the exact heights.

## What it means {#meaning}

Read together, these say that the explicit neural code for the feature an animal cares about is not a
fixed property of the stimulus. It is switched on while the animal is learning, carried on a specific
striatal-to-cortical timeline, scaled by how many features are competing, and switched off once the
behavior is automatic. The rewarded feature of the chosen object, the **target**, is where the effect
lives; whether the unrewarded **distractor** features show a complementary pattern is a comparison I am
still running.

This is a result about brains, and it is also the reason I am rebuilding the decoder. A model that
assumes the feature is present at every moment of every trial is exactly wrong for a signal that comes
and goes with learning and attention. The follow-on method, a confidence-gated multiple-instance
decoder that reads the feature when it is there and reports when it is not, is described in a
[separate write-up]({{ '/writing/beyond-persistent-coding/' | relative_url }}).

## Where it stands {#status}

The analyses are done and consistent across the comparisons shown here; what remains is the formal
statistics and the distractor-decoding contrast, after which this becomes a neuroscience write-up. I
presented an early version of it in a lab update in April 2026 and am preparing a Society for
Neuroscience abstract. It is the neuroscience half of my current work; the methods half is the
[confidence-gated decoder]({{ '/writing/beyond-persistent-coding/' | relative_url }}), and both sit on
the "understand" step of my [longer arc]({{ '/writing/decode-understand-alter/' | relative_url }}).

## References {#refs}

- Gerrity, C. G., Treuting, R. L., Peters, R. A., &amp; Womelsdorf, T. (2025). *Neuronal decoding of
  decisions in multidimensional feature space using a gated recurrent variational autoencoder.*
  [bioRxiv 2025.08.20.671126]({{ site.links.preprint }}). The decoder used as the read-out probe here.
