/* =====================================================================
   FUR FRIENDS — Day 6: "Little Bakers"   (180 s)
   bakery kitchen: mixing → oven → cupcakes → tea time in the shop
   ===================================================================== */
const CHEF = {apron:true, hat:true};
function bowlProp(parent, x, y, col){
  const g = G(parent, `translate(${x} ${y})`);
  g.fill = G(g); mk('ellipse', {cx:0, cy:-30, rx:60, ry:12, fill:'#FFF3D6'}, g.fill);
  mk('path', SK({d:'M-70 -30 Q-66 20 0 22 Q66 20 70 -30 Z', fill:col || '#9FD3F5'}, 4.5), g);
  mk('ellipse', SK({cx:0, cy:-30, rx:70, ry:14, fill:'none'}, 4.5), g);
  mk('path', {d:'M-50 -6 Q0 8 50 -6', fill:'none', stroke:'#FFFFFF', 'stroke-width':5, opacity:0.6}, g);
  return g;
}
function doughBall(parent, x, y){ const g = G(parent, `translate(${x} ${y})`); g.b = G(g); mk('ellipse', SK({cx:0, cy:-22, rx:56, ry:30, fill:'#FFF0D2'}, 4.5), g.b); mk('ellipse', {cx:-16, cy:-34, rx:16, ry:7, fill:'#FFFFFF', opacity:0.6}, g.b); return g; }
function flourFx(layer, n){
  const ps = []; for (let i=0;i<n;i++) ps.push({el: mk('circle', {r:R(3,6), fill:'#FFFFFF', opacity:0}, layer), ph:rnd(), dx:R(-14,14)});
  return function(from, to, u, amt){ ps.forEach(p => { const v = mod(u*1.4 + p.ph, 1); p.el.setAttribute('cx', (lerp(from[0], to[0], v) + p.dx).toFixed(1)); p.el.setAttribute('cy', lerp(from[1], to[1], v).toFixed(1)); p.el.setAttribute('opacity', (amt*Math.sin(Math.PI*v)).toFixed(3)); }); };
}
function puffFx(layer){
  const cs = []; for (let i=0;i<9;i++){ const a = i/9*TAU; cs.push({el: mk('circle', {r:30, fill:'#FFFFFF', opacity:0}, layer), a}); }
  return function(u, t0, x, y){ const v = (u - t0)/2.4; cs.forEach(c => { if (v <= 0 || v >= 1){ c.el.setAttribute('opacity', 0); return; }
    const r = 30 + 120*sm(v*1.6); c.el.setAttribute('cx', (x + r*Math.cos(c.a)).toFixed(1)); c.el.setAttribute('cy', (y + 0.6*r*Math.sin(c.a) - 40*v).toFixed(1)); c.el.setAttribute('r', (40 + 40*v).toFixed(1)); c.el.setAttribute('opacity', (0.9*(1 - v)).toFixed(3)); }); };
}

/* =================== SC1 — MIXING & KNEADING =================== */
const SC1 = scene(0, 45, {look:[965, 790, 1.72, 1.8]});
(function(){
  const S = SC1;
  S.L = locBakery(S.cam, {});
  const ly = S.L.chars;
  S.amb('oven', 0, 45, 0.6); S.amb('room', 0, 45, 1); S.amb('birds', 0, 45, 0.35);
  const X = [690, 880, 1050, 1240];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:935, base:CHEF});
  const pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:935, base:CHEF});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:935, base:CHEF});
  const otto = actor(S, 'otter', {layer:ly, x:X[3], y:935, base:CHEF});
  const all = [momo, pipi, kuku, otto];
  momo.item('R', 'sieve', (() => { const g = G(); mk('path', {d:'M0 0 L30 -10', stroke:OL, 'stroke-width':6, 'stroke-linecap':'round'}, g); mk('ellipse', S4({cx:-14, cy:6, rx:26, ry:14, fill:'#E9EEF5'}), g); mk('path', {d:'M-30 6 H2 M-14 -6 V18', stroke:'#BFC6D6', 'stroke-width':2}, g); return g; })());
  pipi.item('R', 'egg', (() => { const g = G(); mk('ellipse', S4({rx:12, ry:15, fill:'#FFF8EC'}), g); return g; })());
  kuku.item('R', 'whisk', itWhisk(G()));
  otto.item('R', 'spoon', itSpoon(G()));
  S.bowlA = bowlProp(S.L.top, 790, 906, '#FFB3C7'); S.bowlB = bowlProp(S.L.top, 1150, 906, '#9FD3F5');
  S.eggs = [0,1,2].map(i => { const g = G(S.L.top, `translate(${930 + i*26} 902)`); mk('ellipse', S4({rx:11, ry:14, fill:'#FFF8EC'}), g); return g; });
  S.jar = G(S.L.top, 'translate(1340 902)'); mk('rect', S4({x:-28, y:-56, width:56, height:56, rx:10, fill:'#EAF6FF'}), S.jar); mk('rect', {x:-22, y:-30, width:44, height:28, rx:6, fill:'#FFFFFF'}, S.jar); txt(S.jar, 0, -36, 'sugar', 14, '#C9A27E');
  S.doughA = doughBall(S.L.top, 790, 906); S.doughB = doughBall(S.L.top, 1150, 906);
  S.cloth = [790, 1150].map(x => { const g = G(S.L.top, `translate(${x} 906)`); mk('path', SK({d:'M-70 -10 Q-74 -60 0 -66 Q74 -60 70 -10 Z', fill:'#FFC3D2'}, 4.5), g); mk('path', {d:'M-50 -40 H50 M-56 -24 H56', stroke:'#FFFFFF', 'stroke-width':4, opacity:0.7}, g); return g; });
  // morning hello
  all.forEach((a, i) => a.do('wave', 4.6 + i*0.25, 2.2, {side: i < 2 ? 'R' : 'L'}));
  // Momo sifts flour
  momo.do('work', 7.4, 8.0, {kind:'shake', rate:1.6, itemR:'sieve', look:[4, 6], dy:0, snd:'rustle', every:2, gain:0.02, sndO:{d:0.3}});
  // Pipi cracks eggs (3 times)
  [8.0, 10.4, 12.8].forEach((t, k) => { pipi.do('reach', t - 1.0, 0.9, {to:[930 + k*26, 890], item:'egg'}); pipi.do('reach', t, 1.4, {to:[810, 850], item:'egg', lean:-6}); pipi.do('happy', t + 0.6, 0.8); S.sfx(t + 0.6, 'knock', 0.05, panOf(820), {f:900}); S.sfx(t + 0.9, 'plop', 0.035, panOf(820)); });
  // Otto measures sugar → Kuku's bowl, Kuku whisks
  [7.6, 10.2, 12.8].forEach(t => { otto.do('reach', t, 1.0, {to:[1330, 850], item:'spoon'}); otto.do('reach', t + 1.0, 1.2, {to:[1190, 850], item:'spoon'}); S.sfx(t + 0.5, 'scoop', 0.03, panOf(1330)); S.sfx(t + 1.6, 'crinkle', 0.02, panOf(1190), {d:0.3}); });
  kuku.do('work', 8.0, 7.6, {kind:'stir', rate:2.2, itemR:'whisk', dy:0, look:[3, 7], snd:'whisk', every:1, gain:0.035});
  momo.do('happy', 15.8, 2); kuku.do('laugh', 15.8, 2.0);
  // mix → dough
  [momo, pipi].forEach((a, i) => a.do('reach', 16.8, 2.4, {side: i ? 'L' : 'R', to:[790, 860], lean: i ? -6 : 6}));
  [kuku, otto].forEach((a, i) => a.do('reach', 16.8, 2.4, {side: i ? 'L' : 'R', to:[1150, 860], lean: i ? -6 : 6}));
  all.forEach((a, i) => a.do('work', 19.6 + i*0.2, 12.4, {kind:'knead', rate:1.1, dy:0, look:[i % 2 ? -4 : 4, 7], mouth: i === 0 ? 'smile' : 'smile', snd:'squish', every:1, gain:0.035}));
  pipi.do('bob', 22, 8, {f:0.55});
  // flour puff
  kuku.do('clap', 33.6, 1.6); kuku.do('pose', 35.0, 2.6, {eyes:'squeeze', mouth:'open', tilt:-8});
  [momo, pipi, otto].forEach((a, i) => { a.do('wow', 34.8 + i*0.1, 1.3); a.do('laugh', 36.2 + i*0.15, 3.0); });
  kuku.do('laugh', 37.6, 2.4);
  // cover the dough, high five
  momo.do('reach', 40.0, 1.6, {to:[790, 850]}); otto.do('reach', 40.2, 1.6, {side:'L', to:[1150, 850]});
  all.forEach((a, i) => a.do('cheer', 42.0 + i*0.15, 2.4));
  S.flour = flourFx(S.L.fx, 14); S.puff = puffFx(S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:5.6, x:960, y:640, n:3}, {t:42.4, x:960, y:640, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:19.2, x:790, y:830, n:5, r:70}, {t:19.4, x:1150, y:830, n:5, r:70}, {t:36.4, x:1050, y:700, n:6, r:90}]);
  S.sfx(4.8, 'chime', 0.03, 0, {f:1046.5}); S.sfx(34.6, 'whoosh', 0.05, 0.1, {d:0.8, f0:400, f1:2400}); S.sfx(34.7, 'pat', 0.06, 0.1);
  S.sfx(41.0, 'rustle', 0.04, 0); S.sfx(42.2, 'chime', 0.03, 0, {f:1318.5});
  S.pre = u => S.L.update(u, {heat:0.5});
  S.post = u => {
    const sv = momo.c.last ? paw(momo.c, 1) : [700, 800];
    S.flour([sv[0] - 14, sv[1] + 10], [790, 890], u, rh(u, 7.8, 8.4, 15.0, 15.4));
    S.eggs.forEach((e, k) => show(e, u < 7.0 + k*2.4 + 0.1));
    const dv = sm((u - 17.8)/1.6);
    [S.doughA, S.doughB].forEach((d, i) => { show(d, dv > 0.01 && u < 41.2); const sq = 0.06*Math.sin(TAU*1.1*(u - 19.6))*rh(u, 19.6, 20.4, 31.6, 32.4);
      T(d.b, `scale(${(dv*(1 + sq)).toFixed(3)} ${(dv*(1 - sq)).toFixed(3)})`); });
    [S.bowlA, S.bowlB].forEach(b => { show(b, u < 18.6); b.setAttribute('opacity', (1 - sm((u - 17.8)/0.8)).toFixed(3)); T(b.fill, `scale(1 ${(0.3 + 0.7*sm((u - 8)/7)).toFixed(3)})`); });
    S.cloth.forEach((c, i) => { const v = sm((u - 40.6 - i*0.2)/0.7); show(c, v > 0.01); T(c, `translate(${[790, 1150][i]} ${(906 - 40*(1 - v)).toFixed(1)})`); c.setAttribute('opacity', v.toFixed(3)); });
    S.puff(u, 34.7, 1050, 840);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — INTO THE OVEN =================== */
const SC2 = scene(45, 90, {look:[1130, 760, 1.45, 1.5]});
const ROLLS = [[760,'momo',2.4],[880,'pipi',3.4],[1000,'kuku',4.6],[1120,'otto',5.6],[820,'momo',7.0],[1060,'kuku',8.2]];
(function(){
  const S = SC2;
  S.L = locBakery(S.cam, {});
  const ly = S.L.chars;
  S.amb('oven', 0, 45, 1.2); S.amb('room', 0, 45, 1); S.amb('clock', 18, 30, 1);
  const momo = actor(S, 'cat', {layer:ly, x:[[0,700],[45,700]], y:935, base:CHEF});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,880],[45,880]], y:935, base:CHEF});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,1060],[19,1060],[20.6,1240],[22.4,1060],[24,1240],[25.6,1060],[45,1060]], y:935, base:CHEF});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1240],[11.8,1240],[13.6,1420],[18.4,1420],[20,1250],[29.6,1250],[30.6,1420],[33.6,1420],[34.8,1250],[45,1250]], y:935, base:CHEF});
  const A = {momo, pipi, kuku, otto}, all = [momo, pipi, kuku, otto];
  otto.item('R', 'mitt', (() => { const g = G(); mk('path', S4({d:'M-14 -16 Q-18 14 0 18 Q18 14 14 -16 Z', fill:'#FF9AA2'}), g); return g; })());
  // shaping rolls
  ROLLS.forEach(r => { const a = A[r[1]]; a.do('reach', r[2] - 1.0, 1.2, {to:[r[0], 870], lean:4}); a.do('work', r[2] - 0.2, 0.9, {kind:'pat', rate:2.2, dy:0, look:[0, 8]}); a.do('happy', r[2] + 0.4, 0.8); S.sfx(r[2], 'pat', 0.05, panOf(r[0])); S.sfx(r[2] + 0.25, 'pat', 0.04, panOf(r[0])); });
  // Otto carries tray to the oven
  otto.do('arms', 10.8, 6.6, {L:[30, -150], R:[30, -150], itemR:'mitt', eyes:'open', mouth:'small'});
  otto.do('arms', 17.4, 1.0, {L:[60, -180], R:[60, -180], itemR:'mitt'});
  [momo, pipi, kuku].forEach(a => a.do('look', 11, 7, {x:7, y:-2}));
  // waiting (Kuku paces, Pipi bobs, Momo watches the clock)
  kuku.do('look', 19, 7, {x:5, y:-2}); kuku.do('think', 26.0, 3.0);
  pipi.do('bob', 19.0, 10.6, {f:0.6}); momo.do('look', 19, 10, {x:-2, y:-7}); momo.do('yawn', 24.0, 1.8);
  otto.do('look', 20, 9, {x:6, y:-4});
  // ding!
  all.forEach((a, i) => { a.do('wow', 29.6 + i*0.05, 1.4); a.do('look', 30.0, 5, {x:7, y:-3}); });
  otto.do('arms', 31.0, 3.6, {L:[60, -180], R:[60, -180], itemR:'mitt'});
  all.forEach((a, i) => { a.do('face', 35.2 + i*0.15, 3.4, {eyes:'squeeze', mouth:'small'}); a.do('pose', 35.2 + i*0.15, 3.4, {hy:-6, tilt:6}); a.do('cheer', 39.0 + i*0.15, 2.4); });
  otto.do('happy', 41.6, 3);
  S.tray = G(S.L.top); itTray(S.tray, 420);
  S.rolls = ROLLS.map(r => itBread(G(S.L.top), 0.9));
  S.trayFly = G(S.L.fx); itTray(S.trayFly, 300); S.trayRolls = [-100, -40, 20, 80, -70, 50].map((x, i) => itBread(G(S.trayFly, `translate(${x} ${i > 3 ? -24 : -14})`), 0.75));
  S.hot = G(S.L.top); itTray(S.hot, 420); [-150, -90, -30, 30, 90, 150].map(x => itBread(G(S.hot, `translate(${x} -16)`), 1.05));
  S.steamFx = steam(S.L.fx, 4);
  S.hearts = heartBursts(S.L.fx, [{t:36.0, x:960, y:700, n:5}, {t:39.4, x:1250, y:650, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:32.6, x:960, y:820, n:7, r:150}, {t:9.0, x:940, y:830, n:5, r:120}]);
  S.sfx(16.2, 'click', 0.06, 0.6); S.sfx(17.4, 'whoosh', 0.04, 0.6, {d:0.6}); S.sfx(18.4, 'knock', 0.06, 0.6, {f:300});
  S.sfx(29.5, 'oven', 0.1, 0.6); S.sfx(30.6, 'click', 0.06, 0.6); S.sfx(31.2, 'whoosh', 0.03, 0.5, {d:0.8}); S.sfx(32.4, 'knock', 0.05, 0.1, {f:500});
  S.sfx(32.6, 'sparkle', 0.05, 0); S.sfx(39.2, 'chime', 0.03, 0, {f:1046.5});
  S.pre = u => S.L.update(u, {heat: 0.6 + 0.4*rh(u, 17, 19, 30, 31), door: Math.max(rh(u, 15.6, 16.4, 17.8, 18.6), rh(u, 30.2, 31.0, 33.0, 33.8)), bread: u > 30.2 && u < 31.6});
  S.post = u => {
    // tray + rolls on the counter until Otto lifts it
    const lift = u > 11.4;
    show(S.tray, !lift); T(S.tray, 'translate(940 900)');
    S.rolls.forEach((b, i) => { const r = ROLLS[i]; if (lift){ show(b, false); return; } const v = sm((u - r[2])/0.4); show(b, v > 0.01); T(b, `translate(${r[0]} ${i > 3 ? 876 : 886}) scale(${(0.9*v*(1 + 0.2*bump(u, r[2], 0.6))).toFixed(3)})`); });
    let tp = null;
    if (u > 11.4 && u < 17.6){ const a = paw(otto.c, -1), b = paw(otto.c, 1); tp = [(a[0] + b[0])/2, (a[1] + b[1])/2 - 10]; }
    else if (u >= 17.6 && u < 18.4){ const a = paw(otto.c, 1); tp = arcP([a[0] - 30, a[1] - 10], [1560, 640], (u - 17.6)/0.8, 40); }
    show(S.trayFly, !!tp); if (tp) T(S.trayFly, `translate(${tp[0].toFixed(1)} ${tp[1].toFixed(1)}) scale(${u > 17.6 ? (1 - 0.4*sm((u - 17.6)/0.8)).toFixed(3) : 1})`);
    // hot bread comes out
    const ov = (u - 31.4)/1.0;
    show(S.hot, ov > 0);
    if (ov > 0){ const p = ov < 1 ? arcP([1560, 650], [960, 900], ov, 60) : [960, 900]; T(S.hot, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${(0.6 + 0.4*sm(ov)).toFixed(3)})`); }
    S.steamFx(960, 860, u, sm((u - 32.4)/1.0), 90);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC3 — CUPCAKE DECORATING =================== */
const SC3 = scene(90, 135, {look:[965, 790, 1.76, 1.84]});
const CUPX = [690, 790, 890, 1030, 1130, 1230];
(function(){
  const S = SC3;
  S.L = locBakery(S.cam, {});
  const ly = S.L.chars;
  S.amb('oven', 0, 45, 0.6); S.amb('room', 0, 45, 1); S.amb('birds', 0, 45, 0.3);
  const momo = actor(S, 'cat', {layer:ly, x:700, y:935, base:CHEF});
  const pipi = actor(S, 'bunny', {layer:ly, x:880, y:935, base:CHEF});
  const kuku = actor(S, 'squirrel', {layer:ly, x:1060, y:935, base:CHEF});
  const otto = actor(S, 'otter', {layer:ly, x:1240, y:935, base:CHEF});
  const all = [momo, pipi, kuku, otto];
  const bagCols = ['#FFC3D2', '#C9B6F2', '#FFE7A0', '#BFE3D6'];
  all.forEach((a, i) => a.item('R', 'bag', itPipingBag(G(), bagCols[i])));
  kuku.item('L', 'cherry', (() => { const g = G(); mk('circle', {r:8, fill:'#F0506E', stroke:OL, 'stroke-width':2.5}, g); return g; })());
  S.cups = CUPX.map((x, i) => { const c = itCupcake(G(S.L.top, `translate(${x} 886) scale(1.2)`), bagCols[[0,0,1,2,3,3][i]]); return c; });
  // who frosts which cupcake, when
  S.FROST = [[0, momo, 4.0], [1, momo, 8.0], [2, pipi, 5.0], [3, kuku, 6.0], [4, otto, 4.6], [5, otto, 9.0]];
  S.FROST.forEach(f => { const x = CUPX[f[0]]; f[1].do('reach', f[2] - 0.6, 2.8, {to:[x, 830], item:'bag', lean:4}); f[1].do('look', f[2] - 0.6, 2.8, {x: clamp((x - f[1].X(0))/20, -6, 6), y:7});
    f[1].do('happy', f[2] + 2.0, 0.8); S.sfx(f[2] + 0.2, 'squish', 0.04, panOf(x)); S.sfx(f[2] + 1.0, 'squish', 0.035, panOf(x)); });
  pipi.do('reach', 9.4, 2.6, {to:[CUPX[2] + 10, 840], item:'bag'});
  // Pipi gets frosting on her nose
  pipi.do('pose', 12.2, 1.0, {bt:8, tilt:6}); pipi.do('wow', 13.0, 1.4);
  momo.do('look', 13.4, 4, {x:6, y:0}); momo.do('laugh', 14.6, 2.6); otto.do('laugh', 14.8, 2.4); kuku.do('laugh', 15.0, 2.4);
  pipi.do('shy', 15.6, 3.0);
  momo.do('reach', 19.0, 1.6, {to:u => headW(pipi.c, -6, 20)}); pipi.do('face', 19.0, 1.6, {eyes:'squeeze', mouth:'small'});
  pipi.do('happy', 20.8, 2, {mouth:'open'});
  // cherries on top (Kuku), with a sneaky taste
  CUPX.forEach((x, i) => { const t = 22.0 + i*1.3; kuku.do('reach', t, 1.2, {side: x < 1060 ? 'L' : 'L', to:[x, 820], item:'cherry'}); S.sfx(t + 0.8, 'pop', 0.04, panOf(x)); });
  kuku.do('look', 22, 8, {x:0, y:7});
  kuku.do('arms', 30.6, 1.4, {R:[12, -116]}); kuku.do('face', 30.8, 1.6, {eyes:'happy', mouth:'chew'});
  otto.do('wow', 31.2, 1.4); otto.do('point', 31.6, 2.0, {side:'L', at:[100, -120]});
  kuku.do('shy', 32.4, 2.6); momo.do('laugh', 33.0, 2.0); pipi.do('laugh', 33.2, 2.0);
  // done!
  otto.do('photo', 36.6, 2.6);
  [momo, pipi, kuku].forEach((a, i) => a.do('cheer', 37.0 + i*0.2, 2.2)); otto.do('cheer', 40.0, 2.2);
  all.forEach((a, i) => a.do('look', 41.0, 4, {x:0, y:6}));
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  S.nose = mk('ellipse', S4({rx:14, ry:10, fill:'#C9B6F2'}, 3), S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:21.0, x:880, y:640, n:3}, {t:38.0, x:960, y:640, n:5}]);
  S.spark = sparkles(S.L.fx, CUPX.map((x, i) => ({t:22.8 + i*1.3, x, y:830, n:3, r:30})).concat([{t:37.0, x:960, y:820, n:8, r:240}]));
  S.photo = photoFX(S, S.L.fx);
  S.sfx(12.8, 'pop', 0.05, panOf(880)); S.sfx(37.4, 'sparkle', 0.05, 0);
  S.pre = u => S.L.update(u, {heat:0.4});
  S.post = u => {
    S.cups.forEach((c, i) => { const f = S.FROST.find(q => q[0] === i); const v = sm((u - f[2])/1.6);
      T(c.top, `translate(0 ${(6*(1 - v)).toFixed(1)}) scale(${(0.15 + 0.85*v).toFixed(3)})`); c.top.setAttribute('opacity', (v > 0.02 ? 1 : 0)); show(c.cherry, u > 22.8 + i*1.3 && !(i === 5 && u > 30.4 && u < 31.4)); });
    const nv = rh(u, 12.6, 12.9, 19.8, 20.4);
    show(S.nose, nv > 0.01); if (nv > 0.01){ const h = headW(pipi.c, 0, 12); T(S.nose, `translate(${h[0].toFixed(1)} ${h[1].toFixed(1)}) scale(${nv.toFixed(3)})`); }
    S.photo(u, [37.6], otto);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC4 — TEA TIME IN THE SHOP =================== */
const SC4 = scene(135, 180, {look:[965, 800, 1.66, 1.76]});
(function(){
  const S = SC4;
  S.L = locBakery(S.cam, {area:'shop', evening:true});
  const ly = S.L.chars;
  S.amb('cafe', 0, 45, 0.6); S.amb('room', 0, 45, 1); S.amb('clock', 0, 45, 0.6);
  const X = [690, 870, 1060, 1240];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:945}), kuku = actor(S, 'squirrel', {layer:ly, x:X[1], y:945});
  const pipi = actor(S, 'bunny', {layer:ly, x:X[2], y:945}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:945});
  const all = [momo, kuku, pipi, otto];
  const mugC = ['#C7B3F5', '#FFB47A', '#FFB3C7', '#9FC8F0'];
  S.mugs = all.map((a, i) => { const m = a.item('L', 'mug', itMug(G(), mugC[i], '#C98A5A')); if (i === 0) catMotif(m, 0, 3); return m; });
  all.forEach((a, i) => a.item('R', 'treat', i % 2 ? itCupcake(G(null, 'translate(0 -4)'), ['#FFC3D2','#FFE7A0'][i >> 1]) : itBread(G(), 0.9)));
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  pipi.item('R', 'pot', (() => { const g = G(); mk('path', S4({d:'M-26 -20 Q-30 16 0 18 Q30 16 26 -20 Z', fill:'#FFFFFF'}), g); mk('path', {d:'M26 -10 L44 -26', stroke:OL, 'stroke-width':7, 'stroke-linecap':'round'}, g); mk('path', SK({d:'M-10 -26 L10 -26 L6 -20 L-6 -20 Z', fill:'#FFB3C7'}, 3), g); mk('path', {d:'M-14 -2 Q0 6 14 -2', fill:'none', stroke:'#FFB3C7', 'stroke-width':4}, g); return g; })());
  // Pipi pours tea for everyone (pot goes round)
  pipi.do('hold', 0.5, 9.6, {item:'pot', at:[40, -110]});
  [[1.6, 820], [3.8, 990], [6.0, 1130], [8.0, 1180]].forEach((p, k) => { pipi.do('reach', p[0], 1.8, {to:[p[1], 840], item:'pot', lean: p[1] < 1060 ? -8 : 6}); S.sfx(p[0] + 0.5, 'pour', 0.045, panOf(p[1]), {d:1.1}); });
  all.forEach((a, i) => a.do('look', 1, 9, {x: clamp((1000 - X[i])/40, -6, 6), y:5}));
  // tea + treats
  all.forEach((a, i) => { a.do('sip', 11.0 + i*0.8, 2.2, {side:'L', item:'mug'}); a.do('eat', 14.0 + i*0.6, 9.6, {item:'treat', bites:3, per:3.0, snd: i % 2 ? 'squish' : 'crunch'}); a.do('sip', 25.0 + i*1.1, 2.0, {side:'L', item:'mug'}); });
  S.steams = all.map(() => steam(S.L.fx, 2));
  // chat & photo review
  kuku.do('talk', 24.4, 3.0, {gest:true}); momo.do('laugh', 27.2, 2.4); pipi.do('laugh', 27.4, 2.4);
  otto.do('arms', 29.6, 5.6, {L:[24, -132], R:[30, -110], itemR:'camera'});
  [momo, kuku, pipi].forEach(a => a.do('look', 30, 5, {x:6, y:2}));
  [momo, kuku, pipi, otto].forEach((a, i) => a.do('laugh', 32.0 + i*0.15, 2.4));
  // cozy end
  [[momo, 6, 10], [kuku, 6, 6], [pipi, -6, -6], [otto, -6, -10]].forEach((q, i) => q[0].do('pose', 37.0 + i*0.2, 8, {x:X[i] + q[1], tilt:q[2]}));
  all.forEach((a, i) => { a.do('happy', 37.4 + i*0.2, 6.4); a.do('sleepy', 40.0 + i*0.3, 5); });
  kuku.do('yawn', 38.4, 1.8); momo.do('yawn', 40.0, 1.8);
  S.sign = G(S.L.back, 'translate(1350 470)');
  mk('path', {d:'M-40 -60 L0 -100 L40 -60', fill:'none', stroke:OL, 'stroke-width':3}, S.sign);
  S.signF = G(S.sign); mk('rect', SK({x:-80, y:-60, width:160, height:60, rx:12, fill:'#FFFDF8'}, 4), S.signF); S.signTxt = txt(S.signF, 0, -20, 'OPEN', 28, '#7CC77A');
  S.plate = G(S.L.top, 'translate(960 876)'); mk('ellipse', SK({rx:120, ry:22, fill:'#FFFFFF'}, 4), S.plate);
  itBread(G(S.plate, 'translate(-50 -16)'), 0.9); itCupcake(G(S.plate, 'translate(10 -26)'), '#C9B6F2'); itBread(G(S.plate, 'translate(60 -14)'), 0.8);
  S.hearts = heartBursts(S.L.fx, [{t:12.0, x:960, y:660, n:3}, {t:33.0, x:960, y:640, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:40.0, x:1350, y:440, n:5, r:80}]);
  S.sfx(39.8, 'bell', 0.04, 0.4, {f:1568, d:1.6}); S.sfx(40.0, 'click', 0.04, 0.4);
  S.pre = u => S.L.update(u);
  S.post = u => {
    all.forEach((a, i) => { const p = paw(a.c, -1); S.steams[i](p[0], p[1] - 22, u + i, u > 3.6 + 2.2*i ? 0.7 : 0, 8); });
    const fl = clamp((u - 39.6)/0.8, 0, 1); T(S.signF, `scale(${Math.max(0.02, Math.abs(Math.cos(Math.PI*fl))).toFixed(3)} 1)`);
    if (fl > 0.5 && S.signTxt.textContent !== 'CLOSED'){ S.signTxt.textContent = 'CLOSED'; S.signTxt.setAttribute('fill', '#F28CA1'); }
    if (fl <= 0.5 && S.signTxt.textContent !== 'OPEN'){ S.signTxt.textContent = 'OPEN'; S.signTxt.setAttribute('fill', '#7CC77A'); }
    S.L.dusk.setAttribute('opacity', (0.18*sm((u - 30)/12)).toFixed(3));
    S.hearts(u); S.spark(u);
  };
})();

EPISODE({day:6, title:'Little Bakers', music:{seed:16, key:-2, bpm:72, prog:2},
  chapters:[['Mixing & Kneading', IC.bread], ['Into the Oven', IC.fire], ['Cupcake Party', IC.cupcake], ['Tea Time', IC.tea]],
  scenes:[SC1, SC2, SC3, SC4]});
