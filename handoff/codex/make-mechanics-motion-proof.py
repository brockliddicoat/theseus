"""Compose exact event frames and check visible explanatory state, not hardware performance."""
from pathlib import Path
import json
import hashlib
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat, ImageFilter

root = Path(__file__).resolve().parents[2]
out = root / 'deck/qa/mechanics-motion-events'
report = json.loads((out / 'report.json').read_text(encoding='utf-8'))
events = report['events']
by_scene = {}
for event in events:
    by_scene.setdefault(event['id'], []).append(event)
font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 17)
tile_w, tile_h, label_h = 480, 270, 48
groups = [list(by_scene)[n:n+3] for n in range(0, 12, 3)]
for gi, scenes in enumerate(groups, 1):
    sheet = Image.new('RGB', (tile_w*4, (tile_h+label_h)*3), '#222222')
    draw = ImageDraw.Draw(sheet)
    for row, sid in enumerate(scenes):
        for col, event in enumerate(by_scene[sid][:4]):
            x, y = col*tile_w, row*(tile_h+label_h)
            draw.text((x+8, y+2), sid.replace('rv_', '')+'  t='+str(event['t']), fill='white', font=font)
            draw.text((x+8, y+24), event['event'], fill='#aaaaaa', font=font)
            frame = Image.open(event['image']).convert('RGB').resize((tile_w, tile_h), Image.Resampling.LANCZOS)
            sheet.paste(frame, (x, y+label_h))
    sheet.save(out / ('temporal-sheet-'+str(gi)+'.png'))

def event(sid, name):
    return next(e for e in events if e['id'] == sid and e['event'] == name)

def words(sid, name):
    return '\n'.join(event(sid, name)['text'])

assert '1  REST: NC CLOSED' in words('rv_spdt', 'nc-closed')
assert '2  NC OPENS: COUNT THE CLICK' in words('rv_spdt', 'actual-leaf-transit')
assert '3  NO LANDS LATER' in words('rv_spdt', 'no-landed')
assert '+1,000' in words('rv_sensor_choice', 'counts-fit')
burst = words('rv_sensor_choice', 'burst-clipped-v-preserved')
assert '+3,200' in burst and '+2,047' in burst and '1,153 counts lost' in burst

def frame(name):
    return Image.open(event('rv_sensor_camera', name)['image']).convert('RGB')

sharpness = {}
for name in ['height-high-blur', 'focus-restored', 'height-low-blur', 'calibrated-settle']:
    crop = frame(name).crop((1050, 492, 1330, 562)).convert('L')
    # Derivative only: this checks the explanatory graphic's blur, never a sensor metric.
    sharpness[name] = ImageStat.Stat(crop.filter(ImageFilter.FIND_EDGES)).mean[0]
assert sharpness['focus-restored'] > sharpness['height-high-blur']
assert sharpness['calibrated-settle'] > sharpness['height-low-blur']

im = frame('matched-detail-displaced')
patch_a = im.crop((1080, 500, 1280, 560))
errors = {}
for shift in range(-60, 61):
    patch_b = im.crop((1485+shift, 500, 1685+shift, 560))
    errors[shift] = sum(ImageStat.Stat(ImageChops.difference(patch_a, patch_b)).mean)/3
best_shift = min(errors, key=errors.get)
assert best_shift == -40 and errors[best_shift] < 0.01, (best_shift, errors[best_shift])
proof = {
    'htmlSha256': report['htmlSha256'],
    'eventFrames': len(events),
    'browserErrors': report['errors'],
    'visibleStateAssertions': 'NC closed -> opening counted during physical leaf transit -> NO lands; 1000 fits -> 3200 raw becomes 2047 in 12-bit with 1153 lost, remains 3200 in 16-bit',
    'cameraPatternBestFrameBShiftPx': best_shift,
    'cameraPatternMeanAbsolutePixelDifference': errors[best_shift],
    'explanatoryGraphicSharpnessOnly': sharpness,
    'boundary': 'All checks are of the deterministic drawn explanation, not measured mouse performance, physical deformation, latency, or a rival fault.'
}
automated = json.loads((root / 'deck/qa/mechanics-motion/report.json').read_text(encoding='utf-8'))
assert automated['htmlSha256'] == report['htmlSha256']
assert automated['issueFrames'] == 0 and not automated['errors']
proof['automatedTemporalSamples'] = sum(len(s['frames']) for s in automated['slides'])
proof['automatedIssueFrames'] = automated['issueFrames']
proof['sharedFilmSlideCountAtBuild'] = automated['slideCount']
proof['sourceFiles'] = {}
tested_html = (out / 'tested-index.html').read_text(encoding='utf-8')
for name in ['deck/revamp/20-clicks.js', 'deck/revamp/30-glide.js', 'deck/revamp/coverage-mechanics.json']:
    source = (root / name).read_bytes()
    proof['sourceFiles'][name] = hashlib.sha256(source).hexdigest()
    if name.endswith('.js'):
        assert (root / name).read_text(encoding='utf-8-sig') in tested_html, name + ' differs from tested HTML'
(out / 'proof.json').write_text(json.dumps(proof, indent=2), encoding='utf-8')
print(json.dumps(proof, indent=2))
