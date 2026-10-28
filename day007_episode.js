/* =====================================================================
   FUR FRIENDS — Day 7: "Camping by the Lake"   (180 s)
   pitch the tent → fishing at the dock → campfire night → stargazing
   ===================================================================== */
function itMallet(p){ const g = G(p, 'rotate(-20)'); mk('path', {d:'M0 20 V-20', stroke:OL, 'stroke-width':8, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 20 V-20', stroke:'#C98F5E', 'stroke-width':4, 'stroke-linecap':'round'}, g); mk('rect', S4({x:-18, y:-38, width:36, height:20, rx:6, fill:'#9B6B4A'}), g); return g; }
function itBottle(p, col){ const g = G(p); mk('rect', S4({x:-10, y:-24, width:20, height:40, rx:7, fill:col || '#9FD3F5'}), g); mk('rect', S4({x:-6, y:-32, width:12, height:10, rx:3, fill:'#FFFFFF'}, 3), g); return g; }
function itUke(p){ const g = G(p, 'rotate(-35)'); mk('path', {d:'M0 0 L0 -70', stroke:OL, 'stroke-width':9, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 0 L0 -70', stroke:'#C98F5E', 'stroke-width':5, 'stroke-linecap':'round'}, g);
  mk('path', SK({d:'M0 -6 Q-26 -4 -24 18 Q-30 40 0 42 Q30 40 24 18 Q26 -4 0 -6 Z', fill:'#FFB47A'}, 4), g); mk('circle', {cx:0, cy:16, r:7, fill:OL}, g); return g; }
function itLantern(p){ const g = G(p); mk('path', {d:'M-12 -34 Q0 -48 12 -34', fill:'none', stroke:OL, 'stroke-width':4}, g); mk('rect', S4({x:-16, y:-34, width:32, height:40, rx:8, fill:'#FFE7A0'}), g); g.glow = mk('circle', {cx:0, cy:-14, r:70, fill:'url(#glowLamp)', opacity:0.8}, g); return g; }
function fishPop(parent, col){ const g = G(parent); fishShape(g, col || '#FFB47A', 1.1); return g; }

/* =================== SC1 — PITCHING THE TENT =================== */
const SC1 = scene(0, 45, {look:[1060, 740, 1.2, 1.26]});
(function(){
  const S = SC1;
  S.L = locCamp(S.cam, {tod:'day', tentX:1240});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 1); S.amb('lake', 0, 45, 0.8); S.amb('breeze', 0, 45, 0.8);
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,-300],[6.0,560],[26,560],[27.6,1150],[32,1150],[33,1000],[45,1000]], y:980, steps:'grassstep'});
  const momo = actor(S, 'cat', {layer:ly, x:[[0,-120],[5.6,780],[19,780],[20,960],[27,960],[28,820],[45,820]], y:980, steps:'grassstep'});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,-520],[6.6,880],[10,880],[11,980],[45,980]], y:980, steps:'grassstep'});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,-700],[7.2,1000],[10,1000],[11.6,1520],[45,1520]], y:980, steps:'grassstep'});
  const all = [momo, pipi, kuku, otto];
  momo.item('R', 'mallet', itMallet(G()));
  all.forEach((a, i) => a.item('L', 'bottle', itBottle(G(), ['#C9B6F2','#FFB3C7','#FFD27A','#9FD3F5'][i])));
  otto.item('R', 'camera', itCamera(G(null, 'translate(-20 -6)')));
  [momo, pipi, kuku, otto].forEach((a, i) => { a.do('look', 7, 3.4, {x:4, y:-5}); a.do('happy', 7.4, 2.4, {mouth:'open'}); });
  pipi.do('cheer', 7.6, 1.8); kuku.do('cheer', 7.8, 1.8);
  // pull the ropes
  kuku.do('work', 11.6, 7.4, {kind:'pull', rate:0.9, eyes:'squeeze', mouth:'open', snd:'rustle', every:1, gain:0.03});
  otto.do('work', 12.0, 7.0, {kind:'pull', rate:0.9, eyes:'squeeze', mouth:'open'});
  momo.do('look', 11, 8, {x:7, y:-6}); pipi.do('clap', 13.0, 4.0);
  kuku.do('cheer', 19.4, 2.0); otto.do('cheer', 19.6, 2.0);
  // pegs
  [[20.6, 26.0]].forEach(() => momo.do('work', 20.6, 5.4, {kind:'shake', rate:1.2, itemR:'mallet', dy:30, look:[0, 8], snd:'knock', every:1, gain:0.05, sndO:{f:260}}));
  kuku.do('talk', 22, 2.6, {gest:true}); otto.do('nod', 23, 1.6);
  // peek inside
  pipi.do('pose', 28.0, 3.4, {bt:12, tilt:10, lookX:6}); pipi.do('wow', 29.4, 1.6);
  momo.do('laugh', 30.6, 2.2); kuku.do('laugh', 30.8, 2.2);
  all.forEach((a, i) => a.do('cheer', 33.4 + i*0.15, 2.2));
  otto.do('photo', 36.2, 2.8);
  all.forEach((a, i) => { if (a !== otto) a.do('pose', 36.0, 3.2, {tR:[60, -150]}); a.do('sip', 40.0 + i*0.6, 2.4, {side:'L', item:'bottle'}); });
  S.peg = mk('rect', S4({x:-5, y:-30, width:10, height:30, fill:'#C98F5E'}), S.L.front);
  S.flat = mk('ellipse', SK({rx:180, ry:18, fill:'#FFB47A'}, 4), S.L.back); T(S.flat, 'translate(1240 950)');
  S.ropes = [mk('path', {fill:'none', stroke:'#FFF3D6', 'stroke-width':4}, S.L.chars), mk('path', {fill:'none', stroke:'#FFF3D6', 'stroke-width':4}, S.L.chars)];
  S.L.chars.insertBefore(S.ropes[0], S.L.chars.firstChild); S.L.chars.insertBefore(S.ropes[1], S.L.chars.firstChild);
  S.photo = photoFX(S, S.L.fx);
  S.hearts = heartBursts(S.L.fx, [{t:8.0, x:760, y:700, n:3}, {t:33.8, x:1060, y:640, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:19.2, x:1240, y:700, n:7, r:160}, {t:30.0, x:1180, y:760, n:4, r:50}]);
  S.butter = butterflies(S.L.fx, 3, [400, 500, 1700, 800]);
  S.sfx(9.0, 'rustle', 0.05, 0.3, {d:0.8}); S.sfx(9.6, 'flap', 0.05, 0.3, {d:1.0}); S.sfx(19.0, 'thump', 0.06, 0.3, {f:120}); S.sfx(19.2, 'sparkle', 0.04, 0.3);
  S.sfx(27.8, 'zipper', 0.05, 0.3, {d:0.9}); S.sfx(37.2, 'shutter', 0.1, 0.5); S.sfx(29.4, 'chime', 0.02, 0.3, {f:1568});
  S.pre = u => {
    const k = clamp(sm((u - 11.6)/7.2) + 0.08*Math.sin(TAU*(u - 19)*1.6)*bump(u, 19.0, 1.4), 0.03, 1.1);
    S.L.tent.style.display = u > 9 ? '' : 'none';
    T(S.L.tent, `translate(1240 950) scale(${(0.9 + 0.1*k).toFixed(3)} ${k.toFixed(3)})`);
    show(S.flat, u > 8.8 && k < 0.2);
    S.L.update(u, {flap: rh(u, 27.6, 28.4, 31.6, 32.4)});
  };
  S.post = u => {
    const top = [1240, 950 - 300*clamp(sm((u - 11.6)/7.2), 0.03, 1)];
    [[kuku, -1], [otto, 1]].forEach((q, i) => { const p = paw(q[0].c, i ? 1 : -1); const on = u > 11 && u < 19.6; show(S.ropes[i], on);
      if (on) S.ropes[i].setAttribute('d', `M${top[0]} ${top[1]} Q${(top[0] + p[0])/2} ${((top[1] + p[1])/2 + 30).toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`); });
    const pv = clamp((u - 20.6)/5.4, 0, 1); show(S.peg, u > 20); T(S.peg, `translate(1040 ${(990 + 22*pv).toFixed(1)})`);
    S.photo(u, [37.2], otto); S.butter(u, 1);
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC2 — FISHING AT THE DOCK =================== */
const SC2 = scene(45, 90, {look:[980, 650, 1.34, 1.42]});
(function(){
  const S = SC2;
  S.L = locCamp(S.cam, {tod:'day', dock:760, tent:false});
  const ly = S.L.chars;
  S.amb('birds', 0, 45, 0.7); S.amb('lake', 0, 45, 1.4);
  const momo = actor(S, 'cat', {layer:ly, x:620, y:790, s:0.88, steps:null});
  const kuku = actor(S, 'squirrel', {layer:ly, x:860, y:790, s:0.88, steps:null});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,1060],[45,1060]], y:800, s:0.88, steps:'woodstep'});
  const otto = actor(S, 'otter', {layer:S.L.lakeLayer, x:[[0,1500],[45,1500]], y:720, s:0.75, steps:null, base:{feet:false}});
  S.waterF = mk('rect', {x:-400, y:700, width:2720, height:110, fill:'url(#campdayLake)', opacity:1}, S.L.lakeLayer);
  momo.item('R', 'rod', itRod(G())); kuku.item('R', 'rod', itRod(G()));
  momo.item('L', 'fish', fishPop(G(), '#FFB47A'));
  kuku.item('L', 'boot', (() => { const g = G(); mk('path', S4({d:'M-12 -24 L8 -24 L8 4 L24 8 Q28 18 20 20 L-12 20 Z', fill:'#8B6248'}), g); return g; })());
  pipi.item('R', 'snack', itSandwich(G())); pipi.item('L', 'snack2', itBasket(G(null, 'translate(0 30) scale(0.8)')));
  otto.item('R', 'shell', itShell(G(null, 'scale(1.2)')));
  // casting
  [momo, kuku].forEach((a, i) => { a.do('hold', 0, 45, {item:'rod', at:[50, -110], ease:false}); a.do('arms', 2.0 + i*1.2, 1.4, {R:[10, -190], itemR:'rod'}); a.do('look', 4, 14, {x:0, y:-3}); });
  // Momo's catch
  momo.do('wow', 15.6, 1.4); momo.do('work', 16.2, 2.6, {kind:'pull', rate:1.4, itemR:'rod', eyes:'squeeze', mouth:'open'});
  momo.do('arms', 18.8, 6.4, {L:[44, -150], itemL:'fish', eyes:'happy', mouth:'open'}); momo.do('hop', 19.2);
  [kuku, pipi].forEach(a => a.do('look', 18.8, 5, {x:-6, y:-3})); kuku.do('clap', 19.4, 2.4); pipi.do('cheer', 19.6, 1.8);
  momo.do('reach', 25.4, 1.2, {side:'L', to:[560, 760], item:'fish'}); momo.do('wave', 26.8, 1.6, {side:'L'});
  // Kuku's boot
  kuku.do('wow', 29.0, 1.4); kuku.do('work', 29.6, 2.4, {kind:'pull', rate:1.6, itemR:'rod', eyes:'squeeze', mouth:'open'});
  kuku.do('arms', 32.0, 4.6, {L:[40, -150], itemL:'boot', eyes:'open', mouth:'wavy'}); kuku.do('pose', 32.4, 4.0, {sweat:0.9});
  [momo, pipi].forEach((a, i) => { a.do('look', 32, 5, {x: i ? -6 : 6, y:-2}); a.do('laugh', 33.0 + i*0.2, 3.0); });
  kuku.do('laugh', 36.8, 2.4);
  // Pipi snacks
  pipi.do('eat', 6.0, 8.0, {item:'snack', bites:3, per:2.8}); pipi.do('bob', 14, 14, {f:0.55}); pipi.do('hold', 0, 45, {side:'L', item:'snack2', at:[30, -70], ease:false});
  // Otto floating on his back with a shell
  otto.do('arms', 0, 45, {L:[30, -90], R:[30, -96], itemR:'shell', eyes:'happy'});
  otto.do('wave', 9.0, 2.4, {side:'L'}); otto.do('wave', 39.0, 3.0, {side:'L'});
  [momo, kuku, pipi].forEach((a, i) => a.do('wave', 39.4 + i*0.2, 3.0, {side:'L'}));
  otto.fn = (u, st) => { st.hop += 6*Math.sin(TAU*u/3.2); st.tilt += 6*Math.sin(TAU*u/5); st.x += 160*Math.sin(TAU*u/26); const dive = rh(u, 21.0, 21.6, 23.6, 24.2); st.hop -= 150*dive; };
  S.lines = [momo, kuku].map(() => mk('path', {fill:'none', stroke:'#FFFFFF', 'stroke-width':2.5, opacity:0.9}, S.L.fx));
  S.bobs = [0,1].map(() => { const b = G(S.L.lakeLayer); mk('circle', S4({r:9, fill:'#FFFFFF'}, 3), b); mk('path', {d:'M-9 0 A9 9 0 0 1 9 0 Z', fill:'#F06A5A'}, b); return b; });
  S.bobX = [470, 1030];
  S.rips = [ripples(S.L.lakeLayer, 3), ripples(S.L.lakeLayer, 3), ripples(S.L.lakeLayer, 3)];
  S.jump = fishPop(S.L.lakeLayer, '#FFE07A');
  S.hearts = heartBursts(S.L.fx, [{t:19.6, x:620, y:520, n:5}, {t:40.0, x:1200, y:520, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:19.2, x:640, y:560, n:6, r:80}, {t:24.2, x:1500, y:640, n:5, r:70}]);
  [2.6, 3.8].forEach((t, i) => { S.sfx(t, 'whoosh', 0.04, -0.3 + 0.3*i, {d:0.4, f0:800, f1:3000}); S.sfx(t + 0.9, 'plop', 0.05, -0.4 + 0.3*i); });
  S.sfx(16.2, 'reel', 0.04, -0.3, {d:2.4}); S.sfx(18.6, 'splash', 0.06, -0.4, {d:0.6}); S.sfx(19.0, 'sparkle', 0.04, -0.3); S.sfx(26.0, 'splash', 0.04, -0.4, {d:0.5});
  S.sfx(29.6, 'reel', 0.04, -0.1, {d:2.2}); S.sfx(31.8, 'splash', 0.05, 0, {d:0.6}); S.sfx(32.4, 'plop', 0.05, -0.1);
  S.sfx(21.0, 'splash', 0.07, 0.5, {d:0.8}); S.sfx(24.0, 'splash', 0.06, 0.5, {d:0.7}); S.sfx(12.0, 'splash', 0.03, 0.2, {d:0.4}); S.sfx(34.0, 'splash', 0.03, 0.6, {d:0.4});
  S.pre = u => S.L.update(u);
  S.post = u => {
    [momo, kuku].forEach((a, i) => {
      const tipLocal = [0, -150]; const hand = paw(a.c, 1);
      const tip = [hand[0] + 0.88*(-24 + 0), hand[1] - 0.88*140];
      const cast = sm((u - 2.6 - i*1.2)/1.0);
      const reel = i === 0 ? sm((u - 16.2)/2.6) : sm((u - 29.6)/2.4);
      const back = i === 0 ? sm((u - 27)/1.0) : sm((u - 37.4)/1.0);
      const bob = [lerp(lerp(tip[0], S.bobX[i], cast), tip[0] + 10, reel*(1 - back)), lerp(lerp(tip[1] + 40, 742 + 3*Math.sin(TAU*u*0.7 + i) + (i === 0 ? 10*bump(u, 14.6, 1.6) : 10*bump(u, 28.0, 1.6)), cast), tip[1] + 60, reel*(1 - back))];
      S.lines[i].setAttribute('d', `M${tip[0].toFixed(1)} ${tip[1].toFixed(1)} Q${((tip[0] + bob[0])/2).toFixed(1)} ${(Math.max(tip[1], bob[1]) + 10).toFixed(1)} ${bob[0].toFixed(1)} ${bob[1].toFixed(1)}`);
      T(S.bobs[i], `translate(${bob[0].toFixed(1)} ${bob[1].toFixed(1)})`); show(S.bobs[i], cast > 0.5 && (reel < 0.5 || back > 0.5));
    });
    S.rips[0](u, 18.4, S.bobX[0], 748); S.rips[1](u, 31.8, S.bobX[1], 748);
    const ox = 1500 + 160*Math.sin(TAU*u/26); S.rips[2](u, u < 24.5 ? 21.0 : 24.0, ox, 735, 1.2);
    const jv = (u - 11.6)/1.0; show(S.jump, jv > 0 && jv < 1); if (jv > 0 && jv < 1){ const p = arcP([1240, 760], [1340, 760], jv, 90); T(S.jump, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${(-40 + 80*jv).toFixed(1)})`); }
    S.hearts(u); S.spark(u);
  };
})();

/* =================== SC3 — CAMPFIRE NIGHT =================== */
const SC3 = scene(90, 135, {look:[960, 820, 1.32, 1.42]});
(function(){
  const S = SC3;
  S.L = locCamp(S.cam, {tod:'night', fire:[960, 1010], logs:[640, 1280], tentX:1650});
  const ly = S.L.chars;
  S.amb('night', 0, 45, 1.2); S.amb('fire', 0, 45, 1.4); S.amb('lake', 0, 45, 0.5);
  const X = [560, 730, 1190, 1360];
  const momo = actor(S, 'cat', {layer:ly, x:X[0], y:985}), pipi = actor(S, 'bunny', {layer:ly, x:X[1], y:985});
  const kuku = actor(S, 'squirrel', {layer:ly, x:X[2], y:985}), otto = actor(S, 'otter', {layer:ly, x:X[3], y:985});
  const all = [momo, pipi, kuku, otto];
  S.sticks = all.map((a, i) => a.item(i < 2 ? 'R' : 'L', 'stick', itStick(G(null, i < 2 ? '' : 'scale(-1 1)'))));
  pipi.item('R', 'uke', itUke(G()));
  // roasting: arm forward toward the fire
  all.forEach((a, i) => { const sd = i < 2 ? 'R' : 'L'; a.do('hold', 1.0, 21.0, {side:sd, item:'stick', at:[66, -96]}); a.do('look', 1, 20, {x: i < 2 ? 6 : -6, y:4}); });
  [0, 1, 3].forEach(i => all[i].do('happy', 8 + i, 3));
  // Kuku's marshmallow catches fire
  kuku.do('wow', 10.6, 1.6); kuku.do('work', 11.2, 2.2, {kind:'shake', side:'L', rate:2.4, itemL:'stick', eyes:'squeeze', mouth:'open'}); kuku.do('pose', 11.2, 2.4, {sweat:1});
  kuku.do('pose', 13.6, 1.6, {tL:[20, -126]}); kuku.do('face', 13.6, 1.6, {eyes:'squeeze', mouth:'small'});
  [momo, pipi, otto].forEach((a, i) => { a.do('look', 10.6, 4, {x: i < 2 ? 7 : -7, y:0}); a.do('laugh', 15.6 + i*0.2, 2.6); });
  kuku.do('laugh', 16.0, 2.4);
  // eat
  all.forEach((a, i) => { const sd = i < 2 ? 'R' : 'L'; a.do('eat', 22.0 + i*0.4, 5.6, {side:sd, item:'stick', bites:2, per:2.6, snd:'squish', rest:[66, -96]}); });
  // song
  pipi.do('arms', 29.0, 14.6, {R:[30, -76], L:[10, -60], itemR:'uke', eyes:'happy', mouth:'talk'});
  pipi.fn = (u, st) => { const s = rh(u, 29, 29.8, 43, 43.6); st.tL = lerpP(st.tL, [-4 + 16*Math.abs(Math.sin(TAU*u*2)), -66], s); st.tilt += 6*s*Math.sin(TAU*u*0.6); };
  [momo, kuku, otto].forEach((a, i) => { a.do('bob', 30.0 + i*0.3, 13, {f:0.6}); a.do('face', 33 + i*0.4, 8, {eyes:'happy', mouth:'talk'}); });
  S.notes = notesFx(S.L.fx, 3);
  S.owl = G(S.L.back); mk('ellipse', S4({cx:0, cy:0, rx:20, ry:24, fill:'#8B6248'}), S.owl); [-8, 8].forEach(x => { mk('circle', {cx:x, cy:-6, r:7, fill:'#FFF3C4', stroke:OL, 'stroke-width':2.5}, S.owl); mk('circle', {cx:x, cy:-6, r:3, fill:OL}, S.owl); }); mk('path', S4({d:'M-4 2 L4 2 L0 8 Z', fill:'#FFB347'}, 2), S.owl);
  T(S.owl, 'translate(190 760)');
  S.mallows = S.sticks.map(s => s.m);
  S.burn = mk('path', {d:'M0 -22 Q12 -6 8 4 Q0 10 -8 4 Q-12 -6 0 -22 Z', fill:'#FF9A5A', opacity:0}, S.L.fx);
  S.ff = fireflies(S.L.fx, 16, [100, 600, 1800, 950]);
  S.hearts = heartBursts(S.L.fx, [{t:24.0, x:960, y:700, n:5}, {t:40.0, x:730, y:640, n:3}]);
  S.spark = sparkles(S.L.fx, [{t:14.6, x:1150, y:860, n:4, r:40}]);
  S.sfx(10.8, 'whoosh', 0.04, 0.3, {d:0.5, f0:300, f1:1200}); S.sfx(13.8, 'whoosh', 0.03, 0.3, {d:0.5, f0:1200, f1:400});
  [2, 18.6, 36.4].forEach(t => S.sfx(t, 'owl', 0.035, -0.7));
  S.pre = u => S.L.update(u, {fire:1});
  S.post = u => {
    S.mallows.forEach((m, i) => { const roast = sm((u - 2)/16); m.setAttribute('fill', i === 2 && u > 11 && u < 22 ? '#6E4A3A' : hexMix('#FFF7EE', '#E8B06A', roast)); });
    const bv = rh(u, 10.6, 10.9, 13.6, 14.2); S.burn.setAttribute('opacity', bv.toFixed(3));
    if (bv > 0){ const p = paw(kuku.c, -1); T(S.burn, `translate(${(p[0] - 80).toFixed(1)} ${(p[1] - 70).toFixed(1)}) scale(${(0.8 + 0.2*Math.sin(TAU*u*4)).toFixed(3)})`); }
    const h = headW(pipi.c, 0, -60); S.notes(h[0], h[1], u, rh(u, 29.4, 30.2, 43, 43.8));
    T(S.owl, `translate(190 ${760 + 2*Math.sin(TAU*u/3)}) rotate(${(8*Math.sin(TAU*u/7)).toFixed(1)})`);
    S.ff(u, 0.8); S.hearts(u); S.spark(u);
  };
})();

/* =================== SC4 — STARGAZING =================== */
const SC4 = scene(135, 180, {look:[960, 700, 1.14, 1.24]});
(function(){
  const S = SC4;
  S.L = locCamp(S.cam, {tod:'night', tentX:960});
  const ly = S.L.chars;
  S.amb('night', 0, 45, 1.2); S.amb('lake', 0, 45, 0.6);
  const X = [600, 760, 1160, 1320];
  const momo = actor(S, 'cat', {layer:ly, x:[[0,X[0]],[33,X[0]],[35.4,960]], y:1000}), pipi = actor(S, 'bunny', {layer:ly, x:[[0,X[1]],[33.4,X[1]],[35.6,960]], y:1000});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,X[2]],[33.8,X[2]],[36.0,960]], y:1000}), otto = actor(S, 'otter', {layer:ly, x:[[0,X[3]],[34.2,X[3]],[36.4,960]], y:1000});
  const all = [momo, pipi, kuku, otto];
  quiltPattern('quiltF');
  S.wraps = all.map(a => { const w = itBlanketWrap(G(a.c.bob)); a.c.bob.insertBefore(w, a.c.head); return w; });
  otto.item('R', 'lantern', itLantern(G(null, 'translate(0 10)')));
  all.forEach((a, i) => { a.do('look', 0, 33, {x: 0, y:-8}); a.do('pose', 0, 33, {tL:[20, -78], tR:[20, -78]}); });
  [3, 7, 12].forEach((t, k) => all[k + 1].do('point', t, 2.4, {side: k ? 'L' : 'R', at:[60, -190]}));
  all.forEach((a, i) => a.do('happy', 4 + i, 3, {mouth:'open'}));
  // shooting star → wish
  all.forEach((a, i) => { a.do('wow', 18.8 + i*0.1, 1.4); a.do('arms', 20.6 + i*0.15, 5.6, {L:[8, -112], R:[8, -112], eyes:'sleep', mouth:'smile'}); });
  all.forEach((a, i) => a.do('happy', 26.6, 3.4, {mouth:'open'}));
  momo.do('yawn', 29.6, 1.8); kuku.do('yawn', 30.4, 1.8);
  otto.do('hold', 33.0, 3.4, {item:'lantern', at:[50, -110]});
  S.fadeIn = []; // crawl into the tent: fade each char as they reach the door
  S.wish = mk('path', {d:'M0 0 L-140 70', stroke:'#FFFDE8', 'stroke-width':6, 'stroke-linecap':'round', opacity:0}, S.L.back);
  S.wishStar = mk('path', {d:STAR_D, fill:'#FFF6C0', opacity:0}, S.L.back);
  S.z = zText(S.L.fx);
  S.ff = fireflies(S.L.fx, 18, [100, 500, 1800, 950]);
  S.hearts = heartBursts(S.L.fx, [{t:26.8, x:960, y:720, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:19.4, x:1250, y:420, n:6, r:90}]);
  S.sfx(18.6, 'sparkle', 0.06, 0.3); S.sfx(18.8, 'whoosh', 0.03, 0.3, {d:0.9, f0:2000, f1:600}); S.sfx(26.6, 'chime', 0.03, 0, {f:1046.5});
  S.sfx(36.8, 'zipper', 0.05, 0, {d:1.0}); S.sfx(6, 'owl', 0.03, -0.7); S.sfx(24, 'owl', 0.025, -0.7);
  S.pre = u => { S.L.update(u, {flap: rh(u, 33.0, 33.8, 36.4, 37.4), lantern: sm((u - 36.4)/1.0), dim: 0.22 + 0.12*sm((u - 37)/5)}); };
  S.post = u => {
    all.forEach((a, i) => { const v = sm((u - (34.6 + i*0.4))/1.0); a.c.root.setAttribute('opacity', (1 - v).toFixed(3)); });
    const sv = (u - 18.6)/1.2;
    if (sv > 0 && sv < 1){ S.wish.setAttribute('opacity', Math.sin(Math.PI*sv).toFixed(3)); T(S.wish, `translate(${(1500 - 500*sv).toFixed(1)} ${(320 + 180*sv).toFixed(1)})`); S.wishStar.setAttribute('opacity', Math.sin(Math.PI*sv).toFixed(3)); T(S.wishStar, `translate(${(1500 - 500*sv).toFixed(1)} ${(320 + 180*sv).toFixed(1)}) scale(1.4)`); }
    else { S.wish.setAttribute('opacity', 0); S.wishStar.setAttribute('opacity', 0); }
    S.z(1000, 720, u, sm((u - 39)/1.5));
    S.ff(u, 0.8); S.hearts(u); S.spark(u);
  };
})();

EPISODE({day:7, title:'Camping by the Lake', music:{seed:17, key:-5, bpm:70, prog:1},
  chapters:[['Pitching the Tent', IC.tent], ['Fishing Time', IC.fish], ['Campfire Night', IC.fire], ['Wishing on Stars', ICONS.moon]],
  scenes:[SC1, SC2, SC3, SC4]});
