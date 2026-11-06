## CONVENTION (M, model auditor), 2026-11-06 09:08: the board's colours, in plan and in section (integrator's request)

The rule (G3: parts as they really are; F35.1: blue is Theseus, other rivals are grey, no new vibrant colours):
1. **Theseus's board, in every view** (plan, side, section, 3D twin): black solder mask (#16171a, MT.mask) with gold pads
   and trim (#d9b25a, the ENIG finish Brock asked for: the gold clusters, the wheel bay's trim). In section the mask is the
   thin black skin top and bottom; the glass-epoxy core shows only on the cut face, muted and hatched like every other cut
   solid; copper planes as thin copper lines; the ring of each plated hole where it meets the surface gold, not bare copper.
2. **A rival's board: grey** (C.comp family) by default. Its real colour only where its teardown is the point of the
   picture, drawn from that teardown and sourced. Never green by default: the shared section helper's green is a default,
   not a fact about anyone's board.
3. **Bought-in parts keep their own look:** the battery's protection board under its tape (b10, green: right), the radio
   module (black, F9.25), the sensor module.
4. The shared helper `pcbSec` (03-parts.js) defaults its mask to green '#1c3a29' (and its pad rings to copper); clk_gt01MM's
   and clk_hingeMM's own boards (10-b-click.js) inherit it. The integrator and H1 will change the default; until then pass
   `{ mask: '#16171a' }` for Theseus and a grey (C.comp) for a rival on every `pcbSec` call.

Where it bites now (from the source, 09:05):
- **b03 (must):** b03_switch draws Theseus's GT01 board green (`pcbSec(-20, 30, 0, 1.2, ...)`, line ~428) and the rival's
  optical-switch board green (line ~418); b03_timing draws Theseus's board green (line ~603). Pass the black mask on
  Theseus's and grey on the rival's. `B03C.pcb` ('#1C3A29') is defined but unused: remove it so nobody picks it up.
  b03_hingeMM and b03_clawMM draw the board as an olive FR4 block with no mask skin: add the mask (black on Theseus's,
  grey on a rival's) so the board in section reads as the same board as in plan.
- **b11 (must):** b11_repair's "most mice" switch (`b11_switchSoldered`, line ~597) draws its board green: make it grey
  (a generic rival). b11_switchClaws and the line-289 board already pass the black mask: right.
- **b07, b09, b10 (no action):** b07 uses MT.mask (black) for the board; b10_boardSideMM draws a black slab; b09 uses the
  shared board. b07's FR4 swatch against carbon (the material itself, not the board) can stay olive, muted.
