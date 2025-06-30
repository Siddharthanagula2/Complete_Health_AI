// Comprehensive medical conditions database with ICD-10 codes
export interface MedicalCondition {
  id: string;
  name: string;
  icd10Code: string;
  category: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  description: string;
  symptoms: string[];
  riskFactors: string[];
  complications?: string[];
  prevention?: string[];
  lifestyle?: string[];
  monitoring?: string[];
  relatedConditions?: string[];
}

export const medicalConditions: MedicalCondition[] = [
  // CARDIOVASCULAR CONDITIONS
  {
    id: 'hypertension',
    name: 'Hypertension (High Blood Pressure)',
    icd10Code: 'I10',
    category: 'Cardiovascular',
    severity: 'Moderate',
    description: 'Persistently elevated blood pressure in the arteries',
    symptoms: [
      'Often asymptomatic (silent killer)',
      'Headaches',
      'Dizziness',
      'Blurred vision',
      'Chest pain',
      'Shortness of breath'
    ],
    riskFactors: [
      'Age (over 45 for men, over 55 for women)',
      'Family history',
      'Obesity',
      'Sedentary lifestyle',
      'High sodium diet',
      'Excessive alcohol consumption',
      'Smoking',
      'Stress',
      'Diabetes',
      'Sleep apnea'
    ],
    complications: [
      'Heart attack',
      'Stroke',
      'Heart failure',
      'Kidney disease',
      'Vision problems',
      'Peripheral artery disease'
    ],
    prevention: [
      'Maintain healthy weight',
      'Regular physical activity',
      'Limit sodium intake (less than 2,300mg daily)',
      'Eat potassium-rich foods',
      'Limit alcohol consumption',
      'Quit smoking',
      'Manage stress',
      'Get adequate sleep'
    ],
    lifestyle: [
      'DASH diet (Dietary Approaches to Stop Hypertension)',
      'Regular aerobic exercise (150 minutes/week)',
      'Weight management',
      'Stress reduction techniques',
      'Regular blood pressure monitoring'
    ],
    monitoring: [
      'Blood pressure checks',
      'Kidney function tests',
      'Cholesterol levels',
      'Blood glucose levels',
      'Eye exams'
    ]
  },
  {
    id: 'coronary-artery-disease',
    name: 'Coronary Artery Disease',
    icd10Code: 'I25.9',
    category: 'Cardiovascular',
    severity: 'Severe',
    description: 'Narrowing or blockage of coronary arteries',
    symptoms: [
      'Chest pain (angina)',
      'Shortness of breath',
      'Fatigue',
      'Heart palpitations',
      'Weakness',
      'Nausea'
    ],
    riskFactors: [
      'High cholesterol',
      'High blood pressure',
      'Diabetes',
      'Smoking',
      'Family history',
      'Age',
      'Obesity',
      'Sedentary lifestyle',
      'Stress'
    ],
    complications: [
      'Heart attack',
      'Heart failure',
      'Arrhythmias',
      'Sudden cardiac death'
    ],
    prevention: [
      'Heart-healthy diet',
      'Regular exercise',
      'Maintain healthy weight',
      'Quit smoking',
      'Manage stress',
      'Control blood pressure and cholesterol'
    ]
  },

  // METABOLIC CONDITIONS
  {
    id: 'type-2-diabetes',
    name: 'Type 2 Diabetes Mellitus',
    icd10Code: 'E11',
    category: 'Endocrine/Metabolic',
    severity: 'Moderate',
    description: 'Chronic condition affecting blood sugar regulation',
    symptoms: [
      'Increased thirst',
      'Frequent urination',
      'Increased hunger',
      'Fatigue',
      'Blurred vision',
      'Slow-healing wounds',
      'Frequent infections'
    ],
    riskFactors: [
      'Obesity',
      'Sedentary lifestyle',
      'Family history',
      'Age (over 45)',
      'High blood pressure',
      'Abnormal cholesterol levels',
      'History of gestational diabetes',
      'Polycystic ovary syndrome (PCOS)'
    ],
    complications: [
      'Heart disease',
      'Stroke',
      'Kidney disease',
      'Eye damage (retinopathy)',
      'Nerve damage (neuropathy)',
      'Foot problems',
      'Skin conditions',
      'Alzheimer\'s disease'
    ],
    prevention: [
      'Maintain healthy weight',
      'Regular physical activity',
      'Healthy diet',
      'Limit refined sugars',
      'Regular health screenings'
    ],
    lifestyle: [
      'Carbohydrate counting',
      'Regular blood glucose monitoring',
      'Consistent meal timing',
      'Regular exercise',
      'Weight management',
      'Stress management'
    ],
    monitoring: [
      'Blood glucose levels',
      'HbA1c (every 3-6 months)',
      'Blood pressure',
      'Cholesterol levels',
      'Kidney function',
      'Eye exams',
      'Foot exams'
    ]
  },
  {
    id: 'obesity',
    name: 'Obesity',
    icd10Code: 'E66.9',
    category: 'Endocrine/Metabolic',
    severity: 'Moderate',
    description: 'Excessive body fat that increases health risks',
    symptoms: [
      'BMI ≥ 30',
      'Difficulty with physical activity',
      'Shortness of breath',
      'Sleep problems',
      'Joint pain',
      'Back pain'
    ],
    riskFactors: [
      'Genetics',
      'Sedentary lifestyle',
      'Poor diet',
      'Medical conditions',
      'Medications',
      'Social and economic factors',
      'Age',
      'Pregnancy'
    ],
    complications: [
      'Type 2 diabetes',
      'Heart disease',
      'High blood pressure',
      'Sleep apnea',
      'Certain cancers',
      'Stroke',
      'Gallbladder disease',
      'Osteoarthritis'
    ],
    prevention: [
      'Balanced diet',
      'Regular physical activity',
      'Portion control',
      'Limit processed foods',
      'Stay hydrated',
      'Get adequate sleep'
    ]
  },

  // RESPIRATORY CONDITIONS
  {
    id: 'asthma',
    name: 'Asthma',
    icd10Code: 'J45.9',
    category: 'Respiratory',
    severity: 'Moderate',
    description: 'Chronic inflammatory disease of the airways',
    symptoms: [
      'Wheezing',
      'Shortness of breath',
      'Chest tightness',
      'Coughing',
      'Difficulty sleeping due to breathing problems'
    ],
    riskFactors: [
      'Family history',
      'Allergies',
      'Respiratory infections',
      'Environmental factors',
      'Obesity',
      'Smoking exposure'
    ],
    complications: [
      'Severe asthma attacks',
      'Permanent airway narrowing',
      'Respiratory failure',
      'Pneumonia',
      'Collapsed lung'
    ],
    prevention: [
      'Avoid triggers',
      'Get vaccinated',
      'Control allergies',
      'Maintain healthy weight',
      'Exercise regularly'
    ]
  },

  // MENTAL HEALTH CONDITIONS
  {
    id: 'depression',
    name: 'Major Depressive Disorder',
    icd10Code: 'F32.9',
    category: 'Mental Health',
    severity: 'Moderate',
    description: 'Persistent feelings of sadness and loss of interest',
    symptoms: [
      'Persistent sad mood',
      'Loss of interest in activities',
      'Fatigue',
      'Sleep disturbances',
      'Appetite changes',
      'Difficulty concentrating',
      'Feelings of worthlessness',
      'Thoughts of death or suicide'
    ],
    riskFactors: [
      'Family history',
      'Personal history of mental health issues',
      'Traumatic events',
      'Chronic medical conditions',
      'Substance abuse',
      'Social isolation',
      'Major life changes'
    ],
    complications: [
      'Suicide',
      'Substance abuse',
      'Relationship problems',
      'Work or school problems',
      'Social isolation',
      'Physical health problems'
    ],
    prevention: [
      'Maintain social connections',
      'Regular exercise',
      'Stress management',
      'Adequate sleep',
      'Limit alcohol',
      'Seek help early'
    ]
  },
  {
    id: 'anxiety-disorder',
    name: 'Generalized Anxiety Disorder',
    icd10Code: 'F41.1',
    category: 'Mental Health',
    severity: 'Moderate',
    description: 'Excessive worry and anxiety about various life events',
    symptoms: [
      'Excessive worry',
      'Restlessness',
      'Fatigue',
      'Difficulty concentrating',
      'Irritability',
      'Muscle tension',
      'Sleep disturbances'
    ],
    riskFactors: [
      'Family history',
      'Personality traits',
      'Life experiences',
      'Medical conditions',
      'Substance use',
      'Stress'
    ],
    prevention: [
      'Stress management',
      'Regular exercise',
      'Adequate sleep',
      'Limit caffeine and alcohol',
      'Social support',
      'Mindfulness practices'
    ]
  },

  // MUSCULOSKELETAL CONDITIONS
  {
    id: 'osteoarthritis',
    name: 'Osteoarthritis',
    icd10Code: 'M19.9',
    category: 'Musculoskeletal',
    severity: 'Moderate',
    description: 'Degenerative joint disease affecting cartilage',
    symptoms: [
      'Joint pain',
      'Stiffness',
      'Reduced range of motion',
      'Joint swelling',
      'Bone spurs',
      'Muscle weakness'
    ],
    riskFactors: [
      'Age',
      'Gender (more common in women)',
      'Obesity',
      'Joint injuries',
      'Repetitive stress',
      'Genetics',
      'Bone deformities'
    ],
    complications: [
      'Chronic pain',
      'Disability',
      'Reduced quality of life',
      'Depression',
      'Sleep problems'
    ],
    prevention: [
      'Maintain healthy weight',
      'Regular exercise',
      'Protect joints',
      'Good posture',
      'Avoid repetitive stress'
    ]
  },
  {
    id: 'osteoporosis',
    name: 'Osteoporosis',
    icd10Code: 'M81.9',
    category: 'Musculoskeletal',
    severity: 'Moderate',
    description: 'Condition causing bones to become weak and brittle',
    symptoms: [
      'Often no symptoms until fracture',
      'Back pain',
      'Loss of height',
      'Stooped posture',
      'Bone fractures'
    ],
    riskFactors: [
      'Age',
      'Gender (more common in women)',
      'Family history',
      'Small body frame',
      'Hormonal changes',
      'Low calcium intake',
      'Sedentary lifestyle',
      'Smoking',
      'Excessive alcohol'
    ],
    prevention: [
      'Adequate calcium and vitamin D',
      'Weight-bearing exercise',
      'Avoid smoking',
      'Limit alcohol',
      'Fall prevention'
    ]
  },

  // GASTROINTESTINAL CONDITIONS
  {
    id: 'gerd',
    name: 'Gastroesophageal Reflux Disease (GERD)',
    icd10Code: 'K21.9',
    category: 'Gastrointestinal',
    severity: 'Mild',
    description: 'Chronic acid reflux that irritates the esophagus',
    symptoms: [
      'Heartburn',
      'Acid regurgitation',
      'Chest pain',
      'Difficulty swallowing',
      'Chronic cough',
      'Hoarse voice'
    ],
    riskFactors: [
      'Obesity',
      'Pregnancy',
      'Smoking',
      'Certain foods',
      'Large meals',
      'Lying down after eating',
      'Hiatal hernia'
    ],
    prevention: [
      'Maintain healthy weight',
      'Avoid trigger foods',
      'Eat smaller meals',
      'Don\'t lie down after eating',
      'Elevate head of bed',
      'Quit smoking'
    ]
  },

  // KIDNEY CONDITIONS
  {
    id: 'chronic-kidney-disease',
    name: 'Chronic Kidney Disease',
    icd10Code: 'N18.9',
    category: 'Renal',
    severity: 'Severe',
    description: 'Gradual loss of kidney function over time',
    symptoms: [
      'Often no symptoms in early stages',
      'Fatigue',
      'Swelling',
      'Changes in urination',
      'Nausea',
      'Loss of appetite',
      'Sleep problems'
    ],
    riskFactors: [
      'Diabetes',
      'High blood pressure',
      'Heart disease',
      'Family history',
      'Age',
      'Obesity',
      'Smoking'
    ],
    complications: [
      'Kidney failure',
      'Heart disease',
      'Stroke',
      'High blood pressure',
      'Anemia',
      'Bone disease'
    ],
    prevention: [
      'Control diabetes',
      'Manage blood pressure',
      'Maintain healthy weight',
      'Don\'t smoke',
      'Limit alcohol',
      'Stay hydrated'
    ]
  }
];

// Medical condition categories
export const medicalCategories = [
  'Cardiovascular',
  'Endocrine/Metabolic',
  'Respiratory',
  'Mental Health',
  'Musculoskeletal',
  'Gastrointestinal',
  'Renal',
  'Neurological',
  'Dermatological',
  'Hematological'
];

// Severity levels
export const severityLevels = ['Mild', 'Moderate', 'Severe', 'Critical'];

// Search and filter functions
export function searchConditions(query: string): MedicalCondition[] {
  const lowercaseQuery = query.toLowerCase();
  return medicalConditions.filter(condition =>
    condition.name.toLowerCase().includes(lowercaseQuery) ||
    condition.category.toLowerCase().includes(lowercaseQuery) ||
    condition.symptoms.some(symptom => symptom.toLowerCase().includes(lowercaseQuery)) ||
    condition.icd10Code.toLowerCase().includes(lowercaseQuery)
  );
}

export function getConditionsByCategory(category: string): MedicalCondition[] {
  return medicalConditions.filter(condition => condition.category === category);
}

export function getConditionsBySeverity(severity: string): MedicalCondition[] {
  return medicalConditions.filter(condition => condition.severity === severity);
}

export function getConditionById(id: string): MedicalCondition | undefined {
  return medicalConditions.find(condition => condition.id === id);
}

// Risk assessment
export interface RiskAssessment {
  condition: MedicalCondition;
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskScore: number; // 0-100
  matchedRiskFactors: string[];
  recommendations: string[];
}

export function assessConditionRisk(
  condition: MedicalCondition,
  patientRiskFactors: string[]
): RiskAssessment {
  const matchedRiskFactors = condition.riskFactors.filter(factor =>
    patientRiskFactors.some(patientFactor => 
      patientFactor.toLowerCase().includes(factor.toLowerCase()) ||
      factor.toLowerCase().includes(patientFactor.toLowerCase())
    )
  );
  
  const riskPercentage = (matchedRiskFactors.length / condition.riskFactors.length) * 100;
  
  let riskLevel: 'Low' | 'Moderate' | 'High';
  if (riskPercentage < 30) {
    riskLevel = 'Low';
  } else if (riskPercentage < 60) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'High';
  }
  
  // Generate recommendations based on matched risk factors
  const recommendations = matchedRiskFactors.map(factor => {
    // Find prevention measures that address this risk factor
    const relevantPrevention = condition.prevention?.filter(prevention =>
      prevention.toLowerCase().includes(factor.toLowerCase().split(' ')[0]) ||
      factor.toLowerCase().includes(prevention.toLowerCase().split(' ')[0])
    ) || [];
    
    if (relevantPrevention.length > 0) {
      return relevantPrevention[0];
    }
    
    // Generic recommendation if no specific one is found
    return `Consider addressing risk factor: ${factor}`;
  });
  
  return {
    condition,
    riskLevel,
    riskScore: Math.round(riskPercentage),
    matchedRiskFactors,
    recommendations: [...new Set(recommendations)] // Remove duplicates
  };
}

// Comprehensive risk assessment for multiple conditions
export function assessOverallHealthRisk(
  patientRiskFactors: string[]
): RiskAssessment[] {
  return medicalConditions.map(condition => 
    assessConditionRisk(condition, patientRiskFactors)
  ).sort((a, b) => b.riskScore - a.riskScore);
}