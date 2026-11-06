# Q3: research, round three (wheels, POM friction, and what's still open)

Q1 and Q2 filled most gaps this morning (/home/claude/work/research/FILLS.md; their reports are in
/home/claude/work/q1/PROGRESS.md and /home/claude/work/q2/PROGRESS.md: read what they tried, so you don't repeat it). Brock
asked for more (FEEDBACK F44.4: "research more"). Work folder /home/claude/work/q3/ (PROGRESS.md with a running search tally).

## Budget
At most 30 WebSearch calls (the session's allowance is shared by every agent); mode "standard" first, "extended" only when
standard comes back thin. WebFetch doesn't count: use it on the best results. If WebSearch says the allowance is used up,
stop and record what's left; never work around it.

## In priority order
1. **Stock scroll-wheel weights** (b08_wheel's test group; Brock wants at least four stock wheels with sources, the wheel
   alone, no axle): Q1 found only the Endgame Gear OP1 (1.8 g) and the Zeromouse kit's original (1.5 g), both sellers'
   figures. Look for reviews or teardowns that weigh the wheel (TechPowerUp, Igor's Lab, RTINGS, YouTube descriptions,
   r/MouseReview posts with a scale photo), aftermarket wheel makers that state the stock wheel they replace (e.g. magnesium
   or aluminium wheel kits for the G Pro X Superlight, Viper V2/V3 Pro, Pulsar X2, Lamzu, Zowie), and modding guides. Record
   each with the exact wheel, whether it includes the axle or tyre, who weighed it and how.
2. **POM-on-POM friction**, dry and greased (b03_side's rail: the click force at the button's tip depends on it): static and
   kinetic μ from a POM maker's design guide (DuPont Delrin, Celanese Hostaform, Ensinger) or a tribology paper, and what a
   PTFE-filled POM or a silicone grease does to it.
3. Leftovers, if searches remain: the rivals' default lift-off distance in mm (b10_software: Viper V3/V4 Pro, G Pro X
   Superlight 2, Pulsar X2); any measured stock cable diameter for a flagship mouse (b10_cable; Q1 found none).

## Output
- /home/claude/work/research/FILLS.md: one entry per finding, newest first, as Q1 and Q2 wrote them (`### <slide>-<topic>
  [Q3]`, the answer with units and exactly what it is, source URLs, confidence, conflicts, what it replaces); a "searched,
  nothing usable" entry with the queries when a search fails.
- One line per finding in the owner's review file (/home/claude/work/review/b08.md, b03.md, b10.md):
  `- <HH:MM> RESEARCH: ... see research/FILLS.md`. b03, b08 and b10's builders have finished; a polish agent reads these files.
- Don't edit deck files. Don't commit, push or publish. Finish with a short report (found / not found / searches used).
