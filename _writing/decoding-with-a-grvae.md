---
title: Decoding value-based choice with a gated-recurrent VAE
order: 1
date: 2026-07-16
interactive: true
dek: >-
  A self-contained walkthrough of my decoder, from windowed spikes to a scored
  accuracy number, including an interactive look at the sampling step that makes
  it a variational model.
tags: [Neural decoding, Variational autoencoders]
description: >-
  How a gated-recurrent variational autoencoder decodes a monkey's value-based
  feature choices from intracranial recordings: the model, the reparameterization
  trick, and how the accuracy is actually scored.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "task", label: "The task and the data" }
  - { id: "why-vae", label: "Why a variational autoencoder" }
  - { id: "sampling", label: "The sampling step, interactively" }
  - { id: "classifiers", label: "Reading the latent space" }
  - { id: "training", label: "Training the whole thing" }
  - { id: "scoring", label: "How the accuracy is actually scored" }
  - { id: "limits", label: "What this does and does not show" }
  - { id: "refs", label: "References" }
---

## The short version {#short-version}

I built a model that reads a monkey's decision out of its brain activity. On each trial the animal
picks one of three objects, and each object varies along four visual features. The model takes a few
seconds of activity from hundreds of electrodes and predicts which features the chosen object had.

The model is a **variational autoencoder** with recurrent parts. It compresses the neural activity
into a small probabilistic latent space, samples a point from that space, and reads the decision off
the sample. Across all four features it reaches about **62% balanced accuracy, roughly 15% above
chance** once you correct for chance. On the single rewarded feature it reaches about **80%**. The
rest of this piece explains how each of those pieces works, and exactly what those numbers mean.

## The task and the data {#task}

The animal is learning which visual feature is worth choosing. It sees three "quaddle" objects and
selects one by looking at it; a correct choice earns a token that later cashes out for juice. Every
object varies along four feature dimensions, **shape, pattern, color, and arm type**. In any given
session three of those vary and one is held neutral, and within a block of trials exactly one feature
is the rewarded one. The animal has to discover which.

The neural data is **intracranial electrophysiology**, recorded with high-density depth probes in
awake, behaving non-human primates. This is not EEG. The session in the paper had **321
simultaneously recorded channels** across frontal cortex and striatum. The model's input is windowed
multi-unit activity spanning **1.5 seconds before to 1.5 seconds after** the recorded choice.

## Why a variational autoencoder {#why-vae}

An ordinary autoencoder squeezes its input through a bottleneck and learns to reconstruct it, so the
bottleneck has to capture the input's structure. A **variational** autoencoder makes the bottleneck
probabilistic: instead of encoding the input to a single point, it encodes to a small cloud, a
distribution with a mean and a spread. You then draw a sample from that cloud and decode the sample.

Two things make this a good fit for messy neural data. The cloud forces the model to organize its
latent space smoothly, so that nearby points mean similar things, which is exactly what you want if
you are going to read a decision off that space. And the reconstruction objective lets the model learn
structure from the signal itself, not only from the labels, which matters when labels are scarce and
the recordings are noisy.

<div class="table-scroll" markdown="1">

| Symbol | Meaning |
| :--- | :--- |
| `x` | windowed multi-unit activity, the input |
| `μ, σ` | the mean and spread the encoder outputs for a given `x` |
| `ε` | random noise drawn from a standard normal distribution |
| `z` | the sampled latent vector the rest of the model reads |
| `x̂` | the decoder's reconstruction of `x` |
| `ŷ_d` | the predicted class for feature dimension `d` |

</div>

The encoder and decoder are built from **gated recurrent units (GRU)**, so the model can use the
signal's temporal structure as evidence accumulates toward the choice.

## The sampling step, interactively {#sampling}

The trick that makes a VAE trainable is how it samples. You cannot backpropagate through a raw random
draw, so instead of sampling `z` directly, the model samples standard noise `ε` and shifts and scales
it by the encoder's output:

<div class="equation" role="img" aria-label="z equals mu plus sigma times epsilon, where epsilon is drawn from a standard normal distribution">
  <span class="var">z</span> <span class="op">=</span> <span class="var">μ</span> <span class="op">+</span> <span class="var">σ</span> <span class="op">⊙</span> <span class="var">ε</span>,
  <span class="op">&nbsp;</span> <span class="var">ε</span> <span class="op">∼</span> 𝒩(0,&nbsp;I)
</div>
<p class="eq-note">The reparameterization trick: the randomness lives in ε, so gradients can flow through μ and σ.</p>

The spread `σ` controls how much noise is injected. When `σ` is small, the sample sits almost exactly
on the encoded mean and the decode is nearly deterministic. When `σ` is large, samples scatter, and if
they scatter far enough they can drift into the territory of a different feature value and the decode
starts to make mistakes.

The figure below lets you feel that trade-off. Pick which feature value the latent encodes, then move
the sampling noise `σ`. Each dot is a sampled `z`, colored by the feature value it lands nearest to.
The number is the fraction that still land in the correct region.

<figure class="wide fig widget" id="latent-widget">
  <div class="widget-fallback">
    <svg class="diagram" viewBox="0 0 420 240" role="img" aria-label="Four labeled regions in a 2D latent space with a cloud of sampled points around one region">
      <circle cx="130" cy="80" r="42" fill="#2e9e6b22"/><text class="t-muted" x="130" y="34" text-anchor="middle">Green</text>
      <circle cx="290" cy="80" r="42" fill="#3b82c422"/><text class="t-muted" x="290" y="34" text-anchor="middle">Blue</text>
      <circle cx="130" cy="175" r="42" fill="#d1685f22"/><text class="t-muted" x="130" y="228" text-anchor="middle">Red</text>
      <circle cx="290" cy="175" r="42" fill="#8b93a022"/><text class="t-muted" x="290" y="228" text-anchor="middle">Neutral</text>
      <g fill="#2e9e6b">
        <circle cx="120" cy="72" r="2.4"/><circle cx="140" cy="88" r="2.4"/><circle cx="128" cy="95" r="2.4"/><circle cx="145" cy="70" r="2.4"/><circle cx="112" cy="85" r="2.4"/><circle cx="135" cy="66" r="2.4"/><circle cx="150" cy="92" r="2.4"/><circle cx="118" cy="100" r="2.4"/>
      </g>
    </svg>
    <p class="small muted">The interactive version needs JavaScript. It lets you set the sampling noise and watch how often the sampled point stays in the correct feature region.</p>
  </div>

  <div class="widget-live">
    <div class="widget-controls">
      <div class="widget-control">
        <label for="w-feature">Latent encodes feature value</label>
        <select id="w-feature" class="w-feature">
          <option value="0">Green</option>
          <option value="1">Blue</option>
          <option value="2">Red</option>
          <option value="3">Neutral</option>
        </select>
      </div>
      <div class="widget-control">
        <label for="w-sigma">Sampling noise σ <span class="val w-sigma-val">0.06</span></label>
        <input type="range" id="w-sigma" class="w-sigma" min="0.02" max="0.30" step="0.01" value="0.06">
      </div>
    </div>
    <button type="button" class="resample">Resample</button>
    <canvas height="320" role="img" aria-label="Sampled latent points colored by nearest feature region"></canvas>
    <div class="widget-readout" role="status" aria-live="polite">
      <span>Samples landing in the correct region: <span class="metric w-metric">…</span></span>
    </div>
    <div class="widget-legend">
      <span><i style="background:#2e9e6b"></i>Green</span>
      <span><i style="background:#3b82c4"></i>Blue</span>
      <span><i style="background:#d1685f"></i>Red</span>
      <span><i style="background:#8b93a0"></i>Neutral</span>
    </div>
  </div>

  <figcaption><b>Illustrative schematic, not real recordings.</b> A real latent space is high-dimensional and its regions are learned, not fixed. This 2D cartoon shows the intuition: the sampling step injects noise, and a well-organized latent space keeps the decode correct until the noise gets large.</figcaption>
</figure>

## Reading the latent space {#classifiers}

Once you have a latent sample `z`, two things read from it. A recurrent **decoder** tries to
reconstruct the original activity `x̂`, which is the unsupervised objective that keeps the latent space
organized. And a set of **classifiers** predicts the chosen object's features. There is one small
sub-network per feature dimension, each ending in a softmax over that dimension's possible values, so
the model outputs a separate prediction for shape, pattern, color, and arm type.

Splitting the classifier by feature matters, because the four dimensions are not equally easy and one
is always the neutral filler. Per-feature heads let the model, and the analysis, treat them
separately.

## Training the whole thing {#training}

The model minimizes a single composite loss with three parts:

<div class="equation" role="img" aria-label="The loss equals the reconstruction loss plus beta times the KL divergence plus the classification loss">
  <span class="var">ℒ</span> <span class="op">=</span> <span class="var">ℒ</span><sub>recon</sub> <span class="op">+</span> <span class="var">β</span> <span class="op">·</span> <span class="var">D</span><sub>KL</sub> <span class="op">+</span> <span class="var">ℒ</span><sub>classify</sub>
</div>
<p class="eq-note">Reconstruction keeps the latent faithful to the signal; the KL term keeps the latent close to a simple prior; the classification term makes it decode the choice.</p>

Reconstruction pulls the latent toward faithfully representing the input. The KL term keeps the
encoded distributions close to a simple standard-normal prior, which is what regularizes the latent
space. The classification term makes the latent useful for the actual decoding task. I used
class-weighted cross-entropy for the classifiers so the over-represented neutral feature would not
dominate.

Everything trained in a **MATLAB deep-learning framework I wrote by hand**, on a SLURM cluster,
with **hierarchical stratified k-fold cross-validation** that balances every fold across feature,
region, and outcome so no split gets an easy or unlucky draw. I selected the GRU-encoder,
LSTM-classifier configuration after sweeping six model families; simple non-neural baselines could not
beat chance.

## How the accuracy is actually scored {#scoring}

This is the part people usually skip, and it is the part that actually determines what the numbers
mean.

The reported metric is **chance-corrected (scaled) balanced accuracy**, where 0 is chance performance
and 1 is perfect. Balanced accuracy averages the per-class recall, which matters here because the
classes are imbalanced. Chance-correction rescales so that guessing at the base rate scores 0.

- **Overall, across all four feature dimensions, the model reaches about 15% above chance.** Stated as
  raw balanced accuracy, that same result is about **62%**. Those are two framings of one number, not
  two different results.
- **On the rewarded feature alone**, on trials where the animal chose it, the model reaches about
  **80%**. This is a real capability of the model on the target feature, and it is not the overall
  number. Reward here is a property of the block, not a class the decoder emits, so I always scope the
  80% to target-feature decoding.

A few honest breakdowns: decoding is stronger on low-attentional-load trials, stronger and less
variable on correct trials than on errors, and it climbs around the point where the animal's behavior
shows it has learned the block.

## What this does and does not show {#limits}

The decoder shows that a monkey's value-based feature choice is **readable** from a few seconds of
frontal and striatal activity, at well above chance, with a model that also tells you where and when
the information lives when you [interrogate it]({{ '/writing/attribution-as-interpretability/' | relative_url }}).

It does not show that these regions are *where the decision is made*. The dissertation's own
conclusion notes that object value may be better represented in orbitofrontal cortex than in the sites
I recorded, which is one plausible reason the overall accuracy sits where it does. And decoding is a
correlational readout: it tells you the information is present in the signal, not that the brain uses
it the same way the model does. I treat the decoder as a measurement instrument, and I treat the
attribution that follows as attribution, not proof of mechanism.

## References {#refs}

- Gerrity, C. G., Treuting, R. L., Peters, R. A., &amp; Womelsdorf, T. (2025). *Neuronal decoding of
  decisions in multidimensional feature space using a gated recurrent variational autoencoder.*
  [bioRxiv 2025.08.20.671126]({{ site.links.preprint }}).
- Kingma, D. P., &amp; Welling, M. (2014). *Auto-Encoding Variational Bayes.*
  [arXiv:1312.6114](https://arxiv.org/abs/1312.6114).
- The project overview, with the architecture diagram, is [here]({{ '/projects/grvae-decoder/' | relative_url }});
  the code lives in [neural_data_decoding](https://github.com/cgerrity/neural_data_decoding).

<script>
(function () {
  var fig = document.getElementById('latent-widget');
  if (!fig) return;
  var canvas = fig.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var sel = fig.querySelector('.w-feature');
  var sigma = fig.querySelector('.w-sigma');
  var sigmaVal = fig.querySelector('.w-sigma-val');
  var resampleBtn = fig.querySelector('.resample');
  var metric = fig.querySelector('.w-metric');

  var clusters = [
    { name: 'Green',   color: '#2e9e6b', x: 0.28, y: 0.30 },
    { name: 'Blue',    color: '#3b82c4', x: 0.72, y: 0.28 },
    { name: 'Red',     color: '#d1685f', x: 0.30, y: 0.72 },
    { name: 'Neutral', color: '#8b93a0', x: 0.72, y: 0.72 }
  ];
  var N = 220, W = 0, H = 320, dpr = 1;

  function cssVar(name, fb) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fb;
  }
  function randn() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth || 640;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function draw() {
    if (!W) resize();
    var pad = 30, pw = W - pad * 2, ph = H - pad * 2, r = Math.min(pw, ph) * 0.15;
    var surface = cssVar('--color-surface', '#ffffff');
    function sx(x) { return pad + x * pw; }
    function sy(y) { return pad + y * ph; }
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < clusters.length; i++) {
      var c = clusters[i];
      ctx.beginPath();
      ctx.arc(sx(c.x), sy(c.y), r, 0, Math.PI * 2);
      ctx.fillStyle = c.color + '22';
      ctx.fill();
      ctx.font = '600 13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = c.color;
      ctx.textAlign = 'center';
      ctx.fillText(c.name, sx(c.x), sy(c.y) - r - 8);
    }
    var idx = parseInt(sel.value, 10);
    var s = parseFloat(sigma.value);
    var sigPx = s * Math.min(pw, ph);
    var cpx = clusters.map(function (c) { return [sx(c.x), sy(c.y)]; });
    var correct = 0;
    for (var k = 0; k < N; k++) {
      var px = cpx[idx][0] + sigPx * randn(), py = cpx[idx][1] + sigPx * randn();
      var near = 0, bd = Infinity;
      for (var j = 0; j < cpx.length; j++) {
        var dx = px - cpx[j][0], dy = py - cpx[j][1], d = dx * dx + dy * dy;
        if (d < bd) { bd = d; near = j; }
      }
      if (near === idx) correct++;
      ctx.beginPath();
      ctx.arc(px, py, 2.3, 0, Math.PI * 2);
      ctx.fillStyle = clusters[near].color + 'cc';
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cpx[idx][0], cpx[idx][1], 5.5, 0, Math.PI * 2);
    ctx.fillStyle = surface; ctx.fill();
    ctx.lineWidth = 2.2; ctx.strokeStyle = clusters[idx].color; ctx.stroke();
    metric.textContent = Math.round(100 * correct / N) + '%';
  }
  sel.addEventListener('change', draw);
  sigma.addEventListener('input', function () { sigmaVal.textContent = parseFloat(sigma.value).toFixed(2); draw(); });
  resampleBtn.addEventListener('click', draw);
  window.addEventListener('resize', function () { resize(); draw(); });
  if (window.MutationObserver) {
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  sigmaVal.textContent = parseFloat(sigma.value).toFixed(2);
  requestAnimationFrame(function () { resize(); draw(); });
  window.addEventListener('load', function () { resize(); draw(); });
})();
</script>
