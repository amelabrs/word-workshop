I'm building "Word Workshop," a phonics and vocabulary app for a pre-reading 
child who knows letters and phonetic sounds but hasn't started reading yet. 
There's a working single-file prototype at English Words/computer_parts_and_family.html 
— use it as the source of truth for the data model, styling, and interaction 
patterns (Fredoka/Nunito fonts, toy-block color palette, browser speechSynthesis 
for audio, two modes: "Listen & Match" image-matching and "Say It" phonics 
chunking).

Turn this into a proper small project:

1. Restructure into a clean static site (index.html + separate css/js files, 
   or a lightweight framework if you think it's warranted — keep it simple, 
   no build step required if avoidable, so it can deploy to GitHub Pages like 
   my other project, amelabrs.github.io/letterbrain).

2. Move the word/folder data (currently the FOLDERS object) into its own 
   JSON or JS data file, so I can add new categories without touching app logic.

3. Add localStorage-based progress tracking per folder — which words a child 
   has matched correctly, so a parent can see progress across sessions (this 
   wasn't possible in the sandboxed artifact but works in a real deployed site).

4. Keep the two teaching modes intact and don't add speech recognition — 
   modeling + repeat-prompting only, no mic permission required.

5. Set up the repo with a README explaining the folder-based content structure, 
   so it's easy for me to add new topic folders later.

6. Give me GitHub Pages deployment steps at the end.

Ask me before making structural decisions I haven't specified (e.g. plain 
JS vs. a framework, repo name).