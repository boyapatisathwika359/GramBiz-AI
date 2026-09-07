from pathlib import Path
from typing import Optional

import math
import pandas as pd

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# =========================================================
# GRAMBIZ AI - FASTAPI BACKEND
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
# FILE CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

EXCEL_FILE = BASE_DIR / "GramBiz_Member1_Data.xlsx"


# =========================================================
# GLOBAL DATA
# =========================================================

BUSINESSES = []
MARKET_FACTORS = []
SCHEMES = []


# =========================================================
# BASIC HELPERS
# =========================================================

def clean_text(value):
    if value is None:
        return ""

    try:
        if pd.isna(value):
            return ""
    except Exception:
        pass

    text = str(value).strip()

    if text.lower() == "nan":
        return ""

    return text


def normalize_text(value):
    return clean_text(value).lower()


def safe_float(value, default=0.0):
    try:
        if value is None:
            return default

        if pd.isna(value):
            return default

        if isinstance(value, (int, float)):
            return float(value)

        text = (
            str(value)
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
    text = clean_text(value)

    if not text:
        return []

    return [
        item.strip()
        for item in text.split(",")
        if item.strip()
    ]


def column_map(df):
    return {
        normalize_text(column): column
        for column in df.columns
    }


# =========================================================
# BUSINESS DATA
# =========================================================

def load_business_data():
    if not EXCEL_FILE.exists():
        print("WARNING: Excel file not found:", EXCEL_FILE)
        return []

    try:
        df = pd.read_excel(
            EXCEL_FILE,
            sheet_name="Business Data",
            header=1,
        )

        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        businesses = []

        for _, row in df.iterrows():

            name = clean_text(
                row.get("Business Name", "")
            )

            if not name:
                continue

            businesses.append(
                {
                    "name": name,

                    "skills": split_items(
                        row.get("Required Skills", "")
                    ),

                    "resources": split_items(
                        row.get("Required Resources", "")
                    ),

                    "investment": safe_float(
                        row.get("Investment", 0)
                    ),

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
            "Business records loaded:",
            len(businesses),
        )

        return businesses

    except Exception as error:
        print(
            "ERROR loading business data:",
            repr(error),
        )
        return []


# =========================================================
# MARKET FACTORS
# =========================================================

def load_market_factors():

    if not EXCEL_FILE.exists():
        return []

    try:
        df = pd.read_excel(
            EXCEL_FILE,
            sheet_name="Local Market Factors",
            header=0,
        )

        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        columns = column_map(df)

        factor_col = columns.get("factor")
        check_col = columns.get("what we check")
        example_col = columns.get("example")
        why_col = columns.get("why important")
        source_col = columns.get("data source")

        factors = []

        if factor_col:

            for _, row in df.iterrows():

                factor = clean_text(
                    row.get(factor_col, "")
                )

                if not factor:
                    continue

                factors.append(
                    {
                        "factor": factor,

                        "what_we_check": clean_text(
                            row.get(check_col, "")
                            if check_col
                            else ""
                        ),

                        "example": clean_text(
                            row.get(example_col, "")
                            if example_col
                            else ""
                        ),

                        "why_important": clean_text(
                            row.get(why_col, "")
                            if why_col
                            else ""
                        ),

                        "data_source": clean_text(
                            row.get(source_col, "")
                            if source_col
                            else ""
                        ),

                        "status": "Data Not Available",
                        "value": None,
                    }
                )

        return factors

    except Exception as error:
        print(
            "ERROR loading market factors:",
            repr(error),
        )
        return []


# =========================================================
# GOVERNMENT SCHEMES
# =========================================================

def load_government_schemes():

    if not EXCEL_FILE.exists():
        return []

    try:
        df = pd.read_excel(
            EXCEL_FILE,
            sheet_name="Government Schemes",
            header=0,
        )

        df = df.dropna(how="all")
        df = df.dropna(axis=1, how="all")

        columns = column_map(df)

        name_col = (
            columns.get("scheme name")
            or columns.get("scheme")
            or columns.get("name")
        )

        purpose_col = columns.get("purpose")
        suitable_col = columns.get("suitable for")
        eligibility_col = columns.get("eligibility")
        documents_col = columns.get("documents")

        source_col = (
            columns.get("official source")
            or columns.get("source")
        )

        if not name_col:
            print(
                "WARNING: Scheme Name column not found."
            )
            return []

        schemes = []

        for _, row in df.iterrows():

            name = clean_text(
                row.get(name_col, "")
            )

            if not name:
                continue

            schemes.append(
                {
                    "scheme_name": name,

                    "name": name,

                    "purpose": clean_text(
                        row.get(purpose_col, "")
                        if purpose_col
                        else ""
                    ),

                    "suitable_for": clean_text(
                        row.get(suitable_col, "")
                        if suitable_col
                        else ""
                    ),

                    "eligibility": clean_text(
                        row.get(eligibility_col, "")
                        if eligibility_col
                        else ""
                    ),

                    "documents": clean_text(
                        row.get(documents_col, "")
                        if documents_col
                        else ""
                    ),

                    "official_source": clean_text(
                        row.get(source_col, "")
                        if source_col
                        else ""
                    ),

                    "source": clean_text(
                        row.get(source_col, "")
                        if source_col
                        else ""
                    ),

                    "warning": (
                        "Eligibility and financing decisions "
                        "are subject to current official rules "
                        "and the relevant authority or lender."
                    ),
                }
            )

        print(
            "Government schemes loaded:",
            len(schemes),
        )

        return schemes

    except Exception as error:
        print(
            "ERROR loading government schemes:",
            repr(error),
        )
        return []


# =========================================================
# LOAD ALL DATA
# =========================================================

def load_all_data():

    global BUSINESSES
    global MARKET_FACTORS
    global SCHEMES

    print()
    print("=" * 50)
    print("GRAMBIZ AI - LOADING DATA")
    print("=" * 50)

    BUSINESSES = load_business_data()
    MARKET_FACTORS = load_market_factors()
    SCHEMES = load_government_schemes()

    print("Businesses:", len(BUSINESSES))
    print("Market Factors:", len(MARKET_FACTORS))
    print("Government Schemes:", len(SCHEMES))

    print("=" * 50)
    print()

    return True


load_all_data()


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

    business_name: Optional[str] = Field(
        default=None,
    )

    business_investment: float = Field(
        default=0,
        ge=0,
    )

    contingency_percentage: float = Field(
        default=5,
        ge=0,
        le=25,
    )

    annual_interest_rate: float = Field(
        default=12,
        ge=0,
        le=100,
    )

    loan_tenure_months: int = Field(
        default=24,
        ge=1,
        le=120,
    )


# =========================================================
# SCORING FUNCTIONS
# =========================================================

def calculate_skill_score(
    user_skills,
    required_skills,
):

    if not required_skills:
        return 50

    user = {
        normalize_text(x)
        for x in user_skills
        if normalize_text(x)
    }

    required = {
        normalize_text(x)
        for x in required_skills
        if normalize_text(x)
    }

    if not required:
        return 50

    matched = user.intersection(required)

    return round(
        len(matched) / len(required) * 100
    )


def calculate_resource_score(
    user_resources,
    required_resources,
):

    if not required_resources:
        return 50

    user = {
        normalize_text(x)
        for x in user_resources
        if normalize_text(x)
    }

    required = {
        normalize_text(x)
        for x in required_resources
        if normalize_text(x)
    }

    if not required:
        return 50

    matched = user.intersection(required)

    return round(
        len(matched) / len(required) * 100
    )


def calculate_budget_score(
    user_budget,
    investment,
):

    if investment <= 0:
        return 50

    if user_budget >= investment:
        return 100

    percentage = (
        user_budget / investment
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
        return 50

    if user_interest == business_name:
        return 100

    if (
        user_interest in business_name
        or business_name in user_interest
    ):
        return 90

    user_words = set(
        user_interest.split()
    )

    business_words = set(
        business_name.split()
    )

    if user_words.intersection(
        business_words
    ):
        return 70

    return 30


def calculate_market_score(
    demand,
    competition,
    risk,
):

    score = 50

    demand = normalize_text(demand)
    competition = normalize_text(competition)
    risk = normalize_text(risk)

    if demand == "high":
        score += 25
    elif demand == "medium":
        score += 15
    elif demand == "low":
        score -= 10

    if competition == "low":
        score += 15
    elif competition == "medium":
        score += 5
    elif competition == "high":
        score -= 10

    if risk == "low":
        score += 10
    elif risk == "medium":
        score += 0
    elif risk == "high":
        score -= 15

    return max(
        0,
        min(score, 100),
    )


# =========================================================
# RECOMMENDATION ENGINE
# =========================================================

def get_recommendations(request):

    scored = []

    for business in BUSINESSES:

        skill_score = calculate_skill_score(
            request.skills,
            business["skills"],
        )

        resource_score = calculate_resource_score(
            request.resources,
            business["resources"],
        )

        budget_score = calculate_budget_score(
            request.budget,
            business["investment"],
        )

        interest_score = calculate_interest_score(
            request.business,
            business["name"],
        )

        market_score = calculate_market_score(
            business["demand"],
            business["competition"],
            business["risk"],
        )

        total_score = (
            skill_score * 0.30
            + resource_score * 0.25
            + budget_score * 0.25
            + market_score * 0.10
            + interest_score * 0.10
        )

        reasons = []

        if budget_score >= 80:
            reasons.append(
                "Your budget is suitable for the estimated investment."
            )
        elif budget_score >= 50:
            reasons.append(
                "Your budget is partially aligned with the estimated investment."
            )
        else:
            reasons.append(
                "Additional funding may be required."
            )

        if skill_score >= 70:
            reasons.append(
                "Your skills match the required skills well."
            )

        if resource_score >= 70:
            reasons.append(
                "Your available resources match the business requirements."
            )

        if market_score >= 75:
            reasons.append(
                "The available market indicators are favorable."
            )

        if interest_score >= 70:
            reasons.append(
                "The business matches your stated interest."
            )

        action_suggestions = []

        if budget_score < 70:
            action_suggestions.append(
                "Review funding options or reduce the initial setup size."
            )

        if skill_score < 70:
            action_suggestions.append(
                "Consider skill training before starting."
            )

        if resource_score < 70:
            action_suggestions.append(
                "Identify the resources that are still required."
            )

        if not action_suggestions:
            action_suggestions.append(
                "Validate local demand and prepare a detailed business plan."
            )

        if total_score >= 80:
            tier = "Highly Recommended"
        elif total_score >= 65:
            tier = "Recommended"
        elif total_score >= 50:
            tier = "Potential Option"
        else:
            tier = "Needs Further Review"

        confidence = round(
            min(
                95,
                max(
                    40,
                    total_score,
                ),
            )
        )

        scored.append(
            {
                "business_name": business["name"],

                "name": business["name"],

                "estimated_investment":
                    business["investment"],

                "demand":
                    business["demand"],

                "competition":
                    business["competition"],

                "risk":
                    business["risk"],

                "skills_required":
                    business["skills"],

                "resources_required":
                    business["resources"],

                "why_suitable":
                    business["why_suitable"],

                "match_score":
                    round(total_score, 2),

                "confidence":
                    confidence,

                "recommendation_tier":
                    tier,

                "reasons":
                    reasons,

                "action_suggestions":
                    action_suggestions,

                "score_breakdown":
                    {
                        "skills":
                            skill_score,

                        "resources":
                            resource_score,

                        "budget":
                            budget_score,

                        "market":
                            market_score,

                        "interest":
                            interest_score,
                    },
            }
        )

    scored.sort(
        key=lambda x: x["match_score"],
        reverse=True,
    )

    return scored[:5]


# =========================================================
# AI-STYLE SUMMARY
# =========================================================

def create_ai_summary(
    request,
    recommendations,
):

    if not recommendations:
        return (
            "No matching businesses were found. "
            "Please review the business category, budget, "
            "skills and available resources."
        )

    best = recommendations[0]

    return (
        f"Based on the provided location ({request.location}), "
        f"budget and user preferences, {best['business_name']} "
        f"has the highest current matching score of "
        f"{best['match_score']}%. "
        f"The recommendation considers skills, resources, "
        f"budget compatibility, market indicators and business interest. "
        f"Local validation is still recommended before investing."
    )


# =========================================================
# BUSINESS ANALYSIS
# =========================================================

@app.post("/api/analyze")
def analyze_business(
    request: BusinessRequest,
):

    recommendations = get_recommendations(
        request
    )

    return {
        "success": True,

        "location":
            request.location,

        "budget":
            request.budget,

        "business_interest":
            request.business,

        "recommendations":
            recommendations,

        "top_recommendation":
            recommendations[0]
            if recommendations
            else None,

        "ai_summary":
            create_ai_summary(
                request,
                recommendations,
            ),

        "location_note":
            (
                "Recommendations use the available "
                "business dataset and market framework. "
                "Local values should be validated with "
                "current village/block/district information."
            ),

        "disclaimer":
            (
                "These are decision-support estimates, "
                "not guaranteed profits, revenue or business success."
            ),
    }


# =========================================================
# BUSINESS LIST
# =========================================================

@app.get("/api/businesses")
def get_businesses():

    return {
        "success": True,
        "count": len(BUSINESSES),
        "businesses": BUSINESSES,
    }


@app.get("/api/businesses/search")
def search_businesses(
    q: str = Query(
        ...,
        min_length=1,
    )
):

    query = normalize_text(q)

    results = []

    for business in BUSINESSES:

        searchable = " ".join(
            [
                business["name"],
                " ".join(business["skills"]),
                " ".join(business["resources"]),
                business["demand"],
                business["competition"],
                business["risk"],
            ]
        )

        if query in normalize_text(
            searchable
        ):
            results.append(business)

    return {
        "success": True,
        "query": q,
        "count": len(results),
        "businesses": results,
    }


@app.get("/api/business/{business_name}")
def get_business(
    business_name: str,
):

    query = normalize_text(
        business_name
    )

    for business in BUSINESSES:

        if normalize_text(
            business["name"]
        ) == query:

            return {
                "success": True,
                "business": business,
            }

    raise HTTPException(
        status_code=404,
        detail="Business not found",
    )


# =========================================================
# MARKET ANALYSIS
# =========================================================

@app.get("/api/market-factors")
def get_market_factors():

    return {
        "success": True,
        "count": len(MARKET_FACTORS),
        "actual_local_values_available": False,
        "factors": MARKET_FACTORS,
    }


@app.post("/api/market-analysis")
def market_analysis(
    request: BusinessRequest,
):

    recommendations = get_recommendations(
        request
    )

    return {
        "success": True,
        "location": request.location,
        "business_interest": request.business,
        "market_factors": MARKET_FACTORS,
        "recommendations": recommendations,
        "data_note": (
            "The market-factor sheet provides the "
            "analysis framework. It does not invent "
            "village-level market values."
        ),
    }


# =========================================================
# FINANCIAL CALCULATIONS
# =========================================================

def calculate_total_project_cost(
    equipment,
    setup,
    working_capital,
    other_expenses,
):

    return round(
        equipment
        + setup
        + working_capital
        + other_expenses,
        2,
    )


def calculate_funding_gap(
    total_cost,
    own_contribution,
):

    return round(
        max(
            total_cost - own_contribution,
            0,
        ),
        2,
    )


def calculate_own_contribution_percentage(
    total_cost,
    own_contribution,
):

    if total_cost <= 0:
        return 0

    return round(
        (
            own_contribution
            / total_cost
        ) * 100,
        2,
    )


def calculate_monthly_surplus(
    revenue,
    expenses,
):

    return round(
        revenue - expenses,
        2,
    )


def calculate_break_even_months(
    total_cost,
    monthly_surplus,
):

    if monthly_surplus <= 0:
        return None

    return round(
        total_cost / monthly_surplus,
        2,
    )


def calculate_funding_percentage(
    total_cost,
    funding_gap,
):

    if total_cost <= 0:
        return 0

    return round(
        funding_gap / total_cost * 100,
        2,
    )


def calculate_recommended_working_capital(
    monthly_expenses,
):

    if monthly_expenses <= 0:
        return 0

    return round(
        monthly_expenses * 3,
        2,
    )


def calculate_contingency_amount(
    base_cost,
    percentage,
):

    return round(
        base_cost * percentage / 100,
        2,
    )


# =========================================================
# EMI CALCULATION
# =========================================================

def calculate_illustrative_emi(
    principal,
    annual_rate,
    months,
):

    if principal <= 0:
        return {
            "monthly_emi": 0,
            "total_repayment": 0,
            "total_interest": 0,
        }

    if months <= 0:
        return {
            "monthly_emi": 0,
            "total_repayment": 0,
            "total_interest": 0,
        }

    monthly_rate = (
        annual_rate / 100 / 12
    )

    if monthly_rate == 0:

        emi = principal / months

    else:

        factor = (
            (1 + monthly_rate)
            ** months
        )

        emi = (
            principal
            * monthly_rate
            * factor
            / (factor - 1)
        )

    total_repayment = (
        emi * months
    )

    total_interest = (
        total_repayment
        - principal
    )

    return {
        "monthly_emi":
            round(emi, 2),

        "total_repayment":
            round(total_repayment, 2),

        "total_interest":
            round(total_interest, 2),
    }


# =========================================================
# FINANCIAL HEALTH
# =========================================================

def calculate_financial_health(
    monthly_revenue,
    monthly_expenses,
    funding_gap,
):

    if (
        monthly_revenue <= 0
        and monthly_expenses <= 0
    ):
        return (
            "Needs Information",
            0,
        )

    if monthly_revenue <= 0:
        return (
            "Needs Cash-Flow Data",
            50,
        )

    surplus = (
        monthly_revenue
        - monthly_expenses
    )

    if surplus > 0 and funding_gap <= 0:
        return (
            "Healthy",
            90,
        )

    if surplus > 0:
        return (
            "Manageable With Funding",
            75,
        )

    if surplus == 0:
        return (
            "Needs Attention",
            50,
        )

    return (
        "High Attention Needed",
        25,
    )


# =========================================================
# FINANCIAL ACTIONS
# =========================================================

def generate_financial_actions(
    total_cost,
    funding_gap,
    monthly_revenue,
    monthly_expenses,
    recommended_working_capital,
    contingency_amount,
):

    actions = []

    if funding_gap > 0:
        actions.append(
            "Review suitable financing options for the funding gap."
        )
    else:
        actions.append(
            "Your entered own contribution covers the calculated project cost."
        )

    if recommended_working_capital > 0:
        actions.append(
            "Keep approximately three months of operating expenses as working-capital support."
        )

    if contingency_amount > 0:
        actions.append(
            "Keep a contingency reserve for unexpected startup expenses."
        )

    if monthly_revenue > 0:

        if monthly_revenue > monthly_expenses:
            actions.append(
                "Current entered revenue is higher than monthly expenses."
            )
        elif monthly_revenue == monthly_expenses:
            actions.append(
                "Revenue and expenses are at break-even based on the entered values."
            )
        else:
            actions.append(
                "Review pricing, costs and expected sales because monthly expenses exceed revenue."
            )

    else:
        actions.append(
            "Enter an estimated monthly revenue to calculate cash-flow health and break-even."
        )

    return actions


# =========================================================
# FINANCIAL PLAN
# =========================================================

@app.post("/api/financial-plan")
def financial_plan(
    request: FinancialRequest,
):

    base_project_cost = calculate_total_project_cost(
        request.equipment,
        request.setup,
        request.working_capital,
        request.other_expenses,
    )

    recommended_working_capital = (
        request.working_capital
    )

    if (
        recommended_working_capital <= 0
        and request.monthly_expenses > 0
    ):

        recommended_working_capital = (
            calculate_recommended_working_capital(
                request.monthly_expenses
            )
        )

    recommended_base_cost = calculate_total_project_cost(
        request.equipment,
        request.setup,
        recommended_working_capital,
        request.other_expenses,
    )

    contingency_amount = (
        calculate_contingency_amount(
            recommended_base_cost,
            request.contingency_percentage,
        )
    )

    recommended_project_cost = (
        recommended_base_cost
        + contingency_amount
    )

    funding_gap = calculate_funding_gap(
        base_project_cost,
        request.own_contribution,
    )

    recommended_funding_gap = calculate_funding_gap(
        recommended_project_cost,
        request.own_contribution,
    )

    own_percentage = (
        calculate_own_contribution_percentage(
            base_project_cost,
            request.own_contribution,
        )
    )

    recommended_funding_percentage = (
        calculate_funding_percentage(
            recommended_project_cost,
            recommended_funding_gap,
        )
    )

    monthly_surplus = (
        calculate_monthly_surplus(
            request.estimated_monthly_revenue,
            request.monthly_expenses,
        )
    )

    break_even_months = (
        calculate_break_even_months(
            base_project_cost,
            monthly_surplus,
        )
    )

    recommended_break_even_months = (
        calculate_break_even_months(
            recommended_project_cost,
            monthly_surplus,
        )
    )

    if (
        request.estimated_monthly_revenue > 0
        and monthly_surplus > 0
    ):

        cash_flow_status = "Positive"

    elif (
        request.estimated_monthly_revenue > 0
        and monthly_surplus == 0
    ):

        cash_flow_status = "Break-even"

    elif (
        request.estimated_monthly_revenue > 0
        and monthly_surplus < 0
    ):

        cash_flow_status = "Negative"

    else:

        cash_flow_status = "Insufficient data"

    if request.estimated_monthly_revenue > 0:

        cash_flow_margin = round(
            (
                monthly_surplus
                / request.estimated_monthly_revenue
            ) * 100,
            2,
        )

    else:

        cash_flow_margin = 0

    health, health_score = (
        calculate_financial_health(
            request.estimated_monthly_revenue,
            request.monthly_expenses,
            recommended_funding_gap,
        )
    )

    emi = calculate_illustrative_emi(
        recommended_funding_gap,
        request.annual_interest_rate,
        request.loan_tenure_months,
    )

    actions = generate_financial_actions(
        recommended_project_cost,
        recommended_funding_gap,
        request.estimated_monthly_revenue,
        request.monthly_expenses,
        recommended_working_capital,
        contingency_amount,
    )

    if funding_gap <= 0:

        funding_status = "Fully Funded"

    else:

        funding_status = "Funding Required"

    if funding_gap <= 0:

        message = (
            "The entered own contribution covers "
            "the base project cost."
        )

    else:

        message = (
            f"Additional funding of approximately "
            f"₹{funding_gap:,.2f} may be required "
            f"for the base project cost."
        )

    return {
        "success": True,

        "business_name":
            request.business_name,

        "business_investment":
            request.business_investment,

        "total_project_cost":
            base_project_cost,

        "base_project_cost":
            base_project_cost,

        "recommended_total_project_cost":
            recommended_project_cost,

        "recommended_working_capital":
            recommended_working_capital,

        "contingency_percentage":
            request.contingency_percentage,

        "contingency_amount":
            contingency_amount,

        "own_contribution":
            request.own_contribution,

        "own_contribution_percentage":
            own_percentage,

        "funding_gap":
            funding_gap,

        "recommended_funding_gap":
            recommended_funding_gap,

        "funding_percentage":
            calculate_funding_percentage(
                base_project_cost,
                funding_gap,
            ),

        "recommended_funding_percentage":
            recommended_funding_percentage,

        "monthly_expenses":
            request.monthly_expenses,

        "estimated_monthly_revenue":
            request.estimated_monthly_revenue,

        "monthly_surplus":
            monthly_surplus,

        "cash_flow_status":
            cash_flow_status,

        "cash_flow_margin_percentage":
            cash_flow_margin,

        "break_even_months":
            break_even_months,

        "recommended_break_even_months":
            recommended_break_even_months,

        "financial_health":
            health,

        "financial_health_score":
            health_score,

        "funding_status":
            funding_status,

        "cost_breakdown":
            {
                "equipment":
                    request.equipment,

                "setup":
                    request.setup,

                "working_capital":
                    request.working_capital,

                "recommended_working_capital":
                    recommended_working_capital,

                "other_expenses":
                    request.other_expenses,

                "contingency":
                    contingency_amount,
            },

        "illustrative_loan_scenario":
            {
                "loan_amount":
                    recommended_funding_gap,

                "annual_interest_rate":
                    request.annual_interest_rate,

                "tenure_months":
                    request.loan_tenure_months,

                "monthly_emi":
                    emi["monthly_emi"],

                "total_repayment":
                    emi["total_repayment"],

                "total_interest":
                    emi["total_interest"],

                "note":
                    (
                        "Illustrative planning calculation only. "
                        "It is not a loan offer or approval."
                    ),
            },

        "financial_actions":
            actions,

        "message":
            message,

        "disclaimer":
            (
                "Financial values are planning estimates based "
                "on user-entered assumptions. They do not "
                "guarantee revenue, profit, break-even, loan "
                "approval or investment returns."
            ),
    }


# =========================================================
# GOVERNMENT SCHEMES
# =========================================================

@app.get("/api/government-schemes")
def get_government_schemes():

    return {
        "success": True,
        "count": len(SCHEMES),
        "schemes": SCHEMES,
    }


@app.get("/api/government-schemes/search")
def search_government_schemes(
    q: str = Query(
        ...,
        min_length=1,
    )
):

    query = normalize_text(q)

    results = []

    for scheme in SCHEMES:

        searchable = " ".join(
            [
                scheme.get("scheme_name", ""),
                scheme.get("purpose", ""),
                scheme.get("suitable_for", ""),
                scheme.get("eligibility", ""),
            ]
        )

        if query in normalize_text(
            searchable
        ):
            results.append(scheme)

    return {
        "success": True,
        "query": q,
        "count": len(results),
        "schemes": results,
    }


@app.get("/api/government-schemes/{scheme_name}")
def get_government_scheme(
    scheme_name: str,
):

    query = normalize_text(
        scheme_name
    )

    for scheme in SCHEMES:

        name = normalize_text(
            scheme.get("scheme_name", "")
        )

        if name == query:

            return {
                "success": True,
                "scheme": scheme,
            }

    raise HTTPException(
        status_code=404,
        detail="Government scheme not found",
    )


@app.post("/api/government-schemes/recommend")
def recommend_schemes(
    business: str = Query(
        ...,
        min_length=1,
    )
):

    query = normalize_text(business)

    results = []

    for scheme in SCHEMES:

        searchable = normalize_text(
            " ".join(
                [
                    scheme.get(
                        "scheme_name",
                        "",
                    ),
                    scheme.get(
                        "purpose",
                        "",
                    ),
                    scheme.get(
                        "suitable_for",
                        "",
                    ),
                ]
            )
        )

        if query in searchable:
            results.append(scheme)

    if not results:
        results = SCHEMES[:5]

    return {
        "success": True,
        "business": business,
        "recommended_schemes": results,
        "note": (
            "Scheme matching is informational. "
            "Check the current official eligibility "
            "and application rules before applying."
        ),
    }


# =========================================================
# DATA STATUS
# =========================================================

@app.get("/api/data-status")
def data_status():

    return {
        "success": True,

        "excel_file":
            str(EXCEL_FILE),

        "excel_file_exists":
            EXCEL_FILE.exists(),

        "business_count":
            len(BUSINESSES),

        "market_factor_count":
            len(MARKET_FACTORS),

        "government_scheme_count":
            len(SCHEMES),

        "status":
            "Ready"
            if BUSINESSES
            else "Business data unavailable",
    }


# =========================================================
# RELOAD DATA
# =========================================================

@app.post("/api/reload-data")
def reload_data():

    load_all_data()

    return {
        "success": True,

        "message":
            "Excel data reloaded successfully.",

        "business_count":
            len(BUSINESSES),

        "market_factor_count":
            len(MARKET_FACTORS),

        "government_scheme_count":
            len(SCHEMES),
    }


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message":
            "GramBiz AI API is running.",

        "project":
            "AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant",

        "version":
            "1.0.0",

        "docs":
            "/docs",

        "health":
            "/health",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "GramBiz AI API",
        "business_data":
            len(BUSINESSES) > 0,
    }


# =========================================================
# STARTUP
# =========================================================

@app.on_event("startup")
def startup_event():

    print()
    print("=" * 60)
    print("GRAMBIZ AI BACKEND STARTED")
    print("=" * 60)
    print("API: http://127.0.0.1:8000")
    print("DOCS: http://127.0.0.1:8000/docs")
    print("Excel:", EXCEL_FILE)
    print("Businesses:", len(BUSINESSES))
    print("Market Factors:", len(MARKET_FACTORS))
    print("Government Schemes:", len(SCHEMES))
    print("=" * 60)
    print()