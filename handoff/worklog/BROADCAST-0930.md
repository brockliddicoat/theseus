# Broadcast 09:30: shared drawings, one ledger, and film-wide decisions

## Shared code that changed (all in deck/.snapshot/src; re-shoot what uses it)
- H1: `pcbSec` (03-parts.js): every board section is now Theseus's black mask with gold surface rings and a muted,
  hatched FR4 cut face. Pass `rival: true` for a rival's board (grey, C.comp); `mask` / `ring` override. Affects b03_switch,
  b03_timing, b03_hingeMM / b03_clawMM and any section you draw.
- H1: `clk_gt01MM` (10-b-click.js): housing walls 0.70 mm (were 0.45), smaller round holes, the slot 1.07 mm lower and
  wider (Gateron's render). Affects every slide that draws the GT01 (b02, b03).
- H1: `encoderMM`: the frame's J-hook legs are now SMD side feet. `boardMM` draws the real plan-5 board from
  geo2d/board2d.json (options: side top|bottom, variant A|B, hi, dim, xray; the old corner with `generic: true`).
- H1: geo2d twins regenerated (shell lens at z 16.57 and 2.40 up, pcb = plan 5 A, gt01, wheel, skates).
- Integrator: the paper's + row at y 960 no longer prints through source lines and foot-band scale notes (FILM F10).
- Integrator (FILM F1, one ledger): LEDGER's compromises reworded (Weight "Light or long-lasting: pick one"; Clicks "A click
  that changes with where you press, or costs battery"; Shape "Shapes cut down for weight, or chosen by taste"), and every
  chapter card now prints its flagship under the compromise, read live from b01's B01_TRADES (`ledgerFlag`): Weight: Pro X3
  Superstrike and HTS Ultra 8K; Clicks: Viper V4 Pro; Shell: UltralightX; Shape: X2F CrazyLight; Electronics: XA25. Card
  builders: re-shoot your card (the answer moves down 34 px when there's a flagship line; `flag: false` hides it).

## Film-wide decisions (follow them)
- Verdict grammar (FILM F8/F15): the struck grey value is always the rival's (or most mice's, or an old design's) and the
  blue one Theseus's. Never strike Theseus's own alternative; show internal contrasts as plain stats.
- One way to sell "the same click wherever you press" (FILM F3): every Clicks slide that claims uniformity uses one verdict
  form, "Click force spread across the button (lower is better)", in gf (click weights are gf everywhere; N in small print
  only where a physics step needs it).
- One test strip for the shell chapters (FILM F4): b05 and b06 use b06's strip (62.5 mm, the mouse's width, "a strip across
  the top") and one human press (10 N, a 1 kg bag of sugar) unless a slide's point needs another specimen, and then it
  says why. With F41's strength rule (120 MPa stretched, 207 MPa bent) the numbers then chain from slide to slide.
- Battery claims (FILM F18/F19): the film's own derived numbers are the claims: +20 % from the mechanical switches, +30 %
  with the magnetic wheel (b03, b10). Razer staff's "almost half" is quoted only as their remark, attributed, never turned
  into "up to 2×". Say once (b01_battery's foot line) that the 200 h is computed at the Viper V4 Pro's whole draw, optical
  switches and wheel included, so the switches and wheel save more on top. The Viper V4 Pro at 8 khz is Razer's 45 h
  (claim, like-for-like with Theseus's derivation); TechPowerUp's ~40 h measured may appear only as corroboration.
- The UltralightX (FILM F17): villain on slide 2 and proof on b05_fallacy becomes a callback: b01 says RTINGS's unit
  "flexes and creaks"; b05_fallacy says how Finalmouse later fixed it (material moved into the sides, not added weight),
  which is the fallacy slide's own thesis.
- "Most mice" (FILM F20): only with a source or a count ("of the 12 flagships checked"); otherwise name the mice.

## Who reads what
- Critic findings keep landing in /home/claude/work/review/<you>.md (a new critic, R2, continues R's ledger).
- Research answers: /home/claude/work/research/FILLS.md, plus a RESEARCH line in your review file.
