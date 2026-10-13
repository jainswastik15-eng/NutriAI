import json
import os
import smtplib
import ssl
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from email.message import EmailMessage
from zoneinfo import ZoneInfo


def required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(
            f"Missing {name}. Add it in GitHub repository "
            f"Settings > Secrets and variables > Actions."
        )
    return value


SUPABASE_URL = required("SUPABASE_URL").rstrip("/")
SUPABASE_SECRET_KEY = required("SUPABASE_SECRET_KEY")
EMAIL_USER = required("EMAIL_USER")
EMAIL_APP_PASSWORD = required("EMAIL_APP_PASSWORD")

NUTRIAI_URL = os.getenv("NUTRIAI_URL", "").strip()
SMTP_HOST = os.getenv("SMTP_HOST", "").strip() or "smtp.gmail.com"
SMTP_PORT = int(os.getenv("SMTP_PORT", "").strip() or "465")


def supabase_request(method: str, path: str, payload=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    data = None
    headers = {
        "apikey": SUPABASE_SECRET_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Prefer"] = "return=minimal"

    request = urllib.request.Request(
        url,
        data=data,
        headers=headers,
        method=method,
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        raw = response.read().decode("utf-8")
        return json.loads(raw) if raw else None


def parse_iso(value):
    if not value:
        return None
    text = str(value).replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(text)
    except ValueError:
        return None


def parse_time(value):
    # Supabase may return HH:MM:SS.
    parts = str(value or "18:00").split(":")
    hour = int(parts[0]) if parts and parts[0] else 18
    minute = int(parts[1]) if len(parts) > 1 else 0
    return hour, minute


def due_today(row, local_now):
    frequency = row.get("frequency", "daily")
    iso_day = local_now.isoweekday()  # Monday=1 ... Sunday=7

    if frequency == "weekdays":
        return iso_day <= 5

    if frequency == "custom":
        days = row.get("custom_days") or []
        return iso_day in [int(x) for x in days]

    return True


def already_sent_today(row, local_now):
    last = parse_iso(row.get("last_sent_at"))
    if not last:
        return False
    try:
        last_local = last.astimezone(local_now.tzinfo)
    except Exception:
        return False
    return last_local.date() == local_now.date()


def test_is_due(row):
    requested = parse_iso(row.get("test_requested_at"))
    sent = parse_iso(row.get("test_sent_at"))
    return bool(requested and (not sent or sent < requested))


def scheduled_is_due(row, local_now):
    if not row.get("enabled", False) or not row.get("consent", False):
        return False

    if not due_today(row, local_now):
        return False

    if already_sent_today(row, local_now):
        return False

    hour, minute = parse_time(row.get("reminder_time"))
    scheduled_minutes = hour * 60 + minute
    now_minutes = local_now.hour * 60 + local_now.minute

    # Send once the user's scheduled local time has been reached.
    # GitHub scheduled workflows may run a little late, so this is
    # intentionally not limited to an exact one-minute window.
    return now_minutes >= scheduled_minutes

def build_message(row, is_test=False):
    name = (row.get("profile_name") or "").strip()
    greeting = f"Hi {name}," if name else "Hi!"

    reminder_types = row.get("reminder_types") or {}
    lines = []

    if reminder_types.get("daily_plan"):
        lines.append("🥗 Check your planned meals and choose what fits your day.")
    if reminder_types.get("hydration"):
        lines.append("💧 Check your hydration and drink according to thirst and your routine.")
    if reminder_types.get("sports"):
        lines.append("🏃 If you are training today, review your Sports Mode fuel and recovery guidance.")
    if reminder_types.get("weekly_report"):
        lines.append("📊 Open NutriAI to review your recent nutrition and wellness progress.")

    if not lines:
        lines.append("🌿 Open NutriAI for your personalized wellness plan.")

    message = EmailMessage()

    message["Subject"] = "Test"
    message["From"] = f"NutriAI" <{EMAIL_USER}>"
    message["To"] = row["email"]
    
    body = [
        greeting,
        "",
        "This is your NutriAI reminder:" if not is_test else "Your NutriAI email reminder setup is working.",
        "",
        *lines,
        "",
    ]
    if NUTRIAI_URL:
        body.extend([f"Open NutriAI: {NUTRIAI_URL}", ""])

    body.extend([
        "You enabled this reminder inside NutriAI.",
        "NutriAI is an educational wellness project and does not replace professional medical advice.",
    ])

    message.set_content("\n".join(body))
    return message
    body = [
        greeting,
        "",
        "This is your NutriAI reminder:" if not is_test else "Your NutriAI email reminder setup is working.",
        "",
        *lines,
        "",
    ]
    if NUTRIAI_URL:
        body.extend([f"Open NutriAI: {NUTRIAI_URL}", ""])

    body.extend([
        "You enabled this reminder inside NutriAI.",
        "NutriAI is an educational wellness project and does not replace professional medical advice.",
    ])

    message.set_content("\n".join(body))
    return message


def update_row(user_id, payload):
    encoded = urllib.parse.quote(str(user_id), safe="")
    path = f"reminders?user_id=eq.{encoded}"
    supabase_request("PATCH", path, payload)


def main():
    rows = supabase_request(
        "GET",
        "reminders?enabled=eq.true&consent=eq.true&select=*"
    ) or []

    now_utc = datetime.now(timezone.utc)
    due = []

    for row in rows:
        try:
            tz = ZoneInfo(row.get("timezone") or "UTC")
        except Exception:
            tz = timezone.utc

        local_now = now_utc.astimezone(tz)

        if test_is_due(row):
            due.append((row, True, local_now))
        elif scheduled_is_due(row, local_now):
            due.append((row, False, local_now))

    if not due:
        print("No NutriAI reminders are due.")
        return

    context = ssl.create_default_context()
    sent_count = 0

    with smtplib.SMTP_SSL(
        SMTP_HOST,
        SMTP_PORT,
        context=context,
        timeout=30
    ) as smtp:
        smtp.login(EMAIL_USER, EMAIL_APP_PASSWORD)

        for row, is_test, local_now in due:
            try:
                message = build_message(row, is_test=is_test)
                refused = smtp.send_message(message)

                timestamp = datetime.now(timezone.utc).isoformat()
                payload = {"updated_at": timestamp}

                if is_test:
                    payload["test_sent_at"] = timestamp
                else:
                    payload["last_sent_at"] = timestamp

                update_row(row["user_id"], payload)
                sent_count += 1

                kind = "test" if is_test else "scheduled"
                print(
                    f"Sent {kind} NutriAI reminder to "
                    f"{row['email']} ({local_now.tzinfo})."
                )
            except Exception as exc:
                # One bad recipient should not prevent other due reminders.
                print(
                    f"ERROR sending reminder for user "
                    f"{row.get('user_id')}: {exc}"
                )

    print(f"Completed. Sent {sent_count} reminder(s).")


if __name__ == "__main__":
    main()
