/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 22: "The Potion Shop"  (180 s)
   pink smoke over the market → Pom the Alchemist joins → the Bubbly
   Slime King → a potion tasting party
   ===================================================================== */

/* =================== SC1 — PINK SMOKE IN TOWN =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  arrival(S, {loc: c => locRealm(c, {biome:'town', castleX:2600}), party:['otto', 'niko', 'owli', 'momo', 'tora', 'kuku', 'pipi'], lv:10, cx:720,
    quest:'The Potion Shop', tasks:[{text:'Find the pink smoke'}, {text:'Help the alchemist', done:40}], amb:[['cafe', 0.7], ['birds', 0.3]],
    look: setLook([[0, 700, 760, 1.1], [12, 1000, 700, 1.0], [26, 1200, 740, 1.12], [45, 960, 740, 1.1]]),
    acts: P => {
      const {A} = P;
      // POP! a pink cloud rolls out of a shop; everyone turns pink for a second
      P.all.forEach((a, i) => { a.do('wow', 13.2 + i*0.06, 1.4); a.do('hop', 13.2 + i*0.06, 0.4, {h:30}); a.do('face', 16 + i*0.1, 2.6, {eyes:'squeeze', mouth:'aah'}); });
      A.tora.do('laugh', 20, 2.4); A.kuku.do('laugh', 20.2, 2.4); A.momo.do('shy', 20.4, 2.4);
      // a hamster in goggles waves from the smoke: "Sorry! Sorry!"
      P.all.forEach((a, i) => { a.do('look', 24, 12, {x:8, y:-2}); a.do('happy', 30 + i*0.1, 5, {mouth:'open'}); a.do('pose', 38, 7, {x: P.X[i] + 900, ai:5}); });
    },
    post: u => { S.cloud.forEach((c, i) => { const v = (u - 12.8)/7; const on = v > 0 && v < 1; c.setAttribute('opacity', on ? (0.75*Math.sin(Math.PI*v)).toFixed(3) : 0);
        if (on){ c.setAttribute('cx', (1500 - 1000*sm(v)*(0.4 + 0.6*(i % 3)/2) + 60*Math.sin(i)).toFixed(1)); c.setAttribute('cy', (760 - 100*Math.sin(i*1.7) + 40*v).toFixed(1)); c.setAttribute('r', (60 + 140*sm(v)).toFixed(1)); } });
      S.tint.setAttribute('opacity', (0.25*rh(u, 14, 15, 18, 20)).toFixed(3)); S.sorry(u); S.peek(u); }});
  S.shop = fantasyHouse(S.L.mid, 1500, 830, 0.9, '#FFE1F0', '#C98A4E', 9);
  S.cloud = Array.from({length:12}, () => mk('circle', {r:60, fill:'#FFC2E4', opacity:0}, S.L.fx));
  S.tint = mk('rect', {x:-400, y:-400, width:2800, height:1900, fill:'#FF9AD0', opacity:0, 'pointer-events':'none'}, S.L.fx);
  S.sorry = floatTxt(S.L.fx, [{t:24.6, at:[1500, 520], text:'Sorry! Sorry! ♥', col:'#FF8AC8', size:46, d:2.4}]);
  S.pom = G(S.L.chars); { const pc = G(S.pom, 'scale(0.9)'); const m = makeChar('hamster', pc); pose(m, {eyes:'squeeze', mouth:'open', still:true}); goggles(m); robe(m, '#C98A4E', '#FFE9C4', {belt:'#6E4433'}); }
  S.peek = u => { const a = sm((u - 23.6)/0.8); show(S.pom, a > 0.01); T(S.pom, `translate(1500 ${(1000 + 60*(1 - a)).toFixed(1)})`); S.pom.setAttribute('opacity', a.toFixed(3)); };
  S.sfx(12.8, 'pop', 0.07, 0.6); S.sfx(12.9, 'thump', 0.06, 0.6, {f:110}); S.sfx(13.0, 'hiss', 0.04, 0.4, {d:2.4}); S.sfx(24.6, 'squish', 0.04, 0.6);
})();

/* =================== SC2 — POM THE ALCHEMIST =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locHall(c, {kind:'lab'}), party:['otto', 'niko', 'owli', 'momo', 'kuku', 'pipi'], newbie:'pom', nx:1260, lv:10,
    amb:[['room', 0.6], ['oven', 0.3]], demo:{t:23, kind:'throw', text:'ELIXIR BOMB!'}, cardT:30, target:'slime', targetCol:'#FF8AC8',
    acts: (P, N) => {
      N.do('work', 0, 6.2, {kind:'stir', rate:1.4, eyes:'happy', look:[2, 6]});
      // Pom hands out a "strength potion" to Kuku → Kuku's ears go fluffy, everyone giggles
      P.A.kuku.do('pose', 15.8, 5.2, {x: P.X[4] + 220}); P.A.kuku.do('sip', 17.4, 1.6); P.A.kuku.do('pose', 19.0, 2.2, {hop:30, eyes:'squeeze', mouth:'open', blushAmt:2});
      P.all.filter(a => a !== P.A.kuku).forEach((a, i) => a.do('laugh', 19.4 + i*0.1, 2.2));
    },
    post: u => S.kspark(u)});
  S.kspark = sparkles(S.L.fx, [{t:19.0, x:1080, y:760, n:8, r:120}]);
  S.sfx(17.6, 'sip', 0.06, 0.3); S.sfx(19.0, 'boing', 0.05, 0.3);
})();

/* =================== SC3 — THE BUBBLY SLIME KING =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'meadow', tod:'sunset'}), party:['otto', 'pom', 'niko', 'owli', 'momo', 'kuku', 'pipi'], cx:600, lv:[10, 11],
    boss:{type:'slime', col:'#FF8AC8', name:'Bubbly Slime King', lv:14, s:2.6, x:1500, hat: b => { const c = G(b, 'translate(0 -96)'); mk('path', SK({d:'M-30 0 L-36 -30 L-16 -16 L0 -40 L16 -16 L36 -30 L30 0 Z', fill:'#FFD24D'}, 4), c); }},
    minions:[{type:'slime', col:'#C9A7FF', x:1180, s:0.6, bonk:13.2}, {type:'slime', col:'#9FD3F5', x:1800, s:0.6, bonk:14.2}],
    quest:'Bubble Trouble', task:'Calm the Slime King', bonk:33, amb:[['breeze', 0.6]], steps:'grassstep',
    moves:[{who:'pipi', t:5.6}, {who:'pom', t:9.0, text:'POTION MIX!'}, {who:'owli', t:12.4}, {who:'niko', t:15.6, kind:'buff'},
      {who:'otto', t:20.4}, {who:'momo', t:23.0}, {who:'kuku', t:25.4}, {who:'pom', t:28.0, n:3, text:'ELIXIR BOMB!'}],
    hurt:[{who:'momo', t:18.2, text:'-6'}], finale:'BUBBLE POP COMBO!',
    extraSfx: S => { for (let t = 2; t < 32; t += 1.3) SFXB.boing(S, t, 0.5); }});
})();

/* =================== SC4 — POTION TASTING PARTY =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locHall(c, {kind:'lab', night:true}), ids:['owli', 'niko', 'momo', 'pipi', 'pom', 'tora', 'kuku', 'otto'], snack:'mug',
    next:'kiri', nextTag:'THE SPIRIT MEADOW', teaserT:30, amb:[['room', 0.6], ['fire', 0.3]], upd: u => ({}),
    acts: (A, all) => { // each sip does something silly
      A.tora.do('pose', 9, 2, {hop:30, eyes:'squeeze', mouth:'open'}); A.pipi.do('pose', 11, 2, {blushAmt:2.2, eyes:'happy'}); A.owli.do('pose', 13, 2, {tilt:20, eyes:'sleep'});
      A.kuku.do('dance', 15, 4, {bpm:1.6}); all.forEach((a, i) => a.do('laugh', 19 + i*0.1, 2.4));
      // little glowing paw prints appear on the floor, leading outside
      all.forEach((a, i) => a.do('look', 29.4, 6, {x:-6, y:6})); }});
  S.prints = Array.from({length:6}, (_, i) => { const p = G(S.L.fx); mk('circle', {r:40, fill:'url(#glowW)'}, p); pawPrint(p, 0, 0, 1.4, '#BFF2F2'); p.style.display = 'none'; return p; });
  S.puffs = burstFx(S.L.fx, [9, 11, 13, 15].map((t, i) => ({t, at:[[1050, 720], [700, 720], [580, 720], [1220, 720]][i], col:['#FF9A5A', '#FF8AC8', '#9FA6F0', '#FFE07A'][i], s:0.8})));
  const p0 = S.post; S.post = u => { p0(u); S.puffs(u); S.prints.forEach((p, i) => { const a = sm((u - 28.6 - i*0.35)/0.4) * (1 - sm((u - 40)/2)); show(p, a > 0.01); p.setAttribute('opacity', a.toFixed(3)); T(p, `translate(${1500 - i*160} ${1060 - (i % 2)*30})`); }); };
  [9, 11, 13, 15].forEach((t, i) => S.sfx(t, ['boing', 'sparkle', 'pop', 'bloop'][i], 0.05, -0.3 + i*0.2)); S.sfx(28.6, 'chime', 0.03, 0.4, {f:1318.5});
})();

EPISODE({day:22, title:'The Potion Shop', music:{seed:121, key:7, bpm:82, prog:0}, thumb:120,
  chapters:[['Pink Smoke in Town', g => wFlask(g, '#FF8AC8').setAttribute('transform', 'scale(0.5) translate(-4 16)')], ['Pom the Alchemist', g => clsIcon(g, 'alchemist', 1)],
            ['The Bubbly Slime King', g => { mk('path', S4({d:'M-16 8 Q-18 -10 0 -14 Q18 -10 16 8 Z', fill:'#FF8AC8'}), g); }], ['Potion Tasting Party', IC.tea]],
  scenes:[SC1, SC2, SC3, SC4]});
