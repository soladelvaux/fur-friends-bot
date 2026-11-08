# Fur Friends Bot

Every day at 17:00 WIB GitHub renders the next episode listed in state.json -> "queue" and uploads it to the Fur Friends YouTube channel.

Each episode is 4 files: dayNNN_episode.js, dayNNN_audio.py, dayNNN_meta.json, dayNNN_page.html
Shared files: engine.js, locations.js, lofi.py, audio_kit.py
New episodes: upload the 4 new files, then add "dayNNN" to the end of "queue" in state.json.

Engine v4 (Nov 2026): soft-shaded characters, paw-print aprons, ground shadows, alternating stride, head turns, idle glances/ear flicks.
New location: locVillage() in locs4.js (Sakura Village: sakura trees, café, pastel houses, petals, butterflies, parallax).
Preview it: python render.py village_demo output/village_demo.mp4  (not in the posting queue)

Watercolor Brush look (Nov 2026): every episode is painted over in render.py by watercolor.py
(hand-painted wobble, wet bleed, pooled edges, blotchy pigment washes, paper grain). Sepia ink lines in engine.js.
Turn it off with "watercolor": false in settings.json, or --no-watercolor for one render.

Battle Edition (Day 13+, Nov 2026): the Fur Friends enter "Pawlandia Online", a cozy fantasy MMORPG world.
locs5.js holds everything for it: the 16 new friends from the class cards (owl, deer, polar bear, tiger, Nyx, chick, fox, Niko,
hamster, fennec, mouse, tanuki, lop bunny, shiba, raccoon + panda), class outfits and weapons (gear), monsters, battle FX,
the MMORPG HUD (nameplates, quest box, LEVEL UP banner, party-join cards) and two locations: locRealm (meadow, town, forest,
graveyard, mountain, shrine) and locHall (guild, tower, tavern, lab, workshop, library, temple).
Use hero(S, 'owli', {...}) instead of actor() to get a dressed-up hero. New battle sounds live in audio_engine.py.
Season plan: one new friend joins each day (14 Owli, 15 Leaf, 16 Lumi, 17 Tora, 18 Nyx, 19 Tutu, 20 Mori, 21 Niko, 22 Pom,
23 Kiri, 24 Rin, 25 Gear, 26 Mimi, 27 Eli, 28 Snek, 29 Zen), Day 30 = the Grand Raid with all 20.
