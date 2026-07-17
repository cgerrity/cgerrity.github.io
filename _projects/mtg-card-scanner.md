---
title: On-device card scanner
category: side
order: 1
kicker: Side project · on-device ML
summary: >-
  An iPhone app that identifies Magic: The Gathering cards from the camera using
  on-device machine learning, built to learn production ML engineering end to end.
card_desc: >-
  An iPhone app that identifies trading cards from the camera with on-device ML:
  detection, OCR, and a Bayesian posterior across video frames.
role: Designer and director. Built with heavy use of AI coding tools.
period: 2026–present
status: In progress
stack: [Python, PyTorch, Core ML, Swift / Vision / AVFoundation]
tags: [On-device ML, Computer vision, iOS]
links:
  - { label: "Code (GitHub)", url: "https://github.com/cgerrity/mtg-card-scanner", primary: true }
description: >-
  A side project: an on-device iOS app that identifies trading cards with computer
  vision, OCR, and streaming Bayesian inference.
---

## What it is

An iPhone app that identifies Magic: The Gathering cards from the camera using on-device machine
learning and keeps a personal collection synced through iCloud. It is a genuinely useful personal
tool, and it is also how I am learning production ML engineering end to end: data pipelines,
on-device model deployment, and streaming inference.

## How it identifies a card

Apple's Vision framework finds the card-shaped rectangle in each camera frame (`VNDetectRectangles`
on an AVFoundation capture session), a perspective transform deskews it to a canonical size, the name
and collector-info regions are cropped, and Apple Vision reads the text. A cascading lookup turns that
into a candidate printing, and a **Bayesian posterior is updated across successive video frames** until
it clears a confidence threshold, at which point the user confirms.

<figure class="wide fig">
<svg class="diagram" viewBox="0 0 960 130" role="img" aria-labelledby="scan-title">
<title id="scan-title">On-device scanning pipeline: camera frame, card detection, deskew, OCR, cascading lookup, and Bayesian confirmation across frames</title>
<defs><marker id="sah" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path class="arrowhead" d="M0,0 L6.5,3 L0,6 Z"/></marker></defs>
  <rect class="box" x="8" y="26" width="140" height="70" rx="8"/><text class="t-title" x="78" y="56" text-anchor="middle" font-size="12.5">Camera</text><text class="t-muted" x="78" y="76" text-anchor="middle" font-size="11">video frame</text>
  <line class="flow" x1="148" y1="61" x2="176" y2="61" marker-end="url(#sah)"/>
  <rect class="box-accent" x="168" y="26" width="140" height="70" rx="8"/><text class="t-title" x="238" y="56" text-anchor="middle" font-size="12.5">Detect card</text><text class="t-muted" x="238" y="76" text-anchor="middle" font-size="11">Vision</text>
  <line class="flow" x1="308" y1="61" x2="336" y2="61" marker-end="url(#sah)"/>
  <rect class="box" x="328" y="26" width="140" height="70" rx="8"/><text class="t-title" x="398" y="56" text-anchor="middle" font-size="12.5">Deskew</text><text class="t-muted" x="398" y="76" text-anchor="middle" font-size="11">perspective</text>
  <line class="flow" x1="468" y1="61" x2="496" y2="61" marker-end="url(#sah)"/>
  <rect class="box-accent" x="488" y="26" width="140" height="70" rx="8"/><text class="t-title" x="558" y="56" text-anchor="middle" font-size="12.5">Read text</text><text class="t-muted" x="558" y="76" text-anchor="middle" font-size="11">OCR</text>
  <line class="flow" x1="628" y1="61" x2="656" y2="61" marker-end="url(#sah)"/>
  <rect class="box" x="648" y="26" width="140" height="70" rx="8"/><text class="t-title" x="718" y="56" text-anchor="middle" font-size="12.5">Look up</text><text class="t-muted" x="718" y="76" text-anchor="middle" font-size="11">printing</text>
  <line class="flow" x1="788" y1="61" x2="816" y2="61" marker-end="url(#sah)"/>
  <rect class="box-accent" x="808" y="26" width="140" height="70" rx="8"/><text class="t-title" x="878" y="56" text-anchor="middle" font-size="12.5">Confirm</text><text class="t-muted" x="878" y="76" text-anchor="middle" font-size="11">across frames</text>
</svg>
<figcaption><b>How a card is identified.</b> Apple's Vision framework finds the card rectangle in each camera frame, a perspective transform deskews it, Vision reads the text from the name and collector regions, a cascading lookup resolves the printing, and a Bayesian posterior updated across successive video frames confirms the card once it clears a confidence threshold.</figcaption>
</figure>

## Status

This is early. The data pipeline and the camera, detection, and deskew pieces are in progress; the
on-device Core ML model is planned but not yet started. I include it because the shape of the work,
from data ingestion to on-device deployment to streaming Bayesian confidence, is exactly the kind of
engineering I enjoy.

## How it was built

I designed and directed it, and built it with heavy use of AI coding tools.
