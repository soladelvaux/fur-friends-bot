/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 20: "The Enchanted Grove"  (180 s)
   the wilting grove → Mori the Druid joins → the Thornbush Treant →
   planting flowers together at sunset
   ===================================================================== */

/* =================== SC1 — THE WILTING GROVE =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  const P = arrival(S, {loc: c => locRealm(c, {biome:'forest'}), party:['otto', 'tutu', 'owli', 'leaf', 'momo', 'kuku', 'pipi'], lv:8, cx:720,
    quest:'The Enchanted Grove', tasks:[{text:'Follow the vine'}, {text:'Find out why the flowers wilt', done:40}], amb:[['leaves', 0.6], ['birds', 0.3]],
    look: setLook([[0, 700, 760, 1.1], [12, 900, 740, 1.05], [26, 1100, 760, 1.18], [45, 960, 740, 1.1]]),
    acts: P => {
      const {A} = P;
      // droopy grey flowers everywhere; Pipi tries to cheer one up
      P.all.forEach((a, i) => a.do('pose', 12, 6, {mouth:'small'}));
      A.pipi.do('reach', 15.0, 3.0, {side:'L', to:[1200, 940], lean:-8}); A.leaf.do('think', 15.6, 3.0);
      // a fox girl with a leaf crown kneels by the flowers, glowing green
      P.all.forEach((a, i) => { a.do('look', 22, 18, {x:8, y:0}); a.do('wow', 22.6 + i*0.1, 1.4); });
      A.tutu.do('arms', 30, 4, {R:[30, -76], L:[10, -60], eyes:'happy', mouth:'talk'});
      P.all.forEach((a, i) => a.do('happy', 34 + i*0.1, 8, {mouth:'open'}));
    },
    post: u => { S.flowers.forEach((f, i) => { const heal = sm((u - 34 - i*0.15)/1.2); T(f, `translate(${1150 + i*90} 960) rotate(${(lerp(70, 0, heal)*(i % 2 ? -1 : 1)).toFixed(1)} 0 0)`); f.head.setAttribute('fill', hexMix('#B9B4C9', ['#FF9EBB', '#FFE07A', '#C9B6F2'][i % 3], heal)); });
      T(S.mori, `translate(1700 ${(1000 - 0).toFixed(0)})`); S.glow.setAttribute('opacity', (0.8*rh(u, 22, 23, 40, 42)).toFixed(3)); S.notes(1200, 700, u, rh(u, 30, 31, 34, 35)); }});
  S.flowers = Array.from({length:8}, (_, i) => { const f = G(S.L.chars); mk('path', {d:'M0 0 V-60', stroke:'#6DBA6E', 'stroke-width':6}, f); const h = G(f, 'translate(0 -66)'); f.head = mk('circle', S4({r:16, fill:'#B9B4C9'}), h); mk('circle', {r:6, fill:'#FFE07A'}, h); return f; });
  S.mori = G(S.L.chars); { const pc = G(S.mori, 'scale(0.9)'); const m = makeChar('fox', pc); pose(m, {eyes:'happy', mouth:'smile', still:true}); leafCrown(m); robe(m, '#5FAF6A', '#3E7A44', {belt:'#8A6A44'}); }
  S.glow = mk('ellipse', {cx:1700, cy:900, rx:220, ry:160, fill:'url(#glowW)', opacity:0}, S.L.fx);
  S.notes = notesFx(S.L.fx, 4);
  S.sfx(23, 'sparkle', 0.05, 0.6); S.sfx(34.2, 'heal', 0.05, 0.4); S.sfx(15.4, 'rustle', 0.04, 0.3);
})();

/* =================== SC2 — MORI THE DRUID =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locRealm(c, {biome:'forest'}), party:['otto', 'tutu', 'owli', 'leaf', 'kuku', 'pipi'], newbie:'mori', nx:1260, lv:8, steps:'grassstep',
    amb:[['leaves', 0.6], ['birds', 0.4]], demo:{t:23, kind:'bolt', text:'WILD SHAPE!'}, cardT:30, target:'mushroom', targetCol:'#8ED081',
    acts: (P, N) => {
      // Otto and Mori: two healers comparing staffs
      P.A.otto.do('pose', 16.0, 5.4, {x: P.X[0] + 700}); P.A.otto.do('arms', 17.4, 2.6, {R:[90, -190], eyes:'happy', mouth:'open'}); N.do('arms', 17.4, 2.6, {R:[90, -190], eyes:'happy', mouth:'open'});
    },
    post: u => S.heal(u)});
  S.heal = healFx(S.L.fx, [{t:17.8, d:2.4, at:[1100, 980], col:'#8ED081'}]);
  S.sfx(17.8, 'heal', 0.05, 0.3);
})();

/* =================== SC3 — THE THORNBUSH TREANT =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'forest', tod:'sunset'}), party:['otto', 'mori', 'tutu', 'leaf', 'momo', 'kuku', 'pipi'], cx:600, lv:[8, 9],
    boss:{type:'golem', col:'#8A6A44', name:'Thornbush Treant', lv:12, s:1.7, x:1500, hat: b => { blobCluster(G(b, 'translate(0 -150)'), [[-60, 0, 46], [0, -30, 56], [60, 0, 46], [0, 20, 40]], ['#6DBA6E', '#5FA85B', '#7CC77A']); }},
    minions:[{type:'mushroom', col:'#8ED081', x:1200, s:0.6, bonk:12.6}],
    quest:'The Grumpy Grove', task:'Soothe the Thornbush Treant', bonk:33, stomps:[6.0, 7.2, 17.4], amb:[['leaves', 0.6]],
    moves:[{who:'pipi', t:7.4}, {who:'leaf', t:10.2}, {who:'tutu', t:13.6, kind:'buff'}, {who:'mori', t:16.0, kind:'bolt', col:'#8ED081', text:'NATURE’S TOUCH!'},
      {who:'otto', t:20.4}, {who:'momo', t:23.0}, {who:'kuku', t:25.4}, {who:'mori', t:28.0, kind:'heal', text:'FOREST BLESSING!'}],
    hurt:[{who:'pipi', t:18.0, text:'-6'}], finale:'THE GROVE BLOOMS!',
    post: (u, P, boss) => { S.bloom.forEach((f, i) => { const a = sm((u - 33.6 - i*0.1)/1.0); T(f, `translate(${300 + i*150} ${960 + (i % 2)*20}) scale(${(2.4*a).toFixed(3)})`); }); }});
  S.bloom = Array.from({length:10}, (_, i) => blossom(S.L.mid, 0, 0, 1, ['#FF9EBB', '#FFE07A', '#C9B6F2', '#FFFFFF'][i % 4]));
})();

/* =================== SC4 — PLANTING AT SUNSET =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locRealm(c, {biome:'meadow', tod:'sunset'}), ids:['leaf', 'owli', 'momo', 'pipi', 'mori', 'tutu', 'kuku', 'otto'], snack:'none',
    next:'niko', nextTag:'THE CRYSTAL CAVE', teaserT:31, amb:[['birds', 0.5], ['breeze', 0.6]], upd: u => ({camX:960}),
    acts: (A, all) => { all.forEach((a, i) => { a.do('work', 2 + i*0.3, 8, {kind:'dig', rate:1.2, eyes:'happy', mouth:'smile', look:[0, 8]}); a.do('work', 12 + i*0.3, 6, {kind:'water', rate:0.8, eyes:'happy'}); });
      A.mori.do('arms', 19, 3, {R:[90, -190], eyes:'happy', mouth:'open'}); all.forEach((a, i) => { a.do('wow', 21 + i*0.1, 1.4); a.do('cheer', 23 + i*0.1, 2.4); a.do('happy', 25.6, 4, {mouth:'open'}); }); }});
  S.sprouts = Array.from({length:14}, (_, i) => { const g = G(S.L.chars); g.st = mk('path', {d:'M0 0 V-40', stroke:'#6DBA6E', 'stroke-width':5}, g); g.fl = blossom(g, 0, -44, 1.6, ['#FF9EBB', '#FFE07A', '#C9B6F2', '#FFFFFF'][i % 4]); return g; });
  S.heal = healFx(S.L.fx, [{t:19.4, d:2.4, at:[960, 1000], col:'#8ED081'}]);
  S.crys = G(S.L.fx); crystal(S.crys, 0, 0, 0.8, '#B9D8FF');
  const p0 = S.post; S.post = u => { p0(u); S.heal(u);
    S.sprouts.forEach((g, i) => { const gr = sm((u - 4 - i*0.4)/2) , bl = sm((u - 19.6 - i*0.05)/0.8); T(g, `translate(${200 + i*115} ${1010 + (i % 2)*16}) scale(${(gr*(0.6 + 0.6*bl)).toFixed(3)})`); show(g.fl, bl > 0.05); });
    const cv = (u - 29.4)/1.6; show(S.crys, u > 29.4 && u < 38); if (u > 29.4) T(S.crys, `translate(${lerp(2100, 1500, sm(Math.min(1, cv))).toFixed(1)} ${(560 + 20*Math.sin(TAU*u)).toFixed(1)}) rotate(${(10*Math.sin(TAU*u*0.6)).toFixed(1)})`); };
  S.sfx(19.6, 'heal', 0.05, 0); S.sfx(29.6, 'sparkle', 0.05, 0.6);
})();

EPISODE({day:20, title:'The Enchanted Grove', music:{seed:105, key:5, bpm:78, prog:3}, thumb:120,
  chapters:[['The Wilting Grove', IC.sprout], ['Mori the Druid', g => clsIcon(g, 'druid', 1)], ['The Thornbush Treant', IC.leaf], ['Planting at Sunset', g => blossom(g, 0, 0, 2.4, '#FF9EBB')]],
  scenes:[SC1, SC2, SC3, SC4]});
