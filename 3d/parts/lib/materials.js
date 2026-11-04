// Part materials: the studio library (lib/studio.js) plus finishes the small parts need.
// Every call returns NEW instances, owned by the builder that asked (so dispose() is safe).
// Calibrated by eye against the reference photos under the studio's AgX + RoomEnvironment rig.
import * as THREE from 'three';
import { materials as studioMaterials, HIGHLIGHT } from '../../lib/studio.js';

const P = (o) => new THREE.MeshPhysicalMaterial(o);

export function partMaterials(over = {}) {
  const S = studioMaterials();
  const M = {
    ...S,
    // --- metals ---
    gold: P({ color: 0xf3c35a, metalness: 1, roughness: 0.2 }),                 // hard gold / ENIG plating
    goldSatin: P({ color: 0xefc45c, metalness: 1, roughness: 0.3 }),          // stamped + plated terminals
    tin: P({ color: 0xc4c6c8, metalness: 1, roughness: 0.46 }),                 // 200–300 µin matte tin over nickel
    nickel: P({ color: 0xb9b5ab, metalness: 1, roughness: 0.3 }),
    becu: P({ color: 0xd99c6e, metalness: 1, roughness: 0.3 }),                 // bare beryllium copper
    silverContact: P({ color: 0xe6e4df, metalness: 1, roughness: 0.18 }),       // AgNi contact rivets
    // machined brass insert: turned, so the highlight runs along the axis (lathe UVs give a circumferential tangent;
    // the rotation turns the anisotropy across it, as on the magnesium wheel)
    brass: P({ color: 0xd2a852, metalness: 1, roughness: 0.27, anisotropy: 0.6, anisotropyRotation: Math.PI / 2 }),
    brassKnurl: P({ color: 0xcca04a, metalness: 1, roughness: 0.34 }),          // formed knurl teeth: isotropic, a touch duller
    // brass-plated steel screw: bright electroplate under a thin clear passivation (the crisp second highlight)
    brassPlated: P({ color: 0xdcb866, metalness: 1, roughness: 0.22, clearcoat: 0.35, clearcoatRoughness: 0.08 }),
    brassPlatedRolled: P({ color: 0xd6b05e, metalness: 1, roughness: 0.27, clearcoat: 0.25, clearcoatRoughness: 0.12 }),   // the rolled thread
    steel: P({ color: 0xc6cbd0, metalness: 1, roughness: 0.24 }),
    blackOxide: P({ color: 0x2a2b2d, metalness: 0.85, roughness: 0.42 }),
    stainless: P({ color: 0xc2c6ca, metalness: 1, roughness: 0.2 }),
    phosBronze: P({ color: 0xc89a62, metalness: 1, roughness: 0.28 }),
    magnesium: P({ color: 0xa2a7ad, metalness: 1, roughness: 0.2, anisotropy: 0.65, anisotropyRotation: Math.PI / 2 }),   // turned: tangents run circumferentially
    magnesiumLand: P({ color: 0xa6abb1, metalness: 1, roughness: 0.3 }),   // milled grouser lands
    magnesiumFace: P({ color: 0x9fa4aa, metalness: 1, roughness: 0.2, anisotropy: 0.6, anisotropyRotation: Math.PI / 2 }),
    aluminium: P({ color: 0xc9ccd0, metalness: 1, roughness: 0.32 }),
    tinPlate: P({ color: 0xd3d6d9, metalness: 1, roughness: 0.33 }),             // tin-plated steel frame (encoder), satin
    silverLead: P({ color: 0xd8d8d4, metalness: 1, roughness: 0.22 }),           // silver-plated lead frame (LED cup)
    maskBlack: P({ color: 0x08090a, roughness: 0.5, specularIntensity: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.45 }),   // matte black solder mask (macro-safe)
    maskRelief: P({ color: 0x0b0c0e, roughness: 0.4, specularIntensity: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.35 }), // mask over a copper trace (the antenna relief)
    shieldNickel: P({ color: 0xcdcecb, metalness: 1, roughness: 0.27 }),         // drawn nickel-silver shield can
    solder: P({ color: 0xd9dbde, metalness: 1, roughness: 0.15 }),               // SAC solder fillets
    lensPC: P({ color: 0xffffff, roughness: 0.04, transmission: 1, thickness: 1.6, ior: 1.585, attenuationColor: new THREE.Color(0xeef4ff), attenuationDistance: 8, specularIntensity: 1 }),   // the clear PC lens
    lensSlit: P({ color: 0x15171a, roughness: 0.6 }),
    // --- polymers ---
    pom: P({ color: 0xece8de, roughness: 0.48, sheen: 0.4, sheenRoughness: 0.6, sheenColor: 0xffffff }),
    pomBlack: P({ color: 0x0e0f10, roughness: 0.4, specularIntensity: 0.6, sheen: 0.25, sheenRoughness: 0.6, sheenColor: 0x303134 }),
    ptfe: P({ color: 0xf8f8f5, roughness: 0.55, sheen: 0.5, sheenRoughness: 0.5, sheenColor: 0xffffff }),
    lcpBlack: P({ color: 0x0b0c0d, roughness: 0.48, specularIntensity: 0.55, clearcoat: 0.12, clearcoatRoughness: 0.4 }),   // glass-filled LCP/PA switch base
    housingBlack: P({ color: 0x0d0e0f, roughness: 0.52, specularIntensity: 0.6, clearcoat: 0.1, clearcoatRoughness: 0.5 }),
    nylon: P({ color: 0xede6d4, roughness: 0.55, sheen: 0.3, sheenColor: 0xffffff }),               // natural PA (JST housings)
    paWhite: P({ color: 0xf1efe9, roughness: 0.5, sheen: 0.3, sheenColor: 0xffffff }),               // white PA photo-interrupter holder
    rotorOrange: P({ color: 0xc8742f, roughness: 0.42, sheen: 0.25, sheenRoughness: 0.5, sheenColor: 0xffc08a }),   // the encoder rotor (POM)
    discBlack: P({ color: 0x0c0c0e, roughness: 0.32, specularIntensity: 0.7 }),                       // opaque PC code disc
    dieDark: P({ color: 0x1c1d24, metalness: 0.3, roughness: 0.35 }),                                 // an LED die seen through clear epoxy
    windowDark: new THREE.MeshBasicMaterial({ color: 0x0b0a0d, toneMapped: false }),                  // a detector aperture, lit by setHighlight
    pinkPC: P({ color: 0xfff3f5, roughness: 0.03, metalness: 0, transmission: 1, thickness: 0.5, ior: 1.585,
      attenuationColor: new THREE.Color(0xff8aa2), attenuationDistance: 2.4, specularIntensity: 1,
      sheen: 1.0, sheenRoughness: 0.22, sheenColor: new THREE.Color(0xff6a8c) }),
    clearPC: P({ color: 0xffffff, roughness: 0.05, transmission: 1, thickness: 0.45, ior: 1.585,
      attenuationColor: new THREE.Color(0xe8f0ff), attenuationDistance: 6 }),
    smokePC: P({ color: 0x9aa0a8, roughness: 0.08, transmission: 0.92, thickness: 0.6, ior: 1.585,
      attenuationColor: new THREE.Color(0x30343a), attenuationDistance: 1.2 }),
    epoxyClear: P({ color: 0xffffff, roughness: 0.04, transmission: 1, thickness: 1.0, ior: 1.52 }),
    epoxyIR: P({ color: 0x1b1520, roughness: 0.16, clearcoat: 0.6, clearcoatRoughness: 0.1 }),       // IR-pass detector epoxy
    cfpp: P({ color: 0x141517, roughness: 0.6, clearcoat: 0.2, clearcoatRoughness: 0.55, sheen: 0.2, sheenColor: 0x2a2b2e }),
    // --- skate stack ---
    poron: P({ color: 0x2c2e31, roughness: 0.95 }),
    adhesive: P({ color: 0xf4efe0, roughness: 0.25, transmission: 0.85, thickness: 0.05, ior: 1.47 }),
    liner: P({ color: 0xf2efe6, roughness: 0.6 }),
    // --- battery ---
    pouch: P({ color: 0xc8cacd, metalness: 0.85, roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    label: P({ color: 0xffffff, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.3 }),
    kapton: P({ color: 0xe0a040, roughness: 0.22, transmission: 0.55, thickness: 0.05, ior: 1.7,
      attenuationColor: new THREE.Color(0xb05a00), attenuationDistance: 0.4 }),
    silicone: P({ color: 0x2b2d30, roughness: 0.62, sheen: 0.35, sheenRoughness: 0.5, sheenColor: 0x55585c }),
    siliconeAccent: P({ color: HIGHLIGHT.night, roughness: 0.6, sheen: 0.3, sheenColor: 0xbfdcff }),   // Theseus's highlight; the battery recolours its copy to C.hero
    wireRed: P({ color: 0xb8241f, roughness: 0.5, sheen: 0.25, sheenColor: 0xff9a90 }),
    wireBlack: P({ color: 0x1a1b1d, roughness: 0.5, sheen: 0.25, sheenColor: 0x4a4b50 }),
    wireWhite: P({ color: 0xe9e6de, roughness: 0.5, sheen: 0.25, sheenColor: 0xffffff }),
    wireYellow: P({ color: 0xe8b21a, roughness: 0.5 }),
    // --- light ---
    ghost: new THREE.MeshPhysicalMaterial({ color: 0xd8e6ee, roughness: 0.15, transparent: true, opacity: 0.12, depthWrite: false }),
    edge: new THREE.LineBasicMaterial({ color: 0x38d6c4, transparent: true, opacity: 0.9 }),
  };
  for (const [k, v] of Object.entries(over || {})) M[k] = v;
  return M;
}
