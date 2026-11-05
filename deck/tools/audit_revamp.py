"""Check clause traceability against an immutable rendered film manifest.

This is an accountability check, not evidence of measured product performance.
Run after build_revamp.py and check-film.cjs on the exact candidate to publish.
"""
from pathlib import Path
from collections import defaultdict
import argparse
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('--report', default='deck/qa/final-film/report.json')
args = parser.parse_args()
audit = json.loads((ROOT / 'handoff/codex/feedback-audit.json').read_text(encoding='utf-8'))
coverage = json.loads((ROOT / 'deck/revamp/coverage.json').read_text(encoding='utf-8'))
render = json.loads((ROOT / args.report).read_text(encoding='utf-8'))
scenes = {s['id']: s for s in render.get('manifest', render['slides'])}
expected = {c['id']: (r, c) for r in audit['ratings'] for c in r['clauses']}
responses = defaultdict(list)
issues = []
for sid, record in coverage['slides'].items():
    if sid not in scenes:
        issues.append(f'Coverage references a non-rendered scene: {sid}')
    for c in record.get('clauses', []):
        responses[c['id']].append({'scene': sid, **c})
        if not c.get('answer') or not c.get('verification'):
            issues.append(f'Missing answer/verification: {sid} / {c["id"]}')
for old_id, record in coverage.get('removed', {}).items():
    for c in record.get('clauses', []):
        responses[c['id']].append({'scene': 'removed:' + old_id, **c})
        if not c.get('answer') or not c.get('verification'):
            issues.append(f'Missing removed-concept disposition: {c["id"]}')
for cid in expected:
    if cid not in responses:
        issues.append('Unmapped original clause: ' + cid)
for sid in scenes:
    if sid not in coverage['slides']:
        issues.append('New scene has no coverage record: ' + sid)
    for old_id in scenes[sid].get('from', []):
        original = next((r for r in audit['ratings'] if r['legacyId'] == old_id), None)
        if original:
            for clause in original['clauses']:
                if clause['id'] not in responses:
                    issues.append('Imported original note lacks global response: ' + clause['id'])
tested = Path(render['testedHtml'])
if not tested.is_absolute():
    tested = ROOT / tested
actual_hash = hashlib.sha256(tested.read_bytes()).hexdigest()
if actual_hash != render['htmlSha256']:
    issues.append('Immutable tested HTML changed after rendering')
if render.get('issueFrames') or render.get('errors'):
    issues.append('The referenced final render report has unresolved failures')

pending = {sid: r['pending'] for sid, r in coverage['slides'].items() if r.get('pending')}
result = {
    'scope': 'Feedback traceability and immutable render identity; not physical or user acceptance',
    'renderReport': args.report, 'testedHtmlSha256': actual_hash,
    'scenes': len(scenes), 'scenesRenderedInThisPass': render['selected'], 'originalRatings': len(audit['ratings']),
    'verbatimWrittenNotes': sum(bool(r.get('note')) for r in audit['ratings']),
    'originalClauses': len(expected), 'mappedOriginalClauses': len(set(expected) & responses.keys()),
    'additionalStandingClauseResponses': len(set(responses) - expected.keys()),
    'removedOrDeferredSourceScenes': len(coverage.get('removed', {})),
    'pending': pending, 'issues': issues,
    'sourceHashes': {str(p.relative_to(ROOT)).replace('\\', '/'): hashlib.sha256(p.read_bytes()).hexdigest()
                     for p in sorted((ROOT / 'deck/revamp').glob('*')) if p.is_file()}
}
out = ROOT / 'handoff/codex'
(out / 'feedback-coverage-report.json').write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')
lines = ['# Feedback coverage ledger', '',
         f'{len(scenes)} new scenes; {len(expected)} original clauses from 114 ratings and 100 verbatim notes.', '',
         '**A mapped response is not acceptance.** Explicit pending items remain open in the player and below. '
         'Removed concepts are dispositions, not completed hardware features. The original source notes are never deleted.', '',
         f'Exact render HTML SHA-256: `{actual_hash}`.', '',
         '| original scene | score | clauses | implementation response or disposition |',
         '| --- | ---: | ---: | --- |']
for r in audit['ratings']:
    owners = sorted({m['scene'] for c in r['clauses'] for m in responses.get(c['id'], [])})
    lines.append(f'| `{r["legacyId"]}` | {r["score"]}/10 | {len(r["clauses"])} | ' + ', '.join(f'`{x}`' for x in owners) + ' |')
lines += ['', '## Explicitly open boundaries', '']
for sid, entries in pending.items():
    lines += [f'### {sid}', '']
    for e in entries:
        lines.append('- ' + (e if isinstance(e, str) else e.get('id', '') + ': ' + e.get('reason', e.get('text', ''))))
    lines.append('')
lines += ['## Verification boundary', '',
          'The rendered artifact, source hashes, and per-owner causal-event reports are separate evidence. '
          'No amount of slide QA establishes production tolerances, prototype weight, aim performance, battery life, '
          'waterproofing, strength, electrical routing acceptance, or final user approval.', '',
          '## Traceability issues', '']
lines += ['- ' + x for x in issues] if issues else ['None in this checked manifest.']
(out / 'FEEDBACK-COVERAGE.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(json.dumps({k: result[k] for k in ['scenes', 'originalClauses', 'mappedOriginalClauses', 'issues']}))
raise SystemExit(bool(issues))
