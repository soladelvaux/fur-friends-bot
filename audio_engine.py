"""Generic Fur Friends audio: reads an episode's AUDIO timeline (JSON from the page) and writes a WAV.
usage: python audio_engine.py timeline.json out.wav
timeline = {dur, music:{seed,key,bpm,prog,gain}, amb:[{type,t0,t1,gain}], sfx:[{t,type,gain,pan,...}]}
"""
import os, sys, json
ENGINE = os.path.dirname(os.path.abspath(__file__))
import numpy as np
exec(open(os.path.join(ENGINE, 'audio_kit.py')).read())
sys.path.insert(0, ENGINE)
from lofi import make_lofi

TL = json.load(open(sys.argv[1]))
if abs(TL.get('dur', 180) - DUR) > 0.01:
    DUR = float(TL['dur']); N = int(SR*DUR); t = np.arange(N)/SR; L = np.zeros(N); R = np.zeros(N)

# ---------------- extra one-shots ----------------
def clap():
    d = 0.09; n = int(d*SR); return norm(bp(noise(d), 700, 3200) * env_ad(n, 0.0008, 60))
def softstep():
    d = 0.09; return norm(bp(noise(d), 1500, 6000)*env_ad(int(d*SR), 0.004, 40))
def grassstep():
    d = 0.12; n = int(d*SR); return norm(bp(noise(d), 1200, 7000)*env_ad(n, 0.01, 30)*(0.6 + 0.4*np.abs(np.sin(np.arange(n)/SR*TAU*90))))
def woodstep():
    d = 0.1; n = int(d*SR); tt = np.arange(n)/SR
    return norm(np.sin(TAU*160*tt)*np.exp(-tt*45) + 0.5*lp(noise(d), 1200)*np.exp(-tt*50))
def knock(f=420):
    d = 0.12; n = int(d*SR); tt = np.arange(n)/SR
    return norm(np.sin(TAU*f*tt)*np.exp(-tt*38) + 0.5*np.sin(TAU*f*2.7*tt)*np.exp(-tt*60) + 0.3*bp(noise(d), 800, 3000)*np.exp(-tt*90))
def flap(d=0.6):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(lp(noise(d), 900) * (0.4 + 0.6*np.abs(np.sin(TAU*2.5*tt))) * np.sin(np.pi*tt/d))
def splash(d=0.8):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 500, 6000) * np.exp(-tt*5) * np.minimum(1, tt/0.01))
def scoop():
    d = 0.18; n = int(d*SR); tt = np.arange(n)/SR; return norm(bp(noise(d), 900, 4500) * np.sin(np.pi*tt/d))
def pat():
    d = 0.08; n = int(d*SR); tt = np.arange(n)/SR; return norm(lp(noise(d), 600) * np.exp(-tt*50))
def squish():
    d = 0.22; n = int(d*SR); tt = np.arange(n)/SR
    return norm(lp(noise(d), 900)*np.sin(np.pi*tt/d)**1.5*(0.7 + 0.3*np.sin(TAU*30*tt)))
def pop():
    d = 0.06; n = int(d*SR); tt = np.arange(n)/SR; return norm(np.sin(TAU*900*(1 - 0.5*tt/d)*tt)*np.exp(-tt*70))
def pour(d=1.5):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 400, 2500)*(0.7 + 0.3*np.sin(TAU*7*tt))*np.minimum(1, tt/0.1)*np.minimum(1, (d - tt)/0.2))
def sizzle(d=2.0):
    n = int(d*SR); tt = np.arange(n)/SR; return norm(hp(noise(d), 3000)*(0.6 + 0.4*np.abs(lp(rng.standard_normal(n), 40))*5).clip(0, 1.4)*np.minimum(1, tt/0.1)*np.minimum(1, (d - tt)/0.3))
def ding(f=2093):
    return bell(f, 1.6)
def oven_ding():
    x = bell(1760, 2.0); y = bell(2217, 2.0); return norm(x + 0.7*y)
def zipper(d=0.9):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 1500, 7000)*(0.5 + 0.5*np.sign(np.sin(TAU*55*tt)))*np.sin(np.pi*tt/d))
def rattle(d=0.6):
    x = np.zeros(int(d*SR)); k = 0.0
    while k < d - 0.05:
        c = clink(rng.uniform(2600, 3600), 0.05); s = int(k*SR); x[s:s+len(c)] += c[:len(x)-s]; k += rng.uniform(0.06, 0.1)
    return norm(x)
def reel(d=1.2):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(np.sign(np.sin(TAU*24*tt))*bp(noise(d), 2000, 6000)*0.5 + 0.0)
def bloop():
    d = 0.25; n = int(d*SR); tt = np.arange(n)/SR; f = 300 + 900*tt/d
    return norm(np.sin(TAU*np.cumsum(f)/SR)*np.sin(np.pi*tt/d))
def sparkle():
    x = np.zeros(int(1.0*SR))
    for i, f in enumerate([2637, 3136, 3520, 4186]):
        b = bell(f, 0.6); s = int(i*0.06*SR); x[s:s+len(b)] += b[:len(x)-s]*(1 - 0.15*i)
    return norm(x)
def quack():
    d = 0.18; n = int(d*SR); tt = np.arange(n)/SR; f = 520*(1 - 0.3*tt/d)
    x = np.sign(np.sin(TAU*np.cumsum(f)/SR))*0.6 + np.sin(TAU*np.cumsum(f)*2/SR)*0.4
    return norm(bp(x, 600, 2600)*np.sin(np.pi*tt/d)**0.6)
def owl():
    d = 0.9; n = int(d*SR); tt = np.arange(n)/SR
    e = np.exp(-((tt - 0.15)**2)/0.004) + 0.8*np.exp(-((tt - 0.55)**2)/0.02)
    return norm(np.sin(TAU*380*tt*(1 - 0.05*tt))*e)
def crackle_pop():
    d = 0.03; n = int(d*SR); return norm(bp(noise(d), 1500, 7000)*np.exp(-np.arange(n)/SR*200))
def tok():
    return knock(rng.uniform(1300, 1600))
def swish(d=0.4):
    return whoosh(d, 900, 2600)
def kite_flutter(d=1.5):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 300, 1500)*(0.5 + 0.5*np.abs(np.sin(TAU*9*tt)))*np.sin(np.pi*tt/d))
def train_horn():
    d = 1.4; n = int(d*SR); tt = np.arange(n)/SR
    x = sum(np.sin(TAU*f*tt) for f in (330, 415, 494))
    return norm(lp(np.sign(x)*0.3 + x*0.7, 2000)*np.minimum(1, tt/0.08)*np.minimum(1, (d - tt)/0.3))
def door_chime():
    x = np.zeros(int(2.4*SR))
    for i, f in enumerate([1568, 1319, 1175]):
        b = bell(f, 1.8); s = int(i*0.25*SR); x[s:s+len(b)] += b[:len(x)-s]
    return norm(x)
def pillow_hit():
    d = 0.25; n = int(d*SR); tt = np.arange(n)/SR
    return norm(lp(noise(d), 700)*np.exp(-tt*16)*np.minimum(1, tt/0.005))
def click():
    d = 0.03; n = int(d*SR); tt = np.arange(n)/SR; return norm(np.sin(TAU*2400*tt)*np.exp(-tt*300) + 0.4*hp(noise(d), 3000)*np.exp(-tt*300))

def chew_one(o, gain, pan, st):
    chew_seq(st, o.get('d', 1.4), gain, pan)
def chime_one(o, gain, pan, st):
    chime(st, gain, o.get('f', 1046.5))
SFX = {
    'step': lambda o: step(), 'softstep': lambda o: softstep(), 'grassstep': lambda o: grassstep(), 'woodstep': lambda o: woodstep(),
    'sip': lambda o: sip(o.get('d', 0.45)), 'slurp': lambda o: slurp(o.get('d', 0.7)), 'crunch': lambda o: crunch(),
    'clink': lambda o: clink(o.get('f', 2300), o.get('d', 0.35)), 'thump': lambda o: thump(o.get('f', 110), o.get('d', 0.18)),
    'bell': lambda o: bell(o.get('f', 1318.5), o.get('d', 2.0)), 'shutter': lambda o: shutter(),
    'whoosh': lambda o: whoosh(o.get('d', 0.35), o.get('f0', 600), o.get('f1', 3000)), 'page': lambda o: page(),
    'rustle': lambda o: rustle(o.get('d', 0.45)), 'crinkle': lambda o: crinkle(o.get('d', 0.5)), 'clap': lambda o: clap(),
    'splash': lambda o: splash(o.get('d', 0.8)), 'plop': lambda o: plop(), 'pop': lambda o: pop(), 'knock': lambda o: knock(o.get('f', 420)),
    'tok': lambda o: tok(), 'beep': lambda o: beep(o.get('f', 1850), o.get('d', 0.13)), 'chop': lambda o: chop(), 'whisk': lambda o: whisk_clink(),
    'hiss': lambda o: hiss(o.get('d', 1.0)), 'breath': lambda o: breath(o.get('d', 1.5), 200, 900), 'scoop': lambda o: scoop(), 'pat': lambda o: pat(),
    'flap': lambda o: flap(o.get('d', 0.6)), 'squish': lambda o: squish(), 'pour': lambda o: pour(o.get('d', 1.5)), 'sizzle': lambda o: sizzle(o.get('d', 2.0)),
    'ding': lambda o: ding(o.get('f', 2093)), 'oven': lambda o: oven_ding(), 'zipper': lambda o: zipper(o.get('d', 0.9)), 'rattle': lambda o: rattle(o.get('d', 0.6)),
    'reel': lambda o: reel(o.get('d', 1.2)), 'bloop': lambda o: bloop(), 'sparkle': lambda o: sparkle(), 'quack': lambda o: quack(), 'owl': lambda o: owl(),
    'trickle': lambda o: trickle(o.get('d', 1.5)), 'plink': lambda o: plink(o.get('f', 900)), 'swish': lambda o: swish(o.get('d', 0.4)),
    'kite': lambda o: kite_flutter(o.get('d', 1.5)), 'horn': lambda o: train_horn(), 'doorbell': lambda o: door_chime(), 'pillow': lambda o: pillow_hit(),
    'click': lambda o: click(), 'jar': lambda o: jar_clink(), 'scratch': lambda o: scratch(o.get('d', 0.6)), 'printer': lambda o: printer(o.get('d', 1.0)),
}

# ---------------- ambiences (each returns mono-ish pair at unit level) ----------------
def a_room():
    x = norm(lp(rng.standard_normal(N), 500)); return 0.007*x, 0.007*np.roll(x, 999)
def a_birds(t0, t1, g):
    st = t0 + rng.uniform(0.5, 2)
    while st < t1 - 2: bird_phrase(st, rng.uniform(0.03, 0.055)*g, rng.uniform(-0.7, 0.7)); st += rng.uniform(3.0, 6.5)
    return None
def a_wind():
    w = norm(bp(rng.standard_normal(N), 150, 1200))*(0.6 + 0.4*np.sin(TAU*t/9)); return 0.03*w, 0.03*np.roll(w, 3000)
def a_breeze():
    w = norm(bp(rng.standard_normal(N), 300, 2500))*(0.5 + 0.5*np.sin(TAU*t/11)**2); return 0.016*w, 0.016*np.roll(w, 2200)
def a_rain():
    r1 = norm(hp(rng.standard_normal(N), 1200)); r2 = norm(bp(rng.standard_normal(N), 250, 1100))
    r = (0.65*r1 + 0.35*r2)*(0.85 + 0.15*np.sin(TAU*t/8)); return 0.06*r, 0.06*np.roll(r, 4410)
def a_ocean():
    sw = 0.5 + 0.5*np.sin(TAU*t/7 - np.pi/2)
    lo = norm(lp(rng.standard_normal(N), 500)); hi = norm(bp(rng.standard_normal(N), 900, 6000))
    a = 0.045*lo*(0.5 + 0.5*sw) + 0.04*hi*sw**2; return a, np.roll(a, 6000)
def a_lake():
    sw = 0.5 + 0.5*np.sin(TAU*t/3.3)
    x = norm(bp(rng.standard_normal(N), 300, 2200))*(0.4 + 0.6*sw**3); return 0.02*x, 0.02*np.roll(x, 3300)
def a_stream():
    x = norm(bp(rng.standard_normal(N), 1200, 7000))*(0.75 + 0.25*np.abs(lp(rng.standard_normal(N), 6))*8).clip(0.4, 1.3)
    return 0.012*x, 0.012*np.roll(x, 1800)
def a_night():
    crick = np.zeros(N)
    for k in range(int(DUR/0.62)):
        s0 = int(k*0.62*SR)
        for p_ in range(3):
            n = int(0.045*SR); tt = np.arange(n)/SR; s = s0 + int(p_*0.07*SR)
            if s + n < N: crick[s:s+n] += np.sin(TAU*4300*tt)*np.sin(np.pi*tt/0.045)
    base = norm(lp(rng.standard_normal(N), 300))*0.004
    return 0.006*crick + base, 0.006*np.roll(crick, 700) + np.roll(base, 500)
def a_fire():
    x = norm(lp(rng.standard_normal(N), 400))*(0.7 + 0.3*np.sin(TAU*t/2.3))*0.025
    c = np.zeros(N)
    for _ in range(int(DUR*9)):
        s = rng.integers(0, N - 2000); p = crackle_pop()*rng.uniform(0.2, 1); c[s:s+len(p)] += p
    return x + 0.02*c, np.roll(x, 777) + 0.02*np.roll(c, 1500)
def a_cafe():
    m = norm(bp(rng.standard_normal(N), 250, 1800))*(0.7 + 0.3*np.abs(lp(rng.standard_normal(N), 3))*10).clip(0.4, 1.2)
    c = np.zeros(N)
    for _ in range(int(DUR/3)):
        s = rng.integers(0, N - SR); p = clink(rng.uniform(2400, 4200), 0.3)*rng.uniform(0.2, 0.7); c[s:s+len(p)] += p
    return 0.012*m + 0.01*c, 0.012*np.roll(m, 4000) + 0.01*np.roll(c, 2500)
def a_train():
    rum = norm(lp(rng.standard_normal(N), 180))*(0.85 + 0.15*np.sin(TAU*t/5))
    cl = np.zeros(N); per = 1.25
    for k in range(int(DUR/per)):
        for dt in (0, 0.16):
            s = int((k*per + dt)*SR); p = knock(rng.uniform(160, 210))
            if s + len(p) < N: cl[s:s+len(p)] += p
    return 0.05*rum + 0.03*cl, 0.05*np.roll(rum, 900) + 0.03*np.roll(cl, 300)
def a_aquarium():
    hum = norm(lp(rng.standard_normal(N), 220))*0.03 + 0.004*np.sin(TAU*60*t)
    b = np.zeros(N)
    for _ in range(int(DUR*2.2)):
        s = rng.integers(0, N - SR); p = plop()*rng.uniform(0.1, 0.5); b[s:s+len(p)] += p
    return hum + 0.025*b, np.roll(hum, 1200) + 0.025*np.roll(b, 3000)
def a_oven():
    h = norm(lp(rng.standard_normal(N), 260))*0.02 + 0.003*np.sin(TAU*100*t); return h, np.roll(h, 600)
def a_clock():
    x = np.zeros(N); tk = tick()
    for s in range(int(DUR)):
        a = int(s*SR); x[a:a+len(tk)] += tk[:N-a]
    return 0.02*x, 0.012*x
def a_leaves():
    x = norm(bp(rng.standard_normal(N), 2500, 9000))*(np.abs(lp(rng.standard_normal(N), 2))*12).clip(0, 1.2); return 0.012*x, 0.012*np.roll(x, 2600)
def a_bees():
    f = 220 + 15*np.sin(TAU*t*0.7); ph = np.cumsum(f)/SR
    x = np.sin(TAU*ph) + 0.5*np.sin(2*TAU*ph); x = lp(x, 900)*(0.3 + 0.7*np.sin(TAU*t/13)**4); return 0.004*x, 0.004*np.roll(x, 5000)
def a_hum():
    h = norm(lp(rng.standard_normal(N), 160))*0.02; return h, np.roll(h, 400)
def a_sprinkler():
    x = norm(bp(rng.standard_normal(N), 2500, 9000))*(0.7 + 0.3*np.sign(np.sin(TAU*1.6*t))); return 0.014*x, 0.014*np.roll(x, 2000)
AMB = {'room': a_room, 'wind': a_wind, 'breeze': a_breeze, 'rain': a_rain, 'ocean': a_ocean, 'lake': a_lake, 'stream': a_stream,
       'night': a_night, 'fire': a_fire, 'cafe': a_cafe, 'train': a_train, 'aquarium': a_aquarium, 'oven': a_oven, 'clock': a_clock,
       'leaves': a_leaves, 'bees': a_bees, 'hum': a_hum, 'sprinkler': a_sprinkler}
cache = {}
for a in TL.get('amb', []):
    ty, t0, t1, g = a['type'], a['t0'], a['t1'], a.get('gain', 1.0)
    if ty == 'birds': a_birds(t0, t1, g); continue
    if ty not in AMB: print('unknown ambience', ty); continue
    if ty not in cache: cache[ty] = AMB[ty]()
    w = win(t0, t1, a.get('fade', 0.8))*g
    L += cache[ty][0]*w; R += cache[ty][1]*w
for e in TL.get('sfx', []):
    ty = e['type']; g = e.get('gain', 0.05); p = e.get('pan', 0.0); st = e['t']
    if st >= DUR - 0.1: continue
    if ty == 'chew': chew_one(e, g, p, st); continue
    if ty == 'chime': chime_one(e, g, p, st); continue
    if ty == 'birds': bird_phrase(st, g, p); continue
    if ty not in SFX: print('unknown sfx', ty); continue
    try: add(st, SFX[ty](e), g, p)
    except Exception as ex: print('sfx error', ty, ex)

M = TL.get('music', {})
mus = make_lofi(DUR, seed=M.get('seed', 5), key=M.get('key', 0), bpm=M.get('bpm', 74), sr=SR, prog=M.get('prog', None))
lvl = np.clip(t/3, 0, 1)*np.clip((DUR - t)/5, 0, 1)
for d in M.get('duck', []):   # [t0, t1, amount]
    lvl *= 1 - d[2]*win(d[0], d[1], 1.5)
mus *= lvl
mix = np.stack([L, R])
mix = mix/np.max(np.abs(mix))*0.85 + mus*M.get('gain', 0.36)
mix *= np.clip(t/1.2, 0, 1)*np.clip((DUR - t)/3.5, 0, 1)
mix = np.tanh(mix*1.1)/np.tanh(1.1); mix = mix/np.max(np.abs(mix))*0.85
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix.T*32767).astype(np.int16).tobytes())
print('audio:', len(TL.get('sfx', [])), 'sfx,', len(TL.get('amb', [])), 'ambience layers')
for a in range(0, int(DUR), 15):
    s = mix[:, a*SR:(a+15)*SR]; print(f'{a:3d}s {20*np.log10(np.sqrt((s**2).mean())+1e-9):6.1f} dB')
