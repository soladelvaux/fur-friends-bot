"""Upload a video to YouTube with the Fur Friends channel's refresh token.
Needs env: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
usage: python upload.py output/day005.mp4 day005_meta.json
       python upload.py --check      (only tests the keys)
"""
import os, sys, json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

def main():
    if sys.argv[1] == '--check':
        e = lambda k: os.environ[k].strip()
        c = Credentials(None, refresh_token=e('YT_REFRESH_TOKEN'), client_id=e('YT_CLIENT_ID'), client_secret=e('YT_CLIENT_SECRET'),
                        token_uri='https://oauth2.googleapis.com/token', scopes=['https://www.googleapis.com/auth/youtube.upload'])
        c.refresh(Request()); print('YouTube keys OK (token refreshed). Nothing was uploaded.'); return
    video, meta_path = sys.argv[1], sys.argv[2]
    meta = json.load(open(meta_path, encoding='utf-8'))
    st = json.load(open('settings.json'))
    e = lambda k: os.environ[k].strip()
    creds = Credentials(None, refresh_token=e('YT_REFRESH_TOKEN'), client_id=e('YT_CLIENT_ID'),
                        client_secret=e('YT_CLIENT_SECRET'), token_uri='https://oauth2.googleapis.com/token',
                        scopes=['https://www.googleapis.com/auth/youtube.upload'])
    creds.refresh(Request())
    yt = build('youtube', 'v3', credentials=creds, cache_discovery=False)
    body = {'snippet': {'title': meta['title'][:100], 'description': meta['description'][:4900],
                        'tags': meta.get('tags', []), 'categoryId': st.get('category_id', '1')},
            'status': {'privacyStatus': st.get('privacy', 'public'), 'selfDeclaredMadeForKids': bool(st.get('made_for_kids', False))}}
    req = yt.videos().insert(part='snippet,status', body=body, notifySubscribers=bool(st.get('notify_subscribers', True)),
                             media_body=MediaFileUpload(video, mimetype='video/mp4', chunksize=8*1024*1024, resumable=True))
    resp = None
    while resp is None:
        status, resp = req.next_chunk()
        if status: print(f'uploaded {int(status.progress()*100)}%')
    print('Video ID:', resp['id'], ' https://youtu.be/' + resp['id'])

if __name__ == '__main__':
    main()
