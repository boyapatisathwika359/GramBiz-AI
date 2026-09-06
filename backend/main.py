from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import json


# =========================================================
# GRAMBIZ AI BACKEND
# =========================================================

app = FastAPI(
    title="GramBiz AI API",
    description="AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant",
    version="3.0.0"
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
# FILE PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_FILE = BASE_DIR / "data" / "business_data.json"

LOCAL_MARKET_FILE = (
    BASE_DIR / "data" / "local_market_data.json"
)


# =========================================================
# LOAD BUSINESS DATA
# =========================================================

def load_business_data():

    try:

        with open(
            DATA_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except FileNotFoundError:

        print(
            "ERROR: business_data.json was not found."
        )

        return []

    except json.JSONDecodeError:

        print(
            "ERROR: business_data.json contains invalid JSON."
        )

        return []


BUSINESSES = load_business_data()


# =========================================================
# LOAD LOCAL MARKET DATA
# =========================================================

def load_local_market_data():

    try:

        with open(
            LOCAL_MARKET_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except FileNotFoundError:

        print(
            "WARNING: local_market_data.json was not found."
        )

        return []

    except json.JSONDecodeError:

        print(
            "WARNING: local_market_data.json contains invalid JSON."
        )

        return []


LOCAL_MARKET_DATA = load_local_market_data()


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

        "message":
            "GramBiz AI Backend is running successfully!",

        "businesses_loaded":
            len(BUSINESSES),

        "local_market_records":
            len(LOCAL_MARKET_DATA)

    }


# =========================================================
# TEXT NORMALIZATION
# =========================================================

def normalize_text(value: str) -> str:

    return value.strip().lower()


# =========================================================
# LOCATION MATCHING
# =========================================================

def find_local_market_data(user_location):

    user_location = normalize_text(
        user_location
    )

    if not user_location:

        return None, "Default estimate"


    # -----------------------------------------------------
    # Exact location matching
    # -----------------------------------------------------

    for location_data in LOCAL_MARKET_DATA:

        stored_location = normalize_text(
            location_data.get("location", "")
        )

        if (
            stored_location
            and stored_location in user_location
        ):

            return location_data, "Local data"


    # -----------------------------------------------------
    # Reverse partial matching
    # -----------------------------------------------------

    for location_data in LOCAL_MARKET_DATA:

        stored_location = normalize_text(
            location_data.get("location", "")
        )

        if (
            stored_location
            and user_location in stored_location
        ):

            return location_data, "Regional data"


    # -----------------------------------------------------
    # No matching data
    # -----------------------------------------------------

    return None, "Default estimate"


# =========================================================
# SKILL SCORE
# =========================================================

def calculate_skill_score(
    user_skills,
    business_skills
):

    if not user_skills:

        return 0

    user_skills = {

        normalize_text(skill)

        for skill in user_skills

    }

    business_skills = {

        normalize_text(skill)

        for skill in business_skills

    }

    matched = user_skills.intersection(
        business_skills
    )

    if not business_skills:

        return 0

    return (
        len(matched)
        / len(business_skills)
    ) * 100


# =========================================================
# RESOURCE SCORE
# =========================================================

def calculate_resource_score(
    user_resources,
    business_resources
):

    if not user_resources:

        return 0

    user_resources = {

        normalize_text(resource)

        for resource in user_resources

    }

    business_resources = {

        normalize_text(resource)

        for resource in business_resources

    }

    matched = user_resources.intersection(
        business_resources
    )

    if not business_resources:

        return 0

    return (
        len(matched)
        / len(business_resources)
    ) * 100


# =========================================================
# BUDGET SCORE
# =========================================================

def calculate_budget_score(
    user_budget,
    required_investment
):

    if (
        user_budget <= 0
        or required_investment <= 0
    ):

        return 0

    if user_budget >= required_investment:

        return 100

    score = (
        user_budget
        / required_investment
    ) * 100

    return min(score, 100)


# =========================================================
# BUSINESS INTEREST SCORE
# =========================================================

def calculate_interest_score(
    user_business,
    business_name
):

    user_business = normalize_text(
        user_business
    )

    business_name = normalize_text(
        business_name
    )

    if not user_business:

        return 0

    if user_business == business_name:

        return 100


    keywords = (
        user_business
        .replace("/", " ")
        .split()
    )

    business_words = (
        business_name
        .replace("/", " ")
        .split()
    )


    if any(

        keyword in business_word

        for keyword in keywords

        for business_word in business_words

    ):

        return 70


    related_groups = [

        {
            "food",
            "cooking",
            "tiffin",
            "processing"
        },

        {
            "farm",
            "farming",
            "vegetable",
            "poultry",
            "dairy"
        },

        {
            "tailor",
            "tailoring"
        },

        {
            "repair",
            "mobile"
        },

        {
            "digital",
            "computer"
        },

        {
            "retail",
            "grocery",
            "shop"
        },

        {
            "handicraft",
            "handicrafts"
        }

    ]


    for group in related_groups:

        if (
            any(
                word in group
                for word in keywords
            )

            and

            any(
                word in group
                for word in business_words
            )
        ):

            return 60


    return 0


# =========================================================
# DEMAND SCORE
# =========================================================

def calculate_demand_score(demand):

    demand = normalize_text(
        str(demand)
    )

    if demand == "high":

        return 100

    elif demand == "medium":

        return 70

    else:

        return 40


# =========================================================
# COMPETITION SCORE
#
# Lower competition is better.
# =========================================================

def calculate_competition_score(
    competition
):

    competition = normalize_text(
        str(competition)
    )

    if competition == "low":

        return 100

    elif competition == "medium":

        return 70

    elif competition == "high":

        return 40

    else:

        return 70


# =========================================================
# TRANSPORTATION SCORE
# =========================================================

def calculate_transport_score(
    transportation
):

    transportation = normalize_text(
        str(transportation)
    )

    if transportation == "excellent":

        return 100

    elif transportation == "good":

        return 80

    elif transportation == "medium":

        return 60

    elif transportation == "poor":

        return 40

    else:

        return 70


# =========================================================
# RAW MATERIAL SCORE
# =========================================================

def calculate_raw_material_score(
    availability
):

    availability = normalize_text(
        str(availability)
    )

    if availability == "excellent":

        return 100

    elif availability == "good":

        return 80

    elif availability == "medium":

        return 60

    elif availability == "poor":

        return 40

    else:

        return 70


# =========================================================
# SEASONAL DEMAND SCORE
# =========================================================

def calculate_seasonal_score(
    seasonal_demand
):

    seasonal_demand = normalize_text(
        str(seasonal_demand)
    )

    if seasonal_demand == "high":

        return 100

    elif seasonal_demand == "medium":

        return 70

    elif seasonal_demand == "low":

        return 40

    else:

        return 70


# =========================================================
# LOCAL MARKET SCORE
# =========================================================

def calculate_local_market_score(
    market_data,
    business_name
):

    # -----------------------------------------------------
    # No exact local data
    # -----------------------------------------------------

    if not market_data:

        return {

            "local_score": 70,

            "demand_score": 70,

            "competition_score": 70,

            "transport_score": 70,

            "raw_material_score": 70,

            "seasonal_score": 70,

            "data_status": "Default estimate"

        }


    # -----------------------------------------------------
    # Customer demand for selected business
    # -----------------------------------------------------

    customer_demand = market_data.get(
        "customer_demand",
        {}
    )

    business_demand = customer_demand.get(
        business_name,
        "Medium"
    )


    demand_score = calculate_demand_score(
        business_demand
    )


    competition_score = calculate_competition_score(
        market_data.get(
            "competition",
            "Medium"
        )
    )


    transport_score = calculate_transport_score(
        market_data.get(
            "transportation",
            "Good"
        )
    )


    raw_material_score = calculate_raw_material_score(
        market_data.get(
            "raw_material_availability",
            "Good"
        )
    )


    seasonal_score = calculate_seasonal_score(
        market_data.get(
            "seasonal_demand",
            "Medium"
        )
    )


    # -----------------------------------------------------
    # Local market weighted score
    # -----------------------------------------------------

    local_score = (

        demand_score * 0.40

        + competition_score * 0.20

        + transport_score * 0.15

        + raw_material_score * 0.15

        + seasonal_score * 0.10

    )


    return {

        "local_score":
            round(local_score),

        "demand_score":
            round(demand_score),

        "competition_score":
            round(competition_score),

        "transport_score":
            round(transport_score),

        "raw_material_score":
            round(raw_material_score),

        "seasonal_score":
            round(seasonal_score),

        "data_status":
            "Local market data"

    }


# =========================================================
# BUSINESS ANALYSIS
# =========================================================

@app.post("/api/analyze")
def analyze_business(request: BusinessRequest):

    print(
        "\n================================="
    )

    print(
        "GRAMBIZ AI - BUSINESS ANALYSIS"
    )

    print(
        "================================="
    )

    print(
        "Location  :",
        request.location
    )

    print(
        "Budget    :",
        request.budget
    )

    print(
        "Business  :",
        request.business
    )

    print(
        "Skills    :",
        request.skills
    )

    print(
        "Resources :",
        request.resources
    )

    print(
        "Businesses Loaded:",
        len(BUSINESSES)
    )

    print(
        "Local Market Records:",
        len(LOCAL_MARKET_DATA)
    )


    # =====================================================
    # VALIDATE BUDGET
    # =====================================================

    if request.budget <= 0:

        return {

            "message":
                "Budget must be greater than zero."

        }


    # =====================================================
    # CHECK BUSINESS DATA
    # =====================================================

    if not BUSINESSES:

        return {

            "message":
                "Business data could not be loaded."

        }


    # =====================================================
    # FIND LOCAL DATA
    # =====================================================

    local_market_data, data_status = (
        find_local_market_data(
            request.location
        )
    )


    print(
        "Market Data Status:",
        data_status
    )


    # =====================================================
    # CALCULATE RECOMMENDATIONS
    # =====================================================

    recommendations = []


    for business in BUSINESSES:


        # -------------------------------------------------
        # Existing scores
        # -------------------------------------------------

        skill_score = calculate_skill_score(

            request.skills,

            business["skills"]

        )


        resource_score = calculate_resource_score(

            request.resources,

            business["resources"]

        )


        budget_score = calculate_budget_score(

            request.budget,

            business["investment"]

        )


        interest_score = calculate_interest_score(

            request.business,

            business["name"]

        )


        # -------------------------------------------------
        # Local market score
        # -------------------------------------------------

        local_market = calculate_local_market_score(

            local_market_data,

            business["name"]

        )


        local_score = local_market[
            "local_score"
        ]


        # -------------------------------------------------
        # FINAL WEIGHTED SCORE
        #
        # Skill        = 25%
        # Resource     = 20%
        # Budget       = 20%
        # Local Market = 25%
        # Interest     = 10%
        # -------------------------------------------------

        final_score = (

            skill_score * 0.25

            + resource_score * 0.20

            + budget_score * 0.20

            + local_score * 0.25

            + interest_score * 0.10

        )


        final_score = round(
            final_score
        )


        # -------------------------------------------------
        # Explanation
        # -------------------------------------------------

        explanation_parts = []


        if skill_score >= 70:

            explanation_parts.append(
                "Strong skill match"
            )

        elif skill_score >= 40:

            explanation_parts.append(
                "Partial skill match"
            )


        if resource_score >= 70:

            explanation_parts.append(
                "Suitable resources available"
            )

        elif resource_score >= 40:

            explanation_parts.append(
                "Some required resources available"
            )


        if budget_score >= 80:

            explanation_parts.append(
                "Fits the available budget"
            )

        elif budget_score >= 50:

            explanation_parts.append(
                "Partially fits the available budget"
            )


        if local_market[
            "demand_score"
        ] >= 80:

            explanation_parts.append(
                "Strong local demand"
            )

        elif local_market[
            "demand_score"
        ] >= 60:

            explanation_parts.append(
                "Moderate local demand"
            )


        if local_market[
            "competition_score"
        ] >= 80:

            explanation_parts.append(
                "Lower competition"
            )

        elif local_market[
            "competition_score"
        ] < 50:

            explanation_parts.append(
                "Higher competition"
            )


        if not explanation_parts:

            explanation_parts.append(
                "Requires further local validation"
            )


        explanation = ", ".join(
            explanation_parts
        )


        # -------------------------------------------------
        # Recommendation object
        # -------------------------------------------------

        recommendations.append({

            "name":
                business["name"],

            "category":
                business.get(
                    "category",
                    ""
                ),

            "match_score":
                final_score,

            "skill_score":
                round(skill_score),

            "resource_score":
                round(resource_score),

            "budget_score":
                round(budget_score),

            "market_score":
                round(local_score),

            "local_market_score":
                round(local_score),

            "demand_score":
                local_market[
                    "demand_score"
                ],

            "competition_score":
                local_market[
                    "competition_score"
                ],

            "transport_score":
                local_market[
                    "transport_score"
                ],

            "raw_material_score":
                local_market[
                    "raw_material_score"
                ],

            "seasonal_score":
                local_market[
                    "seasonal_score"
                ],

            "interest_score":
                round(interest_score),

            "estimated_investment":
                business["investment"],

            "demand":
                business["demand"],

            "local_demand":
                local_market_data.get(
                    "customer_demand",
                    {}
                ).get(
                    business["name"],
                    "Medium"
                ),

            "competition":
                business["competition"],

            "local_competition":
                local_market_data.get(
                    "competition",
                    "Medium"
                ),

            "risk":
                business["risk"],

            "transportation":
                local_market_data.get(
                    "transportation",
                    "Good"
                ),

            "raw_material_availability":
                local_market_data.get(
                    "raw_material_availability",
                    "Good"
                ),

            "seasonal_demand":
                local_market_data.get(
                    "seasonal_demand",
                    "Medium"
                ),

            "data_status":
                local_market[
                    "data_status"
                ],

            "explanation":
                explanation

        })


    # =====================================================
    # SORT BEST TO WORST
    # =====================================================

    recommendations.sort(

        key=lambda item:
            item["match_score"],

        reverse=True

    )


    # =====================================================
    # BEST RECOMMENDATION
    # =====================================================

    best = recommendations[0]


    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    result = {

        "recommendation":
            best["name"],

        "match_score":
            best["match_score"],

        "estimated_investment":
            best["estimated_investment"],

        "demand":
            best["demand"],

        "competition":
            best["competition"],

        "risk":
            best["risk"],

        "location":
            request.location,

        "market_data_status":
            data_status,

        "local_market_score":
            best["local_market_score"],

        "local_demand":
            best["local_demand"],

        "local_competition":
            best["local_competition"],

        "transportation":
            best["transportation"],

        "raw_material_availability":
            best["raw_material_availability"],

        "seasonal_demand":
            best["seasonal_demand"],

        "recommendation_explanation":
            best["explanation"],

        "message":
            "Business analysis completed successfully.",

        "recommendations":
            recommendations,

        "scoring_weights": {

            "skill_match":
                "25%",

            "resource_match":
                "20%",

            "budget_match":
                "20%",

            "local_market":
                "25%",

            "business_interest":
                "10%"

        },

        "disclaimer":
            "Market scores are estimates based on available data. "
            "Actual demand, competition, costs and business performance "
            "may vary. Validate the opportunity locally before investing."

    }


    # =====================================================
    # PRINT RESULT
    # =====================================================

    print(
        "\n================================="
    )

    print(
        "GRAMBIZ AI - RECOMMENDATIONS"
    )

    print(
        "================================="
    )


    for index, item in enumerate(

        recommendations[:5],

        start=1

    ):

        print(

            f"{index}. "
            f"{item['name']} "
            f"- {item['match_score']}%"

        )


    print(
        "\nBEST RECOMMENDATION:"
    )

    print(
        best["name"]
    )

    print(
        "MATCH SCORE:",
        best["match_score"],
        "%"
    )

    print(
        "LOCAL MARKET SCORE:",
        best["local_market_score"],
        "%"
    )

    print(
        "MARKET DATA:",
        data_status
    )

    print(
        "=================================\n"
    )


    # =====================================================
    # RETURN RESULT TO REACT
    # =====================================================

    return result