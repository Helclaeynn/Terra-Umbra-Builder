// Ambiance sonore de la table, fabriquée dans le navigateur (Web Audio) : aucun fichier son,
// donc rien à héberger ni de droits à gérer. Le MJ choisit, chaque joueur l'active chez lui
// (les navigateurs exigent un geste de l'utilisateur avant de jouer un son).
export type AmbienceSound = "off" | "pluie" | "vent" | "tension" | "foule";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let stopCurrent: (() => void) | null = null;
let current: AmbienceSound = "off";

function noiseBuffer(c: AudioContext, seconds = 4) {
  const buffer = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buffer.getChannelData(0);
  // Bruit « rose » approché : plus doux que le bruit blanc pour la pluie et le vent.
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.997 * b0 + white * 0.029;
    b1 = 0.985 * b1 + white * 0.032;
    b2 = 0.95 * b2 + white * 0.048;
    data[i] = (b0 + b1 + b2 + white * 0.02) * 0.9;
  }
  return buffer;
}

function noise(c: AudioContext, out: AudioNode) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  src.connect(out);
  src.start();
  return src;
}

function lfo(c: AudioContext, rate: number, depth: number, target: AudioParam) {
  const osc = c.createOscillator(),
    gain = c.createGain();
  osc.frequency.value = rate;
  gain.gain.value = depth;
  osc.connect(gain).connect(target);
  osc.start();
  return osc;
}

function build(c: AudioContext, sound: AmbienceSound, out: AudioNode): () => void {
  const nodes: (AudioScheduledSourceNode)[] = [];
  if (sound === "pluie" || sound === "vent" || sound === "foule") {
    const filter = c.createBiquadFilter();
    filter.type = sound === "pluie" ? "highpass" : "bandpass";
    filter.frequency.value = sound === "pluie" ? 900 : sound === "vent" ? 420 : 700;
    filter.Q.value = sound === "foule" ? 0.6 : 0.8;
    const level = c.createGain();
    level.gain.value = sound === "pluie" ? 0.5 : 0.7;
    filter.connect(level).connect(out);
    nodes.push(noise(c, filter));
    if (sound === "vent") nodes.push(lfo(c, 0.12, 260, filter.frequency), lfo(c, 0.07, 0.35, level.gain));
    if (sound === "foule") nodes.push(lfo(c, 0.9, 0.15, level.gain), lfo(c, 0.23, 180, filter.frequency));
  } else if (sound === "tension") {
    const level = c.createGain();
    level.gain.value = 0.18;
    level.connect(out);
    for (const f of [55, 82.4, 110.7]) {
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f;
      const low = c.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = 240;
      osc.connect(low).connect(level);
      osc.start();
      nodes.push(osc, lfo(c, 0.05 + f / 4000, 60, low.frequency));
    }
    nodes.push(lfo(c, 0.08, 0.08, level.gain));
  }
  return () => nodes.forEach((n) => { try { n.stop(); } catch { /* déjà arrêté */ } });
}

/** Joue (ou coupe) l'ambiance. `enabled` : le joueur a activé le son sur cet appareil. */
export function playAmbience(sound: AmbienceSound, enabled: boolean, volume = 0.4) {
  if (!enabled || sound === "off") {
    stopCurrent?.();
    stopCurrent = null;
    current = "off";
    return;
  }
  const AC = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!AC) return;
  ctx ??= new AC();
  if (!master) {
    master = ctx.createGain();
    master.connect(ctx.destination);
  }
  void ctx.resume();
  master.gain.setTargetAtTime(volume, ctx.currentTime, 0.3);
  if (sound === current) return;
  stopCurrent?.();
  stopCurrent = build(ctx, sound, master);
  current = sound;
}
