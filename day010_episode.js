/* =====================================================================
   FUR FRIENDS — Day 10: "Aquarium Adventure"   (180 s)
   train ride → ocean tunnel → jellyfish room → sleepy ride home
   ===================================================================== */
function distFn(keys){ const cache = []; return function(u){ let d = 0; for (let x = 0; x < u; x += 0.05) d += K(x, keys)*0.05; return d; }; }
function itPlush(p, col){ const g = G(p); mk('path', S4({d:'M-26 6 Q-24 -16 0 -14 Q20 -12 22 2 Q12 14 -8 14 Q-22 14 -26 6 Z', fill:col || '#8FB8E8'}), g); mk('path', S4({d:'M22 2 L32 -8 L32 10 Z', fill:col || '#8FB8E8'}, 3), g); mk('circle', {cx:-14, cy:-2, r:3, fill:OL}, g); mk('ellipse', {cx:-8, cy:6, rx:4, ry:2.5, fill:'#FFB7C6'}, g); return g; }
function itCookie(p){ const g = G(p); const b = G(g); g.body = b; mk('circle', S4({r:14, fill:'#E8B06A'}), b); [[-5,-4],[5,2],[-2,6]].forEach(q => mk('circle', {cx:q[0], cy:q[1], r:2.5, fill:'#6E4A30'}, b)); return g; }

/* =================== SC1 — TRAIN RIDE =================== */
const SC1 = scene(0, 45, {look:[960, 650, 1.36, 1.42]});
(function(){
  const S = SC1;
  S.L = locTrain(S.cam, {});
  const ly = S.L.chars;
  S.amb('train', 0, 45, 1.2);
  const X = [600, 820, 1100, 1320];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:905}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:905});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:905}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:905});
  const all = [momo, pipi, kuku, otto];
  S.dist = distFn([[0,0],[2,0],[7,1],[38,1],[44,0.15],[45,0]]);
  momo.item('R', 'ticket', itTicket(G())); all.forEach(a => a.item('L', 'ticket', itTicket(G())));
  pipi.item('R', 'cookie', itCookie(G())); [momo, kuku, otto].forEach(a => a.item('R', 'cookie', itCookie(G())));
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  all.forEach((a, i) => a.fn = (u, st) => { st.hy += (S.L.sway || 0)*(1 + 0.2*i); st.tilt += 0.8*(S.L.sway || 0); });
  // departure
  all.forEach((a, i) => { a.do('wow', 2.4 + i*0.1, 1.4); a.do('happy', 4.0, 2.4, {mouth:'open'}); });
  // tickets
  momo.do('arms', 6.0, 3.0, {R:[50, -150], itemR:'ticket', eyes:'happy', mouth:'open'});
  [pipi, kuku, otto].forEach((a, i) => { const t = 9.0 + i*1.0; a.do('hold', t + 0.6, 4.4 - i*0.6, {side:'L', item:'ticket', at:[44, -130]}); });
  momo.do('hold', 8.6, 3.6, {side:'L', item:'ticket', at:[44, -130]});
  // window watching
  kuku.do('look', 14, 9, {x:2, y:-8}); kuku.do('point', 15.4, 2.4, {side:'R', at:[80, -190]}); kuku.do('wow', 15.2, 1.4);
  pipi.do('bob', 14, 9, {f:0.6}); otto.do('photo', 17.4, 3.0); momo.do('look', 15, 6, {x:3, y:-7}); momo.do('happy', 17, 3);
  otto.do('laugh', 21.0, 2.0);
  // cookies
  pipi.do('arms', 24.0, 2.4, {R:[40, -140], itemR:'cookie', eyes:'happy', mouth:'open'});
  [momo, kuku, otto].forEach((a, i) => a.do('eat', 26.6 + i*0.4, 7.4, {item:'cookie', bites:3, per:2.5}));
  pipi.do('eat', 26.4, 7.4, {item:'cookie', bites:3, per:2.5});
  // arrival
  all.forEach((a, i) => { a.do('look', 37.0, 5, {x:4, y:-6}); a.do('cheer', 41.0 + i*0.15, 2.4); });
  S.photo = photoFX(S, S.L.fx); S.notes = notesFx(S.L.fx, 3);
  S.flyT = [0,1,2].map(() => { const g = G(S.L.fx); itTicket(g); return g; });
  S.flyC = [0,1,2].map(() => { const g = G(S.L.fx); itCookie(g); return g; });
  S.hearts = heartBursts(S.L.fx, [{t:4.4, x:960, y:560, n:3}, {t:29.0, x:960, y:560, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:41.2, x:960, y:520, n:7, r:200}]);
  S.sfx(1.0, 'horn', 0.06, 0.6); S.sfx(40.6, 'horn', 0.05, 0.6); S.sfx(43.4, 'hiss', 0.04, 0, {d:1.4}); S.sfx(42.6, 'doorbell', 0.05, 0);
  [9.6, 10.6, 11.6].forEach(t => S.sfx(t, 'click', 0.05, 0)); S.sfx(18.4, 'shutter', 0.1, 0.5); S.sfx(24.4, 'crinkle', 0.04, -0.2);
  S.pre = u => S.L.update(u, {dist: S.dist(u), speed: K(u, [[0,0],[2,0],[7,1],[38,1],[44,0.15],[45,0]])});
  S.post = u => {
    [pipi, kuku, otto].forEach((a, i) => flyItem(S.flyT[i], u, 9.0 + i*1.0, 0.6, paw(momo.c, 1), paw(a.c, -1), 60, 0));
    [momo, kuku, otto].forEach((a, i) => flyItem(S.flyC[i], u, 25.2 + i*0.4, 0.7, paw(pipi.c, 1), paw(a.c, 1), 60, 180));
    S.photo(u, [18.4], otto);
    const h = headW(pipi.c, 0, -60); S.notes(h[0], h[1], u, rh(u, 14, 15, 22.4, 23.2));
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — OCEAN TUNNEL =================== */
const SC2 = scene(45, 90, {look:[960, 640, 1.08, 1.14]});
(function(){
  const S = SC2;
  S.L = locAquarium(S.cam, {});
  const ly = S.L.chars;
  S.amb('aquarium', 0, 45, 1.2);
  const momo = actor(S, 'cat', {layer:ly, x:[[0,-200],[6,560],[45,560]], y:990, steps:'softstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,-420],[6.6,800],[45,800]], y:990, steps:'softstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,-600],[7.2,1080],[45,1080]], y:990, steps:'softstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,-780],[7.8,1340],[30,1340],[31.4,1460],[45,1460]], y:990, steps:'softstep'});
  const all = [momo, pipi, kuku, otto];
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  all.forEach((a, i) => { a.do('look', 7, 7, {x: -2 + i, y:-8}); a.do('wow', 8.0 + i*0.25, 1.6); a.do('happy', 10 + i*0.3, 3.4, {mouth:'open'}); });
  kuku.do('wave', 11.4, 3.0); pipi.do('point', 12.0, 2.4, {side:'L', at:[80, -190]});
  // the big whale passes overhead
  all.forEach((a, i) => { a.do('look', 15.0, 14, {x:0, y:-9}); a.do('face', 17.0 + i*0.2, 8, {eyes:'open', mouth:'open'}); a.do('pose', 17.0, 10, {hy:-6, tilt:0}); });
  momo.do('arms', 19, 6, {L:[20, -110], R:[20, -110]}); pipi.do('arms', 19.4, 6, {L:[60, -180], R:[60, -180]});
  all.forEach((a, i) => a.do('cheer', 27.0 + i*0.15, 2.2));
  // Otto at the glass + photo
  otto.do('arms', 31.6, 4.6, {L:[60, -170], R:[60, -170], eyes:'happy', mouth:'open'}); otto.do('pose', 31.6, 4.6, {lookY:-8});
  otto.do('photo', 37.0, 2.6);
  [momo, pipi, kuku].forEach((a, i) => { a.do('look', 33, 6, {x:5, y:-4}); a.do('laugh', 35 + i*0.2, 2.2); });
  [momo, pipi, kuku].forEach((a, i) => a.do('wave', 40.4 + i*0.2, 3.4)); otto.do('wave', 40.6, 3.4);
  S.photo = photoFX(S, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:9.0, x:800, y:740, n:3}, {t:27.4, x:960, y:720, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:21.0, x:960, y:330, n:8, r:240}]);
  S.sfx(16.0, 'whoosh', 0.05, 0.6, {d:6.0, f0:120, f1:500}); S.sfx(21.0, 'bloop', 0.04, 0); S.sfx(21.5, 'sparkle', 0.04, 0);
  S.sfx(38.0, 'shutter', 0.1, 0.4); [5, 13, 34].forEach(t => S.sfx(t, 'bloop', 0.025, 0.3));
  S.pre = u => S.L.update(u, {big: (u - 14.0)/16});
  S.post = u => { S.photo(u, [38.0], otto); S.hearts(u); S.spark(u); };
})();

/* =================== SC3 — JELLYFISH ROOM =================== */
const SC3 = scene(90, 135, {look:[960, 640, 1.18, 1.28]});
(function(){
  const S = SC3;
  S.L = locAquarium(S.cam, {room:'jelly', bench:960, benchW:780});
  const ly = S.L.chars;
  S.amb('aquarium', 0, 45, 0.9); S.amb('hum', 0, 45, 1);
  const X = [700, 880, 1060, 1240];
  const momo = actor(S, 'cat', {layer:ly, x:[[0,-160],[5.4,X[0]]], y:[0], steps:'softstep'}), pipi = actor(S, 'bunny', {layer:ly, x:[[0,-340],[5.8,X[1]]], steps:'softstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,2100],[5.6,X[2]]], steps:'softstep'}), otto = actor(S, 'otter', {layer:ly, x:[[0,2280],[6.0,X[3]]], steps:'softstep'});
  const all = [momo, pipi, kuku, otto];
  all.forEach((a, i) => { a.y = 0; a.ypath = [[0,1000],[5.4 + i*0.2,1000],[6.4 + i*0.2,960]]; a.s = 0.9; });
  all.forEach((a, i) => { a.do('look', 7, 10, {x: i < 2 ? -6 : 6, y:-6}); a.do('happy', 9 + i*0.3, 5, {mouth:'small'}); });
  // jellyfish dance
  all.forEach((a, i) => a.do('arms', 18.0 + i*0.3, 10, {L:u => [44, -150 + 30*Math.sin(TAU*u/2.6 + i)], R:u => [44, -150 + 30*Math.sin(TAU*u/2.6 + i)], eyes:'happy', mouth:'open'}));
  all.forEach((a, i) => a.do('pose', 18.0, 10, {hy: 0, tilt:0}));
  all.forEach((a, i) => a.fn = (u, st) => { const d = rh(u, 18, 19, 27.6, 28.4); st.hop += d*12*(0.5 + 0.5*Math.sin(TAU*u/2.6 + i)); });
  all.forEach((a, i) => a.do('laugh', 28.6 + i*0.15, 2.4));
  // calm, lean together, dreamy
  [[momo, 6, 8], [pipi, 4, 4], [kuku, -4, -4], [otto, -6, -8]].forEach((q, i) => { q[0].do('pose', 32 + i*0.2, 13, {x:X[i] + q[1], tilt:q[2]}); q[0].do('happy', 33 + i*0.3, 12); });
  pipi.do('yawn', 38.0, 1.8); kuku.do('sleepy', 40, 5);
  S.glow = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#B3E6FF', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:12.0, x:960, y:680, n:3}, {t:30.0, x:960, y:660, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:20.0, x:420, y:400, n:5, r:120}, {t:24.0, x:1500, y:400, n:5, r:120}]);
  S.sfx(18.0, 'sparkle', 0.04, -0.4); S.sfx(24.0, 'sparkle', 0.04, 0.4); S.sfx(30.0, 'chime', 0.025, 0, {f:1046.5});
  for (let t = 3; t < 44; t += 4.3) S.sfx(t, 'bloop', 0.02, -0.6 + (t % 3)*0.4);
  S.pre = u => S.L.update(u);
  S.post = u => { S.glow.setAttribute('opacity', (0.04 + 0.03*Math.sin(TAU*u/4)).toFixed(3)); S.hearts(u); S.spark(u); };
})();

/* =================== SC4 — SLEEPY RIDE HOME =================== */
const SC4 = scene(135, 180, {look:[960, 660, 1.42, 1.52]});
(function(){
  const S = SC4;
  S.L = locTrain(S.cam, {tod:'dusk'});
  const ly = S.L.chars;
  S.amb('train', 0, 45, 1.0);
  const X = [640, 840, 1080, 1280];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:905}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:905});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:905}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:905});
  const all = [momo, pipi, kuku, otto];
  const pc = ['#8FB8E8', '#E7B6F5', '#9FE3B0', '#FFB47A'];
  all.forEach((a, i) => a.item('R', 'plush', itPlush(G(null, 'translate(0 -6)'), pc[i])));
  all.forEach((a, i) => { a.do('hold', 0, 45, {item:'plush', at:[24, -84], ease:false}); a.fn = (u, st) => { st.hy += (S.L.sway || 0)*0.8; }; });
  all.forEach((a, i) => { a.do('arms', 1.5 + i*0.4, 2.4, {R:[40, -150], itemR:'plush', eyes:'happy', mouth:'open'}); a.do('shy', 6 + i*0.5, 2.6); });
  kuku.do('talk', 10, 3, {gest:true}); momo.do('laugh', 13.0, 2.0); otto.do('laugh', 13.2, 2.0); pipi.do('laugh', 13.4, 2.0);
  all.forEach((a, i) => a.do('look', 16, 8, {x:2, y:-7}));
  all.forEach((a, i) => a.do('happy', 17 + i*0.3, 6));
  // getting sleepy
  [otto, kuku, pipi, momo].forEach((a, i) => { a.do('yawn', 24 + i*1.6, 1.8); a.do('sleepy', 26 + i*1.6, 4); });
  [[momo, 10, 14], [pipi, 6, 10], [kuku, -6, -10], [otto, -10, -14]].forEach((q, i) => { q[0].do('pose', 31 + i*0.6, 14, {x:X[i] + q[1], tilt:q[2]}); q[0].do('sleep', 32 + i*0.6, 13, {tilt:q[2]*0.5, arms:false}); });
  S.z = [zText(S.L.fx), zText(S.L.fx)];
  S.hearts = heartBursts(S.L.fx, [{t:6.4, x:960, y:560, n:5}, {t:36.0, x:960, y:560, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:2.0, x:960, y:560, n:6, r:200}]);
  S.sfx(2.0, 'squish', 0.04, 0); S.sfx(6.0, 'chime', 0.025, 0, {f:1318.5});
  S.pre = u => S.L.update(u, {speed: 0.8, dim: 0.25*sm((u - 20)/20)});
  S.post = u => { const a = headW(pipi.c, 40, -60), b = headW(otto.c, 40, -60); S.z[0](a[0], a[1], u, sm((u - 33)/2)); S.z[1](b[0], b[1], u + 1.3, sm((u - 34)/2)); S.hearts(u); S.spark(u); };
})();

EPISODE({day:10, title:'Aquarium Adventure', music:{seed:20, key:-3, bpm:70, prog:2},
  chapters:[['All Aboard!', IC.train], ['Ocean Tunnel', IC.whale], ['Jellyfish Glow', IC.jelly], ['Sleepy Ride Home', ICONS.moon]],
  scenes:[SC1, SC2, SC3, SC4]});
