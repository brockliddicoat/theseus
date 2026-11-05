"""Offline audit of the delivered numeric artifact, without importing its calculator."""
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory

PACKAGE = Path(__file__).resolve().parent
_temporary = TemporaryDirectory(prefix="theseus-mechanics-verify-")
repro = Path(_temporary.name) / "reproduction.json"
subprocess.run([sys.executable, str(PACKAGE / "calculate.py"), "--check", "--output", str(repro)], check=True)
published_bytes = (PACKAGE / "mechanics-energy.json").read_bytes()
assert published_bytes == repro.read_bytes(), "Reproduction differs at byte level"
data = json.loads(published_bytes)
checks = 1

def near(actual, expected, label, rtol=1e-11, atol=1e-12):
    global checks
    assert math.isclose(actual, expected, rel_tol=rtol, abs_tol=atol), (label, actual, expected)
    checks += 1

# A fresh derivation from axial projected distance/force; no calculator import.
d = data["direct_drive"]
c = math.cos(math.pi / 9)
near(d["axial_fraction"], c, "20 degree cosine")
near(d["aligned_axial_gain_relative_pct"], 100 * (1 - c) / c, "force denominator")
near(d["constant_speed"]["example_before_ms"], 0.35 / (0.1 * c), "path speed time")
near(d["constant_speed"]["example_after_ms"], 3.5, "aligned time")
near(d["constant_speed"]["ideal_sooner_pct"], (1-c) * 100, "constant speed saving")
near(d["constant_force_acceleration"]["sooner_pct"], (1-math.sqrt(c)) * 100, "constant force saving")
for row in d["constant_force_acceleration"]["constant_axial_resistance_sensitivity"]:
    q = row["R_over_F"]
    if q < c:
        near(row["aligned_over_misaligned_time"], math.sqrt((c-q)/(1-q)), "resistance ratio")
    else:
        assert row["aligned_over_misaligned_time"] is None and not row["misaligned_can_move_from_rest"]
        checks += 1

o = data["optical"]
near(o["average_two_switches_ma"], 2 * 5 * 30 / 1000, "LED pulse charge")
base = 3.7 * 306 / 180
for row in o["power_consistent_but_still_hypothetical_scenarios"]:
    rail = 0.3 * row["assumed_supply_v"]
    battery = rail / row["assumed_conversion_efficiency"]
    near(row["two_emitter_rail_power_mw"], rail, "emitter rail power")
    near(row["battery_equivalent_two_emitter_power_mw"], battery, "battery equivalent power")
    near(row["hypothetical_share_pct"], 100 * battery / base, "rail-consistent share")
    near(row["ideal_runtime_gain_if_whole_branch_removed_pct"], 100 * battery / (base-battery), "runtime gain")

h = data["hall"]
for row in h["tmag5253"]["rows"]:
    cycle = row["sleep_ms"] + 0.05
    q_sensor = 2000 * 0.05 + 0.020 * row["sleep_ms"] # uA*ms
    near(row["simple_2ma_rectangle_one_sensor_ua"], q_sensor/cycle, "Hall integrated charge")
    near(row["simple_two_sensors_ua"], 2*q_sensor/cycle, "Hall two sensors")
    near(row["simple_one_sensor_supply_power_uw_at1p8v"], 1.8*q_sensor/cycle, "Hall power units")
session = h["explicit_session_energy_example"]
near(session["total_battery_mwh_at90pct_conversion"],
     (8*session["active_supply_mw"] + 16*session["idle_supply_mw"])/0.9,
     "24h session energy")

# Derive center-load compliance from strain energy, via independent numerical
# integration of a unit-load moment field, rather than repeat delta=PL^3/48EI.
m = data["mechanics"]
beams = [m["beam_rotation"][key] for key in ["flat", "edge"]]
beams += [r["equal_2g_beam"] for r in m["conditional_inherited_six_material_inputs_and_derived_values"]]
for item in beams:
    L, b, depth, E, force = (item[k] for k in ["span_mm", "width_mm", "depth_mm", "E_mpa", "force_n"])
    n = 1200
    step = L / n
    I = b*depth**3/12
    def unit_load_energy_integrand(s):
        moment = 0.5*min(s, L-s)
        return moment*moment/(E*I)
    integral = unit_load_energy_integrand(0) + unit_load_energy_integrand(L)
    integral += sum((4 if j%2 else 2)*unit_load_energy_integrand(j*step) for j in range(1,n))
    compliance = integral*step/3
    near(item["deflection_mm"], force*compliance, "Castigliano beam deflection")
    near(item["stiffness_n_mm"], 1/compliance, "strain-energy beam stiffness")
    near(item["mass_g"], L*b*depth*item["rho_g_cm3"]/1000, "beam mass units")
    near(item["outer_fiber_stress_mpa"], (force*L/4)*(depth/2)/I, "elastic peak stress")
for row in m["conditional_inherited_six_material_inputs_and_derived_values"]:
    near(row["thickness_free_bending_stiffness_mass_index"]**3,
         row["equal_mass_fixed_width_stiffness_factor"], "cubed material index")
near(m["pp_vs_mg_from_inherited_inputs"]["equal_mass_fixed_width_stiffness_ratio"],
     beams[2]["stiffness_n_mm"]/beams[3]["stiffness_n_mm"], "PP/Mg equal beam ratio")
near(data["same_capacity_batteries"]["nominal_wh_each"], 350*3.7/1000, "battery energy units")
near(data["same_capacity_batteries"]["pouch_mass_reduction_relative_cylinder_pct"], 100*2/9, "battery mass denominator")

report = {
    "status":"pass", "independent_numeric_and_reproduction_assertions":checks,
    "published_json_sha256":hashlib.sha256(published_bytes).hexdigest(),
    "reproduction_byte_identical":True,
    "method":"No calculator import; independent projection/charge arithmetic and numerical strain-energy integration for beam compliance",
}
print(json.dumps(report,indent=2))
_temporary.cleanup()
