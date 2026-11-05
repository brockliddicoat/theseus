"""Reproduce this lane's exact F27 clause map; no user-acceptance inference."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
audit = json.loads((root/'handoff/codex/feedback-audit.json').read_text(encoding='utf-8-sig'))
slides = {s: {'clauses': [], 'pending': []} for s in [
 'rv_direct_drive','rv_rear_cutouts','rv_front_contact','rv_shoulder_seams','rv_tensioner',
 'rv_dual_rail','rv_spdt','rv_hotswap','rv_sidebuttons','rv_sensor_camera','rv_sensor_support','rv_sensor_choice']}
groups = {
 'clicks': 'rv_direct_drive', 'arc':'rv_direct_drive', 'clk_wedge':'rv_direct_drive',
 'cutouts':'rv_rear_cutouts','tensioner':'rv_tensioner','clk_tenmat':'rv_tensioner',
 'anchors':'rv_dual_rail','clk_pomtune':'rv_dual_rail','clk_front':'rv_front_contact',
 'clk_hotswap':'rv_hotswap','clk_spdt':'rv_spdt','latency':'rv_spdt','clk_debounce':'rv_spdt',
 'clk_wait':'rv_spdt','clk_methods':'rv_spdt','sidebuttons':'rv_sidebuttons',
 'glide':'rv_sensor_camera','gld_under':'rv_sensor_support','dots':'rv_sensor_support',
 'gld_camera':'rv_sensor_camera','gld_corr':'rv_sensor_camera','gld_blur':'rv_sensor_camera',
 'gld_sag':'rv_sensor_support','gld_module':'rv_sensor_camera','sensor':'rv_sensor_choice',
 'gld_reports':'rv_sensor_choice','gld_position':'rv_sensor_camera','gld_sheet':'rv_sensor_support',
 'shlsheet1':'rv_shoulder_seams'}
answers = {
 'clicks': ['Only the above-cover cap remains turned 90 degrees: 1.5 mm in side view, 2.1 mm across.',
            'Traced outside silhouette remains intact; bottom skin cutouts updated to latest 0.80 mm wall geometry.'],
 'arc': ['Reuses clickMM: one screw and insert, material bridge, boss, post and real switch, not a freehand beam.',
         'No pts or points metric in either owned file.',
         'Loaded upright scrape is held while the accurate GT01 housing rotates onto the same fixed flat PCB, followed by a distinct aligned press.',
         'Visible 6% SOONER is explicitly IDEAL TRAVEL ESTIMATE. Footer gives sin20/cos20 and separates measured PC latency.'],
 'clk_wedge': ['The extra-fit wedge appears before the accurate housing rotates and lands on the single fixed flat PCB.',
               'Parts problem is explained at its actual mechanism; electronics tolerance-stack scene carries the fuller parts argument.',
               'Caption starts with extra parts to align, then explains the angled housing removes them.'],
 'cutouts': ['Dedicated scene retained ahead of front stops and seams.',
             'Whole-mouse context zooms into the same clamped trigger arms, retaining wheel, split and screw-block identity.',
             'Right seam straightens and supports shift onto switch axes, followed by a loaded comparison with real cap rotation and unequal/equal arrows.',
             'Player benefit is a square, predictable click before the switch is actuated.'],
 'tensioner': ['Explicit stiff-composite/no-bridge comparison retained as requested.',
               'AS SEEN IN STARLIGHT X: NO BRIDGE label is visible.',
               'PROPOSED: A THIN CROWN, ON THE SWITCH AXIS is visible.',
               'Bridge meets trigger with a square root; no joining fillet.'],
 'clk_tenmat': ['Flat stiffness is loaded first, then the crown forms and one screw clamps it before a distinct bridge press. 8.1/26.9/7.7 gf remains an illustrative model, not a test.',
               'Stiff where you grip, light where you click explicitly separates trigger rigidity from bend compliance.'],
 'anchors': ['An off-centre press actually rotates the bad cap; fixed guide walls, POM pads and identical posts assemble before the guided press.',
             'FRONT SECTION label and whole-mouse section key locate the cut.',
             'Both posts use exactly the same 48 by 130 geometry; all four POM pads exactly match.',
             'Copy explains loose movement feels cheap and repeated sideways scraping wears the guide.',
             'Guided translation keeps the cap square instead of rocking.'],
 'clk_pomtune': ['Post tips, guides and POM steps have intentional rounded corners.',
                 'Real shell, full-size switch end-view, post engagement and POM leader replace detached rectangle icons.',
                 'No matched rival guide-clearance dataset is available. Illustrative pad ladder is labelled example steps, not a competitor tolerance measurement.'],
 'clk_front': ['Important front geometry and seam direction are retained across two dense scenes.',
               'Oblique rear-to-nose trigger surface with explicit rear/nose/shell-stop labels replaces the section-only illustration.',
               'Deep groove continues to bad nose; good groove depth smoothly fades along its length to an exactly straight front.',
               'Press side alternates; bad front rocks and its computed first-contact location follows the press. Stop stays fixed.',
               'Win text names cheap-feeling rock and repeated edge wear.',
               'Perspective surface grid depicts longitudinal shallowing, not just a front cross section.',
               'Rear groove holds the finger sideways while the trigger still travels downward.',
               'Broad shallow nose supports more of the fingertip; not a measured contact-area gain.',
               'Seam clearance is its own following scene, not presented as an alternative groove treatment.',
               'Oversized side-facing gap and proud wall are compared against the intended flush shoulder.',
               'Section shows why grip should meet smooth wall and opening belongs on top; whole-mouse key locates section.',
               'Two scenes carry grooves/front stop and shoulder seam; no proliferation of one-line slides.'],
 'clk_hotswap': ['Actual soldered PCB and approaching iron on left; visibly gripping, opening and releasing spring contacts on right.',
                 'Three large claws open before the switch lifts clear. Every jaw and insertion axis derives from SWG.pins, preserving coaxial alignment.',
                 'Repair argument: replace a worn switch without replacing the mouse or soldering the board.'],
 'clk_spdt': ['Detailed original swMM geometry is locally extended with continuous leaf/rivet transit. The real leaf, enlarged contact, state and timeline share one NC/open/NO state.'],
 'latency': ['Opening, transit and landing are named in order with the moving timeline marker.',
             'SPDT counts opening instead of waiting for landing. Electrical 70 microsecond target remains a target.',
             'Actual housing leaf, moving rivet, enlarged contact and timeline marker are synchronized, including an open-contact transit frame.'],
 'clk_debounce': ['Debounce is folded into the concrete contact sequence instead of a standalone weak scene.',
                  'No forced millisecond debounce is the default benefit.',
                  'Explicitly configurable for players deliberately using double-click behavior.',
                  'Copy preserves player choice instead of claiming everyone wants minimum debounce.'],
 'clk_wait': ['Opening versus later landing shows which wait is avoided; timing is explicitly a logic illustration.',
              'Merged into the SPDT scene.'],
 'clk_methods': ['No separate methods slide; footer separates the electrical target from extra mechanical travel before PC input.'],
 'sidebuttons': ['Shipping comparison depicts living hinge, cap bending past switch, mini switch, side PCB and lead.',
                 'The same 2.4 mm contact end and 0.6 mm POM dimensions match-cut into the side guide before its loaded test. No PTFE question.',
                 'One fixed guide over one full-size switch, not long extra rails. F31.4 final guide acceptance remains open.',
                 'Full-size SPDT feel, shell-held switch, no side board and shared tolerance design remain explicit.'],
 'glide': ['Camera and focus story retained, now merged and source-drawn.'],
 'gld_under': ['Every corner ledge is 23 mm long and fits three 5.5 mm dots; two fitted, third position ringed.',
               'Ledges extend into the rim and are clipped to actual silhouette; no floating islands.',
               'Rounded inner corners blend into the rim.',
               'Identical mirrored ledges and matching dot placements; actual lens body, clip arms and connected supports.',
               'Rejected alternative is replaced; the drawing is a review illustration, not claimed user approval.'],
 'dots': ['Wide-patch comparison illustrates Viper-V4-style strategy but is explicitly not a Viper V4 measurement.',
          'Lens-side dots shorten unsupported span; exaggerated structural sag is distinct from pad sink.',
          'Equal material/thickness: less footprint means less skate mass. Higher pad pressure trade-off is explicit; no invented grams.'],
 'gld_camera': ['Detailed castellated module, PCB window and optical elements retained. The lens clips in, height drifts and recovers, then the physical stack translates.',
                'Cached code-drawn weave, blurred once per exposure for responsive motion. No photographs, fetched bitmaps or AI images.',
                'Camera, image pair, moving correspondence patch and focus window share one scene.'],
 'gld_corr': ['Physical camera translates right while identical frame detail and outlined patch shift 40 drawn pixels left; pixel correspondence is checked in proof.json.',
              'Merged into camera scene.'],
 'gld_blur': ['Too high -> calibrated -> rightward motion -> too low -> calibrated: optical height actually drives the blur on both exposures.'],
 'gld_sag': ['Corner dots land and the lens carrier snaps in before load traces redirect through near-lens supports; the unsupported beam remains visibly sagged.',
             'Same scene compares wide patches against targeted smaller footprint and explains material/pressure trade-off.'],
 'gld_module': ['Detailed original castellated-module/PCB/snap-on-lens helpers retained in camera; one-dot-wide 5.2 mm body explained on support scene.'],
 'sensor': ['PAW3970 remains suspected relation to Viper V4 Pro, not a public confirmed SKU.',
            'Plan after exclusivity, access not confirmed; no assured release date.'],
 'gld_reports': ['An oversized shared raw burst grows from +1000 to +3200 and drives both report lanes, making clipping a demonstration.',
                 '+3200 visibly becomes +2047 and loses 1153 in 12-bit while all 3200 remain in 16-bit. Both use the same 0-4096 display scale.'],
 'gld_position': ['No position scene in RV.slides; retained only in explicit legacy archive.'],
 'gld_sheet': ['Source-grounded integrated ledges, real narrow optical body and clip supports replace abstract undersides.'],
 'shlsheet1': ['Cutout and seam scenes sit together in clicks.',
               'Section key, grip finger and flush/wall comparison add the missing geometric context.',
               'Copy says further-out seam is easier to catch with grip.',
               'No Pro-model discussion in the new mechanics lane.',
               'No finalized sticker claim.']}
verification = ('Source geometry and finite causal sequence reviewed. Exact-build automated start/mid/settle '
                'record: deck/qa/mechanics-motion/report.json. Event frames and visible-state/pixel proof: '
                'deck/qa/mechanics-motion-events/report.json and proof.json. This verifies rendering, not '
                'physical performance or user acceptance.')
for rating in audit['ratings']:
    legacy = rating['legacyId']
    if legacy not in groups: continue
    for i, clause in enumerate(rating['clauses']):
        slide = groups[legacy]
        if legacy == 'clk_front' and 9 <= i <= 10: slide = 'rv_shoulder_seams'
        pending = legacy == 'clk_pomtune' and i == 2
        entry = {'id':clause['id'],'answer':answers[legacy][i], 'verification':verification,
                 'status':'open-evidence' if pending else 'implemented-verified'}
        slides[slide]['clauses'].append(entry)
        if pending: slides[slide]['pending'].append({'id':clause['id'],'reason':answers[legacy][i]})

out = {'schemaVersion':1,'owner':'mechanics-max-motion','date':'2026-11-05',
       'scope':'12 code-only 2D scenes, finite 20-22 second causal motion sequences. Source, temporal browser, text-layout and pixel-correspondence evidence stay separate from physical validation and user acceptance.',
       'externalMappings':['F27.clk_switch.1-.5: evidence lane', 'F27.clk_switch2.1-.4: binning/evidence integration',
                           'F27.gld_soft.1-.2: web-software scene'], 'slides':slides}
(root/'deck/revamp/coverage-mechanics.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(sum(len(v['clauses']) for v in slides.values()),'clauses;',sum(len(v['pending']) for v in slides.values()),'open')
