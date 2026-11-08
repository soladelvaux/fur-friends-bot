/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 19: "The Cheerful Tavern"  (180 s)
   rest stop at the tavern → Tutu the Bard joins → the Rumbling Drum
   Golem → an encore concert
   ===================================================================== */

/* =================== SC1 — A REST AT THE TAVERN =================== */
const SC1 = scene(0, 45);
(function(){
  const S = SC1;
  const P = arrival(S, {loc: c => locHall(c, {kind:'tavern'}), party:['otto', 'owli', 'nyx', 'momo', 'tora', 'kuku', 'pipi'], lv:7, cx:720, steps:'woodstep',
    quest:'Rest Stop', tasks:[{text:'Order something yummy', done:20}, {text:'Find the singer'}], amb:[['cafe', 0.9], ['fire', 0.4]],
    look: setLook([[0, 700, 740, 1.1], [14, 900, 740, 1.08], [26, 960, 700, 1.0], [45, 960, 720, 1.1]]),
    acts: P => {
      const {A} = P;
      P.all.forEach((a, i) => { const m = a.item('L', 'mug', itMug(G(), ['#FFE7A8', '#C7B3F5', '#B98AF0', '#FFB3C7', '#FFB47A', '#9FC8F0', '#FFC3D2'][i], '#F2B35A')); a.do('hold', 12, 33, {side:'L', item:'mug', at:[30, -76]}); a.do('sip', 15 + i*0.6, 2.0, {side:'L', item:'mug'}); });
      A.kuku.do('face', 21.0, 1.6, {eyes:'squeeze', mouth:'small'}); A.kuku.do('pose', 21.0, 1.6, {blushAmt:2});
      // a happy tune starts... feet start tapping
      P.all.forEach((a, i) => { a.do('look', 26, 14, {x:4, y:-6}); a.do('bob', 27 + i*0.2, 14, {f:0.8}); });
      A.tora.do('dance', 34, 6, {bpm:1.4}); A.pipi.do('dance', 34.4, 6, {bpm:1.1}); A.nyx.do('shy', 35, 2.4);
    },
    post: u => S.notes(960, 640, u, rh(u, 26, 27, 44, 45))});
  S.notes = notesFx(S.L.fx, 5);
  S.sfx(12.4, 'clink', 0.04, 0, {f:2300}); for (let i=0;i<7;i++) S.sfx(15 + i*0.6 + 1.0, 'sip', 0.04, -0.6 + i*0.2);
})();

/* =================== SC2 — TUTU THE BARD =================== */
const SC2 = scene(45, 90);
(function(){
  const S = SC2;
  meetScene(S, {loc: c => locHall(c, {kind:'tavern'}), party:['otto', 'owli', 'nyx', 'momo', 'kuku', 'pipi'], newbie:'tutu', nx:1260, lv:7,
    amb:[['cafe', 0.7], ['fire', 0.3]], demo:{t:23, kind:'buff', text:'SONG OF COURAGE!'}, cardT:30, target:'slime', targetCol:'#FFE07A',
    acts: (P, N) => {
      // Tutu is on the little stage, strumming
      N.do('arms', 0, 6.4, {R:[30, -76], L:[10, -60], eyes:'happy', mouth:'talk'});
      N.fn = (u, st) => { const s = rh(u, 0, 0.6, 6, 6.4) + rh(u, 33, 33.6, 44, 45); st.tL = lerpP(st.tL, [-4 + 16*Math.abs(Math.sin(TAU*u*2)), -66], s); };
      P.all.forEach((a, i) => a.do('bob', 0, 6, {f:0.8}));
      N.do('arms', 33.0, 12, {R:[30, -76], L:[10, -60], eyes:'happy', mouth:'talk'});
      P.all.forEach((a, i) => a.do('dance', 34 + i*0.2, 10, {bpm:[1.0, 1.2, 0.9, 1.1, 1.4, 1.0][i]}));
    },
    post: u => S.notes(1260, 680, u, rh(u, 0, 0.6, 6, 6.6) + rh(u, 33, 34, 44, 45))});
  S.notes = notesFx(S.L.fx, 5);
})();

/* =================== SC3 — THE RUMBLING DRUM GOLEM =================== */
const SC3 = scene(90, 135);
(function(){
  const S = SC3;
  bossFight(S, {loc: c => locRealm(c, {biome:'meadow', tod:'sunset'}), party:['otto', 'tutu', 'owli', 'nyx', 'momo', 'kuku', 'pipi'], cx:600, lv:[7, 8], steps:'grassstep',
    boss:{type:'golem', col:'#D9A35A', name:'Drum Golem', lv:11, s:1.6, x:1500, hat: b => { const d = G(b, 'translate(0 -22) scale(0.8)'); mk('ellipse', SK({rx:56, ry:20, fill:'#FFF3D6'}, 4.4), d); mk('path', {d:'M-50 6 L-30 40 L-10 6 L10 40 L30 6 L50 40', fill:'none', stroke:'#C8443A', 'stroke-width':5}, d); }},
    quest:'Too Loud!', task:'Calm the Drum Golem', bonk:33, stomps:[5.0, 6.0, 7.0, 18.0],
    moves:[{who:'pipi', t:7.2}, {who:'tutu', t:10.4, kind:'buff', text:'SONG OF COURAGE!'}, {who:'owli', t:13.4}, {who:'nyx', t:16.0}, {who:'otto', t:20.0},
      {who:'momo', t:22.8}, {who:'kuku', t:25.4}, {who:'tutu', t:28.0, kind:'song', text:'PEACEFUL TUNE!'}],
    hurt:[{who:'kuku', t:18.4, text:'-7'}], finale:'HARMONY!', amb:[['breeze', 0.6]],
    cheer: (P, B) => { P.all.forEach((a, i) => a.do('dance', B + 7 + i*0.1, 5, {bpm:1.2})); },
    extraSfx: S => { [5.0, 6.0, 7.0, 18.0].forEach(t => S.sfx(t + 0.25, 'knock', 0.06, 0.4, {f:140})); }});
  S.notes = notesFx(S.L.fx, 5);
  const p0 = S.post; S.post = u => { p0(u); S.notes(1500, 700, u, rh(u, 33.5, 34.5, 44, 45)); };
})();

/* =================== SC4 — ENCORE! =================== */
const SC4 = scene(135, 180);
(function(){
  const S = SC4;
  cozyEnd(S, {loc: c => locHall(c, {kind:'tavern', night:true}), ids:['owli', 'nyx', 'momo', 'pipi', 'tutu', 'tora', 'kuku', 'otto'], snack:'cake', festival:false,
    next:'mori', nextTag:'THE ENCHANTED GROVE', teaserT:31, amb:[['cafe', 0.8], ['fire', 0.4]],
    acts: (A, all) => { A.tutu.item('R', 'lute2', wLute(G()));
      A.tutu.do('arms', 12, 16, {R:[30, -76], L:[10, -60], itemR:'lute2', eyes:'happy', mouth:'talk'});
      all.filter(a => a !== A.tutu).forEach((a, i) => { a.do('dance', 12.6 + i*0.2, 14, {bpm:[1.0, 1.2, 0.9, 1.1, 1.4, 1.0, 1.3][i]}); });
      // a vine with a flower sprouts through the window
      all.forEach((a, i) => a.do('look', 30.2, 6, {x:-8, y:-10})); }});
  S.notes = notesFx(S.L.fx, 6);
  S.vine = G(S.L.fx, 'translate(360 260)'); S.vineP = mk('path', {d:'M0 0 Q60 80 20 160 Q-20 240 40 320', fill:'none', stroke:'#6DBA6E', 'stroke-width':12, 'stroke-linecap':'round', 'stroke-dasharray':'500', 'stroke-dashoffset':'500'}, S.vine);
  S.flower = blossom(S.vine, 40, 320, 3.0, '#FF9EBB'); S.flower.style.display = 'none';
  const p0 = S.post; S.post = u => { p0(u); S.notes(960, 640, u, rh(u, 12, 13, 27, 28)); S.vineP.setAttribute('stroke-dashoffset', (500*(1 - sm((u - 29.4)/1.6))).toFixed(0)); show(S.flower, u > 30.8); };
  S.sfx(29.6, 'rustle', 0.05, -0.6); S.sfx(30.8, 'pop', 0.05, -0.6);
})();

EPISODE({day:19, title:'The Cheerful Tavern', music:{seed:95, key:0, bpm:86, prog:2}, thumb:120,
  chapters:[['A Rest at the Tavern', IC.tea], ['Tutu the Bard', g => clsIcon(g, 'bard', 1)], ['The Drum Golem', g => clsIcon(g, 'note', 1)], ['Encore!', IC.cupcake]],
  scenes:[SC1, SC2, SC3, SC4]});
