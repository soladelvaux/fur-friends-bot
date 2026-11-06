"""Watercolor Brush look for Fur Friends, applied to rendered frames by ffmpeg.

Why ffmpeg and not SVG filters: a full-frame SVG watercolor filter costs ~4 s per frame
in headless Chromium; the same look as an ffmpeg filter graph costs a few ms.

The look (in order):
  1. hand-painted wobble   - lines and edges shift a few px along smooth noise (displace)
  2. wet bleed             - a soft blur mixed back in, colours bleed past their edges
  3. pooled pigment edges  - local-contrast boost: paint pools darker along every boundary
  4. granulation           - pigment settles in the paper tooth (static multiply texture)
  5. transparent pigment   - slightly lighter, less saturated, warm paper shows through

Usage from render.py:
  maps = make_maps(w, h, tmpdir)                 # writes 3 PNGs, returns their paths
  inputs, graph = ffmpeg_args(maps, w, h)        # extra -i args + filter_complex for [0:v]
"""
import os
import numpy as np
from PIL import Image

STRENGTH = dict(wobble=3.4, bleed=0.38, blur=2.6, pool=0.35, pool_size=9, grain=1.0, sat=1.06, lift=0.05)


def _smooth_noise(w, h, cell, seed):
    rng = np.random.default_rng(seed)
    gw, gh = w // cell + 3, h // cell + 3
    g = rng.random((gh, gw)).astype(np.float32)
    img = Image.fromarray((g * 255).astype(np.uint8)).resize((gw * cell, gh * cell), Image.BICUBIC)
    a = np.asarray(img, dtype=np.float32)[:h, :w] / 255.0
    return (a - a.mean()) / (a.std() + 1e-6)


def make_maps(w, h, out_dir, scale=None):
    """Displacement maps (128 = no shift) and a granulation texture, sized to the frame."""
    s = STRENGTH if scale is None else dict(STRENGTH, **scale)
    k = h / 1080.0
    amp = s['wobble'] * k
    paths = {}
    for name, seed in (('xmap', 3), ('ymap', 4)):
        n = 0.85 * _smooth_noise(w, h, int(70 * k), seed) + 0.15 * _smooth_noise(w, h, int(26 * k), seed + 10)
        m = np.clip(128 + amp * 0.5 * n, 0, 255).astype(np.uint8)
        paths[name] = os.path.join(out_dir, name + '.png')
        Image.fromarray(m, 'L').convert('RGB').save(paths[name])
    # pigment texture = uneven wash (large blotches + blooms) x fine granulation in the paper tooth
    rng = np.random.default_rng(9)
    blot = 0.6 * _smooth_noise(w, h, int(150 * k), 21) + 0.4 * _smooth_noise(w, h, int(48 * k), 22)
    bloom = np.clip(_smooth_noise(w, h, int(90 * k), 23) - 1.1, 0, None)          # occasional cauliflower blooms
    fine = _smooth_noise(w, h, max(2, int(3 * k)), 24)
    g = 1.0 - 0.042 * (blot + 1.6) - 0.05 * bloom - 0.007 * (fine + 1.5) * (0.6 + 0.4 * np.clip(blot + 1, 0, 2))
    paths['grain'] = os.path.join(out_dir, 'grain.png')
    Image.fromarray(np.clip(g * 255, 0, 255).astype(np.uint8), 'L').convert('RGB').save(paths['grain'])
    return paths


def ffmpeg_args(paths, w, h, first_index=1):
    """Extra inputs and a filter_complex turning [0:v] into [vwc]."""
    s = STRENGTH
    i = first_index
    inputs = []
    for key in ('xmap', 'ymap', 'grain'):
        inputs += ['-loop', '1', '-i', paths[key]]
    blur = s['blur'] * h / 1080.0
    graph = (
        f"[0:v]format=gbrp[src];[{i}:v]format=gbrp[xm];[{i+1}:v]format=gbrp[ym];[{i+2}:v]format=gbrp[gr];"
        f"[src][xm][ym]displace=edge=smear[wob];"
        f"[wob]split[w1][w2];[w2]scale=iw/2:ih/2:flags=bilinear,gblur=sigma={blur/2:.2f},scale={w}:{h}:flags=bilinear[wb];"
        f"[w1][wb]blend=all_mode=normal:all_opacity={s['bleed']:.3f}[bled];"
        f"[bled]split[b1][b2];[b2]scale=iw/2:ih/2:flags=bilinear,gblur=sigma={s['pool_size'] * h / 1080.0 / 6:.2f},scale={w}:{h}:flags=bilinear[bw];"
        f"[b1][bw]blend=all_mode=darken:all_opacity={s['pool']}[pool];"
        f"[pool][gr]blend=all_mode=multiply:all_opacity={s['grain']}:shortest=1[gran];"
        f"[gran]eq=saturation={s['sat']}:brightness={s['lift']}[vwc]"
    )
    return inputs, graph


def apply_to_image(src, dst, tmp):
    """Same look on a single image (thumbnails)."""
    import subprocess
    im = Image.open(src); w, h = im.size
    maps = make_maps(w, h, tmp)
    inputs, graph = ffmpeg_args(maps, w, h)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', src] + inputs +
                   ['-filter_complex', graph, '-map', '[vwc]', '-frames:v', '1', '-q:v', '2', dst], check=True)


if __name__ == '__main__':      # quick test: python watercolor.py in.jpg out.jpg
    import sys, tempfile
    apply_to_image(sys.argv[1], sys.argv[2], tempfile.mkdtemp())
