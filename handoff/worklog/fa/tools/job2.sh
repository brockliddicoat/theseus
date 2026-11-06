#!/usr/bin/env bash
# job 2 renders: one snap.sh call at a time (shared machine)
set -u
S=/home/claude/theseus/feedback/snap.sh
WA=/home/claude/work/fa/wt/5de14a9/deck/dist/main.html
WB=/home/claude/work/fa/wt/7fb9826/deck/dist/main.html
PUB=/home/claude/work/int/film/main-pub.html
ALL=/home/claude/work/int/film/main-all.html
CDX=/home/claude/work/fa/codex/index.html
BA='a worktree build of commit 5de14a9 (07:22), the last commit before the 07:45 publish; the builders, launched 07:35, may have had first files in the live build'
BB='a worktree build of commit 7fb9826 (08:27), two minutes before the publish: it has the published film'"'"'s 126 slides and matches Brock'"'"'s 09:31 screenshot of b02_cutouts exactly (the integrator'"'"'s saved 08:36 build, main-0836.html, has 123 slides: 7 minutes of builder work later)'
LA='v1793972706-6cdc (published 07:45)'
LB='v1793975367-421d (published 08:29, live until 09:52)'
LP='v1793980369-8a53 (published 09:52, live until 10:05)'
LL='v1793981126-8865 (published 10:05)'
run() { echo "=== $(date +%H:%M:%S) $*"; nice -n 10 "$S" "$@" || echo "FAILED $*"; }
WHEN='2026-11-06 08:18' LIVE="$LA" COMMIT='5de14a9' BUILD="$BA" NOTE='F39.3: the paper ground he called yellowish (#F7F6F2; now #F5F5F7).' run F39 "$WA" cover:settle budget:settle
WHEN='2026-11-06 ~08:30' LIVE="$LB" COMMIT='7fb9826' BUILD="$BB" NOTE='F40.4: the radio slide as it was when he chose to keep the antenna facing forward.' run F40 "$WB" b09_radio:settle
WHEN='2026-11-06 ~08:58' LIVE="$LB" COMMIT='7fb9826' BUILD="$BB" NOTE='F41.1: the live shell slides that judged every break at 120 MPa (b06_light: the max load before the peak reaches 120 MPa; b05_nopick).' run F41 "$WB" b05_nopick:settle b06_light:settle
WHEN='2026-11-06 ~09:40' LIVE="$LB" COMMIT='7fb9826' BUILD="$BB" NOTE='F42: the budget with the board at 5.6 g, and the battery where the film had it when he answered.' run F42 "$WB" budget:settle mass:settle
WHEN='2026-11-06 09:31' LIVE="$LB" COMMIT='7fb9826' BUILD="$BB" NOTE='F43.1-F43.2: b02_cutouts, the slide he marked up (the wheel opening and slot, the rear cutout corners); F43.3: b01_lighter, the simplified mouse side profile with the hump at the rear; F43.5: b11_repair, the simplified mouse in side and bottom views.' run F43 "$WB" b02_cutouts:first,mid,settle b01_lighter:settle b11_repair:settle
WHEN='2026-11-06 ~10:05' LIVE="$LP" COMMIT='nearest: c1a3913 (09:39) and c4a530d (10:05); the published build itself' BUILD='the integrator'"'"'s saved copy of the 09:52 publish' NOTE='F44: b03_side (the side rail he was asked about in words), b01_budget (the side switches missing from 29.31 g), b02_pom (the pads), b08_wheel (the wheel comparison).' run F44 "$PUB" b03_side:mid,settle b01_budget:settle b02_pom:settle b08_wheel:settle
WHEN='2026-11-06 09:50' LIVE='Codex'"'"'s preview (branch codex/theseus-revamp-2026-11-05, last commit 5504fdb, 2026-11-05 10:38)' COMMIT='5504fdb (origin/codex/theseus-revamp-2026-11-05), deck/dist/index.html as committed' BUILD='Codex'"'"'s own built page, not ours' NOTE='F45.1: Codex'"'"'s ruler demonstration, rv_thin_wall, at the moments its own capture tool used (flat, the turn, on edge, the end).' run F45 "$CDX" rv_thin_wall:2.8,6,10.8,18
WHEN='2026-11-06 ~10:30' LIVE="$LL" COMMIT='c4a530d' BUILD='the integrator'"'"'s saved copy of the 10:05 publish' NOTE='F46.1-F46.2: the wheel opening and the rear cutout corners as the film showed them when he chose O1 and K3 on S1'"'"'s sheets (attachments/F46/).' run F46 "$ALL" b02_cutouts:settle
WHEN='2026-11-06 ~10:40' LIVE="$LL" COMMIT='c4a530d' BUILD='the integrator'"'"'s saved copy of the 10:05 publish' NOTE='F47.3-F47.5: b07_board (the board as the shell'"'"'s tie, the rib feet), b10_board (the board at 5.6 g), b08_wheel (the wheel comparison).' run F47 "$ALL" b07_board:settle b10_board:settle b08_wheel:settle
WHEN='2026-11-06 ~10:50' LIVE="$LL" COMMIT='c4a530d' BUILD='the integrator'"'"'s saved copy of the 10:05 publish' NOTE='F48: b03_side (the rail before the tied posts) and b09_radio (the antenna before plan 5 was accepted), as live; the pictures he answered on are in attachments/F48/.' run F48 "$ALL" b03_side:settle b09_radio:settle
WHEN='2026-11-06 10:06' LIVE='v1793981126-8865 (published 10:05, a minute before he wrote; v1793980369-8a53 had been live since 09:52)' COMMIT='c4a530d' BUILD='the integrator'"'"'s saved copy of the 10:05 publish' NOTE='F49.1: fingers (b02_front, b02_rails, b06_arch, b08_grip; b02_cutouts'"'"' finger is in F46); F49.2: the trigger cutouts in side view (b01_lighter, b07_balance).' run F49 "$ALL" b02_front:settle b02_rails:settle b06_arch:settle b08_grip:settle b01_lighter:settle b07_balance:settle
echo "=== done $(date +%H:%M:%S)"
