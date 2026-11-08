/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 17: "The Grand Arena"  (180 s)
   the arena tournament → Tora the Berserker joins → the champion
   golem → victory feast under the lanterns
   ===================================================================== */
function arena(parent, x, y, s){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  mk('path', SK({d:'M-520 0 L-500 -300 Q0 -380 500 -300 L520 0 Z', fill:'#E8D8C0'}, 6), g);
  for (let k=-4;k<=4;k++){ const ax = k*110; mk('path', SK({d:`M${ax - 36} -40 L${ax - 36} -150 Q${ax} -200 ${ax + 36} -150 L${ax + 36} -40 Z`, fill:'#B98552'}, 4), g); mk('path', SK({d:`M${ax - 30} -200 L${ax - 30} -250 Q${ax} -280 ${ax + 30} -250 L${ax + 30} -200 Z`, fill:'#C9A27E'}, 3.6), g); }
  mk('path', {d:'M-500 -300 Q0 -380 500 -300', fill:'none', stroke:'#C9564A', 'stroke-width':14}, g);
  g.flags = [-400, -200, 0, 200, 400].map((fx, i) => { const f = G(g, `translate(${fx} ${-330 - (fx === 0 ? 30 : 0)})`); mk('path', {d:'M0 0 V-80', stroke:OL, 'stroke-width':4}, f); f.cloth = mk('path', SK({d:'M0 -80 L50 -70 L0 -54 Z', fill:['#FF9DB5', '#FFE07A', '#C8443A', '#9FD8F7', '#A6E3A0'][i]}, 3), f); return f; });
  return g;
}

/* =================== SC1 — THE ARENA TOURNAMENT =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  const P = arrival(S, {loc: c => locRealm(c, {biome:'town', castleX:2600}), party:['otto', 'owli', 'leaf', 'lumi', 'momo', 'kuku', 'pipi'], lv:5, cx:700,
    quest:'The Grand Arena', tasks:[{text:'Enter the tournament', done:36}, {text:'Win the team round'}], amb:[['cafe', 0.6], ['birds', 0.3]],
    look: setLook([[0, 700, 760, 1.1], [10, 900, 680, 0.98], [20, 960, 680, 0.95], [30, 760, 740, 1.12], [45, 900, 740, 1.08]]),
    acts: P => {
      const {A} = P;
      A.kuku.do('cheer', 11.6, 2.4); A.kuku.do('point', 14.4, 2.0, {at:[110, -170]});
      // a sign-up board: everyone writes their name... Kuku's is HUGE
      ['otto', 'owli', 'leaf', 'lumi', 'momo', 'pipi'].forEach((id, i) => A[id].do('nod', 18 + i*0.2, 1.4));
      A.kuku.do('work', 22.0, 3.6, {kind:'write', rate:2.2, look:[4, 4]}); A.kuku.do('pose', 25.8, 1.6, {hop:20, eyes:'happy', mouth:'open'});
      ['otto', 'owli', 'leaf', 'lumi', 'momo', 'pipi'].forEach((id, i) => A[id].do('laugh', 26.2 + i*0.12, 2.0));
      // a ROAR from inside the arena!
      P.all.forEach((a, i) => { a.do('wow', 31.0 + i*0.08, 1.4); a.do('pose', 31.0, 2.2, {tremble:0.7, mouth:'open'}); });
      A.pipi.do('arms', 31.4, 2.2, {L:[70, -100], eyes:'squeeze', mouth:'open'});
      P.all.forEach((a, i) => { a.do('cheer', 36.2 + i*0.1, 2.4); a.do('pose', 39, 6, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { S.ar.flags.forEach((f, i) => T(f.cloth, `skewY(${(6*Math.sin(TAU*(u*0.6 + i*0.2))).toFixed(1)})`)); S.roar(u); S.notes(u); }});
  S.ar = arena(S.L.mid, 1500, 840, 0.9);
  S.roar = floatTxt(S.L.fx, [{t:31.0, at:[1250, 560], text:'RAAAWR! ♥', col:'#FF8A5A', size:72, d:2.4}]);
  S.notes = floatTxt(S.L.fx, [{t:25.8, at:[1000, 640], text:'KUKU!!!', col:'#FFB347', size:44}]);
  S.sfx(22.2, 'scratch', 0.03, 0.2, {d:3.4}); S.sfx(31.0, 'breath', 0.06, 0.6, {d:1.4}); S.sfx(31.0, 'thump', 0.07, 0.6, {f:60, d:0.6});
})();

/* =================== SC2 — TORA THE BERSERKER =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  const M = meetScene(S, {loc: c => locRealm(c, {biome:'shrine', tod:'day', castleX:2600}), party:['otto', 'owli', 'lumi', 'momo', 'kuku', 'pipi'], newbie:'tora', nx:1260, lv:5,
    amb:[['cafe', 0.4], ['breeze', 0.5]], demo:{t:23, text:'RAGE CLAW!'}, cardT:30,
    acts: (P, N) => {
      // Tora was the roar! She is very loud... and very friendly
      N.do('pose', 0, 6, {eyes:'squeeze', mouth:'open'}); N.do('cheer', 1.0, 2.4); N.do('cheer', 3.6, 2.4);
      // Kuku vs Tora: friendly fist bump that knocks them both back
      P.A.kuku.do('pose', 16.4, 4.2, {x: P.X[4] + 220}); P.A.kuku.do('arms', 18.0, 1.4, {R:[120, -120], eyes:'squeeze', mouth:'open'});
      N.do('arms', 18.0, 1.4, {R:[120, -120], eyes:'squeeze', mouth:'open'}); N.do('pose', 18.0, 2.0, {x:1200});
      P.A.kuku.do('pose', 19.2, 1.4, {hop:40, bt:-14}); N.do('pose', 19.2, 1.4, {hop:40, bt:14});
      P.A.kuku.do('laugh', 20.4, 2.0); N.do('laugh', 20.4, 2.0);
    },
    post: u => S.bump(u)});
  S.bump = burstFx(S.L.fx, [{t:19.1, at:[1080, 860], col:'#FFB347', s:1.4}]);
  SFXB.hit(S, 19.1, 0.3); S.sfx(19.1, 'thump', 0.07, 0.3, {f:80, d:0.4});
})();

/* =================== SC3 — THE CHAMPION =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'shrine', tod:'sunset', castleX:2600}), party:['otto', 'owli', 'lumi', 'momo', 'tora', 'kuku', 'pipi'], cx:600, lv:[5, 6],
    boss:{type:'golem', col:'#C9A27E', name:'Champion Golem', lv:9, s:1.6, x:1520, hat: b => { const h = G(b, 'translate(0 -150)'); mk('path', SK({d:'M-60 0 Q-56 -60 0 -64 Q56 -60 60 0 Z', fill:'#E0B43E'}, 5), h); mk('path', SK({d:'M0 -64 Q20 -110 50 -100 Q30 -80 10 -62 Z', fill:'#C8443A'}, 4), h); }},
    quest:'Grand Arena: Team Round', task:'Beat the Champion Golem', bonk:33, stomps:[5.8, 6.8, 14.6],
    moves:[{who:'pipi', t:6.2}, {who:'owli', t:10.0, text:'STARLIGHT!'}, {who:'tora', t:12.6, text:'RAGE CLAW!'}, {who:'lumi', t:15.4, kind:'shield', big:true, text:'DIVINE SHIELD!'},
      {who:'otto', t:20.4}, {who:'momo', t:23.0}, {who:'kuku', t:25.4}, {who:'tora', t:27.6, text:'UNSTOPPABLE!'}],
    hurt:[{who:'tora', t:18.2, text:'-8'}], finale:'TEAM VICTORY!', amb:[['cafe', 0.5], ['wind', 0.3]],
    cheer: (P, B) => { P.A.tora.do('dance', B + 6, 5, {bpm:1.5}); P.A.kuku.do('dance', B + 6, 5, {bpm:1.4}); }});
  S.amb('cafe', 30, 45, 0.6);
})();

/* =================== SC4 — VICTORY FEAST =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locRealm(c, {biome:'town', tod:'night', castleX:960}), ids:['leaf', 'owli', 'momo', 'pipi', 'tora', 'kuku', 'lumi', 'otto'], snack:'cake', festival:true,
    banner:[3.0, 'CHAMPIONS!', 'Grand Arena Trophy  ·  +120 Gold'], next:'nyx', nextTag:'THE MOONLIT GRAVEYARD', teaserT:30, amb:[['night', 0.6], ['cafe', 0.4]],
    acts: (A) => { A.tora.item('R', 'trophy', (() => { const g = G(null, 'translate(0 -30)'); mk('path', SK({d:'M-26 -40 L26 -40 Q26 0 0 6 Q-26 0 -26 -40 Z', fill:'#FFD24D'}, 4.4), g); mk('rect', SK({x:-8, y:4, width:16, height:16, fill:'#FFD24D'}, 3.4), g); mk('rect', SK({x:-20, y:18, width:40, height:12, rx:4, fill:'#B98552'}, 3.4), g); return g; })());
      A.tora.do('arms', 2.0, 6.0, {R:[60, -200], itemR:'trophy', eyes:'happy', mouth:'open'}); A.tora.do('hop', 2.4, 0.5, {h:40});
      // a cold wind... a ghostly giggle in the distance
      Object.values(A).forEach((a, i) => a.do('shiver', 27.0 + i*0.05, 2.0)); },
    upd: u => ({camX:960, dusk:0.2})});
  S.boo = floatTxt(S.L.fx, [{t:27.4, at:[1600, 400], text:'hee hee hee~', col:'#C9A7FF', size:42, d:2.6}]);
  const p0 = S.post; S.post = u => { p0(u); S.boo(u); };
  S.sfx(27.2, 'whoosh', 0.03, 0.6, {d:1.6, f0:200, f1:800}); S.sfx(27.4, 'owl', 0.03, 0.7);
})();

EPISODE({day:17, title:'The Grand Arena', music:{seed:71, key:9, bpm:84, prog:2}, thumb:120,
  chapters:[['The Arena Tournament', g => clsIcon(g, 'berserker', 1)], ['Tora the Berserker', g => clsIcon(g, 'fist', 1)],
            ['The Champion', g => clsIcon(g, 'shield', 1)], ['Victory Feast', IC.cupcake]],
  scenes:[SC1, SC2, SC3, SC4]});
