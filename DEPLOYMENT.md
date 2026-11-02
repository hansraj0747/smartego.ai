# Online Deployment Guide — smartEGO AI

This guide deploys the Flask app to a Python-capable host such as Render, Railway, or a VPS. Provider dashboards and free-tier limits change, so follow the provider's current Python/Flask instructions.

## Before publishing
- Set `OPENAI_API_KEY`, `OPENAI_API_URL`, and `OPENAI_MODEL` as server-side environment variables. Never place keys in HTML/JavaScript or commit `.env`.
- Set `FLASK_SECRET_KEY` to a long, random secret (for example, generate one with `python -c "import secrets; print(secrets.token_hex(32))"`).
- Set `COOKIE_SECURE=1` when served over HTTPS.
- Use HTTPS, configure request/rate limits at the host or reverse proxy, monitor costs, and keep dependencies updated.
- This app uses SQLite. Many hosted filesystems are ephemeral; attach a persistent disk/volume and place `DB_PATH` on it, or migrate to managed PostgreSQL before relying on production data.
- Back up the database securely. Passwords are stored as PBKDF2-SHA256 hashes, not plaintext. Chat history and generated projects are private per account in the app's database.

## Deploy with Render (example)
1. Push the extracted `smartEGO_AI` folder to a private Git repository.
2. In Render, create a new **Web Service** from that repository.
3. Set **Root Directory** to `smartEGO_AI`.
4. Set **Build Command** to `pip install -r requirements.txt`.
5. Set **Start Command** to `gunicorn app:app`.
6. Add environment variables: `FLASK_SECRET_KEY`, `COOKIE_SECURE=1`, `OPENAI_API_KEY`, and optionally `OPENAI_API_URL`, `OPENAI_MODEL`, `AI_API_TIMEOUT`.
7. Add a persistent disk mounted at `/var/data` if your plan supports it, then set `DB_PATH=/var/data/creator.db`. Confirm the provider's filesystem/disk settings before deploying.
8. Deploy, open the HTTPS URL, create a test account, generate a project, download its ZIP, send a chat message, log out, and sign in again to verify history remains.
9. Configure a custom domain only after HTTPS is active.

## Deploy with a generic Linux VPS
1. Install Python 3.10+, create a virtual environment, and install `requirements.txt`.
2. Set environment variables in your service manager (do not store secrets in the repository).
3. Install Gunicorn: `pip install gunicorn`.
4. Run `gunicorn --workers 2 --bind 127.0.0.1:8000 app:app`.
5. Put Nginx or another reverse proxy in front, enable HTTPS, set `COOKIE_SECURE=1`, and configure backups, firewall rules, request limits, and process restart.
6. Set `DB_PATH` to a durable, permission-restricted location.

## Important production caveats
- This is an educational starter. Before a public launch, add CSRF protection for state-changing requests, rate limiting on authentication and AI endpoints, email verification/password reset, privacy/retention controls, and centralized error monitoring.
- For multi-instance hosting, use managed PostgreSQL instead of SQLite and shared session storage if needed.
- The app never executes user-submitted or AI-generated code. Do not add unsandboxed code execution to the web server.
- Test with two separate accounts: account A must not be able to fetch account B's project download or chat history.


## Assistant Manager deployment checks

After deployment, sign in and create an Assistant Manager task, change its status, ask a question, then sign out. Sign in with a second account and verify the first account's tasks and chat are not visible. For durable data, ensure `DB_PATH` points to a persistent disk or use a managed database.
