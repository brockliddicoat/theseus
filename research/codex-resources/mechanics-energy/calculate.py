#!/usr/bin/env python3
"""Independent Theseus mechanics/energy examples. Python 3 stdlib; no repo access.

Run: python calculate.py --output mechanics-energy.json --check
All scenario inputs are explicit. Generated numbers are not product measurements.
"""
import argparse
import json
import math
from pathlib import Path


SOURCES = {
    "omron_direction": {"url": "https://components.omron.com/eu-en/sites/components.omron.com.eu/files/ds_related_pdf/B149-E1.pdf", "type": "manufacturer precautions", "basis": "Press pin plungers in their operating direction; avoid improper side force."},
    "omron_optical": {"url": "https://www.fa.omron.com.cn/data_pdf/cat/cdva-cn1-002a.pdf?id=3906", "type": "manufacturer D2FP datasheet", "basis": "Electrical-characteristic test conditions: 5 mA, 30 us on / 970 us off; VF typical 1.16 V. Search-index text verified; PDF direct open did not expose readable text."},
    "ti5253": {"url": "https://www.ti.com/lit/ds/symlink/tmag5253.pdf", "type": "manufacturer datasheet Rev E April 2026", "basis": "pp5,7,22-23: variant/rail currents, startup, duty-cycle example. Table9-1 is a maker estimate, not a Theseus measurement."},
    "ti3001": {"url": "https://www.ti.com/lit/gpn/TMAG3001", "type": "manufacturer datasheet Rev C May 2025", "basis": "p5 electrical table and pp18,22-23 wake policy. Low current depends on sampling interval; not a selected component."},
    "eemb": {"url": "https://www.eemb.com/product-220", "type": "manufacturer listing", "basis": "LP702030 bare pouch with solder tabs; nominal350/min330mAh,3.7V,approx7g,20.5x32x7.3mm."},
    "boying": {"url": "https://www.boyingcable.com/10440-electric-toothbrush-rechargeable-lithium-battery-37v/", "type": "manufacturer listing", "basis": "10440 cylindrical battery; nominal350/min320mAh at0.2C,3.7V,approx9g. Pack protection/lead boundary unspecified."},
    "pyrofil": {"url": "https://www.m-chemical.co.jp/carbon-fiber/pdf/pellet/pellet.pdf", "type": "Mitsubishi Chemical manufacturer table", "basis": "PP-C-20A typical density1.01g/cm3,flexural modulus13500MPa,tensile120MPa,flexural210MPa. Typical, not guaranteed or mold-specific."},
    "fr4": {"url": "https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf", "type": "manufacturer sheet", "basis": "Typical density1.85g/cm3,tensile430MPa lengthwise,flexural modulus20/18GPa lengthwise/crosswise; not a populated PCB test."},
    "beam": {"url": "https://ocw.mit.edu/courses/3-11-mechanics-of-materials-fall-1999/resources/mit3_11f99_bdisp/", "type": "MIT Roylance primary teaching", "basis": "Beam displacement theory. Calculation here derives simply-supported rectangular-beam formulas independently."},
    "beam_stress": {"url": "https://ocw.mit.edu/courses/3-11-mechanics-of-materials-fall-1999/resources/mit3_11f99_bstress/", "type": "MIT Roylance primary teaching", "basis": "Beam bending stress and section properties."},
    "ashby": {"url": "https://doi.org/10.1098/rsta.2005.1678", "readable_copy": "https://eclass.aegean.gr/modules/document/file.php/511165/projects/foams_lattices.pdf", "type": "original research paper", "basis": "2006 foams/lattices paper: stretch vs bending modes, buckling and necessary-not-sufficient Maxwell count."},
    "ruler": {"url": "https://www.open.edu/openlearn/science-maths-technology/design-innovation/design/content-section-6.5", "type": "Open University primary teaching", "basis": "Ruler rotated through its two bending axes."},
    "triangles": {"url": "https://www.teachengineering.org/activities/cub_brid_lesson01_activity2", "type": "Colorado Boulder ITL primary teaching", "basis": "Straw bridge geometric-shape activity."},
    "razer": {"url": "https://www.razer.com/newsroom/product-news/viper-v4-pro-arrives-in-esports-green", "type": "manufacturer claim", "basis": "Optical wheel/switch hardware and up-to180h runtime; not a component energy breakdown or a Theseus test."},
    "abs_inherited": {"url": "https://www.denka.co.kr/pdf/DENKA-ABS_grade_English.pdf", "type": "inherited manufacturer sheet pointer, not reverified in this pass"},
    "pc_inherited": {"url": "https://solutions.covestro.com/en/products/makrolon/makrolon-2405_000000000000945088", "type": "manufacturer grade page", "basis": "Inherited flexural2.35GPa,tensile yield65MPa,density1.20. Table is conditional on inherited test inputs; no full six-material procurement qualification."},
    "mg_inherited": {"url": "https://www.tekogehause.de/uploads/manuali/materiali/AZ91D.pdf", "type": "inherited MatWeb mirror pointer, not primary reverified"},
    "al_inherited": {"url": "https://www.aerospacemetals.com/wp-content/uploads/2023/06/Aluminum-6061-T6-6061-T651.pdf", "type": "inherited supplier sheet pointer, not reverified in this pass"},
}


def pct(frac):
    return frac * 100.0


def direct_drive():
    theta = math.radians(20)
    c, s = math.cos(theta), math.sin(theta)
    d_mm, v_mm_ms = 0.35, 0.1  # illustrative travel and constant finger-path speed
    counterforces = []
    for q in [0.0, 0.5, 0.9, 0.95]:
        # Independent acceleration-only model: constant axial resistance R=qF.
        ratio = math.sqrt((c - q) / (1 - q)) if c > q else None
        counterforces.append({"R_over_F": q, "aligned_over_misaligned_time": ratio,
                              "sooner_pct": pct(1-ratio) if ratio is not None else None,
                              "misaligned_can_move_from_rest": c > q})
    return {
        "label": "derived ideal local projection, not Theseus performance",
        "source_keys": ["omron_direction"],
        "angle_deg": 20, "axial_fraction": c, "lateral_fraction": s,
        "aligned_axial_gain_relative_pct": pct(1/c-1),
        "aligned_required_total_force_reduction_pct": pct(1-c),
        "component_rule": "Axial and lateral components are perpendicular;cos(theta)^2+sin(theta)^2=1.94% axial and34% lateral do not sum to128% energy or imply34% wasted work.",
        "constant_speed": {
            "formula": "x=s*cos(theta); t_before=d/(v*cos(theta)); t_after=d/v",
            "assumptions": "Equal axial actuation travel d; equal trigger-path speed v; locally constant20deg tangent; no compliance, clearance or friction change.",
            "time_ratio_after_before": c, "ideal_sooner_pct": pct(1-c),
            "example_travel_mm": d_mm, "example_speed_mm_ms": v_mm_ms,
            "example_before_ms": d_mm/(v_mm_ms*c), "example_after_ms": d_mm/v_mm_ms,
        },
        "constant_force_acceleration": {
            "formula": "a_before=F*cos(theta)/m; a_after=F/m; t=sqrt(2*d/a)",
            "assumptions": "Separate ideal model: same axial effective mass/travel, zero initial speed, constant force, zero resistance.",
            "time_ratio_after_before": math.sqrt(c), "sooner_pct": pct(1-math.sqrt(c)),
            "constant_axial_resistance_sensitivity": counterforces,
        },
        "boundary": "Force and prescribed-motion models are alternatives, not simultaneous proof. A real arc changes angle through travel. No reaction-time, force-feel, wear-life or press-to-PC result follows without a matched test.",
    }


def runtime_gain(baseline_mw, removed_mw, replacement_mw=0):
    remaining = baseline_mw - removed_mw + replacement_mw
    if remaining <= 0:
        raise ValueError("Replacement would leave nonpositive average power")
    return baseline_mw / remaining - 1


def optical():
    current_ma, on_us, period_us, n = 5.0, 30.0, 1000.0, 2
    average_ma = n * current_ma * on_us / period_us
    capacity_mah, runtime_h, vbatt = 306.0, 180.0, 3.7
    ibatt = capacity_mah/runtime_h
    baseline_mw = vbatt * ibatt
    scenarios = []
    for v, eta in [(1.8, 1.0), (1.8, .9), (3.3, 1.0), (3.3, .9)]:
        rail_power = average_ma * v
        p = rail_power / eta
        scenarios.append({"assumed_supply_v": v, "assumed_conversion_efficiency": eta,
                          "two_emitter_rail_power_mw": rail_power,
                          "battery_equivalent_two_emitter_power_mw": p,
                          "hypothetical_share_pct": pct(p/baseline_mw),
                          "ideal_runtime_gain_if_whole_branch_removed_pct": pct(runtime_gain(baseline_mw, p))})
    return {
        "label": "hypothetical pulse/energy examples only; NOT measured Razer switch share",
        "source_keys": ["omron_optical", "razer"],
        "pulse_current_ma": current_ma, "on_us": on_us, "off_us": 970,
        "period_us": period_us, "duty_pct": pct(on_us/period_us),
        "average_per_switch_ma": average_ma/n, "average_two_switches_ma": average_ma,
        "inherited_cross_device_example": {
            "capacity_mah": capacity_mah, "runtime_h": runtime_h,
            "capacity_status": "Inherited secondary-review306mAh value; not independently confirmed maker capacity here.",
            "assumed_battery_voltage_v": vbatt, "implied_battery_current_ma": ibatt,
            "nominal_energy_wh": vbatt*capacity_mah/1000,
            "implied_power_mw": baseline_mw,
            "invalid_current_ratio_pct": pct(average_ma/ibatt),
            "invalid_current_ratio_runtime_gain_pct": pct(1/(1-average_ma/ibatt)-1),
            "warning": "0.30mA LED rail divided by1.70mA battery current is invalid without rail voltage and losses; schedule not proven deployed by Razer.",
        },
        "power_consistent_but_still_hypothetical_scenarios": scenarios,
        "led_die_power_mw_typical_vf": average_ma*1.16,
        "led_die_power_boundary": "5mA test VF1.16V applies to LED die only, excluding drive resistor/transistor/receiver/regulator/MCU. Not the battery branch power.",
        "replacement_formula": "T_new/T_old=P_old/(P_old-P_old_branch+P_new_branch), same usable battery energy and workload",
        "almost_half_claim": "F31.1: Razer staff online via Brock; no public quotation identified in supplied evidence or this targeted pass. Unverified attribution, not a measurement.",
        "saleable": "Mechanical clicks need no light emitter. Magnetic scrolling removes the optical path. Measure the complete design before promising a runtime multiplier.",
    }


def hall():
    rows = []
    for sleep_ms, ti_ua in zip([1, 10, 50, 100, 1000], [90.5, 9.4, 1.9, .9, .1]):
        active_ms, active_ua, shutdown_ua = .05, 2000, .020
        cycle_ms = sleep_ms + active_ms
        avg_ua = (active_ua*active_ms + shutdown_ua*sleep_ms)/cycle_ms
        rows.append({"sleep_ms": sleep_ms, "enable_high_us": active_ms*1000,
                     "cycle_ms": cycle_ms, "simple_2ma_rectangle_one_sensor_ua": avg_ua,
                     "simple_two_sensors_ua": 2*avg_ua,
                     "ti_table91_estimate_one_sensor_ua": ti_ua,
                     "simple_one_sensor_supply_power_uw_at1p8v": avg_ua*1.8,
                     "mean_random_phase_detection_wait_ms_excluding_conversion": cycle_ms/2,
                     "max_detection_wait_ms_excluding_conversion": cycle_ms})
    return {
        "label": "component examples, not selected Theseus encoder",
        "source_keys": ["ti5253", "ti3001"],
        "tmag5253": {"v": 1.8, "active_ma_bipolar_typ": 2.0,
                      "active_ma_bipolar_max": 3.3, "shutdown_na_scenario": 20,
                      "rows": rows,
                      "detection_wait_assumption": "Wait statistics assume a persistent step, ideal periodic point sampling and uniform event phase. Transient movement/reversal can be missed entirely; the maximum is not a guarantee that every scroll is detected.",
                      "table_model_difference": "90.5uA is TI's estimate, not2mA*50us/(1ms+50us). It is numerically consistent withabout1.9mA pulses. Do not label it a derived2mA result or infer the part variant from the table.50us high is not50us valid measurement; startup/settling/ADC must fit."},
        "tmag3001_datasheet_examples": {
            "sleep_na_typ": 40,
            "standby_ma_typ": .45,
            "awake_conversion_ma_typ_at1p8v_low_power": 2.1,
            "wake_sleep_5000ms_one_channel": {"at1p8v_ua_typ": .4, "at3p3v_ua_typ": .5},
            "wake_sleep_1ms_at3p3v_no_averaging": {"one_channel_ua_typ": 110, "one_channel_ua_max": 250, "four_channel_ua_typ": 230, "four_channel_ua_max": 375},
            "warning": "Homepage0.45uA wake/sleep is not an interval-independent scroll-current budget.0.45mA standby is a different state."},
        "quadrature_sampling_example": {
            "label": "invented acceptance-design example, not Theseus wheel specification",
            "detents_per_rev": 24, "transitions_per_detent": 4, "rev_per_s": 10,
            "transition_spacing_ms": 1000/(24*4*10),
            "boundary": "Sampling each quadrature state needs worst-case sample gap below the shortest transition dwell, with margin for speed variation/noise.1.05ms already exceeds this1.0417ms dwell. Absolute-angle decoding has different wrapping/alias rules; no universal safe interval is established."},
        "wake_policy": [
            "During play, use a validated scan/conversion interval and count energy for all channels, ADC, MCU wakeups, I2C, regulator quiescent current/losses and pullups.",
            "For idle, retain an autonomous magnetic wake detector or periodic conversions. A shutdown-only analog sensor cannot detect a wheel movement to wake itself.",
            "Wake-on-mouse-motion alone loses the first scroll when the mouse is stationary. Test the first notch, fast reversal, multiple turns and scroll-only wake from every sleep state.",
            "Transition to the fast state after wake and preserve the first event/direction; count duty timeout and rearming energy. Timer/threshold interrupt is not continuous capture.",
        ],
        "explicit_session_energy_example": {
            "label": "invented8h active/16h idle schedule; two2mA sensors at1.8V,90%conversion; excludes host/ADC",
            "active_supply_mw": 2*2*1.8,
            "idle_supply_mw": 2*rows[0]["simple_2ma_rectangle_one_sensor_ua"]*1.8/1000,
            "active8h_supply_mwh": 8*2*2*1.8,
            "idle16h_supply_mwh": 16*2*rows[0]["simple_2ma_rectangle_one_sensor_ua"]*1.8/1000,
            "total_battery_mwh_at90pct_conversion": (8*2*2*1.8+16*2*rows[0]["simple_2ma_rectangle_one_sensor_ua"]*1.8/1000)/.9,
            "boundary": "Energy of this assumed schedule, not mouse endurance. Always awake Hall can cost more than a pulsed optical implementation; actual selected parts and firmware decide.",
        },
    }


def batteries():
    return {
        "label": "two maker examples, matched nominal voltage/capacity, not selected Theseus packs",
        "source_keys": ["eemb", "boying"],
        "nominal_mah_each": 350, "nominal_v_each": 3.7,
        "nominal_wh_each": .350*3.7,
        "pouch": {"model": "EEMB LP702030", "mass_g_approx": 7, "minimum_mah": 330,
                  "dimensions_mm": [20.5, 32, 7.3], "nominal_wh_per_kg": .350*3.7/.007,
                  "boundary": "bare battery with solder tabs; PCM/NTC/lead/connector/mount absent"},
        "cylinder": {"model": "Boying10440", "mass_g_approx": 9, "minimum_mah": 320,
                     "nominal_wh_per_kg": .350*3.7/.009, "boundary": "approx cell mass; protection and terminations not specified"},
        "difference_g": 9-7, "pouch_mass_reduction_relative_cylinder_pct": pct((9-7)/9),
        "boundary": "Li-polymer pouch is also lithium-ion. Different formats/makers/minimum capacities; no matched discharge/cycle/abuse/finished-pack test. Capacity does not establish mouse runtime.",
    }


def beam(L, b, h, E_mpa, rho, P):
    I = b*h**3/12
    return {"span_mm": L, "width_mm": b, "depth_mm": h, "force_n": P,
            "E_mpa": E_mpa, "rho_g_cm3": rho, "mass_g": L*b*h*rho/1000,
            "I_mm4": I, "deflection_mm": P*L**3/(48*E_mpa*I),
            "stiffness_n_mm": 48*E_mpa*I/L**3,
            "outer_fiber_stress_mpa": (P*L/4)*(h/2)/I}


def mechanics():
    materials = [
        ("PP-C-20A", 13.5, 120, 1.01, "pyrofil", "flexural modulus/tensile strength typical"),
        ("Magnesium AZ91D-F", 44.8, 230, 1.81, "mg_inherited", "tensile modulus/ultimate tensile; inherited"),
        ("Aluminium6061-T6", 68.9, 310, 2.70, "al_inherited", "tensile modulus/ultimate tensile; inherited"),
        ("FR4 LW", 20, 430, 1.85, "fr4", "flexural modulus/lengthwise tensile strength typical"),
        ("ABS GR-2000", 2.55, 50, 1.05, "abs_inherited", "flexural modulus/tensile YIELD; inherited"),
        ("PC Makrolon2405", 2.35, 65, 1.20, "pc_inherited", "flexural modulus/tensile YIELD; inherited"),
    ]
    rows = []
    for name, E, strength, rho, source, basis in materials:
        h = 2000/(rho*60*10)  # 2g,60mm long,10mm wide
        rows.append({"material": name, "E_gpa": E, "strength_mpa": strength,
                     "density_g_cm3": rho, "source_key": source, "test_basis": basis,
                     "tensile_strength_over_density": strength/rho,
                     "specific_modulus": E/rho,
                     "thickness_free_bending_stiffness_mass_index": E**(1/3)/rho,
                     "equal_mass_fixed_width_stiffness_factor": E/rho**3,
                     "bending_strength_factor_if_same_failure_criterion": strength/rho**2,
                     "equal_2g_beam": beam(60, 10, h, E*1000, rho, 10)})
    flat = beam(60, 10, 3.3, 13500, 1.01, 10)
    edge = beam(60, 3.3, 10, 13500, 1.01, 10)
    c_pp, c_mg = rows[0], rows[1]
    return {
        "label": "analytical teaching models; no validated whole-shell strength or lifetime",
        "source_keys": ["beam", "beam_stress", "pyrofil", "fr4", "ashby", "ruler", "triangles"],
        "beam_rotation": {"flat": flat, "edge": edge,
                          "same_mass_stiffness_ratio": edge["stiffness_n_mm"]/flat["stiffness_n_mm"],
                          "section_modulus_strength_ratio_same_stress_limit": 10/3.3,
                          "formula": "I=b*h^3/12; delta=P*L^3/(48*E*I); sigma=M*h/(2*I); M=P*L/4",
                          "boundary": "Simply supported, central point load, constant scalar E, small-deflection beam model.10N is a stated example, not measured gaming grip. Deep orientation L/h=6: shear/3D effects deserve checking before calling9.18x an accurate physical test prediction."},
        "thickness": {"half_mass_factor": .5, "half_bending_stiffness_factor": .5**3,
                      "half_bending_stress_capacity_factor": .5**2,
                      "minus10pct_stiffness_change_pct": pct(.9**3-1),
                      "plus10pct_stiffness_change_pct": pct(1.1**3-1)},
        "index_rules": {
            "axial_tie_stiffness": "For fixed L, axial k=EA/L and mass=rho*A*L: maximizeE/rho.",
            "axial_tie_strength": "For matching failure criterion, axial capacity/mass ranks asstrength/rho.",
            "fixed_width_bending_stiffness": "At fixed L,b,m: h=m/(rho*b*L); k proportionalE/rho^3. Minimum mass at a stiffness target maximizesE^(1/3)/rho. Index ratio must be cubed for equal-mass stiffness ratio.",
            "plate_bending_stiffness": "Isotropic D=E*t^3/[12*(1-nu^2)]; thickness-free mass index=[E/(1-nu^2)]^(1/3)/rho. Omittingnu is an explicit approximation; laminates need directional stiffness.",
            "fixed_width_bending_strength": "M_limit=strength*b*h^2/6; at fixed mass ranks asstrength/rho^2. Minimum mass at same allowable moment maximizes sqrt(strength)/rho.",
            "geometrically_scaled_beam": "If width and depth both scale at fixed aspect ratio, useE^(1/2)/rho for stiffness-limited minimum mass, notE^(1/3)/rho.",
        },
        "conditional_inherited_six_material_inputs_and_derived_values": rows,
        "pp_vs_mg_from_inherited_inputs": {
            "equal_mass_thickness_ratio": 1.81/1.01,
            "equal_mass_fixed_width_stiffness_ratio": c_pp["equal_mass_fixed_width_stiffness_factor"]/c_mg["equal_mass_fixed_width_stiffness_factor"],
            "bending_mass_index_ratio": c_pp["thickness_free_bending_stiffness_mass_index"]/c_mg["thickness_free_bending_stiffness_mass_index"],
            "nominal_tensile_strength_per_mass_ratio": (120/1.01)/(230/1.81),
            "boundary": "This comparison isolates inherited scalar material values. It is not a molded-shell proof, matched yield ranking, buckling prediction or procurement recommendation."},
        "fr4_vs_mg_axial_tie_from_inherited_inputs": {
            "tensile_strength_per_mass_ratio": (430/1.85)/(230/1.81),
            "axial_modulus_per_mass_ratio": (20/1.85)/(44.8/1.81),
            "boundary": "The0.437 ratio uses FR4's20GPa flexural modulus as a scalar axial-modulus proxy, not a measured tensile modulus. This conditional model can have higher tensile-strength/mass and lower axial-stiffness/mass simultaneously. Coupon data is not populated-PCB capacity; cutouts,copper,attachments,layup and load direction matter."},
        "triangle_boundary": "A nondegenerate planar pin-jointed triangle removes the square's in-plane shear mechanism. For a free planar frame, Maxwellb-2j+3=s-m, with self-stress states s and internal infinitesimal mechanisms m. Equality to zero is necessary for an isostatic candidate, not for every rigid frame, and does not alone prove rigidity. A rigid redundant frame may have b>2j-3. Real shell members can bend,buckle,twist or fail at joints.",
        "thinning_scaling_example": [{"width_factor": q, "fixed_depth_axial_stiffness_factor": q,
                                     "fixed_depth_in_plane_bending_stiffness_factor": q**3,
                                     "axial_over_bending_relative_advantage": q/(q**3)} for q in [1,.75,.5,.25]],
        "strength_boundary": "E is not strength; deflection is not failure.120MPa is a stipulated scalar tensile threshold, not a multiaxial short-fiber damage model. Coupon direction, flow/weld lines,impact,fatigue,creep,buckling,minimum walls and attachments can control. Inherited shell FEA was not rerun or independently validated here.",
    }


def build():
    return {"meta": {"title": "Independent mechanics and energy calculations", "verified_date": "2026-11-05",
                     "scope": "Package3 only; main checkout read-only. All calculations standalone, no prototype measurements.",
                     "units": "mm,N,MPa for beam; mA*V=mW; uA*V=uW; mAh*V/1000=Wh",
                     "evidence_types": ["maker component data", "inherited conditional inputs", "derived illustration", "unverified owner attribution", "Theseus targets"]},
            "sources": SOURCES, "direct_drive": direct_drive(), "optical": optical(),
            "hall": hall(), "same_capacity_batteries": batteries(), "mechanics": mechanics()}


def check(data):
    d, o, h, m = (data[k] for k in ["direct_drive", "optical", "hall", "mechanics"])
    assert math.isclose(d["axial_fraction"]**2+d["lateral_fraction"]**2, 1, rel_tol=1e-12)
    assert math.isclose(d["constant_speed"]["ideal_sooner_pct"], 6.030737921409157, rel_tol=1e-12)
    assert math.isclose(o["average_two_switches_ma"], .3)
    assert math.isclose(h["tmag5253"]["rows"][0]["cycle_ms"], 1.05)
    assert 95 < h["tmag5253"]["rows"][0]["simple_2ma_rectangle_one_sensor_ua"] < 96
    rot = m["beam_rotation"]
    assert math.isclose(rot["flat"]["mass_g"], 1.9998)
    assert math.isclose(rot["same_mass_stiffness_ratio"], (10/3.3)**2)
    r = m["pp_vs_mg_from_inherited_inputs"]
    assert math.isclose(r["bending_mass_index_ratio"]**3, r["equal_mass_fixed_width_stiffness_ratio"])
    assert data["same_capacity_batteries"]["difference_g"] == 2
    assert math.isclose(runtime_gain(10, 2, 1), 1/9)
    assert data == json.loads(json.dumps(data, allow_nan=False))
    return 11


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--output", type=Path)
    p.add_argument("--check", action="store_true")
    args = p.parse_args()
    data = build()
    if args.check:
        print(f"{check(data)} numerical/units/round-trip checks passed")
    rendered = json.dumps(data, indent=2, ensure_ascii=False, allow_nan=False) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
        print(f"Wrote {args.output.resolve()}")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
