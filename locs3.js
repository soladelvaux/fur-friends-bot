/* =====================================================================
   FUR FRIENDS — location pack 3 (Day 12+): snow village, log cabin
   ===================================================================== */
function snowFx(layer, n, box, big){
  const fl = []; for (let i=0;i<n;i++) fl.push({el: mk('circle', {r:R(big ? 4 : 2.5, big ? 9 : 5.5), fill:'#FFFFFF', opacity:0.9}, layer), x0:R(box[0], box[2]), ph:rnd(), sp:R(0.6, 1.2), sw:R(10, 40)});
  return function(u, amt){ fl.forEach(f => { const v = mod(u*0.07*f.sp + f.ph, 1);
    f.el.setAttribute('cx', (f.x0 + f.sw*Math.sin(TAU*(u*0.25*f.sp + f.ph*5)) - 80*v).toFixed(1)); f.el.setAttribute('cy', (box[1] + (box[3] - box[1])*v).toFixed(1));
    f.el.setAttribute('opacity', ((amt === undefined ? 1 : amt)*0.9*Math.min(1, Math.sin(Math.PI*v)*3)).toFixed(3)); }); };
}
function snowPine(parent, x, y, s){
  const g = pineTree(parent, x, y, s, '#5E9C82');
  [[0,-200,46],[0,-150,64],[0,-96,82]].forEach(a => mk('path', {d:`M${a[0]} ${a[1]-50} L${a[2]*0.55} ${a[1]-6} Q0 ${a[1]+6} ${-a[2]*0.55} ${a[1]-6} Z`, fill:'#FFFFFF', stroke:OL, 'stroke-width':3.4, 'stroke-linejoin':'round'}, g));
  return g;
}
function snowHouse(parent, x, y, s, roof, lit){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  mk('rect', SK({x:-70, y:-110, width:140, height:110, fill:'#F6E3C8'}), g);
  mk('path', SK({d:'M-92 -104 L0 -176 L92 -104 Z', fill:roof || '#E98A8A'}), g);
  mk('path', SK({d:'M-98 -100 Q-60 -116 -30 -150 L0 -176 L30 -150 Q60 -116 98 -100 Q60 -92 0 -108 Q-60 -92 -98 -100 Z', fill:'#FFFFFF'}, 3.6), g);
  g.win = mk('rect', S4({x:-48, y:-82, width:36, height:34, rx:5, fill: lit ? '#FFE08A' : '#CFE6FA'}), g);
  mk('rect', S4({x:10, y:-60, width:34, height:60, rx:6, fill:'#C98F5E'}), g);
  mk('rect', SK({x:40, y:-200, width:22, height:50, fill:'#D98C7A'}, 3.6), g);
  return g;
}
/* Snow village: o.tod 'day'|'dusk'; o.hill true → sledding slope; o.snowman x for a ground snowman base */
function locSnow(parent, o){
  o = o || {};
  const dusk = o.tod === 'dusk';
  const L = {}; const g = G(parent); L.back = g;
  skyRect(g, 'snSky' + (dusk ? 'D' : 'N') + (o.hill ? 'H' : ''), dusk ? [[0,'#7C79BF'],[0.55,'#E6A9BE'],[1,'#FFD9B8']] : [[0,'#A9D4F2'],[0.7,'#DCEEFB'],[1,'#F6FBFF']]);
  L.sunG = G(g, dusk ? 'translate(1420 520)' : 'translate(1560 170)'); mk('circle', {r:220, fill:'url(#glowW)'}, L.sunG); mk('circle', {r:50, fill: dusk ? '#FFB98A' : '#FFF6D0'}, L.sunG);
  L.clouds = [0.8, 0.6, 0.7].map(s => cloudShape(g, 0, 0, s, dusk ? '#F4D2DA' : '#FFFFFF'));
  const mr = rngMaker(o.hill ? 61 : 62);
  let d1 = 'M-400 620'; for (let x=-400; x<2300; x+=220) d1 += ` Q${x+110} ${500 + mr()*60} ${x+220} ${590 + mr()*20}`; d1 += ' L2320 760 L-400 760 Z';
  mk('path', SK({d:d1, fill: dusk ? '#D9CBE6' : '#EEF5FC'}, 4), g);
  for (let x=-380; x<2300; x+=70) snowPine(g, x + mr()*30, 640 + mr()*14, 0.32 + mr()*0.12);
  if (!o.hill){
    [[300, 760, 0.9, '#E98A8A'], [620, 740, 0.7, '#8FB8E8'], [1360, 745, 0.75, '#B7A3E8'], [1700, 765, 0.95, '#F2B36B']].forEach(a => snowHouse(g, a[0], a[1], a[2], a[3], dusk));
    mk('path', SK({d:'M-400 760 Q300 720 960 750 Q1600 780 2320 730 L2320 1500 L-400 1500 Z', fill:'#FFFFFF'}, 5), g);
    mk('path', {d:'M-400 820 Q300 790 960 812 Q1600 836 2320 800', fill:'none', stroke:'#DCEAF7', 'stroke-width':14, opacity:0.8}, g);
    [[140, 900], [1840, 880]].forEach(p => snowPine(g, p[0], p[1], 1.2));
  } else {
    // big slope from upper left to lower right
    mk('path', SK({d:'M-400 520 Q300 520 700 700 Q1200 930 2320 1000 L2320 1500 L-400 1500 Z', fill:'#FFFFFF'}, 5), g);
    mk('path', {d:'M-400 560 Q300 560 700 740 Q1200 970 2320 1040', fill:'none', stroke:'#DCEAF7', 'stroke-width':18, opacity:0.8}, g);
    L.track = mk('path', {d:'M-100 560 Q400 580 760 760 Q1200 960 2100 1040', fill:'none', stroke:'#D2E3F4', 'stroke-width':10, 'stroke-dasharray':'2 0', opacity:0}, g);
    [[200, 560], [1700, 1030]].forEach(p => snowPine(g, p[0], p[1], 1.1));
    mk('ellipse', SK({cx:1780, cy:1060, rx:200, ry:60, fill:'#FFFFFF'}, 4.5), g);   // soft landing pile
  }
  L.chars = G(parent); L.front = G(parent); L.fx = G(parent);
  L.snow = snowFx(L.fx, 70, [-300, -60, 2300, 1120]);
  L.snowBig = snowFx(L.fx, 14, [-300, -60, 2300, 1120], true);
  overlays(L, parent);
  if (dusk) L.warm.setAttribute('opacity', 0.06);
  L.update = function(u, oo){
    oo = oo || {};
    L.clouds.forEach((c, i) => T(c, `translate(${(mod(u*(5 + i*2) + i*700, 2600) - 320).toFixed(1)} ${100 + i*60}) scale(${[0.8,0.6,0.7][i]})`));
    const s = oo.snow === undefined ? 1 : oo.snow;
    L.snow(u, s); L.snowBig(u, s);
    if (oo.dusk !== undefined) L.dusk.setAttribute('opacity', (0.35*oo.dusk).toFixed(3));
  };
  return L;
}

/* Log cabin interior with fireplace; snow falling outside the window */
function locCabin(parent, o){
  o = o || {};
  const L = {}; const g = G(parent); L.back = g;
  mk('rect', {x:-400, y:-400, width:2720, height:1180, fill:'#C98F5E'}, g);
  for (let y=-380; y<780; y+=64){ mk('rect', SK({x:-400, y, width:2720, height:60, rx:28, fill: (y/64) % 2 ? '#D9A06C' : '#CF9662'}, 3.6), g); }
  // window (night snow)
  const w = G(g, 'translate(250 150)');
  lin('cbSky', [[0,'#2F3168'],[1,'#5B5598']]);
  mk('rect', SK({x:0, y:0, width:420, height:380, rx:14, fill:'url(#cbSky)'}, 6), w);
  const cp = mk('clipPath', {id:'cbWin'}, DEFS); mk('rect', {x:250, y:150, width:420, height:380, rx:14}, cp);
  L.winSnow = G(g); L.winSnow.setAttribute('clip-path', 'url(#cbWin)');
  mk('path', {d:'M250 470 Q350 430 460 460 T670 440 V530 H250 Z', fill:'#E9EEF8'}, L.winSnow);
  [[330, 470], [560, 455]].forEach(p => { const t = snowPine(L.winSnow, p[0], p[1], 0.5); t.setAttribute('opacity', 0.85); });
  L.wSnow = snowFx(L.winSnow, 30, [230, 140, 700, 540]);
  mk('path', {d:'M460 150 V530 M250 340 H670', stroke:'#FFFFFF', 'stroke-width':14}, g); mk('rect', SK({x:250, y:150, width:420, height:380, rx:14, fill:'none'}, 6), g);
  mk('rect', SK({x:220, y:520, width:480, height:30, rx:8, fill:'#E8B98F'}, 4), g);
  // fireplace
  const fp = G(g, 'translate(1300 780)'); L.fp = fp;
  mk('path', SK({d:'M-300 0 L-300 -460 L300 -460 L300 0 Z', fill:'#B9B3C2'}, 5), fp);
  const sr = rngMaker(9); for (let r=0;r<7;r++) for (let c=0;c<7;c++){ const x = -290 + c*86 + (r%2)*40, y = -40 - r*62; if (x < 280) mk('rect', {x, y, width:76, height:52, rx:16, fill: sr() < 0.5 ? '#A9A3B4' : '#C6C1CF'}, fp); }
  mk('rect', SK({x:-340, y:-500, width:680, height:50, rx:12, fill:'#8B5E3C'}, 5), fp);
  mk('path', SK({d:'M-180 0 L-180 -250 Q-180 -320 0 -320 Q180 -320 180 -250 L180 0 Z', fill:'#3A2626'}, 5), fp);
  L.fireGlow = mk('ellipse', {cx:1300, cy:640, rx:640, ry:420, fill:'url(#glowLamp)', opacity:0.75}, g);
  [[-60, -14, -12], [60, -14, 12]].forEach(a => mk('rect', SK({x:-80, y:-14, width:160, height:28, rx:14, fill:'#9B6B4A', transform:`translate(${a[0]/2} ${a[1]}) rotate(${a[2]})`}, 4), fp));
  L.flames = [[-40,'#FF7A45',1.1],[34,'#FF7A45',1.0],[0,'#FFB347',1.4],[-12,'#FFE07A',0.8],[16,'#FFE07A',0.7]].map(a => mk('path', {d:'M0 -60 Q26 -24 18 0 Q0 10 -18 0 Q-26 -24 0 -60 Z', fill:a[1], transform:`translate(${a[0]} -20) scale(${a[2]})`}, fp));
  L.fX = [-40, 34, 0, -12, 16]; L.fS = [1.1, 1.0, 1.4, 0.8, 0.7];
  // stockings + garland on mantel
  [-200, -60, 80, 220].forEach((x, i) => { const s = G(fp, `translate(${x} -450)`); mk('path', SK({d:'M-16 0 L-16 60 Q-16 84 10 84 L34 84 Q46 84 46 70 Q46 58 30 56 L16 56 L16 0 Z', fill:['#E98A8A','#8FB8E8','#A6DB8C','#F2B36B'][i]}, 3.6), s); mk('rect', S4({x:-20, y:-6, width:40, height:16, rx:6, fill:'#FFFFFF'}), s); });
  // floor + rug
  mk('rect', {x:-400, y:780, width:2720, height:700, fill:'#A8724A'}, g);
  for (let x=-400; x<2320; x+=150) mk('path', {d:`M${x} 780 L${x - 170} 1480`, stroke:'#97663F', 'stroke-width':3}, g);
  mk('ellipse', {cx:900, cy:960, rx:640, ry:100, fill:'#E9A0A0', stroke:'#D98888', 'stroke-width':8}, g);
  mk('ellipse', {cx:900, cy:960, rx:580, ry:80, fill:'none', stroke:'#FFE3E3', 'stroke-width':5, 'stroke-dasharray':'16 12'}, g);
  // little tree in the corner
  const tr = G(g, 'translate(1780 900)'); snowPine(tr, 0, 0, 1.3).querySelectorAll; L.treeLights = [];
  for (let i=0;i<10;i++){ const b = mk('circle', {cx:R(-70, 70), cy:R(-240, -60), r:7, fill:['#FFE07A','#FF9DB5','#9FD3F5'][i%3], stroke:OL, 'stroke-width':2}, tr); L.treeLights.push({el:b, ph:rnd()}); }
  mk('path', S4({d:'M0 -290 L8 -272 L28 -270 L12 -258 L18 -238 L0 -250 L-18 -238 L-12 -258 L-28 -270 L-8 -272 Z', fill:'#FFD84D'}), tr);
  L.chars = G(parent); L.front = G(parent);
  if (o.sofa){ const sf = G(L.front, `translate(${o.sofa} 0)`); L.sofa = sf;
    mk('rect', SK({x:-420, y:900, width:840, height:150, rx:40, fill:'#8FB8A8'}, 5), sf);
    mk('rect', SK({x:-470, y:850, width:110, height:210, rx:44, fill:'#7FA898'}, 5), sf); mk('rect', SK({x:360, y:850, width:110, height:210, rx:44, fill:'#7FA898'}, 5), sf); }
  L.fx = G(parent);
  L.dusk = mk('rect', {x:-400, y:-400, width:2720, height:1900, fill:'#2C2457', opacity:0.18}, parent);
  L.update = function(u, oo){
    oo = oo || {};
    L.flames.forEach((e, i) => T(e, `translate(${L.fX[i] + 3*Math.sin(TAU*u*2 + i)} -20) scale(${(L.fS[i]*(0.9 + 0.1*Math.sin(TAU*u*3.1 + i))).toFixed(3)} ${(L.fS[i]*(0.85 + 0.25*Math.sin(TAU*u*2.3 + i*1.9))).toFixed(3)})`));
    L.fireGlow.setAttribute('opacity', (0.7 + 0.12*Math.sin(TAU*u*1.9)).toFixed(3));
    L.wSnow(u, 1);
    L.treeLights.forEach(b => b.el.setAttribute('opacity', (0.5 + 0.5*Math.sin(TAU*(u/1.8 + b.ph))).toFixed(3)));
    if (oo.dim !== undefined) L.dusk.setAttribute('opacity', (0.18 + 0.25*oo.dim).toFixed(3));
  };
  return L;
}
