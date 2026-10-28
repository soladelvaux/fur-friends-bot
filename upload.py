"""Upload a video to YouTube (Fur Friends channel).
Needs env: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
usage: python upload.py output/day005.mp4 day005_meta.json
       python upload.py --check      (only tests the keys, nothing is uploaded)
"""
import os, sys, json

def get_keys():
    keys, bad = {}, []
    for k in ('YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN'):
        v = os.environ.get(k, '').strip()
        keys[k] = v
        if not v:
            bad.append(f'{k} is EMPTY or missing (check the secret name in GitHub Settings > Secrets and variables > Actions)')
    cid, sec, tok = keys['YT_CLIENT_ID'], keys['YT_CLIENT_SECRET'], keys['YT_REFRESH_TOKEN']
    print(f"YT_CLIENT_ID: {len(cid)} chars, ends with .apps.googleusercontent.com: {cid.endswith('.apps.googleusercontent.com')}")
    print(f"YT_CLIENT_SECRET: {len(sec)} chars, starts with GOCSPX-: {sec.startswith('GOCSPX-')}")
    print(f"YT_REFRESH_TOKEN: {len(tok)} chars, starts with 1//: {tok.startswith('1//')}")
    if cid and not cid.endswith('.apps.googleusercontent.com'): bad.append('YT_CLIENT_ID looks cut off (must end with .apps.googleusercontent.com)')
    if sec and not sec.startswith('GOCSPX-'): bad.append('YT_CLIENT_SECRET should start with GOCSPX-')
    if tok and not tok.startswith('1//'): bad.append('YT_REFRESH_TOKEN should start with 1//')
    if bad:
        print('\nPROBLEMS:'); [print(' - ' + b) for b in bad]; sys.exit(1)
    return cid, sec, tok

def get_creds():
    cid, sec, tok = get_keys()
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    creds = Credentials(None, refresh_token=tok, client_id=cid, client_secret=sec,
                        token_uri='https://oauth2.googleapis.com/token',
                        scopes=['https://www.googleapis.com/auth/youtube.upload'])
    try:
        creds.refresh(Request())
    except Exception as e:
        print('\nGOOGLE REJECTED THE KEYS:', repr(e))
        print('Usual causes: refresh token made with a different Client ID/secret, token revoked, or app still in Testing.')
        sys.exit(1)
    return creds

def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--check':
        get_creds(); print('\nYouTube keys OK (token refreshed). Nothing was uploaded.'); return
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    video, meta_path = sys.argv[1], sys.argv[2]
    meta = json.load(open(meta_path, encoding='utf-8'))
    st = json.load(open('settings.json'))
    yt = build('youtube', 'v3', credentials=get_creds(), cache_discovery=False)
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
