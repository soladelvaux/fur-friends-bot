/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 30: "The Grand Raid"  (180 s)
   SEASON FINALE: all 20 friends gather → Dragon Peak → the Sleepy Sky
   Dragon (who just needs a friend) → the grand celebration
   ===================================================================== */
const ALL20 = ['momo', 'pipi', 'otto', 'kuku', 'owli', 'leaf', 'lumi', 'tora', 'nyx', 'tutu', 'mori', 'niko', 'pom', 'kiri', 'rin', 'gear', 'mimi', 'eli', 'snek', 'zen'];
// two rows of ten (back row smaller and higher)
function twoRows(S, ly, ids, o){
  o = o || {}; const A = {}; const cx = o.cx || 960, sp = o.sp || 150;
  ids.forEach((id, i) => { const row = i < 10 ? 1 : 0, k = i % 10; const x = cx + (k - 4.5)*sp + (row ? 0 : sp/2);
    A[id] = hero(S, id, {layer:ly, x: o.enter ? [[0, x - o.enter], [o.enterT + k*0.12 + row*0.6, x], [99, x]] : x, y: row ? (o.y || 1000) : (o.y || 1000) - 175, s: row ? (o.s || 0.85) : (o.s || 0.85)*0.88, steps: o.steps || 'step'}); });
  // back row drawn first: move front-row roots to the end of the layer
  ids.slice(0, 10).forEach(id => ly.appendChild(A[id].c.root));
  return A;
}

/* =================== SC1 — GATHERING THE PARTY =================== */
const SC1 = scene(0, 45, {look: u => [960, K(u, [[0, 860], [20, 850], [45, 860]]), K(u, [[0, 1.02], [20, 1.0], [36, 1.08], [45, 1.1]])]});
(function(){
  const S = SC1;
  S.L = locHall(S.cam, {kind:'guild'});
  const ly = S.L.chars;
  S.amb('cafe', 0, 45, 0.8);
  const A = twoRows(S, ly, ALL20, {enter:1400, enterT:2, steps:'woodstep', y:1010});
  const all = ALL20.map(id => A[id]);
  // roll call: each friend pops a little hop when named
  all.forEach((a, i) => { a.do('hop', 9 + i*0.85, 0.45, {h:40}); a.do('happy', 9.2 + i*0.85, 1.2, {mouth:'open'}); });
  all.forEach((a, i) => { a.do('cheer', 28.4 + (i % 10)*0.06, 2.6); a.do('arms', 31.6, 5, {R:[90, -180], eyes:'happy', mouth:'open'}); });
  A.rin.do('arms', 37.4, 6, {R:[60, -120], L:[60, -120], eyes:'open', mouth:'talk'});
  all.filter(a => a !== A.rin).forEach((a, i) => { a.do('look', 37.6, 6, {x:0, y:2}); a.do('nod', 40 + (i % 10)*0.1, 1.4); });
  S.H = hud(S);
  ALL20.forEach((id, i) => S.H.plate(A[id], {lv:18, show: u => u > 9 + i*0.85 && u < 28}));
  S.H.banner(28.4, 'RAID PARTY: 20 / 20', 'Destination: Dragon Peak', '#C8443A', 4.4);
  S.H.quest('THE GRAND RAID', [{text:'Gather all 20 friends', count: ALL20.map((id, i) => 9.4 + i*0.85)}, {text:'Climb Dragon Peak'}, {text:'Face the Sky Dragon'}], 4, 44.6);
  S.spark = sparkles(S.L.fx, [{t:28.6, x:960, y:700, n:16, r:600}]);
  all.forEach((a, i) => S.sfx(9 + i*0.85, 'pop', 0.04, panOf(a.X(9 + i*0.85)))); SFXB.levelup(S, 28.4); S.sfx(37.6, 'crinkle', 0.04, 0, {d:0.8});
  S.pre = u => S.L.update(u);
  S.post = u => { S.spark(u); S.H.update(u); S.H.post(u); };
})();

/* =================== SC2 — DRAGON PEAK =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  S.dragonG = null;
  const P = arrival(S, {loc: c => locRealm(c, {biome:'mountain', tod:'sunset'}), party:['otto', 'owli', 'lumi', 'momo', 'tora', 'kuku', 'pipi'], lv:18, cx:600, steps:'step',
    quest:'THE GRAND RAID', tasks:[{text:'Gather all 20 friends', done:0}, {text:'Climb Dragon Peak', done:12}, {text:'Face the Sky Dragon'}], amb:[['wind', 0.8]],
    look: setLook([[0, 700, 760, 1.05], [12, 1000, 640, 0.9], [26, 1200, 600, 0.85], [38, 1000, 700, 0.95], [45, 960, 720, 1.0]]),
    acts: P => {
      const {A} = P;
      // the mountain rumbles... a HUGE dragon yawns awake
      P.all.forEach((a, i) => { a.do('pose', 14, 3, {tremble:0.8, mouth:'open'}); a.do('wow', 17 + i*0.08, 1.4); a.do('look', 17, 20, {x:8, y:-12}); });
      A.pipi.do('arms', 18, 3, {L:[70, -100], eyes:'squeeze', mouth:'open'});
      // the dragon sneezes: ah... ah... CHOO! everyone tumbles (gently)
      P.all.forEach((a, i) => { a.do('pose', 28.6, 2.0, {rot: -40, hop:40, eyes:'squeeze', mouth:'open', ai:0.3}); a.do('laugh', 31.2 + i*0.1, 2.0); });
      // the rest of the raid party arrives behind them
      P.all.forEach((a, i) => { a.do('cheer', 36 + i*0.1, 2.4); });
    },
    post: u => { const up = sm((u - 15)/3); S.dragon.set(u, {x:1560, y:1000 + 300*(1 - up), s:1.15, face: u < 18 ? 'dizzy' : (u > 26 && u < 29 ? 'mad' : null), hit: 0.3*bump(u, 28.6, 0.6)});
      S.zzz(u); S.choo(u); S.wind.forEach((w, i) => { const v = (u - 28.6)/1.4 - i*0.05; const on = v > 0 && v < 1; w.setAttribute('opacity', on ? (0.7*(1 - v)).toFixed(3) : 0); if (on) T(w, `translate(${(1300 - 1400*v).toFixed(1)} ${(600 + i*60).toFixed(1)})`); });
      S.back.forEach((a, i) => show(a.c.root, u > 35)); }});
  S.dragon = monster(S.L.chars, 'dragon', {}); S.L.chars.insertBefore(S.dragon.g, S.L.chars.firstChild);
  S.back = ['leaf', 'nyx', 'tutu', 'mori', 'niko', 'pom', 'kiri', 'rin', 'gear', 'mimi', 'eli', 'snek', 'zen'].map((id, i) => { const a = hero(S, id, {layer:S.L.chars, x:[[0, -400 - i*40], [35, -400 - i*40], [38 + i*0.1, 120 + i*80], [99, 120 + i*80]], y:790, s:0.66, steps:null}); S.L.chars.insertBefore(a.c.root, S.L.chars.children[1]); a.do('cheer', 39 + i*0.1, 2.4); return a; });
  S.zzz = floatTxt(S.L.fx, [{t:6, at:[1560, 300], text:'Zzz...', col:'#C9B6FF', size:48, d:3}, {t:10, at:[1600, 260], text:'Zzz...', col:'#C9B6FF', size:48, d:3}]);
  S.choo = floatTxt(S.L.fx, [{t:25.2, at:[1500, 360], text:'ah... ah...', col:'#FFB3C7', size:44, d:2.6}, {t:28.4, at:[1400, 400], text:'CHOOO!', col:'#FF8AA8', size:80, d:2}]);
  S.wind = Array.from({length:6}, () => mk('path', {d:'M0 0 Q80 -20 160 0 Q240 20 320 0', fill:'none', stroke:'#FFFFFF', 'stroke-width':10, 'stroke-linecap':'round', opacity:0}, S.L.fx));
  S.sfx(14, 'thump', 0.07, 0.5, {f:50, d:1.2}); S.sfx(15.4, 'breath', 0.06, 0.5, {d:2.0}); S.sfx(28.6, 'whoosh', 0.07, 0.3, {d:1.4, f0:200, f1:1500}); S.sfx(36, 'chime', 0.03, 0, {f:1318.5});
})();

/* =================== SC3 — THE SKY DRAGON =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  const R = bossFight(S, {loc: c => locRealm(c, {biome:'mountain', tod:'sunset'}), party:['otto', 'owli', 'lumi', 'momo', 'tora', 'kuku', 'pipi'], cx:560, lv:[18, 20], steps:'step', y:1000,
    boss:{type:'dragon', name:'Sky Dragon', lv:30, s:1.05, x:1520, y:1010},
    quest:'THE GRAND RAID', task:'Befriend the Sky Dragon', bonk:34, amb:[['wind', 0.7]], finale:'20-FRIEND COMBO!',
    moves:[{who:'pipi', t:4.8}, {who:'lumi', t:7.6, kind:'shield', big:true, text:'DIVINE SHIELD!'}, {who:'owli', t:10.6}, {who:'tora', t:13.0}, {who:'otto', t:17.4},
      {who:'momo', t:20.0}, {who:'kuku', t:22.4}, {who:'lumi', t:25.0, kind:'beam', text:'HOLY LIGHT!'}],
    hurt:[{who:'kuku', t:15.6, text:'-10'}],
    look: setLook([[0, 900, 680, 0.9], [8, 1000, 680, 0.92], [27, 1000, 660, 0.88], [34, 1150, 600, 0.95], [38, 960, 700, 0.9], [45, 960, 700, 0.95]])});
  // the other 13 friends support from the back row
  const sup = ['leaf', 'nyx', 'tutu', 'mori', 'niko', 'pom', 'kiri', 'rin', 'gear', 'mimi', 'eli', 'snek', 'zen'].map((id, i) => { const a = hero(S, id, {layer:S.L.chars, x:90 + i*76, y:800, s:0.62, steps:null}); S.L.chars.insertBefore(a.c.root, S.L.chars.firstChild); return a; });
  sup.forEach((a, i) => { a.do('arms', 27.4 + i*0.25, 2.0, {R:[110, -190], L:[70, -150], eyes:'squeeze', mouth:'open'}); a.do('hop', 27.4 + i*0.25, 0.4, {h:24}); a.do('cheer', 37.6 + i*0.05, 2.4); a.do('happy', 40, 5, {mouth:'open'}); });
  S.supBolts = boltFx(S.L.fx, sup.map((a, i) => ({t:27.6 + i*0.25, d:0.6, from:() => paw(a.c, 1).map((v, j) => v - [0, 80][j]), to:() => R.boss.mid(), col:HCOL[['leaf', 'nyx', 'tutu', 'mori', 'niko', 'pom', 'kiri', 'rin', 'gear', 'mimi', 'eli', 'snek', 'zen'][i]], arc:220})));
  S.supTxt = floatTxt(S.L.fx, [{t:27.6, at:[560, 600], text:'EVERYONE, TOGETHER!', col:'#FFE07A', size:56, d:2.4}]);
  const p0 = S.post; S.post = u => { p0(u); S.supBolts(u); S.supTxt(u); };
  sup.forEach((a, i) => SFXB.zap(S, 27.6 + i*0.25, -0.5));
})();

/* =================== SC4 — THE GRAND CELEBRATION =================== */
const SC4 = scene(135, 180, {look: u => [960, K(u, [[0, 780], [45, 820]]), K(u, [[0, 0.98], [30, 1.02], [45, 1.08]])]});
(function(){
  const S = SC4;
  S.L = locRealm(S.cam, {biome:'town', tod:'night', castleX:960});
  const ly = S.L.chars;
  S.amb('cafe', 0, 45, 0.6); S.amb('night', 0, 45, 0.5);
  S.dragon = monster(ly, 'dragon', {col:'#B8E6CC'});
  const A = twoRows(S, ly, ALL20, {y:1020});
  const all = ALL20.map(id => A[id]);
  all.forEach((a, i) => a.do('dance', 2 + (i % 10)*0.15, 22, {bpm:[1.0, 1.2, 0.9, 1.3, 1.1][i % 5]}));
  all.forEach((a, i) => { a.do('cheer', 25 + (i % 10)*0.06, 2.6); a.do('wave', 33 + (i % 10)*0.08, 6); a.do('happy', 39.4, 6, {mouth:'open'}); });
  S.H = hud(S);
  S.H.banner(4.0, 'QUEST CLEAR!', 'The Grand Raid  ·  +1000 Gold', '#7DC77A', 4.0);
  S.H.banner(25.0, 'SEASON 1 COMPLETE!', 'Thank you for adventuring with us ♥', '#B79BE8', 7.5);
  S.fw = burstFx(S.L.fx, Array.from({length:16}, (_, i) => ({t:6 + i*1.2, at:[200 + (i*337) % 1520, 120 + (i % 3)*70], col:['#FFE07A', '#FF9DB5', '#9FD8F7', '#C9A7FF', '#A6E3A0'][i % 5], s:1.6})));
  S.hearts = heartBursts(S.L.fx, [{t:10, x:960, y:600, n:8}, {t:27, x:960, y:560, n:10}, {t:38, x:960, y:600, n:8}]);
  SFXB.levelup(S, 4.0); SFXB.levelup(S, 25.0); for (let i=0;i<16;i++){ S.sfx(6 + i*1.2, 'pop', 0.05, -0.6 + (i % 5)*0.3); S.sfx(6.1 + i*1.2, 'sparkle', 0.03, -0.6 + (i % 5)*0.3); }
  S.pre = u => S.L.update(u, {camX:960});
  S.post = u => { S.dragon.set(u, {x:960, y:830, s:0.7, face:'happy', hop: 20*Math.abs(Math.sin(TAU*u*0.6))}); S.fw(u); S.hearts(u); S.H.update(u); S.H.post(u); };
})();

EPISODE({day:30, title:'The Grand Raid', music:{seed:201, key:0, bpm:86, prog:2}, thumb:122,
  chapters:[['Gathering the Party', g => clsIcon(g, 'paladin', 1)], ['Dragon Peak', g => { mk('path', S4({d:'M-18 14 L0 -16 L18 14 Z', fill:'#B7B0A4'}), g); }],
            ['The Sky Dragon', g => { mk('ellipse', S4({rx:16, ry:13, fill:'#9FD9B8'}), g); mk('circle', {cx:-5, cy:-2, r:2.4, fill:OL}, g); mk('circle', {cx:5, cy:-2, r:2.4, fill:OL}, g); }],
            ['The Grand Celebration', IC.cupcake]],
  scenes:[SC1, SC2, SC3, SC4]});
