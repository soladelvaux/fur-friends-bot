/* =====================================================================
   FUR FRIENDS — reusable locations
   Each builder returns {back, chars, mid, charsFront, fx, update(u)}
   ===================================================================== */

/* ------------------------------ HOME ------------------------------ */
function locHome(parent, opts){
  opts = opts || {};
  const night = !!opts.night;
  const L = {};
  const g = G(parent);
  const id = 'home' + (night ? 'N' : 'D');
  lin(id+'Wall', night ? [[0,'#E9D8EC'],[1,'#E2CDE4']] : [[0,'#FAE9F3'],[1,'#F6DCEB']]);
  mk('rect', {x:-300, y:-300, width:2520, height:1060, fill:`url(#${id}Wall)`}, g);
  for (let y=40, r=0; y<600; y+=70, r++) for (let x = r%2 ? 35 : 0; x<1960; x+=70) mk('circle', {cx:x, cy:y, r:4, fill:'#F2D2E5'}, g);
  mk('rect', {x:-300, y:610, width:2520, height:150, fill:'#EFD3E6'}, g);
  for (let x=0; x<1960; x+=64) mk('path', {d:`M${x} 624 V752`, stroke:'#E4C1D8', 'stroke-width':3}, g);
  mk('rect', SK({x:-300, y:600, width:2520, height:14, fill:'#FFF8FB'}, 4), g);
  mk('rect', {x:-300, y:760, width:2520, height:520, fill:'#EFCFA6'}, g);
  mk('rect', {x:-300, y:756, width:2520, height:9, fill:'#D9B48A'}, g);
  const rows = [765, 805, 855, 915, 990, 1080, 1200];
  for (let i=0;i<rows.length-1;i++){
    mk('path', {d:`M-300 ${rows[i+1]} H2220`, stroke:'#E0BB8F', 'stroke-width':3}, g);
    for (let x = (i*137)%280 - 40; x<1960; x+=280) mk('path', {d:`M${x} ${rows[i]} V${rows[i+1]}`, stroke:'#E0BB8F', 'stroke-width':3}, g);
  }
  // window
  const wcp = mk('clipPath', {id:id+'Win'}, DEFS); mk('rect', {x:1090, y:130, width:420, height:420}, wcp);
  const wi = mk('g', {'clip-path':`url(#${id}Win)`}, g);
  if (night){
    lin(id+'Sky', [[0,'#2E2B5C'],[0.7,'#4B4683'],[1,'#7D6CA8']]);
    mk('rect', {x:1090, y:130, width:420, height:420, fill:`url(#${id}Sky)`}, wi);
    L.stars = [];
    for (let i=0;i<22;i++) L.stars.push({el: mk('path', {d:STAR_D, fill:'#FFF3C4', transform:`translate(${R(1100,1500)} ${R(140,420)}) scale(${R(0.25,0.55)})`}, wi), ph:rnd()});
    mk('circle', {cx:1400, cy:230, r:110, fill:'url(#glowW)', opacity:0.5}, wi);
    mk('path', S4({d:'M1400 186 A44 44 0 1 0 1444 236 A34 34 0 1 1 1400 186 Z', fill:'#FFF0B0'}), wi);
    mk('path', {d:'M1090 470 Q1200 420 1320 462 T1520 440 V560 H1090Z', fill:'#3E5A62'}, wi);
    mk('rect', {x:1170, y:380, width:16, height:110, fill:'#4E3F44'}, wi);
    [[1178,372,58],[1132,404,40],[1226,404,42]].forEach(a => mk('circle', {cx:a[0], cy:a[1], r:a[2], fill:'#3F6658'}, wi));
    L.clouds = [cloudShape(wi,0,0,0.6,'#6E64A0'), cloudShape(wi,0,0,0.45,'#6E64A0')];
  } else {
    lin(id+'Sky', [[0,'#A9DBFF'],[0.7,'#DDF1FF'],[1,'#FFF0D8']]);
    mk('rect', {x:1090, y:130, width:420, height:420, fill:`url(#${id}Sky)`}, wi);
    mk('circle', {cx:1420, cy:220, r:120, fill:'url(#glowW)'}, wi);
    mk('circle', {cx:1420, cy:220, r:42, fill:'#FFF4B8'}, wi);
    L.clouds = [cloudShape(wi,0,0,0.8), cloudShape(wi,0,0,0.55), cloudShape(wi,0,0,0.65)];
    mk('path', {d:'M1090 470 Q1200 420 1320 462 T1520 440 V560 H1090Z', fill:'#BFE6A8'}, wi);
    mk('rect', {x:1170, y:380, width:16, height:110, fill:'#A9775A'}, wi);
    [[1178,372,58],[1132,404,40],[1226,404,42]].forEach(a => mk('circle', {cx:a[0], cy:a[1], r:a[2], fill:'#9ED68F'}, wi));
    L.bird = G(wi);
    [0, 26].forEach((dx,i) => mk('path', {d:`M${dx-10} ${i*10} q5 -7 10 0 q5 -7 10 0`, fill:'none', stroke:'#6A6F86', 'stroke-width':2.6, 'stroke-linecap':'round'}, L.bird));
    // weather layers (rain / rainbow), faded in by update(u, dim, weather)
    L.rainbow = G(wi);
    ['#FF9AA2','#FFC48A','#FFE58A','#A8E6A3','#9FD3F5','#C3B1F0'].forEach((c, i) => mk('path', {d:`M1080 ${560} A ${300 - i*18} ${300 - i*18} 0 0 1 ${1680 - i*36} 560`, transform:'translate(-90 30)', fill:'none', stroke:c, 'stroke-width':17, opacity:0.85}, L.rainbow));
    L.rainLayer = G(wi);
    mk('rect', {x:1090, y:130, width:420, height:420, fill:'#8C9BB0', opacity:0.82}, L.rainLayer);
    L.rainClouds = [cloudShape(L.rainLayer,0,0,0.9,'#A7B2C4'), cloudShape(L.rainLayer,0,0,0.7,'#B4BECD'), cloudShape(L.rainLayer,0,0,0.8,'#9AA6B9')];
    L.rainStreaks = []; for (let i=0;i<40;i++) L.rainStreaks.push({el: mk('path', {d:'M0 0 l-5 24', stroke:'#E6EEF8', 'stroke-width':2.2, 'stroke-linecap':'round', opacity:0.75}, L.rainLayer), x0:R(1080,1530), ph:rnd(), sp:R(0.8,1.25)});
    L.drips = []; for (let i=0;i<16;i++) L.drips.push({el: mk('ellipse', {rx:5, ry:7, fill:'#F2F7FF', opacity:0.55, stroke:'#FFFFFF', 'stroke-width':1.5}, wi), x0:R(1100,1500), y0:R(140,520), ph:rnd()});
  }
  mk('rect', {x:1081, y:121, width:438, height:438, rx:8, fill:'none', stroke:'#FFFFFF', 'stroke-width':18}, g);
  mk('rect', SK({x:1072, y:112, width:456, height:456, rx:12, fill:'none'}, 4.5), g);
  mk('rect', SK({x:1090, y:130, width:420, height:420, fill:'none'}, 4), g);
  mk('rect', SK({x:1294, y:130, width:12, height:420, fill:'#FFFFFF'}, 3.5), g);
  mk('rect', SK({x:1090, y:334, width:420, height:12, fill:'#FFFFFF'}, 3.5), g);
  mk('rect', SK({x:1056, y:550, width:488, height:26, rx:7, fill:'#FFFFFF'}), g);
  [pot(g, 1150, 546, '#F3B6A0', '#9BD88C'), pot(g, 1452, 546, '#C9B6F2', '#7FC97A')].forEach(p => T(p, p.getAttribute('transform') + ' scale(0.7)'));
  mk('rect', SK({x:1000, y:86, width:600, height:12, rx:6, fill:'#E9B98F'}, 4), g);
  L.curtL = G(g); L.curtR = G(g);
  const cc = night ? '#F0B3C8' : '#FFC9D9';
  mk('path', SK({d: night ? 'M1022 96 L1300 96 Q1290 300 1302 604 L1040 604 Q1054 340 1022 96 Z' : 'M1022 96 L1114 96 Q1100 300 1124 604 L1040 604 Q1054 340 1022 96 Z', fill:cc}), L.curtL);
  mk('path', SK({d: night ? 'M1578 96 L1300 96 Q1310 300 1298 604 L1560 604 Q1546 340 1578 96 Z' : 'M1578 96 L1486 96 Q1500 300 1476 604 L1560 604 Q1546 340 1578 96 Z', fill:cc}), L.curtR);
  if (night){ L.curtL.setAttribute('opacity', 0); L.curtR.setAttribute('opacity', 0); }
  // clock
  const ck = G(g, 'translate(790 210)');
  mk('circle', SK({r:58, fill:'#FFF9F0'}), ck);
  mk('circle', {r:48, fill:'none', stroke:'#F3D2DF', 'stroke-width':6}, ck);
  for (let i=0;i<12;i++){ const a = i*TAU/12; mk('circle', {cx:40*Math.sin(a), cy:-40*Math.cos(a), r: i%3 ? 2.5 : 4, fill:OL}, ck); }
  L.hHour = mk('path', {d:'M0 4 L0 -24', stroke:OL, 'stroke-width':6, 'stroke-linecap':'round'}, ck);
  L.hMin = mk('path', {d:'M0 6 L0 -36', stroke:OL, 'stroke-width':4, 'stroke-linecap':'round'}, ck);
  L.hSec = mk('path', {d:'M0 8 L0 -40', stroke:'#F28CA1', 'stroke-width':2.5, 'stroke-linecap':'round'}, ck);
  mk('circle', {r:5, fill:'#F28CA1'}, ck);
  const fr1 = G(g, 'translate(960 372)');
  mk('rect', SK({x:-52, y:-48, width:104, height:96, rx:8, fill:'#FFFFFF'}, 4.5), fr1);
  mk('rect', {x:-40, y:-36, width:80, height:72, rx:4, fill:'#FFE3EC'}, fr1);
  mk('path', {d:HEART_D, fill:'#FF9DB5', transform:'translate(0 4) scale(1.2)'}, fr1);
  const fr2 = G(g, 'translate(1720 300)');
  mk('rect', SK({x:-70, y:-56, width:140, height:112, rx:8, fill:'#FFFFFF'}, 4.5), fr2);
  mk('rect', {x:-58, y:-44, width:116, height:88, rx:4, fill:'#D8EEFF'}, fr2);
  mk('path', {d:'M-58 30 L-20 -14 L6 16 L24 -4 L58 32 V44 H-58 Z', fill:'#A6DDB0'}, fr2);
  mk('circle', {cx:30, cy:-22, r:9, fill:'#FFE38A'}, fr2);
  // bookshelf
  const bs = G(g);
  mk('rect', SK({x:80, y:262, width:310, height:500, rx:8, fill:'#E7B98E'}), bs);
  mk('rect', {x:96, y:278, width:278, height:468, fill:'#D9A577'}, bs);
  [400, 530, 660].forEach(y => mk('rect', SK({x:90, y, width:290, height:14, fill:'#E7B98E'}, 4), bs));
  const rr = rngMaker(55);
  [[278,400],[414,530],[544,660]].forEach((sh, si) => {
    let x = 104;
    while (x < 360){
      const w = 18 + Math.floor(rr()*14), h = 70 + Math.floor(rr()*44);
      if (x + w > 366) break;
      if (rr() < 0.12 && si !== 1){ x += 16; continue; }
      mk('rect', S4({x, y: sh[1]-h, width:w, height:h, rx:3, fill: BOOKC[Math.floor(rr()*BOOKC.length)]}), bs);
      x += w + 2;
    }
  });
  pot(bs, 160, 258, '#FFD27A', '#86CF7E');
  pot(bs, 320, 258, '#B9E3F3', '#9BD88C');
  mk('rect', S4({x:110, y:674, width:120, height:72, rx:6, fill:'#FFF3E0'}), bs);
  mk('rect', S4({x:250, y:690, width:110, height:56, rx:6, fill:'#C9B6F2'}), bs);
  mk('ellipse', {cx:1000, cy:905, rx:390, ry:72, fill:'#D9CBF6', stroke:'#C4AFF0', 'stroke-width':8}, g);
  mk('ellipse', {cx:1000, cy:905, rx:340, ry:56, fill:'none', stroke:'#EADFFB', 'stroke-width':5, 'stroke-dasharray':'14 12'}, g);
  // stool + jar
  mk('rect', S4({x:150, y:830, width:14, height:132, fill:'#D9A577'}), g);
  mk('rect', S4({x:216, y:830, width:14, height:132, fill:'#D9A577'}), g);
  mk('ellipse', SK({cx:190, cy:822, rx:64, ry:16, fill:'#E7B98E'}, 4.5), g);
  L.jarIn = G(g);
  const jarSpots = [[172,800],[204,802],[188,790],[166,782],[208,780],[186,768],[170,756],[204,754]];
  L.jarAcorns = jarSpots.map((p,i) => itAcorn(G(L.jarIn, `translate(${p[0]} ${p[1]}) rotate(${(i%3-1)*25})`), 0.85).parentNode);
  mk('rect', SK({x:142, y:716, width:96, height:100, rx:16, fill:'#DDF3FF', 'fill-opacity':0.35}, 4.5), g);
  mk('rect', SK({x:150, y:704, width:80, height:16, rx:5, fill:'#DDF3FF', 'fill-opacity':0.5}, 4), g);
  mk('path', {d:'M156 734 V796', stroke:'#fff', 'stroke-width':5, 'stroke-linecap':'round', opacity:0.75}, g);
  const bk = G(g, 'translate(452 976)');
  [[-26,-34],[0,-40],[24,-33],[-12,-24],[12,-25]].forEach(p => itAcorn(G(bk, `translate(${p[0]} ${p[1]})`), 0.85));
  mk('path', SK({d:'M-52 -26 L52 -26 L42 6 L-42 6 Z', fill:'#D9A066'}, 4.5), bk);
  mk('path', {d:'M-46 -14 H46 M-44 -4 H44', stroke:'#B97F4A', 'stroke-width':3}, bk);
  // big plant
  const bp = G(g, 'translate(1790 968)');
  L.bigLeaves = G(bp);
  [[-60,-200,-35],[-20,-250,-10],[30,-236,18],[66,-180,40],[-80,-140,-60],[80,-120,62],[0,-170,0]].forEach(a => {
    mk('path', {d:`M0 -130 Q${a[0]*0.4} ${(a[1]-130)/2} ${a[0]} ${a[1]}`, stroke:'#5FA85B', 'stroke-width':6, fill:'none'}, L.bigLeaves);
    mk('ellipse', S4({cx:a[0], cy:a[1], rx:30, ry:46, fill:'#7CC77A', transform:`rotate(${a[2]} ${a[0]} ${a[1]})`}), L.bigLeaves);
    mk('path', {d:`M${a[0]} ${a[1]+34} L${a[0]} ${a[1]-34}`, stroke:'#5FA85B', 'stroke-width':3, transform:`rotate(${a[2]} ${a[0]} ${a[1]})`}, L.bigLeaves);
  });
  mk('path', SK({d:'M-62 -140 L62 -140 L50 0 L-50 0 Z', fill:'#F2A58A'}), bp);
  mk('rect', SK({x:-70, y:-152, width:140, height:22, rx:7, fill:'#F2A58A'}), bp);
  mk('ellipse', {cx:0, cy:-146, rx:54, ry:7, fill:'#8B5E3C'}, bp);
  // floor lamp (night glow)
  const lamp = G(g, 'translate(1665 968)');
  mk('rect', S4({x:-5, y:-300, width:10, height:300, fill:'#C9A27E'}), lamp);
  mk('ellipse', SK({cx:0, cy:0, rx:40, ry:9, fill:'#C9A27E'}, 4), lamp);
  mk('path', SK({d:'M-46 -300 L46 -300 L32 -370 L-32 -370 Z', fill:'#FFE7B0'}), lamp);
  if (opts.windowSeat){
    mk('rect', SK({x:1000, y:650, width:600, height:110, rx:16, fill:'#E7B98E'}), g);
    for (let x=1028; x<1580; x+=140) mk('rect', S4({x, y:676, width:120, height:70, rx:8, fill:'#F2CFA6'}), g);
    mk('rect', SK({x:990, y:618, width:620, height:40, rx:18, fill:'#C9B6F2'}), g);
    mk('rect', {x:1020, y:626, width:560, height:10, rx:5, fill:'#DCCDF8'}, g);
  }
  // dining chair back + cushion + carrot bowl
  mk('rect', SK({x:530, y:600, width:180, height:160, rx:30, fill:'#F7C7D4'}), g);
  mk('rect', {x:560, y:628, width:120, height:20, rx:10, fill:'#FBDCE5'}, g);
  mk('ellipse', SK({cx:960, cy:950, rx:122, ry:34, fill:'#C9B6F2'}), g);
  mk('ellipse', {cx:950, cy:940, rx:80, ry:12, fill:'#DCCDF8'}, g);
  const cb = G(g, 'translate(1094 968)');
  [-14,0,14].forEach((x,i) => itCarrot(G(cb, `translate(${x} -14) rotate(${(i-1)*18}) scale(0.6)`), 60));
  mk('path', SK({d:'M-34 -16 L34 -16 Q30 10 0 10 Q-30 10 -34 -16 Z', fill:'#FFF3E0'}, 4.5), cb);
  L.back = g;
  L.chars = G(parent);
  // table (in front of chars layer)
  const tb = G(parent); L.table = tb;
  mk('rect', SK({x:432, y:730, width:376, height:22, rx:6, fill:'#F2CFA6'}, 4.5), tb);
  mk('rect', SK({x:420, y:748, width:400, height:26, rx:8, fill:'#E2B285'}), tb);
  mk('rect', SK({x:436, y:772, width:368, height:22, rx:4, fill:'#D9A577'}, 4), tb);
  mk('rect', S4({x:454, y:790, width:20, height:170, fill:'#D9A577'}), tb);
  mk('rect', S4({x:766, y:790, width:20, height:170, fill:'#D9A577'}), tb);
  L.tableTop = G(tb);
  L.charsFront = G(parent);
  L.fx = G(parent);
  // light
  L.beam = mk('polygon', {points:'1100,556 1500,556 1180,1080 520,1080', fill: night ? '#BFC8FF' : '#FFF6D2', opacity: night ? 0.08 : 0.26}, parent);
  L.motes = [];
  for (let i=0;i<30;i++) L.motes.push({el: mk('circle', {r:R(2,5), fill: night ? '#FFF2B0' : '#FFF7D0'}, parent), x0:R(600,1600), y0:R(560,1060), ph:rnd()});
  L.rainOv = mk('rect', {x:-300, y:-300, width:2520, height:1700, fill:'#566A8A', opacity:0}, parent);
  L.nightOv = mk('rect', {x:-300, y:-300, width:2520, height:1700, fill:'#2C2457', opacity: night ? 0.34 : 0}, parent);
  L.lampGlow = mk('ellipse', {cx:1665, cy:640, rx:420, ry:360, fill:'url(#glowLamp)', opacity: night ? 0.85 : 0}, parent);
  L.update = function(u, dim, weather){
    L.clouds.forEach((c,i) => T(c, `translate(${1000 + mod(u*(night ? 6 : 10+i*4) + i*240, 640)} ${200 + i*70}) scale(${[0.8,0.55,0.65][i] || 0.6})`));
    if (L.bird){ const bu = mod(u, 22)/9; show(L.bird, bu < 1); T(L.bird, `translate(${1080 + 460*bu} ${240 - 40*bu + 6*Math.sin(TAU*u*1.5)}) scale(1 ${0.6 + 0.4*Math.abs(Math.sin(TAU*u*2))})`); }
    if (L.stars) L.stars.forEach(s => s.el.setAttribute('opacity', (0.5 + 0.5*Math.sin(TAU*(u/2.6 + s.ph))).toFixed(3)));
    T(L.curtL, `skewX(${1.2*Math.sin(TAU*u/7)})`); T(L.curtR, `skewX(${-1.2*Math.sin(TAU*u/7 + 1)})`);
    T(L.hSec, `rotate(${Math.floor(u)*6 + 6*sm(mod(u,1)/0.15)})`); T(L.hMin, `rotate(${(night ? 250 : 40) + u*0.1})`); T(L.hHour, `rotate(${(night ? 280 : 220) + u*0.01})`);
    T(L.bigLeaves, `rotate(${1.2*Math.sin(TAU*u/5)} 0 -140)`);
    L.motes.forEach(m => { const v = mod(u/30 + m.ph, 1); m.el.setAttribute('cx', (m.x0 + 20*Math.sin(TAU*(u/9 + m.ph))).toFixed(1)); m.el.setAttribute('cy', (m.y0 - 160*v).toFixed(1)); m.el.setAttribute('opacity', (Math.sin(Math.PI*v)*(night ? 0.5 : 0.8)).toFixed(3)); });
    if (!night){
      const w = weather || {rain:0, rainbow:0};
      if (L.rainLayer){
        L.rainLayer.setAttribute('opacity', w.rain.toFixed(3));
        L.rainbow.setAttribute('opacity', (w.rainbow || 0).toFixed(3));
        L.rainClouds.forEach((c,i) => T(c, `translate(${1040 + mod(u*(5+i*2) + i*170, 560)} ${180 + i*80}) scale(${[0.9,0.7,0.8][i]})`));
        L.rainStreaks.forEach(r => { const v = mod(u*1.5*r.sp + r.ph, 1); T(r.el, `translate(${(r.x0 - 26*v).toFixed(1)} ${(110 + 460*v).toFixed(1)})`); });
        L.drips.forEach(d => { const v = mod(u*0.05 + d.ph, 1); d.el.setAttribute('cx', d.x0); d.el.setAttribute('cy', (d.y0 + 50*v).toFixed(1)); d.el.setAttribute('opacity', (0.6*Math.sin(Math.PI*v)*Math.max(w.rain, 0.6*(w.wet || 0))).toFixed(3)); });
      }
      L.rainOv.setAttribute('opacity', (0.16*w.rain).toFixed(3));
      L.lampGlow.setAttribute('opacity', (0.6*w.rain).toFixed(3));
      L.beam.setAttribute('opacity', (0.26*(1 - w.rain)).toFixed(3));
      if (L.bird) L.bird.setAttribute('opacity', (1 - w.rain).toFixed(3));
    }
    if (night){
      const d = dim || 0;
      L.nightOv.setAttribute('opacity', (0.34 + 0.22*d).toFixed(3));
      L.lampGlow.setAttribute('opacity', (0.85 - 0.45*d).toFixed(3));
    }
  };
  return L;
}

/* --------------------------- WAITING ROOM --------------------------- */
function locWaiting(parent){
  const L = {};
  const g = G(parent);
  lin('wWall', [[0,'#EAF6F1'],[1,'#E2F2EC']]);
  mk('rect', {x:-300, y:-300, width:2520, height:1060, fill:'url(#wWall)'}, g);
  for (let x=-300; x<2220; x+=90) mk('path', {d:`M${x} -300 V600`, stroke:'#DDEFE8', 'stroke-width':18}, g);
  mk('rect', {x:-300, y:610, width:2520, height:150, fill:'#CFEADF'}, g);
  mk('rect', SK({x:-300, y:600, width:2520, height:14, fill:'#FFFFFF'}, 4), g);
  mk('rect', {x:-300, y:760, width:2520, height:520, fill:'#F6E8D5'}, g);
  for (let x=-300; x<2220; x+=120) mk('path', {d:`M${x} 760 V1300`, stroke:'#EBD7BD', 'stroke-width':3}, g);
  for (let y=760; y<1300; y+=90) mk('path', {d:`M-300 ${y} H2220`, stroke:'#EBD7BD', 'stroke-width':3}, g);
  // window
  lin('wSky', [[0,'#A9DBFF'],[1,'#E9F6FF']]);
  mk('rect', SK({x:120, y:150, width:380, height:300, rx:10, fill:'url(#wSky)'}), g);
  L.clouds = [cloudShape(g, 0, 0, 0.5), cloudShape(g, 0, 0, 0.4)];
  mk('rect', {x:114, y:144, width:392, height:312, rx:12, fill:'none', stroke:'#FFFFFF', 'stroke-width':14}, g);
  mk('rect', SK({x:106, y:136, width:408, height:328, rx:14, fill:'none'}, 4.5), g);
  mk('rect', SK({x:304, y:150, width:12, height:300, fill:'#FFFFFF'}, 3.5), g);
  // poster
  const po = G(g, 'translate(880 320)');
  mk('rect', SK({x:-150, y:-130, width:300, height:240, rx:14, fill:'#FFFDF6'}), po);
  mk('path', S4({d:'M-46 -60 Q-46 -84 -18 -78 Q0 -72 18 -78 Q46 -84 46 -60 Q46 -10 30 40 Q20 54 14 24 Q0 0 -14 24 Q-20 54 -30 40 Q-46 -10 -46 -60 Z', fill:'#FFFFFF'}), po);
  mk('circle', {cx:-16, cy:-40, r:5, fill:OL}, po); mk('circle', {cx:16, cy:-40, r:5, fill:OL}, po);
  mk('path', {d:'M-10 -24 Q0 -14 10 -24', fill:'none', stroke:OL, 'stroke-width':3.5, 'stroke-linecap':'round'}, po);
  mk('ellipse', {cx:-28, cy:-30, rx:8, ry:5, fill:'#FFAFBF'}, po); mk('ellipse', {cx:28, cy:-30, rx:8, ry:5, fill:'#FFAFBF'}, po);
  itToothbrush(G(po, 'translate(80 -10) scale(1.2)'), '#FFB3C7');
  txt(po, 0, 92, 'Brush twice a day!', 30, OL);
  // clock
  const ck = G(g, 'translate(1240 210)');
  mk('circle', SK({r:50, fill:'#FFFFFF'}), ck);
  for (let i=0;i<12;i++){ const a = i*TAU/12; mk('circle', {cx:36*Math.sin(a), cy:-36*Math.cos(a), r: i%3 ? 2.2 : 3.6, fill:OL}, ck); }
  L.hMin = mk('path', {d:'M0 6 L0 -32', stroke:OL, 'stroke-width':4, 'stroke-linecap':'round'}, ck);
  L.hHour = mk('path', {d:'M0 4 L0 -20', stroke:OL, 'stroke-width':6, 'stroke-linecap':'round'}, ck);
  mk('circle', {r:5, fill:'#8FD6C4'}, ck);
  // aquarium
  mk('rect', SK({x:170, y:760, width:270, height:150, rx:8, fill:'#E7B98E'}), g);
  mk('rect', S4({x:186, y:776, width:110, height:118, rx:6, fill:'#F2CFA6'}), g);
  mk('rect', S4({x:314, y:776, width:110, height:118, rx:6, fill:'#F2CFA6'}), g);
  const tank = G(g);
  mk('rect', SK({x:150, y:540, width:310, height:222, rx:14, fill:'#BFE6F7'}), tank);
  mk('rect', {x:158, y:718, width:294, height:38, fill:'#F3DFB5'}, tank);
  [[190,718],[230,722],[420,716],[380,720]].forEach(p => mk('path', {d:`M${p[0]} ${p[1]} q-10 -40 4 -70 q6 -14 -4 -30`, fill:'none', stroke:'#7CC77A', 'stroke-width':8, 'stroke-linecap':'round'}, tank));
  mk('path', S4({d:'M330 718 q10 -30 30 -10 q14 -20 22 8 Z', fill:'#F7A97B'}), tank);
  L.fishes = [['#F79AAE',0.7],['#FFD27A',0.6],['#8FB8F0',0.75],['#F7A97B',0.55]].map((f, i) => ({g: itFish(G(tank), f[0]), s:f[1], ph:i*1.7, y:600 + i*30}));
  L.tankBub = bubblesFx(tank, 8, '#FFFFFF');
  mk('rect', {x:150, y:540, width:310, height:222, rx:14, fill:'none', stroke:OL, 'stroke-width':SWD}, g);
  mk('path', {d:'M172 560 L190 560 L172 640 Z', fill:'#FFFFFF', opacity:0.5}, g);
  // reception desk
  mk('rect', SK({x:1300, y:640, width:360, height:330, rx:14, fill:'#FFFFFF'}), g);
  mk('rect', SK({x:1286, y:628, width:388, height:22, rx:8, fill:'#8FD6C4'}), g);
  mk('rect', {x:1316, y:700, width:328, height:30, fill:'#BFE3D6'}, g);
  txt(g, 1480, 724, 'Fur Friends Clinic', 24, '#4E8F80');
  mk('ellipse', SK({cx:1360, cy:624, rx:22, ry:6, fill:'#D5DDE5'}, 3.5), g);
  mk('path', SK({d:'M1342 622 Q1360 590 1378 622 Z', fill:'#FFD27A'}, 3.5), g);
  pot(g, 1610, 624, '#F3B6A0', '#86CF7E');
  // treatment door
  mk('rect', SK({x:1704, y:350, width:220, height:420, rx:10, fill:'#F6EEE2'}), g);
  L.doorIn = mk('rect', {x:1720, y:366, width:188, height:404, fill:'#DCEBFA'}, g);
  L.door = G(g);
  mk('rect', SK({x:1720, y:366, width:188, height:404, rx:6, fill:'#BFE3D6'}), L.door);
  mk('rect', S4({x:1746, y:396, width:136, height:90, rx:6, fill:'#EAF6F1'}), L.door);
  mk('circle', S4({cx:1888, cy:580, r:9, fill:'#E9B98F'}), L.door);
  const sgn = G(L.door, 'translate(1814 440)');
  ICONS.tooth(G(sgn, 'translate(-48 0)'));
  txt(sgn, 16, 12, 'Dr. Bao', 26, OL);
  // bench
  mk('rect', SK({x:620, y:690, width:520, height:120, rx:30, fill:'#9FD6C8'}), g);
  mk('rect', {x:650, y:710, width:460, height:20, rx:10, fill:'#BFE8DC'}, g);
  mk('rect', S4({x:660, y:860, width:20, height:110, fill:'#D9A577'}), g);
  mk('rect', S4({x:1080, y:860, width:20, height:110, fill:'#D9A577'}), g);
  mk('rect', SK({x:610, y:820, width:540, height:48, rx:20, fill:'#8CCBBB'}), g);
  // toy rug + magazines
  mk('ellipse', {cx:1260, cy:1010, rx:200, ry:44, fill:'#FFE3B3', stroke:'#FFD08A', 'stroke-width':6}, g);
  mk('rect', S4({x:560, y:880, width:46, height:10, rx:3, fill:'#C9B6F2'}), g);
  L.back = g;
  L.chars = G(parent);
  L.blocks = G(parent);
  L.charsFront = G(parent);
  L.fx = G(parent);
  L.update = function(u){
    L.clouds.forEach((c,i) => T(c, `translate(${150 + mod(u*9 + i*170, 360)} ${230 + i*70}) scale(${[0.5,0.4][i]})`));
    T(L.hMin, `rotate(${300 + u*0.1})`); T(L.hHour, `rotate(${300 + u*0.01})`);
    L.fishes.forEach((f, i) => {
      const v = TAU*(u/9 + f.ph/TAU);
      const x = 305 + 110*Math.sin(v), dir = Math.cos(v) >= 0 ? -1 : 1;
      T(f.g, `translate(${x.toFixed(1)} ${(f.y + 10*Math.sin(v*2)).toFixed(1)}) scale(${(dir*f.s).toFixed(3)} ${f.s})`);
    });
    L.tankBub(420, 710, u, 0.9, 10, 160);
  };
  return L;
}

/* --------------------------- DENTAL ROOM --------------------------- */
function locDental(parent){
  const L = {};
  const g = G(parent);
  lin('dWall', [[0,'#E1EEFB'],[1,'#D6E7F8']]);
  mk('rect', {x:-300, y:-300, width:2520, height:1000, fill:'url(#dWall)'}, g);
  mk('rect', {x:-300, y:560, width:2520, height:160, fill:'#C9DDF2'}, g);
  mk('rect', SK({x:-300, y:552, width:2520, height:12, fill:'#FFFFFF'}, 4), g);
  mk('rect', {x:-300, y:720, width:2520, height:560, fill:'#F6ECCB'}, g);
  for (let x=-300; x<2220; x+=150) mk('path', {d:`M${x} 720 V1300`, stroke:'#E3D3A6', 'stroke-width':3}, g);
  for (let y=720; y<1300; y+=110) mk('path', {d:`M-300 ${y} H2220`, stroke:'#E3D3A6', 'stroke-width':3}, g);
  // window with blinds
  mk('rect', SK({x:60, y:120, width:330, height:400, rx:8, fill:'#EAF6FF'}), g);
  for (let y=136; y<510; y+=24) mk('rect', S4({x:70, y, width:310, height:14, rx:4, fill:'#FFFFFF'}, 2.5), g);
  // picture
  const pic = G(g, 'translate(820 190)');
  mk('rect', SK({x:-110, y:-70, width:220, height:140, rx:8, fill:'#8C6A54'}), pic);
  mk('rect', {x:-96, y:-56, width:192, height:112, fill:'#D8EEFF'}, pic);
  mk('path', {d:'M-96 40 L-40 -10 L0 26 L40 -20 L96 40 V56 H-96 Z', fill:'#A6DDB0'}, pic);
  // back counter + sink
  mk('rect', SK({x:1300, y:440, width:600, height:280, rx:10, fill:'#FFFFFF'}), g);
  mk('rect', SK({x:1290, y:430, width:620, height:22, rx:8, fill:'#9FC4EA'}), g);
  for (let x=1320; x<1890; x+=190) mk('rect', S4({x, y:470, width:170, height:230, rx:10, fill:'#F4F8FD'}), g);
  mk('ellipse', S4({cx:1700, cy:432, rx:70, ry:9, fill:'#D5DDE5'}), g);
  mk('path', {d:'M1760 430 V392 Q1760 376 1744 376 Q1726 376 1726 392 V400', fill:'none', stroke:OL, 'stroke-width':13, 'stroke-linecap':'round'}, g);
  mk('path', {d:'M1760 430 V392 Q1760 376 1744 376 Q1726 376 1726 392 V400', fill:'none', stroke:'#D5DDE5', 'stroke-width':6, 'stroke-linecap':'round'}, g);
  mk('rect', S4({x:1400, y:384, width:30, height:46, rx:8, fill:'#8FD6C4'}), g);
  mk('rect', S4({x:1408, y:370, width:14, height:16, rx:3, fill:'#FFFFFF'}), g);
  pot(g, 1520, 426, '#FFFFFF', '#86CF7E');
  // lamp arm
  L.lampArm = G(g);
  mk('path', {d:'M1060 -20 L1060 120 Q1060 170 1010 200 L930 250', fill:'none', stroke:OL, 'stroke-width':18, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, L.lampArm);
  mk('path', {d:'M1060 -20 L1060 120 Q1060 170 1010 200 L930 250', fill:'none', stroke:'#E8EEF4', 'stroke-width':9, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, L.lampArm);
  mk('ellipse', SK({cx:915, cy:262, rx:66, ry:30, fill:'#E8EEF4', transform:'rotate(-18 915 262)'}), L.lampArm);
  L.lampDisc = mk('ellipse', {cx:917, cy:270, rx:46, ry:16, fill:'#FFF3B0', transform:'rotate(-18 917 270)'}, L.lampArm);
  L.lampCone = mk('polygon', {points:'880,280 955,265 1110,560 900,620', fill:'#FFF6C8', opacity:0}, g);
  // tool tray
  const tray = G(g, 'translate(1330 640)');
  mk('path', {d:'M0 0 V250', stroke:OL, 'stroke-width':14, 'stroke-linecap':'round'}, tray);
  mk('path', {d:'M0 0 V250', stroke:'#D5DDE5', 'stroke-width':6, 'stroke-linecap':'round'}, tray);
  mk('ellipse', S4({cx:0, cy:252, rx:46, ry:10, fill:'#D5DDE5'}), tray);
  mk('rect', SK({x:-80, y:-16, width:160, height:22, rx:7, fill:'#B9D3EE'}), tray);
  [[-50,'#E3E9EF'],[-26,'#E3E9EF'],[0,'#8FB8E0'],[26,'#E3E9EF']].forEach(a => mk('rect', S4({x:a[0]-4, y:-26, width:8, height:16, rx:3, fill:a[1]}, 2.5), tray));
  mk('path', S4({d:'M40 -20 L64 -20 L60 -12 L44 -12 Z', fill:'#FFFFFF'}, 2.5), tray);
  L.back = g;
  // chair (behind patient): pedestal + footrest + seat; backrest rotates with patient
  L.chairBase = G(parent);
  mk('rect', SK({x:820, y:860, width:60, height:110, rx:10, fill:'#E8EEF4'}), L.chairBase);
  mk('ellipse', SK({cx:850, cy:972, rx:120, ry:20, fill:'#D5DDE5'}), L.chairBase);
  mk('rect', SK({x:640, y:820, width:330, height:56, rx:26, fill:'#6E9BD9'}), L.chairBase);
  mk('rect', {x:660, y:830, width:290, height:14, rx:7, fill:'#8EB4E6'}, L.chairBase);
  L.back2 = G(parent);
  L.backrest = G(L.back2);
  mk('rect', SK({x:-82, y:-240, width:164, height:232, rx:40, fill:'#6E9BD9'}), L.backrest);
  mk('rect', {x:-64, y:-226, width:128, height:24, rx:12, fill:'#8EB4E6'}, L.backrest);
  mk('rect', SK({x:-56, y:-300, width:112, height:70, rx:28, fill:'#6E9BD9'}), L.backrest);
  L.chars = G(parent);
  L.charsFront = G(parent);
  L.fx = G(parent);
  L.update = function(u, lampOn){
    L.lampDisc.setAttribute('fill', lampOn > 0.5 ? '#FFF7C8' : '#E8EEF4');
    L.lampCone.setAttribute('opacity', (0.32*lampOn).toFixed(3));
  };
  return L;
}

/* --------------------------- BLANKET FORT (inside) --------------------------- */
function quiltPattern(id){
  const pat = mk('pattern', {id, width:120, height:120, patternUnits:'userSpaceOnUse'}, DEFS);
  [['#F7C6D9',0,0],['#CDBDF4',60,0],['#BFE3D6',0,60],['#FFE3B0',60,60]].forEach(a => mk('rect', {x:a[1], y:a[2], width:60, height:60, fill:a[0]}, pat));
  mk('path', {d:'M0 60 H120 M60 0 V120', stroke:'#FFFFFF', 'stroke-width':4, 'stroke-dasharray':'8 7', opacity:0.8}, pat);
  [[30,30],[90,90]].forEach(p => mk('path', {d:HEART_D, fill:'#FFFFFF', opacity:0.55, transform:`translate(${p[0]} ${p[1] + 4}) scale(0.5)`}, pat));
  [[90,30],[30,90]].forEach(p => mk('circle', {cx:p[0], cy:p[1], r:6, fill:'#FFFFFF', opacity:0.55}, pat));
}
function fairyLights(parent, pts, n){
  const g = G(parent);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i=1;i<pts.length;i++){ const a = pts[i-1], b = pts[i]; d += ` Q${(a[0]+b[0])/2} ${Math.max(a[1], b[1]) + 46} ${b[0]} ${b[1]}`; }
  const path = mk('path', {d, fill:'none', stroke:'#6E5A4E', 'stroke-width':3}, g);
  const len = path.getTotalLength();
  const cols = ['#FFE07A','#FF9DB5','#9FD3F5','#A8E6A3','#FFC48A'];
  const bulbs = [];
  for (let i=0;i<n;i++){
    const p = path.getPointAtLength(len*(i + 0.5)/n);
    const glow = mk('circle', {cx:p.x, cy:p.y + 8, r:26, fill:'url(#glowLamp)', opacity:0}, g);
    const b = mk('ellipse', S4({cx:p.x, cy:p.y + 8, rx:7, ry:10, fill:cols[i % cols.length]}, 2.5), g);
    bulbs.push({glow, b, ph: i*0.37});
  }
  g.bulbs = bulbs;
  g.update = function(u, on){ bulbs.forEach((bb, i) => { const lit = on(i); const tw = 0.75 + 0.25*Math.sin(TAU*(u*0.8 + bb.ph)); bb.glow.setAttribute('opacity', (lit*0.9*tw).toFixed(3)); bb.b.setAttribute('opacity', (0.45 + 0.55*lit).toFixed(3)); }); };
  return g;
}
function locFort(parent){
  const L = {};
  const g = G(parent);
  quiltPattern('quiltF');
  mk('rect', {x:-300, y:-300, width:2520, height:1700, fill:'#6A587A'}, g);
  // opening at the back (living room glimpse)
  mk('path', SK({d:'M760 860 L760 520 Q760 380 960 380 Q1160 380 1160 520 L1160 860 Z', fill:'#F6DCEB'}), g);
  mk('rect', SK({x:880, y:470, width:160, height:130, rx:8, fill:'#8C9BB0'}, 4), g);
  L.rainWin = G(g);
  for (let i=0;i<10;i++) mk('path', {d:`M${892 + i*15} ${480 + (i%3)*18} l-4 18`, stroke:'#E6EEF8', 'stroke-width':2.2, 'stroke-linecap':'round'}, L.rainWin);
  mk('rect', {x:760, y:760, width:400, height:100, fill:'#EFCFA6'}, g);
  // quilt walls + ceiling
  mk('path', SK({d:'M-300 -300 H2220 V860 Q1900 820 1700 880 L1560 520 Q1300 300 1160 420 Q1160 360 960 340 Q760 360 760 420 Q620 300 360 520 L220 880 Q20 820 -300 860 Z', fill:'url(#quiltF)'}, 6), g);
  mk('path', {d:'M360 520 Q620 300 760 420 M1160 420 Q1300 300 1560 520', fill:'none', stroke:'#FFFFFF', 'stroke-width':10, opacity:0.35}, g);
  mk('path', {d:'M-300 860 Q20 820 220 880 M1700 880 Q1900 820 2220 860', fill:'none', stroke:'#5A4A68', 'stroke-width':6}, g);
  // shade on inner walls
  mk('rect', {x:-300, y:-300, width:2520, height:1700, fill:'#3A2550', opacity:0.18}, g);
  L.lights = fairyLights(g, [[180,330],[560,250],[960,240],[1360,250],[1740,330]], 22);
  // floor + rug + pillows
  mk('rect', {x:-300, y:860, width:2520, height:500, fill:'#B99FC7'}, g);
  mk('ellipse', {cx:960, cy:1010, rx:840, ry:150, fill:'#D9CBF6', stroke:'#C4AFF0', 'stroke-width':8}, g);
  [[270,880,'#FFC3D2'],[1650,880,'#BFE3D6'],[150,960,'#FFE3B0'],[1780,960,'#CDBDF4']].forEach(p => {
    mk('ellipse', SK({cx:p[0], cy:p[1], rx:120, ry:70, fill:p[2]}), g);
    mk('path', {d:`M${p[0]-70} ${p[1]-10} Q${p[0]} ${p[1]+20} ${p[0]+70} ${p[1]-10}`, fill:'none', stroke:'#FFFFFF', 'stroke-width':5, opacity:0.6}, g);
  });
  L.back = g;
  L.chars = G(parent);
  L.front = G(parent);
  L.fx = G(parent);
  L.glow = mk('ellipse', {cx:960, cy:420, rx:1100, ry:700, fill:'url(#glowLamp)', opacity:0.32}, parent);
  L.update = function(u){
    L.lights.update(u, () => 1);
    T(L.rainWin, `translate(${-6*mod(u*1.4,1)} ${18*mod(u*1.4,1)})`);
  };
  return L;
}
/* tent shape over the home table (used while building the fort) */
function blanketTent(parent){
  const g = G(parent);
  g.tent = G(g);
  mk('path', SK({d:'M380 980 Q372 840 400 760 Q410 724 470 716 L770 716 Q830 724 840 760 Q868 840 860 980 Q800 960 740 984 Q680 960 620 986 Q560 960 500 984 Q440 960 380 980 Z', fill:'url(#quiltF)'}, 5), g.tent);
  g.door = mk('path', SK({d:'M560 984 L572 860 Q620 800 668 860 L680 984 Q620 970 560 984 Z', fill:'#4A3A5C'}, 4), g.tent);
  g.doorGlow = mk('path', {d:'M576 978 L586 866 Q620 820 654 866 L664 978 Z', fill:'#FFD98A', opacity:0}, g.tent);
  mk('path', {d:'M420 760 Q620 790 820 760', fill:'none', stroke:'#FFFFFF', 'stroke-width':8, opacity:0.4}, g.tent);
  g.strip = G(g);
  mk('rect', SK({x:0, y:0, width:440, height:70, rx:10, fill:'url(#quiltF)'}, 5), g.strip);
  g.lights = fairyLights(g.tent, [[400,770],[520,736],[620,730],[720,736],[840,770]], 12);
  return g;
}

/* ======================= OUTDOORS (Episode 4) ======================= */
function hexMix(a, b, u){
  u = clamp(u, 0, 1);
  const A = [1,3,5].map(i => parseInt(a.substr(i,2),16)), B = [1,3,5].map(i => parseInt(b.substr(i,2),16));
  return '#' + A.map((v,i) => Math.round(v + (B[i]-v)*u).toString(16).padStart(2,'0')).join('');
}
function gullsFx(parent, n, yMin, yMax){
  const arr = [];
  for (let i=0;i<n;i++){
    const g = G(parent);
    const w = mk('path', {d:'M-18 0 Q-9 -10 0 0 Q9 -10 18 0', fill:'none', stroke:'#4A5568', 'stroke-width':3, 'stroke-linecap':'round'}, g);
    arr.push({g, w, ph:rnd(), y:R(yMin, yMax), sp:R(45,85), s:R(0.7,1.15)});
  }
  return u => arr.forEach(b => {
    const x = mod(b.ph*2600 + u*b.sp, 2600) - 340;
    T(b.g, `translate(${x.toFixed(1)} ${(b.y + 18*Math.sin(u*0.7 + b.ph*6)).toFixed(1)}) scale(${b.s})`);
    T(b.w, `scale(1 ${(0.4 + 0.6*Math.abs(Math.sin(TAU*u*1.1 + b.ph*9))).toFixed(3)})`);
  });
}
function roundTree(parent, x, y, s, cols){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  const top = G(g);
  mk('path', SK({d:'M-14 0 C-12 -60 -18 -90 -8 -130 L10 -130 C18 -90 12 -60 16 0 Z', fill:'#8B5E3C'}), g);
  g.appendChild(top);
  [[0,-170,62],[-52,-140,48],[52,-140,48],[-20,-196,40],[26,-190,36]].forEach((a, i) => mk('circle', SK({cx:a[0], cy:a[1], r:a[2], fill: i > 2 ? cols[1] : cols[0]}), top));
  g.top = top; return g;
}
function pineTree(parent, x, y, s, col){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  mk('rect', SK({x:-9, y:-40, width:18, height:44, fill:'#8B5E3C'}, 4), g);
  [[0,-200,46],[0,-150,64],[0,-96,82]].forEach(a => mk('path', SK({d:`M${a[0]} ${a[1]-50} L${a[2]} ${a[1]+30} L${-a[2]} ${a[1]+30} Z`, fill:col || '#5DAA6A'}), g));
  return g;
}
function palmTree(parent, x, y, s){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  mk('path', SK({d:'M-14 0 Q-30 -120 6 -250 L24 -246 Q-6 -120 12 0 Z', fill:'#B88A5E'}), g);
  [-60,-25,10,45].forEach(y2 => mk('path', {d:`M-14 ${y2*1.5-100} Q0 ${y2*1.5-94} 14 ${y2*1.5-100}`, fill:'none', stroke:'#8E6440', 'stroke-width':3}, g));
  const top = G(g, 'translate(14 -250)');
  [[-120,30,-20],[-90,-50,-60],[0,-80,-95],[90,-50,-125],[120,30,-165]].forEach(a => mk('path', SK({d:`M0 0 Q${a[0]*0.5} ${a[1] - 50} ${a[0]} ${a[1]} Q${a[0]*0.45} ${a[1] - 20} 0 0 Z`, fill:'#6CC27A'}), top));
  mk('circle', S4({cx:-8, cy:6, r:10, fill:'#8E6440'}), top); mk('circle', S4({cx:8, cy:8, r:10, fill:'#8E6440'}), top);
  g.top = top; return g;
}

/* --- Mountain trail with parallax; world coords in L.near --- */
function locTrail(parent){
  const L = {};
  const sky = G(parent);
  lin('trSky', [[0,'#86CCF4'],[0.65,'#CFEFFF'],[1,'#F2FAFF']]);
  mk('rect', {x:-300, y:-300, width:2520, height:1700, fill:'url(#trSky)'}, sky);
  mk('circle', {cx:1620, cy:170, r:200, fill:'url(#glowW)'}, sky);
  mk('circle', {cx:1620, cy:170, r:56, fill:'#FFF4B8'}, sky);
  L.clouds = [cloudShape(sky,0,0,0.9), cloudShape(sky,0,0,0.6), cloudShape(sky,0,0,0.75), cloudShape(sky,0,0,0.5)];
  L.far = G(parent);
  const sg = mk('linearGradient', {id:'trSea', x1:0, y1:600, x2:0, y2:900, gradientUnits:'userSpaceOnUse'}, DEFS);
  mk('stop', {offset:0, 'stop-color':'#9ADCF5'}, sg); mk('stop', {offset:1, 'stop-color':'#4FB0E0'}, sg);
  mk('rect', {x:900, y:600, width:2200, height:800, fill:'url(#trSea)'}, L.far);
  mk('path', {d:'M900 600 H3100', stroke:'#FFFFFF', 'stroke-width':3, opacity:0.7}, L.far);
  mk('path', SK({d:'M1900 600 Q1960 560 2040 600 Z', fill:'#9CC2DB'}, 3), L.far);
  L.seaSpark = [];
  for (let i=0;i<30;i++) L.seaSpark.push({el: mk('path', {d:`M0 0 h${R(14,34)}`, stroke:'#FFFFFF', 'stroke-width':3, 'stroke-linecap':'round', transform:`translate(${R(950,2900)} ${R(620,860)})`}, L.far), ph:rnd()});
  const mr = rngMaker(91);
  let d1 = 'M-300 640', d2 = 'M-300 660';
  const peaks1 = [], peaks2 = [];
  for (let x=-300; x<=1350; x+=150){ const h = 300 + mr()*130; d1 += ` L${x+75} ${h} L${x+150} ${560 + mr()*40}`; peaks1.push([x+75, h]); }
  d1 += ' L1350 700 L-300 700 Z';
  for (let x=-300; x<=1050; x+=210){ const h = 420 + mr()*80; d2 += ` L${x+105} ${h} L${x+210} ${600 + mr()*30}`; peaks2.push([x+105, h]); }
  d2 += ' L1050 720 L-300 720 Z';
  mk('path', SK({d:d1, fill:'#B3CBEA'}, 4), L.far);
  peaks1.forEach(p => mk('path', S4({d:`M${p[0]} ${p[1]} L${p[0]+26} ${p[1]+40} L${p[0]+10} ${p[1]+34} L${p[0]} ${p[1]+46} L${p[0]-12} ${p[1]+34} L${p[0]-26} ${p[1]+40} Z`, fill:'#FFFFFF'}, 3), L.far));
  mk('path', SK({d:d2, fill:'#9CC2DB'}, 4), L.far);
  L.mid = G(parent);
  let dm = 'M-300 600';
  for (let x=-300; x<2150; x+=180) dm += ` Q${x+90} ${520 + mr()*30} ${x+180} ${570 + mr()*20}`;
  dm += ' Q2300 600 2450 900 L2450 1400 L-300 1400 Z';
  mk('path', SK({d:dm, fill:'#8ED081'}, 4.5), L.mid);
  for (let x=-200; x<2050; x+=R(130,220)){ const s = R(0.35,0.5); roundTree(L.mid, x, 600 + R(-10,20), s, ['#63B36B','#7CC77A']); }
  L.near = G(parent);
  const n = L.near;
  mk('path', SK({d:'M-300 820 Q300 790 900 815 Q1600 840 2300 805 Q2900 785 3450 815 Q3520 900 3560 1400 L-300 1400 Z', fill:'#A6DB8C'}, 5), n);
  L.backTrees = [];
  [[150,'p'],[560,'r'],[980,'p'],[1380,'r'],[1880,'p'],[2280,'r']].forEach((a, i) => L.backTrees.push(a[1] === 'p' ? pineTree(n, a[0], 860, 1.0 + 0.1*(i%2), i%2 ? '#5DAA6A' : '#4E9A5E') : roundTree(n, a[0], 860, 0.95, ['#63B36B','#7CC77A'])));
  const fr = rngMaker(12);
  for (let i=0;i<46;i++){ const x = -250 + fr()*3650, y = 840 + fr()*50; itFlower(G(n, `translate(${x} ${y}) scale(${0.5 + fr()*0.3})`), ['#FFB3C7','#FFFFFF','#FFE07A','#C9B6F2'][i%4]); }
  mk('path', SK({d:'M-300 912 Q400 896 1000 910 Q1800 924 2600 906 Q3100 896 3420 912 L3460 1000 Q2600 1016 1800 1000 Q1000 990 -300 1004 Z', fill:'#F2DDB0'}, 4.5), n);
  for (let i=0;i<60;i++) mk('ellipse', {cx:-250 + fr()*3650, cy:925 + fr()*65, rx:4 + fr()*5, ry:3 + fr()*2, fill:'#E0C590'}, n);
  for (let x=3040; x<3440; x+=72) mk('rect', SK({x:x-7, y:840, width:14, height:70, rx:4, fill:'#C98F5E'}, 4), n);
  mk('path', {d:'M3030 858 H3420 M3030 884 H3420', stroke:OL, 'stroke-width':10, 'stroke-linecap':'round'}, n);
  mk('path', {d:'M3030 858 H3420 M3030 884 H3420', stroke:'#E2B285', 'stroke-width':5, 'stroke-linecap':'round'}, n);
  const sign = G(n, 'translate(2980 900)');
  mk('rect', SK({x:-8, y:-130, width:16, height:130, fill:'#C98F5E'}, 4), sign);
  mk('path', SK({d:'M-90 -150 L70 -150 L100 -122 L70 -94 L-90 -94 Z', fill:'#FFF3D6'}, 4.5), sign);
  txt(sign, -6, -112, 'Sea View', 28, OL);
  L.chars = G(n); L.front = G(n); L.fx = G(n);
  for (let i=0;i<40;i++){ const x = -250 + fr()*3700, y = 1010 + fr()*60; const tf = G(L.front, `translate(${x} ${y})`); for (let k=0;k<5;k++) mk('path', {d:`M${(k-2)*5} 0 q${(fr()-0.5)*16} -20 ${(fr()-0.5)*24} -${30 + fr()*24}`, fill:'none', stroke:['#7CC77A','#63B36B','#8ED081'][k%3], 'stroke-width':5, 'stroke-linecap':'round'}, tf); }
  L.update = function(u, camX){
    T(L.far, `translate(${(-camX*0.15).toFixed(1)} 0)`); T(L.mid, `translate(${(-camX*0.45).toFixed(1)} 0)`); T(L.near, `translate(${(-camX).toFixed(1)} 0)`);
    L.clouds.forEach((c,i) => T(c, `translate(${(mod(u*(6+i*2) + i*560 - camX*0.05, 2400) - 240).toFixed(1)} ${110 + i*55}) scale(${[0.9,0.6,0.75,0.5][i]})`));
    L.seaSpark.forEach(s => s.el.setAttribute('opacity', (0.3 + 0.7*Math.max(0, Math.sin(TAU*(u/2.2 + s.ph)))).toFixed(3)));
  };
  return L;
}

/* --- Seaside: tod 'day'|'sunset', ground 'grass'|'sand' --- */
function locSeaside(parent, opts){
  opts = opts || {};
  const tod = opts.tod || 'day', ground = opts.ground || 'grass', sun = tod === 'sunset';
  const id = 'sea' + tod + ground;
  const L = {HZ: 580, SHORE: 770};
  const HZ = L.HZ, SH = L.SHORE;
  const g = G(parent);
  if (!sun) lin(id+'Sky', [[0,'#7EC8F2'],[0.6,'#BFE6FA'],[1,'#EAF7FF']]);
  else L.skyStops = (() => { const gr = mk('linearGradient', {id:id+'Sky', x1:0, y1:0, x2:0, y2:1}, DEFS); return [['#7A6CB8',0],['#F29E8E',0.5],['#FFC98A',0.8],['#FFE3A8',1]].map(a => mk('stop', {offset:a[1], 'stop-color':a[0]}, gr)); })();
  mk('rect', {x:-300, y:-300, width:2520, height:HZ + 300, fill:`url(#${id}Sky)`}, g);
  L.stars = G(g);
  for (let i=0;i<34;i++) mk('path', {d:STAR_D, fill:'#FFF6D0', transform:`translate(${R(-200,2100)} ${R(-200,380)}) scale(${R(0.2,0.5)})`}, L.stars);
  L.stars.setAttribute('opacity', 0);
  L.sunG = G(g);
  mk('circle', {r:sun ? 340 : 230, fill:'url(#glowW)', opacity: sun ? 0.9 : 1}, L.sunG);
  mk('circle', {r: sun ? 78 : 56, fill: sun ? '#FFB36B' : '#FFF4B8'}, L.sunG);
  if (sun) mk('circle', {r:58, fill:'#FFD08A', opacity:0.8}, L.sunG);
  T(L.sunG, sun ? 'translate(1250 380)' : 'translate(1560 160)');
  const cc = sun ? '#FFD6C8' : '#FFFFFF';
  L.clouds = [cloudShape(g,0,0,0.9,cc), cloudShape(g,0,0,0.6,cc), cloudShape(g,0,0,0.75,cc)];
  const mr = rngMaker(33);
  let d1 = 'M-300 ' + (HZ - 40);
  for (let x=-300; x<=900; x+=160) d1 += ` L${x+80} ${HZ - 210 - mr()*90} L${x+160} ${HZ - 80 - mr()*40}`;
  d1 += ` L1040 ${HZ - 40} L1180 ${HZ} L-300 ${HZ} Z`;
  mk('path', SK({d:d1, fill: sun ? '#B48DB0' : '#A8C4E6'}, 4), g);
  let d2 = 'M-300 ' + (HZ - 20);
  for (let x=-300; x<=560; x+=200) d2 += ` Q${x+100} ${HZ - 170 - mr()*70} ${x+200} ${HZ - 60 - mr()*30}`;
  d2 += ` Q700 ${HZ - 40} 760 ${HZ} L-300 ${HZ} Z`;
  mk('path', SK({d:d2, fill: sun ? '#8E7BA6' : '#8EC3B0'}, 4), g);
  mk('path', SK({d:`M1520 ${HZ} Q1590 ${HZ - 50} 1680 ${HZ} Z`, fill: sun ? '#9A7FA8' : '#9CC2DB'}, 3), g);
  const sg = mk('linearGradient', {id:id+'Sea', x1:0, y1:HZ, x2:0, y2:SH + 20, gradientUnits:'userSpaceOnUse'}, DEFS);
  mk('stop', {offset:0, 'stop-color': sun ? '#D99BB4' : '#8FD8F5'}, sg); mk('stop', {offset:1, 'stop-color': sun ? '#7E6FAE' : '#4FB0E0'}, sg);
  mk('rect', {x:-300, y:HZ, width:2520, height:SH - HZ + 60, fill:`url(#${id}Sea)`}, g);
  mk('path', {d:`M-300 ${HZ} H2220`, stroke:'#FFFFFF', 'stroke-width':3, opacity:0.6}, g);
  function sparkLayer(parent, n, y0, y1){ const a = []; for (let i=0;i<n;i++) a.push({el: mk('path', {d:`M0 0 h${R(14,34)}`, stroke: sun ? '#FFE0B0' : '#FFFFFF', 'stroke-width':3, 'stroke-linecap':'round', transform:`translate(${R(-250,2150)} ${R(y0,y1)})`}, parent), ph:rnd()}); return a; }
  L.spark = sparkLayer(g, 34, HZ + 12, SH - 20);
  L.reflect = G(g);
  if (sun) for (let i=0;i<9;i++) mk('path', {d:`M${-70 + i*6} ${HZ + 14 + i*20} h${140 - i*12}`, stroke:'#FFC77A', 'stroke-width':6, 'stroke-linecap':'round', opacity:0.85}, L.reflect);
  L.gulls = gullsFx(g, sun ? 2 : 4, 140, 420);
  L.back = g;
  L.swim = G(parent);
  const wf = G(parent); L.waterFront = wf;
  mk('rect', {x:-300, y:712, width:2520, height:SH - 712 + 30, fill:`url(#${id}Sea)`}, wf);
  L.spark2 = sparkLayer(wf, 10, 722, SH - 16);
  const g2 = G(parent); L.ground = g2;
  const sand = sun ? '#E9BE96' : '#F6E2B3';
  mk('rect', {x:-300, y:SH, width:2520, height:700, fill:sand}, g2);
  L.wet = mk('path', {fill: sun ? '#D9A988' : '#E3C894', opacity:0.9}, g2);
  L.foam = mk('path', {fill:'none', stroke:'#FFFFFF', 'stroke-width':7, 'stroke-linecap':'round', opacity:0.95}, g2);
  L.foam2 = mk('path', {fill:'none', stroke:'#FFFFFF', 'stroke-width':4, 'stroke-linecap':'round', opacity:0.6}, g2);
  const fr = rngMaker(ground === 'grass' ? 7 : 8);
  if (ground === 'grass'){
    const grass = sun ? '#93B97F' : '#A6DB8C';
    mk('path', SK({d:'M-300 870 Q300 800 960 836 Q1560 870 2220 812 L2220 1400 L-300 1400 Z', fill:grass}, 5), g2);
    mk('path', {d:'M-300 900 Q300 840 960 874', fill:'none', stroke:'#FFFFFF', 'stroke-width':8, opacity:0.18}, g2);
    L.palm = palmTree(g2, 1760, 870, 1.15);
    for (let i=0;i<36;i++){ const x = -250 + fr()*2400, y = 880 + fr()*180; itFlower(G(g2, `translate(${x} ${y}) scale(${0.45 + fr()*0.3})`), ['#FFB3C7','#FFFFFF','#FFE07A','#C9B6F2'][i%4]); }
    const bush = G(g2, 'translate(120 900)');
    [[-60,0,50],[0,-20,60],[60,0,48]].forEach(a => mk('circle', SK({cx:a[0], cy:a[1], r:a[2], fill: sun ? '#6E9A6E' : '#6CC27A'}), bush));
  } else {
    L.palm = palmTree(g2, 170, 900, 1.25);
    for (let i=0;i<70;i++) mk('ellipse', {cx:-250 + fr()*2400, cy:SH + 40 + fr()*300, rx:3 + fr()*4, ry:2 + fr()*2, fill:'#E8CF98'}, g2);
    [[1650,980],[540,1050],[1450,1060]].forEach((p, i) => { if (i === 1) { const st = G(g2, `translate(${p[0]} ${p[1]})`); mk('path', S4({d:'M0 -20 L6 -6 L20 -6 L9 3 L13 18 L0 9 L-13 18 L-9 3 L-20 -6 L-6 -6 Z', fill:'#FF9A7A'}, 3), st); } else itShell(G(g2, `translate(${p[0]} ${p[1]}) rotate(${i*30 - 20})`)); });
    mk('ellipse', SK({cx:1820, cy:930, rx:70, ry:30, fill:'#B7B2AE'}), g2);
    mk('ellipse', SK({cx:1890, cy:950, rx:44, ry:22, fill:'#C9C4BF'}), g2);
  }
  L.chars = G(parent); L.front = G(parent); L.fx = G(parent);
  L.dusk = mk('rect', {x:-300, y:-300, width:2520, height:1700, fill:'#2C2457', opacity:0}, parent);
  L.warm = mk('rect', {x:-300, y:-300, width:2520, height:1700, fill:'#FF9A5A', opacity: sun ? 0.08 : 0}, parent);
  L.update = function(u, o){
    o = o || {};
    L.clouds.forEach((c,i) => T(c, `translate(${(mod(u*(7+i*3) + i*700, 2500) - 300).toFixed(1)} ${90 + i*70}) scale(${[0.9,0.6,0.75][i]})`));
    L.gulls(u);
    const tw = s => s.el.setAttribute('opacity', (0.25 + 0.75*Math.max(0, Math.sin(TAU*(u/2.4 + s.ph)))).toFixed(3));
    L.spark.forEach(tw); L.spark2.forEach(tw);
    const surge = o.surge || 0;
    const base = SH + 8 + 7*Math.sin(TAU*u/6) + surge;
    let df = '', dw = `M-300 ${SH}`;
    for (let x=-300; x<=2220; x+=40){ const y = base + 5*Math.sin(x*0.02 + u*1.4); df += (x === -300 ? 'M' : 'L') + `${x} ${y.toFixed(1)} `; dw += ` L${x} ${(y + 14).toFixed(1)}`; }
    dw += ` L2220 ${SH} Z`;
    L.foam.setAttribute('d', df); L.wet.setAttribute('d', dw);
    let df2 = '';
    const b2 = SH - 26 + 10*Math.sin(TAU*u/6 + 2);
    for (let x=-300; x<=2220; x+=40) df2 += (x === -300 ? 'M' : 'L') + `${x} ${(b2 + 4*Math.sin(x*0.025 - u*1.2)).toFixed(1)} `;
    L.foam2.setAttribute('d', df2);
    if (L.palm) T(L.palm.top, `translate(14 -250) rotate(${(2*Math.sin(TAU*u/5)).toFixed(2)})`);
    if (sun){
      const sy = o.sunY !== undefined ? o.sunY : 380;
      T(L.sunG, `translate(1250 ${sy.toFixed(1)})`);
      const dk = o.dusk || 0;
      L.skyStops[0].setAttribute('stop-color', hexMix('#7A6CB8', '#2E2A62', dk));
      L.skyStops[1].setAttribute('stop-color', hexMix('#F29E8E', '#7E5C9E', dk));
      L.skyStops[2].setAttribute('stop-color', hexMix('#FFC98A', '#D98A8A', dk));
      L.reflect.setAttribute('opacity', (1 - sm((sy - 520)/80)).toFixed(3));
      T(L.reflect, `translate(1250 0) scale(${(1 + 0.3*Math.sin(TAU*u/3)*0.1).toFixed(3)} 1)`);
      L.stars.setAttribute('opacity', sm((dk - 0.3)/0.5).toFixed(3));
      L.dusk.setAttribute('opacity', (0.32*dk).toFixed(3));
    }
  };
  return L;
}
