# F0b checkpoint 1: the film's flow, and clips (2026-11-06)

Not a slide: the player. Build: `python3 tools/build.py main --out=f0b --own=20-app.js,08-v2d.js,00-head.html` →
deck/dist/main-f0b.html. Files: deck/src/20-app.js, 08-v2d.js, 00-head.html (bar CSS/markup + one page-margin line),
deck/tools/build.py (r3d param), deck/tools/clip.js (new).

**What it does, in two lines.** The stage never moves between slides: the same ground dissolves its content (0.55 s), a
change of ground (paper ↔ night, most changes in this film) is a soft slanted wipe left to right so the header shows first
(0.7 s), and a new chapter recedes into black and comes up on the card (1.1 s, the card's clock held until it emerges);
autoplay plays each slide to settle, holds 1.2 to 4 s by the text on screen, and moves on (a panel or a note holds it).
`?clip=<id>` plays one slide once with a THESEUS mark and no bar/tick/counter (`&vertical=1` for 9:16), and
`node tools/clip.js <html> <id> <out.mp4> [--vertical]` renders it deterministically to H.264.

Frames (judged):
- /home/claude/work/f0b/shots/tr2_wipe.png — wipe, night → paper (cover → thesis), 9 moments
- /home/claude/work/f0b/shots/tr2_dis.png — dissolve on the same ground (shlThin → shbArches)
- /home/claude/work/f0b/shots/tr7_kitcard.png — chapter move into the kit's chapterCard2 (dev/kit.html)
- /home/claude/work/f0b/shots/tr5_back.png — stepping back: the wipe mirrored
- /home/claude/work/f0b/clips/wg_sheet.png — frames pulled back out of an exported MP4 (weightgap, 11.5 s, 22 s to make)
- /home/claude/work/f0b/clips/cv_sheet.png — the vertical clip (cutouts), 3 frames
- /home/claude/work/f0b/shots/panels_phone.png — rate (with replaces/F27R notes) and edit panels, iPhone 16 Pro Max, mocked host

For the integrator (details in the final report):
1. `header()` draws nothing at t = 0 (label fades 0.05-0.4 s, title rises 0.12-0.92 s), so a horizontal clip's first frame
   is the bare grid. M6 / G9 want the header on frame one; with the transitions doing the entrance in the film, the title
   could simply be set at t = 0 (04-ui.js, or a kit option). The vertical clip already sets the title large from frame one.
2. 00-head.html: the 2D / 3D pill removed from the bar (markup + CSS), and `html, body { margin: 0 }`: the browser's 8 px
   margin pushed every capture 8 px down (each screenshot lost its bottom 8 px) and made the phone bar 16 px narrower than
   the stage. Builders' screenshots shift up 8 px once this lands.
3. build.py: `build(..., r3d=True)`; main passes `r3d='--with3d' in args`; r3d_tag sets window.R3D_DEV. F0a's kit target
   already uses r3d=False.
