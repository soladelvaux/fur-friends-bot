"""Print the next episode to post (e.g. day005), or fail if none is left.  --done marks it posted.
Episodes are found automatically: every dayNNN that has a dayNNN_meta.json plus a dayNNN_episode.js
(or dayNNN_page.html) and is not yet in "posted" in state.json, in day order. Anything listed in
"queue" in state.json goes first (so older setups keep working)."""
import json, sys, os, re
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
st = json.load(open('state.json')) if os.path.exists('state.json') else {}
st.setdefault('queue', []); st.setdefault('posted', [])
files = set(os.listdir('.'))
found = sorted({m.group(1) for f in files for m in [re.match(r'(day\d{3})_(episode\.js|page\.html)$', f)] if m and m.group(1) + '_meta.json' in files})
todo = [e for e in st['queue'] if e not in st['posted']] + [e for e in found if e not in st['posted'] and e not in st['queue']]
if '--list' in sys.argv:
    print('posted:', ', '.join(st['posted']) or '-'); print('waiting:', ', '.join(todo) or '-'); sys.exit(0)
if not todo:
    sys.exit('QUEUE EMPTY: upload new dayNNN_episode.js + dayNNN_meta.json files.')
if '--done' in sys.argv:
    ep = todo[0]; st['posted'].append(ep); st['queue'] = [e for e in st['queue'] if e != ep]
    json.dump(st, open('state.json', 'w'), indent=2); print('marked posted:', ep); sys.exit(0)
print(todo[0])
