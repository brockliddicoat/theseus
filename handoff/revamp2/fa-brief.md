# FA: the feedback archivist (FEEDBACK.md for the next, smarter model)

Brock, 2026-11-06 11:00 (FEEDBACK F50.1, STANDING): "make sure pretty much every message i send is logged in feedback.md, with
references of what each slide looked like when i sent the feedback, this way when smarter models come out they will have as
much context as possible to make the presentation even better by looking at all of my feedback, make sure to mark when old
feedback is outdated and has been overruled by new feedback".

You make FEEDBACK.md (repo /home/claude/theseus/FEEDBACK.md) that record. Read it end to end first (its header explains the
entry format and statuses), then /home/claude/work/feedback-inbox.md (every message he sent today, verbatim, with the builds
that were live). Work folder /home/claude/work/fa/ (PROGRESS.md).

## Jobs
1. **Every message, verbatim.** Check each inbox message against FEEDBACK.md. Add what's missing as dated entries in the
   file's format (quotes verbatim, typos kept; the integrator's reading after it, clearly marked as the reading). Don't
   rewrite his words in existing entries.
2. **What the slides looked like.** For each entry from today (F38 to F50 and any you add) that is about slides, render the
   slides it refers to from the build that was live when he wrote (the saved builds in /home/claude/work/int/film/, or check
   out the commit in a git worktree and build it: `python3 deck/tools/build.py main`), at the frames that show what he saw
   (frame one, mid, settle; the specific moment if he names one), with deck/tools/shoot.js (`Q='&2d=1' PAR=1`, one browser,
   the machine has 2 CPUs shared by ~10 agents). Save them as JPG (1280 px wide, quality ~82) in
   /home/claude/theseus/feedback/frames/<entry>/ with a README.md listing: the entry, the time, the live artifact version,
   the build file and git commit, each slide id and time. Copy his own screenshots and the option sheets he answered on into
   /home/claude/theseus/feedback/attachments/<entry>/ (his marked-up screenshot is refs/photos/brock-2026-11-06b/, which git
   ignores; the sheets are in the agents' work folders listed in the inbox). Link the folder from the entry
   ("Frames: feedback/frames/F43/"). Keep the repo lean: only the frames an entry needs.
3. **Older entries, where it's worth it.** F27 (his slide-by-slide ratings and notes on the old deck) is the richest: render
   each rated slide from the commit that was live when he rated it (find it in git log around the F27 date; a worktree, a
   build, one settle frame each) into feedback/frames/F27/. Do the same for other dated entries that name slides, as far as
   time allows, newest first.
4. **Mark what's overruled.** Scan the whole file for items a later message overrules, and mark each at the old item:
   **OVERRULED by Fxx** (he reversed it), **SUPERSEDED by Fxx** (replaced by a newer, more specific decision), **DEFERRED by
   Fxx**, with one line on what now holds. Known ones to start: F43.3 (centre hump) DEFERRED by F46.3 / F47.1; F46.4 clarified
   by F47.1 (39.9 is only the stated number); F42.1's "about 5.9 mm forward and 1.5 mm up" SUPERSEDED by the corrected balance
   model (the aim, the balance at the centre, holds: the battery sits 2.03 mm behind H1's place, no rise; H2's report in
   /home/claude/work/h2/PROGRESS.md); F44.1's ×1.2 / ×1.85 SUPERSEDED by the measured POM friction (b03_rail, F48.1);
   b05_fallacy's ULX example (his shlPick note) SUPERSEDED by the research (BROADCAST-0945); the battery claims +20 % / +30 %
   SUPERSEDED by +15 % / +23 % (BROADCAST-0945); F12.11's "use the numbers only" confirmed by F47.1. Find the rest yourself.
5. **The procedure for every new message** (so it stays true after today): a short section at the top of FEEDBACK.md ("How to
   log a message") and a script /home/claude/theseus/feedback/snap.sh <entry> <html> <slide:t>... that renders the frames
   and writes the README in one step. The integrator will append new messages to the inbox file and message you; log each
   within a few minutes of it landing.

## Rules
- Edit only FEEDBACK.md and the feedback/ folder (and your work folder). Don't touch deck files. Don't commit, push or publish
  (the integrator commits). Keep each FEEDBACK.md edit an exact-string edit: other agents and the integrator also append to
  the file; re-read before each edit.
- Report when jobs 1, 2 and 4 are done (a few lines: what you added, what you marked), then keep going on job 3 and on new
  messages until the integrator says stop or your context is getting full (then write a resume note in PROGRESS.md).
