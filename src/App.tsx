import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Activity, Heart, ArrowRight, CheckCircle, AlertTriangle, AlertCircle,
  Trash2, FileSpreadsheet, History, Info, ChevronRight, ArrowLeft,
  Search, ExternalLink, RefreshCw, Plus, Bookmark, Sparkles
} from "lucide-react";
import {
  DiseaseType, DiabetesParams, HeartParams, LiverParams, KidneyParams,
  BreastCancerParams, ParkinsonsParams, HepatitisParams, LungCancerParams,
  PredictionResult, HistoryRecord
} from "./types";
import TopBar from "./components/TopBar";
import ChatbotWidget from "./components/ChatbotWidget";

const C = {
  primary:          "#005039",
  primaryContainer: "#006b4d",
  primaryFixed:     "#9ef4cd",
  onPrimary:        "#ffffff",
  onPrimaryContainer: "#93e8c2",
  surface:          "#f9f9fc",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow:    "#f3f3f6",
  surfaceContainer:       "#eeeef0",
  surfaceContainerHigh:   "#e8e8ea",
  surfaceContainerHighest:"#e2e2e5",
  onSurface:        "#1a1c1e",
  onSurfaceVariant: "#3f4943",
  outline:          "#6f7a73",
  outlineVariant:   "#bec9c1",
  secondary:        "#57605e",
  secondaryContainer: "#d9e2df",
  error:            "#ba1a1a",
  errorContainer:   "#ffdad6",
};

function Toggle({ value, onChange, yesColor = "bg-[#005039]" }: {
  value: boolean; onChange: (v: boolean) => void; yesColor?: string;
}) {
  return (
    <div className="flex p-1 bg-[#eeeef0] rounded-xl">
      <button type="button" onClick={() => onChange(true)}
        className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${value ? `${yesColor} text-white shadow-sm` : "text-[#3f4943] hover:bg-[#e8e8ea]"}`}>
        YES
      </button>
      <button type="button" onClick={() => onChange(false)}
        className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${!value ? "bg-[#005039] text-white shadow-sm" : "text-[#3f4943] hover:bg-[#e8e8ea]"}`}>
        NO
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function NumField({ id, label, value, onChange, step, min, max, hint, placeholder }: {
  id: string; label: string; value: number; onChange: (n: number) => void;
  step?: number; min?: number; max?: number; hint?: string; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[10px] font-bold text-[#6f7a73] block tracking-widest uppercase">{label}</label>
      <input type="number" id={id} value={value} step={step} min={min} max={max}
        onChange={e => onChange(Number(e.target.value))} required
        placeholder={placeholder}
        className="w-full border border-[#bec9c1] hover:border-[#6f7a73] focus:border-[#005039] focus:ring-2 focus:ring-[#005039]/15 rounded-xl py-3 px-4 text-sm text-[#1a1c1e] bg-[#f9f9fc] outline-none transition-all" />
      {hint && <span className="text-[10px] text-[#6f7a73] block">{hint}</span>}
    </div>
  );
}


// 1. LANDING PAGE
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f9f9fc] min-h-screen font-sans">

      {/* Hero */}
      <section className="relative px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 z-10">
            <h1 className="font-bold text-4xl lg:text-5xl text-[#1a1c1e] tracking-tight leading-tight">
              Predict patient health risks before they become{" "}
              <span className="text-[#005039] underline decoration-[#82d7b2] decoration-4 underline-offset-2">critical</span>
            </h1>
            <p className="text-base text-[#3f4943] max-w-xl leading-relaxed">
              Equip your medical team with predictive clinical intelligence. MediPredict AI leverages real trained ML models to analyze biomarkers and deliver explainable risk indices in seconds.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button onClick={() => navigate("/predict")} id="btn-landing-start"
                className="px-8 py-4 rounded-xl bg-[#005039] hover:bg-[#006b4d] text-white font-bold text-sm tracking-wide hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer">
                Start Predictive Analytics <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/history" id="btn-landing-history"
                className="px-8 py-4 rounded-xl border border-[#bec9c1] hover:bg-[#f3f3f6] text-[#3f4943] font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center gap-1.5">
                View History Log
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#bec9c1]">
              <div>
                <p className="text-2xl font-bold text-[#005039]">8</p>
                <p className="text-xs text-[#6f7a73] font-medium mt-0.5">ML Modules</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1c1e]">9</p>
                <p className="text-xs text-[#6f7a73] font-medium mt-0.5">Active Modules</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1c1e]">&lt; 2s</p>
                <p className="text-xs text-[#6f7a73] font-medium mt-0.5">Processing Time</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border border-[#bec9c1] bg-white p-4">
              <div className="bg-[#f3f3f6] rounded-xl p-4 border border-[#e8e8ea] flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#9ef4cd]/30 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#005039]" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-[#1a1c1e]">Active Evaluator Engine</h5>
                    <p className="text-[10px] text-[#005039] font-bold tracking-wide uppercase">Operational</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 bg-[#005039] rounded-full animate-ping block" />
              </div>
              <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#9ef4cd]/20 to-[#f3f3f6] flex items-center justify-center">
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-4">
                  {[
                    { x: 20,  y: 30,  c: "#e6f4f0", s: "#005039", label: "DIABETES",    val: "72.7%" },
                    { x: 120, y: 30,  c: "#fef2f2", s: "#ba1a1a", label: "HEART",       val: "70.5%" },
                    { x: 220, y: 30,  c: "#fff7ed", s: "#f59e0b", label: "LIVER",       val: "71.8%" },
                    { x: 20,  y: 100, c: "#eff6ff", s: "#3b82f6", label: "KIDNEY",      val: "100%" },
                    { x: 120, y: 100, c: "#fdf4ff", s: "#a855f7", label: "BREAST CA",   val: "95.6%" },
                    { x: 220, y: 100, c: "#f0fdf4", s: "#22c55e", label: "LUNG CA",     val: "87.1%" },
                  ].map(({ x, y, c, s, label, val }) => (
                    <g key={label}>
                      <rect x={x} y={y} width="80" height="50" rx="8" fill={c} stroke={s} strokeWidth="1.5" />
                      <text x={x + 40} y={y + 22} textAnchor="middle" fontSize="7" fill={s} fontWeight="bold">{label}</text>
                      <text x={x + 40} y={y + 36} textAnchor="middle" fontSize="11" fill="#1a1c1e" fontWeight="bold">{val}</text>
                      <text x={x + 40} y={y + 46} textAnchor="middle" fontSize="6" fill="#6f7a73">ACC</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-[#9ef4cd]/20 rounded-full blur-3xl -z-0" />
          </div>
        </div>
      </section>

      {/* Disease modules strip */}
      <section className="bg-white border-t border-[#bec9c1] py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-bold text-2xl text-[#1a1c1e] tracking-tight">Physiological Diagnostic Breadth</h2>
            <p className="text-sm text-[#6f7a73] mt-2 leading-relaxed">Specialized ML pipelines targeting primary biochemical pathways, trained on public clinical datasets.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Metabolic Screen",      desc: "Type 2 Diabetes via glucose and BMI indices.",              icon: "bloodtype" },
              { label: "Coronary Strain",        desc: "Ischemic risk via cholesterol and angina markers.",         icon: "cardiology" },
              { label: "Hepatic Burden",         desc: "Liver injury via ALT, AST, bilirubin and albumin.",        icon: "labs" },
              { label: "Glomerular Clearance",   desc: "CKD via creatinine, BUN, and specific gravity.",           icon: "nephrology" },
              { label: "Breast Oncology",        desc: "Malignancy via nuclear imaging morphology.",               icon: "microbiology" },
              { label: "Neuromotor Acoustics",   desc: "Parkinsonism via vocal biomarker analysis.",              icon: "psychology_alt" },
              { label: "Hepatitis Detection",    desc: "HCV infection via liver enzyme profiles.",                icon: "biotech" },
              { label: "Pulmonary Risk",         desc: "Lung cancer risk via lifestyle and symptom survey.",       icon: "air" },
            ].map(({ label, desc, icon }) => (
              <div key={label}
                className="p-5 rounded-2xl border border-[#bec9c1] hover:border-[#005039] hover:shadow-lg transition-all cursor-pointer group bg-[#f9f9fc] bento-card">
                <div className="w-10 h-10 rounded-xl bg-[#eeeef0] flex items-center justify-center mb-4 group-hover:bg-[#9ef4cd]/40 transition-colors">
                  <span className="material-symbols-outlined text-[#005039] text-xl">{icon}</span>
                </div>
                <h4 className="font-semibold text-sm text-[#1a1c1e] mb-1">{label}</h4>
                <p className="text-xs text-[#6f7a73] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#005039] rounded-3xl p-12 md:p-20 relative overflow-hidden text-center text-white">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-bold text-3xl md:text-4xl mb-6 tracking-tight">Ready to modernize your diagnostics?</h2>
              <p className="text-[#93e8c2] text-base mb-10 leading-relaxed">Join leading healthcare institutions leveraging Clinical Intelligence to improve patient outcomes.</p>
              <button onClick={() => navigate("/predict")}
                className="px-10 py-4 rounded-xl bg-white text-[#005039] font-bold text-sm tracking-wide hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                Start Predictive Analytics
              </button>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#006b4d] rounded-full blur-[120px] opacity-40" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#57605e] rounded-full blur-[120px] opacity-20" />
          </div>
        </div>
      </section>

    </div>
  );
}

// 2. MODULES LIST PAGE
function ModulesPage() {
  const navigate = useNavigate();
  const clinicalModules = [
    { id: "diabetes",     name: "Diabetes Mellitus Screen",     category: "Metabolic Pathway",      description: "Classifies cellular insulin sensitivity, fasting glucose stress, and physical metrics via Pima Indians dataset.",      icon: "bloodtype" },
    { id: "heart",        name: "Cardiovascular Risk Core",      category: "Circulatory System",     description: "Maps atherosclerotic ischemic threat vectors, resting hypertension, and active angina via Cleveland dataset.",          icon: "cardiology" },
    { id: "liver",        name: "Hepatic Synthetic Profile",     category: "Digestive & Filtration", description: "Evaluates hepatocyte injury markers (ALT, AST), biliary enzymes and toxic consumption via ILPD dataset.",            icon: "labs" },
    { id: "kidney",       name: "Renal Filtration Index",        category: "Urinary & Secretory",    description: "Analyzes glomerular clearance, urine specific gravity, and proteinuria via UCI CKD dataset.",                        icon: "nephrology" },
    { id: "breast_cancer",name: "Breast Oncology Screen",        category: "Oncology",               description: "Classifies malignant vs benign cell nuclei via Wisconsin Breast Cancer imaging morphology dataset.",                 icon: "microbiology" },
    { id: "parkinsons",   name: "Parkinson's Neuromotor Panel",  category: "Neurology",              description: "Detects nigrostriatal dysfunction via vocal acoustic biomarkers from UCI Parkinson's dataset.",                      icon: "psychology_alt" },
    { id: "hepatitis",    name: "Hepatitis C Detection Panel",   category: "Infectious Disease",     description: "Identifies HCV infection risk via liver enzyme and synthetic function profiles.",                                   icon: "biotech" },
    { id: "lung_cancer",  name: "Lung Cancer Risk Screen",       category: "Pulmonology / Oncology", description: "Surveys symptom and lifestyle risk factors to estimate pulmonary malignancy probability.",                          icon: "air" },
    { id: "symptoms",     name: "Differential Symptom Triage",   category: "Systemic Diagnostics",   description: "Multi-symptom pattern matching engine running predictive classification of systemic syndromes.",                    icon: "stethoscope" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="font-bold text-2xl text-[#1a1c1e] tracking-tight">Predictive Diagnostic Station</h1>
        <p className="text-sm text-[#6f7a73] mt-1">Initiate high-fidelity diagnostic analytics by selecting an active clinical module below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clinicalModules.map(m => (
          <div key={m.id} onClick={() => navigate(`/predict/${m.id}`)} id={`module-card-${m.id}`}
            className="group cursor-pointer bg-white border border-[#bec9c1] hover:border-[#005039] rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg bento-card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-5">
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#6f7a73] bg-[#eeeef0] px-2.5 py-1 rounded-lg">
                  {m.category}
                </span>
                <div className="w-10 h-10 bg-[#9ef4cd]/30 rounded-xl flex items-center justify-center border border-[#82d7b2]/30 group-hover:bg-[#9ef4cd]/50 transition-colors">
                  <span className="material-symbols-outlined text-[#005039] text-xl">{m.icon}</span>
                </div>
              </div>
              <h4 className="font-bold text-base text-[#1a1c1e] mb-2 group-hover:text-[#005039] transition-colors">{m.name}</h4>
              <p className="text-xs text-[#6f7a73] leading-relaxed mb-6">{m.description}</p>
            </div>
            <div className="pt-4 border-t border-dashed border-[#e8e8ea] flex justify-between items-center text-xs font-semibold text-[#005039]">
              <span>Configure Biosheet</span>
              <div className="flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>Initialize</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// 3. FORM PAGE
function FormPage({ onSaveResult }: { onSaveResult: (r: PredictionResult) => void }) {
  const { disease } = useParams<{ disease: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [age, setAge] = useState(45);
  const [glucose, setGlucose] = useState(115);
  const [bmi, setBmi] = useState(24.5);
  const [hypertension, setHypertension] = useState(false);
  const [familyHistory, setFamilyHistory] = useState(false);
  const [physicalActivity, setPhysicalActivity] = useState(true);
  const [smoker, setSmoker] = useState(false);
  const [cholesterol, setCholesterol] = useState(210);
  const [bloodPressure, setBloodPressure] = useState(130);
  const [maxHeartRate, setMaxHeartRate] = useState(160);
  const [exerciseAngina, setExerciseAngina] = useState(false);
  const [bilirubin, setBilirubin] = useState(0.9);
  const [alkphos, setAlkphos] = useState(105);
  const [sgpt, setSgpt] = useState(38);
  const [sgot, setSgot] = useState(32);
  const [albumin, setAlbumin] = useState(4.0);
  const [alcohol, setAlcohol] = useState<"None" | "Moderate" | "High">("None");
  const [kidneyBP, setKidneyBP] = useState(80);
  const [sg, setSg] = useState(1.020);
  const [al, setAl] = useState(0);
  const [su, setSu] = useState(0);
  const [bhn, setBhn] = useState(15);
  const [creatinine, setCreatinine] = useState(0.9);
  const [radiusMean, setRadiusMean] = useState(14.0);
  const [textureMean, setTextureMean] = useState(19.0);
  const [perimeterMean, setPerimeterMean] = useState(92.0);
  const [areaMean, setAreaMean] = useState(600.0);
  const [concavityMean, setConcavityMean] = useState(0.08);
  const [symmetryMean, setSymmetryMean] = useState(0.18);
  const [foHz, setFoHz] = useState(154.23);
  const [jitterPct, setJitterPct] = useState(0.00622);
  const [shimmer, setShimmer] = useState(0.03531);
  const [nhr, setNhr] = useState(0.01417);
  const [hnr, setHnr] = useState(21.64);
  const [ppe, setPpe] = useState(0.11);
  const [hepAlt, setHepAlt] = useState(25.0);
  const [hepAst, setHepAst] = useState(30.0);
  const [hepAlb, setHepAlb] = useState(40.0);
  const [hepBil, setHepBil] = useState(0.7);
  const [hepChe, setHepChe] = useState(8.1);
  const [lcSmoking, setLcSmoking] = useState(false);
  const [lcYellowFingers, setLcYellowFingers] = useState(false);
  const [lcAnxiety, setLcAnxiety] = useState(false);
  const [lcChronic, setLcChronic] = useState(false);
  const [lcWheezing, setLcWheezing] = useState(false);
  const [lcChestPain, setLcChestPain] = useState(false);

  const availableSymptoms = [
    { label: "High Fever", value: "fever" }, { label: "Dry Cough", value: "cough" },
    { label: "Myalgia / Fatigue", value: "fatigue" }, { label: "Sore Throat", value: "sore_throat" },
    { label: "Dyspnea", value: "shortness_of_breath" }, { label: "Chest Pain", value: "chest_pain" },
    { label: "Arrhythmia", value: "arrhythmia" }, { label: "Dizziness & Syncope", value: "dizziness" },
    { label: "Focal Nausea", value: "nausea" }, { label: "Active Vomiting", value: "vomiting" },
    { label: "Acute Diarrhea", value: "diarrhea" }, { label: "Abdominal Cramps", value: "abdominal_pain" },
    { label: "Joint Pain", value: "joint_pain" }, { label: "Morning Stiffness", value: "stiffness" },
    { label: "Soft Tissue Swelling", value: "swelling" }, { label: "Skin Rash", value: "skin_rash" },
    { label: "Headache", value: "headache" }, { label: "Visual Aura Migraine", value: "migraine" },
    { label: "Sudden Confusion", value: "confusion" }, { label: "Visual Disturbance", value: "visual_disturbance" },
  ];
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const toggleSymptom = (val: string) =>
    setSelectedSymptoms(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);

  const nameMap: Record<string, string> = {
    diabetes: "Diabetes Mellitus Core Biosheet", heart: "Cardiovascular Strain Profile",
    liver: "Hepatic Biomarker Profile", kidney: "Renal Filtration Metrics",
    breast_cancer: "Breast Oncology Imaging Panel", parkinsons: "Parkinson's Acoustic Biomarker Sheet",
    hepatitis: "Hepatitis C Enzyme Panel", lung_cancer: "Lung Cancer Risk Survey",
    symptoms: "Differential Symptom Checklist",
  };

  const accentBorder: Record<string, string> = {
    diabetes: "border-[#005039]", heart: "border-rose-500", liver: "border-amber-500",
    kidney: "border-indigo-500", breast_cancer: "border-purple-500", parkinsons: "border-cyan-500",
    hepatitis: "border-orange-500", lung_cancer: "border-sky-500", symptoms: "border-teal-500",
  };
  const accent = accentBorder[disease || ""] || "border-[#005039]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    let bodyPayload: any = {};
    if (disease === "diabetes") {
      bodyPayload = { age, glucose, bmi, hypertension, family_history: familyHistory, physical_activity: physicalActivity, smoker };
    } else if (disease === "heart") {
      bodyPayload = { age, cholesterol, blood_pressure: bloodPressure, max_heart_rate: maxHeartRate, family_history: familyHistory, smoker, exercise_angina: exerciseAngina };
    } else if (disease === "liver") {
      bodyPayload = { age, bilirubin, alkphos, sgpt, sgot, albumin, alcohol_consumption: alcohol };
    } else if (disease === "kidney") {
      bodyPayload = { age, bp: kidneyBP, sg, al, su, bhn, creatinine };
    } else if (disease === "breast_cancer") {
      bodyPayload = { radius_mean: radiusMean, texture_mean: textureMean, perimeter_mean: perimeterMean, area_mean: areaMean, concavity_mean: concavityMean, symmetry_mean: symmetryMean };
    } else if (disease === "parkinsons") {
      bodyPayload = { fo_hz: foHz, jitter_pct: jitterPct, shimmer, nhr, hnr, ppe };
    } else if (disease === "hepatitis") {
      bodyPayload = { age, alt: hepAlt, ast: hepAst, alb: hepAlb, bil: hepBil, che: hepChe };
    } else if (disease === "lung_cancer") {
      bodyPayload = { smoking: lcSmoking, yellow_fingers: lcYellowFingers, anxiety: lcAnxiety, chronic_disease: lcChronic, wheezing: lcWheezing, chest_pain: lcChestPain };
    } else if (disease === "symptoms") {
      if (selectedSymptoms.length === 0) { setError("Please check at least one symptom."); setLoading(false); return; }
      bodyPayload = { symptoms: selectedSymptoms };
    }
    try {
      const response = await fetch(`/api/${disease}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyPayload),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Internal clinical database error.");
      }
      const rawResult = await response.json();
      const finishedResult: PredictionResult = {
        disease: disease as DiseaseType, prediction: rawResult.prediction, message: rawResult.message,
        confidence: rawResult.confidence,
        assessedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        inputData: bodyPayload,
      };
      onSaveResult(finishedResult);
      navigate("/results");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally { setLoading(false); }
  };

  // ── Section label ──
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <h3 className={`text-[10px] font-bold text-[#1a1c1e] uppercase tracking-widest border-l-4 ${accent} pl-3`}>
      {children}
    </h3>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/predict")} id="btn-form-back"
          className="p-2 border border-[#bec9c1] hover:bg-[#f3f3f6] rounded-xl text-[#3f4943] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-bold text-2xl text-[#1a1c1e] tracking-tight">{nameMap[disease || ""] || "Biosheet Assessment Form"}</h1>
          <p className="text-sm text-[#6f7a73] mt-0.5">Provide precise quantitative metrics to load the clinical scoring framework.</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs"><span className="font-bold">Input Error</span>: {error}</div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#bec9c1] rounded-2xl p-8 space-y-8 shadow-sm">

        {/* Age Slider */}
        {!["breast_cancer","parkinsons","lung_cancer","symptoms"].includes(disease || "") && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-[#6f7a73] block tracking-widest uppercase">Patient Chronological Age (Years)</label>
              <span className="text-lg font-bold text-[#005039]">{age} yrs</span>
            </div>
            <input type="range" min="1" max="100" value={age} onChange={e => setAge(Number(e.target.value))} />
            <div className="flex justify-between text-[10px] text-[#bec9c1] font-bold uppercase tracking-widest">
              <span>Pediatrics (1)</span><span>Geriatrics (100)</span>
            </div>
          </div>
        )}

        {/* DIABETES */}
        {disease === "diabetes" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Glycemic &amp; Physical Baseline</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumField id="glucose" label="Glucose Level (mg/dL)" value={glucose} onChange={setGlucose} step={1} min={0} max={600} hint="Fasting normal reference is under 100 mg/dL." />
                <NumField id="bmi" label="Body Mass Index (BMI)" value={bmi} onChange={setBmi} step={0.1} min={10} max={60} hint="Normal range spans 18.5 to 24.9." />
              </div>
            </div>
            <div className="border-t border-[#e8e8ea] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {([
                ["Resting Hypertension History", hypertension, setHypertension],
                ["Family History of Diabetes", familyHistory, setFamilyHistory],
                ["Active Physical Lifestyle", physicalActivity, setPhysicalActivity],
                ["Current Active Tobacco Smoker", smoker, setSmoker],
              ] as const).map(([label, val, setter]: any) => (
                <div key={label as string} className="space-y-3">
                  <label className="text-[10px] font-bold text-[#6f7a73] block tracking-widest uppercase">{label as string}</label>
                  <Toggle value={val as boolean} onChange={setter} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HEART */}
        {disease === "heart" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Circulatory Metrics</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumField id="cholesterol" label="Cholesterol (mg/dL)" value={cholesterol} onChange={setCholesterol} step={1} min={50} max={400} hint="Ideal is under 200 mg/dL." />
                <NumField id="bp" label="Systolic Pressure (mmHg)" value={bloodPressure} onChange={setBloodPressure} step={1} min={30} max={250} hint="Stage 1 is 140+ mmHg." />
                <NumField id="mhr" label="Acute Max Heart Rate (bpm)" value={maxHeartRate} onChange={setMaxHeartRate} step={1} min={40} max={220} />
              </div>
            </div>
            <div className="border-t border-[#e8e8ea] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {([
                ["Exercise Induced Chest Angina", exerciseAngina, setExerciseAngina, "bg-rose-600"],
                ["Family History of Coronary Strain", familyHistory, setFamilyHistory, undefined],
                ["Current Smoker", smoker, setSmoker, undefined],
              ] as const).map(([label, val, setter, yc]: any) => (
                <div key={label as string} className="space-y-3">
                  <label className="text-[10px] font-bold text-[#6f7a73] block tracking-widest uppercase">{label as string}</label>
                  <Toggle value={val as boolean} onChange={setter} yesColor={yc} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVER */}
        {disease === "liver" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Hepatic Assay Panels</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NumField id="bili" label="Serum Bilirubin (mg/dL)" value={bilirubin} onChange={setBilirubin} step={0.1} min={0} max={100} hint="Normal scope < 1.2 mg/dL." />
                <NumField id="alk" label="Alkaline Phosphatase (U/L)" value={alkphos} onChange={setAlkphos} step={1} min={0} max={2000} />
                <NumField id="sgpt" label="ALT Alanine Aminotransferase (U/L)" value={sgpt} onChange={setSgpt} step={1} min={0} max={2000} hint="Warning if ALT > 40 U/L." />
                <NumField id="sgot" label="AST Aspartate Aminotransferase (U/L)" value={sgot} onChange={setSgot} step={1} min={0} max={2000} />
                <NumField id="alb" label="Serum Albumin (g/dL)" value={albumin} onChange={setAlbumin} step={0.1} min={0} max={10} hint="Normal scope 3.5–5.5 g/dL." />
                <div className="space-y-2">
                  <label htmlFor="alcohol" className="text-[10px] font-bold text-[#6f7a73] block tracking-widest uppercase">Heavy Alcohol Consumption</label>
                  <select id="alcohol" value={alcohol} onChange={e => setAlcohol(e.target.value as any)}
                    className="w-full border border-[#bec9c1] hover:border-[#6f7a73] focus:border-[#005039] focus:ring-2 focus:ring-[#005039]/15 rounded-xl py-3 px-4 text-sm text-[#1a1c1e] bg-[#f9f9fc] outline-none transition-all">
                    <option value="None">None / Abstinent</option>
                    <option value="Moderate">Moderate Intake</option>
                    <option value="High">High Intake / Chronic</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KIDNEY */}
        {disease === "kidney" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Renal Chemistries</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NumField id="creat" label="Serum Creatinine (mg/dL)" value={creatinine} onChange={setCreatinine} step={0.1} min={0} max={20} hint="> 1.2 mg/dL indicates impairment." />
                <NumField id="kbp" label="Diastolic Blood Pressure (mmHg)" value={kidneyBP} onChange={setKidneyBP} step={1} min={30} max={200} />
                <NumField id="bhn" label="Blood Urea Nitrogen (mg/dL)" value={bhn} onChange={setBhn} step={1} min={0} max={300} />
                <NumField id="sg" label="Urine Specific Gravity" value={sg} onChange={setSg} step={0.005} min={1.0} max={1.03} hint="Normal: 1.015–1.025." />
                <NumField id="al" label="Proteinuria Albumin Grade (0–5)" value={al} onChange={setAl} min={0} max={5} />
                <NumField id="su" label="Urinary Glucose Grade (0–5)" value={su} onChange={setSu} min={0} max={5} />
              </div>
            </div>
          </div>
        )}

        {/* BREAST CANCER */}
        {disease === "breast_cancer" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Nuclear Imaging Morphology</SectionLabel>
              <p className="text-xs text-[#6f7a73]">Enter mean values from fine needle aspirate (FNA) imaging of cell nuclei.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NumField id="radius" label="Radius Mean (mm)" value={radiusMean} onChange={setRadiusMean} step={0.01} min={0} max={50} hint="Benign: 6–15 mm. Malignant: 15–30 mm." />
                <NumField id="texture" label="Texture Mean (std dev)" value={textureMean} onChange={setTextureMean} step={0.1} min={0} max={60} hint="Std deviation of gray-scale values." />
                <NumField id="perimeter" label="Perimeter Mean (mm)" value={perimeterMean} onChange={setPerimeterMean} step={0.1} min={0} max={300} />
                <NumField id="area" label="Area Mean (mm²)" value={areaMean} onChange={setAreaMean} step={1} min={0} max={5000} hint="Benign: 100–700. Malignant: 700–2500." />
                <NumField id="concavity" label="Concavity Mean" value={concavityMean} onChange={setConcavityMean} step={0.001} min={0} max={1} />
                <NumField id="symmetry" label="Symmetry Mean" value={symmetryMean} onChange={setSymmetryMean} step={0.001} min={0} max={1} />
              </div>
            </div>
          </div>
        )}

        {/* PARKINSON'S */}
        {disease === "parkinsons" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Vocal Acoustic Biomarkers</SectionLabel>
              <p className="text-xs text-[#6f7a73]">Enter sustained phonation voice recording measurements from clinical MDVP analysis.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NumField id="fo" label="Fundamental Frequency — Fo (Hz)" value={foHz} onChange={setFoHz} step={0.001} min={0} max={400} hint="Healthy: 100–260 Hz." />
                <NumField id="jitter" label="Jitter % (MDVP)" value={jitterPct} onChange={setJitterPct} step={0.00001} min={0} max={1} hint="Healthy: < 0.010." />
                <NumField id="shimmer" label="Shimmer (MDVP)" value={shimmer} onChange={setShimmer} step={0.00001} min={0} max={1} hint="Healthy: < 0.050." />
                <NumField id="nhr" label="Noise-to-Harmonic Ratio (NHR)" value={nhr} onChange={setNhr} step={0.00001} min={0} max={1} hint="Healthy: < 0.200." />
                <NumField id="hnr" label="Harmonic-to-Noise Ratio (HNR)" value={hnr} onChange={setHnr} step={0.001} min={0} max={50} hint="Healthy: > 20 dB." />
                <NumField id="ppe" label="Pitch Period Entropy (PPE)" value={ppe} onChange={setPpe} step={0.00001} min={0} max={1} />
              </div>
            </div>
          </div>
        )}

        {/* HEPATITIS */}
        {disease === "hepatitis" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Hepatic Enzyme &amp; Synthetic Panel</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NumField id="halt" label="ALT Alanine Aminotransferase (U/L)" value={hepAlt} onChange={setHepAlt} step={0.1} min={0} max={2000} hint="Healthy donor: < 35 U/L." />
                <NumField id="hast" label="AST Aspartate Aminotransferase (U/L)" value={hepAst} onChange={setHepAst} step={0.1} min={0} max={2000} hint="Healthy donor: < 40 U/L." />
                <NumField id="halb" label="Albumin (g/L)" value={hepAlb} onChange={setHepAlb} step={0.1} min={0} max={100} hint="Normal: 35–55 g/L." />
                <NumField id="hbil" label="Bilirubin (mg/dL)" value={hepBil} onChange={setHepBil} step={0.1} min={0} max={100} hint="Normal: < 1.2 mg/dL." />
                <NumField id="hche" label="Cholinesterase (kU/L)" value={hepChe} onChange={setHepChe} step={0.01} min={0} max={100} hint="Normal: 5–12 kU/L." />
              </div>
            </div>
          </div>
        )}

        {/* LUNG CANCER */}
        {disease === "lung_cancer" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-6">
              <SectionLabel>Pulmonary Risk Survey</SectionLabel>
              <p className="text-xs text-[#6f7a73]">Report presence or absence of the following clinical risk indicators.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {([
                  ["Active Tobacco Smoking", lcSmoking, setLcSmoking],
                  ["Yellow Finger Discoloration", lcYellowFingers, setLcYellowFingers],
                  ["Anxiety Disorder Present", lcAnxiety, setLcAnxiety],
                  ["Chronic Disease History", lcChronic, setLcChronic],
                  ["Audible Wheezing", lcWheezing, setLcWheezing],
                  ["Chest Pain on Exertion", lcChestPain, setLcChestPain],
                ] as const).map(([label, val, setter]: any) => (
                  <div key={label as string} className="space-y-3">
                    <label className="text-[10px] font-bold text-[#6f7a73] block tracking-widest uppercase">{label as string}</label>
                    <Toggle value={val as boolean} onChange={setter} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SYMPTOMS */}
        {disease === "symptoms" && (
          <div className="space-y-6">
            <div className="border-t border-[#e8e8ea] pt-6 space-y-4">
              <SectionLabel>Systemic Symptoms Matrix</SectionLabel>
              <p className="text-xs text-[#6f7a73]">Toggle presenting symptoms. The engine maps clusters to complete a differential diagnosis scoring.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {availableSymptoms.map(sym => {
                  const isChecked = selectedSymptoms.includes(sym.value);
                  return (
                    <button type="button" key={sym.value} onClick={() => toggleSymptom(sym.value)}
                      className={`flex justify-between items-center py-3 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                        isChecked
                          ? "bg-[#9ef4cd]/20 border-[#005039] text-[#005039] shadow-sm"
                          : "bg-white border-[#bec9c1] text-[#3f4943] hover:border-[#6f7a73] hover:bg-[#f3f3f6]"
                      }`}>
                      <span>{sym.label}</span>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                        isChecked ? "bg-[#005039] border-[#005039] text-white" : "border-[#bec9c1]"
                      }`}>
                        {isChecked && <Plus className="w-2.5 h-2.5 rotate-45" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-6 border-t border-[#e8e8ea] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#bec9c1] italic">Verify complete field validation before submission.</p>
          <button type="submit" disabled={loading} id="btn-form-submit"
            className="w-full md:w-auto px-10 py-4 rounded-xl bg-[#005039] hover:bg-[#006b4d] disabled:bg-[#eeeef0] disabled:text-[#6f7a73] text-white font-bold text-sm tracking-wide transition-all shadow-sm transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            {loading
              ? (<><RefreshCw className="w-4 h-4 animate-spin" />Synthesizing Biomarkers...</>)
              : (<>Compute Predictive Index<ArrowRight className="w-4 h-4" /></>)}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RESULTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
interface ResultsPageProps { result: PredictionResult | null; onBookmarkResult: (r: PredictionResult) => void; }

function ResultsPage({ result, onBookmarkResult }: ResultsPageProps) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const activeResult = result || (() => {
    const cached = localStorage.getItem("last_active_medipredict_result");
    if (cached) { try { return JSON.parse(cached) as PredictionResult; } catch (e) {} }
    return null;
  })();

  useEffect(() => {
    if (activeResult) {
      localStorage.setItem("last_active_medipredict_result", JSON.stringify(activeResult));
      onBookmarkResult(activeResult);
      setIsBookmarked(true);
    }
  }, [activeResult, onBookmarkResult]);

  if (!activeResult) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-[#eeeef0] rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-[#6f7a73]" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-[#1a1c1e]">No Assessment Record Loaded</h2>
          <p className="text-xs text-[#6f7a73] max-w-sm mx-auto mt-1">Please configure and compute an assessment sheet first.</p>
        </div>
        <button onClick={() => navigate("/predict")}
          className="px-6 py-3 bg-[#005039] hover:bg-[#006b4d] text-white rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all">
          Select Clinical Module
        </button>
      </div>
    );
  }

  const diseaseDisplayNames: Record<DiseaseType, string> = {
    diabetes: "Diabetes Mellitus Screen", heart: "Cardiovascular Risk Core",
    liver: "Hepatic Synthetic Profile", kidney: "Renal Filtration Index",
    breast_cancer: "Breast Oncology Screen", parkinsons: "Parkinson's Neuromotor Panel",
    hepatitis: "Hepatitis C Detection Panel", lung_cancer: "Lung Cancer Risk Screen",
    symptoms: "Symptom Differential Class",
  };

  const getOutcomeRecommendations = () => {
    const d = activeResult.disease;
    if (d === "diabetes") return [
      { title: "HbA1c Clinical Validation", desc: "Order a formal Glycated Hemoglobin (HbA1c) diagnostic blood assay." },
      { title: "Low Glycemic Index Diet", desc: "Suggest whole fiber, non-starchy leafy greens, and portion restriction." },
      { title: "Daily Glucose Tracking", desc: "Log fasting and 2-hour postprandial values meticulously." },
    ];
    if (d === "heart") return [
      { title: "Urgent 12-Lead ECG Screening", desc: "Assess cardiovascular resting pacing or myocardial electrical anomalies." },
      { title: "Cardiology Specialist Consult", desc: "Evaluate exertion margins or execute myocardial stress echo assessments." },
      { title: "Lipid Profile & Hypertension Review", desc: "Regulate salt values below 1500mg daily (DASH nutritional guidelines)." },
    ];
    if (d === "liver") return [
      { title: "Abdominal Ultrasonography", desc: "Screen hepatic tissue surface metrics for steatosis fat markers." },
      { title: "Complete Abstinence Protocol", desc: "Direct counseling to stop any metabolic stress-producing alcohol." },
      { title: "Hepatotoxin Audit", desc: "Review paracetamol limits and prevent systemic toxic loads." },
    ];
    if (d === "kidney") return [
      { title: "Estimated GFR (eGFR) Screening", desc: "Assess serum creatinine to map chronic CKD Stages." },
      { title: "Urinalysis Albumin Leak Checks", desc: "Measure Urine Albumin to Creatinine ratio (UACR)." },
      { title: "Halt Nonsteroidal NSAIDs", desc: "Discontinue ibuprofen, naproxen, or nephrotoxic compounds immediately." },
    ];
    if (d === "breast_cancer") return [
      { title: "Diagnostic Mammography", desc: "Schedule mammography and/or breast ultrasound for structural evaluation." },
      { title: "Biopsy Referral", desc: "If imaging confirms suspicious findings, refer for core needle or excisional biopsy." },
      { title: "Oncology Consult", desc: "Refer to a breast oncologist for comprehensive staging and treatment planning." },
    ];
    if (d === "parkinsons") return [
      { title: "Movement Disorder Specialist", desc: "Refer for formal UPDRS motor assessment and clinical staging." },
      { title: "DaTscan / SPECT Imaging", desc: "Consider dopamine transporter imaging to confirm nigrostriatal dysfunction." },
      { title: "Levodopa Trial", desc: "Assess therapeutic response as a diagnostic and management step." },
    ];
    if (d === "hepatitis") return [
      { title: "HCV RNA PCR Test", desc: "Order quantitative HCV RNA PCR to confirm active viraemia." },
      { title: "Hepatology Consult", desc: "Refer for specialist evaluation and antiviral therapy planning (DAAs)." },
      { title: "Liver Fibrosis Staging", desc: "FibroScan or APRI score to assess fibrosis progression and cirrhosis risk." },
    ];
    if (d === "lung_cancer") return [
      { title: "Low-Dose CT Chest Scan", desc: "Order LDCT for high-resolution pulmonary nodule screening." },
      { title: "Pulmonology Referral", desc: "Refer for bronchoscopy or CT-guided biopsy if suspicious lesions present." },
      { title: "Smoking Cessation Program", desc: "Urgently counsel structured cessation — NRT, varenicline, or bupropion." },
    ];
    return [
      { title: "Differential In-Person Visit", desc: "Standard physical visual diagnostics by certified physicians." },
      { title: "Fever / Oxygen Saturation Tracking", desc: "Monitor vitals history hourly if respiratory signs persist." },
      { title: "Comprehensive Metabolic Panel (CMP)", desc: "Quantify cellular electrolytes or inflammatory protein indicators." },
    ];
  };

  const isHighRisk = activeResult.prediction;
  const dName = diseaseDisplayNames[activeResult.disease] || "Diagnostic Evaluation Result";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e8e8ea] pb-5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#005039] bg-[#9ef4cd]/30 border border-[#82d7b2]/40 rounded-full px-3 py-1">
            Diagnostic Completed Report
          </span>
          <h1 className="font-bold text-2xl text-[#1a1c1e] tracking-tight mt-2">{dName}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => navigate("/predict")}
            className="border border-[#bec9c1] hover:bg-[#f3f3f6] text-[#3f4943] rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> New Assessment
          </button>
          <button
            onClick={() => { onBookmarkResult(activeResult); setIsBookmarked(true); alert("Result log saved to history."); }}
            disabled={isBookmarked} id="btn-results-save"
            className="bg-[#005039] hover:bg-[#006b4d] disabled:bg-[#eeeef0] disabled:text-[#6f7a73] text-white rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all">
            <Bookmark className="w-3.5 h-3.5" /> {isBookmarked ? "Result Log Saved" : "Save Result Log"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">

          {/* FIX 1: Educational disclaimer */}
          <div className="flex items-start gap-2 bg-[#f3f3f6] border border-[#bec9c1] rounded-xl px-4 py-3">
            <span className="text-sm leading-none mt-0.5">⚠️</span>
            <p className="text-[12px] text-[#6f7a73] leading-relaxed">
              <span className="font-bold text-[#3f4943]">Disclaimer:</span> This is a prediction generated by a machine-learning model, not a diagnosis. Consult a qualified specialist.
            </p>
          </div>

          {/* Score card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 bg-white border border-[#bec9c1] rounded-2xl overflow-hidden shadow-sm">
            <div className="md:col-span-5 bg-[#f3f3f6] flex flex-col justify-center items-center text-center p-8 border-r border-dashed border-[#bec9c1]">
              <span className="text-[10px] font-bold text-[#6f7a73] uppercase tracking-widest mb-5">Probability Score</span>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#e8e8ea]" cx="64" cy="64" fill="transparent" r="48" stroke="currentColor" strokeWidth="8" />
                  <circle className={isHighRisk ? "text-[#ba1a1a]" : "text-[#005039]"} cx="64" cy="64" fill="transparent" r="48" stroke="currentColor" strokeWidth="8"
                    strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * activeResult.confidence) / 100}
                    strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="text-3xl font-extrabold text-[#1a1c1e]">{activeResult.confidence}%</span>
                  <span className="text-[9px] text-[#6f7a73] font-bold uppercase tracking-wider mt-1">confidence (estimated)</span>
                </div>
              </div>
              <div className={`mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none ${
                isHighRisk
                  ? "bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20"
                  : "bg-[#9ef4cd]/30 text-[#005039] border border-[#82d7b2]/40"
              }`}>
                {isHighRisk
                  ? (<><AlertTriangle className="w-3.5 h-3.5" />Elevated Risk Indicators</>)
                  : (<><CheckCircle className="w-3.5 h-3.5" />Safe / Low Risk</>)}
              </div>
            </div>
            <div className="md:col-span-7 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-[#005039] uppercase block mb-1">Model Verdict</span>
                <h3 className={`text-xl font-bold tracking-tight mb-4 ${isHighRisk ? "text-[#ba1a1a]" : "text-[#005039]"}`}>
                  {isHighRisk ? "Elevated Risk Indicators Detected" : "Low-Risk Profile"}
                </h3>
                <div className="h-px bg-[#e8e8ea] w-full mb-4" />
                <p className="text-xs text-[#3f4943] leading-relaxed font-medium">{activeResult.message}</p>
              </div>
              <div className="pt-4 text-[10px] text-[#bec9c1] font-bold flex items-center gap-1.5 border-t border-[#e8e8ea]">
                <Info className="w-3.5 h-3.5" /> Assessed: {activeResult.assessedAt}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#1a1c1e] uppercase tracking-widest border-l-4 border-[#005039] pl-3">
              Recommended Clinical Protocols
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getOutcomeRecommendations().map((rec, rIdx) => (
                <div key={rIdx} className="bg-white border border-[#bec9c1] hover:border-[#005039] rounded-2xl p-5 transition-colors bento-card">
                  <div className="w-8 h-8 rounded-xl bg-[#9ef4cd]/30 flex items-center justify-center mb-3">
                    <CheckCircle className="w-4 h-4 text-[#005039]" />
                  </div>
                  <h4 className="font-bold text-xs text-[#1a1c1e] mb-1.5">{rec.title}</h4>
                  <p className="text-[11px] text-[#6f7a73] leading-relaxed">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ChatbotWidget context={`Diagnostic Module: ${dName}. Risk Assessment: ${isHighRisk ? "Elevated Risk" : "Low Risk"} at ${activeResult.confidence}% estimated probability. Parameters: ${JSON.stringify(activeResult.inputData || {})}`} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HISTORY PAGE
// ─────────────────────────────────────────────────────────────────────────────
interface HistoryPageProps { logs: HistoryRecord[]; onClearLogs: () => void; onSelectResult: (r: PredictionResult) => void; }

function HistoryPage({ logs, onClearLogs, onSelectResult }: HistoryPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const filtered = logs.filter(log => {
    const t = search.toLowerCase();
    return log.disease.toLowerCase().includes(t) || log.message.toLowerCase().includes(t) ||
      (log.prediction ? "positive high risk" : "negative low risk").includes(t);
  });

  const diseaseLabels: Record<DiseaseType, string> = {
    diabetes: "Diabetes Screen", heart: "Cardio Strain", liver: "Hepatic Synthetic",
    kidney: "Renal Clearance", breast_cancer: "Breast Oncology", parkinsons: "Parkinson's Panel",
    hepatitis: "Hepatitis C", lung_cancer: "Lung Cancer", symptoms: "Differential Diagnostic",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-bold text-2xl text-[#1a1c1e] tracking-tight">Clinician Saved Logbook</h1>
          <p className="text-sm text-[#6f7a73] mt-1">Track and review assessment history logs persistently.</p>
        </div>
        {logs.length > 0 && (
          <button onClick={() => { if (confirm("Clear all history? This is irreversible.")) { onClearLogs(); } }} id="btn-clear-history"
            className="text-xs text-[#ba1a1a] hover:text-red-800 font-semibold flex items-center gap-1.5 self-end cursor-pointer transition-colors">
            <Trash2 className="w-4 h-4" id="icon-clear-history" /> Clear History
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="bg-white border border-[#bec9c1] rounded-2xl p-16 text-center space-y-6" id="empty-history-state">
          <div className="w-16 h-16 bg-[#eeeef0] rounded-2xl flex items-center justify-center mx-auto">
            <History className="w-8 h-8 text-[#6f7a73]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#3f4943]" id="empty-history-headline">No previous predictions found</h3>
            <p className="text-xs text-[#6f7a73] max-w-sm mx-auto mt-1">No completed diagnostic reports are currently archived.</p>
          </div>
          <button onClick={() => navigate("/predict")} id="btn-open-screen-stations"
            className="px-6 py-3 bg-[#005039] hover:bg-[#006b4d] text-white rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all">
            Open Screen Stations
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bec9c1]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by disease type, risk verdict, summaries..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#bec9c1] hover:border-[#6f7a73] focus:border-[#005039] focus:ring-2 focus:ring-[#005039]/15 rounded-xl text-xs outline-none transition-all" />
          </div>
          <div className="bg-white border border-[#bec9c1] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f3f3f6] border-b border-[#e8e8ea] text-[10px] text-[#6f7a73] font-bold uppercase tracking-wider">
                  <th className="py-3 px-6 h-11">Biomarker Core</th>
                  <th className="py-3 px-6 h-11">Risk Verdict</th>
                  <th className="py-3 px-6 h-11">Probability Index</th>
                  <th className="py-3 px-6 h-11">Assessed At</th>
                  <th className="py-3 px-6 h-11">Explanatory Differential</th>
                  <th className="py-3 px-6 h-11 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f3f6] text-xs">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-[#f9f9fc] transition-colors">
                    <td className="py-4 px-6 font-bold text-[#1a1c1e]">{diseaseLabels[log.disease] || log.disease}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        log.prediction
                          ? "bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20"
                          : "bg-[#9ef4cd]/30 text-[#005039] border border-[#82d7b2]/40"
                      }`}>
                        {log.prediction ? "High Risk" : "Low Risk"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#eeeef0] rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full ${log.prediction ? "bg-[#ba1a1a]" : "bg-[#005039]"}`}
                            style={{ width: `${log.confidence}%` }} />
                        </div>
                        <span className="font-semibold text-[#3f4943]">{log.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#6f7a73] whitespace-nowrap">{log.assessedAt}</td>
                    <td className="py-4 px-6 text-[#6f7a73] max-w-xs truncate" title={log.message}>{log.message}</td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => {
                        onSelectResult({ disease: log.disease, prediction: log.prediction, message: log.message, confidence: log.confidence, assessedAt: log.assessedAt, inputData: {} });
                        navigate("/results");
                      }} className="text-[#005039] hover:text-[#006b4d] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors">
                        Inspect Result <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. APP SHELL
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeResult, setActiveResult] = useState<PredictionResult | null>(null);
  const [logsList, setLogsList] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) { try { setLogsList(JSON.parse(saved) as HistoryRecord[]); } catch (e) {} }
  }, []);

  const handleBookmarkResult = (res: PredictionResult) => {
    const already = logsList.some(l => l.disease === res.disease && l.confidence === res.confidence && l.assessedAt === res.assessedAt);
    if (already) return;
    const diseaseNames: Record<DiseaseType, string> = {
      diabetes: "Diabetes Mellitus Screen", heart: "Cardiovascular Risk Core",
      liver: "Hepatic Synthetic Profile", kidney: "Renal Filtration Index",
      breast_cancer: "Breast Oncology Screen", parkinsons: "Parkinson's Neuromotor Panel",
      hepatitis: "Hepatitis C Detection Panel", lung_cancer: "Lung Cancer Risk Screen",
      symptoms: "Symptom Differential Class",
    };
    const record: HistoryRecord = {
      id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      disease: res.disease, diseaseName: diseaseNames[res.disease] || res.disease,
      prediction: res.prediction, confidence: res.confidence, message: res.message,
      assessedAt: res.assessedAt, timestamp: res.assessedAt,
    };
    const updated = [record, ...logsList].slice(0, 20);
    setLogsList(updated);
    localStorage.setItem("history", JSON.stringify(updated));
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f9f9fc] flex flex-col font-sans">
        <div className="flex-1 w-full min-h-screen flex flex-col relative pb-12">
          <TopBar />
          <div className="pt-16 flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/predict" element={<ModulesPage />} />
              <Route path="/predict/:disease" element={<FormPage onSaveResult={res => setActiveResult(res)} />} />
              <Route path="/results" element={<ResultsPage result={activeResult} onBookmarkResult={handleBookmarkResult} />} />
              <Route path="/history" element={<HistoryPage logs={logsList} onClearLogs={() => { setLogsList([]); localStorage.removeItem("history"); }} onSelectResult={setActiveResult} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
