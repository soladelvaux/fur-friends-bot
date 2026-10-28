/* =====================================================================
   FUR FRIENDS — Day 5: "Kite Day"   (180 s)
   park meadow → kite flying → duck pond → ice cream sunset
   ===================================================================== */
function makeKite(parent, s){
  const g = G(parent); const k = G(g, `scale(${s || 1})`); g.k = k;
  g.tail = mk('path', {fill:'none', stroke:OL, 'stroke-width':3}, k);
  g.bows = [0,1,2,3].map(i => mk('path', S4({d:'M-10 -7 L10 7 L10 -7 L-10 7 Z', fill:['#FFE07A','#9FD3F5','#FFB3C7','#A8E6A3'][i]}, 2.6), k));
  mk('path', SK({d:'M0 -70 L50 -6 L0 70 L-50 -6 Z', fill:'#FF9AA2'}, 5), k);
  mk('path', {d:'M0 -70 L50 -6 L0 -6 Z M0 70 L-50 -6 L0 -6 Z', fill:'#FFD27A'}, k);
  mk('path', {d:'M0 -70 V70 M-50 -6 H50', stroke:OL, 'stroke-width':3.5}, k);
  mk('path', SK({d:'M0 -70 L50 -6 L0 70 L-50 -6 Z', fill:'none'}, 5), k);
  mk('circle', {cx:-14, cy:-24, r:4, fill:OL}, k); mk('circle', {cx:14, cy:-24, r:4, fill:OL}, k);
  mk('path', {d:'M-8 -12 Q0 -4 8 -12', fill:'none', stroke:OL, 'stroke-width':3}, k);
  g.wiggle = function(u, amt){
    let d = 'M0 70'; const pts = [];
    for (let i=1;i<=8;i++){ const x = 18*Math.sin(TAU*(u*1.6 - i*0.14))*amt*(i/8), y = 70 + i*20; d += ` L${x.toFixed(1)} ${y}`; if (i % 2 === 0) pts.push([x, y]); }
    g.tail.setAttribute('d', d);
    g.bows.forEach((b, i) => T(b, `translate(${pts[i][0].toFixed(1)} ${pts[i][1]}) rotate(${(20*Math.sin(TAU*u*2 + i)).toFixed(1)})`));
  };
  g.wiggle(0, 0.3);
  return g;
}
const strokeStr = (layer) => { const o = mk('path', {fill:'none', stroke:'#FFFFFF', 'stroke-width':3.5, opacity:0.9}, layer); return o; };

/* =================== SC1 — MORNING AT THE PARK =================== */
const SC1 = scene(0, 45, {cam:[960, 800, 1.1, 1.06]});
(function(){
  const S = SC1;
  S.L = locPark(S.cam, {view:'meadow'});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 1); S.amb('breeze', 0, 45, 1); S.amb('leaves', 30, 40, 1.2);
  const momo = actor(S, 'cat', {layer:ly, x:[[0,-220],[7.4,620],[39.5,620],[45,1400]], y:960, steps:'grassstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,-440],[7.8,860],[16,860],[17.2,980],[27,980],[28,860],[39.8,860],[45,1600]], y:960, steps:'grassstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,-640],[8.2,1560],[39.2,1560],[45,2100]], y:960, steps:'grassstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,-60],[7.0,1300],[39,1300],[45,2300]], y:960, steps:'grassstep'});
  S.kites = {held: kuku.item('R', 'kite', makeKite(G(null, 'translate(10 -40) rotate(-10)'), 0.55))};
  momo.item('L', 'basket', itBasket(G(null, 'translate(0 30)')));
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  momo.item('R', 'ribbon', (() => { const g = G(); mk('path', S4({d:'M-10 -7 L10 7 L10 -7 L-10 7 Z', fill:'#FFE07A'}, 2.6), g); return g; })());
  // walk in
  momo.do('hold', 0, 13, {side:'L', item:'basket', at:[40, -66]});
  kuku.do('hold', 0, 14.6, {item:'kite', at:[40, -80]});
  [momo, pipi, otto, kuku].forEach((a, i) => { a.do('look', 8.4, 3, {x:-4 + i*2, y:-6}); a.do('happy', 8.6, 2.4, {mouth:'open'}); });
  momo.do('cheer', 9.4, 1.6); pipi.do('cheer', 9.6, 1.6); otto.do('cheer', 9.5, 1.6);
  // Kuku shows the kite
  kuku.do('arms', 11.0, 3.6, {R:[60, -170], itemR:'kite', eyes:'happy', mouth:'open'}).do('hop', 11.4).do('hop', 12.2);
  [momo, pipi, otto].forEach(a => a.do('look', 11, 4, {x:6, y:-4}));
  pipi.do('wow', 11.6, 1.6); otto.do('wow', 11.8, 1.6);
  // assembly on the grass
  kuku.do('talk', 15.0, 3.0, {gest:true});
  pipi.do('work', 17.4, 9.2, {kind:'pat', rate:1.4, dy:30, look:[4, 8], snd:'crinkle', every:2, gain:0.03, sndO:{d:0.4}});
  momo.do('work', 18.0, 7.6, {kind:'brush', rate:0.9, itemR:'ribbon', look:[5, 6], snd:'rustle', every:2, gain:0.025});
  kuku.do('work', 19.0, 7.0, {kind:'pat', rate:1.1, dy:30, look:[-4, 8]});
  otto.do('photo', 21.2, 2.6);
  otto.do('laugh', 24.0, 2.0);
  // kite ready!
  kuku.do('arms', 27.2, 4.0, {R:[50, -190], itemR:'kite', eyes:'happy', mouth:'open'}).do('hop', 27.6, 0, {h:36});
  momo.do('clap', 27.6, 2.6); pipi.do('cheer', 27.8, 2.0); otto.do('clap', 27.6, 2.6);
  // wind gust
  [momo, pipi, otto, kuku].forEach((a, i) => { a.do('wow', 31.2 + i*0.15, 1.4); a.do('look', 31.2, 6, {x:-6, y:-3}); });
  pipi.do('arms', 32.0, 4.2, {L:[20, -190], R:[20, -190], eyes:'squeeze', mouth:'open'});
  kuku.do('arms', 31.4, 6.0, {R:[60, -150], itemR:'kite', eyes:'happy', mouth:'open'});
  momo.do('laugh', 35.2, 2.4); otto.do('laugh', 35.0, 2.4);
  kuku.do('point', 37.4, 2.0, {side:'L', at:[110, -140]}).do('talk', 37.6, 1.6);
  [momo, pipi, otto].forEach(a => a.do('nod', 38.2, 1.4));
  kuku.do('hold', 39.4, 5.6, {item:'kite', at:[40, -90]});
  otto.do('hold', 39.0, 6, {item:'camera', at:[40, -70]});
  momo.do('hold', 39.4, 5.6, {side:'L', item:'basket', at:[40, -66]});
  // gust ears flutter
  [momo, pipi, otto, kuku].forEach(a => a.fn = (u, st) => { const g = rh(u, 31, 31.8, 36.4, 38); st.ear += 14*g*Math.sin(TAU*u*3.1); st.tilt += 3*g*Math.sin(TAU*u*1.3); });
  S.kiteGround = makeKite(G(S.L.chars), 0.75); S.L.chars.insertBefore(S.kiteGround.parentNode || S.kiteGround, S.L.chars.firstChild);
  S.leaves = leavesFx(S.L.fx, 16, [-200, 200, 2200, 1000]);
  S.hearts = heartBursts(S.L.fx, [{t:10.0, x:900, y:700, n:3}, {t:28.6, x:1300, y:600, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:12.0, x:1360, y:620, n:5, r:70}, {t:27.6, x:1350, y:560, n:6, r:90}]);
  S.photo = photoFX(S, S.L.fx);
  S.sfx(21.2 + 1.0, 'chime', 0.02, 0.5, {f:1318.5}); S.sfx(27.4, 'sparkle', 0.05, 0.3);
  [31.2, 33.4, 35.6].forEach(t => S.sfx(t, 'whoosh', 0.05, -0.3, {d:1.6, f0:200, f1:1400}));
  S.sfx(31.4, 'kite', 0.04, 0.3, {d:2.5});
  S.pre = u => S.L.update(u);
  S.post = u => {
    const onGround = u > 15.0 && u < 27.0;
    show(S.kiteGround, onGround);
    if (onGround){ T(S.kiteGround, `translate(1180 1000) rotate(-70) scale(1 0.55)`); S.kiteGround.wiggle(u, 0.1); }
    S.kites.held.wiggle(u, 0.5 + 0.8*rh(u, 31, 32, 36, 38));
    S.leaves(u, rh(u, 30.6, 31.6, 37, 39));
    S.photo(u, [22.2], otto);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — UP, UP, KITE! =================== */
const SC2 = scene(45, 90, {cam:[960, 640, 1.0, 1.04]});
const HOLDER2 = [[0, 'kuku'], [16.0, 'momo'], [27.8, 'pipi']];
(function(){
  const S = SC2;
  S.L = locPark(S.cam, {view:'meadow'});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.8); S.amb('breeze', 0, 45, 1.4); S.amb('wind', 0, 45, 0.5);
  const kx = [[0,760],[1.8,760],[5.2,1360],[44,1360]];
  const kuku = actor(S, 'squirrel', {layer:ly, x:kx, y:980, steps:'grassstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,560],[27.0,560],[28.0,1180],[34.6,1180],[35.6,1260],[36.6,1330],[44,1330]], y:980, steps:'grassstep'});
  const momo = actor(S, 'cat', {layer:ly, x:[[0,380],[14.6,380],[16.0,1180],[27.6,1180],[29.4,860],[44,860]], y:980, steps:'grassstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1600],[44,1600]], y:980, steps:'grassstep'});
  const all = [momo, pipi, otto, kuku];
  S.A = {kuku, pipi, momo, otto};
  ['kuku','momo','pipi'].forEach(n => S.A[n].item('R', 'spool', itKiteHand(G())));
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  S.kite = makeKite(S.L.fx, 1.0);
  S.str = strokeStr(S.L.fx);
  S.L.fx.insertBefore(S.str, S.kite);
  // launch
  pipi.do('arms', 0, 5.4, {L:[30, -186], R:[30, -186], eyes:'open', mouth:'open'});
  pipi.do('cheer', 5.2, 2.2);
  kuku.do('hold', 0, 16.2, {item:'spool', at:[60, -120]});
  kuku.do('look', 1.6, 3.6, {x:-6, y:-2}).do('look', 5.6, 10, {x:-2, y:-7});
  kuku.do('happy', 7.0, 4, {mouth:'open'});
  all.forEach((a, i) => { if (a !== kuku) a.do('look', 5.8, 9, {x:2, y:-7}); a.do('cheer', 11.2 + i*0.2, 2.0, {h:30}); });
  otto.do('photo', 8.6, 2.8);
  // pass the spool to Momo
  kuku.do('reach', 15.4, 1.0, {to:u => paw(momo.c, 1), item:'spool'});
  momo.do('hold', 16.0, 12.0, {item:'spool', at:[64, -122]});
  momo.do('look', 16, 11.6, {x:0, y:-7});
  momo.do('wow', 18.4, 1.6); momo.do('work', 19.0, 3.2, {kind:'pull', rate:1.2, itemR:'spool', eyes:'squeeze', mouth:'open'});
  momo.do('happy', 22.6, 4, {mouth:'open'});
  kuku.do('clap', 22.6, 2.6); pipi.do('clap', 22.8, 2.6);
  kuku.do('look', 16.8, 12, {x:-4, y:-6});
  // Pipi's turn
  momo.do('reach', 27.4, 0.9, {to:u => paw(pipi.c, 1), item:'spool'});
  pipi.do('hold', 27.8, 16.2, {item:'spool', at:[64, -122]});
  pipi.do('bob', 29, 5, {f:0.6});
  otto.do('photo', 30.0, 2.6);
  // gust: loop-the-loop + Pipi gets pulled
  pipi.do('wow', 34.4, 1.6); pipi.do('pose', 34.6, 2.6, {tilt:12, bt:10, eyes:'squeeze', mouth:'open'});
  momo.do('reach', 35.2, 2.0, {to:u => [pipi.X(u) - 60, 900]}); momo.do('wow', 34.6, 1.4);
  kuku.do('wow', 34.8, 1.4); otto.do('wow', 34.7, 1.4);
  all.forEach((a, i) => a.do('laugh', 37.6 + i*0.1, 2.6));
  [momo, otto, kuku].forEach((a, i) => a.do('wave', 40.4 + i*0.2, 4.0));
  pipi.do('happy', 40.2, 4.6, {mouth:'open'});
  S.hearts = heartBursts(S.L.fx, [{t:11.6, x:960, y:760, n:5}, {t:40.6, x:1100, y:740, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:10.4, x:1040, y:240, n:6, r:110}, {t:37.4, x:1100, y:220, n:6, r:110}]);
  S.photo = photoFX(S, S.L.fx);
  S.notes = notesFx(S.L.fx, 3);
  S.sfx(5.4, 'whoosh', 0.05, -0.2, {d:0.8, f0:300, f1:2000}); S.sfx(5.6, 'kite', 0.05, 0, {d:3});
  for (let t = 9; t < 44; t += 3.1) S.sfx(t, 'kite', 0.03, 0.1, {d:2.2});
  S.sfx(18.4, 'whoosh', 0.05, 0.2, {d:1.2, f0:300, f1:1200}); S.sfx(34.4, 'whoosh', 0.07, 0.2, {d:2.0, f0:200, f1:1600}); S.sfx(36.4, 'sparkle', 0.05, 0.2);
  S.sfx(11.0, 'chime', 0.03, 0, {f:1046.5});
  S.pre = u => S.L.update(u);
  S.kiteP = function(u){
    let x = K(u, [[0,560],[5.2,560],[9,1060],[14,1000],[44,1000]]), y = K(u, [[0,800],[5.2,780],[9,420],[14,250],[44,250]]);
    y += 120*rh(u, 18.0, 18.8, 19.8, 21.6);
    x += 60*Math.sin(TAU*u/7.3) + 20*Math.sin(TAU*u/2.1); y += 26*Math.sin(TAU*u/5.1) + 10*Math.sin(TAU*u/1.7);
    const lp = (u - 34.6)/2.2; let rot = 6*Math.sin(TAU*u/3.3);
    if (lp > 0 && lp < 1){ const a = TAU*sm(lp); x += 110*Math.sin(a); y += 110*(1 - Math.cos(a)) - 0; rot += 360*sm(lp); }
    return [x, y, rot];
  };
  S.post = u => {
    const kp = S.kiteP(u);
    T(S.kite, `translate(${kp[0].toFixed(1)} ${kp[1].toFixed(1)}) rotate(${kp[2].toFixed(1)}) scale(${(0.6 + 0.4*sm((u - 5.2)/6)).toFixed(3)})`);
    S.kite.wiggle(u, 0.6 + 0.6*rh(u, 34, 35, 37, 38));
    let who = 'kuku'; HOLDER2.forEach(h => { if (u >= h[0]) who = h[1]; });
    const hp = u < 5.2 ? paw(S.A.pipi.c, 1) : paw(S.A[who].c, 1);
    const kb = [kp[0] - 0, kp[1] + 6];
    if (u < 5.2){ show(S.str, false); }
    else { show(S.str, true); const mx = (hp[0] + kb[0])/2, my = Math.max(hp[1], kb[1]) - 0.25*Math.abs(hp[1] - kb[1]) + 80;
      S.str.setAttribute('d', `M${hp[0].toFixed(1)} ${hp[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${kb[0].toFixed(1)} ${kb[1].toFixed(1)}`); }
    S.photo(u, [9.6, 31.0], S.A.otto);
    const h = headW(S.A.pipi.c, 0, -60); S.notes(h[0], h[1], u, rh(u, 29, 30, 33.4, 34.2));
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC3 — DUCK POND =================== */
const SC3 = scene(90, 135, {cam:[960, 820, 1.08, 1.12]});
(function(){
  const S = SC3;
  S.L = locPark(S.cam, {view:'pond', bench:1500, benchW:300});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.9); S.amb('lake', 0, 45, 1.2); S.amb('breeze', 0, 45, 0.6);
  const momo = actor(S, 'cat', {layer:ly, x:[[0,1500],[29.6,1500],[31.6,1300],[45,1300]], steps:'grassstep'});
  momo.ypath = [[0,940],[29.6,940],[31.6,1010]];
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,560],[45,560]], y:1010, steps:'grassstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,760],[45,760]], y:1010, steps:'grassstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1020],[12.6,1020],[13.6,960],[18,960],[24,1120],[45,1120]], y:1010, steps:'grassstep'});
  momo.item('R', 'book', itBook(G(null, 'translate(-14 -8)'), '#B79BE8'));
  kuku.item('R', 'bread', itBread(G(), 0.8)); pipi.item('R', 'bread', itBread(G(), 0.8));
  otto.item('R', 'boat', (() => { const g = G(); mk('path', S4({d:'M-30 0 L30 0 L20 14 L-20 14 Z', fill:'#FFFFFF'}), g); mk('path', S4({d:'M0 0 L0 -34 L22 -4 Z', fill:'#FFE07A'}), g); return g; })());
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  // Momo reads on the bench
  momo.do('hold', 0, 29.4, {item:'book', at:[16, -100]}).do('look', 0, 29.4, {x:0, y:6});
  [7, 14, 21].forEach(t => momo.do('happy', t, 1.2));
  momo.do('wave', 30.4, 1.4); momo.do('cheer', 39.0, 2.0);
  // feeding the ducks
  [kuku, pipi].forEach((a, i) => { a.do('hold', 1.0, 25, {item:'bread', at:[44, -96]});
    a.do('work', 3.0 + i*1.2, 8 + i, {kind:'shake', rate:0.75, itemR:'bread', look:[0, -4]}); a.do('look', 2, 24, {x:-1 + i, y:-6}); });
  kuku.do('laugh', 14.0, 2.0); pipi.do('happy', 15.0, 3, {mouth:'open'});
  kuku.do('eat', 18.0, 6.4, {item:'bread', bites:2, per:3.2}); pipi.do('wow', 19.0, 1.4); pipi.do('laugh', 20.0, 2.0);
  // Otto's paper boat
  otto.do('hold', 0, 13.6, {item:'boat', at:[40, -84]});
  otto.do('reach', 13.6, 1.4, {to:[900, 800], item:'boat', lean:14});
  otto.do('wave', 16.0, 2.2, {side:'L'}); otto.do('look', 15, 12, {x:2, y:-6});
  otto.do('photo', 25.0, 2.8, {item:'camera'});
  // everyone waves to the boat
  [kuku, pipi, otto].forEach((a, i) => a.do('wave', 34.0 + i*0.3, 4.0, {side: i === 1 ? 'L' : 'R'}));
  [kuku, pipi, otto, momo].forEach((a, i) => { a.do('look', 32.0, 12, {x:5, y:-6}); a.do('happy', 40.4 + i*0.1, 3.6, {mouth:'open'}); });
  S.boat = G(S.L.pondLayer); S.L.pondLayer.appendChild(S.boat);
  mk('path', S4({d:'M-30 0 L30 0 L20 14 L-20 14 Z', fill:'#FFFFFF'}), S.boat); mk('path', S4({d:'M0 0 L0 -34 L22 -4 Z', fill:'#FFE07A'}), S.boat);
  S.crumbs = []; for (let i=0;i<10;i++) S.crumbs.push({el: mk('circle', S4({r:5, fill:'#F2D29A'}, 2), S.L.fx), k:i});
  S.ripA = ripples(S.L.pondLayer, 3); S.ripB = ripples(S.L.pondLayer, 3); S.ripC = ripples(S.L.pondLayer, 3);
  S.photo = photoFX(S, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:12.0, x:660, y:700, n:3}, {t:41.0, x:960, y:720, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:15.2, x:900, y:780, n:5, r:60}, {t:39.2, x:1460, y:760, n:5, r:60}]);
  // crumbs: Kuku throws at 3.0+, Pipi at 4.2+
  S.throws = []; for (let k=0;k<6;k++){ S.throws.push([kuku, 3.0 + 0.4 + k*1.333, 620 + 40*k, 790 + (k%2)*14]); S.throws.push([pipi, 4.2 + 0.4 + k*1.333, 760 + 50*k, 780 + (k%2)*16]); }
  S.throws = S.throws.filter(a => a[1] < (a[0] === kuku ? 11 : 13.2));
  S.throws.forEach((a, i) => { S.sfx(a[1] + 0.9, 'plop', 0.03, panOf(a[2])); });
  [5, 9, 13, 22, 28, 36, 41].forEach((t, i) => S.sfx(t, 'quack', 0.03, -0.4 + 0.15*i));
  S.sfx(14.8, 'splash', 0.04, 0, {d:0.5}); [7, 14, 21].forEach(t => S.sfx(t, 'page', 0.05, 0.6));
  S.sfx(26.0, 'shutter', 0.1, 0.2);
  S.pre = u => S.L.update(u);
  S.post = u => {
    S.crumbs.forEach((c, i) => { const th = S.throws[i]; if (!th){ show(c.el, false); return; } const v = (u - th[1])/0.9;
      if (v > 0 && v < 1){ show(c.el, true); const a = th[0].c.last ? paw(th[0].c, 1) : [0, 0]; const p = arcP(a, [th[2], th[3]], v, 110); c.el.setAttribute('cx', p[0].toFixed(1)); c.el.setAttribute('cy', p[1].toFixed(1)); } else show(c.el, false); });
    let last = null; S.throws.forEach(th => { if (u > th[1] + 0.9 && u < th[1] + 2.1) last = th; });
    if (last) S.ripA(u, last[1] + 0.9, last[2], last[3]); else S.ripA(u, -9, 0, 0);
    // boat drift
    const bv = u < 15 ? -1 : (u - 15)/26;
    show(S.boat, bv >= 0);
    const bx = lerp(900, 1500, sm(clamp(bv, 0, 1))), by = 790 - 30*Math.sin(Math.PI*clamp(bv, 0, 1));
    if (bv >= 0) T(S.boat, `translate(${bx.toFixed(1)} ${(by + 3*Math.sin(TAU*u*0.9)).toFixed(1)}) rotate(${(4*Math.sin(TAU*u*0.7)).toFixed(2)})`);
    S.ripB(u, 15.0, 900, 800, 0.8); S.ripC(u, 15 + 3*Math.floor((u - 15)/3), bx, by + 10, 0.5);
    S.photo(u, [26.0], otto);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC4 — ICE CREAM SUNSET =================== */
const SC4 = scene(135, 180, {cam:[960, 820, 1.12, 1.22]});
(function(){
  const S = SC4;
  S.L = locPark(S.cam, {view:'pond', tod:'sunset', bench:960, benchW:720});
  const ly = S.L.chars;
  S.amb('lake', 0, 45, 0.9); S.amb('night', 12, 45, 0.8); S.amb('breeze', 0, 45, 0.6);
  const xs = [700, 870, 1050, 1220];
  const momo = actor(S, 'cat', {layer:ly, x:xs[0], y:940, s:0.95});
  const kuku = actor(S, 'squirrel', {layer:ly, x:xs[1], y:940, s:0.95});
  const pipi = actor(S, 'bunny', {layer:ly, x:xs[2], y:940, s:0.95});
  const otto = actor(S, 'otter', {layer:ly, x:xs[3], y:940, s:0.95});
  const all = [momo, kuku, pipi, otto];
  const cols = ['#C9B6F2', '#FFE07A', '#FFB3C7', '#A8E6A3'];
  S.cones = all.map((a, i) => a.item('R', 'cone', itCone(G(null, 'translate(0 -4)'), cols[i])));
  otto.item('L', 'camera', itCamera(G(null, 'translate(20 -6)')));
  // licking
  [momo, pipi, otto].forEach((a, i) => a.do('eat', 1.0 + i*0.6, 12.6, {item:'cone', bites:3, per:3.4, snd:'sip', rest:[34, -86]}));
  kuku.do('eat', 1.4, 11.8, {item:'cone', bites:2, per:3.4, snd:'sip', rest:[34, -86]});
  kuku.do('hold', 13.2, 1.4, {item:'cone', at:[34, -86]});
  kuku.do('wow', 14.0, 1.6); kuku.do('face', 15.2, 3.4, {eyes:'open', mouth:'wavy'}); kuku.do('pose', 15.2, 3.4, {tear:0.8, hy:4});
  all.forEach(a => { if (a !== kuku) a.do('look', 14.0, 3.2, {x: a === momo ? 6 : -6, y:2}); });
  momo.do('reach', 17.6, 4.2, {to:u => headW(kuku.c, -26, 10), item:'cone'});
  kuku.do('pose', 18.8, 2.2, {bt:-6, tilt:-8}); kuku.do('face', 19.0, 2.0, {eyes:'happy', mouth:'chew'});
  kuku.do('happy', 21.2, 3, {mouth:'open'}).do('hop', 21.4, 0, {h:16});
  momo.do('happy', 21.6, 2.6);
  [pipi, otto].forEach(a => a.do('happy', 21.4, 3, {mouth:'open'}));
  // sunset watching
  all.forEach((a, i) => a.do('look', 24.0, 6, {x:4 - i*2, y:-5}));
  otto.do('arms', 29.6, 6.8, {L:[24, -132], itemL:'camera', R:[30, -110]});
  [momo, kuku, pipi].forEach(a => a.do('look', 30.0, 6, {x: a === pipi ? 6 : 8, y:2}));
  pipi.do('laugh', 32.0, 2.2); momo.do('laugh', 32.4, 2.0); kuku.do('laugh', 32.2, 2.2); otto.do('laugh', 33.4, 2.0);
  // sleepy
  pipi.do('yawn', 36.4, 1.8); momo.do('yawn', 37.2, 1.8);
  [[momo, 6, 10], [kuku, 8, -4], [pipi, -6, -10], [otto, -8, -12]].forEach((a, i) => { a[0].do('pose', 38.6 + i*0.2, 6.4, {x: xs[[0,1,2,3][i]] + a[1], tilt:a[2], bt:a[2]*0.5}); a[0].do('sleepy', 38.6 + i*0.3, 6.4); });
  momo.do('sleep', 40.6, 4.4, {tilt:12, arms:false}); pipi.do('sleep', 41.2, 3.8, {tilt:-10, arms:false});
  S.scoop = G(S.L.fx); mk('circle', S4({r:15, fill:cols[1]}), S.scoop);
  S.splat = G(S.L.front); mk('ellipse', S4({cx:0, cy:0, rx:22, ry:8, fill:cols[1]}), S.splat);
  S.kiteG = makeKite(G(S.L.chars), 0.6); S.L.chars.insertBefore(S.kiteG, S.L.chars.firstChild);
  S.ff = fireflies(S.L.fx, 22, [100, 600, 1820, 1000]);
  S.z = zText(S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:21.2, x:800, y:700, n:5}, {t:34.0, x:960, y:690, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:26.0, x:1380, y:560, n:6, r:110}]);
  S.sfx(14.1, 'plop', 0.06, -0.1); S.sfx(14.3, 'squish', 0.05, -0.1); S.sfx(21.2, 'chime', 0.03, 0, {f:1046.5});
  S.sfx(26.0, 'chime', 0.025, 0.3, {f:1318.5}); [30.4, 31.2, 32.0].forEach(t => S.sfx(t, 'click', 0.04, 0.4));
  S.pre = u => S.L.update(u, {sunY: K(u, [[0,430],[34,690]]), dusk: sm((u - 16)/20)});
  S.post = u => {
    // dropped scoop
    const v = (u - 13.4)/0.7; show(S.scoop, v > 0 && v < 1);
    if (v > 0 && v < 1){ const a = S.dropFrom || paw(kuku.c, 1); S.dropFrom = S.dropFrom || [a[0], a[1] - 16]; const p = arcP(S.dropFrom, [S.dropFrom[0] + 30, 1010], v, 20); T(S.scoop, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`); }
    if (u < 13.3) S.dropFrom = null;
    show(S.splat, u > 14.1); T(S.splat, `translate(${(xs[1] + 40).toFixed(1)} 1012) scale(${(sm((u - 14.1)/0.3)).toFixed(3)})`);
    const kc = S.cones[1]; if (kc.body) show(kc.body, u < 13.4);
    T(S.kiteG, 'translate(1460 1020) rotate(-62) scale(1 0.6)'); S.kiteG.wiggle(u, 0.15);
    S.ff(u, sm((u - 22)/10));
    const h = headW(momo.c, 40, -60); S.z(h[0], h[1], u, sm((u - 41)/1.5));
    S.hearts(u); S.spark(u);
  };
})();

const ICON5 = {
  park: g => { mk('circle', S4({cx:0, cy:-6, r:16, fill:'#7CC77A'}), g); mk('path', {d:'M0 6 V20', stroke:OL, 'stroke-width':5, 'stroke-linecap':'round'}, g); },
  kite: IC.kite, duck: IC.duck, cone: IC.cone
};
EPISODE({day:5, title:'Kite Day', music:{seed:15, key:4, bpm:78, prog:0},
  chapters:[['Morning at the Park', ICON5.park], ['Up, Up, Kite!', ICON5.kite], ['Duck Pond', ICON5.duck], ['Ice Cream Sunset', ICON5.cone]],
  scenes:[SC1, SC2, SC3, SC4]});
