from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import RequirementRequest
from ai_service import analyze_requirement


app = FastAPI(
    title="AI Requirements-to-Software Architect"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Software Architect API is running"
    }


@app.post("/analyze")
def analyze(request: RequirementRequest):

    result = analyze_requirement(
        request.requirement
    )

    return result
