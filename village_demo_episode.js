/* =====================================================================
   FUR FRIENDS — Sakura Village demo (30 s, not in the posting queue)
   Render:  python render.py village_demo output/village_demo.mp4
   Shows engine v4 characters + the new locVillage location.
   ===================================================================== */
const CAMX = u => lerp(860, 1080, sm(u/30));
const VD = scene(0, 30, {look: u => [CAMX(u), 825, 1.38 + 0.05*sm(u/30)]});
(function(){
  const S = VD;
  S.L = locVillage(S.cam, {});
  const ly = S.L.chars;
  S.amb('breeze', 0, 30, 0.6); S.amb('birds', 0, 30, 0.35);
  const base = {apron: true};
  const momo = actor(S, 'cat', {layer:ly, x:[[0,-340],[7.5,560],[22,560],[28,1500]], y:965, steps:'softstep', base});
  const pipi = actor(S, 'bunny', {layer:ly, x:[[0,-100],[7.9,800],[22.4,800],[28.4,1700]], y:975, steps:'softstep', base:{apron:true, phones:false}});
  const otto = actor(S, 'otter', {layer:ly, x:[[0,140],[8.3,1040],[22.8,1040],[28.8,1900]], y:965, steps:'softstep', base});
  const kuku = actor(S, 'squirrel', {layer:ly, x:[[0,380],[8.7,1280],[23.2,1280],[29.2,2100]], y:975, steps:'softstep', base});
  const all = [momo, pipi, otto, kuku];
  // arrive → wave hello
  all.forEach((a, i) => { a.do('wave', 8.8 + i*0.25, 2.2, {side: i % 2 ? 'L' : 'R'}); });
  // look up at the falling petals
  all.forEach((a, i) => { a.do('look', 11.4 + i*0.15, 3.2, {x:-2 + i*1.2, y:-9, tilt: i % 2 ? 6 : -6}); a.do('wow', 11.8 + i*0.2, 1.4); });
  pipi.do('arms', 15.0, 2.4, {L:[70, -170], R:[70, -170], eyes:'happy', mouth:'open'}); pipi.do('hop', 15.4, 0.5, {h:34});
  otto.do('cheer', 15.2, 2.0);
  kuku.do('point', 15.4, 2.2, {at:[100, -170]}); kuku.do('pose', 15.4, 2.2, {turn:0.8});
  momo.do('pose', 15.2, 2.6, {turn:-0.7, eyes:'happy', mouth:'smile'}); momo.do('nod', 15.6, 1.6);
  // giggle together, then head into the café
  all.forEach((a, i) => { a.do('laugh', 18.2 + i*0.12, 2.2); a.do('pose', 20.6, 1.6, {turn:0.9}); });
  S.hearts = heartBursts(S.L.fx, [{t:10.2, x:920, y:620, n:4}, {t:19.0, x:960, y:600, n:5}]);
  S.spark = sparkles(S.L.fx, [{t:12.0, x:900, y:520, n:8, r:220}]);
  S.sfx(9.0, 'chime', 0.03, 0, {f:1318.5}); S.sfx(12.0, 'sparkle', 0.05, 0);
  S.pre = u => S.L.update(u, {camX: CAMX(u)});
  S.post = u => { S.hearts(u); S.spark(u); };
})();
EPISODE({day: 'Preview', title: 'Sakura Village', dur: 30, scenes: [VD], chapters: [['Sakura Village', ICONS.sun]], thumb: 13, music: {seed: 13, bpm: 76}});
