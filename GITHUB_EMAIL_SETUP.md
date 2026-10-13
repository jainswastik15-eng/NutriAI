# NutriAI V29 — Real User Email Reminder Setup

V29 fixes the limitation in V28.

In V29 the NutriAI user can enter their own email address, select the reminder time, frequency and reminder types, and enable/disable reminders in the app.

The browser does **not** contain the Gmail password or Supabase secret key.

---

## Architecture

```text
NutriAI Reminders tab
       |
       | user enters email + time + preferences
       v
Supabase Anonymous Auth
       |
       v
Supabase reminders table (RLS protected)
       |
       | GitHub Action every 5 minutes
       v
scripts/send_reminder.py
       |
       v
Gmail SMTP sender account
       |
       v
THE USER'S SAVED EMAIL ADDRESS
```

---

# Part A — Create Supabase

## 1. Create a Supabase project

Create a project in Supabase.

You need:

- Project URL
- Publishable key (`sb_publishable_...`)
- Secret key (`sb_secret_...`)

The publishable key goes in the browser project.

The secret key goes ONLY into GitHub Secrets.

Never put the secret key in HTML or JavaScript.

---

## 2. Enable Anonymous Sign-Ins

In Supabase Dashboard, enable **Anonymous Sign-Ins** under the Auth settings/providers section.

NutriAI uses Anonymous Auth only to create a private user ID for each browser/device.

The user still enters the email address where reminders should be delivered.

---

## 3. Create the reminders table

Open:

**Supabase Dashboard > SQL Editor**

Run the entire file:

```text
supabase/reminders_schema.sql
```

This creates:

- `public.reminders`
- Row Level Security
- per-user SELECT/INSERT/UPDATE/DELETE policies

A browser user can access only the reminder row owned by their Supabase Auth user ID.

---

# Part B — Connect the NutriAI browser app

Open:

```text
js/config/supabaseConfig.js
```

Replace:

```javascript
url: "https://YOUR_PROJECT_REF.supabase.co",
publishableKey: "sb_publishable_REPLACE_ME"
```

with your real Supabase Project URL and **publishable** key.

Example:

```javascript
window.NUTRIAI_SUPABASE = {
  url: "https://abcxyz.supabase.co",
  publishableKey: "sb_publishable_..."
};
```

A publishable browser key is not the database master password. Security comes from Row Level Security.

Do NOT put the Supabase secret key here.

---

# Part C — GitHub Secrets

Upload the project to a GitHub repository.

Open:

**Repository > Settings > Secrets and variables > Actions**

Under **Repository secrets**, create:

## `SUPABASE_URL`

Your Supabase Project URL.

Example:

```text
https://abcxyz.supabase.co
```

## `SUPABASE_SECRET_KEY`

Your Supabase **secret** key:

```text
sb_secret_...
```

Never put this key in the browser project.

## `EMAIL_USER`

The Gmail account NutriAI will use as the sender.

Example:

```text
nutriai.reminders@gmail.com
```

## `EMAIL_APP_PASSWORD`

A Google App Password for the sender account.

Do NOT use the normal Gmail password.

---

# Part D — Optional GitHub Variables

Under:

**Settings > Secrets and variables > Actions > Variables**

Add:

## `NUTRIAI_URL`

Your deployed NutriAI website URL.

Example:

```text
https://YOUR-USERNAME.github.io/NutriAI/
```

Optional SMTP variables:

```text
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
```

If omitted, the script automatically uses those Gmail values.

---

# Part E — GitHub Pages

Open:

**Repository > Settings > Pages**

Choose:

```text
Deploy from a branch
main
/ (root)
```

Save.

---

# Part F — Use the feature

Open NutriAI.

Create/open a profile.

Open the new:

```text
Reminders
```

tab.

The user can now choose:

- Email address
- Reminder time
- Daily / Weekdays / Custom days
- Daily plan reminder
- Hydration reminder
- Sports reminder
- Weekly report reminder
- Consent
- Enable / Save
- Send Test Reminder
- Disable

---

# Test the feature

1. Enter your email in NutriAI.
2. Check the consent box.
3. Click **Enable / Save Reminders**.
4. Click **Send Test Reminder**.
5. Either wait for the GitHub Action scheduler or open:
   **GitHub > Actions > NutriAI User Email Reminders > Run workflow**
6. Check the recipient inbox.

The test request is stored in Supabase. GitHub Actions reads it and sends the message.

---

# How scheduled reminders work

The GitHub workflow runs every 5 minutes.

It does NOT assume the user lives in India.

NutriAI saves the browser's timezone, for example:

```text
Asia/Kolkata
Europe/London
America/New_York
```

The Python script converts the current time for each user and checks their saved reminder time.

A scheduled reminder is sent at most once per local day.

GitHub Actions scheduled jobs can sometimes run later than the nominal cron time. The sender therefore sends the reminder on the first available run after the user's selected time.

---

# Privacy / security design

The user's reminder email is stored in Supabase because the GitHub Action needs a server-readable destination.

Security measures included in this folder:

- Supabase Anonymous Auth
- Row Level Security
- browser only receives a publishable key
- Supabase secret key stays in GitHub Secrets
- Gmail App Password stays in GitHub Secrets
- no `EMAIL_TO` fixed recipient
- each reminder row belongs to one Auth user ID
- user consent is required before saving/enabling
- user can disable reminders in the app

For a production/commercial app, you should also add a privacy policy, abuse/rate-limiting controls, email verification, unsubscribe links, and applicable email-law compliance.

---

# Files added / changed

```text
js/config/supabaseConfig.js
js/features/reminders.js
supabase/reminders_schema.sql
scripts/send_reminder.py
.github/workflows/nutriai-email-reminder.yml
GITHUB_EMAIL_SETUP.md
```

The existing NutriAI PDF export remains browser-based and does not require Supabase or email credentials.
