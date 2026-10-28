import numpy as np, wave, sys
from scipy.signal import butter, sosfilt

SR = 44100; DUR = 180.0; N = int(SR * DUR)
TAU = 2 * np.pi
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(2026)

def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, hi, order=2): return sosfilt(butter(order, hi, btype='low', fs=SR, output='sos'), x)
def hp(x, lo, order=2): return sosfilt(butter(order, lo, btype='high', fs=SR, output='sos'), x)
def norm(x, p=1.0): return x / (np.max(np.abs(x)) + 1e-9) * p
def env_ad(n, a, d):  # attack (s), exp decay rate
    tt = np.arange(n) / SR
    return np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt * d)
def add(start, sig, gain=1.0, pan=0.0):
    s = int(start * SR)
    if s >= N or s + len(sig) <= 0: return
    if s < 0: sig = sig[-s:]; s = 0
    e = min(N, s + len(sig))
    L[s:e] += sig[:e-s] * gain * np.sqrt(0.5 * (1 - pan))
    R[s:e] += sig[:e-s] * gain * np.sqrt(0.5 * (1 + pan))
def noise(d): return rng.standard_normal(int(d * SR))
def win(a, b, r=1.0):
    x1 = np.clip((t - a) / r, 0, 1); x2 = np.clip((t - (b - r)) / r, 0, 1)
    return x1*x1*(3-2*x1) * (1 - x2*x2*(3-2*x2))

# ---------------- sound kit ----------------
def tick():
    x = bp(noise(0.03), 1800, 4200) * env_ad(int(0.03*SR), 0.0005, 160)
    return norm(x)
def chirp(d, f0, f1):
    n = int(d*SR); tt = np.arange(n)/SR
    f = f0 + (f1-f0)*(tt/d)**0.8 + 70*np.sin(TAU*36*tt)
    return np.sin(TAU*np.cumsum(f)/SR) * np.sin(np.pi*tt/d)**1.4
def bird_phrase(st, amp, pan):
    tp = st
    for _ in range(rng.integers(3, 6)):
        d = rng.uniform(0.06, 0.12)
        add(tp, chirp(d, rng.uniform(2500, 3300), rng.uniform(3700, 5200)), amp, pan)
        tp += d + rng.uniform(0.06, 0.15)
def sip(d=0.4):
    n = int(d*SR); tt = np.arange(n)/SR
    x = bp(noise(d), 350, 1600) * np.sin(np.pi*tt/d)**2 * (0.6 + 0.4*np.sin(TAU*9*tt))
    return norm(x)
def slurp(d=0.7):
    n = int(d*SR); tt = np.arange(n)/SR
    x = bp(noise(d), 600, 2600) * np.sin(np.pi*tt/d)**1.5 * (0.5 + 0.5*np.abs(np.sin(TAU*7*tt)))
    return norm(x)
def clink(f=2300, d=0.35):
    n = int(d*SR); tt = np.arange(n)/SR
    x = (np.sin(TAU*f*tt) + 0.5*np.sin(TAU*f*1.52*tt) + 0.25*np.sin(TAU*f*2.21*tt)) * np.exp(-tt*16)
    x += 0.3*bp(noise(d), 2000, 7000) * np.exp(-tt*120)
    return norm(x)
def scratch(d):
    n = int(d*SR); tt = np.arange(n)/SR
    strokes = 0.5 + 0.5*np.sign(np.sin(TAU*7.5*tt + 2*np.sin(TAU*1.3*tt)))
    x = bp(noise(d), 2200, 7000) * strokes * np.minimum(1, tt/0.05) * np.minimum(1, (d-tt)/0.05)
    return norm(lp(x, 9000))
def crunch():
    d = 0.18; n = int(d*SR)
    x = bp(noise(d), 1300, 6500) * env_ad(n, 0.001, 24)
    x += 0.6*bp(noise(d), 300, 1200) * env_ad(n, 0.001, 40)
    return norm(x)
def chew_seq(st, dur, gain, pan):
    k = 0
    while k*0.34 < dur:
        y = bp(noise(0.09), 250, 1400) * env_ad(int(0.09*SR), 0.01, 40)
        add(st + k*0.34, norm(y), gain, pan); k += 1
def trickle(d):
    n = int(d*SR); tt = np.arange(n)/SR
    am = 0.55 + 0.45*np.abs(lp(rng.standard_normal(n), 14))*3
    x = bp(noise(d), 700, 3200) * np.clip(am, 0, 1.5)
    x *= np.minimum(1, tt/0.3) * np.minimum(1, (d-tt)/0.3)
    return norm(x)
def plink(f0=900):
    d = 0.09; n = int(d*SR); tt = np.arange(n)/SR
    f = f0*(1 + 1.6*tt/d)
    return np.sin(TAU*np.cumsum(f)/SR) * np.exp(-tt*45)
def shutter():
    x = np.zeros(int(0.25*SR))
    for off in (0.0, 0.07):
        c = bp(noise(0.04), 1500, 6000) * env_ad(int(0.04*SR), 0.0005, 120)
        s = int(off*SR); x[s:s+len(c)] += c
    return norm(x)
def whoosh(d=0.35, f0=600, f1=3000):
    n = int(d*SR); tt = np.arange(n)/SR
    x = noise(d); out = np.zeros(n); seg = 8
    for i in range(seg):
        a, b = i*n//seg, (i+1)*n//seg
        fc = f0 + (f1-f0)*(i/seg)
        out[a:b] = bp(x, fc*0.7, fc*1.3)[a:b]
    return norm(out * np.sin(np.pi*tt/d)**2)
def jar_clink():
    x = clink(3400, 0.4)
    y = clink(4600, 0.3); x[:len(y)] += 0.6*y
    return norm(x)
def thump(f=90, d=0.25):
    n = int(d*SR); tt = np.arange(n)/SR
    return np.sin(TAU*f*tt*(1 - 0.35*tt/d)) * np.exp(-tt*18)
def bell(f, d=2.4):
    n = int(d*SR); tt = np.arange(n)/SR
    s = np.sin(TAU*f*tt) + 0.3*np.sin(TAU*2.01*f*tt) + 0.1*np.sin(TAU*3.03*f*tt)
    return s * np.exp(-tt*2.6) * np.minimum(1, tt/0.004)
def chime(st, gain=0.05, base=1046.5):
    for i, m in enumerate((1.0, 1.26, 1.5, 2.0)):
        add(st + i*0.07, bell(base*m, 1.6), gain*(1 - i*0.15), -0.3 + 0.2*i)
def step():
    d = 0.07; x = lp(noise(d), 700) * env_ad(int(d*SR), 0.003, 50)
    return norm(x)
def rustle(d=0.45):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 2000, 8000) * np.sin(np.pi*tt/d)**2 * (0.5 + 0.5*np.abs(lp(rng.standard_normal(n), 30))*4).clip(0, 1.5))
def crinkle(d=0.5):
    x = np.zeros(int(d*SR))
    for _ in range(int(d*90)):
        c = bp(noise(0.006), 3000, 9000) * rng.uniform(0.3, 1)
        s = rng.integers(0, len(x) - len(c)); x[s:s+len(c)] += c
    return norm(x)
def beep(f=1850, d=0.13):
    n = int(d*SR); tt = np.arange(n)/SR
    return np.sin(TAU*f*tt) * np.minimum(1, tt/0.005) * np.minimum(1, (d-tt)/0.01)
def printer(d=1.0):
    n = int(d*SR); tt = np.arange(n)/SR
    x = np.sign(np.sin(TAU*118*tt))*0.4 + bp(noise(d), 800, 3000)*0.6
    return norm(lp(x, 2500) * (0.6 + 0.4*np.sin(TAU*14*tt)) * np.minimum(1, tt/0.05) * np.minimum(1, (d-tt)/0.05))
def chop():
    d = 0.16; n = int(d*SR); tt = np.arange(n)/SR
    x = np.sin(TAU*170*tt) * np.exp(-tt*55) + 0.6*bp(noise(d), 900, 3500) * np.exp(-tt*90)
    return norm(x)
def plop():
    d = 0.18; n = int(d*SR); tt = np.arange(n)/SR
    f = 220*(1 + 2.5*tt/d)
    return norm(np.sin(TAU*np.cumsum(f)/SR) * np.exp(-tt*28) + 0.3*lp(noise(d), 900)*np.exp(-tt*40))
def whisk_clink():
    d = 0.08; n = int(d*SR); tt = np.arange(n)/SR
    f = rng.uniform(3800, 5600)
    return norm(np.sin(TAU*f*tt)*np.exp(-tt*70) + 0.4*bp(noise(d), 4000, 9000)*np.exp(-tt*140))
def hiss(d):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(hp(noise(d), 3500) * np.minimum(1, tt/0.2) * np.minimum(1, (d-tt)/0.4))
def page():
    d = 0.32; n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), 900, 6000) * np.sin(np.pi*tt/d)**1.6 * (0.6 + 0.4*np.sin(TAU*20*tt)))
def breath(d, lo=150, hi=700):
    n = int(d*SR); tt = np.arange(n)/SR
    return norm(bp(noise(d), lo, hi) * np.sin(np.pi*tt/d)**2)

