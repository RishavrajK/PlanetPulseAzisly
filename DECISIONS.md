# DECISIONS.md

**Hackathon ID: `AZIS-WC3G5F`**  
**Project:** PlanetPulse — Carbon Footprint Tracker

This document covers the three required Decision Points and the rationale behind each choice.

---

## DP1 — The Nudge

**What does the app do when the weekly target is crossed?**

**Choice: Warn + Encourage**

When a user's total CO₂ for the current week exceeds their set target, a non-blocking amber banner appears on the Dashboard:

> ⚠️ You've exceeded your weekly target by **X.XX kg CO₂**.  
> Small changes still make a big difference. Consider reducing high-impact activities — like flights or non-veg meals — for the rest of the week. Every action counts! 🌱

We deliberately chose *not* to shame or block the user. Carbon tracking is a behaviour-change tool, and research in behavioural science consistently shows that positive, encouraging feedback is more effective at sustaining long-term change than shame or hard limits. Blocking the user would make the app frustrating and counterproductive. The warning gives them accurate information; the encouraging message gives them motivation to act on it.

---

## DP2 — Absurd Input

**How does the app treat an obviously wrong entry, like a 500,000 km car trip?**

**Choice: Allow + Inline Warning**

When a user enters a quantity that crosses a statistically unusual threshold (e.g., car > 5,000 km, flight > 20,000 km), an inline amber warning appears directly beneath the quantity field:

> ⚠️ Unusually large value — please double-check before saving.

The user can still save the entry — the form does not block or silently correct the value. The thresholds were chosen based on real-world upper bounds: 5,000 km is roughly three times a typical cross-country drive; 20,000 km exceeds the Earth's circumference.

We chose this approach for two reasons. First, we never silently alter user data — that would be dishonest and hard to debug. Second, there are genuine edge cases: a scientist tracking a year-long expedition may legitimately need to log a large distance. The warning informs without restricting, putting trust in the user.

---

## DP3 — The Week

**When does a "week" start, and how is mid-week progress shown?**

**Choice: Sunday → Saturday**

The weekly period is defined as **Sunday 00:00:00 → Saturday 23:59:59** in the user's local time. The Dashboard always shows the exact date range (e.g., "Sep 21 – Sep 27") alongside the progress bar, so there is no ambiguity.

Mid-week progress updates in real time: every time an activity is logged, the weekly total and progress bar reflect the new value immediately (via a re-fetch after each POST). There is no caching lag.

We chose Sunday–Saturday because it is the standard calendar week in the `en-US` locale (which aligns with our primary target audience), it is the default used by most calendar apps, and it is the behaviour users would intuitively expect. A Monday–Sunday option would have been equally valid, but introducing a choice here would add complexity without meaningful benefit.
