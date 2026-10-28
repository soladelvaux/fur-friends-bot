"""Run this ONCE on your laptop to get the YT_REFRESH_TOKEN for the Fur Friends channel.
  pip install google-auth-oauthlib
  python get_refresh_token.py
A browser opens: log in, and when YouTube asks which channel, choose FUR FRIENDS.
"""
from google_auth_oauthlib.flow import InstalledAppFlow
cid = input('Paste YT_CLIENT_ID: ').strip()
sec = input('Paste YT_CLIENT_SECRET: ').strip()
flow = InstalledAppFlow.from_client_config({'installed': {'client_id': cid, 'client_secret': sec,
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth', 'token_uri': 'https://oauth2.googleapis.com/token',
    'redirect_uris': ['http://localhost']}}, scopes=['https://www.googleapis.com/auth/youtube.upload'])
creds = flow.run_local_server(port=0, prompt='consent', access_type='offline')
print('\nYT_REFRESH_TOKEN (copy everything on the next line):\n' + creds.refresh_token)
