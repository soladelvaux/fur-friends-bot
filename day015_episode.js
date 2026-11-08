/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 15: "The Whispering Forest"  (180 s)
   lost among giant mushrooms → arrows from the trees (Leaf joins) →
   the Mushroom King → campfire under the stars
   ===================================================================== */

/* =================== SC1 — INTO THE FOREST =================== */
const SC1 = scene(0, 45, {look: u => [K(u, [[0, 700], [14, 1000], [24, 1000], [32, 1200], [45, 960]]), 760, K(u, [[0, 1.12], [14, 1.08], [22, 1.25], [32, 1.1], [45, 1.12]])]});
(function(){
  const S = SC1;
  S.L = locRealm(S.cam, {biome:'forest'});
  const ly = S.L.chars;
  S.amb('leaves', 0, 45, 0.6); S.amb('birds', 0, 45, 0.5); S.amb('stream', 0, 45, 0.2);
  const ids = ['otto', 'momo', 'owli', 'kuku', 'pipi'], X0 = [560, 720, 880, 1040, 1200];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:[[0, X0[i] - 1100], [8 + i*0.2, X0[i]], [45, X0[i]]], y:975 + (i % 2)*6, steps:'grassstep'}));
  const all = Object.values(A);
  A.owli.item('R', 'msg', (() => { const g = G(); mk('rect', SK({x:-24, y:-30, width:48, height:60, rx:6, fill:'#FFF3D6'}, 3.6), g); mk('ellipse', S4({cx:0, cy:-34, rx:12, ry:7, fill:'#8ED081'}), g); mk('path', {d:'M-14 -12 H14 M-14 0 H14 M-14 12 H8', stroke:'#C9A27E', 'stroke-width':3}, g); return g; })());
  // reading the leaf message as they walk
  A.owli.do('hold', 8.4, 6.0, {item:'msg', at:[30, -120]}); A.owli.do('talk', 9.0, 4.0);
  ['otto', 'momo', 'kuku', 'pipi'].forEach((id, i) => A[id].do('look', 8.6, 5, {x: X0[i] < 880 ? 7 : -7, y:-2}));
  // which way? everyone points somewhere different
  A.momo.do('point', 15.2, 2.6, {at:[-100, -150]}); A.kuku.do('point', 15.6, 2.6, {at:[110, -150]}); A.otto.do('think', 15.4, 3.0); A.pipi.do('point', 16.0, 2.2, {side:'L', at:[100, -170]});
  A.owli.do('shake', 17.6, 1.4);
  all.forEach((a, i) => { a.do('pose', 19.4, 3.6, {sweat:0.8, mouth:'wavy'}); });
  // a rustle in the leaves... a glimpse of antlers, gone!
  all.forEach((a, i) => { a.do('wow', 24.0 + i*0.12, 1.4); a.do('look', 24.0, 5, {x:8, y:-10}); });
  A.kuku.do('point', 26.0, 2.0, {at:[110, -190]});
  // follow the trail of glowing leaves
  all.forEach((a, i) => a.do('nod', 33 + i*0.15, 1.4));
  all.forEach((a, i) => a.do('pose', 36, 9, {x: X0[i] + 900, ai:7}));
  S.H = hud(S);
  all.forEach(a => S.H.plate(a, {lv:3, show: u => u > 9 && u < 35}));
  S.H.quest('The Whispering Forest', [{text:'Find the arrow’s owner'}, {text:'Follow the glowing leaves', done:43}], 4.0, 44.6);
  S.peek = G(S.L.mid, 'translate(1560 560)');
  { const pc = G(S.peek, 'scale(0.8)'); const d = makeChar('deer', pc); pose(d, {eyes:'happy', still:true, feet:false}); hood(d, '#4E9A54', '#8ED081'); }
  S.bushF = flowerBush(S.L.mid, 1560, 640, 1.1, 77, ['#FFFFFF','#FFE07A','#C9B6F2','#FF9EBB']);
  S.trail = [0,1,2,3,4,5].map(k => { const l = G(S.L.fx, `translate(${1200 + k*170} ${930 - (k % 2)*16})`); mk('circle', {r:40, fill:'url(#glowW)'}, l); itLeaf(G(l, `rotate(${k*30})`), '#A6E3A0'); l.style.display = 'none'; return l; });
  S.sfx(23.6, 'rustle', 0.06, 0.6); S.sfx(25.6, 'rustle', 0.05, 0.6); S.sfx(30.0, 'sparkle', 0.05, 0.4); S.sfx(17.6, 'owl', 0.03, 0);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    const pk = rh(u, 23.2, 23.8, 25.4, 26.2); T(S.peek, `translate(1560 ${(840 - 160*pk).toFixed(1)})`);
    S.trail.forEach((l, k) => { const a = sm((u - 30 - k*0.4)/0.6); show(l, a > 0.01); l.setAttribute('opacity', (a*(0.75 + 0.25*Math.sin(TAU*(u + k/6)))).toFixed(3)); });
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC2 — LEAF THE RANGER =================== */
const SC2 = scene(45, 90, {look: u => [K(u, [[0, 900], [10, 1100], [18, 1000], [22, 1300], [28, 1100], [45, 1000]]), K(u, [[0, 760], [20, 760], [22, 560], [26, 720], [45, 740]]), K(u, [[0, 1.05], [10, 1.12], [18, 1.05], [22, 1.3], [28, 1.15], [45, 1.12]])]});
(function(){
  const S = SC2;
  S.L = locRealm(S.cam, {biome:'forest'});
  const ly = S.L.chars;
  S.amb('leaves', 0, 45, 0.6); S.amb('birds', 0, 45, 0.4);
  const ids = ['otto', 'owli', 'momo', 'kuku', 'pipi'], X = [380, 540, 700, 860, 1020];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:X[i], y:975 + (i % 2)*6, steps:'grassstep'}));
  const all = Object.values(A);
  const leaf = hero(S, 'leaf', {layer:ly, x:[[0,1300],[26,1300],[28.5,1200],[45,1200]], ypath:[[0,-300],[21.2,-300],[22.4,975]], y:975, steps:'grassstep'});
  // mischievous mushrooms march in
  all.forEach((a, i) => { a.do('wow', 4.6 + i*0.1, 1.4); a.do('look', 4.6, 14, {x:8, y:0}); });
  A.pipi.do('arms', 7.0, 3.0, {L:[70, -100], eyes:'open', mouth:'small'}); A.kuku.do('arms', 7.0, 3.0, {R:[60, -140], L:[60, -140], eyes:'squeeze', mouth:'open'});
  // arrows from the trees — bonk, bonk, bonk!
  all.forEach((a, i) => { a.do('wow', 12.2 + i*0.1, 1.2); a.do('look', 12, 10, {x:7, y:-10}); });
  // Leaf leaps down (Wind Step) and lands with a twirl
  leaf.do('pose', 21.2, 1.4, {rot:360, ai:1.2, ao:0.1}); leaf.do('pose', 22.4, 0.8, {sq:0.12, eyes:'squeeze', mouth:'open'});
  leaf.do('wave', 23.4, 2.4); leaf.do('talk', 26.4, 3.6, {gest:true});
  all.forEach((a, i) => { a.do('wow', 22.6 + i*0.1, 1.4); a.do('cheer', 31.0 + i*0.12, 2.4); a.do('happy', 34, 11, {mouth:'open'}); });
  leaf.do('shy', 31.4, 2.0); leaf.do('cheer', 34.6, 2.4); leaf.do('arms', 38, 5, {L:[90, -150], eyes:'happy', mouth:'open'});
  const MS = [0,1,2].map(i => monster(ly, 'mushroom', {col:['#F0606E', '#FFB347', '#B98AF0'][i], ph:i*0.2}));
  const MX = [1360, 1540, 1720], HITS = [12.6, 14.2, 15.8];
  S.H = hud(S);
  all.forEach(a => S.H.plate(a, {lv:3, show: u => u > 2}));
  S.H.plate(leaf, {lv:3, show: u => u > 30});
  MS.forEach((m, i) => { S.H.monPlate(m, ['Mushling', 'Mushling', 'Mushling'][i], 2); const pl = S.H.plates[S.H.plates.length - 1]; pl.o.show = u => u > 5 && u < HITS[i] + 1.4; pl.o.hp = u => 1 - sm((u - HITS[i])/0.4); });
  S.H.card(30.2, 'leaf', {d:6.2, x:100, y:150});
  S.arrows = boltFx(S.L.fx, HITS.map((t, i) => ({t:t - 0.45, d:0.45, shape:'arrow', from:() => [1900, 300], to:() => [MX[i] - 120, 860], arc:-20})));
  S.burst = burstFx(S.L.fx, HITS.map((t, i) => ({t, at:[MX[i] - 140, 860], col:'#A6E3A0'})).concat([{t:22.4, at:[1300, 970], s:0.7, col:'#FFFFFF'}]));
  S.ft = floatTxt(S.L.fx, HITS.map((t, i) => ({t:t + 0.1, at:[MX[i] - 140, 720], text:'BULLSEYE!', col:'#A6E3A0', size:40})));
  S.wind = auraFx(S.L.fx, [{t:21.0, d:1.8, at:() => [1300, 975], col:'#A6E3A0'}]);
  S.hearts = heartBursts(S.L.fx, [{t:18, x:1500, y:760, n:4}, {t:32, x:1000, y:700, n:5}]);
  [0,1,2].forEach(i => { SFXB.boing(S, 5.4 + i*0.4, 0.5); SFXB.boing(S, 6.2 + i*0.4, 0.5); });
  HITS.forEach(t => { SFXB.arrow(S, t - 0.45, 0.7); SFXB.hit(S, t, 0.5); });
  S.sfx(20.8, 'rustle', 0.06, 0.4); S.sfx(21.2, 'whoosh', 0.05, 0.3, {d:1.2, f0:400, f1:2400}); S.sfx(22.4, 'thump', 0.06, 0.3, {f:100});
  S.sfx(30.2, 'chime', 0.03, 0, {f:1568}); SFXB.levelup(S, 30.4);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    MS.forEach((m, i) => { const h = HITS[i]; const ent = sm((u - 4.6 - i*0.3)/1.6);
      const x = lerp(2100, MX[i], ent) + 600*sm((u - h - 2.4)/1.6); const back = u > 36 ? sm((u - 36 - i*0.3)/1.2) : 0;
      const hop = u < h ? 14*Math.abs(Math.sin(TAU*(u*1.4 + i*0.3))) : (u > h + 1.0 ? 40*Math.abs(Math.sin(TAU*(u - h)*1.3)) : 0);
      m.set(u, {x: u > 36 ? lerp(2100, 1450 + i*170, back) : x, y:980, s:0.8, hop: u > 36 ? 30*Math.abs(Math.sin(TAU*(u*1.2 + i/3))) : hop, hit: bump(u, h, 0.45),
        face: u > h && u < h + 1.0 ? 'dizzy' : (u > h ? 'happy' : 'mad'), flip: u > h + 2 && u < 36 ? 1 : -1, alpha: u < 4.6 ? 0 : 1}); });
    S.arrows(u); S.burst(u); S.ft(u); S.wind(u); S.hearts(u);
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC3 — THE MUSHROOM KING =================== */
const SC3 = scene(90, 135, {look: u => [K(u, [[0, 960], [6, 1200], [12, 1000], [22, 1050], [30, 1150], [36, 980], [45, 960]]), K(u, [[0, 720], [6, 640], [12, 740], [45, 740]]), K(u, [[0, 1.02], [6, 0.98], [12, 1.06], [22, 1.1], [30, 1.15], [36, 1.04], [45, 1.1]])]});
(function(){
  const S = SC3;
  S.L = locRealm(S.cam, {biome:'forest', tod:'sunset'});
  const ly = S.L.chars;
  S.amb('leaves', 0, 45, 0.5); S.amb('breeze', 0, 45, 0.5);
  const ids = ['otto', 'owli', 'leaf', 'momo', 'kuku', 'pipi'], X = [240, 390, 540, 690, 840, 1000];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:X[i], y:975 + (i % 2)*6, steps:'grassstep'}));
  const all = Object.values(A);
  const KX = 1520;
  S.king = monster(ly, 'mushroom', {col:'#E2465A'});
  S.crown = G(S.king.body, 'translate(0 -136)'); mk('path', SK({d:'M-34 0 L-40 -36 L-18 -18 L0 -44 L18 -18 L40 -36 L34 0 Z', fill:'#FFD24D'}, 4), S.crown);
  all.forEach((a, i) => { a.do('wow', 3.0 + i*0.1, 1.6); a.do('look', 3, 8, {x:8, y:-10}); });
  // the King stomps; Pipi + shield, Leaf leaps back
  A.pipi.do('arms', 9.6, 2.2, {L:[70, -100], eyes:'squeeze', mouth:'open'});
  // Leaf: Forest Arrow volley
  A.leaf.do('arms', 13.4, 2.8, {L:[110, -130], R:[40, -130], eyes:'squeeze', mouth:'open'});
  // Owli + Otto support, Momo + Kuku strike
  A.owli.do('arms', 17.4, 2.0, {R:[90, -190], eyes:'happy', mouth:'open'});
  lunge(A.momo, 19.6, 1.3, 760, {hop:50}); strike(A.momo, 19.9, {R:[110, -150], L:[100, -100]});
  lunge(A.kuku, 21.4, 1.3, 620, {hop:16}); strike(A.kuku, 21.7, {R:[120, -110]});
  // spore cloud makes everyone sneeze... Otto clears it
  all.forEach((a, i) => { a.do('face', 24.6 + i*0.1, 1.4, {eyes:'squeeze', mouth:'aah'}); a.do('hop', 25.6 + i*0.1, 0.4, {h:14}); });
  A.otto.do('arms', 27.0, 2.4, {R:[80, -190], eyes:'happy', mouth:'open'});
  // Combo finish: arrows + stars + slash + punch
  A.leaf.do('arms', 30.0, 2.4, {L:[110, -130], R:[40, -130], eyes:'squeeze', mouth:'open'}); A.owli.do('arms', 30.2, 2.0, {R:[120, -180], eyes:'squeeze', mouth:'open'});
  lunge(A.momo, 31.0, 1.2, 760, {hop:50}); strike(A.momo, 31.3); lunge(A.kuku, 31.4, 1.2, 620, {hop:16}); strike(A.kuku, 31.7, {R:[120, -110]});
  all.forEach((a, i) => { a.do('cheer', 35.6 + i*0.1, 2.4); a.do('happy', 38, 7, {mouth:'open'}); });
  A.leaf.do('dance', 40, 4, {bpm:1.1}); A.kuku.do('dance', 40, 4, {bpm:1.4});
  const BONK = 32.0;
  S.H = hud(S);
  all.forEach(a => { S.H.plate(a, {lv:3, show: u => u < 35.6}); S.H.plate(a, {lv:4, show: u => u >= 35.6}); });
  S.H.monPlate(S.king, 'Mushroom King', 6); { const pl = S.H.plates[S.H.plates.length - 1]; pl.o.show = u => u > 4 && u < BONK + 2; pl.o.hp = u => 1 - 0.2*sm((u - 15.4)/0.5) - 0.15*sm((u - 20.1)/0.3) - 0.15*sm((u - 22)/0.3) - 0.5*sm((u - BONK)/0.6); }
  S.H.quest('Royal Mushroom Trouble', [{text:'Calm the Mushroom King', done:BONK + 1}], 4.0, 44.6);
  S.H.banner(35.6, 'LEVEL UP!', 'Lv 3 → Lv 4', '#F2B33E', 3.4);
  S.shield = shieldFx(S.L.fx, [{t:9.8, d:2.0, at:() => [X[5] + 90, 985], hit:10.6, col:'#FFC2D4'}]);
  const vol = [0,1,2,3].map(k => ({t:13.9 + k*0.3, d:0.5, shape:'arrow', from:() => paw(A.leaf.c, -1), to:() => [KX - 80, 860 - k*20], arc:40}));
  const fin = [0,1,2].map(k => ({t:30.4 + k*0.25, d:0.5, shape:'arrow', from:() => paw(A.leaf.c, -1), to:() => [KX - 80, 860 - k*30], arc:30}));
  S.arrows = boltFx(S.L.fx, vol.concat(fin));
  S.stars = boltFx(S.L.fx, [{t:30.6, d:0.6, from:() => paw(A.owli.c, 1).map((v, j) => v - [0, 128][j]), to:() => [KX - 40, 800], col:'#FFE07A', arc:160}]);
  S.slash = slashFx(S.L.fx, [{t:20.0, at:[KX - 60, 860], rot:-24}, {t:31.4, at:[KX - 60, 860], rot:200}]);
  S.aura = auraFx(S.L.fx, all.map(a => ({t:17.6, d:2.2, at:() => [a.X(18), 975], col:'#8F9BFF'})));
  S.spores = Array.from({length:14}, (_, k) => { const s = mk('circle', {r:R(10, 22), fill:'#F6D7E2', opacity:0}, S.L.fx); s.ph = rnd(); return s; });
  S.heal = healFx(S.L.fx, all.map(a => ({t:27.4, d:2.0, at:() => [a.X(27), 975]})));
  S.burst = burstFx(S.L.fx, [{t:10.6, at:[X[5] + 130, 880], col:'#FFC2D4'}].concat(vol.concat(fin).map(v => ({t:v.t + v.d, at:v.to(), col:'#A6E3A0', s:0.7}))).concat([{t:20.1, at:[KX - 60, 860], col:'#C9A7FF'}, {t:22.0, at:[KX - 60, 880], col:'#FFB347', s:1.3}, {t:BONK, at:[KX - 40, 820], col:'#FFE07A', s:1.7}]));
  S.ft = floatTxt(S.L.fx, [{t:10.7, at:[X[5] + 80, 760], text:'BLOCK!', col:'#FFC2D4'}, {t:15.3, at:[KX - 60, 640], text:'FOREST ARROW!', col:'#A6E3A0', size:50}, {t:18.2, at:[560, 700], text:'ATK UP!', col:'#A8B4FF'},
    {t:25.0, at:[700, 720], text:'Ah-choo!', col:'#F6B7CC'}, {t:28.0, at:[600, 700], text:'CLEANSE!', col:'#8FE0A8'}, {t:BONK + 0.2, at:[KX - 40, 560], text:'FRIENDSHIP COMBO!', size:58}]);
  S.hearts = heartBursts(S.L.fx, [{t:34.0, x:KX, y:680, n:6}, {t:40, x:700, y:680, n:5}]);
  [7.6, 8.6, 9.8].forEach(t => S.sfx(t, 'thump', 0.07, 0.4, {f:70, d:0.4})); SFXB.shield(S, 10.6, 0.1);
  vol.concat(fin).forEach(v => { SFXB.arrow(S, v.t, -0.2); SFXB.hit(S, v.t + v.d, 0.5); });
  S.sfx(17.6, 'sparkle', 0.05, -0.5); SFXB.slash(S, 20.0, 0.4); SFXB.hit(S, 20.1, 0.4); SFXB.hit(S, 22.0, 0.4); S.sfx(23.8, 'hiss', 0.04, 0.2, {d:1.6});
  SFXB.heal(S, 27.4, -0.2); SFXB.zap(S, 30.6, -0.3); SFXB.slash(S, 31.4, 0.5); SFXB.hit(S, BONK, 0.5); SFXB.levelup(S, 35.6);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    const stomp = hopF(u, 7.4, 0.5, 40) + hopF(u, 8.4, 0.5, 40) + hopF(u, 9.6, 0.6, 60) + hopF(u, 23.4, 0.6, 50);
    const ent = sm((u - 2.0)/2.6);
    S.king.set(u, {x:lerp(2200, KX, ent), y:985, s:1.7, hop:stomp, hit: vol.concat(fin).reduce((s2, v) => s2 + 0.5*bump(u, v.t + v.d, 0.3), 0) + bump(u, 20.1, 0.4) + bump(u, 22, 0.4) + bump(u, BONK, 0.6),
      face: u > BONK && u < BONK + 2.4 ? 'dizzy' : (u > BONK ? 'happy' : 'mad')});
    S.spores.forEach((s, k) => { const v = (u - 23.8)/3.4 - s.ph*0.2; if (v <= 0 || v >= 1){ s.setAttribute('opacity', 0); return; }
      const clr = sm((u - 27.4)/0.8); s.setAttribute('cx', (lerp(KX - 100, 300 + k*60, sm(v)) + 30*Math.sin(TAU*(u + s.ph))).toFixed(1)); s.setAttribute('cy', (820 - 120*s.ph + 20*Math.sin(TAU*u*0.7 + k)).toFixed(1));
      s.setAttribute('opacity', (0.6*Math.sin(Math.PI*v)*(1 - clr)).toFixed(3)); });
    S.shield(u); S.arrows(u); S.stars(u); S.slash(u); S.aura(u); S.heal(u); S.burst(u); S.ft(u); S.hearts(u);
    FLASH.v = Math.max(FLASH.v, 0.25*bump(u, BONK, 0.4));
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC4 — CAMPFIRE UNDER THE STARS =================== */
const SC4 = scene(135, 180, {look: u => [960, K(u, [[0, 760], [30, 760], [34, 700], [45, 720]]), K(u, [[0, 1.2], [26, 1.28], [32, 1.15], [45, 1.22]])]});
(function(){
  const S = SC4;
  S.L = locCamp(S.cam, {tod:'night', fire:[960, 1010], logs:[600, 1320], tentX:1720});
  const ly = S.L.chars;
  S.amb('night', 0, 45, 1.0); S.amb('fire', 0, 45, 1.3); S.amb('lake', 0, 45, 0.4);
  const ids = ['pipi', 'momo', 'owli', 'leaf', 'kuku', 'otto'], X = [460, 610, 760, 1160, 1310, 1460];
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:X[i], y:985}));
  const all = Object.values(A);
  S.sticks = all.map((a, i) => a.item(i < 3 ? 'R' : 'L', 'stick', itStick(G(null, i < 3 ? '' : 'scale(-1 1)'))));
  all.forEach((a, i) => { const sd = i < 3 ? 'R' : 'L'; a.do('hold', 1.0, 17.0, {side:sd, item:'stick', at:[66, -96]}); a.do('look', 1, 16, {x: i < 3 ? 6 : -6, y:4}); a.do('eat', 18.4 + i*0.3, 5.0, {side:sd, item:'stick', bites:2, per:2.4, snd:'squish', rest:[66, -96]}); });
  [0, 2, 4].forEach(i => all[i].do('happy', 6 + i, 3));
  // Leaf's stories: a knight of light in a sunlit castle
  A.leaf.do('talk', 25.0, 6.0, {gest:true}); ['pipi', 'momo', 'owli', 'kuku', 'otto'].forEach((id, i) => { A[id].do('look', 25, 8, {x: X[ids.indexOf(id)] < 1160 ? 8 : -8, y:-2}); A[id].do('wow', 28.6 + i*0.2, 1.4); });
  A.owli.do('nod', 31.6, 1.6); A.pipi.do('shy', 32.0, 2.0);
  all.forEach((a, i) => { a.do('bob', 35.4, 9, {f:0.6}); a.do('face', 36 + i*0.3, 8, {eyes:'happy', mouth:'smile'}); });
  [A.pipi, A.otto].forEach((a, i) => { a.do('yawn', 40 + i*1.2, 1.8); });
  S.ff = fireflies(S.L.fx, 16, [100, 600, 1800, 950]);
  S.H = hud(S);
  S.H.card(30.0, 'lumi', {tag:'✦ NEXT TIME: THE SUNLIT CASTLE ✦', d:7.4, x:740, y:110});
  S.hearts = heartBursts(S.L.fx, [{t:21.0, x:960, y:700, n:5}, {t:38.0, x:960, y:660, n:4}]);
  S.mallows = S.sticks.map(s => s.m);
  [2, 20, 37].forEach(t => S.sfx(t, 'owl', 0.03, -0.7)); S.sfx(30.0, 'chime', 0.03, 0, {f:1568});
  S.pre = u => S.L.update(u, {fire:1});
  S.post = u => {
    S.mallows.forEach((m, i) => m.setAttribute('fill', hexMix('#FFF7EE', '#E8B06A', sm((u - 2)/14))));
    S.ff(u, 0.8); S.hearts(u);
    S.H.update(u); S.H.post(u);
  };
})();

EPISODE({day:15, title:'The Whispering Forest', music:{seed:57, key:2, bpm:78, prog:3}, thumb:66,
  chapters:[['Into the Forest', IC.leaf],
            ['Leaf the Ranger', g => clsIcon(g, 'ranger', 1)],
            ['The Mushroom King', g => { mk('path', S4({d:'M-16 4 Q-14 -16 0 -16 Q14 -16 16 4 Z', fill:'#F0606E'}), g); mk('rect', S4({x:-6, y:4, width:12, height:12, rx:4, fill:'#FFF3E0'}), g); }],
            ['Campfire Stories', IC.fire]],
  scenes:[SC1, SC2, SC3, SC4]});
