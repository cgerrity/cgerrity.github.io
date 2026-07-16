---
title: "From electrode to tensor: the neural-data pipeline"
order: 4
date: 2026-07-16
interactive: true
dek: >-
  A detailed walk through the preprocessing and processing pipeline behind my
  decoders: how raw 30 kHz voltage from 64-channel depth probes becomes clean,
  behavior-aligned tensors of neural firing rate.
tags: [Signal processing, Neural data]
description: >-
  The full preprocessing and processing pipeline from the Neural-Data-Reading
  framework: recording, channel mapping, re-referencing, the multi-unit-activity
  filter chain, epoching, tensor assembly, augmentation, and stratified folds.
toc:
  - { id: "short-version", label: "The short version" }
  - { id: "overview", label: "The pipeline at a glance" }
  - { id: "recording", label: "1 · Recording" }
  - { id: "wrangling", label: "2 · Getting the data right" }
  - { id: "cleaning", label: "3 · Cleaning the signal" }
  - { id: "mua", label: "4 · Spikes to firing rate (interactive)" }
  - { id: "epoch", label: "5 · Epoching to the decision" }
  - { id: "tensor", label: "6 · Assembling the tensor" }
  - { id: "augment", label: "7 · Augmentation" }
  - { id: "folds", label: "8 · Balanced folds" }
  - { id: "built", label: "How it is built" }
  - { id: "refs", label: "References" }
---

## The short version {#short-version}

Before any decoder could read a decision, the raw recordings had to become something a network could
train on. That is a longer job than it sounds. Each session produces a few hours of voltage sampled at
30,000 times a second on 64-channel probes, full of line noise, dead contacts, and a channel order
that was, on one dataset, simply wrong. This piece walks through the whole pipeline that turns that
into clean, behavior-aligned tensors of neural firing rate: recording, channel mapping, re-referencing,
the filter chain that converts spikes into a continuous rate, epoching to the moment of choice, and the
tensor assembly and cross-validation that feed the model. The result is roughly **30,000 behavior-aligned
trials**.

## The pipeline at a glance {#overview}

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 960 424" role="img" aria-labelledby="pipe-title">
  <title id="pipe-title">The full pipeline: preprocessing turns raw voltage into continuous multi-unit activity, processing turns it into behavior-aligned tensors, then hierarchical stratified cross-validation feeds the decoder</title>
  <defs>
    <marker id="pah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead-accent" d="M0,0 L6.5,3 L0,6 Z"/></marker>
  </defs>

  <rect class="box-2" x="8" y="8" width="456" height="316" rx="10"/>
  <text class="t-accent" x="30" y="38" font-weight="650">Preprocessing → continuous MUA</text>
  <circle class="dot" cx="34" cy="72" r="3"/><text x="48" y="76">Align data sources <tspan class="t-muted">· task (Unity) + recorder via sync box</tspan></text>
  <circle class="dot" cx="34" cy="108" r="3"/><text x="48" y="112">Apply channel map</text>
  <circle class="dot" cx="34" cy="144" r="3"/><text x="48" y="148">Split into trials</text>
  <circle class="dot" cx="34" cy="180" r="3"/><text x="48" y="184">Identify bad channels <tspan class="t-muted">· PCA + K-means</tspan></text>
  <circle class="dot" cx="34" cy="216" r="3"/><text x="48" y="220">Notch filter <tspan class="t-muted">· 60 / 120 / 180 Hz</tspan></text>
  <circle class="dot" cx="34" cy="252" r="3"/><text x="48" y="256">Median re-reference</text>
  <circle class="dot" cx="34" cy="288" r="3"/><text x="48" y="292">Continuous MUA</text>
  <text class="t-muted" x="48" y="308" font-size="11">band-pass · rectify · low-pass · resample · smooth</text>

  <rect class="box-2" x="488" y="8" width="464" height="316" rx="10"/>
  <text class="t-accent" x="510" y="38" font-weight="650">Processing → tensors</text>
  <circle class="dot" cx="514" cy="72" r="3"/><text x="528" y="76">Epoch + baseline segments <tspan class="t-muted">· ±1.5 s</tspan></text>
  <circle class="dot" cx="514" cy="108" r="3"/><text x="528" y="112">Remove aborted trials</text>
  <circle class="dot" cx="514" cy="144" r="3"/><text x="528" y="148">Detrend <tspan class="t-muted">· baseline trend line</tspan></text>
  <circle class="dot" cx="514" cy="180" r="3"/><text x="528" y="184">Normalize</text>
  <circle class="dot" cx="514" cy="216" r="3"/><text x="528" y="220">Keep task-modulated channels</text>
  <circle class="dot" cx="514" cy="252" r="3"/><text x="528" y="256">Concatenate areas <tspan class="t-muted">· C × T × A</tspan></text>
  <text class="t-muted" x="528" y="292" font-size="11">then window in 100 ms steps, every 50 ms</text>

  <line class="flow-accent" x1="236" y1="324" x2="236" y2="356" marker-end="url(#pah)"/>
  <line class="flow-accent" x1="720" y1="324" x2="720" y2="356" marker-end="url(#pah)"/>
  <rect class="box-accent" x="230" y="360" width="500" height="52" rx="10"/>
  <text class="t-accent" x="480" y="384" text-anchor="middle" font-weight="650">Hierarchical stratified 10-fold cross-validation</text>
  <text class="t-muted" x="480" y="402" text-anchor="middle">balanced across feature, area, outcome, gain/loss, learning, session, then to the decoder</text>
</svg>
<figcaption><b>The full pipeline.</b> Preprocessing turns raw 30 kHz voltage into continuous multi-unit activity; processing turns that into behavior-aligned, channel-by-time-by-area tensors; and a hierarchical stratified cross-validation splits them into balanced folds for the decoder. Each step is walked through below.</figcaption>
</figure>

## 1 · Recording {#recording}

The signal comes from **64-channel NeuroNexus depth probes**, long shanks with electrical contacts
arranged in a vertical column. At the start of each session I lowered the probes through guide tubes
using **NAN Instruments software-controlled precision microdrives**, recorded through an **Intan
RHD2000 controller**, and sampled at **30 kHz** with **Open Ephys**. I performed the acute
implantations and ran the sessions myself, on a rig I tested and used but did not design.

Two details from the rig matter downstream. The **last five channels of each probe** were wired to a
stimulating controller and did not record, so they show up as noise. And the **center channel** of each
probe was used as the within-brain reference, so it too carries only background. Both have to be found
and removed before anything else.

## 2 · Getting the data right {#wrangling}

Before filtering, four unglamorous steps decide whether the rest of the pipeline is even valid.

**Alignment.** The behavioral task runs in a game engine (Unity) that logs frame-by-frame events, while
the neural recorder runs on its own clock. A sync box ties the two to a common recorder time, so any
sample can be tied to the exact moment of a choice.

**Channel mapping.** The physical order of contacts on the probe is not the order the samples arrive
in; a channel map translates between them. On the foundational dataset that map was **inverted at the
probe-to-EIB (electrode interface board) interface**, which scrambled the channel order and had stalled
two prior researchers. I reverse-engineered the signal path from the probe through the electrode
interface board, the Intan headstage, and the Open Ephys recorder, rebuilt the map from first
principles, and validated it against the spatial-correlation structure you expect from neighboring
contacts. That unblocked the dataset. (This is my own account, from lab experience.)

**Splitting into trials.** Using the aligned event stream, the continuous recording is cut into
per-trial segments so that every step from here on operates trial by trial.

**Bad-channel detection.** Dead contacts, the stimulator-wired channels, and the reference channel all
have to be identified and dropped. I did this with a **PCA and K-means routine**: for each probe I ran
principal component analysis across trials to summarize every channel, clustered the channels, and
flagged any that clustered with a known artifact channel or sat alone in its own group across most
clusterings. A real recording channel looks like its neighbors; an artifact does not.

## 3 · Cleaning the signal {#cleaning}

With good channels in hand, two cleaning steps remove shared noise:

- **Notch filtering** at **60, 120, and 180 Hz** removes power-line noise and its harmonics.
- **Median re-referencing** subtracts, at each time point, the median activity across the good channels
  on a probe. I used the median rather than the average deliberately: for spiking data, averaging folds
  single spikes into a small common signal that then gets added back onto every channel, creating
  artifactual spikes. The median suppresses that.

## 4 · Spikes to firing rate (interactive) {#mua}

The decoder does not work on raw voltage; it works on **continuous multi-unit activity (MUA)**, a
smooth estimate of how fast a patch of tissue is firing over time. Getting there is a short filter
chain. Step through it below, starting from the raw wideband signal, and watch it turn into a firing rate.

<figure class="wide fig widget" id="mua-stepper">
  <div class="widget-fallback">
    <svg class="diagram" viewBox="0 0 420 150" role="img" aria-label="A raw spiky voltage trace becoming a smooth firing-rate curve after filtering">
      <text class="t-muted" x="10" y="16">Wideband</text>
      <polyline class="flow" points="10,40 30,30 40,55 45,20 60,44 70,38 90,60 100,28 120,46 140,35 160,50 180,33 200,48" />
      <text class="t-muted" x="230" y="16">Continuous MUA</text>
      <path class="flow-accent" d="M230 120 C 260 70, 285 95, 310 80 S 360 60, 410 90" />
    </svg>
    <p class="small muted">The interactive version needs JavaScript. It steps a synthetic recording through every stage of the pipeline, from raw voltage to a smooth firing rate.</p>
  </div>

  <div class="widget-live">
    <div class="stepper-head">
      <div>
        <div class="stepper-stage">Stage <span class="s-num">1</span> of 7: <span class="s-name">Wideband</span></div>
        <div class="stepper-param s-param">raw recording, 30 kHz</div>
      </div>
      <div class="stepper-controls">
        <button type="button" class="s-prev" aria-label="Previous stage">&larr; Prev</button>
        <button type="button" class="s-next" aria-label="Next stage">Next &rarr;</button>
      </div>
    </div>
    <canvas height="260" role="img" aria-label="Synthetic neural signal at the current processing stage"></canvas>
    <p class="stepper-desc s-desc" role="status" aria-live="polite">The raw wideband signal: slow drift, an oscillation, and sharp spikes, all mixed together.</p>
    <div class="stepper-dots" aria-hidden="true"></div>
  </div>

  <figcaption><b>Illustrative schematic, not real recordings.</b> A synthetic trace stepped through the pipeline. In the dissertation the real version of this figure runs a low-spiking anterior cingulate channel and a high-spiking caudate channel through the same stages side by side.</figcaption>
</figure>

The five filter steps, with the values I used:

<div class="table-scroll" markdown="1">

| Step | What it does | Setting |
| :--- | :--- | :--- |
| Band-pass | Isolate the spiking band, drop drift and low-frequency activity | 750 Hz to 5000 Hz |
| Rectify | Take the absolute value so spikes count regardless of sign | `abs(x)` |
| Low-pass | Turn the rectified spikes into a smooth envelope | 300 Hz |
| Resample | Drop to a manageable sampling rate | 1000 Hz |
| Smooth | Gaussian-smooth into a firing-rate estimate | 200 ms window |

</div>

The Gaussian window is the one real judgment call here. Too narrow and the estimate stays spiky; too
wide and it smears real temporal structure. I chose 200 ms to represent overall firing rate while
keeping the within-trial dynamics the decoder needs.

## 5 · Epoching to the decision {#epoch}

The continuous MUA is one long stream. To make trials, I cut a window around the **moment the choice
was recorded**, which is the event the whole task turns on.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 960 190" role="img" aria-labelledby="epoch-title">
  <title id="epoch-title">The decision epoch spans 1500 ms before to 1500 ms after the recorded choice, with a 500 ms baseline at the start of the trial</title>
  <!-- phase bar -->
  <line class="flow" x1="20" y1="34" x2="940" y2="34"/>
  <g class="grid-line" stroke-dasharray="3 4">
    <line x1="150" y1="24" x2="150" y2="150"/>
    <line x1="470" y1="24" x2="470" y2="160"/>
    <line x1="560" y1="24" x2="560" y2="150"/>
  </g>
  <text class="t-muted" x="85" y="24" text-anchor="middle">Start trial</text>
  <text class="t-muted" x="310" y="24" text-anchor="middle">Sampling &amp; choice</text>
  <text class="t-muted" x="640" y="24" text-anchor="middle">Feedback</text>

  <!-- decision marker -->
  <line class="flow-accent" x1="640" y1="44" x2="640" y2="150"/>
  <circle class="dot" cx="640" cy="96" r="4"/>
  <text class="t-accent" x="640" y="176" text-anchor="middle">decision recorded (t = 0)</text>

  <!-- baseline bracket -->
  <path class="flow" d="M24 60 L24 74 L146 74 L146 60"/>
  <text class="t-muted" x="85" y="92" text-anchor="middle">baseline · 500 ms</text>

  <!-- epoch bracket -->
  <path class="flow-accent" d="M320 118 L320 132 L960 132" transform="translate(0,0)"/>
  <path class="flow-accent" d="M320 132 L960 132"/>
  <line class="flow-accent" x1="320" y1="118" x2="320" y2="132"/>
  <line class="flow-accent" x1="958" y1="118" x2="958" y2="132"/>
  <text class="t-muted" x="480" y="150" text-anchor="middle">1500 ms before</text>
  <text class="t-muted" x="800" y="150" text-anchor="middle">1500 ms after</text>

  <!-- fixation + committal markers -->
  <line class="grid-line" x1="470" y1="44" x2="470" y2="110"/>
  <text class="t-muted" x="470" y="108" text-anchor="middle" font-size="10.5">fixation start (−700 ms)</text>
  <line class="grid-line" x1="560" y1="44" x2="560" y2="96"/>
  <text class="t-muted" x="560" y="94" text-anchor="middle" font-size="10.5">likely commit (−400 ms)</text>
</svg>
<figcaption><b>The decision epoch.</b> Each trial is cut from 1500 ms before to 1500 ms after the recorded choice, so it spans the run-up to the decision, the decision itself, and the feedback. A separate 500 ms baseline is taken at the start of the trial. The 700 ms fixation and the likely-commit point mark where the behavior becomes identical across trials.</figcaption>
</figure>

Why this window? The 700 ms before the choice is always the same behaviorally (the animal is holding
fixation to commit), so it anchors the trials to a common event even when decision times differ. The
window reaches back before the decision and forward into feedback, so the model sees the run-up, the
choice, and the outcome.

Not every segment survives, and a few cleanups run before the trials are usable:

- **Remove aborted trials.** Trials where the animal never committed, or that ran longer than 10
  seconds (it took a break), are dropped.
- **Detrend.** A linear trend fit to the trial's own baseline period is subtracted from both the
  baseline and the decision epoch, removing slow drift specific to that trial.
- **Normalize**, so trials are on a common scale.
- **Keep task-modulated channels.** A regression of task variables (reward, learning status,
  attentional load, gain, loss, and previous outcome) onto each channel's activity finds which channels
  actually carry task information; channels that carry none are dropped from the decode.

## 6 · Assembling the tensor {#tensor}

The epoched trials become a tensor the network can consume. Each trial is **X ∈ ℝ<sup>C × T × A</sup>**:
channels by time by area.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 900 240" role="img" aria-labelledby="tensor-title">
  <title id="tensor-title">A trial is a channels-by-time-by-area tensor, with a sliding 100 ms window taken every 50 ms</title>
  <!-- area stack (behind) -->
  <rect class="box-2" x="150" y="34" width="470" height="150" rx="6"/>
  <rect class="box-2" x="140" y="44" width="470" height="150" rx="6"/>
  <rect class="box" x="130" y="54" width="470" height="150" rx="6"/>
  <!-- grid lines suggesting channels x time -->
  <g class="grid-line">
    <line x1="130" y1="84" x2="600" y2="84"/><line x1="130" y1="114" x2="600" y2="114"/>
    <line x1="130" y1="144" x2="600" y2="144"/><line x1="130" y1="174" x2="600" y2="174"/>
  </g>
  <!-- sliding window highlight -->
  <rect class="box-accent" x="300" y="54" width="70" height="150" rx="4" opacity="0.85"/>
  <text class="t-accent" x="335" y="222" text-anchor="middle">100 ms window</text>
  <!-- axis labels -->
  <text class="t-muted" x="120" y="130" text-anchor="end">C: channels</text>
  <text class="t-muted" x="365" y="46" text-anchor="middle">T: time →</text>
  <text class="t-muted" x="628" y="118" text-anchor="start">A: 6 area slots</text>
  <text class="t-muted" x="628" y="136" text-anchor="start" font-size="10.5">(2 each: ACC, PFC, caudate)</text>
</svg>
<figcaption><b>The trial tensor.</b> Channels by time, stacked across an area dimension with six probe slots (two each in ACC, PFC, and caudate); sessions missing an area get an empty slot so every trial keeps the same shape. Removed channels are set to zero. The decoder reads it through a 100 ms window that slides in 50 ms steps, so each window is X[s] ∈ ℝ<sup>C × W × A</sup>.</figcaption>
</figure>

Two more details make the tensor consistent. **Removed channels are set to zero** for all time points
and left out of the statistics, so they neither contribute nor distort normalization. And each trial is
**layer-normalized** (z-scored per example), which stabilizes training while keeping each trial's own
statistics intact.

## 7 · Augmentation {#augment}

On the **training set only**, I expand the data with realistic synthetic noise so the model generalizes
rather than memorizing individual recordings. Each time a training trial is used, it gets a fresh draw
of three noise components added per channel: a constant **channel offset**, **white noise**, and a
**random walk**, plus a small **time shift**. The combined noise is then smoothed with a 50 ms Gaussian
window so its frequency content matches the real data; without that step the model would just learn to
strip off high-frequency noise that never appears in real recordings.

## 8 · Balanced folds {#folds}

Finally, the trials are split for **ten-fold cross-validation**, but not randomly. A **hierarchical
stratified** scheme balances every fold across, in priority order, the **feature dimension** (shape,
pattern, color, arm type), the **recording area**, the **outcome**, the **gain/loss** condition, the
**learning status**, and the **session**. That keeps any one fold from getting an easy or unlucky draw,
which matters a lot when the signal is this subtle.

## How it is built {#built}

Being precise about authorship: the **preprocessing** that turns raw voltage into continuous MUA was
built on the **FieldTrip** toolbox and utilities from the **Womelsdorf lab** together with my own
MATLAB code. Everything downstream, the epoching, tensor assembly, augmentation, stratified
cross-validation, and the training loop, is my own hand-written framework,
[Neural-Data-Reading]({{ '/projects/matlab-framework/' | relative_url }}) (600+ `cgg_` functions). The
channel-map fix is my own first-principles work. Once the data comes out of this pipeline, it feeds the
[gated-recurrent VAE decoder]({{ '/writing/decoding-with-a-grvae/' | relative_url }}).

## References {#refs}

- Gerrity, C. G. (2024). *A brain-computer interface for decoding decisions during learning in a
  multidimensional environment.* Ph.D. dissertation, Vanderbilt University. The Methods chapter
  documents this pipeline and the figures it is based on.
- Oostenveld, R., et al. (2011). *FieldTrip: Open source software for advanced analysis of MEG, EEG,
  and invasive electrophysiological data.* Computational Intelligence and Neuroscience.
- The framework that implements the downstream pipeline is
  [Neural-Data-Reading](https://github.com/cgerrity/Neural-Data-Reading).

<script>
(function () {
  var fig = document.getElementById('mua-stepper');
  if (!fig) return;
  var canvas = fig.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var elNum = fig.querySelector('.s-num'), elName = fig.querySelector('.s-name');
  var elParam = fig.querySelector('.s-param'), elDesc = fig.querySelector('.s-desc');
  var prev = fig.querySelector('.s-prev'), next = fig.querySelector('.s-next');
  var dots = fig.querySelector('.stepper-dots');

  var N = 720;
  function hash(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
  function movavg(a, w) {
    var out = new Array(a.length), h = Math.floor(w / 2);
    for (var i = 0; i < a.length; i++) {
      var s = 0, c = 0;
      for (var j = i - h; j <= i + h; j++) { if (j >= 0 && j < a.length) { s += a[j]; c++; } }
      out[i] = s / c;
    }
    return out;
  }
  // base wideband signal
  var drift = [], wide = [];
  for (var i = 0; i < N; i++) {
    var t = i / N;
    drift[i] = 24 * Math.sin(2 * Math.PI * 1.25 * t + 0.6);
    var osc = 6 * Math.sin(2 * Math.PI * 9 * t);
    var noise = 5 * (hash(i) - 0.5);
    wide[i] = drift[i] + osc + noise;
  }
  var spikes = [40, 55, 58, 130, 205, 210, 330, 333, 470, 610, 615, 618, 680];
  spikes.forEach(function (p) {
    if (p > 1 && p < N - 1) { wide[p] += 46; wide[p - 1] -= 16; wide[p + 1] -= 12; }
  });
  // stages
  var rereferenced = wide.map(function (v, i) { return v - drift[i]; });
  var lowtrend = movavg(rereferenced, 17);
  var bandpass = rereferenced.map(function (v, i) { return v - lowtrend[i]; });
  var rectified = bandpass.map(function (v) { return Math.abs(v); });
  var lowpass = movavg(rectified, 11);
  var resampled = lowpass.map(function (v, i) { return lowpass[Math.floor(i / 6) * 6]; });
  var smoothed = movavg(resampled, 45);

  var stages = [
    { name: 'Wideband', param: 'raw recording, 30 kHz', data: wide, bipolar: true,
      desc: 'The raw wideband signal: slow drift, an oscillation, and sharp spikes, all mixed together.' },
    { name: 'Median re-reference', param: 'subtract per-probe median', data: rereferenced, bipolar: true,
      desc: 'Subtracting the median across good channels removes the drift and shared noise, centering the trace.' },
    { name: 'Band-pass', param: '750 Hz to 5000 Hz', data: bandpass, bipolar: true,
      desc: 'Keeping only the spiking band drops the remaining low-frequency activity and leaves the spikes standing out.' },
    { name: 'Rectify', param: 'absolute value', data: rectified, bipolar: false,
      desc: 'Taking the absolute value makes every spike a positive deflection, regardless of its original sign.' },
    { name: 'Low-pass', param: '300 Hz', data: lowpass, bipolar: false,
      desc: 'Low-pass filtering turns the rectified spikes into a smooth envelope: roughly, how much spiking is happening.' },
    { name: 'Resample', param: 'down to 1000 Hz', data: resampled, bipolar: false,
      desc: 'The envelope is resampled to a manageable rate; the shape is preserved, the sample count drops.' },
    { name: 'Gaussian smooth', param: '200 ms window', data: smoothed, bipolar: false,
      desc: 'A final Gaussian smoothing yields the continuous multi-unit activity: a firing-rate estimate the decoder trains on.' }
  ];
  var idx = 0, W = 0, H = 260, dpr = 1;

  // build dots
  stages.forEach(function (_, k) {
    var d = document.createElement('i');
    d.addEventListener('click', function () { idx = k; render(); });
    dots.appendChild(d);
  });

  function cssVar(n, fb) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || fb; }
  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth || 640;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function render() {
    if (!W) resize();
    var st = stages[idx];
    elNum.textContent = idx + 1; elName.textContent = st.name;
    elParam.textContent = st.param; elDesc.textContent = st.desc;
    prev.disabled = idx === 0; next.disabled = idx === stages.length - 1;
    Array.prototype.forEach.call(dots.children, function (d, k) { d.className = k === idx ? 'on' : ''; });

    var accent = cssVar('--color-accent', '#0b5394');
    var muted = cssVar('--color-border', '#ddd');
    var pad = 18, pw = W - pad * 2, ph = H - pad * 2;
    ctx.clearRect(0, 0, W, H);
    var d = st.data, n = d.length;
    var min = Infinity, max = -Infinity;
    for (var i = 0; i < n; i++) { if (d[i] < min) min = d[i]; if (d[i] > max) max = d[i]; }
    var range = (max - min) || 1;
    function x(i) { return pad + (i / (n - 1)) * pw; }
    var y;
    if (st.bipolar) {
      var amp = Math.max(Math.abs(min), Math.abs(max)) || 1;
      var mid = pad + ph / 2;
      ctx.strokeStyle = muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, mid); ctx.lineTo(pad + pw, mid); ctx.stroke();
      y = function (v) { return mid - (v / amp) * (ph / 2) * 0.92; };
    } else {
      var base = pad + ph;
      ctx.strokeStyle = muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, base); ctx.lineTo(pad + pw, base); ctx.stroke();
      y = function (v) { return base - ((v - min) / range) * ph * 0.92; };
    }
    ctx.strokeStyle = accent; ctx.lineWidth = st.name === 'Gaussian smooth' ? 2.4 : 1.4;
    ctx.lineJoin = 'round'; ctx.beginPath();
    for (var k = 0; k < n; k++) { var px = x(k), py = y(d[k]); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
    ctx.stroke();
  }
  prev.addEventListener('click', function () { if (idx > 0) { idx--; render(); } });
  next.addEventListener('click', function () { if (idx < stages.length - 1) { idx++; render(); } });
  window.addEventListener('resize', function () { resize(); render(); });
  if (window.MutationObserver) new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  requestAnimationFrame(function () { resize(); render(); });
  window.addEventListener('load', function () { resize(); render(); });
})();
</script>
