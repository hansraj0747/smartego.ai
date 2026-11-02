# smartEGO AI — smartEGO AI Project Creator

smartEGO AI is a Flask-based coding project generator with a responsive HTML/CSS/JavaScript interface. It offers built-in starter templates and optional AI-generated source code using an OpenAI-compatible Chat Completions API. Generated project files can be inspected in the browser and downloaded as a ZIP.

## Features

- Generate project starter files from a written description in English, Hindi, Hinglish, or other languages (AI provider language ability varies)
- Generate frontend and backend files when the idea requires a full-stack app
- Include a project report, project structure tree, generic architecture SVG, and image prompt in generated ZIPs
- Optional AI picture generation through an Images API endpoint
- AI Code Problem Solver for debugging, explaining, optimizing, and solving code
- Built-in templates: portfolio website, task manager, Python calculator, Java login demo, and CGPA calculator
- Optional AI code generation on the backend
- File explorer and code preview
- Download generated files as a ZIP archive
- SQLite storage with per-account project ownership and private AI chat history
- AI Assistant Manager with private task list (pending / in progress / done) and AI project guidance
- Email/password registration and login with PBKDF2-SHA256 password hashing
- Session cookies configured HttpOnly and SameSite=Lax
- Offline template mode when no API key is configured
- File-path validation and output size limits
- Responsive interface for mobile and desktop

## Folder structure

```text
smartEGO_AI/
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_REPORT.md
├── VIVA_QUESTIONS.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

The `creator.db` SQLite database is created automatically.

## Requirements

- Python 3.10+
- pip
- A modern web browser
- API key and internet access only for AI-generated code; built-in templates work without them

## Install and run

### Windows

```powershell
cd smartEGO_AI
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

### macOS / Linux

```bash
cd smartEGO_AI
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Open `http://127.0.0.1:5000`.

## Enable AI code generation

1. Obtain an API key from an AI provider you are authorized to use.
2. Open `.env` and set `OPENAI_API_KEY=your_key_here`.
3. Set `OPENAI_API_URL` and `OPENAI_MODEL` to values supported by that provider.
4. Restart the Flask app.
5. Keep “Use AI generation” checked in the web interface.

This implementation expects an OpenAI-compatible `/chat/completions` API. Some providers may not support `response_format: {"type":"json_object"}`; if your provider rejects it, remove the `response_format` field in `app.py` and ensure the provider still returns valid JSON. API usage may cost money. Never put the key in frontend JavaScript or commit `.env` to Git.

## How it works

1. The user enters a project description and chooses a starter template and technology.
2. JavaScript posts the request to `POST /api/generate`.
3. Flask calls the configured AI provider, or uses a built-in template if no key is configured or generation fails.
4. The server validates file paths and limits output size.
5. The browser displays the generated files.
6. `GET /api/download/<id>` packages the files into a ZIP.

## Accounts, privacy, and chat history

Open the app to register or log in. Passwords are stored as salted PBKDF2-SHA256 hashes. Generated projects and downloads are associated with the signed-in account; chat history queries are scoped to that account. Use a strong `FLASK_SECRET_KEY` in production and set `COOKIE_SECURE=1` behind HTTPS. The starter still needs CSRF protection, rate limiting, account recovery, and additional review before public production use.

The AI Chatbot section stores user and assistant messages in SQLite and includes recent messages as context for future replies. Configure the server-side AI API key.

## Online deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for Render and VPS guidance, environment variables, HTTPS, persistent database storage, and production caveats. `gunicorn app:app` is the production WSGI start command. Hosted filesystems may be temporary; configure a persistent disk or managed database.

## AI Code Problem Solver

The Code Problem Solver panel can debug, explain, optimize, or help solve code in many programming languages. Paste the code, select its language and task, and optionally add an error message or problem description. It requires the configured Chat Completions-compatible AI API. The server does not execute submitted code; it sends it to the configured provider for analysis and displays suggested fixes and tests. Do not paste passwords, API keys, private keys, or confidential source code.

## Image generation

The UI includes an optional picture creator. Configure `OPENAI_API_KEY` and, if needed, `OPENAI_IMAGE_API_URL` and `OPENAI_IMAGE_MODEL` in the server-side `.env`. The default image endpoint is `https://api.openai.com/v1/images/generations` and the default model is `gpt-image-1`; access and billing depend on your provider/account. Image API support can vary. The project ZIP also includes `IMAGE_PROMPT.md` if image generation is not configured.

Every generated ZIP now includes `PROJECT_REPORT.md`, `PROJECT_STRUCTURE.md`, `architecture.svg`, and `IMAGE_PROMPT.md`. The architecture SVG is a generic starting diagram; adjust it to match the actual code.

## API endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Render creator interface (login required) |
| GET | `/login` | Account login/registration screen |
| POST | `/api/auth/register` | Register a user account |
| POST | `/api/auth/login` | Start a session |
| POST | `/api/auth/logout` | End the session |
| GET | `/api/auth/status` | Check session status |
| GET | `/api/chat/history` | Read the signed-in user’s recent chat history |
| POST | `/api/chat` | Send a message and save the response privately |
| GET | `/api/templates` | List starter templates |
| GET | `/api/health` | Check backend and AI-key configuration |
| POST | `/api/image` | Optional image generation via configured Images API |
| POST | `/api/solve-code` | AI code debugging, explanation, optimization, and problem solving |
| POST | `/api/generate` | Generate project files |
| GET | `/api/download/<id>` | Download a generated ZIP |

## Built-in templates

- **Portfolio:** responsive static website
- **Task Manager:** interactive browser-based task list
- **Python Calculator:** command-line calculator using a restricted AST evaluator
- **Java Login Demo:** console demo with hard-coded sample credentials; educational only, not secure authentication
- **CGPA Calculator:** weighted semester GPA calculator

## Safety and limitations

- Generated code is untrusted output. Review it before running.
- The generator limits filenames and output sizes but does not prove code is safe or correct.
- Do not run generated scripts with administrator privileges.
- Do not use generated code for production without tests, security review, and dependency checks.
- Authentication and account-scoped project/chat data are included, but this remains an educational starter. Do not expose it publicly without adding CSRF protection, rate limiting, password recovery, HTTPS, monitoring, and production database/session configuration.
- The local SQLite database stores generation content and prompts; delete `creator.db` if you want to erase local history.
- The built-in templates work without AI. The AI feature requires a supported API key.

## Troubleshooting

- **Flask not found:** activate the virtual environment and run `pip install -r requirements.txt`.
- **AI generation unavailable:** verify the API key, endpoint, model, provider compatibility, and available API credits.
- **Port in use:** set `PORT=5001` in `.env` and restart.
- **ZIP download not found:** generate the project again; the ID is stored in the local SQLite database.

## Academic note

This project is intended as a learning prototype. Test generated projects before presenting or deploying them.


## AI Assistant Manager

The Assistant Manager section lets each signed-in user ask for project/coding guidance and maintain a private task list. Tasks are stored in `assistant_tasks` and every read/update/delete query is filtered by the authenticated `user_id`. The assistant does not execute code.

## Security and testing

- Passwords are stored as PBKDF2-SHA256 hashes; session cookies are HttpOnly and SameSite=Lax.
- Projects, chat history, and assistant tasks are scoped to the signed-in user.
- The backend rejects browser writes with a mismatched `Origin` header. Before a public production launch, add robust CSRF tokens, rate limiting, password reset/email verification, and security monitoring.
- Test with two accounts: user A must not be able to access user B's generated ZIP, chat history, or Assistant Manager tasks.
- AI answers require a supported server-side API key. The app does not execute submitted or AI-generated code.


## Chat attachments: photos, voice, and documents

The private AI chat supports up to 5 attachments per message (10 MB each; request total limited by Flask):
- Photos: PNG, JPG/JPEG, WEBP, GIF. The configured chat model/provider must support image inputs.
- Voice/audio: MP3, WAV, M4A, WEBM, MP4, OGG, FLAC and related common formats. Audio is transcribed through `OPENAI_TRANSCRIPTION_API_URL`; the provider must support the configured transcription model.
- Documents/source files: PDF, DOCX, TXT, Markdown, CSV, JSON and common code files. PDF/DOCX extraction uses `pypdf` and `python-docx`.

Files are processed in memory for the request; raw uploads are not saved to a public folder. Chat text, extracted document text and attachment names are stored in the signed-in user's chat history. Avoid uploading passwords, API keys, or sensitive documents. Browser microphone recording requires HTTPS (or localhost) and microphone permission.
