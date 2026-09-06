from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# =========================================================
# GRAMBIZ AI BACKEND
# =========================================================

app = FastAPI(
    title="GramBiz AI API",
    description="AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class BusinessRequest(BaseModel):
    location: str
    budget: float
    business: str
    skills: list[str]
    resources: list[str]


# =========================================================
# ROOT TEST
# =========================================================

@app.get("/")
def home():
    return {
        "message": "GramBiz AI Backend is running successfully!"
    }


# =========================================================
# BUSINESS ANALYSIS
# =========================================================

@app.post("/api/analyze")
def analyze_business(request: BusinessRequest):

    print("\n=================================")
    print("GRAMBIZ AI - BUSINESS ANALYSIS")
    print("=================================")

    print("Location  :", request.location)
    print("Budget    :", request.budget)
    print("Business  :", request.business)
    print("Skills    :", request.skills)
    print("Resources :", request.resources)

    # -----------------------------------------------------
    # Basic AI-style recommendation logic
    # -----------------------------------------------------

    business = request.business.strip()

    recommendation = business
    match_score = 90

    # Simple demo rules
    business_lower = business.lower()

    if "tailor" in business_lower:
        recommendation = "Tailoring"
        match_score = 90

    elif "dairy" in business_lower:
        recommendation = "Dairy Farming"
        match_score = 88

    elif "poultry" in business_lower:
        recommendation = "Poultry Farming"
        match_score = 87

    elif "food" in business_lower or "cooking" in business_lower:
        recommendation = "Food Processing"
        match_score = 89

    elif "repair" in business_lower:
        recommendation = "Mobile Repair"
        match_score = 88

    elif "handicraft" in business_lower:
        recommendation = "Handicrafts"
        match_score = 86

    elif "digital" in business_lower:
        recommendation = "Digital Service Center"
        match_score = 89

    elif "grocery" in business_lower or "retail" in business_lower:
        recommendation = "Small Grocery Store"
        match_score = 85

    elif "farming" in business_lower or "vegetable" in business_lower:
        recommendation = "Vegetable Farming"
        match_score = 88

    # -----------------------------------------------------
    # Result
    # -----------------------------------------------------

    result = {
        "recommendation": recommendation,
        "match_score": match_score,
        "estimated_investment": request.budget,
        "demand": "High",
        "competition": "Medium",
        "risk": "Low",
        "location": request.location,
        "message": "Business analysis completed successfully."
    }

    # -----------------------------------------------------
    # Print result in terminal
    # -----------------------------------------------------

    print("\nBACKEND RESPONSE:")
    print(result)

    print("=================================\n")

    # VERY IMPORTANT:
    # Return the result to React frontend
    return result