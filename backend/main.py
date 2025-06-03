from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import re
from collections import Counter

app = FastAPI()

STOP_WORDS = {
    "the", "and", "a", "an", "to", "of", "in", "on", "for", "with", "at", "from",
    "as", "by", "is", "are", "be", "this", "that", "it", "or", "we", "you", "your",
}

def tokenize(text: str) -> List[str]:
    words = re.findall(r"\b[a-zA-Z]{2,}\b", text.lower())
    return [w for w in words if w not in STOP_WORDS]

def extract_keywords(text: str, limit: int = 10) -> List[str]:
    tokens = tokenize(text)
    counts = Counter(tokens)
    return [w for w, _ in counts.most_common(limit)]

def update_bullets(resume_text: str, keywords: List[str]) -> List[str]:
    bullets = [line.strip('- ').strip() for line in resume_text.strip().splitlines() if line.strip()]
    updated = []
    for line in bullets:
        lower_line = line.lower()
        missing = [kw for kw in keywords if kw not in lower_line]
        if missing:
            line = f"{line} {' '.join(missing[:2])}"
        updated.append(line)
    return updated

class ResumeRequest(BaseModel):
    job_description: str
    resume_text: str

class ResumeResponse(BaseModel):
    updated_bullets: List[str]

@app.post("/process", response_model=ResumeResponse)
def process_resume(req: ResumeRequest):
    keywords = extract_keywords(req.job_description)
    bullets = update_bullets(req.resume_text, keywords)
    return {"updated_bullets": bullets}
