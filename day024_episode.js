/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 24: "The Great Library"  (180 s)
   books flying everywhere → Rin the Scholar joins → the Bookworm
   Golem → a quiet reading night (and a map to the Grand Raid!)
   ===================================================================== */

/* =================== SC1 — FLYING BOOKS =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locHall(c, {kind:'library'}), party:['otto', 'kiri', 'owli', 'momo', 'pom', 'kuku', 'pipi'], lv:12, cx:720, steps:'woodstep',
    quest:'The Great Library', tasks:[{text:'Catch the runaway books', count:[16, 19, 22]}, {text:'Find the librarian', done:40}], amb:[['room', 0.7], ['clock', 0.5]],
    look: setLook([[0, 700, 740, 1.1], [12, 960, 700, 1.0], [30, 960, 720, 1.05], [45, 960, 740, 1.12]]),
    acts: P => {
      const {A} = P;
      P.all.forEach((a, i) => { a.do('wow', 11 + i*0.08, 1.4); a.do('look', 11, 14, {x:0, y:-10}); });
      A.kuku.do('arms', 15.0, 1.6, {R:[60, -200], L:[60, -200], eyes:'squeeze', mouth:'open'}); A.kuku.do('hop', 15.0, 0.5, {h:60});
      A.momo.do('arms', 18.0, 1.6, {R:[60, -200], eyes:'squeeze', mouth:'open'}); A.momo.do('hop', 18.0, 0.5, {h:80});
      A.owli.do('arms', 21.0, 1.6, {R:[100, -190], eyes:'happy', mouth:'open'});
      // a tiny mouse in glasses peeks over a stack of books: "Shhh!"
      P.all.forEach((a, i) => { a.do('look', 28, 12, {x:8, y:-2}); a.do('pose', 30, 3, {mouth:'small', eyes:'squeeze'}); a.do('nod', 33 + i*0.1, 1.4); a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { S.books.forEach((b, k) => { const caught = [16, 19, 22][k]; const catcher = [1230, 900, 590][k];
        let p = [960 + 500*Math.cos(TAU*(u*0.15 + k/3)), 360 + 140*Math.sin(TAU*(u*0.21 + k/3))];
        if (u > caught - 1) p = arcP(p, [catcher, 760], Math.min(1, u - caught + 1), 80);
        show(b, u < caught + 0.4); T(b, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${(20*Math.sin(TAU*u*1.5 + k)).toFixed(1)}) scale(1.4)`); });
      S.shh(u); S.rin(u); }});
  S.books = [0,1,2].map(k => { const b = G(S.L.fx); mk('rect', SK({x:-26, y:-20, width:52, height:40, rx:5, fill:BOOKC[k + 3]}, 3.6), b); mk('path', {d:'M0 -20 V20', stroke:OL, 'stroke-width':3}, b); b.wl = mk('path', S4({d:'M-26 -10 Q-50 -30 -60 -6 Q-44 -4 -26 6 Z', fill:'#FFFFFF'}), b); return b; });
  S.stack = G(S.L.chars, 'translate(1640 990)'); [0,1,2,3].forEach(k => mk('rect', SK({x:-60 + k*4, y:-36 - k*34, width:120, height:32, rx:5, fill:BOOKC[k]}, 3.6), S.stack));
  S.rinG = G(S.L.chars); { const pc = G(S.rinG, 'scale(0.75)'); const m = makeChar('mouse', pc); pose(m, {eyes:'open', mouth:'small', still:true, feet:false}); glasses(m); capScholar(m); }
  S.rin = u => { const a = rh(u, 28.4, 29, 44, 45); T(S.rinG, `translate(1640 ${(870 - 60*a).toFixed(1)})`); show(S.rinG, a > 0.01); };
  S.shh = floatTxt(S.L.fx, [{t:29.4, at:[1640, 560], text:'Shhh!', col:'#F2C95E', size:52, d:2.4}]);
  [15.4, 18.4, 21.4].forEach(t => S.sfx(t, 'flap', 0.05, 0, {d:0.5})); [16, 19, 22].forEach(t => S.sfx(t, 'page', 0.05, 0)); S.sfx(29.4, 'breath', 0.04, 0.6, {d:0.8});
})();

/* =================== SC2 — RIN THE SCHOLAR =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locHall(c, {kind:'library'}), party:['otto', 'kiri', 'owli', 'momo', 'kuku', 'pipi'], newbie:'rin', nx:1260, lv:12,
    amb:[['room', 0.7], ['clock', 0.4]], demo:{t:23, kind:'buff', text:'STRATEGIC INSIGHT!'}, cardT:30, target:'dummy',
    acts: (P, N) => {
      N.do('hold', 0, 6, {item:'wpn', at:[20, -96]}); N.do('look', 0, 6, {x:0, y:7});
      // Owli and Rin: two bookworms, instantly chatting about stars and spells
      P.A.owli.do('pose', 15.6, 5.6, {x: P.X[2] + 600}); P.A.owli.do('talk', 17.0, 3.0, {gest:true}); N.do('talk', 17.4, 3.0, {gest:true});
      P.all.filter(a => a !== P.A.owli).forEach((a, i) => a.do('pose', 17, 3.4, {eyes:'sleep', tilt:6}));
      P.all.filter(a => a !== P.A.owli).forEach((a, i) => a.do('laugh', 20.4 + i*0.1, 1.8));
    }});
})();

/* =================== SC3 — THE BOOKWORM GOLEM =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locHall(c, {kind:'library'}), party:['otto', 'rin', 'owli', 'kiri', 'momo', 'kuku', 'pipi'], cx:600, lv:[12, 13], steps:'woodstep',
    boss:{type:'golem', col:'#F2E3CF', name:'Bookworm Golem', lv:16, s:1.7, x:1500, hat: b => { [0,1,2].forEach(k => mk('rect', SK({x:-50 + k*6, y:-180 - k*28, width:100, height:26, rx:4, fill:BOOKC[k + 1]}, 3.6), b)); }},
    quest:'Library Rescue', task:'Calm the Bookworm Golem', bonk:33, stomps:[5.6, 6.6, 17.6], amb:[['room', 0.6]],
    moves:[{who:'pipi', t:6.8}, {who:'rin', t:10.0, kind:'buff', text:'ANALYZE: WEAK SPOT!'}, {who:'owli', t:13.0}, {who:'kiri', t:15.4},
      {who:'otto', t:20.2}, {who:'momo', t:22.8}, {who:'kuku', t:25.2}, {who:'rin', t:28.0, kind:'bolt', col:'#F2C95E', text:'TOME MASTERY!'}],
    hurt:[{who:'kuku', t:18.2, text:'-8'}], finale:'BOOKS ARE HOME!'});
})();

/* =================== SC4 — A QUIET READING NIGHT =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locHall(c, {kind:'library', night:true}), ids:['owli', 'kiri', 'momo', 'pipi', 'rin', 'pom', 'kuku', 'otto'], snack:'mug',
    next:'gear', nextTag:'THE CLOCKWORK WORKSHOP', teaserT:31, amb:[['room', 0.6], ['clock', 0.5]], upd: u => ({}),
    acts: (A, all) => { // Rin unrolls an old map: a dragon's mountain, marked "GRAND RAID"
      A.rin.do('arms', 12, 12, {R:[60, -120], L:[60, -120], eyes:'open', mouth:'talk'});
      all.filter(a => a !== A.rin).forEach((a, i) => { a.do('look', 12.4, 12, {x: a.X(0) < 960 ? 8 : -8, y:2}); a.do('wow', 17 + i*0.15, 1.4); });
      A.kuku.do('arms', 21, 2.4, {R:[90, -180], L:[90, -180], eyes:'squeeze', mouth:'open'}); A.pom.do('shiver', 21.4, 1.6); }});
  S.map = G(S.L.fx); mk('rect', SK({x:-150, y:-90, width:300, height:180, rx:10, fill:'#F2E3CF'}, 4.6), S.map);
  mk('path', SK({d:'M-100 50 L-40 -40 L0 10 L50 -60 L110 50 Z', fill:'#C9B394'}, 3.4), S.map); mk('path', {d:'M-110 70 Q-40 30 20 60 Q70 80 110 40', fill:'none', stroke:'#C8443A', 'stroke-width':4, 'stroke-dasharray':'8 8'}, S.map);
  mk('path', {d:'M44 -76 L56 -64 M56 -76 L44 -64', stroke:'#C8443A', 'stroke-width':6, 'stroke-linecap':'round'}, S.map);
  { const t = txt(S.map, 0, -56, 'GRAND RAID', 22, '#C8443A'); t.setAttribute('font-weight', 800); }
  const p0 = S.post; S.post = u => { p0(u); const a = rh(u, 12.6, 13.6, 25, 26); show(S.map, a > 0.01); S.map.setAttribute('opacity', a.toFixed(3)); T(S.map, `translate(960 ${(560 + 20*(1 - a)).toFixed(1)}) scale(${(0.8 + 0.4*a).toFixed(3)})`); };
  S.sfx(12.6, 'crinkle', 0.05, 0, {d:0.8}); S.sfx(17, 'chime', 0.03, 0, {f:784});
})();

EPISODE({day:24, title:'The Great Library', music:{seed:141, key:3, bpm:74, prog:1}, thumb:120,
  chapters:[['Flying Books', IC.book], ['Rin the Scholar', g => clsIcon(g, 'scholar', 1)], ['The Bookworm Golem', g => clsIcon(g, 'book', 1)], ['A Quiet Reading Night', IC.tea]],
  scenes:[SC1, SC2, SC3, SC4]});
