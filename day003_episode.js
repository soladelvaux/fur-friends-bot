/* =====================================================================
   FUR FRIENDS — Day 3: "Rainy Day Fort"   (180 s)
   ===================================================================== */
DEFS = $('defs');
const EP = {day: 3, title: 'Rainy Day Fort'};
const DUR = 180;
rad('glowW', [[0,'#FFF6D8',0.9],[0.5,'#FFE9B0',0.35],[1,'#FFE9B0',0]]);
rad('glowLamp', [[0,'#FFE3A3',0.85],[0.45,'#FFC977',0.3],[1,'#FFC977',0]]);
rad('vig', [[0.66,'#000',0],[1,'#3a1d10',0.16]]);
quiltPattern('quiltF');
const SCN = $('scenes');
function newScene(t0, t1){ const s = {t0, t1}; s.g = G(SCN); s.cam = G(s.g); s.g.style.display = 'none'; return s; }
function camZoom(S, cx, cy, z){ T(S.cam, `translate(${cx} ${cy}) scale(${z.toFixed(4)}) translate(${-cx} ${-cy})`); }
const FLASH = {v: 0};
// jump from a->b between t0..t0+d with arc h
function jumpTo(u, t0, d, a, b, h){
  const v = clamp((u - t0)/d, 0, 1);
  return {x: lerp(a[0], b[0], sm(v)), y: lerp(a[1], b[1], sm(v)), hop: (v > 0 && v < 1) ? h*4*v*(1-v) : 0};
}

/* =================== SC1 — RAINY MORNING (0–45) =================== */
const SC1 = newScene(0, 45);
(function(){
  const S = SC1;
  S.L = locHome(S.cam, {windowSeat:true});
  S.momo = makeChar('cat', S.L.chars);
  S.otto = makeChar('otter', S.L.chars);
  S.pipi = makeChar('bunny', S.L.chars);
  S.kuku = makeChar('squirrel', S.L.charsFront);
  S.wrap = itBlanketWrap(G(S.L.charsFront));
  attach(S.momo, -1, 'mug', (() => { const m = itMug(G(), '#C7B3F5'); catMotif(m, 0, 3); return m; })());
  attach(S.otto, 1, 'camera', itCamera(G(null, 'translate(-20 -6)')));
  attach(S.kuku, 1, 'acorn', itAcorn(G(), 1.05));
  S.flyAcorn = G(S.L.fx); itAcorn(S.flyAcorn, 1.05);
  S.steam = steam(S.L.fx, 3);
  S.flashS = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:32.0, x:960, y:660, n:4}]);
  S.spark = sparkles(S.L.fx, [{t:37.0, x:1090, y:620, n:6, r:80}]);
  S.bulb = G(S.L.fx);
  mk('circle', SK({cx:0, cy:0, r:22, fill:'#FFE07A'}, 4), S.bulb);
  mk('rect', SK({x:-10, y:18, width:20, height:14, rx:3, fill:'#D5DDE5'}, 3.5), S.bulb);
  for (let i=0;i<5;i++){ const a = -Math.PI/2 + (i-2)*0.55; mk('path', {d:`M${32*Math.cos(a)} ${32*Math.sin(a)} L${44*Math.cos(a)} ${44*Math.sin(a)}`, stroke:OL, 'stroke-width':4, 'stroke-linecap':'round'}, S.bulb); }
})();
SC1.update = function(u){
  const S = this;
  camZoom(S, 1000, 700, K(u, [[0,1.12],[45,1.04]]));
  S.L.update(u, 0, {rain:1, rainbow:0});
  const thunder = bump(u, 17.9, 0.5);
  FLASH.v = Math.max(FLASH.v, 0.35*thunder);
  const shock = rh(u, 18.0, 18.3, 19.6, 20.2);
  const idea = rh(u, 36.2, 36.8, 42.4, 43.2);
  /* ---- PIPI wrapped in the blanket ---- */
  const scared = rh(u, 18.0, 18.3, 26.0, 28.0);
  const comfort = rh(u, 28.5, 29.2, 34.0, 35.0);
  const sleepy = 1 - sm((u - 9)/2);
  pose(S.pipi, {x:960, y:950, s:1, feet:false, tL:[-30,-70], tR:[30,-70],
    hy: 14*scared, eyes: scared > 0.4 ? 'squeeze' : (sleepy > 0.5 && u < 9 ? 'sleep' : (comfort > 0.4 || idea > 0.3 ? 'happy' : 'open')),
    mouth: (u > 5.5 && u < 7.2) ? 'yawn' : (scared > 0.3 ? 'wavy' : (idea > 0.3 ? 'open' : 'smile')), ear: -14*scared + 4*idea,
    sweat: scared*0.9, tremble: 0.6*scared, excl: shock, lookX: u > 22 && u < 36 ? 3 : 0});
  T(S.wrap, `translate(960 ${(950 + 4*scared).toFixed(1)})`);
  /* ---- MOMO on the window seat → down to Pipi ---- */
  const sip = rh(u, 3.0, 3.8, 5.0, 5.8) + rh(u, 11.0, 11.8, 13.0, 13.8);
  let mx = 1190, my = 640, mh = 0, mWalk = null, mAmt = 0;
  if (u > 21.8){ const j = jumpTo(u, 21.8, 0.9, [1190, 640], [1150, 966], 70); mx = j.x; my = j.y; mh = j.hop; }
  if (u > 23.0){ const w = walkX(u, [[23.0,1150],[25.6,1150]]); mx = w.x; mAmt = w.amt; mWalk = mx/86; }
  const pat = rh(u, 27.5, 28.3, 33.4, 34.2);
  pose(S.momo, {x:mx, y:my, s:0.95, hop:mh, walk:mWalk, walkAmt:mAmt,
    tL: u < 21.8 ? lerpP([-40, -64], [-10, -118], sip) : lerpP([-36,-56], [-120, -190], pat), L: u < 21.8 ? 'mug' : null,
    tR: lerpP([36,-56], [70, -200], idea), lookY: u < 17 ? -5 : 0, lookX: u < 17 ? 5 : (u > 18 && u < 36 ? -6 : 0),
    eyes: sip > 0.5 || pat > 0.4 || idea > 0.4 ? 'happy' : 'open', mouth: idea > 0.3 ? 'open' : (shock > 0.3 ? 'small' : 'smile'),
    brow: u > 18 && u < 28, excl: shock, tilt: -6*pat, bt: -6*pat});
  if (u < 21.8){ const mp = paw(S.momo, -1); S.steam(mp[0] - 2, mp[1] - 22, u, 1 - sip, 9); } else S.steam(0, 0, u, 0, 9);
  show(S.bulb, idea > 0.05); S.bulb.setAttribute('opacity', idea.toFixed(3));
  const hb = headW(S.momo, 0, -150); T(S.bulb, `translate(${hb[0]} ${hb[1] - 10 - 10*Math.sin(TAU*u*1.2)}) scale(${(0.6 + 0.4*idea).toFixed(3)})`);
  /* ---- OTTO on the window seat taking photos of the rain ---- */
  const camU = rh(u, 8.0, 8.8, 12.4, 13.2);
  let ox = 1410, oy = 640, oh = 0, oWalk = null, oAmt = 0;
  if (u > 22.6){ const j = jumpTo(u, 22.6, 0.9, [1410, 640], [1330, 966], 70); ox = j.x; oy = j.y; oh = j.hop; }
  if (u > 23.8){ const w = walkX(u, [[23.8,1330],[26.4,1300]]); ox = w.x; oAmt = w.amt; oWalk = ox/86; }
  const cheerO = idea;
  pose(S.otto, {x:ox, y:oy, s:0.95, hop:oh + hopF(u, 38.6, 0.5, 30), walk:oWalk, walkAmt:oAmt,
    tR: lerpP(lerpP([34,-56], [14, -140], camU), [90, -180], cheerO), tL: lerpP(lerpP([-34,-56], [-22, -136], camU), [-90, -180], cheerO),
    R: camU > 0.2 ? 'camera' : null, lookY: u < 16 ? -4 : 0, lookX: u < 16 ? -4 : (u > 18 ? -6 : 0),
    eyes: (u > 11 && u < 13.5) || cheerO > 0.4 ? 'happy' : 'open', mouth: cheerO > 0.3 || (u > 11 && u < 13.5) ? 'open' : 'smile',
    brow: u > 18 && u < 28, excl: shock});
  const fl = bump(u, 11.0, 0.35), cp = paw(S.otto, 1);
  S.flashS.setAttribute('opacity', fl.toFixed(3)); T(S.flashS, `translate(${cp[0] - 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, 0.18*fl);
  /* ---- KUKU bored, tossing an acorn ---- */
  let toss = null;
  for (let k = 0; k < 6; k++){ const t0 = 2.5 + k*2.4; if (u >= t0 && u < t0 + 1.2) toss = (u - t0)/1.2; }
  const kw = walkX(u, [[0,330],[23.4,330],[26.8,820],[45,820]]);
  const kFlip = u > 23.4 ? -1 : 1;
  const cheerK = idea;
  pose(S.kuku, {x:kw.x, y:966, s:0.95, flip:kFlip, walk:kw.x/80, walkAmt:kw.amt,
    hop: hopF(u, 18.0, 0.5, 60) + hopF(u, 38.0, 0.5, 40) + hopF(u, 39.2, 0.5, 34),
    tR: lerpP(toss !== null ? [40, -100 - 20*Math.sin(Math.PI*toss)] : [36,-60], [90, -180], cheerK), tL: lerpP([-36,-54], [-90, -180], cheerK),
    R: (u < 17.5 && toss === null) ? 'acorn' : null,
    eyes: shock > 0.3 ? 'squeeze' : (cheerK > 0.3 ? 'happy' : (u < 17 ? 'sleep' : 'open')), lookY: toss !== null ? -6 : 0,
    mouth: cheerK > 0.3 ? 'open' : (u < 17 ? 'wavy' : 'smile'), excl: shock, tilt: u < 17 ? 8 : 0});
  if (toss !== null && u < 17.5){ show(S.flyAcorn, true); const pk = paw(S.kuku, 1); T(S.flyAcorn, `translate(${pk[0]} ${pk[1] - 160*4*toss*(1-toss)}) rotate(${toss*540})`); }
  else show(S.flyAcorn, false);
  S.hearts(u); S.spark(u);
};

/* =================== SC2 — BLANKET FORT (45–90) =================== */
const SC2 = newScene(45, 90);
(function(){
  const S = SC2;
  S.L = locHome(S.cam, {windowSeat:true});
  S.momo = makeChar('cat', S.L.chars);
  S.otto = makeChar('otter', S.L.chars);
  S.tentG = blanketTent(S.L.tableTop);
  S.pipi = makeChar('bunny', S.L.charsFront);
  S.kuku = makeChar('squirrel', S.L.charsFront);
  attach(S.kuku, 1, 'pillow', itPillow(G(null, 'translate(-36 -10)'), '#FFC3D2'));
  S.flyPillow = G(S.L.fx); itPillow(S.flyPillow, '#FFC3D2');
  S.hearts = heartBursts(S.L.fx, [{t:30.8, x:620, y:640, n:5}, {t:42.0, x:620, y:820, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:15.0, x:620, y:760, n:6, r:150}, {t:1.6, x:340, y:700, n:4, r:50}]);
})();
SC2.update = function(u){
  const S = this;
  camZoom(S, 820, 760, K(u, [[0,1.14],[45,1.2]]));
  S.L.update(u, 0, {rain:1, rainbow:0});
  const hold = rh(u, 3.4, 4.4, 13.4, 14.2);
  const drape = sm((u - 13.8)/1.2);
  const wave = 10*Math.sin(TAU*u*0.9)*hold;
  /* ---- MOMO + OTTO lift the blanket ---- */
  const mw = walkX(u, [[0,340],[38.6,340],[40.6,560]]);
  const mWave = rh(u, 37.4, 37.9, 38.4, 38.8);
  pose(S.momo, {x:mw.x, y:966, s:1, walk:mw.x/86, walkAmt:mw.amt, tR: lerpP([36,-56], [74, -186], hold), tL: lerpP([-36,-56], [-96, -186 + 12*Math.sin(TAU*2.2*u)], mWave),
    eyes: hold > 0.4 || mWave > 0.4 ? 'happy' : 'open', mouth: hold > 0.4 || mWave > 0.4 ? 'open' : 'smile', excl: rh(u, 0.8, 1.2, 2.6, 3.0), lookX: 4});
  S.momo.root.setAttribute('opacity', (1 - sm((u - 40.2)/0.6)).toFixed(3));
  const ow = walkX(u, [[0,900],[36.0,900],[38.2,640]]);
  pose(S.otto, {x:ow.x, y:966, s:1, walk:ow.x/86, walkAmt:ow.amt, tL: lerpP([-36,-56], [-74, -186], hold), tR:[36,-56],
    eyes: hold > 0.4 ? 'happy' : 'open', mouth: hold > 0.4 ? 'open' : 'smile', lookX: -4});
  S.otto.root.setAttribute('opacity', (1 - sm((u - 37.8)/0.6)).toFixed(3));
  // blanket strip → tent
  const strip = S.tentG.strip, tent = S.tentG.tent;
  show(strip, hold > 0.02 && drape < 0.99);
  strip.setAttribute('opacity', (Math.min(hold*1.5, 1)*(1 - sm((u - 13.8)/0.6))).toFixed(3));
  T(strip, `translate(400 ${(760 + 30*(1 - hold) + wave).toFixed(1)}) skewY(${(2*Math.sin(TAU*u*0.9 + 1)*hold).toFixed(2)})`);
  show(tent, u > 13.8);
  const k = clamp(drape + 0.06*Math.sin(TAU*(u - 14.6)*2)*bump(u, 14.6, 0.8), 0.05, 1.08);
  T(tent, `translate(0 716) scale(1 ${k.toFixed(4)}) translate(0 -716)`);
  const lit = i => sm((u - 27.0 - i*0.28)/0.3);
  S.tentG.lights.update(u, lit);
  S.tentG.doorGlow.setAttribute('opacity', (sm((u - 33)/1.5)*(0.6 + 0.15*Math.sin(TAU*u*1.3))).toFixed(3));
  /* ---- KUKU brings a pillow ---- */
  const kw = walkX(u, [[0,1330],[15.2,1330],[16.6,2060],[17.4,2060],[19.6,820],[21.0,820],[22.8,1330],[31.8,1330],[34.4,660]]);
  const carry = u > 17.2 && u < 20.2;
  const cheerK = rh(u, 0.8, 1.2, 2.8, 3.2) + rh(u, 30.6, 31.0, 32.0, 32.4);
  pose(S.kuku, {x:kw.x, y:966, s:0.95, flip: kw.v < -5 ? -1 : 1, walk:kw.x/80, walkAmt:kw.amt, hop: hopF(u, 1.4, 0.5, 40) + hopF(u, 31.0, 0.5, 36),
    tR: carry ? [24, -110] : lerpP([36,-54], [90,-180], cheerK), tL: carry ? [-24, -110] : lerpP([-36,-54], [-90,-180], cheerK), R: carry ? 'pillow' : null,
    eyes: cheerK > 0.3 || carry ? 'happy' : 'open', mouth: cheerK > 0.3 || carry ? 'open' : 'smile', lookX: -5});
  S.kuku.root.setAttribute('opacity', (1 - sm((u - 34.2)/0.6)).toFixed(3));
  const pv = (u - 20.2)/0.8;
  if (pv > 0 && pv < 1){ show(S.flyPillow, true); const p = arcP([840, 850], [620, 920], pv, 120); T(S.flyPillow, `translate(${p[0]} ${p[1]}) rotate(${-200*pv}) scale(${1 - 0.4*pv})`); } else show(S.flyPillow, false);
  /* ---- PIPI hangs the fairy lights ---- */
  const pw = walkX(u, [[0,1120],[23.6,1120],[25.4,900],[34.2,900],[35.8,640]]);
  const lights = rh(u, 25.6, 26.4, 30.0, 30.6);
  const wow = rh(u, 30.4, 30.8, 32.4, 33.0) + rh(u, 0.8, 1.2, 2.8, 3.2);
  pose(S.pipi, {x:pw.x, y:966, s:1, walk:pw.x/86, walkAmt:pw.amt, tR: lerpP([36,-56], [60, -180], lights), tL: lerpP([-36,-56], [-70, -180], Math.max(lights, wow*0.8)),
    eyes: wow > 0.3 ? 'happy' : 'open', mouth: wow > 0.3 ? 'open' : 'smile', lookX: -4, lookY: lights > 0.3 ? -5 : 0, hop: hopF(u, 31.0, 0.5, 30)});
  S.pipi.root.setAttribute('opacity', (1 - sm((u - 35.4)/0.6)).toFixed(3));
  S.hearts(u); S.spark(u);
};

/* =================== SC3 — GAME TIME in the fort (90–135) =================== */
const SC3 = newScene(90, 135);
const PLAYERS = ['#CDB8F2', '#FFB3C7', '#9FC8F0', '#FFB47A'];
const TRACK = Array.from({length:10}, (_, i) => [560 + i*92, 960 + 10*Math.sin(i*0.9)]);
const TURNS = [{p:2, t:4.0, n:3}, {p:3, t:10.0, n:5}, {p:1, t:16.0, n:2}, {p:0, t:22.0, n:4}, {p:3, t:28.0, n:4}];
const POFF = [[-16,-8],[16,-8],[-16,12],[16,12]];
(function(){
  const S = SC3;
  S.L = locFort(S.cam);
  S.cast = [makeChar('cat', S.L.chars), makeChar('bunny', S.L.chars), makeChar('otter', S.L.chars), makeChar('squirrel', S.L.chars)];
  S.cast.forEach((c, i) => {
    attach(c, -1, 'cocoa', itMug(G(), ['#C7B3F5','#FFB3C7','#9FC8F0','#FFB47A'][i], '#6B3F26'));
    attach(c, 1, 'dice', itDice(G()));
  });
  const f = S.L.front;
  mk('path', SK({d:'M440 902 L1480 902 L1580 1016 L340 1016 Z', fill:'#FFF6E6'}), f);
  mk('path', S4({d:'M470 914 L1450 914 L1530 1004 L390 1004 Z', fill:'#BFE3D6'}), f);
  TRACK.forEach((p, i) => mk('ellipse', S4({cx:p[0], cy:p[1], rx:36, ry:16, fill: i === 9 ? '#FFE07A' : (i % 2 ? '#FFFFFF' : '#FFD6E2')}, 3), f));
  mk('path', {d:STAR_D, fill:'#FFFFFF', transform:`translate(${TRACK[9][0]} ${TRACK[9][1] - 2}) scale(0.9)`}, f);
  S.pieces = PLAYERS.map((col) => itPiece(G(f), col));
  S.dice = itDice(G(S.L.fx));
  S.diceG = S.dice.parentNode;
  S.steams = S.cast.map(() => steam(S.L.fx, 2));
  S.hearts = heartBursts(S.L.fx, [{t:31.0, x:1370, y:640, n:5}, {t:33.5, x:830, y:660, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:30.8, x:1370, y:720, n:8, r:140}, {t:30.6, x:TRACK[9][0], y:TRACK[9][1] - 30, n:5, r:50}]);
})();
function pieceIndex(p, u){
  let idx = 0;
  TURNS.forEach(tr => { if (tr.p !== p) return; const v = u - tr.t - 2.1; if (v > 0) idx += Math.min(tr.n, Math.floor(v/0.38) + 1); });
  return idx;
}
SC3.update = function(u){
  const S = this;
  camZoom(S, 960, 700, K(u, [[0,1.12],[45,1.22]]));
  S.L.update(u);
  const xs = [560, 830, 1100, 1370];
  const sips = [[7.5, 9.5], [12.5, 14.5], [19.0, 21.0], [33.0, 35.0], [35.5, 37.5]];
  const sipOwner = [0, 1, 2, 0, 1];
  // current turn
  let cur = null;
  TURNS.forEach(tr => { if (u >= tr.t - 0.2 && u < tr.t + 2.1 + tr.n*0.38 + 0.6) cur = tr; });
  // dice
  let diceN = 6, dicePos = [960, 930], diceRot = 0, diceHeld = -1;
  TURNS.forEach(tr => { if (u > tr.t + 1.9) diceN = tr.n; });
  if (cur){
    const v = u - cur.t;
    if (v < 1.2) diceHeld = cur.p;
    else if (v < 1.9){ const w = (v - 1.2)/0.7; const from = [xs[cur.p], 800]; dicePos = arcP(from, [960 + (cur.p - 1.5)*40, 932], w, 110); diceRot = 720*w; }
    else dicePos = [960 + (cur.p - 1.5)*40, 932];
  } else {
    const last = TURNS.filter(tr => u > tr.t + 1.9).pop();
    if (last) dicePos = [960 + (last.p - 1.5)*40, 932];
  }
  S.dice.setN(diceN);
  show(S.diceG, diceHeld < 0);
  T(S.diceG, `translate(${dicePos[0].toFixed(1)} ${dicePos[1].toFixed(1)}) rotate(${diceRot.toFixed(1)})`);
  // pieces
  S.pieces.forEach((pc, p) => {
    let idx = pieceIndex(p, u);
    let hop = 0, from = TRACK[Math.max(0, idx - 1)], to = TRACK[Math.min(9, idx)];
    TURNS.forEach(tr => {
      if (tr.p !== p) return;
      const v = u - tr.t - 2.1;
      if (v > 0 && v < tr.n*0.38){ const k = Math.floor(v/0.38); const w = (v - k*0.38)/0.38; hop = 26*4*w*(1-w); const i0 = pieceIndex(p, tr.t + 2.0) + k; from = TRACK[i0]; to = TRACK[Math.min(9, i0 + 1)]; idx = -1; T(pc.parentNode, `translate(${(lerp(from[0], to[0], sm(w)) + POFF[p][0]).toFixed(1)} ${(lerp(from[1], to[1], sm(w)) + POFF[p][1] - hop).toFixed(1)})`); }
    });
    if (idx >= 0){ const q = TRACK[Math.min(9, idx)]; T(pc.parentNode, `translate(${q[0] + POFF[p][0]} ${q[1] + POFF[p][1]})`); }
  });
  const win = rh(u, 30.6, 31.0, 36.0, 37.0);
  const yawnP = rh(u, 38.0, 38.4, 39.4, 39.9);
  S.cast.forEach((c, i) => {
    let sip = 0; sips.forEach((sw, k) => { if (sipOwner[k] === i) sip = Math.max(sip, rh(u, sw[0], sw[0] + 0.8, sw[1] - 0.8, sw[1])); });
    const shaking = cur && cur.p === i && u - cur.t < 1.2;
    const throwing = cur && cur.p === i ? rh(u, cur.t + 1.0, cur.t + 1.2, cur.t + 1.4, cur.t + 1.8) : 0;
    const sh = shaking ? Math.sin(TAU*u*6)*6 : 0;
    let tR = shaking ? [14 + sh, -104] : lerpP([46, -36], [40, -120], throwing);
    let tL = lerpP(lerpP([-48, -34], [-10, -118], sip), shaking ? [-14 - sh, -104] : [-48, -34], shaking ? 1 : 0);
    const isK = i === 3, cheer = isK ? win : 0, clap = !isK ? win : 0;
    const cl = Math.abs(Math.sin(TAU*2.4*u));
    if (cheer > 0){ tR = lerpP(tR, [90, -190 + 10*Math.sin(TAU*3*u)], cheer); tL = lerpP(tL, [-90, -190 + 10*Math.sin(TAU*3*u + 1)], cheer); }
    if (clap > 0){ tR = lerpP(tR, [6 + 18*cl, -104], clap); tL = lerpP(tL, [-6 - 18*cl, -104], clap); }
    let focusX = 960;
    if (cur) focusX = (u - cur.t < 1.9) ? xs[cur.p] : TRACK[Math.min(9, pieceIndex(cur.p, u))][0];
    const watch = clamp((focusX - xs[i])/45, -7, 7);
    pose(c, {x:xs[i], y:878, s:1.05, feet:false, tR, tL, L: shaking ? null : 'cocoa', R: shaking ? 'dice' : null,
      lookX: cur && cur.p === i && shaking ? 0 : watch, lookY: 5,
      hop: isK ? hopF(u, 30.8, 0.45, 40) + hopF(u, 31.6, 0.45, 34) + hopF(u, 32.4, 0.45, 28) : 0,
      eyes: (cheer > 0.3 || clap > 0.3 || sip > 0.5) ? 'happy' : (i === 1 && yawnP > 0.3 ? 'squeeze' : (u > 39.5 && i === 1 ? 'sleep' : 'open')),
      mouth: i === 1 && yawnP > 0.3 ? 'yawn' : (cheer > 0.3 || clap > 0.3 ? 'open' : (shaking ? 'small' : 'smile')),
      tilt: (i === 1 && u > 39.5 ? -8 : 0), sweat: (i === 0 && u > 22 && u < 26) ? 0.6 : 0});
    const mp = paw(c, -1);
    S.steams[i](mp[0], mp[1] - 22, u + i, (shaking || sip > 0.3) ? 0 : 0.8, 8);
  });
  S.hearts(u); S.spark(u);
};

/* =================== SC4 — AFTER THE RAIN (135–180) =================== */
const SC4 = newScene(135, 180);
(function(){
  const S = SC4;
  S.L = locHome(S.cam, {windowSeat:true});
  S.cast = [makeChar('cat', S.L.chars), makeChar('bunny', S.L.chars), makeChar('otter', S.L.chars), makeChar('squirrel', S.L.chars)];
  attach(S.cast[2], 1, 'camera', itCamera(G(null, 'translate(-20 -6)')));
  S.flashS = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:33.0, x:1300, y:470, n:5}, {t:40.0, x:1300, y:470, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:13.6, x:1300, y:330, n:8, r:170}]);
})();
SC4.update = function(u){
  const S = this;
  camZoom(S, 1300, 640, K(u, [[0,1.18],[12,1.26],[45,1.34]]));
  const rain = 1 - sm(u/7), rainbow = sm((u - 9)/5);
  S.L.update(u, 0, {rain, rainbow, wet: 1 - sm((u - 10)/10)});
  const floorX = [1000, 1180, 1360, 1540], seatX = [1080, 1230, 1380, 1530];
  const hopT = [11.8, 11.2, 10.0, 10.6];
  const lean = sm((u - 30)/2.5);
  S.cast.forEach((c, i) => {
    const j = jumpTo(u, hopT[i], 0.9, [floorX[i], 966], [seatX[i], 640], 110);
    const onSeat = u > hopT[i] + 0.9;
    const notice = i === 2 ? rh(u, 6.8, 7.2, 9.4, 10.0) : 0;
    const point = i === 3 ? rh(u, 15.6, 16.2, 19.4, 20.0) : 0;
    const camU = i === 2 ? rh(u, 18.0, 18.8, 21.4, 22.2) : 0;
    const wow = rh(u, 13.0, 13.6, 28.0, 30.0);
    const leanDir = i === 1 ? -1 : (i === 3 ? -1 : 0);
    let tR = lerpP([36,-56], [80, -200], Math.max(notice, point));
    let tL = [-36, -56];
    if (camU > 0){ tR = lerpP(tR, [14, -140], camU); tL = lerpP(tL, [-22, -136], camU); }
    pose(c, {x: j.x + leanDir*16*lean, y: j.y, s: onSeat ? 0.88 : lerp(0.92, 0.88, clamp((u - hopT[i])/0.9, 0, 1)), hop: j.hop, bt: leanDir*8*lean,
      tR, tL, R: camU > 0.2 ? 'camera' : null, feet: true,
      lookY: (u > 7 && u < 30) ? -6 : 0, lookX: (u > 7 && u < 30) ? 2 : 0,
      eyes: wow > 0.4 || u > 31 ? 'happy' : 'open', mouth: wow > 0.4 || notice > 0.3 ? 'open' : 'smile',
      tilt: leanDir*10*lean - (u > 7 && u < 30 ? 3 : 0), excl: notice});
  });
  const fl = bump(u, 19.4, 0.35), cp = paw(S.cast[2], 1);
  S.flashS.setAttribute('opacity', fl.toFixed(3)); T(S.flashS, `translate(${cp[0] - 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, 0.15*fl);
  S.hearts(u); S.spark(u);
};

/* =========================== GLOBAL =========================== */
const SCENES = [SC1, SC2, SC3, SC4];
const UI = $('ui');
const ICON3 = {
  rain: g => { mk('path', S4({d:'M-20 4 Q-26 -10 -12 -14 Q-8 -28 6 -24 Q22 -26 22 -10 Q30 -4 22 4 Z', fill:'#C9D3E3'}), g); [-10, 2, 14].forEach(x => mk('path', {d:`M${x} 10 l-4 10`, stroke:'#6FB6E6', 'stroke-width':3.5, 'stroke-linecap':'round'}, g)); },
  fort: g => { mk('path', S4({d:'M-24 18 L-16 -10 Q0 -24 16 -10 L24 18 Z', fill:'#F7C6D9'}), g); mk('path', S4({d:'M-6 18 L-4 4 Q0 -2 4 4 L6 18 Z', fill:'#4A3A5C'}, 3), g); },
  dice: g => { mk('rect', S4({x:-17, y:-17, width:34, height:34, rx:8, fill:'#FFFFFF'}), g); [[-8,-8],[8,-8],[0,0],[-8,8],[8,8]].forEach(q => mk('circle', {cx:q[0], cy:q[1], r:3.4, fill:OL}, g)); },
  rainbow: g => { ['#FF9AA2','#FFE58A','#9FD3F5'].forEach((c, i) => mk('path', {d:`M${-22 + i*6} 12 A ${22 - i*6} ${22 - i*6} 0 0 1 ${22 - i*6} 12`, fill:'none', stroke:c, 'stroke-width':5.5, 'stroke-linecap':'round'}, g)); }
};
const LABELS = [['Rainy Morning', ICON3.rain], ['Blanket Fort', ICON3.fort], ['Game Time', ICON3.dice], ['After the Rain', ICON3.rainbow]]
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
