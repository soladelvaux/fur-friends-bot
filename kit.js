/* =====================================================================
   FUR FRIENDS — episode kit (Day 5+)
   - scene(t0, t1): scene container with camera
   - actor(S, kind, opts): character driven by a timeline of actions
   - sfx()/amb()/MUSIC: audio timeline exported as window.AUDIO
   - EPISODE(cfg): global runner (intro card, chapter labels, fades)
   ===================================================================== */
DEFS = $('defs');
rad('glowW', [[0,'#FFF6D8',0.9],[0.5,'#FFE9B0',0.35],[1,'#FFE9B0',0]]);
rad('glowLamp', [[0,'#FFE3A3',0.85],[0.45,'#FFC977',0.3],[1,'#FFC977',0]]);
rad('vig', [[0.66,'#000',0],[1,'#3a1d10',0.14]]);
const AUDIO = {dur: 180, music: {seed: 5, key: 0, bpm: 74, prog: 0, gain: 0.36}, amb: [], sfx: []};
window.AUDIO = AUDIO;
const FLASH = {v: 0};
const SCN = $('scenes');
const ACTORS = [];
const panOf = x => clamp((x - 960)/960*0.75, -0.8, 0.8);
function sfx(t, type, gain, pan, o){ AUDIO.sfx.push(Object.assign({t: +t.toFixed(3), type, gain: gain || 0.05, pan: pan || 0}, o || {})); }
function amb(type, t0, t1, gain, o){ AUDIO.amb.push(Object.assign({type, t0, t1, gain: gain === undefined ? 1 : gain}, o || {})); }

/* ---------------- scenes ---------------- */
function scene(t0, t1, opts){
  opts = opts || {};
  const S = {t0, t1, actors: [], cz: opts.cam || [960, 800, 1.08, 1.12], look: opts.look || null};
  S.g = G(SCN); S.cam = G(S.g); S.g.style.display = 'none';
  S.sfx = (t, type, gain, pan, o) => sfx(S.t0 + t, type, gain, pan, o);
  S.amb = (type, a, b, gain, o) => amb(type, S.t0 + a, S.t0 + b, gain, o);
  S.update = function(u){
    if (S.look){   // look:[tx, ty, z0, z1] (or fn(u) -> [tx, ty, z]) puts world point (tx,ty) at screen centre
      const q = typeof S.look === 'function' ? S.look(u) : [S.look[0], S.look[1], lerp(S.look[2], S.look[3] === undefined ? S.look[2] : S.look[3], u/(S.t1 - S.t0))];
      T(S.cam, `translate(960 540) scale(${q[2].toFixed(4)}) translate(${(-q[0]).toFixed(1)} ${(-q[1]).toFixed(1)})`);
      if (S.pre) S.pre(u); S.actors.forEach(a => a.update(u)); if (S.post) S.post(u); return;
    }
    const c = S.cz;
    const z = typeof c === 'function' ? c(u) : [c[0], c[1], lerp(c[2], c[3], u/(S.t1 - S.t0))];
    T(S.cam, `translate(${z[0]} ${z[1]}) scale(${z[2].toFixed(4)}) translate(${-z[0]} ${-z[1]})`);
    if (S.pre) S.pre(u);
    S.actors.forEach(a => a.update(u));
    if (S.post) S.post(u);
  };
  return S;
}

/* ---------------- items fly / helpers ---------------- */
function flyItem(el, u, t0, d, a, b, h, spin, sc){
  const v = (u - t0)/d;
  if (v > 0 && v < 1){ show(el, true); const p = arcP(a, b, v, h); T(el, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${((spin||0)*v).toFixed(1)}) scale(${sc || 1})`); return true; }
  show(el, false); return false;
}
function place(el, x, y, s, r){ T(el, `translate(${x.toFixed ? x.toFixed(1) : x} ${y.toFixed ? y.toFixed(1) : y}) rotate(${r || 0}) scale(${s || 1})`); }
function popIn(el, u, t0, x, y, s){ const v = sm((u - t0)/0.45); show(el, v > 0.001); if (v > 0.001) place(el, x, y, (s || 1)*(v + 0.18*bump(u, t0 + 0.2, 0.6))); }
function photoFX(S, layer){
  const star = mk('path', {d:STAR_D, fill:'#FFFDE8', opacity:0}, layer);
  return function(u, times, a){
    let fl = 0; times.forEach(t => fl = Math.max(fl, bump(u, t, 0.35)));
    const p = paw(a.c, 1);
    star.setAttribute('opacity', fl.toFixed(3)); T(star, `translate(${p[0] - 18} ${p[1] - 10}) scale(${1 + 3*fl})`);
    FLASH.v = Math.max(FLASH.v, 0.18*fl);
  };
}
function ripples(layer, n, col){
  const rs = []; for (let i=0;i<(n||3);i++) rs.push(mk('ellipse', {rx:10, ry:4, fill:'none', stroke:col || '#FFFFFF', 'stroke-width':4, opacity:0}, layer));
  return function(u, t0, x, y, size){
    const v = (u - t0)/1.2;
    rs.forEach((r, i) => { const w = v - i*0.18; if (w <= 0 || w >= 1){ r.setAttribute('opacity', 0); return; }
      r.setAttribute('cx', x); r.setAttribute('cy', y); r.setAttribute('rx', ((size||1)*(16 + 70*w)).toFixed(1)); r.setAttribute('ry', ((size||1)*(5 + 16*w)).toFixed(1)); r.setAttribute('opacity', (1 - w).toFixed(3)); });
  };
}
function notesFx(layer, n){
  const ns = []; for (let i=0;i<(n||3);i++) ns.push(mk('path', {d:NOTE_D, fill:['#B9A3F0','#FF9DB5','#8FD6C4'][i%3], stroke:OL, 'stroke-width':2.4, opacity:0}, layer));
  return function(x, y, u, amt){
    ns.forEach((e, i) => { const v = mod(u*0.32 + i/ns.length, 1), side = i % 2 ? 1 : -1;
      T(e, `translate(${(x + side*(70 + 30*v)).toFixed(1)} ${(y - 110*v).toFixed(1)}) rotate(${side*12*Math.sin(TAU*v)})`);
      e.setAttribute('opacity', (Math.sin(Math.PI*v)*0.9*amt).toFixed(3)); });
  };
}
function fireflies(layer, n, box){
  const fs = []; for (let i=0;i<n;i++) fs.push({el: mk('circle', {r:R(3,6), fill:'#FFF2A0'}, layer), gl: mk('circle', {r:R(14,22), fill:'url(#glowLamp)'}, layer), x0:R(box[0], box[2]), y0:R(box[1], box[3]), ph:rnd()});
  return function(u, amt){
    fs.forEach(f => { const a = amt*(0.5 + 0.5*Math.sin(TAU*(u/2.2 + f.ph*4)));
      const x = f.x0 + 40*Math.sin(TAU*(u/9 + f.ph)), y = f.y0 - 40*Math.sin(TAU*(u/7 + f.ph*2));
      [f.el, f.gl].forEach(e => { e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); });
      f.el.setAttribute('opacity', a.toFixed(3)); f.gl.setAttribute('opacity', (0.7*a).toFixed(3)); });
  };
}
function butterflies(layer, n, box, cols){
  const bs = [];
  for (let i=0;i<n;i++){
    const g = G(layer); const c = (cols || ['#FFB3C7','#FFE07A','#B9A3F0','#9FD3F5'])[i%4];
    const wl = mk('path', S4({d:'M0 0 Q-20 -22 -24 -4 Q-20 10 0 0 Z', fill:c}), g), wr = mk('path', S4({d:'M0 0 Q20 -22 24 -4 Q20 10 0 0 Z', fill:c}), g);
    mk('ellipse', {rx:3, ry:9, fill:OL}, g);
    bs.push({g, wl, wr, x0:R(box[0], box[2]), y0:R(box[1], box[3]), ph:rnd(), sp:R(0.6, 1.1)});
  }
  return function(u, amt){
    bs.forEach(b => { show(b.g, amt > 0.01); b.g.setAttribute('opacity', (amt || 0).toFixed(3));
      const x = b.x0 + 140*Math.sin(TAU*(u*0.05*b.sp + b.ph)), y = b.y0 + 50*Math.sin(TAU*(u*0.11*b.sp + b.ph*3));
      const f = 0.25 + 0.75*Math.abs(Math.sin(TAU*u*3*b.sp + b.ph*9));
      T(b.g, `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.8)`); T(b.wl, `scale(${f.toFixed(3)} 1)`); T(b.wr, `scale(${f.toFixed(3)} 1)`); });
  };
}
function leavesFx(layer, n, box, cols){
  const ls = []; for (let i=0;i<n;i++) ls.push({el: mk('ellipse', S4({rx:9, ry:14, fill:(cols || ['#F4A259','#E76F51','#F6C453'])[i%3]}), layer), x0:R(box[0], box[2]), ph:rnd(), sp:R(0.6,1)});
  return function(u, amt){
    ls.forEach(l => { const v = mod(u*0.06*l.sp + l.ph, 1);
      const x = l.x0 + 60*Math.sin(TAU*(v*2 + l.ph)) - 120*v, y = box[1] + (box[3] - box[1])*v;
      T(l.el, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(v*720 + l.ph*360).toFixed(1)})`); l.el.setAttribute('opacity', (Math.sin(Math.PI*v)*amt).toFixed(3)); });
  };
}

/* ---------------- actors ---------------- */
const REST_L = [-36, -56], REST_R = [36, -56];
const NAMES = {cat:'momo', bunny:'pipi', otter:'otto', squirrel:'kuku'};
function actor(S, kind, opts){
  opts = opts || {};
  const A = {S, kind, acts: [], base: opts.base || {}, layer: opts.layer};
  A.c = makeChar(kind, opts.layer, opts.coat ? {coat: opts.coat} : undefined);
  A.y = opts.y === undefined ? 950 : opts.y; A.s = opts.s || 1;
  A.path = Array.isArray(opts.x) ? opts.x : [[0, opts.x === undefined ? 960 : opts.x]];
  A.ypath = opts.ypath || null;
  A.stride = opts.stride || 86;
  A.steps = opts.steps === undefined ? 'step' : opts.steps;     // footstep sound type or null
  if (kind === 'bunny' && A.base.phones === undefined) A.base.phones = true;
  A.item = (side, name, el) => { attach(A.c, side === 'L' ? -1 : 1, name, el); return el; };
  A.do = function(type, t, d, o){ A.acts.push({type, t, d: d || 1, o: o || {}}); return A; };
  A.X = u => K(u, A.path);
  A.Y = u => A.ypath ? K(u, A.ypath) : A.y;
  A.update = u => actorUpdate(A, u);
  S.actors.push(A); ACTORS.push(A);
  return A;
}
const W = (u, t, d, ai, ao) => { ai = Math.min(ai === undefined ? 0.35 : ai, d/3); ao = Math.min(ao === undefined ? 0.35 : ao, d/3); return rh(u, t, t + ai, t + d - ao, t + d); };
const side2 = s => s === 'L' ? -1 : 1;
function arm(st, side, p, w){ const k = side === 'L' ? 'tL' : 'tR'; st[k] = lerpP(st[k], side === 'L' ? [-p[0], p[1]] : p, w); }
function actorUpdate(A, u){
  const x = A.X(u), y = A.Y(u);
  const v = (A.X(u + 0.05) - A.X(u - 0.05))/0.1;
  const amt = clamp(Math.abs(v)/50, 0, 1);
  const st = Object.assign({x, y, s: A.s, tL: REST_L.slice(), tR: REST_R.slice(), L: null, R: null, eyes: 'open', mouth: 'smile',
    hop: 0, tilt: 0, bt: 0, hy: 0, hx: 0, rot: 0, tremble: 0, lookX: 0, lookY: 0, ear: 0, excl: 0, sweat: 0, blushAmt: 1}, A.base);
  if (amt > 0.02){ st.walk = x/A.stride + (A.c.seed || 0); st.walkAmt = amt; }
  let eyesW = 0, mouthW = 0;
  const face = (w, e, m) => { if (e && w > 0.4 && w >= eyesW){ st.eyes = e; eyesW = w; } if (m && w > 0.4 && w >= mouthW){ st.mouth = m; mouthW = w; } };
  for (const a of A.acts){
    const {t, d, o} = a;
    if (u < t - 0.01 || u > t + d + 0.01){
      if (a.type === 'carry' || a.type === 'hold'){} else continue;
    }
    const w = W(u, t, d, o.ai, o.ao);
    const lu = u - t;
    const sd = o.side || 'R';
    switch (a.type){
      case 'wave': { arm(st, sd, [96, -186 + 12*Math.sin(TAU*2.2*u)], w); face(w, 'happy', 'open'); st.tilt += 5*w*Math.sin(TAU*1.1*u); break; }
      case 'cheer': { arm(st, 'L', [90, -186 + 10*Math.sin(TAU*2.6*u)], w); arm(st, 'R', [90, -186 + 10*Math.sin(TAU*2.6*u + 1)], w); face(w, 'happy', 'open');
        st.hop += hopF(u, t + 0.15, 0.45, o.h || 34) + (d > 1.6 ? hopF(u, t + 1.0, 0.45, (o.h || 34)*0.8) : 0); break; }
      case 'clap': { const c = Math.abs(Math.sin(TAU*2.4*lu)); arm(st, 'L', [6 + 18*c, -104], w); arm(st, 'R', [6 + 18*c, -104], w); face(w, 'happy', 'open'); break; }
      case 'sip': { arm(st, sd, [10, -118], w); if (w > 0.05) st[sd] = o.item; face(w, 'happy', 'small'); st.tilt += -3*w; break; }
      case 'eat': {   // repeated bites on o.item with chewing
        const per = o.per || 3.0; const k = Math.floor(lu/per), ph = lu - k*per;
        const up = bump(ph, 0.25, 1.1);
        arm(st, sd, o.rest || [40, -84], w); arm(st, sd, [8, -122], up*w);
        if (w > 0.05) st[sd] = o.item;
        const chewing = ph > 0.8 && ph < 2.4;
        if (chewing && w > 0.3){ st.mouth = 'chew'; mouthW = 1; st.chew = 0.5 + 0.5*Math.sin(TAU*3*u); st.eyes = 'happy'; eyesW = 1; st.tilt += 4; }
        const el = A.c[sd === 'L' ? 'armL' : 'armR'].items[o.item];
        if (el && el.body && o.bites){ const b = clamp(Math.floor((lu - 0.8)/per) + 1, 0, o.bites); T(el.body, `scale(${(1 - 0.8*b/o.bites + (b >= o.bites ? 0 : 0)).toFixed(3)})`); }
        break; }
      case 'hold': case 'carry': {
        const t1 = t + d;
        if (u < t || u > t1) break;
        const hw = (o.ease === false) ? 1 : W(u, t, d, 0.3, 0.3);
        arm(st, sd, o.at || [44, -92], o.arm === false ? 0 : hw);
        st[sd] = o.item; break; }
      case 'reach': {   // reach a world point (or point fn)
        const p = typeof o.to === 'function' ? o.to(u) : o.to; const lp = toLocal({x, y, s: A.s}, p[0], p[1]);
        st[sd === 'L' ? 'tL' : 'tR'] = lerpP(st[sd === 'L' ? 'tL' : 'tR'], lp, w); if (o.item && w > 0.2) st[sd] = o.item; st.bt += (o.lean || 0)*w; break; }
      case 'arms': { if (o.L) arm(st, 'L', typeof o.L === 'function' ? o.L(u, lu) : o.L, w); if (o.R) arm(st, 'R', typeof o.R === 'function' ? o.R(u, lu) : o.R, w);
        if (o.itemL && w > 0.1) st.L = o.itemL; if (o.itemR && w > 0.1) st.R = o.itemR; face(w, o.eyes, o.mouth); break; }
      case 'work': {   // repetitive hand motion: stir, knead, dig, write, paint, water, pat, type, row, scrub, pull
        const k = o.kind || 'stir', f = o.rate || 1.2, ph = TAU*f*lu;
        let tR = REST_R, tL = REST_L;
        if (k === 'stir'){ tR = [26 + 16*Math.cos(ph), -60 + 7*Math.sin(ph)]; tL = [-46, -66]; }
        else if (k === 'knead'){ const a = Math.max(0, Math.sin(ph)), b = Math.max(0, -Math.sin(ph)); tL = [-26, -64 + 18*a]; tR = [26, -64 + 18*b]; st.bt += 3*Math.sin(ph)*w; }
        else if (k === 'dig'){ tL = [-70 + 8*Math.sin(ph), -20 + 10*Math.abs(Math.sin(ph))]; st.bt -= 8*w; }
        else if (k === 'write'){ tR = [20 + 8*Math.sin(ph*1.7), -50 + 3*Math.sin(ph*3.1)]; tL = [-30, -50]; st.lookY = 6; }
        else if (k === 'paint'){ tR = [50 + 14*Math.sin(ph), -110 + 26*Math.cos(ph*0.5)]; }
        else if (k === 'water'){ tR = [70, -86 + 6*Math.sin(ph)]; st.bt += 6*w; }
        else if (k === 'pat'){ tR = [60, -36 + 10*Math.abs(Math.sin(ph))]; tL = [-60, -36 + 10*Math.abs(Math.cos(ph))]; st.bt += 6*w; }
        else if (k === 'type'){ tL = [-24, -56 + 6*Math.max(0, Math.sin(ph*2))]; tR = [24, -56 + 6*Math.max(0, -Math.sin(ph*2))]; }
        else if (k === 'row'){ tL = [-60 + 20*Math.cos(ph), -80 + 16*Math.sin(ph)]; tR = [60 - 20*Math.cos(ph), -80 + 16*Math.sin(ph)]; st.bt += 4*Math.sin(ph)*w; }
        else if (k === 'scrub'){ tR = [40 + 18*Math.sin(ph*2), -70]; tL = [-40 + 18*Math.sin(ph*2), -70]; }
        else if (k === 'pull'){ const a = 0.5 + 0.5*Math.sin(ph); tL = [-40, -60 - 40*a]; tR = [40, -60 - 40*a]; st.bt -= 4*a*w; }
        else if (k === 'shake'){ tR = [40, -110 + 18*Math.sin(ph*2)]; }
        else if (k === 'brush'){ tR = [56 + 10*Math.sin(ph*2), -70]; }
        if (o.dy){ tR = [tR[0], tR[1] + o.dy]; tL = [tL[0], tL[1] + o.dy]; }
        if (o.side === 'L'){ const tmp = tR; tR = [-tL[0], tL[1]]; tL = [-tmp[0], tmp[1]]; }
        if (o.only !== 'L') st.tR = lerpP(st.tR, tR, w); if (o.only !== 'R') st.tL = lerpP(st.tL, tL, w);
        if (o.itemR && w > 0.1) st.R = o.itemR; if (o.itemL && w > 0.1) st.L = o.itemL;
        face(w, o.eyes || 'open', o.mouth || 'smile'); if (o.look) { st.lookX = lerp(st.lookX, o.look[0], w); st.lookY = lerp(st.lookY, o.look[1], w); }
        break; }
      case 'talk': { face(w, o.eyes || 'open', 'talk'); st.tilt += 4*w*Math.sin(TAU*0.6*u); st.hy += 2*w*Math.sin(TAU*1.6*u); if (o.gest){ arm(st, sd, [56 + 10*Math.sin(TAU*0.9*u), -110 + 14*Math.sin(TAU*1.3*u)], w); } break; }
      case 'laugh': { face(w, 'happy', 'open'); st.tilt += 6*w*Math.sin(TAU*2.4*u); st.hy += 3*w*Math.abs(Math.sin(TAU*3*u)); arm(st, 'L', [20, -96], w*0.7); arm(st, 'R', [20, -96], w*0.7); break; }
      case 'nod': { st.hy += 6*w*Math.max(0, Math.sin(TAU*1.6*lu)); face(w, 'happy', 'smile'); break; }
      case 'shake': { st.tilt += 8*w*Math.sin(TAU*2*lu); break; }
      case 'look': { st.lookX = lerp(st.lookX, o.x || 0, w); st.lookY = lerp(st.lookY, o.y || 0, w); if (o.tilt) st.tilt += o.tilt*w; break; }
      case 'face': { face(w, o.eyes, o.mouth); break; }
      case 'happy': { face(w, 'happy', o.mouth || 'smile'); break; }
      case 'wow': { face(w, 'open', 'open'); st.excl = Math.max(st.excl, rh(u, t, t + 0.2, t + 1.0, t + 1.4)); st.hop += hopF(u, t, 0.35, 16); break; }
      case 'shy': { face(w, 'happy', 'small'); st.blushAmt = 1 + 0.8*w; st.tilt += 8*w; arm(st, 'L', [12, -104], w*0.8); arm(st, 'R', [12, -104], w*0.8); break; }
      case 'think': { arm(st, sd, [14, -112], w); st.lookY = lerp(st.lookY, -6, w); st.lookX = lerp(st.lookX, 5, w); st.tilt += 8*w; face(w, null, 'small'); break; }
      case 'point': { arm(st, sd, o.at || [100, -150], w); face(w, 'open', 'open'); break; }
      case 'hop': { st.hop += hopF(u, t, o.d || 0.45, o.h || 30); break; }
      case 'yawn': { arm(st, 'L', [70, -190], w); arm(st, 'R', [70, -190], w); face(w, 'squeeze', 'yawn'); st.tilt += 4*w; break; }
      case 'stretch': { arm(st, 'L', [50, -196], w); arm(st, 'R', [50, -196], w); face(w, 'squeeze', 'open'); st.hy -= 6*w; break; }
      case 'sleep': { if (w > 0.5){ st.sleep = true; st.eyes = 'sleep'; eyesW = 1; st.mouth = 'small'; } st.hy += 7*w; st.tilt += (o.tilt === undefined ? 10 : o.tilt)*w; if (o.arms !== false){ arm(st, 'L', [30, -60], w); arm(st, 'R', [30, -60], w); } break; }
      case 'sleepy': { st.blink = 1 - 0.55*w; face(w, null, 'small'); st.hy += 4*w; break; }
      case 'dance': { const p = TAU*(o.bpm || 1.1)*lu; st.tilt += 10*w*Math.sin(p); st.hx += 8*w*Math.sin(p); st.hop += 10*w*Math.abs(Math.sin(p));
        arm(st, 'L', [70, -150 + 30*Math.sin(p)], w); arm(st, 'R', [70, -150 - 30*Math.sin(p)], w); face(w, 'happy', 'open'); break; }
      case 'bob': { const p = TAU*(o.f || 0.6)*u; st.tilt += 5*w*Math.sin(p); st.ear += 5*w*Math.sin(p); face(w, 'happy', null); break; }
      case 'photo': { arm(st, 'R', [14, -140], w); arm(st, 'L', [22, -136], w); if (w > 0.2) st.R = o.item || 'camera'; face(w * (lu > 0.9 ? 1 : 0), 'happy', null); break; }
      case 'shiver': { st.tremble = Math.max(st.tremble || 0, w); arm(st, 'L', [20, -84], w); arm(st, 'R', [20, -84], w); break; }
      case 'pose': { const q = o; for (const k in q){ if (k === 'ai' || k === 'ao') continue; if (k === 'tL' || k === 'tR') st[k] = lerpP(st[k], q[k], w); else if (typeof q[k] === 'number' && typeof st[k] === 'number') st[k] = lerp(st[k], q[k], w); else if (w > 0.5) st[k] = q[k]; } break; }
    }
  }
  if (A.fn) A.fn(u, st);
  pose(A.c, st);
}
// sound emission from actor timelines
const ACT_SFX = {
  clap: (A, a, t0, p) => { for (let k = 0; t0 + a.t + 0.3 + k/4.8 < t0 + a.t + a.d - 0.3; k++) sfx(t0 + a.t + 0.3 + k/4.8, 'clap', 0.035, p); },
  sip: (A, a, t0, p) => sfx(t0 + a.t + a.d*0.5, 'sip', 0.07, p),
  eat: (A, a, t0, p) => { const per = a.o.per || 3.0; for (let lu = 0; lu + 0.8 < a.d - 0.4; lu += per){ sfx(t0 + a.t + lu + 0.8, a.o.snd || 'crunch', 0.08, p); sfx(t0 + a.t + lu + 1.0, 'chew', 0.025, p, {d: 1.4}); } },
  cheer: (A, a, t0, p) => { sfx(t0 + a.t + 0.6, 'thump', 0.05, p); if (a.d > 1.6) sfx(t0 + a.t + 1.45, 'thump', 0.04, p); },
  hop: (A, a, t0, p) => sfx(t0 + a.t + (a.o.d || 0.45), 'thump', 0.05, p),
  wow: (A, a, t0, p) => sfx(t0 + a.t, 'chime', 0.02, p, {f: 1568}),
  yawn: (A, a, t0, p) => sfx(t0 + a.t + 0.2, 'breath', 0.045, p, {d: Math.min(1.8, a.d)}),
  photo: (A, a, t0, p) => sfx(t0 + a.t + Math.min(1.0, a.d/2), 'shutter', 0.1, p),
  work: (A, a, t0, p) => { const s = a.o.snd; if (!s) return; const f = a.o.rate || 1.2, every = a.o.every || 1;
    for (let lu = 0.3; lu < a.d - 0.3; lu += every/f) sfx(t0 + a.t + lu, s, a.o.gain || 0.04, p, a.o.sndO); },
};
function emitActorSfx(){
  ACTORS.forEach(A => {
    const t0 = A.S.t0;
    A.acts.forEach(a => { const f = ACT_SFX[a.type]; if (f) f(A, a, t0, panOf(A.X(a.t))); });
    if (!A.steps || A.path.length < 2) return;
    let last = null;
    for (let u = A.path[0][0]; u <= A.path[A.path.length - 1][0]; u += 1/120){
      const x = A.X(u), ph = Math.floor(x/A.stride*2 + (A.c.seed || 0)*2);
      if (last !== null && ph !== last && Math.abs(A.X(u + 0.02) - A.X(u - 0.02)) > 0.04) sfx(t0 + u, A.steps, 0.03, panOf(x));
      last = ph;
    }
  });
}

/* ---------------- episode runner ---------------- */
function EPISODE(cfg){
  const SCENES = cfg.scenes, DUR = cfg.dur || 180;
  AUDIO.dur = DUR;
  if (cfg.music) Object.assign(AUDIO.music, cfg.music);
  const UI = $('ui');
  const LABELS = cfg.chapters.map(a => { const l = label(UI, a[0], a[1]); l.style.display = 'none'; return l; });
  const INTRO = G(UI);
  mk('rect', SK({x:560, y:420, width:800, height:220, rx:46, fill:'#FFFDF8', 'fill-opacity':0.95}, 5), INTRO);
  txt(INTRO, 960, 492, 'Fur Friends', 40, '#B79BE8');
  txt(INTRO, 960, 560, cfg.title, 54, OL);
  txt(INTRO, 960, 610, `Day ${cfg.day}`, 30, '#C9A27E', 'middle', 500);
  const FADES = SCENES.slice(1).map(s => s.t0);
  emitActorSfx();
  FADES.forEach(s => { sfx(s - 0.6, 'whoosh', 0.016, 0, {d: 1.2, f0: 300, f1: 1400}); sfx(s - 0.1, 'chime', 0.014, 0, {f: 784}); });
  let fitted = false;
  function setTime(t){
    t = clamp(t, 0, DUR - 1e-6);
    simTick(t);
    if (!fitted){ LABELS.forEach(l => l.fit()); fitted = true; }
    FLASH.v = 0;
    let cur = null;
    SCENES.forEach(sc => { const on = t >= sc.t0 && t < sc.t1; show(sc.g, on); if (on) cur = sc; });
    if (cur) cur.update(t - cur.t0);
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
    $('dark').setAttribute('opacity', sm((t - (DUR - 3.8))/3.6).toFixed(3));
    $('flash').setAttribute('opacity', FLASH.v.toFixed(3));
  }
  window.setTime = setTime;
  window.DUR = DUR;
  setTime(0);
  if (!window.__RENDER){
    const start = performance.now();
    (function loop(now){ setTime(((now - start)/1000) % DUR); requestAnimationFrame(loop); })(start);
  }
}

/* ---------------- extra icons & props ---------------- */
const IC = {
  kite: g => { mk('path', S4({d:'M0 -22 L16 0 L0 22 L-16 0 Z', fill:'#FF9AA2'}), g); mk('path', {d:'M0 -22 V22 M-16 0 H16', stroke:OL, 'stroke-width':2.5}, g); },
  duck: g => { mk('ellipse', S4({cx:2, cy:6, rx:20, ry:12, fill:'#FFE07A'}), g); mk('circle', S4({cx:-10, cy:-10, r:10, fill:'#FFE07A'}), g); mk('path', S4({d:'M-20 -10 L-28 -7 L-20 -4 Z', fill:'#FF9A5A'}, 2.5), g); },
  cone: g => { mk('path', S4({d:'M-10 0 L10 0 L0 24 Z', fill:'#E8B06A'}), g); mk('circle', S4({cx:0, cy:-6, r:13, fill:'#FFB3C7'}), g); },
  bread: g => { mk('path', S4({d:'M-22 10 Q-26 -14 0 -16 Q26 -14 22 10 Z', fill:'#E8A35A'}), g); mk('path', {d:'M-10 -8 l6 8 M2 -10 l6 8', stroke:'#FFF2D6', 'stroke-width':3, 'stroke-linecap':'round'}, g); },
  cupcake: g => { mk('path', S4({d:'M-14 0 L14 0 L10 18 L-10 18 Z', fill:'#9FD3F5'}), g); mk('path', S4({d:'M-16 2 Q-18 -16 0 -18 Q18 -16 16 2 Z', fill:'#FFC3D2'}), g); mk('circle', {cx:0, cy:-20, r:4.5, fill:'#F0506E', stroke:OL, 'stroke-width':2}, g); },
  tea: g => { mk('path', S4({d:'M-14 -8 L14 -8 L11 14 L-11 14 Z', fill:'#FFFFFF'}), g); mk('path', {d:'M14 -2 q10 0 8 8 q-2 6 -10 4', fill:'none', stroke:OL, 'stroke-width':3}, g); },
  tent: g => { mk('path', S4({d:'M-24 16 L0 -20 L24 16 Z', fill:'#FFB47A'}), g); mk('path', S4({d:'M-6 16 L0 2 L6 16 Z', fill:'#8B5E3C'}, 2.5), g); },
  fish: g => { mk('path', S4({d:'M-18 0 Q-4 -14 12 0 Q-4 14 -18 0 Z M12 0 L22 -9 L22 9 Z', fill:'#9FD3F5'}), g); },
  fire: g => { mk('path', S4({d:'M0 -22 Q14 -6 10 8 Q6 18 0 18 Q-6 18 -10 8 Q-14 -6 0 -22 Z', fill:'#FF9A5A'}), g); mk('path', {d:'M0 -4 Q6 4 4 10 Q0 14 -4 10 Q-6 4 0 -4 Z', fill:'#FFE07A'}, g); },
  book: g => { mk('rect', S4({x:-16, y:-20, width:32, height:40, rx:4, fill:'#B79BE8'}), g); mk('rect', {x:-10, y:-12, width:20, height:8, rx:2, fill:'#FFFDF6'}, g); },
  pencil: g => { mk('path', S4({d:'M-16 16 L10 -10 L16 -4 L-10 22 Z', fill:'#FFD27A'}), g); mk('path', S4({d:'M-16 16 L-10 22 L-20 26 Z', fill:'#FFE7C2'}, 2.5), g); },
  leaf: g => { mk('path', S4({d:'M-16 14 Q-16 -16 16 -16 Q16 14 -16 14 Z', fill:'#F4A259'}), g); mk('path', {d:'M-16 14 L8 -8', stroke:OL, 'stroke-width':2.5}, g); },
  sprout: g => { mk('path', {d:'M0 18 V-2', stroke:'#5FA85B', 'stroke-width':4}, g); mk('ellipse', S4({cx:-9, cy:-6, rx:9, ry:6, fill:'#8ED081', transform:'rotate(-25 -9 -6)'}), g); mk('ellipse', S4({cx:9, cy:-8, rx:9, ry:6, fill:'#8ED081', transform:'rotate(25 9 -8)'}), g); },
  can: g => { mk('path', S4({d:'M-16 -10 L12 -10 L12 16 L-16 16 Z', fill:'#9FD3F5'}), g); mk('path', {d:'M12 -4 L24 -16', stroke:OL, 'stroke-width':5, 'stroke-linecap':'round'}, g); },
  carrot: g => { mk('path', S4({d:'M-6 -12 L6 -12 L0 20 Z', fill:'#FF9A5A'}), g); mk('path', {d:'M0 -12 l-6 -10 M0 -12 l6 -10 M0 -12 v-12', stroke:'#5FA85B', 'stroke-width':4, 'stroke-linecap':'round'}, g); },
  pumpkin: g => { mk('ellipse', S4({cx:0, cy:4, rx:20, ry:15, fill:'#FFA24C'}), g); mk('path', {d:'M-7 -8 Q-10 4 -7 18 M7 -8 Q10 4 7 18', fill:'none', stroke:'#E07F2C', 'stroke-width':2.5}, g); mk('path', {d:'M0 -10 l2 -8', stroke:'#5FA85B', 'stroke-width':4, 'stroke-linecap':'round'}, g); },
  train: g => { mk('rect', S4({x:-22, y:-16, width:44, height:28, rx:8, fill:'#9FD3F5'}), g); mk('rect', {x:-14, y:-10, width:12, height:10, rx:2, fill:'#FFFFFF'}, g); mk('rect', {x:2, y:-10, width:12, height:10, rx:2, fill:'#FFFFFF'}, g); mk('circle', S4({cx:-12, cy:14, r:5, fill:'#6A6F86'}), g); mk('circle', S4({cx:12, cy:14, r:5, fill:'#6A6F86'}), g); },
  jelly: g => { mk('path', S4({d:'M-16 2 Q-16 -20 0 -20 Q16 -20 16 2 Z', fill:'#E7B6F5'}), g); mk('path', {d:'M-10 4 q-3 8 0 16 M0 4 q3 8 0 16 M10 4 q-3 8 0 16', fill:'none', stroke:OL, 'stroke-width':2.5}, g); },
  whale: g => { mk('path', S4({d:'M-22 4 Q-20 -16 2 -14 Q18 -12 20 2 Q10 12 -10 12 Q-20 12 -22 4 Z', fill:'#8FB8E8'}), g); mk('path', S4({d:'M20 2 L28 -8 L28 8 Z', fill:'#8FB8E8'}, 2.5), g); mk('circle', {cx:-12, cy:-2, r:2.5, fill:OL}, g); },
  pillow: g => { mk('path', S4({d:'M-20 -12 Q0 -18 20 -12 Q24 0 20 12 Q0 18 -20 12 Q-24 0 -20 -12 Z', fill:'#FFC3D2'}), g); },
  torch: g => { mk('rect', S4({x:-6, y:-4, width:12, height:24, rx:3, fill:'#9FD3F5'}), g); mk('path', S4({d:'M-10 -14 L10 -14 L6 -4 L-6 -4 Z', fill:'#FFE07A'}, 2.5), g); },
  popcorn: g => { mk('path', S4({d:'M-14 -6 L14 -6 L10 20 L-10 20 Z', fill:'#FFFFFF'}), g); mk('path', {d:'M-6 -6 L-4 20 M6 -6 L4 20', stroke:'#F06A7A', 'stroke-width':4}, g); [[-8,-10],[0,-14],[8,-10]].forEach(p => mk('circle', S4({cx:p[0], cy:p[1], r:6, fill:'#FFF3C4'}, 2.2), g)); },
  bed: g => ICONS.moon(g)
};
/* small props used by many episodes */
function itKiteHand(p){ const g = G(p); mk('rect', S4({x:-10, y:-8, width:20, height:16, rx:5, fill:'#C98F5E'}), g); mk('circle', {r:4, fill:'#FFF3D6'}, g); return g; }
function itCone(p, col){ const g = G(p); const b = G(g); g.body = b; mk('path', S4({d:'M-12 0 L12 0 L0 34 Z', fill:'#E8B06A'}), g); mk('path', {d:'M-6 6 L4 22 M6 6 L-2 20', stroke:'#C98F4E', 'stroke-width':2}, g);
  mk('circle', S4({cx:0, cy:-10, r:15, fill:col || '#FFB3C7'}), b); mk('circle', {cx:-5, cy:-15, r:4, fill:'#FFFFFF', opacity:0.6}, b); return g; }
function itBread(p, s){ const g = G(p, `scale(${s || 1})`); const b = G(g); g.body = b; mk('path', S4({d:'M-24 10 Q-28 -14 0 -16 Q28 -14 24 10 Z', fill:'#E8A35A'}), b); mk('path', {d:'M-12 -8 l6 8 M0 -10 l6 8 M12 -8 l5 7', stroke:'#FFF2D6', 'stroke-width':3, 'stroke-linecap':'round'}, b); return g; }
function itCupcake(p, col){ const g = G(p); const b = G(g); g.body = b; mk('path', S4({d:'M-14 0 L14 0 L10 18 L-10 18 Z', fill:'#9FD3F5'}), b); mk('path', {d:'M-6 0 L-5 18 M6 0 L5 18', stroke:'#FFFFFF', 'stroke-width':2.5, opacity:0.7}, b);
  g.top = mk('path', S4({d:'M-16 2 Q-18 -16 0 -18 Q18 -16 16 2 Z', fill:col || '#FFC3D2'}), b); g.cherry = mk('circle', {cx:0, cy:-21, r:5, fill:'#F0506E', stroke:OL, 'stroke-width':2}, b); return g; }
function itRollingPin(p){ const g = G(p); mk('path', {d:'M-44 0 H44', stroke:OL, 'stroke-width':12, 'stroke-linecap':'round'}, g); mk('path', {d:'M-44 0 H44', stroke:'#E2B285', 'stroke-width':6, 'stroke-linecap':'round'}, g); mk('rect', S4({x:-28, y:-11, width:56, height:22, rx:10, fill:'#F2CFA6'}), g); return g; }
function itWhisk(p){ const g = G(p, 'rotate(-20)'); mk('path', {d:'M0 20 V2', stroke:OL, 'stroke-width':8, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 20 V2', stroke:'#C9B6F2', 'stroke-width':4, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 2 Q-14 -20 0 -34 Q14 -20 0 2 M0 2 Q-6 -20 0 -34 Q6 -20 0 2', fill:'none', stroke:'#8A8690', 'stroke-width':2.5}, g); return g; }
function itPipingBag(p, col){ const g = G(p, 'rotate(160)'); mk('path', S4({d:'M-16 -20 L16 -20 L4 20 L-4 20 Z', fill:'#FFFFFF'}), g); mk('path', {d:'M-12 -10 L12 -10 L4 14 L-4 14 Z', fill:col || '#FFC3D2', opacity:0.8}, g); mk('path', S4({d:'M-4 20 L4 20 L0 28 Z', fill:'#C9B6F2'}, 2.5), g); return g; }
function itTray(p, w){ const g = G(p); w = w || 120; mk('rect', S4({x:-w/2, y:-6, width:w, height:12, rx:5, fill:'#BFC6D6'}), g); return g; }
function itRod(p){ const g = G(p); mk('path', {d:'M0 10 L0 -150', stroke:OL, 'stroke-width':7, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 10 L0 -150', stroke:'#C98F5E', 'stroke-width':3.5, 'stroke-linecap':'round'}, g); mk('circle', S4({cx:0, cy:-14, r:7, fill:'#9FD3F5'}, 2.5), g); g.tip = [0, -150]; return g; }
function itStick(p, mallow){ const g = G(p, 'rotate(-40)'); mk('path', {d:'M0 10 L0 -110', stroke:OL, 'stroke-width':7, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 10 L0 -110', stroke:'#B98552', 'stroke-width':3.5, 'stroke-linecap':'round'}, g);
  if (mallow !== false){ g.m = mk('rect', S4({x:-10, y:-128, width:20, height:24, rx:8, fill:'#FFF7EE'}), g); } return g; }
function itCan(p, col){ const g = G(p); mk('path', S4({d:'M-20 -14 L16 -14 L16 18 L-20 18 Z', fill:col || '#9FD3F5'}), g); mk('path', {d:'M-20 -14 Q-36 0 -20 12', fill:'none', stroke:OL, 'stroke-width':4}, g);
  mk('path', {d:'M16 -6 L40 -26', stroke:OL, 'stroke-width':8, 'stroke-linecap':'round'}, g); mk('path', {d:'M16 -6 L40 -26', stroke:col || '#9FD3F5', 'stroke-width':4, 'stroke-linecap':'round'}, g); mk('ellipse', S4({cx:42, cy:-28, rx:6, ry:4, fill:'#FFFFFF'}, 2.4), g); g.spout = [44, -28]; return g; }
function itSeedBag(p){ const g = G(p); mk('path', S4({d:'M-14 -18 L14 -18 L16 18 L-16 18 Z', fill:'#F2DDB0'}), g); itFlower(G(g, 'translate(0 -2) scale(0.5)'), '#FFB3C7'); return g; }
function itCarrotPull(p){ const g = G(p); mk('path', S4({d:'M-9 -14 L9 -14 L0 30 Z', fill:'#FF9A5A'}), g); mk('path', {d:'M0 -14 l-8 -14 M0 -14 l8 -14 M0 -14 v-18', stroke:'#5FA85B', 'stroke-width':5, 'stroke-linecap':'round'}, g); return g; }
function itPumpkin(p, s){ const g = G(p, `scale(${s || 1})`); mk('ellipse', S4({cx:0, cy:0, rx:30, ry:22, fill:'#FFA24C'}), g); mk('path', {d:'M-10 -20 Q-14 0 -10 20 M10 -20 Q14 0 10 20', fill:'none', stroke:'#E07F2C', 'stroke-width':3}, g); mk('path', {d:'M0 -20 l3 -12', stroke:'#5FA85B', 'stroke-width':6, 'stroke-linecap':'round'}, g); return g; }
function itTicket(p){ const g = G(p); mk('rect', S4({x:-22, y:-12, width:44, height:24, rx:4, fill:'#FFE07A'}, 3), g); mk('path', {d:'M-8 -12 V12', stroke:OL, 'stroke-width':2, 'stroke-dasharray':'3 3'}, g); return g; }
function itTorch(p){ const g = G(p, 'rotate(-30)'); mk('rect', S4({x:-8, y:-6, width:16, height:32, rx:4, fill:'#9FD3F5'}), g); mk('path', S4({d:'M-12 -18 L12 -18 L8 -6 L-8 -6 Z', fill:'#FFE07A'}, 3), g); return g; }
function itPopcorn(p){ const g = G(p); mk('path', S4({d:'M-18 -8 L18 -8 L13 24 L-13 24 Z', fill:'#FFFFFF'}), g); mk('path', {d:'M-8 -8 L-5 24 M8 -8 L5 24', stroke:'#F06A7A', 'stroke-width':5}, g); [[-12,-12],[-2,-17],[9,-13],[3,-9]].forEach(q => mk('circle', S4({cx:q[0], cy:q[1], r:7, fill:'#FFF3C4'}, 2.2), g)); return g; }
function itPenBrush(p, col){ const g = G(p, 'rotate(30)'); mk('path', {d:'M0 18 V-20', stroke:OL, 'stroke-width':8, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 18 V-20', stroke:col || '#FFD27A', 'stroke-width':4, 'stroke-linecap':'round'}, g); return g; }
function itLeaf(p, col){ const g = G(p); mk('path', S4({d:'M-14 12 Q-14 -14 14 -14 Q14 12 -14 12 Z', fill:col || '#F4A259'}, 3), g); mk('path', {d:'M-14 12 L6 -6', stroke:OL, 'stroke-width':2.4}, g); return g; }
function itBalloon(p, col){ const g = G(p); g.str = mk('path', {d:'M0 0 Q8 -40 0 -90', fill:'none', stroke:OL, 'stroke-width':2.5}, g); mk('ellipse', S4({cx:0, cy:-120, rx:26, ry:32, fill:col || '#FF9AA2'}), g); mk('ellipse', {cx:-8, cy:-130, rx:6, ry:10, fill:'#FFFFFF', opacity:0.5}, g); return g; }
