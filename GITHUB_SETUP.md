# NutriAI GitHub Setup

The old V28 fixed-recipient reminder setup has been replaced.

For the real per-user reminder system in V29, follow:

`GITHUB_EMAIL_SETUP.md`

V29 no longer uses an `EMAIL_TO` GitHub secret. Each user enters their own email in the NutriAI **Reminders** tab, and that address is stored in the RLS-protected Supabase `reminders` table.
