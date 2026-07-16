---
title: Benchmarking neural-oscillation detectors
category: research
order: 5
kicker: Masters research · signal processing
summary: >-
  An offline MATLAB framework that benchmarks and auto-tunes beta-band burst
  detection and phase-characterization algorithms against synthetic ground truth.
card_desc: >-
  My Masters thesis: an offline framework that benchmarks and auto-tunes beta-burst
  detection and phase estimation against synthetic ground truth.
role: Sole author.
period: 2019–2021
stack: [MATLAB, Hilbert transform, Goertzel, Levenberg–Marquardt]
tags: [Signal processing, Detection & estimation, Oscillations]
links:
  - { label: "Read the thesis", url: "https://hdl.handle.net/1803/16957", primary: true }
description: >-
  Masters thesis: an offline framework to evaluate and tune neural-oscillation
  detection algorithms, upstream of phase-locked stimulation.
---

## The problem

Phase-locked electrical stimulation of fronto-striatal circuits depends on detecting **beta-band
(12–25 Hz) LFP oscillation bursts** and characterizing their phase accurately. The catch is that
burst-detection algorithms have many tunable settings and no obvious way to know which settings are
correct on real data, where you never see the ground truth.

## What I built

An **offline framework that benchmarks and auto-tunes** these detectors against synthetic ground
truth, using bursts generated from Morlet wavelets so the true onset, offset, and phase are known. It
generates features with the **Hilbert transform**, the **Goertzel algorithm**, and non-linear
sinusoidal (**Levenberg–Marquardt**) fitting, classifies bursts by threshold, and characterizes their
phase. Because the synthetic bursts have known properties, the framework can score any algorithm's
output and search its settings systematically.

## What it is, and what it is not

This is an **offline** benchmarking and tuning framework. The real-time, phase-locked stimulation it
was motivated by is exactly that: the motivation. I did not build a stimulator, and nothing here runs
in real time.

## Why it still matters to me

This is where I learned estimation and detection theory and signal processing in depth, upstream of
the deep-learning decoding I do now. The detection and phase-characterization methods here are the
same ones a phase-locked stimulator would have to depend on, which is one of the reasons I care about
the "write" side of brain-computer interfaces even though I have worked mostly on the "read" side.
