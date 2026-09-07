from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# =========================================================
# APP CONFIGURATION
# =========================================================

app = FastAPI(
    title="GramBiz AI API",
    description=(
        "AI-Driven Hyper-Local Business Advisory and "
        "Financial Structuring Assistant for Rural Micro-Entrepreneurs"
    ),
    version="1.0.0",
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
# EXCEL CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

EXCEL_FILE = BASE_DIR / "GramBiz_Member1_Data.xlsx"


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def normalize_text(value):
    """
    Convert a value to clean lowercase text.
    """

    if value is None:
        return ""

    text = str(value).strip().lower()

    if text == "nan":
        return ""

    return text


def clean_text(value):
    """
    Return a clean string value.
    """

    if value is None:
        return ""

    text = str(value).strip()

    if text.lower() == "nan":
        return ""

    return text


def safe_float(value, default=0.0):
    """
    Safely convert a value to float.
    Handles ₹, commas and percentages.
    """

    try:

        if value is None or pd.isna(value):
            return default

        if isinstance(value, (int, float)):
            return float(value)

        text = str(value)

        text = (
            text
            .replace("₹", "")
            .replace(",", "")
            .replace("%", "")
            .strip()
        )

        if not text:
            return default

        return float(text)

    except (ValueError, TypeError):

        return default


def split_items(value):
    """
    Convert comma-separated Excel values into a clean list.
    """

    if value is None or pd.isna(value):
        return []

    text = str(value).strip()

    if not text or text.lower() == "nan":
        return []

    return [
        item.strip()
        for item in text.split(",")
        if item.strip()
        and item.strip().lower() != "nan"
    ]


def column_name_map(df):
    """
    Create a normalized column-name mapping.

    Example:
    'Scheme Name' -> 'scheme name'
    """

    return {
        normalize_text(column): column
        for column in df.columns
    }


# =========================================================
# BUSINESS DATA
# =========================================================

def load_business_data():
    """
    Load business information from the Member 1 Excel file.

    Business Data sheet currently has the actual headers
    on row 2, therefore header=1 is used.
    """

    try:

        if not EXCEL_FILE.exists():

            print(
                "ERROR: Excel file not found:",
                EXCEL_FILE,
            )

            return []

        print(
            "Reading Business Data:",
            EXCEL_FILE,
        )

        df = pd.read_excel(
            EXCEL_FILE,
            sheet_name="Business Data",
            header=1,
        )

        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        print(
            "Business columns:",
            df.columns.tolist(),
        )

        print(
            "Business rows loaded:",
            len(df),
        )

        businesses = []

        for _, row in df.iterrows():

            business_name = clean_text(
                row.get("Business Name", "")
            )

            if not business_name:
                continue

            required_skills = split_items(
                row.get("Required Skills", "")
            )

            required_resources = split_items(
                row.get("Required Resources", "")
            )

            investment = safe_float(
                row.get("Investment", 0)
            )

            businesses.append(
                {
                    "name": business_name,

                    "skills": required_skills,

                    "resources": required_resources,

                    "investment": investment,

                    "demand": clean_text(
                        row.get("Demand", "")
                    ),

                    "competition": clean_text(
                        row.get("Competition", "")
                    ),

                    "risk": clean_text(
                        row.get("Risk", "")
                    ),

                    "why_suitable": clean_text(
                        row.get("Why Suitable", "")
                    ),
                }
            )

        print(
            "Business records successfully loaded:",
            len(businesses),
        )

        return businesses

    except Exception as error:

        print(
            "ERROR READING BUSINESS DATA:",
            repr(error),
        )

        return []


# =========================================================
# LOCAL MARKET FACTORS
# =========================================================

def load_market_factors():
    """
    Load the Local Market Factors framework.

    Current workbook format:

    Factor
    What We Check
    Example
    Why Important
    Data Source

    These are framework factors, not actual
    location-specific values.

    No local values are invented.
    """

    try:

        print(
            "Reading Local Market Factors sheet..."
        )

        df = pd.read_excel(
            EXCEL_FILE,
            sheet_name="Local Market Factors",
            header=0,
        )

        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        print(
            "Market factor columns:",
            df.columns.tolist(),
        )

        print(
            "Market factor rows loaded:",
            len(df),
        )

        factors = []

        columns = column_name_map(df)

        factor_column = columns.get("factor")

        check_column = columns.get(
            "what we check"
        )

        example_column = columns.get(
            "example"
        )

        why_column = columns.get(
            "why important"
        )

        source_column = columns.get(
            "data source"
        )

        if factor_column:

            for _, row in df.iterrows():

                factor = clean_text(
                    row.get(
                        factor_column,
                        "",
                    )
                )

                if not factor:
                    continue

                factors.append(
                    {
                        "factor": factor,

                        "what_we_check": clean_text(
                            row.get(
                                check_column,
                                "",
                            )
                            if check_column
                            else ""
                        ),

                        "example": clean_text(
                            row.get(
                                example_column,
                                "",
                            )
                            if example_column
                            else ""
                        ),

                        "why_important": clean_text(
                            row.get(
                                why_column,
                                "",
                            )
                            if why_column
                            else ""
                        ),

                        "data_source": clean_text(
                            row.get(
                                source_column,
                                "",
                            )
                            if source_column
                            else ""
                        ),

                        "status": (
                            "Data Not Available"
                        ),

                        "value": None,
                    }
                )

        else:

            raw_columns = list(df.columns)

            if len(raw_columns) >= 5:

                first_factor = clean_text(
                    raw_columns[0]
                )

                if first_factor:

                    factors.append(
                        {
                            "factor": first_factor,

                            "what_we_check":
                                clean_text(
                                    raw_columns[1]
                                ),

                            "example":
                                clean_text(
                                    raw_columns[2]
                                ),

                            "why_important":
                                clean_text(
                                    raw_columns[3]
                                ),

                            "data_source":
                                clean_text(
                                    raw_columns[4]
                                ),

                            "status":
                                "Data Not Available",

                            "value":
                                None,
                        }
                    )

                for _, row in df.iterrows():

                    values = list(row)

                    if len(values) < 5:
                        continue

                    row_factor = clean_text(
                        values[0]
                    )

                    if not row_factor:
                        continue

                    factors.append(
                        {
                            "factor": row_factor,

                            "what_we_check":
                                clean_text(
                                    values[1]
                                ),

                            "example":
                                clean_text(
                                    values[2]
                                ),

                            "why_important":
                                clean_text(
                                    values[3]
                                ),

                            "data_source":
                                clean_text(
                                    values[4]
                                ),

                            "status":
                                "Data Not Available",

                            "value":
                                None,
                        }
                    )

        # -------------------------------------------------
        # REMOVE DUPLICATES
        # -------------------------------------------------

        unique_factors = []

        seen = set()

        for factor in factors:

            key = normalize_text(
                factor["factor"]
            )

            if not key:
                continue

            if key in seen:
                continue

            seen.add(key)

            unique_factors.append(
                factor
            )

        print(
            "Market factors successfully loaded:",
            len(unique_factors),
        )

        return unique_factors

    except Exception as error:

        print(
            "ERROR READING MARKET FACTORS:",
            repr(error),
        )

        return []


# =========================================================
# GOVERNMENT SCHEMES
# =========================================================

def load_government_schemes():
    """
    Load government scheme information from Excel.

    Government Schemes sheet has headers on the FIRST row,
    therefore header=0 is used.
    """

    try:

        print(
            "Reading Government Schemes sheet..."
        )

        df = pd.read_excel(
            EXCEL_FILE,
            sheet_name="Government Schemes",
            header=0,
        )

        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        print(
            "Scheme columns:",
            df.columns.tolist(),
        )

        print(
            "Scheme rows loaded:",
            len(df),
        )

        schemes = []

        columns = column_name_map(df)

        scheme_name_column = (
            columns.get("scheme name")
            or columns.get("scheme")
        )

        purpose_column = columns.get(
            "purpose"
        )

        suitable_for_column = columns.get(
            "suitable for"
        )

        eligibility_column = columns.get(
            "eligibility"
        )

        documents_column = columns.get(
            "documents"
        )

        source_column = (
            columns.get("official source")
            or columns.get("source")
        )

        if not scheme_name_column:

            print(
                "WARNING: Scheme Name column "
                "was not found."
            )

            return []

        for _, row in df.iterrows():

            scheme_name = clean_text(
                row.get(
                    scheme_name_column,
                    "",
                )
            )

            if not scheme_name:
                continue

            purpose = clean_text(
                row.get(
                    purpose_column,
                    "",
                )
                if purpose_column
                else ""
            )

            suitable_for = clean_text(
                row.get(
                    suitable_for_column,
                    "",
                )
                if suitable_for_column
                else ""
            )

            eligibility = clean_text(
                row.get(
                    eligibility_column,
                    "",
                )
                if eligibility_column
                else ""
            )

            documents = clean_text(
                row.get(
                    documents_column,
                    "",
                )
                if documents_column
                else ""
            )

            source = clean_text(
                row.get(
                    source_column,
                    "",
                )
                if source_column
                else ""
            )

            schemes.append(
                {
                    "scheme_name":
                        scheme_name,

                    "purpose":
                        purpose,

                    "suitable_for":
                        suitable_for,

                    "eligibility":
                        eligibility,

                    "documents":
                        documents,

                    "official_source":
                        source,

                    "warning": (
                        "Eligibility and financing "
                        "decisions are subject to "
                        "the current official scheme "
                        "rules and the relevant "
                        "authority or lending institution."
                    ),
                }
            )

        print(
            "Government schemes successfully loaded:",
            len(schemes),
        )

        return schemes

    except Exception as error:

        print(
            "Government Schemes sheet could not "
            "be loaded:",
            repr(error),
        )

        return []


# =========================================================
# LOAD ALL EXCEL DATA
# =========================================================

def load_all_data():

    print()
    print("========================================")
    print("GRAMBIZ AI - LOADING EXCEL DATA")
    print("========================================")

    businesses = load_business_data()

    market_factors = load_market_factors()

    schemes = load_government_schemes()

    print("========================================")
    print("EXCEL DATA LOADING COMPLETE")

    print(
        "Businesses:",
        len(businesses),
    )

    print(
        "Market Factors:",
        len(market_factors),
    )

    print(
        "Government Schemes:",
        len(schemes),
    )

    print("========================================")
    print()

    return (
        businesses,
        market_factors,
        schemes,
    )


BUSINESSES, MARKET_FACTORS, SCHEMES = (
    load_all_data()
)


# =========================================================
# REQUEST MODELS
# =========================================================

class BusinessRequest(BaseModel):

    location: str = Field(
        ...,
        min_length=2,
    )

    budget: float = Field(
        ...,
        gt=0,
    )

    business: str = Field(
        ...,
        min_length=1,
    )

    skills: list[str] = Field(
        default_factory=list,
    )

    resources: list[str] = Field(
        default_factory=list,
    )


class FinancialRequest(BaseModel):

    equipment: float = Field(
        default=0,
        ge=0,
    )

    setup: float = Field(
        default=0,
        ge=0,
    )

    working_capital: float = Field(
        default=0,
        ge=0,
    )

    other_expenses: float = Field(
        default=0,
        ge=0,
    )

    own_contribution: float = Field(
        default=0,
        ge=0,
    )

    monthly_expenses: float = Field(
        default=0,
        ge=0,
    )

    estimated_monthly_revenue: float = Field(
        default=0,
        ge=0,
    )


# =========================================================
# SCORING FUNCTIONS
# =========================================================

def calculate_skill_score(
    user_skills,
    required_skills,
):

    if not required_skills:
        return 0

    user_skills = {
        normalize_text(skill)
        for skill in user_skills
    }

    required_skills = {
        normalize_text(skill)
        for skill in required_skills
    }

    matched = (
        user_skills.intersection(
            required_skills
        )
    )

    return round(
        (
            len(matched)
            / len(required_skills)
        )
        * 100
    )


def calculate_resource_score(
    user_resources,
    required_resources,
):

    if not required_resources:
        return 0

    user_resources = {
        normalize_text(resource)
        for resource in user_resources
    }

    required_resources = {
        normalize_text(resource)
        for resource in required_resources
    }

    matched = (
        user_resources.intersection(
            required_resources
        )
    )

    return round(
        (
            len(matched)
            / len(required_resources)
        )
        * 100
    )


def calculate_budget_score(
    user_budget,
    investment,
):

    if investment <= 0:
        return 0

    if user_budget >= investment:
        return 100

    percentage = (
        user_budget
        / investment
    ) * 100

    return round(
        min(percentage, 100)
    )


def calculate_interest_score(
    user_interest,
    business_name,
):

    user_interest = normalize_text(
        user_interest
    )

    business_name = normalize_text(
        business_name
    )

    if not user_interest:
        return 0

    if user_interest == business_name:
        return 100

    if user_interest in business_name:
        return 90

    if business_name in user_interest:
        return 90

    interest_words = set(
        user_interest.split()
    )

    business_words = set(
        business_name.split()
    )

    if interest_words.intersection(
        business_words
    ):
        return 70

    return 0


def calculate_market_score(
    demand,
    competition,
    risk,
):

    score = 50

    demand = normalize_text(
        demand
    )

    competition = normalize_text(
        competition
    )

    risk = normalize_text(
        risk
    )

    # Demand

    if demand == "high":
        score += 25

    elif demand == "medium":
        score += 15

    # Competition

    if competition == "low":
        score += 15

    elif competition == "medium":
        score += 10

    # Risk

    if risk == "low":
        score += 10

    elif risk == "medium":
        score += 5

    return min(score, 100)
# =========================================================
# RECOMMENDATION REASONS
# =========================================================

def build_recommendation_reasons(
    business,
    skill_score,
    resource_score,
    budget_score,
    interest_score,
):
    reasons = []

    if skill_score >= 50:
        reasons.append(
            "Your skills match this business."
        )

    if resource_score >= 50:
        reasons.append(
            "Your available resources support "
            "this business."
        )

    if budget_score >= 80:
        reasons.append(
            "Your budget is suitable for the "
            "estimated investment."
        )

    elif budget_score >= 50:
        reasons.append(
            "Your budget partially matches the "
            "estimated investment."
        )

    else:
        reasons.append(
            "Your current budget is below the "
            "estimated investment."
        )

    if interest_score >= 70:
        reasons.append(
            "This matches your business interest."
        )

    if normalize_text(
        business["demand"]
    ) == "high":

        reasons.append(
            "The business has high expected "
            "demand in the current dataset."
        )

    if normalize_text(
        business["competition"]
    ) == "low":

        reasons.append(
            "The dataset indicates relatively "
            "low competition."
        )

    if not reasons:
        reasons.append(
            "This business is included based on "
            "the available profile and market factors."
        )

    return reasons


# =========================================================
# AI-STYLE RECOMMENDATION HELPERS
# =========================================================

def get_confidence_level(score):
    """
    Convert recommendation score into
    an easy-to-understand confidence level.
    """

    if score >= 80:
        return "High"

    elif score >= 60:
        return "Medium"

    return "Low"


def get_recommendation_tier(score):
    """
    Classify the strength of a recommendation.
    """

    if score >= 80:
        return "Strong Match"

    elif score >= 60:
        return "Good Match"

    elif score >= 40:
        return "Possible Match"

    return "Needs More Preparation"


def build_action_suggestions(
    business,
    skill_score,
    resource_score,
    budget_score,
):
    """
    Generate simple next-step suggestions
    from the recommendation profile.
    """

    suggestions = []

    if skill_score < 50:
        suggestions.append(
            f"Consider basic training or skill development "
            f"for {business['name']}."
        )

    if resource_score < 50:
        suggestions.append(
            "Identify or arrange the required resources "
            "before starting."
        )

    if budget_score < 80:
        suggestions.append(
            "Review the funding gap and prepare a "
            "realistic financial plan."
        )

    if not suggestions:
        suggestions.append(
            "Validate local customer demand and operating "
            "costs before investing."
        )

    return suggestions


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {

        "message":
            "GramBiz AI Backend is running successfully!",

        "version":
            "1.0.0",

        "business_data_source":
            "GramBiz_Member1_Data.xlsx",

        "business_count":
            len(BUSINESSES),

        "market_factor_count":
            len(MARKET_FACTORS),

        "scheme_count":
            len(SCHEMES),

        "status":
            "healthy",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health_check():

    return {

        "status":
            "healthy",

        "excel_file_exists":
            EXCEL_FILE.exists(),

        "business_data_loaded":
            bool(BUSINESSES),

        "business_count":
            len(BUSINESSES),

        "market_factors_loaded":
            bool(MARKET_FACTORS),

        "market_factor_count":
            len(MARKET_FACTORS),

        "schemes_loaded":
            bool(SCHEMES),

        "scheme_count":
            len(SCHEMES),
    }


# =========================================================
# BUSINESS ANALYSIS
# =========================================================

@app.post("/api/analyze")
def analyze_business(
    request: BusinessRequest,
):

    print()
    print("=================================")
    print(
        "GRAMBIZ AI - BUSINESS ANALYSIS"
    )
    print("=================================")

    print(
        "Location :",
        request.location,
    )

    print(
        "Budget   :",
        request.budget,
    )

    print(
        "Business :",
        request.business,
    )

    print(
        "Skills   :",
        request.skills,
    )

    print(
        "Resources:",
        request.resources,
    )


    # -----------------------------------------------------
    # CHECK BUSINESS DATA
    # -----------------------------------------------------

    if not BUSINESSES:

        return {

            "recommendation":
                "No recommendation available",

            "match_score":
                0,

            "estimated_investment":
                0,

            "demand":
                "Unknown",

            "competition":
                "Unknown",

            "risk":
                "Unknown",

            "location":
                request.location,

            "message":
                "Business data could not be "
                "loaded from Excel.",

            "recommendations":
                [],
        }


    # -----------------------------------------------------
    # SCORE ALL BUSINESSES
    # -----------------------------------------------------

    scored_businesses = []


    for business in BUSINESSES:

        skill_score = (
            calculate_skill_score(
                request.skills,
                business["skills"],
            )
        )


        resource_score = (
            calculate_resource_score(
                request.resources,
                business["resources"],
            )
        )


        budget_score = (
            calculate_budget_score(
                request.budget,
                business["investment"],
            )
        )


        interest_score = (
            calculate_interest_score(
                request.business,
                business["name"],
            )
        )


        market_score = (
            calculate_market_score(
                business["demand"],
                business["competition"],
                business["risk"],
            )
        )


        # -------------------------------------------------
        # WEIGHTED SCORE
        # -------------------------------------------------

        final_score = (

            skill_score * 0.30

            + resource_score * 0.25

            + budget_score * 0.25

            + market_score * 0.10

            + interest_score * 0.10

        )


        final_score = round(
            final_score
        )


        # -------------------------------------------------
        # RECOMMENDATION REASONS
        # -------------------------------------------------

        reasons = (
            build_recommendation_reasons(
                business,
                skill_score,
                resource_score,
                budget_score,
                interest_score,
            )
        )


        # -------------------------------------------------
        # AI-STYLE CONFIDENCE
        # -------------------------------------------------

        confidence = (
            get_confidence_level(
                final_score
            )
        )


        # -------------------------------------------------
        # RECOMMENDATION TIER
        # -------------------------------------------------

        recommendation_tier = (
            get_recommendation_tier(
                final_score
            )
        )


        # -------------------------------------------------
        # ACTION SUGGESTIONS
        # -------------------------------------------------

        action_suggestions = (
            build_action_suggestions(
                business,
                skill_score,
                resource_score,
                budget_score,
            )
        )


        # -------------------------------------------------
        # SCORE BREAKDOWN
        # -------------------------------------------------

        score_breakdown = {

            "skill_score":
                skill_score,

            "resource_score":
                resource_score,

            "budget_score":
                budget_score,

            "market_score":
                market_score,

            "interest_score":
                interest_score,

            "final_score":
                final_score,
        }


        # -------------------------------------------------
        # BUSINESS RESULT
        # -------------------------------------------------

        scored_businesses.append({

            "business":
                business["name"],

            "match_score":
                final_score,

            "confidence":
                confidence,

            "recommendation_tier":
                recommendation_tier,

            "estimated_investment":
                business["investment"],

            "required_skills":
                business["skills"],

            "required_resources":
                business["resources"],

            "demand":
                business["demand"],

            "competition":
                business["competition"],

            "risk":
                business["risk"],

            "why_suitable":
                business["why_suitable"],

            "reasons":
                reasons,

            "personalized_reasons":
                reasons,

            "action_suggestions":
                action_suggestions,

            "score_breakdown":
                score_breakdown,
        })


    # -----------------------------------------------------
    # SORT BY MATCH SCORE
    # -----------------------------------------------------

    scored_businesses.sort(
        key=lambda item:
            item["match_score"],
        reverse=True,
    )


    # -----------------------------------------------------
    # TOP 5 RECOMMENDATIONS
    # -----------------------------------------------------

    top_recommendations = (
        scored_businesses[:5]
    )


    # -----------------------------------------------------
    # CHECK TOP RECOMMENDATION
    # -----------------------------------------------------

    if not top_recommendations:

        return {

            "recommendation":
                "No suitable business found",

            "match_score":
                0,

            "estimated_investment":
                0,

            "recommendations":
                [],
        }


    # -----------------------------------------------------
    # TOP BUSINESS
    # -----------------------------------------------------

    top_business = (
        top_recommendations[0]
    )


    # -----------------------------------------------------
    # AI SUMMARY
    # -----------------------------------------------------

    ai_summary = (

        f"{top_business['business']} "
        f"is the top-ranked option with a "
        f"{top_business['match_score']}% match "
        f"and {top_business['confidence']} confidence. "

        f"The ranking considers skills, resources, "
        f"budget, business interest, and dataset "
        f"market factors."

    )


    # -----------------------------------------------------
    # FINAL RESPONSE
    # -----------------------------------------------------

    result = {

        "recommendation":
            top_business["business"],

        "match_score":
            top_business["match_score"],

        "confidence":
            top_business["confidence"],

        "recommendation_tier":
            top_business[
                "recommendation_tier"
            ],

        "estimated_investment":
            top_business[
                "estimated_investment"
            ],

        "required_skills":
            top_business[
                "required_skills"
            ],

        "required_resources":
            top_business[
                "required_resources"
            ],

        "demand":
            top_business[
                "demand"
            ],

        "competition":
            top_business[
                "competition"
            ],

        "risk":
            top_business[
                "risk"
            ],

        "why_suitable":
            top_business[
                "why_suitable"
            ],

        "reasons":
            top_business[
                "reasons"
            ],

        "personalized_reasons":
            top_business[
                "personalized_reasons"
            ],

        "action_suggestions":
            top_business[
                "action_suggestions"
            ],

        "score_breakdown":
            top_business[
                "score_breakdown"
            ],

        "location":
            request.location,

        "budget":
            request.budget,

        "business_interest":
            request.business,

        "user_skills":
            request.skills,

        "user_resources":
            request.resources,

        "recommendations":
            top_recommendations,

        "scoring_weights": {

            "skills":
                0.30,

            "resources":
                0.25,

            "budget":
                0.25,

            "market":
                0.10,

            "interest":
                0.10,
        },

        "ai_summary":
            ai_summary,

        "ai_method":
            "Explainable weighted recommendation "
            "engine using structured business data; "
            "no profit or loan approval is guaranteed.",

        "data_source":
            "GramBiz_Member1_Data.xlsx - Business Data",

        "disclaimer":
            "Recommendations are decision-support estimates "
            "based on the available dataset and user inputs. "
            "They do not guarantee business success, profit, "
            "loan approval, or financial returns.",
    }


    print()
    print(
        "Top recommendation:",
        top_business["business"],
    )

    print(
        "Match score:",
        top_business["match_score"],
    )

    print(
        "Confidence:",
        top_business["confidence"],
    )

    print(
        "Recommendation tier:",
        top_business[
            "recommendation_tier"
        ],
    )

    print("=================================")
    print()


    return result
# =========================================================
# MARKET FACTORS
# =========================================================

@app.get("/api/market-factors")
def get_market_factors():

    if not MARKET_FACTORS:
        return {
            "status": "no_data",
            "count": 0,
            "market_factors": [],
            "message": (
                "Local market factor data is not available."
            ),
            "disclaimer": (
                "No locality-specific values are being invented."
            ),
        }

    return {
        "status": "success",

        "count":
            len(MARKET_FACTORS),

        "market_factors":
            MARKET_FACTORS,

        "data_coverage": {
            "location_specific_values":
                False,

            "framework_available":
                True,

            "actual_local_values":
                False,
        },

        "message": (
            "Market factors are available as a "
            "hyper-local analysis framework. "
            "Actual locality-specific values require "
            "validated local data."
        ),

        "disclaimer": (
            "The listed factors describe what should "
            "be checked for a locality. They are not "
            "actual measured values for the user's village."
        ),
    }


# =========================================================
# FINANCIAL PLAN
# =========================================================

@app.post("/api/financial-plan")
def create_financial_plan(
    request: FinancialRequest,
):

    print()
    print("=================================")
    print(
        "GRAMBIZ AI - FINANCIAL PLAN"
    )
    print("=================================")

    print(
        "Equipment:",
        request.equipment,
    )

    print(
        "Setup:",
        request.setup,
    )

    print(
        "Working Capital:",
        request.working_capital,
    )

    print(
        "Other Expenses:",
        request.other_expenses,
    )

    print(
        "Own Contribution:",
        request.own_contribution,
    )


    # -----------------------------------------------------
    # TOTAL PROJECT COST
    # -----------------------------------------------------

    total_project_cost = (

        request.equipment

        + request.setup

        + request.working_capital

        + request.other_expenses

    )


    total_project_cost = round(
        total_project_cost,
        2,
    )


    # -----------------------------------------------------
    # FUNDING GAP
    # -----------------------------------------------------

    funding_gap = max(
        total_project_cost
        - request.own_contribution,
        0,
    )


    funding_gap = round(
        funding_gap,
        2,
    )


    # -----------------------------------------------------
    # OWN CONTRIBUTION PERCENTAGE
    # -----------------------------------------------------

    if total_project_cost > 0:

        own_contribution_percentage = (

            request.own_contribution
            / total_project_cost

        ) * 100

    else:

        own_contribution_percentage = 0


    own_contribution_percentage = round(
        min(
            own_contribution_percentage,
            100,
        ),
        2,
    )


    # -----------------------------------------------------
    # MONTHLY SURPLUS
    # -----------------------------------------------------

    monthly_surplus = None


    if (
        request.estimated_monthly_revenue > 0
        or request.monthly_expenses > 0
    ):

        monthly_surplus = (

            request.estimated_monthly_revenue
            - request.monthly_expenses

        )

        monthly_surplus = round(
            monthly_surplus,
            2,
        )


    # -----------------------------------------------------
    # BREAK-EVEN MONTHS
    # -----------------------------------------------------

    break_even_months = None


    if (
        monthly_surplus is not None
        and monthly_surplus > 0
        and total_project_cost > 0
    ):

        break_even_months = (

            total_project_cost
            / monthly_surplus

        )

        break_even_months = round(
            break_even_months,
            2,
        )


    # -----------------------------------------------------
    # FUNDING STATUS
    # -----------------------------------------------------

    if total_project_cost <= 0:

        funding_status = (
            "Project cost not provided"
        )

    elif funding_gap <= 0:

        funding_status = (
            "Fully covered"
        )

    else:

        funding_status = (
            "Additional funding required"
        )


    # -----------------------------------------------------
    # COST BREAKDOWN
    # -----------------------------------------------------

    cost_breakdown = {

        "equipment":
            round(
                request.equipment,
                2,
            ),

        "setup":
            round(
                request.setup,
                2,
            ),

        "working_capital":
            round(
                request.working_capital,
                2,
            ),

        "other_expenses":
            round(
                request.other_expenses,
                2,
            ),

        "total_project_cost":
            total_project_cost,
    }


    # -----------------------------------------------------
    # MESSAGE
    # -----------------------------------------------------

    if funding_gap <= 0:

        message = (
            "Your current own contribution "
            "covers the estimated project cost."
        )

    else:

        message = (
            "Your estimated project cost is higher "
            "than your current own contribution. "
            "Review the funding gap and explore "
            "appropriate financing options."
        )


    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    result = {

        "status":
            "success",

        "total_project_cost":
            total_project_cost,

        "own_contribution":
            round(
                request.own_contribution,
                2,
            ),

        "own_contribution_percentage":
            own_contribution_percentage,

        "funding_gap":
            funding_gap,

        "funding_status":
            funding_status,

        "monthly_expenses":
            round(
                request.monthly_expenses,
                2,
            ),

        "estimated_monthly_revenue":
            round(
                request.estimated_monthly_revenue,
                2,
            ),

        "monthly_surplus":
            monthly_surplus,

        "break_even_months":
            break_even_months,

        "cost_breakdown":
            cost_breakdown,

        "message":
            message,

        "disclaimer": (
            "Financial figures are planning estimates "
            "based on user-provided inputs. They do not "
            "guarantee revenue, profit, break-even time, "
            "loan approval, or financial returns."
        ),
    }


    print(
        "Total project cost:",
        total_project_cost,
    )

    print(
        "Funding gap:",
        funding_gap,
    )

    print(
        "Funding status:",
        funding_status,
    )

    print("=================================")
    print()


    return result


# =========================================================
# GOVERNMENT SCHEMES
# =========================================================

@app.get("/api/schemes")
def get_government_schemes():

    if not SCHEMES:

        return {

            "status":
                "no_data",

            "count":
                0,

            "schemes":
                [],

            "message":
                "Government scheme data is not available.",

            "disclaimer": (
                "Always verify current eligibility, "
                "conditions, and application details "
                "from the official government source."
            ),
        }


    return {

        "status":
            "success",

        "count":
            len(SCHEMES),

        "schemes":
            SCHEMES,

        "disclaimer": (
            "Scheme information is provided for "
            "decision support. Eligibility, financing "
            "amounts, approval, and other conditions "
            "depend on the current official rules and "
            "the relevant authority or lending institution."
        ),
    }


# =========================================================
# DATA STATUS
# =========================================================

@app.get("/api/data-status")
def data_status():

    return {

        "status":
            "success",

        "excel_file":
            EXCEL_FILE.name,

        "excel_file_exists":
            EXCEL_FILE.exists(),

        "business_data": {

            "loaded":
                bool(BUSINESSES),

            "count":
                len(BUSINESSES),
        },

        "market_factors": {

            "loaded":
                bool(MARKET_FACTORS),

            "count":
                len(MARKET_FACTORS),
        },

        "government_schemes": {

            "loaded":
                bool(SCHEMES),

            "count":
                len(SCHEMES),
        },

        "data_sources": {

            "business":
                "GramBiz_Member1_Data.xlsx - Business Data",

            "market":
                "GramBiz_Member1_Data.xlsx - Local Market Factors",

            "schemes":
                "GramBiz_Member1_Data.xlsx - Government Schemes",
        },
    }


# =========================================================
# RELOAD EXCEL DATA
# =========================================================

@app.post("/api/reload-data")
def reload_data():

    global BUSINESSES
    global MARKET_FACTORS
    global SCHEMES


    try:

        (
            BUSINESSES,
            MARKET_FACTORS,
            SCHEMES,
        ) = load_all_data()


        return {

            "status":
                "success",

            "message":
                "Excel data reloaded successfully.",

            "business_count":
                len(BUSINESSES),

            "market_factor_count":
                len(MARKET_FACTORS),

            "scheme_count":
                len(SCHEMES),

            "excel_file":
                EXCEL_FILE.name,
        }


    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=(
                "Failed to reload Excel data: "
                f"{str(error)}"
            ),
        )


# =========================================================
# STARTUP MESSAGE
# =========================================================

print()
print("========================================")
print("GRAMBIZ AI BACKEND READY")
print("========================================")
print(
    "Excel file:",
    EXCEL_FILE,
)
print(
    "Businesses:",
    len(BUSINESSES),
)
print(
    "Market Factors:",
    len(MARKET_FACTORS),
)
print(
    "Government Schemes:",
    len(SCHEMES),
)
print("========================================")