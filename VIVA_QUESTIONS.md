# smartEGO AI — Viva Questions and Answers

1. **What is smartEGO AI?**  
   It is a web-based project creator that generates starter project files from a user description.

2. **Which technologies are used?**  
   HTML, CSS, JavaScript, Python, Flask, SQLite, and optionally an AI API.

3. **What is the role of HTML?**  
   It structures the web page and its form controls.

4. **What is the role of CSS?**  
   It styles the interface and makes it responsive.

5. **What is JavaScript used for?**  
   It handles form events, calls the backend API, previews files, and supports copying code.

6. **What is Flask?**  
   A lightweight Python web framework used for routes and APIs.

7. **What is an API?**  
   An interface that allows separate software components to communicate.

8. **What is JSON?**  
   A text-based data format used for structured information exchange.

9. **What is SQLite?**  
   A lightweight relational database stored in a local file.

10. **What does `/api/generate` do?**  
    It validates the request, generates or selects project files, stores them, and returns file contents.

11. **How does ZIP download work?**  
    Python's `zipfile` module packages generated files in memory and Flask sends the archive to the browser.

12. **Does the project work without an API key?**  
    Yes. It uses built-in templates, but custom AI generation needs a supported provider key.

13. **Why keep API keys in `.env`?**  
    To keep secrets on the backend rather than exposing them in frontend code.

14. **What is prompt engineering?**  
    Writing clear instructions to guide an AI model's output.

15. **Why validate file paths?**  
    To prevent unsafe paths such as directory traversal from being included in the archive.

16. **Does this app guarantee generated code is safe?**  
    No. It performs basic validation, but a human must review and test the output.

17. **What is a fallback template?**  
    A built-in starter project used when AI is not configured or generation fails.

18. **What is responsive design?**  
    Design that adapts to different device and screen sizes.

19. **What is the purpose of `requirements.txt`?**  
    It lists Python dependencies needed to run the application.

20. **What is the database table called?**  
    `generations`.

21. **What is stored in `files_json`?**  
    The generated project files and their source content encoded as JSON.

22. **What are the main starter templates?**  
    Portfolio, task manager, Python calculator, Java login demo, and CGPA calculator.

23. **Why is generated code not executed automatically?**  
    Generated code is untrusted; running it on the server could create security risks.

24. **How do you run the app?**  
    Install dependencies, configure `.env` if desired, run `python app.py`, and visit `http://127.0.0.1:5000`.

25. **What are future improvements?**  
    Authentication, more templates, sandboxed testing, version history, and production security controls.
