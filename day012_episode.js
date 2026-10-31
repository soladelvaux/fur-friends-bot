/* =====================================================================
   FUR FRIENDS — Day 12: "First Snow Day"   (180 s)
   first snowflakes → building a snowman → sledding hill → cocoa by the fire
   ===================================================================== */
const SCARF = {momo:'#B79BE8', pipi:'#FF9DB5', otto:'#8FD6C4', kuku:'#FFD27A'};
function scarf(a, col){
  const s = G(a.c.body);
  mk('path', SK({d:'M-50 -112 Q0 -92 50 -112 L52 -96 Q0 -76 -52 -96 Z', fill:col}, 4), s);
  mk('path', SK({d:'M22 -98 L30 -50 L46 -52 L40 -100 Z', fill:col}, 4), s);
  mk('path', {d:'M-40 -104 Q0 -88 40 -104', fill:'none', stroke:'#FFFFFF', 'stroke-width':4, opacity:0.6, 'stroke-dasharray':'8 8'}, s);
  return s;
}
function itSnowball(p, s){ const g = G(p, `scale(${s || 1})`); mk('circle', S4({r:13, fill:'#FFFFFF'}), g); mk('circle', {cx:-4, cy:-4, r:4, fill:'#E8F2FC'}, g); return g; }
function splatFx(layer){
  const ps = []; for (let i=0;i<8;i++) ps.push({el: mk('circle', {r:R(5,9), fill:'#FFFFFF', stroke:'#D2E3F4', 'stroke-width':2, opacity:0}, layer), a:i/8*TAU});
  return function(u, t0, p){ const v = (u - t0)/0.7; ps.forEach(q => { if (v <= 0 || v >= 1 || !p){ q.el.setAttribute('opacity', 0); return; }
    q.el.setAttribute('cx', (p[0] + 60*v*Math.cos(q.a)).toFixed(1)); q.el.setAttribute('cy', (p[1] + 40*v*Math.sin(q.a) + 60*v*v).toFixed(1)); q.el.setAttribute('opacity', (1 - v).toFixed(3)); }); };
}

/* =================== SC1 — FIRST SNOW =================== */
const SC1 = scene(0, 45, {look:[960, 800, 1.36, 1.42]});
(function(){
  const S = SC1;
  S.L = locSnow(S.cam, {});
  const ly = S.L.chars;
  S.amb('wind', 0, 45, 0.6); S.amb('breeze', 0, 45, 0.6); S.amb('birds', 0, 45, 0.25);
  const momo = actor(S, 'cat', {layer:ly, x:[[0,-200],[6.4,600],[45,600]], y:960, steps:'softstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,-420],[6.8,840],[45,840]], y:960, steps:'softstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,-560],[7.2,1080],[45,1080]], y:960, steps:'softstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,-760],[7.6,1320],[17,1320],[17.6,1360],[20.6,500],[21.4,460],[24,460],[26,1320],[45,1320]], y:960, steps:'softstep'});
  const all = [momo, pipi, kuku, otto];
  [[momo,'momo'],[pipi,'pipi'],[otto,'otto'],[kuku,'kuku']].forEach(q => scarf(q[0], SCARF[q[1]]));
  kuku.item('R', 'ball', itSnowball(G())); otto.item('R', 'ball', itSnowball(G())); momo.item('R', 'ball', itSnowball(G())); pipi.item('R', 'ball', itSnowball(G()));
  // wow, snow!
  all.forEach((a, i) => { a.do('look', 7.6, 8, {x:-2 + i, y:-9}); a.do('wow', 8.0 + i*0.2, 1.6); });
  all.forEach((a, i) => a.do('arms', 10.0 + i*0.3, 4.6, {L:[70, -150], R:[70, -150], eyes:'happy', mouth:'open'}));
  pipi.do('dance', 11.0, 4.0, {bpm:0.8}); kuku.do('hop', 11.4); kuku.do('hop', 12.4); kuku.do('hop', 13.4);
  momo.do('pose', 14.6, 2.0, {lookY:-9, mouth:'open', eyes:'squeeze'}); // snowflake on the nose
  momo.do('laugh', 16.6, 2.0);
  // Otto belly-slides across the snow (otters love that!)
  otto.do('pose', 17.6, 3.6, {rot:-78, hy:10, eyes:'happy', mouth:'open', feet:false}); otto.do('cheer', 21.6, 2.0);
  [momo, pipi, kuku].forEach((a, i) => { a.do('look', 17.6, 4, {x:-7, y:0}); a.do('laugh', 20.4 + i*0.2, 2.6); });
  // snowball fight
  kuku.do('work', 25.0, 2.0, {kind:'pat', rate:2.0, look:[0, 8], dy:30}); kuku.do('arms', 27.0, 0.8, {R:[30, -190], itemR:'ball'}); kuku.do('arms', 27.8, 0.5, {R:[100, -110]});
  otto.do('pose', 28.4, 1.4, {bt:-14, tilt:-12, eyes:'squeeze', mouth:'open', hop:12}); otto.do('laugh', 29.8, 1.8);
  otto.do('arms', 31.0, 0.8, {R:[30, -190], itemR:'ball'}); otto.do('arms', 31.8, 0.5, {L:[100, -110]});
  kuku.do('pose', 32.0, 1.2, {hop:20}); // dodges
  momo.do('pose', 32.4, 1.4, {bt:10, tilt:12, eyes:'squeeze', mouth:'open'}); momo.do('wow', 32.4, 1.2);
  momo.do('arms', 34.0, 0.8, {R:[30, -190], itemR:'ball'}); momo.do('arms', 34.8, 0.5, {R:[100, -110]});
  pipi.do('pose', 35.4, 1.3, {bt:-10, tilt:-10, eyes:'squeeze', mouth:'open'});
  all.forEach((a, i) => { a.do('laugh', 37.0 + i*0.15, 3.0); a.do('cheer', 40.6 + i*0.15, 2.4); });
  S.balls = [0,1,2].map(() => itSnowball(G(S.L.fx)));
  S.splats = [splatFx(S.L.fx), splatFx(S.L.fx), splatFx(S.L.fx)];
  S.THR = [[kuku, otto, 28.0], [otto, kuku, 31.8], [momo, pipi, 34.8]];
  S.puff = splatFx(S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:9.0, x:960, y:640, n:3}, {t:41.0, x:960, y:620, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:10.2, x:960, y:560, n:8, r:260}, {t:22.0, x:480, y:880, n:5, r:70}]);
  S.sfx(8.4, 'sparkle', 0.05, 0); S.sfx(9.0, 'chime', 0.03, 0, {f:1318.5}); S.sfx(17.8, 'whoosh', 0.05, 0.2, {d:3.0, f0:300, f1:1200});
  [28.4, 32.4, 35.4].forEach((t, i) => { S.sfx(t - 0.55, 'whoosh', 0.04, 0, {d:0.4, f0:600, f1:2400}); S.sfx(t, 'pillow', 0.06, [0.4, 0.2, -0.2][i]); });
  [25.2, 25.7, 26.2, 26.7].forEach(t => S.sfx(t, 'softstep', 0.05, 0.1));
  S.pre = u => S.L.update(u);
  S.post = u => {
    S.THR.forEach((q, i) => { const tgt = headW(q[1].c, 0, 10); flyItem(S.balls[i], u, q[2] - 0.55, 0.55, paw(q[0].c, 1), tgt, 70, 0); S.splats[i](u, q[2], q[2] < u ? tgt : null); });
    S.puff(u, 21.0, [500, 950]);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — SNOWMAN FRIENDS =================== */
const SC2 = scene(45, 90, {look:[960, 780, 1.3, 1.38]});
(function(){
  const S = SC2;
  S.L = locSnow(S.cam, {});
  const ly = S.L.chars;
  S.amb('wind', 0, 45, 0.5); S.amb('breeze', 0, 45, 0.5);
  const SX = 960;
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,300],[2,300],[9,760],[10.4,700],[45,700]], y:960, steps:'softstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,420],[2,420],[9,880],[10,760],[11,640],[22,640],[23,760],[45,760]], y:975, steps:'softstep'});
  const momo = actor(S, 'cat', {layer:ly, x:[[0,1640],[3,1640],[10,1200],[11,1220],[45,1220]], y:960, steps:'softstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1760],[3,1760],[10,1330],[11,1400],[45,1400]], y:975, steps:'softstep'});
  [[momo,'momo'],[pipi,'pipi'],[otto,'otto'],[kuku,'kuku']].forEach(q => scarf(q[0], SCARF[q[1]]));
  pipi.item('R', 'carrot', itCarrotPull(G(null, 'rotate(90) scale(0.9)')));
  kuku.item('R', 'acorn', itAcorn(G(), 0.8));
  momo.item('R', 'scarf', (() => { const g = G(); mk('path', SK({d:'M-20 -10 L20 -10 L24 14 L-24 14 Z', fill:'#FF9AA2'}, 3.5), g); return g; })());
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  // rolling the two big snowballs
  [kuku, pipi].forEach(a => a.do('arms', 2.0, 7.2, {L:[56, -60], R:[56, -60], eyes:'squeeze', mouth:'open'}));
  [momo, otto].forEach(a => a.do('arms', 3.0, 7.2, {L:[56, -60], R:[56, -60], eyes:'squeeze', mouth:'open'}));
  // lifting the middle ball on top
  momo.do('arms', 12.6, 2.6, {L:[40, -160], R:[40, -160], eyes:'squeeze', mouth:'open'}); otto.do('arms', 12.6, 2.6, {L:[40, -160], R:[40, -160], eyes:'squeeze', mouth:'open'});
  kuku.do('cheer', 15.4, 2.0);
  // head (Kuku tosses a small one), carrot nose, acorn eyes, scarf
  kuku.do('arms', 17.0, 1.0, {R:[30, -190]});
  pipi.do('reach', 23.0, 2.0, {to:[SX - 10, 640], item:'carrot', lean:8});
  kuku.do('reach', 25.6, 1.4, {to:[SX - 26, 610], item:'acorn', lean:6}); kuku.do('reach', 27.2, 1.4, {to:[SX + 22, 610], item:'acorn', lean:6});
  momo.do('reach', 29.0, 2.6, {side:'R', to:[SX + 40, 700], item:'scarf', lean:-8});
  [kuku, pipi, momo].forEach(a => a.do('look', 22, 10, {x:3, y:-6}));
  otto.do('photo', 33.6, 2.6);
  [kuku, pipi, momo].forEach((a, i) => a.do('cheer', 34.0 + i*0.15, 2.2));
  [kuku, pipi, momo, otto].forEach((a, i) => { a.do('wave', 38.0 + i*0.2, 3.4); a.do('happy', 41.6, 3, {mouth:'open'}); });
  S.base = G(S.L.chars); S.mid = G(S.L.chars); S.headG = G(S.L.chars);
  S.L.chars.insertBefore(S.base, S.L.chars.firstChild); S.L.chars.insertBefore(S.mid, S.base.nextSibling); S.L.chars.insertBefore(S.headG, S.mid.nextSibling);
  mk('circle', SK({r:110, fill:'#FFFFFF'}, 5), S.base); mk('path', {d:'M-70 40 Q0 70 70 40', fill:'none', stroke:'#DCEAF7', 'stroke-width':12}, S.base);
  mk('circle', SK({r:80, fill:'#FFFFFF'}, 5), S.mid); [-30, 0, 30].forEach(y => mk('circle', {cx:0, cy:y, r:7, fill:'#6E4A30'}, S.mid));
  mk('circle', SK({r:60, fill:'#FFFFFF'}, 5), S.headG);
  S.nose = G(S.headG); itCarrotPull(G(S.nose, 'translate(6 6) rotate(-90) scale(0.9)'));
  S.eyes = [-22, 20].map(x => { const e = G(S.headG, `translate(${x} -14)`); itAcorn(G(e), 0.6); return e; });
  S.smile = mk('path', {d:'M-20 22 Q0 36 20 22', fill:'none', stroke:'#6E4A30', 'stroke-width':6, 'stroke-linecap':'round'}, S.headG);
  S.wrap = G(S.mid); mk('path', SK({d:'M-70 -60 Q0 -30 70 -60 L72 -40 Q0 -8 -72 -40 Z', fill:'#FF9AA2'}, 4.5), S.wrap); mk('path', SK({d:'M30 -44 L40 20 L60 16 L50 -48 Z', fill:'#FF9AA2'}, 4.5), S.wrap);
  S.arms = [[-1], [1]].map(q => mk('path', {d:`M${q[0]*70} -10 L${q[0]*150} -70 M${q[0]*120} -50 L${q[0]*140} -90`, stroke:'#8B5E3C', 'stroke-width':8, 'stroke-linecap':'round', fill:'none'}, S.mid));
  S.rollA = G(S.L.chars); S.rA = mk('circle', SK({r:10, fill:'#FFFFFF'}, 5), S.rollA); S.rollB = G(S.L.chars); S.rB = mk('circle', SK({r:10, fill:'#FFFFFF'}, 5), S.rollB);
  S.photo = photoFX(S, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:16.0, x:960, y:560, n:3}, {t:35.0, x:960, y:500, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:22.0, x:SX, y:600, n:5, r:70}, {t:31.8, x:SX, y:700, n:7, r:130}]);
  for (let t = 2.4; t < 9.6; t += 0.55) S.sfx(t, 'softstep', 0.04, -0.3); for (let t = 3.4; t < 10.6; t += 0.55) S.sfx(t, 'softstep', 0.04, 0.4);
  S.sfx(15.2, 'thump', 0.06, 0, {f:90, d:0.3}); S.sfx(19.0, 'thump', 0.05, 0, {f:120}); S.sfx(25.0, 'pop', 0.05, 0); S.sfx(27.0, 'tok', 0.04, 0); S.sfx(28.6, 'tok', 0.04, 0);
  S.sfx(31.6, 'rustle', 0.04, 0.1); S.sfx(31.8, 'sparkle', 0.05, 0); S.sfx(34.4, 'shutter', 0.1, 0.4);
  S.pre = u => S.L.update(u);
  S.post = u => {
    // rolling: two balls grow while being pushed toward the middle
    const ra = sm((u - 2)/7.2), rb = sm((u - 3)/7.2);
    const ax = lerp(400, SX, ra), bx = lerp(1640, SX, rb);
    const sa = 20 + 90*ra, sb = 16 + 64*rb;
    show(S.rollA, u > 1.8 && u < 9.3); T(S.rollA, `translate(${(ax + 60).toFixed(1)} ${(1000 - sa).toFixed(1)})`); S.rA.setAttribute('r', sa.toFixed(1));
    show(S.rollB, u > 2.8 && u < 12.6); T(S.rollB, `translate(${(u < 10.2 ? bx - 70 : SX + 120).toFixed(1)} ${(1000 - sb).toFixed(1)})`); S.rB.setAttribute('r', sb.toFixed(1));
    show(S.base, u >= 9.3); T(S.base, `translate(${SX} 890)`);
    const lift = sm((u - 12.6)/2.4); show(S.mid, u >= 12.6); T(S.mid, `translate(${lerp(SX + 120, SX, lift).toFixed(1)} ${(lerp(920, 720, lift) - 60*Math.sin(Math.PI*lift)).toFixed(1)})`);
    const hv = (u - 17.6)/1.0; show(S.headG, hv > 0);
    if (hv > 0){ const p = hv < 1 ? arcP(paw(kuku.c, 1), [SX, 600], hv, 120) : [SX, 600]; T(S.headG, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${(0.6 + 0.4*sm(hv) + 0.12*bump(u, 18.6, 0.5)).toFixed(3)})`); }
    show(S.nose, u > 24.6); show(S.eyes[0], u > 26.6); show(S.eyes[1], u > 28.2); show(S.wrap, u > 31.2); S.arms.forEach(a => show(a, u > 20));
    show(S.smile, u > 31.6);
    S.photo(u, [34.4], otto); S.hearts(u); S.spark(u);
  };
})();

/* =================== SC3 — SLEDDING HILL =================== */
const SC3 = scene(90, 135, {look:[1080, 790, 1.12, 1.16]});
(function(){
  const S = SC3;
  S.L = locSnow(S.cam, {hill:true});
  const ly = S.L.chars;
  S.amb('wind', 0, 45, 0.7); S.amb('breeze', 0, 45, 0.5);
  const momo = actor(S, 'cat', {layer:ly, x:1400, y:990, s:0.9, steps:null});
  const pipi = actor(S, 'bunny', {layer:ly, x:1560, y:1000, s:0.9, steps:null});
  const kuku = actor(S, 'squirrel', {layer:ly, x:1250, y:975, s:0.9, steps:null});
  const otto = actor(S, 'otter', {layer:ly, x:1700, y:1010, s:0.9, steps:null});
  const all = [momo, pipi, kuku, otto];
  [[momo,'momo'],[pipi,'pipi'],[otto,'otto'],[kuku,'kuku']].forEach(q => scarf(q[0], SCARF[q[1]]));
  // slope path
  const P0 = [-160, 545], P1 = [760, 745], P2 = [1720, 1010];
  S.slope = v => { const a = lerpP(P0, P1, v), b = lerpP(P1, P2, v); return lerpP(a, b, v); };
  S.ang = v => { const a = S.slope(Math.max(0, v - 0.01)), b = S.slope(Math.min(1, v + 0.01)); return Math.atan2(b[1] - a[1], b[0] - a[0])*180/Math.PI; };
  // RUNS: [t0, dur, riders]  (riders sit on the sled; the others wait at the bottom)
  S.RUNS = [[3.0, 4.6, [momo, pipi]], [14.0, 4.2, [kuku, otto]], [27.0, 5.0, [momo, pipi, kuku, otto]]];
  S.sled = G(S.L.chars); S.L.chars.insertBefore(S.sled, S.L.chars.firstChild);
  S.sledF = G(S.L.chars);
  mk('path', SK({d:'M-140 0 L120 0 Q170 0 170 -40', fill:'none'}, 9), S.sledF); mk('path', {d:'M-140 0 L120 0 Q170 0 170 -40', fill:'none', stroke:'#BFC6D6', 'stroke-width':4}, S.sledF);
  mk('rect', SK({x:-150, y:-46, width:290, height:34, rx:12, fill:'#E98A8A'}, 4.5), S.sledF); mk('path', {d:'M-130 -30 H120', stroke:'#FFFFFF', 'stroke-width':4, opacity:0.6}, S.sledF);
  const seat = (u) => { for (const r of S.RUNS){ const v = (u - r[0])/r[1]; if (v >= -0.4 && v <= 1.6) return [r, v]; } return null; };
  S.sledPos = function(u){ const q = seat(u); if (!q) return null; const v = clamp(q[1], 0, 1);
    const e = v*v*(1.2 - 0.2*v); const p = S.slope(Math.min(1, e)); const ang = S.ang(Math.min(0.999, e)); return {p, ang, run:q[0], v:q[1]}; };
  const wait = {momo:[1400, 990], pipi:[1560, 1000], kuku:[1250, 975], otto:[1700, 1010]};
  const names = new Map([[momo,'momo'],[pipi,'pipi'],[kuku,'kuku'],[otto,'otto']]);
  all.forEach(a => a.fn = (u, st) => {
    const sp = S.sledPos(u);
    if (sp && sp.run[2].includes(a) && sp.v > -0.2 && sp.v < 1.3){
      const k = sp.run[2].indexOf(a), n = sp.run[2].length; const off = (k - (n - 1)/2)*(n > 2 ? -66 : -90);
      const r = sp.ang*Math.PI/180; st.x = sp.p[0] + off*Math.cos(r); st.y = sp.p[1] - 30 + off*Math.sin(r); st.rot = sp.ang*0.8; st.walk = null; st.feet = false;
      if (sp.v > 0 && sp.v < 1.05){ st.tL = [80, -170]; st.tR = [80, -170]; st.eyes = 'happy'; st.mouth = 'open'; st.ear = 18*Math.sin(TAU*u*3); }
      if (sp.run === S.RUNS[2] && sp.v > 1.0){ st.rot += 30*sm((sp.v - 1)/0.15)*(k % 2 ? 1 : -1); st.eyes = 'squeeze'; st.mouth = 'open'; }
    } else if (sp && sp.run[2].includes(a) && sp.v <= -0.2){ st.x = -400; }
    else { const w = wait[names.get(a)]; st.x = w[0]; st.y = w[1]; st.walk = null; }
  });
  // watching / cheering reactions
  [kuku, otto].forEach((a, i) => { a.do('look', 2, 6, {x:-7, y:-6}); a.do('cheer', 7.2 + i*0.2, 2.0); });
  [momo, pipi].forEach((a, i) => { a.do('laugh', 8.0 + i*0.2, 2.4); a.do('look', 13, 6, {x:-7, y:-6}); a.do('cheer', 18.0 + i*0.2, 2.0); });
  [kuku, otto].forEach((a, i) => a.do('laugh', 18.8 + i*0.2, 2.4));
  all.forEach((a, i) => { a.do('laugh', 33.0 + i*0.15, 4.4); a.do('cheer', 39.6 + i*0.15, 2.4); });
  S.puff = splatFx(S.L.fx); S.puff2 = splatFx(S.L.fx);
  S.trail = mk('path', {fill:'none', stroke:'#D2E3F4', 'stroke-width':8, opacity:0.9}, S.L.back);
  S.L.back.insertBefore(S.trail, S.L.back.lastChild);
  S.hearts = heartBursts(S.L.fx, [{t:8.4, x:1480, y:820, n:3}, {t:34.0, x:1600, y:820, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:32.0, x:1700, y:960, n:8, r:140}]);
  S.RUNS.forEach((r, i) => { S.sfx(r[0], 'whoosh', 0.05, -0.6, {d:r[1], f0:200, f1:900}); S.sfx(r[0] + 0.2, 'hiss', 0.03, -0.2, {d:r[1]}); });
  S.sfx(7.6, 'softstep', 0.06, 0.6); S.sfx(18.2, 'softstep', 0.06, 0.6); S.sfx(32.0, 'pillow', 0.09, 0.7); S.sfx(32.1, 'thump', 0.06, 0.7, {f:90, d:0.3}); S.sfx(32.3, 'sparkle', 0.04, 0.7);
  S.pre = u => S.L.update(u);
  S.post = u => {
    const sp = S.sledPos(u);
    [S.sled, S.sledF].forEach(g => show(g, !!sp && sp.v > -0.3));
    if (sp){ const ex = sp.run === S.RUNS[2] && sp.v > 1 ? 40*sm((sp.v - 1)/0.2) : 0;
      T(S.sledF, `translate(${(sp.p[0] + ex).toFixed(1)} ${(sp.p[1] + 8).toFixed(1)}) rotate(${(sp.ang + ex*0.5).toFixed(2)})`); }
    // sled trail
    let d = ''; const last = S.RUNS.filter(r => u > r[0]).pop();
    if (last){ const v = clamp((u - last[0])/last[1], 0, 1), e = v*v*(1.2 - 0.2*v); for (let k=0;k<=24;k++){ const p = S.slope(Math.min(e, k/24)); d += (k ? 'L' : 'M') + p[0].toFixed(0) + ' ' + (p[1] + 10).toFixed(0) + ' '; } }
    S.trail.setAttribute('d', d);
    S.puff(u, 32.0, [1720, 990]); S.puff2(u, 32.2, [1660, 1000]);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC4 — COCOA BY THE FIRE =================== */
const SC4 = scene(135, 180, {look:[960, 760, 1.32, 1.42]});
(function(){
  const S = SC4;
  S.L = locCabin(S.cam, {sofa:900});
  const ly = S.L.chars;
  S.amb('fire', 0, 45, 1.3); S.amb('wind', 0, 45, 0.3); S.amb('clock', 0, 45, 0.6);
  const X = [610, 800, 1000, 1190];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:950}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:950});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:950}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:950});
  const all = [momo, pipi, kuku, otto];
  const mc = ['#C7B3F5', '#FFB3C7', '#FFB47A', '#9FC8F0'];
  S.mugs = all.map((a, i) => { const m = a.item('L', 'mug', itMug(G(), mc[i], '#8B5A3C')); if (i === 0) catMotif(m, 0, 3); mk('rect', S4({x:-8, y:-26, width:14, height:10, rx:4, fill:'#FFF7EE'}, 2.4), m); return m; });
  otto.item('R', 'photo', (() => { const g = G(); mk('rect', S4({x:-30, y:-24, width:60, height:48, rx:4, fill:'#FFFFFF'}), g); mk('rect', {x:-24, y:-18, width:48, height:30, fill:'#DCEEFB'}, g); mk('circle', {cx:0, cy:4, r:8, fill:'#FFFFFF', stroke:OL, 'stroke-width':1.5}, g); mk('circle', {cx:0, cy:-6, r:5.5, fill:'#FFFFFF', stroke:OL, 'stroke-width':1.5}, g); return g; })());
  all.forEach(a => a.do('hold', 0, 45, {side:'L', item:'mug', at:[30, -76], ease:false}));
  all.forEach((a, i) => { a.do('sip', 3.0 + i*0.9, 2.2, {side:'L', item:'mug'}); a.do('face', 5.4 + i*0.9, 1.6, {eyes:'squeeze', mouth:'small'}); a.do('pose', 5.4 + i*0.9, 1.6, {blushAmt:1.8}); a.do('sip', 14.0 + i*1.0, 2.0, {side:'L', item:'mug'}); });
  // Otto shows the snowman photo
  otto.do('arms', 19.0, 7.0, {R:[60, -150], itemR:'photo', eyes:'happy', mouth:'open'});
  [momo, pipi, kuku].forEach((a, i) => { a.do('look', 19.2, 6.6, {x:7, y:-2}); a.do('happy', 20.0 + i*0.2, 4, {mouth:'open'}); });
  kuku.do('laugh', 23.0, 2.2); pipi.do('laugh', 23.2, 2.2);
  // fire watching, sleepy
  all.forEach((a, i) => { a.do('look', 27, 10, {x:6, y:-1}); a.do('happy', 28 + i*0.3, 6); });
  [kuku, pipi, otto, momo].forEach((a, i) => { a.do('yawn', 32 + i*1.2, 1.8); a.do('sleepy', 34 + i*1.2, 3); });
  [[momo, 8, 12], [pipi, 6, 8], [kuku, -6, -8], [otto, -8, -12]].forEach((q, i) => { q[0].do('pose', 36 + i*0.4, 9, {x:X[i] + q[1], tilt:q[2]}); q[0].do('sleep', 37 + i*0.5, 8, {tilt:q[2]*0.4, arms:false}); });
  S.steams = all.map(() => steam(S.L.fx, 2));
  S.z = [zText(S.L.fx), zText(S.L.fx)];
  S.hearts = heartBursts(S.L.fx, [{t:6.0, x:900, y:620, n:3}, {t:24.0, x:1000, y:600, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:19.4, x:1250, y:720, n:5, r:70}]);
  S.sfx(1.0, 'plop', 0.04, -0.2); S.sfx(1.6, 'plop', 0.04, 0.2); S.sfx(19.2, 'crinkle', 0.03, 0.4, {d:0.3}); S.sfx(24.0, 'chime', 0.025, 0, {f:1046.5});
  S.pre = u => S.L.update(u, {dim: 0.4*sm((u - 30)/12)});
  S.post = u => {
    all.forEach((a, i) => { const p = paw(a.c, -1); S.steams[i](p[0], p[1] - 24, u + i, 0.6*(1 - sm((u - 34)/6)), 8); });
    const h1 = headW(pipi.c, 40, -60), h2 = headW(otto.c, 40, -60); S.z[0](h1[0], h1[1], u, sm((u - 38)/1.5)); S.z[1](h2[0], h2[1], u + 1.4, sm((u - 39)/1.5));
    S.hearts(u); S.spark(u);
  };
})();

EPISODE({day:12, title:'First Snow Day', music:{seed:22, key:2, bpm:70, prog:1}, thumb:79,
  chapters:[['First Snow', g => { mk('circle', S4({r:15, fill:'#FFFFFF'}), g); mk('path', {d:'M-9 0 H9 M0 -9 V9 M-6 -6 L6 6 M6 -6 L-6 6', stroke:'#8FB8E8', 'stroke-width':3, 'stroke-linecap':'round'}, g); }],
            ['Snowman Friends', g => { mk('circle', S4({cx:0, cy:8, r:12, fill:'#FFFFFF'}), g); mk('circle', S4({cx:0, cy:-10, r:9, fill:'#FFFFFF'}), g); mk('path', {d:'M0 -10 l8 2', stroke:'#FF9A5A', 'stroke-width':3}, g); }],
            ['Sledding Hill', g => { mk('rect', S4({x:-20, y:-6, width:40, height:12, rx:5, fill:'#E98A8A'}), g); mk('path', {d:'M-22 10 H18 Q26 10 26 2', fill:'none', stroke:OL, 'stroke-width':3.5}, g); }],
            ['Cocoa by the Fire', IC.fire]],
  scenes:[SC1, SC2, SC3, SC4]});
