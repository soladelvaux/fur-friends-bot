/* =====================================================================
   FUR FRIENDS — Day 8: "Library Day"   (180 s)
   book hunt → reading nook → study & draw → bedtime story
   ===================================================================== */
function itBigBook(p, col, s){ const g = G(p, `scale(${s || 1})`); mk('rect', S4({x:-26, y:-34, width:52, height:66, rx:6, fill:col || '#B79BE8'}), g); mk('rect', {x:-18, y:-24, width:36, height:12, rx:3, fill:'#FFFDF6'}, g); mk('path', {d:'M-26 22 H26', stroke:'#FFFFFF', 'stroke-width':4, opacity:0.6}, g); return g; }
function itPaper(p){ const g = G(p); mk('rect', S4({x:-40, y:-30, width:80, height:60, rx:4, fill:'#FFFDF6'}), g); g.draw = G(g); return g; }

/* =================== SC1 — BOOK HUNT =================== */
const SC1 = scene(0, 45, {look:[1100, 640, 1.12, 1.18]});
(function(){
  const S = SC1;
  S.L = locLibrary(S.cam, {});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 1.2); S.amb('clock', 0, 45, 0.6); S.amb('birds', 0, 45, 0.2);
  const momo = actor(S, 'cat', {layer:ly, x:[[0,-200],[6.4,700],[14,700],[15.6,560],[45,560]], y:960, steps:'woodstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,-420],[6.8,900],[16,900],[17.6,300],[25,300],[27,880],[45,880]], y:960, steps:'woodstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,-600],[7.2,1110],[9.6,1110],[11.0,1440],[12,1440],[14.4,1490],[23,1490],[25.4,1440],[26.4,1300],[45,1300]], y:960, steps:'woodstep'});
  kuku.ypath = [[0,960],[12,960],[14.4,560],[23,560],[25.4,960]];
  const otto = actor(S, 'otter', {layer:ly, x:[[0,-760],[7.6,1300],[17,1300],[18,1560],[24,1560],[25,1620],[45,1620]], y:960, steps:'woodstep'});
  momo.item('R', 'book', itBigBook(G(), '#7FA8D8', 1.0)); pipi.item('R', 'book', itBigBook(G(), '#FFB3C7', 0.9)); otto.item('R', 'book', itBigBook(G(), '#FFD27A', 1.0));
  kuku.item('R', 'book', itBigBook(G(), '#FFD27A', 1.0));
  const all = [momo, pipi, kuku, otto];
  all.forEach((a, i) => { a.do('look', 7.4, 4.6, {x: i < 2 ? -3 : 3, y:-8}); a.do('wow', 7.8 + i*0.2, 1.6); });
  momo.do('think', 9.6, 2.4); momo.do('arms', 12.0, 1.0, {R:[12, -110]}); // shh
  // Momo pulls a thick book
  momo.do('reach', 16.0, 1.4, {to:[470, 740], item:'book'}); momo.do('hold', 17.4, 27.6, {item:'book', at:[20, -100]}); momo.do('look', 17.4, 6, {x:0, y:6}); momo.do('happy', 18, 3);
  // Pipi finds a picture book low on the shelf
  pipi.do('reach', 18.0, 1.6, {to:[260, 900], item:'book', lean:10}); pipi.do('hold', 19.6, 25.4, {item:'book', at:[30, -110]}); pipi.do('cheer', 20.0, 1.8); pipi.do('bob', 27, 6, {f:0.6});
  // Kuku climbs the ladder; book slips; Otto catches
  kuku.do('work', 12.0, 2.4, {kind:'pull', rate:1.6}); kuku.do('reach', 15.0, 2.6, {to:[1700, 420], lean:8}); kuku.do('wow', 17.6, 1.6); kuku.do('pose', 17.6, 3.0, {sweat:1, eyes:'squeeze', mouth:'open'});
  otto.do('look', 17.6, 3, {x:0, y:-8}); otto.do('arms', 19.6, 2.0, {L:[40, -170], R:[40, -170], eyes:'squeeze', mouth:'open'}); otto.do('hold', 21.0, 4.6, {item:'book', at:[40, -150]}); otto.do('cheer', 21.6, 1.6);
  kuku.do('cheer', 21.4, 1.6, {h:0}); kuku.do('wave', 23.2, 1.4);
  otto.do('reach', 26.2, 1.0, {to:u => paw(kuku.c, 1), item:'book'}); kuku.do('hold', 27.0, 18, {item:'book', at:[30, -100]}); kuku.do('happy', 27.2, 3, {mouth:'open'});
  // read the covers, giggle quietly
  [momo, pipi, kuku, otto].forEach((a, i) => a.do('laugh', 31.0 + i*0.3, 2.2));
  momo.do('arms', 34.0, 1.6, {L:[12, -110]}); [pipi, kuku, otto].forEach(a => a.do('shy', 34.4, 2.2));
  [momo, pipi, kuku, otto].forEach((a, i) => a.do('look', 37, 6, {x:-5, y:-2}));
  pipi.do('point', 38.0, 2.2, {side:'L', at:[100, -150]}); all.forEach((a, i) => a.do('nod', 40.2 + i*0.1, 1.6));
  S.fall = itBigBook(G(S.L.fx), '#FFD27A', 1.0);
  S.shh = txt(S.L.fx, 0, 0, 'shh…', 34, '#8E7BC4'); S.shh2 = txt(S.L.fx, 0, 0, 'shh…', 34, '#8E7BC4');
  S.hearts = heartBursts(S.L.fx, [{t:20.4, x:300, y:720, n:3}, {t:31.4, x:960, y:640, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:16.8, x:480, y:740, n:4, r:50}, {t:21.2, x:1560, y:760, n:5, r:70}]);
  S.sfx(12, 'woodstep', 0.04, 0.5); [12.8, 13.4, 14.0].forEach(t => S.sfx(t, 'knock', 0.035, 0.5, {f:330}));
  S.sfx(16.6, 'rustle', 0.03, -0.4, {d:0.4}); S.sfx(18.8, 'rustle', 0.03, -0.6, {d:0.4}); S.sfx(17.6, 'whoosh', 0.04, 0.6, {d:0.5}); S.sfx(19.9, 'thump', 0.06, 0.6, {f:140});
  [24.0, 24.6, 25.2].forEach(t => S.sfx(t, 'knock', 0.035, 0.5, {f:330})); S.sfx(20.2, 'chime', 0.02, 0.6, {f:1568});
  S.pre = u => S.L.update(u);
  S.post = u => {
    const v = (u - 17.8)/1.8; show(S.fall, v > 0 && v < 1);
    if (v > 0 && v < 1){ const p = arcP([1680, 440], [1600, 790], v, 40); T(S.fall, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${(360*v).toFixed(1)})`); }
    [[S.shh, momo, 12.0], [S.shh2, momo, 34.0]].forEach(q => { const a = rh(u, q[2], q[2] + 0.3, q[2] + 1.6, q[2] + 2.2); q[0].setAttribute('opacity', a.toFixed(3)); const h = headW(q[1].c, 70, -80); q[0].setAttribute('x', h[0].toFixed(1)); q[0].setAttribute('y', (h[1] - 20*a).toFixed(1)); });
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — READING NOOK =================== */
const SC2 = scene(45, 90, {look:[960, 780, 1.4, 1.48]});
(function(){
  const S = SC2;
  S.L = locLibrary(S.cam, {cozy:true});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 1.2); S.amb('clock', 0, 45, 1); S.amb('rain', 0, 45, 0.25);
  const momo = actor(S, 'cat', {layer:ly, x:520, y:930}), otto = actor(S, 'otter', {layer:ly, x:720, y:950});
  const pipi = actor(S, 'bunny', {layer:ly, x:1220, y:950}), kuku = actor(S, 'squirrel', {layer:ly, x:1400, y:930});
  momo.item('R', 'book', itBook(G(null, 'translate(-14 -8)'), '#7FA8D8'));
  otto.item('R', 'book', itBook(G(null, 'translate(-14 -8)'), '#FFD27A'));
  pipi.item('R', 'book', itBook(G(null, 'translate(-14 -8) scale(1.15)'), '#FFB3C7'));
  // Momo reads... and dozes off, book slides onto her face
  momo.do('hold', 0, 45, {item:'book', at:[16, -100], ease:false}); momo.do('look', 0, 12, {x:0, y:6});
  momo.do('sleepy', 8, 6); momo.do('sleep', 14, 15, {tilt:14, arms:false}); momo.do('pose', 18.0, 11, {tR:[14, -150]});
  momo.do('wow', 29.0, 1.4); momo.do('shy', 30.6, 2.6); momo.do('look', 33, 12, {x:0, y:6});
  // Pipi reads aloud to Kuku
  pipi.do('hold', 0, 45, {item:'book', at:[16, -100], ease:false}); pipi.do('talk', 3, 6); pipi.do('talk', 12, 5); pipi.do('talk', 34, 6);
  pipi.do('arms', 9.4, 2.4, {R:[40, -150]}); // show picture
  kuku.do('look', 2, 40, {x:-6, y:2}); kuku.do('wow', 10.0, 1.6); kuku.do('happy', 12, 6, {mouth:'open'}); kuku.do('nod', 19, 2);
  kuku.do('laugh', 24.0, 2.4); pipi.do('laugh', 24.2, 2.4);
  // Otto flips pages fast and giggles
  otto.do('hold', 0, 45, {item:'book', at:[16, -100], ease:false}); otto.do('look', 0, 45, {x:0, y:6});
  otto.do('laugh', 6.0, 2.0); otto.do('laugh', 15.6, 2.0); otto.do('arms', 21.6, 1.0, {L:[14, -112]});
  otto.do('look', 26.6, 2.6, {x:-7, y:0}); otto.do('point', 27.0, 1.8, {side:'L', at:[100, -140]});
  [pipi, kuku].forEach(a => { a.do('look', 27.4, 3, {x:-7, y:0}); a.do('laugh', 30.4, 2.2); }); otto.do('laugh', 30.2, 2.4);
  // all settle in, happy reading
  [pipi, kuku, otto, momo].forEach((a, i) => a.do('happy', 40.0 + i*0.2, 4));
  S.z = zText(S.L.fx);
  S.flipT = [5, 6.2, 7.4, 14.8, 16.0, 17.2, 35.0, 37.0];
  S.hearts = heartBursts(S.L.fx, [{t:10.0, x:1300, y:700, n:3}, {t:40.6, x:960, y:700, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:9.8, x:1280, y:760, n:5, r:60}]);
  S.flipT.forEach(t => S.sfx(t, 'page', 0.05, panOf(720))); [4, 13, 35].forEach(t => S.sfx(t, 'page', 0.05, panOf(1220)));
  S.sfx(18.0, 'thump', 0.03, -0.5, {f:220, d:0.12}); S.sfx(29.0, 'page', 0.05, -0.5); S.sfx(29.2, 'chime', 0.02, -0.5, {f:1568});
  S.pre = u => S.L.update(u, {dim:0.25});
  S.post = u => {
    const h = headW(momo.c, 40, -60); S.z(h[0], h[1], u, rh(u, 15, 16.5, 28.4, 29.2));
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC3 — STUDY & DRAW =================== */
const SC3 = scene(90, 135, {look:[940, 740, 1.55, 1.62]});
(function(){
  const S = SC3;
  S.L = locLibrary(S.cam, {table:true});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 1.2); S.amb('clock', 0, 45, 0.8);
  const X = [620, 810, 1010, 1220];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:925}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:925});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:925}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:925});
  pipi.item('R', 'pencil', itPenBrush(G(), '#FFB3C7')); otto.item('R', 'pencil', itPenBrush(G(), '#9FD3F5'));
  momo.item('R', 'book', itBook(G(null, 'translate(-14 -8)'), '#7FA8D8'));
  pipi.item('L', 'paper', itPaper(G()));
  // drawing / writing
  pipi.do('work', 2.0, 20.0, {kind:'write', rate:1.0, itemR:'pencil', look:[0, 8], snd:'scratch', every:1, gain:0.03, sndO:{d:0.5}});
  otto.do('work', 3.0, 12.0, {kind:'write', rate:0.9, itemR:'pencil', look:[0, 8], snd:'scratch', every:1, gain:0.025, sndO:{d:0.5}});
  otto.do('think', 15.4, 2.6); otto.do('work', 18.2, 8, {kind:'write', rate:0.9, itemR:'pencil', look:[0, 8]});
  momo.do('hold', 1.0, 22, {item:'book', at:[20, -100]}); momo.do('look', 1, 22, {x:0, y:5}); [8, 15].forEach(t => momo.do('happy', t, 1.2));
  // Kuku's book tower
  const TOWER = [3.0, 5.0, 7.0, 9.0, 11.0, 13.0];
  TOWER.forEach(t => { kuku.do('reach', t, 1.6, {to:[1100, 840 - 26*TOWER.indexOf(t)], lean:4}); });
  kuku.do('cheer', 15.2, 1.8); kuku.do('wow', 17.6, 1.4); kuku.do('pose', 17.6, 3, {sweat:1, eyes:'squeeze'});
  momo.do('reach', 18.0, 2.0, {side:'L', to:[1000, 760]}); otto.do('reach', 18.2, 1.8, {side:'L', to:[1180, 760]});
  kuku.do('laugh', 21.0, 2.2); momo.do('laugh', 21.2, 2.0); otto.do('laugh', 21.4, 2.0);
  // big reveal: Pipi drew everyone
  pipi.do('arms', 24.0, 10.0, {L:[40, -150], itemL:'paper', eyes:'happy', mouth:'open'});
  [momo, kuku, otto].forEach((a, i) => { a.do('look', 24.2, 8, {x: i ? -6 : 6, y:-2}); a.do('wow', 24.4 + i*0.2, 1.4); a.do('clap', 26.4 + i*0.2, 2.4); });
  pipi.do('shy', 30.0, 3.0);
  otto.do('arms', 34.0, 4.0, {L:[40, -150], eyes:'happy', mouth:'open'});
  [momo, pipi, kuku].forEach((a, i) => a.do('laugh', 34.6 + i*0.2, 2.6));
  [momo, pipi, kuku, otto].forEach((a, i) => a.do('cheer', 40.0 + i*0.15, 2.2));
  S.tower = TOWER.map((t, i) => { const g = G(S.L.top); itBigBook(G(g, 'rotate(90)'), BOOKC[i % BOOKC.length], 0.9); return g; });
  S.ottoPaper = itPaper(G(S.L.fx)); // Otto shows a list drawing
  [0, 1, 2].forEach(k => mk('path', {d:`M-28 ${-16 + k*14} h${40 - k*8}`, stroke:'#9FD3F5', 'stroke-width':4, 'stroke-linecap':'round'}, S.ottoPaper.draw));
  mk('path', {d:HEART_D, fill:'#FF9DB5', transform:'translate(22 14) scale(0.5)'}, S.ottoPaper.draw);
  // Pipi's drawing: four little faces
  S.pp = G(S.L.fx); itPaper(S.pp);
  [['#FFFFFF',-27],['#FFF8EC',-9],['#FF9A5A',9],['#A6744F',27]].forEach(f => { mk('circle', {cx:f[1], cy:-2, r:8, fill:f[0], stroke:OL, 'stroke-width':2}, S.pp); mk('path', {d:`M${f[1] - 3} 0 q3 3 6 0`, fill:'none', stroke:OL, 'stroke-width':1.5}, S.pp); });
  mk('path', {d:HEART_D, fill:'#FF9DB5', transform:'translate(0 -20) scale(0.4)'}, S.pp);
  S.hearts = heartBursts(S.L.fx, [{t:26.0, x:840, y:620, n:5}, {t:40.4, x:960, y:620, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:15.0, x:1100, y:700, n:5, r:60}, {t:24.6, x:840, y:640, n:6, r:80}]);
  TOWER.forEach((t, i) => S.sfx(t + 1.0, 'thump', 0.04, panOf(1100), {f:180, d:0.12}));
  S.sfx(17.4, 'whoosh', 0.03, 0.2, {d:0.6}); S.sfx(18.4, 'rattle', 0.02, 0.2, {d:0.5}); S.sfx(24.2, 'crinkle', 0.04, -0.2); S.sfx(24.6, 'sparkle', 0.04, -0.2);
  S.pre = u => S.L.update(u, {dim:0.2});
  S.post = u => {
    S.tower.forEach((g, i) => { const t = TOWER[i] + 1.0; const v = sm((u - t)/0.3); show(g, v > 0.01);
      const wob = 6*Math.sin(TAU*u*2.2)*rh(u, 16.6, 17.4, 19.6, 20.6)*i/5; T(g, `translate(${(1100 + wob*i*0.6).toFixed(1)} ${(880 - 26*i - 20*(1 - v)).toFixed(1)}) rotate(${(wob*0.8).toFixed(2)})`); });
    const pv = rh(u, 24.0, 24.6, 33.4, 34.0); show(S.pp, pv > 0.01); if (pv > 0.01){ const p = paw(pipi.c, -1); T(S.pp, `translate(${p[0].toFixed(1)} ${(p[1] - 30).toFixed(1)}) scale(${(1.5*pv).toFixed(3)})`); }
    const ov = rh(u, 34.0, 34.6, 37.4, 38.0); show(S.ottoPaper, ov > 0.01); if (ov > 0.01){ const p = paw(otto.c, -1); T(S.ottoPaper, `translate(${p[0].toFixed(1)} ${(p[1] - 30).toFixed(1)}) scale(${(1.3*ov).toFixed(3)})`); }
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC4 — BEDTIME STORY =================== */
const SC4 = scene(135, 180, {look:[1010, 780, 1.45, 1.55]});
(function(){
  const S = SC4;
  S.L = locBedroom(S.cam, {futons:true, blankets:true});
  const ly = S.L.chars;
  S.amb('night', 0, 45, 0.6); S.amb('clock', 0, 45, 0.8); S.amb('room', 0, 45, 1);
  const X = [560, 860, 1160, 1460];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:950}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:960});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:960}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:960});
  momo.item('R', 'book', itBook(G(null, 'translate(-14 -8) scale(1.2)'), '#7FA8D8'));
  momo.do('hold', 0, 38, {item:'book', at:[22, -104], ease:false});
  [[2, 6], [10, 5], [18, 6], [27, 6]].forEach(q => momo.do('talk', q[0], q[1]));
  momo.do('arms', 8.4, 1.6, {L:[60, -170]}); momo.do('arms', 24.4, 2.0, {L:[60, -170]});
  [pipi, kuku, otto].forEach((a, i) => { a.do('look', 0, 30, {x:-6, y:0}); a.do('wow', 8.6 + i*0.15, 1.4); a.do('happy', 12 + i, 4, {mouth:'open'}); a.do('laugh', 24.6 + i*0.2, 2.2); });
  kuku.do('yawn', 19.0, 1.8); otto.do('yawn', 21.0, 1.8); pipi.do('yawn', 29.0, 1.8);
  kuku.do('sleepy', 21, 8); kuku.do('sleep', 29, 16, {tilt:10, arms:false});
  otto.do('sleepy', 23, 8); otto.do('sleep', 31, 14, {tilt:-10, arms:false});
  pipi.do('sleepy', 31, 3); pipi.do('sleep', 34, 11, {tilt:8, arms:false});
  momo.do('look', 33, 3, {x:7, y:0}); momo.do('happy', 34.4, 2.4); momo.do('stretch', 37.0, 1.6);
  momo.do('reach', 38.6, 1.4, {side:'L', to:[760, 560]}); momo.do('sleep', 40.4, 4.6, {tilt:-10, arms:false});
  S.z = [zText(S.L.fx), zText(S.L.fx), zText(S.L.fx), zText(S.L.fx)];
  S.hearts = heartBursts(S.L.fx, [{t:12.4, x:1160, y:680, n:3}, {t:36.0, x:560, y:640, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:8.8, x:560, y:640, n:5, r:70}]);
  [7.6, 16.4, 25.2, 33.0].forEach(t => S.sfx(t, 'page', 0.05, -0.4)); S.sfx(39.4, 'click', 0.06, -0.2); S.sfx(39.6, 'chime', 0.02, 0, {f:784});
  S.pre = u => S.L.update(u, {lampOff: sm((u - 39.4)/0.4), dim: 0.25*sm((u - 39.4)/1.2)});
  S.post = u => {
    [[kuku, 29.6], [otto, 31.6], [pipi, 34.6], [momo, 41]].forEach((q, i) => { const h = headW(q[0].c, 40, -60); S.z[i](h[0], h[1], u + i, sm((u - q[1])/1.5)); });
    S.hearts(u); S.spark(u);
  };
})();

EPISODE({day:8, title:'Library Day', music:{seed:18, key:3, bpm:68, prog:3},
  chapters:[['Book Hunt', IC.book], ['Reading Nook', IC.book], ['Study & Draw', IC.pencil], ['Bedtime Story', ICONS.moon]],
  scenes:[SC1, SC2, SC3, SC4]});
