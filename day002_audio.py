import os, sys
ENGINE = os.path.dirname(os.path.abspath(__file__))
import sys, numpy as np
exec(open(os.path.join(ENGINE,'audio_kit.py')).read().replace("DUR = 180.0", "DUR = 180.0"))

def smt(x): x = np.clip(x, 0, 1); return x*x*x*(x*(x*6-15)+10)
def Kf(tq, keys):
    if tq <= keys[0][0]: return keys[0][1]
    if tq >= keys[-1][0]: return keys[-1][1]
    for a, b in zip(keys[:-1], keys[1:]):
        if a[0] <= tq < b[0]: return a[1] + (b[1]-a[1])*smt((tq-a[0])/(b[0]-a[0]))
    return keys[-1][1]
def walk_steps(t0, keys, stride, gain, pan, offset=0.0, dur=None):
    """footstep each time the walk phase passes a half cycle"""
    tt = np.arange(keys[0][0], keys[-1][0], 1/120)
    xs = np.array([Kf(x, keys) for x in tt]); ph = xs/stride
    last = np.floor(ph[0]*2)
    for i in range(1, len(tt)):
        cur = np.floor(ph[i]*2)
        if cur != last and abs(xs[i] - xs[i-1]) > 0.05:
            add(t0 + tt[i] + offset, step(), gain, pan)
        last = cur
def babble(st, d, base, gain, pan):
    k = 0.0
    while k < d:
        sd = rng.uniform(0.07, 0.13); n = int(sd*SR); tt = np.arange(n)/SR
        f = base*rng.choice([1, 1.12, 1.25, 1.33, 1.5])*(1 + 0.08*np.sin(TAU*8*tt))
        x = (np.sin(TAU*np.cumsum(f)/SR) + 0.4*np.sin(2*TAU*np.cumsum(f)/SR)) * np.sin(np.pi*tt/sd)**1.2
        add(st + k, lp(x, 2500), gain, pan); k += sd + rng.uniform(0.03, 0.09)
def boing(d=0.35, f0=600, f1=180):
    n = int(d*SR); tt = np.arange(n)/SR
    f = f0*(f1/f0)**(tt/d) * (1 + 0.06*np.sin(TAU*28*tt))
    return np.sin(TAU*np.cumsum(f)/SR) * np.exp(-tt*6)
def knock(f=420):
    d = 0.12; n = int(d*SR); tt = np.arange(n)/SR
    return norm(np.sin(TAU*f*tt)*np.exp(-tt*38) + 0.5*np.sin(TAU*f*2.7*tt)*np.exp(-tt*60) + 0.3*bp(noise(d), 800, 3000)*np.exp(-tt*90))
def creak(d=1.0):
    n = int(d*SR); tt = np.arange(n)/SR
    f = 180 + 60*np.sin(TAU*0.9*tt)
    x = np.sign(np.sin(TAU*np.cumsum(f)/SR)) * (0.5 + 0.5*np.abs(np.sin(TAU*14*tt)))
    return norm(bp(x, 300, 1800) * np.sin(np.pi*tt/d))
def heartbeat(st, d, bpm, gain):
    k = 0.0
    while k < d:
        add(st + k, thump(55, 0.18), gain, 0); add(st + k + 0.18, thump(48, 0.16), gain*0.7, 0); k += 60/bpm
def clap():
    d = 0.09; n = int(d*SR)
    return norm(bp(noise(d), 700, 3200) * env_ad(n, 0.0008, 60))
def whirr(d):
    n = int(d*SR); tt = np.arange(n)/SR
    x = np.sin(TAU*880*tt) + 0.5*np.sin(TAU*1760*tt) + 0.3*np.sin(TAU*2640*tt) + 0.2*bp(noise(d), 2000, 6000)
    return norm(x * (0.8 + 0.2*np.sin(TAU*11*tt)) * np.minimum(1, tt/0.3) * np.minimum(1, (d-tt)/0.3))
def scrub(d, rate=7.2):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 1800, 6500) * (0.35 + 0.65*np.abs(np.sin(np.pi*rate*tt))) * np.minimum(1, tt/0.2) * np.minimum(1, (d-tt)/0.3))
def swish(d):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 300, 1800) * (0.4 + 0.6*np.abs(np.sin(TAU*3*tt))) * np.sin(np.pi*tt/d))

# ================= SCENE 1 : MORNING OUCH (0–45) =================
home = win(0, 45.3, 0.8)
L += 0.009*norm(lp(rng.standard_normal(N), 400))*home; R += 0.009*norm(lp(rng.standard_normal(N), 400))*home
tk = tick()
for s in range(1, 45): add(s, tk, 0.03 if s % 2 else 0.024, -0.25)
for st in [1.2, 6.0, 12.5, 19.0, 25.5, 33.0, 41.5]: bird_phrase(st, rng.uniform(0.03, 0.05), 0.5)
# tinny headphone music
for k in range(int(9.4/0.32)):
    f = [784, 880, 988, 1175, 988, 880][k % 6]
    add(0.3 + k*0.32, hp(bell(f, 0.3), 700), 0.012, 0.0)
add(1.9, clink(2100, 0.25), 0.03, -0.35); add(3.2, sip(0.45), 0.09, -0.35); add(4.5, clink(1900, 0.3), 0.045, -0.35)
n_ = int(8.0*SR); tt_ = np.arange(n_)/SR
add(0.7, norm(bp(noise(8.0), 900, 3000) * (0.3 + 0.7*np.abs(np.sin(TAU*1.6*tt_))) * np.minimum(1, tt_/0.4) * np.minimum(1, (8-tt_)/0.4)), 0.022, 0.6)
for s in [1.5, 5.0]:
    add(s + 0.5, rustle(0.3), 0.03, -0.55); add(s + 1.32, whoosh(0.4, 900, 2600), 0.025, -0.6); add(s + 2.15, jar_clink(), 0.06, -0.7)
add(7.4, rustle(0.3), 0.03, 0.2)
add(9.6, crunch(), 0.2, 0.0)
add(9.75, boing(0.4, 700, 200), 0.06, 0.0)
add(10.15, thump(120, 0.15), 0.07, 0.0)
add(10.55, thump(160, 0.12), 0.05, 0.1)
chime(10.0, 0.02, 1568.0)
walk_steps(0, [[0,1600],[11.0,1600],[13.0,2060],[14.0,2060],[17.4,1150],[45,1150]], 88, 0.045, 0.5)
walk_steps(0, [[0,330],[11.4,330],[14.6,790],[45,790]], 80, 0.04, -0.4)
add(13.6, crinkle(0.4), 0.03, 0.9)
add(18.4, crinkle(0.5), 0.05, 0.15); add(18.5, hiss(0.6), 0.008, 0.15)
add(21.0, whoosh(0.5, 500, 1400), 0.02, 0.0)
add(24.6, crunch(), 0.1, -0.15); chew_seq(24.9, 1.6, 0.035, -0.15)
for i, f in enumerate([941, 1209, 852]): add(21.4 + i*0.16, beep(f, 0.1), 0.02, -0.35)
babble(22.2, 6.8, 420, 0.03, -0.35)
add(28.0, shutter(), 0.13, 0.4)
add(31.2, page(), 0.06, -0.3); add(32.2, scratch(0.8), 0.04, -0.3)
chime(34.0, 0.025, 1318.5)
for s in [39.25, 40.45]: add(s, thump(110, 0.2), 0.08, -0.1)
chime(40.0, 0.035)

# ================= SCENE 2 : WAITING ROOM (45–90) =================
W0 = 45
wr = win(44.8, 90.3, 0.8)
room = norm(lp(rng.standard_normal(N), 700))
L += 0.012*room*wr; R += 0.012*np.roll(room, 1500)*wr
aq = norm(bp(rng.standard_normal(N), 600, 3000)) * (0.6 + 0.4*np.abs(lp(rng.standard_normal(N), 6))*4).clip(0, 1.4)
L += 0.012*aq*wr; R += 0.004*aq*wr
for k in range(120): add(W0 + rng.uniform(0, 45), plink(rng.uniform(900, 1700)), 0.012, -0.75)
for s in range(1, 45): add(W0 + s, tk, 0.018, 0.4)
heartbeat(W0 + 1.0, 28.5, 68, 0.05)
heartbeat(W0 + 30.0, 3.5, 96, 0.07)
for i, s in enumerate([3.5, 7.0, 10.5, 14.0]): add(W0 + s, knock(380 + i*30), 0.08, 0.45); add(W0 + s - 1.0, rustle(0.25), 0.02, 0.45)
add(W0 + 19.6, creak(4.6) * 0.5, 0.02, 0.45)
for i in range(4): add(W0 + 24.4 + i*0.06 + 0.9, knock(320 + i*45), 0.09, 0.45 + 0.05*i)
add(W0 + 24.5, thump(110, 0.18), 0.06, 0.4)
chime(W0 + 12.0, 0.03); chime(W0 + 20.0, 0.02, 1318.5)
add(W0 + 14.45, thump(120, 0.15), 0.05, -0.6)
add(W0 + 18.7, shutter(), 0.12, -0.6)
add(W0 + 26.2, creak(1.2), 0.03, 0.8); add(W0 + 27.3, knock(900), 0.03, 0.8)
add(W0 + 40.4, creak(1.2), 0.025, 0.8); add(W0 + 41.5, knock(800), 0.05, 0.8)
walk_steps(W0, [[27.0,1840],[29.4,1660]], 86, 0.04, 0.75)
walk_steps(W0, [[36.4,1660],[39.2,1850]], 86, 0.035, 0.8)
babble(W0 + 29.7, 2.9, 300, 0.035, 0.75)
add(W0 + 32.6, thump(120, 0.15), 0.06, 0.1); add(W0 + 33.0, thump(115, 0.15), 0.06, -0.1)
walk_steps(W0, [[33.0,1010],[37.8,1790]], 86, 0.04, 0.4)
walk_steps(W0, [[33.4,900],[38.4,1720]], 86, 0.035, 0.3, offset=0.06)
chime(W0 + 38.4, 0.025, 1318.5)

# ================= SCENE 3 : DENTIST TIME (90–135) =================
D0 = 90
dn = win(89.8, 135.3, 0.8)
hum = norm(lp(rng.standard_normal(N), 300)) + 0.3*np.sin(TAU*100*t)
L += 0.008*hum*dn; R += 0.008*hum*dn
add(D0 + 3.0, knock(1400), 0.04, 0.0)
lamp_on = win(D0 + 3.0, D0 + 26.4, 0.2)
L += 0.004*np.sin(TAU*120*t)*lamp_on; R += 0.004*np.sin(TAU*120*t)*lamp_on
babble(D0 + 4.1, 2.2, 300, 0.035, 0.35); babble(D0 + 28.8, 1.2, 300, 0.035, 0.35)
st = 7.9
while st < 16.3:
    add(D0 + st, clink(rng.uniform(3800, 5200), 0.12), 0.025, 0.1); st += rng.uniform(0.25, 0.6)
add(D0 + 17.6, whirr(7.8), 0.022, 0.1)
for s in [15.0, 22.0, 25.0]: chime(D0 + s, 0.02, 1568.0)
n_ = int(2.0*SR); tt_ = np.arange(n_)/SR
add(D0 + 26.4, norm(lp(noise(2.0), 400) + 0.5*np.sin(TAU*(90 + 30*tt_)*tt_)) * np.sin(np.pi*tt_/2.0), 0.03, 0.0)
add(D0 + 29.0, trickle(0.9), 0.04, 0.4)
add(D0 + 32.0, swish(1.3), 0.06, 0.0)
add(D0 + 33.8, whoosh(0.5, 900, 3000), 0.025, 0.2); add(D0 + 34.4, thump(300, 0.08), 0.04, 0.0)
chime(D0 + 34.7, 0.035)
k = 0
while 34.6 + k/4.8 < 37.3:
    add(D0 + 34.6 + k/4.8, clap(), 0.05, -0.45); k += 1
for s in [35.6, 36.6]: add(D0 + s, thump(115, 0.15), 0.05, -0.45)
add(D0 + 37.4, whoosh(0.5, 900, 2600), 0.025, 0.1)
chime(D0 + 38.6, 0.03, 1318.5); chime(D0 + 41.2, 0.025)

# ================= SCENE 4 : GOODNIGHT SMILES (135–180) =================
N0 = 135
nt = win(134.8, 180.5, 0.8)
crick = np.zeros(N)
for k in range(int(45/0.62)):
    s0 = int((N0 + k*0.62) * SR)
    for p_ in range(3):
        n = int(0.045*SR); tt = np.arange(n)/SR
        pulse = np.sin(TAU*(4300 + 100*np.sin(k))*tt) * np.sin(np.pi*tt/0.045)
        s = s0 + int(p_*0.07*SR)
        if s + n < N: crick[s:s+n] += pulse
L += 0.007*crick*nt; R += 0.007*np.roll(crick, 700)*nt
L += 0.008*room*nt; R += 0.008*np.roll(room, 2222)*nt
for s in range(1, 45, 2): add(N0 + s, tk, 0.016, -0.3)
pans = [-0.5, -0.17, 0.17, 0.5]
for i in range(4):
    st = 1.0 + i*0.85
    while st + 0.2 < 14.2:
        add(N0 + st + 0.15, clink(rng.uniform(3000, 3600), 0.15), 0.02, pans[i])
        chew_seq(N0 + st + 1.15, 1.4, 0.022, pans[i])
        st += 3.4
for i in range(4): add(N0 + 14.3 + i*0.07, knock(700 + i*60), 0.02, pans[i])
for s in [6.0, 11.0]: chime(N0 + s, 0.025)
for i in range(4):
    if i == 2: add(N0 + 15.6, scrub(4.8), 0.03, pans[i]); add(N0 + 23.4, scrub(1.0), 0.03, pans[i])
    else: add(N0 + 15.6 + i*0.1, scrub(8.6), 0.03, pans[i])
add(N0 + 22.0, shutter(), 0.11, 0.17)
for i, yt in enumerate([27.5, 29.0, 26.0, 24.5]): add(N0 + yt, breath(1.5, 200, 900), 0.05, pans[i])
st = 33.5
while st < 44.5:
    for i in range(4): add(N0 + st + i*0.4, breath(1.5, 120, 500), 0.018, pans[i])
    st += 3.6
chime(N0 + 36.5, 0.03)

# scene transitions
for s in [45, 90, 135]:
    add(s - 0.6, whoosh(1.2, 300, 1400), 0.018, 0.0); chime(s - 0.1, 0.016, 784.0)

# ================= MUSIC BED =================
BPM = 70; beat = 60/BPM; bar = 4*beat
mus = np.zeros((2, N))
def madd(start, sig, g, pan=0.0):
    s = int(start*SR)
    if s >= N: return
    e = min(N, s + len(sig))
    mus[0, s:e] += sig[:e-s]*g*np.sqrt(0.5*(1-pan)); mus[1, s:e] += sig[:e-s]*g*np.sqrt(0.5*(1+pan))
def epiano(f, d):
    n = int(d*SR); tt = np.arange(n)/SR
    mod_ = np.sin(TAU*f*2*tt) * 0.8 * np.exp(-tt*3)
    return np.sin(TAU*f*tt + mod_) * np.exp(-tt*1.1) * np.minimum(1, tt/0.01) * (1 + 0.12*np.sin(TAU*4.5*tt))
def kalimba(f, d=1.6):
    n = int(d*SR); tt = np.arange(n)/SR
    return (np.sin(TAU*f*tt) + 0.25*np.sin(TAU*f*5.4*tt)*np.exp(-tt*12)) * np.exp(-tt*3.2) * np.minimum(1, tt/0.003)
CH = [[146.83, 185.00, 220.00, 277.18], [123.47, 146.83, 185.00, 220.00], [98.00, 146.83, 185.00, 246.94], [110.00, 138.59, 164.81, 220.00]]
BASS = [73.42, 61.74, 49.00, 55.00]
PENT = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66]
for b in range(int(DUR/bar) + 1):
    t0 = b*bar; ci = b % 4
    night = t0 >= 134
    for j, f in enumerate(CH[ci]):
        madd(t0 + j*0.012, epiano(f, bar*1.05), 0.05, -0.2 + 0.13*j)
        if not night: madd(t0 + 2.5*beat + j*0.012, epiano(f, bar*0.6), 0.022, -0.2 + 0.13*j)
    n = int(bar*SR); tt = np.arange(n)/SR
    madd(t0, np.sin(TAU*BASS[ci]*tt) * np.exp(-tt*0.9) * np.minimum(1, tt/0.02), 0.10)
    for k in range(4):
        if rng.random() < (0.7 if night else 0.5):
            madd(t0 + k*beat + (0.5*beat if rng.random() < 0.4 else 0), kalimba(PENT[rng.integers(0, 6)]), 0.03, rng.uniform(-0.5, 0.5))
    if night: continue
    for k in range(4):
        bt = t0 + k*beat
        if k in (0, 2) or (k == 3 and b % 2):
            d = 0.25; nn = int(d*SR); t2 = np.arange(nn)/SR
            madd(bt + (0.5*beat if k == 3 else 0), np.sin(TAU*55*t2*(1 - 0.4*t2/d))*np.exp(-t2*16), 0.15)
        if k in (1, 3):
            madd(bt, bp(rng.standard_normal(int(0.2*SR)), 1200, 6000) * env_ad(int(0.2*SR), 0.002, 22), 0.03)
        for sw in (0, 0.58):
            madd(bt + sw*beat, hp(rng.standard_normal(int(0.04*SR)), 6000) * env_ad(int(0.04*SR), 0.001, 90), 0.011 if sw else 0.015, 0.3)
mus[0] = lp(mus[0], 5500); mus[1] = lp(mus[1], 5500)
crk = np.zeros(N)
for _ in range(int(DUR*6)):
    s = rng.integers(0, N - 60); crk[s:s+40] += bp(rng.standard_normal(40), 2000, 8000) * rng.uniform(0.2, 1)
mus[0] += 0.02*crk; mus[1] += 0.02*np.roll(crk, 333)
lvl = np.clip(t/2.5, 0, 1) * (1 - 0.3*win(90, 135, 2)) * (1 - 0.15*win(135, 181, 2)) * np.clip((DUR - t)/4.5, 0, 1)
mus *= lvl

mix = np.stack([L, R])
mix = mix/np.max(np.abs(mix))*0.9 + mus/np.max(np.abs(mus))*0.32
mix *= np.clip(t/1.2, 0, 1) * np.clip((DUR - t)/3.5, 0, 1)
mix = np.tanh(mix*1.1)/np.tanh(1.1)
mix = mix/np.max(np.abs(mix))*0.85
pcm = (mix.T*32767).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('rms dBFS', round(20*np.log10(np.sqrt(np.mean(mix**2))), 1))
for a in range(0, 180, 15):
    seg = mix[:, a*SR:(a+15)*SR]; print(f'{a:3d}s rms {20*np.log10(np.sqrt((seg**2).mean())+1e-9):6.1f}')
