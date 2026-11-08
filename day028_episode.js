/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 28: "The Sneaky Market"  (180 s)
   snacks keep vanishing → Snek the Rogue (and why) → the Greedy Mimic
   → a big market picnic for everyone, slimes included
   ===================================================================== */
function stall(parent, x, y, s, col){ const g = G(parent, `translate(${x} ${y}) scale(${s})`); mk('rect', SK({x:-120, y:-90, width:240, height:90, rx:8, fill:'#C98F5E'}, 5), g);
  const aw = G(g, 'translate(0 -200)'); for (let k=0;k<6;k++) mk('rect', {x:-140 + k*46.6, y:0, width:46.6, height:50, fill: k % 2 ? '#FFFFFF' : col}, aw); mk('rect', SK({x:-140, y:0, width:280, height:50, fill:'none'}, 4.4), aw);
  mk('path', {d:'M-110 -200 V-90 M110 -200 V-90', stroke:OL, 'stroke-width':6}, g); [[-70, '#FF9A5A'], [-20, '#FFE07A'], [30, '#FF8AA8'], [80, '#8ED081']].forEach(q => mk('circle', S4({cx:q[0], cy:-104, r:16, fill:q[1]}), g)); return g; }

/* =================== SC1 — THE MISSING SNACKS =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locRealm(c, {biome:'town', castleX:2600, fountainX:2600}), party:['otto', 'eli', 'pom', 'momo', 'tora', 'kuku', 'pipi'], lv:16, cx:700,
    quest:'The Sneaky Market', tasks:[{text:'Find the snack thief'}, {text:'Get the snacks back', done:40}], amb:[['cafe', 0.9], ['birds', 0.3]],
    look: setLook([[0, 700, 760, 1.1], [12, 900, 740, 1.05], [22, 1200, 760, 1.18], [30, 1400, 760, 1.25], [45, 960, 740, 1.1]]),
    acts: P => {
      const {A} = P;
      // Kuku buys an apple... and it disappears from his paw!
      A.kuku.item('R', 'apple', (() => { const g = G(); mk('circle', S4({r:16, fill:'#E5484D'}), g); mk('path', {d:'M0 -16 l4 -8', stroke:'#6E4433', 'stroke-width':4}, g); return g; })());
      A.kuku.do('hold', 12, 6, {item:'apple', at:[50, -110]}); A.kuku.do('pose', 18.2, 2.4, {eyes:'open', mouth:'open', excl:1});
      P.all.forEach((a, i) => { a.do('wow', 18.6 + i*0.08, 1.4); a.do('look', 19, 6, {x:8, y:0}); });
      // the team sneaks after a striped tail... Momo leads (she's the sneakiest)
      P.all.forEach((a, i) => a.do('pose', 26, 10, {x: P.X[i] + 360, bt:8, eyes:'open', mouth:'small', ai:2}));
      A.momo.do('pose', 26, 10, {x: P.X[3] + 560, ai:2});
      P.all.forEach((a, i) => { a.do('wow', 34 + i*0.08, 1.4); a.do('pose', 38, 7, {x: P.X[i] + 1200, ai:5}); });
    },
    post: u => { S.apple(u); }});
  [[300, 860, 0.8, '#FF9DB5'], [1560, 860, 0.85, '#9FD3F5'], [2000, 870, 0.8, '#FFE07A']].forEach(a => stall(S.L.mid, a[0], a[1], a[2], a[3]));
  S.flyA = G(S.L.fx); mk('circle', S4({r:16, fill:'#E5484D'}), S.flyA);
  S.apple = u => flyItem(S.flyA, u, 18.0, 0.7, [S.actors[5].X(18) + 50, 870], [1900, 820], 80, 360);
  S.sfx(12.2, 'coin', 0.04, 0.2); S.sfx(18.0, 'whoosh', 0.05, 0.4, {d:0.5, f0:800, f1:2400}); S.sfx(18.1, 'pop', 0.04, 0.4);
})();

/* =================== SC2 — SNEK THE ROGUE =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locRealm(c, {biome:'forest'}), party:['otto', 'eli', 'pom', 'momo', 'kuku', 'pipi'], newbie:'snek', nx:1260, lv:16, steps:'grassstep',
    amb:[['leaves', 0.5], ['birds', 0.3]], demo:{t:23, kind:'slash', text:'CLOAK & DASH!'}, cardT:30,
    acts: (P, N) => { // caught! Snek was feeding hungry little slimes
      N.do('pose', 0, 4.2, {eyes:'open', mouth:'wavy', sweat:1}); N.do('shy', 4.4, 2.4); N.do('talk', 9.0, 4.0, {gest:true});
      P.all.forEach((a, i) => a.do('pose', 9.6, 4, {mouth:'small', eyes:'open'})); P.all.forEach((a, i) => a.do('happy', 14 + i*0.1, 3, {mouth:'open'}));
      P.A.kuku.do('pose', 16, 5, {x: P.X[4] + 200}); P.A.kuku.do('wave', 17, 2.4); N.do('wave', 17.2, 2.4); },
    post: u => S.slimes.forEach((m, i) => m.set(u, {x:1500 + i*120, y:990, s:0.45, face:'happy', hop: 20*Math.abs(Math.sin(TAU*(u*1.2 + i/3)))}))});
  S.slimes = [0,1,2].map(i => monster(S.L.chars, 'slime', {col:['#8FE08A', '#FFB3C7', '#9FD3F5'][i], ph:i*0.3}));
})();

/* =================== SC3 — THE GREEDY MIMIC =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'town', tod:'sunset', castleX:2600, fountainX:2600}), party:['otto', 'snek', 'eli', 'pom', 'momo', 'kuku', 'pipi'], cx:600, lv:[16, 17],
    boss:{type:'golem', col:'#B98552', name:'Greedy Mimic', lv:20, s:1.6, x:1500, hat: b => { const l = G(b, 'translate(0 -150)'); mk('path', SK({d:'M-90 0 Q-90 -60 0 -64 Q90 -60 90 0 Z', fill:'#C98F5E'}, 5), l); mk('path', {d:'M-90 0 H90 M-40 -56 V0 M40 -56 V0', stroke:'#F2C95E', 'stroke-width':8}, l); mk('rect', SK({x:-14, y:-20, width:28, height:26, rx:5, fill:'#F2C95E'}, 3.4), l); }},
    quest:'The Greedy Mimic', task:'Get the market’s treasure back', bonk:33, stomps:[5.4, 6.4, 17.6], amb:[['cafe', 0.5]],
    moves:[{who:'pipi', t:6.6}, {who:'snek', t:9.6, text:'STEAL!'}, {who:'eli', t:12.4}, {who:'pom', t:15.2},
      {who:'otto', t:20.2}, {who:'momo', t:22.8}, {who:'kuku', t:25.2}, {who:'snek', t:28.0, text:'CLOAK & DASH!'}],
    hurt:[{who:'pom', t:18.2, text:'-8'}], finale:'TREASURE FOUND!',
    post: (u, P, boss) => { S.coins.forEach((c, i) => { const v = (u - 33.4 - i*0.08)/1.2; show(c, v > 0 && v < 1.4); if (v > 0){ const p = arcP(boss.top(), [300 + i*90, 960], Math.min(1, v), 260); T(c, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`); } }); }});
  S.coins = Array.from({length:12}, () => { const c = G(S.L.fx); mk('circle', SK({r:14, fill:'#FFD24D'}, 3), c); c.style.display = 'none'; return c; });
  for (let i=0;i<12;i++) SFXB.coin(S, 33.6 + i*0.1, -0.4 + i*0.07);
})();

/* =================== SC4 — MARKET PICNIC =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locRealm(c, {biome:'meadow', tod:'sunset'}), ids:['owli', 'eli', 'momo', 'pipi', 'snek', 'pom', 'kuku', 'otto'], snack:'cake',
    next:'zen', nextTag:'THE MOUNTAIN TEMPLE', teaserT:30, amb:[['birds', 0.4], ['breeze', 0.5]], upd: u => ({camX:960}),
    acts: (A, all) => { A.snek.do('shy', 12, 2.4); A.snek.do('laugh', 15, 2.4); A.kuku.do('dance', 16, 4, {bpm:1.4});
      // a bell rings far away on a mountain: dong... dong...
      all.forEach((a, i) => a.do('look', 28.6, 6, {x:6, y:-12})); }});
  S.slimes = [0,1,2,3].map(i => monster(S.L.chars, 'slime', {col:['#8FE08A', '#FFB3C7', '#9FD3F5', '#FFE07A'][i], ph:i*0.3}));
  S.dong = floatTxt(S.L.fx, [{t:28.4, at:[1500, 360], text:'dong...', col:'#E9B44A', size:40, d:2}, {t:30.0, at:[1560, 300], text:'dong...', col:'#E9B44A', size:34, d:2}]);
  const p0 = S.post; S.post = u => { p0(u); S.dong(u); S.slimes.forEach((m, i) => m.set(u, {x:300 + i*440 + (i > 1 ? 160 : 0), y:1040, s:0.45, face:'happy', hop: 18*Math.abs(Math.sin(TAU*(u*1.1 + i/4)))})); };
  [28.4, 30.0].forEach(t => S.sfx(t, 'bell', 0.04, 0.5, {f:392, d:2.4}));
})();

EPISODE({day:28, title:'The Sneaky Market', music:{seed:181, key:7, bpm:84, prog:0}, thumb:120,
  chapters:[['The Missing Snacks', IC.bread], ['Snek the Rogue', g => clsIcon(g, 'rogue', 1)], ['The Greedy Mimic', g => clsIcon(g, 'dagger', 1)], ['Market Picnic', IC.cupcake]],
  scenes:[SC1, SC2, SC3, SC4]});
