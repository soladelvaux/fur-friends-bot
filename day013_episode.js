/* =====================================================================
   FUR FRIENDS: BATTLE EDITION — Day 13: "Welcome to Pawlandia"  (180 s)
   a mysterious game → pulled into the world, class select → first quest
   at Slime Meadow → guild hall, quest clear + a hint of the next friend
   ===================================================================== */
const P13 = {momo:'#B79BE8', pipi:'#FF9DB5', otto:'#8FD6C4', kuku:'#FFD27A'};
// plain + battle-dressed copy of the same hero; swaps at tSwap
function twin(S, id, opts, tSwap){
  const a = hero(S, id, Object.assign({}, opts, {gear:false})), b = hero(S, id, opts);
  const T2 = {a, b, tSwap, do(...q){ a.do(...q); b.do(...q); return T2; }};
  T2.vis = u => { show(a.c.root, u < tSwap); show(b.c.root, u >= tSwap); };
  return T2;
}
function itGameBook(p){ const g = G(p); mk('rect', SK({x:-40, y:-30, width:80, height:60, rx:8, fill:'#7E6FD0'}, 4.4), g); mk('rect', {x:-34, y:-24, width:6, height:48, fill:'#F2C95E'}, g);
  mk('path', {d:STAR_D, fill:'#FFE07A', stroke:OL, 'stroke-width':2, transform:'translate(6 0) scale(1.3)'}, g); return g; }

/* =================== SC1 — A MYSTERIOUS GAME =================== */
const SC1 = scene(0, 45, {look: u => [1080, lerp(720, 640, sm((u - 24)/8)), lerp(1.3, 1.12, sm((u - 24)/8)) + 0.25*sm((u - 34)/5)]});
(function(){
  const S = SC1;
  S.L = locHome(S.cam, {night:false});
  const ly = S.L.chars;
  S.amb('room', 0, 45, 0.8); S.amb('birds', 0, 30, 0.3);
  const PX = 1110, PY = 560;
  const momo = hero(S, 'momo', {layer:ly, x:[[0,850],[45,850]], y:960, gear:false});
  const pipi = hero(S, 'pipi', {layer:ly, x:[[0,-200],[5,1000],[45,1000]], y:965, gear:false, steps:'softstep'});
  const kuku = hero(S, 'kuku', {layer:ly, x:[[0,1200],[45,1200]], y:960, gear:false});
  const otto = hero(S, 'otto', {layer:ly, x:[[0,2300],[6.5,1400],[45,1400]], y:965, gear:false, steps:'softstep'});
  const all = [momo, pipi, kuku, otto];
  otto.item('R', 'book', itGameBook(G()));
  momo.item('R', 'phone', itPhone(G()));
  // morning: Momo on her phone, Kuku stretching, Pipi walks in, Otto arrives with a parcel-book
  momo.do('hold', 0, 6, {item:'phone', at:[24, -110]}); momo.do('look', 0, 6, {x:4, y:6});
  kuku.do('stretch', 1.0, 2.6); kuku.do('yawn', 3.8, 1.6);
  pipi.do('wave', 5.2, 1.8);
  otto.do('hold', 6.5, 15, {item:'book', at:[40, -120]}); otto.do('talk', 7.0, 3.0, {gest:false});
  [momo, pipi, kuku].forEach((a, i) => { a.do('look', 7.0, 4, {x:8, y:-2}); a.do('wow', 9.6 + i*0.2, 1.4); });
  // everyone gathers close; the book starts to glow
  otto.do('reach', 12.0, 4.0, {to:[PX + 100, 820], item:'book', lean:-10});
  [momo, pipi, kuku].forEach((a, i) => { a.do('look', 12, 9, {x:[5, 3, -4][i], y:2}); a.do('face', 13 + i*0.2, 6, {eyes:'open', mouth:'small'}); });
  kuku.do('point', 16.4, 2.0, {at:[110, -120]});
  all.forEach((a, i) => a.do('pose', 19.4 + i*0.1, 3.0, {eyes:'open', mouth:'open', tilt:[8, 4, -4, -8][i]}));
  all.forEach((a, i) => a.do('wow', 19.6 + i*0.15, 1.6));
  // the portal opens and pulls everyone in
  all.forEach((a, i) => { a.do('shiver', 25.0, 3.0); a.do('face', 25, 3, {eyes:'squeeze', mouth:'open'}); });
  const TP = [29.0, 29.5, 30.0, 30.5];
  all.forEach((a, i) => a.do('pose', TP[i], 40, {x:PX, y:PY + 40, s:0.12, rot:[540, -540, 540, -540][i], eyes:'squeeze', mouth:'open', ai:1.3}));
  S.portal = portalFx(S.L.fx, PX, PY, 1.1);
  S.glow = mk('circle', {cx:PX + 100, cy:820, r:140, fill:'url(#glowW)', opacity:0}, S.L.fx);
  S.bookG = G(S.L.fx); itGameBook(S.bookG); S.bookG.style.display = 'none';
  S.title = G(S.L.fx); { const t = txt(S.title, 0, 0, 'PAWLANDIA ONLINE', 72, '#FFFFFF'); t.setAttribute('font-weight', 800); t.setAttribute('stroke', '#5B4FB0'); t.setAttribute('stroke-width', 10); t.setAttribute('paint-order', 'stroke'); t.setAttribute('letter-spacing', 4); }
  S.titleSub = txt(S.L.fx, 0, 0, 'Press  ★  to start', 34, '#FFFFFF'); S.titleSub.setAttribute('stroke', '#5B4FB0'); S.titleSub.setAttribute('stroke-width', 7); S.titleSub.setAttribute('paint-order', 'stroke');
  S.spark = sparkles(S.L.fx, [{t:13.6, x:PX + 100, y:780, n:6, r:110}, {t:20.0, x:PX, y:560, n:10, r:280}]);
  S.burst = burstFx(S.L.fx, [{t:24.2, at:[PX, PY], s:1.6, col:'#C9A7FF'}]);
  S.hearts = heartBursts(S.L.fx, [{t:10.4, x:960, y:700, n:3}]);
  S.sfx(5.0, 'doorbell', 0.04, 0.4); S.sfx(13.2, 'sparkle', 0.05, 0.2); S.sfx(16.8, 'chime', 0.03, 0, {f:1568}); S.sfx(19.2, 'sparkle', 0.06, 0);
  S.sfx(24.0, 'zap', 0.05, 0); SFXB.portal(S, 24.2); SFXB.portal(S, 27.4); TP.forEach((t, i) => S.sfx(t + 0.2, 'whoosh', 0.05, 0, {d:0.9, f0:300, f1:2400}));
  S.sfx(33.4, 'pop', 0.05, 0);
  S.pre = u => S.L.update(u, 0.25*sm((u - 22)/3));
  S.post = u => {
    const gl = rh(u, 12.8, 14, 23, 24.2); S.glow.setAttribute('opacity', (0.9*gl*(0.8 + 0.2*Math.sin(TAU*u*2))).toFixed(3));
    // book floats out of Otto's paws and opens into the portal
    const bf = sm((u - 16)/2.4); show(S.bookG, u > 16 && u < 24.4);
    if (u > 16){ const p = [lerp(PX + 100, PX, bf), lerp(820, PY + 20, bf) + 10*Math.sin(TAU*u)]; T(S.bookG, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${(1 + 0.6*bf).toFixed(3)}) rotate(${(6*Math.sin(TAU*u*0.7)).toFixed(1)})`); }
    const ta = rh(u, 18.6, 19.2, 23.0, 23.8); show(S.title, ta > 0.01); show(S.titleSub, ta > 0.01);
    T(S.title, `translate(${PX} ${PY - 170}) scale(${(0.8 + 0.2*sm((u - 18.6)/0.6)).toFixed(3)})`); S.title.setAttribute('opacity', ta.toFixed(3));
    T(S.titleSub, `translate(${PX} ${PY - 110})`); S.titleSub.setAttribute('opacity', (ta*(0.6 + 0.4*Math.sin(TAU*u*1.5))).toFixed(3));
    S.portal(u, rh(u, 24.0, 25.2, 33.2, 34.2));
    all.forEach((a, i) => show(a.c.root, u < TP[i] + 1.25));
    S.spark(u); S.burst(u); S.hearts(u);
    FLASH.v = Math.max(FLASH.v, 0.5*bump(u, 24.0, 0.5));
  };
})();

/* =================== SC2 — CHOOSE YOUR CLASS =================== */
const SC2 = scene(45, 90, {look: u => {
  const foc = [[0, 960, 0], [7.5, 560, 1], [14.5, 760, 1], [21.5, 1160, 1], [28.5, 1360, 1], [35, 960, 0]];
  const x = K(u, foc.map(f => [f[0], f[1]])), z = K(u, foc.map(f => [f[0], f[2]]));
  return [x, lerp(700, 760, z), lerp(1.08, 1.45, z)]; }});
(function(){
  const S = SC2;
  S.L = locRealm(S.cam, {biome:'town'});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.5); S.amb('breeze', 0, 45, 0.5); S.amb('cafe', 0, 45, 0.25);
  const X = {momo:560, pipi:760, kuku:1160, otto:1360};
  const SW = {momo:9.4, pipi:16.4, kuku:23.4, otto:30.4};
  const land = (t, x) => [[0, -420], [t, -420], [t + 0.9, 965]];
  const tw = {};
  ['momo', 'pipi', 'kuku', 'otto'].forEach((id, i) => { tw[id] = twin(S, id, {layer:ly, x:X[id], y:965, ypath:land(0.6 + i*0.35), steps:null}, SW[id]); });
  const list = Object.values(tw);
  S.portal = portalFx(S.L.fx, 960, 160, 0.7);
  // landing bounce + looking around in wonder
  list.forEach((T2, i) => { T2.do('pose', 1.5 + i*0.35, 1.0, {sq:0.12, eyes:'squeeze', mouth:'open'}); T2.do('wow', 2.8 + i*0.2, 1.6); T2.do('look', 4.4, 2.6, {x:[-6, 6, -6, 6][i], y:-6}); });
  // class select, one by one: glow → flash → new outfit → class card → show off
  const POSE = {momo:{R:[100, -150], L:[80, -60]}, pipi:{L:[60, -110]}, kuku:{R:[90, -170], L:[60, -120]}, otto:{R:[80, -180]}};
  Object.keys(tw).forEach(id => { const t = SW[id], T2 = tw[id];
    T2.do('pose', t - 1.6, 1.6, {eyes:'squeeze', mouth:'open', hop:16, ai:0.4, ao:0.2});
    T2.do('arms', t + 0.2, 3.4, Object.assign({eyes:'happy', mouth:'open'}, POSE[id]));
    T2.do('hop', t + 0.3, 0.5, {h:40});
    S.sfx(t - 1.4, 'sparkle', 0.05, panOf(X[id])); S.sfx(t, 'zap', 0.05, panOf(X[id])); SFXB.levelup(S, t + 0.2);
  });
  tw.momo.do('pose', SW.momo + 1.4, 1.6, {tilt:12, eyes:'happy', mouth:'smile'});
  tw.kuku.do('dance', SW.kuku + 1.8, 2.0, {bpm:1.4});
  tw.pipi.do('shy', SW.pipi + 2.0, 1.6);
  tw.otto.do('nod', SW.otto + 2.0, 1.6);
  // party formed!
  list.forEach((T2, i) => { T2.do('cheer', 36.2 + i*0.15, 2.4); T2.do('arms', 39.0, 4.5, {R:[90, -170], eyes:'happy', mouth:'open'}); });
  S.H = hud(S);
  ['momo', 'pipi', 'kuku', 'otto'].forEach(id => { S.H.plate(tw[id].b, {lv:1, show: u => u > SW[id] + 0.6}); S.H.card(SW[id] + 0.8, id, {tag:'✦ CLASS SELECTED ✦', d:5.4, x: X[id] < 960 ? 1380 : 100, y:250}); });
  S.H.banner(36.4, 'PARTY FORMED!', 'Momo · Pipi · Kuku · Otto', '#B79BE8', 5.5);
  S.aura = auraFx(S.L.fx, Object.keys(tw).map(id => ({t:SW[id] - 1.7, d:1.8, at:() => [X[id], 965], col:P13[id]})));
  S.burst = burstFx(S.L.fx, Object.keys(tw).map(id => ({t:SW[id], at:() => [X[id], 860], s:1.4, col:P13[id]})));
  S.dust = burstFx(S.L.fx, list.map((T2, i) => ({t:1.5 + i*0.35, at:[Object.values(X)[i], 960], s:0.6, col:'#FFFFFF'})));
  S.spark = sparkles(S.L.fx, [{t:36.6, x:960, y:700, n:12, r:420}]);
  list.forEach((T2, i) => S.sfx(1.5 + i*0.35, 'thump', 0.06, panOf(Object.values(X)[i]), {f:90, d:0.3}));
  SFXB.portal(S, 0.0); S.sfx(36.4, 'sparkle', 0.06, 0);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    list.forEach(T2 => T2.vis(u));
    S.portal(u, rh(u, -1, 0, 1.8, 2.8));
    Object.keys(tw).forEach(id => FLASH.v = Math.max(FLASH.v, 0.35*bump(u, SW[id] - 0.1, 0.35)));
    S.aura(u); S.burst(u); S.dust(u); S.spark(u);
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC3 — FIRST QUEST: SLIME MEADOW =================== */
const SC3 = scene(90, 135, {look: u => {
  const k = [[0, 760, 1.12], [8, 900, 1.1], [12, 980, 1.22], [17, 860, 1.25], [22, 820, 1.2], [27, 980, 1.22], [33, 1000, 1.12], [38, 960, 1.08], [45, 960, 1.12]];
  return [K(u, k.map(q => [q[0], q[1]])), 760, K(u, k.map(q => [q[0], q[2]]))]; }});
(function(){
  const S = SC3;
  S.L = locRealm(S.cam, {biome:'meadow'});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.6); S.amb('breeze', 0, 45, 0.7); S.amb('leaves', 0, 45, 0.3);
  const otto = hero(S, 'otto', {layer:ly, x:[[0,-300],[5.0,420],[45,420]], y:960, steps:'grassstep'});
  const momo = hero(S, 'momo', {layer:ly, x:[[0,-160],[5.2,600],[45,600]], y:965, steps:'grassstep'});
  const kuku = hero(S, 'kuku', {layer:ly, x:[[0,-40],[5.4,780],[45,780]], y:960, steps:'grassstep'});
  const pipi = hero(S, 'pipi', {layer:ly, x:[[0,80],[5.6,960],[45,960]], y:970, steps:'grassstep'});
  const all = [otto, momo, kuku, pipi];
  // slimes (no one gets hurt: bonked slimes get dizzy, then happy, and hop off as friends)
  const SL = [{col:'#8FE08A', x0:1300}, {col:'#FFB3C7', x0:1500}, {col:'#9FD3F5', x0:1700}].map((q, i) => Object.assign(q, {m: monster(ly, 'slime', {col:q.col, ph:i*0.3})}));
  const TSL = [7.0, 7.4, 7.8];
  // 1) slime A pounces at Pipi → Carrot Shield
  pipi.do('arms', 8.8, 2.2, {L:[70, -100], eyes:'squeeze', mouth:'open'}); pipi.do('pose', 8.8, 2.2, {bt:-6});
  [otto, momo, kuku].forEach(a => a.do('wow', 9.4, 1.2));
  // 2) Momo: Shadow Strike on slime A
  lunge(momo, 12.6, 1.4, 600, {hop:40, lean:14}); strike(momo, 13.0, {R:[110, -150], L:[100, -100]});
  // 3) slime B bonks Kuku, Otto heals
  kuku.do('pose', 18.0, 1.6, {eyes:'squeeze', mouth:'wavy', bt:-12, tremble:0.6}); kuku.do('pose', 18.2, 1.6, {sweat:1});
  otto.do('arms', 20.4, 2.4, {R:[70, -190], eyes:'happy', mouth:'open'});
  kuku.do('happy', 21.6, 1.6, {mouth:'open'});
  // 4) Kuku: Squirrel Punch on slime B
  kuku.do('pose', 23.6, 0.8, {bt:-10, sq:0.08, eyes:'squeeze'}); lunge(kuku, 24.2, 1.3, 600, {hop:20, lean:16}); strike(kuku, 24.5, {R:[120, -110], L:[60, -120]});
  // 5) Combo on slime C: Otto bolt, Momo slash, Kuku punch, Pipi bash
  otto.do('arms', 28.6, 1.6, {R:[110, -180], eyes:'squeeze', mouth:'open'});
  lunge(momo, 29.6, 1.2, 900, {hop:50}); strike(momo, 29.9, {R:[110, -150], L:[100, -100]});
  lunge(kuku, 30.4, 1.2, 760, {hop:16}); strike(kuku, 30.7, {R:[120, -110]});
  lunge(pipi, 31.2, 1.2, 560, {hop:8, lean:6}); pipi.do('arms', 31.2, 1.2, {L:[90, -80], eyes:'squeeze', mouth:'open'});
  // level up + slimes come back as friends
  all.forEach((a, i) => { a.do('cheer', 35.0 + i*0.12, 2.6); a.do('happy', 38, 7, {mouth:'open'}); });
  [momo, kuku].forEach(a => a.do('dance', 39.6, 4, {bpm:1.2})); otto.do('wave', 40, 3); pipi.do('shy', 41, 2.4);
  const slA = u => { if (u < 8.9) return [K(u, [[TSL[0], SL[0].x0 + 300], [TSL[0] + 1, SL[0].x0]]), 0];
    if (u < 9.6) { const v = (u - 8.9)/0.7; return [lerp(SL[0].x0, 1070, v), 160*4*v*(1 - v)]; }
    if (u < 10.6) { const v = (u - 9.6)/1.0; return [lerp(1070, SL[0].x0 - 40, sm(v)), 120*4*v*(1 - v)]; } return [SL[0].x0 - 40, 0]; };
  const slB = u => { if (u < 17.2) return [K(u, [[TSL[1], SL[1].x0 + 300], [TSL[1] + 1, SL[1].x0]]), 0];
    if (u < 18.0) { const v = (u - 17.2)/0.8; return [lerp(SL[1].x0, 880, v), 260*4*v*(1 - v)]; }
    if (u < 19.0) { const v = (u - 18.0)/1.0; return [lerp(880, 1400, sm(v)), 140*4*v*(1 - v)]; } return [1400, 0]; };
  const slC = u => [K(u, [[TSL[2], SL[2].x0 + 300], [TSL[2] + 1, SL[2].x0], [27, SL[2].x0], [28, 1660]]), 0];
  const POS = [slA, slB, slC];
  const BONK = [13.4, 24.9, 32.0];
  const pos = (i, u) => { const p = POS[i](u); return [p[0], 965 - p[1]]; };
  S.H = hud(S);
  all.forEach(a => { S.H.plate(a, {lv:1, show: u => u > 4 && u < 35.4}); S.H.plate(a, {lv:2, show: u => u >= 35.4}); });
  SL.forEach((q, i) => S.H.monPlate(q.m, ['Slime', 'Pink Slime', 'Blue Slime'][i], 1));
  SL.forEach((q, i) => { const pl = S.H.plates[S.H.plates.length - 3 + i]; pl.o.show = u => u > TSL[i] + 1 && u < BONK[i] + 1.6; pl.o.hp = u => 1 - sm((u - BONK[i])/0.4); });
  S.H.quest('Slime Meadow', [{text:'Calm the slimes', count:[BONK[0] + 1, BONK[1] + 1, BONK[2] + 1]}, {text:'Return to the guild'}], 2.0, 44.5);
  S.H.banner(35.2, 'LEVEL UP!', 'Lv 1 → Lv 2', '#F2B33E', 3.6);
  S.shield = shieldFx(S.L.fx, [{t:9.0, d:1.6, at:() => [pipi.X(9) + 80, 965], hit:9.55, col:'#FFC2D4'}]);
  S.slash = slashFx(S.L.fx, [{t:13.2, at:() => pos(0, 13.4).map((v, k) => v - [0, 50][k]), rot:-20, col:'#C9A7FF'}, {t:13.36, at:() => pos(0, 13.4).map((v, k) => v - [0, 50][k]), rot:200, col:'#C9A7FF'},
    {t:31.6, at:() => pos(2, 31.6).map((v, k) => v - [0, 50][k]), rot:-20, col:'#C9A7FF'}]);
  S.bolt = boltFx(S.L.fx, [{t:29.0, d:0.6, from:() => paw(otto.c, 1).map((v, k) => v - [0, 140][k]), to:() => pos(2, 29.6).map((v, k) => v - [0, 40][k]), col:'#8FE0F0', arc:80}]);
  S.burst = burstFx(S.L.fx, [{t:9.55, at:() => [pipi.X(9) + 110, 860], col:'#FFC2D4'}, {t:13.4, at:() => pos(0, 13.4), col:'#C9A7FF'}, {t:18.0, at:[860, 860], s:0.7, col:'#FFFFFF'},
    {t:24.9, at:() => pos(1, 24.9), col:'#FFB347', s:1.3}, {t:29.6, at:() => pos(2, 29.6), col:'#8FE0F0'}, {t:30.9, at:() => pos(2, 30.9), col:'#FFB347'}, {t:32.0, at:() => pos(2, 32.0), col:'#FFC2D4', s:1.5}]);
  S.heal = healFx(S.L.fx, [{t:20.8, d:2.2, at:() => [kuku.X(21), 960]}]);
  S.aura = auraFx(S.L.fx, all.map(a => ({t:35.0, d:3.0, at:() => [a.X(35), 965], col:'#FFE07A'})));
  S.ft = floatTxt(S.L.fx, [{t:9.6, at:() => [pipi.X(9) + 60, 760], text:'BLOCK!', col:'#FFC2D4'}, {t:13.6, at:() => pos(0, 13.6).map((v, k) => v - [0, 120][k]), text:'+10 EXP'},
    {t:18.1, at:[800, 740], text:'-5', col:'#FF8A8A'}, {t:21.4, at:() => [kuku.X(21), 720], text:'+5 HP', col:'#8FE0A8'}, {t:25.1, at:() => pos(1, 25.1).map((v, k) => v - [0, 120][k]), text:'+10 EXP'},
    {t:32.2, at:() => pos(2, 32.2).map((v, k) => v - [0, 130][k]), text:'COMBO! +20 EXP', size:52}]);
  S.hearts = heartBursts(S.L.fx, [{t:15.0, x:1260, y:820, n:3}, {t:26.4, x:1380, y:820, n:3}, {t:33.6, x:1640, y:820, n:3}, {t:40.0, x:960, y:700, n:6}]);
  S.sfx(2.0, 'page', 0.04, 0.6); TSL.forEach((t, i) => { SFXB.boing(S, t + 0.3, 0.6); SFXB.boing(S, t + 0.8, 0.6); });
  SFXB.boing(S, 9.0, 0.3); SFXB.shield(S, 9.55, 0.1); SFXB.slash(S, 13.2, 0.3); SFXB.hit(S, 13.4, 0.3);
  SFXB.boing(S, 17.3, 0.3); SFXB.hit(S, 18.0, -0.1); SFXB.heal(S, 20.8, -0.5); S.sfx(23.6, 'swish', 0.04, 0, {d:0.3}); SFXB.hit(S, 24.9, 0.3); S.sfx(24.9, 'thump', 0.06, 0.3, {f:80, d:0.3});
  SFXB.zap(S, 29.0, -0.3); SFXB.slash(S, 31.6, 0.5); SFXB.hit(S, 30.9, 0.5); SFXB.shield(S, 32.0, 0.6); SFXB.levelup(S, 35.2);
  BONK.forEach((t, i) => { S.sfx(t + 0.5, 'chime', 0.025, 0.4, {f:1318.5 + i*200}); SFXB.boing(S, t + 1.4, 0.5); });
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    SL.forEach((q, i) => { const b = BONK[i], p = POS[i](u);
      const dz = u > b && u < b + 1.0, hp = u > b + 1.0 && u < b + 1.9; const away = sm((u - b - 1.9)/1.2);
      const back = sm((u - 37.5 - i*0.4)/1.4);
      let x = p[0] + 500*away, y = 965 - p[1] - (hp ? 60*Math.abs(Math.sin(TAU*(u - b)*1.4)) : 0);
      if (u > 37.5){ x = lerp(1900, 1140 + i*190, back); y = 965 - 50*Math.abs(Math.sin(TAU*(u*1.2 + i*0.3))); }
      q.m.set(u, {x, y, s:0.9, hit: bump(u, b, 0.45) + (i === 0 ? bump(u, 9.55, 0.4) : 0), face: dz ? 'dizzy' : (u > b ? 'happy' : (u > TSL[i] + 1 ? 'mad' : null)), alpha: u < TSL[i] ? 0 : (u > 37.4 ? 1 : 1 - away), flip: u > 37.5 ? 1 : -1}); });
    S.shield(u); S.slash(u); S.bolt(u); S.burst(u); S.heal(u); S.aura(u); S.ft(u); S.hearts(u);
    FLASH.v = Math.max(FLASH.v, 0.2*bump(u, 32.0, 0.3) + 0.25*bump(u, 35.1, 0.4));
    S.H.update(u); S.H.post(u);
  };
})();

/* =================== SC4 — THE ADVENTURERS' GUILD =================== */
const SC4 = scene(135, 180, {look: u => [K(u, [[0, 960], [8, 900], [24, 960], [27, 960], [34, 960]]), K(u, [[0, 700], [26, 700], [29, 600], [36, 600], [38, 700]]), K(u, [[0, 1.05], [8, 1.12], [26, 1.15], [29, 1.6], [36, 1.6], [38.5, 1.12], [45, 1.18]])]});
(function(){
  const S = SC4;
  S.L = locHall(S.cam, {kind:'guild'});
  const ly = S.L.chars;
  S.amb('cafe', 0, 45, 0.5); S.amb('fire', 0, 45, 0.3);
  // the guild clerk: a very polite mushroom
  S.clerk = monster(ly, 'mushroom', {col:'#B79BE8'});
  S.deskG = G(ly); mk('rect', SK({x:-170, y:-120, width:340, height:120, rx:14, fill:'#B98552'}, 5), S.deskG); mk('rect', SK({x:-186, y:-134, width:372, height:22, rx:8, fill:'#9A6447'}, 4.4), S.deskG);
  pawPrint(S.deskG, 0, -60, 1.6, '#F2DDB0'); S.deskG.setAttribute('transform', 'translate(1500 990)');
  const momo = hero(S, 'momo', {layer:ly, x:[[0,-200],[5.0,560],[45,560]], y:970, steps:'woodstep'});
  const pipi = hero(S, 'pipi', {layer:ly, x:[[0,-360],[5.2,760],[45,760]], y:975, steps:'woodstep'});
  const kuku = hero(S, 'kuku', {layer:ly, x:[[0,-520],[5.4,960],[45,960]], y:970, steps:'woodstep'});
  const otto = hero(S, 'otto', {layer:ly, x:[[0,-680],[5.6,1160],[45,1160]], y:975, steps:'woodstep'});
  const all = [momo, pipi, kuku, otto];
  otto.item('L', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  // report → reward
  otto.do('talk', 7.0, 3.0, {gest:true}); [momo, pipi, kuku].forEach(a => a.do('look', 7, 4, {x:8, y:-2}));
  all.forEach((a, i) => { a.do('wow', 11.2 + i*0.15, 1.4); a.do('cheer', 13.0 + i*0.15, 2.6); });
  kuku.do('dance', 16.6, 4.4, {bpm:1.3}); pipi.do('clap', 16.6, 3.0); momo.do('shy', 17.0, 2.6);
  otto.do('photo', 20.0, 2.6, {item:'camera'}); [momo, pipi, kuku].forEach((a, i) => a.do('arms', 20.0, 2.6, {R:[90, -170], eyes:'happy', mouth:'open'}));
  // the quest board glows: a poster of a mage
  all.forEach((a, i) => { a.do('look', 25.4, 11, {x:[4, 2, -2, -4][i], y:-9}); a.do('wow', 26.4 + i*0.2, 1.4); });
  kuku.do('point', 30.0, 2.4, {at:[90, -190]}); momo.do('think', 31.0, 3.0); pipi.do('nod', 32.0, 2.0);
  all.forEach((a, i) => { a.do('wave', 38.2 + i*0.2, 4.6); a.do('happy', 42.8, 2.2, {mouth:'open'}); });
  S.H = hud(S);
  all.forEach(a => S.H.plate(a, {lv:2, show: u => u > 5.6 && u < 24}));
  S.H.banner(11.2, 'QUEST CLEAR!', 'Slime Meadow  ·  +50 Gold', '#7DC77A', 3.6);
  S.H.card(29.6, 'owli', {tag:'✦ NEXT TIME: THE MAGIC TOWER ✦', d:7.4, x:1400, y:180});
  // poster on the board (world space)
  S.poster = G(S.L.props, 'translate(1070 480)'); mk('rect', SK({x:-60, y:-56, width:120, height:112, rx:6, fill:'#EEE6FF'}, 4), S.poster);
  { const pc = G(S.poster, 'translate(0 22) scale(0.36)'); const ow = makeChar('owl', pc); pose(ow, {eyes:'happy', mouth:'open', still:true}); hatWizard(ow, '#5B4FB0'); glasses(ow); }
  S.posterGlow = mk('circle', {cx:1070, cy:480, r:180, fill:'url(#glowW)', opacity:0}, S.L.props);
  S.coins = Array.from({length:10}, (_, i) => { const c = G(S.L.fx); mk('circle', SK({r:16, fill:'#FFD24D'}, 3.4), c); mk('path', {d:STAR_D, fill:'#FFF2A8', transform:'scale(0.6)'}, c); c.style.display = 'none'; return c; });
  S.photo = photoFX(S, S.L.fx);
  S.spark = sparkles(S.L.fx, [{t:26.0, x:1070, y:480, n:8, r:130}, {t:12.0, x:1160, y:700, n:8, r:200}]);
  S.hearts = heartBursts(S.L.fx, [{t:14.0, x:860, y:640, n:4}, {t:41, x:860, y:620, n:5}]);
  S.sfx(5.8, 'doorbell', 0.03, -0.6); S.sfx(9.6, 'page', 0.04, 0.6); for (let i=0;i<10;i++) SFXB.coin(S, 11.4 + i*0.12, 0.4 - i*0.08); SFXB.levelup(S, 11.2);
  S.sfx(25.8, 'sparkle', 0.05, 0.1); S.sfx(29.6, 'chime', 0.03, 0, {f:1568});
  S.pre = u => S.L.update(u);
  S.post = u => {
    S.clerk.set(u, {x:1500, y:850, s:1.0, face: u > 10 && u < 16 ? 'happy' : null, hop: 20*bump(u, 11.0, 0.5)});
    S.coins.forEach((c, i) => { const v = (u - 11.4 - i*0.06)/1.2; show(c, v > 0 && v < 1.3);
      if (v > 0){ const p = arcP([1500, 760], [1160 - 160 + i*36, 820], Math.min(1, v), 220); T(c, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${(1 - 0.6*sm((v - 1)/0.3)).toFixed(3)})`); } });
    S.posterGlow.setAttribute('opacity', (0.8*rh(u, 25.4, 26.4, 37, 38.5)*(0.8 + 0.2*Math.sin(TAU*u*1.5))).toFixed(3));
    S.photo(u, [21.0], otto);
    S.spark(u); S.hearts(u);
    S.H.update(u); S.H.post(u);
  };
})();

EPISODE({day:13, title:'Welcome to Pawlandia', music:{seed:31, key:3, bpm:80, prog:2}, thumb:120,
  chapters:[['A Mysterious Game', g => itGameBook(G(g, 'scale(0.42)'))],
            ['Choose Your Class', g => clsIcon(g, 'assassin', 1)],
            ['Slime Meadow', g => { mk('path', S4({d:'M-16 8 Q-18 -10 0 -14 Q18 -10 16 8 Z', fill:'#8FE08A'}), g); mk('circle', {cx:-5, cy:-2, r:2.5, fill:OL}, g); mk('circle', {cx:5, cy:-2, r:2.5, fill:OL}, g); }],
            ['The Adventurers’ Guild', g => clsIcon(g, 'paladin', 1)]],
  scenes:[SC1, SC2, SC3, SC4]});
