"""Original lofi-chill music generator for Fur Friends (royalty-free, made in code).
make_lofi(dur, seed, key_shift, bpm, sr) -> stereo float array (2, N)
"""
import numpy as np
from scipy.signal import butter, sosfilt
TAU = 2*np.pi
def _lp(x, hi, sr): return sosfilt(butter(2, hi, btype='low', fs=sr, output='sos'), x)
def _hp(x, lo, sr): return sosfilt(butter(2, lo, btype='high', fs=sr, output='sos'), x)
def _bp(x, lo, hi, sr): return sosfilt(butter(2, [lo, hi], btype='band', fs=sr, output='sos'), x)

PROGS = [
    [[0,4,7,11],[9,12,16,19],[5,9,12,16],[7,11,14,17]],      # Imaj7 vi7 IVmaj7 V7
    [[2,5,9,12],[7,11,14,17],[0,4,7,11],[9,12,16,19]],       # ii7 V7 Imaj7 vi7
    [[5,9,12,16],[4,7,11,14],[2,5,9,12],[0,4,7,11]],         # IV iii ii I
    [[0,4,7,11],[5,9,12,16],[2,5,9,12],[7,11,14,17]],
]
def make_lofi(dur, seed=1, key=0, bpm=72, sr=44100, prog=None, quiet_ranges=()):
    rng = np.random.default_rng(seed)
    N = int(dur*sr); out = np.zeros((2, N))
    beat = 60/bpm; bar = 4*beat
    base = 130.81 * 2**(key/12)     # C3
    P = PROGS[prog if prog is not None else seed % len(PROGS)]
    f = lambda semi, oct=0: base * 2**((semi + 12*oct)/12)
    def add(st, sig, g, pan=0.0):
        s = int(st*sr)
        if s >= N or s < 0: return
        e = min(N, s + len(sig))
        out[0, s:e] += sig[:e-s]*g*np.sqrt(0.5*(1-pan)); out[1, s:e] += sig[:e-s]*g*np.sqrt(0.5*(1+pan))
    def rhodes(fr, d):
        n = int(d*sr); tt = np.arange(n)/sr
        m = np.sin(TAU*fr*tt)*0.9*np.exp(-tt*2.5)
        x = np.sin(TAU*fr*tt + m) + 0.18*np.sin(TAU*2*fr*tt)*np.exp(-tt*3)
        return x*np.exp(-tt*0.9)*np.minimum(1, tt/0.012)*(1 + 0.1*np.sin(TAU*5*tt))
    def pluck(fr, d=1.4):
        n = int(d*sr); tt = np.arange(n)/sr
        return (np.sin(TAU*fr*tt) + 0.3*np.sin(TAU*fr*3.01*tt)*np.exp(-tt*9))*np.exp(-tt*3.4)*np.minimum(1, tt/0.003)
    nb = int(dur/bar) + 1
    swing = 0.58
    for b in range(nb):
        t0 = b*bar; ch = P[b % 4]
        # chords: rhodes, slightly strummed + offbeat comp
        for j, s in enumerate(ch):
            add(t0 + j*0.018, rhodes(f(s), bar*1.1), 0.055, -0.25 + 0.17*j)
            if b % 2: add(t0 + 2.5*beat + j*0.012, rhodes(f(s), beat*1.2), 0.025, -0.25 + 0.17*j)
        # bass
        n = int(bar*sr); tt = np.arange(n)/sr
        root = f(ch[0], -1)
        bass = np.sin(TAU*root*tt)*np.exp(-tt*0.7)*np.minimum(1, tt/0.02)
        add(t0, bass, 0.12)
        add(t0 + 2.5*beat, np.sin(TAU*root*tt[:int(beat*sr)])*np.exp(-tt[:int(beat*sr)]*2.5), 0.06)
        # melody: pentatonic plucks, sparse, motif repeats every 4 bars
        pent = [0, 2, 4, 7, 9, 12, 14, 16]
        mr = np.random.default_rng(seed*100 + (b % 8))
        for k in range(8):
            if mr.random() < 0.42:
                st = t0 + k*beat/2 + (beat/2*(swing - 0.5) if k % 2 else 0)
                add(st, pluck(f(pent[mr.integers(0, len(pent))], 2)), 0.032, mr.uniform(-0.5, 0.5))
        # drums: soft kick, brushed snare, swung hats
        for k in range(4):
            bt = t0 + k*beat
            if k == 0 or k == 2 or (k == 3 and rng.random() < 0.4):
                d = 0.28; nn = int(d*sr); t2 = np.arange(nn)/sr
                add(bt + (beat/2 if k == 3 else 0), np.sin(TAU*52*t2*(1 - 0.45*t2/d))*np.exp(-t2*14), 0.17)
            if k in (1, 3):
                nn = int(0.22*sr); t2 = np.arange(nn)/sr
                add(bt, _bp(rng.standard_normal(nn), 1300, 5500, sr)*np.exp(-t2*20)*np.minimum(1, t2/0.003), 0.034)
            for sw, g in ((0, 0.016), (swing, 0.011)):
                nn = int(0.045*sr); t2 = np.arange(nn)/sr
                add(bt + sw*beat, _hp(rng.standard_normal(nn), 6500, sr)*np.exp(-t2*85), g, 0.3)
    # tape warmth: lowpass + gentle wobble + vinyl crackle
    for c in range(2): out[c] = _lp(out[c], 5200, sr)
    t = np.arange(N)/sr
    out *= (1 + 0.025*np.sin(TAU*0.33*t))
    crk = np.zeros(N)
    for _ in range(int(dur*7)):
        s = rng.integers(0, N - 60); crk[s:s+40] += _bp(rng.standard_normal(40), 2000, 8000, sr)*rng.uniform(0.2, 1)
    out[0] += 0.018*crk; out[1] += 0.018*np.roll(crk, 377)
    hiss = _hp(rng.standard_normal(N), 4000, sr)
    out += 0.0025*hiss
    return out / (np.max(np.abs(out)) + 1e-9)
