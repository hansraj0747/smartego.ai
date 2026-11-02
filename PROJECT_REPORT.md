# PROJECT REPORT
## smartEGO AI — smartEGO AI Project Creator

**Student name:** ____________________  
**Roll number:** ____________________  
**Course / semester:** ____________________  
**Institute:** ____________________  
**Academic year:** ____________________

## 1. Abstract
smartEGO AI is a web application that generates starter coding projects from a user's description. It provides built-in project templates and optional AI-powered source code generation. The user can inspect the files in the browser and download them as a ZIP. The application uses HTML, CSS, and JavaScript for the frontend, Python Flask for the backend, and SQLite for storing generation records.

## 2. Problem statement
Students and beginner developers often need a starting point for projects but may struggle with folder structure, boilerplate code, and setup instructions. smartEGO AI offers a single interface to generate, inspect, and download starter project files.

## 3. Objectives
- Create a responsive project-generator interface.
- Accept a project description, language, and starter template.
- Generate code using an optional AI API.
- Provide usable starter templates without an API key.
- Preview generated files and download them as ZIP.
- Store generated projects locally in SQLite.
- Apply basic input validation and file-path restrictions.

## 4. Technologies
- HTML: page structure
- CSS: responsive layout and visual styling
- JavaScript: user interaction, API requests, and file preview
- Python: backend logic and ZIP creation
- Flask: web routes and JSON APIs
- SQLite: generation record storage
- Optional OpenAI-compatible API: custom AI-generated source code

## 5. System architecture
1. User enters a project description in the browser.
2. JavaScript sends a JSON request to `/api/generate`.
3. Flask validates the request.
4. If configured, the backend requests JSON-formatted project files from the AI provider. Otherwise it selects a built-in starter template.
5. The server validates filenames and output size.
6. Project metadata and generated file contents are stored in SQLite.
7. The frontend displays a file list and code preview.
8. The download endpoint builds a ZIP archive in memory and sends it to the browser.

## 6. Modules
- **User interface:** form, template chooser, technology selector
- **Generation service:** AI provider request or template fallback
- **Output validator:** limits file count, content size, and filename paths
- **File preview:** displays generated source in the browser
- **ZIP builder:** creates a downloadable archive
- **Database:** stores project prompt, settings, timestamp, and files

## 7. Database design
Table: `generations`

| Field | Type | Purpose |
|---|---|---|
| id | TEXT | Unique generation ID |
| prompt | TEXT | User's project description |
| template_key | TEXT | Selected template |
| language | TEXT | Preferred technology |
| created_at | TEXT | UTC creation timestamp |
| files_json | TEXT | Generated files stored as JSON |

## 8. Installation and operation
1. Install Python 3.10 or newer.
2. Create and activate a virtual environment.
3. Run `pip install -r requirements.txt`.
4. Copy `.env.example` to `.env`.
5. Optionally configure an AI provider key and model.
6. Run `python app.py`.
7. Open `http://127.0.0.1:5000`.
8. Enter a project description and generate files.
9. Inspect the source and download the ZIP.
10. Test generated code in a safe development environment.

## 9. Testing

| Test case | Expected result |
|---|---|
| Open home page | Creator form appears |
| Submit empty prompt | Validation error is returned |
| Select built-in template | Template files are generated |
| API key absent | Built-in fallback project is generated |
| Valid API configuration | AI-generated files are returned, if provider supports request |
| Click file name | Corresponding source is displayed |
| Click Copy code | Current source is copied where clipboard access is allowed |
| Click Download ZIP | Archive containing project files downloads |
| Malformed or oversized AI output | Output is rejected and fallback template is used |

## 10. Advantages
- Easy for students to use
- Built-in templates work without API credentials
- Supports multiple programming languages through AI prompts
- Shows source files before download
- ZIP download simplifies project handoff
- Can be extended with new templates

## 11. Limitations
- AI-generated code may contain bugs or insecure patterns.
- Provider availability, model access, and usage costs vary.
- Generated code is not automatically executed or tested by the server.
- Authentication and public-deployment security are not included.
- Built-in templates are limited to the included examples.

## 12. Future enhancements
- User accounts and project history dashboard
- Automated syntax and unit tests in a sandbox
- More templates and framework support
- Export project report and diagrams
- Git integration
- Version comparison and regeneration
- Usage quotas, moderation, rate limiting, and production deployment

## 13. Conclusion
smartEGO AI demonstrates a project-generation workflow integrating frontend design, a Python backend, optional AI API use, database persistence, source preview, and ZIP download. It is a useful educational prototype that can be expanded with testing, security controls, and more templates.

## 14. References
- Python: https://docs.python.org/3/
- Flask: https://flask.palletsprojects.com/
- SQLite: https://www.sqlite.org/docs.html
- MDN Web Docs: https://developer.mozilla.org/
