---
layout: page
title: About
permalink: /about/
lead: >-
  Computational neuroscientist and machine learning engineer, moving into
  mechanistic interpretability. Here is the longer version of the story.
description: >-
  Charles Gerrity is a computational neuroscientist and ML engineer who
  reverse-engineers how neural activity becomes decisions. About his research,
  his move into mechanistic interpretability, and what he has and has not done.
---

I went into neuroscience to help patients directly. I considered neurology and neurosurgery,
then realized that my real strength is turning large, chaotic neural data into decisions. I want
to build the software and systems that restore function to people who have lost it, starting with
movement and eventually sensation. Brain-computer interfaces let me combine both sides of that.

## One question, at two scales

The through-line of my work is a single question: **how does distributed neural activity turn
into a decision?** I have spent my research career answering it in biological brains, by recording
from many neurons at once while an animal makes value-based choices and then building models that
read the choice back out of the activity. The same question applies to artificial networks: how
does a trained model's internal activity produce its output? That is mechanistic interpretability,
and it is where I am deliberately heading next.

I do not treat this as a pivot. Reverse-engineering computation from high-dimensional activity is
the thing I already do. Interpretability of artificial networks is that same skill, pointed at a
system where I can see every weight.

## What I have done

- Built and interpreted a deep decoder of value-based choice from **300+ simultaneously recorded
  intracranial channels** in awake non-human primates, and posted it as a
  [first-author preprint]({{ site.links.preprint }}).
- Ran the experiments end to end: I performed the acute implantations and ran 25 high-density
  electrophysiology sessions myself, on a rig I tested and used but did not design.
- Wrote a **200+ function MATLAB deep-learning framework** by hand, and later designed and verified
  a **PyTorch reimplementation** of the pipeline that matches the original to roughly 1e-9 on a
  composite forward pass.
- Used permutation-based attribution to ask which channels, regions, and latent units the decoder
  actually relies on, validated with Monte Carlo and permutation testing.

## What I have not done (yet)

I have not done mechanistic interpretability of transformers or large language models. I have not
trained sparse autoencoders on an LLM, built attribution or circuit graphs, or studied
superposition in a transformer. The interpretability work I have done is **feature and region
attribution on my own neural decoders and on real neural data**. I say this plainly because the
transferable skill is real and I would rather be precise about where the bridge actually is.

## What transfers

<div class="table-scroll" markdown="1">

| From systems neuroscience | To interpretability of artificial networks |
| :--- | :--- |
| Reading computation out of the activity of hundreds of neurons | Reading computation out of the activations of a network |
| Permutation and ablation of inputs, regions, and latent units | Ablation and activation patching of components |
| Monte Carlo and permutation significance testing | Rigorous, adversarial verification of a claimed mechanism |
| Stratified cross-validation, class-weighted training, parity checks | Reproducible, tested, production-grade experiments |
| Working with messy, multi-terabyte experimental data | Keeping large, heterogeneous datasets organized and reproducible |

</div>

## Path

<ol class="timeline">
  <li>
    <span class="tl-when">2025 – present</span>
    <span class="tl-what"><b>Postdoctoral Scholar</b>, Vanderbilt University (Womelsdorf lab, Dept. of Psychology)
    <span>Attentional filtering in the trained decoder; a PyTorch port of the pipeline; confidence-gated decoding aimed at NeurIPS.</span></span>
  </li>
  <li>
    <span class="tl-when">2017 – 2024</span>
    <span class="tl-what"><b>Ph.D., Electrical Engineering</b>, Vanderbilt University
    <span>Dissertation: a brain-computer interface for decoding decisions during learning in a multidimensional environment.</span></span>
  </li>
  <li>
    <span class="tl-when">2017 – 2021</span>
    <span class="tl-what"><b>M.S., Electrical Engineering</b>, Vanderbilt University
    <span>Focus in signal processing, minor in robotics. Thesis on automated tuning of neural-oscillation detection.</span></span>
  </li>
  <li>
    <span class="tl-when">2013 – 2017</span>
    <span class="tl-what"><b>B.A., Chemistry and Economics</b>, Bowdoin College</span>
  </li>
</ol>

## Practical details

I am based in **Menlo Park, California**, US work-authorized with no visa sponsorship needed, and
available now. I am open to roles in AI interpretability, neurotechnology and brain-computer
interfaces, and neural-data machine learning. Email is the best way to reach me:
[{{ site.links.email }}](mailto:{{ site.links.email }}).

Outside the lab, I build small machine-learning tools for things I care about, including a couple
of [side projects]({{ '/projects/' | relative_url }}) around Magic: The Gathering that I use to
learn production ML engineering.
