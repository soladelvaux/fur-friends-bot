"""Render one Fur Friends episode to MP4.
usage: python render.py day005 output/day005.mp4 [--fps 60] [--seconds N]
"""
import sys, os, subprocess, argparse, shutil, tempfile
from multiprocessing import Process, cpu_count
from playwright.sync_api import sync_playwright

def worker(page_url, out, fps, a, b):
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={'width': 1920, 'height': 1080})
        pg.add_init_script("window.__RENDER=true")
        pg.goto(page_url); pg.wait_for_timeout(500)
        for i in range(int(1.5*fps), 0, -1):          # warm up springs before the chunk
            t = a/fps - i/fps
            if t >= 0: pg.evaluate(f"setTime({t})")
        for i in range(a, b):
            pg.evaluate(f"setTime({i/fps})")
            pg.screenshot(path=f"{out}/f_{i:05d}.jpg", type='jpeg', quality=92)
        br.close()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('episode'); ap.add_argument('output')
    ap.add_argument('--fps', type=int, default=60)
    ap.add_argument('--seconds', type=float, default=None, help='render only the first N seconds (testing)')
    ap.add_argument('--procs', type=int, default=max(2, cpu_count()))
    a = ap.parse_args()
    here = os.path.dirname(os.path.abspath(__file__))
    own_page = os.path.join(here, a.episode + '_page.html')
    if os.path.exists(own_page): page = 'file://' + own_page                      # Day 2-4 style
    else: page = 'file://' + os.path.join(here, 'episode_page.html') + '?ep=' + a.episode   # Day 5+ (kit.js)
    audio_py = os.path.join(here, a.episode + '_audio.py')
    timeline = None
    with sync_playwright() as p:
        br = p.chromium.launch(); pg = br.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.add_init_script("window.__RENDER=true"); pg.goto(page); pg.wait_for_timeout(500)
        dur = pg.evaluate("window.DUR")
        if not os.path.exists(audio_py): timeline = pg.evaluate("JSON.stringify(window.AUDIO || null)")
        br.close()
        if errs: sys.exit('Episode page error: ' + errs[0])
        if not dur: sys.exit('Episode page did not load (check the dayNNN_episode.js file name)')
    dur = min(dur, a.seconds) if a.seconds else dur
    total = int(dur * a.fps)
    tmp = tempfile.mkdtemp(prefix='frames_')
    n = a.procs
    ps = [Process(target=worker, args=(page, tmp, a.fps, k*total//n, (k+1)*total//n)) for k in range(n)]
    [p.start() for p in ps]; [p.join() for p in ps]
    if any(p.exitcode for p in ps): sys.exit('A render worker failed')
    got = len([f for f in os.listdir(tmp) if f.endswith('.jpg')])
    if got != total: sys.exit(f'Expected {total} frames, got {got}')
    wav = os.path.join(tmp, 'audio.wav')
    if os.path.exists(audio_py): subprocess.run([sys.executable, audio_py, wav], check=True)
    else:
        if not timeline or timeline == 'null': sys.exit('No audio: episode has no _audio.py and no AUDIO timeline')
        tl = os.path.join(tmp, 'timeline.json'); open(tl, 'w').write(timeline)
        subprocess.run([sys.executable, os.path.join(here, 'audio_engine.py'), tl, wav], check=True)
    os.makedirs(os.path.dirname(os.path.abspath(a.output)), exist_ok=True)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-framerate', str(a.fps), '-i', f'{tmp}/f_%05d.jpg',
                    '-i', wav, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', str(a.fps),
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', a.output], check=True)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'Rendered {a.output} ({total} frames, {dur:.0f}s at {a.fps}fps)')

if __name__ == '__main__':
    main()
