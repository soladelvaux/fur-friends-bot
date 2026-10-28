/* =====================================================================
   FUR FRIENDS — Day 4: "Seaside Picnic"   (180 s)
   ===================================================================== */
DEFS = $('defs');
const EP = {day: 4, title: 'Seaside Picnic'};
const DUR = 180;
rad('glowW', [[0,'#FFF6D8',0.9],[0.5,'#FFE9B0',0.35],[1,'#FFE9B0',0]]);
rad('glowLamp', [[0,'#FFE3A3',0.85],[0.45,'#FFC977',0.3],[1,'#FFC977',0]]);
rad('vig', [[0.66,'#000',0],[1,'#3a1d10',0.14]]);
(function(){ const pat = mk('pattern', {id:'ging2', width:60, height:60, patternUnits:'userSpaceOnUse'}, DEFS);
  mk('rect', {width:60, height:60, fill:'#FFF6F4'}, pat); mk('rect', {width:30, height:60, fill:'#F2707F', opacity:0.42}, pat); mk('rect', {width:60, height:30, fill:'#F2707F', opacity:0.42}, pat); })();
const SCN = $('scenes');
function newScene(t0, t1){ const s = {t0, t1}; s.g = G(SCN); s.cam = G(s.g); s.g.style.display = 'none'; return s; }
function camZoom(S, cx, cy, z){ T(S.cam, `translate(${cx} ${cy}) scale(${z.toFixed(4)}) translate(${-cx} ${-cy})`); }
const FLASH = {v: 0};
function flyItem(el, u, t0, d, a, b, h, spin){
  const v = (u - t0)/d;
  if (v > 0 && v < 1){ show(el, true); const p = arcP(a, b, v, h); T(el, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${((spin||0)*v).toFixed(1)})`); return true; }
  show(el, false); return false;
}
function picnicBlanket(parent, cx, cy){
  const g = G(parent, `translate(${cx} ${cy})`);
  mk('ellipse', SK({cx:0, cy:0, rx:470, ry:78, fill:'url(#ging2)'}, 5), g);
  mk('ellipse', {cx:0, cy:0, rx:440, ry:66, fill:'none', stroke:'#FFFFFF', 'stroke-width':4, 'stroke-dasharray':'12 10', opacity:0.8}, g);
  return g;
}

/* =================== SC1 — OFF TO THE SEA (trail) =================== */
const SC1 = newScene(0, 45);
const GX1 = [[0,300],[11,1370],[16.6,1370],[27.4,2600],[45,2600]];
const OFF1 = {kuku:330, pipi:140, momo:-60, otto:-260};
(function(){
  const S = SC1;
  S.L = locTrail(S.cam);
  S.otto = makeChar('otter', S.L.chars); S.momo = makeChar('cat', S.L.chars);
  S.pipi = makeChar('bunny', S.L.chars); S.kuku = makeChar('squirrel', S.L.chars);
  attach(S.momo, 1, 'basket', itBasket(G(null, 'translate(0 30)')));
  attach(S.otto, 1, 'camera', itCamera(G(null, 'translate(-20 -6)')));
  attach(S.kuku, 1, 'flower', itFlower(G(null, 'translate(0 -8)'), '#FFB3C7'));
  attach(S.pipi, 1, 'flower', itFlower(G(null, 'translate(0 -8)'), '#FFB3C7'));
  S.groundFlower = itFlower(G(S.L.near, 'translate(1726 960) scale(1.1)'), '#FFB3C7');
  S.groundFlowerG = S.groundFlower.parentNode;
  S.L.near.insertBefore(S.groundFlowerG, S.L.chars);
  S.flash = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:15.0, x:1530, y:700, n:3}, {t:38.4, x:2620, y:660, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:28.6, x:2900, y:640, n:6, r:120}, {t:12.2, x:1726, y:930, n:4, r:40}]);
  S.notes = []; for (let i=0;i<3;i++) S.notes.push(mk('path', {d:NOTE_D, fill:['#B9A3F0','#FF9DB5','#8FD6C4'][i], stroke:OL, 'stroke-width':2.4, opacity:0}, S.L.fx));
})();
SC1.update = function(u){
  const S = this;
  const gx = K(u, GX1);
  const sp = (K(u + 0.05, GX1) - K(u - 0.05, GX1))/0.1;
  const amt = clamp(Math.abs(sp)/60, 0, 1);
  const camX = clamp(gx - 900, 0, 1700);
  camZoom(S, 960, 760, K(u, [[0,1.1],[45,1.06]]));
  S.L.update(u, camX);
  const y = 960, s = 0.92;
  const cheer = rh(u, 37.6, 38.0, 41.6, 42.2);
  const wow = rh(u, 28.2, 28.8, 31.6, 32.4);
  /* KUKU leading, picks a flower */
  const pick = rh(u, 11.4, 12.0, 12.4, 12.8);
  const turn = u > 13.0 && u < 15.6;
  const give = rh(u, 13.6, 14.2, 14.6, 15.2);
  const hasF = u > 12.2 && u < 14.7;
  pose(S.kuku, {x: gx + OFF1.kuku, y, s, walk:(gx + OFF1.kuku)/80, walkAmt:amt, flip: turn ? -1 : 1,
    hop: 10*amt*Math.abs(Math.sin(TAU*(gx/160))) + hopF(u, 38.0, 0.5, 40) + hopF(u, 39.0, 0.5, 34),
    bt: 14*pick, tilt: 10*pick, tR: lerpP(lerpP(lerpP([36,-56], [70, -14], pick), [96, -116], give), [90, -186], cheer), tL: lerpP([-36,-56], [-90,-186], cheer),
    R: hasF ? 'flower' : null, eyes: pick > 0.4 || give > 0.4 || cheer > 0.3 || wow > 0.3 ? 'happy' : 'open',
    mouth: cheer > 0.3 || wow > 0.3 || give > 0.3 ? 'open' : 'smile', lookY: pick > 0.3 ? 6 : 0});
  show(S.groundFlowerG, u < 12.2);
  /* PIPI with headphones, gets the flower */
  const bob = Math.sin(TAU*0.55*u)*(1 - wow);
  const gotF = u > 14.7;
  const smell = rh(u, 15.2, 15.8, 17.0, 17.6);
  pose(S.pipi, {x: gx + OFF1.pipi, y, s, walk:(gx + OFF1.pipi)/86, walkAmt:amt, phones:true, hop: hopF(u, 38.3, 0.5, 30),
    tR: lerpP(lerpP(gotF ? [44, -96] : [36,-56], [10, -124], smell), [90,-186], cheer), tL: lerpP([-36,-56], [-90,-186], cheer), R: gotF ? 'flower' : null,
    tilt: 5*bob, ear: 5*bob, eyes: (u > 14.4 && u < 18) || cheer > 0.3 || wow > 0.3 || amt > 0.3 ? 'happy' : 'open', mouth: give > 0.3 || wow > 0.3 || cheer > 0.3 ? 'open' : 'smile', lookX: (u > 13 && u < 15.6) ? 5 : 0});
  S.notes.forEach((n, i) => {
    const v = mod(u*0.32 + i/3, 1), side = i % 2 ? 1 : -1, hp = headW(S.pipi, 0, -60);
    T(n, `translate(${(hp[0] + side*(80 + 30*v)).toFixed(1)} ${(hp[1] - 110*v).toFixed(1)}) rotate(${side*12*Math.sin(TAU*v)})`);
    n.setAttribute('opacity', (Math.sin(Math.PI*v)*0.9*(1 - wow)*(u < 36 ? 1 : 0)).toFixed(3));
  });
  /* MOMO with the basket */
  pose(S.momo, {x: gx + OFF1.momo, y, s, walk:(gx + OFF1.momo)/86 + 0.3, walkAmt:amt, tR:[40, -66], R:'basket', tL: lerpP([-36,-56], [-96, -186 + 12*Math.sin(TAU*2.2*u)], cheer),
    eyes: wow > 0.3 || cheer > 0.3 || (u > 14.6 && u < 16.4) ? 'happy' : 'open', mouth: wow > 0.3 || cheer > 0.3 ? 'open' : 'smile', lookX: 3});
  /* OTTO with camera */
  const photo1 = rh(u, 4.0, 4.6, 5.6, 6.2), photo2 = rh(u, 32.4, 33.2, 35.2, 36.0);
  const ph = Math.max(photo1, photo2);
  pose(S.otto, {x: gx + OFF1.otto, y, s, walk:(gx + OFF1.otto)/86 + 0.6, walkAmt:amt, hop: hopF(u, 38.6, 0.5, 32),
    tR: lerpP(lerpP([34,-56], [14, -140], ph), [90,-186], cheer), tL: lerpP(lerpP([-34,-56], [-22, -136], ph), [-90,-186], cheer), R: ph > 0.2 ? 'camera' : null,
    eyes: (u > 5.0 && u < 6.6) || (u > 34.4 && u < 36.4) || cheer > 0.3 || wow > 0.3 ? 'happy' : 'open', mouth: wow > 0.3 || cheer > 0.3 ? 'open' : 'smile', lookY: photo1 > 0.3 ? -4 : 0});
  const fl = Math.max(bump(u, 5.0, 0.35), bump(u, 34.4, 0.35)), cp = paw(S.otto, 1);
  S.flash.setAttribute('opacity', fl.toFixed(3)); T(S.flash, `translate(${cp[0] - 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, 0.18*fl);
  S.hearts(u); S.spark(u);
};

/* =================== SC2 — SEASIDE PICNIC (meadow) =================== */
const SC2 = newScene(45, 90);
const SEAT2 = [640, 840, 1080, 1280];
const FOODPOS = [[690, 1012], [880, 1018], [1040, 1018], [1230, 1012]];
(function(){
  const S = SC2;
  S.L = locSeaside(S.cam, {tod:'day', ground:'grass'});
  S.blanket = picnicBlanket(S.L.chars, 960, 955);
  S.strip = G(S.L.chars);
  S.stripO = mk('path', {fill:'none', stroke:OL, 'stroke-width':74, 'stroke-linecap':'round'}, S.strip);
  S.stripF = mk('path', {fill:'none', stroke:'url(#ging2)', 'stroke-width':64, 'stroke-linecap':'round'}, S.strip);
  S.cast = [makeChar('cat', S.L.chars), makeChar('bunny', S.L.chars), makeChar('squirrel', S.L.chars), makeChar('otter', S.L.chars)];
  S.momo = S.cast[0]; S.pipi = S.cast[1]; S.kuku = S.cast[2]; S.otto = S.cast[3];
  S.held = S.cast.map((c, i) => attach(c, 1, 'food', (i === 1 || i === 2) ? itMelon(G()) : itSandwich(G())));
  attach(S.otto, -1, 'camera', itCamera(G(null, 'translate(20 -6)')));
  S.basket = itBasket(G(S.L.front, 'translate(960 1010) scale(1.3)'));
  S.foods = FOODPOS.map((p, i) => { const f = (i === 1 || i === 2) ? itMelon(G(S.L.front)) : itSandwich(G(S.L.front)); return f.parentNode; });
  S.flash = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:38.2, x:960, y:660, n:5}, {t:22.0, x:860, y:700, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:8.6, x:960, y:950, n:6, r:200}, {t:16.2, x:960, y:980, n:5, r:120}]);
})();
SC2.update = function(u){
  const S = this;
  camZoom(S, 960, 820, K(u, [[0,1.08],[45,1.16]]));
  S.L.update(u, {});
  const hold = rh(u, 2.0, 2.8, 6.6, 7.4);
  const land = sm((u - 7.0)/1.2);
  // blanket
  const k = clamp(land + 0.08*Math.sin(TAU*(u - 8.2)*2.2)*bump(u, 8.2, 0.9), 0.02, 1.1);
  T(S.blanket, `translate(960 955) scale(1 ${k.toFixed(4)})`);
  S.blanket.setAttribute('opacity', sm((u - 6.8)/0.4).toFixed(3));
  // walk-in positions
  const mx = K(u, [[0,470],[8.6,470],[10.6,SEAT2[0]]]), ox = K(u, [[0,1450],[8.6,1450],[10.6,SEAT2[3]]]);
  const mv = Math.abs(K(u + 0.05, [[0,470],[8.6,470],[10.6,SEAT2[0]]]) - mx) > 0.2, ov = Math.abs(K(u + 0.05, [[0,1450],[8.6,1450],[10.6,SEAT2[3]]]) - ox) > 0.2;
  const xs = [mx, SEAT2[1], SEAT2[2], ox];
  const selfie = rh(u, 33.0, 33.8, 39.4, 40.2);
  const lean = sm((u - 35)/1.0)*(1 - sm((u - 39.6)/0.8));
  S.cast.forEach((c, i) => {
    const pickT = 17.0 + i*0.45;
    const hasFood = u > pickT + 0.5;
    const per = 3.2, off = i*0.8, w = mod(u - pickT - 0.8 - off, per);
    const active = hasFood && u < 31.4;
    const up = active ? bump(w, 0.2, 1.4) : 0;
    const chewing = active && w > 1.0 && w < 2.6;
    let bites = 0; if (hasFood) bites = clamp(Math.floor((u - pickT - 0.8 - off - 1.0)/per) + 1, 0, 4);
    T(S.held[i].body || S.held[i], `scale(${(1 - 0.22*bites).toFixed(3)})`);
    const reach = rh(u, pickT - 0.3, pickT + 0.2, pickT + 0.4, pickT + 0.9);
    const fd = toLocal({x:xs[i], y:935, s:1}, FOODPOS[i][0], FOODPOS[i][1]);
    let tR = lerpP([36,-56], fd, reach);
    tR = lerpP(tR, [6, -122], up);
    let tL = [-36, -56];
    if (i === 0) tR = lerpP(tR, [80, -190], hold);
    if (i === 3){ tL = lerpP(tL, [-80, -190], hold); }
    const lnDir = [1, 1, -1, -1][i];
    if (i === 3 && selfie > 0){ tL = lerpP(tL, [-30, -150], selfie); }
    else if (selfie > 0){ tR = lerpP(tR, [80, -180 + 10*Math.sin(TAU*2*u + i)], selfie*(i === 1 ? 1 : 0.6)); }
    pose(c, {x: xs[i] + lnDir*20*lean, y:935, s:1, walk: (i === 0 && mv) || (i === 3 && ov) ? xs[i]/86 : null, walkAmt:1,
      bt: lnDir*6*lean, tilt: lnDir*8*lean + (chewing ? 4 : 0),
      tR, tL, R: hasFood && bites < 4 ? 'food' : null, L: i === 3 && selfie > 0.2 ? 'camera' : null,
      phones: i === 1, eyes: chewing || selfie > 0.4 || (u > 8.4 && u < 10) || (u > 13 && u < 16.5) ? 'happy' : 'open',
      mouth: chewing ? 'chew' : (selfie > 0.4 || (u > 13 && u < 16.5) ? 'open' : 'smile'), chew: 0.5 + 0.5*Math.sin(TAU*3*u + i),
      lookX: selfie > 0.3 ? 0 : (u > 12 && u < 17 ? clamp((960 - xs[i])/40, -6, 6) : 0), lookY: (u > 12 && u < 17) ? 5 : 0,
      hop: (i === 2) ? hopF(u, 13.0, 0.45, 26) + hopF(u, 38.6, 0.45, 26) : 0});
  });
  // blanket strip held between Momo and Otto
  if (hold > 0.02 && land < 0.95){
    show(S.strip, true);
    const a = paw(S.momo, 1), b = paw(S.otto, -1);
    const drop = 120*land;
    const wv = 30*Math.sin(TAU*u*0.9)*hold;
    const d = `M${a[0].toFixed(1)} ${(a[1] + drop).toFixed(1)} Q${((a[0] + b[0])/2).toFixed(1)} ${((a[1] + b[1])/2 + 60 + wv + drop).toFixed(1)} ${b[0].toFixed(1)} ${(b[1] + drop).toFixed(1)}`;
    S.stripO.setAttribute('d', d); S.stripF.setAttribute('d', d);
    S.strip.setAttribute('opacity', (Math.min(1, hold*1.6)*(1 - land)).toFixed(3));
  } else show(S.strip, false);
  // food from basket
  S.foods.forEach((f, i) => {
    const t0 = 12.6 + i*0.6, pickT = 17.0 + i*0.45;
    if (u < t0){ show(f, false); return; }
    if (u > pickT + 0.5){ show(f, false); return; }
    show(f, true);
    if (u < t0 + 0.8){ const p = arcP([960, 960], FOODPOS[i], (u - t0)/0.8, 90); T(f, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${(0.6 + 0.4*sm((u - t0)/0.8)).toFixed(3)})`); }
    else T(f, `translate(${FOODPOS[i][0]} ${FOODPOS[i][1]})`);
  });
  const fl = bump(u, 37.6, 0.35), cp = paw(S.otto, -1);
  S.flash.setAttribute('opacity', fl.toFixed(3)); T(S.flash, `translate(${cp[0] + 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, 0.22*fl);
  S.hearts(u); S.spark(u);
};

/* =================== SC3 — BEACH TIME (sand) =================== */
const SC3 = newScene(90, 135);
const CAS = [960, 1040];
(function(){
  const S = SC3;
  S.L = locSeaside(S.cam, {tod:'day', ground:'sand'});
  // umbrella + towel (behind chars)
  const um = G(S.L.chars, 'translate(400 1000)');
  mk('ellipse', SK({cx:20, cy:-4, rx:150, ry:30, fill:'#9FD3F5'}, 4), um);
  mk('path', {d:'M-110 -4 H150', stroke:'#FFFFFF', 'stroke-width':10, opacity:0.6}, um);
  S.umbrellaTop = G(S.L.front, 'translate(400 1000)');
  mk('path', {d:'M0 0 L18 -330', stroke:OL, 'stroke-width':10, 'stroke-linecap':'round'}, S.umbrellaTop);
  mk('path', {d:'M0 0 L18 -330', stroke:'#FFFFFF', 'stroke-width':5, 'stroke-linecap':'round'}, S.umbrellaTop);
  const can = G(S.umbrellaTop, 'translate(18 -330) rotate(6)');
  mk('path', SK({d:'M-170 40 Q0 -90 170 40 Q140 26 113 40 Q85 26 57 40 Q28 26 0 40 Q-28 26 -57 40 Q-85 26 -113 40 Q-140 26 -170 40 Z', fill:'#FFFFFF'}), can);
  [[-170,-113,'#FF9AA2'],[-57,0,'#FF9AA2'],[57,113,'#FF9AA2']].forEach(a => mk('path', {d:`M${a[0]} 40 Q${(a[0]+a[1])/2} 24 ${a[1]} 40 L0 -48 Z`, fill:a[2], opacity:0.9}, can));
  mk('path', {d:'M-170 40 Q0 -90 170 40', fill:'none', stroke:OL, 'stroke-width':4.6}, can);
  S.momo = makeChar('cat', S.L.chars); S.pipi = makeChar('bunny', S.L.chars); S.kuku = makeChar('squirrel', S.L.chars);
  S.otto = makeChar('otter', S.L.swim);
  attach(S.momo, 1, 'book', itBook(G(null, 'translate(-14 -8)'), '#B79BE8'));
  attach(S.pipi, 1, 'shovel', itShovel(G(), '#FFB3C7'));
  attach(S.pipi, 1, 'bucket', itBucket(G(null, 'translate(0 6)'), '#FFB3C7'));
  attach(S.kuku, -1, 'shovel', itShovel(G(null, 'scale(-1 1)'), '#FFD27A'));
  attach(S.kuku, -1, 'bucket', itBucket(G(null, 'translate(0 6)'), '#9FD3F5'));
  attach(S.otto, 1, 'shell', itShell(G(null, 'translate(0 -6) scale(1.2)')));
  attach(S.kuku, 1, 'shell', itShell(G(null, 'translate(0 -6) scale(1.2)')));
  // sandcastle
  const C = G(S.L.front, `translate(${CAS[0]} ${CAS[1]})`); S.castle = C;
  const sandC = '#EBC98E', sandD = '#D9B176';
  S.st = [G(C), G(C), G(C), G(C), G(C), G(C)];
  mk('path', SK({d:'M-110 0 Q-100 -46 0 -54 Q100 -46 110 0 Z', fill:sandC}), S.st[0]);
  mk('path', SK({d:'M-96 0 L-96 -64 L-70 -64 L-70 -78 L-48 -78 L-48 -64 L-12 -64 L-12 -78 L12 -78 L12 -64 L48 -64 L48 -78 L70 -78 L70 -64 L96 -64 L96 0 Z', fill:sandC}), S.st[1]);
  mk('path', {d:'M-90 -30 H90', stroke:sandD, 'stroke-width':3}, S.st[1]);
  mk('path', SK({d:'M-16 0 L-16 -30 Q0 -46 16 -30 L16 0 Z', fill:'#C99B62'}, 3.5), S.st[1]);
  [[-62, S.st[2]], [62, S.st[3]]].forEach(a => { mk('path', SK({d:`M${a[0]-30} -60 L${a[0]-24} -130 L${a[0]+24} -130 L${a[0]+30} -60 Z`, fill:sandC}), a[1]); mk('path', SK({d:`M${a[0]-26} -130 L${a[0]-26} -146 L${a[0]-12} -146 L${a[0]-12} -136 L${a[0]+12} -136 L${a[0]+12} -146 L${a[0]+26} -146 L${a[0]+26} -130 Z`, fill:sandC}, 3.5), a[1]); mk('path', {d:`M${a[0]-24} -96 H${a[0]+24}`, stroke:sandD, 'stroke-width':3}, a[1]); });
  mk('path', {d:'M62 -146 L62 -200', stroke:OL, 'stroke-width':4}, S.st[4]);
  mk('path', SK({d:'M62 -200 L100 -188 L62 -176 Z', fill:'#FF7C9C'}, 3), S.st[4]);
  itShell(G(S.st[5], 'translate(0 -36) scale(1.1)'));
  S.stFns = S.st.map((g, i) => g);
  S.flyBucket = G(S.L.fx); itBucket(S.flyBucket, '#9FD3F5');
  S.flyBucket2 = G(S.L.fx); itBucket(S.flyBucket2, '#FFB3C7');
  S.flyShell = G(S.L.fx); itShell(G(S.flyShell, 'scale(1.2)'));
  S.flyShell2 = G(S.L.fx); itShell(G(S.flyShell2, 'scale(1.2)'));
  S.splashG = G(S.L.waterFront);
  S.rings = [0,1,2].map(() => mk('ellipse', {rx:10, ry:4, fill:'none', stroke:'#FFFFFF', 'stroke-width':5, opacity:0}, S.splashG));
  S.drops = [0,1,2,3,4,5].map(() => mk('circle', {r:7, fill:'#FFFFFF', stroke:'#8FD8F5', 'stroke-width':2, opacity:0}, S.splashG));
  S.flashS = null;
  S.hearts = heartBursts(S.L.fx, [{t:31.4, x:1080, y:760, n:3}, {t:40.6, x:960, y:760, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:12.3, x:CAS[0] - 62, y:CAS[1] - 120, n:4, r:50}, {t:17.4, x:CAS[0] + 62, y:CAS[1] - 120, n:4, r:50}, {t:19.6, x:CAS[0] + 70, y:CAS[1] - 200, n:5, r:50}, {t:33.0, x:CAS[0], y:CAS[1] - 40, n:6, r:70}, {t:11.8, x:1560, y:660, n:5, r:60}]);
})();
function splash(S, u, t0, x, y){
  const v = (u - t0)/0.9;
  S.rings.forEach((r, i) => { const w = v - i*0.15; if (w <= 0 || w >= 1){ r.setAttribute('opacity', 0); return; } r.setAttribute('cx', x); r.setAttribute('cy', y); r.setAttribute('rx', (20 + 80*w).toFixed(1)); r.setAttribute('ry', (6 + 18*w).toFixed(1)); r.setAttribute('opacity', (1 - w).toFixed(3)); });
  S.drops.forEach((d, i) => { if (v <= 0 || v >= 1){ d.setAttribute('opacity', 0); return; } const a = -Math.PI/2 + (i - 2.5)*0.4; d.setAttribute('cx', (x + 90*v*Math.cos(a)).toFixed(1)); d.setAttribute('cy', (y - 120*v*Math.sin(-a) + 200*v*v).toFixed(1)); d.setAttribute('opacity', (1 - v).toFixed(3)); });
}
SC3.update = function(u){
  const S = this;
  camZoom(S, 960, 820, K(u, [[0,1.06],[45,1.12]]));
  const surge = 150*bump(u, 36.4, 4.0);
  S.L.update(u, {surge});
  // castle stages
  const stT = [4.0, 7.6, 12.2, 17.2, 19.6, 33.0];
  S.st.forEach((g, i) => {
    const v = (u - stT[i])/0.45;
    if (v <= 0){ show(g, false); return; }
    show(g, true);
    const sc = Math.min(1, sm(v)) + 0.14*bump(u, stT[i], 0.7);
    const py = i === 4 ? -146 : (i >= 2 ? -60 : 0);
    T(g, `translate(0 ${py}) scale(${sc.toFixed(3)}) translate(0 ${-py})`);
  });
  if (u > stT[0] && u < stT[1]) T(S.st[0], `scale(${(0.6 + 0.4*sm((u - stT[0])/3.4)).toFixed(3)})`);
  show(S.st[0], u > stT[0] && u < stT[1] + 0.3);
  const look = rh(u, 36.2, 36.6, 39.6, 40.2);
  const cheer = rh(u, 39.6, 40.0, 43.4, 44.0);
  /* KUKU: dig, bucket tower, flag, place shell */
  const dig = rh(u, 1.6, 2.2, 6.6, 7.2);
  const lift = rh(u, 9.4, 10.0, 10.8, 11.2);
  const flagP = rh(u, 18.8, 19.2, 19.8, 20.2);
  const shellPlace = rh(u, 31.8, 32.3, 32.8, 33.2);
  const dw = Math.sin(TAU*u*2.2);
  let ktL = lerpP([-36,-56], [-70 + 8*dw, -20 + 10*Math.abs(dw)], dig);
  ktL = lerpP(ktL, [-40, -186], lift);
  ktL = lerpP(ktL, [-70, -120], flagP);
  let ktR = lerpP([36,-56], [-20, -60], shellPlace);
  ktR = lerpP(ktR, [90, -186], cheer); ktL = lerpP(ktL, [-90, -186], cheer);
  const kHasShell = u > 31.4 && u < 32.9;
  pose(S.kuku, {x:1110, y:1000, s:0.95, tL: ktL, tR: ktR, L: dig > 0.1 ? 'shovel' : (u > 8.6 && u < 11.0 ? 'bucket' : null), R: kHasShell ? 'shell' : null,
    bt: -8*dig - 6*shellPlace, tilt: -6*dig, lookX: look > 0.3 ? 4 : -5, lookY: look > 0.3 ? -3 : 5,
    hop: hopF(u, 12.4, 0.45, 26) + hopF(u, 40.0, 0.45, 40) + hopF(u, 41.0, 0.45, 32),
    eyes: cheer > 0.3 || (u > 12.3 && u < 14) || (u > 33 && u < 35) ? 'happy' : 'open', mouth: cheer > 0.3 || (u > 33 && u < 35) ? 'open' : (look > 0.3 ? 'small' : 'smile'),
    excl: rh(u, 36.2, 36.4, 37.2, 37.6), sweat: look*0.8});
  flyItem(S.flyBucket, u, 11.0, 1.0, paw(S.kuku, -1), [CAS[0] - 62, CAS[1] - 100], 120, 180);
  /* PIPI: pat, bucket tower, clap */
  const pat = rh(u, 5.4, 6.0, 8.6, 9.2);
  const lift2 = rh(u, 14.4, 15.0, 15.8, 16.2);
  const clap = Math.max(rh(u, 33.2, 33.6, 35.2, 35.6), cheer);
  const cl = Math.abs(Math.sin(TAU*2.4*u));
  const pw = Math.abs(Math.sin(TAU*u*2.6));
  let ptR = lerpP([36,-56], [70, -30 + 12*pw], pat);
  ptR = lerpP(ptR, [40, -186], lift2);
  let ptL = [-36, -56];
  ptR = lerpP(ptR, [6 + 18*cl, -104], clap); ptL = lerpP(ptL, [-6 - 18*cl, -104], clap);
  pose(S.pipi, {x:810, y:1000, s:0.95, tR: ptR, tL: ptL, R: pat > 0.1 ? 'shovel' : (u > 13.6 && u < 16.0 ? 'bucket' : null), bt: 8*pat, tilt: 6*pat,
    lookX: look > 0.3 ? 4 : 5, lookY: look > 0.3 ? -3 : 5, hop: hopF(u, 17.4, 0.45, 22) + hopF(u, 40.2, 0.45, 36),
    eyes: clap > 0.3 || (u > 17.3 && u < 19) ? 'happy' : 'open', mouth: clap > 0.3 ? 'open' : (look > 0.3 ? 'small' : 'smile'), ear: 6*Math.sin(TAU*u*0.5),
    excl: rh(u, 36.2, 36.4, 37.2, 37.6), sweat: look*0.8});
  flyItem(S.flyBucket2, u, 16.0, 1.0, paw(S.pipi, 1), [CAS[0] + 62, CAS[1] - 100], 120, -180);
  /* MOMO reading under the umbrella */
  const flipPg = [8, 16, 24].some(t0 => u > t0 && u < t0 + 0.6);
  const wave = rh(u, 12.0, 12.4, 14.0, 14.6) + rh(u, 26.0, 26.4, 28.0, 28.6);
  pose(S.momo, {x:430, y:990, s:0.95, tR: lerpP([16, -100], [36, -56], Math.max(wave, cheer)), R: wave < 0.3 && cheer < 0.3 ? 'book' : null,
    tL: lerpP(lerpP([-36,-56], [-96, -186 + 12*Math.sin(TAU*2.2*u)], wave), [-96, -186 + 12*Math.sin(TAU*2.2*u)], cheer),
    lookY: wave > 0.3 || cheer > 0.3 ? -2 : 6, lookX: wave > 0.3 ? 6 : 0, hy: 4, eyes: wave > 0.3 || cheer > 0.3 || flipPg ? 'happy' : 'open', mouth: wave > 0.3 || cheer > 0.3 ? 'open' : 'smile',
    excl: rh(u, 36.2, 36.4, 37.2, 37.6)});
  /* OTTO swimming → shell → beach */
  const onBeach = u >= 24.0;
  const want = onBeach ? S.L.chars : S.L.swim;
  if (S.otto.root.parentNode !== want) want.appendChild(S.otto.root);
  let ox, oy, os, oh = 0, oWalk = null;
  if (u < 22.0){
    ox = 1560 + 120*Math.sin(TAU*u/14); oy = 768 + 6*Math.sin(TAU*u*0.8); os = 0.8;
    const dive = rh(u, 8.0, 8.6, 11.0, 11.8);
    oy += 220*dive; oh = hopF(u, 7.6, 0.6, 30);
  } else if (u < 24.0){ const v = (u - 22)/2; ox = lerp(1560 + 120*Math.sin(TAU*22/14), 1480, sm(v)); oy = lerp(768, 800, sm(v)); os = lerp(0.8, 0.84, sm(v)); oWalk = ox/70; }
  else { const v = clamp((u - 24)/4.6, 0, 1); ox = lerp(1480, 1300, sm(v)); oy = lerp(800, 1000, sm(v)); os = lerp(0.84, 0.95, sm(v)); oWalk = v < 1 ? ox/80 : null; }
  const hasShell = u > 11.6 && u < 31.0;
  const show2 = rh(u, 12.0, 12.6, 14.0, 14.6);
  const oWave = rh(u, 19.0, 19.4, 21.0, 21.6);
  const paddle = u < 22 ? Math.sin(TAU*u*1.1) : 0;
  let otR = u < 22 ? [50 + 10*paddle, -100 + 8*Math.cos(TAU*u*1.1)] : [36, -56];
  let otL = u < 22 ? [-50 - 10*paddle, -100 - 8*Math.cos(TAU*u*1.1)] : [-36, -56];
  otR = lerpP(otR, [40, -186], show2);
  otL = lerpP(otL, [-96, -186 + 12*Math.sin(TAU*2.2*u)], oWave);
  const giveO = rh(u, 30.0, 30.5, 30.9, 31.3);
  otR = lerpP(otR, [-80, -110], giveO);
  otR = lerpP(otR, [90, -186], cheer); otL = lerpP(otL, [-90, -186], cheer);
  pose(S.otto, {x:ox, y:oy, s:os, hop:oh, walk:oWalk, walkAmt:1, feet: onBeach, tR: otR, tL: otL, R: hasShell ? 'shell' : null,
    eyes: show2 > 0.3 || oWave > 0.3 || cheer > 0.3 ? 'happy' : 'open', mouth: show2 > 0.3 || oWave > 0.3 || cheer > 0.3 || giveO > 0.3 ? 'open' : 'smile',
    lookX: u > 24 ? -6 : -3, hop: oh + hopF(u, 40.4, 0.45, 30), excl: rh(u, 36.2, 36.4, 37.2, 37.6)});
  splash(S, u, 8.5, 1560 + 120*Math.sin(TAU*8.5/14), 745);
  if (u > 11.2 && u < 12.6) splash(S, u, 11.4, 1560 + 120*Math.sin(TAU*11.4/14), 745);
  flyItem(S.flyShell, u, 31.0, 0.45, paw(S.otto, 1), paw(S.kuku, 1), 40, 0);
  flyItem(S.flyShell2, u, 32.9, 0.3, paw(S.kuku, 1), [CAS[0], CAS[1] - 36], 20, 0);
  S.hearts(u); S.spark(u);
};

/* =================== SC4 — SUNSET GLOW =================== */
const SC4 = newScene(135, 180);
const SEAT4 = [660, 860, 1070, 1270];
(function(){
  const S = SC4;
  S.L = locSeaside(S.cam, {tod:'sunset', ground:'grass'});
  picnicBlanket(S.L.chars, 960, 965);
  S.cast = [makeChar('cat', S.L.chars), makeChar('bunny', S.L.chars), makeChar('otter', S.L.chars), makeChar('squirrel', S.L.chars)];
  S.cast.forEach((c, i) => attach(c, -1, 'mug', (() => { const m = itMug(G(), ['#C7B3F5','#FFB3C7','#9FC8F0','#FFB47A'][i], '#C98A5A'); if (i === 0) catMotif(m, 0, 3); return m; })()));
  attach(S.cast[2], 1, 'camera', itCamera(G(null, 'translate(-20 -6)')));
  itBasket(G(S.L.front, 'translate(960 1020) scale(1.3)'));
  S.steams = S.cast.map(() => steam(S.L.fx, 2));
  S.z1 = zText(S.L.fx); S.z2 = zText(S.L.fx);
  S.flies = []; for (let i=0;i<26;i++) S.flies.push({el: mk('circle', {r:R(3,6), fill:'#FFF2A0'}, S.L.fx), glow: mk('circle', {r:R(14,22), fill:'url(#glowLamp)'}, S.L.fx), x0:R(100,1820), y0:R(700,1060), ph:rnd()});
  S.flash = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:14.0, x:960, y:700, n:3}, {t:35.0, x:760, y:700, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:22.0, x:1250, y:560, n:6, r:110}]);
})();
SC4.update = function(u){
  const S = this;
  camZoom(S, 960, 800, K(u, [[0,1.14],[45,1.24]]));
  const sunY = K(u, [[0,360],[30,640]]);
  const dusk = sm((u - 14)/22);
  S.L.update(u, {sunY, dusk});
  const lean = sm((u - 29)/2.5);
  const yawnT = [33.0, 27.5, 31.0, 25.5];
  S.cast.forEach((c, i) => {
    const sipT = 2.0 + i*1.3 + (u > 14 ? 9 : 0);
    const sip = rh(u, 2.0 + i*1.3, 2.8 + i*1.3, 3.8 + i*1.3, 4.6 + i*1.3) + rh(u, 15 + i*1.5, 15.8 + i*1.5, 16.8 + i*1.5, 17.6 + i*1.5);
    const yawn = rh(u, yawnT[i], yawnT[i] + 0.4, yawnT[i] + 1.3, yawnT[i] + 1.8);
    const sleepy = sm((u - (yawnT[i] + 1.8))/2.5);
    const camU = i === 2 ? rh(u, 8.0, 8.8, 11.6, 12.4) : 0;
    const leanDir = i === 1 ? -1 : (i === 3 ? -1 : 0);
    let tL = lerpP([-30, -66], [-10, -118], sip), tR = [36, -56];
    if (camU > 0){ tR = lerpP(tR, [14, -140], camU); tL = lerpP(tL, [-22, -136], camU); }
    pose(c, {x: SEAT4[i] + leanDir*24*lean, y: 950, s: 1, bt: leanDir*8*lean, sleep: sleepy > 0.5,
      tL, tR, L: camU > 0.2 ? null : 'mug', R: camU > 0.2 ? 'camera' : null, phones: i === 1,
      eyes: yawn > 0.3 ? 'squeeze' : (sleepy > 0.5 ? 'sleep' : (sip > 0.5 || (u > 10.4 && u < 13) || (u > 13.6 && u < 16) ? 'happy' : 'open')),
      mouth: yawn > 0.3 ? 'yawn' : (sip > 0.4 ? 'small' : 'smile'),
      lookX: sleepy > 0.5 ? 0 : clamp((1250 - SEAT4[i])/60, -6, 6), lookY: sleepy > 0.5 ? 0 : -4,
      tilt: leanDir*12*lean + (sleepy > 0.5 ? 0 : 3), hy: 7*sleepy,
      blink: sleepy > 0.2 ? Math.min(1, blinkAt(u, 2.6, i)*(1 - 0.5*sleepy)) : null});
    const mp = paw(c, -1);
    S.steams[i](mp[0], mp[1] - 22, u + i, (sip > 0.3 || camU > 0.2) ? 0 : 0.7*(1 - sleepy), 8);
  });
  const fl = bump(u, 10.4, 0.35), cp = paw(S.cast[2], 1);
  S.flash.setAttribute('opacity', fl.toFixed(3)); T(S.flash, `translate(${cp[0] - 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, 0.16*fl);
  const zA = sm((u - 32)/2);
  const h1 = headW(S.cast[1], 40, -60), h2 = headW(S.cast[3], 40, -60);
  S.z1(h1[0], h1[1], u, zA); S.z2(h2[0], h2[1], u + 1.3, zA);
  S.flies.forEach(f => {
    const a = dusk*(0.5 + 0.5*Math.sin(TAU*(u/2.2 + f.ph*4)));
    const x = f.x0 + 40*Math.sin(TAU*(u/9 + f.ph)), y = f.y0 - 40*Math.sin(TAU*(u/7 + f.ph*2)) - 60*dusk;
    f.el.setAttribute('cx', x.toFixed(1)); f.el.setAttribute('cy', y.toFixed(1)); f.el.setAttribute('opacity', a.toFixed(3));
    f.glow.setAttribute('cx', x.toFixed(1)); f.glow.setAttribute('cy', y.toFixed(1)); f.glow.setAttribute('opacity', (0.7*a).toFixed(3));
  });
  S.hearts(u); S.spark(u);
};

/* =========================== GLOBAL =========================== */
const SCENES = [SC1, SC2, SC3, SC4];
const UI = $('ui');
const ICON4 = {
  mountain: g => { mk('path', S4({d:'M-26 16 L-8 -16 L2 -2 L10 -12 L26 16 Z', fill:'#9CC2DB'}), g); mk('path', S4({d:'M-8 -16 L-2 -6 L-14 -6 Z', fill:'#FFFFFF'}, 2.5), g); },
  basket: g => { itBasket(G(g, 'translate(0 4) scale(0.6)')); },
  shell: g => { itShell(G(g, 'scale(1.1)')); },
  sunset: g => { mk('path', S4({d:'M-20 6 A20 20 0 0 1 20 6 Z', fill:'#FFB36B'}), g); mk('path', {d:'M-26 6 H26 M-18 13 H18', stroke:OL, 'stroke-width':3.5, 'stroke-linecap':'round'}, g); }
};
const LABELS = [['Off to the Sea', ICON4.mountain], ['Seaside Picnic', ICON4.basket], ['Beach Time', ICON4.shell], ['Sunset Glow', ICON4.sunset]]
  .map(a => { const l = label(UI, a[0], a[1]); l.style.display = 'none'; return l; });
const INTRO = G(UI);
mk('rect', SK({x:560, y:420, width:800, height:220, rx:46, fill:'#FFFDF8', 'fill-opacity':0.95}, 5), INTRO);
txt(INTRO, 960, 492, 'Fur Friends', 40, '#B79BE8');
txt(INTRO, 960, 560, EP.title, 54, OL);
txt(INTRO, 960, 610, `Day ${EP.day}`, 30, '#C9A27E', 'middle', 500);
let fitted = false;
const FADES = [45, 90, 135];
function setTime(t){
  t = clamp(t, 0, DUR - 1e-6);
  simTick(t);
  if (!fitted){ LABELS.forEach(l => l.fit()); fitted = true; }
  FLASH.v = 0;
  let cur = null;
  SCENES.forEach(sc => { const on = t >= sc.t0 && t < sc.t1; show(sc.g, on); if (on) cur = sc; });
  cur.update(t - cur.t0);
  SCENES.forEach((sc, i) => {
    const v = t - sc.t0;
    const a = i === 0 ? rh(v, 4.4, 5.0, 9.4, 10.2) : rh(v, 0.9, 1.6, 6.0, 6.8);
    show(LABELS[i], a > 0.001);
    if (a > 0.001){ T(LABELS[i], `translate(${(56 - 40*(1 - a)).toFixed(1)} 50)`); LABELS[i].setAttribute('opacity', a.toFixed(3)); }
  });
  const ia = rh(t, 0.5, 1.2, 3.6, 4.4);
  show(INTRO, ia > 0.001); INTRO.setAttribute('opacity', ia.toFixed(3));
  T(INTRO, `translate(960 530) scale(${(0.92 + 0.08*sm((t - 0.5)/0.7)).toFixed(4)}) translate(-960 -530)`);
  let f = 1 - sm(t/1.4);
  FADES.forEach(p => { f = Math.max(f, 1 - sm(Math.abs(t - p)/0.8)); });
  $('fade').setAttribute('opacity', f.toFixed(3));
  $('dark').setAttribute('opacity', sm((t - 176.2)/3.6).toFixed(3));
  $('flash').setAttribute('opacity', FLASH.v.toFixed(3));
}
window.setTime = setTime;
window.DUR = DUR;
setTime(0);
if (!window.__RENDER){
  const start = performance.now();
  (function loop(now){ setTime(((now - start)/1000) % DUR); requestAnimationFrame(loop); })(start);
}
