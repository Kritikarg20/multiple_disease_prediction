import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { Mistral } from "@mistralai/mistralai";

dotenv.config();

const app = express();
const PORT = 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

app.use(express.json());

// ── ML Service proxy ──────────────────────────────────────────────────────────

class MlError extends Error {
  constructor(public userMessage: string, public httpStatus: number) {
    super(userMessage);
    this.name = "MlError";
  }
}

async function mlPredict(
  disease: string,
  body: Record<string, unknown>
): Promise<{ prediction: boolean; probability: number; model: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let res: Response;
  try {
    res = await fetch(`${ML_SERVICE_URL}/predict/${disease}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") throw new MlError("ML service took too long. Try again.", 504);
    throw new MlError("Service is offline", 503);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    if (res.status === 422) throw new MlError("Invalid input values", 400);
    if (res.status === 500) throw new MlError("Model processing failed", 502);
    throw new MlError(`Model processing failed (status ${res.status})`, 502);
  }
  return res.json() as Promise<{ prediction: boolean; probability: number; model: string }>;
}

function mlUnavailable(res: express.Response, error: any) {
  if (error instanceof MlError) {
    return res.status(error.httpStatus).json({ error: error.userMessage });
  }
  return res.status(503).json({
    error: "Service is offline",
    details: error?.message,
  });
}

function isConnRefused(e: any) {
  return e instanceof MlError ||
         e.message?.includes("fetch failed") ||
         e.code === "ECONNREFUSED";
}

// ── Fallback chatbot ──────────────────────────────────────────────────────────
function getFallbackChatbotReply(message: string, context: string): string {
  const msg = message.toLowerCase();
  const ctx = (context || "").toLowerCase();

  if (ctx.includes("diabetic") || ctx.includes("diabetes")) {
    if (msg.includes("do") || msg.includes("next") || msg.includes("plan") || msg.includes("should") || msg.includes("steps")) {
      return `### Recommended Clinical Next-Steps for Elevated Diabetes Risk:\n1. **HbA1c Diagnostic Validation**: Order a formal Glycated Hemoglobin (HbA1c) test and Fasting Plasma Glucose (FPG) panel to confirm diagnosis.\n2. **Endocrine Consult**: Refer for a comprehensive endocrinology consult if HbA1c exceeds 6.5%.\n3. **Cardiovascular Risk Assessment**: Perform a lipid profile and regular blood pressure checks.\n4. **Self-Monitoring Education**: Provide a clinical glucometer and training on testing fasting and 2-hour postprandial glucose levels.`;
    }
    if (msg.includes("diet") || msg.includes("eat") || msg.includes("food") || msg.includes("nutrition")) {
      return `### Medical Nutritional Therapy (MNT) Guidelines:\n- **Glycemic Index Control**: Transition to low-glycemic, high-fiber carbohydrate sources.\n- **Portion Control**: Implement mild carbohydrate restriction to prevent wide glycemic excursions.\n- **Fats & Proteins**: Emphasize heart-healthy fats and lean proteins.\n- **Hydration**: Recommend adequate water intake to help kidneys clear excess glucose.`;
    }
  }

  if (ctx.includes("heart") || ctx.includes("cardio") || ctx.includes("cardiac")) {
    if (msg.includes("do") || msg.includes("next") || msg.includes("plan") || msg.includes("should") || msg.includes("steps")) {
      return `### Recommended Actions for Elevated Cardiac Risk:\n1. **12-Lead ECG**: Perform an ECG immediately to evaluate cardiac rhythm and check for ischemia.\n2. **Cardiology Referral**: Refer for exercise tolerance stress test or stress echocardiography.\n3. **Lipid Panel & Biomarkers**: Check cardiac troponins and schedule a fasting lipid panel.\n4. **Hypertension Management**: Evaluate pharmacological management if resting pressure exceeds 140/90 mmHg.`;
    }
    if (msg.includes("diet") || msg.includes("eat") || msg.includes("food") || msg.includes("nutrition")) {
      return `### Cardiovascular Dietetic Guidelines (DASH / Mediterranean):\n- **Sodium Restriction**: Limit daily sodium to <2,300 mg.\n- **Saturated Fat Reduction**: Reduce high-fat dairy, red meat, and processed foods.\n- **Insoluble Dietary Fiber**: High fiber intake to reduce circulating serum LDL.`;
    }
  }

  if (ctx.includes("liver") || ctx.includes("hepatic") || ctx.includes("hepatitis")) {
    return `### Clinical Recommendations for Elevated Hepatic Indicators:\n1. **Hepatic Ultrasonography**: Order abdominal ultrasound to evaluate parenchyma for steatosis or fibrosis.\n2. **Comprehensive Liver Profile**: Request AST, ALT, Alkaline Phosphatase, Bilirubin, and Albumin panel.\n3. **Abstinence & Toxicity Audit**: Counsel complete alcohol abstinence and review any hepatotoxic medications.`;
  }

  if (ctx.includes("kidney") || ctx.includes("renal")) {
    return `### Clinical Recommendations for Suspected Renal Dysfunction:\n1. **Glomerular Assessment**: Run serum Creatinine check to calculate eGFR and determine CKD Stage.\n2. **Urinalysis (UACR)**: Order Urine Albumin-to-Creatinine Ratio to quantify proteinuria.\n3. **Avoid Nephrotoxins**: Discontinue NSAIDs immediately. Focus on blood pressure control (<130/80 mmHg).`;
  }

  if (ctx.includes("breast") || ctx.includes("cancer") || ctx.includes("mammary")) {
    return `### Clinical Recommendations for Elevated Breast Cancer Risk:\n1. **Diagnostic Imaging**: Schedule mammography and/or breast ultrasound for structural evaluation.\n2. **Biopsy Referral**: If imaging confirms suspicious findings, refer for core needle or excisional biopsy.\n3. **Oncology Consult**: Refer to a breast oncologist for comprehensive staging and treatment planning.`;
  }

  if (ctx.includes("parkinson") || ctx.includes("neurolog")) {
    return `### Clinical Recommendations for Suspected Parkinsonism:\n1. **Neurology Referral**: Refer to a movement disorder specialist for formal UPDRS motor assessment.\n2. **DaTscan / SPECT Imaging**: Consider dopamine transporter imaging to confirm nigrostriatal dysfunction.\n3. **Medication Evaluation**: Assess response to levodopa trial as a diagnostic and therapeutic step.`;
  }

  if (ctx.includes("lung") || ctx.includes("pulmonary") || ctx.includes("respiratory")) {
    return `### Clinical Recommendations for Elevated Lung Cancer Risk:\n1. **Low-Dose CT (LDCT)**: Order low-dose chest CT scan for high-resolution pulmonary nodule screening.\n2. **Pulmonology Referral**: Refer for bronchoscopy or CT-guided biopsy if suspicious lesions are found.\n3. **Smoking Cessation**: Urgently counsel structured cessation — NRT, varenicline, or bupropion.`;
  }

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("welcome")) {
    return `Hello! I am your AI Clinical Intelligence assistant. Based on this patient's active clinical risk (${context || "No specific diagnostic context active"}), I am here to help formulate differential evaluations and outline diagnostic or dietetic plans.\n\nFeel free to ask:\n- **"What is the recommended diet for this patient?"**\n- **"What clinical tests should I order next?"**\n- **"Why is the risk level elevated?"**`;
  }

  return `### Clinical Assessment Q&A:\nBased on the assessed results:\n* **Active Context**: "${context || "No assessment context active"}"\n* **Query**: "${message}"\n\nAsk about:\n1. **Diet recommendations**: Nutritional therapy tailored to the risk profile.\n2. **What should I do?**: Diagnostic guidelines and specialist referrals.\n3. **Risk factors**: Background on what these biomarker values signify.\n\n*Disclaimer: MediPredict AI output is for clinical decision support only. Final diagnosis must be made by a certified physician.*`;
}

// ── 1. Diabetes ───────────────────────────────────────────────────────────────
app.post("/api/diabetes", async (req, res) => {
  try {
    const { age, glucose, bmi, hypertension, family_history, physical_activity, smoker } = req.body;
    if (age === undefined || glucose === undefined || bmi === undefined)
      return res.status(400).json({ error: "Missing required parameters: age, glucose, bmi" });

    const r = await mlPredict("diabetes", {
      age: Number(age), glucose: Number(glucose), bmi: Number(bmi),
      hypertension: hypertension ? 1 : 0, family_history: family_history ? 1 : 0,
      physical_activity: physical_activity ? 1 : 0, smoker: smoker ? 1 : 0,
    });

    const confidence = Math.round(r.probability * 100);
    const glu = Number(glucose), bmiN = Number(bmi);
    const message = r.prediction
      ? `Patient demonstrates a significant risk index of ${confidence}% for Type 2 Diabetes (${r.model}). Key contributing factors include elevated blood glucose (${glu} mg/dL)${bmiN >= 25 ? ` and elevated BMI of ${bmiN}` : ""}${family_history ? ", positive family history" : ""}. Specialist evaluation recommended.`
      : `Patient demonstrates a low immediate-risk profile (${confidence}%) for Type 2 Diabetes (${r.model}). Glycemic baseline of ${glu} mg/dL remains within acceptable limits. Standard lifestyle surveillance recommended.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process diabetes assessment", details: e.message });
  }
});

// ── 2. Heart ──────────────────────────────────────────────────────────────────
app.post("/api/heart", async (req, res) => {
  try {
    const { age, cholesterol, blood_pressure, max_heart_rate, family_history, smoker, exercise_angina } = req.body;
    if (age === undefined || cholesterol === undefined || blood_pressure === undefined || max_heart_rate === undefined)
      return res.status(400).json({ error: "Missing required cardiac parameters" });

    const r = await mlPredict("heart", {
      age: Number(age), cholesterol: Number(cholesterol), blood_pressure: Number(blood_pressure),
      max_heart_rate: Number(max_heart_rate), family_history: family_history ? 1 : 0,
      smoker: smoker ? 1 : 0, exercise_angina: exercise_angina ? 1 : 0,
    });

    const confidence = Math.round(r.probability * 100);
    const chol = Number(cholesterol), bp = Number(blood_pressure);
    const message = r.prediction
      ? `Patient demonstrates a high cardiac clinical risk index of ${confidence}% (${r.model}). Contributing metrics include elevated cholesterol (${chol} mg/dL) and blood pressure of ${bp} mmHg${exercise_angina ? ", with exercise-induced angina present" : ""}. Urgent ECG and cardiology referral recommended.`
      : `Patient is classified as low immediate cardiovascular risk (${confidence}%, ${r.model}). Primary baseline vascular parameters are within non-critical reference standards. General preventative monitoring recommended.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process heart assessment", details: e.message });
  }
});

// ── 3. Liver ──────────────────────────────────────────────────────────────────
app.post("/api/liver", async (req, res) => {
  try {
    const { age, bilirubin, alkphos, sgpt, sgot, albumin, alcohol_consumption } = req.body;
    if (age === undefined || bilirubin === undefined || sgpt === undefined || sgot === undefined || albumin === undefined)
      return res.status(400).json({ error: "Missing hepatic biomarkers: bilirubin, sgpt, sgot, albumin" });

    const r = await mlPredict("liver", {
      age: Number(age), bilirubin: Number(bilirubin),
      alkphos: alkphos !== undefined ? Number(alkphos) : 90,
      sgpt: Number(sgpt), sgot: Number(sgot), albumin: Number(albumin),
      alcohol_consumption: alcohol_consumption || "None",
    });

    const confidence = Math.round(r.probability * 100);
    const alt = Number(sgpt), ast = Number(sgot), alb = Number(albumin);
    const message = r.prediction
      ? `Assessed biomarkers represent an active hepatic risk index of ${confidence}% (${r.model}). Elevated transaminases (ALT: ${alt} U/L, AST: ${ast} U/L) alongside albumin of ${alb} g/dL point toward hepatic cellular stress. Clinical imaging and hepatology referral recommended.`
      : `Biochemical screen displays a low hepatic stress signature (${confidence}% risk, ${r.model}). Transaminases and synthetic proteins remain within standard reference bounds. Standard follow-up is sufficient.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process liver assessment", details: e.message });
  }
});

// ── 4. Kidney ─────────────────────────────────────────────────────────────────
app.post("/api/kidney", async (req, res) => {
  try {
    const { age, bp, sg, al, su, bhn, creatinine } = req.body;
    if (age === undefined || creatinine === undefined || bp === undefined)
      return res.status(400).json({ error: "Missing renal biomarkers: creatinine, blood pressure" });

    const r = await mlPredict("kidney", {
      age: Number(age), bp: Number(bp),
      sg: sg !== undefined ? Number(sg) : 1.02,
      al: al !== undefined ? Number(al) : 0,
      su: su !== undefined ? Number(su) : 0,
      bhn: bhn !== undefined ? Number(bhn) : 20,
      creatinine: Number(creatinine),
    });

    const confidence = Math.round(r.probability * 100);
    const creat = Number(creatinine);
    const message = r.prediction
      ? `Kidney assessment identifies a high renal risk of ${confidence}% (${r.model}). Serum creatinine of ${creat} mg/dL${al ? ` with proteinuria grade ${al}` : ""} indicates compromised glomerular filtration. Proactive nephrology consult strongly advised.`
      : `Assessed renal function indicators remain sound with a low ${confidence}% risk (${r.model}). Glomerular barrier permeability and chemical clearance parameters are within normal range. Maintain adequate hydration.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process kidney assessment", details: e.message });
  }
});

// ── 5. Breast Cancer ──────────────────────────────────────────────────────────
app.post("/api/breast_cancer", async (req, res) => {
  try {
    const { radius_mean, texture_mean, perimeter_mean, area_mean, concavity_mean, symmetry_mean } = req.body;
    if (radius_mean === undefined || area_mean === undefined)
      return res.status(400).json({ error: "Missing required imaging parameters: radius_mean, area_mean" });

    const r = await mlPredict("breast_cancer", {
      radius_mean: Number(radius_mean), texture_mean: Number(texture_mean),
      perimeter_mean: Number(perimeter_mean), area_mean: Number(area_mean),
      concavity_mean: Number(concavity_mean), symmetry_mean: Number(symmetry_mean),
    });

    const confidence = Math.round(r.probability * 100);
    const message = r.prediction
      ? `Cell nuclei imaging profile indicates a malignant risk index of ${confidence}% (${r.model}). Elevated concavity (${Number(concavity_mean).toFixed(3)}) and nuclear area (${Number(area_mean).toFixed(1)}) are consistent with malignant morphology. Immediate oncology referral and biopsy confirmation recommended.`
      : `Cell nuclei imaging profile indicates a benign classification (${confidence}% malignancy probability, ${r.model}). Nuclear morphology parameters are within typical benign reference ranges. Routine mammographic surveillance recommended per standard screening schedule.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process breast cancer assessment", details: e.message });
  }
});

// ── 6. Parkinson's ────────────────────────────────────────────────────────────
app.post("/api/parkinsons", async (req, res) => {
  try {
    const { fo_hz, jitter_pct, shimmer, nhr, hnr, ppe } = req.body;
    if (fo_hz === undefined || ppe === undefined)
      return res.status(400).json({ error: "Missing required voice parameters: fo_hz, ppe" });

    const r = await mlPredict("parkinsons", {
      fo_hz: Number(fo_hz), jitter_pct: Number(jitter_pct), shimmer: Number(shimmer),
      nhr: Number(nhr), hnr: Number(hnr), ppe: Number(ppe),
    });

    const confidence = Math.round(r.probability * 100);
    const message = r.prediction
      ? `Acoustic voice biomarkers indicate a Parkinson's disease risk index of ${confidence}% (${r.model}). Elevated jitter (${Number(jitter_pct).toFixed(5)}) and shimmer (${Number(shimmer).toFixed(4)}) alongside NHR of ${Number(nhr).toFixed(4)} are consistent with nigrostriatal dysfunction. Neurology referral and formal motor assessment recommended.`
      : `Acoustic voice biomarker profile indicates low Parkinsonism risk (${confidence}%, ${r.model}). Vocal frequency stability and harmonic ratios remain within healthy reference norms. Routine neurological monitoring recommended if symptoms are present.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process Parkinson's assessment", details: e.message });
  }
});

// ── 7. Hepatitis C ────────────────────────────────────────────────────────────
app.post("/api/hepatitis", async (req, res) => {
  try {
    const { age, alt, ast, alb, bil, che } = req.body;
    if (age === undefined || alt === undefined || ast === undefined)
      return res.status(400).json({ error: "Missing required hepatitis parameters: age, alt, ast" });

    const r = await mlPredict("hepatitis", {
      age: Number(age), alt: Number(alt), ast: Number(ast),
      alb: Number(alb), bil: Number(bil), che: Number(che),
    });

    const confidence = Math.round(r.probability * 100);
    const message = r.prediction
      ? `Hepatic virology panel indicates a Hepatitis C infection risk of ${confidence}% (${r.model}). Elevated transaminases (ALT: ${Number(alt).toFixed(1)} U/L, AST: ${Number(ast).toFixed(1)} U/L) and bilirubin of ${Number(bil).toFixed(1)} mg/dL suggest active hepatocellular inflammation. HCV RNA PCR and hepatology consult urgently recommended.`
      : `Hepatic virology panel indicates a low Hepatitis C risk profile (${confidence}%, ${r.model}). Liver enzyme levels and synthetic function markers remain within acceptable reference bounds. Routine monitoring and risk-factor counselling recommended.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process hepatitis assessment", details: e.message });
  }
});

// ── 8. Lung Cancer ────────────────────────────────────────────────────────────
app.post("/api/lung_cancer", async (req, res) => {
  try {
    const { smoking, yellow_fingers, anxiety, chronic_disease, wheezing, chest_pain } = req.body;

    const r = await mlPredict("lung_cancer", {
      smoking: smoking ? 1 : 0, yellow_fingers: yellow_fingers ? 1 : 0,
      anxiety: anxiety ? 1 : 0, chronic_disease: chronic_disease ? 1 : 0,
      wheezing: wheezing ? 1 : 0, chest_pain: chest_pain ? 1 : 0,
    });

    const confidence = Math.round(r.probability * 100);
    const riskFactors = [
      smoking && "active smoking", yellow_fingers && "nicotine staining",
      wheezing && "wheezing", chest_pain && "chest pain",
      chronic_disease && "chronic disease history",
    ].filter(Boolean).join(", ");

    const message = r.prediction
      ? `Symptom profile indicates an elevated lung cancer risk index of ${confidence}% (${r.model}). Present risk factors include: ${riskFactors || "multiple co-occurring indicators"}. Low-dose CT (LDCT) chest screening and pulmonology referral are strongly recommended.`
      : `Symptom profile indicates a low lung cancer risk (${confidence}%, ${r.model}). Presenting indicators do not pattern-match to high-risk clinical criteria. Smoking cessation counselling and routine chest screening per age-appropriate guidelines recommended.`;

    res.json({ prediction: r.prediction, message, confidence });
  } catch (e: any) {
    if (isConnRefused(e)) return mlUnavailable(res, e);
    res.status(500).json({ error: "Failed to process lung cancer assessment", details: e.message });
  }
});

// ── 9. Symptom checker ───────────────────────────────────────────────────────
app.post("/api/disease", (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0)
      return res.status(400).json({ error: "Input must contain a non-empty array of 'symptoms'" });

    const sList = symptoms.map((s: string) => s.toLowerCase().trim());
    let respiratoryCount = 0, cardiacCount = 0, gastroCount = 0, arthritisCount = 0, neurologicalCount = 0;
    sList.forEach(s => {
      if (["fever","cough","fatigue","sore_throat","shortness_of_breath"].includes(s)) respiratoryCount++;
      if (["chest_pain","shortness_of_breath","arrhythmia","dizziness"].includes(s)) cardiacCount++;
      if (["nausea","vomiting","diarrhea","abdominal_pain","fever"].includes(s)) gastroCount++;
      if (["joint_pain","stiffness","swelling","fatigue","skin_rash"].includes(s)) arthritisCount++;
      if (["headache","migraine","dizziness","confusion","visual_disturbance"].includes(s)) neurologicalCount++;
    });

    const maxCount = Math.max(respiratoryCount, cardiacCount, gastroCount, arthritisCount, neurologicalCount);
    let detectedDisease = "Unspecified Syndrome", message = "", confidence = 50;

    if (maxCount === 0) {
      message = "The reported symptoms do not map clearly to predefined clinical symptom signatures. Standard physical follow-up recommended."; confidence = 10;
    } else if (maxCount === respiratoryCount) {
      detectedDisease = "Viral Respiratory Syndrome (e.g., Influenza or Similar Viral Load)";
      confidence = Math.min(95, Math.round((respiratoryCount / 5) * 100));
      message = `High likelihood (${confidence}% match) of active respiratory viral burden. Recommend screening for SARS-CoV-2/Influenza and monitoring oxygen levels.`;
    } else if (maxCount === cardiacCount) {
      detectedDisease = "General Cardiac/Angina Distress Signature";
      confidence = Math.min(95, Math.round((cardiacCount / 4) * 100));
      message = `Clinical warning: Symptoms point toward myocardial exhaustion or angina (${confidence}% probability). Immediate ECG verification warranted.`;
    } else if (maxCount === gastroCount) {
      detectedDisease = "Acute Gastroenteritis / Gastrointestinal Inflammation";
      confidence = Math.min(95, Math.round((gastroCount / 5) * 100));
      message = `High likelihood (${confidence}% match) of gastrointestinal dysbiosis or acute foodborne infection. Maintain hydration and monitor for persistent fever.`;
    } else if (maxCount === arthritisCount) {
      detectedDisease = "Autoimmune Rheumatologic or Connective Tissue Challenge";
      confidence = Math.min(95, Math.round((arthritisCount / 5) * 100));
      message = `Biomarkers align with inflammatory polyarthritis (${confidence}% confidence). Joint pain with fatigue merits rheumatoid factor (RF) or ANA serum test.`;
    } else {
      detectedDisease = "Vascular Neurological / Cephalgia Syndrome (Migraine Variant)";
      confidence = Math.min(95, Math.round((neurologicalCount / 5) * 100));
      message = `Matching signs (${confidence}% score) correspond to vascular migraine. Recommend dark-rest recovery and pharmacological evaluation.`;
    }

    res.json({ prediction: confidence >= 40, message: `Diagnostic Lead: ${detectedDisease}. ${message}`, confidence });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to classify symptoms", details: e.message });
  }
});

// ── 10. Gemini test route (TEMPORARY — remove after debugging) ────────────────
app.get("/api/test-gemini", async (req, res) => {
  console.log("Key loaded:", process.env.GEMINI_API_KEY?.slice(0, 8));
  try {
    const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await aiClient.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: "say hello" }] }],
    });
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ ok: true, text });
  } catch (e: any) {
    res.json({ ok: false, error: e.message });
  }
});

// ── 11. Chatbot ───────────────────────────────────────────────────────────────
app.post("/api/chatbot", async (req, res) => {
  const { message, context } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  if (!process.env.MISTRAL_API_KEY || !process.env.MISTRAL_API_KEY.trim()) {
    return res.json({ response: getFallbackChatbotReply(message, context) });
  }

  try {
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: `You are MediPredict AI, a clinical decision-support assistant embedded in a disease prediction platform.

Current prediction context: ${context || "No prediction has been run yet. You can still answer general medical questions."}

You can assess and explain results for: Diabetes, Heart Disease, Liver Disease, Kidney Disease, Breast Cancer, Parkinson's Disease, Hepatitis, and Lung Cancer.

Behavior rules:
- Answer the user's question directly and clearly
- If context is available, ground your answer in those specific results
- If no context is set, answer general medical questions helpfully
- Use markdown formatting: headers, bullet points, bold for key terms
- Keep responses concise but clinically accurate
- Always end every response with this exact disclaimer on a new line:
  "_Disclaimer: This is clinical decision-support only, not a diagnosis. Always consult a licensed physician._"`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text =
      response.choices?.[0]?.message?.content ??
      "I was unable to generate a response. Please try again.";

    res.json({ response: text });
  } catch (error: any) {
    console.error("Mistral API error:", error?.message, error?.status, error);
    res.json({ response: getFallbackChatbotReply(message, context) });
  }
});
// ── Health ────────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// ── Vite / static ─────────────────────────────────────────────────────────────
async function mountFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediPredict AI running on http://0.0.0.0:${PORT}`);
    console.log(`ML Service: ${ML_SERVICE_URL}`);
  });
}

mountFrontend();