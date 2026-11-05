# Theseus: independent Astra ultra revamp

## Direct authorization and model boundary

Brock requested: “start a new chat were you give astra ultra the same assignment you started with and tell it to only use astra max, make you add on any extra feedback i’ve given you like the color scheme and live github link that wasn’t from the claude starting point”.

Your lead model is **gpt-6-astra, ultra effort**. Every subagent must be **gpt-6-astra, max effort**. Explicitly set that at creation, using a fresh self-contained fork if required by the collaboration API. Do not use Sol, Luna or Terra workers in this task. This new instruction overrides the original Sol-preferred / all-Sol agent constraint for THIS independent Astra task only. Use as many agents as thorough execution needs without waste, within actual runtime capacity. Raising effort does not expand concurrency. Do not launch extra chats merely to bypass limits.

## The original assignment, preserved

Brock provided https://claude.ai/share/4ce6f186-6380-4611-a871-d79aeee98304 and asked: read the chat and referenced repository, take your own independent hand at the 08:20 full revamp, have the same supplied subagent briefs and notes, use new resources when available without talking to Claude, and work in a mirror worktree so Claude is not confused. Use the presentation skill and your own blind spots/strengths. Account for the latest revamp goals AND every earlier unimplemented feedback clause, and double-check that archived feedback was substantively resolved. This is competing with Opus. Build it, not merely a plan.

Brock then supplied the actual complete F0–F33 rolling feedback and a long session transcript, plus the repository bundle. The share page is not a substitute for those recovered authoritative notes: the external reader only exposed a shell. Never claim to have inspected a newer inaccessible Opus film. All F0–F33 feedback is in the file specified below; it is the authoritative verbatim source, including all 114 ratings and 100 written slide notes. Read it fully. Later DECIDED/OVERRIDDEN items control; old DONE/archive labels are not independent evidence.

The revamp is **new story, fewer denser scenes**, not tiny edits to the old 130-ish scene sequence. No outline approval first: “Just build it”. The story’s spine is **ZERO compromises**. Teach the real problem, visualize what rival designs do wrong mechanically, show the Theseus correction and the strongest player benefit. A missed shot or a higher skill ceiling is useful where justified, but do not force a missed-shot story onto every feature. Wear, feel, comfort, battery life and serviceability can be the stronger problem. Prioritize the important ideas Brock called badly executed (F33.5), rather than removing them. Use researched classroom demonstrations to make engineering intuitive at a glance (F33.8), then connect the actual load/response back into the mouse.

## Exact starting state and isolation

Primary Sol task (READ ONLY):
`C:/Users/brock/Documents/Codex/2026-11-05/https-claude-ai-share-4ce6f186-6380/theseus-codex`

Its original imported Claude base is **7d8f926ebb8fca1653b3d30509ef6f8f60ac093e**, branch from bundle `claude/review-notes-rework`, with main prerequisite **6304ff6f2381af5317d2eeb76679359207e35e4b**. The primary now has uncommitted independent Sol changes; do NOT copy those as your implementation starting point or edit/reset/check out that worktree.

Local source mirror:
`C:/Users/brock/Documents/Codex/2026-11-05/https-claude-ai-share-4ce6f186-6380/source-mirror`

Original bundle:
`C:/Users/brock/.codex/codex-remote-attachments/01a1ac05-145e-7bb0-a097-5778a9c908b7/25A9CD7B-848E-4DB6-A0E1-E96A7688D34E/1-theseus-review-notes-rework.bundle`

Create your OWN independent mirror checkout/worktree in your new task directory from the exact imported base. Choose an Astra-specific branch; never mutate Claude’s branch, Sol’s branch/index, or their working files. You may read/copy context documents and independently verified resource packs. Build your own story, drawings, motion and review flow; do not just recolor Sol’s finished scenes. No raw Sora scan (`refs/scan`) may be committed, pushed, published or redistributed. Do not communicate with Claude or its agents.

## Context parity: read before implementation

From the primary read-only worktree, read:

- **FEEDBACK.md** fully. F0–F33 are the original verbatim record. F34–F35 capture later Codex steering. F34.3’s Sol-only constraint is expressly overridden for this Astra task by the model boundary above.
- `handoff/README.md`, every `handoff/briefs/k-common.md` and K1–K8 brief, `handoff/K1-PROGRESS.md`, `handoff/K2-PROGRESS.md`, `handoff/GT01-PLUNGER.md`, `handoff/INTEGRATOR-NOTES.md`, original `HANDOFF.md`, `PUBLISHING.md`, `deck/DESIGN.md`.
- `3d/pcb/plans/`, `handoff/plan-images/`, original model/datasheet/photo references. F30.25 plan 5 is approved with its listed changes; thicker GT01 walls remain necessary from F30.24.
- `handoff/codex/feedback-audit.json` and `FEEDBACK-AUDIT.md`: original source/context inventory, all ratings and exact clauses, precedence chains, missing-resource list, historical archive defects. Corrected extraction has **283 tracked clauses**: 269 written-note clauses plus 14 no-written-note review records. Two extraction corrections (sealed and shlGrams) preserve the old extraction in auditCorrections; raw notes were never deleted. A mapped response does NOT mean completion.
- `handoff/codex/EVIDENCE.md`, `research/data/codex-verified.json`, `research/codex-resources/RESOURCE-HANDOFF.md` and its self-contained verified code-native resource pack. Exact published X2F CrazyLight SVG paths, numeric mechanics/energy checks, wheel measurement protocol are available. Actual matched retail wheel test-group measurements and personal broken-arm photos are still not available. Do not pretend otherwise.

Some original Claude scratch briefs and personal photos were genuinely not in the bundle. The inventory names them. Reconstruct from verbatim feedback and the supplied equivalents, and state the boundary rather than claiming an exact absent-photo trace. “Same agents” means comparable capabilities/scopes and all supplied briefs/notes, not literal access to Claude’s hidden agent states.

## Every extra direct steer Brock gave after the starting point

1. **Code only.** “everything must be generated with code and elegant motion design, no ai generated images, and you need to have a human tone”. Use procedural canvas/SVG/WebGL/CSS geometry; no image-generation tool. Source photos can inform geometry but the film is drawn in a coherent code-native style. Apply the presentation skill’s design/typography/QA guidance with this explicit existing code-film output overriding generic Spaces/PPTX or bitmap defaults.
2. **Thorough AND fast.** More subagents are authorized. Be thorough without waste, complete useful independent packages in parallel, and do not burn work on unchanged re-tests. The user asked for an extra reference chat and comparison chat in the Sol run; their saved resources are available below. You do not need to duplicate those chats automatically.
3. **Substantive motion is a priority.** “i’ve noticed the animations are lacking the most right now compared to claude”. Do not pass static diagrams with decorative fades/oscillation as elegant motion. Show causal sequences: approach/assembly → load or input → mechanical response → corrected design under the same condition → held readable before/after. Preserve actual part context, coordinate frames, uniform plungers/pads, fixed PCB, continuous arches and correct switch states. Use purposeful pacing, transitions and match cuts. Verify event frames, not only the settled still.
4. **Latest palette wins.** He first asked for mostly black, grey/white, yellow and a little red, saying other vibrant chapter colors felt unprofessional; explanatory animations may use functional colors. He immediately clarified: **“you’re using too much yellow, the primary color is blue for theseus, yellow for comparisons and secondary items.”** Therefore Theseus BLUE, SPARSE YELLOW for comparison/secondary, NEUTRAL black/grey/white stage/type/chapter chrome, RED for faults. Do not restore rainbow chapters. Avoid AI-looking pills-with-dots and decorative gradients; only selective Theseus headline/number gradients per the original notes.
5. **Live GitHub Pages progress.** He wants a live link that visibly updates while work lands, not just a local file. He complained “the live link is not updating”. Use your OWN distinct preview repo/site, e.g. `brockliddicoat/theseus-astra-preview`, not the Sol site. The Sol preview is https://brockliddicoat.github.io/theseus-codex-preview/ and must remain untouched. GitHub CLI is authenticated on this machine and Pages creation/deploy was authorized by the user. Publish a useful early slice, then checked integration batches. Verify actual Pages build and actual served runtime, not only a push or source file. Add a visible build ID and version manifest, cache-busted link/update notification, and never refresh while reviews/text edits are unsaved. GitHub contents can be LF while local bytes CRLF; do not mistake line-ending hashes for staleness.
6. **Actual phone controls.** Standalone HTML must include real device viewport metadata; otherwise mobile uses 980 CSS px and tiny controls despite viewport-only tests. Ensure later player CSS overrides load after original base CSS. Test isMobile+hasTouch and real taps at iPhone-like portrait/landscape dimensions, not only desktop context resize. Rating/feedback/source drawers must leave their close controls and navigation reachable, and text editing must remain usable.
7. **Review integrity.** Keep exact original notes beside per-clause implementation responses, explicit pending reasons and a way to reopen. Metadata/wording changes must not automatically archive feedback. Shared clauses answered in another scene need a global lookup and an “addressed in” link, not false “still open” noise; genuine partial/pending status and reopened state must not be shown as closed. Reviews may be browser-local, but clearly label that and provide export/import instead of claiming cloud sync.
8. **Plain human words and honest evidence.** “battery”, not “cell”; “khz” lowercase; no “pts”/“points”; PIAKNOW’S as a name/caps per context; one consistent decimal precision per comparison. Sell the product confidently without invented measured aim gains or rival measurements. Targets, measured product data, manufacturer claims, owner experiences, calculations and model illustrations are different evidence classes. 70µs is electrical, not a whole physical press-to-PC result. 6% is approved ideal-travel wording with its assumptions, not a measured click advantage. PAW3970 access/spec identity remains conditional/suspected; Hall is not zero-current. “Almost half” comes from Razer staff online via Brock, not a recovered public quote. Exact 18% draw removal yields21.95% runtime; inherited17.65% optical-switch scenario yields21.43%, not a measured product promise.
9. **No broad confirmation loop.** He chose “Just build it” and gets frustrated by repeated approval. Continue autonomously within the authorized deck/isolated publication scope. Ask only genuinely necessary missing facts using the question tool. Bottom cover, seam, final grip approval, physical rethread/first-fit simulations and unknown real tensioner size retain their explicit decided/deferred boundaries.

## Existing independent chats/resources (read only, no automatic outreach)

Reference pack completed by separate Sol MAX reference lab:
`C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/`
It is also copied into primary `research/codex-resources/`. Read RESOURCE-HANDOFF.md, not just the manifest. You may use these resources as allowed by the original instruction.

Comparison report/patch history:
`C:/Users/brock/Documents/Codex/2026-11-05/theseus-comparison-review/outputs/COMPARISON.md`
`LATEST-BATCH.md`, `PATCHES.json`, `VERSIONS.json` distinguish actual inspected builds from stale ones. Newest Opus embedded artifact was inaccessible; only the supplied pre-revamp baseline is an honest comparison. Suggested patches against Sol source are not a starting implementation or patches for your independent code.

## Delivery and quality bar

Deliver the actual independently built code film, editable source in your mirror, a current GitHub Pages link and a rigorous feedback ledger. Preserve important content while making the film substantially shorter/denser, readable at a glance, with room for the models. Include source links where persuasive/necessary, not tags on Brock’s own design choices. No unspecified dates/guarantees. Run appropriate JavaScript/build checks; deterministic first/mid/settled AND event-stage captures; meaningful causality/numeric checks; inspect actual rendered screenshots; test phone player rating/note attribution/edit/export/import/seek/replay/reopen/update behavior. Publish the exact tested artifact, not a later rebuild of actively changing sources. Record source/artifact identity and report actual remaining evidence/design boundaries. Continue until this is real and reviewable, not only a plan or an empty site.

