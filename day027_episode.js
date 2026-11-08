/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 27: "The Elemental Shrine"  (180 s)
   the shrine's crystals went dark → Eli the Elementalist joins → the
   Elemental Spirit → shrine lights in the night sky
   ===================================================================== */

/* =================== SC1 — THE SILENT SHRINE =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locRealm(c, {biome:'shrine', castleX:2600}), party:['otto', 'mimi', 'gear', 'momo', 'owli', 'kuku', 'pipi'], lv:15, cx:620,
    quest:'The Elemental Shrine', tasks:[{text:'Inspect the dark crystals', done:20}, {text:'Find the elementalist', done:40}], amb:[['wind', 0.5], ['breeze', 0.4]],
    look: setLook([[0, 700, 760, 1.1], [12, 960, 680, 0.98], [26, 1200, 740, 1.15], [45, 960, 740, 1.1]]),
    acts: P => {
      const {A} = P;
      A.owli.do('think', 13, 3.0); A.gear.do('point', 14, 2.0, {at:[110, -180]});
      // a shiba with two glowing orbs juggles them: fire, water, fire, water...
      P.all.forEach((a, i) => { a.do('look', 24, 14, {x:8, y:-2}); a.do('wow', 25 + i*0.1, 1.4); });
      A.kuku.do('cheer', 30, 2.4); A.pipi.do('clap', 30.4, 3.0);
      P.all.forEach((a, i) => a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}));
    },
    post: u => { const on = u > 25; S.eli.forEach((o, k) => { const a = TAU*(u*0.9 + k/2); T(o, `translate(${(1500 + 70*Math.cos(a)).toFixed(1)} ${(800 + 60*Math.sin(a)).toFixed(1)})`); show(o, on); });
      [S.L.orb0, S.L.orb1].forEach(c => c && c.glow.setAttribute('opacity', 0.05)); show(S.eliG, on); }});
  S.eliG = G(S.L.chars, 'translate(1500 990)'); { const m = makeChar('shiba', S.eliG); pose(m, {eyes:'happy', mouth:'open', still:true}); cape(m, '#3F8AD9', '#FF8A5A'); robe(m, '#FFF6EA', '#3F8AD9', {gem:'#FF8A5A'}); }
  S.eli = ['#FF9A5A', '#8FD0FF'].map(c => { const o = G(S.L.fx); mk('circle', {r:50, fill:'url(#glowW)'}, o); mk('circle', SK({r:18, fill:c}, 3.6), o); return o; });
  S.sfx(25, 'sparkle', 0.05, 0.6);
})();

/* =================== SC2 — ELI THE ELEMENTALIST =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locRealm(c, {biome:'shrine', castleX:2600}), party:['otto', 'mimi', 'gear', 'momo', 'kuku', 'pipi'], newbie:'eli', nx:1260, lv:15, steps:'grassstep',
    amb:[['breeze', 0.5]], demo:{t:23, kind:'bolt', text:'FLAME BURST!'}, cardT:30,
    acts: (P, N) => { N.do('cheer', 0.6, 2.4); N.do('dance', 3.0, 3.4, {bpm:1.4});
      // Eli lights both shrine crystals: fire left, water right
      N.do('arms', 16.0, 2.4, {R:[100, -200], L:[100, -200], eyes:'squeeze', mouth:'open'}); P.all.forEach((a, i) => a.do('wow', 17.4 + i*0.1, 1.4)); },
    post: u => { const g = sm((u - 16.6)/1.2); [S.L.orb0, S.L.orb1].forEach(c => c && c.glow.setAttribute('opacity', (0.05 + 0.9*g).toFixed(3))); }});
  S.sfx(16.6, 'zap', 0.05, -0.3); S.sfx(16.9, 'zap', 0.05, 0.3); S.sfx(17.2, 'sparkle', 0.05, 0);
})();

/* =================== SC3 — THE ELEMENTAL SPIRIT =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'shrine', tod:'sunset', castleX:2600}), party:['otto', 'eli', 'mimi', 'gear', 'momo', 'kuku', 'pipi'], cx:600, lv:[15, 16], steps:'grassstep',
    boss:{type:'ghost', col:'#FFD7B8', name:'Elemental Spirit', lv:19, s:2.4, x:1500, y:950, hat: b => { [['#FF9A5A', -50], ['#8FD0FF', 50]].forEach(q => { mk('circle', {cx:q[1], cy:-130, r:40, fill:'url(#glowW)'}, b); mk('circle', SK({cx:q[1], cy:-130, r:14, fill:q[0]}, 3), b); }); }},
    quest:'Elemental Balance', task:'Calm the Elemental Spirit', bonk:33, amb:[['wind', 0.6]],
    moves:[{who:'pipi', t:5.6}, {who:'eli', t:9.0, text:'FLAME BURST!'}, {who:'gear', t:12.4}, {who:'mimi', t:15.4, kind:'buff'},
      {who:'otto', t:20.4}, {who:'momo', t:23.0}, {who:'kuku', t:25.4}, {who:'eli', t:28.0, col:'#8FD0FF', n:3, text:'GALE SWEEP!'}],
    hurt:[{who:'gear', t:18.2, text:'-8'}], finale:'PERFECT BALANCE!'});
})();

/* =================== SC4 — SHRINE LIGHTS =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locRealm(c, {biome:'shrine', tod:'night', castleX:2600}), ids:['owli', 'gear', 'momo', 'pipi', 'eli', 'mimi', 'kuku', 'otto'], snack:'mug',
    next:'snek', nextTag:'THE SNEAKY MARKET', teaserT:30, amb:[['night', 1.0]], upd: u => ({camX:960, sparkles:1.2}),
    acts: (A, all) => { A.eli.do('arms', 9, 3, {R:[100, -200], L:[100, -200], eyes:'happy', mouth:'open'}); all.forEach((a, i) => { a.do('look', 9.4, 10, {x:0, y:-12}); a.do('wow', 10 + i*0.1, 1.4); });
      // someone's cupcake vanishes... a striped tail disappears behind a bush!
      A.kuku.do('pose', 27, 3, {eyes:'open', mouth:'open', excl:1}); A.kuku.do('look', 27, 4, {x:-8, y:4}); all.forEach((a, i) => a.do('look', 28, 4, {x:-8, y:0})); }});
  S.fw = burstFx(S.L.fx, [10, 10.8, 11.6, 12.4, 13.2, 14, 15].map((t, i) => ({t, at:[400 + i*190, 220 + (i % 2)*80], col: i % 2 ? '#8FD0FF' : '#FF9A5A', s:1.4})));
  S.tail = G(S.L.fx); mk('path', {d:'M0 0 C -40 -10 -70 -40 -60 -80', fill:'none', stroke:OL, 'stroke-width':34, 'stroke-linecap':'round'}, S.tail); mk('path', {d:'M0 0 C -40 -10 -70 -40 -60 -80', fill:'none', stroke:'#A6A2AD', 'stroke-width':25, 'stroke-linecap':'round'}, S.tail); mk('path', {d:'M0 0 C -40 -10 -70 -40 -60 -80', fill:'none', stroke:'#4E4A57', 'stroke-width':25, 'stroke-dasharray':'11 17'}, S.tail);
  S.bush = flowerBush(S.L.fx, 200, 1120, 1.2, 99);
  const p0 = S.post; S.post = u => { p0(u); S.fw(u); [S.L.orb0, S.L.orb1].forEach(c => c && c.glow.setAttribute('opacity', 0.9)); const tv = rh(u, 27.2, 27.6, 28.4, 28.8); T(S.tail, `translate(${(280 - 120*sm((u - 27.6)/0.8)).toFixed(1)} 1060)`); S.tail.setAttribute('opacity', tv.toFixed(3)); };
  [10, 10.8, 11.6, 12.4, 13.2, 14, 15].forEach((t, i) => { S.sfx(t, 'pop', 0.05, -0.5 + i*0.15); S.sfx(t + 0.1, 'sparkle', 0.03, -0.5 + i*0.15); }); S.sfx(27.4, 'rustle', 0.06, -0.7);
})();

EPISODE({day:27, title:'The Elemental Shrine', music:{seed:171, key:2, bpm:80, prog:3}, thumb:120,
  chapters:[['The Silent Shrine', g => crystal(g, 0, 14, 0.24, '#FF9A5A')], ['Eli the Elementalist', g => clsIcon(g, 'elementalist', 1)], ['The Elemental Spirit', IC.fire], ['Shrine Lights', g => clsIcon(g, 'orb', 1)]],
  scenes:[SC1, SC2, SC3, SC4]});
