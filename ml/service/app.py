
from pathlib import Path
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR  = Path(__file__).parent.parent
MODEL_DIR = BASE_DIR / "models"

app = FastAPI(title="MediPredict ML Service", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])

def _load(name: str):
    p = MODEL_DIR / f"{name}_model.joblib"
    if not p.exists():
        raise RuntimeError(f"Model not found: {p}")
    return joblib.load(p)

# Loading all models once at startup
diabetes_model     = _load("diabetes")
heart_model        = _load("heart")
liver_model        = _load("liver")
kidney_model       = _load("kidney")
breast_cancer_model = _load("breast_cancer")
parkinsons_model   = _load("parkinsons")
hepatitis_model    = _load("hepatitis")
lung_cancer_model  = _load("lung_cancer")


#Request schemas 

class DiabetesInput(BaseModel):
    age: float; glucose: float; bmi: float
    hypertension: int; family_history: int
    physical_activity: int; smoker: int

class HeartInput(BaseModel):
    age: float; cholesterol: float; blood_pressure: float
    max_heart_rate: float; family_history: int
    smoker: int; exercise_angina: int

class LiverInput(BaseModel):
    age: float; bilirubin: float; alkphos: float
    sgpt: float; sgot: float; albumin: float
    alcohol_consumption: str

class KidneyInput(BaseModel):
    age: float; bp: float; sg: float; al: float
    su: float; bhn: float; creatinine: float

class BreastCancerInput(BaseModel):
    radius_mean: float; texture_mean: float; perimeter_mean: float
    area_mean: float; concavity_mean: float; symmetry_mean: float

class ParkinsonsInput(BaseModel):
    fo_hz: float; jitter_pct: float; shimmer: float
    nhr: float; hnr: float; ppe: float

class HepatitisInput(BaseModel):
    age: float; alt: float; ast: float
    alb: float; bil: float; che: float

class LungCancerInput(BaseModel):
    smoking: int; yellow_fingers: int; anxiety: int
    chronic_disease: int; wheezing: int; chest_pain: int


#  Response schema 

class PredictionResponse(BaseModel):
    prediction: bool; probability: float; model: str


# Helper 

def _alcohol_encode(val: str) -> int:
    return {"none": 0, "low": 0, "moderate": 1, "high": 2}.get(val.lower(), 0)

def _infer(model, row: dict, model_name: str) -> PredictionResponse:
    df   = pd.DataFrame([row])
    pred = bool(model.predict(df)[0])
    prob = float(model.predict_proba(df)[0][1])
    return PredictionResponse(prediction=pred,
                              probability=round(prob, 4),
                              model=model_name)


# Endpoints

@app.post("/predict/diabetes", response_model=PredictionResponse)
def predict_diabetes(d: DiabetesInput):
    return _infer(diabetes_model, {
        "age": d.age, "glucose": d.glucose, "bmi": d.bmi,
        "hypertension": d.hypertension, "family_history": d.family_history,
        "physical_activity": d.physical_activity, "smoker": d.smoker,
    }, "LogisticRegression")

@app.post("/predict/heart", response_model=PredictionResponse)
def predict_heart(d: HeartInput):
    return _infer(heart_model, {
        "age": d.age, "cholesterol": d.cholesterol, "blood_pressure": d.blood_pressure,
        "max_heart_rate": d.max_heart_rate, "exercise_angina": d.exercise_angina,
        "family_history": d.family_history, "smoker": d.smoker,
    }, "LogisticRegression")

@app.post("/predict/liver", response_model=PredictionResponse)
def predict_liver(d: LiverInput):
    return _infer(liver_model, {
        "age": d.age, "bilirubin": d.bilirubin, "alkphos": d.alkphos,
        "sgpt": d.sgpt, "sgot": d.sgot, "albumin": d.albumin,
        "alcohol_consumption": _alcohol_encode(d.alcohol_consumption),
    }, "LogisticRegression")

@app.post("/predict/kidney", response_model=PredictionResponse)
def predict_kidney(d: KidneyInput):
    return _infer(kidney_model, {
        "age": d.age, "bp": d.bp, "sg": d.sg,
        "al": d.al, "su": d.su, "bhn": d.bhn, "creatinine": d.creatinine,
    }, "RandomForest")

@app.post("/predict/breast_cancer", response_model=PredictionResponse)
def predict_breast_cancer(d: BreastCancerInput):
    return _infer(breast_cancer_model, {
        "radius_mean": d.radius_mean, "texture_mean": d.texture_mean,
        "perimeter_mean": d.perimeter_mean, "area_mean": d.area_mean,
        "concavity_mean": d.concavity_mean, "symmetry_mean": d.symmetry_mean,
    }, "XGBoost")

@app.post("/predict/parkinsons", response_model=PredictionResponse)
def predict_parkinsons(d: ParkinsonsInput):
    return _infer(parkinsons_model, {
        "fo_hz": d.fo_hz, "jitter_pct": d.jitter_pct, "shimmer": d.shimmer,
        "nhr": d.nhr, "hnr": d.hnr, "ppe": d.ppe,
    }, "RandomForest")

@app.post("/predict/hepatitis", response_model=PredictionResponse)
def predict_hepatitis(d: HepatitisInput):
    return _infer(hepatitis_model, {
        "age": d.age, "alt": d.alt, "ast": d.ast,
        "alb": d.alb, "bil": d.bil, "che": d.che,
    }, "XGBoost")

@app.post("/predict/lung_cancer", response_model=PredictionResponse)
def predict_lung_cancer(d: LungCancerInput):
    return _infer(lung_cancer_model, {
        "smoking": d.smoking, "yellow_fingers": d.yellow_fingers,
        "anxiety": d.anxiety, "chronic_disease": d.chronic_disease,
        "wheezing": d.wheezing, "chest_pain": d.chest_pain,
    }, "RandomForest")

@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": [
        "diabetes","heart","liver","kidney",
        "breast_cancer","parkinsons","hepatitis","lung_cancer"
    ]}
