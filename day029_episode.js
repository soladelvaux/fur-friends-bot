/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 29: "The Mountain Temple"  (180 s)
   the long climb → Zen the Monk joins → the Temple Trial vs the Stone
   Guardian → sunrise meditation before the Grand Raid
   ===================================================================== */

/* =================== SC1 — THE LONG CLIMB =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locRealm(c, {biome:'mountain'}), party:['otto', 'snek', 'eli', 'momo', 'tora', 'kuku', 'pipi'], lv:17, cx:640, steps:'step',
    quest:'The Mountain Temple', tasks:[{text:'Climb the 1000 steps', done:30}, {text:'Meet the temple master', done:40}], amb:[['wind', 0.7], ['birds', 0.3]],
    look: setLook([[0, 700, 760, 1.1], [12, 900, 700, 1.0], [30, 960, 640, 0.95], [45, 960, 740, 1.1]]),
    acts: P => {
      const {A} = P;
      P.all.forEach((a, i) => { a.do('look', 10, 6, {x:4, y:-12}); a.do('pose', 16, 12, {sweat:1, mouth:'wavy', tremble:0.2}); });
      A.pipi.do('pose', 20, 4, {tilt:16, eyes:'sleep'}); A.tora.do('cheer', 22, 2.4); A.kuku.do('pose', 24, 4, {hop:0, eyes:'squeeze', mouth:'aah'});
      // a gong: DONG! a panda in a headband waves from the top
      P.all.forEach((a, i) => { a.do('wow', 30 + i*0.08, 1.4); a.do('cheer', 33 + i*0.1, 2.4); a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { S.dong(u); }});
  S.dong = floatTxt(S.L.fx, [{t:30.0, at:[960, 300], text:'DONG!', col:'#E9B44A', size:70, d:2.2}]);
  S.sfx(30.0, 'bell', 0.06, 0, {f:196, d:3.0}); S.sfx(30.0, 'thump', 0.05, 0, {f:60, d:0.8});
})();

/* =================== SC2 — ZEN THE MONK =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locHall(c, {kind:'temple'}), party:['otto', 'snek', 'eli', 'momo', 'kuku', 'pipi'], newbie:'zen', nx:1260, lv:17,
    amb:[['wind', 0.3], ['room', 0.5]], demo:{t:23, kind:'punch', text:'QI STRIKE!'}, cardT:30,
    acts: (P, N) => { // Zen is meditating, floating a little above the floor
      N.do('pose', 0, 7.0, {eyes:'sleep', mouth:'small', hop:30, L:null, R:null});
      // breathing lesson: in... out...
      P.all.forEach((a, i) => { a.do('stretch', 15.4, 2.4); a.do('pose', 18.0, 2.6, {eyes:'sleep', mouth:'small', hy:6}); }); N.do('stretch', 15.4, 2.4); N.do('pose', 18, 2.6, {eyes:'sleep', mouth:'small'});
      P.A.kuku.do('pose', 18.4, 2.0, {tremble:0.8, eyes:'squeeze', mouth:'wavy'}); P.A.kuku.do('laugh', 20.6, 1.6); },
    post: u => S.aura(u)});
  S.aura = auraFx(S.L.fx, [{t:0.4, d:6.4, at:[1260, 985], col:'#FFD27A'}]);
})();

/* =================== SC3 — THE TEMPLE TRIAL =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'mountain', tod:'sunset'}), party:['otto', 'zen', 'snek', 'eli', 'momo', 'kuku', 'pipi'], cx:600, lv:[17, 18], steps:'step',
    boss:{type:'golem', col:'#B7B0A4', name:'Stone Guardian', lv:22, s:1.8, x:1500, hat: b => { const r = G(b, 'translate(0 -150)'); mk('path', SK({d:'M-80 0 Q-60 -30 -50 -50 L50 -50 Q60 -30 80 0 Q0 10 -80 0 Z', fill:'#C9564A'}, 5), r); }},
    quest:'The Temple Trial', task:'Pass the Stone Guardian’s test', bonk:33, stomps:[5.4, 6.4, 17.6], amb:[['wind', 0.6]],
    moves:[{who:'pipi', t:6.6}, {who:'zen', t:9.6, kind:'buff', col:'#FFD27A', text:'INNER FOCUS!'}, {who:'eli', t:12.4}, {who:'snek', t:15.2},
      {who:'otto', t:20.2}, {who:'momo', t:22.8}, {who:'kuku', t:25.2}, {who:'zen', t:28.0, text:'QI STRIKE!'}],
    hurt:[{who:'snek', t:18.2, text:'-9'}], finale:'TRIAL PASSED!'});
})();

/* =================== SC4 — SUNRISE MEDITATION =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locRealm(c, {biome:'mountain', tod:'sunset'}), ids:['owli', 'eli', 'momo', 'pipi', 'zen', 'snek', 'kuku', 'otto'], snack:'none', teaserT:31,
    amb:[['wind', 0.4], ['birds', 0.5]], upd: u => ({camX:960, dusk:0.6*(1 - sm(u/20))}),
    acts: (A, all) => { all.forEach((a, i) => a.do('pose', 2, 24, {eyes:'sleep', mouth:'small', hy:4, ai:2}));
      A.kuku.do('pose', 10, 1.6, {eyes:'open', lookX:6, mouth:'small'}); A.kuku.do('pose', 11.6, 1.2, {eyes:'squeeze'});
      all.forEach((a, i) => { a.do('wow', 26 + i*0.1, 1.4); a.do('cheer', 27.6 + i*0.1, 2.4); }); }});
  S.H.banner(31.4, 'NEXT TIME: THE GRAND RAID!', 'All 20 friends · Dragon Peak', '#C8443A', 7.0);
  S.aura = auraFx(S.L.fx, S.actors.map(a => ({t:3, d:22, at:() => [a.X(3), 985], col:'#FFD27A', s:0.8})));
  S.sun = G(null); S.L.back.insertBefore(S.sun, S.L.clouds[0]); mk('circle', {r:300, fill:'url(#glowW)'}, S.sun); mk('circle', {r:70, fill:'#FFD08A'}, S.sun);
  const p0 = S.post; S.post = u => { p0(u); S.aura(u); T(S.sun, `translate(1500 ${(700 - 400*sm(u/24)).toFixed(1)})`); };
  S.sfx(26, 'sparkle', 0.05, 0); S.sfx(31.4, 'levelup', 0.06, 0);
})();

EPISODE({day:29, title:'The Mountain Temple', music:{seed:191, key:5, bpm:72, prog:1}, thumb:120,
  chapters:[['The Long Climb', g => clsIcon(g, 'monk', 1)], ['Zen the Monk', g => wBeads(g)], ['The Temple Trial', g => clsIcon(g, 'shield', 1)], ['Sunrise Meditation', ICONS.sun]],
  scenes:[SC1, SC2, SC3, SC4]});
