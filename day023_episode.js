/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 23: "The Spirit Meadow"  (180 s)
   glowing paw prints → Kiri the Summoner and her spirit friends →
   the Storm Wisp → a night of spirit lights
   ===================================================================== */
// a tiny glowing spirit fox that follows Kiri
function spiritFox(parent){ const g = G(parent); g.glow = mk('circle', {r:60, fill:'url(#glowW)'}, g);
  const b = G(g); mk('ellipse', SK({cx:0, cy:-26, rx:26, ry:22, fill:'#DFFBFB', 'fill-opacity':0.9}, 3.4), b); [-1, 1].forEach(s => mk('path', SK({d:`M${s*8} -44 L${s*20} -66 L${s*24} -40 Z`, fill:'#DFFBFB'}, 3), b));
  mk('path', SK({d:'M-24 -20 Q-54 -30 -50 -56 Q-36 -40 -20 -34 Z', fill:'#BFF2F2'}, 3), b); [-8, 8].forEach(x => mk('path', {d:`M${x - 4} -28 Q${x} -32 ${x + 4} -28`, fill:'none', stroke:OL, 'stroke-width':2.6, 'stroke-linecap':'round'}, b));
  g.body = b; return g; }

/* =================== SC1 — GLOWING PAW PRINTS =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locRealm(c, {biome:'meadow', tod:'night'}), party:['otto', 'pom', 'niko', 'momo', 'leaf', 'kuku', 'pipi'], lv:11, cx:720,
    quest:'The Spirit Meadow', tasks:[{text:'Follow the glowing paw prints'}, {text:'Meet the spirits', done:40}], amb:[['night', 1.0], ['breeze', 0.3]],
    look: setLook([[0, 700, 760, 1.1], [12, 900, 740, 1.05], [24, 1150, 760, 1.25], [34, 1000, 740, 1.1], [45, 960, 740, 1.12]]),
    acts: P => {
      const {A} = P;
      A.leaf.do('reach', 11.4, 2.6, {side:'L', to:[1100, 970], lean:-8}); A.leaf.do('think', 14.2, 2.4);
      // a little spirit fox bounces out of the grass... and boops Pipi's nose
      P.all.forEach((a, i) => { a.do('look', 18, 16, {x:8, y:-4}); a.do('wow', 19 + i*0.1, 1.4); });
      A.pipi.do('pose', 25.4, 2.2, {eyes:'squeeze', mouth:'open', blushAmt:2.4}); A.pipi.do('laugh', 27.6, 2.4);
      P.all.filter(a => a !== A.pipi).forEach((a, i) => a.do('laugh', 26.2 + i*0.1, 2.4));
      P.all.forEach((a, i) => { a.do('cheer', 33 + i*0.1, 2.4); a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { const fx = K(u, [[0, 2100], [18.4, 2100], [20, 1300], [24, 1300], [25.2, 1050], [27, 1300], [36, 1400], [42, 2200]]);
      const hop = 40*Math.abs(Math.sin(TAU*u*1.2)); T(S.fox, `translate(${fx.toFixed(1)} ${(990 - hop - (u > 24.4 && u < 25.6 ? 60 : 0)).toFixed(1)}) scale(1.2)`);
      S.prints.forEach((p, i) => p.setAttribute('opacity', (0.6 + 0.3*Math.sin(TAU*(u*0.8 + i/7))).toFixed(3))); S.boop(u); }});
  S.prints = Array.from({length:7}, (_, i) => { const p = G(S.L.mid, `translate(${980 + i*150} ${1000 - (i % 2)*24})`); mk('circle', {r:34, fill:'url(#glowW)'}, p); pawPrint(p, 0, 0, 1.2, '#BFF2F2'); return p; });
  S.fox = spiritFox(S.L.fx);
  S.boop = floatTxt(S.L.fx, [{t:25.3, at:[1100, 720], text:'boop! ♥', col:'#BFF2F2', size:44}]);
  S.sfx(19, 'sparkle', 0.05, 0.6); S.sfx(25.3, 'plink', 0.06, 0.3, {f:1400}); S.sfx(33, 'chime', 0.03, 0.4, {f:1318.5});
})();

/* =================== SC2 — KIRI THE SUMMONER =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locRealm(c, {biome:'shrine', tod:'night'}), party:['otto', 'pom', 'niko', 'momo', 'kuku', 'pipi'], newbie:'kiri', nx:1260, lv:11, steps:'grassstep',
    amb:[['night', 1.0]], demo:{t:23, kind:'summon', text:'SPIRIT CALL!'}, cardT:30,
    acts: (P, N) => { N.do('happy', 0, 6, {mouth:'open'}); P.all.forEach((a, i) => a.do('wow', 1.6 + i*0.1, 1.4)); },
    post: u => S.foxes.forEach((f, i) => { const a = TAU*(u*0.3 + i/3); T(f, `translate(${(1260 + 200*Math.cos(a)).toFixed(1)} ${(900 + 50*Math.sin(a) - 30*Math.abs(Math.sin(TAU*u + i))).toFixed(1)}) scale(${(0.8 + 0.1*i).toFixed(2)})`); })});
  S.foxes = [0,1,2].map(() => spiritFox(S.L.fx));
})();

/* =================== SC3 — THE STORM WISP =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'meadow', tod:'sunset'}), party:['otto', 'kiri', 'pom', 'niko', 'momo', 'kuku', 'pipi'], cx:600, lv:[11, 12], steps:'grassstep',
    boss:{type:'ghost', col:'#B9C9F0', name:'Storm Wisp', lv:15, s:2.5, x:1500, y:940, hat: b => cloudShape(G(b, 'translate(0 -116)'), 10, 0, 0.6, '#8E9AC8')},
    quest:'Stormy Night', task:'Calm the Storm Wisp', bonk:33, amb:[['wind', 0.6], ['rain', 0.3]],
    moves:[{who:'pipi', t:5.6}, {who:'kiri', t:9.0, text:'SPIRIT CALL!'}, {who:'pom', t:12.4}, {who:'niko', t:15.6, kind:'buff'},
      {who:'otto', t:20.4}, {who:'momo', t:23.0}, {who:'kuku', t:25.4}, {who:'kiri', t:28.0, kind:'buff', col:'#BFF2F2', text:'PACK FORMATION!'}],
    hurt:[{who:'niko', t:18.2, text:'-7'}], finale:'CALM SKIES!',
    post: (u, P, boss) => { const p = boss.mid(); S.rain.forEach((r, i) => { const v = mod(u*1.4 + i/14, 1); const on = u < 33.4; r.setAttribute('opacity', on ? 0.5 : 0); r.setAttribute('x1', (p[0] - 220 + i*32).toFixed(0)); r.setAttribute('x2', (p[0] - 228 + i*32).toFixed(0)); r.setAttribute('y1', (p[1] - 40 + 300*v).toFixed(0)); r.setAttribute('y2', (p[1] - 10 + 300*v).toFixed(0)); }); },
    extraSfx: S => { [6.4, 17.0].forEach(t => S.sfx(t, 'thump', 0.05, 0.5, {f:60, d:0.8})); }});
  S.rain = Array.from({length:14}, () => mk('line', {stroke:'#BFE6FF', 'stroke-width':4, 'stroke-linecap':'round', opacity:0}, S.L.fx));
})();

/* =================== SC4 — SPIRIT LIGHTS =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locRealm(c, {biome:'meadow', tod:'night'}), ids:['leaf', 'niko', 'momo', 'pipi', 'kiri', 'pom', 'kuku', 'otto'], snack:'mug',
    next:'rin', nextTag:'THE GREAT LIBRARY', teaserT:30, amb:[['night', 1.0]], upd: u => ({camX:960, sparkles:1.4}),
    acts: (A, all) => { all.forEach((a, i) => { a.do('look', 8, 16, {x:0, y:-12}); a.do('wow', 9 + i*0.3, 1.4); }); A.kiri.do('arms', 8, 4, {R:[90, -190], eyes:'happy', mouth:'open'});
      // a paper airplane glides in with a note: "Help! The books are flying away!"
      A.otto.do('reach', 29, 2.4, {to:[1300, 760], lean:6}); }});
  S.foxes = [0,1,2,3,4].map(() => spiritFox(S.L.fx));
  S.plane = G(S.L.fx); mk('path', SK({d:'M-40 0 L40 -10 L-20 14 Z', fill:'#FFFFFF'}, 3.4), S.plane); mk('path', {d:'M-20 14 L-8 0', stroke:OL, 'stroke-width':2.4}, S.plane);
  const p0 = S.post; S.post = u => { p0(u);
    S.foxes.forEach((f, i) => { const a = TAU*(u*0.08 + i/5); T(f, `translate(${(960 + 760*Math.cos(a)).toFixed(1)} ${(420 + 120*Math.sin(a*2) + 30*Math.sin(TAU*u + i)).toFixed(1)}) scale(0.7)`); });
    const pv = (u - 27)/2.4; show(S.plane, pv > 0 && u < 32); if (pv > 0){ const p = arcP([-200, 300], [1290, 760], Math.min(1, pv), -160); T(S.plane, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${(pv < 1 ? 10 : 0)})`); } };
  S.sfx(27, 'whoosh', 0.03, -0.6, {d:2.0, f0:400, f1:900}); S.sfx(29.6, 'page', 0.05, 0.3);
})();

EPISODE({day:23, title:'The Spirit Meadow', music:{seed:131, key:9, bpm:76, prog:3}, thumb:120,
  chapters:[['Glowing Paw Prints', g => pawPrint(g, 0, 2, 1.1, '#BFF2F2')], ['Kiri the Summoner', g => clsIcon(g, 'summoner', 1)], ['The Storm Wisp', g => cloudShape(g, 0, 0, 0.18, '#B9C9F0')], ['Spirit Lights', g => clsIcon(g, 'orb', 1)]],
  scenes:[SC1, SC2, SC3, SC4]});
