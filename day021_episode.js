/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 21: "The Crystal Cave"  (180 s)
   into the glittering cave → Niko the Enchanter joins → the Crystal
   Golem → a sparkly night by the cave mouth
   ===================================================================== */
function locCave(parent, o){
  o = o || {};
  const L = {}; const g = G(parent); L.back = g;
  skyRect(g, 'cvSky', [[0, '#2E2650'], [0.6, '#3E3468'], [1, '#4E4280']]);
  const r = rngMaker(21);
  // far rock wall with stalactites
  let d = 'M-400 -100'; for (let x=-400; x<2400; x+=120) d += ` L${x + 60} ${80 + r()*160} L${x + 120} ${-20 + r()*40}`; d += ' L2400 -400 L-400 -400 Z';
  mk('path', {d, fill:'#2A2244'}, g);
  L.far = G(g);
  let d2 = 'M-400 780'; for (let x=-400; x<2400; x+=200) d2 += ` Q${x + 100} ${640 + r()*80} ${x + 200} ${760 + r()*30}`; d2 += ' L2400 1500 L-400 1500 Z';
  mk('path', {d:d2, fill:'#4A3E78'}, L.far);
  L.crys = [];
  [[200, 760, 1.0, '#B9D8FF'], [520, 720, 0.7, '#C9A7FF'], [1380, 730, 0.8, '#FFB3E0'], [1760, 760, 1.1, '#B9D8FF'], [-80, 780, 0.9, '#C9A7FF'], [2100, 790, 0.9, '#FFB3E0']].forEach(a => L.crys.push(crystal(L.far, a[0], a[1], a[2], a[3])));
  L.mid = G(g);
  mk('path', SK({d:'M-500 840 Q400 810 960 826 Q1600 846 2420 820 L2420 1500 L-500 1500 Z', fill:'#5E5290'}, 5), L.mid);
  for (let i=0;i<30;i++) mk('ellipse', {cx:-400 + r()*2700, cy:880 + r()*300, rx:20 + r()*40, ry:8 + r()*10, fill:'#6E62A0', opacity:0.7}, L.mid);
  [[720, 880, 0.45, '#B9D8FF'], [1240, 890, 0.4, '#FFB3E0'], [60, 900, 0.5, '#C9A7FF']].forEach(a => L.crys.push(crystal(L.mid, a[0], a[1], a[2], a[3])));
  L.chars = G(parent); L.front = G(parent); L.fx = G(parent);
  L.sparkles = fireflies(L.fx, 22, [-200, 200, 2100, 950]);
  overlays(L, parent); L.warm.setAttribute('opacity', 0.02);
  L.update = function(u, oo){ oo = oo || {}; const cx = oo.camX === undefined ? 960 : oo.camX;
    T(L.far, `translate(${((cx - 960)*0.35).toFixed(1)} 0)`);
    L.crys.forEach((c, i) => c.glow.setAttribute('opacity', (0.45 + 0.3*Math.sin(TAU*(u*0.4 + i*0.17)) + (oo.glow || 0)).toFixed(3)));
    L.sparkles(u, 1); if (oo.dusk !== undefined) L.dusk.setAttribute('opacity', (0.35*oo.dusk).toFixed(3)); };
  return L;
}

/* =================== SC1 — INTO THE GLITTERING CAVE =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locCave(c), party:['otto', 'mori', 'owli', 'momo', 'lumi', 'kuku', 'pipi'], lv:9, cx:720, steps:'step',
    quest:'The Crystal Cave', tasks:[{text:'Follow the falling crystal'}, {text:'Find the enchanter', done:40}], amb:[['hum', 1.0], ['stream', 0.3]],
    look: setLook([[0, 700, 740, 1.12], [12, 900, 720, 1.0], [26, 1100, 740, 1.15], [45, 960, 740, 1.1]]),
    acts: P => {
      const {A} = P;
      A.kuku.do('arms', 12, 2.4, {R:[60, -180], L:[60, -180], eyes:'happy', mouth:'open'});
      // "Hellooo!" ... "hellooo... llooo..." (echo!)
      A.kuku.do('talk', 15, 2.0); P.all.forEach((a, i) => { a.do('look', 17, 4, {x:6, y:-10}); a.do('laugh', 19 + i*0.1, 2.0); });
      A.lumi.do('arms', 22, 3, {R:[90, -190], eyes:'happy', mouth:'open'});
      // crystals light up one by one toward a sound of humming
      P.all.forEach((a, i) => { a.do('look', 26, 12, {x:8, y:-2}); a.do('wow', 27 + i*0.1, 1.4); a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { S.echo(u); }});
  S.echo = floatTxt(S.L.fx, [{t:15.2, at:[1000, 560], text:'Hellooo!', col:'#FFB347', size:46}, {t:16.4, at:[1300, 480], text:'hellooo...', col:'#B9D8FF', size:36}, {t:17.4, at:[1600, 420], text:'llooo...', col:'#9FA6F0', size:28}]);
  const p0 = S.pre; S.pre = u => S.L.update(u, {camX: S.look(u)[0], glow: 0.3*sm((u - 26)/4)});
  [15.4, 16.6, 17.6].forEach((t, i) => S.sfx(t, 'chime', 0.03 - i*0.008, 0.2 + i*0.3, {f:784})); S.sfx(26, 'sparkle', 0.05, 0.5);
})();

/* =================== SC2 — NIKO THE ENCHANTER =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locCave(c), party:['otto', 'mori', 'owli', 'momo', 'kuku', 'pipi'], newbie:'niko', nx:1260, lv:9, steps:'step',
    amb:[['hum', 0.9]], demo:{t:22, kind:'buff', text:'ENCHANT WEAPON!'}, cardT:30, target:'golem', targetCol:'#B9D8FF',
    acts: (P, N) => {
      // Niko is enchanting crystals: tap, tap, sparkle
      N.do('work', 0, 6.4, {kind:'paint', rate:1.2, eyes:'happy', look:[4, -4]});
      // Momo and Niko: both cats! They compare ears, then laugh
      P.A.momo.do('pose', 16, 5, {x: P.X[3] + 300}); P.A.momo.do('look', 17, 3, {x:6, y:0}); P.A.momo.do('laugh', 19, 2); N.do('laugh', 19, 2);
      // Niko enchants everyone's weapons: they glow!
    },
    post: u => S.glint(u)});
  S.glint = sparkles(S.L.fx, [{t:1.0, x:1400, y:760, n:4, r:60}, {t:3.4, x:1400, y:760, n:4, r:60}, {t:22.6, x:700, y:820, n:14, r:400}]);
})();

/* =================== SC3 — THE CRYSTAL GOLEM =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locCave(c), party:['otto', 'niko', 'owli', 'mori', 'momo', 'kuku', 'pipi'], cx:600, lv:[9, 10], steps:'step',
    boss:{type:'golem', col:'#B9D8FF', name:'Crystal Golem', lv:13, s:1.7, x:1500, hat: b => { crystal(b, -50, -140, 0.5, '#C9A7FF'); crystal(b, 40, -150, 0.6, '#FFB3E0'); }},
    quest:'Shiny Trouble', task:'Calm the Crystal Golem', bonk:33, stomps:[5.4, 6.4, 17.6], amb:[['hum', 0.8]],
    moves:[{who:'pipi', t:6.6}, {who:'niko', t:9.8, kind:'buff', text:'ENCHANT WEAPON!'}, {who:'owli', t:12.6}, {who:'momo', t:15.2},
      {who:'otto', t:20.2}, {who:'mori', t:22.8, kind:'bolt', col:'#8ED081'}, {who:'kuku', t:25.4}, {who:'niko', t:28.0, kind:'slash', text:'MANA BLADE!'}],
    hurt:[{who:'owli', t:18.2, text:'-7'}], finale:'SPARKLE COMBO!'});
})();

/* =================== SC4 — A SPARKLY NIGHT =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locCamp(c, {tod:'night', fire:[960, 1010], logs:[600, 1320], tent:false}), ids:['pipi', 'mori', 'momo', 'niko', 'owli', 'lumi', 'kuku', 'otto'], snack:'mug',
    next:'pom', nextTag:'THE POTION SHOP', teaserT:30, amb:[['night', 1.0], ['fire', 1.2]],
    acts: (A, all) => { A.niko.do('arms', 10, 4, {R:[90, -190], eyes:'happy', mouth:'open'}); all.forEach((a, i) => { a.do('wow', 11 + i*0.1, 1.4); a.do('happy', 13, 6, {mouth:'open'}); });
      // a puff of pink smoke + a "POP!" far away
      all.forEach((a, i) => a.do('hop', 27.6 + i*0.05, 0.4, {h:24})); }});
  S.lights = burstFx(S.L.fx, [10.6, 11.2, 11.8, 12.4].map((t, i) => ({t, at:[700 + i*180, 420], col:['#B9D8FF', '#C9A7FF', '#FFB3E0', '#FFE07A'][i], s:1.2})));
  S.pop = floatTxt(S.L.fx, [{t:27.6, at:[1650, 460], text:'POP! ♥', col:'#FF8AC8', size:52}]);
  S.puff = Array.from({length:6}, (_, i) => mk('circle', {r:30, fill:'#FFC2E4', opacity:0}, S.L.fx));
  const p0 = S.post; S.post = u => { p0(u); S.lights(u); S.pop(u); S.puff.forEach((c, i) => { const v = (u - 27.4)/2; const on = v > 0 && v < 1; c.setAttribute('opacity', on ? (0.7*(1 - v)).toFixed(3) : 0); if (on){ c.setAttribute('cx', (1700 + 60*Math.cos(i) * v * 2).toFixed(1)); c.setAttribute('cy', (600 - 120*v + 30*Math.sin(i)).toFixed(1)); c.setAttribute('r', (30 + 40*v).toFixed(1)); } }); };
  S.sfx(10.6, 'sparkle', 0.05, 0); S.sfx(27.4, 'pop', 0.06, 0.7); S.sfx(27.5, 'thump', 0.05, 0.7, {f:120});
})();

EPISODE({day:21, title:'The Crystal Cave', music:{seed:113, key:2, bpm:76, prog:1}, thumb:120,
  chapters:[['Into the Glittering Cave', g => crystal(g, 0, 14, 0.24, '#B9D8FF')], ['Niko the Enchanter', g => clsIcon(g, 'enchanter', 1)],
            ['The Crystal Golem', g => clsIcon(g, 'shield', 1)], ['A Sparkly Night', IC.fire]],
  scenes:[SC1, SC2, SC3, SC4]});
