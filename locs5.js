/* =====================================================================
   FUR FRIENDS — pack 5: BATTLE EDITION (Day 13+)
   Fantasy MMORPG world "Pawlandia Online".
   1. new species (the 16 friends from the class cards)
   2. class outfits + weapons        gear(actor, cls)
   3. monsters                        monster(layer, type, o)
   4. battle FX + floating text       slashFx, boltFx, healFx, shieldFx, burstFx, floatTxt
   5. MMORPG HUD                      hud(S) → plates, quest box, level-up, party-join card
   6. locations                       locRealm(parent, {biome, tod}), locHall(parent, {kind})
   7. choreography helpers            party(), attack()
   Loaded by episode_page.html after locs4.js (older episodes never touch it).
   ===================================================================== */

/* ------------------------------------------------------------------ */
/* 1. SPECIES                                                          */
/* ------------------------------------------------------------------ */
// fur colours, ears, face marks, nose and tail per new species
const SPX = {
  owl:     {P:{fur:'#A99AE0', inner:'#7E6FC0', arm:'#A99AE0', foot:'#F2B35A', belly:'#F4EEFF', energy:0.8}, shade:'#6E5FB0', ears:'tuft', disk:'#F4EEFF', nose:'beak', tail:'feather'},
  deer:    {P:{fur:'#D9A06A', inner:'#F7C9A4', arm:'#D9A06A', foot:'#9A6A44', belly:'#FFF1DE', energy:1.1}, shade:'#A8703E', ears:'leafy', muzzle:'#FFF1DE', spots:'#FFF6E8', antlers:'#A8744A', tail:'puff', tailCol:'#FFF6E8'},
  polar:   {P:{fur:'#FDFCFF', inner:'#E6DFF2', arm:'#FDFCFF', foot:'#FDFCFF', energy:0.85}, shade:'#C9C2DA', ears:'round', muzzle:'#F1EDF7', nose:'dark', tail:'puff', tailCol:'#FDFCFF'},
  tiger:   {P:{fur:'#F59A3E', inner:'#FFE1C4', arm:'#F59A3E', foot:'#FFF4E6', belly:'#FFF4E6', energy:1.35}, shade:'#C0621F', ears:'roundTip', muzzle:'#FFF4E6', stripes:'#5A3F35', tail:'striped', tailCol:'#F59A3E', tailStripe:'#5A3F35'},
  nyx:     {P:{fur:'#4E4760', inner:'#C9A7E0', arm:'#4E4760', foot:'#4E4760', energy:0.7}, shade:'#2B2638', ears:'pointy', mask:'#7C7494', whisk:true, lightLines:true, tail:'thin', tailCol:'#4E4760'},
  chick:   {P:{fur:'#FFFBF2', inner:'#FFD9A0', arm:'#FFFBF2', foot:'#F2A64A', energy:1.25}, shade:'#E3CDB0', ears:'crest', crest:'#FF8A6B', nose:'beak', tail:'feather'},
  fox:     {P:{fur:'#F08A3C', inner:'#FFE3CC', arm:'#F08A3C', foot:'#7A4A32', belly:'#FFF4E8', energy:1.15}, shade:'#B85A1F', ears:'pointyTip', tipCol:'#6E4433', muzzle:'#FFF4E8', whisk:true, tail:'bushy', tailCol:'#F08A3C', tailTip:'#FFF7EE'},
  niko:    {P:{fur:'#FFFFFF', inner:'#FFB7C6', arm:'#FFFFFF', foot:'#FFFFFF', energy:0.95}, shade:'#C7C0D6', ears:'pointy', earL:'#8E8A99', patch:'#8E8A99', whisk:true, tail:'thin', tailCol:'#FFFFFF', tailTip:'#8E8A99'},
  hamster: {P:{fur:'#F2B36B', inner:'#FFC9B0', arm:'#F2B36B', foot:'#FFE9D6', belly:'#FFF6EC', energy:1.2}, shade:'#C47F38', ears:'small', cheeks:'#FFF6EC', tail:'none'},
  fennec:  {P:{fur:'#E9CBA2', inner:'#F8DCCC', arm:'#E9CBA2', foot:'#C9A57E', belly:'#FFF7EE', energy:1.05}, shade:'#B8946A', ears:'huge', muzzle:'#FFF7EE', whisk:true, tail:'bushy', tailCol:'#E9CBA2', tailTip:'#6E4F3A'},
  mouse:   {P:{fur:'#F1EDF4', inner:'#FFC2CF', arm:'#F1EDF4', foot:'#FFC2CF', energy:0.9}, shade:'#C3BACB', ears:'big', whisk:true, tail:'string', tailCol:'#FFC2CF'},
  tanuki:  {P:{fur:'#9C7756', inner:'#5E4535', arm:'#5E4535', foot:'#5E4535', belly:'#F2DEC3', energy:1.0}, shade:'#6A4C33', ears:'round', earCol:'#5E4535', mask:'#5E4535', maskShape:'tanuki', muzzle:'#F2DEC3', nose:'dark', lightLines:true, tail:'striped', tailCol:'#9C7756', tailStripe:'#5E4535'},
  lop:     {P:{fur:'#FFFDF8', inner:'#FFCFD8', arm:'#FFFDF8', foot:'#FFFDF8', energy:1.05}, shade:'#E3D5C6', ears:'lop', tail:'puff', tailCol:'#FFFDF8'},
  shiba:   {P:{fur:'#F0A04B', inner:'#FFE2C2', arm:'#F0A04B', foot:'#FFF6EA', belly:'#FFF6EA', energy:1.3}, shade:'#BE6C23', ears:'pointy', earsUp:true, muzzle:'#FFF6EA', brows:'#FFF6EA', nose:'dark', tail:'curl', tailCol:'#F0A04B'},
  raccoon: {P:{fur:'#A6A2AD', inner:'#56515E', arm:'#6D6875', foot:'#56515E', belly:'#ECE9F0', energy:1.2}, shade:'#6D6875', ears:'pointy', earCol:'#A6A2AD', mask:'#4E4A57', maskShape:'band', muzzle:'#F4F1F6', nose:'dark', whisk:true, lightLines:true, tail:'striped', tailCol:'#A6A2AD', tailStripe:'#4E4A57'}
};
Object.keys(SPX).forEach(k => { PAL[k] = SPX[k].P; SHADE[k] = SPX[k].shade; APRON[k] = '#FFFFFF'; });
Object.assign(TAILPIV, {owl:[-30,-26], deer:[-44,-34], polar:[-44,-30], tiger:[-36,-30], nyx:[-36,-30], chick:[-34,-28], fox:[-34,-30], niko:[-36,-30],
  hamster:[-40,-30], fennec:[-34,-30], mouse:[-36,-24], tanuki:[-34,-30], lop:[-46,-30], shiba:[-36,-40], raccoon:[-34,-30]});

const _drawTail0 = drawTail, _drawHead0 = drawHead;
drawTail = function(kind, g, P){
  const X = SPX[kind]; if (!X) return _drawTail0(kind, g, P);
  const tc = X.tailCol || P.fur;
  if (X.tail === 'puff') mk('circle', SK({cx:-44, cy:-32, r:18, fill:tc}), g);
  else if (X.tail === 'feather'){ [[-150,-20],[-170,0],[-190,22]].forEach((q, i) => mk('ellipse', SK({cx:-40, cy:-30 - i*6, rx:30, ry:12, fill: i === 1 ? P.inner : P.fur, transform:`rotate(${q[0] + 180} -40 ${-30 - i*6})`}, 3.6), g)); }
  else if (X.tail === 'thin' || X.tail === 'striped'){
    const d = X.tail === 'thin' ? 'M-36 -30 C -92 -28 -120 -66 -106 -114 C -100 -136 -80 -140 -72 -126' : 'M-34 -30 C -96 -26 -128 -64 -116 -116 C -110 -138 -88 -142 -80 -126';
    mk('path', {d, fill:'none', stroke:OL, 'stroke-width': X.tail === 'thin' ? 30 : 38, 'stroke-linecap':'round'}, g);
    mk('path', {d, fill:'none', stroke:tc, 'stroke-width': X.tail === 'thin' ? 21 : 29, 'stroke-linecap':'round'}, g);
    if (X.tailStripe) mk('path', {d, fill:'none', stroke:X.tailStripe, 'stroke-width':29, 'stroke-dasharray':'11 17', 'stroke-dashoffset':'-8'}, g);
    if (X.tailTip) mk('path', {d:'M-86 -132 C -80 -138 -72 -134 -72 -126', fill:'none', stroke:X.tailTip, 'stroke-width':14, 'stroke-linecap':'round'}, g);
  }
  else if (X.tail === 'bushy'){
    mk('path', SK({d:'M-30 -36 C -90 -30 -160 -70 -150 -150 C -146 -186 -104 -196 -96 -168 C -88 -120 -70 -86 -28 -70 Z', fill:tc}), g);
    if (X.tailTip) mk('path', SK({d:'M-150 -150 C -146 -186 -104 -196 -96 -168 C -110 -164 -130 -160 -150 -150 Z', fill:X.tailTip}, 3.6), g);
    mk('path', {d:'M-60 -50 C -110 -60 -130 -100 -128 -140', fill:'none', stroke:'#FFFFFF', 'stroke-width':6, 'stroke-linecap':'round', opacity:0.3}, g);
  }
  else if (X.tail === 'curl'){
    mk('path', {d:'M-30 -50 C -80 -60 -100 -110 -66 -130 C -40 -144 -24 -110 -46 -96', fill:'none', stroke:OL, 'stroke-width':36, 'stroke-linecap':'round'}, g);
    mk('path', {d:'M-30 -50 C -80 -60 -100 -110 -66 -130 C -40 -144 -24 -110 -46 -96', fill:'none', stroke:tc, 'stroke-width':27, 'stroke-linecap':'round'}, g);
    mk('path', {d:'M-58 -120 C -44 -126 -36 -112 -46 -100', fill:'none', stroke:'#FFF6EA', 'stroke-width':12, 'stroke-linecap':'round'}, g);
  }
  else if (X.tail === 'string') mk('path', {d:'M-34 -24 C -90 -10 -120 -60 -150 -40 C -170 -28 -170 -8 -150 -4', fill:'none', stroke:tc, 'stroke-width':7, 'stroke-linecap':'round'}, g);
};

drawHead = function(kind, c, P, id){
  _drawHead0(kind, c, P, id);
  const X = SPX[kind]; if (!X) return;
  const h = c.head, L = c.earBL, Rr = c.earBR;
  const ins = h.querySelector('g[clip-path]'), shadeEl = ins.lastChild;
  const under = el => ins.insertBefore(el, shadeEl);
  const pair = fn => [[L, -1], [Rr, 1]].forEach(q => fn(q[0], q[1]));
  const ec = X.earCol || P.fur;
  switch (X.ears){
    case 'pointy': case 'pointyTip':
      pair((e, s) => { const col = s < 0 && X.earL ? X.earL : ec;
        mk('path', SK({d:`M${s*78} -20 L${s*70} ${X.earsUp ? -108 : -100} L${s*20} -64 Z`, fill:col}), e);
        mk('path', {d:`M${s*66} -38 L${s*62} -84 L${s*36} -63 Z`, fill:P.inner}, e);
        if (X.ears === 'pointyTip') mk('path', SK({d:`M${s*73} -78 L${s*70} -100 L${s*55} -89 Z`, fill:X.tipCol}, 3.2), e); });
      c.earPiv = [[-50,-46],[50,-46]]; break;
    case 'huge':
      pair((e, s) => { mk('path', SK({d:`M${s*74} -10 Q${s*130} -110 ${s*96} -150 Q${s*50} -110 ${s*24} -60 Z`, fill:ec}), e); mk('path', {d:`M${s*68} -30 Q${s*108} -104 ${s*92} -128 Q${s*58} -100 ${s*38} -62 Z`, fill:P.inner}, e); });
      c.earPiv = [[-50,-40],[50,-40]]; break;
    case 'round': case 'small': case 'roundTip': {
      const r = X.ears === 'small' ? 16 : 22, ex = X.ears === 'small' ? 58 : 60;
      pair((e, s) => { mk('circle', SK({cx:s*ex, cy:-50, r, fill:ec}), e); mk('circle', {cx:s*ex, cy:-48, r:r*0.5, fill:P.inner}, e);
        if (X.ears === 'roundTip') mk('circle', {cx:s*ex, cy:-48, r:r*0.3, fill:'#FFFFFF'}, e); });
      c.earPiv = [[-ex,-34],[ex,-34]]; break; }
    case 'big':
      pair((e, s) => { mk('circle', SK({cx:s*70, cy:-56, r:40, fill:ec}), e); mk('circle', {cx:s*70, cy:-54, r:25, fill:P.inner}, e); });
      c.earPiv = [[-56,-34],[56,-34]]; break;
    case 'leafy':
      pair((e, s) => { mk('path', SK({d:`M${s*66} -40 Q${s*126} -70 ${s*140} -46 Q${s*118} -22 ${s*70} -24 Z`, fill:ec}), e); mk('path', {d:`M${s*78} -38 Q${s*116} -56 ${s*126} -44 Q${s*110} -32 ${s*80} -32 Z`, fill:P.inner}, e); });
      c.earPiv = [[-66,-32],[66,-32]];
      if (X.antlers){ const ag = G(h); [-1, 1].forEach(s => { const d = `M${s*30} -64 Q${s*34} -100 ${s*24} -124 M${s*31} -96 Q${s*52} -104 ${s*58} -124 M${s*28} -112 Q${s*12} -120 ${s*10} -134`;
        mk('path', {d, fill:'none', stroke:OL, 'stroke-width':15, 'stroke-linecap':'round'}, ag); mk('path', {d, fill:'none', stroke:X.antlers, 'stroke-width':8, 'stroke-linecap':'round'}, ag); });
        h.insertBefore(ag, h.firstChild); }
      break;
    case 'lop':
      pair((e, s) => { mk('ellipse', SK({cx:s*84, cy:22, rx:28, ry:62, fill:ec, transform:`rotate(${-s*12} ${s*84} 22)`}), e); mk('ellipse', {cx:s*86, cy:28, rx:14, ry:44, fill:P.inner, transform:`rotate(${-s*12} ${s*86} 28)`}, e); });
      c.earPiv = [[-70,-30],[70,-30]];
      h.appendChild(L); h.appendChild(Rr);       // floppy ears hang in front of the cheeks
      break;
    case 'tuft':
      pair((e, s) => mk('path', SK({d:`M${s*40} -60 Q${s*70} -120 ${s*82} -104 Q${s*84} -70 ${s*66} -40 Z`, fill:P.fur}), e));
      c.earPiv = [[-56,-50],[56,-50]]; break;
    case 'crest':
      [[0, -86, 0], [-14, -80, -22], [14, -80, 22]].forEach(q => mk('ellipse', SK({cx:q[0], cy:q[1], rx:10, ry:22, fill:X.crest, transform:`rotate(${q[2]} ${q[0]} ${q[1] + 14})`}, 3.4), L));
      h.insertBefore(L, h.firstChild); c.earPiv = [[0,-66],[0,-66]]; break;
  }
  // face markings (inside the head clip, under the soft shading)
  if (X.disk) [-1, 1].forEach(s => under(mk('circle', {cx:s*32, cy:2, r:34, fill:X.disk})));
  if (X.muzzle) under(mk('ellipse', {cx:0, cy:34, rx:52, ry:34, fill:X.muzzle}));
  if (X.cheeks){ [-1, 1].forEach(s => under(mk('ellipse', {cx:s*44, cy:30, rx:36, ry:30, fill:X.cheeks}))); under(mk('ellipse', {cx:0, cy:46, rx:40, ry:24, fill:X.cheeks})); }
  if (X.patch) under(mk('ellipse', {cx:-58, cy:-44, rx:46, ry:36, fill:X.patch}));
  if (X.spots) [[-20,-56,7],[4,-62,6],[24,-52,7],[-6,-44,5]].forEach(q => under(mk('circle', {cx:q[0], cy:q[1], r:q[2], fill:X.spots})));
  if (X.stripes) under(mk('path', {d:'M-16 -72 Q-12 -58 -18 -48 M0 -74 Q2 -60 -2 -50 M16 -72 Q14 -58 18 -48 M-84 -6 L-62 -2 M-84 12 L-64 10 M84 -6 L62 -2 M84 12 L64 10', fill:'none', stroke:X.stripes, 'stroke-width':6, 'stroke-linecap':'round'}));
  if (X.mask){
    if (X.maskShape === 'band') under(mk('path', {d:'M-90 -10 Q-60 -26 -20 -10 Q0 0 20 -10 Q60 -26 90 -10 L90 22 Q60 30 30 18 Q0 8 -30 18 Q-60 30 -90 22 Z', fill:X.mask}));
    else if (X.maskShape === 'tanuki') [-1, 1].forEach(s => under(mk('ellipse', {cx:s*32, cy:8, rx:26, ry:20, fill:X.mask, transform:`rotate(${s*20} ${s*32} 8)`})));
    else [-1, 1].forEach(s => under(mk('ellipse', {cx:s*32, cy:2, rx:24, ry:22, fill:X.mask})));
  }
  if (X.brows) [-1, 1].forEach(s => under(mk('ellipse', {cx:s*30, cy:-24, rx:9, ry:6, fill:X.brows})));
  // nose
  const F = c.face, noseEl = Array.from(F.children).find(e => e.tagName === 'ellipse' && (e.getAttribute('fill') === '#F28CA1'));
  if (X.nose === 'beak' && noseEl){ noseEl.remove(); const b = mk('path', SK({d:'M-11 6 Q0 2 11 6 L0 22 Z', fill:'#F5A94A'}, 3.2)); F.insertBefore(b, F.firstChild.nextSibling); }
  else if (X.nose === 'dark' && noseEl){ noseEl.setAttribute('fill', '#4B3230'); noseEl.setAttribute('rx', 8); noseEl.setAttribute('ry', 5.5); }
  if (X.nose === 'beak'){ c.mouthSmile.style.visibility = 'hidden'; }
  if (X.whisk){ const wk = {fill:'none', stroke: X.lightLines ? '#E8E2F0' : OL, 'stroke-width':2.4, 'stroke-linecap':'round', opacity:0.75};
    [-1, 1].forEach(s => { mk('path', Object.assign({d:`M${s*62} 10 L${s*98} 4`}, wk), F); mk('path', Object.assign({d:`M${s*62} 18 L${s*100} 20`}, wk), F); }); }
  if (X.lightLines) c.eyes.forEach(e => [e.happy, e.sleep, e.sq].forEach(p => p.setAttribute('stroke', '#FFFFFF')));
};

/* ------------------------------------------------------------------ */
/* 2. CLASS OUTFITS + WEAPONS                                          */
/* ------------------------------------------------------------------ */
const CLS = {
  assassin:   {name:'Assassin',   col:'#7E5BC9', icon:'moon'},   tank:     {name:'Tank',     col:'#E5677D', icon:'shield'},
  healer:     {name:'Healer',     col:'#4FA6D9', icon:'cross'},  fighter:  {name:'Fighter',  col:'#E07A38', icon:'fist'},
  mage:       {name:'Mage',       col:'#5B5BD6', icon:'star'},   ranger:   {name:'Ranger',   col:'#4E9A54', icon:'bow'},
  paladin:    {name:'Paladin',    col:'#D9A62E', icon:'shield'}, berserker:{name:'Berserker',col:'#C8443A', icon:'axe'},
  necromancer:{name:'Necromancer',col:'#7A4FB0', icon:'skull'},  bard:     {name:'Bard',     col:'#E05A8A', icon:'note'},
  druid:      {name:'Druid',      col:'#3F9A5E', icon:'leaf'},   enchanter:{name:'Enchanter',col:'#8A5BD6', icon:'star'},
  alchemist:  {name:'Alchemist',  col:'#D99A2E', icon:'flask'},  summoner: {name:'Summoner', col:'#3FA6A6', icon:'paw'},
  scholar:    {name:'Scholar',    col:'#8A6A4E', icon:'book'},   engineer: {name:'Engineer', col:'#6E7A8A', icon:'gear'},
  artificer:  {name:'Artificer',  col:'#B0704A', icon:'hammer'}, elementalist:{name:'Elementalist', col:'#3F8AD9', icon:'orb'},
  rogue:      {name:'Rogue',      col:'#5E5348', icon:'dagger'}, monk:     {name:'Monk',     col:'#C98A3A', icon:'fist'}
};
// who is who: species, class, display name
const HERO = {
  momo:{kind:'cat', cls:'assassin', name:'Momo'}, pipi:{kind:'bunny', cls:'tank', name:'Pipi'}, otto:{kind:'otter', cls:'healer', name:'Otto'}, kuku:{kind:'squirrel', cls:'fighter', name:'Kuku'},
  owli:{kind:'owl', cls:'mage', name:'Owli'}, leaf:{kind:'deer', cls:'ranger', name:'Leaf'}, lumi:{kind:'polar', cls:'paladin', name:'Lumi'}, tora:{kind:'tiger', cls:'berserker', name:'Tora'},
  nyx:{kind:'nyx', cls:'necromancer', name:'Nyx'}, tutu:{kind:'chick', cls:'bard', name:'Tutu'}, mori:{kind:'fox', cls:'druid', name:'Mori'}, niko:{kind:'niko', cls:'enchanter', name:'Niko'},
  pom:{kind:'hamster', cls:'alchemist', name:'Pom'}, kiri:{kind:'fennec', cls:'summoner', name:'Kiri'}, rin:{kind:'mouse', cls:'scholar', name:'Rin'}, gear:{kind:'tanuki', cls:'engineer', name:'Gear'},
  mimi:{kind:'lop', cls:'artificer', name:'Mimi'}, eli:{kind:'shiba', cls:'elementalist', name:'Eli'}, snek:{kind:'raccoon', cls:'rogue', name:'Snek'}, zen:{kind:'panda', cls:'monk', name:'Zen'}
};
const SKILLS = {
  momo:['Shadow Strike','Smoke Escape'], pipi:['Carrot Shield','Guardian Hug'], otto:['Healing Splash','Soothing Stream'], kuku:['Squirrel Punch','Nut Barrage'],
  owli:['Starlight Bolt','Wisdom Aura'], leaf:['Forest Arrow','Wind Step'], lumi:['Divine Shield','Holy Light'], tora:['Rage Claw','Unstoppable'],
  nyx:['Soul Summon','Shadow Veil'], tutu:['Song of Courage','Peaceful Tune'], mori:['Nature’s Touch','Wild Shape'], niko:['Enchant Weapon','Mana Flow'],
  pom:['Potion Mix','Elixir Bomb'], kiri:['Spirit Call','Pack Formation'], rin:['Analyze','Strategic Insight'], gear:['Turret Deploy','Overcharge'],
  mimi:['Craft Gear','Rune Infuse'], eli:['Flame Burst','Gale Sweep'], snek:['Steal','Cloak & Dash'], zen:['Qi Strike','Inner Focus']
};
const TITLES = {
  momo:'The Silent Shadow', pipi:'The Gentle Guardian', otto:'The Caring Guide', kuku:'The Energetic Brawler', owli:'The Wise Dreamer', leaf:'The Free Explorer',
  lumi:'The Holy Protector', tora:'The Wild Force', nyx:'The Spirit Caller', tutu:'The Melody Weaver', mori:'The Nature Keeper', niko:'The Magic Enhancer',
  pom:'The Potion Crafter', kiri:'The Bonded Friend', rin:'The Knowledge Seeker', gear:'The Inventive Builder', mimi:'The Gear Artisan', eli:'The Elemental Channeler',
  snek:'The Clever Trickster', zen:'The Inner Balance'
};

// ---- weapons (all drawn in the hand's local space; hand at 0,0) ----
function wDagger(p, col){ const g = G(p, 'rotate(-30)'); mk('path', SK({d:'M-4 -6 L4 -6 L3 -52 L0 -62 L-3 -52 Z', fill:'#E9ECF5'}, 3.4), g); mk('path', {d:'M0 -10 L0 -54', stroke:'#FFFFFF', 'stroke-width':2}, g);
  mk('rect', SK({x:-14, y:-8, width:28, height:7, rx:3, fill:col || '#9B6BE0'}, 3), g); mk('rect', SK({x:-4, y:-2, width:8, height:16, rx:3, fill:'#4E4760'}, 3), g); return g; }
function wShield(p, col, emblem){ const g = G(p, 'translate(10 -4)');
  mk('path', SK({d:'M0 -54 L42 -42 L40 4 Q34 38 0 58 Q-34 38 -40 4 L-42 -42 Z', fill:col || '#F27A93'}, 5), g);
  mk('path', {d:'M0 -42 L32 -33 L30 2 Q25 28 0 44 Q-25 28 -30 2 L-32 -33 Z', fill:'#FFFFFF', opacity:0.25}, g);
  mk('path', SK({d:'M0 -54 L42 -42 L40 4 Q34 38 0 58 Q-34 38 -40 4 L-42 -42 Z', fill:'none', stroke:'#F2C95E'}, 4), g);
  if (emblem === 'carrot'){ mk('path', S4({d:'M-8 -14 L8 -14 L0 24 Z', fill:'#FF9A5A'}), g); mk('path', {d:'M0 -14 l-7 -12 M0 -14 l7 -12 M0 -14 v-14', stroke:'#5FA85B', 'stroke-width':4, 'stroke-linecap':'round'}, g); }
  else if (emblem === 'sun'){ mk('circle', S4({r:12, fill:'#FFE07A'}), g); for (let i=0;i<8;i++){ const a = i*TAU/8; mk('path', {d:`M${18*Math.cos(a)} ${18*Math.sin(a)} L${26*Math.cos(a)} ${26*Math.sin(a)}`, stroke:'#F2C95E', 'stroke-width':4, 'stroke-linecap':'round'}, g); } }
  else pawPrint(g, 0, 2, 1.4, '#FFFFFF');
  return g; }
function wStaff(p, orb, wood){ const g = G(p, 'rotate(8)'); mk('path', {d:'M0 40 L0 -120', stroke:OL, 'stroke-width':12, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 40 L0 -120', stroke:wood || '#B98552', 'stroke-width':6, 'stroke-linecap':'round'}, g);
  mk('path', SK({d:'M0 -118 Q-22 -126 -18 -148 M0 -118 Q22 -126 18 -148', fill:'none'}, 5), g);
  mk('ellipse', S4({cx:-14, cy:-112, rx:9, ry:5, fill:'#8ED081', transform:'rotate(-30 -14 -112)'}), g); mk('ellipse', S4({cx:14, cy:-108, rx:9, ry:5, fill:'#8ED081', transform:'rotate(30 14 -108)'}), g);
  g.orbGlow = mk('circle', {cx:0, cy:-140, r:44, fill:'url(#glowW)', opacity:0.8}, g);
  mk('circle', SK({cx:0, cy:-140, r:17, fill:orb || '#8FE0F0'}, 4), g); mk('circle', {cx:-6, cy:-146, r:5, fill:'#FFFFFF', opacity:0.8}, g); g.tip = [0, -140]; return g; }
function wStarStaff(p, col){ const g = G(p, 'rotate(6)'); mk('path', {d:'M0 40 L0 -110', stroke:OL, 'stroke-width':11, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 40 L0 -110', stroke:'#D9B26A', 'stroke-width':5, 'stroke-linecap':'round'}, g);
  g.orbGlow = mk('circle', {cx:0, cy:-128, r:44, fill:'url(#glowW)', opacity:0.8}, g);
  mk('path', SK({d:STAR_D, fill:col || '#FFE07A', transform:'translate(0 -128) scale(1.9)'}, 2.4), g); g.tip = [0, -128]; return g; }
function wGauntlet(p, col){ const g = G(p); mk('circle', SK({r:22, fill:col || '#9A6A44'}, 4.6), g); mk('path', {d:'M-14 -8 Q0 -14 14 -8 M-16 2 Q0 -4 16 2', fill:'none', stroke:'#6E4433', 'stroke-width':3}, g);
  mk('rect', SK({x:-14, y:12, width:28, height:14, rx:5, fill:'#D9A35A'}, 3.6), g); pawPrint(g, 0, -2, 0.55, '#F2C98E'); return g; }
function wBow(p){ const g = G(p, 'rotate(-6)'); mk('path', {d:'M-4 -70 Q34 0 -4 70', fill:'none', stroke:OL, 'stroke-width':12, 'stroke-linecap':'round'}, g); mk('path', {d:'M-4 -70 Q34 0 -4 70', fill:'none', stroke:'#B98552', 'stroke-width':6, 'stroke-linecap':'round'}, g);
  g.str = mk('path', {d:'M-4 -70 L-4 70', stroke:'#FFF6E0', 'stroke-width':2.4}, g); mk('ellipse', S4({cx:20, cy:-30, rx:7, ry:4, fill:'#8ED081'}), g); return g; }
function wBook(p, col){ const g = G(p, 'translate(10 -10)'); mk('rect', SK({x:-26, y:-32, width:52, height:62, rx:6, fill:col || '#5B5BD6'}, 4.4), g); mk('rect', {x:-20, y:-26, width:4, height:50, fill:'#F2C95E'}, g);
  mk('path', SK({d:STAR_D, fill:'#FFE07A', transform:'translate(4 -2) scale(1.05)'}, 2), g); return g; }
function wLute(p){ const g = G(p, 'rotate(-35)'); mk('ellipse', SK({cx:0, cy:10, rx:30, ry:36, fill:'#D9934E'}, 4.6), g); mk('circle', {cx:0, cy:6, r:9, fill:'#6E4433'}, g);
  mk('rect', SK({x:-6, y:-80, width:12, height:62, rx:4, fill:'#B97A44'}, 3.6), g); mk('rect', SK({x:-10, y:-96, width:20, height:20, rx:4, fill:'#8A5A3A'}, 3.4), g); mk('path', {d:'M-3 -78 V34 M3 -78 V34', stroke:'#FFF6E0', 'stroke-width':1.6}, g); return g; }
function wSword(p, glow){ const g = G(p, 'rotate(-10)'); if (glow) g.glow = mk('ellipse', {cx:0, cy:-64, rx:30, ry:70, fill:'url(#glowW)', opacity:0.9}, g);
  mk('path', SK({d:'M-7 -8 L7 -8 L6 -104 L0 -118 L-6 -104 Z', fill: glow ? '#EAF2FF' : '#E9ECF5'}, 3.8), g); mk('path', {d:'M0 -12 V-108', stroke:'#FFFFFF', 'stroke-width':2.4}, g);
  mk('rect', SK({x:-22, y:-12, width:44, height:9, rx:4, fill:'#F2C95E'}, 3.4), g); mk('rect', SK({x:-5, y:-4, width:10, height:20, rx:3, fill:'#7A4FB0'}, 3), g); return g; }
function wAxe(p){ const g = G(p, 'rotate(-14)'); mk('path', {d:'M0 30 L0 -100', stroke:OL, 'stroke-width':12, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 30 L0 -100', stroke:'#9A6A44', 'stroke-width':6, 'stroke-linecap':'round'}, g);
  mk('path', SK({d:'M0 -96 Q40 -110 46 -70 Q30 -78 0 -66 Z', fill:'#E9ECF5'}, 4), g); mk('path', SK({d:'M0 -96 Q-30 -106 -34 -78 Q-20 -82 0 -72 Z', fill:'#E9ECF5'}, 4), g); return g; }
function wSkullStaff(p){ const g = G(p, 'rotate(6)'); mk('path', {d:'M0 40 L0 -110', stroke:OL, 'stroke-width':11, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 40 L0 -110', stroke:'#5E4C6E', 'stroke-width':5, 'stroke-linecap':'round'}, g);
  g.orbGlow = mk('circle', {cx:0, cy:-128, r:40, fill:'url(#glowW)', opacity:0.5}, g);
  mk('path', SK({d:'M-18 -126 Q-18 -150 0 -150 Q18 -150 18 -126 Q18 -116 10 -114 L10 -106 L-10 -106 L-10 -114 Q-18 -116 -18 -126 Z', fill:'#FFF8EC'}, 3.6), g);
  mk('circle', {cx:-7, cy:-128, r:4.5, fill:'#B98AF0'}, g); mk('circle', {cx:7, cy:-128, r:4.5, fill:'#B98AF0'}, g); g.tip = [0, -130]; return g; }
function wFlask(p, col){ const g = G(p, 'translate(4 -16)'); mk('path', SK({d:'M-7 -26 L7 -26 L7 -12 L22 18 Q24 26 16 26 L-16 26 Q-24 26 -22 18 L-7 -12 Z', fill:'#EEF7FF'}, 4), g);
  mk('path', {d:'M-17 12 L17 12 L21 20 Q22 24 16 24 L-16 24 Q-22 24 -21 20 Z', fill:col || '#FF8AC8'}, g); mk('rect', SK({x:-9, y:-34, width:18, height:9, rx:3, fill:'#B98552'}, 3), g);
  mk('circle', {cx:-6, cy:16, r:3, fill:'#FFFFFF', opacity:0.8}, g); return g; }
function wWrench(p){ const g = G(p, 'rotate(-20)'); mk('path', {d:'M0 20 L0 -70', stroke:OL, 'stroke-width':14, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 20 L0 -70', stroke:'#AEB6C6', 'stroke-width':7, 'stroke-linecap':'round'}, g);
  mk('path', SK({d:'M-18 -66 Q-20 -96 0 -98 Q20 -96 18 -66 L8 -60 L8 -80 L-8 -80 L-8 -60 Z', fill:'#C6CEDC'}, 4), g); return g; }
function wHammer(p){ const g = G(p, 'rotate(-18)'); mk('path', {d:'M0 26 L0 -70', stroke:OL, 'stroke-width':11, 'stroke-linecap':'round'}, g); mk('path', {d:'M0 26 L0 -70', stroke:'#B98552', 'stroke-width':5, 'stroke-linecap':'round'}, g);
  mk('rect', SK({x:-30, y:-92, width:60, height:30, rx:7, fill:'#9AA3B5'}, 4.4), g); mk('rect', {x:-24, y:-86, width:48, height:6, rx:3, fill:'#FFFFFF', opacity:0.4}, g); return g; }
function wOrb(p, col){ const g = G(p, 'translate(10 -24)'); g.orbGlow = mk('circle', {r:46, fill:'url(#glowW)', opacity:0.9}, g); mk('circle', SK({r:20, fill:col || '#8FE0F0'}, 4), g); mk('circle', {cx:-7, cy:-7, r:6, fill:'#FFFFFF', opacity:0.75}, g); return g; }
function wBeads(p){ const g = G(p); for (let i=0;i<9;i++){ const a = i/9*TAU; mk('circle', S4({cx:16*Math.cos(a), cy:16*Math.sin(a) - 4, r:6, fill: i === 0 ? '#E05A5A' : '#8A5A3A'}), g); } return g; }
function wCoinBag(p){ const g = G(p, 'translate(6 8)'); mk('path', SK({d:'M-18 -6 Q-24 24 0 26 Q24 24 18 -6 Q10 -14 0 -12 Q-10 -14 -18 -6 Z', fill:'#C9A06A'}, 4), g); mk('path', {d:'M-10 -10 Q0 -2 10 -10', fill:'none', stroke:OL, 'stroke-width':3}, g); mk('circle', S4({cx:0, cy:8, r:7, fill:'#FFD24D'}), g); return g; }
function wLeafStaff(p){ return wStaff(p, '#A6E3A0', '#8A6A44'); }

// ---- outfits: drawn on top of the body / around the head ----
function hood(c, col, rim, ears){
  const back = G(null); c.bob.insertBefore(back, c.head);
  const hb = G(back); hb.setAttribute('transform', 'translate(0 -150)'); c.hoodBack = hb;
  mk('path', SK({d:'M-104 30 Q-118 -96 0 -104 Q118 -96 104 30 Q90 64 0 70 Q-90 64 -104 30 Z', fill:col}, 5), hb);
  if (ears) [-1, 1].forEach(s => mk('path', SK({d:`M${s*86} -46 L${s*84} -126 L${s*30} -92 Z`, fill:col}, 5), hb));
  const front = G(c.head);
  mk('path', SK({d:'M-92 -14 Q-80 -86 0 -88 Q80 -86 92 -14 Q70 -62 0 -64 Q-70 -62 -92 -14 Z', fill:col}, 4.6), front);
  if (rim) mk('path', {d:'M-86 -20 Q-70 -60 0 -62 Q70 -60 86 -20', fill:'none', stroke:rim, 'stroke-width':6, 'stroke-linecap':'round'}, front);
  return front;
}
function robe(c, col, trim, o){
  o = o || {};
  const g = G(c.body);
  mk('path', S4({d:'M-54 -104 Q0 -116 54 -104 L58 -12 Q0 6 -58 -12 Z', fill:col}), g);
  if (trim) mk('path', {d:'M-56 -16 Q0 0 56 -16', fill:'none', stroke:trim, 'stroke-width':7}, g);
  if (o.v) mk('path', S4({d:'M-22 -106 L0 -76 L22 -106', fill:o.v}), g);
  if (o.belt) mk('rect', S4({x:-54, y:-58, width:108, height:12, rx:4, fill:o.belt}), g);
  if (o.sash) mk('path', S4({d:'M-48 -98 L-36 -104 L50 -30 L40 -22 Z', fill:o.sash}), g);
  if (o.stars) [[-28,-80],[26,-40],[-18,-34],[30,-86]].forEach(q => mk('path', {d:STAR_D, fill:o.stars, transform:`translate(${q[0]} ${q[1]}) scale(0.55)`}, g));
  if (o.gem) mk('circle', S4({cx:0, cy:-96, r:8, fill:o.gem}), g);
  if (o.paw) pawPrint(g, 0, -60, 1.0, o.paw);
  return g;
}
function hatWizard(c, col, band){ const g = G(c.head); mk('path', SK({d:'M-96 -46 Q0 -30 96 -46 Q70 -66 40 -70 Q30 -150 -6 -190 Q4 -140 -40 -70 Q-70 -66 -96 -46 Z', fill:col}, 5), g);
  mk('path', {d:'M-44 -62 Q0 -52 44 -62', fill:'none', stroke:band || '#F2C95E', 'stroke-width':9}, g); mk('path', {d:STAR_D, fill:'#FFE07A', transform:'translate(10 -110) scale(0.8)'}, g); mk('path', {d:STAR_D, fill:'#FFE07A', transform:'translate(-22 -84) scale(0.55)'}, g); return g; }
function glasses(c){ const g = G(c.face); [-32, 32].forEach(x => mk('circle', {cx:x, cy:2, r:20, fill:'#FFFFFF', 'fill-opacity':0.15, stroke:'#6E4433', 'stroke-width':4}, g)); mk('path', {d:'M-12 0 Q0 -6 12 0', fill:'none', stroke:'#6E4433', 'stroke-width':4}, g); return g; }
function goggles(c){ const g = G(c.head); mk('path', {d:'M-86 -40 Q0 -70 86 -40', fill:'none', stroke:'#6E4433', 'stroke-width':10}, g); [-28, 28].forEach(x => { mk('circle', SK({cx:x, cy:-58, r:20, fill:'#C9A06A'}, 4.4), g); mk('circle', {cx:x, cy:-58, r:12, fill:'#9FD8F7'}, g); mk('circle', {cx:x - 4, cy:-62, r:4, fill:'#FFFFFF'}, g); }); return g; }
function headband(c, col){ const g = G(c.head); mk('path', {d:'M-86 -36 Q0 -62 86 -36', fill:'none', stroke:OL, 'stroke-width':16, 'stroke-linecap':'round'}, g); mk('path', {d:'M-86 -36 Q0 -62 86 -36', fill:'none', stroke:col, 'stroke-width':9, 'stroke-linecap':'round'}, g);
  mk('path', SK({d:'M82 -38 Q104 -30 112 -10 Q96 -18 86 -22 Z', fill:col}, 3.4), g); return g; }
function circlet(c, col, gem){ const g = G(c.head); mk('path', {d:'M-80 -44 Q0 -72 80 -44', fill:'none', stroke:OL, 'stroke-width':12}, g); mk('path', {d:'M-80 -44 Q0 -72 80 -44', fill:'none', stroke:col, 'stroke-width':6}, g);
  mk('path', S4({d:'M0 -78 L10 -62 L0 -50 L-10 -62 Z', fill:gem || '#9FD8F7'}), g); return g; }
function leafCrown(c){ const g = G(c.head); for (let i=-3;i<=3;i++){ const x = i*24, y = -60 - 6*Math.cos(i/3*1.2); mk('ellipse', S4({cx:x, cy:y, rx:10, ry:16, fill: i % 2 ? '#8ED081' : '#6DBA6E', transform:`rotate(${i*16} ${x} ${y})`}), g); } mk('circle', S4({cx:0, cy:-74, r:7, fill:'#FF9EBB'}), g); return g; }
function beret(c, col){ const g = G(c.head); mk('ellipse', SK({cx:14, cy:-66, rx:72, ry:26, fill:col, transform:'rotate(10 14 -66)'}, 4.6), g); mk('circle', S4({cx:30, cy:-90, r:7, fill:col}), g);
  mk('path', SK({d:'M58 -80 Q100 -130 120 -150 Q104 -110 70 -74 Z', fill:'#FFE07A'}, 3.4), g); return g; }
function capScholar(c){ const g = G(c.head); mk('path', SK({d:'M-60 -58 Q0 -76 60 -58 L56 -38 Q0 -52 -56 -38 Z', fill:'#5E4C3E'}, 4.4), g); mk('path', SK({d:'M-90 -76 L0 -102 L90 -76 L0 -54 Z', fill:'#5E4C3E'}, 4.4), g);
  mk('path', {d:'M60 -72 Q72 -50 70 -30', fill:'none', stroke:'#F2C95E', 'stroke-width':4}, g); mk('circle', {cx:70, cy:-28, r:5, fill:'#F2C95E'}, g); return g; }
function bandana(c, col){ const g = G(c.head); mk('path', SK({d:'M-90 -26 Q-84 -84 0 -88 Q84 -84 90 -26 Q60 -56 0 -58 Q-60 -56 -90 -26 Z', fill:col}, 4.6), g);
  mk('path', SK({d:'M-88 -30 Q-110 -20 -116 4 Q-100 -6 -90 -10 Z', fill:col}, 3.4), g); [[-30,-66],[10,-72],[44,-62]].forEach(q => mk('circle', {cx:q[0], cy:q[1], r:4, fill:'#FFFFFF', opacity:0.7}, g)); return g; }
function scarfWrap(c, col){ const s = G(c.body); mk('path', SK({d:'M-50 -112 Q0 -92 50 -112 L52 -96 Q0 -76 -52 -96 Z', fill:col}, 4), s); mk('path', SK({d:'M22 -98 L36 -54 L52 -58 L40 -100 Z', fill:col}, 4), s); return s; }
function cape(c, col, inner){ const g = G(null); c.bob.insertBefore(g, c.body); mk('path', SK({d:'M-46 -110 Q-90 -40 -78 -4 Q0 12 78 -4 Q90 -40 46 -110 Z', fill:col}, 5), g); if (inner) mk('path', {d:'M-40 -100 Q-74 -44 -66 -12 Q0 2 66 -12 Q74 -44 40 -100 Z', fill:inner, opacity:0.5}, g); return g; }
function armor(c, col, trim){ const g = G(c.body); mk('path', S4({d:'M-50 -104 Q0 -118 50 -104 L50 -50 Q0 -36 -50 -50 Z', fill:col}), g); mk('path', {d:'M-50 -104 Q0 -118 50 -104', fill:'none', stroke:trim, 'stroke-width':6}, g);
  mk('path', {d:'M0 -110 V-44', stroke:trim, 'stroke-width':4, opacity:0.7}, g); [-1, 1].forEach(s => mk('ellipse', S4({cx:s*48, cy:-100, rx:20, ry:15, fill:col}), g)); return g; }

// put the right outfit + weapon on an actor; returns weapon elements {R, L}
function gear(A, cls){
  const c = A.c, k = c.kind; const W = {};
  switch (cls){
    case 'assassin': hood(c, '#3E3654', '#9B6BE0', true); robe(c, '#3E3654', '#9B6BE0', {sash:'#9B6BE0', belt:'#6E4433'}); W.R = A.item('R', 'wpn', wDagger(G())); W.L = A.item('L', 'off', wDagger(G())); break;
    case 'tank': armor(c, '#F6F2FA', '#FF9DB5'); robe(c, '#FFB3C7', '#F2C95E', {belt:'#D9A35A'}).setAttribute('transform', 'translate(0 40) scale(1 0.6)'); circlet(c, '#F2C95E', '#FF9DB5'); W.L = A.item('L', 'off', wShield(G(), '#F27A93', 'carrot')); break;
    case 'healer': hood(c, '#FFFFFF', '#5FB4E6'); robe(c, '#FFFFFF', '#5FB4E6', {v:'#9FD8F7', belt:'#9A6A44', gem:'#5FB4E6'}); W.R = A.item('R', 'wpn', wStaff(G(), '#8FE0F0')); break;
    case 'fighter': scarfWrap(c, '#E5484D'); robe(c, '#6FA35A', null, {belt:'#7A4A32'}).setAttribute('transform', 'translate(0 22) scale(1 0.78)'); W.R = A.item('R', 'wpn', wGauntlet(G())); W.L = A.item('L', 'off', wGauntlet(G())); break;
    case 'mage': cape(c, '#5B4FB0', '#8F84E0'); robe(c, '#6A5CC6', '#F2C95E', {stars:'#FFE07A'}); hatWizard(c, '#5B4FB0'); glasses(c); W.R = A.item('R', 'wpn', wStarStaff(G())); W.L = A.item('L', 'off', wBook(G(), '#4E46A8')); break;
    case 'ranger': hood(c, '#4E9A54', '#8ED081'); robe(c, '#5FAF5F', '#3E7A44', {belt:'#7A4A32', sash:'#9A6A44'}); W.L = A.item('L', 'off', wBow(G())); break;
    case 'paladin': cape(c, '#F2F4FF', '#F2C95E'); armor(c, '#FFF6D8', '#E0B43E'); circlet(c, '#F2C95E', '#FFE07A'); W.R = A.item('R', 'wpn', wHammer(G())); W.L = A.item('L', 'off', wShield(G(), '#FFF2C4', 'sun')); break;
    case 'berserker': headband(c, '#D9443A'); robe(c, '#B5523A', null, {belt:'#6E4433', sash:'#6E4433'}).setAttribute('transform', 'translate(0 26) scale(1 0.74)'); W.R = A.item('R', 'wpn', wAxe(G())); break;
    case 'necromancer': cape(c, '#3B2F50', '#7A4FB0'); robe(c, '#4A3A64', '#B98AF0', {gem:'#B98AF0'}); W.R = A.item('R', 'wpn', wSkullStaff(G())); break;
    case 'bard': beret(c, '#E05A8A'); robe(c, '#FFF1D6', '#E05A8A', {v:'#E05A8A', belt:'#9A6A44'}); W.R = A.item('R', 'wpn', wLute(G())); break;
    case 'druid': leafCrown(c); robe(c, '#5FAF6A', '#3E7A44', {belt:'#8A6A44'}); W.R = A.item('R', 'wpn', wLeafStaff(G())); break;
    case 'enchanter': hatWizard(c, '#6A6CD6', '#B9D8FF'); robe(c, '#7A7CE0', '#B9D8FF', {gem:'#B9D8FF', stars:'#DCE8FF'}); W.R = A.item('R', 'wpn', wSword(G(), true)); break;
    case 'alchemist': goggles(c); robe(c, '#C98A4E', '#FFE9C4', {belt:'#6E4433'}); [['#FF8AC8', -26], ['#8FE0B0', 24]].forEach(q => { const f = wFlask(G(c.body), q[0]); f.setAttribute('transform', `translate(${q[1]} -40) scale(0.55)`); }); W.R = A.item('R', 'wpn', wFlask(G(), '#FFD24D')); break;
    case 'summoner': hood(c, '#5E7E8E', '#8FE0E0'); robe(c, '#6E8E9E', '#8FE0E0', {paw:'#BFF2F2'}); W.R = A.item('R', 'wpn', wOrb(G(), '#BFF2F2')); break;
    case 'scholar': capScholar(c); glasses(c); robe(c, '#8A6A4E', '#F2C95E', {v:'#FFFFFF'}); W.R = A.item('R', 'wpn', wBook(G(), '#8A5A3A')); break;
    case 'engineer': goggles(c); robe(c, '#6E86A6', '#F2C95E', {belt:'#6E4433'}).setAttribute('transform', 'translate(0 18) scale(1 0.82)'); W.R = A.item('R', 'wpn', wWrench(G())); break;
    case 'artificer': robe(c, '#C98A5E', '#FFE9C4', {belt:'#6E4433', v:'#FFF6E0'}); W.R = A.item('R', 'wpn', wHammer(G())); W.L = A.item('L', 'off', wOrb(G(), '#C9A7FF')); break;
    case 'elementalist': cape(c, '#3F8AD9', '#FF8A5A'); robe(c, '#FFF6EA', '#3F8AD9', {gem:'#FF8A5A'}); W.R = A.item('R', 'wpn', wOrb(G(), '#FF9A5A')); W.L = A.item('L', 'off', wOrb(G(), '#8FD0FF')); break;
    case 'rogue': bandana(c, '#4E4440'); robe(c, '#6E6158', null, {belt:'#3E3430', sash:'#3E3430'}).setAttribute('transform', 'translate(0 18) scale(1 0.82)'); W.R = A.item('R', 'wpn', wDagger(G(), '#C9A06A')); W.L = A.item('L', 'off', wCoinBag(G())); break;
    case 'monk': headband(c, '#E0A040'); robe(c, '#D98A3A', '#8A4A2A', {sash:'#8A4A2A'}); const bd = G(c.body); for (let i=0;i<9;i++){ const a = Math.PI*(0.15 + 0.7*i/8); mk('circle', S4({cx:56*Math.cos(a), cy:-104 + 26*Math.sin(a), r:6, fill:'#8A5A3A'}), bd); } break;
  }
  A.weapons = W; A.cls = cls;
  if (W.R) A.base.R = 'wpn'; if (W.L) A.base.L = 'off';
  return W;
}

/* ------------------------------------------------------------------ */
/* 3. MONSTERS                                                         */
/* ------------------------------------------------------------------ */
// m.set(u, {x, y, s, hit, alpha, face, flip}); hit 0..1 flashes + squashes
function monster(layer, type, o){
  o = o || {};
  const M = {type, g:G(layer)}; const g = G(M.g); M.body = g;
  const col = o.col;
  M.shadow = mk('ellipse', {cx:0, cy:-2, rx:60, ry:12, fill:'#5A3A30', opacity:0.16}, M.g); M.g.insertBefore(M.shadow, g);
  const face = (y, s, eyeCol) => { const f = G(g, `translate(0 ${y}) scale(${s || 1})`);
    M.eyes = [-1, 1].map(k => { const e = G(f, `translate(${k*20} 0)`); mk('ellipse', {rx:7, ry:9, fill:eyeCol || '#3A2A28'}, e); mk('circle', {cx:-2, cy:-3, r:2.6, fill:'#FFFFFF'}, e); return e; });
    M.dizzy = [-1, 1].map(k => mk('path', {d:`M${k*20 - 7} -6 L${k*20 + 7} 6 M${k*20 + 7} -6 L${k*20 - 7} 6`, stroke:'#3A2A28', 'stroke-width':4, 'stroke-linecap':'round'}, f));
    mk('ellipse', {cx:-34, cy:12, rx:9, ry:5, fill:'#FF9DB5', opacity:0.7}, f); mk('ellipse', {cx:34, cy:12, rx:9, ry:5, fill:'#FF9DB5', opacity:0.7}, f);
    M.mouth = mk('path', {d:'M-8 12 Q0 20 8 12', fill:'none', stroke:'#3A2A28', 'stroke-width':3.5, 'stroke-linecap':'round'}, f); return f; };
  if (type === 'slime'){
    const c0 = col || '#8FE08A';
    mk('path', SK({d:'M-62 0 Q-70 -60 -30 -84 Q0 -100 30 -84 Q70 -60 62 0 Q0 10 -62 0 Z', fill:c0}, 5), g);
    mk('ellipse', {cx:-24, cy:-64, rx:16, ry:10, fill:'#FFFFFF', opacity:0.55, transform:'rotate(-25 -24 -64)'}, g);
    mk('path', {d:'M-50 -8 Q0 2 50 -8', fill:'none', stroke:'#000', 'stroke-width':6, opacity:0.08}, g);
    face(-40); M.h = 90;
  } else if (type === 'mushroom'){
    mk('rect', SK({x:-30, y:-60, width:60, height:60, rx:20, fill:'#FFF3E0'}, 5), g);
    mk('path', SK({d:'M-74 -50 Q-70 -126 0 -128 Q70 -126 74 -50 Q0 -36 -74 -50 Z', fill:col || '#F0606E'}, 5), g);
    [[-40,-86,12],[10,-106,10],[42,-72,9]].forEach(q => mk('circle', {cx:q[0], cy:q[1], r:q[2], fill:'#FFFFFF'}, g));
    face(-28, 0.85); M.h = 130;
  } else if (type === 'bat'){
    M.wings = [-1, 1].map(k => mk('path', SK({d:`M${k*20} -60 Q${k*80} -110 ${k*110} -70 Q${k*90} -60 ${k*84} -40 Q${k*60} -54 ${k*20} -40 Z`, fill:col || '#7E6AA8'}, 4.4), g));
    mk('circle', SK({cx:0, cy:-54, r:36, fill:col || '#7E6AA8'}, 5), g); [-1, 1].forEach(k => mk('path', SK({d:`M${k*14} -84 L${k*26} -108 L${k*30} -80 Z`, fill:col || '#7E6AA8'}, 3.6), g));
    face(-54, 0.8); M.h = 100; M.fly = true;
  } else if (type === 'ghost'){
    mk('path', SK({d:'M-50 -10 Q-56 -110 0 -116 Q56 -110 50 -10 L40 4 L28 -8 L14 6 L0 -8 L-14 6 L-28 -8 L-40 4 Z', fill:col || '#EEE6FF', 'fill-opacity':0.92}, 4.6), g);
    face(-66, 0.85, '#6A4FA8'); M.h = 120; M.fly = true;
  } else if (type === 'golem'){
    mk('path', SK({d:'M-80 0 L-90 -90 Q-60 -150 0 -150 Q60 -150 90 -90 L80 0 Z', fill:col || '#B7B0A4'}, 5.5), g);
    [[-40,-110,'#A39C90'],[30,-60,'#A39C90'],[50,-120,'#C9C3B8']].forEach(q => mk('circle', {cx:q[0], cy:q[1], r:14, fill:q[2]}, g));
    mk('path', {d:'M-30 -130 L-10 -100 L-24 -80', fill:'none', stroke:'#8A8378', 'stroke-width':4}, g);
    mk('ellipse', {cx:0, cy:-60, rx:50, ry:28, fill:'#8ED081', opacity:0.5}, g);
    face(-90, 1.1, '#3A2A28'); M.h = 160;
  } else if (type === 'dummy'){
    mk('path', {d:'M0 0 V-140', stroke:OL, 'stroke-width':14}, g); mk('path', {d:'M0 0 V-140', stroke:'#B98552', 'stroke-width':8}, g);
    mk('path', {d:'M-60 -96 H60', stroke:OL, 'stroke-width':14, 'stroke-linecap':'round'}, g); mk('path', {d:'M-60 -96 H60', stroke:'#B98552', 'stroke-width':8, 'stroke-linecap':'round'}, g);
    mk('ellipse', SK({cx:0, cy:-90, rx:40, ry:50, fill:'#F2DDB0'}, 5), g); mk('circle', SK({cx:0, cy:-160, r:34, fill:'#F2DDB0'}, 5), g);
    mk('circle', {cx:0, cy:-86, r:22, fill:'none', stroke:'#E5677D', 'stroke-width':6}, g); mk('circle', {cx:0, cy:-86, r:8, fill:'#E5677D'}, g);
    face(-160, 0.7); M.h = 200;
  } else if (type === 'dragon'){
    M.wings = [-1, 1].map(k => mk('path', SK({d:`M${k*60} -200 Q${k*220} -360 ${k*330} -250 Q${k*280} -220 ${k*290} -170 Q${k*230} -190 ${k*210} -140 Q${k*160} -170 ${k*80} -150 Z`, fill:col ? col : '#8FC9A8'}, 6), g));
    mk('path', SK({d:'M-150 0 Q-190 -120 -110 -200 Q0 -280 110 -200 Q190 -120 150 0 Q0 18 -150 0 Z', fill:col || '#9FD9B8'}, 6), g);
    mk('ellipse', {cx:0, cy:-70, rx:90, ry:60, fill:'#FFF2D0'}, g);
    for (let i=0;i<4;i++) mk('path', {d:`M-70 ${-110 + i*24} Q0 ${-96 + i*24} 70 ${-110 + i*24}`, fill:'none', stroke:'#E8D6A8', 'stroke-width':4}, g);
    const hd = G(g, 'translate(0 -250)'); M.head = hd;
    [-1, 1].forEach(k => mk('path', SK({d:`M${k*50} -70 Q${k*80} -130 ${k*96} -140 Q${k*86} -100 ${k*76} -60 Z`, fill:'#FFE7A8'}, 5), hd));
    mk('ellipse', SK({cx:0, cy:0, rx:120, ry:96, fill:col || '#9FD9B8'}, 6), hd);
    mk('ellipse', {cx:0, cy:40, rx:70, ry:40, fill:'#C6EBD4'}, hd); [-1, 1].forEach(k => mk('ellipse', {cx:k*16, cy:36, rx:5, ry:4, fill:'#4E7A60'}, hd));
    const f = G(hd, 'translate(0 -10) scale(2)');
    M.eyes = [-1, 1].map(k => { const e = G(f, `translate(${k*22} 0)`); mk('ellipse', {rx:8, ry:10, fill:'#3A2A28'}, e); mk('circle', {cx:-2, cy:-3, r:3, fill:'#FFFFFF'}, e); return e; });
    M.dizzy = [-1, 1].map(k => mk('path', {d:`M${k*22 - 7} -6 L${k*22 + 7} 6 M${k*22 + 7} -6 L${k*22 - 7} 6`, stroke:'#3A2A28', 'stroke-width':4, 'stroke-linecap':'round'}, f));
    [-1, 1].forEach(k => mk('ellipse', {cx:k*40, cy:14, rx:10, ry:6, fill:'#FF9DB5', opacity:0.7}, f));
    M.mouth = mk('path', {d:'M-12 18 Q0 28 12 18', fill:'none', stroke:'#3A2A28', 'stroke-width':3.5, 'stroke-linecap':'round'}, f);
    M.h = 380; M.shadow.setAttribute('rx', 200); M.shadow.setAttribute('ry', 30);
  }
  M.flash = G(g); // hit flash overlay = white copy via opacity on the group filter-free approach
  M.set = function(u, s){
    s = s || {};
    const hit = s.hit || 0, x = s.x || 0, y = s.y || 0, sc = s.s || 1;
    const bobY = M.fly ? 14*Math.sin(TAU*(u*0.8 + (o.ph || 0))) + 40 : 0;
    const sq = (type === 'slime' ? 0.06*Math.sin(TAU*(u*1.6 + (o.ph || 0))) : 0.015*Math.sin(TAU*u*0.9)) + 0.2*hit;
    show(M.g, (s.alpha === undefined ? 1 : s.alpha) > 0.01);
    M.g.setAttribute('opacity', (s.alpha === undefined ? 1 : s.alpha).toFixed(3));
    T(M.g, `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(sc*(s.flip || 1)).toFixed(3)} ${sc.toFixed(3)})`);
    T(g, `translate(${(18*hit*Math.sin(u*60)).toFixed(1)} ${(-bobY - (s.hop || 0)).toFixed(1)}) rotate(${(s.rot || 0).toFixed(1)} 0 -40) scale(${(1 + sq).toFixed(3)} ${(1 - sq).toFixed(3)})`);
    if (M.fly) T(M.shadow, `scale(${(0.7 - bobY/400).toFixed(3)})`);
    if (M.wings) M.wings.forEach((w, i) => T(w, `rotate(${((i ? 1 : -1)*14*Math.sin(TAU*u*(type === 'dragon' ? 0.7 : 3))).toFixed(1)} ${(i ? 1 : -1)*20} -60)`));
    const dz = s.face === 'dizzy';
    if (M.eyes) M.eyes.forEach(e => show(e, !dz)); if (M.dizzy) M.dizzy.forEach(e => show(e, dz));
    if (M.mouth) M.mouth.setAttribute('d', s.face === 'happy' || s.face === 'dizzy' ? 'M-10 10 Q0 24 10 10' : (s.face === 'mad' ? 'M-8 16 Q0 8 8 16' : 'M-8 12 Q0 20 8 12'));
    g.style.filter = hit > 0.05 ? `brightness(${(1 + 1.4*hit).toFixed(2)})` : '';
    M.last = {x, y: y - bobY, s: sc};
  };
  M.top = () => [M.last.x, M.last.y - M.h*M.last.s];
  M.mid = () => [M.last.x, M.last.y - M.h*0.5*M.last.s];
  return M;
}

/* ------------------------------------------------------------------ */
/* 4. BATTLE FX                                                        */
/* ------------------------------------------------------------------ */
// every fx returns fn(u) driven by a list of events: {t, ...}
function slashFx(layer, list){
  const els = list.map(e => { const g = G(layer); const col = e.col || '#C9A7FF';
    g.a = mk('path', {d:'M-90 30 Q0 -60 90 -30', fill:'none', stroke:col, 'stroke-width':26, 'stroke-linecap':'round', opacity:0.55}, g);
    g.b = mk('path', {d:'M-90 30 Q0 -60 90 -30', fill:'none', stroke:'#FFFFFF', 'stroke-width':9, 'stroke-linecap':'round'}, g);
    g.style.display = 'none'; return g; });
  return u => list.forEach((e, i) => { const v = (u - e.t)/0.42, g = els[i]; show(g, v > 0 && v < 1); if (!(v > 0 && v < 1)) return;
    const p = typeof e.at === 'function' ? e.at() : e.at; const L = 260*sm(Math.min(1, v*2.2));
    [g.a, g.b].forEach(p2 => { p2.setAttribute('stroke-dasharray', `${L.toFixed(0)} 400`); });
    g.setAttribute('opacity', (1 - sm((v - 0.4)/0.6)).toFixed(3)); T(g, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${e.rot || 0}) scale(${e.s || 1})`); });
}
function boltFx(layer, list){   // projectile from e.from() to e.to() over e.d seconds, burst on impact
  const els = list.map(e => { const g = G(layer); const col = e.col || '#FFE07A';
    g.glow = mk('circle', {r:60, fill:'url(#glowW)'}, g); g.core = mk(e.shape === 'arrow' ? 'path' : 'path', e.shape === 'arrow' ? SK({d:'M-40 0 L30 0 M18 -10 L34 0 L18 10 M-40 0 L-52 -8 M-40 0 L-52 8', fill:'none', stroke:'#8A5A3A'}, 5) : {d:STAR_D, fill:col, stroke:OL, 'stroke-width':2.4, transform:'scale(2)'}, g);
    g.trail = [0,1,2,3].map(k => mk('circle', {r:14 - k*3, fill:col, opacity:0.5 - k*0.1}, layer)); g.style.display = 'none'; return g; });
  return u => list.forEach((e, i) => { const g = els[i], d = e.d || 0.6, v = (u - e.t)/d; const on = v > 0 && v < 1; show(g, on); g.trail.forEach(tr => show(tr, on && e.shape !== 'arrow'));
    if (!on) return; const a = e.from(), b = e.to(); const p = arcP(a, b, v, e.arc === undefined ? 60 : e.arc);
    const q = arcP(a, b, Math.min(1, v + 0.02), e.arc === undefined ? 60 : e.arc); const ang = Math.atan2(q[1] - p[1], q[0] - p[0])*180/Math.PI;
    T(g, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${e.shape === 'arrow' ? ang.toFixed(1) : (u*400).toFixed(0)})`);
    g.trail.forEach((tr, k) => { const pp = arcP(a, b, Math.max(0, v - 0.05*(k + 1)), e.arc === undefined ? 60 : e.arc); tr.setAttribute('cx', pp[0].toFixed(1)); tr.setAttribute('cy', pp[1].toFixed(1)); }); });
}
function burstFx(layer, list){   // star burst + ring at e.at, colour e.col, size e.s
  const els = list.map(e => { const g = G(layer); const col = e.col || '#FFE07A';
    g.ring = mk('circle', {r:10, fill:'none', stroke:col, 'stroke-width':10}, g); g.glow = mk('circle', {r:80, fill:'url(#glowW)'}, g);
    g.st = Array.from({length:8}, (_, k) => mk('path', {d:STAR_D, fill: k % 2 ? '#FFFFFF' : col, stroke:OL, 'stroke-width':1.6}, g)); g.style.display = 'none'; return g; });
  return u => list.forEach((e, i) => { const g = els[i], v = (u - e.t)/0.8; show(g, v > 0 && v < 1); if (!(v > 0 && v < 1)) return;
    const p = typeof e.at === 'function' ? e.at() : e.at, s = e.s || 1;
    T(g, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${s})`);
    g.ring.setAttribute('r', (20 + 110*sm(v)).toFixed(1)); g.ring.setAttribute('opacity', (1 - v).toFixed(3)); g.ring.setAttribute('stroke-width', (14*(1 - v) + 2).toFixed(1));
    g.glow.setAttribute('opacity', (1 - sm(v)).toFixed(3));
    g.st.forEach((st, k) => { const a = k/8*TAU + 0.3, d = 40 + 120*sm(v); T(st, `translate(${(d*Math.cos(a)).toFixed(1)} ${(d*Math.sin(a) + 40*v*v).toFixed(1)}) rotate(${(v*200).toFixed(0)}) scale(${(1.4*(1 - v) + 0.2).toFixed(2)})`); }); });
}
function healFx(layer, list){   // rising plus signs + glow around e.at for e.d seconds
  const els = list.map(e => { const g = G(layer); g.glow = mk('ellipse', {rx:120, ry:60, fill:'url(#glowW)'}, g);
    g.ps = Array.from({length:7}, (_, k) => { const p = G(g); mk('path', SK({d:'M-5 -14 H5 V-5 H14 V5 H5 V14 H-5 V5 H-14 V-5 H-5 Z', fill: e.col || '#8FE0A8'}, 2.6), p); p.ph = k/7; p.x = (k - 3)*30; return p; }); g.style.display = 'none'; return g; });
  return u => list.forEach((e, i) => { const g = els[i], d = e.d || 2, v = (u - e.t)/d; const on = v > 0 && v < 1; show(g, on); if (!on) return;
    const p = typeof e.at === 'function' ? e.at() : e.at, a = rh(u, e.t, e.t + 0.3, e.t + d - 0.4, e.t + d);
    T(g, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`); g.glow.setAttribute('opacity', (0.8*a).toFixed(3));
    g.ps.forEach(q => { const w = mod((u - e.t)*0.7 + q.ph, 1); T(q, `translate(${(q.x + 10*Math.sin(TAU*(w + q.ph))).toFixed(1)} ${(-30 - 150*w).toFixed(1)}) scale(${(0.6 + 0.4*Math.sin(Math.PI*w)).toFixed(2)})`); q.setAttribute('opacity', (a*Math.sin(Math.PI*w)).toFixed(3)); }); });
}
function shieldFx(layer, list){   // glowing dome in front of e.at
  const els = list.map(e => { const g = G(layer); const col = e.col || '#FFD27A';
    g.d = mk('path', {d:'M-130 0 Q-130 -190 0 -200 Q130 -190 130 0 Z', fill:col, 'fill-opacity':0.22, stroke:col, 'stroke-width':8}, g);
    g.h = mk('path', {d:'M-90 -60 Q-80 -150 -10 -168', fill:'none', stroke:'#FFFFFF', 'stroke-width':8, 'stroke-linecap':'round', opacity:0.7}, g);
    g.hex = Array.from({length:6}, (_, k) => mk('path', {d:'M0 -14 L12 -7 L12 7 L0 14 L-12 7 L-12 -7 Z', fill:'none', stroke:'#FFFFFF', 'stroke-width':3, opacity:0.6, transform:`translate(${-60 + k*24} ${-80 - (k % 2)*22})`}, g)); g.style.display = 'none'; return g; });
  return u => list.forEach((e, i) => { const g = els[i], d = e.d || 1.6, a = rh(u, e.t, e.t + 0.25, e.t + d - 0.3, e.t + d); show(g, a > 0.01); if (a <= 0.01) return;
    const p = typeof e.at === 'function' ? e.at() : e.at; const pop = 0.85 + 0.15*sm((u - e.t)/0.3) + 0.06*bump(u, e.hit || -9, 0.3);
    T(g, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${(pop*(e.s || 1)).toFixed(3)})`); g.setAttribute('opacity', a.toFixed(3)); });
}
function auraFx(layer, list){   // swirling ring of sparkles (buffs, level up, summon)
  const els = list.map(e => { const g = G(layer); const col = e.col || '#FFE07A';
    g.r = mk('ellipse', {rx:110, ry:30, fill:'none', stroke:col, 'stroke-width':6, opacity:0.8}, g); g.glow = mk('ellipse', {cx:0, cy:-90, rx:110, ry:140, fill:'url(#glowW)'}, g);
    g.st = Array.from({length:10}, (_, k) => mk('path', {d:STAR_D, fill: k % 2 ? '#FFFFFF' : col, stroke:OL, 'stroke-width':1.4}, g)); g.style.display = 'none'; return g; });
  return u => list.forEach((e, i) => { const g = els[i], d = e.d || 2, a = rh(u, e.t, e.t + 0.3, e.t + d - 0.4, e.t + d); show(g, a > 0.01); if (a <= 0.01) return;
    const p = typeof e.at === 'function' ? e.at() : e.at; T(g, `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${e.s || 1})`); g.setAttribute('opacity', a.toFixed(3));
    g.st.forEach((st, k) => { const ang = TAU*(u*0.6 + k/10), h = mod(u*0.5 + k*0.13, 1); T(st, `translate(${(110*Math.cos(ang)).toFixed(1)} ${(30*Math.sin(ang) - 200*h).toFixed(1)}) scale(${(0.9*Math.sin(Math.PI*h) + 0.1).toFixed(2)})`); }); });
}
function floatTxt(layer, list){   // {t, at, text, col, size, d}
  const els = list.map(e => { const t = txt(layer, 0, 0, e.text, e.size || 46, e.col || '#FFE07A'); t.setAttribute('stroke', OL); t.setAttribute('stroke-width', 9); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); t.style.display = 'none'; return t; });
  return u => list.forEach((e, i) => { const el = els[i], d = e.d || 1.4, v = (u - e.t)/d; show(el, v > 0 && v < 1); if (!(v > 0 && v < 1)) return;
    const p = typeof e.at === 'function' ? e.at() : e.at; const pop = 0.6 + 0.4*sm(v*5) + 0.25*bump(u, e.t, 0.3);
    el.setAttribute('transform', `translate(${p[0].toFixed(1)} ${(p[1] - 80*sm(v)).toFixed(1)}) scale(${pop.toFixed(3)})`); el.setAttribute('opacity', (1 - sm((v - 0.7)/0.3)).toFixed(3)); });
}
function portalFx(layer, x, y, s, col){   // swirling magic portal; returns fn(u, amt)
  const g = G(layer, `translate(${x} ${y}) scale(${s || 1})`); const c0 = col || '#B98AF0';
  g.glow = mk('ellipse', {rx:220, ry:260, fill:'url(#glowW)'}, g);
  mk('ellipse', SK({rx:120, ry:170, fill:'#3B2F70'}, 6), g);
  const sw = Array.from({length:5}, (_, k) => mk('ellipse', {rx:110 - k*18, ry:156 - k*26, fill:'none', stroke: k % 2 ? '#FFFFFF' : c0, 'stroke-width':8 - k, 'stroke-dasharray':'60 40', opacity:0.8}, g));
  const st = Array.from({length:8}, (_, k) => mk('path', {d:STAR_D, fill:'#FFF2A8'}, g));
  return (u, amt) => { show(g, amt > 0.01); if (amt <= 0.01) return; g.setAttribute('opacity', Math.min(1, amt).toFixed(3));
    T(g, `translate(${x} ${y}) scale(${((s || 1)*(0.2 + 0.8*sm(amt))).toFixed(3)})`);
    sw.forEach((e, k) => T(e, `rotate(${(u*(60 + k*30)*(k % 2 ? -1 : 1)).toFixed(1)})`));
    st.forEach((e, k) => { const a = TAU*(u*0.4 + k/8), r = 150 + 30*Math.sin(TAU*(u + k/8)); T(e, `translate(${(r*Math.cos(a)).toFixed(1)} ${(r*1.3*Math.sin(a)).toFixed(1)}) scale(${(0.8 + 0.5*Math.sin(TAU*(u*1.3 + k/8))).toFixed(2)})`); }); };
}

/* ------------------------------------------------------------------ */
/* 5. MMORPG HUD (screen space, inside the scene so it hides with it)  */
/* ------------------------------------------------------------------ */
const HUD_FONT = FONT;
function clsIcon(parent, cls, s){
  const g = G(parent, `scale(${s || 1})`); const C = CLS[cls] || {col:'#B79BE8', icon:'star'};
  mk('circle', SK({r:16, fill:C.col}, 3.4), g);
  const w = {fill:'none', stroke:'#FFFFFF', 'stroke-width':3.4, 'stroke-linecap':'round', 'stroke-linejoin':'round'};
  switch (C.icon){
    case 'moon': mk('path', {d:'M3 -9 A9 9 0 1 0 9 4 A7 7 0 1 1 3 -9 Z', fill:'#FFFFFF'}, g); break;
    case 'shield': mk('path', Object.assign({d:'M0 -9 L8 -6 L7 3 Q5 8 0 10 Q-5 8 -7 3 L-8 -6 Z'}, w), g); break;
    case 'cross': mk('path', {d:'M-3 -9 H3 V-3 H9 V3 H3 V9 H-3 V3 H-9 V-3 H-3 Z', fill:'#FFFFFF'}, g); break;
    case 'fist': mk('rect', Object.assign({x:-7, y:-6, width:14, height:12, rx:4}, w), g); break;
    case 'star': mk('path', {d:STAR_D, fill:'#FFFFFF', transform:'scale(0.7)'}, g); break;
    case 'bow': mk('path', Object.assign({d:'M-3 -10 Q8 0 -3 10 M-3 -10 V10'}, w), g); break;
    case 'axe': mk('path', Object.assign({d:'M-4 10 L4 -10 M2 -8 Q10 -6 8 2'}, w), g); break;
    case 'skull': mk('circle', {r:7, fill:'#FFFFFF'}, g); mk('circle', {cx:-3, cy:-1, r:2, fill:C.col}, g); mk('circle', {cx:3, cy:-1, r:2, fill:C.col}, g); break;
    case 'note': mk('path', {d:NOTE_D, fill:'#FFFFFF', transform:'translate(-2 8) scale(0.55)'}, g); break;
    case 'leaf': mk('path', {d:'M-7 7 Q-7 -7 7 -7 Q7 7 -7 7 Z', fill:'#FFFFFF'}, g); break;
    case 'flask': mk('path', {d:'M-3 -9 H3 V-3 L8 7 H-8 L-3 -3 Z', fill:'#FFFFFF'}, g); break;
    case 'paw': pawPrint(g, 0, 2, 0.6, '#FFFFFF'); break;
    case 'book': mk('rect', {x:-7, y:-8, width:14, height:16, rx:2, fill:'#FFFFFF'}, g); break;
    case 'gear': mk('circle', Object.assign({r:6}, w), g); for (let i=0;i<6;i++){ const a = i*TAU/6; mk('path', Object.assign({d:`M${7*Math.cos(a)} ${7*Math.sin(a)} L${10*Math.cos(a)} ${10*Math.sin(a)}`}, w), g); } break;
    case 'hammer': mk('path', Object.assign({d:'M-4 10 L2 -2 M-4 -8 L8 -2'}, w), g); break;
    case 'orb': mk('circle', {r:7, fill:'#FFFFFF'}, g); break;
    case 'dagger': mk('path', Object.assign({d:'M-6 8 L6 -8 M-6 0 L0 6'}, w), g); break;
  }
  return g;
}
function hud(S){
  const H = {g: G(S.g)}; S.hud = H;
  // nameplates follow characters (world→screen through the scene camera)
  H.plates = [];
  H.plate = function(A, o){
    o = o || {}; const name = o.name || (A.hero && HERO[A.hero].name) || ''; const cls = o.cls || A.cls;
    const g = G(H.g); const w = Math.max(130, 15*name.length + (o.lv ? 100 : 70));
    mk('rect', {x:-w/2, y:-26, width:w, height:34, rx:17, fill:'#2E2440', opacity:0.72}, g);
    clsIcon(G(g, `translate(${-w/2 + 18} -9)`), cls, 0.82);
    const t = txt(g, -w/2 + 40, 0, name, 24, '#FFFFFF', 'start'); t.setAttribute('font-weight', 700);
    if (o.lv) { const lv = txt(g, w/2 - 14, -1, 'Lv' + o.lv, 17, '#FFE07A', 'end'); g.lv = lv; }
    const bar = G(g, 'translate(0 16)'); mk('rect', {x:-w/2 + 10, y:0, width:w - 20, height:9, rx:4.5, fill:'#2E2440', opacity:0.8}, bar);
    g.hp = mk('rect', {x:-w/2 + 11, y:1, width:w - 22, height:7, rx:3.5, fill:o.mp ? '#6FB6F0' : '#7DDB7A'}, bar); g.w = w - 22;
    g.style.display = 'none'; H.plates.push({g, A, o}); return g;
  };
  H.monPlate = function(M, name, lv){ const g = G(H.g); const w = 150;
    mk('rect', {x:-w/2, y:-24, width:w, height:30, rx:15, fill:'#5A2A30', opacity:0.72}, g); const t = txt(g, 0, -2, name, 21, '#FFFFFF'); t.setAttribute('font-weight', 700);
    const bar = G(g, 'translate(0 14)'); mk('rect', {x:-w/2 + 10, y:0, width:w - 20, height:9, rx:4.5, fill:'#2E2440', opacity:0.8}, bar);
    g.hp = mk('rect', {x:-w/2 + 11, y:1, width:w - 22, height:7, rx:3.5, fill:'#F07A6E'}, bar); g.w = w - 22; g.style.display = 'none'; H.plates.push({g, M, o:{lv}}); return g; };
  H.toScreen = function(p){ const m = S.cam.getCTM(), r = S.g.getCTM(); const pt = $('stage').createSVGPoint(); pt.x = p[0]; pt.y = p[1]; const q = pt.matrixTransform(r.inverse().multiply(m)); return [q.x, q.y]; };
  H.update = function(u, o){
    o = o || {};
    const vis = H.plates.map(pl => pl.o.show ? pl.o.show(u) : (o.plates === undefined ? true : o.plates));
    const crowd = H.plates.filter((pl, i) => vis[i] && pl.A).length > 5 ? 0.78 : 1;
    H.plates.forEach((pl, i) => { const on = vis[i]; show(pl.g, on); if (!on) return;
      const top = pl.A ? headW(pl.A.c, 0, -(pl.o.dy || 128)) : (pl.M.last ? [pl.M.top()[0], pl.M.top()[1] - 30] : [0, 0]);
      const q = H.toScreen(top); T(pl.g, `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) scale(${pl.A ? crowd : 1})`);
      const hp = pl.o.hp ? clamp(pl.o.hp(u), 0, 1) : 1; pl.g.hp.setAttribute('width', Math.max(0.1, pl.g.w*hp).toFixed(1)); });
  };
  // quest tracker (top-right)
  H.quest = function(title, lines, t0, t1){
    const g = G(H.g); mk('rect', SK({x:0, y:0, width:470, height:66 + 44*lines.length, rx:24, fill:'#FFFDF6', 'fill-opacity':0.92}, 4.6), g);
    mk('rect', {x:0, y:0, width:470, height:52, rx:24, fill:'#B79BE8'}, g); mk('rect', {x:0, y:30, width:470, height:22, fill:'#B79BE8'}, g);
    const tt = txt(g, 26, 36, '✦ ' + title, 26, '#FFFFFF', 'start'); tt.setAttribute('font-weight', 700);
    g.rows = lines.map((l, i) => { const r = G(g, `translate(26 ${92 + 44*i})`); r.box = mk('rect', SK({x:0, y:-22, width:26, height:26, rx:7, fill:'#FFFFFF'}, 3), r);
      r.tick = mk('path', {d:'M5 -9 L11 -3 L22 -16', fill:'none', stroke:'#4FB06A', 'stroke-width':5, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, r);
      r.txt = txt(r, 40, 0, l.text, 24, OL, 'start'); r.l = l; return r; });
    g.style.display = 'none';
    H.quests = H.quests || []; H.quests.push({g, t0, t1}); return g;
  };
  // big centred banner (LEVEL UP!, QUEST CLEAR!, NEW PARTY MEMBER)
  H.banners = [];
  H.banner = function(t, text, sub, col, d){ const g = G(H.g, 'translate(960 300)');
    g.glow = mk('ellipse', {rx:520, ry:150, fill:'url(#glowW)'}, g);
    mk('path', SK({d:'M-430 -60 L430 -60 L470 0 L430 60 L-430 60 L-470 0 Z', fill:col || '#B79BE8'}, 6), g);
    mk('path', {d:'M-410 -44 L410 -44 L440 0 L410 44 L-410 44 L-440 0 Z', fill:'none', stroke:'#FFFFFF', 'stroke-width':3, opacity:0.6}, g);
    const tt = txt(g, 0, 22, text, 66, '#FFFFFF'); tt.setAttribute('font-weight', 800); tt.setAttribute('stroke', OL); tt.setAttribute('stroke-width', 8); tt.setAttribute('paint-order', 'stroke');
    if (sub){ const s2 = txt(g, 0, 108, sub, 34, '#FFFFFF'); s2.setAttribute('stroke', OL); s2.setAttribute('stroke-width', 7); s2.setAttribute('paint-order', 'stroke'); }
    g.st = Array.from({length:6}, (_, k) => mk('path', {d:STAR_D, fill:'#FFE07A', stroke:OL, 'stroke-width':2}, g));
    g.style.display = 'none'; H.banners.push({g, t, d: d || 3}); return g; };
  // party-join card (like the class cards): {t, hero, x, y}
  H.cards = [];
  H.card = function(t, hero, o){ o = o || {}; const Hh = HERO[hero], C = CLS[Hh.cls]; const g = G(H.g);
    const x0 = o.x || 1380, y0 = o.y || 250;
    g.inner = G(g); const q = g.inner;
    mk('rect', SK({x:0, y:0, width:440, height:330, rx:28, fill:'#FFFDF6'}, 6), q);
    mk('rect', {x:0, y:0, width:440, height:70, rx:28, fill:C.col}, q); mk('rect', {x:0, y:40, width:440, height:30, fill:C.col}, q);
    mk('rect', {x:10, y:10, width:420, height:310, rx:22, fill:'none', stroke:C.col, 'stroke-width':3, opacity:0.5}, q);
    clsIcon(G(q, 'translate(44 36)'), Hh.cls, 1.3);
    const ct = txt(q, 240, 48, C.name.toUpperCase(), 34, '#FFFFFF'); ct.setAttribute('font-weight', 800); ct.setAttribute('letter-spacing', 3);
    const nt = txt(q, 220, 128, Hh.name.toUpperCase(), 52, C.col); nt.setAttribute('font-weight', 800); nt.setAttribute('stroke', OL); nt.setAttribute('stroke-width', 2.5);
    txt(q, 220, 168, TITLES[hero], 28, OL);
    SKILLS[hero].forEach((s, i) => { const r = G(q, `translate(${30 + i*205} 210)`); mk('rect', {x:0, y:0, width:190, height:86, rx:16, fill:C.col, opacity:0.14}, r);
      clsIcon(G(r, 'translate(26 43)'), Hh.cls, 0.8); const st = txt(r, 112, 50, s, s.length > 13 ? 17 : (s.length > 10 ? 19 : 22), OL); st.setAttribute('font-weight', 700); });
    const tg = txt(g, 220, -20, o.tag || '✦ NEW PARTY MEMBER ✦', 30, '#FFFFFF'); tg.setAttribute('font-weight', 800); tg.setAttribute('stroke', OL); tg.setAttribute('stroke-width', 7); tg.setAttribute('paint-order', 'stroke');
    g.style.display = 'none'; H.cards.push({g, t, d:o.d || 5, x0, y0}); return g; };
  H.post = function(u){
    (H.quests || []).forEach(q => { const a = rh(u, q.t0, q.t0 + 0.6, q.t1 - 0.6, q.t1); show(q.g, a > 0.01); if (a <= 0.01) return;
      T(q.g, `translate(${(1420 + 60*(1 - a)).toFixed(1)} 40)`); q.g.setAttribute('opacity', a.toFixed(3));
      q.g.rows.forEach(r => { const done = r.l.done !== undefined && u > r.l.done; show(r.tick, done); r.txt.setAttribute('opacity', done ? 0.55 : 1);
        if (r.l.count){ const n = r.l.count.filter(tt => u > tt).length; r.txt.textContent = `${r.l.text} ${n}/${r.l.count.length}`; if (n === r.l.count.length){ show(r.tick, true); r.txt.setAttribute('opacity', 0.55); } } }); });
    H.banners.forEach(b => { const a = rh(u, b.t, b.t + 0.35, b.t + b.d - 0.5, b.t + b.d); show(b.g, a > 0.01); if (a <= 0.01) return;
      T(b.g, `translate(960 300) scale(${(0.7 + 0.3*sm((u - b.t)/0.35) + 0.08*bump(u, b.t + 0.2, 0.4)).toFixed(3)})`); b.g.setAttribute('opacity', a.toFixed(3));
      b.g.glow.setAttribute('opacity', (0.6 + 0.3*Math.sin(TAU*u*1.5)).toFixed(3));
      b.g.st.forEach((s, k) => { const ang = TAU*(k/6 + u*0.15); T(s, `translate(${(500*Math.cos(ang)).toFixed(1)} ${(110*Math.sin(ang)).toFixed(1)}) scale(${(1.2 + 0.4*Math.sin(TAU*(u + k/6))).toFixed(2)})`); }); });
    H.cards.forEach(c => { const a = rh(u, c.t, c.t + 0.5, c.t + c.d - 0.5, c.t + c.d); show(c.g, a > 0.01); if (a <= 0.01) return;
      T(c.g, `translate(${(c.x0 + 80*(1 - a)).toFixed(1)} ${c.y0}) rotate(${(3*(1 - a)).toFixed(2)})`); c.g.setAttribute('opacity', a.toFixed(3)); });
  };
  return H;
}

/* ------------------------------------------------------------------ */
/* 6. LOCATIONS                                                        */
/* ------------------------------------------------------------------ */
function fantasyCastle(parent, x, y, s, col, roof, flag){
  const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  const tower = (tx, ty, w, h, r) => { mk('rect', SK({x:tx - w/2, y:ty - h, width:w, height:h, fill:col}, 5), g);
    mk('path', SK({d:`M${tx - w/2 - 14} ${ty - h} L${tx} ${ty - h - r} L${tx + w/2 + 14} ${ty - h} Z`, fill:roof}, 5), g);
    mk('rect', SK({x:tx - 10, y:ty - h + 30, width:20, height:30, rx:10, fill:'#5E5A8A'}, 3.4), g);
    if (flag){ mk('path', {d:`M${tx} ${ty - h - r} V${ty - h - r - 46}`, stroke:OL, 'stroke-width':4}, g); mk('path', SK({d:`M${tx} ${ty - h - r - 46} L${tx + 36} ${ty - h - r - 38} L${tx} ${ty - h - r - 28} Z`, fill:flag}, 3), g); } };
  mk('rect', SK({x:-240, y:-220, width:480, height:220, fill:col}, 5), g);
  for (let i=0;i<10;i++) mk('rect', SK({x:-240 + i*50, y:-246, width:28, height:28, fill:col}, 4), g);
  mk('path', SK({d:'M-50 0 L-50 -110 Q0 -170 50 -110 L50 0 Z', fill:'#8A5A44'}, 5), g);
  mk('path', {d:'M-50 -80 H50 M-50 -40 H50 M0 -150 V0', stroke:'#6E4433', 'stroke-width':4}, g);
  tower(-260, 0, 110, 380, 150); tower(260, 0, 110, 380, 150); tower(0, -220, 140, 260, 180);
  tower(-130, -60, 80, 260, 110); tower(130, -60, 80, 260, 110);
  [[-150,-150],[150,-150],[-60,-330],[60,-330]].forEach(q => mk('rect', SK({x:q[0] - 12, y:q[1], width:24, height:34, rx:12, fill:'#FFE7A8'}, 3.4), g));
  return g;
}
function fantasyHouse(parent, x, y, s, wall, roof, seed){
  const r = rngMaker(seed || 5); const g = G(parent, `translate(${x} ${y}) scale(${s})`);
  mk('rect', SK({x:-120, y:-200, width:240, height:200, fill:wall}, 5), g);
  mk('path', {d:'M-120 -130 H120 M-40 -200 V0 M40 -200 V0 M-120 -200 L-40 -130 M120 -200 L40 -130', stroke:'#8A5A44', 'stroke-width':10}, g);
  mk('path', {d:'M-120 -130 H120 M-40 -200 V0 M40 -200 V0', stroke:'#000', 'stroke-width':1, opacity:0}, g);
  mk('rect', SK({x:-120, y:-200, width:240, height:200, fill:'none'}, 5), g);
  mk('path', SK({d:'M-160 -190 L0 -330 L160 -190 Z', fill:roof}, 5), g);
  for (let k=0;k<4;k++) mk('path', {d:`M${-130 + k*20} ${-200 - k*28} L${130 - k*20} ${-200 - k*28}`, stroke:'#000', 'stroke-width':3, opacity:0.1}, g);
  mk('rect', SK({x:60, y:-320, width:30, height:70, fill:'#C9A27E'}, 4), g);
  mk('rect', SK({x:-24, y:-90, width:48, height:90, rx:24, fill:'#9A6447'}, 4.4), g);
  [-82, 82].forEach(wx => { mk('rect', SK({x:wx - 22, y:-110, width:44, height:44, rx:6, fill:'#FFE7A8'}, 4), g); mk('path', {d:`M${wx} -110 V-66 M${wx - 22} -88 H${wx + 22}`, stroke:OL, 'stroke-width':3}, g); });
  mk('circle', SK({cx:0, cy:-250, r:22, fill:'#FFE7A8'}, 4), g);
  if (r() < 0.6){ const sg = G(g, 'translate(-150 -150)'); mk('path', {d:'M0 0 H40', stroke:OL, 'stroke-width':5}, sg); mk('rect', SK({x:6, y:6, width:44, height:34, rx:6, fill:'#FFF3D6'}, 3.6), sg); pawPrint(sg, 28, 24, 0.8, '#C9A27E'); }
  return g;
}
function crystal(parent, x, y, s, col){ const g = G(parent, `translate(${x} ${y}) scale(${s})`); g.glow = mk('ellipse', {cx:0, cy:-50, rx:90, ry:110, fill:'url(#glowW)', opacity:0.6}, g);
  mk('path', SK({d:'M0 -130 L30 -60 L14 0 L-14 0 L-30 -60 Z', fill:col || '#9FD8F7'}, 4.4), g); mk('path', SK({d:'M-34 -50 L-20 -84 L-6 -46 L-14 0 L-30 0 Z', fill:col || '#9FD8F7'}, 4), g); mk('path', SK({d:'M34 -40 L24 -74 L8 -40 L14 0 L28 0 Z', fill:col || '#9FD8F7'}, 4), g);
  mk('path', {d:'M0 -120 L-10 -60', stroke:'#FFFFFF', 'stroke-width':5, 'stroke-linecap':'round', opacity:0.7}, g); return g; }
function tombstone(parent, x, y, s){ const g = G(parent, `translate(${x} ${y}) scale(${s})`); mk('path', SK({d:'M-40 0 L-40 -70 Q-40 -110 0 -110 Q40 -110 40 -70 L40 0 Z', fill:'#B9B4C9'}, 4.6), g); mk('path', {d:'M-14 -70 H14 M0 -84 V-50', stroke:'#8A84A0', 'stroke-width':6, 'stroke-linecap':'round'}, g); return g; }
function bigMushroom(parent, x, y, s, col){ const g = G(parent, `translate(${x} ${y}) scale(${s})`); mk('path', SK({d:'M-24 0 Q-30 -80 -16 -110 L16 -110 Q30 -80 24 0 Z', fill:'#FFF3E0'}, 4.6), g);
  mk('path', SK({d:'M-110 -100 Q-100 -200 0 -204 Q100 -200 110 -100 Q0 -80 -110 -100 Z', fill:col || '#F0606E'}, 5), g); [[-50,-150,16],[20,-176,13],[60,-130,12]].forEach(q => mk('circle', {cx:q[0], cy:q[1], r:q[2], fill:'#FFFFFF'}, g)); return g; }
function banner(parent, x, y, s, col){ const g = G(parent, `translate(${x} ${y}) scale(${s})`); mk('path', {d:'M0 0 V-240', stroke:OL, 'stroke-width':10}, g); mk('path', {d:'M0 0 V-240', stroke:'#9A6A44', 'stroke-width':5}, g);
  g.flag = G(g, 'translate(0 -236)'); mk('path', SK({d:'M0 0 L80 0 L80 120 L40 100 L0 120 Z', fill:col}, 4.4), g.flag); pawPrint(g.flag, 40, 50, 1.4, '#FFFFFF'); return g; }
function fountain(parent, x, y, s){ const g = G(parent, `translate(${x} ${y}) scale(${s})`); mk('ellipse', SK({cx:0, cy:0, rx:200, ry:50, fill:'#C9C3D8'}, 5), g); mk('ellipse', {cx:0, cy:-6, rx:176, ry:38, fill:'#8FD0F2'}, g);
  mk('rect', SK({x:-24, y:-150, width:48, height:146, fill:'#D9D3E6'}, 4.6), g); mk('ellipse', SK({cx:0, cy:-150, rx:80, ry:20, fill:'#C9C3D8'}, 4.6), g); mk('ellipse', {cx:0, cy:-154, rx:66, ry:12, fill:'#8FD0F2'}, g);
  g.jets = [-1, 0, 1].map(k => mk('path', {d:`M0 -160 Q${k*40} -240 ${k*80} -150`, fill:'none', stroke:'#BFE6FF', 'stroke-width':7, 'stroke-linecap':'round', opacity:0.8}, g)); crystal(g, 0, -190, 0.4, '#B9A3F0'); return g; }

// outdoor world. o.biome: 'meadow' | 'town' | 'forest' | 'graveyard' | 'mountain' | 'shrine'; o.tod: 'day' | 'sunset' | 'night'
function locRealm(parent, o){
  o = o || {};
  const tod = o.tod || (o.biome === 'graveyard' ? 'night' : 'day'), bi = o.biome || 'meadow';
  const L = {}; const g = G(parent); L.back = g;
  const SKY = {day:[[0,'#8CC8F5'],[0.6,'#D2EBFB'],[1,'#FFF4E6']], sunset:[[0,'#8E86D6'],[0.55,'#FFB8B0'],[1,'#FFE3B8']], night:[[0,'#2E2A5E'],[0.6,'#5A4F94'],[1,'#8E7FC0']]};
  skyRect(g, 'rlSky_' + tod + bi, SKY[tod]);
  if (tod === 'night'){ const st = G(g); const sr = rngMaker(9); for (let i=0;i<80;i++) mk('circle', {cx:sr()*2400 - 240, cy:sr()*560 - 100, r:1 + sr()*2.6, fill:'#FFF6D0', opacity:0.5 + sr()*0.5}, st); L.stars = st;
    L.moon = G(g, 'translate(1500 160)'); mk('circle', {r:200, fill:'url(#glowW)', opacity:0.5}, L.moon); mk('circle', {r:60, fill:'#FFF3C4'}, L.moon); mk('circle', {cx:22, cy:-14, r:56, fill:'#5A4F94', opacity:0}, L.moon); }
  else { L.sunG = G(g, tod === 'sunset' ? 'translate(1460 420)' : 'translate(1580 150)'); mk('circle', {r:380, fill:'url(#glowW)'}, L.sunG); mk('circle', {r:58, fill: tod === 'sunset' ? '#FFC98A' : '#FFF7D0'}, L.sunG); }
  L.clouds = [0.9, 0.65, 0.75].map(s => cloudShape(g, 0, 0, s, tod === 'night' ? '#6E64A8' : (tod === 'sunset' ? '#FFE0D8' : '#FFFFFF')));
  // floating islands in the sky (it's a fantasy MMO!)
  L.isles = [[300, 260, 0.5], [1280, 200, 0.38]].map((q, i) => { const is = G(g, `translate(${q[0]} ${q[1]}) scale(${q[2]})`);
    mk('path', SK({d:'M-160 0 Q0 30 160 0 Q120 100 40 150 Q0 190 -30 150 Q-110 100 -160 0 Z', fill: tod === 'night' ? '#6E5E8E' : '#C9A27E'}, 6), is);
    mk('path', SK({d:'M-170 4 Q-160 -30 0 -34 Q160 -30 170 4 Q0 30 -170 4 Z', fill: tod === 'night' ? '#5E8E7A' : '#8ED081'}, 6), is);
    if (i === 0) fantasyHouse(is, 20, -20, 0.5, '#FFF3D6', '#9B8AE0', 2); else crystal(is, 0, -20, 0.9, '#B9A3F0');
    mk('path', {d:'M60 150 Q70 220 50 300', fill:'none', stroke:'#BFE6FF', 'stroke-width':10, opacity:0.6}, is); return is; });
  // far mountains + castle
  L.far = G(g);
  const fr = rngMaker(bi.length*7 + 3);
  const mc = {day:['#B5C9EA', '#9FBFA0'], sunset:['#C8A8C8', '#B5A890'], night:['#4E4680', '#3E5A60']}[tod];
  let d1 = 'M-700 600'; for (let x=-700; x<2700; x+=240) d1 += ` L${x + 120} ${380 + fr()*120} L${x + 240} ${560 + fr()*40}`; d1 += ' L2700 800 L-700 800 Z';
  mk('path', {d:d1, fill:mc[0]}, L.far);
  if (bi !== 'graveyard' && bi !== 'mountain') L.castle = fantasyCastle(L.far, o.castleX || 1240, 640, 0.62, tod === 'night' ? '#8A84B8' : '#E9E3F2', tod === 'night' ? '#5E4F9A' : '#7E6FD0', '#FF9DB5');
  let d2 = 'M-700 680'; for (let x=-700; x<2700; x+=300) d2 += ` Q${x + 150} ${620 + fr()*40} ${x + 300} ${670 + fr()*14}`; d2 += ' L2700 820 L-700 820 Z';
  mk('path', {d:d2, fill:mc[1]}, L.far);
  mk('rect', {x:-700, y:-400, width:3400, height:1300, fill: tod === 'night' ? '#2E2A5E' : '#FFFFFF', opacity:0.18}, L.far);
  // mid ground
  L.mid = G(g); const m = L.mid; const sr = rngMaker(55 + bi.length);
  const grass = {day:'#A6DB8C', sunset:'#C8C88A', night:'#5E8A78'}[tod];
  mk('path', SK({d:'M-500 720 Q400 690 960 706 Q1600 724 2420 700 L2420 1500 L-500 1500 Z', fill: bi === 'town' ? '#C9D99A' : grass}, 5), m);
  L.trees = [];
  if (bi === 'meadow' || bi === 'shrine'){
    [[-300,740,0.9],[160,725,0.75],[560,730,0.6],[1700,735,0.8],[2200,745,0.95]].forEach(a => L.trees.push(roundTree(m, a[0], a[1], a[2], tod === 'night' ? ['#3E7A64','#4E8A70'] : ['#63B36B','#7CC77A'])));
    [[380, 780, 0.6, '#9FD8F7'], [1450, 770, 0.5, '#B9A3F0'], [-120, 790, 0.7, '#FFB3C7']].forEach(a => crystal(m, a[0], a[1], a[2], a[3]));
    if (bi === 'shrine') [[700, 820], [1220, 820]].forEach((p, i) => { const pg = G(m, `translate(${p[0]} ${p[1]})`); mk('rect', SK({x:-30, y:-260, width:60, height:260, fill:'#E9E3F2'}, 5), pg); mk('rect', SK({x:-46, y:-280, width:92, height:26, rx:8, fill:'#D9D3E6'}, 4.4), pg); L['orb' + i] = crystal(pg, 0, -290, 0.55, i ? '#8FD0FF' : '#FF9A5A'); });
  }
  if (bi === 'forest'){
    for (let i=0;i<9;i++) L.trees.push(pineTree(m, -400 + i*330 + sr()*80, 760 + sr()*20, 1.4 + sr()*0.5, tod === 'night' ? '#3E6A5E' : '#4E9A6A'));
    [[200, 860, 0.8, '#F0606E'], [1650, 870, 0.7, '#B98AF0'], [900, 850, 0.45, '#FFB347']].forEach(a => bigMushroom(m, a[0], a[1], a[2], a[3]));
    L.rays = G(g); for (let k=0;k<6;k++) mk('path', {d:`M${300 + k*300} -100 L${200 + k*320} 1100 L${300 + k*320} 1100 Z`, fill:'#FFF6D8', opacity:0.1}, L.rays);
  }
  if (bi === 'town'){
    [[-260, 760, 0.85, '#FFF3D6', '#E98A8A', 1], [120, 740, 0.75, '#EEE6FF', '#7E6FD0', 2], [1640, 745, 0.8, '#E3F2DF', '#E9A54A', 3], [2040, 760, 0.9, '#FFE1E8', '#6F8FBF', 4]].forEach(a => fantasyHouse(m, a[0], a[1], a[2], a[3], a[4], a[5]));
    L.banners = [[480, 800, '#B79BE8'], [1440, 800, '#FF9DB5']].map(q => banner(m, q[0], q[1], 1, q[2]));
    lin('rlPlaza', [[0,'#EBDDC8'],[1,'#DCC8AE']]);
    mk('path', SK({d:'M-500 820 Q960 790 2420 830 L2420 1500 L-500 1500 Z', fill:'url(#rlPlaza)'}, 5), m);
    for (let row=0; row<6; row++){ const yy = 846 + row*42, h = 26 + row*5; for (let x=-480 + (row%2)*50; x<2400; x+=110 + row*12){ const w = 84 + row*10 + sr()*16;
      mk('rect', {x:x + sr()*8, y:yy + sr()*6, width:w, height:h, rx:h/2.4, fill: sr() < 0.5 ? '#E4D3BC' : '#DCC9AF', stroke:'#C9B394', 'stroke-width':3}, m); } }
    L.fountain = fountain(m, o.fountainX || 960, 880, 0.9);
  }
  if (bi === 'graveyard'){
    [[260, 820, 0.9], [520, 800, 0.7], [1380, 810, 0.8], [1640, 830, 1.0], [-80, 830, 0.85], [2100, 820, 0.9]].forEach(a => tombstone(m, a[0], a[1], a[2]));
    [[700, 830], [1200, 840]].forEach(p => itPumpkin(G(m, `translate(${p[0]} ${p[1]})`), 1.3));
    L.trees.push(roundTree(m, 1900, 760, 1.1, ['#4E4A70','#5E5A80']));
  }
  if (bi === 'mountain'){
    const tg = G(m, 'translate(960 700)'); mk('rect', SK({x:-220, y:-200, width:440, height:200, fill:'#E8D8C0'}, 5), tg);
    mk('path', SK({d:'M-300 -190 Q-200 -230 -170 -290 L170 -290 Q200 -230 300 -190 Q0 -170 -300 -190 Z', fill:'#C9564A'}, 5), tg);
    mk('path', SK({d:'M-200 -300 Q-130 -330 -110 -370 L110 -370 Q130 -330 200 -300 Q0 -286 -200 -300 Z', fill:'#C9564A'}, 5), tg);
    [[-120],[0],[120]].forEach(q => mk('rect', SK({x:q[0] - 30, y:-160, width:60, height:160, fill:'#9A4A3A'}, 4), tg));
    for (let k=0;k<5;k++) mk('rect', SK({x:-260 - k*30, y:k*24, width:520 + k*60, height:26, fill:'#D9C9B0'}, 4), tg);
    for (let i=0;i<8;i++) pineTree(m, -400 + i*360 + sr()*60, 740 + sr()*14, 1.0 + sr()*0.3, '#4E9A6A');
  }
  if (bi !== 'town'){ grassTufts(m, 40, 31, 740, 1000); for (let i=0;i<40;i++) blossom(m, -400 + sr()*2700, 780 + sr()*280, 1 + sr(), ['#FFFFFF','#FFE07A','#FF9EBB','#C9B6F2'][i % 4]); }
  L.chars = G(parent); L.front = G(parent);
  if (bi === 'forest' || bi === 'meadow') [[200, 1160, 1.2, 51], [1760, 1170, 1.3, 52]].forEach(a => flowerBush(L.front, a[0], a[1], a[2], a[3], ['#FFFFFF','#FFE07A','#C9B6F2','#FF9EBB']));
  L.fx = G(parent);
  L.sparkles = fireflies(L.fx, tod === 'night' ? 18 : 10, [-200, 300, 2100, 900]);
  if (bi === 'graveyard'){ L.fog = G(L.fx); for (let i=0;i<6;i++) mk('ellipse', {cx:i*400 - 200, cy:960, rx:360, ry:60, fill:'#E8E2FF', opacity:0.18}, L.fog); }
  L.petals = bi === 'meadow' || bi === 'town' ? petalsFx(L.fx, 30, [-300, -80, 2400, 1120]) : (bi === 'forest' ? leavesFx(L.fx, 18, [-200, -80, 2200, 1100], ['#8ED081','#6DBA6E','#F6C453']) : null);
  overlays(L, parent);
  if (tod === 'night') L.warm.setAttribute('opacity', 0.02);
  L.update = function(u, oo){
    oo = oo || {};
    const cx = oo.camX === undefined ? 960 : oo.camX;
    T(L.far, `translate(${((cx - 960)*0.45).toFixed(1)} 0)`);
    T(L.front, `translate(${(-(cx - 960)*0.18).toFixed(1)} 0)`);
    L.clouds.forEach((c, i) => T(c, `translate(${(mod(u*(6 + i*2.5) + i*700, 2800) - 420 + (cx - 960)*0.6).toFixed(1)} ${90 + i*60}) scale(${[0.9,0.65,0.75][i]})`));
    L.isles.forEach((is, i) => T(is, `translate(${[300, 1280][i] + (cx - 960)*0.55} ${([260, 200][i] + 14*Math.sin(TAU*(u*0.08 + i*0.4))).toFixed(1)}) scale(${[0.5, 0.38][i]})`));
    if (L.banners) L.banners.forEach((b, i) => T(b.flag, `translate(0 -236) skewY(${(4*Math.sin(TAU*(u*0.5 + i*0.3))).toFixed(2)})`));
    if (L.fountain) L.fountain.jets.forEach((j, k) => j.setAttribute('opacity', (0.6 + 0.3*Math.sin(TAU*(u*1.5 + k/3))).toFixed(3)));
    if (L.fog) T(L.fog, `translate(${(40*Math.sin(TAU*u*0.05)).toFixed(1)} 0)`);
    L.sparkles(u, oo.sparkles === undefined ? 1 : oo.sparkles);
    if (L.petals) L.petals(u, oo.petals === undefined ? 0.8 : oo.petals);
    if (L.rays) L.rays.setAttribute('opacity', (0.75 + 0.25*Math.sin(TAU*u*0.08)).toFixed(3));
    if (oo.dusk !== undefined) L.dusk.setAttribute('opacity', (0.35*oo.dusk).toFixed(3));
  };
  return L;
}

// interiors. o.kind: 'guild' | 'tower' | 'tavern' | 'lab' | 'workshop' | 'library' | 'temple'
function locHall(parent, o){
  o = o || {}; const kind = o.kind || 'guild';
  const L = {}; const g = G(parent); L.back = g;
  const wallC = {guild:['#E9DFF2','#D9CDE6'], tower:['#D9D3F2','#C9C0E8'], tavern:['#F2D9BC','#E6C6A2'], lab:['#DDEBE3','#C9DDD0'], workshop:['#E6DDD0','#D6CABA'], library:['#F2E3CF','#E6D0B6'], temple:['#F2E6D0','#E6D3B3']}[kind];
  lin('hlWall' + kind, [[0, wallC[0]], [1, wallC[1]]]);
  mk('rect', {x:-400, y:-400, width:2720, height:1300, fill:`url(#hlWall${kind})`}, g);
  // stone block pattern
  const sr = rngMaker(kind.length*13);
  for (let row=0; row<8; row++) for (let x=-380 + (row%2)*80; x<2300; x+=160) mk('rect', {x:x + 4, y:-60 + row*100 + 4, width:152, height:92, rx:10, fill:'#000', opacity:0.03 + sr()*0.03}, g);
  // arched windows with light
  L.wins = [[360, 380], [1560, 380]].map(q => { const w = G(g, `translate(${q[0]} ${q[1]})`);
    mk('path', SK({d:'M-110 160 L-110 -60 Q-110 -170 0 -170 Q110 -170 110 -60 L110 160 Z', fill: o.night ? '#4E4690' : '#BFE3FA'}, 6), w);
    mk('path', {d:'M0 -170 V160 M-110 20 H110', stroke:OL, 'stroke-width':5}, w); mk('circle', {cx:0, cy:-60, r:300, fill:'url(#glowW)', opacity: o.night ? 0.2 : 0.5}, w); return w; });
  // big floor
  lin('hlFloor' + kind, kind === 'tavern' || kind === 'workshop' ? [[0,'#C98F5E'],[1,'#B07A4E']] : [[0,'#D9D0E6'],[1,'#C3B8D6']]);
  mk('path', SK({d:'M-400 800 L2320 800 L2320 1500 L-400 1500 Z', fill:`url(#hlFloor${kind})`}, 5), g);
  for (let x=-400; x<2320; x+=kind === 'tavern' || kind === 'workshop' ? 140 : 200) mk('path', {d:`M${x} 800 L${x - 160} 1500`, stroke:'#000', 'stroke-width':3, opacity:0.08}, g);
  mk('rect', {x:-400, y:790, width:2720, height:20, fill:'#000', opacity:0.1}, g);
  L.props = G(g); const p = L.props;
  const torch = (x, y) => { const t = G(p, `translate(${x} ${y})`); mk('rect', SK({x:-10, y:0, width:20, height:60, rx:6, fill:'#8A5A44'}, 4), t); t.glow = mk('circle', {cx:0, cy:-20, r:140, fill:'url(#glowLamp)', opacity:0.8}, t);
    t.fl = mk('path', SK({d:'M0 -50 Q20 -20 12 -4 Q0 6 -12 -4 Q-20 -20 0 -50 Z', fill:'#FFB347'}, 3.4), t); return t; };
  L.torches = [[760, 380], [1160, 380]].map(q => torch(q[0], q[1]));
  if (kind === 'guild'){
    const bd = G(p, 'translate(960 520)'); mk('rect', SK({x:-200, y:-170, width:400, height:280, rx:14, fill:'#B98552'}, 6), bd);
    [[-140,-130,'#FFF3D6'],[-20,-140,'#FFE1E8'],[100,-120,'#E3F2DF'],[-100,-20,'#EEE6FF'],[40,-10,'#FFF3D6']].forEach(q => { mk('rect', SK({x:q[0], y:q[1], width:96, height:90, rx:4, fill:q[2], transform:`rotate(${(sr()-0.5)*8} ${q[0] + 48} ${q[1]})`}, 3.6), bd); mk('circle', {cx:q[0] + 48, cy:q[1] + 6, r:6, fill:'#E5677D'}, bd); });
    { const qt = txt(bd, 0, -190, 'QUEST BOARD', 34, '#FFFFFF'); qt.setAttribute('font-weight', 800); qt.setAttribute('stroke', OL); qt.setAttribute('stroke-width', 7); qt.setAttribute('paint-order', 'stroke'); }
    L.desk = G(p, 'translate(960 900)');
    [[300, 780, '#B79BE8'], [1620, 780, '#FF9DB5']].forEach(q => banner(p, q[0], q[1], 1.2, q[2]));
  }
  if (kind === 'tower' || kind === 'library'){
    shelfWall(p, -300, 240, 160, 780, 7); shelfWall(p, 1680, 2220, 160, 780, 8);
    L.circle = G(p, 'translate(960 940)'); mk('ellipse', {rx:360, ry:80, fill:'none', stroke:'#B98AF0', 'stroke-width':8, opacity:0.8}, L.circle); mk('ellipse', {rx:290, ry:62, fill:'none', stroke:'#FFFFFF', 'stroke-width':4, 'stroke-dasharray':'20 14', opacity:0.7}, L.circle);
    for (let k=0;k<8;k++){ const a = k/8*TAU; mk('path', {d:STAR_D, fill:'#D9C2FF', transform:`translate(${(330*Math.cos(a)).toFixed(0)} ${(72*Math.sin(a)).toFixed(0)}) scale(0.8 0.4)`}, L.circle); }
    L.books = [0,1,2].map(k => { const b = G(p); mk('rect', SK({x:-24, y:-18, width:48, height:36, rx:5, fill:BOOKC[k + 1]}, 3.6), b); mk('path', {d:'M0 -18 V18', stroke:OL, 'stroke-width':3}, b); return b; });
  }
  if (kind === 'tavern'){
    const st = G(p, 'translate(960 800)'); mk('rect', SK({x:-320, y:-60, width:640, height:60, rx:8, fill:'#9A6447'}, 5), st);
    [[-200, -360], [200, -360]].forEach(q => fairyLights(p, [[q[0] + 760, 200], [q[0] + 960, 260], [q[0] + 1160, 200]], 9));
    [[200, 800], [1720, 800]].forEach(q => { const b = G(p, `translate(${q[0]} ${q[1]})`); mk('ellipse', SK({cx:0, cy:-70, rx:70, ry:90, fill:'#B98552'}, 5), b); mk('path', {d:'M-66 -100 H66 M-66 -40 H66', stroke:'#7A4A32', 'stroke-width':8}, b); });
    [[480, 920], [1440, 920]].forEach(q => { const t = G(p, `translate(${q[0]} ${q[1]})`); mk('rect', SK({x:-120, y:-20, width:240, height:24, rx:8, fill:'#C98F5E'}, 4.6), t); mk('rect', SK({x:-12, y:0, width:24, height:90, fill:'#9A6447'}, 4), t); itMug(G(t, 'translate(-50 -40)'), '#FFE7A8', '#F2B35A'); });
  }
  if (kind === 'lab'){
    [[260, 620], [1660, 620]].forEach(q => { const s = G(p, `translate(${q[0]} ${q[1]})`); mk('rect', SK({x:-200, y:0, width:400, height:24, rx:6, fill:'#B98552'}, 4.4), s);
      ['#FF8AC8','#8FE0B0','#FFD24D','#8FC8F0','#C9A7FF'].forEach((c, i) => { const f = wFlask(G(s), c); f.setAttribute('transform', `translate(${-160 + i*80} -30) scale(0.9)`); }); });
    L.cauldron = G(p, 'translate(960 940)'); mk('path', SK({d:'M-150 -110 Q-160 30 0 40 Q160 30 150 -110 Z', fill:'#5E5A70'}, 6), L.cauldron); mk('ellipse', SK({cx:0, cy:-110, rx:160, ry:40, fill:'#8FE0B0'}, 6), L.cauldron);
    L.bub = bubblesFx(L.cauldron, 8, '#BFF2D8');
  }
  if (kind === 'workshop'){
    L.gears = [[300, 360, 90, '#AEB6C6'], [460, 300, 60, '#D9A35A'], [1640, 330, 100, '#AEB6C6'], [1480, 420, 56, '#D9A35A']].map(q => { const gg = G(p, `translate(${q[0]} ${q[1]})`); const gi = G(gg);
      for (let i=0;i<10;i++){ const a = i/10*TAU; mk('rect', SK({x:-12, y:-q[2] - 16, width:24, height:30, rx:4, fill:q[3], transform:`rotate(${i*36})`}, 4), gi); }
      mk('circle', SK({r:q[2], fill:q[3]}, 5), gi); mk('circle', SK({r:q[2]*0.35, fill:wallC[0]}, 4.4), gi); gg.inner = gi; gg.r = q[2]; return gg; });
    const wb = G(p, 'translate(960 900)'); mk('rect', SK({x:-300, y:-30, width:600, height:30, rx:8, fill:'#9A6447'}, 5), wb);
  }
  if (kind === 'temple'){
    [[560], [1360]].forEach(q => { const c = G(p, `translate(${q[0]} 800)`); mk('rect', SK({x:-40, y:-620, width:80, height:620, fill:'#C9564A'}, 5), c); });
    const gong = G(p, 'translate(960 560)'); mk('circle', SK({r:110, fill:'#E9B44A'}, 6), gong); mk('circle', {r:70, fill:'none', stroke:'#C98A2E', 'stroke-width':6}, gong);
    mk('path', {d:'M-130 -150 H130', stroke:OL, 'stroke-width':16}, gong); mk('path', {d:'M-130 -150 H130', stroke:'#9A4A3A', 'stroke-width':9}, gong);
  }
  L.chars = G(parent); L.front = G(parent); L.fx = G(parent);
  L.dust = fireflies(L.fx, 12, [-100, 200, 2000, 900]);
  overlays(L, parent);
  L.update = function(u, oo){
    oo = oo || {};
    L.torches.forEach((t, i) => { t.glow.setAttribute('opacity', (0.65 + 0.15*Math.sin(TAU*(u*1.7 + i))).toFixed(3)); T(t.fl, `scale(${(1 + 0.08*Math.sin(TAU*u*5 + i)).toFixed(3)} ${(1 + 0.12*Math.sin(TAU*u*4 + i)).toFixed(3)})`); });
    if (L.books) L.books.forEach((b, k) => T(b, `translate(${(760 + k*200 + 30*Math.sin(TAU*(u*0.2 + k/3))).toFixed(1)} ${(380 + 30*Math.sin(TAU*(u*0.3 + k/3))).toFixed(1)}) rotate(${(10*Math.sin(TAU*(u*0.25 + k))).toFixed(1)})`));
    if (L.circle) L.circle.setAttribute('opacity', (0.6 + 0.3*Math.sin(TAU*u*0.5)).toFixed(3));
    if (L.gears) L.gears.forEach((gg, k) => T(gg.inner, `rotate(${((k % 2 ? -1 : 1)*u*40*90/gg.r).toFixed(1)})`));
    if (L.bub) L.bub(0, -110, u, 1);
    L.dust(u, oo.dust === undefined ? 0.6 : oo.dust);
    if (oo.dusk !== undefined) L.dusk.setAttribute('opacity', (0.35*oo.dusk).toFixed(3));
  };
  return L;
}

/* ------------------------------------------------------------------ */
/* 7. CHOREOGRAPHY HELPERS                                             */
/* ------------------------------------------------------------------ */
// create a hero actor already dressed for battle
function hero(S, id, opts){
  const H0 = HERO[id]; opts = Object.assign({}, opts);
  opts.base = Object.assign({phones:false}, opts.base || {});
  const A = actor(S, H0.kind, opts); A.hero = id;
  if (opts.gear !== false) gear(A, H0.cls);
  return A;
}
// a lunge attack: actor dashes toward target point and back (adds an x-path offset via A.fn)
function lunge(A, t, d, dx, o){
  o = o || {};
  const prev = A.fn;
  A.fn = function(u, st){ if (prev) prev(u, st);
    const v = (u - t)/d; if (v > 0 && v < 1){ const k = v < 0.35 ? sm(v/0.35) : 1 - sm((v - 0.55)/0.45); st.x += dx*k; st.bt += (o.lean || 10)*k*Math.sign(dx); st.hop += (o.hop || 0)*Math.sin(Math.PI*v); } };
  return A;
}
// strike pose for the weapon arm at time t
function strike(A, t, o){ o = o || {}; A.do('arms', t, o.d || 0.7, {R: o.R || [110, -170], L: o.L, eyes:'squeeze', mouth:'open', ai:0.12, ao:0.3}); return A; }
// standard battle sfx bundles
const SFXB = {
  slash: (S, t, p) => { S.sfx(t - 0.05, 'swish', 0.06, p, {d:0.3}); S.sfx(t + 0.08, 'slash', 0.05, p); },
  hit: (S, t, p) => { S.sfx(t, 'hit', 0.07, p); S.sfx(t + 0.02, 'pop', 0.03, p); },
  zap: (S, t, p) => { S.sfx(t, 'zap', 0.05, p); },
  heal: (S, t, p) => { S.sfx(t, 'heal', 0.05, p); },
  shield: (S, t, p) => { S.sfx(t, 'shield', 0.06, p); },
  levelup: (S, t) => { S.sfx(t, 'levelup', 0.07, 0); },
  boing: (S, t, p) => { S.sfx(t, 'boing', 0.05, p); },
  portal: (S, t) => { S.sfx(t, 'portal', 0.06, 0); },
  arrow: (S, t, p) => { S.sfx(t, 'arrow', 0.05, p); },
  coin: (S, t, p) => { S.sfx(t, 'coin', 0.05, p); }
};

/* ------------------------------------------------------------------ */
/* 8. SCENE BUILDERS (Day 17+) — data-driven so every episode stays     */
/*    consistent: arrival, meet-the-new-friend, boss battle, cozy end   */
/* ------------------------------------------------------------------ */
// colour of each hero's magic
const HCOL = {momo:'#C9A7FF', pipi:'#FFC2D4', otto:'#8FE0F0', kuku:'#FFB347', owli:'#FFE07A', leaf:'#A6E3A0', lumi:'#FFE07A', tora:'#FF8A5A', nyx:'#B98AF0', tutu:'#FF9DC8',
  mori:'#8ED081', niko:'#B9D8FF', pom:'#FF8AC8', kiri:'#BFF2F2', rin:'#F2C95E', gear:'#AEB6C6', mimi:'#C9A7FF', eli:'#FF9A5A', snek:'#E9D6A8', zen:'#FFD27A'};
// how each hero attacks in a boss fight
const HATK = {momo:'slash', pipi:'shield', otto:'heal', kuku:'punch', owli:'bolt', leaf:'arrow', lumi:'beam', tora:'punch', nyx:'summon', tutu:'song', mori:'heal', niko:'buff',
  pom:'throw', kiri:'summon', rin:'buff', gear:'throw', mimi:'throw', eli:'bolt', snek:'slash', zen:'punch'};
// evenly spaced party line
function partyLine(S, ly, ids, o){
  o = o || {}; const n = ids.length, sp = o.sp || Math.min(170, 1150/Math.max(1, n - 1)), cx = o.cx || 700, y = o.y || 980, s = o.s || (n > 7 ? 0.9 : 1);
  const X = ids.map((id, i) => cx + (i - (n - 1)/2)*sp);
  const A = {}; ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x: o.enter ? [[0, X[i] - o.enter], [o.enterT || (4 + i*0.15), X[i]], [99, X[i]]] : X[i], y: y + (i % 2)*5, s, steps: o.steps || 'grassstep'}));
  return {A, all: ids.map(id => A[id]), X, ids};
}
function addPlates(S, P, lv, show){ P.all.forEach(a => S.H.plate(a, {lv, show})); }
function setLook(keys){ return u => [K(u, keys.map(k => [k[0], k[1]])), K(u, keys.map(k => [k[0], k[2]])), K(u, keys.map(k => [k[0], k[3]]))]; }

/* --- boss battle: cfg = {loc, party:[ids], boss:{type,col,name,lv,s,x,hat}, minions:[{type,col,x}], moves:[{who,t}], bonk, lv:[from,to], quest, cheer} --- */
function bossFight(S, cfg){
  S.L = cfg.loc(S.cam); const ly = S.L.chars;
  (cfg.amb || [['breeze', 0.6]]).forEach(a => S.amb(a[0], 0, 45, a[1]));
  const P = partyLine(S, ly, cfg.party, {cx: cfg.cx || 640, y: cfg.y || 980, enter: 0, steps: cfg.steps});
  const B = cfg.boss, BX = B.x || 1500, BY = B.y || 990, BS = B.s || 1.6;
  const boss = monster(ly, B.type, {col:B.col}); if (B.hat) B.hat(boss.body);
  const BONK = cfg.bonk || 32;
  const minions = (cfg.minions || []).map((m, i) => Object.assign({m: monster(ly, m.type, {col:m.col, ph:i*0.3})}, m));
  const at = (dy) => () => { const p = boss.mid(); return [p[0] - 40, p[1] + (dy || 0)]; };
  P.all.forEach((a, i) => { a.do('wow', 2.6 + i*0.08, 1.4); a.do('look', 2.4, 6, {x:8, y:-6}); });
  const fx = {slash:[], bolt:[], burst:[], heal:[], shield:[], aura:[], ft:[], beam:[]};
  let dmg = [];
  (cfg.moves || []).forEach(mv => {
    const A = P.A[mv.who], t = mv.t, kind = mv.kind || HATK[mv.who], col = mv.col || HCOL[mv.who], x0 = P.X[cfg.party.indexOf(mv.who)];
    const pan = panOf(x0);
    if (kind === 'slash'){ lunge(A, t, 1.3, BX - x0 - 220, {hop: mv.hop || 50}); strike(A, t + 0.3, {R:[110, -150], L:[100, -100]}); fx.slash.push({t:t + 0.4, at:at(0), rot:-24, col}, {t:t + 0.55, at:at(0), rot:196, col}); fx.burst.push({t:t + 0.5, at:at(0), col}); dmg.push(t + 0.5); SFXB.slash(S, t + 0.4, 0.4); SFXB.hit(S, t + 0.5, 0.4); }
    else if (kind === 'punch'){ lunge(A, t, 1.3, BX - x0 - 240, {hop: mv.hop || 16}); strike(A, t + 0.3, {R:[120, -110], L:[60, -120]}); fx.burst.push({t:t + 0.5, at:at(20), col, s:1.3}); dmg.push(t + 0.5); SFXB.hit(S, t + 0.5, 0.4); S.sfx(t + 0.5, 'thump', 0.05, 0.4, {f:80, d:0.3}); }
    else if (kind === 'bolt' || kind === 'throw' || kind === 'summon' || kind === 'song'){
      A.do('arms', t, 1.8, {R:[110, -190], L:[60, -140], eyes:'squeeze', mouth:'open'}); A.do('hop', t, 0.5, {h:20});
      const n = mv.n || (kind === 'summon' ? 3 : 2);
      for (let k = 0; k < n; k++){ const tt = t + 0.3 + k*0.22; fx.bolt.push({t:tt, d:0.6, from:() => paw(A.c, 1).map((v, j) => v - [0, kind === 'throw' ? 20 : 120][j]), to:at(-20 + k*20), col: k % 2 ? '#FFFFFF' : col, arc: kind === 'throw' ? 220 : 120 - k*60}); fx.burst.push({t:tt + 0.6, at:at(-20 + k*20), col, s:0.9}); dmg.push(tt + 0.6);
        (kind === 'throw' ? SFXB.boing : SFXB.zap)(S, tt, pan); SFXB.hit(S, tt + 0.6, 0.4); }
      if (kind === 'song') S.sfx(t, 'sparkle', 0.05, pan);
    }
    else if (kind === 'arrow'){ A.do('arms', t, 2.0, {L:[110, -140], R:[40, -140], eyes:'squeeze', mouth:'open'}); for (let k = 0; k < 3; k++){ const tt = t + 0.3 + k*0.25; fx.bolt.push({t:tt, d:0.45, shape:'arrow', from:() => paw(A.c, -1), to:at(-30 + k*25), arc:30}); fx.burst.push({t:tt + 0.45, at:at(-30 + k*25), col, s:0.7}); dmg.push(tt + 0.45); SFXB.arrow(S, tt, pan); SFXB.hit(S, tt + 0.45, 0.4); } }
    else if (kind === 'shield'){ A.do('arms', t, 2.4, {L:[80, -110], R:[90, -170], eyes:'squeeze', mouth:'open'}); fx.shield.push({t, d:2.4, at:() => [x0 + 100, (cfg.y || 980) + 5], hit:t + 0.8, col, s: mv.big ? 3.6 : 1.2}); fx.ft.push({t:t + 0.9, at:[x0 + 80, 720], text: mv.text || 'BLOCK!', col}); SFXB.shield(S, t + 0.8, pan); }
    else if (kind === 'heal'){ A.do('arms', t, 2.2, {R:[80, -190], eyes:'happy', mouth:'open'}); P.all.forEach(b => fx.heal.push({t:t + 0.3, d:2.0, at:() => [b.X(t), (cfg.y || 980)], col})); fx.ft.push({t:t + 0.8, at:[cfg.cx || 640, 680], text: mv.text || '+HP ALL', col:'#8FE0A8'}); SFXB.heal(S, t + 0.3, pan); }
    else if (kind === 'buff'){ A.do('arms', t, 2.2, {R:[90, -190], L:[60, -150], eyes:'happy', mouth:'open'}); P.all.forEach(b => fx.aura.push({t:t + 0.2, d:2.2, at:() => [b.X(t), (cfg.y || 980)], col})); fx.ft.push({t:t + 0.8, at:[cfg.cx || 640, 680], text: mv.text || 'ATK UP!', col}); S.sfx(t + 0.2, 'sparkle', 0.06, pan); }
    else if (kind === 'beam'){ A.do('arms', t, 2.6, {R:[90, -200], L:[60, -150], eyes:'squeeze', mouth:'open'}); fx.beam.push(t + 0.4); dmg.push(t + 0.8); S.sfx(t + 0.4, 'heal', 0.05, 0.4); SFXB.hit(S, t + 0.8, 0.4); }
    if (mv.text && kind !== 'shield' && kind !== 'heal' && kind !== 'buff') fx.ft.push({t:t + 0.9, at:() => boss.top().map((v, k) => v - [0, 30][k]), text: mv.text, col, size:50});
  });
  fx.burst.push({t:BONK, at:at(0), col:'#FFE07A', s:1.8}); fx.ft.push({t:BONK + 0.2, at:() => boss.top().map((v, k) => v - [0, 60][k]), text: cfg.finale || 'FRIENDSHIP COMBO!', size:58});
  (cfg.hurt || []).forEach(h => { const A = P.A[h.who]; A.do('pose', h.t, 1.6, {eyes:'squeeze', mouth:'wavy', bt:-10, sweat:1, tremble:0.5}); fx.burst.push({t:h.t, at:() => [A.X(h.t), 860], s:0.7, col:'#FFFFFF'}); fx.ft.push({t:h.t + 0.1, at:() => [A.X(h.t), 720], text: h.text || '-5', col:'#FF8A8A'}); SFXB.hit(S, h.t, panOf(A.X(h.t))); });
  // finale: everyone attacks at once
  P.all.forEach((a, i) => { a.do('arms', BONK - 1.2, 1.6, {R:[110, -180], L:[80, -130], eyes:'squeeze', mouth:'open'}); a.do('hop', BONK - 1.0 + i*0.05, 0.5, {h:30}); });
  P.all.forEach((a, i) => { a.do('cheer', BONK + 3.4 + i*0.08, 2.4); a.do('happy', BONK + 6, 45, {mouth:'open'}); });
  if (cfg.cheer) cfg.cheer(P, BONK);
  S.H = hud(S);
  const [lv0, lv1] = cfg.lv; const LVT = BONK + 3.4;
  addPlates(S, P, lv0, u => u < LVT); addPlates(S, P, lv1, u => u >= LVT);
  S.H.monPlate(boss, B.name, B.lv || lv0 + 3); { const pl = S.H.plates[S.H.plates.length - 1]; pl.o.show = u => u > 2 && u < BONK + 2; pl.o.hp = u => clamp(1 - dmg.filter(d => u > d).length*0.5/Math.max(1, dmg.length) - 0.5*sm((u - BONK)/0.6), 0, 1); }
  S.H.quest(cfg.quest || B.name, [{text: cfg.task || ('Calm the ' + B.name), done:BONK + 1}].concat(cfg.task2 ? [{text:cfg.task2, done:BONK + 5}] : []), 2.4, 44.6);
  S.H.banner(LVT, 'LEVEL UP!', `Lv ${lv0} → Lv ${lv1}`, '#F2B33E', 3.4);
  const lvAura = auraFx(S.L.fx, P.all.map(a => ({t:LVT, d:2.8, at:() => [a.X(LVT), cfg.y || 980], col:'#FFE07A'})));
  const F = {slash: slashFx(S.L.fx, fx.slash), bolt: boltFx(S.L.fx, fx.bolt), burst: burstFx(S.L.fx, fx.burst), heal: healFx(S.L.fx, fx.heal), shield: shieldFx(S.L.fx, fx.shield), aura: auraFx(S.L.fx, fx.aura), ft: floatTxt(S.L.fx, fx.ft)};
  const beam = G(S.L.fx); mk('rect', {x:-80, y:-1400, width:160, height:1400, fill:'url(#glowW)'}, beam); mk('rect', {x:-30, y:-1400, width:60, height:1400, fill:'#FFF6D0', opacity:0.8}, beam);
  const hearts = heartBursts(S.L.fx, [{t:BONK + 1.8, x:BX, y:700, n:6}, {t:BONK + 7, x:cfg.cx || 640, y:680, n:5}]);
  P.all.forEach((a, i) => SFXB.zap(S, BONK - 0.9 + i*0.05, 0)); SFXB.hit(S, BONK, 0.5); S.sfx(BONK + 0.4, 'chime', 0.03, 0.5, {f:1568}); SFXB.levelup(S, LVT);
  (cfg.stomps || []).forEach(t => S.sfx(t + 0.25, 'thump', 0.07, 0.4, {f:70, d:0.4}));
  if (cfg.extraSfx) cfg.extraSfx(S);
  S.look = cfg.look || setLook([[0, 900, 720, 1.0], [8, 1050, 720, 1.06], [BONK - 4, 1000, 730, 1.08], [BONK, 1100, 720, 1.12], [BONK + 4, 960, 740, 1.04], [45, 960, 740, 1.1]]);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    const ent = sm((u - 1.0)/2.4), stomp = (cfg.stomps || []).reduce((s2, t) => s2 + hopF(u, t, 0.5, 40), 0);
    const bx = lerp(2300, BX, ent) + (B.dx ? B.dx(u) : 0);
    boss.set(u, {x:bx, y:BY, s:BS, hop:stomp, hit: dmg.reduce((s2, d) => s2 + 0.6*bump(u, d, 0.35), 0) + bump(u, BONK, 0.6) + fx.shield.reduce((s2, sh) => s2 + 0.4*bump(u, sh.hit, 0.3), 0),
      face: u > BONK && u < BONK + 2.4 ? 'dizzy' : (u > BONK ? 'happy' : 'mad')});
    minions.forEach((q, i) => { const h = q.bonk || 99; q.m.set(u, {x: lerp(2200, q.x, sm((u - 1.4 - i*0.3)/2)) + 500*sm((u - h - 2)/1.4), y: q.y || 985, s: q.s || 0.8, hit: bump(u, h, 0.4), face: u > h && u < h + 1 ? 'dizzy' : (u > h ? 'happy' : 'mad'), alpha: u < 1.4 ? 0 : 1, flip: u > h + 2 ? 1 : -1}); });
    const ba = fx.beam.reduce((s2, t) => Math.max(s2, rh(u, t, t + 0.4, t + 1.4, t + 2.0)), 0); show(beam, ba > 0.01);
    if (ba > 0.01){ const p = boss.mid(); T(beam, `translate(${p[0].toFixed(1)} ${(p[1] + 120).toFixed(1)}) scale(${(0.5 + 0.5*ba).toFixed(3)} 1)`); beam.setAttribute('opacity', ba.toFixed(3)); }
    Object.values(F).forEach(f => f(u)); lvAura(u); hearts(u);
    FLASH.v = Math.max(FLASH.v, 0.3*bump(u, BONK, 0.5));
    if (cfg.post) cfg.post(u, P, boss);
    S.H.update(u); S.H.post(u);
  };
  return {P, boss, BONK};
}

/* --- meet the new friend: cfg = {loc, party, newbie, nx, intro(u-hooks), demo:{t, kind, text}, cardT} --- */
function meetScene(S, cfg){
  S.L = cfg.loc(S.cam); const ly = S.L.chars;
  (cfg.amb || [['room', 0.6]]).forEach(a => S.amb(a[0], 0, 45, a[1]));
  const P = partyLine(S, ly, cfg.party, {cx: cfg.cx || 600, y: cfg.y || 980, enter: 900, steps: cfg.steps || 'woodstep'});
  const NX = cfg.nx || 1300; const N = hero(S, cfg.newbie, Object.assign({layer:ly, x:NX, y:(cfg.y || 980) + 5}, cfg.nopts || {}));
  P.all.forEach((a, i) => { a.do('look', 6, 18, {x:8, y:-2}); a.do('wow', 7.0 + i*0.1, 1.4); });
  N.do('wow', 6.6, 1.4); N.do('wave', 9.0, 2.4); N.do('talk', 12.0, 5.0, {gest:true});
  P.all.forEach((a, i) => a.do('nod', 13 + i*0.15, 1.6));
  const D = cfg.demo || {t:22}; const DT = D.t || 22, kind = D.kind || HATK[cfg.newbie], col = HCOL[cfg.newbie];
  N.do('arms', DT, 2.2, {R:[110, -190], L:[70, -140], eyes:'squeeze', mouth:'open'}); N.do('hop', DT, 0.5, {h:24});
  P.all.forEach((a, i) => { a.do('wow', DT + 1.2 + i*0.1, 1.4); a.do('cheer', DT + 6 + i*0.1, 2.4); a.do('happy', DT + 9, 30, {mouth:'open'}); });
  const CT = cfg.cardT || DT + 5.6;
  N.do('shy', CT + 0.4, 2.0); N.do('cheer', CT + 3, 2.4); N.do('happy', CT + 6, 30, {mouth:'open'});
  if (cfg.acts) cfg.acts(P, N);
  const dummy = monster(ly, cfg.target || 'dummy', {col: cfg.targetCol}); const TX = cfg.tx || 1680;
  const fxl = [], bur = [{t:DT + 0.9, at:[TX, 860], col, s:1.3}];
  if (kind === 'punch' || kind === 'slash'){ lunge(N, DT, 1.3, TX - NX - 200, {hop: kind === 'slash' ? 50 : 16}); }
  else fxl.push({t:DT + 0.3, d:0.6, shape: kind === 'arrow' ? 'arrow' : null, from:() => paw(N.c, kind === 'arrow' ? -1 : 1).map((v, j) => v - [0, kind === 'arrow' ? 0 : 120][j]), to:() => [TX, 860], col, arc:80});
  const bolt = boltFx(S.L.fx, fxl), burst = burstFx(S.L.fx, bur), aura = auraFx(S.L.fx, [{t:DT - 0.2, d:2.0, at:() => [NX, (cfg.y || 980)], col}]);
  const ft = floatTxt(S.L.fx, [{t:DT + 1.0, at:[TX, 700], text: D.text || SKILLS[cfg.newbie][0].toUpperCase() + '!', col, size:50}]);
  S.H = hud(S); addPlates(S, P, cfg.lv, u => u > 5.6); S.H.plate(N, {lv:cfg.lv, show: u => u > CT});
  S.H.card(CT, cfg.newbie, {d:6.2, x: cfg.cardX || 100, y:150});
  const hearts = heartBursts(S.L.fx, [{t:CT + 3, x:NX, y:640, n:5}]);
  (kind === 'punch' ? SFXB.hit : (kind === 'arrow' ? SFXB.arrow : SFXB.zap))(S, DT + 0.3, 0.6); SFXB.hit(S, DT + 0.9, 0.7); S.sfx(CT, 'chime', 0.03, 0, {f:1568}); SFXB.levelup(S, CT + 0.2);
  S.look = cfg.look || setLook([[0, 820, 720, 1.05], [7, 1200, 720, 1.35], [18, 1200, 720, 1.3], [DT - 1, 1150, 720, 1.05], [DT + 4, 1000, 720, 1.05], [45, 960, 720, 1.1]]);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => {
    dummy.set(u, {x:TX, y:(cfg.y || 980) - 10, s:0.9, hit: bump(u, DT + 0.9, 0.5), face: u > DT + 0.9 && u < DT + 2.2 ? 'dizzy' : 'happy', rot: 12*bump(u, DT + 0.9, 0.8)});
    bolt(u); burst(u); aura(u); ft(u); hearts(u);
    if (cfg.post) cfg.post(u, P, N);
    S.H.update(u); S.H.post(u);
  };
  return {P, N};
}

/* --- cozy ending with a teaser card: cfg = {loc, ids, snack:'mug'|'stick'|'cake', next, nextTag, festival, acts} --- */
function cozyEnd(S, cfg){
  S.L = cfg.loc(S.cam); const ly = S.L.chars;
  (cfg.amb || [['night', 0.8]]).forEach(a => S.amb(a[0], 0, 45, a[1]));
  const n = cfg.ids.length, half = Math.ceil(n/2), X = cfg.X || cfg.ids.map((id, i) => i < half ? 960 - 120 - (half - 1 - i)*(n > 8 ? 120 : 145) : 960 + 120 + (i - half)*(n > 8 ? 120 : 145));
  const A = {}; cfg.ids.forEach((id, i) => A[id] = hero(S, id, {layer:ly, x:X[i], y:cfg.y || 985, s: n > 8 ? 0.88 : 1}));
  const all = Object.values(A);
  const sn = cfg.snack || 'mug';
  const mc = ['#FFB3C7', '#C7B3F5', '#9FA6F0', '#FFB47A', '#9FC8F0', '#A6E3A0', '#FFE07A'];
  if (sn === 'mug') all.forEach((a, i) => { a.item('L', 'mug', itMug(G(), mc[i % mc.length], '#8B5A3C')); a.do('hold', 0, 45, {side:'L', item:'mug', at:[30, -76], ease:false}); a.do('sip', 3.0 + i*0.7, 2.0, {side:'L', item:'mug'}); });
  if (sn === 'stick'){ const st = all.map((a, i) => a.item(X[i] < 960 ? 'R' : 'L', 'stick', itStick(G(null, X[i] < 960 ? '' : 'scale(-1 1)')))); all.forEach((a, i) => { const sd = X[i] < 960 ? 'R' : 'L'; a.do('hold', 1.0, 15.0, {side:sd, item:'stick', at:[66, -96]}); a.do('eat', 16.4 + i*0.25, 5.0, {side:sd, item:'stick', bites:2, per:2.4, snd:'squish', rest:[66, -96]}); }); S.mallows = st.map(s => s.m); }
  if (sn === 'cake') all.forEach((a, i) => { a.item('L', 'cake', itCupcake(G(), mc[i % mc.length])); a.do('eat', 4.0 + i*0.5, 6.0, {side:'L', item:'cake', per:2.8, snd:'squish'}); });
  if (cfg.festival) all.forEach((a, i) => a.do('dance', 12 + i*0.15, 9, {bpm:[1.0, 1.2, 0.9, 1.3, 1.1][i % 5]}));
  if (cfg.acts) cfg.acts(A, all);
  const TT = cfg.teaserT || 30;
  all.forEach((a, i) => { a.do('look', TT - 0.6, 6, {x:0, y:-10}); a.do('wow', TT + 0.2 + i*0.08, 1.4); a.do('wave', TT + 8 + i*0.1, 4.4); a.do('happy', TT + 12.6, 3, {mouth:'open'}); });
  S.H = hud(S);
  if (cfg.banner) S.H.banner(cfg.banner[0], cfg.banner[1], cfg.banner[2], '#7DC77A', 3.6), SFXB.levelup(S, cfg.banner[0]);
  if (cfg.next) S.H.card(TT, cfg.next, {tag:'✦ NEXT TIME: ' + cfg.nextTag + ' ✦', d:7.2, x:740, y:110});
  const steams = sn === 'mug' ? all.map(() => steam(S.L.fx, 2)) : [];
  const hearts = heartBursts(S.L.fx, [{t:10, x:960, y:680, n:5}, {t:TT + 9, x:960, y:660, n:6}]);
  const fw = cfg.festival ? burstFx(S.L.fx, [12, 13.4, 15, 16.6, 18.4, 20].map((t, i) => ({t, at:[300 + i*260, 160 + (i % 3)*60], col:['#FFE07A', '#FF9DB5', '#9FD8F7', '#C9A7FF'][i % 4], s:1.4}))) : null;
  if (cfg.festival) [12, 13.4, 15, 16.6, 18.4, 20].forEach((t, i) => { S.sfx(t, 'pop', 0.05, -0.6 + i*0.24); S.sfx(t + 0.1, 'sparkle', 0.03, -0.6 + i*0.24); });
  if (cfg.next) S.sfx(TT, 'chime', 0.03, 0, {f:1568});
  S.look = cfg.look || setLook([[0, 960, 740, 1.15], [TT - 2, 960, 740, 1.22], [TT + 1, 960, 700, 1.12], [45, 960, 720, 1.2]]);
  S.pre = u => S.L.update(u, cfg.upd ? cfg.upd(u) : {camX:960, fire:1});
  S.post = u => {
    if (S.mallows) S.mallows.forEach(m => m.setAttribute('fill', hexMix('#FFF7EE', '#E8B06A', sm((u - 2)/12))));
    all.forEach((a, i) => { if (steams[i]){ const p = paw(a.c, -1); steams[i](p[0], p[1] - 24, u + i, 0.5, 8); } });
    hearts(u); if (fw) fw(u);
    if (cfg.post) cfg.post(u, A);
    S.H.update(u); S.H.post(u);
  };
  return {A, all};
}

/* --- arrival / discovery: cfg = {loc, party, quest, tasks, look, acts, post} --- */
function arrival(S, cfg){
  S.L = cfg.loc(S.cam); const ly = S.L.chars;
  (cfg.amb || [['birds', 0.5], ['breeze', 0.6]]).forEach(a => S.amb(a[0], 0, 45, a[1]));
  const P = partyLine(S, ly, cfg.party, {cx: cfg.cx || 760, y: cfg.y || 980, enter: 1100, steps: cfg.steps});
  P.all.forEach((a, i) => { a.do('look', 9, 5, {x:6, y:-8}); a.do('wow', 9.6 + i*0.12, 1.4); });
  if (cfg.acts) cfg.acts(P);
  S.H = hud(S); addPlates(S, P, cfg.lv, u => u > 5 && u < (cfg.platesOff || 45));
  if (cfg.quest) S.H.quest(cfg.quest, cfg.tasks, 3.0, 44.6);
  S.look = cfg.look || setLook([[0, 700, 760, 1.1], [10, 900, 740, 1.05], [45, 960, 740, 1.1]]);
  S.pre = u => S.L.update(u, {camX: S.look(u)[0]});
  S.post = u => { if (cfg.post) cfg.post(u, P); S.H.update(u); S.H.post(u); };
  return P;
}
