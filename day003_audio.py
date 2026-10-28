import os, sys
ENGINE = os.path.dirname(os.path.abspath(__file__))
import sys, numpy as np
exec(open(os.path.join(ENGINE,'audio_kit.py')).read())
sys.path.insert(0, ENGINE)
from lofi import make_lofi

def smt(x): x = np.clip(x, 0, 1); return x*x*x*(x*(x*6-15)+10)
def Kf(tq, keys):
    if tq <= keys[0][0]: return keys[0][1]
    if tq >= keys[-1][0]: return keys[-1][1]
    for a, b in zip(keys[:-1], keys[1:]):
        if a[0] <= tq < b[0]: return a[1] + (b[1]-a[1])*smt((tq-a[0])/(b[0]-a[0]))
    return keys[-1][1]
def walk_steps(t0, keys, stride, gain, pan):
    tt = np.arange(keys[0][0], keys[-1][0], 1/120)
    xs = np.array([Kf(x, keys) for x in tt]); ph = xs/stride; last = np.floor(ph[0]*2)
    for i in range(1, len(tt)):
        cur = np.floor(ph[i]*2)
        if cur != last and abs(xs[i] - xs[i-1]) > 0.05: add(t0 + tt[i], step(), gain, pan)
        last = cur
def knock(f=420):
    d = 0.12; n = int(d*SR); tt = np.arange(n)/SR
    return norm(np.sin(TAU*f*tt)*np.exp(-tt*38) + 0.5*np.sin(TAU*f*2.7*tt)*np.exp(-tt*60) + 0.3*bp(noise(d), 800, 3000)*np.exp(-tt*90))
def flap(d=0.6):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(lp(noise(d), 900) * (0.4 + 0.6*np.abs(np.sin(TAU*2.5*tt))) * np.sin(np.pi*tt/d))
def dice_shake(d):
    x = np.zeros(int(d*SR)); k = 0.0
    while k < d - 0.05:
        c = clink(rng.uniform(2600, 3600), 0.05); s = int(k*SR); x[s:s+len(c)] += c[:len(x)-s]; k += rng.uniform(0.07, 0.11)
    return norm(x)
def dice_roll():
    x = np.zeros(int(0.9*SR)); k = 0.0; g = 1.0
    while k < 0.8:
        c = knock(rng.uniform(700, 1100)); s = int(k*SR); e = min(len(x), s + len(c)); x[s:e] += c[:e-s]*g; k += rng.uniform(0.06, 0.16); g *= 0.8
    return norm(x)
def tok(): return knock(rng.uniform(1300, 1600))
def clap():
    d = 0.09; n = int(d*SR)
    return norm(bp(noise(d), 700, 3200) * env_ad(n, 0.0008, 60))
def thunder(d=4.0):
    n = int(d*SR); tt = np.arange(n)/SR
    rum = lp(noise(d), 160) * (np.exp(-tt*0.9) + 0.6*np.exp(-((tt-0.6)**2)/0.08))
    return norm(rum)

# ---------------- RAIN bed (scenes 1–3, fades out in scene 4) ----------------
rain_amt = np.where(t < 135, 1.0, np.clip(1 - (t - 135)/7, 0, 1))
in_fort = win(90, 135.2, 0.6)
r1 = norm(hp(rng.standard_normal(N), 1200)); r2 = norm(bp(rng.standard_normal(N), 250, 1100))
rain = (0.65*r1 + 0.35*r2) * (0.85 + 0.15*np.sin(TAU*t/8))
rain_lvl = 0.06*rain_amt*(1 - 0.45*in_fort)
L += rain*rain_lvl; R += np.roll(rain, 4410)*rain_lvl
# muffled extra low rain in the fort
mf = norm(lp(rng.standard_normal(N), 700))*0.03*in_fort
L += mf; R += np.roll(mf, 2000)
# drips on the window (scenes 1–2)
for k in range(260):
    st = rng.uniform(0, 90)
    add(st, plink(rng.uniform(1500, 2800))*0.6, 0.012, rng.uniform(0.2, 0.9))
for k in range(30):
    st = rng.uniform(135, 145); add(st, plink(rng.uniform(1100, 1900)), 0.015, rng.uniform(0.2, 0.8))
# gentle thunder
add(17.6, thunder(4.5), 0.12, 0.0)
add(62.0, thunder(3.5), 0.05, 0.3)
add(108.0, thunder(3.5), 0.035, -0.2)
room = norm(lp(rng.standard_normal(N), 500))
L += 0.007*room; R += 0.007*np.roll(room, 999)
tk = tick()
for s in list(range(1, 45)) + list(range(46, 90)): add(s, tk, 0.02, -0.25)

# ---------------- SCENE 1 ----------------
add(5.6, breath(1.6, 200, 900), 0.05, 0.0)
for s in [3.0, 11.0]: add(s, clink(2100, 0.25), 0.03, 0.25); add(s + 0.9, sip(0.45), 0.08, 0.25)
add(11.0, shutter(), 0.11, 0.5)
for k in range(6):
    t0 = 2.5 + k*2.4
    if t0 < 17: add(t0 + 0.1, whoosh(0.3, 900, 2200), 0.012, -0.6); add(t0 + 1.15, thump(260, 0.07), 0.025, -0.6)
for s, p in [(21.8 + 0.9, 0.3), (22.6 + 0.9, 0.5)]: add(s, thump(110, 0.18), 0.09, p)
walk_steps(0, [[23.0,1150],[25.6,1150]], 86, 0.03, 0.25)
walk_steps(0, [[23.4,330],[26.8,820]], 80, 0.04, -0.4)
add(28.5, rustle(0.6), 0.03, 0.0)
chime(36.4, 0.04, 1568.0)
for s in [38.0, 38.6, 39.2]: add(s, thump(115, 0.15), 0.06, 0.0)
chime(32.0, 0.025)

# ---------------- SCENE 2 (fort building) ----------------
C2 = 45
add(C2 + 3.6, flap(1.0), 0.07, -0.1)
for k in range(10): add(C2 + 4.6 + k*0.9, flap(0.7), 0.035, -0.1)
add(C2 + 14.0, flap(1.2), 0.08, -0.1); add(C2 + 14.6, thump(90, 0.3), 0.05, -0.1)
walk_steps(C2, [[15.2,1330],[16.6,2060]], 80, 0.035, 0.6)
walk_steps(C2, [[17.4,2060],[19.6,820]], 80, 0.035, 0.3)
walk_steps(C2, [[21.0,820],[22.8,1330]], 80, 0.035, 0.3)
add(C2 + 20.9, thump(140, 0.2), 0.07, -0.1); add(C2 + 20.9, rustle(0.4), 0.03, -0.1)
walk_steps(C2, [[23.6,1120],[25.4,900]], 86, 0.035, 0.1)
for i in range(12): add(C2 + 27.0 + i*0.28, bell(1318.5*2**((i % 5)*2/12), 0.5), 0.012, -0.4 + 0.07*i)
chime(C2 + 15.0, 0.035, 1318.5); chime(C2 + 30.8, 0.035)
for s in [1.4, 31.0]: add(C2 + s + 0.5, thump(115, 0.15), 0.05, 0.3)
walk_steps(C2, [[31.8,1330],[34.4,660]], 80, 0.03, 0.0)
walk_steps(C2, [[34.2,900],[35.8,640]], 86, 0.03, 0.0)
walk_steps(C2, [[36.0,900],[38.2,640]], 86, 0.03, 0.0)
walk_steps(C2, [[38.6,340],[40.6,560]], 86, 0.03, -0.3)
add(C2 + 42.0, rustle(0.6), 0.03, -0.1)

# ---------------- SCENE 3 (game in the fort) ----------------
C3 = 90
TURNS = [(2, 4.0, 3), (3, 10.0, 5), (1, 16.0, 2), (0, 22.0, 4), (3, 28.0, 4)]
pans = [-0.5, -0.17, 0.17, 0.5]
for p, t0, n in TURNS:
    add(C3 + t0, dice_shake(1.15), 0.05, pans[p])
    add(C3 + t0 + 1.25, dice_roll(), 0.07, 0.0)
    for k in range(n): add(C3 + t0 + 2.1 + k*0.38 + 0.19, tok(), 0.05, -0.3 + 0.6*k/max(1, n))
for (a, b), o in zip([[7.5, 9.5], [12.5, 14.5], [19.0, 21.0], [33.0, 35.0], [35.5, 37.5]], [0, 1, 2, 0, 1]):
    add(C3 + a + 0.9, sip(0.45), 0.07, pans[o])
chime(C3 + 30.6, 0.045)
k = 0
while 30.8 + k/4.8 < 35.6: add(C3 + 30.8 + k/4.8, clap(), 0.04, -0.2); k += 1
for s in [30.8, 31.6, 32.4]: add(C3 + s + 0.4, thump(115, 0.15), 0.06, 0.5)
add(C3 + 38.0, breath(1.6, 200, 900), 0.05, -0.17)

# ---------------- SCENE 4 (rainbow) ----------------
C4 = 135
for i, ht in enumerate([11.8, 11.2, 10.0, 10.6]): add(C4 + ht + 0.9, thump(115, 0.16), 0.07, -0.4 + 0.27*i)
for st in [4.0, 8.5, 14.0, 20.0, 27.0, 33.5, 40.0]: bird_phrase(C4 + st, rng.uniform(0.035, 0.06), rng.uniform(-0.3, 0.7))
chime(C4 + 13.6, 0.04, 1046.5)
add(C4 + 19.4, shutter(), 0.11, 0.17)
chime(C4 + 33.0, 0.03)
for s in [45, 90, 135]: add(s - 0.6, whoosh(1.2, 300, 1400), 0.016, 0.0); chime(s - 0.1, 0.014, 784.0)

# ---------------- ORIGINAL LOFI ----------------
mus = make_lofi(DUR, seed=3, key=-3, bpm=74, sr=SR, prog=0)
lvl = np.clip(t/3, 0, 1) * np.clip((DUR - t)/5, 0, 1) * (0.9 + 0.1*in_fort)
mus *= lvl

mix = np.stack([L, R])
mix = mix/np.max(np.abs(mix))*0.85 + mus*0.36
mix *= np.clip(t/1.2, 0, 1) * np.clip((DUR - t)/3.5, 0, 1)
mix = np.tanh(mix*1.1)/np.tanh(1.1)
mix = mix/np.max(np.abs(mix))*0.85
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix.T*32767).astype(np.int16).tobytes())
for a in range(0, 180, 15):
    s = mix[:, a*SR:(a+15)*SR]; print(f'{a:3d}s {20*np.log10(np.sqrt((s**2).mean())+1e-9):6.1f} dB')
