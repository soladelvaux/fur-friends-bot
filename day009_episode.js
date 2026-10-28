/* =====================================================================
   FUR FRIENDS — Day 9: "Garden Helpers"   (180 s)
   planting seeds → sprinkler & butterflies → harvest → sunset soup
   ===================================================================== */
function sprout(parent, x, y){ const g = G(parent, `translate(${x} ${y})`); g.s = G(g);
  mk('path', {d:'M0 0 V-26', stroke:'#5FA85B', 'stroke-width':5, 'stroke-linecap':'round'}, g.s);
  mk('ellipse', S4({cx:-11, cy:-28, rx:12, ry:7, fill:'#8ED081', transform:'rotate(-25 -11 -28)'}, 3), g.s); mk('ellipse', S4({cx:11, cy:-30, rx:12, ry:7, fill:'#8ED081', transform:'rotate(25 11 -30)'}, 3), g.s);
  g.fl = G(g.s, 'translate(0 -44)'); for (let k=0;k<5;k++) mk('ellipse', S4({cx:0, cy:-9, rx:7, ry:10, fill:['#FFB3C7','#FFE07A','#C9B6F2','#FFFFFF','#9FD3F5'][Math.floor(x/7) % 5], transform:`rotate(${k*72})`}, 2.4), g.fl); mk('circle', S4({r:6, fill:'#FFD84D'}, 2.4), g.fl);
  return g; }
function carrotTop(parent, x, y){ const g = G(parent, `translate(${x} ${y})`); g.c = G(g); itCarrotPull(G(g.c, 'translate(0 20) scale(1.4)')); return g; }
function holeFx(parent, x, y){ return mk('ellipse', {cx:x, cy:y, rx:20, ry:6, fill:'#5A3B28', opacity:0}, parent); }

/* =================== SC1 — PLANTING SEEDS =================== */
const SC1 = scene(0, 45, {look:[970, 800, 1.4, 1.46]});
const PL = [520, 680, 840, 1000, 1160, 1320];
(function(){
  const S = SC1;
  S.L = locGarden(S.cam, {});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 1); S.amb('bees', 0, 45, 1); S.amb('breeze', 0, 45, 0.6);
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,420],[4,420],[6,PL[0] + 30],[9,PL[1] + 30],[12,PL[2] + 30],[15,PL[3] + 30],[18,PL[4] + 30],[21,PL[5] + 30],[23.4,PL[5] + 30],[25.2,1580],[45,1580]], y:950, steps:'grassstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,260],[7,260],[9,PL[0] - 10],[12,PL[1] - 10],[15,PL[2] - 10],[18,PL[3] - 10],[21,PL[4] - 10],[24,PL[5] - 10],[27,PL[5] - 190],[45,PL[5] - 190]], y:960, steps:'grassstep'});
  const momo = actor(S, 'cat', {layer:ly, x:[[0,120],[10,120],[12,PL[0] - 30],[15,PL[1] - 30],[18,PL[2] - 30],[21,PL[3] - 30],[24,PL[4] - 30],[27,PL[5] - 30],[29,700],[45,700]], y:950, steps:'grassstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1650],[27,1650],[28.6,1500],[45,1500]], y:950, steps:'grassstep'});
  kuku.item('L', 'shovel', itShovel(G(null, 'scale(-1 1)'), '#FFD27A'));
  pipi.item('R', 'seeds', itSeedBag(G()));
  otto.item('R', 'can', itCan(G(), '#9FD3F5'));
  // dig – drop seeds – pat
  PL.forEach((x, i) => {
    kuku.do('work', 6.2 + i*3, 2.0, {kind:'dig', rate:2.0, itemL:'shovel', look:[0, 8], snd:'scoop', every:1, gain:0.04});
    pipi.do('reach', 9.2 + i*3, 1.6, {to:[x, 940], item:'seeds', lean:6}); S.sfx(9.9 + i*3, 'rattle', 0.02, panOf(x), {d:0.4});
    momo.do('work', 12.2 + i*3, 1.8, {kind:'pat', rate:2.0, look:[0, 8], snd:'pat', every:0.5, gain:0.04});
  });
  pipi.do('hold', 0, 9, {item:'seeds', at:[40, -84]}); pipi.do('hold', 27, 18, {item:'seeds', at:[40, -84]});
  [kuku, pipi, momo].forEach((a, i) => a.do('happy', 4 + i*0.2, 2.4, {mouth:'open'}));
  // Otto waters every plot (walking along behind)
  otto.do('hold', 0, 28, {item:'can', at:[40, -84]});
  otto.fn = (u, st) => { if (u > 28.6 && u < 40){ st.x = K(u, [[28.6, 1500], [30, PL[5] + 70], [32, PL[4] + 70], [34, PL[3] + 70], [36, PL[2] + 70], [38, PL[1] + 70], [40, PL[0] + 70]]); st.walk = st.x/86; st.walkAmt = 1; } else if (u >= 40) st.x = PL[0] + 70; };
  otto.do('work', 29.0, 11.6, {kind:'water', rate:0.8, itemR:'can', only:'R', look:[-3, 8]});
  otto.do('cheer', 41.2, 2.2);
  [kuku, pipi, momo].forEach((a, i) => { a.do('look', 30, 10, {x:-5, y:6}); a.do('wow', 40.4 + i*0.15, 1.4); a.do('cheer', 41.6 + i*0.15, 2.2); });
  S.holes = PL.map(x => holeFx(S.L.plants, x, 976));
  S.sprouts = PL.map(x => sprout(S.L.plants, x, 976));
  S.drops = []; for (let i=0;i<12;i++) S.drops.push({el: mk('path', {d:'M0 -6 Q5 2 0 6 Q-5 2 0 -6 Z', fill:'#9FD3F5', opacity:0}, S.L.fx), ph:i/12});
  S.seeds = PL.map(() => mk('ellipse', S4({rx:5, ry:4, fill:'#A8743E'}, 2), S.L.fx));
  S.butter = butterflies(S.L.fx, 2, [300, 450, 1600, 700]);
  S.hearts = heartBursts(S.L.fx, [{t:5.0, x:500, y:700, n:3}, {t:41.6, x:960, y:700, n:5}]);
  S.spark = sparkles(S.L.fx, PL.map((x, i) => ({t:40.2 + i*0.15, x, y:930, n:3, r:30})));
  S.sfx(29.0, 'pour', 0.05, 0.6, {d:11}); S.sfx(40.2, 'sparkle', 0.05, 0); S.sfx(40.4, 'chime', 0.03, 0, {f:1318.5});
  S.pre = u => S.L.update(u);
  S.post = u => {
    PL.forEach((x, i) => {
      S.holes[i].setAttribute('opacity', (0.9*sm((u - 6.6 - i*3)/1.0)*(1 - sm((u - 12.6 - i*3)/1.0))).toFixed(3));
      const sv = (u - 10.0 - i*3)/0.5; show(S.seeds[i], sv > 0 && sv < 1); if (sv > 0 && sv < 1){ S.seeds[i].setAttribute('cx', x); S.seeds[i].setAttribute('cy', (930 + 46*sv).toFixed(1)); }
      const g = sm((u - 40.0 - i*0.15)/0.6); show(S.sprouts[i], g > 0.01); T(S.sprouts[i].s, `scale(${(g*(1 + 0.25*bump(u, 40 + i*0.15, 0.8))).toFixed(3)})`); show(S.sprouts[i].fl, false);
    });
    const p = otto.c.last ? paw(otto.c, 1) : [0, 0];
    const wv = rh(u, 29.2, 29.8, 40.0, 40.6);
    S.drops.forEach(d => { const v = mod(u*1.8 + d.ph, 1); const x = p[0] + 0.0 + 40 + 30*v*Math.sin(d.ph*9), y = p[1] - 30 + 120*v; T(d.el, `translate(${x.toFixed(1)} ${y.toFixed(1)})`); d.el.setAttribute('opacity', (wv*Math.sin(Math.PI*v)).toFixed(3)); });
    S.butter(u, 1); S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — SPRINKLER & BUTTERFLIES =================== */
const SC2 = scene(45, 90, {look:[960, 760, 1.25, 1.3]});
(function(){
  const S = SC2;
  S.L = locGarden(S.cam, {});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.9); S.amb('bees', 0, 45, 1); S.amb('sprinkler', 3, 30, 1.2);
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1500],[4,1500],[6,1100],[7,1100],[9,800],[10,800],[12,1100],[13.4,1100],[15.4,800],[16,800],[30,800],[45,800]], y:950, steps:'grassstep'});
  const momo = actor(S, 'cat', {layer:ly, x:[[0,560],[45,560]], y:950, steps:'grassstep'});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,1300],[20,1300],[22,1150],[24,1400],[26,1200],[28,1450],[30,1300],[45,1300]], y:950, steps:'grassstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,1580],[17,1580],[18.4,1000],[22,1000],[24,1580],[45,1580]], y:950, steps:'grassstep'});
  S.spr = G(S.L.chars); S.L.chars.insertBefore(S.spr, S.L.chars.firstChild);
  mk('rect', S4({x:-8, y:-60, width:16, height:60, fill:'#BFC6D6'}), S.spr); S.sprHead = G(S.spr, 'translate(0 -64)'); mk('rect', S4({x:-24, y:-8, width:48, height:16, rx:8, fill:'#FFD27A'}), S.sprHead);
  T(S.spr, 'translate(960 930)');
  S.jets = []; for (let i=0;i<22;i++) S.jets.push({el: mk('circle', {r:R(4,7), fill:'#BFE8FF', stroke:'#8FD3F5', 'stroke-width':1.5, opacity:0}, S.L.fx), ph:rnd(), a:rnd()});
  S.rainbow = G(S.L.fx); ['#FF9AA2','#FFC48A','#FFE58A','#A8E6A3','#9FD3F5','#C3B1F0'].forEach((c, i) => mk('path', {d:`M${700 + i*10} 900 A ${260 - i*10} 200 0 0 1 ${1220 - i*10} 900`, fill:'none', stroke:c, 'stroke-width':10}, S.rainbow));
  otto.do('cheer', 3.0, 1.6); otto.do('happy', 4, 12, {mouth:'open'}); otto.do('arms', 5, 11, {L:[70, -170], R:[70, -170]}); otto.do('hop', 6.5); otto.do('hop', 9.5); otto.do('hop', 13); otto.do('hop', 15.6);
  momo.do('look', 3, 14, {x:6, y:-2}); momo.do('laugh', 7, 3); momo.do('laugh', 13, 2.6); momo.do('arms', 16.4, 2.4, {L:[10, -150], R:[10, -150], eyes:'squeeze', mouth:'open'});
  otto.do('pose', 16.2, 2.4, {tremble:1, eyes:'squeeze', mouth:'open'});   // shakes off water!
  // Kuku runs through too
  kuku.do('cheer', 18.0, 1.6); kuku.do('happy', 18, 4, {mouth:'open'}); kuku.do('hop', 19.0); kuku.do('hop', 20.6);
  // Pipi chases a butterfly
  pipi.do('look', 20, 10, {x:3, y:-8}); pipi.do('arms', 20.6, 9.0, {L:[60, -170], R:[60, -170], eyes:'happy', mouth:'open'}); pipi.do('hop', 22.0); pipi.do('hop', 24.0); pipi.do('hop', 26.0); pipi.do('hop', 28.0);
  // butterfly lands on Pipi's nose
  pipi.do('wow', 31.0, 1.6); pipi.do('pose', 31.0, 6, {lookX:0, lookY:-8, eyesL:'open'}); [momo, otto, kuku].forEach((a, i) => { a.do('look', 31, 6, {x: a === momo ? 7 : -7, y:-2}); a.do('happy', 32 + i*0.3, 4, {mouth:'small'}); });
  pipi.do('happy', 37.4, 3, {mouth:'open'}); [momo, otto, kuku, pipi].forEach((a, i) => a.do('wave', 38.4 + i*0.15, 3.6));
  S.sprouts = PL.map(x => sprout(S.L.plants, x, 976));
  S.flies = butterflies(S.L.fx, 4, [300, 400, 1700, 750]);
  S.special = G(S.L.fx); const sw = mk('path', S4({d:'M0 0 Q-20 -22 -24 -4 Q-20 10 0 0 Z', fill:'#FFB3C7'}), S.special), sw2 = mk('path', S4({d:'M0 0 Q20 -22 24 -4 Q20 10 0 0 Z', fill:'#FFB3C7'}), S.special); mk('ellipse', {rx:3, ry:9, fill:OL}, S.special); S.sw = [sw, sw2];
  S.hearts = heartBursts(S.L.fx, [{t:8.0, x:900, y:640, n:3}, {t:33.0, x:1300, y:600, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:12.0, x:960, y:700, n:6, r:150}]);
  S.sfx(16.4, 'rattle', 0.03, 0, {d:0.6}); S.sfx(16.4, 'splash', 0.04, 0, {d:0.5}); S.sfx(31.0, 'chime', 0.03, 0.3, {f:1568}); S.sfx(33.0, 'sparkle', 0.04, 0.3);
  S.pre = u => S.L.update(u);
  S.post = u => {
    const on = rh(u, 2.6, 3.4, 29.4, 30.4);
    const sweep = 50*Math.sin(TAU*u/3.2);
    T(S.sprHead, `translate(0 -64) rotate(${sweep.toFixed(1)})`);
    S.jets.forEach(j => { const v = mod(u*1.2 + j.ph, 1); const ang = (sweep + (j.a - 0.5)*30)*Math.PI/180; const sp = 380*v;
      const x = 960 + Math.sin(ang)*sp, y = 866 - 280*v + 330*v*v; j.el.setAttribute('cx', x.toFixed(1)); j.el.setAttribute('cy', y.toFixed(1)); j.el.setAttribute('opacity', (on*0.9*(1 - v)).toFixed(3)); });
    S.rainbow.setAttribute('opacity', (0.5*on*(0.6 + 0.4*Math.sin(TAU*u/3.2))).toFixed(3));
    PL.forEach((x, i) => { const g = sm((u - 1 - i*0.6)/8); T(S.sprouts[i].s, `scale(${(1 + 0.6*g).toFixed(3)})`); show(S.sprouts[i].fl, g > 0.6); T(S.sprouts[i].fl, `translate(0 -44) scale(${sm((g - 0.6)/0.4).toFixed(3)})`); });
    // special butterfly: flutters, lands on Pipi's nose at 31
    let bp; const h = headW(pipi.c, 0, 0);
    if (u < 30.8) bp = [pipi.X(u) + 120*Math.sin(TAU*u/4.6) + 30, 640 + 60*Math.sin(TAU*u/2.3)];
    else if (u < 37) bp = [h[0], h[1] - 6]; else bp = [h[0] + 300*(u - 37)/4, h[1] - 6 - 240*(u - 37)/4];
    T(S.special, `translate(${bp[0].toFixed(1)} ${bp[1].toFixed(1)}) scale(0.9)`); const f = (u > 31 && u < 37) ? 0.6 + 0.4*Math.abs(Math.sin(TAU*u*0.7)) : 0.25 + 0.75*Math.abs(Math.sin(TAU*u*3));
    S.sw.forEach(w => T(w, `scale(${f.toFixed(3)} 1)`)); show(S.special, u > 19 && u < 41.5);
    S.flies(u, 1); S.hearts(u); S.spark(u);
  };
})();

/* =================== SC3 — HARVEST TIME =================== */
const SC3 = scene(90, 135, {look:[1020, 790, 1.36, 1.42]});
(function(){
  const S = SC3;
  S.L = locGarden(S.cam, {});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.9); S.amb('bees', 0, 45, 0.6); S.amb('breeze', 0, 45, 0.6);
  const CX = [560, 720, 880, 1040, 1200, 1360];
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,600],[45,600]], y:950});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,880],[45,880]], y:950});
  const momo = actor(S, 'cat', {layer:ly, x:[[0,1160],[24,1160],[26,1520],[45,1520]], y:950, steps:'grassstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,1360],[24,1360],[26.4,1720],[45,1720]], y:950, steps:'grassstep'});
  const all = [kuku, pipi, momo, otto];
  const ccp = mk('clipPath', {id:'soilClip'}, DEFS); mk('rect', {x:-400, y:-400, width:2720, height:1374}, ccp);
  S.soil = G(S.L.plants); S.soil.setAttribute('clip-path', 'url(#soilClip)');
  S.cars = CX.map(x => carrotTop(S.soil, x, 966));
  [kuku, pipi, momo, otto].forEach(a => a.item('R', 'carrot', itCarrotPull(G(null, 'translate(0 -6)'))));
  // pulls: each pulls the carrot in front of them
  const PULL = [[kuku, 0, 3.0], [pipi, 2, 5.0], [momo, 4, 7.0], [otto, 5, 9.0], [kuku, 1, 12.0], [pipi, 3, 14.0]];
  S.PULL = PULL;
  PULL.forEach(p => { const a = p[0], x = CX[p[1]], t = p[2];
    a.do('reach', t - 0.8, 0.8, {to:[x, 930], lean:8}); a.do('work', t, 1.4, {kind:'pull', rate:1.6, eyes:'squeeze', mouth:'open'});
    a.do('arms', t + 1.4, 1.6, {R:[50, -170], itemR:'carrot', eyes:'happy', mouth:'open'}); a.do('hop', t + 1.4);
    S.sfx(t + 0.2, 'rustle', 0.04, panOf(x), {d:0.6}); S.sfx(t + 1.4, 'pop', 0.08, panOf(x)); S.sfx(t + 1.5, 'scoop', 0.04, panOf(x)); });
  // the big stubborn carrot: everyone pulls together (Kuku in front)
  S.big = G(S.soil, 'translate(720 966)'); S.bigC = G(S.big); itCarrotPull(G(S.bigC, 'translate(0 40) scale(3)'));
  all.forEach((a, i) => { a.fn = null; });
  kuku.do('reach', 17, 1.0, {to:[720, 900]}); kuku.do('work', 18.0, 3.6, {kind:'pull', rate:1.4, eyes:'squeeze', mouth:'open'}); kuku.do('pose', 18.0, 3.6, {sweat:1});
  pipi.do('look', 17.4, 2, {x:-7, y:2}); pipi.do('work', 18.6, 3.0, {kind:'pull', rate:1.4, eyes:'squeeze', mouth:'open'});
  kuku.do('pose', 21.6, 2.2, {rot:-18, hop:30}); kuku.do('arms', 21.6, 3.6, {L:[60, -180], R:[60, -180], eyes:'happy', mouth:'open'});
  [momo, otto].forEach(a => { a.do('look', 18, 5, {x:-7, y:0}); a.do('wow', 21.8, 1.4); });
  all.forEach((a, i) => a.do('laugh', 23.4 + i*0.15, 2.4));
  // pumpkins: Momo & Otto lift one together
  momo.do('reach', 27.0, 6.0, {to:[1640, 900], lean:8}); otto.do('reach', 27.4, 5.6, {side:'L', to:[1640, 900], lean:-8});
  momo.do('arms', 33, 5, {R:[40, -150]}); otto.do('arms', 33.2, 4.8, {L:[40, -150]}); momo.do('happy', 33, 5, {mouth:'open'}); otto.do('happy', 33, 5, {mouth:'open'});
  [kuku, pipi].forEach((a, i) => { a.do('look', 28, 10, {x:7, y:0}); a.do('clap', 33.6 + i*0.2, 2.4); });
  all.forEach((a, i) => a.do('cheer', 40.0 + i*0.15, 2.4));
  S.basket = G(S.L.front, 'translate(260 1010) scale(1.6)'); S.basketIn = G(S.basket); itBasket(S.basket);
  S.flyC = PULL.map(() => { const g = G(S.L.fx); itCarrotPull(G(g, 'scale(0.9)')); return g; });
  S.inBasket = PULL.map((p, i) => { const g = G(S.basketIn, `translate(${-20 + (i%3)*18} ${-34 - Math.floor(i/3)*8}) rotate(${-30 + i*14})`); itCarrotPull(G(g, 'scale(0.5)')); return g; });
  S.pump = G(S.L.fx); itPumpkin(S.pump, 1.3);
  S.L.pumpkins[0].style.display = 'none';
  S.hearts = heartBursts(S.L.fx, [{t:22.4, x:720, y:640, n:5}, {t:34.0, x:1640, y:640, n:3}, {t:40.4, x:960, y:640, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:21.8, x:720, y:800, n:7, r:110}]);
  S.sfx(21.6, 'pop', 0.1, -0.3); S.sfx(21.7, 'whoosh', 0.04, -0.3, {d:0.6}); S.sfx(23.4, 'thump', 0.06, -0.3, {f:100}); S.sfx(21.9, 'sparkle', 0.04, -0.3);
  S.sfx(32.6, 'rustle', 0.04, 0.6, {d:0.6}); S.sfx(34.0, 'chime', 0.03, 0.6, {f:1318.5});
  S.pre = u => S.L.update(u);
  S.post = u => {
    S.PULL.forEach((p, i) => { const t = p[2], x = CX[p[1]];
      T(S.cars[p[1]].c, `translate(0 ${(-30*sm((u - t)/1.4)).toFixed(1)})`); show(S.cars[p[1]], u < t + 1.4);
      flyItem(S.flyC[i], u, t + 3.0, 0.9, paw(p[0].c, 1), [260 + (i%3)*20, 940], 160, 300);
      show(S.inBasket[i], u > t + 3.9); });
    const bv = sm((u - 21.6)/0.6); T(S.bigC, `translate(${(-10*bv).toFixed(1)} ${(-140*bv + 60*sm((u - 22.2)/0.8)).toFixed(1)}) rotate(${(-30*bv).toFixed(1)})`);
    show(S.big, true);
    // pumpkin lifted between Momo & Otto
    const lift = sm((u - 32.0)/1.2); const pm = [lerp(1640, (paw(momo.c, 1)[0] + paw(otto.c, -1)[0])/2, lift), lerp(950, (paw(momo.c, 1)[1] + paw(otto.c, -1)[1])/2 + 10, lift)];
    T(S.pump, `translate(${pm[0].toFixed(1)} ${pm[1].toFixed(1)})`);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC4 — SUNSET SOUP =================== */
const SC4 = scene(135, 180, {look:[960, 800, 1.42, 1.52]});
(function(){
  const S = SC4;
  S.L = locGarden(S.cam, {tod:'sunset'});
  const ly = S.L.chars;
  S.amb('night', 10, 45, 1); S.amb('breeze', 0, 45, 0.5); S.amb('birds', 0, 14, 0.5);
  const X = [690, 870, 1060, 1240];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:940}), kuku = actor(S, 'squirrel', {layer:ly, x:X[1], y:940});
  const pipi = actor(S, 'bunny', {layer:ly, x:X[2], y:940}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:940});
  const all = [momo, kuku, pipi, otto];
  // table
  const tb = G(S.L.front); mk('rect', SK({x:520, y:905, width:900, height:26, rx:8, fill:'#FFFFFF'}, 5), tb);
  mk('path', {d:'M520 931 H1420', stroke:'#FF9AA2', 'stroke-width':10, 'stroke-dasharray':'22 18'}, tb);
  mk('rect', SK({x:540, y:927, width:860, height:200, fill:'#D9A066'}, 5), tb);
  S.pot = G(S.L.front, 'translate(965 907)'); mk('path', SK({d:'M-60 -70 L60 -70 L52 0 L-52 0 Z', fill:'#F28C8C'}, 5), S.pot); mk('rect', SK({x:-68, y:-80, width:136, height:16, rx:8, fill:'#F7A6A6'}, 4), S.pot); mk('ellipse', {cx:0, cy:-74, rx:56, ry:8, fill:'#FFB46B'}, S.pot);
  const bowlC = ['#C9B6F2', '#FFD27A', '#FFB3C7', '#9FD3F5'];
  all.forEach((a, i) => { const b = G(S.L.front, `translate(${X[i] + (i < 2 ? 30 : -30)} 907)`); mk('path', SK({d:'M-34 -24 Q-30 6 0 6 Q30 6 34 -24 Z', fill:bowlC[i]}, 4), b); mk('ellipse', {cx:0, cy:-22, rx:30, ry:6, fill:'#FFB46B'}, b); });
  all.forEach((a, i) => a.item('R', 'spoon', itSpoon(G())));
  otto.item('L', 'ladle', (() => { const g = G(null, 'rotate(-20)'); mk('path', {d:'M0 10 V-40', stroke:OL, 'stroke-width':7, 'stroke-linecap':'round'}, g); mk('ellipse', S4({cx:0, cy:16, rx:14, ry:10, fill:'#BFC6D6'}), g); return g; })());
  // Otto ladles soup for everyone
  [[1.0, 900], [3.0, 1000], [5.0, 1060], [7.0, 1180]].forEach((q, k) => { otto.do('reach', q[0], 1.8, {side:'L', to:[q[1], 840], item:'ladle', lean:-6}); S.sfx(q[0] + 0.9, 'pour', 0.04, panOf(q[1]), {d:0.7}); });
  all.forEach((a, i) => { if (a !== otto) a.do('look', 1, 8, {x:6, y:2}); });
  // soup
  all.forEach((a, i) => {
    for (let k=0;k<4;k++){ const t = 10.0 + i*0.5 + k*3.2; const bx = X[i] + (i < 2 ? 30 : -30);
      a.do('reach', t, 1.0, {to:[bx, 885], item:'spoon'}); a.do('reach', t + 1.0, 1.2, {to:u => headW(a.c, 0, 30), item:'spoon'}); a.do('face', t + 1.6, 1.2, {eyes:'happy', mouth:'chew'});
      S.sfx(t + 0.6, 'clink', 0.025, panOf(bx), {f:2600, d:0.2}); S.sfx(t + 1.7, 'slurp', 0.035, panOf(bx), {d:0.5}); }
  });
  all.forEach((a, i) => a.do('face', 24.4 + i*0.2, 2.6, {eyes:'squeeze', mouth:'small'})); all.forEach((a, i) => a.do('pose', 24.4 + i*0.2, 2.6, {blushAmt:1.8, hy:-4}));
  kuku.do('talk', 27.6, 3.0, {gest:true}); [momo, pipi, otto].forEach((a, i) => a.do('laugh', 30.6 + i*0.2, 2.4));
  // watch the sunset, lean together
  [[momo, 8, 8], [kuku, 6, 4], [pipi, -6, -4], [otto, -8, -8]].forEach((q, i) => { q[0].do('pose', 34 + i*0.2, 11, {x:X[i] + q[1], tilt:q[2]}); q[0].do('look', 34, 11, {x:3, y:-5}); q[0].do('happy', 35 + i*0.3, 6); });
  pipi.do('yawn', 39.0, 1.8); momo.do('sleepy', 40, 5);
  S.steamPot = steam(S.L.fx, 4); S.steams = all.map(() => steam(S.L.fx, 2));
  S.ff = fireflies(S.L.fx, 20, [100, 500, 1820, 900]);
  S.hearts = heartBursts(S.L.fx, [{t:25.0, x:960, y:640, n:5}, {t:37.0, x:960, y:620, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:36.0, x:1500, y:560, n:6, r:90}]);
  S.pre = u => S.L.update(u, {dusk: sm((u - 14)/24)});
  S.post = u => {
    S.steamPot(965, 825, u, 0.9, 30);
    all.forEach((a, i) => S.steams[i](X[i] + (i < 2 ? 30 : -30), 875, u + i, u > 2 + 2*i ? 0.6 : 0, 8));
    S.ff(u, sm((u - 18)/10)); S.hearts(u); S.spark(u);
  };
})();

EPISODE({day:9, title:'Garden Helpers', music:{seed:19, key:5, bpm:76, prog:0},
  chapters:[['Planting Seeds', IC.sprout], ['Sprinkler Fun', IC.can], ['Harvest Time', IC.carrot], ['Sunset Soup', IC.pumpkin]],
  scenes:[SC1, SC2, SC3, SC4]});
