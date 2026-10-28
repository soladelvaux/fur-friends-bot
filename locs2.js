/* =====================================================================
   FUR FRIENDS — location pack 2 (Day 5–11)
   Each returns L with layers back / chars / front / fx and update(u, o)
   ===================================================================== */
function skyRect(g, id, stops){ lin(id, stops); mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:`url(#${id})`}, g); }
function overlays(L, parent){
  L.dusk = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#2C2457', opacity:0}, parent);
  L.warm = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#FF9A5A', opacity:0}, parent);
}
function grassTufts(parent, n, seed, y0, y1, cols){
  const fr = rngMaker(seed);
  for (let i=0;i<n;i++){ const x = -250 + fr()*2420, y = y0 + fr()*(y1 - y0); const tf = G(parent, `translate(${x.toFixed(0)} ${y.toFixed(0)})`);
    for (let k=0;k<4;k++) mk('path', {d:`M${(k-1.5)*5} 0 q${((fr()-0.5)*14).toFixed(1)} -16 ${((fr()-0.5)*20).toFixed(1)} -${(22 + fr()*18).toFixed(1)}`, fill:'none', stroke:(cols || ['#7CC77A','#63B36B','#8ED081'])[k%3], 'stroke-width':5, 'stroke-linecap':'round'}, tf); }
}
function lampPost(parent, x, y){
  const g = G(parent, `translate(${x} ${y})`);
  mk('rect', SK({x:-7, y:-330, width:14, height:330, fill:'#6E6A86'}, 4), g);
  mk('ellipse', SK({cx:0, cy:0, rx:26, ry:8, fill:'#6E6A86'}, 4), g);
  mk('path', SK({d:'M-26 -330 L26 -330 L18 -380 L-18 -380 Z', fill:'#FFF3C4'}, 4), g);
  mk('path', SK({d:'M-32 -380 L32 -380 L0 -404 Z', fill:'#6E6A86'}, 4), g);
  g.glow = mk('circle', {cx:0, cy:-355, r:150, fill:'url(#glowLamp)', opacity:0}, g);
  return g;
}
function benchBack(parent, x, y, w){
  const g = G(parent, `translate(${x} ${y})`); w = w || 420;
  mk('rect', SK({x:-w/2 + 20, y:-170, width:16, height:170, fill:'#8B6248'}, 4), g); mk('rect', SK({x:w/2 - 36, y:-170, width:16, height:170, fill:'#8B6248'}, 4), g);
  [-160, -126].forEach(yy => mk('rect', SK({x:-w/2, y:yy, width:w, height:24, rx:8, fill:'#D9935A'}, 4), g));
  return g;
}
function benchSeat(parent, x, y, w){
  const g = G(parent, `translate(${x} ${y})`); w = w || 420;
  mk('rect', SK({x:-w/2, y:-20, width:w, height:26, rx:8, fill:'#E8A86C'}, 4), g);
  mk('rect', SK({x:-w/2 + 20, y:4, width:16, height:60, fill:'#8B6248'}, 4), g); mk('rect', SK({x:w/2 - 36, y:4, width:16, height:60, fill:'#8B6248'}, 4), g);
  return g;
}

/* ------------------------------ PARK ------------------------------ */
function locPark(parent, o){
  o = o || {};
  const sun = o.tod === 'sunset', pond = o.view === 'pond';
  const id = 'park' + (sun ? 'S' : 'D') + (pond ? 'P' : 'M');
  const L = {}; const g = G(parent); L.back = g;
  skyRect(g, id + 'Sky', sun ? [[0,'#8E7CC3'],[0.45,'#F5A3A0'],[0.8,'#FFD39A'],[1,'#FFE7B8']] : [[0,'#86CDF5'],[0.7,'#D4F0FF'],[1,'#F2FAFF']]);
  L.sunG = G(g, sun ? 'translate(1380 470)' : 'translate(1580 170)');
  mk('circle', {r: sun ? 330 : 220, fill:'url(#glowW)'}, L.sunG); mk('circle', {r: sun ? 70 : 54, fill: sun ? '#FFB36B' : '#FFF4B8'}, L.sunG);
  L.clouds = [0.9, 0.6, 0.75, 0.5].map(s => cloudShape(g, 0, 0, s, sun ? '#FFD6C8' : '#FFFFFF'));
  L.sky = G(g);  // episode puts kites / birds here
  const mr = rngMaker(pond ? 21 : 22);
  let d1 = 'M-400 620'; for (let x=-400; x<2300; x+=240) d1 += ` Q${x+120} ${520 + mr()*50} ${x+240} ${590 + mr()*20}`; d1 += ' L2320 760 L-400 760 Z';
  mk('path', SK({d:d1, fill: sun ? '#B08FB5' : '#A9CDE8'}, 4), g);
  // tiny town on the far hill
  for (let i=0;i<9;i++){ const x = 120 + i*210 + mr()*60, y = 600 + mr()*20, h = 34 + mr()*30;
    mk('rect', S4({x, y:y - h, width:40, height:h, fill: sun ? '#E6C3C8' : '#FFFFFF'}), g);
    mk('path', S4({d:`M${x-6} ${y-h} L${x+20} ${y-h-24} L${x+46} ${y-h} Z`, fill:['#FF9AA2','#9FD3F5','#FFD27A','#C9B6F2'][i%4]}), g); }
  let d2 = 'M-400 700'; for (let x=-400; x<2300; x+=300) d2 += ` Q${x+150} ${640 + mr()*30} ${x+300} ${690 + mr()*14}`; d2 += ' L2320 1500 L-400 1500 Z';
  mk('path', SK({d:d2, fill: sun ? '#93B97F' : '#A6DB8C'}, 5), g);
  L.trees = [];
  [[-60,700,1.0],[260,690,0.8],[1640,690,0.85],[1960,700,1.0]].forEach(a => L.trees.push(roundTree(g, a[0], a[1], a[2], sun ? ['#6E9A6E','#82AE7E'] : ['#63B36B','#7CC77A'])));
  if (pond){
    lin(id + 'Water', [[0, sun ? '#E6A7B8' : '#9ADCF5'], [1, sun ? '#8C7AB8' : '#5BB8E6']]);
    mk('ellipse', SK({cx:960, cy:770, rx:720, ry:80, fill:`url(#${id}Water)`}, 5), g);
    mk('ellipse', {cx:960, cy:764, rx:640, ry:58, fill:'none', stroke:'#FFFFFF', 'stroke-width':4, opacity:0.35, 'stroke-dasharray':'40 30'}, g);
    L.pondSpark = []; for (let i=0;i<14;i++) L.pondSpark.push({el: mk('path', {d:`M0 0 h${R(14,30)}`, stroke:'#FFFFFF', 'stroke-width':3, 'stroke-linecap':'round', transform:`translate(${R(400,1500)} ${R(730,820)})`}, g), ph:rnd()});
    [[560,790],[700,815],[1300,800],[1430,778]].forEach((p, i) => { mk('ellipse', S4({cx:p[0], cy:p[1], rx:30, ry:11, fill:'#7CC77A'}), g); if (i % 2) itFlower(G(g, `translate(${p[0]+6} ${p[1]-8}) scale(0.5)`), '#FFB3C7'); });
    L.pondLayer = G(g);
    L.ducks = [0,1,2].map(i => { const d = G(L.pondLayer); mk('ellipse', S4({cx:0, cy:0, rx:26, ry:14, fill: i ? '#FFE07A' : '#FFFFFF'}), d); mk('path', S4({d:'M20 -6 Q30 -18 24 -4 Z', fill: i ? '#FFE07A' : '#FFFFFF'}, 3), d);
      mk('circle', S4({cx:-14, cy:-20, r:12, fill: i ? '#FFE07A' : '#FFFFFF'}), d); mk('path', S4({d:'M-26 -20 L-36 -17 L-26 -13 Z', fill:'#FF9A5A'}, 2.5), d); mk('circle', {cx:-17, cy:-22, r:2.4, fill:OL}, d); return d; });
    // reeds
    [[260,770],[300,782],[1660,776],[1700,766]].forEach(p => { for (let k=0;k<3;k++){ mk('path', {d:`M${p[0]+k*10} ${p[1]} q-4 -40 ${(k-1)*8} -80`, fill:'none', stroke:'#5FA85B', 'stroke-width':5, 'stroke-linecap':'round'}, g); mk('rect', S4({x:p[0]+k*10+(k-1)*8-5, y:p[1]-100, width:10, height:26, rx:5, fill:'#9B6B4A'}, 2.5), g); } });
  } else {
    L.bigTree = roundTree(g, 280, 860, 1.7, sun ? ['#6E9A6E','#82AE7E'] : ['#5DAA6A','#7CC77A']);
    const fr = rngMaker(5);
    for (let i=0;i<30;i++) itFlower(G(g, `translate(${(-250 + fr()*2400).toFixed(0)} ${(760 + fr()*120).toFixed(0)}) scale(${(0.45 + fr()*0.3).toFixed(2)})`), ['#FFB3C7','#FFFFFF','#FFE07A','#C9B6F2'][i%4]);
  }
  // path
  mk('path', SK({d:'M-400 1000 Q400 930 960 960 Q1500 990 2320 930 L2320 1060 Q1500 1100 960 1080 Q400 1060 -400 1120 Z', fill: sun ? '#E3C29A' : '#F2DDB0'}, 4.5), g);
  L.lamp = lampPost(g, pond ? 1820 : 1720, 900);
  if (o.bench) L.benchB = benchBack(g, o.bench, 940, o.benchW || 460);
  L.chars = G(parent); L.front = G(parent);
  if (o.bench) L.benchF = benchSeat(L.front, o.bench, 940, o.benchW || 460);
  grassTufts(L.front, 26, pond ? 3 : 4, 1050, 1110, sun ? ['#7FA370','#6E9A6E','#93B97F'] : null);
  L.fx = G(parent);
  overlays(L, parent);
  if (sun) L.warm.setAttribute('opacity', 0.08);
  L.update = function(u, oo){
    oo = oo || {};
    L.clouds.forEach((c, i) => T(c, `translate(${(mod(u*(6 + i*2) + i*620, 2600) - 320).toFixed(1)} ${100 + i*60}) scale(${[0.9,0.6,0.75,0.5][i]})`));
    L.trees.forEach((t, i) => { if (t.top) T(t.top, `rotate(${(1.2*Math.sin(TAU*u/5 + i)).toFixed(2)} 0 -130)`); });
    if (L.bigTree) T(L.bigTree.top, `rotate(${(1*Math.sin(TAU*u/6)).toFixed(2)} 0 -130)`);
    if (L.ducks) L.ducks.forEach((d, i) => { const v = mod(u/40 + i*0.33, 1), x = 520 + 880*(0.5 - 0.5*Math.cos(TAU*v)), dir = Math.sin(TAU*v) > 0 ? -1 : 1;
      T(d, `translate(${x.toFixed(1)} ${(766 + i*14 + 3*Math.sin(TAU*u*0.8 + i)).toFixed(1)}) scale(${(0.9*dir).toFixed(2)} 0.9)`); });
    if (L.pondSpark) L.pondSpark.forEach(s => s.el.setAttribute('opacity', (0.2 + 0.8*Math.max(0, Math.sin(TAU*(u/2.4 + s.ph)))).toFixed(3)));
    const dk = oo.dusk || 0;
    L.dusk.setAttribute('opacity', (0.42*dk).toFixed(3));
    L.lamp.glow.setAttribute('opacity', (0.95*sm((dk - 0.3)/0.4)).toFixed(3));
    if (oo.sunY !== undefined) T(L.sunG, `translate(1380 ${oo.sunY.toFixed(1)})`);
  };
  return L;
}

/* ------------------------------ BAKERY ------------------------------ */
function locBakery(parent, o){
  o = o || {};
  const shop = o.area === 'shop', eve = !!o.evening;
  const L = {}; const g = G(parent); L.back = g;
  const pat = mk('pattern', {id:'bkTile' + (shop ? 'S' : 'K'), width:80, height:80, patternUnits:'userSpaceOnUse'}, DEFS);
  mk('rect', {width:80, height:80, fill: shop ? '#FFF1DA' : '#FFFFFF'}, pat); mk('rect', {width:40, height:40, fill: shop ? '#FFE3C2' : '#E3F1FA'}, pat); mk('rect', {x:40, y:40, width:40, height:40, fill: shop ? '#FFE3C2' : '#E3F1FA'}, pat);
  mk('rect', {x:-400, y:-400, width:2720, height:1100, fill: shop ? '#F7D9C4' : '#FFF4E3'}, g);
  mk('rect', {x:-400, y:440, width:2720, height:330, fill:`url(#bkTile${shop ? 'S' : 'K'})`}, g);
  mk('rect', SK({x:-400, y:430, width:2720, height:16, fill:'#E8B98F'}, 4), g);
  mk('rect', {x:-400, y:770, width:2720, height:700, fill:'#D9A577'}, g);
  for (let x=-400; x<2320; x+=120) mk('path', {d:`M${x} 770 L${x - 200} 1480`, stroke:'#C99467', 'stroke-width':3}, g);
  if (!shop){
    // window
    const w = G(g, 'translate(760 140)');
    mk('rect', SK({x:0, y:0, width:400, height:250, rx:14, fill: eve ? '#F5B59A' : '#BFE8FF'}, 5), w);
    mk('circle', {cx:300, cy:70, r:90, fill:'url(#glowW)'}, w);
    cloudShape(w, 120, 90, 0.5); mk('path', {d:'M0 200 Q100 160 200 190 T400 170 V250 H0 Z', fill:'#BFE6A8'}, w);
    mk('path', {d:'M200 0 V250 M0 125 H400', stroke:'#FFFFFF', 'stroke-width':12}, w); mk('rect', SK({x:0, y:0, width:400, height:250, rx:14, fill:'none'}, 5), w);
    // shelves with jars
    [[-160, 210], [-160, 360]].forEach(a => mk('rect', SK({x:a[0], y:a[1], width:560, height:16, rx:5, fill:'#E8B98F'}, 4), g));
    const jr = rngMaker(8);
    for (let i=0;i<7;i++){ const x = -130 + i*76, y = i % 2 ? 360 : 210, h = 50 + jr()*30;
      mk('rect', S4({x, y:y - h, width:52, height:h, rx:10, fill:'#EAF6FF', 'fill-opacity':0.8}), g); mk('rect', S4({x:x + 6, y:y - h - 12, width:40, height:14, rx:4, fill:['#FF9AA2','#FFD27A','#C9B6F2','#9FD3F5'][i%4]}), g);
      mk('rect', {x:x + 6, y:y - h*0.6, width:40, height:h*0.6 - 4, rx:6, fill:['#FFF3D6','#F7D08A','#E8A35A','#FFFFFF'][i%4]}, g); }
    // hanging utensils
    mk('path', {d:'M440 120 H700', stroke:OL, 'stroke-width':5}, g);
    L.hangs = [460, 540, 620, 690].map((x, i) => { const h = G(g, `translate(${x} 120)`); mk('path', {d:'M0 0 V40', stroke:OL, 'stroke-width':3}, h);
      if (i === 1) mk('circle', S4({cx:0, cy:62, r:24, fill:'#E8A06A'}), h); else if (i === 3) itWhisk(G(h, 'translate(0 70) rotate(200)')); else mk('ellipse', S4({cx:0, cy:66, rx:14, ry:26, fill:'#C9B6F2'}), h); return h; });
    // brick oven
    const ov = G(g, 'translate(1560 770)'); L.oven = ov;
    mk('path', SK({d:'M-260 0 L-260 -300 Q-260 -480 0 -480 Q260 -480 260 -300 L260 0 Z', fill:'#E9A089'}, 5), ov);
    const br = rngMaker(2); for (let r=0;r<8;r++) for (let c=0;c<6;c++){ const x = -240 + c*84 + (r%2)*40, y = -40 - r*56; if (Math.abs(x + 30) < 250 && y > -440) mk('rect', {x, y, width:70, height:40, rx:6, fill: br() < 0.5 ? '#DE8F78' : '#F0B09C'}, ov); }
    mk('rect', SK({x:-60, y:-640, width:120, height:180, fill:'#DE8F78'}, 5), ov);
    mk('path', SK({d:'M-150 -60 L-150 -190 Q-150 -270 0 -270 Q150 -270 150 -190 L150 -60 Z', fill:'#3A2626'}, 5), ov);
    L.ovenGlow = mk('path', {d:'M-140 -66 L-140 -190 Q-140 -260 0 -260 Q140 -260 140 -190 L140 -66 Z', fill:'#FF8A4C', opacity:0.25}, ov);
    L.ovenBread = G(ov); [-70, 0, 70].forEach(x => itBread(G(L.ovenBread, `translate(${x} -86)`), 1.2)); L.ovenBread.style.display = 'none';
    L.flames = [-90, -30, 30, 90].map(x => mk('path', {d:'M0 -30 Q14 -10 8 0 Q0 6 -8 0 Q-14 -10 0 -30 Z', fill:'#FFB347', transform:`translate(${x} -70)`}, ov));
    L.ovenDoor = G(ov); mk('rect', SK({x:-158, y:-200, width:316, height:150, rx:20, fill:'#6E6A86'}, 5), L.ovenDoor); mk('rect', SK({x:-40, y:-140, width:80, height:18, rx:9, fill:'#FFD27A'}, 4), L.ovenDoor);
    mk('rect', SK({x:-280, y:-56, width:560, height:40, rx:10, fill:'#C98F5E'}, 5), ov);
    // flour sacks
    const fs = G(g, 'translate(150 770)');
    [[-60,0,1],[40,0,0.85]].forEach(a => { const s = G(fs, `translate(${a[0]} ${a[1]}) scale(${a[2]})`); mk('path', SK({d:'M-56 0 Q-66 -110 -40 -130 L40 -130 Q66 -110 56 0 Z', fill:'#FFF7EA'}), s); mk('path', {d:'M-40 -130 Q0 -116 40 -130', fill:'none', stroke:OL, 'stroke-width':4}, s); txt(s, 0, -54, 'FLOUR', 22, '#C9A27E'); });
  } else {
    // shop: window to the street + display + chalkboard
    const w = G(g, 'translate(1040 110)');
    mk('rect', SK({x:0, y:0, width:620, height:300, rx:16, fill: eve ? '#F3A98C' : '#BFE8FF'}, 5), w);
    if (eve){ mk('circle', {cx:440, cy:250, r:120, fill:'url(#glowW)'}, w); mk('circle', {cx:440, cy:250, r:40, fill:'#FFB36B'}, w); }
    else mk('circle', {cx:500, cy:70, r:80, fill:'url(#glowW)'}, w);
    for (let i=0;i<4;i++){ mk('rect', S4({x:20 + i*150, y:170 - (i%2)*30, width:110, height:140, fill: eve ? '#D9A0A8' : '#FFFFFF'}), w); mk('rect', {x:44 + i*150, y:200 - (i%2)*30, width:26, height:30, rx:4, fill: eve ? '#FFE07A' : '#BFE3F5'}, w); }
    mk('path', {d:'M310 0 V300', stroke:'#FFFFFF', 'stroke-width':12}, w); mk('rect', SK({x:0, y:0, width:620, height:300, rx:16, fill:'none'}, 5), w);
    const aw = G(g, 'translate(1020 96)'); for (let i=0;i<8;i++) mk('path', S4({d:`M${i*83} 0 L${i*83 + 83} 0 L${i*83 + 83} 40 Q${i*83 + 41} 64 ${i*83} 40 Z`, fill: i % 2 ? '#FFFFFF' : '#FF9AA2'}), aw);
    const cb = G(g, 'translate(260 120)');
    mk('rect', SK({x:0, y:0, width:420, height:290, rx:14, fill:'#4F6A60'}, 6), cb); mk('rect', {x:12, y:12, width:396, height:266, rx:8, fill:'none', stroke:'#C98F5E', 'stroke-width':10}, cb);
    txt(cb, 210, 74, 'Fur Friends Bakery', 34, '#FFFDF6'); [['Melon bun', 128], ['Strawberry cake', 178], ['Acorn cookie', 228]].forEach(a => { txt(cb, 50, a[1], a[0], 26, '#FFE7C2', 'start', 500); txt(cb, 370, a[1], '♥', 26, '#FF9AA2', 'end'); });
    // bread shelf
    const sh = G(g, 'translate(760 120)');
    mk('rect', SK({x:0, y:0, width:220, height:640, rx:10, fill:'#E8B98F'}, 5), sh);
    [140, 300, 460].forEach((y, i) => { mk('rect', SK({x:6, y, width:208, height:14, fill:'#C98F5E'}, 4), sh); for (let k=0;k<3;k++) itBread(G(sh, `translate(${44 + k*66} ${y - 22})`), 0.9); });
    // pendant lamps
    L.pend = [520, 1350, 1750].map(x => { const p = G(g, `translate(${x} -40)`); mk('path', {d:'M0 0 V160', stroke:OL, 'stroke-width':3}, p); mk('path', SK({d:'M-46 200 Q-40 150 0 150 Q40 150 46 200 Z', fill:'#FFD27A'}, 4), p); p.glow = mk('circle', {cx:0, cy:220, r:170, fill:'url(#glowLamp)', opacity: eve ? 0.9 : 0.35}, p); return p; });
  }
  L.chars = G(parent); L.front = G(parent);
  if (o.counter !== false && !shop){
    const c = G(L.front); L.counter = c;
    mk('rect', SK({x:-200, y:900, width:2320, height:30, rx:8, fill:'#F2CFA6'}, 5), c);
    mk('rect', SK({x:-200, y:926, width:2320, height:300, fill:'#E2B285'}, 5), c);
    for (let x=-120; x<2200; x+=260) mk('rect', S4({x, y:952, width:220, height:120, rx:12, fill:'#EDC49A'}), c);
    L.top = G(c);   // things lying on the counter
  }
  if (shop && o.table !== false){
    const tb = G(L.front, 'translate(960 0)'); L.counter = tb;
    mk('ellipse', SK({cx:0, cy:878, rx:430, ry:44, fill:'#FFFDF8'}, 5), tb);
    mk('path', {d:'M-430 878 Q0 940 430 878', fill:'none', stroke:'#FF9AA2', 'stroke-width':8, 'stroke-dasharray':'20 14'}, tb);
    mk('rect', SK({x:-18, y:910, width:36, height:180, fill:'#C98F5E'}, 4.5), tb);
    L.top = G(L.front);
  }
  L.fx = G(parent);
  overlays(L, parent);
  if (eve) L.warm.setAttribute('opacity', 0.1);
  L.update = function(u, oo){
    oo = oo || {};
    if (L.hangs) L.hangs.forEach((h, i) => T(h, `translate(${[460,540,620,690][i]} 120) rotate(${(2*Math.sin(TAU*u/3.4 + i)).toFixed(2)})`));
    if (L.flames){ const heat = oo.heat === undefined ? 1 : oo.heat;
      L.flames.forEach((f, i) => { const s = (0.7 + 0.3*Math.sin(TAU*u*2.3 + i*1.7))*heat; T(f, `translate(${[-90,-30,30,90][i]} -70) scale(${(0.8 + 0.2*Math.sin(TAU*u*3 + i)).toFixed(3)} ${s.toFixed(3)})`); });
      L.ovenGlow.setAttribute('opacity', ((0.2 + 0.12*Math.sin(TAU*u*1.7))*heat + 0.05).toFixed(3));
      const door = oo.door === undefined ? 0 : oo.door;   // 0 closed, 1 open
      T(L.ovenDoor, `translate(0 ${(-160*0 + 150*door).toFixed(1)}) scale(1 ${(1 - 0.85*door).toFixed(3)})`);
      show(L.ovenBread, !!oo.bread); }
  };
  return L;
}

/* ------------------------------ CAMP (lake) ------------------------------ */
function locCamp(parent, o){
  o = o || {};
  const tod = o.tod || 'day', night = tod === 'night', dusk = tod === 'dusk';
  const id = 'camp' + tod;
  const L = {HZ: 640, SH: 800}; const g = G(parent); L.back = g;
  skyRect(g, id + 'Sky', night ? [[0,'#1E1F48'],[0.6,'#3B3A78'],[1,'#5E5498']] : dusk ? [[0,'#6E6AB8'],[0.5,'#E79BA6'],[0.85,'#FFC98A'],[1,'#FFE0AA']] : [[0,'#7EC8F2'],[0.7,'#CBEBFF'],[1,'#EAF7FF']]);
  L.stars = []; if (night || dusk) for (let i=0;i<60;i++) L.stars.push({el: mk('path', {d:STAR_D, fill:'#FFF6D0', transform:`translate(${R(-300,2200).toFixed(0)} ${R(-300,520).toFixed(0)}) scale(${R(0.18,0.55).toFixed(2)})`}, g), ph:rnd()});
  if (night){ mk('circle', {cx:1500, cy:170, r:160, fill:'url(#glowW)', opacity:0.5}, g); mk('path', S4({d:'M1500 120 A54 54 0 1 0 1554 176 A42 42 0 1 1 1500 120 Z', fill:'#FFF0B0'}), g);
    L.shoot = mk('path', {d:'M0 0 L-90 40', stroke:'#FFFDE8', 'stroke-width':4, 'stroke-linecap':'round', opacity:0}, g); }
  else { L.sunG = G(g, dusk ? 'translate(1300 560)' : 'translate(1550 150)'); mk('circle', {r:dusk ? 300 : 220, fill:'url(#glowW)'}, L.sunG); mk('circle', {r:dusk ? 70 : 54, fill: dusk ? '#FFB36B' : '#FFF4B8'}, L.sunG); }
  L.clouds = night ? [] : [0.8, 0.55, 0.7].map(s => cloudShape(g, 0, 0, s, dusk ? '#FFD6C8' : '#FFFFFF'));
  const mr = rngMaker(44);
  let d1 = 'M-400 640'; for (let x=-400; x<2300; x+=200){ d1 += ` L${x+100} ${330 + mr()*120} L${x+200} ${560 + mr()*40}`; } d1 += ' L2320 660 L-400 660 Z';
  mk('path', SK({d:d1, fill: night ? '#3E4A7A' : dusk ? '#9A7FA8' : '#A8C4E6'}, 4), g);
  for (let x=-380; x<2300; x+=56) pineTree(g, x + mr()*30, 650 + mr()*10, 0.35 + mr()*0.15, night ? '#2E4C52' : dusk ? '#6E7F86' : '#5DAA6A');
  lin(id + 'Lake', night ? [[0,'#4A4C8A'],[1,'#26285A']] : dusk ? [[0,'#E6A7B8'],[1,'#7E6FAE']] : [[0,'#9ADCF5'],[1,'#4FB0E0']]);
  mk('rect', {x:-400, y:L.HZ, width:2720, height:L.SH - L.HZ + 40, fill:`url(#${id}Lake)`}, g);
  mk('path', {d:`M-400 ${L.HZ} H2320`, stroke:'#FFFFFF', 'stroke-width':3, opacity:0.5}, g);
  L.spark = []; for (let i=0;i<26;i++) L.spark.push({el: mk('path', {d:`M0 0 h${R(14,34).toFixed(0)}`, stroke: night ? '#FFF2C0' : '#FFFFFF', 'stroke-width':3, 'stroke-linecap':'round', transform:`translate(${R(-300,2200).toFixed(0)} ${R(L.HZ + 10, L.SH - 10).toFixed(0)})`}, g), ph:rnd()});
  if (night) for (let i=0;i<7;i++) mk('path', {d:`M${1440 + i*4} ${L.HZ + 14 + i*18} h${120 - i*14}`, stroke:'#FFF0B0', 'stroke-width':5, 'stroke-linecap':'round', opacity:0.6}, g);
  L.lakeLayer = G(g);  // canoe / fish jumps
  // shore
  const sh = night ? '#3F6A58' : dusk ? '#8AAE78' : '#A6DB8C';
  mk('path', SK({d:`M-400 ${L.SH} Q300 ${L.SH - 20} 960 ${L.SH + 4} Q1600 ${L.SH + 20} 2320 ${L.SH - 10} L2320 1500 L-400 1500 Z`, fill:sh}, 5), g);
  if (o.dock){ const dk = G(g, `translate(${o.dock} ${L.SH + 10})`); L.dock = dk;
    for (let i=0;i<7;i++) mk('rect', SK({x:-260 + i*74, y:-50, width:70, height:40, rx:5, fill: night ? '#8A6A5A' : '#C98F5E'}, 4), dk);
    [-240, 200].forEach(x => mk('rect', SK({x, y:-50, width:20, height:110, fill:'#8B6248'}, 4), dk)); }
  if (o.tent !== false){ const tx = o.tentX || 1520; const tn = G(g, `translate(${tx} ${L.SH + 150})`); L.tent = tn;
    mk('path', SK({d:'M-230 0 L0 -300 L230 0 Z', fill: night ? '#D9845A' : '#FFB47A'}, 5), tn);
    mk('path', SK({d:'M-230 0 L0 -300 L-110 0 Z', fill: night ? '#C4704A' : '#FF9A5A'}, 4), tn);
    L.tentIn = mk('path', S4({d:'M-80 0 L0 -190 L80 0 Z', fill:'#5A3B32'}), tn);
    L.tentGlow = mk('path', {d:'M-76 0 L0 -184 L76 0 Z', fill:'#FFD27A', opacity:0}, tn);
    L.flapL = mk('path', S4({d:'M0 -190 L-80 0 L-30 0 Z', fill:'#FFC79E'}), tn); L.flapR = mk('path', S4({d:'M0 -190 L80 0 L30 0 Z', fill:'#FFC79E'}), tn);
    mk('path', {d:'M-230 0 L-270 30 M230 0 L270 30', stroke:OL, 'stroke-width':3}, tn); }
  [[120,'p'],[300,'r'],[1880,'p']].forEach((a, i) => a[1] === 'p' ? pineTree(g, a[0], L.SH + 120, 1.3, night ? '#2E5A50' : dusk ? '#6E8A6E' : '#4E9A5E') : roundTree(g, a[0], L.SH + 110, 1.0, night ? ['#2E5A50','#3E6A60'] : ['#63B36B','#7CC77A']));
  if (o.logs){ const lg = G(g); [[o.logs[0], 1], [o.logs[1], -1]].forEach(a => { mk('rect', SK({x:a[0] - 130, y:960, width:260, height:46, rx:23, fill:'#B07A52'}, 5), lg); mk('ellipse', SK({cx:a[0] + 130*a[1], cy:983, rx:16, ry:23, fill:'#E8C39A'}, 4), lg); }); }
  L.chars = G(parent); L.front = G(parent);
  if (o.fire){ const fx = o.fire[0], fy = o.fire[1]; const fp = G(L.front, `translate(${fx} ${fy})`); L.firePit = fp;
    L.fireGlow = mk('ellipse', {cx:0, cy:-60, rx:520, ry:360, fill:'url(#glowLamp)', opacity:0}, parent.insertBefore ? L.back : L.back);
    T(L.fireGlow, `translate(${fx} ${fy})`);
    [[-50,8,-14],[50,8,14]].forEach(a => mk('rect', SK({x:-60, y:-12, width:120, height:24, rx:12, fill:'#9B6B4A', transform:`translate(${a[0]/2} ${a[1]}) rotate(${a[2]})`}, 4), fp));
    for (let i=0;i<9;i++){ const a = Math.PI*(0.05 + 0.9*i/8); mk('ellipse', S4({cx:-Math.cos(a)*90, cy:14 + Math.sin(a)*12, rx:20, ry:12, fill:'#B7B2AE'}), fp); }
    L.flames = [[-26,'#FF7A45',1.0],[22,'#FF7A45',0.9],[0,'#FFB347',1.25],[-8,'#FFE07A',0.7],[12,'#FFE07A',0.6]].map(a => mk('path', {d:'M0 -60 Q26 -24 18 0 Q0 10 -18 0 Q-26 -24 0 -60 Z', fill:a[1], transform:`translate(${a[0]} 0) scale(${a[2]})`}, fp));
    L.flameX = [-26, 22, 0, -8, 12]; L.flameS = [1.0, 0.9, 1.25, 0.7, 0.6];
    L.sparks = []; for (let i=0;i<10;i++) L.sparks.push({el: mk('circle', {r:R(2,4), fill:'#FFD27A'}, fp), ph:rnd(), dx:R(-30,30)}); }
  grassTufts(L.front, 20, 9, 1050, 1110, night ? ['#2E5A50','#3E6A60','#4C7A66'] : null);
  L.fx = G(parent);
  overlays(L, parent);
  if (night) L.dusk.setAttribute('opacity', 0.22);
  if (dusk) L.warm.setAttribute('opacity', 0.06);
  L.update = function(u, oo){
    oo = oo || {};
    L.clouds.forEach((c, i) => T(c, `translate(${(mod(u*(5 + i*2) + i*700, 2600) - 320).toFixed(1)} ${110 + i*60}) scale(${[0.8,0.55,0.7][i]})`));
    L.stars.forEach(s => s.el.setAttribute('opacity', (0.35 + 0.65*Math.max(0, Math.sin(TAU*(u/3 + s.ph)))).toFixed(3)));
    L.spark.forEach(s => s.el.setAttribute('opacity', (0.15 + 0.85*Math.max(0, Math.sin(TAU*(u/2.6 + s.ph)))).toFixed(3)));
    if (L.flames){ const f = oo.fire === undefined ? 1 : oo.fire;
      L.flames.forEach((e, i) => T(e, `translate(${L.flameX[i] + 3*Math.sin(TAU*u*2 + i)} 0) scale(${(L.flameS[i]*(0.9 + 0.1*Math.sin(TAU*u*3.1 + i))*f).toFixed(3)} ${(L.flameS[i]*(0.85 + 0.25*Math.sin(TAU*u*2.3 + i*1.9))*f).toFixed(3)})`));
      L.fireGlow.setAttribute('opacity', (f*(0.75 + 0.15*Math.sin(TAU*u*1.9))).toFixed(3));
      L.sparks.forEach(s => { const v = mod(u*0.7 + s.ph, 1); s.el.setAttribute('cx', (s.dx + 10*Math.sin(TAU*(v + s.ph))).toFixed(1)); s.el.setAttribute('cy', (-60 - 160*v).toFixed(1)); s.el.setAttribute('opacity', (f*Math.sin(Math.PI*v)).toFixed(3)); }); }
    if (L.tent){ const op = oo.flap === undefined ? 0 : oo.flap; T(L.flapL, `translate(${-60*op} 0) scale(${1 - 0.6*op} 1)`); T(L.flapR, `translate(${60*op} 0) scale(${1 - 0.6*op} 1)`); L.tentGlow.setAttribute('opacity', ((oo.lantern || 0)*0.85).toFixed(3)); }
    if (L.shoot){ const v = (mod(u, 13) - 6)/0.9; if (v > 0 && v < 1){ L.shoot.setAttribute('opacity', Math.sin(Math.PI*v).toFixed(3)); T(L.shoot, `translate(${(700 + 500*v).toFixed(1)} ${(90 + 140*v).toFixed(1)}) rotate(0)`); } else L.shoot.setAttribute('opacity', 0); }
    if (oo.dim !== undefined) L.dusk.setAttribute('opacity', oo.dim.toFixed(3));
  };
  return L;
}

/* ------------------------------ LIBRARY ------------------------------ */
function shelfWall(parent, x0, x1, y0, y1, seed){
  const g = G(parent); const rr = rngMaker(seed);
  mk('rect', SK({x:x0, y:y0, width:x1 - x0, height:y1 - y0, fill:'#B9825A'}, 5), g);
  mk('rect', {x:x0 + 14, y:y0 + 14, width:x1 - x0 - 28, height:y1 - y0 - 28, fill:'#9C6A48'}, g);
  for (let y = y0 + 150; y < y1; y += 140){
    mk('rect', SK({x:x0 + 6, y, width:x1 - x0 - 12, height:14, fill:'#C99467'}, 4), g);
    let x = x0 + 20;
    while (x < x1 - 40){ const w = 16 + Math.floor(rr()*16), h = 80 + Math.floor(rr()*40);
      if (rr() < 0.08){ x += 22; continue; }
      if (x + w > x1 - 20) break;
      if (rr() < 0.1){ mk('rect', S4({x, y:y - 24, width:h, height:22, rx:3, fill:BOOKC[Math.floor(rr()*BOOKC.length)]}), g); x += h + 4; continue; }
      mk('rect', S4({x, y:y - h, width:w, height:h, rx:3, fill:BOOKC[Math.floor(rr()*BOOKC.length)]}), g); x += w + 2; }
  }
  return g;
}
function locLibrary(parent, o){
  o = o || {};
  const L = {}; const g = G(parent); L.back = g;
  mk('rect', {x:-400, y:-400, width:2720, height:1180, fill:'#F3DCC2'}, g);
  shelfWall(g, -400, 700, 40, 790, 3); shelfWall(g, 1220, 2320, 40, 790, 4);
  // arched window
  const w = G(g, 'translate(960 0)');
  mk('path', SK({d:'M-230 700 L-230 300 Q-230 90 0 90 Q230 90 230 300 L230 700 Z', fill:'#FFFFFF'}, 6), w);
  lin('libSky', [[0,'#A9DBFF'],[1,'#FFF0D8']]);
  mk('path', {d:'M-200 680 L-200 300 Q-200 120 0 120 Q200 120 200 300 L200 680 Z', fill:'url(#libSky)'}, w);
  L.winTree = roundTree(w, -80, 680, 0.9, ['#F4A259','#F6C453']);
  roundTree(w, 120, 690, 0.7, ['#E76F51','#F4A259']);
  mk('path', {d:'M0 120 V680 M-200 400 H200', stroke:'#FFFFFF', 'stroke-width':12}, w);
  mk('path', SK({d:'M-200 680 L-200 300 Q-200 120 0 120 Q200 120 200 300 L200 680 Z', fill:'none'}, 5), w);
  mk('rect', SK({x:-250, y:690, width:500, height:28, rx:8, fill:'#E8B98F'}, 4), w);
  L.beam = mk('polygon', {points:'760,180 1160,180 1500,1080 420,1080', fill:'#FFF6D2', opacity:0.18}, g);
  // ladder
  const ld = G(g, 'translate(1500 790)'); L.ladder = ld;
  mk('path', {d:'M-60 0 L-20 -700 M60 0 L100 -700', stroke:OL, 'stroke-width':14, 'stroke-linecap':'round'}, ld); mk('path', {d:'M-60 0 L-20 -700 M60 0 L100 -700', stroke:'#E2B285', 'stroke-width':8, 'stroke-linecap':'round'}, ld);
  for (let k=1;k<9;k++){ const y = -k*76, x = -60 + 40*k/9.2; mk('path', {d:`M${x} ${y} H${x + 120}`, stroke:OL, 'stroke-width':10, 'stroke-linecap':'round'}, ld); mk('path', {d:`M${x} ${y} H${x + 120}`, stroke:'#E2B285', 'stroke-width':5, 'stroke-linecap':'round'}, ld); }
  // floor + rug
  mk('rect', {x:-400, y:780, width:2720, height:700, fill:'#C99467'}, g);
  for (let x=-400; x<2320; x+=140) mk('path', {d:`M${x} 780 L${x - 160} 1480`, stroke:'#B98552', 'stroke-width':3}, g);
  mk('ellipse', {cx:960, cy:940, rx:620, ry:96, fill:'#C3B1E8', stroke:'#AE98DE', 'stroke-width':8}, g);
  mk('ellipse', {cx:960, cy:940, rx:560, ry:76, fill:'none', stroke:'#E3D8F8', 'stroke-width':5, 'stroke-dasharray':'16 12'}, g);
  // hanging lamps
  L.lamps = [420, 1500].map(x => { const p = G(g, `translate(${x} -60)`); mk('path', {d:'M0 0 V170', stroke:OL, 'stroke-width':3}, p); mk('path', SK({d:'M-50 210 Q-44 160 0 160 Q44 160 50 210 Z', fill:'#9FD6B0'}, 4), p); p.glow = mk('circle', {cx:0, cy:230, r:170, fill:'url(#glowLamp)', opacity:0.5}, p); return p; });
  if (o.cozy){ // reading nook: cushions & floor lamp
    [[560,900,'#FFC3D2'],[1360,900,'#BFE3D6']].forEach(a => { mk('ellipse', SK({cx:a[0], cy:a[1], rx:150, ry:70, fill:a[2]}), g); mk('path', {d:`M${a[0]-90} ${a[1]-20} Q${a[0]} ${a[1]+10} ${a[0]+90} ${a[1]-20}`, fill:'none', stroke:'#FFFFFF', 'stroke-width':6, opacity:0.6}, g); });
    pot(g, 1780, 860, '#F3B6A0', '#86CF7E'); }
  L.chars = G(parent); L.front = G(parent);
  if (o.table){ const tb = G(L.front); L.table = tb;
    mk('rect', SK({x:520, y:860, width:880, height:28, rx:8, fill:'#D9935A'}, 5), tb);
    mk('rect', SK({x:540, y:884, width:840, height:30, fill:'#B9825A'}, 4.5), tb);
    [560, 1330].forEach(x => mk('rect', S4({x, y:912, width:30, height:170, fill:'#B9825A'}), tb));
    const bl = G(tb, 'translate(1340 862)'); mk('rect', S4({x:-6, y:-70, width:12, height:70, fill:'#C9A27E'}), bl); mk('path', SK({d:'M-60 -70 Q-56 -110 0 -110 Q56 -110 60 -70 Z', fill:'#6FB98A'}, 4), bl); L.tableLamp = mk('ellipse', {cx:0, cy:-30, rx:180, ry:90, fill:'url(#glowLamp)', opacity:0.6}, bl);
    L.top = G(L.front); }
  L.fx = G(parent);
  L.motes = []; for (let i=0;i<26;i++) L.motes.push({el: mk('circle', {r:R(2,5), fill:'#FFF7D0'}, L.fx), x0:R(700,1300), y0:R(260,1000), ph:rnd()});
  overlays(L, parent);
  L.update = function(u, oo){
    oo = oo || {};
    T(L.winTree.top, `rotate(${(1.5*Math.sin(TAU*u/5)).toFixed(2)} 0 -130)`);
    L.motes.forEach(m => { const v = mod(u/26 + m.ph, 1); m.el.setAttribute('cx', (m.x0 + 30*Math.sin(TAU*(u/9 + m.ph)) + 200*(m.y0 - 260)/740).toFixed(1)); m.el.setAttribute('cy', (m.y0 - 120*v).toFixed(1)); m.el.setAttribute('opacity', (Math.sin(Math.PI*v)*0.75).toFixed(3)); });
    if (oo.dim !== undefined){ L.dusk.setAttribute('opacity', (0.3*oo.dim).toFixed(3)); L.beam.setAttribute('opacity', (0.18*(1 - oo.dim)).toFixed(3)); L.lamps.forEach(p => p.glow.setAttribute('opacity', (0.5 + 0.4*oo.dim).toFixed(3))); }
  };
  return L;
}

/* ------------------------------ GARDEN ------------------------------ */
function locGarden(parent, o){
  o = o || {};
  const eve = o.tod === 'sunset';
  const L = {}; const g = G(parent); L.back = g;
  skyRect(g, 'gd' + (eve ? 'S' : 'D'), eve ? [[0,'#8E7CC3'],[0.5,'#F5A3A0'],[0.85,'#FFD39A'],[1,'#FFE7B8']] : [[0,'#8FD3F7'],[0.7,'#DDF3FF'],[1,'#F7FCFF']]);
  L.sunG = G(g, eve ? 'translate(1500 520)' : 'translate(1560 150)'); mk('circle', {r:220, fill:'url(#glowW)'}, L.sunG); mk('circle', {r:54, fill: eve ? '#FFB36B' : '#FFF4B8'}, L.sunG);
  L.clouds = [0.8, 0.6, 0.7].map(s => cloudShape(g, 0, 0, s, eve ? '#FFD6C8' : '#FFFFFF'));
  mk('path', SK({d:'M-400 640 Q200 560 800 620 Q1400 670 2320 590 L2320 760 L-400 760 Z', fill: eve ? '#9DB98A' : '#B6E3A0'}, 4), g);
  L.trees = [roundTree(g, 1400, 650, 0.8, eve ? ['#6E9A6E','#82AE7E'] : ['#63B36B','#7CC77A']), roundTree(g, 1700, 640, 1.0, eve ? ['#6E9A6E','#82AE7E'] : ['#63B36B','#7CC77A'])];
  // shed
  const sd = G(g, 'translate(250 760)');
  mk('rect', SK({x:-170, y:-280, width:340, height:280, fill:'#BFE3D6'}, 5), sd);
  mk('path', SK({d:'M-200 -270 L0 -400 L200 -270 Z', fill:'#FF9AA2'}, 5), sd);
  mk('rect', SK({x:-60, y:-190, width:120, height:190, rx:10, fill:'#8FCDB8'}, 4.5), sd); mk('circle', {cx:40, cy:-90, r:7, fill:'#FFD27A', stroke:OL, 'stroke-width':3}, sd);
  mk('rect', SK({x:80, y:-230, width:70, height:60, rx:6, fill:'#FFF3C4'}, 4), sd);
  // sunflowers behind fence
  L.sunflowers = [];
  [560, 680, 1180, 1300, 1900].forEach((x, i) => { const s = G(g, `translate(${x} 760)`); const head = G(s, 'translate(0 -330)');
    mk('path', {d:'M0 0 Q10 -160 0 -330', fill:'none', stroke:'#5FA85B', 'stroke-width':8}, s); mk('ellipse', S4({cx:22, cy:-150, rx:26, ry:12, fill:'#7CC77A', transform:'rotate(-30 22 -150)'}), s);
    for (let k=0;k<12;k++) mk('ellipse', S4({cx:0, cy:-36, rx:12, ry:24, fill:'#FFD84D', transform:`rotate(${k*30})`}, 3), head);
    mk('circle', S4({r:26, fill:'#A8743E'}), head); s.head = head; L.sunflowers.push(s); });
  // fence
  const fc = G(g);
  for (let x=-380; x<2320; x+=60){ mk('path', SK({d:`M${x} 790 L${x} 690 L${x + 20} 668 L${x + 40} 690 L${x + 40} 790 Z`, fill:'#FFFFFF'}, 4), fc); }
  mk('rect', SK({x:-400, y:712, width:2720, height:16, fill:'#FFFFFF'}, 4), fc); mk('rect', SK({x:-400, y:756, width:2720, height:16, fill:'#FFFFFF'}, 4), fc);
  // ground
  mk('rect', {x:-400, y:780, width:2720, height:700, fill: eve ? '#93B97F' : '#A6DB8C'}, g);
  mk('path', SK({d:'M-400 790 H2320', fill:'none'}, 4), g);
  // pumpkin patch
  L.pumpkins = [[1640, 900, 1.3], [1780, 940, 1.0], [1560, 960, 0.9]].map(a => { const p = G(g, `translate(${a[0]} ${a[1]})`); itPumpkin(p, a[2]); return p; });
  mk('path', {d:'M1500 990 Q1600 900 1700 960 T1900 930', fill:'none', stroke:'#5FA85B', 'stroke-width':6}, g);
  L.chars = G(parent); L.front = G(parent);
  // raised bed in front
  const bed = G(L.front); L.bed = bed;
  mk('path', SK({d:'M380 960 Q960 930 1540 960 L1540 1010 L380 1010 Z', fill:'#8B5E3C'}, 5), bed);
  for (let x=440; x<1500; x+=110) mk('path', {d:`M${x} 978 q20 -12 40 0`, fill:'none', stroke:'#6E4A30', 'stroke-width':4, 'stroke-linecap':'round'}, bed);
  mk('rect', SK({x:360, y:1000, width:1200, height:70, rx:10, fill:'#D9A066'}, 5), bed);
  mk('path', {d:'M380 1030 H1540', stroke:'#B97F4A', 'stroke-width':4}, bed);
  L.plots = [500, 660, 820, 980, 1140, 1300, 1440];
  L.plants = G(bed);  // episode adds sprouts here
  grassTufts(L.front, 20, 15, 1060, 1110, eve ? ['#7FA370','#6E9A6E','#93B97F'] : null);
  L.fx = G(parent);
  overlays(L, parent);
  if (eve) L.warm.setAttribute('opacity', 0.07);
  L.update = function(u, oo){
    oo = oo || {};
    L.clouds.forEach((c, i) => T(c, `translate(${(mod(u*(6 + i*2) + i*700, 2600) - 320).toFixed(1)} ${100 + i*60}) scale(${[0.8,0.6,0.7][i]})`));
    L.trees.forEach((t, i) => T(t.top, `rotate(${(1.2*Math.sin(TAU*u/5 + i)).toFixed(2)} 0 -130)`));
    L.sunflowers.forEach((s, i) => T(s.head, `translate(0 -330) rotate(${(5*Math.sin(TAU*u/4.4 + i)).toFixed(2)})`));
    if (oo.dusk !== undefined) L.dusk.setAttribute('opacity', (0.4*oo.dusk).toFixed(3));
  };
  return L;
}

/* ------------------------------ BEDROOM ------------------------------ */
function locBedroom(parent, o){
  o = o || {};
  const night = o.night !== false;
  const L = {}; const g = G(parent); L.back = g;
  quiltPattern('quiltF');
  mk('rect', {x:-400, y:-400, width:2720, height:1180, fill: night ? '#E4D6F0' : '#F2E6FA'}, g);
  for (let y=40, r=0; y<720; y+=90, r++) for (let x = r%2 ? 45 : 0; x<2000; x+=90) mk('path', {d:STAR_D, fill: night ? '#D3C2E8' : '#E6D8F6', transform:`translate(${x} ${y}) scale(0.7)`}, g);
  mk('rect', {x:-400, y:770, width:2720, height:700, fill:'#E9C9A6'}, g);
  for (let x=-400; x<2320; x+=110) mk('path', {d:`M${x} 770 L${x - 130} 1480`, stroke:'#DDB993', 'stroke-width':3}, g);
  mk('rect', SK({x:-400, y:764, width:2720, height:12, fill:'#FFFFFF'}, 4), g);
  // window
  const w = G(g, 'translate(1340 120)');
  lin('bdSky', night ? [[0,'#26285A'],[1,'#4B4683']] : [[0,'#A9DBFF'],[1,'#FFF0D8']]);
  mk('rect', SK({x:0, y:0, width:380, height:360, rx:16, fill:'url(#bdSky)'}, 5), w);
  L.wStars = []; if (night){ for (let i=0;i<18;i++) L.wStars.push({el: mk('path', {d:STAR_D, fill:'#FFF3C4', transform:`translate(${R(20,360).toFixed(0)} ${R(20,250).toFixed(0)}) scale(${R(0.25,0.5).toFixed(2)})`}, w), ph:rnd()});
    mk('circle', {cx:270, cy:100, r:100, fill:'url(#glowW)', opacity:0.5}, w); mk('path', S4({d:'M270 64 A40 40 0 1 0 310 104 A30 30 0 1 1 270 64 Z', fill:'#FFF0B0'}), w); }
  mk('path', {d:'M0 300 Q120 260 220 290 T380 270 V360 H0 Z', fill: night ? '#3E5A62' : '#BFE6A8'}, w);
  mk('path', {d:'M190 0 V360 M0 180 H380', stroke:'#FFFFFF', 'stroke-width':12}, w); mk('rect', SK({x:0, y:0, width:380, height:360, rx:16, fill:'none'}, 5), w);
  mk('path', SK({d:'M-40 -20 Q20 160 -10 400 L60 400 Q40 160 70 -20 Z', fill:'#FFC9D9'}), w); mk('path', SK({d:'M420 -20 Q360 160 390 400 L320 400 Q340 160 310 -20 Z', fill:'#FFC9D9'}), w);
  // bed (left)
  const bd = G(g, 'translate(330 0)'); L.bed = bd;
  mk('rect', SK({x:-280, y:440, width:60, height:420, rx:20, fill:'#E8B98F'}, 5), bd);
  mk('path', SK({d:'M-250 520 Q-250 420 -150 420 L150 420 Q250 420 250 520 L250 700 L-250 700 Z', fill:'#F2CFA6'}, 5), bd);
  mk('rect', SK({x:-260, y:690, width:560, height:170, rx:26, fill:'#FFFFFF'}, 5), bd);
  mk('rect', SK({x:-200, y:640, width:200, height:90, rx:40, fill:'#FFE3EC'}, 5), bd);
  mk('rect', SK({x:-60, y:720, width:400, height:150, rx:30, fill:'url(#quiltF)'}, 5), bd);
  // nightstand + lamp
  const ns = G(g, 'translate(820 770)');
  mk('rect', SK({x:-70, y:-140, width:140, height:140, rx:12, fill:'#E8B98F'}, 5), ns); mk('rect', S4({x:-50, y:-110, width:100, height:40, rx:8, fill:'#F2CFA6'}), ns);
  mk('rect', S4({x:-6, y:-230, width:12, height:90, fill:'#C9A27E'}), ns); mk('path', SK({d:'M-56 -230 L56 -230 L36 -300 L-36 -300 Z', fill:'#FFE7B0'}, 4.5), ns);
  L.lampGlow = mk('circle', {cx:820, cy:500, r:320, fill:'url(#glowLamp)', opacity: night ? 0.8 : 0}, g);
  // toy shelf right
  const ts = G(g, 'translate(1820 770)');
  mk('rect', SK({x:-120, y:-300, width:240, height:300, rx:12, fill:'#BFE3D6'}, 5), ts); mk('rect', SK({x:-114, y:-160, width:228, height:12, fill:'#9FD6C8'}, 4), ts);
  itStar(G(ts, 'translate(-60 -200)'), 1.6); itBook(G(ts, 'translate(40 -194) scale(0.8)'), '#FFB3C7'); itDice(G(ts, 'translate(-60 -40)')); itBasket(G(ts, 'translate(40 -30) scale(0.8)'));
  // screen for movie night
  if (o.screen){ const sc = G(g, 'translate(960 330)'); L.screen = sc;
    mk('rect', SK({x:-260, y:-170, width:520, height:320, rx:14, fill:'#FFFFFF'}, 5), sc);
    const cp = mk('clipPath', {id:'bdScr'}, DEFS); mk('rect', {x:-244, y:-154, width:488, height:288, rx:8}, cp);
    L.scr = G(sc); L.scr.setAttribute('clip-path', 'url(#bdScr)');
    mk('rect', {x:-244, y:-154, width:488, height:288, fill:'#8FD3F7'}, L.scr); mk('rect', {x:-244, y:60, width:488, height:80, fill:'#A6DB8C'}, L.scr);
    L.scrCloud = cloudShape(L.scr, 0, -80, 0.5); L.scrHero = G(L.scr); mk('circle', S4({r:34, fill:'#FFE07A'}), L.scrHero); mk('circle', {cx:-10, cy:-6, r:4, fill:OL}, L.scrHero); mk('circle', {cx:10, cy:-6, r:4, fill:OL}, L.scrHero); mk('path', {d:'M-10 8 Q0 16 10 8', fill:'none', stroke:OL, 'stroke-width':3}, L.scrHero);
    L.scrGlow = mk('ellipse', {cx:960, cy:700, rx:900, ry:500, fill:'#BFE3FF', opacity:0}, g); }
  L.lights = fairyLights(g, [[-100, 60], [400, 40], [960, 70], [1500, 40], [2020, 60]], 20);
  // floor: futons + pillows for sleepovers
  if (o.futons){ const ft = G(g); L.futons = ft;
    [[560,'#CDBDF4'],[860,'#FFC3D2'],[1160,'#BFE3D6'],[1460,'#FFE3B0']].forEach(a => { mk('path', SK({d:`M${a[0]-130} 900 Q${a[0]} 870 ${a[0]+130} 900 L${a[0]+150} 1000 Q${a[0]} 1020 ${a[0]-150} 1000 Z`, fill:a[1]}, 5), ft); }); }
  L.chars = G(parent); L.front = G(parent);
  if (o.blankets){ L.blankets = [560, 860, 1160, 1460].map((x, i) => { const b = G(L.front, `translate(${x} 0)`); mk('path', SK({d:'M-150 900 Q0 870 150 900 L160 1010 Q0 1030 -160 1010 Z', fill:'url(#quiltF)'}, 5), b); mk('path', {d:'M-130 910 Q0 890 130 910', fill:'none', stroke:'#FFFFFF', 'stroke-width':10, opacity:0.8}, b); return b; }); }
  L.fx = G(parent);
  L.nightOv = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#2C2457', opacity: night ? 0.26 : 0}, parent);
  L.glowTop = G(parent);   // glow elements above the night tint (torch etc.)
  L.update = function(u, oo){
    oo = oo || {};
    L.wStars.forEach(s => s.el.setAttribute('opacity', (0.4 + 0.6*Math.max(0, Math.sin(TAU*(u/2.6 + s.ph)))).toFixed(3)));
    L.lights.bulbs.forEach(b => { const a = 0.55 + 0.45*Math.sin(TAU*(u/2.4 + b.ph)); b.glow.setAttribute('opacity', (night ? a : 0.2*a).toFixed(3)); });
    const dim = oo.dim || 0;
    L.nightOv.setAttribute('opacity', ((night ? 0.26 : 0) + 0.3*dim).toFixed(3));
    L.lampGlow.setAttribute('opacity', (night ? 0.8*(1 - (oo.lampOff || 0)) : 0).toFixed(3));
    if (L.screen){ const on = oo.screen || 0; L.scr.setAttribute('opacity', (0.15 + 0.85*on).toFixed(3));
      T(L.scrHero, `translate(${(-140 + 280*(0.5 + 0.5*Math.sin(TAU*u/7))).toFixed(1)} ${(30 - 60*Math.abs(Math.sin(TAU*u*0.9))).toFixed(1)})`); T(L.scrCloud, `translate(${(mod(u*30, 600) - 300).toFixed(1)} -80) scale(0.5)`);
      L.scrGlow.setAttribute('opacity', (0.12*on*(0.8 + 0.2*Math.sin(TAU*u*1.3))).toFixed(3)); }
  };
  return L;
}

/* ------------------------------ AQUARIUM ------------------------------ */
function fishShape(parent, col, s){
  const g = G(parent); const b = G(g, `scale(${s || 1})`);
  mk('path', S4({d:'M-26 0 Q-6 -20 20 0 Q-6 20 -26 0 Z', fill:col}), b); mk('path', S4({d:'M18 0 L32 -12 L32 12 Z', fill:col}, 3), b);
  mk('circle', {cx:-14, cy:-3, r:3, fill:OL}, b); mk('path', {d:'M-2 -12 Q4 0 -2 12', fill:'none', stroke:'#FFFFFF', 'stroke-width':3, opacity:0.6}, b);
  return g;
}
function jellyShape(parent, col){
  const g = G(parent); const bell = G(g); g.bell = bell;
  mk('path', S4({d:'M-40 0 Q-40 -50 0 -50 Q40 -50 40 0 Q20 8 0 0 Q-20 8 -40 0 Z', fill:col, 'fill-opacity':0.85}), bell);
  mk('ellipse', {cx:-12, cy:-30, rx:10, ry:6, fill:'#FFFFFF', opacity:0.6}, bell);
  g.tent = [-24, -8, 8, 24].map(x => mk('path', {d:`M${x} 2 q-8 30 0 60 q8 30 0 60`, fill:'none', stroke:col, 'stroke-width':5, 'stroke-linecap':'round', opacity:0.8}, g));
  return g;
}
function locAquarium(parent, o){
  o = o || {};
  const jelly = o.room === 'jelly';
  const L = {}; const g = G(parent); L.back = g;
  if (!jelly){
    skyRect(g, 'aqW', [[0,'#3E8FD6'],[0.6,'#2C6FB5'],[1,'#1E4F8F']]);
    L.rays = [0,1,2,3,4].map(i => mk('polygon', {points:`${200 + i*380},-100 ${300 + i*380},-100 ${120 + i*380},900 ${-40 + i*380},900`, fill:'#BFE8FF', opacity:0.12}, g));
    L.far = G(g);
    L.fish = []; const cols = ['#FFB47A','#FFE07A','#FF9AA2','#9FE3D6','#C9B6F2'];
    for (let i=0;i<18;i++){ const f = fishShape(L.far, cols[i%5], R(0.6, 1.0)); L.fish.push({g:f, y:R(120, 640), sp:R(40, 90), ph:rnd(), dir: i % 3 ? 1 : -1}); }
    L.big = G(g); { const m = G(L.big, 'scale(2.4)'); mk('path', S4({d:'M-80 0 Q-60 -40 0 -36 Q60 -40 80 0 Q60 30 0 26 Q-60 30 -80 0 Z', fill:'#7FA8D8'}), m); mk('path', S4({d:'M76 0 L120 -30 L110 0 L120 30 Z', fill:'#7FA8D8'}), m);
      mk('path', {d:'M-60 10 Q0 22 60 10', fill:'none', stroke:'#DCEBFA', 'stroke-width':6}, m); mk('circle', {cx:-50, cy:-8, r:5, fill:OL}, m); mk('path', {d:'M-66 6 Q-58 12 -50 8', fill:'none', stroke:OL, 'stroke-width':3}, m); }
    L.turtle = G(g); { const tt = G(L.turtle, 'scale(1.2)'); [[-30,20],[30,20],[-30,-20],[30,-20]].forEach(p => mk('ellipse', S4({cx:p[0]*1.2, cy:p[1], rx:20, ry:9, fill:'#9FE3B0', transform:`rotate(${p[0]*p[1] > 0 ? 30 : -30} ${p[0]*1.2} ${p[1]})`}), tt));
      mk('circle', S4({cx:-62, cy:0, r:16, fill:'#9FE3B0'}), tt); mk('circle', {cx:-68, cy:-4, r:3, fill:OL}, tt); mk('ellipse', S4({cx:0, cy:0, rx:50, ry:36, fill:'#7CC0A0'}), tt); mk('path', {d:'M-30 -10 L0 -24 L30 -10 L20 20 L-20 20 Z', fill:'none', stroke:'#5FA085', 'stroke-width':3}, tt); }
    // sand + seaweed + coral
    mk('path', SK({d:'M-400 700 Q300 660 960 690 Q1600 720 2320 680 L2320 900 L-400 900 Z', fill:'#E9D3A6'}, 4), g);
    L.weeds = []; [[-100,'#5FBF8A'],[180,'#7CD3A0'],[520,'#5FBF8A'],[1420,'#7CD3A0'],[1700,'#5FBF8A'],[2000,'#7CD3A0']].forEach(a => { const w = G(g, `translate(${a[0]} 720)`); w.p = mk('path', {fill:'none', stroke:a[1], 'stroke-width':16, 'stroke-linecap':'round'}, w); w.x = a[0]; L.weeds.push(w); });
    [[340,720,'#FF9AA2'],[1200,710,'#FFB47A'],[1880,712,'#C9B6F2']].forEach(a => { const c = G(g, `translate(${a[0]} ${a[1]})`); for (let k=0;k<5;k++) mk('path', {d:`M0 0 q${(k-2)*8} -40 ${(k-2)*22} -${50 + (k%2)*30}`, fill:'none', stroke:a[2], 'stroke-width':14, 'stroke-linecap':'round'}, c); });
    // glass tunnel frame
    mk('path', {d:'M-400 1500 L-400 -400 L2320 -400 L2320 1500 L2120 1500 L2120 820 Q2120 40 960 40 Q-200 40 -200 820 L-200 1500 Z', fill:'#1E2F55'}, g);
    mk('path', {d:'M-200 830 Q-200 40 960 40 Q2120 40 2120 830', fill:'none', stroke:'#FFFFFF', 'stroke-width':14, opacity:0.5}, g);
    [0.18, 0.5, 0.82].forEach(f => mk('path', {d:`M${-200 + 2320*f} ${f === 0.5 ? 40 : 160} L${-200 + 2320*f} 830`, stroke:'#C9E4FF', 'stroke-width':8, opacity:0.35}, g));
    mk('path', {d:'M300 200 Q600 90 900 100', fill:'none', stroke:'#FFFFFF', 'stroke-width':10, opacity:0.25, 'stroke-linecap':'round'}, g);
    mk('rect', {x:-400, y:820, width:2720, height:700, fill:'#2C3E6E'}, g);
    mk('rect', SK({x:-400, y:812, width:2720, height:18, fill:'#5A6FA8'}, 4), g);
    for (let x=-300; x<2320; x+=160) mk('circle', {cx:x, cy:900, r:6, fill:'#9FD3F5', opacity:0.7}, g);
  } else {
    skyRect(g, 'aqJ', [[0,'#141B3D'],[1,'#22285A']]);
    L.tanks = [[420,'#3B3E8E','#FFB3E6'],[960,'#2F4F96','#B3E6FF'],[1500,'#4A3A8E','#E6C3FF']].map((a, i) => {
      const tk = G(g, `translate(${a[0]} 0)`);
      lin('aqTank' + i, [[0, a[1]], [1, '#1A1F44']]);
      mk('rect', SK({x:-220, y:80, width:440, height:700, rx:220, fill:`url(#aqTank${i})`}, 6), tk);
      tk.glow = mk('ellipse', {cx:0, cy:430, rx:300, ry:420, fill:'url(#glowLamp)', opacity:0.25}, tk);
      const cp = mk('clipPath', {id:'aqClip' + i}, DEFS); mk('rect', {x:-216, y:84, width:432, height:692, rx:216}, cp);
      tk.inner = G(tk); tk.inner.setAttribute('clip-path', `url(#aqClip${i})`);
      tk.jellies = [0,1,2].map(k => { const j = jellyShape(tk.inner, a[2]); j.ph = rnd(); j.x0 = R(-110, 110); return j; });
      tk.bub = bubblesFx(tk.inner, 8, '#FFFFFF');
      mk('rect', {x:-150, y:110, width:40, height:600, rx:20, fill:'#FFFFFF', opacity:0.12}, tk);
      mk('rect', SK({x:-240, y:770, width:480, height:50, rx:12, fill:'#3A3F6E'}, 5), tk);
      return tk; });
    mk('rect', {x:-400, y:820, width:2720, height:700, fill:'#1B2148'}, g);
    L.floorGlow = [420, 960, 1500].map((x, i) => mk('ellipse', {cx:x, cy:930, rx:260, ry:40, fill:['#FFB3E6','#B3E6FF','#E6C3FF'][i], opacity:0.18}, g));
  }
  L.bubbles = bubblesFx(g, 16, '#FFFFFF');
  L.chars = G(parent); L.front = G(parent);
  if (o.bench){ L.benchB = benchBack(L.back, o.bench, 960, o.benchW || 520); L.benchF = benchSeat(L.front, o.bench, 960, o.benchW || 520); }
  L.fx = G(parent);
  L.tint = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill: jelly ? '#3A2A7A' : '#1E5FA8', opacity: jelly ? 0.12 : 0.1}, parent);
  L.update = function(u, oo){
    oo = oo || {};
    if (!jelly){
      L.rays.forEach((r, i) => r.setAttribute('opacity', (0.08 + 0.07*Math.sin(TAU*(u/5 + i*0.3))).toFixed(3)));
      L.fish.forEach(f => { const x = f.dir > 0 ? mod(f.ph*2600 + u*f.sp, 2600) - 340 : 2260 - mod(f.ph*2600 + u*f.sp, 2600);
        T(f.g, `translate(${x.toFixed(1)} ${(f.y + 14*Math.sin(u*0.8 + f.ph*7)).toFixed(1)}) scale(${-f.dir} 1)`); });
      const bv = oo.big === undefined ? -1 : oo.big;
      show(L.big, bv > 0 && bv < 1); if (bv > 0 && bv < 1) T(L.big, `translate(${(2400 - 2900*bv).toFixed(1)} ${(330 - 80*Math.sin(Math.PI*bv)).toFixed(1)}) rotate(${(4*Math.sin(TAU*u/3)).toFixed(2)})`);
      const tv = mod(u/34 + 0.15, 1); T(L.turtle, `translate(${(-200 + 2400*tv).toFixed(1)} ${(560 + 30*Math.sin(TAU*u/6)).toFixed(1)}) scale(-1 1)`);
      L.weeds.forEach((w, i) => { let d = 'M0 0'; for (let k=1;k<=6;k++) d += ` L${(10*Math.sin(TAU*u/4 + k*0.6 + i)*k/3).toFixed(1)} ${-k*40}`; w.p.setAttribute('d', d); });
      L.bubbles(1700, 700, u, 0.8, 30, 600);
    } else {
      L.tanks.forEach((tk, i) => {
        tk.glow.setAttribute('opacity', (0.22 + 0.08*Math.sin(TAU*(u/4 + i/3))).toFixed(3));
        tk.jellies.forEach((j, k) => { const p = Math.sin(TAU*(u/2.6 + j.ph)); const y = 690 - mod(u*14 + j.ph*600 + k*200, 640);
          T(j, `translate(${(j.x0 + 30*Math.sin(TAU*(u/11 + j.ph))).toFixed(1)} ${y.toFixed(1)})`); T(j.bell, `scale(${(1 + 0.12*p).toFixed(3)} ${(1 - 0.1*p).toFixed(3)})`);
          j.tent.forEach((tn, q) => T(tn, `skewX(${(8*Math.sin(TAU*(u/2.6 + j.ph) + q)).toFixed(2)})`)); });
        tk.bub(0, 740, u + i, 0.7, 120, 640); });
      L.floorGlow.forEach((f, i) => f.setAttribute('opacity', (0.14 + 0.06*Math.sin(TAU*(u/4 + i/3))).toFixed(3)));
    }
  };
  return L;
}

/* ------------------------------ TRAIN ------------------------------ */
function locTrain(parent, o){
  o = o || {};
  const dusk = o.tod === 'dusk';
  const L = {}; const g = G(parent); L.back = g;
  mk('rect', {x:-400, y:-400, width:2720, height:1900, fill: dusk ? '#EBD3C8' : '#F4EDE2'}, g);
  // windows
  L.wins = [];
  const out = G(g); L.out = out;
  const cp = mk('clipPath', {id:'trWin' + (dusk ? 'D' : 'N')}, DEFS);
  [[-120, 560], [580, 1340], [1360, 2120]].forEach(a => mk('rect', {x:a[0] + 20, y:180, width:a[1] - a[0] - 40, height:400, rx:40}, cp));
  out.setAttribute('clip-path', `url(#trWin${dusk ? 'D' : 'N'})`);
  lin('trSky' + (dusk ? 'D' : 'N'), dusk ? [[0,'#7A6CB8'],[0.5,'#F29E8E'],[1,'#FFD39A']] : [[0,'#86CDF5'],[1,'#E6F7FF']]);
  mk('rect', {x:-400, y:150, width:2720, height:460, fill:`url(#trSky${dusk ? 'D' : 'N'})`}, out);
  if (dusk){ mk('circle', {cx:1200, cy:470, r:240, fill:'url(#glowW)'}, out); mk('circle', {cx:1200, cy:470, r:56, fill:'#FFB36B'}, out); }
  else { mk('circle', {cx:1500, cy:260, r:160, fill:'url(#glowW)'}, out); mk('circle', {cx:1500, cy:260, r:40, fill:'#FFF4B8'}, out); }
  // scrolling layers (each 2 copies of 2400px)
  const mkLayer = (fn) => { const l = G(out); const a = G(l), b = G(l, 'translate(2400 0)'); fn(a, 1); fn(b, 2); return l; };
  L.far = mkLayer((p, k) => { const r = rngMaker(70 + k*0); let d = 'M0 470'; for (let x=0; x<2400; x+=200) d += ` Q${x+100} ${380 + r()*50} ${x+200} ${450 + r()*20}`; d += ' L2400 620 L0 620 Z'; mk('path', SK({d, fill: dusk ? '#B08FB5' : '#A9CDE8'}, 4), p); });
  L.mid = mkLayer((p, k) => { const r = rngMaker(71); mk('rect', {x:0, y:500, width:2400, height:120, fill: dusk ? '#93B97F' : '#A6DB8C'}, p);
    for (let x=40; x<2400; x+=180 + r()*80){ if (r() < 0.25){ mk('rect', S4({x, y:440, width:60, height:60, fill:'#FFFFFF'}), p); mk('path', S4({d:`M${x-8} 440 L${x+30} 410 L${x+68} 440 Z`, fill:['#FF9AA2','#9FD3F5','#FFD27A'][Math.floor(r()*3)]}), p); } else roundTree(p, x, 520, 0.55, dusk ? ['#6E9A6E','#82AE7E'] : ['#63B36B','#7CC77A']); } });
  L.near = mkLayer((p) => { for (let x=0; x<2400; x+=600){ mk('rect', S4({x, y:300, width:14, height:320, fill:'#8B6248'}), p); mk('path', {d:`M${x+7} 330 Q${x + 307} 380 ${x + 607} 330`, fill:'none', stroke:'#4A3631', 'stroke-width':3}, p); } });
  [[-120, 560], [580, 1340], [1360, 2120]].forEach(a => { mk('rect', SK({x:a[0] + 20, y:180, width:a[1] - a[0] - 40, height:400, rx:40, fill:'none'}, 6), g); mk('rect', {x:a[0] + 6, y:166, width:a[1] - a[0] - 12, height:428, rx:50, fill:'none', stroke:'#FFFFFF', 'stroke-width':14}, g); });
  L.glare = mk('path', {d:'M100 240 L260 240 L120 520 L-40 520 Z', fill:'#FFFFFF', opacity:0.14}, g);
  // luggage rack + handles
  mk('rect', SK({x:-400, y:70, width:2720, height:22, rx:8, fill:'#BFC6D6'}, 4), g);
  L.handles = [200, 560, 960, 1360, 1720].map(x => { const h = G(g, `translate(${x} 90)`); mk('path', {d:'M0 0 V44', stroke:'#BFC6D6', 'stroke-width':6}, h); mk('circle', {cx:0, cy:62, r:18, fill:'none', stroke:OL, 'stroke-width':9}, h); mk('circle', {cx:0, cy:62, r:18, fill:'none', stroke:'#FFD27A', 'stroke-width':4.5}, h); return h; });
  // seat back
  mk('rect', SK({x:-400, y:600, width:2720, height:200, rx:30, fill: dusk ? '#C66A7A' : '#7FA8D8'}, 5), g);
  for (let x=-360; x<2320; x+=240) mk('rect', S4({x, y:624, width:220, height:150, rx:24, fill: dusk ? '#D68090' : '#94B9E2'}), g);
  mk('rect', {x:-400, y:880, width:2720, height:600, fill:'#9AA0B8'}, g);
  L.chars = G(parent); L.front = G(parent);
  mk('rect', SK({x:-400, y:880, width:2720, height:46, rx:18, fill: dusk ? '#B05A6A' : '#6E95C8'}, 5), L.front);
  mk('rect', SK({x:-400, y:922, width:2720, height:200, fill:'#8C8FA6'}, 5), L.front);
  L.fx = G(parent);
  L.warm = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#FF9A5A', opacity: dusk ? 0.08 : 0}, parent);
  L.dusk = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#2C2457', opacity:0}, parent);
  L.update = function(u, oo){
    oo = oo || {};
    const sp = oo.speed === undefined ? 1 : oo.speed;
    const dist = oo.dist !== undefined ? oo.dist : u*sp;
    T(L.far, `translate(${(-mod(dist*40, 2400)).toFixed(1)} 0)`); T(L.mid, `translate(${(-mod(dist*190, 2400)).toFixed(1)} 0)`); T(L.near, `translate(${(-mod(dist*900, 2400)).toFixed(1)} 0)`);
    L.handles.forEach((h, i) => T(h, `translate(${[200,560,960,1360,1720][i]} 90) rotate(${(5*Math.sin(TAU*u/1.6 + i*0.4)*Math.min(1, sp)).toFixed(2)})`));
    L.sway = 2*Math.sin(TAU*u/1.25)*Math.min(1, sp);
    if (oo.dim !== undefined) L.dusk.setAttribute('opacity', (0.3*oo.dim).toFixed(3));
  };
  return L;
}
