/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 16: "The Sunlit Castle"  (180 s)
   bats steal the sun crystal → Lumi the Paladin joins → battle in the
   belfry → the sunlight festival
   ===================================================================== */
function sunCrystal(parent, s){ const g = G(parent, `scale(${s || 1})`); g.glow = mk('circle', {r:120, fill:'url(#glowW)'}, g);
  mk('path', SK({d:'M0 -60 L30 -10 L18 40 L-18 40 L-30 -10 Z', fill:'#FFE07A'}, 4.6), g); mk('path', {d:'M0 -50 L-10 -6 L-6 30', fill:'none', stroke:'#FFFFFF', 'stroke-width':5, 'stroke-linecap':'round', opacity:0.8}, g);
  for (let i=0;i<8;i++){ const a = i*TAU/8; mk('path', {d:`M${50*Math.cos(a)} ${50*Math.sin(a) - 6} L${70*Math.cos(a)} ${70*Math.sin(a) - 6}`, stroke:'#FFE07A', 'stroke-width':6, 'stroke-linecap':'round'}, g); } return g; }

/* =================== SC1 — THE CASTLE GATES =================== */
const SC1 = scene(0, 45, {look: u => [960, K(u, [[0, 700], [10, 640], [16, 480], [26, 480], [30, 700], [45, 720]]), K(u, [[0, 0.95], [10, 0.92], [16, 1.0], [26, 1.0], [30, 1.08], [45, 1.12]])]});
(function(){
  const S = SC1;
  S.L = locRealm(S.cam, {biome:'meadow', castleX:2600});
  const ly = S.L.chars;
  S.amb('birds', 0, 14, 0.5); S.amb('breeze', 0, 45, 0.6); S.amb('wind', 18, 45, 0.4);
  S.castle = fantasyCastle(S.L.mid, 960, 800, 1.0, '#F2EDF8', '#E0B43E', '#FFE07A');
  S.cr = sunCrystal(S.L.mid, 0.8); S.crTop = [960, 168];
  const ids = ['otto', 'owli', 'leaf', 'momo', 'kuku', 'pipi'], X = [300, 450, 600, 1320, 1470, 1620];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:[[0, X[i] + (i < 3 ? -900 : 900)], [6 + i*0.15, X[i]], [45, X[i]]], y:985, steps:'grassstep'}));
  const all = Object.values(A);
  all.forEach((a, i) => { a.do('look', 8, 6, {x: X[i] < 960 ? 4 : -4, y:-10}); a.do('wow', 8.4 + i*0.12, 1.4); });
  // bats swoop in and carry the crystal away — the castle goes grey
  all.forEach((a, i) => { a.do('wow', 17.2 + i*0.1, 1.4); a.do('look', 17, 10, {x:0, y:-12}); });
  A.kuku.do('point', 19.0, 2.0, {at:[60, -200]}); A.pipi.do('arms', 19.0, 2.0, {L:[70, -100], eyes:'squeeze', mouth:'open'});
  all.forEach((a, i) => a.do('pose', 27.0, 4.0, {mouth:'wavy', eyes:'open', sweat:0.6}));
  // the gate creaks open... a shining knight steps out
  all.forEach((a, i) => { a.do('look', 32, 12, {x: X[i] < 960 ? 6 : -6, y:-2}); a.do('wow', 34.4 + i*0.1, 1.4); });
  const lumi = hero(S, 'lumi', {layer:ly, x:[[0, 960], [45, 960]], ypath:[[0, 800], [34, 800], [36, 985]], y:985, steps:null, s:0.9});
  lumi.do('wave', 37.6, 2.6); lumi.do('pose', 40.2, 4, {mouth:'small', eyes:'open'});
  S.bats = [0,1,2].map(i => monster(S.L.fx, 'bat', {ph:i*0.3}));
  S.H = hud(S);
  all.forEach(a => S.H.plate(a, {lv:4, show: u => u > 7 && u < 16}));
  S.H.quest('The Sunlit Castle', [{text:'Visit the castle', done:9}, {text:'Recover the sun crystal'}], 3, 44.6);
  S.grey = mk('rect', {x:-400, y:-400, width:2800, height:1900, fill:'#4E4A70', opacity:0, 'pointer-events':'none'}, S.L.fx);
  S.sfx(9.0, 'chime', 0.03, 0, {f:1318.5}); S.sfx(16.6, 'flap', 0.05, 0.3, {d:1.2}); S.sfx(18.0, 'flap', 0.05, -0.2, {d:1.2}); S.sfx(19.6, 'whoosh', 0.05, 0, {d:0.8, f0:900, f1:300});
  S.sfx(21.0, 'zap', 0.03, 0); S.sfx(32.2, 'knock', 0.05, 0, {f:180}); S.sfx(33.0, 'rattle', 0.04, 0, {d:1.4}); S.sfx(36.0, 'thump', 0.05, 0, {f:90});
  S.pre = u => S.L.update(u, {dusk: 0.9*sm((u - 21)/3)});
  S.post = u => {
    const grab = sm((u - 19.4)/0.6), fly = sm((u - 20)/3.0);
    const cp = [lerp(S.crTop[0], 2300, fly), lerp(S.crTop[1], -200, fly) - 60*grab];
    T(S.cr, `translate(${cp[0].toFixed(1)} ${cp[1].toFixed(1)}) rotate(${(4*Math.sin(TAU*u*0.5)).toFixed(1)}) scale(0.8)`); show(S.cr, fly < 1);
    S.cr.glow.setAttribute('opacity', (1 - 0.5*fly).toFixed(3));
    S.bats.forEach((b, i) => { const ent = sm((u - 15.6 - i*0.3)/2.0); const ang = TAU*(u*0.4 + i/3);
      let x = lerp(-300 + i*200, S.crTop[0] + 140*Math.cos(ang), ent), y = lerp(-100, S.crTop[1] + 40*Math.sin(ang), ent);
      if (u > 19.4){ x = cp[0] + (i - 1)*70; y = cp[1] - 60; }
      b.m = b; b.set(u, {x, y:y + 160, s:0.6, face:'mad', alpha: u > 15.6 && fly < 1 ? 1 : 0}); });
    S.grey.setAttribute('opacity', (0.18*sm((u - 21)/3)).toFixed(3));
    show(lumi.c.root, u > 33.6);
    T(S.castle, `translate(960 800) scale(1)`);
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC2 — LUMI THE PALADIN =================== */
const SC2 = scene(45, 90, {look: u => [K(u, [[0, 960], [8, 1180], [22, 1150], [28, 960], [45, 960]]), 720, K(u, [[0, 1.0], [8, 1.35], [22, 1.3], [28, 1.04], [45, 1.1]])]});
(function(){
  const S = SC2;
  S.L = locHall(S.cam, {kind:'temple'});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 0.7); S.amb('wind', 0, 45, 0.2);
  const ids = ['otto', 'owli', 'leaf', 'momo', 'kuku', 'pipi'], X = [240, 390, 540, 690, 840, 990];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:[[0, X[i] - 900], [5 + i*0.15, X[i]], [45, X[i]]], y:980 + (i % 2)*5, steps:'woodstep'}));
  const all = Object.values(A);
  const lumi = hero(S, 'lumi', {layer:ly, x:[[0, 1260], [45, 1260]], y:985});
  lumi.item('R', 'cloth', (() => { const g = G(); mk('path', S4({d:'M-16 -12 Q0 -20 16 -12 L14 14 Q0 20 -14 14 Z', fill:'#FFFFFF'}), g); return g; })());
  // Lumi polishes the sun shield, a little sad
  lumi.do('work', 0, 7.6, {kind:'scrub', rate:1.2, itemR:'cloth', mouth:'small', eyes:'open', look:[-2, 6]});
  lumi.do('talk', 8.6, 6.0, {gest:true}); lumi.do('pose', 8.6, 12, {mouth:'small'});
  all.forEach((a, i) => { a.do('look', 6, 16, {x:8, y:-2}); a.do('nod', 11 + i*0.2, 1.6); });
  A.pipi.do('shy', 15.0, 2.0); A.kuku.do('arms', 16.4, 2.4, {R:[90, -170], L:[90, -170], eyes:'squeeze', mouth:'open'}); A.kuku.do('hop', 16.6, 0.5, {h:40});
  // "We'll get it back together!" — everyone cheers, Lumi smiles
  all.forEach((a, i) => a.do('cheer', 19.4 + i*0.1, 2.4));
  lumi.do('wow', 20.2, 1.4); lumi.do('happy', 21.6, 4, {mouth:'open'});
  // Lumi shows Divine Shield + Holy Light
  lumi.do('arms', 26.0, 3.0, {L:[80, -120], R:[90, -190], eyes:'squeeze', mouth:'open'});
  all.forEach((a, i) => { a.do('wow', 27.0 + i*0.1, 1.4); a.do('cheer', 32.4 + i*0.1, 2.4); a.do('happy', 36, 9, {mouth:'open'}); });
  lumi.do('cheer', 33.0, 2.4); lumi.do('arms', 37, 6, {R:[90, -180], eyes:'happy', mouth:'open'});
  S.H = hud(S);
  all.forEach(a => S.H.plate(a, {lv:4, show: u => u > 5.6}));
  S.H.plate(lumi, {lv:4, show: u => u > 31});
  S.H.card(30.8, 'lumi', {d:6.4, x:100, y:150});
  S.shield = shieldFx(S.L.fx, [{t:26.4, d:2.6, at:() => [lumi.X(26) - 40, 990], col:'#FFE07A', s:1.3}]);
  S.beam = G(S.L.fx); mk('rect', {x:-60, y:-900, width:120, height:900, fill:'url(#glowW)'}, S.beam); mk('rect', {x:-24, y:-900, width:48, height:900, fill:'#FFF6D0', opacity:0.7}, S.beam);
  S.spark = sparkles(S.L.fx, [{t:27.6, x:1260, y:760, n:10, r:200}]);
  S.hearts = heartBursts(S.L.fx, [{t:22, x:1260, y:640, n:4}, {t:34, x:900, y:640, n:5}]);
  for (let t = 0.4; t < 7.4; t += 0.83) S.sfx(t, 'scratch', 0.02, 0.5, {d:0.4});
  SFXB.shield(S, 26.4, 0.4); S.sfx(27.6, 'sparkle', 0.06, 0.4); S.sfx(27.8, 'heal', 0.04, 0.4); S.sfx(30.8, 'chime', 0.03, 0, {f:1568}); SFXB.levelup(S, 31.0);
  S.pre = u => S.L.update(u);
  S.post = u => {
    const ba = rh(u, 27.4, 27.8, 29.2, 30.0); show(S.beam, ba > 0.01); T(S.beam, `translate(1260 990) scale(${(0.6 + 0.4*ba).toFixed(3)} 1)`); S.beam.setAttribute('opacity', ba.toFixed(3));
    S.shield(u); S.spark(u); S.hearts(u);
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC3 — BATTLE IN THE BELFRY =================== */
const SC3 = scene(90, 135, {look: u => [K(u, [[0, 900], [8, 1000], [16, 900], [24, 1100], [32, 1000], [45, 960]]), K(u, [[0, 700], [10, 660], [45, 700]]), K(u, [[0, 1.0], [8, 1.05], [16, 0.98], [24, 1.08], [32, 1.02], [45, 1.08]])]});
(function(){
  const S = SC3;
  S.L = locRealm(S.cam, {biome:'mountain', tod:'sunset'});
  const ly = S.L.chars;
  S.amb('wind', 0, 45, 0.6);
  // castle rooftop: a stone walkway with crenellations
  S.roof = G(S.L.back); mk('path', SK({d:'M-400 880 L2320 880 L2320 1500 L-400 1500 Z', fill:'#D9D3E6'}, 6), S.roof);
  for (let x=-380; x<2320; x+=180) mk('rect', SK({x, y:820, width:110, height:70, fill:'#E9E3F2'}, 4.6), S.roof);
  for (let x=-400; x<2320; x+=160) mk('path', {d:`M${x} 900 L${x - 100} 1500`, stroke:'#C3B8D6', 'stroke-width':4}, S.roof);
  const ids = ['otto', 'owli', 'leaf', 'lumi', 'momo', 'kuku', 'pipi'], X = [200, 340, 480, 620, 760, 900, 1040];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:X[i], y:985 + (i % 2)*5, steps:'step', s:0.95}));
  const all = Object.values(A);
  const boss = monster(S.L.chars, 'bat', {col:'#5E4C88'}), bats = [0,1,2].map(i => monster(S.L.chars, 'bat', {ph:i*0.25}));
  S.cr = sunCrystal(S.L.fx, 0.5);
  all.forEach((a, i) => { a.do('look', 2, 10, {x:6, y:-10}); a.do('wow', 3.0 + i*0.1, 1.4); });
  // bats dive → Lumi's Divine Shield over everyone
  A.lumi.do('arms', 7.4, 2.8, {L:[80, -120], R:[90, -190], eyes:'squeeze', mouth:'open'}); all.filter(a => a !== A.lumi).forEach(a => a.do('shiver', 7.6, 1.6));
  // Leaf + Owli shoot the little bats out of the sky (they float away, dizzy)
  A.leaf.do('arms', 12.6, 3.0, {L:[110, -160], R:[40, -160], eyes:'squeeze', mouth:'open'});
  A.owli.do('arms', 14.0, 2.4, {R:[120, -190], eyes:'squeeze', mouth:'open'});
  // the big bat screeches; Pipi and Kuku hold the line, Otto heals
  all.forEach(a => a.do('pose', 19.0, 1.6, {eyes:'squeeze', mouth:'wavy', tremble:0.5}));
  A.otto.do('arms', 21.0, 2.4, {R:[80, -190], eyes:'happy', mouth:'open'});
  // finale: Momo leaps, Kuku punches, Lumi's Holy Light
  lunge(A.momo, 25.0, 1.4, 640, {hop:180}); strike(A.momo, 25.4, {R:[110, -190], L:[100, -150]});
  lunge(A.kuku, 26.6, 1.3, 520, {hop:120}); strike(A.kuku, 27.0, {R:[120, -190]});
  A.lumi.do('arms', 29.0, 3.0, {R:[90, -200], L:[60, -150], eyes:'squeeze', mouth:'open'}); A.lumi.do('hop', 29.0, 0.5, {h:24});
  all.forEach((a, i) => { a.do('cheer', 35.0 + i*0.1, 2.4); a.do('happy', 38, 7, {mouth:'open'}); });
  A.lumi.do('arms', 38.2, 5, {R:[60, -200], eyes:'happy', mouth:'open'});
  const BONK = 30.6;
  const bossP = u => [K(u, [[0, 2100], [3, 1500], [7, 1400], [8.6, 900], [9.6, 1450], [30, 1450]]) + 40*Math.sin(TAU*u*0.3), K(u, [[0, 300], [3, 560], [7, 560], [8.6, 760], [9.6, 560]]) + 20*Math.sin(TAU*u*0.6)];
  const batP = (i, u) => [1320 + i*170 + 60*Math.sin(TAU*(u*0.4 + i/3)), 480 + 50*Math.sin(TAU*(u*0.5 + i/3)) - 400*sm((u - [13.3, 14.0, 14.8][i] - 0.8)/2)];
  S.H = hud(S);
  all.forEach(a => { S.H.plate(a, {lv:4, show: u => u < 35}); S.H.plate(a, {lv:5, show: u => u >= 35}); });
  S.H.monPlate(boss, 'Belfry Bat Boss', 8); { const pl = S.H.plates[S.H.plates.length - 1]; pl.o.show = u => u > 3 && u < BONK + 2; pl.o.hp = u => 1 - 0.2*sm((u - 25.6)/0.3) - 0.2*sm((u - 27.2)/0.3) - 0.6*sm((u - BONK)/0.6); }
  S.H.quest('Battle in the Belfry', [{text:'Shoo the bats', count:[14.3, 15.0, 15.8]}, {text:'Recover the sun crystal', done:BONK + 2}], 2, 44.6);
  S.H.banner(35.0, 'LEVEL UP!', 'Lv 4 → Lv 5', '#F2B33E', 3.4);
  S.shield = shieldFx(S.L.fx, [{t:7.6, d:3.0, at:() => [620, 990], hit:8.6, col:'#FFE07A', s:4.2}]);
  const vol = [0,1,2].map(i => ({t:[12.9, 13.6, 14.4][i], d:0.4, shape:'arrow', from:() => paw(A.leaf.c, -1), to:() => batP(i, [13.3, 14.0, 14.8][i]).map((v, k) => v + [0, 60][k]), arc:20}));
  S.arrows = boltFx(S.L.fx, vol);
  S.stars = boltFx(S.L.fx, [{t:14.2, d:0.5, from:() => paw(A.owli.c, 1).map((v, j) => v - [0, 128][j]), to:() => batP(1, 14.7).map((v, k) => v + [0, 60][k]), col:'#FFE07A', arc:60}]);
  S.screech = [0,1,2].map(k => mk('path', {d:'M-60 -40 Q-80 0 -60 40', fill:'none', stroke:'#C9A7FF', 'stroke-width':8, 'stroke-linecap':'round', opacity:0}, S.L.fx));
  S.heal = healFx(S.L.fx, all.map(a => ({t:21.4, d:2.0, at:() => [a.X(21), 985]})));
  S.slash = slashFx(S.L.fx, [{t:25.6, at:() => bossP(25.6).map((v, k) => v + [0, 70][k]), rot:-30}]);
  S.beam = G(S.L.fx); mk('rect', {x:-80, y:-1400, width:160, height:1400, fill:'url(#glowW)'}, S.beam); mk('rect', {x:-30, y:-1400, width:60, height:1400, fill:'#FFF6D0', opacity:0.8}, S.beam);
  S.burst = burstFx(S.L.fx, [{t:8.6, at:[880, 780], col:'#FFE07A', s:1.3}].concat(vol.map((v, i) => ({t:v.t + v.d, at:v.to(), col:'#A6E3A0', s:0.7}))).concat([{t:14.7, at:batP(1, 14.7), col:'#FFE07A', s:0.7},
    {t:25.6, at:() => bossP(25.6).map((v, k) => v + [0, 70][k]), col:'#C9A7FF'}, {t:27.2, at:() => bossP(27.2).map((v, k) => v + [0, 70][k]), col:'#FFB347', s:1.2}, {t:BONK, at:() => bossP(BONK).map((v, k) => v + [0, 70][k]), col:'#FFE07A', s:1.8}]));
  S.ft = floatTxt(S.L.fx, [{t:8.7, at:[620, 560], text:'DIVINE SHIELD!', col:'#FFE07A', size:56}, {t:15.0, at:[1500, 360], text:'Shoo, shoo!', col:'#A6E3A0', size:40},
    {t:21.8, at:[620, 700], text:'+8 HP ALL', col:'#8FE0A8'}, {t:BONK + 0.2, at:() => bossP(BONK).map((v, k) => v - [0, 60][k]), text:'HOLY LIGHT!', col:'#FFE07A', size:60}]);
  S.hearts = heartBursts(S.L.fx, [{t:33, x:1450, y:560, n:6}, {t:40, x:620, y:700, n:5}]);
  S.sfx(2.6, 'flap', 0.05, 0.6, {d:1.4}); S.sfx(7.8, 'whoosh', 0.05, 0.3, {d:0.8, f0:800, f1:300}); SFXB.shield(S, 8.6, 0); vol.forEach(v => { SFXB.arrow(S, v.t, -0.4); SFXB.hit(S, v.t + v.d, 0.5); }); SFXB.zap(S, 14.2, -0.4);
  S.sfx(19.0, 'beep', 0.02, 0.5, {f:2600, d:0.6}); SFXB.heal(S, 21.4, -0.4); SFXB.slash(S, 25.6, 0.4); SFXB.hit(S, 25.7, 0.4); SFXB.hit(S, 27.2, 0.5); S.sfx(29.4, 'sparkle', 0.06, 0); S.sfx(30.0, 'heal', 0.04, 0.3); SFXB.hit(S, BONK, 0.5);
  SFXB.levelup(S, 35.0);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    const bp = bossP(u); boss.set(u, {x:bp[0], y:bp[1] + 200, s:1.6, hit: bump(u, 25.6, 0.4) + bump(u, 27.2, 0.4) + bump(u, BONK, 0.6) + 0.6*bump(u, 8.6, 0.3),
      face: u > BONK && u < BONK + 2.2 ? 'dizzy' : (u > BONK ? 'happy' : 'mad'), alpha: u < 1 ? 0 : 1});
    bats.forEach((b, i) => { const p = batP(i, u), h = [13.3, 14.0, 14.8][i]; b.set(u, {x:p[0], y:p[1] + 120, s:0.6, hit: bump(u, h, 0.4), face: u > h ? 'dizzy' : 'mad', alpha: u < 1.5 ? 0 : 1 - sm((u - h - 2)/0.8), rot: u > h ? 30*Math.sin(TAU*u) : 0}); });
    // crystal hangs from the boss, then floats down to Lumi
    const fall = sm((u - BONK - 0.6)/2.0); const cp = [lerp(bp[0], 620, fall), lerp(bp[1] + 260, 760, fall)];
    T(S.cr, `translate(${cp[0].toFixed(1)} ${cp[1].toFixed(1)}) scale(${(0.5 + 0.2*fall).toFixed(3)})`); S.cr.glow.setAttribute('opacity', (0.5 + 0.5*fall).toFixed(3));
    S.screech.forEach((s, k) => { const v = mod((u - 19.0)*1.6 + k/3, 1), on = u > 19 && u < 20.8; s.setAttribute('opacity', on ? (1 - v).toFixed(3) : 0); T(s, `translate(${(bp[0] - 80 - 260*v).toFixed(1)} ${(bp[1] + 200).toFixed(1)}) scale(${(1 + 1.5*v).toFixed(2)})`); });
    const ba = rh(u, 30.0, 30.4, 31.6, 32.4); show(S.beam, ba > 0.01); T(S.beam, `translate(${bp[0].toFixed(1)} ${(bp[1] + 300).toFixed(1)}) scale(${(0.5 + 0.5*ba).toFixed(3)} 1)`); S.beam.setAttribute('opacity', ba.toFixed(3));
    S.shield(u); S.arrows(u); S.stars(u); S.heal(u); S.slash(u); S.burst(u); S.ft(u); S.hearts(u);
    FLASH.v = Math.max(FLASH.v, 0.3*bump(u, BONK, 0.5));
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC4 — THE SUNLIGHT FESTIVAL =================== */
const SC4 = scene(135, 180, {look: u => [K(u, [[0, 960], [45, 960]]), K(u, [[0, 640], [8, 700], [45, 720]]), K(u, [[0, 0.95], [8, 1.05], [30, 1.1], [45, 1.15]])]});
(function(){
  const S = SC4;
  S.L = locRealm(S.cam, {biome:'town', tod:'sunset', castleX:960});
  const ly = S.L.chars;
  S.amb('cafe', 0, 45, 0.5); S.amb('birds', 0, 20, 0.3);
  const ids = ['leaf', 'owli', 'momo', 'pipi', 'lumi', 'kuku', 'otto'], X = [420, 570, 720, 870, 1050, 1200, 1350];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:X[i], y:985 + (i % 2)*6}));
  const all = Object.values(A);
  // the crystal returns to the castle tower; everyone dances
  A.lumi.do('arms', 1.0, 4.0, {R:[60, -200], L:[60, -200], eyes:'happy', mouth:'open'});
  all.forEach((a, i) => { a.do('look', 3, 5, {x:0, y:-12}); a.do('wow', 5.0 + i*0.1, 1.4); });
  all.forEach((a, i) => a.do('dance', 9.0 + i*0.2, 12, {bpm:[1.0, 1.1, 0.9, 1.2, 1.0, 1.4, 1.1][i]}));
  A.owli.item('L', 'cake', itCupcake(G(), '#FFE07A')); A.kuku.item('L', 'cake', itCupcake(G(), '#FFC3D2'));
  A.owli.do('eat', 22.0, 6.0, {side:'L', item:'cake', per:2.8, snd:'squish'}); A.kuku.do('eat', 22.4, 6.0, {side:'L', item:'cake', per:2.6, snd:'squish'});
  A.momo.do('shy', 23.0, 2.4); A.pipi.do('clap', 23.4, 3.0); A.leaf.do('wave', 24.0, 2.4); A.otto.do('laugh', 24.6, 2.4);
  // a poster flutters by: THE GRAND ARENA
  all.forEach((a, i) => { a.do('look', 30, 6, {x:-6, y:-8}); a.do('wow', 31.0 + i*0.12, 1.4); });
  A.kuku.do('arms', 33.6, 3.0, {R:[90, -180], L:[90, -180], eyes:'squeeze', mouth:'open'}); A.kuku.do('hop', 33.8, 0.5, {h:44});
  all.forEach((a, i) => { a.do('wave', 38.6 + i*0.12, 4.4); a.do('happy', 43, 2, {mouth:'open'}); });
  S.cr = sunCrystal(S.L.fx, 0.5);
  S.fw = burstFx(S.L.fx, [10, 11.2, 12.6, 14.2, 15.8, 17.6, 19.2].map((t, i) => ({t, at:[300 + i*230, 160 + (i % 3)*60], col:['#FFE07A', '#FF9DB5', '#9FD8F7', '#C9A7FF'][i % 4], s:1.4})));
  S.flyer = G(S.L.fx); mk('rect', SK({x:-60, y:-80, width:120, height:160, rx:8, fill:'#FFF3D6'}, 4), S.flyer); mk('path', SK({d:'M-30 -40 L30 20 M30 -40 L-30 20', fill:'none', stroke:'#C8443A'}, 8), S.flyer);
  { const t = txt(S.flyer, 0, 56, 'ARENA', 26, '#C8443A'); t.setAttribute('font-weight', 800); }
  S.H = hud(S);
  S.H.banner(5.2, 'QUEST CLEAR!', 'The Sunlit Castle  ·  +80 Gold', '#7DC77A', 3.6);
  S.H.card(34.0, 'tora', {tag:'✦ NEXT TIME: THE GRAND ARENA ✦', d:7.0, x:740, y:120});
  S.hearts = heartBursts(S.L.fx, [{t:12, x:960, y:700, n:6}, {t:26, x:700, y:680, n:5}, {t:40, x:900, y:680, n:5}]);
  SFXB.levelup(S, 5.2); [10, 11.2, 12.6, 14.2, 15.8, 17.6, 19.2].forEach((t, i) => { S.sfx(t - 0.4, 'whoosh', 0.03, -0.6 + i*0.2, {d:0.4, f0:600, f1:2600}); S.sfx(t, 'pop', 0.06, -0.6 + i*0.2); S.sfx(t + 0.1, 'sparkle', 0.03, -0.6 + i*0.2); });
  S.sfx(30.4, 'crinkle', 0.04, 0.5, {d:0.8}); S.sfx(34.0, 'chime', 0.03, 0, {f:1568});
  S.pre = u => S.L.update(u, {camX:960, dusk:0.2});
  S.post = u => {
    const up = sm((u - 1.4)/3.4); const tw = [S.L.castle ? 960 + (0)*0.45 : 960, 340]; const p = arcP([1050, 760], [960, 330], up, 160);
    T(S.cr, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${(0.5 - 0.15*up).toFixed(3)})`); show(S.cr, u < 6.4); S.cr.setAttribute('opacity', (1 - sm((u - 5)/1.4)).toFixed(3));
    FLASH.v = Math.max(FLASH.v, 0.3*bump(u, 4.8, 0.6));
    const fv = (u - 29.6)/4.4; show(S.flyer, fv > 0 && u < 36.6);
    if (fv > 0){ const q = fv < 1 ? [lerp(-200, 960, sm(fv)), 420 + 60*Math.sin(TAU*fv*1.5)] : [960, 420]; T(S.flyer, `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) rotate(${(fv < 1 ? 20*Math.sin(TAU*fv*2) : 0).toFixed(1)}) scale(${(1 - 0.8*sm((u - 35.6)/0.8)).toFixed(3)})`); }
    S.fw(u); S.hearts(u);
    S.H.update(u); S.H.post(u);
  };
})();

EPISODE({day:16, title:'The Sunlit Castle', music:{seed:63, key:7, bpm:80, prog:0}, thumb:120,
  chapters:[['The Castle Gates', g => clsIcon(g, 'paladin', 1)],
            ['Lumi the Paladin', g => { mk('circle', S4({r:14, fill:'#FFE07A'}), g); }],
            ['Battle in the Belfry', g => { mk('path', S4({d:'M-18 0 Q-8 -14 0 -4 Q8 -14 18 0 Q8 -4 0 6 Q-8 -4 -18 0 Z', fill:'#7E6AA8'}), g); }],
            ['The Sunlight Festival', IC.cupcake]],
  scenes:[SC1, SC2, SC3, SC4]});
