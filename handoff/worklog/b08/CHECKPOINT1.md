# B08 checkpoint 1: `b08_grip` (Directional grip), my most important slide (F33.5: `grip` is one of his important ideas)

> Update 08:58 (after review R-b08-1..5): the slide now uses Zhang's 0.2 and 0.4 N rows at a 0.3 N press (grips 0.15 N
> across, 0.13 N along; pull 0.14 N; diagonal dropped); the verdict is "Extra grip where you pull, over where you adjust",
> grip tape 0 % → etched ridges 14 %; pulls are force arrows; a held pull carries the mouse (the surface moves), a slide
> crosses a still surface with a trail. New frames: /home/claude/work/b08/shots/grip8/. The frames listed below are the
> 08:23 version.


Frames (2D, night): /home/claude/work/b08/shots/cp1/87_b08_grip_0.6.png, _2.7.png, _4.2.png (40 % of settle),
_5.75.png, _10.5.png (settle). Build: dist/main-b08.html. errs ok; qa clean at settle and mid.

What it does: it starts on the simplified mouse (top view) with the index fingertip on grip tape on the left button, pushes
in once to the fingertip (locator in the corner), then applies the same 0.47 N pull, through a spring the pointer drags,
back, sideways and diagonally: tape holds every way, so the sideways and diagonal pulls drag; a wipe turns the tape into
laser-etched ridges in place, and the same three pulls show 0.53 N holding the pull back and 0.42 / 0.41 N letting the
fingertip slide. A table builds beside it (tape: Holds, Drags, Drags; ridges: Holds, Slides, Slides), the verdict lands
0.42 → 0.53 N (+26 % grip where you pull), and the settled frame shows every grip as an arrow against the pull drawn as a
ring.

Notes for the integrator:
- Zhang 2017's full text (Table 2) confirms across 0.53 / along 0.42 / 45° 0.41 at 1 N for its grooves (20 µm wide, 10 µm
  deep), but Zhang 2015 (tool steel, a coarser groove) found the opposite direction: the claim is made for that geometry
  only, and the source note says so.
- Kit: verdict's morph shows a doubled unit ("NN") for ~0.3 s as the old copy starts to peel (both units drawn at slightly
  different sizes over each other). Cosmetic, transient; not worked around here.
- I use `establish`, `finger`, `wipeTo`, `verdict`, `scaleNote` from the kit; my own `b08_print`, `b08_spring`,
  `b08_genTape` (the tape's triangle texture) and the old chapter's macro engine (`srf_field`, `srf_macro`, `srf_genFilm`).
