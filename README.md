# Resume Optimizer

This project demonstrates a simple React/Vite front end with a FastAPI back end. It reads the job description from the active browser tab (when used as a Chrome extension) and updates resume bullet points with keywords from that description.

## Backend

The API is implemented with FastAPI. Install dependencies and run the server:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The `/process` endpoint accepts a job description and resume text and returns updated bullet points.

## Frontend

The front end is a Vite + React application. It can also be loaded as a Chrome extension to read the active tab.

```
cd frontend
npm install
npm run dev
```

To use as a Chrome extension, build the project and load the `frontend` directory in developer mode.

```bash
npm run build
```

Then open Chrome's extensions page and load the `frontend` folder as an unpacked extension.
