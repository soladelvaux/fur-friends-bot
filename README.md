# Fur Friends Bot

Every day at 17:00 WIB GitHub renders the next episode listed in state.json -> "queue" and uploads it to the Fur Friends YouTube channel.

Each episode is 4 files: dayNNN_episode.js, dayNNN_audio.py, dayNNN_meta.json, dayNNN_page.html
Shared files: engine.js, locations.js, lofi.py, audio_kit.py
New episodes: upload the 4 new files, then add "dayNNN" to the end of "queue" in state.json.
