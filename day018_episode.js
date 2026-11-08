/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 18: "The Moonlit Graveyard"  (180 s)
   spooky (but cute) graveyard → Nyx the Necromancer and her ghost pets
   → the Phantom Lantern → a lantern picnic with new friends
   ===================================================================== */

/* =================== SC1 — A SPOOKY WALK =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  const gh = [0,1,2].map(i => null);
  const P = arrival(S, {loc: c => locRealm(c, {biome:'graveyard'}), party:['otto', 'owli', 'lumi', 'momo', 'tora', 'kuku', 'pipi'], lv:6, cx:720, steps:'grassstep',
    quest:'The Moonlit Graveyard', tasks:[{text:'Find the giggling ghost'}, {text:'Don’t be scared!', done:40}], amb:[['night', 1.0], ['wind', 0.4]],
    look: setLook([[0, 700, 760, 1.1], [12, 900, 740, 1.05], [24, 1000, 740, 1.12], [45, 960, 740, 1.1]]),
    acts: P => {
      const {A} = P;
      P.all.forEach((a, i) => a.do('pose', 8, 10, {tremble:0.35, mouth:'small'}));
      // ghosts pop up from the tombstones: BOO!
      P.all.forEach((a, i) => { a.do('wow', 14.2 + i*0.06, 1.4); a.do('hop', 14.2 + i*0.06, 0.4, {h:40}); });
      A.pipi.do('pose', 15.0, 6, {x: P.X[6] - 140, eyes:'squeeze', mouth:'wavy', tremble:1}); A.kuku.do('pose', 15.0, 6, {eyes:'squeeze', mouth:'wavy', tremble:0.8});
      A.tora.do('arms', 16.0, 3.0, {R:[110, -160], eyes:'squeeze', mouth:'open'}); A.lumi.do('arms', 16.0, 3.0, {L:[80, -110], eyes:'open', mouth:'small'});
      // ...but the ghosts just giggle and wave
      P.all.forEach((a, i) => { a.do('look', 22, 8, {x:8, y:-6}); a.do('face', 23 + i*0.1, 4, {eyes:'open', mouth:'small'}); });
      A.otto.do('wave', 25.6, 2.4); A.owli.do('laugh', 27.0, 2.0); A.pipi.do('shy', 28.6, 2.4);
      P.all.forEach((a, i) => { a.do('laugh', 31 + i*0.1, 2.2); a.do('cheer', 39.4 + i*0.1, 2.4); a.do('pose', 41.6, 4, {x: P.X[i] + 900, ai:3}); });
    },
    post: u => {
      S.ghosts.forEach((g, i) => { const tx = [1360, 1640, 2000][i]; const up = sm((u - 13.6 - i*0.2)/0.7); const bob = 12*Math.sin(TAU*(u*0.7 + i/3));
        g.set(u, {x: tx - 120 + 40*Math.sin(TAU*u*0.2 + i), y: 840 - 120*up + bob + (u > 36 ? -400*sm((u - 36 - i*0.3)/2) : 0), s:0.75, face: u > 21 ? 'happy' : 'mad', alpha: up*(1 - sm((u - 37.4 - i*0.3)/1.4))}); });
      S.boo(u); S.gig(u); S.trail(u, rh(u, 34, 35, 44, 45));
    }});
  S.ghosts = [0,1,2].map(i => monster(S.L.chars, 'ghost', {ph:i*0.3, col:['#EEE6FF', '#E3F6FF', '#FFE8F2'][i]}));
  S.boo = floatTxt(S.L.fx, [{t:14.0, at:[1500, 560], text:'BOO!', col:'#C9A7FF', size:80, d:1.8}]);
  S.gig = floatTxt(S.L.fx, [{t:22.0, at:[1500, 560], text:'hee hee~ ♥', col:'#FFB3C7', size:44, d:2.4}, {t:33.0, at:[1700, 520], text:'come play!', col:'#C9A7FF', size:42, d:2.6}]);
  S.trail = fireflies(S.L.fx, 10, [1300, 600, 2000, 900]);
  S.sfx(14.0, 'whoosh', 0.06, 0.5, {d:0.6, f0:300, f1:1400}); S.sfx(14.1, 'pop', 0.06, 0.5); S.sfx(22.0, 'sparkle', 0.04, 0.5); S.sfx(33, 'chime', 0.03, 0.6, {f:1318.5}); S.sfx(5, 'owl', 0.04, -0.6);
})();

/* =================== SC2 — NYX THE NECROMANCER =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locRealm(c, {biome:'graveyard'}), party:['otto', 'owli', 'lumi', 'momo', 'tora', 'pipi'], newbie:'nyx', nx:1280, lv:6, steps:'grassstep',
    amb:[['night', 1.0]], demo:{t:23, text:'SOUL SUMMON!'}, cardT:30,
    acts: (P, N) => {
      N.do('shy', 0, 6); N.do('face', 6, 3, {eyes:'open', mouth:'small'});
      // Momo and Nyx: two dark-cloaked cats, instant friends
      P.A.momo.do('pose', 16.6, 5, {x: P.X[3] + 260}); P.A.momo.do('wave', 18.0, 2.4); N.do('wave', 18.2, 2.4); P.A.momo.do('happy', 20.4, 2, {mouth:'open'}); N.do('happy', 20.4, 2, {mouth:'open'});
    },
    post: u => S.pets.forEach((g, i) => { const a = TAU*(u*0.35 + i/3); g.set(u, {x:1280 + 180*Math.cos(a), y:860 + 40*Math.sin(a), s:0.5, face:'happy', alpha:1}); })});
  S.pets = [0,1,2].map(i => monster(S.L.fx, 'ghost', {ph:i*0.3, col:['#EEE6FF', '#E3F6FF', '#FFE8F2'][i]}));
})();

/* =================== SC3 — THE PHANTOM LANTERN =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'graveyard'}), party:['otto', 'nyx', 'owli', 'lumi', 'momo', 'tora', 'pipi'], cx:600, lv:[6, 7],
    boss:{type:'ghost', col:'#CFF5E6', name:'Phantom Lantern', lv:10, s:2.4, x:1480, y:960, hat: b => { const l = G(b, 'translate(60 -40)'); mk('path', {d:'M0 -60 V-20', stroke:OL, 'stroke-width':4}, l); l.glow = mk('circle', {cx:0, cy:10, r:70, fill:'url(#glowLamp)'}, l); mk('rect', SK({x:-18, y:-20, width:36, height:50, rx:10, fill:'#FFE3A3'}, 4), l); }},
    minions:[{type:'bat', col:'#7E6AA8', x:1200, y:900, s:0.6, bonk:13.0}, {type:'bat', col:'#8E7AB8', x:1750, y:880, s:0.6, bonk:13.4}],
    quest:'The Phantom Lantern', task:'Calm the Phantom Lantern', bonk:33, amb:[['night', 1.0], ['wind', 0.3]],
    moves:[{who:'pipi', t:5.6}, {who:'owli', t:9.0}, {who:'nyx', t:12.2, text:'SOUL SUMMON!'}, {who:'lumi', t:16.0, kind:'beam', text:'HOLY LIGHT!'}, {who:'otto', t:20.6},
      {who:'tora', t:23.0, text:'RAGE CLAW!'}, {who:'momo', t:25.6, text:'SHADOW STRIKE!'}, {who:'nyx', t:28.2, kind:'buff', col:'#B98AF0', text:'SHADOW VEIL!'}],
    hurt:[{who:'momo', t:18.8, text:'-6'}], finale:'SPIRITS AT PEACE!',
    cheer: (P, B) => { P.A.nyx.do('shy', B + 6, 2.4); P.A.nyx.do('dance', B + 9, 4, {bpm:1.0}); }});
})();

/* =================== SC4 — LANTERN PICNIC =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locCamp(c, {tod:'night', fire:[960, 1010], logs:[600, 1320], tent:false}), ids:['pipi', 'owli', 'momo', 'nyx', 'tora', 'lumi', 'kuku', 'otto'], snack:'stick',
    next:'tutu', nextTag:'THE CHEERFUL TAVERN', teaserT:30, amb:[['night', 1.0], ['fire', 1.2]],
    acts: (A) => { A.nyx.do('laugh', 22, 2.4); A.kuku.do('laugh', 22.4, 2.4); A.tora.do('dance', 24, 4, {bpm:1.3});
      // a melody drifts over the hills
      Object.values(A).forEach((a, i) => a.do('bob', 27, 9, {f:0.7})); }});
  S.ghosts = [0,1,2].map(i => monster(S.L.fx, 'ghost', {ph:i*0.3, col:['#EEE6FF', '#E3F6FF', '#FFE8F2'][i]}));
  S.lanterns = Array.from({length:7}, (_, i) => { const l = lantern(S.L.fx, 0, 0, 0.8); return l; });
  S.notes = notesFx(S.L.fx, 4);
  const p0 = S.post; S.post = u => { p0(u);
    S.ghosts.forEach((g, i) => { const a = TAU*(u*0.12 + i/3); g.set(u, {x:960 + 700*Math.cos(a), y:640 + 80*Math.sin(a*2), s:0.5, face:'happy'}); });
    S.lanterns.forEach((l, i) => { const v = mod(u*0.03 + i/7, 1); T(l, `translate(${(200 + i*250 + 40*Math.sin(TAU*(u*0.1 + i))).toFixed(1)} ${(900 - 900*v).toFixed(1)}) scale(0.7)`); l.setAttribute('opacity', Math.sin(Math.PI*v).toFixed(3)); });
    S.notes(1600, 500, u, rh(u, 27, 28, 37, 38)); };
  [27.4, 29, 31].forEach((t, i) => S.sfx(t, 'chime', 0.025, 0.7, {f:[1046.5, 1318.5, 1568][i]}));
})();

EPISODE({day:18, title:'The Moonlit Graveyard', music:{seed:83, key:4, bpm:76, prog:1}, thumb:120,
  chapters:[['A Spooky Walk', g => { mk('path', S4({d:'M-14 10 Q-16 -14 0 -16 Q16 -14 14 10 L8 4 L2 10 L-4 4 L-10 10 Z', fill:'#EEE6FF'}), g); }],
            ['Nyx the Necromancer', g => clsIcon(g, 'necromancer', 1)], ['The Phantom Lantern', IC.torch], ['Lantern Picnic', IC.fire]],
  scenes:[SC1, SC2, SC3, SC4]});
