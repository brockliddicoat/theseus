# b04 CHECKPOINT1: b04_camera ("Your sensor is a camera"), paper, settle 11.5 s

Replaces gld_camera, gld_corr, gld_blur. File: deck/src/30-b04-glide.js. Build: `python3 tools/build.py main --out=b04 --own=30-b04-glide.js`.

The whole mouse from the side (frame one), the camera pushes in to the sensor in section, to the 3D board's dimensions
(castellated module, die, LED, snap-on lens over drawn cloth): the LED lights a spot, the 1:1 lens images it onto the chip,
and as the mouse moves the chip's 36 × 36 pictures appear at the right; two pictures in a row are slid over each other
until they line up, and the shift becomes counts (5.0 at 1,600 CPI).
Then the pointer drags the lens 0.4 mm too far and 0.4 mm too close: the picture blurs both ways (a phone beside it does
the same), "detail kept" falls to 53 % / 39 %, and the same move counts −14 % / +20 % (thin lens, counts ∝ 2.4 / Z); both
costs stay on screen after the lens returns to 2.4 mm.

Frames (1920 × 1080, 2D player, Q='&2d=1'), current build (10:40):
- /home/claude/work/b04/shots/cam/38_b04_camera_0.png (frame one: the whole mouse)
- /home/claude/work/b04/shots/cam/38_b04_camera_4.6.png (mid: the two pictures being matched)
- /home/claude/work/b04/shots/cam/38_b04_camera_7.png (lens too far, 2.8 mm) and 38_b04_camera_8.2.png (too close)
- /home/claude/work/b04/shots/cam/34_b04_camera_12.png (settle: verdict "Worst detail kept 65 % → 82 %")
- /home/claude/work/b04/shots/cam/phone_settle.png (the stage at 0.44 ×)

Update 09:50: ends on a rival-against-Theseus verdict (worst detail kept inside PixArt's 0.4 mm vs Theseus's 0.2 mm),
per the integrator's note; the off-focus counts are not struck (FILM F8).
