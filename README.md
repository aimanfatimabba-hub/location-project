# Location Sharing Project (Consent-Based)

A small full-stack demo of how "share my location" links work on the web:
the browser's built-in permission prompt is what actually gates access —
no location data is ever sent unless the visitor clicks **Allow**.

## How it works

1. **Tracking link** → open `index.html` (served at `/`).
2. **Browser asks permission** → the page calls `navigator.geolocation.getCurrentPosition()`,
   which triggers the browser's native "Allow location access?" popup.
3. **User clicks Allow** → the browser hands back GPS coordinates (lat/lng + accuracy).
4. **Coordinates sent to server** → a `fetch()` POST to `/api/location` stores them.
5. **Dashboard** → `dashboard.html` shows every received location on a live map + table,
   auto-refreshing every 5 seconds.

If the user clicks **Block/Deny**, no data is ever sent — this is enforced by the
browser itself, not just the app code.

## Project structure

```
location-project/
├── server.js           # Express backend (API + static file serving)
├── package.json
├── locations.json       # created automatically once data comes in
└── public/
    ├── index.html        # the tracking/consent page
    └── dashboard.html     # live map + table of received locations
```

## Run it (step by step)

```bash
npm install
node server.js
```

Then open:
- Tracking page: http://localhost:3000/
- Dashboard: http://localhost:3000/dashboard.html

## API

| Method | Route              | Description                          |
|--------|---------------------|---------------------------------------|
| POST   | `/api/location`      | Save a new `{latitude, longitude, accuracy, name}` |
| GET    | `/api/locations`     | Get all saved locations               |
| DELETE | `/api/locations`     | Clear all saved locations             |

## Notes for your submission

- GPS accuracy is usually **5–20 meters** on a phone with GPS enabled (much less
  precise, or city-level only, on desktop Wi-Fi/IP-based geolocation).
- To deploy so the "link" works for someone on another network, host this on
  a service like Render, Railway, or Vercel (Node hosting) — `localhost`
  only works on your own machine.
- Geolocation via `navigator.geolocation` **requires HTTPS** in production
  (it only works on `http://localhost` for local testing).
