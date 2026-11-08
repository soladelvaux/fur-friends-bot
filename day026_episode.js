/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 26: "The Artisan Forge"  (180 s)
   flying to the forge by airship → Mimi the Artificer joins → the
   Lava Golem → gear upgrades for everyone
   ===================================================================== */
function anvil(parent, x, y){ const g = G(parent, `translate(${x} ${y})`); mk('path', SK({d:'M-70 -60 L70 -60 Q60 -30 30 -24 L30 0 L50 0 L50 14 L-50 14 L-50 0 L-30 0 L-30 -24 Q-70 -30 -90 -50 Z', fill:'#6E7A8A'}, 5), g); return g; }

/* =================== SC1 — ARRIVING AT THE FORGE =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locRealm(c, {biome:'mountain', tod:'sunset'}), party:['otto', 'gear', 'rin', 'momo', 'tora', 'kuku', 'pipi'], lv:14, cx:720, steps:'step',
    quest:'The Artisan Forge', tasks:[{text:'Land the airship', done:9}, {text:'Visit the master crafter', done:40}], amb:[['wind', 0.5], ['fire', 0.4]],
    look: setLook([[0, 900, 600, 0.95], [9, 800, 740, 1.08], [20, 960, 720, 1.05], [45, 960, 740, 1.12]]),
    acts: P => {
      const {A} = P;
      P.all.forEach((a, i) => a.do('pose', 0, 9.2, {hop:0}));
      // clang! clang! sparks fly from a little forge; a lop-eared bunny is hammering away
      P.all.forEach((a, i) => { a.do('look', 14, 14, {x:8, y:0}); a.do('wow', 15 + i*0.1, 1.4); });
      A.pipi.do('wow', 22, 1.6); A.pipi.do('happy', 23.6, 3, {mouth:'open'}); // another bunny!
      A.tora.do('arms', 26, 2.4, {R:[90, -170], eyes:'happy', mouth:'open'});
      P.all.forEach((a, i) => { a.do('cheer', 33 + i*0.1, 2.4); a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { const land = sm(u/8); show(S.ship, u < 12); T(S.ship, `translate(${(lerp(-400, 700, land)).toFixed(1)} ${(lerp(300, 820, land) + 8*Math.sin(TAU*u*0.5) - 300*sm((u - 9)/3)).toFixed(1)}) scale(0.9)`);
      S.party.forEach(a => show(a.c.root, u > 8.4)); S.spk(u); }});
  S.party = S.actors; S.H.plates.forEach(pl => pl.o.show = u => u > 9);
  S.ship = G(S.L.fx); mk('ellipse', SK({cx:0, cy:-120, rx:220, ry:90, fill:'#FFB3C7'}, 6), S.ship); mk('path', SK({d:'M-110 30 L110 30 L90 80 L-90 80 Z', fill:'#B98552'}, 5), S.ship); mk('path', {d:'M-120 -40 L-80 30 M120 -40 L80 30', stroke:OL, 'stroke-width':5}, S.ship); pawPrint(S.ship, 0, -120, 2.2, '#FFFFFF');
  S.forge = G(S.L.mid, 'translate(1560 860)'); mk('path', SK({d:'M-140 0 L-120 -180 Q0 -240 120 -180 L140 0 Z', fill:'#B07A52'}, 6), S.forge); S.fire = mk('ellipse', {cx:0, cy:-70, rx:70, ry:50, fill:'#FFB347'}, S.forge); mk('circle', {cx:0, cy:-70, r:160, fill:'url(#glowLamp)'}, S.forge);
  anvil(S.L.chars, 1400, 990);
  S.spk = sparkles(S.L.fx, [16, 17, 18, 19, 20, 21].map(t => ({t, x:1400, y:900, n:4, r:50})));
  [16, 17, 18, 19, 20, 21].forEach(t => S.sfx(t, 'clink', 0.05, 0.6, {f:2600})); S.sfx(8, 'thump', 0.05, -0.2, {f:90});
})();

/* =================== SC2 — MIMI THE ARTIFICER =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locHall(c, {kind:'workshop'}), party:['otto', 'gear', 'rin', 'momo', 'kuku', 'pipi'], newbie:'mimi', nx:1260, lv:14,
    amb:[['fire', 0.6], ['hum', 0.3]], demo:{t:23, kind:'buff', text:'RUNE INFUSE!'}, cardT:30,
    acts: (P, N) => { N.do('work', 0, 6.4, {kind:'pat', rate:1.4, eyes:'squeeze', look:[0, 8], snd:'clink', sndO:{f:2400}, every:1});
      // two bunnies: Pipi and Mimi wiggle their (very different) ears at each other
      P.A.pipi.do('pose', 15.6, 5.6, {x: P.X[5] + 200}); P.A.pipi.do('pose', 17.0, 3.0, {ear:20, eyes:'happy', mouth:'open', tilt:10}); N.do('pose', 17.0, 3.0, {ear:-20, eyes:'happy', mouth:'open', tilt:-10}); }});
  S.forge = anvil(S.L.chars, 1460, 990);
})();

/* =================== SC3 — THE LAVA GOLEM =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'mountain', tod:'sunset'}), party:['otto', 'mimi', 'gear', 'tora', 'momo', 'kuku', 'pipi'], cx:600, lv:[14, 15], steps:'step',
    boss:{type:'golem', col:'#E98A4A', name:'Lava Golem', lv:18, s:1.7, x:1500, hat: b => { [[-40, -150], [30, -160], [60, -120]].forEach(q => mk('path', SK({d:`M${q[0]} ${q[1] + 20} Q${q[0] + 12} ${q[1]} ${q[0]} ${q[1] - 24} Q${q[0] - 12} ${q[1]} ${q[0]} ${q[1] + 20} Z`, fill:'#FFD24D'}, 3), b)); }},
    quest:'Too Hot!', task:'Cool down the Lava Golem', bonk:33, stomps:[5.4, 6.4, 17.6], amb:[['fire', 0.5], ['wind', 0.3]],
    moves:[{who:'pipi', t:6.6}, {who:'mimi', t:9.8, kind:'buff', text:'CRAFT GEAR!'}, {who:'gear', t:12.6}, {who:'tora', t:15.2},
      {who:'otto', t:20.2}, {who:'momo', t:22.8}, {who:'kuku', t:25.2}, {who:'mimi', t:28.0, kind:'throw', col:'#C9A7FF', n:3, text:'RUNE HAMMER!'}],
    hurt:[{who:'tora', t:18.2, text:'-9'}], finale:'COOL & COZY!'});
})();

/* =================== SC4 — GEAR UPGRADES =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  const R = cozyEnd(S, {loc: c => locHall(c, {kind:'workshop', night:true}), ids:['owli', 'gear', 'momo', 'pipi', 'mimi', 'tora', 'kuku', 'otto'], snack:'none',
    next:'eli', nextTag:'THE ELEMENTAL SHRINE', teaserT:31, amb:[['fire', 0.6], ['clock', 0.4]], upd: u => ({}),
    acts: (A, all) => { A.mimi.do('work', 1, 14, {kind:'pat', rate:1.6, eyes:'squeeze', look:[0, 6]});
      all.filter(a => a !== A.mimi).forEach((a, i) => { a.do('arms', 4 + i*1.6, 2.2, {R:[100, -180], eyes:'happy', mouth:'open'}); a.do('wow', 4.4 + i*1.6, 1.4); });
      all.forEach((a, i) => a.do('cheer', 18 + i*0.1, 2.4)); }});
  S.glints = sparkles(S.L.fx, R.all.filter((a, i) => i !== 4).map((a, i) => ({t:4.6 + i*1.6, x:a.X(0) + 50, y:760, n:6, r:70})));
  const p0 = S.post; S.post = u => { p0(u); S.glints(u); };
  for (let i=0;i<7;i++){ S.sfx(4.6 + i*1.6, 'sparkle', 0.04, -0.6 + i*0.2); S.sfx(4.4 + i*1.6, 'clink', 0.04, 0.1, {f:2600}); } SFXB.levelup(S, 18);
})();

EPISODE({day:26, title:'The Artisan Forge', music:{seed:163, key:0, bpm:82, prog:1}, thumb:120,
  chapters:[['Arriving at the Forge', IC.kite], ['Mimi the Artificer', g => clsIcon(g, 'artificer', 1)], ['The Lava Golem', IC.fire], ['Gear Upgrades', g => clsIcon(g, 'hammer', 1)]],
  scenes:[SC1, SC2, SC3, SC4]});
