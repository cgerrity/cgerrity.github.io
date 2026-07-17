---
title: "Attentional filtering during learning"
order: 5
date: 2026-07-16
status: In preparation
dek: >-
  A neuroscience finding from my current work: as an animal learns which feature
  is rewarded, its brain represents that feature strongly and filters out the rest,
  then stops representing it once the choice becomes automatic.
tags: [Current work, Neuroscience]
description: >-
  Current, in-progress neuroscience: using the gated-recurrent VAE decoder as a
  probe, the rewarded feature is decodable during learning and not after, is
  filtered above the distractors, and runs on a striatum-first, cortex-later timeline.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "setup", label: "The task, and the decoder as a probe" }
  - { id: "finding", label: "The finding" }
  - { id: "filtering", label: "Target beats the distractors" }
  - { id: "areas", label: "Which areas, and when" }
  - { id: "after", label: "What comes back after learning" }
  - { id: "meaning", label: "What it means" }
  - { id: "status", label: "Where it stands" }
  - { id: "refs", label: "References" }
---

<div class="callout">
  <span class="callout-title">In preparation</span>
  This describes active, unpublished work from a manuscript in progress. The comparisons shown here are
  pre-statistics: the figures are redrawn from current analyses and the significance tests are still being
  finalized. Treat the directions as the result, not the exact magnitudes.
</div>

## The short version {#short-version}

When a monkey is learning which visual feature earns reward, its brain represents that feature clearly,
and represents it more strongly than the competing features it is ignoring. Once the animal has learned
the block and its choices have gone automatic, the explicit representation of that same feature fades,
even though the animal keeps choosing correctly. I find this by using my
[dissertation decoder]({{ '/writing/decoding-with-a-grvae/' | relative_url }}) as a read-out probe. I
call the effect **attentional filtering**, because it looks like attention selecting which feature is
explicitly encoded, filtered by where the animal is in learning and by whether the feature matters.

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
feature climbs well above chance, and the effect becomes reliable around the animal's commitment to the
choice. On learned trials it sits at or below chance for the whole trial.

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
the rewarded feature is a signature of the learning phase, not of good performance. Binning by how far a
trial is from the animal's learning change-point sharpens this: peak decoding is highest on the trials
just before the animal locks in the rule, and it collapses once the rule is learned. The representation
behaves like an attentional spotlight that is brightest while the animal is working out what matters and
dims once the behavior no longer needs it.

## Target beats the distractors {#filtering}

If this is really attentional filtering, the rewarded feature should be represented not just strongly but
*preferentially*, above the features the animal is ignoring. It is. Separating each feature into the
**target** (the rewarded feature), the **distractor on correct trials** (an unrewarded feature the animal
chose correctly around), and the **distractor on error trials** gives a clean ordering during learning:
target first, correct-trial distractor second, error-trial distractor last.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 268" role="img" aria-labelledby="td-title">
<title id="td-title">Target versus distractor decoding. During learning the rewarded target feature is decoded best, then distractor features on correct trials, then on error trials. Once learned, the target is gone and the distractor feature on error trials becomes decodable.</title>
<line x1="150" y1="24" x2="176" y2="24" stroke="#3b5a9a" stroke-width="2.6"/><text x="182" y="28" font-size="12">target feature</text>
<line x1="300" y1="24" x2="326" y2="24" stroke="#d1682f" stroke-width="2.6"/><text x="332" y="28" font-size="12">distractor · correct</text>
<line x1="490" y1="24" x2="516" y2="24" stroke="#e0a82e" stroke-width="2.6"/><text x="522" y="28" font-size="12">distractor · error</text>
<line class="grid-line" x1="70" y1="45" x2="70" y2="228"/>
<line class="grid-line" x1="70" y1="210" x2="320" y2="210"/>
<line class="grid-line" x1="195" y1="45" x2="195" y2="228" stroke-dasharray="3 3" opacity="0.55"/>
<text class="t-muted" x="195" y="245" text-anchor="middle" font-size="11">choice</text>
<text class="t-title" x="195" y="58" text-anchor="middle" font-size="13">During learning</text>
<line class="grid-line" x1="400" y1="45" x2="400" y2="228"/>
<line class="grid-line" x1="400" y1="210" x2="650" y2="210"/>
<line class="grid-line" x1="525" y1="45" x2="525" y2="228" stroke-dasharray="3 3" opacity="0.55"/>
<text class="t-muted" x="525" y="245" text-anchor="middle" font-size="11">choice</text>
<text class="t-title" x="525" y="58" text-anchor="middle" font-size="13">Once learned</text>
<text class="t-muted" x="64" y="214" text-anchor="end" font-size="11">0</text>
<text class="t-muted" x="64" y="83" text-anchor="end" font-size="11">0.10</text>
<text class="t-muted" x="686" y="204" text-anchor="end" font-size="11">chance</text>
<text class="t-muted" x="20" y="140" text-anchor="middle" transform="rotate(-90 20 140)" font-size="11">scaled accuracy</text>
<polyline fill="none" stroke="#e0a82e" stroke-width="2.6" stroke-linejoin="round" points="70.0,229.6 99.4,223.1 128.8,210.0 143.5,196.9 172.9,181.2 195.0,170.8 217.1,162.9 239.1,157.7 261.2,155.1 290.6,152.5 320.0,149.8"/>
<polyline fill="none" stroke="#d1682f" stroke-width="2.6" stroke-linejoin="round" points="70.0,216.5 99.4,210.0 128.8,194.3 143.5,181.2 172.9,164.2 195.0,151.2 217.1,142.0 239.1,136.8 261.2,138.1 290.6,134.2 320.0,131.5"/>
<polyline fill="none" stroke="#3b5a9a" stroke-width="2.6" stroke-linejoin="round" points="70.0,203.5 99.4,194.3 128.8,170.8 143.5,144.6 172.9,118.5 195.0,94.9 217.1,79.2 231.8,74.0 253.8,84.5 275.9,92.3 297.9,89.7 320.0,94.9"/>
<polyline fill="none" stroke="#e0a82e" stroke-width="2.6" stroke-linejoin="round" points="400.0,223.1 429.4,216.5 458.8,203.5 488.2,183.8 517.6,157.7 547.1,134.2 576.5,118.5 598.5,110.6 620.6,108.0 650.0,111.9"/>
<polyline fill="none" stroke="#d1682f" stroke-width="2.6" stroke-linejoin="round" points="400.0,225.7 444.1,217.8 473.5,210.0 517.6,204.8 547.1,202.2 576.5,204.8 605.9,210.0 650.0,215.2"/>
<polyline fill="none" stroke="#3b5a9a" stroke-width="2.6" stroke-linejoin="round" points="400.0,223.1 444.1,220.5 473.5,216.5 517.6,210.0 547.1,207.4 576.5,210.0 605.9,213.9 650.0,216.5"/>
</svg>
<figcaption><b>The decoder filters in the rewarded feature</b> (redrawn from current work; statistics pending). <b>Left:</b> while the animal is learning, the rewarded <i>target</i> feature is decoded best, the unrewarded <i>distractor</i> features on correct trials next, and distractor features on error trials least. That ordering is the attentional filter: the feature that matters is represented most strongly. <b>Right:</b> once the block is learned the target feature is no longer decodable, and instead the distractor feature on error trials becomes readable, as if the code that survives is the one that explains the mistake.</figcaption>
</figure>

That ordering is the filter itself. The brain is not just representing the object; it is preferentially
representing the feature that currently matters and suppressing the ones that do not.

## Which areas, and when {#areas}

Ablating each recording region in turn, by zeroing its inputs and measuring the drop in target-feature
decoding, gives an area-specific timing pattern. The caudate carries the rewarded feature earliest, before
the decision. The anterior cingulate cortex rises more slowly and ends up carrying it most strongly. The
prefrontal cortex contributes latest, around the feedback that tells the animal whether it was right.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 250" role="img" aria-labelledby="area-title">
<title id="area-title">Target-feature decoding by brain area during learning: caudate rises earliest and before the decision, the anterior cingulate cortex ends highest, prefrontal cortex contributes latest around feedback</title>
<line class="grid-line" x1="70" y1="30" x2="70" y2="205"/>
<line class="grid-line" x1="70" y1="205" x2="680" y2="205"/>
<line class="grid-line" x1="246" y1="30" x2="246" y2="205" stroke-dasharray="3 3" opacity="0.6"/><text class="t-muted" x="246" y="224" text-anchor="middle" font-size="11">fixation</text>
<line class="grid-line" x1="494" y1="30" x2="494" y2="205" stroke-dasharray="3 3" opacity="0.6"/><text class="t-muted" x="494" y="224" text-anchor="middle" font-size="11">choice</text>
<text class="t-muted" x="64" y="142" text-anchor="end" font-size="11">0.05</text>
<text class="t-muted" x="64" y="74" text-anchor="end" font-size="11">0.10</text>
<polyline fill="none" stroke="#8b5fae" stroke-width="2.6" stroke-linejoin="round" points="70.0,137.7 140.6,104.0 211.2,86.5 246.5,79.8 317.1,71.7 352.4,69.0 422.9,69.0 458.2,73.1 493.5,100.0 546.5,83.8 599.4,70.4 670.0,70.4"/>
<polyline fill="none" stroke="#4a9b5e" stroke-width="2.6" stroke-linejoin="round" points="70.0,178.1 140.6,160.6 211.2,144.4 246.5,135.0 317.1,116.2 352.4,105.4 422.9,89.2 493.5,78.5 564.1,70.4 599.4,66.3 670.0,62.3"/>
<polyline fill="none" stroke="#3b82c4" stroke-width="2.6" stroke-linejoin="round" points="70.0,180.8 140.6,172.7 211.2,167.3 246.5,163.3 317.1,156.5 352.4,151.2 422.9,143.1 493.5,135.0 546.5,124.2 599.4,110.8 634.7,102.7 670.0,100.0"/>
<text class="t-muted" x="18" y="115" text-anchor="middle" transform="rotate(-90 18 115)" font-size="11">scaled accuracy</text>
<line x1="420" y1="46" x2="444" y2="46" stroke="#8b5fae" stroke-width="2.6"/><text x="450" y="50">caudate</text>
<line x1="536" y1="46" x2="560" y2="46" stroke="#4a9b5e" stroke-width="2.6"/><text x="566" y="50">ACC</text>
<line x1="620" y1="46" x2="644" y2="46" stroke="#3b82c4" stroke-width="2.6"/><text x="650" y="50">PFC</text>
</svg>
<figcaption><b>Which areas carry the target feature</b> (redrawn from current work; statistics pending). Zeroing each recording area in turn (occlusion, a block-level ablation) and measuring the drop shows the rewarded feature is carried first by the caudate, before the decision, then by the anterior cingulate cortex, which ends highest. The prefrontal cortex contributes latest, around feedback. The readout of what is currently relevant runs striatum-first, cortex-later.</figcaption>
</figure>

I am stating that as a description of the timing, not a claim about the circuit mechanism, which the
current analysis does not establish.

## What comes back after learning {#after}

The target feature is not the only thing that moves with learning. Once the block is learned and the
target has dropped out of the decode, a different signal appears: on the occasional error trial, the
**distractor** feature the animal presumably attended to is now decodable, the one thing that could
explain the mistake. It shows up first in the caudate and then the anterior cingulate cortex, the same
striatum-first ordering, and it is stronger when the animal has more to lose, on trials where a wrong
choice costs more tokens. So the code does not simply switch off after learning; it re-points from the
rewarded feature toward whatever feature is driving behavior at that moment.

## What it means {#meaning}

Read together, these say that the explicit neural code for the feature an animal cares about is not a
fixed property of the stimulus. It is switched on while the animal is learning, filtered above the
features it is ignoring, carried on a specific striatal-to-cortical timeline, and switched off once the
behavior is automatic, at which point the code that remains is the one that explains errors. What the
brain represents explicitly tracks what is currently worth attending to, not just what is on the screen.

This is a result about brains, and it is also the reason I am rebuilding the decoder. A model that
assumes the feature is present at every moment of every trial is exactly wrong for a signal that comes
and goes with learning and attention. The follow-on method, a confidence-gated multiple-instance decoder
that reads the feature when it is there and reports when it is not, is described in a
[separate write-up]({{ '/writing/beyond-persistent-coding/' | relative_url }}).

## Where it stands {#status}

The analyses are done and consistent across the comparisons shown here; what remains is the formal
statistics and a few extensions (feature-versus-dimension specificity, and separating feature identity
from chosen value). This is being written up as a manuscript, and I presented an early version in a lab
update in April 2026. It is the neuroscience half of my current work; the methods half is the
[confidence-gated decoder]({{ '/writing/beyond-persistent-coding/' | relative_url }}), and both sit on
the "understand" step of my [longer arc]({{ '/writing/decode-understand-alter/' | relative_url }}).

## References {#refs}

- Gerrity, C. G., Treuting, R. L., Peters, R. A., &amp; Womelsdorf, T. (2025). *Neuronal decoding of
  decisions in multidimensional feature space using a gated recurrent variational autoencoder.*
  [bioRxiv 2025.08.20.671126]({{ site.links.preprint }}). The decoder used as the read-out probe here.
