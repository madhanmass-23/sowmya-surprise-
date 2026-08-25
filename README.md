# A Surprise for Sowmya 💜

Password-gated birthday surprise: unlock code → countdown → full video → animated wish reveal with photos.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the unlock code is **1434**.

## How the flow works

1. **Password screen** (`components/PasswordGate.js`) — enter the code to unlock.
   That click also silently "primes" the video element so mobile browsers allow
   it to autoplay with sound later (this is why the click matters, not just cosmetic).
2. **Countdown** (`components/Countdown.js`) — counts down from `countdownFrom`
   in `data/config.js`, then auto-advances.
3. **Video** (`components/VideoStage.js`) — plays `public/video/sister-video.mp4`
   full screen (portrait-first). There's no skip control by design — it advances
   automatically only when the video finishes (`onEnded`). If a browser still blocks
   autoplay audio, a "Tap to play" overlay appears as a fallback.
4. **Wish reveal** (`components/WishReveal.js`) — animated card with the title,
   both photos, your message, and a signoff.

## Customize everything from one file

Open `data/config.js`:
- `password` — the unlock code
- `countdownFrom` — how many seconds the countdown runs
- `wishTitle`, `wishMessage`, `wishSignoff` — the text on the final card
- `photos` — array of `{ src, alt }`; add more and the layout adapts

## Replacing assets

- Video: replace `public/video/sister-video.mp4` (keep the filename, or update `videoSrc` in config)
- Photos: replace `public/photos/photo1.jpg` and `photo2.jpg`, or add more files and add entries to `config.photos`

## Deploy

Push to GitHub → import into Vercel. Zero config, standard Next.js app.
Note: the video file is a few MB — fine for Vercel's free tier, but if you add
many more/larger videos consider hosting them externally (e.g. Cloudinary) and
pointing `videoSrc` at the URL instead of bundling them in `/public`.
