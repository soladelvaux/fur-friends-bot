"""Print the next episode folder from state.json, or fail if the queue is empty.  --done marks it posted."""
import json, sys
st = json.load(open('state.json'))
if '--done' in sys.argv:
    ep = st['queue'].pop(0); st['posted'].append(ep)
    json.dump(st, open('state.json', 'w'), indent=2); print('marked posted:', ep); sys.exit(0)
if not st['queue']:
    sys.exit('QUEUE EMPTY: upload new dayNNN_* files and add "dayNNN" to the end of "queue" in state.json.')
print(st['queue'][0])
