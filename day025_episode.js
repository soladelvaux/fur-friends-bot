/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 25: "The Clockwork Workshop"  (180 s)
   a ticking, whirring workshop → Gear the Engineer joins → the Runaway
   Robo-Golem → building a little airship together
   ===================================================================== */
function turret(parent){ const g = G(parent); mk('rect', SK({x:-30, y:-40, width:60, height:40, rx:10, fill:'#AEB6C6'}, 4), g); mk('circle', SK({cx:0, cy:-52, r:22, fill:'#C6CEDC'}, 4), g);
  mk('rect', SK({x:10, y:-60, width:44, height:14, rx:6, fill:'#8A93A6'}, 3.4), g); g.eye = mk('circle', {cx:-4, cy:-54, r:7, fill:'#8FE0F0'}, g); [-18, 18].forEach(x => mk('circle', S4({cx:x, cy:0, r:9, fill:'#6E7A8A'}), g)); return g; }

/* =================== SC1 — TICK, TOCK, WHIRR =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locHall(c, {kind:'workshop'}), party:['otto', 'rin', 'owli', 'momo', 'pom', 'kuku', 'pipi'], lv:13, cx:720, steps:'woodstep',
    quest:'The Clockwork Workshop', tasks:[{text:'Find the inventor'}, {text:'Don’t touch the big red button', done:30}], amb:[['clock', 0.8], ['hum', 0.5]],
    look: setLook([[0, 700, 740, 1.1], [12, 960, 700, 1.0], [24, 1300, 760, 1.25], [34, 1000, 740, 1.05], [45, 960, 740, 1.12]]),
    acts: P => {
      const {A} = P;
      P.all.forEach((a, i) => { a.do('wow', 11 + i*0.08, 1.4); a.do('look', 11, 10, {x:0, y:-10}); });
      // Kuku sees a big red button...
      A.kuku.do('pose', 20, 10, {x: 1330}); A.kuku.do('look', 22, 4, {x:6, y:4}); A.kuku.do('reach', 24.6, 1.4, {to:[1440, 900], lean:10});
      P.all.filter(a => a !== A.kuku).forEach((a, i) => { a.do('wow', 25.4 + i*0.08, 1.4); a.do('point', 25.6, 1.6, {at:[100, -120]}); });
      // ...BEEP BOOP! a tiny turret pops up and tosses Kuku a cookie (phew!)
      A.kuku.do('pose', 26.0, 2.0, {hop:50, eyes:'squeeze', mouth:'open', excl:1}); A.kuku.do('happy', 30, 4, {mouth:'open'});
      P.all.forEach((a, i) => { a.do('laugh', 30.6 + i*0.1, 2.4); a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { const up = sm((u - 26)/0.5); T(S.tur, `translate(1560 ${(1000 + 80*(1 - up)).toFixed(1)}) scale(1.2)`); S.tur.eye.setAttribute('fill', u > 26 && u < 30 && mod(u, 0.4) < 0.2 ? '#FF8A8A' : '#8FE0F0');
      S.cookieF(u); S.beep(u); }});
  S.btn = G(S.L.chars, 'translate(1440 990)'); mk('rect', SK({x:-40, y:-80, width:80, height:80, rx:10, fill:'#AEB6C6'}, 4.4), S.btn); mk('circle', SK({cx:0, cy:-80, r:24, fill:'#E5484D'}, 4), S.btn);
  S.tur = turret(S.L.chars);
  S.cookie = G(S.L.fx); mk('circle', SK({r:16, fill:'#E8B06A'}, 3.4), S.cookie); [[-5, -4], [6, 2], [-2, 7]].forEach(q => mk('circle', {cx:q[0], cy:q[1], r:3, fill:'#6E4433'}, S.cookie));
  S.cookieF = u => flyItem(S.cookie, u, 28.0, 0.8, [1560, 880], [1340, 800], 120, 360);
  S.beep = floatTxt(S.L.fx, [{t:26.0, at:[1560, 760], text:'BEEP BOOP!', col:'#8FE0F0', size:46}]);
  S.sfx(24.9, 'click', 0.06, 0.4); S.sfx(25.0, 'beep', 0.04, 0.5, {f:1800, d:0.2}); S.sfx(25.3, 'beep', 0.04, 0.5, {f:2400, d:0.2}); S.sfx(26.0, 'zipper', 0.04, 0.5, {d:0.5}); S.sfx(28.8, 'crunch', 0.05, 0.3);
})();

/* =================== SC2 — GEAR THE ENGINEER =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locHall(c, {kind:'workshop'}), party:['otto', 'rin', 'owli', 'momo', 'kuku', 'pipi'], newbie:'gear', nx:1260, lv:13,
    amb:[['clock', 0.6], ['hum', 0.4]], demo:{t:23, kind:'throw', text:'TURRET DEPLOY!'}, cardT:30,
    acts: (P, N) => { N.do('work', 0, 6.4, {kind:'knead', rate:1.6, eyes:'squeeze', look:[0, 8], snd:'knock', sndO:{f:600}, every:1});
      // Rin and Gear: the smart duo study a blueprint
      P.A.kuku.do('pose', 15.6, 5.6, {x: P.X[4] + 220}); P.A.kuku.do('wow', 17.0, 1.4); N.do('talk', 17.0, 3.0, {gest:true}); },
    post: u => { const up = sm((u - 23.6)/0.4); show(S.tur, u > 23.4); T(S.tur, `translate(1500 ${(990).toFixed(1)}) scale(${(up).toFixed(3)})`); }});
  S.tur = turret(S.L.chars);
})();

/* =================== SC3 — THE RUNAWAY ROBO-GOLEM =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'town', castleX:2600}), party:['otto', 'gear', 'rin', 'owli', 'momo', 'kuku', 'pipi'], cx:600, lv:[13, 14], steps:'step',
    boss:{type:'golem', col:'#AEB6C6', name:'Robo-Golem', lv:17, s:1.7, x:1500, hat: b => { mk('path', {d:'M0 -150 V-196', stroke:OL, 'stroke-width':6}, b); const l = mk('circle', SK({cx:0, cy:-200, r:12, fill:'#FF8A8A'}, 3.4), b); [-60, 60].forEach(x => mk('circle', S4({cx:x, cy:-40, r:14, fill:'#D9A35A'}), b)); }},
    quest:'Robo Runaway', task:'Switch off the Robo-Golem', bonk:33, stomps:[5.0, 6.0, 7.0, 17.6], amb:[['cafe', 0.4], ['hum', 0.4]],
    moves:[{who:'pipi', t:7.2}, {who:'gear', t:10.4, text:'TURRET DEPLOY!'}, {who:'rin', t:13.6, kind:'buff', text:'WEAK SPOT FOUND!'}, {who:'owli', t:16.0},
      {who:'otto', t:20.4}, {who:'momo', t:23.0}, {who:'kuku', t:25.4}, {who:'gear', t:28.0, kind:'buff', col:'#8FE0F0', text:'OVERCHARGE!'}],
    hurt:[{who:'pipi', t:18.0, text:'-8'}], finale:'SYSTEM: FRIENDLY!',
    post: (u, P) => { const up = sm((u - 10.8)/0.4); show(S.tur, u > 10.6); T(S.tur, `translate(${(P.X[1] + 120).toFixed(0)} 1000) scale(${(0.9*up).toFixed(3)})`); },
    extraSfx: S => { [5.0, 6.0, 7.0, 17.6].forEach(t => S.sfx(t + 0.25, 'knock', 0.05, 0.4, {f:300})); S.sfx(33.4, 'beep', 0.04, 0.5, {f:1200, d:0.5}); }});
  S.tur = turret(S.L.chars);
})();

/* =================== SC4 — BUILDING AN AIRSHIP =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locRealm(c, {biome:'meadow', tod:'sunset'}), ids:['owli', 'rin', 'momo', 'pipi', 'gear', 'pom', 'kuku', 'otto'], snack:'none',
    next:'mimi', nextTag:'THE ARTISAN FORGE', teaserT:31, amb:[['breeze', 0.6], ['birds', 0.4]], upd: u => ({camX:960}),
    acts: (A, all) => { all.forEach((a, i) => a.do('work', 1 + i*0.3, 12, {kind:['knead', 'pat', 'paint', 'scrub'][i % 4], rate:1.4, eyes:'happy', look:[0, -4]}));
      all.forEach((a, i) => { a.do('look', 15, 12, {x:0, y:-12}); a.do('wow', 16 + i*0.1, 1.4); a.do('cheer', 19 + i*0.1, 2.4); }); }});
  S.ship = G(S.L.fx); mk('ellipse', SK({cx:0, cy:-120, rx:220, ry:90, fill:'#FFB3C7'}, 6), S.ship); [-120, -40, 40, 120].forEach(x => mk('path', {d:`M${x} -200 Q${x*1.1} -120 ${x} -40`, fill:'none', stroke:'#FF8AA8', 'stroke-width':5}, S.ship));
  mk('path', {d:'M-120 -40 L-80 30 M120 -40 L80 30', stroke:OL, 'stroke-width':5}, S.ship); mk('path', SK({d:'M-110 30 L110 30 L90 80 L-90 80 Z', fill:'#B98552'}, 5), S.ship);
  S.ship.prop = G(S.ship, 'translate(-124 54)'); mk('path', SK({d:'M0 -30 L6 0 L0 30 L-6 0 Z', fill:'#AEB6C6'}, 3), S.ship.prop); pawPrint(S.ship, 0, -120, 2.2, '#FFFFFF');
  const p0 = S.post; S.post = u => { p0(u); const lift = sm((u - 14)/6), bob = 10*Math.sin(TAU*u*0.5);
    T(S.ship, `translate(${(960 + 900*sm((u - 36)/9)).toFixed(1)} ${(1000 - 420*lift + bob).toFixed(1)}) scale(${(0.6 + 0.4*sm((u - 2)/10)).toFixed(3)})`); T(S.ship.prop, `translate(-124 54) scale(1 ${Math.cos(TAU*u*4).toFixed(3)})`); };
  for (let t = 1.5; t < 12; t += 0.9) S.sfx(t, 'knock', 0.03, -0.4 + mod(t, 0.8), {f:500 + mod(t*100, 300)}); S.sfx(14, 'whoosh', 0.04, 0, {d:3.0, f0:200, f1:900}); S.sfx(19, 'sparkle', 0.05, 0);
})();

EPISODE({day:25, title:'The Clockwork Workshop', music:{seed:151, key:5, bpm:84, prog:2}, thumb:120,
  chapters:[['Tick, Tock, Whirr', g => clsIcon(g, 'engineer', 1)], ['Gear the Engineer', IC.train], ['The Robo-Golem', g => clsIcon(g, 'gear', 1)], ['Building an Airship', IC.kite]],
  scenes:[SC1, SC2, SC3, SC4]});
