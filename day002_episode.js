/* =====================================================================
   FUR FRIENDS — Day 2: "Pipi Goes to the Dentist"   (180 s)
   ===================================================================== */
DEFS = $('defs');
const EP = {day: 2, title: 'Pipi Goes to the Dentist'};
const DUR = 180;
rad('glowW', [[0,'#FFF6D8',0.9],[0.5,'#FFE9B0',0.35],[1,'#FFE9B0',0]]);
rad('glowLamp', [[0,'#FFE3A3',0.85],[0.45,'#FFC977',0.3],[1,'#FFC977',0]]);
rad('vig', [[0.66,'#000',0],[1,'#3a1d10',0.16]]);
const SCN = $('scenes');
function newScene(t0, t1){ const s = {t0, t1}; s.g = G(SCN); s.cam = G(s.g); s.g.style.display = 'none'; return s; }
function camZoom(S, cx, cy, z){ T(S.cam, `translate(${cx} ${cy}) scale(${z.toFixed(4)}) translate(${-cx} ${-cy})`); }
const FLASH = {v: 0};

/* =================== SCENE 1 — MORNING OUCH (0–45) =================== */
const SC1 = newScene(0, 45);
(function(){
  const S = SC1;
  S.L = locHome(S.cam, {night:false});
  S.otto = makeChar('otter', S.L.chars);
  S.pipi = makeChar('bunny', S.L.chars);
  S.momo = makeChar('cat', S.L.chars);
  S.kuku = makeChar('squirrel', S.L.charsFront);
  attach(S.momo, -1, 'mug', (() => { const m = itMug(G(), '#C7B3F5'); catMotif(m, 0, 3); return m; })());
  attach(S.momo, 1, 'phone', itPhone(G()));
  attach(S.momo, 1, 'notebook', itNotebook(G(null, 'translate(0 -24)')));
  attach(S.pipi, 1, 'carrot', itCarrot(G(), 62));
  attach(S.pipi, 1, 'ice', itIcePack(G(null, 'translate(-6 0)')));
  attach(S.otto, 1, 'camera', itCamera(G(null, 'translate(-20 -6)')));
  attach(S.otto, 1, 'ice', itIcePack(G()));
  attach(S.kuku, 1, 'acorn', itAcorn(G(), 1.05));
  attach(S.kuku, -1, 'acorn', itAcorn(G(), 1.05));
  // static mug on table
  S.mugT = itMug(G(S.L.tableTop, 'translate(555 723)'), '#C7B3F5'); catMotif(S.mugT, 0, 3);
  S.noteT = G(S.L.tableTop, 'translate(700 742) rotate(-6)');
  mk('rect', S4({x:-34, y:-8, width:68, height:12, rx:3, fill:'#C9B6F2'}), S.noteT);
  S.flyAcorn = G(S.L.fx); itAcorn(S.flyAcorn, 1.0);
  S.dropCarrot = G(S.L.fx); itCarrot(G(S.dropCarrot), 62);
  S.steam = steam(S.L.fx, 3);
  S.notes = []; for (let i=0;i<3;i++) S.notes.push(mk('path', {d:NOTE_D, fill:['#B9A3F0','#FF9DB5','#8FD6C4'][i], stroke:OL, 'stroke-width':2.4, opacity:0}, S.L.fx));
  S.hearts = heartBursts(S.L.fx, [{t:40.0, x:960, y:640, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:34.0, x:700, y:600, n:5, r:70}, {t:18.5, x:1010, y:780, n:4, r:50}]);
  S.camFlash = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
})();
const S1_ACORN = [1.5, 5.0];
SC1.update = function(u){
  const S = this;
  camZoom(S, 960, 700, K(u, [[0,1.12],[10,1.08],[11,1.1],[45,1.04]]));
  S.L.update(u, 0);
  const momoO = {x:610, y:790, s:1}, pipiO = {x:960, y:950, s:1};
  const shock = rh(u, 9.9, 10.3, 11.8, 12.6);
  /* ---- PIPI ---- */
  const reach = rh(u, 7.2, 7.9, 8.0, 8.4), toMouth = rh(u, 8.0, 9.0, 9.7, 10.2);
  const ouch = rh(u, 9.75, 9.9, 17.8, 18.8);
  const iceOn = u > 18.4;
  const relief = rh(u, 18.5, 19.0, 20.0, 20.6);
  const shake = rh(u, 21.0, 21.3, 22.6, 23.0);
  const nervous = rh(u, 35.5, 36.5, 44, 46);
  const pat = rh(u, 37.0, 37.8, 39.6, 40.4);
  const bobA = Math.sin(TAU*0.55*u) * (1 - sm((u - 9.5)/0.4));
  let ptR = lerpP([36, -56], [106, -26], reach);
  ptR = lerpP(ptR, [12, -122], toMouth);
  if (iceOn) ptR = lerpP([36,-56], [58, -136], sm((u - 18.2)/0.5));
  pose(S.pipi, Object.assign({}, pipiO, {phones: true,
    tR: ptR, tL: lerpP([-36, -56], [-60, -134], ouch), R: iceOn ? 'ice' : ((u > 7.7 && u < 9.75) ? 'carrot' : null),
    hop: hopF(u, 9.75, 0.4, 24), tilt: 6*bobA + 9*shake*Math.sin(TAU*3*(u - 21)) - 5*ouch, hy: 2*Math.abs(bobA) + 4*ouch,
    ear: 6*bobA - 14*ouch - 8*nervous,
    eyes: ouch > 0.4 ? 'squeeze' : (relief > 0.4 || pat > 0.4 || u < 9.7 ? 'happy' : 'open'),
    lookX: (u > 21 && u < 30 ? -5 : 0), brow: u > 19 && pat < 0.4 ? true : false,
    mouth: (u > 8.9 && u < 9.75) ? 'open' : (ouch > 0.3 || shake > 0.3 ? 'wavy' : (u > 19 ? (pat > 0.4 ? 'open' : 'small') : 'smile')),
    pain: ouch*(1 - sm((u - 16)/3)), tear: rh(u, 10.4, 11, 17.6, 18.6), sweat: Math.max(0.8*shake, nervous), tremble: 0.6*nervous}));
  // dropped carrot
  if (u >= 9.75){
    show(S.dropCarrot, true);
    const v = clamp((u - 9.75)/0.8, 0, 1);
    const p = arcP([1010, 800], [1040, 944], v, 50);
    T(S.dropCarrot, `translate(${p[0]} ${p[1]}) rotate(${-40 + 130*sm(v)})`);
  } else show(S.dropCarrot, false);
  S.notes.forEach((n, i) => {
    const v = mod(u*0.32 + i/3, 1), side = i % 2 ? 1 : -1;
    T(n, `translate(${960 + side*(100 + 40*v)} ${790 - 150*v}) rotate(${side*12*Math.sin(TAU*v)})`);
    n.setAttribute('opacity', (Math.sin(Math.PI*v)*0.95*(1 - sm((u - 9.2)/0.5))).toFixed(3));
  });
  /* ---- MOMO ---- */
  const sip = rh(u, 1.8, 2.6, 3.8, 4.6);
  const phone = rh(u, 21.0, 21.8, 29.6, 30.4);
  const book = rh(u, 31.0, 31.8, 36.4, 37.0);
  const wave = rh(u, 38.0, 38.6, 41.0, 41.6);
  let mtR = [30, -52];
  mtR = lerpP(mtR, [80, -150], phone);
  mtR = lerpP(mtR, [56, -138], book);
  pose(S.momo, Object.assign({}, momoO, {feet:false,
    tL: lerpP(lerpP([-55, -67], [-10, -118], sip), [-98, -180 + 12*Math.sin(TAU*2.2*u)], wave), L: sip > 0.03 ? 'mug' : null,
    tR: mtR, R: phone > 0.25 ? 'phone' : (book > 0.25 ? 'notebook' : null),
    eyes: sip > 0.5 || wave > 0.4 || book > 0.5 ? 'happy' : 'open', lookX: (u > 10 && u < 21) ? 6 : (phone > 0.3 ? -3 : 0),
    brow: (u > 10.1 && u < 20.5) || (phone > 0.3 && u < 23),
    mouth: phone > 0.4 ? 'talk' : (shock > 0.3 ? 'small' : (wave > 0.4 ? 'open' : 'smile')),
    tilt: -5*sip + 3*Math.sin(TAU*u*0.8)*phone + 6*book, excl: shock}));
  show(S.mugT, sip <= 0.03);
  show(S.noteT, book <= 0.25);
  const mp = sip > 0.03 ? paw(S.momo, -1) : [555, 723];
  S.steam(mp[0] - 2, mp[1] - 22, u, 1 - sip, 9);
  /* ---- OTTO ---- */
  const oxK = [[0,1600],[11.0,1600],[13.0,2060],[14.0,2060],[17.4,1150],[45,1150]];
  const ow = walkX(u, oxK);
  const polish = rh(u, 0.5, 1.2, 8.0, 8.8);
  const give = rh(u, 17.5, 18.1, 18.4, 19.0);
  const camU = rh(u, 26.5, 27.3, 29.2, 30.0);
  const oPat = pat;
  let otR = lerpP([34, -56], [16 + 6*Math.sin(TAU*u*1.6), -84], polish), otL = lerpP([-34, -56], [-20, -86], polish);
  if (u > 13.4 && u < 18.4) otR = [40, -84];
  otR = lerpP(otR, [-110, -150], give);
  otR = lerpP(otR, [20, -140], camU); otL = lerpP(otL, [-22, -136], camU);
  otL = lerpP(otL, [-130, -220], oPat);
  pose(S.otto, {x: ow.x, y: 968, s: 1, walk: ow.x/88, walkAmt: ow.amt,
    tR: otR, tL: otL, R: polish > 0.2 || camU > 0.2 ? 'camera' : ((u > 13.4 && u < 18.4) ? 'ice' : null),
    bt: -8*oPat - 4*give, hx: -10*oPat,
    eyes: (u > 28.2 && u < 31) || oPat > 0.4 ? 'happy' : 'open', lookY: 6*polish, lookX: (u > 10 && u < 11.2) ? -6 : (ow.v < -10 ? -5 : 0),
    brow: u > 17 && u < 26, mouth: (u > 28.2 && u < 31) || oPat > 0.4 ? 'open' : 'smile', excl: shock, flip: 1});
  const fl = bump(u, 28.0, 0.35);
  const cp = paw(S.otto, 1);
  S.camFlash.setAttribute('opacity', fl.toFixed(3)); T(S.camFlash, `translate(${cp[0] - 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, fl*0.25);
  /* ---- KUKU ---- */
  const kxK = [[0,330],[11.4,330],[14.6,790],[45,790]];
  const kw = walkX(u, kxK);
  let ktR = [36, -54], kAc = false, kBt = 0, kTilt = 0, kHappy = false, landed = 0, fly = null;
  S1_ACORN.forEach(s => {
    const v = u - s;
    if (v > 2.15) landed++;
    if (v >= 0 && v < 3){
      if (v < 0.7){ const w = sm(v/0.7); ktR = lerpP([36,-54], [96,-26], w); kBt = 8*w; kTilt = 8*w; }
      else if (v < 1.3){ const w = sm((v-0.7)/0.6); ktR = lerpP([96,-26], [8,-150], w); kBt = 8*(1-w); kTilt = lerp(8, -4, w); }
      else { const w = sm((v-1.3)/1.0); ktR = lerpP([8,-150], [36,-54], w); kTilt = -10*(1 - sm((v-2.2)/0.7)); }
      kAc = v > 0.55 && v < 1.32;
      if (v >= 1.32 && v < 2.15) fly = (v - 1.32)/0.83;
      if (v > 2.15 && v < 2.9) kHappy = true;
    }
  });
  S.L.jarAcorns.forEach((e, i) => show(e, i < 5 + landed));
  if (fly !== null){ show(S.flyAcorn, true); const p = arcP([338, 824], [190, 712], fly, 90); T(S.flyAcorn, `translate(${p[0]} ${p[1]}) rotate(${fly*400})`); }
  else show(S.flyAcorn, false);
  const offer = rh(u, 20.0, 20.7, 22.8, 23.3);
  const eat = rh(u, 23.4, 24.0, 24.6, 25.0);
  const chewK = rh(u, 24.6, 24.8, 26.4, 26.8);
  const hop = hopF(u, 39.0, 0.5, 40) + hopF(u, 40.2, 0.5, 34);
  const cheer = rh(u, 38.6, 39.0, 41.6, 42.2);
  let ktL = [-36, -54];
  ktL = lerpP(ktL, [-110, -128], offer);
  ktL = lerpP(ktL, [-10, -124], eat);
  const kFlip = u > 11.4 ? -1 : 1;
  pose(S.kuku, {x: kw.x, y: 966, s: 0.95, flip: kFlip, walk: kw.x/80, walkAmt: kw.amt, hop, tR: lerpP(ktR, [90, -170], cheer), tL: lerpP(ktL, [-90, -170], cheer),
    R: kAc ? 'acorn' : null, L: offer > 0.2 || eat > 0.2 ? 'acorn' : null, bt: kBt*kFlip, tilt: kTilt - 6*offer,
    eyes: kHappy || cheer > 0.3 || chewK > 0.3 ? 'happy' : 'open', eyesR: (u > 26.2 && u < 27.2) ? 'open' : null, eyesL: (u > 26.2 && u < 27.2) ? 'happy' : null,
    lookX: kTilt < -2 ? -5 : (kBt > 2 ? 5 : (u > 10 ? -6 : 0)),
    mouth: chewK > 0.2 ? 'chew' : (cheer > 0.3 || offer > 0.5 ? 'open' : 'smile'), chew: 0.5 + 0.5*Math.sin(TAU*3*u), excl: shock});
  S.hearts(u); S.spark(u);
};

/* =================== SCENE 2 — WAITING ROOM (45–90) =================== */
const SC2 = newScene(45, 90);
(function(){
  const S = SC2;
  S.L = locWaiting(S.cam);
  S.otto = makeChar('otter', S.L.chars);
  S.momo = makeChar('cat', S.L.chars);
  S.pipi = makeChar('bunny', S.L.chars);
  S.bao = makeChar('panda', S.L.chars, {coat:'#BFE3F5'});
  S.kuku = makeChar('squirrel', S.L.charsFront);
  attach(S.pipi, 1, 'ice', itIcePack(G(null, 'translate(-6 0)')));
  attach(S.otto, 1, 'camera', itCamera(G(null, 'translate(-20 -6)')));
  S.blockCols = ['#FFB3C7','#9FD3E8','#FFD27A','#A6E3C3'];
  function block(parent, col){ const b = G(parent); mk('rect', S4({x:-23, y:-23, width:46, height:46, rx:7, fill:col}), b); mk('path', {d:STAR_D, fill:'#FFFFFF', opacity:0.75, transform:'scale(0.8)'}, b); return b; }
  attach(S.kuku, 1, 'block', block(G(), '#FFFFFF'));
  S.handBlock = S.kuku.armR.items.block;
  S.blocks = S.blockCols.map(c => block(S.L.blocks, c));
  S.flash = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:12.0, x:866, y:640, n:4}, {t:20.0, x:520, y:700, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:38.4, x:900, y:760, n:5, r:90}, {t:16.2, x:1330, y:820, n:4, r:50}]);
})();
const BLOCK_T = [3.5, 7.0, 10.5, 14.0];
const BLOCK_REST = [[1300,1060],[1372,1050],[1250,1040],[1410,1066]];
SC2.update = function(u){
  const S = this;
  camZoom(S, 960, 760, K(u, [[0,1.1],[45,1.04]]));
  S.L.update(u);
  const doorK = K(u, [[26.2,1],[27.4,0.12],[40.4,0.12],[41.6,1]]);
  T(S.L.door, `translate(1720 0) scale(${doorK.toFixed(4)} 1) translate(-1720 0)`);
  /* ---- PIPI + MOMO on the bench ---- */
  const called = rh(u, 30.0, 30.4, 31.6, 32.2);
  const hold = rh(u, 7.0, 8.2, 23.5, 24.6);
  // pipi path
  let px = 960, py = 846, ph = 0, pwAmt = 0;
  if (u > 31.8){
    const v = clamp((u - 31.8)/0.8, 0, 1);
    px = lerp(960, 1010, sm(v)); py = lerp(846, 975, sm(v)); ph = 40*4*v*(1-v);
    if (u > 33.0){ const w = walkX(u, [[33.0,1010],[37.8,1790]]); px = w.x; pwAmt = w.amt; }
  }
  const nerv = 1 - sm((u - 33)/2);
  pose(S.pipi, {x:px, y:py, s:1, hop:ph, walk: px/86, walkAmt: pwAmt, feet:true,
    tR: [56, -136], R:'ice', tL: lerpP([-36,-56], [-94, -62], hold),
    eyes: hold > 0.6 && u > 11 && u < 14 ? 'happy' : 'open', lookX: u < 26 ? 5 : 3, brow: true,
    mouth: called > 0.3 ? 'small' : (hold > 0.6 && u > 11 && u < 14 ? 'smile' : 'wavy'),
    sweat: 0.6*nerv + 0.4*called, tremble: (0.35 + 0.5*called)*nerv, ear: -10, excl: called});
  S.pipi.root.setAttribute('opacity', (1 - sm((u - 37.0)/0.8)).toFixed(3));
  let mx = 770, my = 846, mh = 0, mwAmt = 0;
  if (u > 32.2){
    const v = clamp((u - 32.2)/0.8, 0, 1);
    mx = lerp(770, 900, sm(v)); my = lerp(846, 975, sm(v)); mh = 36*4*v*(1-v);
    if (u > 33.4){ const w = walkX(u, [[33.4,900],[38.4,1720]]); mx = w.x; mwAmt = w.amt; }
  }
  pose(S.momo, {x:mx, y:my, s:1, hop:mh, walk: mx/86, walkAmt: mwAmt,
    tR: lerpP([36,-56], [96, -62], hold), tL: [-36,-56], tilt: 7*hold,
    eyes: hold > 0.6 && u > 11 && u < 14 ? 'happy' : 'open', lookX: 4*hold, mouth: hold > 0.5 ? 'smile' : 'smile'});
  S.momo.root.setAttribute('opacity', (1 - sm((u - 37.6)/0.8)).toFixed(3));
  /* ---- OTTO at the aquarium ---- */
  const f0 = 305 + 110*Math.sin(TAU*(u/9));
  const camU = rh(u, 17.0, 17.8, 19.8, 20.6);
  const bye = rh(u, 35.0, 35.6, 40.4, 41.0);
  const ow = walkX(u, [[0,540],[45,540]]);
  pose(S.otto, {x:540, y:975, s:1, tR: lerpP([34,-56], [10, -140], camU), tL: lerpP(lerpP([-34,-56], [-20, -138], camU), [-96, -186 + 12*Math.sin(TAU*2.2*u)], bye),
    R: camU > 0.2 ? 'camera' : null, lookX: bye > 0.3 ? 6 : clamp((f0 - 540)/25, -8, 2), lookY: -2,
    eyes: (u > 18.6 && u < 21) || bye > 0.4 ? 'happy' : 'open', mouth: (u > 18.6 && u < 21) || bye > 0.4 ? 'open' : 'smile',
    tilt: bye > 0.3 ? 4 : -4, hop: hopF(u, 14.0, 0.45, 18)});
  const fl = bump(u, 18.7, 0.35), cp = paw(S.otto, 1);
  S.flash.setAttribute('opacity', fl.toFixed(3)); T(S.flash, `translate(${cp[0] - 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, fl*0.2);
  /* ---- KUKU builds a block tower ---- */
  let ktR = [36,-54], holdB = false, bCol = null;
  const topple = u >= 24.4;
  BLOCK_T.forEach((t0, i) => {
    const v = u - t0;
    if (v > -1.1 && v < 0){ const w = sm((v + 1.1)/0.5), w2 = sm((v + 0.5)/0.5); ktR = lerpP(lerpP([36,-54], [80, -20], w), [110, -60 - i*46], w2); holdB = v < -0.05; bCol = S.blockCols[i]; }
    else if (v >= 0 && v < 0.8){ ktR = lerpP([110, -60 - i*46], [36, -54], sm(v/0.8)); }
  });
  if (holdB && bCol) S.handBlock.firstChild.setAttribute('fill', bCol);
  const wob = u > 19.5 && !topple ? Math.sin(TAU*3*u) * sm((u - 19.5)/4.5) * 4 : 0;
  S.blocks.forEach((b, i) => {
    const placed = u >= BLOCK_T[i];
    show(b, placed);
    if (!placed) return;
    const sx = 1330, sy = 1012 - 23 - i*46;
    if (!topple){ T(b, `rotate(${wob*(i+1)*0.5} 1330 1012) translate(${sx} ${sy})`); }
    else {
      const v = clamp((u - 24.4 - i*0.06)/0.9, 0, 1);
      const p = arcP([sx, sy], [BLOCK_REST[i][0], BLOCK_REST[i][1] - 23], v, 30 + i*14);
      T(b, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${(sm(v)*(i%2 ? 200 : -160)).toFixed(1)})`);
    }
  });
  const oops = rh(u, 24.5, 24.7, 25.5, 25.9), laugh = rh(u, 25.8, 26.2, 28.4, 29.0);
  const kBye = rh(u, 35.2, 35.8, 40.6, 41.2);
  pose(S.kuku, {x:1210, y:1010, s:0.95, tR: kBye > 0 ? lerpP(ktR, [96, -186 + 12*Math.sin(TAU*2.4*u)], kBye) : ktR, tL: [-36,-54], R: holdB ? 'block' : null,
    hop: hopF(u, 24.5, 0.4, 22) + hopF(u, 26.4, 0.4, 18) + hopF(u, 27.4, 0.4, 18),
    eyes: oops > 0.3 ? 'squeeze' : (laugh > 0.3 || kBye > 0.4 ? 'happy' : 'open'), lookX: kBye > 0.3 ? 6 : 6, lookY: u < 24 ? 2 : 0,
    mouth: oops > 0.3 ? 'small' : (laugh > 0.3 || kBye > 0.4 ? 'open' : 'smile'), tail: 14*laugh*Math.sin(TAU*3*u), excl: oops*0.9});
  /* ---- DR. BAO ---- */
  const bw = walkX(u, [[27.0,1840],[29.4,1660],[36.4,1660],[39.2,1850]]);
  const bWave = rh(u, 29.6, 30.2, 32.6, 33.2);
  pose(S.bao, {x: bw.x, y: 975, s: 1.05, walk: bw.x/86, walkAmt: bw.amt, apron:true, mirror:true,
    tL: lerpP([-36,-56], [-96, -186 + 12*Math.sin(TAU*2.2*u)], bWave), tR:[36,-56],
    eyes: bWave > 0.4 ? 'happy' : 'open', lookX: -5, mouth: bWave > 0.4 ? 'talk' : 'smile'});
  S.bao.root.setAttribute('opacity', (sm((u - 26.8)/0.6) * (1 - sm((u - 38.6)/0.8))).toFixed(3));
  show(S.bao.root, u > 26.6 && u < 39.6);
  S.hearts(u); S.spark(u);
};

/* =================== SCENE 3 — DENTIST TIME (90–135) =================== */
const SC3 = newScene(90, 135);
(function(){
  const S = SC3;
  S.L = locDental(S.cam);
  S.L.lampCone.setAttribute('points', '880,280 955,265 1080,720 880,740');
  S.pipi = makeChar('bunny', S.L.chars);
  S.bao = makeChar('panda', S.L.charsFront, {coat:'#BFE3F5'});
  S.momo = makeChar('cat', S.L.charsFront);
  attach(S.bao, -1, 'mirror', itDentMirror(G()));
  attach(S.bao, -1, 'polish', itPolisher(G()));
  attach(S.bao, 1, 'cup', itPaperCup(G()));
  attach(S.bao, 1, 'star', G()); itStar(S.bao.armR.items.star, 1.2);
  attach(S.bao, 1, 'brush', itToothbrush(G(), '#FFB3C7'));
  attach(S.pipi, 1, 'cup', itPaperCup(G()));
  attach(S.pipi, 1, 'brush', itToothbrush(G(null, 'rotate(40)'), '#FFB3C7'));
  S.flyStar = G(S.L.fx); itStar(S.flyStar, 1.2);
  S.flyBrush = G(S.L.fx); itToothbrush(S.flyBrush, '#FFB3C7');
  S.hearts = heartBursts(S.L.fx, [{t:34.7, x:960, y:560, n:5}, {t:41.2, x:620, y:700, n:3}]);
})();
SC3.update = function(u){
  const S = this;
  camZoom(S, 960, 720, K(u, [[0,1.14],[8,1.22],[26,1.22],[30,1.12],[45,1.08]]));
  const lamp = sm((u - 3.0)/0.3) * (1 - sm((u - 26.0)/0.4));
  S.L.update(u, lamp);
  const rot = K(u, [[0,44],[26.4,44],[28.4,14],[45,14]]);
  const pO = {x:880, y:828, s:1.05};
  T(S.L.backrest, `translate(${pO.x} ${pO.y}) scale(${pO.s}) rotate(${rot.toFixed(2)} 0 -60)`);
  const aah = rh(u, 5.6, 6.2, 25.6, 26.2);
  const calm = sm((u - 10)/4);
  const sticker = u > 34.4;
  const cupT = rh(u, 30.0, 30.6, 31.8, 32.6);
  const gotBrush = u > 38.0;
  const proud = rh(u, 38.2, 39.0, 42.4, 43.2);
  pose(S.pipi, Object.assign({}, pO, {rot, feet:true, still: rot > 25,
    tR: gotBrush ? lerpP([40, -60], [70, -176], proud) : (u > 30.2 && u < 33.2 ? lerpP([40,-60], [10, -120], cupT) : [36,-56]),
    R: gotBrush ? 'brush' : (u > 30.2 && u < 33.2 ? 'cup' : null), tL:[-36,-56],
    eyes: aah > 0.5 ? (calm > 0.5 ? 'sleep' : 'squeeze') : (sticker || u > 28.6 ? 'happy' : 'open'),
    mouth: aah > 0.3 ? 'aah' : (u > 32.0 && u < 33.4 ? 'chew' : (sticker ? 'open' : 'wavy')), chew: 0.5 + 0.5*Math.sin(TAU*5*u),
    brow: u < 26 && !(aah > 0.5 && calm > 0.5), sweat: 0.7*(1 - sm((u - 8)/3)), tremble: 0.4*(1 - sm((u - 9)/3)),
    sticker, ear: -6 + (sticker ? 8 : 0)}));
  const mouthW = headW(S.pipi, 0, 30);
  /* ---- DR. BAO ---- */
  const bO = {x:1090, y:975, s:1.05};
  const lampReach = rh(u, 1.8, 2.6, 3.0, 3.8);
  const tool1 = rh(u, 7.0, 7.8, 16.4, 17.0), tool2 = rh(u, 17.0, 17.6, 25.4, 26.0);
  const work = Math.max(tool1, tool2);
  const giveCup = rh(u, 28.8, 29.6, 30.0, 30.6);
  const giveStar = rh(u, 33.0, 33.6, 33.8, 34.4);
  const giveBrush = rh(u, 36.6, 37.2, 37.4, 38.0);
  const bWave = rh(u, 41.6, 42.2, 44, 45);
  const toolTarget = toLocal(bO, mouthW[0] + 42 + 4*Math.sin(TAU*u*1.3)*work, mouthW[1] + 30 + 3*Math.cos(TAU*u*1.1)*work);
  let btL = lerpP([-36,-56], toolTarget, work);
  btL = lerpP(btL, [-96, -186 + 12*Math.sin(TAU*2.2*u)], bWave);
  let btR = lerpP([36,-56], [40, -200], lampReach);
  btR = lerpP(btR, [-80, -150], Math.max(giveCup, giveStar, giveBrush));
  pose(S.bao, Object.assign({}, bO, {apron:true, mirror:true, tL: btL, tR: btR,
    L: tool1 > 0.2 ? 'mirror' : (tool2 > 0.2 ? 'polish' : null),
    R: giveCup > 0.05 ? 'cup' : (giveStar > 0.05 ? 'star' : (giveBrush > 0.05 ? 'brush' : null)),
    bt: -9*work, hx: -10*work, tilt: -8*work + 2*Math.sin(TAU*u*0.6)*work, lookX: -7, lookY: 4*work,
    eyes: bWave > 0.3 || (u > 34.4 && u < 37) ? 'happy' : 'open', mouth: (u > 4 && u < 6.4) || (u > 28.8 && u < 30) ? 'talk' : (bWave > 0.3 ? 'open' : 'smile'),
    rotL: tool2 > 0.2 ? 6*Math.sin(TAU*u*9) : 0}));
  // sticker + toothbrush flights
  const sv = (u - 33.8)/0.6;
  if (sv > 0 && sv < 1){ show(S.flyStar, true); const p = arcP(paw(S.bao, 1), rotPt(S.pipi, 22, -64), sv, 80); T(S.flyStar, `translate(${p[0]} ${p[1]}) rotate(${360*sv})`); } else show(S.flyStar, false);
  const tv = (u - 37.4)/0.6;
  if (tv > 0 && tv < 1){ show(S.flyBrush, true); const p = arcP(paw(S.bao, 1), paw(S.pipi, 1), tv, 70); T(S.flyBrush, `translate(${p[0]} ${p[1]}) rotate(${-60 + 360*tv})`); } else show(S.flyBrush, false);
  /* ---- MOMO cheering ---- */
  const clap = rh(u, 34.4, 34.8, 37.4, 37.8);
  const cl = Math.abs(Math.sin(TAU*2.4*u));
  pose(S.momo, {x:560, y:985, s:1, tL: lerpP([-36,-56], [-6 - 18*cl, -104], clap), tR: lerpP([36,-56], [6 + 18*cl, -104], clap),
    brow: u < 26, eyes: clap > 0.3 || u > 28.6 ? 'happy' : 'open', lookX: 6, lookY: -3, mouth: clap > 0.3 ? 'open' : (u < 26 ? 'small' : 'smile'),
    tilt: 5, hop: hopF(u, 35.2, 0.4, 14) + hopF(u, 36.2, 0.4, 14)});
  S.sp1(u); S.sp2(u);
  S.hearts(u);
};
// sparkle anchors that follow moving targets
(function(){
  const S = SC3;
  S.sp1 = (function(){
    const g = G(S.L.fx); const f = sparkles(g, [{t:15.0, x:0, y:0, n:4, r:40}, {t:22.0, x:0, y:0, n:4, r:40}, {t:25.0, x:0, y:0, n:5, r:46}]);
    const w = function(u){ const a = headW(S.pipi, 0, 30); T(g, `translate(${a[0]} ${a[1]})`); f(u); }; return w;
  })();
  S.sp2 = (function(){
    const g = G(S.L.fx); const f = sparkles(g, [{t:38.6, x:0, y:-40, n:5, r:70}]);
    return function(u){ const a = paw(S.pipi, 1); T(g, `translate(${a[0]} ${a[1]})`); f(u); };
  })();
})();

/* =================== SCENE 4 — GOODNIGHT SMILES (135–180) =================== */
const SC4 = newScene(135, 180);
(function(){
  const S = SC4;
  S.L = locHome(S.cam, {night:true});
  S.momo = makeChar('cat', S.L.charsFront);
  S.pipi = makeChar('bunny', S.L.charsFront);
  S.otto = makeChar('otter', S.L.charsFront);
  S.kuku = makeChar('squirrel', S.L.charsFront);
  S.cast = [S.momo, S.pipi, S.otto, S.kuku];
  S.cast.forEach((c, i) => {
    attach(c, -1, 'pudding', itPudding(G()));
    attach(c, 1, 'spoon', itSpoon(G(null, 'translate(0 -4)'), '#E3E9EF'));
    attach(c, 1, 'brush', itToothbrush(G(null, 'rotate(70) translate(0 -6)'), ['#C9B6F2','#FFB3C7','#8FD6C4','#FFD27A'][i]));
  });
  attach(S.otto, 1, 'camera', itCamera(G(null, 'translate(-20 -6)')));
  S.foam = S.cast.map(() => bubblesFx(S.L.fx, 5, '#FFFFFF'));
  S.z1 = zText(S.L.fx); S.z2 = zText(S.L.fx);
  S.flash = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:6.0, x:760, y:720, n:3}, {t:11.0, x:1240, y:720, n:3}, {t:36.5, x:1000, y:700, n:5}]);
})();
SC4.update = function(u){
  const S = this;
  camZoom(S, 960, 800, K(u, [[0,1.16],[45,1.26]]));
  const dim = sm((u - 31)/5);
  S.L.update(u, dim);
  const xs = [660, 880, 1110, 1340];
  const lean = sm((u - 32)/2.4);
  const yawnT = [27.5, 29.0, 26.0, 24.5];
  S.cast.forEach((c, i) => {
    const per = 3.4, off = i*0.85;
    const eatOn = u > 1.0 && u < 14.2;
    const w = mod(u - 1.0 - off, per);
    const up = eatOn && u > 1.0 + off ? bump(w, 0.2, 1.5) : 0;
    const chewing = eatOn && u > 1.0 + off && w > 1.1 && w < 2.7;
    const brushOn = rh(u, 15.4, 16.2, 23.6, 24.4) * (i === 2 ? (1 - rh(u, 20.4, 21.0, 22.8, 23.4)) : 1);
    const bx = Math.sin(TAU*u*3.6 + i);
    const yawn = rh(u, yawnT[i], yawnT[i] + 0.4, yawnT[i] + 1.3, yawnT[i] + 1.8);
    const sleepy = sm((u - (yawnT[i] + 1.8))/2.5);
    const leanDir = i === 1 ? -1 : (i === 3 ? -1 : 0);
    let tR = lerpP([24, -60], [6, -122], up);
    tR = lerpP(tR, [10 + 12*bx, -124], brushOn);
    let tL = eatOn ? [-30, -64] : lerpP([-30,-64], [-36,-56], sm((u - 14.2)/0.6));
    tR = lerpP(tR, [36, -56], sleepy*(1 - brushOn));
    const camU = i === 2 ? rh(u, 20.4, 21.0, 22.8, 23.4) : 0;
    if (camU > 0){ tR = lerpP(tR, [20, -140], camU); tL = lerpP(tL, [-22, -136], camU); }
    pose(c, {x: xs[i] + leanDir*28*lean, y: 1010, s: 1.04, bt: leanDir*9*lean, sleep: sleepy > 0.5,
      tR, tL, L: u < 14.4 ? 'pudding' : null, R: camU > 0.2 ? 'camera' : (brushOn > 0.05 ? 'brush' : (u < 14.6 ? 'spoon' : null)),
      eyes: yawn > 0.3 ? 'squeeze' : (sleepy > 0.5 ? 'sleep' : (chewing || brushOn > 0.5 || (u > 22.6 && u < 24) ? 'happy' : 'open')),
      mouth: yawn > 0.3 ? 'yawn' : (chewing ? 'chew' : (brushOn > 0.4 ? 'small' : 'smile')), chew: 0.5 + 0.5*Math.sin(TAU*3*u + i),
      tilt: leanDir*12*lean + (chewing ? 4 : 0) + 3*brushOn*bx, hy: 8*sleepy, lookY: up > 0.1 ? 0 : (eatOn ? 5 : 0),
      sticker: i === 1, blink: sleepy > 0.2 ? Math.min(1, blinkAt(u, 2.6, i) * (1 - 0.5*sleepy)) : null});
    S.foam[i](headW(c, 6, 34)[0], headW(c, 6, 34)[1], u, brushOn, 18, 30);
  });
  const fl = bump(u, 22.0, 0.35), cp = paw(S.otto, 1);
  S.flash.setAttribute('opacity', fl.toFixed(3)); T(S.flash, `translate(${cp[0] - 20} ${cp[1] - 8}) scale(${1 + 3*fl})`);
  FLASH.v = Math.max(FLASH.v, fl*0.2);
  const zA = sm((u - 33)/2);
  const h1 = headW(S.pipi, 40, -60), h2 = headW(S.kuku, 40, -60);
  S.z1(h1[0], h1[1], u, zA); S.z2(h2[0], h2[1], u + 1.3, zA);
  S.hearts(u);
};

/* =========================== GLOBAL =========================== */
const SCENES = [SC1, SC2, SC3, SC4];
const UI = $('ui');
const LABELS = [['Morning Ouch', ICONS.sun], ['Waiting Room', ICONS.chair], ['Dentist Time', ICONS.tooth], ['Goodnight Smiles', ICONS.moon]]
  .map(a => { const l = label(UI, a[0], a[1]); l.style.display = 'none'; return l; });
// intro title card
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
