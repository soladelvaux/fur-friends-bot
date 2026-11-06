/* =====================================================================
   FUR FRIENDS — location pack 4: Sakura Village
   locVillage(parent, {tod:'day'|'golden'})
   Layers: back (sky, far hills) · far (parallax) · mid (houses, café, trees)
           · chars · front (foreground blossoms/flowers) · fx (petals, butterflies)
   L.update(u, {camX}) — pass the camera x so far layers drift for depth.
   ===================================================================== */

/* ---------- reusable pieces ---------- */
const SAKURA = ['#FFC4D6', '#FFB0C8', '#FFD7E4', '#FF9EBB'];
function blobCluster(parent, pts, cols, sw){
  // outlined pass then fill pass → one merged outline around the whole cluster
  const g = G(parent);
  pts.forEach(q => mk('circle', {cx:q[0], cy:q[1], r:q[2] + (sw || 4.4)/2, fill:OL}, g));
  pts.forEach((q, i) => mk('circle', {cx:q[0], cy:q[1], r:q[2] - (sw || 4.4)/2, fill:cols[i % cols.length]}, g));
  return g;
}
function blossom(parent, x, y, s, col){
  const g = G(parent, `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})`);
  for (let k=0;k<5;k++) mk('ellipse', {cx:0, cy:-6, rx:4.6, ry:6.4, fill:col || '#FFFFFF', transform:`rotate(${k*72})`}, g);
  mk('circle', {r:2.4, fill:'#FF8FAE'}, g);
  return g;
}
function sakuraTree(parent, x, y, s, seed, dim){
  const r = rngMaker(seed);
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  lin('trunkG', [[0,'#8A5A44'],[1,'#6E4433']], 1, 0);
  mk('path', SK({d:'M-26 0 Q-18 -90 -30 -170 Q-60 -220 -120 -236 L-112 -250 Q-50 -236 -18 -196 Q-6 -250 30 -290 L44 -280 Q14 -236 12 -180 Q60 -214 120 -214 L120 -198 Q50 -190 18 -140 Q24 -60 30 0 Z', fill:'url(#trunkG)'}, 5), g);
  mk('path', {d:'M-6 -20 Q0 -90 -10 -150', fill:'none', stroke:'#A7765D', 'stroke-width':6, 'stroke-linecap':'round', opacity:0.6}, g);
  const pts = [];
  [[-150,-260,70],[-80,-310,84],[10,-336,92],[100,-306,82],[170,-250,66],[-40,-240,70],[70,-236,70],[-190,-206,46],[200,-196,48],[0,-270,80]].forEach(q => pts.push([q[0] + (r()-0.5)*20, q[1] + (r()-0.5)*16, q[2]*(0.9 + r()*0.2)]));
  const cl = blobCluster(g, pts, dim ? ['#F9CFDC','#F6C2D3'] : SAKURA);
  // soft light & shade inside the canopy
  pts.forEach(q => { mk('circle', {cx:q[0] - q[2]*0.28, cy:q[1] - q[2]*0.32, r:q[2]*0.45, fill:'#FFFFFF', opacity:0.28}, cl); });
  pts.slice(0, 6).forEach(q => mk('path', {d:`M${q[0] - q[2]*0.7} ${q[1] + q[2]*0.35} Q${q[0]} ${q[1] + q[2]*0.85} ${q[0] + q[2]*0.7} ${q[1] + q[2]*0.35}`, fill:'none', stroke:'#E68AA8', 'stroke-width':5, 'stroke-linecap':'round', opacity:0.45}, cl));
  for (let i=0;i<34;i++){ const q = pts[i % pts.length], a = r()*TAU, d = r()*q[2]*0.8; blossom(cl, q[0] + d*Math.cos(a), q[1] + d*Math.sin(a), 0.7 + r()*0.6, r() < 0.5 ? '#FFFFFF' : '#FFE6EE'); }
  g.canopy = cl;
  return g;
}
function pastelHouse(parent, x, y, s, wall, roof, seed){
  const r = rngMaker(seed || 3);
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  mk('rect', SK({x:-110, y:-170, width:220, height:170, rx:8, fill:wall}, 5), g);
  mk('rect', {x:-106, y:-166, width:212, height:30, fill:'#000', opacity:0.08}, g);              // eave shadow
  // curved Japanese roof with tile ridges
  mk('path', SK({d:'M-150 -164 Q-120 -176 -100 -214 L-60 -262 L60 -262 L100 -214 Q120 -176 150 -164 Q120 -158 0 -170 Q-120 -158 -150 -164 Z', fill:roof}, 5), g);
  for (let k=-3;k<=3;k++) mk('path', {d:`M${k*26} -258 Q${k*30} -214 ${k*36} -172`, fill:'none', stroke:'#000', 'stroke-width':3, opacity:0.12}, g);
  mk('path', {d:'M-58 -256 L58 -256', stroke:'#FFFFFF', 'stroke-width':5, 'stroke-linecap':'round', opacity:0.35}, g);
  mk('rect', SK({x:-70, y:-272, width:140, height:16, rx:8, fill:roof}, 4.4), g);
  // round lattice window + sliding door
  const wx = r() < 0.5 ? -52 : 52;
  mk('circle', SK({cx:wx, cy:-104, r:30, fill:'#FFF3D6'}, 4.4), g);
  mk('path', {d:`M${wx - 30} -104 H${wx + 30} M${wx} -134 V-74`, stroke:OL, 'stroke-width':3.4}, g);
  mk('rect', SK({x:-wx - 32, y:-118, width:64, height:118, rx:6, fill:'#E9C9A3'}, 4.4), g);
  mk('path', {d:`M${-wx} -118 V0 M${-wx - 32} -78 H${-wx + 32} M${-wx - 32} -40 H${-wx + 32}`, stroke:OL, 'stroke-width':3}, g);
  // flower box
  mk('rect', SK({x:wx - 38, y:-70, width:76, height:16, rx:5, fill:'#B98552'}, 3.6), g);
  for (let k=0;k<5;k++) blossom(g, wx - 30 + k*15, -76, 0.9, ['#FF9EBB','#FFE07A','#FFFFFF','#C9B6F2','#FF9EBB'][k]);
  return g;
}
function picketFence(parent, x0, x1, y, col){
  const g = G(parent);
  mk('rect', SK({x:x0, y:y - 52, width:x1 - x0, height:12, rx:5, fill:col || '#FFFFFF'}, 3.6), g);
  mk('rect', SK({x:x0, y:y - 24, width:x1 - x0, height:12, rx:5, fill:col || '#FFFFFF'}, 3.6), g);
  for (let x=x0 + 6; x<x1 - 10; x+=34) mk('path', SK({d:`M${x} ${y} L${x} ${y - 70} L${x + 10} ${y - 82} L${x + 20} ${y - 70} L${x + 20} ${y} Z`, fill:col || '#FFFFFF'}, 3.6), g);
  return g;
}
function flowerBush(parent, x, y, s, seed, cols){
  const r = rngMaker(seed);
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  const pts = []; for (let i=0;i<7;i++) pts.push([-80 + i*27 + (r()-0.5)*14, -30 - Math.sin(i/6*Math.PI)*34 + (r()-0.5)*10, 34 + r()*12]);
  const b = blobCluster(g, pts, ['#7CC77A', '#6DBA6E', '#8ED081']);
  pts.forEach(q => mk('circle', {cx:q[0] - 10, cy:q[1] - 12, r:q[2]*0.4, fill:'#FFFFFF', opacity:0.18}, b));
  for (let i=0;i<14;i++){ const q = pts[i % pts.length]; blossom(b, q[0] + (r()-0.5)*q[2]*1.1, q[1] + (r()-0.5)*q[2]*0.9, 1.0 + r()*0.5, (cols || ['#FF9EBB','#FFFFFF','#FFE07A','#FFB0C8'])[i % 4]); }
  return g;
}
function lantern(parent, x, y, s){
  const g = G(parent, `translate(${x} ${y}) scale(${s || 1})`);
  mk('path', {d:'M0 -40 V0', stroke:OL, 'stroke-width':3}, g);
  const b = G(g); g.body = b;
  b.glow = mk('circle', {cx:0, cy:28, r:90, fill:'url(#glowLamp)', opacity:0.75}, b);
  mk('rect', SK({x:-10, y:0, width:20, height:8, rx:3, fill:'#6E4433'}, 3), b);
  mk('ellipse', SK({cx:0, cy:28, rx:20, ry:24, fill:'#FFE3A3'}, 3.6), b);
  mk('path', {d:'M-18 20 H18 M-18 36 H18', stroke:'#E8B76A', 'stroke-width':2.5}, b);
  mk('ellipse', {cx:-6, cy:20, rx:5, ry:9, fill:'#FFFFFF', opacity:0.6}, b);
  mk('rect', SK({x:-10, y:50, width:20, height:8, rx:3, fill:'#6E4433'}, 3), b);
  return g;
}
function cafe(parent, x, y, s){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  lin('cafeWall', [[0,'#FFF6EA'],[1,'#F6E2CC']]);
  rad('cafeIn', [[0,'#FFE7B0',1],[1,'#F2B97A',1]]);
  // building
  mk('rect', SK({x:-300, y:-420, width:600, height:420, rx:8, fill:'url(#cafeWall)'}, 5.5), g);
  [-300, -150, 150, 300].forEach(px => mk('rect', SK({x:px - 12, y:-420, width:24, height:420, fill:'#9A6447'}, 4), g));
  mk('rect', SK({x:-312, y:-432, width:624, height:24, fill:'#9A6447'}, 4.4), g);
  // roof
  mk('path', SK({d:'M-360 -424 L-240 -520 L240 -520 L360 -424 Z', fill:'#C9746A'}, 5.5), g);
  for (let k=-5;k<=5;k++) mk('path', {d:`M${k*44} -516 L${k*58} -428`, stroke:'#000', 'stroke-width':3, opacity:0.12}, g);
  // big shop window with warm interior
  mk('rect', SK({x:-130, y:-330, width:260, height:200, rx:10, fill:'url(#cafeIn)'}, 5), g);
  [[-80,-250],[0,-240],[80,-252]].forEach(q => { mk('rect', {x:q[0] - 22, y:q[1], width:44, height:6, rx:3, fill:'#B07A54'}, g); mk('path', {d:`M${q[0] - 14} ${q[1]} q14 -26 28 0`, fill:'#FFFFFF', stroke:OL, 'stroke-width':2.4}, g); });
  mk('path', {d:'M-130 -230 H130 M0 -330 V-130', stroke:'#9A6447', 'stroke-width':8}, g);
  mk('path', {d:'M-110 -310 L-60 -310 L-120 -250 Z', fill:'#FFFFFF', opacity:0.35}, g);
  // striped awning with scalloped edge
  const aw = G(g, 'translate(0 -340)');
  const cp = mk('clipPath', {id:'awClip'}, DEFS); mk('path', {d:'M-330 -60 L330 -60 L360 30 L-360 30 Z'}, cp);
  const st = G(aw); st.setAttribute('clip-path', 'url(#awClip)');
  for (let k=-8;k<8;k++) mk('rect', {x:k*45, y:-70, width:45, height:110, fill: k % 2 ? '#FFFFFF' : '#F58FA6', transform:`skewX(${k*1.2})`}, st);
  mk('path', {d:'M-330 -60 L330 -60 L360 30 L-360 30 Z', fill:'none', stroke:OL, 'stroke-width':5, 'stroke-linejoin':'round'}, aw);
  let sc = 'M-360 30'; for (let k=0;k<16;k++){ const x0 = -360 + k*45; sc += ` Q${x0 + 22.5} 62 ${x0 + 45} 30`; }
  mk('path', SK({d:sc + ' Z', fill:'#F58FA6'}, 5), aw);
  for (let k=0;k<16;k+=2) mk('path', {d:`M${-360 + k*45 + 45} 30 Q${-360 + k*45 + 67.5} 62 ${-360 + k*45 + 90} 30 Z`, fill:'#FFFFFF'}, aw);
  mk('rect', {x:-330, y:-60, width:660, height:12, fill:'#000', opacity:0.08}, aw);
  // door with noren curtain (paw print)
  mk('rect', SK({x:160, y:-250, width:110, height:250, rx:8, fill:'#B98552'}, 5), g);
  mk('rect', {x:172, y:-238, width:86, height:120, rx:6, fill:'#FFE7B0', opacity:0.9}, g);
  const nr = G(g, 'translate(215 -258)'); g.noren = nr;
  [-1, 1].forEach(k => { mk('path', SK({d:`M${k === -1 ? -62 : 2} 0 L${k === -1 ? -2 : 62} 0 L${k === -1 ? -2 : 62} 96 L${k === -1 ? -62 : 2} 96 Z`, fill:'#FBE3EA'}, 4.4), nr); });
  pawPrint(nr, -1, 52, 2.0, '#B06C83');
  mk('rect', SK({x:-70, y:-8, width:140, height:12, rx:5, fill:'#7A4E3A'}, 3.6), nr);
  // sign
  const sg = G(g, 'translate(-210 -380)');
  mk('rect', SK({x:-74, y:-34, width:148, height:68, rx:18, fill:'#FFFDF6'}, 4.4), sg);
  txt(sg, 18, 12, 'CAFÉ', 30, '#B06C83');
  mk('path', SK({d:'M-56 -6 L-28 -6 L-31 18 L-53 18 Z', fill:'#FFFFFF'}, 3), sg); mk('path', {d:'M-28 0 q10 0 8 8 q-2 6 -10 4', fill:'none', stroke:OL, 'stroke-width':3}, sg);
  mk('path', {d:'M-46 -12 q-4 -6 0 -12 M-38 -12 q-4 -6 0 -12', fill:'none', stroke:'#C9A27E', 'stroke-width':2.6, 'stroke-linecap':'round'}, sg);
  // planters at the base
  [-260, 110].forEach(px => { mk('rect', SK({x:px - 40, y:-46, width:80, height:46, rx:8, fill:'#E9A285'}, 4), g); flowerBush(g, px, -40, 0.42, px + 99); });
  // lanterns
  g.lanterns = [lantern(g, -330, -420, 1.1), lantern(g, 330, -420, 1.1)];
  // A-frame chalkboard
  const ab = G(g, 'translate(400 0)'); g.board = ab;
  mk('path', SK({d:'M-50 0 L-34 -150 L34 -150 L50 0', fill:'none'}, 9), ab);
  mk('path', {d:'M-50 0 L-34 -150 L34 -150 L50 0', fill:'none', stroke:'#B98552', 'stroke-width':4.5, 'stroke-linejoin':'round'}, ab);
  mk('rect', SK({x:-40, y:-140, width:80, height:110, rx:6, fill:'#4B5552'}, 4), ab);
  pawPrint(ab, 0, -82, 1.7, '#F4F0E8');
  mk('path', {d:'M-26 -44 H26', stroke:'#F4F0E8', 'stroke-width':3, 'stroke-linecap':'round', 'stroke-dasharray':'6 6'}, ab);
  return g;
}
function petalsFx(layer, n, box, big){
  const ps = [];
  for (let i=0;i<n;i++){
    const el = mk('path', {d:'M0 -9 Q8 -4 6 5 Q0 11 -6 5 Q-8 -4 0 -9 Z', fill:SAKURA[i % 4], stroke: big ? OL : 'none', 'stroke-width':1.6}, layer);
    ps.push({el, x0:R(box[0], box[2]), ph:rnd(), sp:R(0.55, 1.15), sw:R(20, 70), s:(big ? R(1.8, 2.6) : R(0.8, 1.5))});
  }
  return function(u, amt){
    ps.forEach(p => {
      const v = mod(u*0.055*p.sp + p.ph, 1);
      const x = p.x0 + p.sw*Math.sin(TAU*(u*0.18*p.sp + p.ph*7)) - 260*v, y = box[1] + (box[3] - box[1])*v;
      const flip = Math.cos(TAU*(u*0.6*p.sp + p.ph*5));                 // tumbling (fake 3D)
      T(p.el, `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(u*90*p.sp + p.ph*360).toFixed(1)}) scale(${(p.s*(0.25 + 0.75*Math.abs(flip))).toFixed(3)} ${p.s.toFixed(3)})`);
      p.el.setAttribute('opacity', ((amt === undefined ? 1 : amt)*Math.min(1, Math.sin(Math.PI*v)*4)).toFixed(3));
    });
  };
}

/* ---------- the location ---------- */
function locVillage(parent, o){
  o = o || {};
  const gold = o.tod === 'golden';
  const L = {}; const g = G(parent); L.back = g;
  skyRect(g, 'vlSky' + (gold ? 'G' : 'D'), gold ? [[0,'#9FB8E8'],[0.55,'#FFD2C2'],[1,'#FFEBC8']] : [[0,'#8FD0F2'],[0.6,'#CDEBFA'],[1,'#FFF4E6']]);
  L.sunG = G(g, gold ? 'translate(1500 380)' : 'translate(1620 120)');
  mk('circle', {r:420, fill:'url(#glowW)'}, L.sunG); mk('circle', {r:62, fill: gold ? '#FFD08A' : '#FFF7D0'}, L.sunG);
  L.clouds = [0.9, 0.65, 0.75, 0.55].map(s => cloudShape(g, 0, 0, s, gold ? '#FFE3D8' : '#FFFFFF'));
  // FAR parallax layer: hazy hills, distant sakura, pagoda
  L.far = G(g);
  const fr = rngMaker(41);
  let d1 = 'M-700 560'; for (let x=-700; x<2700; x+=260) d1 += ` Q${x+130} ${440 + fr()*60} ${x+260} ${540 + fr()*20}`; d1 += ' L2700 760 L-700 760 Z';
  mk('path', {d:d1, fill: gold ? '#C9B2D6' : '#B9D6EC'}, L.far);
  const pg = G(L.far, 'translate(420 560) scale(0.8)');
  [0,1,2].forEach(k => { mk('rect', {x:-40 + k*8, y:-60 - k*58, width:80 - k*16, height:48, fill: gold ? '#B79AB8' : '#A3BFD9'}, pg); mk('path', {d:`M${-70 + k*12} ${-60 - k*58} Q0 ${-90 - k*58} ${70 - k*12} ${-60 - k*58} Z`, fill: gold ? '#9C7FA3' : '#8AA8C8'}, pg); });
  for (let i=0;i<16;i++){ const x = -600 + i*210 + fr()*80, y = 600 + fr()*30, rr = 40 + fr()*30;
    mk('rect', {x:x - 5, y, width:10, height:40, fill: gold ? '#B38E9E' : '#B9A0A8'}, L.far);
    [[0,0,1],[-0.6,0.25,0.7],[0.6,0.25,0.7]].forEach(q => mk('circle', {cx:x + q[0]*rr, cy:y + q[1]*rr, r:rr*q[2], fill: i % 3 ? '#F7CEDC' : '#F2BCD0'}, L.far)); }
  let d2 = 'M-700 650'; for (let x=-700; x<2700; x+=320) d2 += ` Q${x+160} ${600 + fr()*30} ${x+320} ${640 + fr()*12}`; d2 += ' L2700 800 L-700 800 Z';
  mk('path', {d:d2, fill: gold ? '#B9C99A' : '#AEDB9A'}, L.far);
  mk('rect', {x:-700, y:-400, width:3400, height:1300, fill:'#FFFFFF', opacity:0.22}, L.far);    // atmospheric haze
  // MID layer: village street
  L.mid = G(g);
  const m = L.mid;
  mk('path', SK({d:'M-500 690 Q400 670 960 684 Q1600 700 2420 676 L2420 1500 L-500 1500 Z', fill:'#A6DB8C'}, 5), m);
  // green trees + hedges fill the gap between houses and fence
  [[-380,700,0.9],[180,690,0.8],[520,700,0.95],[880,690,0.85],[1250,700,0.9],[2350,700,1]].forEach(a => roundTree(m, a[0], a[1], a[2], ['#63B36B','#7CC77A']));
  [[-260, 720, 0.78, '#FFE1E8', '#7FB7C9', 3], [60, 712, 0.72, '#E3F2DF', '#C9746A', 5], [360, 718, 0.8, '#EEE6FF', '#6F8FBF', 7], [700, 708, 0.7, '#FFF1D6', '#8FB37A', 9]].forEach(a => pastelHouse(m, a[0], a[1], a[2], a[3], a[4], a[5]));
  L.trees = [];
  [[-120, 790, 0.95, 11], [560, 760, 0.8, 12], [1080, 770, 0.85, 13], [2200, 800, 1.0, 14]].forEach(a => L.trees.push(sakuraTree(m, a[0], a[1], a[2], a[3])));
  blobCluster(m, Array.from({length:22}, (_, i) => [-440 + i*80, 812 + (i%3)*4, 40 + (i*7)%12]), ['#79C27A','#6DB86F','#88CC84']);
  [[30, 640, 0.6, 15], [1240, 650, 0.55, 16]].forEach(a => L.trees.push(sakuraTree(m, a[0], a[1], a[2], a[3], true)));
  picketFence(m, -420, 1250, 852);
  [[-300, 860, 0.9, 21], [140, 862, 0.8, 22], [560, 866, 0.85, 23], [980, 862, 0.8, 24]].forEach(a => flowerBush(m, a[0], a[1], a[2], a[3]));
  L.cafe = cafe(m, 1680, 880, 0.92);
  // stone path
  lin('vlPath', [[0,'#F2E3CF'],[1,'#E6D0B6']]);
  mk('path', SK({d:'M-500 872 Q960 850 2420 880 L2420 1500 L-500 1500 Z', fill:'url(#vlPath)'}, 5), m);
  const sr = rngMaker(77);
  for (let row=0; row<5; row++){ const yy = 900 + row*44, h = 28 + row*6; for (let x=-480 + (row%2)*60; x<2400; x+=120 + row*14){ const w = 90 + row*12 + sr()*20;
    mk('rect', {x:x + sr()*10, y:yy + sr()*6, width:w, height:h, rx:h/2.2, fill: sr() < 0.5 ? '#EAD6BE' : '#E2CCB2', stroke:'#D2B998', 'stroke-width':3}, m); } }
  grassTufts(m, 30, 31, 858, 880);
  // fallen petals on the path
  for (let i=0;i<120;i++){ const x = -400 + sr()*2700, y = 880 + sr()*300; mk('path', {d:'M0 -6 Q5 -3 4 3 Q0 7 -4 3 Q-5 -3 0 -6 Z', fill:SAKURA[i % 4], opacity:0.85, transform:`translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(sr()*360).toFixed(0)}) scale(${(1 + sr()).toFixed(2)})`}, m); }
  [[-80, 905], [1300, 900], [2000, 920]].forEach((q, i) => flowerBush(m, q[0], q[1], 0.55, 60 + i, ['#FFFFFF','#FF9EBB','#C9B6F2','#FFE07A']));
  // warm sunlight shafts
  L.rays = G(g);
  for (let k=0;k<5;k++) mk('path', {d:`M${1500 + k*60} -100 L${900 + k*170} 1100 L${1020 + k*170} 1100 Z`, fill:'#FFF6D8', opacity:0.12}, L.rays);
  L.chars = G(parent);
  // FRONT: foreground blossom branch + flowers (frames the shot)
  L.front = G(parent);
  const br = G(L.front, 'translate(40 360) scale(1.05)');
  mk('path', SK({d:'M-100 40 Q140 60 320 150 Q380 180 430 170 L432 186 Q370 200 300 168 Q140 90 -100 60 Z', fill:'#7A4C3A'}, 5), br);
  blobCluster(br, [[90,90,48],[170,118,56],[250,150,46],[330,176,40],[30,70,42]], SAKURA);
  for (let i=0;i<14;i++) blossom(br, 20 + i*24, 70 + i*8 + (i%3)*10 - 20, 1.2, i % 2 ? '#FFFFFF' : '#FFE6EE');
  [[300, 1150, 1.25, 51], [1700, 1160, 1.3, 52]].forEach(a => flowerBush(L.front, a[0], a[1], a[2], a[3], ['#FF9EBB','#FFFFFF','#FFB0C8','#FFE07A']));
  L.fx = G(parent);
  L.petals = petalsFx(L.fx, 70, [-300, -80, 2400, 1120]);
  L.petalsBig = petalsFx(L.front, 9, [-300, -120, 2400, 1160], true);
  L.flies = butterflies(L.fx, 4, [200, 560, 1700, 820]);
  rad('vlWarm', [[0,'#FFE6B0',0.5],[1,'#FFE6B0',0]]);
  L.warmGlow = mk('ellipse', {cx:1600, cy:180, rx:1200, ry:800, fill:'url(#vlWarm)', opacity: gold ? 0.9 : 0.6, 'pointer-events':'none'}, parent);
  overlays(L, parent);
  if (gold) L.warm.setAttribute('opacity', 0.07);
  L.update = function(u, oo){
    oo = oo || {};
    const cx = oo.camX === undefined ? 960 : oo.camX;
    T(L.far, `translate(${((cx - 960)*0.45).toFixed(1)} 0)`);         // far hills lag behind the camera → depth
    T(L.front, `translate(${(-(cx - 960)*0.18).toFixed(1)} 0)`);      // foreground slides faster
    L.clouds.forEach((c, i) => T(c, `translate(${(mod(u*(6 + i*2.5) + i*640, 2800) - 420 + (cx - 960)*0.6).toFixed(1)} ${90 + i*55}) scale(${[0.9,0.65,0.75,0.55][i]})`));
    L.trees.forEach((t, i) => T(t.canopy, `rotate(${(0.8*Math.sin(TAU*(u*0.12 + i*0.3))).toFixed(2)} 0 -120)`));
    L.cafe.lanterns.forEach((l, i) => { T(l.body, `rotate(${(4*Math.sin(TAU*(u*0.35 + i*0.4))).toFixed(2)} 0 0)`); l.body.glow.setAttribute('opacity', (0.6 + 0.12*Math.sin(TAU*u*0.7 + i)).toFixed(3)); });
    T(L.cafe.noren, `translate(215 -258) skewX(${(2.5*Math.sin(TAU*u*0.4)).toFixed(2)})`);
    L.rays.setAttribute('opacity', (0.75 + 0.25*Math.sin(TAU*u*0.08)).toFixed(3));
    const pa = oo.petals === undefined ? 1 : oo.petals;
    L.petals(u, pa); L.petalsBig(u, pa); L.flies(u, oo.butterflies === undefined ? 1 : oo.butterflies);
    if (oo.dusk !== undefined) L.dusk.setAttribute('opacity', (0.35*oo.dusk).toFixed(3));
  };
  return L;
}
