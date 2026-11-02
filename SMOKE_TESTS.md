# smartEGO AI Smoke Test Checklist

1. `python -m venv .venv` and install `requirements.txt`.
2. Copy `.env.example` to `.env`, set a long `FLASK_SECRET_KEY`, then run `python app.py`.
3. Register account A with a unique email and a password of at least 10 characters.
4. Generate a starter project and download its ZIP; inspect the archive.
5. Send a chatbot message after configuring the AI API; verify it appears after refresh/re-login.
6. Add an Assistant Manager task, update its status, then delete it.
7. Log out and register/login account B. Verify A's chat, projects/downloads, and tasks are not accessible.
8. Without an API key, verify template generation still works and AI endpoints show a clear configuration error.
9. For production, use HTTPS, `COOKIE_SECURE=1`, persistent storage, secret environment variables, rate limits, CSRF tokens, backups, and `gunicorn app:app`.
