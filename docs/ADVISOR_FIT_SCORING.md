# Advisor Fit Score (Simple Explanation)

This doc explains, in plain language, how `fitScore` is calculated in `/api/advisor-fit`.

## What data is used

The score uses:

- `papers[]` from the selected Google Scholar author profile
- `researchFields[]` inferred from paper titles/snippets and profile interests
- `studentInterests[]` sent by the student

## Final score formula

`fitScore` is from `0` to `100`.

It is a weighted average of 4 parts:

- Topic alignment: `40%`
- Recent activity: `25%`
- Impact signal: `20%`
- Publication breadth: `15%`

Formula:

`fitScore = topicAlignment*0.40 + recentActivity*0.25 + impactSignal*0.20 + publicationBreadth*0.15`

Then it is rounded and clamped to `0..100`.

## The 4 components

### 1) Topic Alignment (40%)

Checks overlap between:

- student interests (example: `["machine learning", "robotics"]`)
- inferred advisor research fields (example: `Machine Learning`, `Computer Vision`)

Rules:

- no interests or no fields -> score `30`
- no overlap -> score `20`
- with overlap -> `50 + (averageFieldConfidence * 50)`

So this part rewards clear topic match.

### 2) Recent Activity (25%)

Checks how many papers are recent.

- default recent window: last `5` years
- `recentCutoff = currentYear - 5`
- score is `%` of papers with valid year that are newer than cutoff

Fallbacks:

- no papers -> `20`
- papers exist but no years parsed -> `40`

### 3) Impact Signal (20%)

Uses citations as a rough impact proxy.

- take `citedByTotal` values
- sort descending
- take top 3 papers
- compute average top citations
- score is approximately `avgTopCitations / 20`, capped at `100`

Fallbacks:

- no papers -> `20`
- no citation values -> `30`

### 4) Publication Breadth (15%)

Checks diversity of publication venues.

- count unique `journalOrVenue`
- divide by `min(8, paperCount)` to avoid over-scaling
- convert to `0..100`

Fallback:

- no papers -> `20`

## Fit level labels

After `fitScore` is computed:

- `high` if `fitScore >= 75`
- `medium` if `fitScore >= 50`
- `low` if `fitScore < 50`

## Why pros/risks appear

The API also returns human-readable comments:

- high topic alignment -> pro
- low topic alignment -> risk
- high recent activity -> pro
- low recent activity -> risk
- high impact -> pro
- low impact -> risk
- high breadth -> pro
- low breadth -> risk

## Important note

This is a heuristic score for decision support, not a final truth.
You should combine it with:

- advisor availability
- supervision style
- funding and lab culture
- current student outcomes
