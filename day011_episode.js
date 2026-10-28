/* =====================================================================
   FUR FRIENDS — Day 11: "Sleepover Night"   (180 s)
   pillow fight → movie & popcorn → flashlight stories → goodnight
   ===================================================================== */
function featherFx(layer, n){
  const fs = []; for (let i=0;i<n;i++) fs.push({el: mk('path', S4({d:'M0 -14 Q8 0 0 14 Q-8 0 0 -14 Z', fill:'#FFFFFF'}, 2.4), layer), x0:R(300, 1650), ph:rnd()});
  return function(u, amt){ fs.forEach(f => { const v = mod(u*0.12 + f.ph, 1); T(f.el, `translate(${(f.x0 + 50*Math.sin(TAU*(u/3 + f.ph*5))).toFixed(1)} ${(420 + 560*v).toFixed(1)}) rotate(${(40*Math.sin(TAU*(u/2 + f.ph))).toFixed(1)})`); f.el.setAttribute('opacity', (amt*Math.sin(Math.PI*v)).toFixed(3)); }); };
}

/* =================== SC1 — PILLOW FIGHT =================== */
const SC1 = scene(0, 45, {look:[980, 720, 1.3, 1.36]});
(function(){
  const S = SC1;
  S.L = locBedroom(S.cam, {futons:true});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 1); S.amb('night', 0, 45, 0.4);
  const momo = actor(S, 'cat', {layer:ly, x:[[0,560],[45,560]], y:960, steps:'softstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,820],[45,820]], y:960, steps:'softstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,1160],[45,1160]], y:960, steps:'softstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1440],[45,1440]], y:960, steps:'softstep'});
  const all = [momo, pipi, kuku, otto];
  const pcol = ['#FFC3D2', '#CDBDF4', '#BFE3D6', '#FFE3B0'];
  all.forEach((a, i) => a.item('R', 'pillow', itPillow(G(null, 'scale(0.7)'), pcol[i])));
  // [thrower, target, t]
  const THROWS = [[kuku, momo, 6.0], [momo, kuku, 9.0], [pipi, otto, 12.0], [otto, pipi, 15.0], [kuku, otto, 18.0], [momo, pipi, 21.0], [otto, kuku, 24.0], [pipi, momo, 27.0]];
  S.THROWS = THROWS;
  all.forEach((a, i) => a.do('happy', 1.5 + i*0.2, 3, {mouth:'open'}));
  kuku.do('talk', 3.0, 2.2, {gest:true});
  THROWS.forEach(q => { const [a, b, t] = q;
    a.do('arms', t - 1.0, 1.1, {R:[30, -196], itemR:'pillow', eyes:'happy', mouth:'open'}); a.do('arms', t + 0.1, 0.6, {R:[100, -110]});
    b.do('pose', t + 0.7, 1.2, {bt: (b.X(0) > a.X(0) ? 14 : -14), tilt: (b.X(0) > a.X(0) ? 12 : -12), eyes:'squeeze', mouth:'open', hop:14});
    b.do('laugh', t + 1.8, 1.2);
    S.sfx(t + 0.05, 'whoosh', 0.04, panOf(a.X(0)), {d:0.4, f0:500, f1:2400}); S.sfx(t + 0.7, 'pillow', 0.08, panOf(b.X(0))); });
  // pillow pile-up: all jump at once, then flop down laughing
  all.forEach((a, i) => { a.do('cheer', 31.0 + i*0.1, 2.0, {h:40}); a.do('pose', 33.4, 3.0, {rot: i < 2 ? -18 : 18, hy:10}); a.do('laugh', 33.4, 5.0); a.do('happy', 38.6, 6, {mouth:'open'}); });
  otto.do('arms', 40.0, 3.0, {R:[40, -150], itemR:'pillow'}); otto.do('shy', 41.2, 2.6);
  S.flyP = THROWS.map((q, i) => { const g = G(S.L.fx); itPillow(G(g, 'scale(0.7)'), pcol[all.indexOf(q[0])]); return g; });
  S.feath = featherFx(S.L.fx, 18);
  S.hearts = heartBursts(S.L.fx, [{t:32.0, x:1000, y:620, n:5}, {t:42.0, x:1440, y:620, n:3}]);
  S.spark = sparkles(S.L.fx, THROWS.map(q => ({t:q[2] + 0.7, x:q[1].X(0), y:780, n:3, r:50})));
  all.forEach((a, i) => S.sfx(33.2 + i*0.1, 'pillow', 0.06, panOf(a.X(0))));
  S.sfx(31.0, 'chime', 0.02, 0, {f:1318.5});
  S.pre = u => S.L.update(u);
  S.post = u => {
    S.THROWS.forEach((q, i) => flyItem(S.flyP[i], u, q[2], 0.7, paw(q[0].c, 1), headW(q[1].c, 0, 0), 120, 540));
    all.forEach(a => { const busy = S.THROWS.some(q => q[0] === a && u > q[2] && u < q[2] + 0.8); });
    S.feath(u, sm((u - 7)/3)*(1 - sm((u - 40)/4)));
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — MOVIE & POPCORN =================== */
const SC2 = scene(45, 90, {look:[960, 760, 1.34, 1.42]});
(function(){
  const S = SC2;
  S.L = locBedroom(S.cam, {futons:true});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 1); S.amb('night', 0, 45, 0.3);
  const X = [600, 840, 1080, 1320];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:965}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:965});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:965}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:965});
  const all = [momo, pipi, kuku, otto];
  pipi.item('L', 'popcorn', itPopcorn(G(null, 'scale(1.3)'))); kuku.item('R', 'popcorn', itPopcorn(G(null, 'scale(1.3)')));
  all.forEach(a => a.item(a === pipi ? 'R' : (a === kuku ? 'L' : 'R'), 'kernel', (() => { const g = G(); mk('circle', S4({r:7, fill:'#FFF3C4'}, 2.2), g); return g; })()));
  momo.item('L', 'pillow', itPillow(G(null, 'scale(0.75)'), '#FFC3D2'));
  pipi.do('hold', 0, 45, {side:'L', item:'popcorn', at:[30, -76], ease:false}); kuku.do('hold', 0, 45, {item:'popcorn', at:[30, -76], ease:false});
  all.forEach((a, i) => a.do('look', 0, 45, {x:0, y:-2}));
  // munching
  all.forEach((a, i) => { const sd = a === kuku ? 'L' : 'R';
    for (let k=0;k<3;k++){ const t = 3.0 + i*0.7 + k*3.6; a.do('reach', t, 0.8, {side:sd, to: (a === momo || a === pipi) ? [X[1] - 34, 870] : [X[2] + 34, 870], item:'kernel'});
      a.do('reach', t + 0.8, 0.8, {side:sd, to:u => headW(a.c, 0, 30), item:'kernel'}); a.do('face', t + 1.4, 1.2, {eyes:'happy', mouth:'chew'}); S.sfx(t + 0.5, 'crinkle', 0.025, panOf(X[i]), {d:0.25}); S.sfx(t + 1.5, 'crunch', 0.05, panOf(X[i])); } });
  // funny part
  all.forEach((a, i) => a.do('laugh', 15.6 + i*0.15, 3.2));
  // spooky part: everyone hides; Momo behind pillow
  all.forEach((a, i) => { a.do('wow', 21.0 + i*0.1, 1.2); a.do('shiver', 21.6, 4.8); a.do('face', 21.6, 4.8, {eyes:'squeeze', mouth:'wavy'}); });
  momo.do('arms', 21.4, 5.2, {L:[16, -130], R:[16, -110], itemL:'pillow'});
  all.forEach((a, i) => a.do('laugh', 27.0 + i*0.15, 2.4));
  // sweet ending: everyone sniffles happily
  all.forEach((a, i) => { a.do('face', 31.0, 6, {eyes:'happy', mouth:'small'}); a.do('pose', 31.0, 6, {tear:0.7, tilt: i < 2 ? 6 : -6}); });
  all.forEach((a, i) => a.do('clap', 38.0 + i*0.15, 3.0)); all.forEach((a, i) => a.do('cheer', 41.4 + i*0.1, 2.2));
  // screen light from the front (the TV is where the camera is)
  S.tv = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#BFE3FF', opacity:0}, S.L.glowTop);
  S.hearts = heartBursts(S.L.fx, [{t:16.0, x:960, y:620, n:3}, {t:32.0, x:960, y:620, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:41.6, x:960, y:640, n:7, r:220}]);
  S.sfx(21.0, 'thump', 0.05, 0, {f:70, d:0.5}); S.sfx(36.4, 'chime', 0.03, 0, {f:1046.5});
  S.pre = u => S.L.update(u, {lampOff:1, dim:0.5});
  S.post = u => {
    const flick = 0.12 + 0.05*Math.sin(TAU*u*1.3) + 0.04*Math.sin(TAU*u*3.7) + 0.12*bump(u, 21.0, 0.4) + 0.06*rh(u, 15, 15.6, 18, 19);
    S.tv.setAttribute('opacity', flick.toFixed(3));
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC3 — FLASHLIGHT STORIES =================== */
const SC3 = scene(90, 135, {look:[960, 700, 1.28, 1.36]});
(function(){
  const S = SC3;
  S.L = locBedroom(S.cam, {futons:true});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 1); S.amb('night', 0, 45, 0.7); S.amb('clock', 0, 45, 0.8);
  quiltPattern('quiltF');
  const X = [600, 840, 1080, 1320];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:965}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:965});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:965}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:965});
  const all = [momo, pipi, kuku, otto];
  all.forEach(a => { const w = itBlanketWrap(G(a.c.bob)); a.c.bob.insertBefore(w, a.c.head); });
  kuku.item('R', 'torch', itTorch(G())); otto.item('R', 'torch', itTorch(G()));
  // Kuku tells a spooky story, torch under chin
  kuku.do('arms', 1.0, 15.0, {R:[20, -116], itemR:'torch'}); kuku.do('talk', 2.0, 5, {eyes:'open'}); kuku.do('talk', 8.0, 5); kuku.do('pose', 3, 12, {brow:true});
  kuku.do('arms', 12.6, 1.6, {L:[80, -190]}); kuku.do('wow', 12.8, 1.4);
  [momo, pipi, otto].forEach((a, i) => { a.do('look', 1, 14, {x: a === otto ? -6 : 6, y:0}); a.do('shiver', 9.0 + i*0.2, 3.6); a.do('wow', 13.0 + i*0.1, 1.4); });
  pipi.do('arms', 13.2, 2.4, {L:[30, -190], R:[30, -190], eyes:'squeeze', mouth:'open'});
  all.forEach((a, i) => a.do('laugh', 15.6 + i*0.15, 2.6));
  // Otto's shadow puppets on the wall
  otto.do('arms', 19.0, 15.0, {R:[60, -120], itemR:'torch'}); otto.do('arms', 19.0, 15.0, {L:[60, -170]});
  otto.fn = (u, st) => { const s = rh(u, 19.4, 20, 33.4, 34); st.tL = lerpP(st.tL, [-60 + 8*Math.sin(TAU*u*0.8), -170 + 10*Math.sin(TAU*u*1.6)], s); };
  [momo, pipi, kuku].forEach((a, i) => { a.do('look', 19, 15, {x:2, y:-8}); a.do('wow', 20.4 + i*0.2, 1.4); a.do('happy', 22 + i*0.3, 4, {mouth:'open'}); a.do('laugh', 28 + i*0.2, 2.4); });
  pipi.do('point', 24.0, 2.4, {side:'R', at:[60, -190]});
  all.forEach((a, i) => { a.do('yawn', 36.0 + i*0.8, 1.8); a.do('sleepy', 38.0 + i*0.6, 6); });
  S.wallLight = mk('ellipse', {cx:0, cy:0, rx:200, ry:150, fill:'url(#glowLamp)', opacity:0}, S.L.glowTop);
  S.shadow = G(S.L.glowTop); S.shadowB = G(S.shadow);
  // bunny-shaped shadow (two ears + head)
  mk('ellipse', {cx:0, cy:20, rx:60, ry:46, fill:'#3B2E4A', opacity:0.8}, S.shadowB); [[-26, -50, -10], [26, -50, 10]].forEach(q => mk('ellipse', {cx:q[0], cy:q[1], rx:16, ry:50, fill:'#3B2E4A', opacity:0.8, transform:`rotate(${q[2]} ${q[0]} ${q[1]})`}, S.shadowB));
  S.shadowF = G(S.shadow); mk('path', {d:'M-70 0 Q-20 -60 50 -10 L90 -40 L90 30 L50 10 Q-20 60 -70 0 Z', fill:'#3B2E4A', opacity:0.8}, S.shadowF);
  S.chin = mk('circle', {r:130, fill:'url(#glowLamp)', opacity:0}, S.L.glowTop);
  S.hearts = heartBursts(S.L.fx, [{t:16.0, x:960, y:620, n:3}, {t:29.0, x:960, y:600, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:20.4, x:1100, y:380, n:5, r:120}]);
  S.sfx(1.0, 'click', 0.06, 0.2); S.sfx(12.8, 'thump', 0.06, 0.2, {f:80, d:0.4}); S.sfx(13.0, 'whoosh', 0.04, 0, {d:0.5}); S.sfx(6.0, 'owl', 0.03, 0.7);
  S.sfx(19.0, 'click', 0.06, 0.5); S.sfx(26.6, 'sparkle', 0.04, 0.4); S.sfx(35.0, 'click', 0.05, 0.5);
  S.pre = u => S.L.update(u, {lampOff:1, dim:0.75});
  S.post = u => {
    const kc = rh(u, 1.2, 1.8, 15.6, 16.2); const kp = headW(kuku.c, 0, 30); S.chin.setAttribute('opacity', (0.8*kc).toFixed(3)); S.chin.setAttribute('cx', kp[0].toFixed(1)); S.chin.setAttribute('cy', kp[1].toFixed(1));
    const on = rh(u, 19.2, 19.8, 34.4, 35.0);
    const sx = 1150 + 60*Math.sin(TAU*u/7), sy = 380 + 20*Math.sin(TAU*u/5);
    S.wallLight.setAttribute('cx', sx); S.wallLight.setAttribute('cy', sy); S.wallLight.setAttribute('opacity', (0.9*on).toFixed(3));
    S.shadow.setAttribute('opacity', on.toFixed(3)); T(S.shadow, `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`);
    const bird = u > 26.4; show(S.shadowB, !bird); show(S.shadowF, bird);
    T(S.shadowB, `rotate(${(8*Math.sin(TAU*u*0.9)).toFixed(1)}) scale(1 ${(1 + 0.06*Math.sin(TAU*u*1.6)).toFixed(3)})`);
    T(S.shadowF, `translate(${(30*Math.sin(TAU*u/3)).toFixed(1)} 0) scale(1 ${(0.6 + 0.4*Math.abs(Math.sin(TAU*u*1.2))).toFixed(3)})`);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC4 — GOODNIGHT =================== */
const SC4 = scene(135, 180, {look:[960, 740, 1.32, 1.44]});
(function(){
  const S = SC4;
  S.L = locBedroom(S.cam, {futons:true, blankets:true});
  const ly = S.L.chars;
  S.amb('night', 0, 45, 0.8); S.amb('clock', 0, 45, 0.8); S.amb('room', 0, 45, 1);
  const X = [560, 860, 1160, 1460];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:960}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:960});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:960}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:960});
  const all = [momo, pipi, kuku, otto];
  all.forEach((a, i) => { a.do('wave', 2.0 + i*0.4, 2.6); a.do('happy', 5 + i*0.2, 3, {mouth:'open'}); });
  momo.do('talk', 8.0, 2.4); pipi.do('talk', 10.4, 2.2); kuku.do('talk', 12.6, 2.2); otto.do('talk', 14.8, 2.2);
  all.forEach((a, i) => a.do('shy', 17.4 + i*0.2, 2.8));
  momo.do('reach', 21.4, 1.4, {side:'L', to:[760, 560]});
  all.forEach((a, i) => { a.do('yawn', 23.6 + i*0.9, 1.8); a.do('sleepy', 25 + i*0.9, 3); a.do('sleep', 28 + i*0.9, 17, {tilt: [10, 6, -6, -10][i], arms:false}); });
  S.z = all.map(() => zText(S.L.fx));
  S.moonTxt = G(S.L.glowTop); mk('rect', SK({x:-170, y:-44, width:340, height:76, rx:38, fill:'#FFFDF8', 'fill-opacity':0.92}, 4), S.moonTxt); txt(S.moonTxt, 0, 8, 'Good night ♡', 34, '#8E7BC4');
  S.hearts = heartBursts(S.L.fx, [{t:18.0, x:1010, y:620, n:5}, {t:33.0, x:1010, y:600, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:36.0, x:1530, y:240, n:6, r:90}]);
  S.sfx(21.8, 'click', 0.06, -0.2); S.sfx(36.0, 'sparkle', 0.04, 0.5); S.sfx(37.0, 'chime', 0.03, 0, {f:784});
  S.pre = u => S.L.update(u, {lampOff: sm((u - 21.8)/0.4), dim: 0.3*sm((u - 21.8)/1.2)});
  S.post = u => {
    all.forEach((a, i) => { const h = headW(a.c, 40, -60); S.z[i](h[0], h[1], u + i, sm((u - 29 - i)/1.5)); });
    const v = rh(u, 37.0, 38.0, 43.2, 44.0); S.moonTxt.setAttribute('opacity', v.toFixed(3)); T(S.moonTxt, `translate(1010 ${(470 - 20*v).toFixed(1)})`);
    S.hearts(u); S.spark(u);
  };
})();

EPISODE({day:11, title:'Sleepover Night', music:{seed:21, key:0, bpm:66, prog:3},
  chapters:[['Pillow Fight!', IC.pillow], ['Movie Night', IC.popcorn], ['Flashlight Stories', IC.torch], ['Good Night', ICONS.moon]],
  scenes:[SC1, SC2, SC3, SC4]});
