/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 14: "The Magic Tower"  (180 s)
   road to the tower → Owli's floating library (Owli joins) → the golem
   trial at the moon shrine → stargazing on the tower balcony
   ===================================================================== */
function wizardTower(parent, x, y, s){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  mk('path', SK({d:'M-120 0 L-100 -620 L100 -620 L120 0 Z', fill:'#D9D3F2'}, 6), g);
  for (let r=0;r<10;r++) mk('path', {d:`M${-118 + r*2} ${-r*62} H${118 - r*2}`, stroke:'#B9B0E0', 'stroke-width':4}, g);
  mk('path', SK({d:'M-150 -610 Q-120 -640 -110 -660 L110 -660 Q120 -640 150 -610 Z', fill:'#BFB4E8'}, 5), g);
  mk('path', SK({d:'M-130 -650 Q-60 -700 -20 -900 Q-10 -950 0 -980 Q10 -950 20 -900 Q60 -700 130 -650 Z', fill:'#6A5CC6'}, 6), g);
  [[-40,-760],[30,-820],[10,-700]].forEach(q => mk('path', {d:STAR_D, fill:'#FFE07A', transform:`translate(${q[0]} ${q[1]}) scale(1.1)`}, g));
  g.tip = G(g, 'translate(0 -990)'); mk('circle', {r:80, fill:'url(#glowW)'}, g.tip); mk('path', {d:STAR_D, fill:'#FFF2A8', stroke:OL, 'stroke-width':2, transform:'scale(2.2)'}, g.tip);
  [[-50,-480],[50,-340],[-40,-200]].forEach(q => { mk('rect', SK({x:q[0] - 22, y:q[1], width:44, height:64, rx:22, fill:'#FFE7A8'}, 4.4), g); });
  g.door = G(g); mk('path', SK({d:'M-60 0 L-60 -120 Q0 -190 60 -120 L60 0 Z', fill:'#5B4FB0'}, 5), g.door);
  g.runes = [0,1,2].map(k => mk('circle', {cx:-30 + k*30, cy:-100, r:9, fill:'#8F84E0', stroke:'#FFFFFF', 'stroke-width':2.4}, g.door));
  mk('path', SK({d:'M60 -560 Q120 -500 180 -540 L180 -520 Q120 -480 60 -540 Z', fill:'#9B8AE0'}, 3.6), g);
  return g;
}

/* =================== SC1 — ROAD TO THE TOWER =================== */
const SC1 = scene(0, 45, {look: u => [K(u, [[0, 700], [12, 900], [22, 1250], [45, 1300]]), K(u, [[0, 760], [18, 760], [24, 640], [45, 660]]), K(u, [[0, 1.12], [18, 1.05], [24, 0.95], [34, 1.05], [45, 1.15]])]});
(function(){
  const S = SC1;
  S.L = locRealm(S.cam, {biome:'meadow', castleX:400});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.5); S.amb('breeze', 0, 45, 0.6);
  S.tower = wizardTower(S.L.mid, 1560, 860, 0.62);
  const xs = {otto:[[0,-500],[16,640],[22,640],[28,1120],[45,1120]], momo:[[0,-330],[16,820],[22,820],[28,1290],[45,1290]], kuku:[[0,-160],[16,1000],[22,1000],[28,1460],[45,1460]], pipi:[[0,0],[16,1180],[22,1180],[28,1640],[45,1640]]};
  const A = {}; Object.keys(xs).forEach(id => A[id] = hero(S, id, {layer:ly, x:xs[id], y:975, steps:'grassstep'}));
  const all = Object.values(A);
  all.forEach((a, i) => { a.do('look', 16.4, 5, {x:6, y:-9}); a.do('wow', 17.0 + i*0.18, 1.5); });
  A.kuku.do('point', 18.6, 2.4, {at:[110, -170]});
  // the door is locked by three runes — each friend touches one, the third stays dark... until a hoot from above
  A.momo.do('reach', 29.0, 2.0, {to:[1520, 800], lean:8}); A.kuku.do('reach', 30.6, 2.0, {to:[1560, 800], lean:6}); A.pipi.do('reach', 32.2, 2.0, {side:'L', to:[1600, 800], lean:-6});
  all.forEach((a, i) => { a.do('look', 34.4, 4, {x:-2, y:-10}); a.do('wow', 34.8 + i*0.15, 1.4); });
  A.otto.do('think', 36.0, 3.0);
  all.forEach((a, i) => a.do('cheer', 40.4 + i*0.15, 2.4));
  S.H = hud(S);
  all.forEach(a => S.H.plate(a, {lv:2, show: u => u > 4 && u < 28}));
  S.H.quest('The Magic Tower', [{text:'Find the tower', done:17.5}, {text:'Open the rune door', done:40.4}], 3.0, 44.5);
  S.spark = sparkles(S.L.fx, [{t:40.2, x:1560, y:760, n:10, r:180}]);
  S.ft = floatTxt(S.L.fx, [{t:35.2, at:[1560, 360], text:'Hoo-hoo! ♪', col:'#C9B6FF', size:40, d:2.4}]);
  S.sfx(17.2, 'chime', 0.03, 0.4, {f:1318.5}); [29.6, 31.2, 32.8].forEach((t, i) => S.sfx(t, 'plink', 0.05, 0.5, {f:900 + i*200})); S.sfx(34.6, 'owl', 0.06, 0.6);
  S.sfx(39.8, 'sparkle', 0.06, 0.5); S.sfx(40.2, 'knock', 0.04, 0.5, {f:300});
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    T(S.tower.tip, `translate(0 -990) rotate(${(u*20).toFixed(1)}) scale(${(1 + 0.08*Math.sin(TAU*u)).toFixed(3)})`);
    S.tower.runes.forEach((r, k) => r.setAttribute('fill', u > [29.8, 31.4, 39.8][k] ? '#FFE07A' : '#8F84E0'));
    T(S.tower.door, `translate(0 ${(-120*sm((u - 40.2)/1.4)).toFixed(1)})`);
    S.spark(u); S.ft(u);
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC2 — OWLI'S FLOATING LIBRARY =================== */
const SC2 = scene(45, 90, {look: u => [K(u, [[0, 820], [8, 1180], [20, 1180], [26, 960], [45, 960]]), 720, K(u, [[0, 1.1], [8, 1.4], [20, 1.35], [26, 1.08], [45, 1.12]])]});
(function(){
  const S = SC2;
  S.L = locHall(S.cam, {kind:'tower'});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 0.6); S.amb('clock', 0, 45, 0.4); S.amb('fire', 0, 45, 0.2);
  const momo = hero(S, 'momo', {layer:ly, x:[[0,-200],[5,420],[45,420]], y:975, steps:'woodstep'});
  const pipi = hero(S, 'pipi', {layer:ly, x:[[0,-360],[5.2,600],[45,600]], y:980, steps:'woodstep'});
  const kuku = hero(S, 'kuku', {layer:ly, x:[[0,-520],[5.4,780],[45,780]], y:975, steps:'woodstep'});
  const otto = hero(S, 'otto', {layer:ly, x:[[0,-680],[5.6,960],[45,960]], y:980, steps:'woodstep'});
  const owli = hero(S, 'owli', {layer:ly, x:[[0,1300],[24,1300],[26,1160],[45,1160]], y:975, steps:'woodstep'});
  const party = [momo, pipi, kuku, otto];
  owli.item('R', 'read', itBook(G(null, 'translate(6 -8)'), '#4E46A8'));
  // Owli is reading, startled by the visitors, books go flying
  owli.do('hold', 0, 7.6, {item:'read', at:[20, -96]}); owli.do('look', 0, 7.6, {x:0, y:7}); owli.do('pose', 0, 7.6, {eyes:'happy', R:'read'});
  owli.do('pose', 7.8, 2.0, {eyes:'open', mouth:'open', hop:30, excl:1, R:'read'}); owli.do('wow', 7.8, 1.4);
  party.forEach((a, i) => { a.do('wow', 8.2 + i*0.1, 1.2); a.do('look', 8, 14, {x:7, y:-4}); });
  // everyone catches a book; Owli giggles and waves the star staff — books fly home
  [momo, pipi, kuku, otto].forEach((a, i) => a.do('arms', 10.6 + i*0.5, 2.0, {L:[60, -170], R:[60, -170], eyes:'squeeze', mouth:'open'}));
  owli.do('laugh', 13.4, 2.2); owli.do('arms', 15.8, 2.6, {R:[100, -190], eyes:'happy', mouth:'open'});
  owli.do('talk', 19.0, 4.4, {gest:true}); party.forEach((a, i) => a.do('nod', 19.6 + i*0.2, 1.8));
  // Owli shows Starlight Bolt on the training dummy, then joins
  owli.do('arms', 27.4, 1.8, {R:[120, -180], L:[60, -110], eyes:'squeeze', mouth:'open'});
  party.forEach((a, i) => { a.do('look', 27, 6, {x:9, y:-2}); a.do('wow', 29.2 + i*0.15, 1.4); a.do('cheer', 33.0 + i*0.15, 2.4); });
  owli.do('shy', 33.4, 2.0); owli.do('cheer', 36.4, 2.4);
  [momo, pipi, kuku, otto, owli].forEach((a, i) => a.do('happy', 39, 6, {mouth:'open'}));
  S.dummy = monster(ly, 'dummy', {});
  S.H = hud(S);
  party.forEach(a => S.H.plate(a, {lv:2, show: u => u > 5.6}));
  S.H.plate(owli, {lv:2, show: u => u > 31.2});
  S.H.card(31.2, 'owli', {d:6.4, x:100, y:180});
  S.flyBooks = [0,1,2,3].map(k => { const b = G(S.L.fx); mk('rect', SK({x:-26, y:-20, width:52, height:40, rx:5, fill:BOOKC[k + 2]}, 3.6), b); mk('path', {d:'M0 -20 V20', stroke:OL, 'stroke-width':3}, b); b.style.display = 'none'; return b; });
  S.bolt = boltFx(S.L.fx, [{t:28.2, d:0.5, from:() => paw(owli.c, 1).map((v, k) => v - [0, 128][k]), to:() => [1620, 800], col:'#FFE07A', arc:40},
    {t:28.5, d:0.5, from:() => paw(owli.c, 1).map((v, k) => v - [0, 128][k]), to:() => [1640, 760], col:'#FFF2A8', arc:-30}]);
  S.burst = burstFx(S.L.fx, [{t:28.7, at:[1620, 800], col:'#FFE07A', s:1.3}, {t:29.0, at:[1640, 760], col:'#FFF2A8'}]);
  S.ft = floatTxt(S.L.fx, [{t:28.8, at:[1620, 640], text:'PERFECT HIT!', col:'#FFE07A', size:54}]);
  S.spark = sparkles(S.L.fx, [{t:16.4, x:960, y:420, n:10, r:400}]);
  S.hearts = heartBursts(S.L.fx, [{t:34, x:1160, y:640, n:4}]);
  S.sfx(7.8, 'owl', 0.06, 0.4); S.sfx(8.0, 'flap', 0.05, 0.3, {d:0.8}); [10.8, 11.3, 11.8, 12.3].forEach((t, i) => S.sfx(t + 0.6, 'page', 0.05, -0.4 + i*0.25));
  S.sfx(16.0, 'sparkle', 0.06, 0.2); S.sfx(16.4, 'whoosh', 0.04, 0, {d:1.2, f0:400, f1:2000});
  SFXB.zap(S, 28.2, 0.4); SFXB.zap(S, 28.5, 0.5); SFXB.hit(S, 28.7, 0.6); S.sfx(31.2, 'chime', 0.03, 0, {f:1568}); SFXB.levelup(S, 31.4);
  S.pre = u => S.L.update(u);
  S.post = u => {
    S.dummy.set(u, {x:1640, y:960, s:0.9, hit: bump(u, 28.7, 0.5) + bump(u, 29.0, 0.4), face: u > 28.7 && u < 30 ? 'dizzy' : 'happy', rot: 12*bump(u, 28.7, 0.8)});
    S.flyBooks.forEach((b, k) => { const a0 = [1300 + k*20, 820], catcher = [momo, pipi, kuku, otto][k]; const t0 = 8.0 + k*0.15;
      const v = (u - t0)/(2.6 + k*0.5); const ret = sm((u - 16.4 - k*0.15)/1.2);
      show(b, u > t0 && ret < 1);
      let p;
      if (v < 1) p = arcP(a0, [catcher.X(u), 760], v, 260); else p = [catcher.X(u) + 4*Math.sin(TAU*u), 760];
      if (ret > 0) p = arcP(p, [-200 + k*120, 300 + k*90], ret, 160);
      T(b, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${((1 - Math.min(1, v))*720 + 8*Math.sin(TAU*u)).toFixed(1)})`); });
    S.bolt(u); S.burst(u); S.ft(u); S.spark(u); S.hearts(u);
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC3 — THE GOLEM TRIAL =================== */
const SC3 = scene(90, 135, {look: u => [K(u, [[0, 900], [6, 1100], [12, 960], [24, 1000], [30, 1100], [36, 980], [45, 960]]), 740, K(u, [[0, 1.0], [6, 1.15], [12, 1.05], [24, 1.12], [30, 1.18], [36, 1.05], [45, 1.1]])]});
(function(){
  const S = SC3;
  S.L = locRealm(S.cam, {biome:'shrine', tod:'sunset'});
  const ly = S.L.chars;
  S.amb('breeze', 0, 45, 0.7); S.amb('birds', 0, 20, 0.3);
  const P = {owli:[260, 975], otto:[420, 980], momo:[580, 975], kuku:[740, 975], pipi:[900, 985]};
  const A = {}; Object.keys(P).forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:[[0, P[id][0] - 900], [5 + i*0.15, P[id][0]], [45, P[id][0]]], y:P[id][1], steps:'grassstep'}));
  const all = Object.values(A);
  S.golem = monster(ly, 'golem', {});
  const GX = 1480;
  all.forEach((a, i) => { a.do('wow', 7.0 + i*0.1, 1.4); a.do('look', 7, 5, {x:8, y:-6}); });
  // golem stomps → Pipi's Carrot Shield
  A.pipi.do('arms', 11.6, 2.2, {L:[70, -100], eyes:'squeeze', mouth:'open'});
  all.filter(a => a !== A.pipi).forEach(a => a.do('shiver', 12.0, 1.2));
  // Owli: Wisdom Aura on the party
  A.owli.do('arms', 15.0, 2.6, {R:[90, -190], L:[60, -150], eyes:'happy', mouth:'open'});
  // attacks
  lunge(A.momo, 19.4, 1.3, 760, {hop:50}); strike(A.momo, 19.7, {R:[110, -150], L:[100, -100]});
  lunge(A.kuku, 21.6, 1.3, 600, {hop:16}); strike(A.kuku, 21.9, {R:[120, -110], L:[60, -120]});
  // golem gets grumpy → big rock toss → Otto heals Pipi
  A.pipi.do('pose', 25.2, 1.6, {eyes:'squeeze', mouth:'wavy', bt:-10, sweat:1});
  A.otto.do('arms', 26.6, 2.2, {R:[70, -190], eyes:'happy', mouth:'open'});
  // finale: Owli's Starlight Bolt rain
  A.owli.do('arms', 29.6, 3.0, {R:[120, -190], L:[80, -120], eyes:'squeeze', mouth:'open'}); A.owli.do('hop', 29.6, 0.5, {h:30});
  all.forEach((a, i) => { a.do('cheer', 35.2 + i*0.12, 2.4); a.do('happy', 38, 7, {mouth:'open'}); });
  A.kuku.do('dance', 39.6, 4.4, {bpm:1.2}); A.owli.do('shy', 40.2, 2.6);
  const BONK = 31.4;
  S.H = hud(S);
  all.forEach(a => { S.H.plate(a, {lv:2, show: u => u > 5.4 && u < 35.2}); S.H.plate(a, {lv:3, show: u => u >= 35.2}); });
  S.H.monPlate(S.golem, 'Moss Golem', 5); { const pl = S.H.plates[S.H.plates.length - 1]; pl.o.show = u => u > 7 && u < BONK + 2; pl.o.hp = u => 1 - 0.15*sm((u - 19.9)/0.3) - 0.2*sm((u - 22.1)/0.3) - 0.65*sm((u - BONK)/0.6); }
  S.H.quest('Moon Shrine Trial', [{text:'Calm the Moss Golem', done:BONK + 1}, {text:'Wake the moon crystal', done:38}], 4.0, 44.5);
  S.H.banner(35.2, 'LEVEL UP!', 'Lv 2 → Lv 3', '#F2B33E', 3.4);
  S.shield = shieldFx(S.L.fx, [{t:11.8, d:2.0, at:() => [P.pipi[0] + 90, 985], hit:12.6, col:'#FFC2D4', s:1.15}]);
  S.aura = auraFx(S.L.fx, all.map(a => ({t:15.6, d:2.6, at:() => [a.X(16), 975], col:'#8F9BFF'})));
  S.slash = slashFx(S.L.fx, [{t:19.9, at:[GX - 40, 840], rot:-24}, {t:20.05, at:[GX - 40, 840], rot:196}]);
  S.rock = boltFx(S.L.fx, [{t:24.4, d:0.8, from:() => [GX - 60, 760], to:() => [P.pipi[0] + 60, 860], col:'#B7B0A4', arc:200}]);
  const bolts = [0,1,2,3,4].map(k => ({t:30.0 + k*0.25, d:0.55, from:() => paw(A.owli.c, 1).map((v, j) => v - [0, 128][j]), to:() => [GX - 40 + (k - 2)*30, 820 + (k % 2)*30], col: k % 2 ? '#FFF2A8' : '#FFE07A', arc:120 - k*40}));
  S.bolt = boltFx(S.L.fx, bolts);
  S.burst = burstFx(S.L.fx, [{t:12.6, at:[P.pipi[0] + 130, 880], col:'#FFC2D4'}, {t:20.0, at:[GX - 40, 840], col:'#C9A7FF'}, {t:22.1, at:[GX - 60, 860], col:'#FFB347', s:1.3},
    {t:25.2, at:[P.pipi[0] + 60, 860], col:'#B7B0A4', s:0.8}].concat(bolts.map(b => ({t:b.t + b.d, at:b.to(), col:b.col}))));
  S.heal = healFx(S.L.fx, [{t:27.0, d:2.0, at:[P.pipi[0], 985]}]);
  S.lvl = auraFx(S.L.fx, all.map(a => ({t:35.2, d:2.8, at:() => [a.X(35), 975], col:'#FFE07A'})));
  S.ft = floatTxt(S.L.fx, [{t:12.7, at:[P.pipi[0] + 80, 760], text:'BLOCK!', col:'#FFC2D4'}, {t:16.2, at:[560, 700], text:'ATK UP!', col:'#A8B4FF'}, {t:20.2, at:[GX - 40, 700], text:'+12'},
    {t:22.3, at:[GX - 60, 700], text:'+15'}, {t:25.3, at:[P.pipi[0], 740], text:'-6', col:'#FF8A8A'}, {t:27.8, at:[P.pipi[0], 720], text:'+6 HP', col:'#8FE0A8'}, {t:31.6, at:[GX - 40, 620], text:'STARLIGHT RAIN!', size:56}]);
  S.hearts = heartBursts(S.L.fx, [{t:33.4, x:GX, y:720, n:5}, {t:40, x:900, y:700, n:5}]);
  S.sfx(9.0, 'thump', 0.07, 0.4, {f:70, d:0.4}); S.sfx(10.4, 'thump', 0.07, 0.4, {f:70, d:0.4}); S.sfx(12.4, 'thump', 0.08, 0.3, {f:60, d:0.5}); SFXB.shield(S, 12.6, 0);
  S.sfx(15.6, 'sparkle', 0.06, -0.6); SFXB.slash(S, 19.9, 0.4); SFXB.hit(S, 20.0, 0.4); SFXB.hit(S, 22.1, 0.4); S.sfx(24.4, 'whoosh', 0.05, 0.2, {d:0.8, f0:200, f1:900}); SFXB.hit(S, 25.2, 0);
  SFXB.heal(S, 27.0, -0.2); bolts.forEach(b => SFXB.zap(S, b.t, -0.4)); SFXB.hit(S, BONK, 0.5); S.sfx(BONK + 0.4, 'chime', 0.03, 0.5, {f:1568}); SFXB.levelup(S, 35.2); S.sfx(37.6, 'sparkle', 0.06, 0);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    const stomp = hopF(u, 8.6, 0.5, 30) + hopF(u, 10.0, 0.5, 30) + hopF(u, 12.0, 0.5, 46);
    const toss = u > 24.0 && u < 24.6 ? -20 : 0;
    S.golem.set(u, {x:GX + 40, y:990, s:1.45, hop:stomp, rot:toss, hit: bump(u, 20.0, 0.4) + bump(u, 22.1, 0.4) + bolts.reduce((s2, b) => s2 + 0.7*bump(u, b.t + b.d, 0.3), 0),
      face: u > BONK && u < BONK + 2.4 ? 'dizzy' : (u > BONK ? 'happy' : (u > 7 ? 'mad' : null))});
    // the moon crystal on the right pillar wakes up
    const cr = S.L.orb1; if (cr){ cr.glow.setAttribute('opacity', (0.4 + 0.8*sm((u - 36)/1.5)).toFixed(3)); }
    S.shield(u); S.aura(u); S.slash(u); S.rock(u); S.bolt(u); S.burst(u); S.heal(u); S.lvl(u); S.ft(u); S.hearts(u);
    FLASH.v = Math.max(FLASH.v, 0.2*bump(u, BONK, 0.4) + 0.25*bump(u, 37.5, 0.6));
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC4 — STARGAZING ON THE TOWER =================== */
const SC4 = scene(135, 180, {look: u => [960, K(u, [[0, 740], [10, 700], [14, 520], [26, 520], [30, 720], [45, 720]]), K(u, [[0, 1.15], [10, 1.12], [14, 1.0], [26, 1.0], [30, 1.14], [45, 1.22]])]});
(function(){
  const S = SC4;
  S.L = locRealm(S.cam, {biome:'mountain', tod:'night'});
  const ly = S.L.chars;
  S.amb('night', 0, 45, 0.8); S.amb('breeze', 0, 45, 0.3);
  // balcony floor + railing in front of the scenery
  S.bal = G(S.L.back); mk('path', SK({d:'M-400 860 L2320 860 L2320 1500 L-400 1500 Z', fill:'#B9B0E0'}, 6), S.bal);
  for (let x=-380; x<2320; x+=150) mk('path', {d:`M${x} 860 L${x - 120} 1500`, stroke:'#9E94CC', 'stroke-width':4}, S.bal);
  const X = [560, 740, 920, 1100, 1280];
  const ids = ['pipi', 'momo', 'owli', 'kuku', 'otto'];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:X[i], y:990}));
  const all = Object.values(A);
  const mc = ['#FFB3C7', '#C7B3F5', '#9FA6F0', '#FFB47A', '#9FC8F0'];
  all.forEach((a, i) => { const m = a.item('L', 'mug', itMug(G(), mc[i], '#8B5A3C')); a.do('hold', 0, 45, {side:'L', item:'mug', at:[30, -76], ease:false}); a.do('sip', 3.0 + i*0.8, 2.0, {side:'L', item:'mug'}); });
  // looking up; Owli traces constellations with the star staff
  all.forEach((a, i) => a.do('look', 9.6, 20, {x:[3, 1, 0, -1, -3][i], y:-12}));
  A.owli.do('arms', 12.0, 12.0, {R: (u, lu) => [80 + 30*Math.sin(TAU*lu*0.25), -190 + 10*Math.cos(TAU*lu*0.25)], eyes:'happy', mouth:'open'});
  ['pipi', 'momo', 'kuku', 'otto'].forEach((id, i) => { A[id].do('wow', 15.0 + i*1.8, 1.4); A[id].do('happy', 17 + i*1.8, 2, {mouth:'open'}); });
  // an arrow with a leaf thuds into the railing post: a message!
  all.forEach((a, i) => { a.do('wow', 31.2 + i*0.1, 1.4); a.do('look', 31.2, 5, {x:-8, y:2}); });
  A.kuku.do('reach', 33.6, 2.4, {side:'L', to:[300, 860], lean:-10}); A.kuku.do('pose', 33.6, 2.4, {x:1000});
  all.forEach((a, i) => { a.do('nod', 38.4 + i*0.2, 1.6); a.do('happy', 40.2, 4.8, {mouth:'open'}); });
  S.post0 = G(ly); mk('rect', SK({x:-16, y:-150, width:32, height:150, rx:6, fill:'#9E94CC'}, 4.4), S.post0); S.post0.setAttribute('transform', 'translate(300 990)');
  S.arrow = G(S.L.fx); mk('path', SK({d:'M-60 0 L20 0 M8 -10 L24 0 L8 10', fill:'none', stroke:'#8A5A3A'}, 5), S.arrow); mk('ellipse', S4({cx:-40, cy:-14, rx:14, ry:8, fill:'#8ED081'}), S.arrow); S.arrow.style.display = 'none';
  // constellations: a paw and a star staff
  const C1 = [[700, 200], [760, 140], [840, 120], [920, 140], [980, 200], [840, 260]], C2 = [[1180, 160], [1260, 120], [1330, 180], [1300, 280], [1220, 300]];
  S.cons = [C1, C2].map(pts => { const g = G(S.L.fx); g.line = mk('path', {d:'M' + pts.map(p => p.join(' ')).join(' L') + ' Z', fill:'none', stroke:'#FFF2A8', 'stroke-width':4, opacity:0.8, 'stroke-dasharray':'2000', 'stroke-dashoffset':'2000'}, g);
    g.dots = pts.map(p => { const d = G(g, `translate(${p[0]} ${p[1]})`); mk('circle', {r:40, fill:'url(#glowW)'}, d); mk('path', {d:STAR_D, fill:'#FFF6D0', transform:'scale(1.1)'}, d); return d; }); return g; });
  S.H = hud(S);
  S.H.card(37.0, 'leaf', {tag:'✦ NEXT TIME: THE WHISPERING FOREST ✦', d:7.0, x:740, y:120});
  S.steams = all.map(() => steam(S.L.fx, 2));
  S.hearts = heartBursts(S.L.fx, [{t:20, x:960, y:640, n:4}, {t:41, x:920, y:640, n:5}]);
  S.sfx(12.4, 'sparkle', 0.05, -0.1); S.sfx(16.0, 'chime', 0.03, -0.1, {f:1318.5}); S.sfx(20.0, 'sparkle', 0.05, 0.3); S.sfx(23.0, 'chime', 0.03, 0.3, {f:1568});
  SFXB.arrow(S, 30.4, -0.7); S.sfx(31.0, 'knock', 0.06, -0.7, {f:260}); S.sfx(35.4, 'page', 0.05, -0.4); S.sfx(37.0, 'chime', 0.03, 0, {f:1568});
  S.pre = u => S.L.update(u, {camX:960});
  S.post = u => {
    S.cons.forEach((g, k) => { const t0 = 12.5 + k*7; const v = sm((u - t0)/4); g.line.setAttribute('stroke-dashoffset', (2000*(1 - v)).toFixed(0));
      const a = rh(u, t0, t0 + 0.5, 28, 30); g.setAttribute('opacity', a.toFixed(3)); g.dots.forEach((d, j) => d.setAttribute('opacity', (0.7 + 0.3*Math.sin(TAU*(u*0.8 + j/5))).toFixed(3))); });
    const av = (u - 30.0)/0.4; show(S.arrow, u > 30.0 && u < 36.0);
    if (u > 30.0){ const p = av < 1 ? [lerp(-300, 296, av), 880] : [296, 880]; T(S.arrow, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${av >= 1 ? (4*Math.sin(TAU*u*6)*Math.exp(-(u - 30.4)*3)).toFixed(1) : 0})`); }
    all.forEach((a, i) => { const p = paw(a.c, -1); S.steams[i](p[0], p[1] - 24, u + i, 0.5, 8); });
    S.hearts(u);
    S.H.update(u); S.H.post(u);
  };
})();

EPISODE({day:14, title:'The Magic Tower', music:{seed:44, key:5, bpm:78, prog:1}, thumb:136,
  chapters:[['Road to the Tower', g => clsIcon(g, 'mage', 1)],
            ['Owli’s Floating Library', IC.book],
            ['The Golem Trial', g => clsIcon(g, 'shield', 1)],
            ['Stargazing', g => { mk('path', {d:STAR_D, fill:'#FFE07A', stroke:OL, 'stroke-width':2, transform:'scale(1.2)'}, g); }]],
  scenes:[SC1, SC2, SC3, SC4]});
