# PlanetPulse — Carbon Footprint Tracker

**Hackathon ID: `AZIS-WC3G5F`**

> A MERN-stack web application that turns daily choices into a visible carbon footprint.

---

## Tech Stack

| Layer    | Technology                            |
|----------|---------------------------------------|
| Frontend | React 18 · Vite · React Router v6 · Recharts |
| Backend  | Node.js · Express 4 · MongoDB · Mongoose |
| Styling  | Vanilla CSS (custom design system)   |
| HTTP     | Axios (client) · CORS (server)       |

---

## Features

1. **Log an Activity** — Record car, bus, flight, electricity, veg meal, or non-veg meal with quantity and optional note. CO₂ is calculated server-side using fixed factors.
2. **CO₂ Calculation** — Fixed factors: Car 0.20 kg/km · Bus 0.08 kg/km · Flight 0.25 kg/km · Electricity 0.80 kg/kWh · Veg Meal 0.50 kg · Non-Veg Meal 2.00 kg.
3. **Dashboard** — Total weekly CO₂, activity count, highest-impact category, and a per-category donut chart.
4. **Weekly Target** — Default 20 kg CO₂/week. User can edit and save a custom target at any time.
5. **History & Filter** — All activities filterable by type and date range, with per-entry delete.

---

## Decision Points

See [DECISIONS.md](./DECISIONS.md) for full explanations.

| DP | Behaviour |
|----|-----------|
| DP1 — The nudge | Warn + encourage when weekly target is exceeded |
| DP2 — Absurd input | Allow + inline warning for statistically unusual values |
| DP3 — The week | Sunday → Saturday, shown as date range on dashboard |

---

## Run Locally

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or provide a MongoDB Atlas URI)

### 1 — Clone

```bash
git clone https://github.com/RishavrajK/PlanetPulseAzisly.git
cd PlanetPulseAzisly
```

### 2 — Environment

```bash
cp server/.env.example server/.env
# Edit server/.env if you need a custom MONGO_URI or PORT
```

Default `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/planetpulse
```

### 3 — Install dependencies

```bash
npm install            # root (installs concurrently)
cd server && npm install
cd ../client && npm install
cd ..
```

Or use the shortcut:
```bash
npm run install:all
```

### 4 — Start development servers

```bash
npm run dev
```

This starts:
- **API server** on `http://localhost:5000`
- **React client** on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | All activities (supports `?type=&startDate=&endDate=`) |
| GET | `/api/activities/week` | Current Sun–Sat week activities + summary |
| POST | `/api/activities` | Log a new activity |
| DELETE | `/api/activities/:id` | Delete an activity |
| GET | `/api/target` | Get current weekly target |
| PUT | `/api/target` | Update weekly target |
| GET | `/api/health` | Health check |

---

## Test Credentials

**No authentication required.** All features are accessible without creating an account, as per the hackathon rules.

---

## Standard API

No standard API specification has been provided for this track. The app will be graded via browser agent.

---

## Demo

*(Demo recording link — to be added before submission)*
