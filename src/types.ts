export type DiseaseType =
  | "diabetes"
  | "heart"
  | "liver"
  | "kidney"
  | "breast_cancer"
  | "parkinsons"
  | "hepatitis"
  | "lung_cancer"
  | "symptoms";

export interface DiabetesParams {
  age: number; glucose: number; bmi: number;
  hypertension: boolean; family_history: boolean;
  physical_activity: boolean; smoker: boolean;
}

export interface HeartParams {
  age: number; cholesterol: number; blood_pressure: number;
  max_heart_rate: number; family_history: boolean;
  smoker: boolean; exercise_angina: boolean;
}

export interface LiverParams {
  age: number; bilirubin: number; alkphos: number;
  sgpt: number; sgot: number; albumin: number;
  alcohol_consumption: "None" | "Moderate" | "High";
}

export interface KidneyParams {
  age: number; bp: number; sg: number;
  al: number; su: number; bhn: number; creatinine: number;
}

export interface BreastCancerParams {
  radius_mean: number; texture_mean: number; perimeter_mean: number;
  area_mean: number; concavity_mean: number; symmetry_mean: number;
}

export interface ParkinsonsParams {
  fo_hz: number; jitter_pct: number; shimmer: number;
  nhr: number; hnr: number; ppe: number;
}

export interface HepatitisParams {
  age: number; alt: number; ast: number;
  alb: number; bil: number; che: number;
}

export interface LungCancerParams {
  smoking: boolean; yellow_fingers: boolean; anxiety: boolean;
  chronic_disease: boolean; wheezing: boolean; chest_pain: boolean;
}

export interface SymptomParams {
  symptoms: string[];
}

export interface PredictionResult {
  disease: DiseaseType;
  prediction: boolean;
  message: string;
  confidence: number;
  assessedAt: string;
  inputData: any;
}

export interface HistoryRecord {
  id: string;
  disease: DiseaseType;
  diseaseName?: string;
  prediction: boolean;
  confidence: number;
  message: string;
  assessedAt: string;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
