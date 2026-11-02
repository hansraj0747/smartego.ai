# smartEGO AI Update Notes

This package updates the previous smartEGO smartEGO AI Project Creator archive.

## Included in this update
- Implemented missing registration, login, logout, and authentication-status endpoints.
- Passwords are stored using salted PBKDF2-HMAC-SHA256 hashes.
- Added private per-user AI chat history endpoints with recent conversation context.
- Added AI Assistant Manager with private task CRUD and AI project guidance.
- Preserved project generation, code problem solver, image generation endpoint, and owner-checked ZIP downloads.
- Added deployment guidance, assistant manager documentation, and smoke-test checklist.
- Added a basic same-origin check for browser write requests.

## Important
Python syntax checks passed for `app.py` and `assistant_manager.py`. A full Flask runtime test could not be run in this environment because Flask dependencies could not be downloaded. Before public launch, install dependencies and run `SMOKE_TESTS.md`; add robust CSRF tokens, rate limiting, email verification/password reset, monitoring, and persistent production database storage.


## Photo, voice and document uploads
- Added private chat attachment picker and browser microphone recording.
- Added image inputs for vision-capable AI chat models.
- Added PDF/DOCX/text/source-code extraction and audio transcription endpoint configuration.
- Raw files are processed in memory, not saved to a public upload directory.
- Upload limits: up to 5 attachments, 10 MB per attachment, bounded request size.
- Check provider support for image inputs and transcription before deployment.
