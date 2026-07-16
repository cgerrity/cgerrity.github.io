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
period: 2025–present
status: In progress
stack: [Python, PyTorch, Core ML, Swift / VisionKit]
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

VisionKit finds the card in the frame, a perspective transform deskews it to a canonical size, the
name and collector-info regions are cropped, and Apple Vision reads the text. A cascading lookup
turns that into a candidate printing, and a **Bayesian posterior is updated across successive video
frames** until it clears a confidence threshold, at which point the user confirms.

## Status

This is early. The data pipeline is built and passing tests; the on-device model and app pieces are in
progress. I include it because the shape of the work, from data ingestion to on-device deployment to
streaming Bayesian confidence, is exactly the kind of engineering I enjoy.

## How it was built

I designed and directed it, and built it with heavy use of AI coding tools.
