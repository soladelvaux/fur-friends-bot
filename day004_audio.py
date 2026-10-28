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
def walk_steps(t0, keys, stride, gain, pan, soft=False):
    tt = np.arange(keys[0][0], keys[-1][0], 1/120)
    xs = np.array([Kf(x, keys) for x in tt]); ph = xs/stride; last = np.floor(ph[0]*2)
    for i in range(1, len(tt)):
        cur = np.floor(ph[i]*2)
        if cur != last and abs(xs[i] - xs[i-1]) > 0.05:
            s = bp(noise(0.09), 1500, 6000)*env_ad(int(0.09*SR), 0.004, 40) if soft else step()
            add(t0 + tt[i], norm(s), gain, pan)
        last = cur
def gull():
    d = 0.5; n = int(d*SR); tt = np.arange(n)/SR
    f = 1500*(1 - 0.45*tt/d) + 120*np.sin(TAU*24*tt)
    x = np.sin(TAU*np.cumsum(f)/SR) + 0.5*np.sin(2*TAU*np.cumsum(f)/SR)
    return norm(bp(x, 800, 4000) * np.sin(np.pi*tt/d)**0.8)
def flap(d=0.6):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(lp(noise(d), 900) * (0.4 + 0.6*np.abs(np.sin(TAU*2.5*tt))) * np.sin(np.pi*tt/d))
def splashS(d=0.8):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 500, 6000) * np.exp(-tt*5) * np.minimum(1, tt/0.01))
def scoop():
    d = 0.18; n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 900, 4500) * np.sin(np.pi*tt/d))
def pat():
    d = 0.08; n = int(d*SR); tt = np.arange(n)/SR
    return norm(lp(noise(d), 600) * np.exp(-tt*50))
def clap():
    d = 0.09; n = int(d*SR); return norm(bp(noise(d), 700, 3200) * env_ad(n, 0.0008, 60))
def ocean(lvl_low, lvl_high, period=7.0):
    sw = 0.5 + 0.5*np.sin(TAU*t/period - np.pi/2)
    lo = norm(lp(rng.standard_normal(N), 500)); hi = norm(bp(rng.standard_normal(N), 900, 6000))
    return lo*(lvl_low*(0.5 + 0.5*sw)), hi*(lvl_high*sw**2)
# --- scene envelopes
s1 = win(0, 45.3, 0.8); s2 = win(44.8, 90.3, 0.8); s3 = win(89.8, 135.3, 0.8); s4 = win(134.8, 180.5, 0.8)
# wind + birds on the trail
wind = norm(bp(rng.standard_normal(N), 150, 1200)) * (0.6 + 0.4*np.sin(TAU*t/9))
L += 0.03*wind*s1; R += 0.03*np.roll(wind, 3000)*s1
for st in [1.5, 6.0, 10.5, 16.0, 21.5, 25.0, 30.5, 36.0, 41.0]: bird_phrase(st, rng.uniform(0.035, 0.06), rng.uniform(-0.7, 0.7))
GX1 = [[0,300],[11,1370],[16.6,1370],[27.4,2600],[45,2600]]
for off, p in [(330, 0.3), (140, 0.1), (-60, -0.1), (-260, -0.3)]: walk_steps(0, [[k[0], k[1] + off] for k in GX1], 86, 0.032, p)
add(12.0, rustle(0.3), 0.04, 0.2); chime(15.0, 0.03)
add(5.0, shutter(), 0.11, -0.3); add(34.4, shutter(), 0.11, -0.3)
chime(28.6, 0.035, 1318.5)
for s in [38.0, 38.6, 39.0]: add(s + 0.4, thump(115, 0.15), 0.05, 0.0)
# ocean (fades in near the end of scene 1 viewpoint)
o_lo, o_hi = ocean(1.0, 1.0)
olv = np.clip((t - 26)/6, 0, 1)*0.35*s1 + 1.0*s2 + 1.3*s3 + 0.9*s4
L += (0.045*o_lo + 0.04*o_hi)*olv; R += (0.045*np.roll(o_lo, 5000) + 0.04*np.roll(o_hi, 7000))*olv
for st in np.arange(46, 135, 6.5): add(st + rng.uniform(0, 2), gull(), 0.035, rng.uniform(-0.7, 0.7))
# scene 2 picnic
C = 45
add(C + 2.4, flap(1.0), 0.06, 0); 
for k in range(4): add(C + 3.4 + k*0.9, flap(0.6), 0.035, 0)
add(C + 7.6, flap(1.0), 0.07, 0); add(C + 8.3, thump(90, 0.3), 0.05, 0)
for i in range(4): add(C + 12.6 + i*0.6 + 0.75, pat(), 0.05, -0.4 + 0.27*i)
add(C + 12.4, crinkle(0.5), 0.04, 0)
for i in range(4):
    p = -0.5 + 0.33*i
    for b in range(4):
        st = 17.0 + i*0.45 + 0.8 + i*0.8 + b*3.2 + 1.0
        if st < 31.4: add(C + st, crunch(), 0.09, p); chew_seq(C + st + 0.2, 1.4, 0.025, p)
add(C + 37.6, shutter(), 0.12, 0.4); chime(C + 38.2, 0.035)
# scene 3 beach
C = 90
for k in range(18): add(C + 2.0 + k*0.27, scoop(), 0.05, 0.2)
for k in range(12): add(C + 5.6 + k*0.26, pat(), 0.05, -0.2)
for s in [12.0, 17.0]: add(C + s, thump(120, 0.2), 0.08, 0); add(C + s + 0.1, scoop(), 0.06, 0)
for s in [4.0, 7.6, 12.2, 17.2, 19.6, 33.0]: chime(C + s + 0.1, 0.02, 1568.0)
add(C + 8.1, splashS(1.0), 0.1, 0.6); add(C + 11.4, splashS(0.7), 0.07, 0.6)
walk_steps(C, [[22,1500],[24,1480],[28.6,1300]], 70, 0.03, 0.5, soft=True)
add(C + 31.0, whoosh(0.4, 900, 2600), 0.02, 0.3); add(C + 33.0, pat(), 0.05, 0)
k = 0
while 33.4 + k/4.8 < 35.4: add(C + 33.4 + k/4.8, clap(), 0.04, -0.2); k += 1
add(C + 36.0, whoosh(3.0, 200, 1600), 0.08, 0); add(C + 37.4, splashS(1.6), 0.06, 0)
chime(C + 40.6, 0.04)
for s in [40.0, 41.0]: add(C + s + 0.45, thump(115, 0.15), 0.05, 0.2)
for s in [8, 16, 24]: add(C + s, page(), 0.05, -0.6)
# scene 4 sunset
C = 135
crick = np.zeros(N)
for k in range(int(45/0.62)):
    s0 = int((C + 12 + k*0.62)*SR)
    for p_ in range(3):
        n = int(0.045*SR); tt = np.arange(n)/SR; s = s0 + int(p_*0.07*SR)
        if s + n < N: crick[s:s+n] += np.sin(TAU*4300*tt)*np.sin(np.pi*tt/0.045)
L += 0.006*crick*s4; R += 0.006*np.roll(crick, 700)*s4
for i in range(4):
    for a in [2.0 + i*1.3, 15 + i*1.5]: add(C + a + 0.9, sip(0.45), 0.06, -0.5 + 0.33*i)
add(C + 10.4, shutter(), 0.1, 0.17); chime(C + 14.0, 0.03); chime(C + 22.0, 0.025, 1318.5); chime(C + 35.0, 0.03)
for i, yt in enumerate([33.0, 27.5, 31.0, 25.5]): add(C + yt, breath(1.5, 200, 900), 0.045, -0.5 + 0.33*i)
for s in [45, 90, 135]: add(s - 0.6, whoosh(1.2, 300, 1400), 0.016, 0); chime(s - 0.1, 0.014, 784.0)
mus = make_lofi(DUR, seed=4, key=2, bpm=76, prog=1)
mus *= np.clip(t/3, 0, 1)*np.clip((DUR - t)/5, 0, 1)*(1 - 0.15*s4)
mix = np.stack([L, R]); mix = mix/np.max(np.abs(mix))*0.85 + mus*0.36
mix *= np.clip(t/1.2, 0, 1)*np.clip((DUR - t)/3.5, 0, 1)
mix = np.tanh(mix*1.1)/np.tanh(1.1); mix = mix/np.max(np.abs(mix))*0.85
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix.T*32767).astype(np.int16).tobytes())
for a in range(0, 180, 15):
    s = mix[:, a*SR:(a+15)*SR]; print(f'{a:3d}s {20*np.log10(np.sqrt((s**2).mean())+1e-9):6.1f} dB')
