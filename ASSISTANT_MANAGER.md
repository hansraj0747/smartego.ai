# AI Assistant Manager

## Features
- Ask an AI assistant for project planning, debugging guidance, and coding explanations.
- Create private tasks, add details, update status (Pending / In progress / Done), and delete tasks.
- Every task operation checks the signed-in user on the backend.
- Does not run submitted code.

## Configuration
Set `OPENAI_API_KEY`, `OPENAI_API_URL`, `OPENAI_MODEL`, and optionally `AI_API_TIMEOUT` in the server environment or `.env` file. Never expose API keys in browser JavaScript.

## API endpoints
- `GET /api/assistant-manager/tasks`
- `POST /api/assistant-manager/tasks` with `title` and optional `details`
- `PATCH /api/assistant-manager/tasks/<id>` with status `pending`, `in_progress`, or `done`
- `DELETE /api/assistant-manager/tasks/<id>`
- `POST /api/assistant-manager/ask` with a `message`

## Privacy test
Create two accounts. Tasks from account A must not appear in account B; changing or deleting a task ID owned by account A while signed in as account B must return `404`.
