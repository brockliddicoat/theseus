# The four-version comparison viewer (2026-11-06, 15:05)

Brock (14:53): "i'd also like a visualization where i can look at the different presentation between sol, astra opus v23
and opus today and compare and rate equivalent slides to guide you better".

Live: https://claude.ai/artifact/AEPJHpx9KNeqNdMRwQBNjn (slug 4ac0a89d-001b-4939-97c7-eefd347ce565), private to Brock.
51 topics; for each, the equivalent slides of Opus v23 (commit e73fc8d's deck/dist/main.html, 131 slides, with its 3D),
Opus today (the 14:30 build, 107 slides), Sol (Codex's GPT-6.1 film, brockliddicoat/theseus-codex-preview, 47 slides) and
Astra (Codex's GPT-6 film, brockliddicoat/theseus-astra-preview, 42 scenes), each playing live in its own player.
Brock rates each version per topic (1–10, a note, one "best"), plus a keep/combine note per topic.

Reading his ratings: the artifact's database, collections `ratings` (doc id `<topic>-<version>`: topic, ver, score,
note, ts) and `topicnotes` (doc id `<topic>`: note, best, ts); read with the artifact server's db_query / db_list on the
slug above. The viewer's "Copy ratings" button gives the same as text.

How the topics were made: Astra's scenes list the old (v23) slides they cover (`old`), today's slides list them
(`replaces`), and Sol's coverage.json names them (its F27 clause ids, `F27.<old id>.<n>`). Each Astra scene is one topic
(its v23 slides in film order), the 9 v23 slides no Astra scene covers are topics of their own, and today's and Sol's
slides join every topic whose v23 slides they cover (slides with no mapping join their predecessor's topic). Files:
slides.json (every version's slide list), topics.json, site_data.json (what the page embeds), viewer_template.html,
dump.js (reads each deck's slide list), test_site.js (local check). The site itself (the four decks, Sol's 3D assets
shared by v23 and Sol, and Astra with a small bridge script that stops it at the end of the chosen scene) was assembled in
/home/claude/compare/site (not kept: rebuild it from those sources).
