/* =====================================================================
   FUR FRIENDS — animation engine v4 (soft-shaded kawaii look)
   Characters: Momo (cat), Pipi (bunny), Otto (otter), Kuku (squirrel)
   + NPCs (panda). Smooth motion: bendy arms, spring ears/tails,
   breathing, squash & stretch, personality-based idle energy.
   ===================================================================== */
const NS = 'http://www.w3.org/2000/svg';
const TAU = Math.PI * 2;
const $ = id => document.getElementById(id);
function mk(tag, attrs, parent){
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function G(parent, tr){ return mk('g', tr ? {transform: tr} : {}, parent); }
function rngMaker(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
let rnd = rngMaker(777);
const R = (a,b) => a + (b-a)*rnd();
const mod = (a,n) => ((a % n) + n) % n;
const clamp = (x,a,b) => Math.max(a, Math.min(b, x));
const ss = x => { x = clamp(x,0,1); return x*x*(3-2*x); };
const sm = x => { x = clamp(x,0,1); return x*x*x*(x*(x*6-15)+10); };   // smootherstep
const lerp = (a,b,u) => a + (b-a)*u;
const T = (e, s) => e.setAttribute('transform', s);
const show = (e, v) => { if (e) e.style.display = v ? '' : 'none'; };
// smooth keyframes (smootherstep between keys)
function K(t, keys){
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys[n-1][0]) return keys[n-1][1];
  for (let i=0;i<n-1;i++){
    const a = keys[i], b = keys[i+1];
    if (t >= a[0] && t < b[0]) return a[1] + (b[1]-a[1])*sm((t-a[0])/(b[0]-a[0]));
  }
  return keys[n-1][1];
}
function KP(t, keys){ // keyframes of points [[t,[x,y]],...]
  return [K(t, keys.map(k => [k[0], k[1][0]])), K(t, keys.map(k => [k[0], k[1][1]]))];
}
function rh(u,a,b,c,d){ return sm((u-a)/(b-a)) * (1 - sm((u-c)/(d-c))); }
function bump(t, start, dur){ const u = (t-start)/dur; return (u>0 && u<1) ? Math.pow(Math.sin(Math.PI*u),2) : 0; }
function hopF(t, t0, d, h){ const u = (t-t0)/d; return (u>0 && u<1) ? h*4*u*(1-u) : 0; }
function blinkAt(t, per, off){
  const u = mod(t+off, per)/MOTION.blinkDuration;
  if (u >= 1) return 1;
  // Asymmetric close/open with eased eyelid motion; never collapses to zero.
  return u < 0.42 ? 1 - 0.93*ss(u/0.42) : 0.07 + 0.93*ss((u-0.42)/0.58);
}
function arcP(p0, p1, v, h){ v = clamp(v,0,1); const w = sm(v); return [lerp(p0[0],p1[0],w), lerp(p0[1],p1[1],w) - h*4*v*(1-v)]; }
function lerpP(a, b, u){ return [lerp(a[0],b[0],u), lerp(a[1],b[1],u)]; }
// walking position from keyframes of x; returns {x, phase, amt}
function walkX(t, keys, stride){
  const x = K(t, keys);
  const v = (K(t + 0.04, keys) - K(t - 0.04, keys)) / 0.08;
  return {x, v, amt: clamp(Math.abs(v)/60, 0, 1)};
}

/* ---------------- simulation clock (for springs) ---------------- */
const SIM = {t: 0, dt: 1/60, reset: true};
// Animation tuning: conservative defaults preserve existing episode choreography.
const MOTION = Object.freeze({walkLift: 11, walkBob: 3.2, walkSway: 2.2, breathScale: 0.009, blinkDuration: 0.22});
function simTick(t){
  const dt = t - SIM.t;
  SIM.reset = !(dt > 0 && dt < 0.12);
  SIM.dt = SIM.reset ? 1/60 : dt;
  SIM.t = t;
}
function spring(c, key, target, k, d, reset){
  let s = c.sp[key];
  if (!s || reset){ c.sp[key] = {x: target, v: 0}; return target; }
  const n = Math.max(1, Math.ceil(Math.min(SIM.dt, 1/30) / 0.004)), h = Math.min(SIM.dt, 1/30) / n;
  for (let i=0;i<n;i++){ const a = -k*(s.x - target) - d*s.v; s.v += a*h; s.x += s.v*h; }
  return s.x;
}

const OL = '#5A3F35';   // warm sepia ink (watercolor pen line)
const SWD = 4.6;
const FONT = "'Noto Sans CJK JP','Noto Sans JP','Inter',sans-serif";
const SK = (o, w) => Object.assign({stroke:OL, 'stroke-width': w || SWD, 'stroke-linejoin':'round', 'stroke-linecap':'round'}, o);
const S4 = o => SK(o, 3.8);
let DEFS = null;
let UID = 0;

/* ================= CHARACTERS ================= */
const PAL = {
  cat:      {fur:'#FFFFFF', patch:'#A7A3AD', stripe:'#77727F', inner:'#FFB7C6', arm:'#FFFFFF', foot:'#FFFFFF', energy:0.72},
  bunny:    {fur:'#FFF8EC', inner:'#FFBFCB', arm:'#FFF8EC', foot:'#FFF8EC', energy:1.0},
  otter:    {fur:'#A6744F', muzzle:'#F5E1C8', belly:'#F5E1C8', inner:'#7C5034', arm:'#A6744F', foot:'#8E6040', energy:1.05},
  squirrel: {fur:'#EE8A46', face:'#FFF1E0', belly:'#FFF1E0', inner:'#FFC59C', tail2:'#F8B67F', arm:'#EE8A46', foot:'#E07A38', energy:1.42},
  panda:    {fur:'#FFFFFF', dark:'#423B40', inner:'#6B6168', arm:'#423B40', foot:'#423B40', energy:0.8}
};
const APRON = {cat:'#CDB8F2', bunny:'#FFC3D2', otter:'#AFCFF5', squirrel:'#FFD3A6', panda:'#BFE3F5'};
// soft shading: top-left light, bottom-right shade (per species)
const SHADE = {cat:'#BDB3CF', bunny:'#E6C2AE', otter:'#5E3A22', squirrel:'#C2551F', panda:'#B3AABB'};
function shadeGrad(kind){
  const id = 'shade_' + kind;
  if (!DEFS.querySelector('#' + id)){
    const g = mk('radialGradient', {id, cx:0.36, cy:0.28, r:0.82, fx:0.34, fy:0.24}, DEFS);
    [[0,'#FFFFFF',0.55],[0.42,'#FFFFFF',0],[0.7,SHADE[kind],0],[1,SHADE[kind],0.55]].forEach(q => mk('stop', {offset:q[0], 'stop-color':q[1], 'stop-opacity':q[2]}, g));
  }
  return `url(#${id})`;
}
function pawPrint(parent, x, y, s, col){
  const g = G(parent, `translate(${x} ${y}) scale(${s || 1})`);
  mk('ellipse', {cx:0, cy:3, rx:8.5, ry:7, fill:col || '#FFFFFF'}, g);
  [[-9,-5.5,3.4],[-3.3,-10.5,3.6],[3.3,-10.5,3.6],[9,-5.5,3.4]].forEach(q => mk('ellipse', {cx:q[0], cy:q[1], rx:q[2], ry:q[2]*1.15, fill:col || '#FFFFFF'}, g));
  return g;
}
const TAILPIV = {cat:[-36,-30], bunny:[-46,-30], otter:[-30,-20], squirrel:[26,-42], panda:[-40,-28]};

function drawTail(kind, g, P){
  if (kind === 'cat'){
    const d = 'M-36 -30 C -92 -28 -120 -66 -106 -114 C -100 -136 -80 -140 -72 -126';
    mk('path', {d, fill:'none', stroke:OL, 'stroke-width':30, 'stroke-linecap':'round'}, g);
    mk('path', {d, fill:'none', stroke:P.patch, 'stroke-width':21, 'stroke-linecap':'round'}, g);
    mk('path', {d, fill:'none', stroke:P.stripe, 'stroke-width':21, 'stroke-dasharray':'9 20', 'stroke-dashoffset':'-10'}, g);
    mk('path', {d, fill:'none', stroke:'#FFFFFF', 'stroke-width':6, 'stroke-linecap':'round', opacity:0.28, transform:'translate(3 -4)'}, g);
    mk('path', {d:'M-82 -132 C -78 -138 -72 -134 -72 -126', fill:'none', stroke:'#FFFFFF', 'stroke-width':12, 'stroke-linecap':'round'}, g);
  } else if (kind === 'bunny'){
    mk('circle', SK({cx:-46, cy:-30, r:21, fill:P.fur}), g);
    mk('path', {d:'M-54 -40 q6 -6 14 -2', fill:'none', stroke:'#EDE1D4', 'stroke-width':3, 'stroke-linecap':'round'}, g);
  } else if (kind === 'otter'){
    mk('path', SK({d:'M-30 -18 C -78 -12 -116 -26 -140 -58 C -126 -56 -108 -50 -94 -50 C -70 -48 -52 -50 -36 -54 Z', fill:P.fur}), g);
  } else if (kind === 'panda'){
    mk('circle', SK({cx:-46, cy:-28, r:16, fill:P.fur}), g);
  } else {
    mk('path', SK({d:'M24 -40 C 104 -36 166 -104 154 -186 C 146 -250 66 -270 44 -216 C 30 -180 66 -156 92 -178 C 108 -126 82 -88 32 -92 Z', fill:P.fur}), g);
    mk('path', {d:'M44 -62 C 110 -66 144 -124 136 -180 C 130 -220 84 -234 68 -210 C 86 -206 110 -194 110 -166 C 112 -120 88 -82 44 -76 Z', fill:P.tail2}, g);
    mk('path', {d:'M120 -120 q10 -6 14 4 M130 -168 q10 -2 10 8 M98 -200 q8 -8 16 -2', fill:'none', stroke:'#D9732F', 'stroke-width':3, 'stroke-linecap':'round'}, g);
    mk('path', {d:'M60 -228 C 80 -244 120 -236 132 -206', fill:'none', stroke:'#FFFFFF', 'stroke-width':7, 'stroke-linecap':'round', opacity:0.35}, g);
  }
}

function drawHead(kind, c, P, id){
  const h = c.head;
  c.earBL = G(h); c.earBR = G(h);
  if (kind === 'cat'){
    mk('path', SK({d:'M-78 -20 L-70 -100 L-20 -64 Z', fill:P.fur}), c.earBL);
    mk('path', {d:'M-66 -38 L-62 -84 L-36 -63 Z', fill:P.inner}, c.earBL);
    mk('path', SK({d:'M78 -20 L70 -100 L20 -64 Z', fill:P.patch}), c.earBR);
    mk('path', {d:'M66 -38 L62 -84 L36 -63 Z', fill:P.inner}, c.earBR);
    c.earPiv = [[-50,-46],[50,-46]];
  } else if (kind === 'squirrel'){
    mk('path', SK({d:'M-76 -24 L-62 -114 L-20 -66 Z', fill:P.fur}), c.earBL);
    mk('path', {d:'M-64 -42 L-56 -94 L-34 -66 Z', fill:P.inner}, c.earBL);
    mk('path', SK({d:'M76 -24 L62 -114 L20 -66 Z', fill:P.fur}), c.earBR);
    mk('path', {d:'M64 -42 L56 -94 L34 -66 Z', fill:P.inner}, c.earBR);
    [[c.earBL,-1],[c.earBR,1]].forEach(q => { const k = q[1]; mk('path', SK({d:`M${k*56} -104 Q${k*50} -122 ${k*62} -130 Q${k*58} -120 ${k*70} -114 Q${k*72} -106 ${k*66} -100 Z`, fill:'#D46F32'}, 3.2), q[0]); });
    c.earPiv = [[-48,-48],[48,-48]];
  } else if (kind === 'bunny'){
    [c.earBL, c.earBR].forEach(e => {
      mk('ellipse', SK({cx:0, cy:-62, rx:30, ry:66, fill:P.fur}), e);
      mk('ellipse', {cx:2, cy:-58, rx:15, ry:48, fill:P.inner}, e);
      mk('ellipse', {cx:-9, cy:-92, rx:5, ry:20, fill:'#FFFFFF', opacity:0.5}, e);
    });
    c.earL = c.earBL; c.earR = c.earBR;
  } else if (kind === 'otter' || kind === 'panda'){
    const r = kind === 'panda' ? 23 : 18, ex = kind === 'panda' ? 62 : 66;
    [c.earBL, c.earBR].forEach((g, i) => {
      const s = i ? 1 : -1;
      mk('circle', SK({cx:s*ex, cy:-46, r, fill: kind === 'panda' ? P.dark : P.fur}), g);
      mk('circle', {cx:s*ex, cy:-44, r: r*0.45, fill:P.inner}, g);
    });
    c.earPiv = [[-ex,-32],[ex,-32]];
  }
  mk('ellipse', SK({cx:0, cy:0, rx:86, ry:72, fill:P.fur}), h);
  const cp = mk('clipPath', {id: id+'hc'}, DEFS);
  mk('ellipse', {cx:0, cy:0, rx:84, ry:70}, cp);
  const inside = mk('g', {'clip-path':`url(#${id}hc)`}, h);
  if (kind === 'cat'){
    mk('ellipse', {cx:58, cy:-44, rx:50, ry:38, fill:P.patch}, inside);
    mk('ellipse', {cx:-70, cy:-58, rx:22, ry:16, fill:P.patch}, inside);
    mk('path', {d:'M30 -76 Q32 -62 26 -52 M48 -72 Q50 -58 44 -48 M66 -64 Q66 -52 60 -44', fill:'none', stroke:P.stripe, 'stroke-width':6.5, 'stroke-linecap':'round'}, inside);
    mk('path', {d:'M-6 -74 Q-4 -64 -8 -58', fill:'none', stroke:'#C9C5CF', 'stroke-width':5, 'stroke-linecap':'round'}, inside);
  }
  if (kind === 'squirrel'){
    mk('ellipse', {cx:-34, cy:30, rx:40, ry:36, fill:P.face}, inside);
    mk('ellipse', {cx:34, cy:30, rx:40, ry:36, fill:P.face}, inside);
    mk('ellipse', {cx:0, cy:44, rx:44, ry:28, fill:P.face}, inside);
  }
  if (kind === 'otter') mk('ellipse', {cx:0, cy:32, rx:56, ry:38, fill:P.muzzle}, inside);
  if (kind === 'panda'){
    mk('ellipse', {cx:-34, cy:6, rx:21, ry:17, fill:P.dark, transform:'rotate(-24 -34 6)'}, inside);
    mk('ellipse', {cx:34, cy:6, rx:21, ry:17, fill:P.dark, transform:'rotate(24 34 6)'}, inside);
  }
  mk('ellipse', {cx:0, cy:0, rx:86, ry:72, fill:shadeGrad(kind)}, inside);
  mk('ellipse', {cx:-30, cy:-44, rx:28, ry:13, fill:'#FFFFFF', opacity:0.32, transform:'rotate(-14 -30 -44)'}, h);
  mk('ellipse', {cx:0, cy:0, rx:86, ry:72, fill:'none', stroke:OL, 'stroke-width':SWD}, h);
  c.face = G(h);
  const F = c.face;
  // eyes
  const eyeCol = kind === 'panda' ? '#2A2427' : '#3A2A28';
  c.eyes = [-32, 32].map((ex, i) => {
    const g = G(F);
    const open = G(g);
    mk('ellipse', {cx:0, cy:0, rx:10.5, ry:13.5, fill:eyeCol}, open);
    mk('ellipse', {cx:0, cy:5, rx:7, ry:6, fill:'#6B4A44', opacity:0.55}, open);
    mk('circle', {cx:-3.4, cy:-5.4, r:4.4, fill:'#fff'}, open);
    mk('circle', {cx:3.2, cy:5, r:1.8, fill:'#fff'}, open);
    const lc = kind === 'panda' ? '#FFFFFF' : OL;
    const happy = mk('path', {d:'M-11 4 Q0 -9 11 4', fill:'none', stroke:lc, 'stroke-width':4.5, 'stroke-linecap':'round'}, g);
    const sleep = mk('path', {d:'M-11 -1 Q0 8 11 -1', fill:'none', stroke:lc, 'stroke-width':4.5, 'stroke-linecap':'round'}, g);
    const sq = mk('path', {d: i ? 'M10 -7 L-4 0 L10 7' : 'M-10 -7 L4 0 L-10 7', fill:'none', stroke:lc, 'stroke-width':4.5, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, g);
    const tear = mk('path', {d:'M0 14 Q-6 24 0 28 Q6 24 0 14 Z', fill:'#9FD8F7', stroke:'#5FA9D6', 'stroke-width':2}, g);
    return {g, open, happy, sleep, sq, tear, ex};
  });
  c.brows = G(F);
  mk('path', {d:'M-46 -20 L-22 -27', stroke:OL, 'stroke-width':4, 'stroke-linecap':'round'}, c.brows);
  mk('path', {d:'M46 -20 L22 -27', stroke:OL, 'stroke-width':4, 'stroke-linecap':'round'}, c.brows);
  c.blush = [-1,1].map(s => mk('ellipse', {cx:s*56, cy:24, rx:14, ry:8.5, fill:'#FFAFBF', opacity:0.85}, F));
  if (kind === 'otter') mk('ellipse', SK({cx:0, cy:13, rx:10, ry:7, fill:'#4B3230'}, 3), F);
  else if (kind === 'panda') mk('ellipse', SK({cx:0, cy:13, rx:8, ry:5.5, fill:'#423B40'}, 2.5), F);
  else mk('ellipse', {cx:0, cy:13, rx:5.5, ry:3.8, fill:'#F28CA1'}, F);
  const my = kind === 'otter' ? 23 : 20;
  c.my = my;
  c.mouthSmile = mk('path', {d:`M-11 ${my-2} Q-5.5 ${my+5} 0 ${my-2} Q5.5 ${my+5} 11 ${my-2}`, fill:'none', stroke:OL, 'stroke-width':3.6, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, F);
  c.mouthWavy = mk('path', {d:`M-14 ${my+1} q3.5 -5 7 0 q3.5 5 7 0 q3.5 -5 7 0 q3.5 5 7 0`, fill:'none', stroke:OL, 'stroke-width':3.4, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, F);
  c.mouthOpenG = G(F);
  mk('path', {d:'M-12 0 Q0 24 12 0 Z', fill:'#E5677D', stroke:OL, 'stroke-width':3.6, 'stroke-linejoin':'round'}, c.mouthOpenG);
  mk('ellipse', {cx:0, cy:11, rx:5, ry:3.4, fill:'#FF9DB0'}, c.mouthOpenG);
  c.mouthO = mk('ellipse', SK({cx:0, cy:my+9, rx:9, ry:12, fill:'#E5677D'}, 3.6), F);
  c.mouthSmall = mk('ellipse', SK({cx:0, cy:my+3, rx:4.5, ry:5, fill:'#E5677D'}, 3), F);
  if (kind === 'cat' || kind === 'otter'){
    const wk = {fill:'none', stroke:OL, 'stroke-width':2.4, 'stroke-linecap':'round', opacity:0.75};
    [-1,1].forEach(s => {
      mk('path', Object.assign({d:`M${s*62} 10 L${s*98} 4`}, wk), F);
      mk('path', Object.assign({d:`M${s*62} 18 L${s*100} 20`}, wk), F);
    });
  }
  if (kind === 'bunny'){
    mk('path', SK({d:'M-20 -66 Q-14 -94 -2 -70 Q6 -98 14 -70 Q24 -92 26 -64', fill:P.fur}, 4), h);
  }
  // head FX
  c.sweat = mk('path', {d:'M78 -52 Q70 -36 78 -30 Q86 -36 78 -52 Z', fill:'#BFE6FF', stroke:'#6FB6E6', 'stroke-width':2.5}, h);
  c.pain = mk('path', {d:'M96 6 l10 -6 l-2 10 l10 -4 M96 26 l12 2 l-6 8 l12 2', fill:'none', stroke:'#E8525F', 'stroke-width':3.5, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, h);
  c.excl = G(h, 'translate(0 -120)');
  mk('path', SK({d:'M-5 -40 L5 -40 L3 -8 L-3 -8 Z', fill:'#FFE07A'}, 3), c.excl);
  mk('circle', SK({cx:0, cy:4, r:5, fill:'#FFE07A'}, 3), c.excl);
  // accessories
  c.phones = G(h);
  mk('path', {d:'M-90 -4 C -92 -116 92 -116 90 -4', fill:'none', stroke:OL, 'stroke-width':20, 'stroke-linecap':'round'}, c.phones);
  mk('path', {d:'M-90 -4 C -92 -116 92 -116 90 -4', fill:'none', stroke:'#C8B6F4', 'stroke-width':11, 'stroke-linecap':'round'}, c.phones);
  [-1,1].forEach(s => mk('rect', SK({x:s*92-15, y:-24, width:30, height:50, rx:14, fill:'#B9A3F0'}, 4.5), c.phones));
  c.hat = G(h);
  [[-34,-104,28],[0,-120,34],[34,-104,28]].forEach(a => mk('circle', SK({cx:a[0], cy:a[1], r:a[2], fill:'#FFFFFF'}, 4.5), c.hat));
  mk('rect', SK({x:-48, y:-96, width:96, height:28, rx:10, fill:'#FFFFFF'}, 4.5), c.hat);
  c.headMirror = G(h);
  mk('path', {d:'M-80 -40 Q0 -80 80 -40', fill:'none', stroke:OL, 'stroke-width':10, 'stroke-linecap':'round'}, c.headMirror);
  mk('path', {d:'M-80 -40 Q0 -80 80 -40', fill:'none', stroke:'#8FB8E0', 'stroke-width':5, 'stroke-linecap':'round'}, c.headMirror);
  mk('circle', SK({cx:0, cy:-62, r:16, fill:'#E8F4FF'}, 4), c.headMirror);
  mk('circle', {cx:-4, cy:-66, r:5, fill:'#fff'}, c.headMirror);
}

function makeArm(c, side){
  const g = G(c.bob);
  const o = mk('path', {fill:'none', stroke:OL, 'stroke-width':33, 'stroke-linecap':'round'}, g);
  const f = mk('path', {fill:'none', stroke:c.P.arm, 'stroke-width':24, 'stroke-linecap':'round'}, g);
  const hand = G(g);
  return {g, o, f, hand, side, items:{}};
}

function makeChar(kind, parent, opts){
  opts = opts || {};
  const P = PAL[kind];
  const c = {kind, P, sp:{}, energy: P.energy, seed: (UID * 0.37) % 1};
  const id = 'ch' + (UID++);
  c.root = G(parent);
  c.shadow = mk('ellipse', {cx:0, cy:-3, rx:66, ry:13, fill:'#5A3A30', opacity:0.17}, c.root);
  c.bob = G(c.root);
  c.tail = G(c.bob); drawTail(kind, c.tail, P);
  c.body = G(c.bob);
  mk('ellipse', SK({cx:0, cy:-58, rx:56, ry:56, fill:P.fur}), c.body);
  if (P.belly) mk('ellipse', {cx:0, cy:-46, rx:34, ry:36, fill:P.belly}, c.body);
  mk('ellipse', {cx:0, cy:-58, rx:54, ry:54, fill:shadeGrad(kind)}, c.body);
  mk('ellipse', {cx:0, cy:-84, rx:40, ry:10, fill:SHADE[kind], opacity:0.35}, c.body);
  if (kind === 'panda'){
    const cp = mk('clipPath', {id: id+'bc'}, DEFS); mk('ellipse', {cx:0, cy:-58, rx:54, ry:54}, cp);
    mk('rect', {x:-60, y:-118, width:120, height:30, fill:P.dark, 'clip-path':`url(#${id}bc)`}, c.body);
  }
  c.apron = G(c.body);
  const ac = opts.coat || APRON[kind];
  if (opts.coat){
    mk('path', S4({d:'M-50 -104 L50 -104 L54 -10 Q0 4 -54 -10 Z', fill:ac}), c.apron);
    mk('path', S4({d:'M-26 -104 L0 -70 L26 -104', fill:'#FFFFFF'}), c.apron);
    mk('rect', S4({x:18, y:-60, width:22, height:16, rx:4, fill:'#FFFFFF'}), c.apron);
  } else {
    mk('path', S4({d:'M-34 -100 L34 -100 L42 -14 Q0 0 -42 -14 Z', fill:ac}), c.apron);
    mk('path', {d:'M-30 -94 L-46 -112 M30 -94 L46 -112', stroke:OL, 'stroke-width':9, 'stroke-linecap':'round'}, c.apron);
    mk('path', {d:'M-30 -94 L-46 -112 M30 -94 L46 -112', stroke:ac, 'stroke-width':4.5, 'stroke-linecap':'round'}, c.apron);
    mk('path', {d:'M-36 -40 Q0 -30 36 -40', fill:'none', stroke:'#FFFFFF', 'stroke-width':3, 'stroke-dasharray':'5 6', opacity:0.7}, c.apron);
    pawPrint(c.apron, 0, -60, 1.05, '#FFFFFF');
  }
  c.sticker = mk('path', SK({d:'M0 -15 L4.5 -5 L15 -4.5 L7 3 L9.5 14 L0 8 L-9.5 14 L-7 3 L-15 -4.5 L-4.5 -5 Z', fill:'#FFD84D', transform:'translate(22 -64)'}, 3), c.body);
  c.footL = mk('ellipse', SK({cx:-27, cy:-7, rx:22, ry:13.5, fill:P.foot}), c.bob);
  c.footR = mk('ellipse', SK({cx:27, cy:-7, rx:22, ry:13.5, fill:P.foot}), c.bob);
  c.footL.setAttribute('rx', 23); c.footR.setAttribute('rx', 23);
  c.head = G(c.bob);
  drawHead(kind, c, P, id);
  c.armL = makeArm(c, -1);
  c.armR = makeArm(c, 1);
  c.fx = G(c.bob);
  c.lastT = undefined;
  pose(c, {});
  c.lastT = undefined;
  return c;
}
function attach(c, side, name, el){
  const arm = side < 0 ? c.armL : c.armR;
  arm.hand.appendChild(el);
  arm.items[name] = el;
  return el;
}
function armSet(arm, side, target, angle, rot){
  const sx = side*42, sy = -98;
  let px, py;
  if (target){
    let dx = target[0]-sx, dy = target[1]-sy; const d = Math.hypot(dx, dy) || 1;
    const L = clamp(d, 16, 66); px = sx + dx*L/d; py = sy + dy*L/d;
  } else {
    const th = (side < 0 ? -angle : angle) * Math.PI/180;
    px = sx - 46*Math.sin(th); py = sy + 46*Math.cos(th);
  }
  const dx = px - sx, dy = py - sy, d = Math.hypot(dx, dy) || 1;
  const nominal = 54;
  const bend = d < nominal ? Math.sqrt(nominal*nominal - d*d)*0.55 : 0;
  let nx = -dy/d, ny = dx/d; if (nx*side < 0){ nx = -nx; ny = -ny; }
  const cx = (sx+px)/2 + nx*(bend + 4), cy = (sy+py)/2 + ny*(bend + 4);
  const ds = `M${sx.toFixed(1)} ${sy} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`;
  arm.o.setAttribute('d', ds); arm.f.setAttribute('d', ds);
  T(arm.hand, `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${rot || 0})`);
  return [px, py];
}
const POSE_DEF = {x:0,y:0,s:1,rot:0,hop:0,sq:0,bt:0,tilt:0,hx:0,hy:0,aL:10,aR:10,tL:null,tR:null,rotL:0,rotR:0,L:null,R:null,
  eyes:'open',eyesL:null,eyesR:null,blink:null,mouth:'smile',chew:0,walk:null,walkAmt:1,lookX:0,lookY:0,ear:0,tail:0,
  hat:false,phones:false,apron:false,feet:true,brow:false,tear:0,sweat:0,pain:0,excl:0,blushAmt:1,sticker:false,mirror:false,
  still:false,sleep:false,tremble:0,flip:1,turn:0,shadow:true};
function pose(c, o){
  const p = Object.assign({}, POSE_DEF, o);
  const reset = SIM.reset || c.lastT === undefined || (SIM.t - c.lastT) > 0.12 || (SIM.t - c.lastT) < 0;
  const dt = SIM.dt;
  const lr = c.lastRaw || {x:p.x, hop:p.hop, tilt:p.tilt};
  const vx = reset ? 0 : (p.x - lr.x)/dt;
  const vh = reset ? 0 : (p.hop - lr.hop)/dt;
  const vt = reset ? 0 : (p.tilt - lr.tilt)/dt;
  c.lastRaw = {x:p.x, hop:p.hop, tilt:p.tilt};
  c.lastT = SIM.t;
  // ---- life layer: breathing + idle sway by personality ----
  const E = c.energy, tt = SIM.t + c.seed*17;
  const brP = p.sleep ? 4.2 : 3.1/(0.85 + 0.15*E);
  const breath = Math.sin(TAU*tt/brP);
  let tilt = p.tilt, hy = p.hy, hx = p.hx, sq = p.sq;
  if (!p.still){
    tilt += (p.sleep ? 1.2 : 2.2*E) * Math.sin(TAU*tt*0.09*E) + (p.sleep ? 0 : 0.9*E*Math.sin(TAU*tt*0.21*E + 1.3));
    hy += 1.4*breath;
    // weight shift + occasional glance so idles never loop identically
    hx += 1.6*Math.sin(TAU*tt*0.071 + 2.1);
    if (p.walk === null && !p.sleep){
      const gl = Math.sin(TAU*tt*0.043 + c.seed*9) + 0.6*Math.sin(TAU*tt*0.11 + 1.7);
      p.lookX += 2.6*clamp(gl, -1, 1); p.turn += 0.22*clamp(gl, -1, 1);
    }
  }
  sq += 0.014*breath;
  if (p.tremble) hx += p.tremble*2.2*Math.sin(TAU*tt*13);
  // ---- springs (secondary motion) ----
  const headLag = spring(c, 'hl', clamp(-vx*0.014, -9, 9), 110, 19, reset);
  hx += headLag;
  if (reset) c.sp.land = {x:0, v:0};
  if (!reset && lr.hop > 2 && p.hop <= 0.5 && vh < -40){
    c.sp.land = c.sp.land || {x:0, v:0};
    c.sp.land.v -= clamp(Math.abs(vh)*0.012, 0.5, 2.2);
  }
  const land = spring(c, 'land', 0, 260, 18, reset);
  sq += clamp(land*0.09, -0.08, 0.1) - clamp(Math.abs(vh)*0.00035, 0, 0.05);
  const earS = spring(c, 'ear', clamp(p.ear - vx*0.035 + vt*0.11 - vh*0.05, -24, 24), 80, 12, reset);
  const tailS = spring(c, 'tail', clamp(p.tail - vx*0.05 + vh*0.05 + (p.still ? 0 : 3*E*Math.sin(TAU*tt*0.33*E)), -32, 32), 45, 9, reset);
  const flickP = 4.3 + c.seed*3.1, flick = p.sleep ? 0 : bump(mod(tt, flickP), 0, 0.28);
  const twitch = spring(c, 'tw', vt*0.06 + 7*flick, 140, 10, reset);
  // head turn toward travel direction (face features slide, ears counter-shift)
  const turnS = spring(c, 'turn', clamp(p.turn + vx*0.006*p.flip, -1, 1), 70, 13, reset);
  // ---- walk ----
  let bob = 0, fl = 0, fr = 0, aL = p.aL, aR = p.aR, bt = p.bt;
  let walkLean = 0, stepSquash = 0, sxL = 0, sxR = 0;
  if (p.walk !== null){
    const ph = TAU*p.walk, A = p.walkAmt;
    // Raised-cosine steps eliminate the hard acceleration at foot contact.
    const lift = v => Math.pow(Math.max(0, v), 1.5);
    fl = MOTION.walkLift*A*lift(Math.sin(ph));
    fr = MOTION.walkLift*A*lift(-Math.sin(ph));
    // alternating stride: the lifted foot swings back -> front in the travel direction
    const dir = (vx*p.flip) < -1 ? -1 : 1;
    sxL = -dir*9*A*Math.cos(ph); sxR = dir*9*A*Math.cos(ph);
    bob = MOTION.walkBob*A*(0.5 - 0.5*Math.cos(2*ph));
    aL += 12*A*Math.sin(ph); aR -= 12*A*Math.sin(ph);
    walkLean = MOTION.walkSway*A*Math.sin(ph);
    stepSquash = 0.012*A*Math.cos(2*ph);
    tilt += 1.8*A*Math.sin(ph);
  }
  bt += clamp(vx*0.012, -6, 6) + walkLean;
  sq += stepSquash;
  T(c.root, `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${(p.s*p.flip).toFixed(4)} ${p.s.toFixed(4)})${p.rot ? ` rotate(${p.rot} 0 -60)` : ''}`);
  T(c.bob, `translate(0 ${(-p.hop - bob).toFixed(2)}) rotate(${bt.toFixed(2)}) scale(${(1 + sq + MOTION.breathScale*breath).toFixed(4)} ${(1 - sq - MOTION.breathScale*breath).toFixed(4)})`);
  c.footL.setAttribute('cy', (-7 - fl).toFixed(2)); c.footR.setAttribute('cy', (-7 - fr).toFixed(2));
  c.footL.setAttribute('cx', (-27 + sxL).toFixed(2)); c.footR.setAttribute('cx', (27 + sxR).toFixed(2));
  const shOn = p.shadow && p.feet && Math.abs(p.rot) < 25 && !p.sleep;
  show(c.shadow, shOn);
  if (shOn){ const k = clamp(1 - (p.hop + bob)/220, 0.55, 1); T(c.shadow, `scale(${k.toFixed(3)} ${k.toFixed(3)})`); c.shadow.setAttribute('opacity', (0.17*k).toFixed(3)); }
  T(c.face, `translate(${(13*turnS).toFixed(2)} ${(1.5*Math.abs(turnS)).toFixed(2)})`);
  show(c.footL, p.feet); show(c.footR, p.feet);
  T(c.head, `translate(${hx.toFixed(2)} ${(-150 + hy).toFixed(2)}) rotate(${tilt.toFixed(2)} 0 60)`);
  const pl = armSet(c.armL, -1, p.tL, aL, p.rotL);
  const pr = armSet(c.armR, 1, p.tR, aR, p.rotR);
  for (const k in c.armL.items) show(c.armL.items[k], p.L === k);
  for (const k in c.armR.items) show(c.armR.items[k], p.R === k);
  // blink (auto unless given)
  const blink = p.blink === null ? blinkAt(SIM.t, 3.6 + c.seed*2.2, c.seed*3) : p.blink;
  const em = [p.eyesL || p.eyes, p.eyesR || p.eyes];
  c.eyes.forEach((e, i) => {
    T(e.g, `translate(${e.ex + p.lookX} ${2 + p.lookY})`);
    show(e.open, em[i] === 'open'); T(e.open, `scale(1 ${blink.toFixed(3)})`);
    show(e.happy, em[i] === 'happy'); show(e.sleep, em[i] === 'sleep'); show(e.sq, em[i] === 'squeeze');
    show(e.tear, p.tear > 0.01); if (p.tear > 0.01){ e.tear.setAttribute('opacity', p.tear.toFixed(3)); T(e.tear, `translate(0 ${(8*mod(SIM.t*0.8 + i*0.5, 1)).toFixed(2)})`); }
  });
  show(c.brows, !!p.brow);
  show(c.mouthSmile, p.mouth === 'smile');
  show(c.mouthWavy, p.mouth === 'wavy');
  show(c.mouthSmall, p.mouth === 'small');
  const mo = p.mouth === 'open' || p.mouth === 'chew' || p.mouth === 'talk';
  show(c.mouthOpenG, mo);
  if (mo){
    const sc = p.mouth === 'chew' ? 0.3 + 0.7*p.chew : (p.mouth === 'talk' ? 0.35 + 0.65*Math.abs(Math.sin(TAU*SIM.t*3.2)) : 1);
    T(c.mouthOpenG, `translate(0 ${c.my - 3}) scale(1 ${sc.toFixed(3)})`);
  }
  show(c.mouthO, p.mouth === 'yawn' || p.mouth === 'aah');
  if (p.mouth === 'aah') T(c.mouthO, 'scale(1.5 1.35) translate(0 -8)'); else c.mouthO.removeAttribute('transform');
  c.blush.forEach(b => b.setAttribute('opacity', (0.85*p.blushAmt).toFixed(3)));
  show(c.sweat, p.sweat > 0.01); if (p.sweat > 0.01){ c.sweat.setAttribute('opacity', p.sweat.toFixed(3)); T(c.sweat, `translate(0 ${(6*Math.sin(TAU*SIM.t*1.5)).toFixed(2)})`); }
  show(c.pain, p.pain > 0.01); if (p.pain > 0.01){ c.pain.setAttribute('opacity', p.pain.toFixed(3)); T(c.pain, `translate(${(3*Math.sin(TAU*SIM.t*9)).toFixed(2)} 0)`); }
  show(c.excl, p.excl > 0.01); if (p.excl > 0.01){ c.excl.setAttribute('opacity', clamp(p.excl*2, 0, 1).toFixed(3)); T(c.excl, `translate(0 -120) scale(${(0.6 + 0.4*sm(p.excl*2)).toFixed(3)})`); }
  T(c.tail, `rotate(${tailS.toFixed(2)} ${TAILPIV[c.kind][0]} ${TAILPIV[c.kind][1]})`);
  if (c.earL){   // upright bunny ears, pivot at the base
    T(c.earL, `translate(${(-30 - 4*turnS).toFixed(2)} -50) rotate(${(-17 - 0.8*earS - 2*breath).toFixed(2)})`);
    T(c.earR, `translate(${(30 - 4*turnS).toFixed(2)} -50) rotate(${(17 + 0.8*earS + 2*breath + 2*twitch).toFixed(2)})`);
  }
  if (c.earPiv && !c.earL){
    T(c.earBL, `rotate(${(-earS*0.35 - twitch).toFixed(2)} ${c.earPiv[0][0]} ${c.earPiv[0][1]})`);
    T(c.earBR, `rotate(${(earS*0.35 + twitch).toFixed(2)} ${c.earPiv[1][0]} ${c.earPiv[1][1]})`);
  }
  show(c.hat, p.hat); show(c.phones, p.phones); show(c.apron, p.apron); show(c.sticker, p.sticker); show(c.headMirror, p.mirror);
  c.last = {x:p.x, y:p.y, s:p.s, rot:p.rot, hop:p.hop, bob, pl, pr, hx, hy};
}
function rotPt(c, lx, ly){ // local (char space, incl. bob) -> world
  const L = c.last;
  let x = lx, y = ly - L.hop - L.bob;
  if (L.rot){ const a = L.rot*Math.PI/180, dx = x, dy = y + 60; x = dx*Math.cos(a) - dy*Math.sin(a); y = dx*Math.sin(a) + dy*Math.cos(a) - 60; }
  return [L.x + L.s*x, L.y + L.s*y];
}
function paw(c, side){ const q = side < 0 ? c.last.pl : c.last.pr; return rotPt(c, q[0], q[1]); }
function headW(c, lx, ly){ const L = c.last; return rotPt(c, L.hx + lx, -150 + L.hy + ly); }
function toLocal(o, wx, wy){ return [(wx - o.x)/o.s, (wy - o.y)/o.s]; }

/* ================= PROPS ================= */
function itMug(p, col, liquid){
  const g = G(p);
  mk('path', {d:'M15 -8 C 29 -8 29 10 15 10', fill:'none', stroke:OL, 'stroke-width':11, 'stroke-linecap':'round'}, g);
  mk('path', {d:'M15 -8 C 29 -8 29 10 15 10', fill:'none', stroke:col, 'stroke-width':4.5, 'stroke-linecap':'round'}, g);
  mk('rect', S4({x:-17, y:-19, width:34, height:38, rx:8, fill:col}), g);
  mk('ellipse', {cx:0, cy:-15, rx:13, ry:3.6, fill:liquid || '#7B4B33'}, g);
  return g;
}
function catMotif(g, x, y){
  mk('circle', {cx:x, cy:y, r:7, fill:'#fff', opacity:0.92}, g);
  mk('path', {d:`M${x-6} ${y-3} L${x-5} ${y-10} L${x-1} ${y-6} Z M${x+6} ${y-3} L${x+5} ${y-10} L${x+1} ${y-6} Z`, fill:'#fff', opacity:0.92}, g);
}
function itCarrot(p, L){
  L = L || 64;
  const g = G(p);
  const body = G(g);
  mk('path', S4({d:`M-11 0 Q-12 ${-L*0.55} 0 ${-L} Q12 ${-L*0.55} 11 0 Q0 7 -11 0 Z`, fill:'#F59A3A'}), body);
  mk('path', {d:`M-7 ${-L*0.3} h7 M2 ${-L*0.55} h6 M-5 ${-L*0.75} h5`, stroke:'#D9762A', 'stroke-width':2.4, 'stroke-linecap':'round'}, body);
  mk('path', S4({d:'M-2 2 Q-14 14 -10 22 Q-4 16 -1 6 Q2 20 10 22 Q10 10 2 2 Z', fill:'#79C66A'}), g);
  g.body = body;
  return g;
}
function itFish(p, col){
  const g = G(p);
  col = col || '#5B9BE8';
  mk('path', S4({d:'M22 0 L40 -14 L38 0 L40 14 Z', fill:col}), g);
  mk('ellipse', S4({cx:0, cy:0, rx:26, ry:14, fill:col}), g);
  mk('path', {d:'M-20 4 Q0 14 20 4', fill:'none', stroke:'#FFFFFF', 'stroke-width':3, 'stroke-linecap':'round', opacity:0.6}, g);
  mk('circle', {cx:-14, cy:-3, r:3, fill:OL}, g);
  return g;
}
function itAcorn(p, s){
  const g = G(p, `scale(${s||1})`);
  mk('ellipse', S4({cx:0, cy:4, rx:11, ry:13, fill:'#D99357'}), g);
  mk('path', S4({d:'M-14 -2 Q-14 -15 0 -15 Q14 -15 14 -2 Z', fill:'#8A5A34'}), g);
  mk('path', {d:'M0 -15 q1 -7 6 -9', stroke:OL, 'stroke-width':3.5, fill:'none', 'stroke-linecap':'round'}, g);
  mk('circle', {cx:-4, cy:4, r:3, fill:'#fff', opacity:0.45}, g);
  return g;
}
function itCamera(p){
  const g = G(p);
  mk('rect', S4({x:-14, y:-26, width:16, height:8, rx:3, fill:'#6E717B'}), g);
  mk('rect', S4({x:-28, y:-20, width:56, height:38, rx:9, fill:'#8C909C'}), g);
  mk('circle', S4({cx:0, cy:0, r:13, fill:'#3B3E48'}), g);
  mk('circle', {cx:-4, cy:-4, r:4, fill:'#fff', opacity:0.7}, g);
  mk('circle', {cx:20, cy:-12, r:3, fill:'#FFE38A'}, g);
  return g;
}
function itPhone(p){
  const g = G(p, 'rotate(-12)');
  mk('rect', S4({x:-12, y:-24, width:24, height:46, rx:7, fill:'#FFC3D2'}), g);
  mk('rect', {x:-8, y:-18, width:16, height:30, rx:3, fill:'#FFF6FA'}, g);
  mk('circle', {cx:0, cy:17, r:2.5, fill:OL}, g);
  return g;
}
function itIcePack(p){
  const g = G(p);
  mk('rect', SK({x:-22, y:-18, width:44, height:36, rx:12, fill:'#BFE6FF'}, 4), g);
  mk('path', {d:'M-12 -6 h10 M-6 4 h14', stroke:'#FFFFFF', 'stroke-width':4, 'stroke-linecap':'round'}, g);
  mk('path', S4({d:'M-6 -14 l4 -6 l4 6 M8 -10 l3 -5 l3 5', fill:'none'}), g);
  return g;
}
function itToothbrush(p, col){
  const g = G(p, 'rotate(-60)');
  mk('rect', S4({x:-5, y:-8, width:10, height:58, rx:5, fill:col || '#8FD6C4'}), g);
  mk('rect', S4({x:-7, y:-26, width:14, height:20, rx:3, fill:'#FFFFFF'}, 3), g);
  mk('path', {d:'M-5 -22 v12 M0 -22 v12 M5 -22 v12', stroke:'#BFE3F5', 'stroke-width':2.4}, g);
  return g;
}
function itPudding(p){
  const g = G(p);
  mk('path', S4({d:'M-18 -14 L18 -14 L14 16 L-14 16 Z', fill:'#F3FAFF', 'fill-opacity':0.8}), g);
  mk('path', {d:'M-15 -6 L15 -6 L13 14 L-13 14 Z', fill:'#FFE59E'}, g);
  mk('path', {d:'M-15 -6 L15 -6 L15 -1 L-15 -1 Z', fill:'#C9853F'}, g);
  mk('circle', S4({cx:6, cy:-16, r:5, fill:'#F06A5A'}, 2.6), g);
  return g;
}
function itSpoon(p, col){
  const g = G(p);
  mk('path', {d:'M0 10 L0 -16', stroke:OL, 'stroke-width':9, 'stroke-linecap':'round'}, g);
  mk('path', {d:'M0 10 L0 -16', stroke:col || '#E3E9EF', 'stroke-width':4, 'stroke-linecap':'round'}, g);
  mk('ellipse', S4({cx:0, cy:-22, rx:8, ry:10, fill:col || '#E3E9EF'}), g);
  return g;
}
function itDentMirror(p){
  const g = G(p, 'rotate(-58)');
  mk('path', {d:'M0 10 L0 -40', stroke:OL, 'stroke-width':8, 'stroke-linecap':'round'}, g);
  mk('path', {d:'M0 10 L0 -40', stroke:'#D5DDE5', 'stroke-width':3.5, 'stroke-linecap':'round'}, g);
  mk('circle', S4({cx:0, cy:-46, r:8, fill:'#E8F4FF'}, 3), g);
  return g;
}
function itPolisher(p){
  const g = G(p, 'rotate(-55)');
  mk('rect', S4({x:-6, y:-44, width:12, height:56, rx:6, fill:'#E8EEF4'}), g);
  mk('rect', S4({x:-4, y:-54, width:8, height:12, rx:3, fill:'#8FB8E0'}, 3), g);
  mk('path', {d:'M0 12 Q10 40 -6 70', fill:'none', stroke:'#BFC8D2', 'stroke-width':4}, g);
  return g;
}
function itPaperCup(p){
  const g = G(p);
  mk('path', S4({d:'M-14 -16 L14 -16 L10 16 L-10 16 Z', fill:'#FFFFFF'}), g);
  mk('path', {d:'M-12 -6 L12 -6', stroke:'#8FD6C4', 'stroke-width':4}, g);
  mk('ellipse', {cx:0, cy:-14, rx:11, ry:2.5, fill:'#BFE6FF'}, g);
  return g;
}
function itNotebook(p){
  const g = G(p);
  mk('rect', S4({x:-28, y:-34, width:56, height:64, rx:6, fill:'#C9B6F2'}), g);
  mk('rect', {x:-22, y:-28, width:44, height:52, rx:3, fill:'#FFFDF6'}, g);
  mk('path', {d:'M-16 -16 h30 M-16 -6 h30 M-16 4 h22', stroke:'#C9B9AE', 'stroke-width':3, 'stroke-linecap':'round'}, g);
  mk('circle', {cx:12, cy:14, r:6, fill:'none', stroke:'#F28CA1', 'stroke-width':2.5}, g);
  return g;
}
function itStar(p, s){
  return mk('path', SK({d:'M0 -15 L4.5 -5 L15 -4.5 L7 3 L9.5 14 L0 8 L-9.5 14 L-7 3 L-15 -4.5 L-4.5 -5 Z', fill:'#FFD84D', transform:`scale(${s||1})`}, 3), p);
}

/* ---- FX ---- */
const HEART_D = 'M0 10 C -22 -6 -22 -24 -10 -26 C -4 -27 0 -22 0 -18 C 0 -22 4 -27 10 -26 C 22 -24 22 -6 0 10 Z';
const STAR_D = 'M0 -14 C 2 -4 4 -2 14 0 C 4 2 2 4 0 14 C -2 4 -4 2 -14 0 C -4 -2 -2 -4 0 -14 Z';
const NOTE_D = 'M-6 0 a6.5 5 -20 1 0 13 0 a6.5 5 -20 1 0 -13 0 Z M5.5 -1 L5.5 -28 Q14 -24 16 -14 Q12 -18 7 -19 Z';
function heartBursts(parent, bursts){
  const els = [];
  const cols = ['#FF7C9C', '#FF9DB5', '#FF6B8E', '#FFB3C7'];
  bursts.forEach((b, bi) => { for (let k=0;k<(b.n||3);k++) els.push({el: mk('path', {d:HEART_D, fill:cols[(bi+k)%4], stroke:OL, 'stroke-width':2.5, opacity:0}, parent), b, k}); });
  return function(u){
    els.forEach(h => {
      const v = (u - (h.b.t + 0.4*h.k)) / 2.6;
      if (v <= 0 || v >= 1){ h.el.setAttribute('opacity', 0); return; }
      const n = h.b.n || 3;
      const x = h.b.x + (h.k - (n-1)/2)*40 + 10*Math.sin(TAU*v*1.4 + h.k);
      const y = h.b.y - 150*v;
      h.el.setAttribute('opacity', Math.pow(Math.sin(Math.PI*v), 0.6).toFixed(3));
      T(h.el, `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.7 + 0.5*Math.min(v*3, 1)).toFixed(3)})`);
    });
  };
}
function sparkles(parent, list){
  const els = [];
  list.forEach(b => { for (let k=0;k<(b.n||4);k++) els.push({el: mk('path', {d:STAR_D, fill:'#FFE07A', stroke:OL, 'stroke-width':2, opacity:0}, parent), b, k, a: k/(b.n||4)*TAU + 0.4}); });
  return function(u){
    els.forEach(s => {
      const v = (u - s.b.t - s.k*0.1) / 1.3;
      if (v <= 0 || v >= 1){ s.el.setAttribute('opacity', 0); return; }
      const r = (s.b.r || 60) * (0.6 + 0.4*v);
      s.el.setAttribute('opacity', Math.sin(Math.PI*v).toFixed(3));
      T(s.el, `translate(${(s.b.x + r*Math.cos(s.a)).toFixed(1)} ${(s.b.y + r*Math.sin(s.a)*0.8).toFixed(1)}) rotate(${(v*90).toFixed(1)}) scale(${(0.5 + 0.6*Math.sin(Math.PI*v)).toFixed(3)})`);
    });
  };
}
function steam(parent, n){
  const ws = [];
  for (let i=0;i<(n||3);i++) ws.push(mk('path', {d:'M0 0 C -8 -12 8 -24 0 -38', fill:'none', stroke:'#FFFFFF', 'stroke-width':5, 'stroke-linecap':'round', opacity:0}, parent));
  return function(x, y, u, amt, spread){
    ws.forEach((w, i) => {
      const v = mod(u*0.42 + i/ws.length, 1);
      T(w, `translate(${(x + (i - (ws.length-1)/2)*(spread||12) + 5*Math.sin(TAU*v + i)).toFixed(1)} ${(y - 44*v).toFixed(1)}) scale(${(0.7 + 0.5*v).toFixed(3)})`);
      w.setAttribute('opacity', (Math.sin(Math.PI*v) * 0.7 * amt).toFixed(3));
    });
  };
}
function zText(parent){
  const zs = [0,1,2].map(i => { const e = mk('text', {'font-family':FONT, 'font-size':30 + i*8, 'font-weight':700, fill:'#8E7BC4', opacity:0}, parent); e.textContent = 'z'; return e; });
  return function(x, y, u, amt){
    zs.forEach((z, i) => {
      const v = mod(u*0.4 + i/3, 1);
      z.setAttribute('x', (x + 30*v + i*6).toFixed(1)); z.setAttribute('y', (y - 70*v).toFixed(1));
      z.setAttribute('opacity', (Math.sin(Math.PI*v)*amt).toFixed(3));
    });
  };
}
function bubblesFx(parent, n, col){
  const bs = [];
  for (let i=0;i<n;i++) bs.push({el: mk('circle', {r:R(4,9), fill:col || '#FFFFFF', 'fill-opacity':0.85, stroke:'#BFE3F5', 'stroke-width':2, opacity:0}, parent), ph:rnd(), dx:R(-1,1)});
  return function(x, y, u, amt, spread, rise){
    bs.forEach(b => {
      const v = mod(u*0.7 + b.ph, 1);
      b.el.setAttribute('cx', (x + b.dx*(spread||20) + 6*Math.sin(TAU*(v + b.ph))).toFixed(1));
      b.el.setAttribute('cy', (y - (rise||50)*v).toFixed(1));
      b.el.setAttribute('opacity', (Math.sin(Math.PI*v)*amt).toFixed(3));
    });
  };
}
function cloudShape(parent, x, y, s, col){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  const f = col || '#FFFFFF';
  mk('ellipse', {cx:0, cy:0, rx:80, ry:22, fill:f}, g);
  mk('circle', {cx:-34, cy:-12, r:26, fill:f}, g);
  mk('circle', {cx:4, cy:-24, r:34, fill:f}, g);
  mk('circle', {cx:38, cy:-10, r:24, fill:f}, g);
  return g;
}
function txt(parent, x, y, str, size, col, anchor, weight){
  const e = mk('text', {x, y, 'font-family':FONT, 'font-size':size, fill:col || OL, 'text-anchor':anchor || 'middle', 'font-weight':weight || 700}, parent);
  e.textContent = str; return e;
}
function pot(parent, x, y, col, leafCol){
  const g = G(parent, `translate(${x} ${y})`);
  const lv = G(g);
  [[-30,-60,-30],[0,-74,0],[28,-58,28],[-14,-46,-50],[16,-46,46]].forEach(a => mk('ellipse', S4({cx:a[0], cy:a[1], rx:13, ry:26, fill:leafCol || '#8ED081', transform:`rotate(${a[2]} ${a[0]} ${a[1]})`}), lv));
  mk('path', S4({d:'M-26 -26 L26 -26 L20 6 L-20 6 Z', fill:col || '#E9A285'}), g);
  mk('rect', S4({x:-30, y:-34, width:60, height:12, rx:4, fill:col || '#E9A285'}), g);
  g.lv = lv; return g;
}
function label(parent, text, iconFn){
  const g = G(parent);
  const pill = mk('rect', SK({x:0, y:0, width:300, height:72, rx:36, fill:'#FFFDF8', 'fill-opacity':0.92}, 4), g);
  const ic = G(g, 'translate(44 36)');
  iconFn(ic);
  const tx = mk('text', {x:82, y:48, 'font-family':FONT, 'font-weight':700, 'font-size':34, fill:OL}, g);
  tx.textContent = text;
  g.fit = () => { try { pill.setAttribute('width', 82 + tx.getComputedTextLength() + 34); } catch(e){} };
  return g;
}
function lin(id, stops, x2, y2){
  const g = mk('linearGradient', {id, x1:0, y1:0, x2: x2 === undefined ? 0 : x2, y2: y2 === undefined ? 1 : y2}, DEFS);
  stops.forEach(s => mk('stop', {offset:s[0], 'stop-color':s[1], 'stop-opacity': s[2] === undefined ? 1 : s[2]}, g));
}
function rad(id, stops){
  const g = mk('radialGradient', {id}, DEFS);
  stops.forEach(s => mk('stop', {offset:s[0], 'stop-color':s[1], 'stop-opacity': s[2] === undefined ? 1 : s[2]}, g));
}
const BOOKC = ['#B79BE8','#FFB3C7','#9FD3E8','#FFD27A','#A6E3C3','#F7A97B','#C9B6F2'];
// chapter icons
const ICONS = {
  sun: g => { mk('circle', S4({r:15, fill:'#FFD25A'}), g); for (let i=0;i<8;i++){ const a = i*TAU/8; mk('path', {d:`M${21*Math.cos(a)} ${21*Math.sin(a)} L${27*Math.cos(a)} ${27*Math.sin(a)}`, stroke:OL, 'stroke-width':3.5, 'stroke-linecap':'round'}, g); } },
  moon: g => { mk('path', S4({d:'M6 -18 A18 18 0 1 0 18 8 A14 14 0 1 1 6 -18 Z', fill:'#FFE38A'}), g); },
  tooth: g => { mk('path', S4({d:'M-16 -14 Q-16 -22 -6 -20 Q0 -18 6 -20 Q16 -22 16 -14 Q16 0 10 18 Q6 22 4 12 Q0 4 -4 12 Q-6 22 -10 18 Q-16 0 -16 -14 Z', fill:'#FFFFFF'}), g); },
  chair: g => { mk('rect', S4({x:-18, y:-12, width:36, height:16, rx:7, fill:'#9FD6C8'}), g); mk('rect', S4({x:-18, y:-24, width:10, height:20, rx:4, fill:'#9FD6C8'}), g); mk('path', {d:'M-12 4 v14 M12 4 v14', stroke:OL, 'stroke-width':3.5, 'stroke-linecap':'round'}, g); }
};
/* ---- props for Episode 3 ---- */
function itPillow(p, col){
  const g = G(p);
  mk('path', SK({d:'M-40 -26 Q0 -36 40 -26 Q50 0 40 26 Q0 36 -40 26 Q-50 0 -40 -26 Z', fill:col || '#FFC3D2'}), g);
  mk('path', {d:'M-24 -8 Q0 6 24 -8', fill:'none', stroke:'#FFFFFF', 'stroke-width':4, opacity:0.7}, g);
  return g;
}
const DICE_PIPS = {1:[[0,0]],2:[[-8,-8],[8,8]],3:[[-8,-8],[0,0],[8,8]],4:[[-8,-8],[8,-8],[-8,8],[8,8]],5:[[-8,-8],[8,-8],[0,0],[-8,8],[8,8]],6:[[-8,-9],[8,-9],[-8,0],[8,0],[-8,9],[8,9]]};
function itDice(p){
  const g = G(p);
  mk('rect', S4({x:-17, y:-17, width:34, height:34, rx:8, fill:'#FFFFFF'}), g);
  g.pipsG = G(g);
  g.setN = function(n){ while (g.pipsG.firstChild) g.pipsG.removeChild(g.pipsG.firstChild); (DICE_PIPS[n] || []).forEach(q => mk('circle', {cx:q[0], cy:q[1], r:3.6, fill: n === 1 ? '#F06A5A' : OL}, g.pipsG)); };
  g.setN(6);
  return g;
}
function itPiece(p, col){
  const g = G(p);
  mk('ellipse', S4({cx:0, cy:0, rx:15, ry:6, fill:col}, 3), g);
  mk('path', S4({d:'M-12 0 Q-6 -26 0 -30 Q6 -26 12 0 Z', fill:col}, 3), g);
  mk('circle', S4({cx:0, cy:-32, r:8, fill:col}, 3), g);
  mk('circle', {cx:-3, cy:-35, r:2.5, fill:'#FFFFFF', opacity:0.8}, g);
  return g;
}
function itBlanketWrap(p){
  const g = G(p);
  mk('path', SK({d:'M-76 -44 Q-90 -112 -44 -122 Q0 -96 44 -122 Q90 -112 76 -44 Q84 -6 0 -2 Q-84 -6 -76 -44 Z', fill:'url(#quiltF)'}), g);
  mk('path', {d:'M-50 -84 Q0 -66 50 -84', fill:'none', stroke:'#FFFFFF', 'stroke-width':6, opacity:0.5}, g);
  return g;
}
/* ---- props for Episode 4 (outdoors) ---- */
function itBasket(p){
  const g = G(p);
  mk('path', {d:'M-34 -24 Q0 -70 34 -24', fill:'none', stroke:OL, 'stroke-width':10, 'stroke-linecap':'round'}, g);
  mk('path', {d:'M-34 -24 Q0 -70 34 -24', fill:'none', stroke:'#C58B4E', 'stroke-width':4.5, 'stroke-linecap':'round'}, g);
  mk('path', S4({d:'M-30 -28 L30 -28 L18 -40 L-18 -40 Z', fill:'#F06A7A'}), g);
  mk('path', S4({d:'M-40 -26 L40 -26 L32 22 L-32 22 Z', fill:'#D9A066'}), g);
  mk('path', {d:'M-38 -10 H38 M-36 6 H36', stroke:'#B97F4A', 'stroke-width':3}, g);
  mk('path', {d:'M-18 -26 L-15 22 M0 -26 V22 M18 -26 L15 22', stroke:'#B97F4A', 'stroke-width':3}, g);
  return g;
}
function itSandwich(p){
  const g = G(p); const b = G(g); g.body = b;
  mk('path', S4({d:'M-24 14 L24 14 L0 -26 Z', fill:'#F6D9A0'}), b);
  mk('path', {d:'M-20 6 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0', fill:'none', stroke:'#79C66A', 'stroke-width':5, 'stroke-linecap':'round'}, b);
  mk('path', {d:'M-17 10 H17', stroke:'#F06A5A', 'stroke-width':4}, b);
  return g;
}
function itMelon(p){
  const g = G(p); const b = G(g); g.body = b;
  mk('path', S4({d:'M-26 -6 A26 26 0 0 0 26 -6 Z', fill:'#FF6B7E'}), b);
  mk('path', {d:'M-26 -6 A26 26 0 0 0 26 -6', fill:'none', stroke:'#EFF8D8', 'stroke-width':5}, b);
  mk('path', {d:'M-30 -6 A30 30 0 0 0 30 -6', fill:'none', stroke:'#5DB04E', 'stroke-width':6}, b);
  [[-10,4],[0,10],[10,4]].forEach(q => mk('ellipse', {cx:q[0], cy:q[1], rx:2.2, ry:3.6, fill:'#3A1F22'}, b));
  return g;
}
function itShovel(p, col){
  const g = G(p, 'rotate(20)');
  mk('path', {d:'M0 -30 L0 18', stroke:OL, 'stroke-width':9, 'stroke-linecap':'round'}, g);
  mk('path', {d:'M0 -30 L0 18', stroke:col || '#FFD27A', 'stroke-width':4, 'stroke-linecap':'round'}, g);
  mk('path', S4({d:'M-12 16 L12 16 L8 38 Q0 46 -8 38 Z', fill:col || '#FFD27A'}), g);
  return g;
}
function itBucket(p, col){
  const g = G(p);
  mk('path', {d:'M-18 -14 Q0 -40 18 -14', fill:'none', stroke:OL, 'stroke-width':3.5}, g);
  mk('path', S4({d:'M-20 -14 L20 -14 L15 20 L-15 20 Z', fill:col || '#9FD3F5'}), g);
  mk('path', {d:'M-19 -6 H19', stroke:'#FFFFFF', 'stroke-width':4, opacity:0.7}, g);
  return g;
}
function itFlower(p, col){
  const g = G(p);
  mk('path', {d:'M0 0 Q4 18 0 34', fill:'none', stroke:'#5FA85B', 'stroke-width':4, 'stroke-linecap':'round'}, g);
  for (let k=0;k<5;k++) mk('ellipse', S4({cx:0, cy:-9, rx:6, ry:9, fill:col || '#FFB3C7', transform:`rotate(${k*72})`}, 2.4), g);
  mk('circle', S4({r:5, fill:'#FFD84D'}, 2.4), g);
  return g;
}
function itShell(p){
  const g = G(p);
  mk('path', S4({d:'M0 14 L-18 -4 Q-14 -18 0 -20 Q14 -18 18 -4 Z', fill:'#FFC6D2'}, 3), g);
  mk('path', {d:'M0 14 L-10 -14 M0 14 L0 -19 M0 14 L10 -14', stroke:'#E8889E', 'stroke-width':2.4}, g);
  mk('rect', S4({x:-6, y:12, width:12, height:6, rx:2, fill:'#FFC6D2'}, 2.4), g);
  return g;
}
function itBook(p, col){
  const g = G(p);
  mk('path', S4({d:'M0 -24 Q-20 -30 -38 -24 L-38 22 Q-20 16 0 22 Z', fill:'#FFFDF6'}), g);
  mk('path', S4({d:'M0 -24 Q20 -30 38 -24 L38 22 Q20 16 0 22 Z', fill:'#FFFDF6'}), g);
  mk('path', {d:'M-30 -12 h22 M-30 -3 h22 M-30 6 h16 M8 -12 h22 M8 -3 h22 M8 6 h18', stroke:'#CDBFB4', 'stroke-width':2.4, 'stroke-linecap':'round'}, g);
  mk('path', S4({d:'M-40 22 Q-20 18 0 26 Q20 18 40 22 L40 28 Q20 24 0 32 Q-20 24 -40 28 Z', fill:col || '#B79BE8'}), g);
  return g;
}
