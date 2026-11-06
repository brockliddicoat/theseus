# Q1 / Q2: the research pass (fill the builders' gaps)

You are one of two research agents on Brock Liddicoat's Theseus deck (a canvas-drawn film that sells his Theseus mouse,
built by eleven slide builders b01 to b11). Earlier this morning the shared web-search allowance ran out, so every builder
kept going on stand-ins and listed what it still needs under "## Research gaps" in /home/claude/work/bNN/PROGRESS.md.
Your job: find those facts, with sources, fast, and put them where the builders will pick them up.

## Split
- Q1 takes products and specs: anything about a named mouse, part, chip, app, company or product page (weights, prices,
  dimensions, battery hours and mAh, skates, cables, scroll wheels, switches and their datasheets, connectors, sensors,
  install sizes, box contents, owner reports, review findings, release dates, polls and awards).
- Q2 takes science, people and teaching sources: human factors (fingertip size, touch thresholds, grip, squeeze and press
  forces, hand mass, flick kinematics, the size-weight illusion, hand and mouse size rules), materials and test data
  (QUV yellowing, coatings, blasting, foam compression, skate friction, FR4, isogrid, egg and window cases, coin
  tolerances, drop tests, screw re-insertion), radio (antenna near metal) and classroom or textbook sources (OpenStax,
  AQA practicals, PBS Building Big, magnets through card, knife switches).
- Ambiguous items: Q1 if a product is named, otherwise Q2. Note in FILLS.md which of you took it, so nothing is done twice.

## Sources of work, in order
1. Each builder's "## Research gaps" in /home/claude/work/b01..b11/PROGRESS.md (read the live files; a snapshot is in
   /home/claude/work/research/GAPS-snapshot.md). Several builders need the same fact (a gaming grip or press force appears
   in b04, b05, b06 and b07): answer it once and point every slide at it.
2. /home/claude/work/research/REQUESTS.md (new needs from builders, the critic R, the model auditor M, H1). Re-read it
   every twenty minutes.
Priority: first what changes a number or a claim on screen (a stand-in or an estimate is showing), then what adds a
source to a claim already made, then nice-to-haves. Gaps marked "not fillable by search" or that need private documents
(Brock's tester guide, paywalled papers) get one line in FILLS.md saying so, no search.

## Budget and tools
- WebSearch: Q1 at most 85 calls, Q2 at most 85 (the whole session has 200 per turn, shared by every agent; the
  integrator keeps the rest). Keep a running tally at the top of your PROGRESS.md and stop at your cap. Use mode
  "standard" first; "extended" only when standard comes back thin or for very recent or niche facts. Send independent
  searches together in one turn.
- WebFetch reads a page without spending the search allowance: use it on known URLs and on the best search results.
  Prefer primary sources (maker pages and datasheets, the paper itself, the standard, the textbook) over aggregators; for
  measured mouse weights, RTINGS and TechPowerUp scale figures beat makers' claims.
- If WebSearch says the allowance is used up, stop searching: don't work around it (no curl or wget to search engines, no
  browser, no reader or proxy services). Record what's left undone.

## Output
- /home/claude/work/research/FILLS.md: one entry per answered gap, newest first:
  `### <builder>-<gap number or short name> (<slide ids>)  [Q1|Q2]` then the answer with units and exactly what it is
  (measured or claimed, by whom, test conditions), the source URL(s), a short quote under 15 words only if the wording
  matters, confidence (high / medium / low and why), conflicts between sources, and what stand-in it replaces. If a
  search finds nothing usable, write that too, with the queries tried, so nobody repeats them.
- Then append one line to /home/claude/work/review/<builder>.md (create it if missing):
  `- <HH:MM> RESEARCH: <gap> filled (<one-line answer>), see research/FILLS.md` so the builder sees it in its review loop.
- Don't edit deck files or the builders' PROGRESS.md; the builders apply the facts to their slides and SRC entries.
- Keep /home/claude/work/<q1|q2>/PROGRESS.md current (tally, done, in flight, next), so the work survives an interruption.

## Standards (Brock's)
- Honest numbers only: never round a claim in Theseus's favour, never present a maker's claim as a measurement, and say
  when two sources disagree. A sourced number that hurts the pitch is still the number.
- Units the deck uses: grams ("weight", never "grams" as a label), N, mm, h, khz (lower-case, Brock's spelling), mAh.
- Finish with a short report: how many gaps filled / not fillable / left, searches used, and anything that changes a
  claim already on screen (those first).
