# NutriAI V25 — Modular Base44-Style Layout

This project is reorganized from the working NutriAI V25 build.

## Open in VS Code

1. Extract the ZIP.
2. Open the `NutriAI_V25_Modular_Base44_Layout` folder in VS Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html`.
5. Choose **Open with Live Server**.

No npm install, API key, build process, or paid AI service is required.

## Folder structure

```text
NutriAI_V25_Modular_Base44_Layout/
├── index.html
├── css/
│   └── styles.css
├── data/
│   ├── mealDatabase.js
│   └── nutritionEngine.js
├── js/
│   ├── core.js
│   ├── navigation.js
│   ├── profile.js
│   ├── coach.js
│   ├── render.js
│   └── features/
│       ├── mealPlanner.js
│       ├── tools.js
│       ├── progress.js
│       ├── explore.js
│       ├── fitnessCompare.js
│       └── family.js
└── README.md
```

## What each file does

- `index.html` — page structure only.
- `css/styles.css` — the full Base44-style NutriAI design and responsive layout.
- `data/mealDatabase.js` — meal database and nutrition values.
- `data/nutritionEngine.js` — BMI/BMR/macros/water/wellness calculations and rule-based guidance.
- `js/core.js` — global state, storage helpers, and shared navigation helpers.
- `js/navigation.js` — onboarding flow and profile-step controls.
- `js/profile.js` — profile calculations, dashboard initialization, tabs, and weekly controls.
- `js/coach.js` — local NutriAI Health Coach.
- `js/features/mealPlanner.js` — diet-plan and meal-selection logic.
- `js/features/tools.js` — recipe, label-demo, and grocery tools.
- `js/features/progress.js` — progress logs and charts.
- `js/features/explore.js` — ingredients, restaurant, festival, and eco tools.
- `js/features/fitnessCompare.js` — fitness and food comparison logic.
- `js/features/family.js` — family mode and language/helper logic.
- `js/render.js` — renders each dashboard tab.

## Important

The JavaScript uses ordinary browser `<script>` files rather than ES modules. This keeps the original V25 inline button handlers working and makes the project easy to run with VS Code Live Server.

The app is an educational wellness project and does not replace professional medical advice.


## Base44-style tab icons

Dashboard navigation uses compact local inline SVG outline icons beside each tab label, matching the visual style shown in the supplied Base44 screenshot. No external icon library is required.

## Added in this build

Four fully local tabs were added with Base44-style outline navigation icons:

- `Cravings` — craving category selector, 3 recommendations, choose/add-to-today, alternative regeneration.
- `Lunchbox` — School/College/Office, prep time, preferences, 3 lunchbox plans, Pack This, Add to Grocery, Regenerate.
- `Sports` — sport, intensity, duration, timing, pre/post-workout, hydration and recovery guidance.
- `Travel` — trip type, duration, time, food access, priorities, portable snacks, hydration, checklist and travel-specific tips.

These modes use rule-based JavaScript and the existing NutriAI profile. They do not require external AI or Base44 integration credits.


### UI update
- Changed the Health tab icon from a heart to a stethoscope-style outline icon.


## Disease personalization fix

This build fixes a major personalization issue in the Diet Plan tab.

Previously:
- Only Diabetes had actual meal filtering.
- Other conditions mostly changed text but not meal selection.
- Thyroid, PCOS/PCOD and GERD could fall back to General Wellness guidance.
- Meal cards all displayed the same generic explanation.

Now:
- Diabetes, Hypertension/High BP, High Cholesterol, Anemia, Thyroid, PCOS/PCOD and GERD influence local meal ranking.
- Multiple selected conditions are combined.
- Key food-focus tags change with the selected condition(s).
- Each meal card explains the condition-aware factors used to rank it.
- Kidney and liver conditions deliberately do NOT get automatic disease meal filtering because safe targets depend on diagnosis, labs and clinician advice.
- The ranking engine uses only information available in the local database; it does not claim a meal is medically safe or therapeutic.


## V27 Health Coach icon update

- Replaced the previous Health Coach chat-bubble SVG with the approved Option 2 green leaf icon.
- The same leaf icon is used for:
  - the floating collapsed Health Coach button,
  - the Coach header avatar,
  - assistant-message avatars,
  - the typing indicator avatar.
- The V26 disease-personalization logic is unchanged.
- Icon asset: `assets/health-coach-leaf.png`


## V28 GitHub integration

This build adds two credit-free features:

### PDF Export
The Diet Plan tab now has a `📄 Export PDF` button. It uses the browser print dialog and `Save as PDF`, so no PDF API or external integration is needed.

### GitHub Email Reminder
The repository includes:

- `.github/workflows/nutriai-email-reminder.yml`
- `scripts/send_reminder.py`
- `GITHUB_SETUP.md`

The default workflow sends one reminder every day at 12:30 UTC (6:00 PM IST) and can also be run manually from GitHub Actions.

Email credentials are intentionally NOT included in this ZIP. Store them as GitHub Actions Secrets.


## V29 — Real per-user email reminders

V29 replaces the earlier fixed-recipient GitHub reminder with a true user-facing reminder flow.

New **Reminders** tab:

- user enters their own email address
- reminder time
- Daily / Weekdays / Custom days
- reminder categories
- consent
- Enable / Save
- Test Reminder
- Disable

Backend:

- Supabase Anonymous Auth gives each browser/device a private user ID.
- `supabase/reminders_schema.sql` creates the RLS-protected reminder table.
- GitHub Actions runs every 5 minutes.
- `scripts/send_reminder.py` reads due users from Supabase with a backend-only Supabase secret key.
- emails are sent to each user's saved email address.
- no fixed `EMAIL_TO` secret is used anymore.

See `GITHUB_EMAIL_SETUP.md` for the one-time external setup steps.
