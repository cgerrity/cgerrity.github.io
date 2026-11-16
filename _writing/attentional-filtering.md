---
published: false  # hidden pending review -- see README
title: "Attentional filtering during learning"
order: 5
date: 2026-11-16
status: NeurIPS 2026 Brain &amp; Body workshop
dek: >-
  A neuroscience finding from my current work: while a monkey is working out which
  feature earns reward, the anterior cingulate cortex carries that feature most
  strongly; once the rule is learned, the caudate head holds it and the cingulate
  turns toward the features of objects chosen in error.
tags: [Current work, Neuroscience]
description: >-
  Using a gated-recurrent VAE decoder as a probe, with area contributions scored as
  exact Shapley shares of its accuracy: the caudate head carries the rewarded feature
  after learning, the anterior cingulate cortex carries it while learning, and after
  learning the cingulate favors the features of objects chosen in error.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "setup", label: "The task, and the decoder as a probe" }
  - { id: "scoring", label: "How an area gets credit" }
  - { id: "caudate", label: "The caudate after learning" }
  - { id: "acc", label: "The cingulate while learning, and after errors" }
  - { id: "robustness", label: "Does it depend on the decoder?" }
  - { id: "meaning", label: "What it means" }
  - { id: "status", label: "Where it stands" }
  - { id: "refs", label: "References" }
---

<div class="callout">
  <span class="callout-title">Accepted, non-archival workshop paper</span>
  This is the finding in my paper at the NeurIPS 2026 Workshop on Foundation Models for the Brain and
  Body, accepted for a poster at the workshop in Sydney on December 12, 2026. The statistics are final.
  The workshop is non-archival, and a longer journal version is in preparation, so the numbers below are
  the workshop paper's and may be extended there.
</div>

## The short version {#short-version}

When a monkey is learning which visual feature of an object earns reward, I can ask which brain areas
carry that feature, and when. The answer splits by area and by learning stage. The **head of the
caudate** carries the rewarded feature once the rule has been learned, steadily and across the whole
trial. The **anterior cingulate cortex** carries it most strongly in the earliest learning trials, and
after learning its contribution drops and re-points toward the features of objects the animal chose in
error. I get this from a decoder that was never told which feature was rewarded, whether the animal had
learned, or how a trial ended. I call the effect **attentional filtering**, because the roles are read
out after the fact and what changes is which role the area's contribution tracks.

## The task, and the decoder as a probe {#setup}

The setup is the value-based feature-learning task from the
[decoder write-up]({{ '/writing/decoding-with-a-grvae/' | relative_url }}). On each trial three
multi-feature objects appear, the animal chooses one by fixating it, and token feedback follows: a gain
if the chosen object carried the rewarded feature, a loss otherwise. Within a block one single feature
is rewarded, and the rewarded feature changes with each new block. The **learning point** of a block is
the trial from which the animal is reliably correct over the following run of trials; trials before it
are "learning" and trials after it are "learned".

Two male macaques contributed 22 recording sessions that passed a held-out decoding screen, with
multi-unit activity from linear probes in the anterior cingulate cortex (mostly area 24c) and the head
of the caudate. One session has no cingulate recording, so 21 sessions enter the cingulate analyses and
22 the caudate analyses. Everything is aligned to fixation onset on the chosen object; the choice is
likely committed around 0.3 s and feedback appears at 0.7 s.

The decoder is the one I built for my dissertation: a gated-recurrent variational autoencoder with one
classifier head per feature dimension, trained per session to report **the features of the chosen
object** and nothing else. That restriction is the whole design. The rewarded feature, a dimension's
target or distractor status, the learning stage, the outcome, the gain or loss condition, block
boundaries: none of it appears in the labels, the loss weights, the training schedule, or the criterion
I use to pick a checkpoint. The model is role-agnostic by construction, so it cannot be fitting the
story I am about to read out of it.

The roles are applied afterward, to held-out predictions only, as three filters:

- **target** — the rewarded dimension of objects the animal chose correctly;
- **distractor (correct)** — the other non-neutral dimensions of those same correct objects, the
  features that could be confused with the target until the rule is learned;
- **distractor (error)** — the non-neutral dimensions of objects the animal chose in error, including
  the rewarded dimension, which on such an object carries a non-rewarded value.

Accuracy is chance-corrected, with 0 at chance and 1 at perfect classification, and chance is estimated
by Monte Carlo sampling from class-frequency-matched random predictions rather than assumed from the
number of classes.

## How an area gets credit {#scoring}

The attribution is the part I expect to outlive the finding. I occlude each area's inputs by setting
its channels to zero, which is also their mean, and I do this for **every subset of areas**, recomputing
the filtered accuracy each time. An area's share is then the accuracy the decoder gains when that area
is added, averaged over every order in which the areas could be added. That is the exact Shapley value
with the area as the unit, which means the shares are not an approximation and they **sum to the
decoder's chance-corrected accuracy**. A share, written Φ, is in units of chance-corrected accuracy
rather than a proportion.

This replaces the ranked and random channel-removal search I used in the
[dissertation attribution work]({{ '/projects/importance-analysis/' | relative_url }}). Removing one
input at a time leaves credit ambiguous when inputs are correlated; averaging over every order of
addition is what resolves it.

Statistics are reduced to sessions. Values are tested against the chance null on the Φ scale, contrasts
use session-level permutation, time courses use cluster-mass permutation, and p-values are
Benjamini-Hochberg adjusted within each family of panels at α = 0.05. Three summary metrics each get
their own test: the **peak** of the time course, the **average** over the fixation period, and cluster
statistics over the full time course. They can disagree when an effect is concentrated in time, so I
name the metric with every number below.

## The caudate after learning {#caudate}

Once the animal has reached the learning point, the caudate head's target-feature share is well above
chance (average Φ = 0.032, *p* = 2 × 10⁻⁵, 22 sessions), and its time course carries a single
significant cluster that spans the entire analysis window. It is above chance in every bin of trials
after the learning point and at every distractor load. It also exceeds the share for the **same trials'**
distractor features (target 0.032 versus distractor-correct 0.010, paired *p* = 0.022), while that
distractor share is itself above chance.

During learning the caudate share is smaller and still above chance (average Φ = 0.020, *p* = 0.022),
with no significant cluster, and it is not above chance more than five trials before the learning point
(Φ = 0.010, *p* = 0.21).

So the caudate looks like a stable, feature-specific readout of the rule the animal has settled on, with
the target preferred over the features it is ignoring on those very trials.

## The cingulate while learning, and after errors {#acc}

The cingulate runs the other way. Its **peak** target-feature share is higher during learning than after
(0.076 versus 0.023, paired *p* = 0.0022, 21 sessions). On the **average** metric the two stages do not
differ (0.030 versus 0.006, *p* = 0.25) and both are above chance, and the post-learning time course
still carries a significant cluster. Cingulate target information after learning is therefore reduced,
not absent, and I say it that way because the two metrics disagree.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 292" role="img" aria-labelledby="phi-title">
<title id="phi-title">Shapley shares of chance-corrected accuracy. The anterior cingulate cortex peak share is 0.076 during learning and 0.023 after learning. The caudate average share is 0.020 during learning, 0.032 after learning for the target feature, and 0.010 after learning for distractor features on the same trials.</title>
<text class="t-title" x="90" y="22" font-size="13">ACC 24c · peak Φ</text>
<text class="t-title" x="420" y="22" font-size="13">Caudate head · average Φ</text>
<line class="grid-line" x1="90" y1="66" x2="90" y2="210"/>
<line class="grid-line" x1="90" y1="210" x2="330" y2="210"/>
<line class="grid-line" x1="90" y1="140" x2="330" y2="140" stroke-dasharray="3 3" opacity="0.45"/>
<text class="t-muted" x="84" y="214" text-anchor="end" font-size="11">0</text>
<text class="t-muted" x="84" y="144" text-anchor="end" font-size="11">0.04</text>
<text class="t-muted" x="84" y="74" text-anchor="end" font-size="11">0.08</text>
<text class="t-muted" x="42" y="140" text-anchor="middle" transform="rotate(-90 42 140)" font-size="11">share of accuracy</text>
<rect x="130" y="77" width="60" height="133" fill="#d1682f"/>
<rect x="230" y="170" width="60" height="40" fill="#4a9b5e"/>
<text x="160" y="70" text-anchor="middle" font-size="11">0.076</text>
<text x="260" y="163" text-anchor="middle" font-size="11">0.023</text>
<path d="M160 64 L160 56 L260 56 L260 155" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
<text class="t-muted" x="210" y="50" text-anchor="middle" font-size="11">p = 0.0022</text>
<text class="t-muted" x="160" y="230" text-anchor="middle" font-size="11">learning</text>
<text class="t-muted" x="260" y="230" text-anchor="middle" font-size="11">learned</text>
<line class="grid-line" x1="420" y1="66" x2="420" y2="210"/>
<line class="grid-line" x1="420" y1="210" x2="690" y2="210"/>
<line class="grid-line" x1="420" y1="140" x2="690" y2="140" stroke-dasharray="3 3" opacity="0.45"/>
<rect x="445" y="175" width="52" height="35" fill="#d1682f"/>
<rect x="530" y="154" width="52" height="56" fill="#4a9b5e"/>
<rect x="615" y="192" width="52" height="18" fill="#4a9b5e" opacity="0.45"/>
<text x="471" y="168" text-anchor="middle" font-size="11">0.020</text>
<text x="556" y="147" text-anchor="middle" font-size="11">0.032</text>
<text x="641" y="186" text-anchor="middle" font-size="11">0.010</text>
<path d="M556 141 L556 128 L641 128 L641 178" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
<text class="t-muted" x="598" y="122" text-anchor="middle" font-size="11">p = 0.022</text>
<text class="t-muted" x="471" y="230" text-anchor="middle" font-size="11">learning</text>
<text class="t-muted" x="556" y="230" text-anchor="middle" font-size="11">learned</text>
<text class="t-muted" x="641" y="230" text-anchor="middle" font-size="11">learned</text>
<text class="t-muted" x="471" y="244" text-anchor="middle" font-size="11">target</text>
<text class="t-muted" x="556" y="244" text-anchor="middle" font-size="11">target</text>
<text class="t-muted" x="641" y="244" text-anchor="middle" font-size="11">distractor</text>
<rect x="266" y="270" width="12" height="12" fill="#d1682f"/><text x="284" y="280" font-size="11">during learning</text>
<rect x="400" y="270" width="12" height="12" fill="#4a9b5e"/><text x="418" y="280" font-size="11">after learning</text>
</svg>
<figcaption><b>Shares of the decoder's accuracy, by area and learning stage.</b> Values are the workshop paper's. <b>Left:</b> the cingulate's peak share is about three times larger during learning than after it. <b>Right:</b> the caudate's average share over the fixation period is above chance during learning and after it, and after learning the target feature beats the distractor features of the same trials. Peak and average are separate metrics with separate tests, which is why each panel names its own; p-values are Benjamini-Hochberg adjusted paired session permutation tests.</figcaption>
</figure>

Binning trials by their distance from the learning point sharpens the dissociation. The cingulate share
is above chance only **more than five trials before** the learning point (Φ = 0.042, *p* = 0.0027), the
one bin in which the caudate share is not above chance. In the last five trials before the learning
point the cingulate has a significant cluster without a significant average. The caudate is above chance
in every other bin.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 720 220" role="img" aria-labelledby="bin-title">
<title id="bin-title">Which bins of trials show an above-chance target-feature share. The anterior cingulate cortex is above chance only more than five trials before the learning point, with a cluster-only effect in the last five trials before it. The caudate head is above chance in every bin except more than five trials before the learning point.</title>
<line class="grid-line" x1="337" y1="42" x2="337" y2="146" stroke-dasharray="4 4"/>
<text class="t-muted" x="337" y="34" text-anchor="middle" font-size="11">learning point</text>
<text class="t-title" x="150" y="78" text-anchor="end" font-size="12">ACC 24c</text>
<text class="t-title" x="150" y="128" text-anchor="end" font-size="12">Caudate head</text>
<circle cx="200" cy="73" r="11" fill="#3b5a9a"/>
<circle cx="285" cy="73" r="11" fill="none" stroke="#3b5a9a" stroke-width="3"/>
<circle cx="390" cy="73" r="11" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
<circle cx="490" cy="73" r="11" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
<circle cx="590" cy="73" r="11" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
<circle cx="200" cy="123" r="11" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>
<circle cx="285" cy="123" r="11" fill="#3b5a9a"/>
<circle cx="390" cy="123" r="11" fill="#3b5a9a"/>
<circle cx="490" cy="123" r="11" fill="#3b5a9a"/>
<circle cx="590" cy="123" r="11" fill="#3b5a9a"/>
<text class="t-muted" x="200" y="160" text-anchor="middle" font-size="11">&gt; 5 before</text>
<text class="t-muted" x="285" y="160" text-anchor="middle" font-size="11">last 5 before</text>
<text class="t-muted" x="390" y="160" text-anchor="middle" font-size="11">0–9 after</text>
<text class="t-muted" x="490" y="160" text-anchor="middle" font-size="11">10–19 after</text>
<text class="t-muted" x="590" y="160" text-anchor="middle" font-size="11">≥ 20 after</text>
<circle cx="120" cy="196" r="8" fill="#3b5a9a"/><text x="136" y="200" font-size="11">average above chance</text>
<circle cx="310" cy="196" r="8" fill="none" stroke="#3b5a9a" stroke-width="2.4"/><text x="326" y="200" font-size="11">cluster only</text>
<circle cx="450" cy="196" r="8" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"/><text x="466" y="200" font-size="11">not above chance</text>
</svg>
<figcaption><b>Where in learning each area carries the target feature.</b> Columns are bins of trials relative to the block's learning point. Filled: the average share over the fixation period is above the chance null at p<sub>BH</sub> &lt; 0.05. Ring: a significant cluster in the time course without a significant average. The cingulate's one above-chance bin is the earliest, which is the only bin where the caudate is not above chance.</figcaption>
</figure>

After learning, the cingulate's peak share is higher for the **distractor (error)** filter than for the
target filter (*p* = 9.6 × 10⁻⁴) and than for the distractor (correct) filter (*p* = 0.0073), and the
distractor-error average is above chance (Φ = 0.020, *p* = 0.017). The average contrast against the
target is not significant (*p* = 0.33), so this is a statement about the peak of the time course. The
cingulate's peak target share is also higher after error trials than after correct trials (*p* = 0.020).
Both of those fit a cingulate that tracks errors and rule changes.

I am describing which area's contribution goes up and when. I am not claiming a circuit mechanism, and
cluster extents are reported descriptively rather than as onset estimates.

## Does it depend on the decoder? {#robustness}

That was the obvious objection, so five further decoders were trained on the same sessions and scored
with the same tests: a reconstruction-only model whose latent never saw the labels, an LSTM encoder, a
feedforward encoder with layer normalization, a principal-component backbone, and a logistic-regression
readout on the channels. Every one of the main results keeps its direction, and the model whose latent
never saw a label reproduces both the caudate result and the cingulate learning contrast. The cingulate's
earliest-bin result could not be tested on the reduced fold set, because too few sessions have enough
held-out trials in that bin.

## What it means {#meaning}

Two areas that both carry the rewarded feature carry it at different points in learning. The cingulate's
contribution is largest while the animal is still working out which feature matters, and after learning
it favors the features of objects chosen in error. The caudate's contribution is sustained once the rule
is learned, holds at every distractor load, and prefers the target over the distractors on the same
trials.

The method is the part I expect to transfer. The shares are exact, they sum to the decoder's accuracy,
and they are tested at the session level. None of that is specific to this architecture: it needs a
decoder's held-out predictions with each subset of inputs occluded, a record that assigns roles to what
was decoded, and a session identifier per trial. It applies to a decoder that was pretrained across
sessions just as well as to one trained per session.

It also says something about how to build the next decoder. The shares moved within a session as the
animal learned, which means a model that uses one fixed mapping from activity to features for a whole
session is averaging over that change. A decoder that inferred the session's current learning state and
feature roles could update itself only where the recording carries information, and that is the
motivation for the
[confidence-gated decoder]({{ '/writing/beyond-persistent-coding/' | relative_url }}) I am building.

## Where it stands {#status}

The analyses and statistics are final for the workshop paper, which was accepted at the NeurIPS 2026
Workshop on Foundation Models for the Brain and Body and is scheduled as a poster in Sydney on
December 12, 2026. The workshop is non-archival. A longer journal version is in preparation and extends
the same analyses, so some numbers here will be superseded by that version rather than contradicted. Earlier drafts of this page described the result from analyses that preceded
the final statistics; I have rewritten it to match what the paper reports.

This is the neuroscience half of my current work. The methods half is the
[confidence-gated decoder]({{ '/writing/beyond-persistent-coding/' | relative_url }}), and both sit on
the "understand" step of my [longer arc]({{ '/writing/decode-understand-alter/' | relative_url }}).

## References {#refs}

- Gerrity, C. G., &amp; Womelsdorf, T. (2026). *Role-agnostic latent decoding dissociates target
  information across learning in anterior cingulate cortex and caudate.* NeurIPS 2026 Workshop on
  Foundation Models for the Brain and Body, Sydney. The paper this page describes.
- Gerrity, C. G., Treuting, R. L., Peters, R. A., &amp; Womelsdorf, T. (2025). *Neuronal decoding of
  decisions in multidimensional feature space using a gated recurrent variational autoencoder.*
  [bioRxiv 2025.08.20.671126]({{ site.links.preprint }}). The decoder used as the read-out probe here.
- Treuting, R. L., Banaie Boroujeni, K., Gerrity, C. G., Neumann, A., Tiesinga, P., &amp; Womelsdorf, T.
  (2025). *Adaptive reinforcement learning is causally supported by anterior cingulate cortex and
  striatum.* [Neuron 113(16), 2708–2723](https://doi.org/10.1016/j.neuron.2025.05.018). The
  reinforcement-learning model used for the trial splits is from this line of work.
