// Comprehensive medications database with real drug information
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandNames?: string[];
  drugClass: string;
  category: string;
  description: string;
  usedFor: string[];
  dosageForm: string[];
  typicalDosage: string;
  sideEffects: {
    common: string[];
    serious: string[];
  };
  interactions?: {
    drugs?: string[];
    foods?: string[];
    conditions?: string[];
  };
  precautions?: string[];
  contraindications?: string[];
  pregnancyCategory?: 'A' | 'B' | 'C' | 'D' | 'X';
  mechanism?: string;
  halfLife?: string;
  requiresPrescription: boolean;
}

export const medicationsDatabase: Medication[] = [
  // CARDIOVASCULAR MEDICATIONS
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    genericName: 'lisinopril',
    brandNames: ['Prinivil', 'Zestril'],
    drugClass: 'ACE Inhibitor',
    category: 'Cardiovascular',
    description: 'Angiotensin-converting enzyme (ACE) inhibitor that helps relax blood vessels',
    usedFor: [
      'Hypertension (high blood pressure)',
      'Heart failure',
      'Post-heart attack recovery',
      'Diabetic kidney disease'
    ],
    dosageForm: ['Tablet', 'Oral solution'],
    typicalDosage: '10-40 mg once daily',
    sideEffects: {
      common: [
        'Dry cough',
        'Dizziness',
        'Headache',
        'Fatigue',
        'Nausea'
      ],
      serious: [
        'Angioedema (swelling of face, lips, tongue)',
        'Hyperkalemia (high potassium levels)',
        'Decreased kidney function',
        'Low blood pressure',
        'Allergic reactions'
      ]
    },
    interactions: {
      drugs: [
        'Potassium supplements',
        'Potassium-sparing diuretics',
        'NSAIDs',
        'Lithium'
      ],
      foods: [
        'Salt substitutes containing potassium'
      ],
      conditions: [
        'Pregnancy',
        'Kidney disease',
        'Liver disease'
      ]
    },
    precautions: [
      'Monitor kidney function',
      'Check potassium levels',
      'May cause dizziness when standing up quickly'
    ],
    contraindications: [
      'History of angioedema with ACE inhibitors',
      'Pregnancy (2nd and 3rd trimesters)',
      'Bilateral renal artery stenosis'
    ],
    pregnancyCategory: 'D',
    mechanism: 'Blocks the conversion of angiotensin I to angiotensin II, reducing blood pressure',
    halfLife: '12 hours',
    requiresPrescription: true
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    genericName: 'atorvastatin',
    brandNames: ['Lipitor'],
    drugClass: 'Statin',
    category: 'Cardiovascular',
    description: 'HMG-CoA reductase inhibitor that lowers cholesterol levels',
    usedFor: [
      'High cholesterol',
      'Cardiovascular disease prevention',
      'Coronary artery disease',
      'Stroke prevention'
    ],
    dosageForm: ['Tablet'],
    typicalDosage: '10-80 mg once daily',
    sideEffects: {
      common: [
        'Muscle pain',
        'Joint pain',
        'Diarrhea',
        'Nausea',
        'Constipation'
      ],
      serious: [
        'Rhabdomyolysis (severe muscle breakdown)',
        'Liver damage',
        'Increased blood sugar',
        'Memory problems',
        'Allergic reactions'
      ]
    },
    interactions: {
      drugs: [
        'Cyclosporine',
        'Erythromycin',
        'Clarithromycin',
        'Protease inhibitors',
        'Fibrates'
      ],
      foods: [
        'Grapefruit juice'
      ],
      conditions: [
        'Liver disease',
        'Kidney disease',
        'Hypothyroidism'
      ]
    },
    precautions: [
      'Monitor liver function',
      'Report unexplained muscle pain',
      'Avoid excessive alcohol'
    ],
    contraindications: [
      'Active liver disease',
      'Pregnancy',
      'Breastfeeding'
    ],
    pregnancyCategory: 'X',
    mechanism: 'Inhibits HMG-CoA reductase, reducing cholesterol production in the liver',
    halfLife: '14 hours',
    requiresPrescription: true
  },
  {
    id: 'metoprolol',
    name: 'Metoprolol',
    genericName: 'metoprolol',
    brandNames: ['Lopressor', 'Toprol XL'],
    drugClass: 'Beta Blocker',
    category: 'Cardiovascular',
    description: 'Beta-1 selective blocker that reduces heart rate and blood pressure',
    usedFor: [
      'Hypertension',
      'Angina',
      'Heart failure',
      'Heart attack recovery',
      'Atrial fibrillation',
      'Migraine prevention'
    ],
    dosageForm: ['Tablet', 'Extended-release tablet', 'Injectable'],
    typicalDosage: '25-200 mg daily (varies by condition)',
    sideEffects: {
      common: [
        'Fatigue',
        'Dizziness',
        'Slow heart rate',
        'Cold hands and feet',
        'Shortness of breath'
      ],
      serious: [
        'Severe bradycardia (slow heart rate)',
        'Heart block',
        'Hypotension',
        'Worsening heart failure',
        'Bronchospasm'
      ]
    },
    interactions: {
      drugs: [
        'Calcium channel blockers',
        'Antiarrhythmics',
        'Insulin',
        'Oral diabetes medications',
        'Digoxin'
      ],
      conditions: [
        'Asthma',
        'COPD',
        'Diabetes',
        'Peripheral vascular disease'
      ]
    },
    precautions: [
      'Don\'t stop suddenly (can cause rebound hypertension)',
      'Monitor heart rate and blood pressure',
      'May mask symptoms of hypoglycemia in diabetics'
    ],
    contraindications: [
      'Severe bradycardia',
      'Heart block',
      'Cardiogenic shock',
      'Severe COPD or asthma'
    ],
    pregnancyCategory: 'C',
    requiresPrescription: true
  },

  // DIABETES MEDICATIONS
  {
    id: 'metformin',
    name: 'Metformin',
    genericName: 'metformin',
    brandNames: ['Glucophage', 'Glumetza', 'Riomet'],
    drugClass: 'Biguanide',
    category: 'Endocrine',
    description: 'Oral diabetes medication that reduces blood sugar production',
    usedFor: [
      'Type 2 diabetes',
      'Prediabetes',
      'Polycystic ovary syndrome (PCOS)',
      'Insulin resistance'
    ],
    dosageForm: ['Tablet', 'Extended-release tablet', 'Oral solution'],
    typicalDosage: '500-2000 mg daily, divided into 2-3 doses',
    sideEffects: {
      common: [
        'Diarrhea',
        'Nausea',
        'Stomach upset',
        'Metallic taste',
        'Vitamin B12 deficiency'
      ],
      serious: [
        'Lactic acidosis (rare but serious)',
        'Hypoglycemia (when combined with other diabetes medications)',
        'Allergic reactions'
      ]
    },
    interactions: {
      drugs: [
        'Contrast dyes used for imaging studies',
        'Certain antibiotics',
        'Corticosteroids',
        'Diuretics'
      ],
      conditions: [
        'Kidney disease',
        'Liver disease',
        'Heart failure',
        'Alcohol use disorder'
      ]
    },
    precautions: [
      'Take with meals to reduce GI side effects',
      'Monitor kidney function',
      'Temporarily stop before surgery or imaging with contrast',
      'Avoid excessive alcohol'
    ],
    contraindications: [
      'Severe kidney disease',
      'Metabolic acidosis',
      'Severe infection',
      'Dehydration'
    ],
    pregnancyCategory: 'B',
    mechanism: 'Decreases glucose production in the liver and improves insulin sensitivity',
    halfLife: '6.2 hours',
    requiresPrescription: true
  },
  {
    id: 'insulin-glargine',
    name: 'Insulin Glargine',
    genericName: 'insulin glargine',
    brandNames: ['Lantus', 'Toujeo', 'Basaglar'],
    drugClass: 'Long-acting Insulin',
    category: 'Endocrine',
    description: 'Long-acting insulin analog for blood sugar control',
    usedFor: [
      'Type 1 diabetes',
      'Type 2 diabetes'
    ],
    dosageForm: ['Injectable solution'],
    typicalDosage: 'Individualized based on blood glucose levels',
    sideEffects: {
      common: [
        'Hypoglycemia',
        'Injection site reactions',
        'Weight gain',
        'Lipodystrophy'
      ],
      serious: [
        'Severe hypoglycemia',
        'Allergic reactions',
        'Hypokalemia'
      ]
    },
    interactions: {
      drugs: [
        'Beta-blockers',
        'ACE inhibitors',
        'Salicylates',
        'Alcohol',
        'Thiazolidinediones'
      ],
      conditions: [
        'Kidney disease',
        'Liver disease'
      ]
    },
    precautions: [
      'Regular blood glucose monitoring',
      'Rotate injection sites',
      'Adjust dose with changes in physical activity',
      'Adjust dose with illness'
    ],
    contraindications: [
      'Hypoglycemia',
      'Hypersensitivity to insulin glargine'
    ],
    pregnancyCategory: 'B',
    mechanism: 'Replaces natural insulin to regulate blood glucose',
    requiresPrescription: true
  },

  // MENTAL HEALTH MEDICATIONS
  {
    id: 'sertraline',
    name: 'Sertraline',
    genericName: 'sertraline',
    brandNames: ['Zoloft'],
    drugClass: 'SSRI (Selective Serotonin Reuptake Inhibitor)',
    category: 'Mental Health',
    description: 'Antidepressant that increases serotonin levels in the brain',
    usedFor: [
      'Major depressive disorder',
      'Generalized anxiety disorder',
      'Panic disorder',
      'Post-traumatic stress disorder (PTSD)',
      'Obsessive-compulsive disorder (OCD)',
      'Social anxiety disorder',
      'Premenstrual dysphoric disorder (PMDD)'
    ],
    dosageForm: ['Tablet', 'Oral solution'],
    typicalDosage: '50-200 mg once daily',
    sideEffects: {
      common: [
        'Nausea',
        'Diarrhea',
        'Insomnia',
        'Drowsiness',
        'Dry mouth',
        'Dizziness',
        'Sexual dysfunction',
        'Headache'
      ],
      serious: [
        'Serotonin syndrome',
        'Increased suicidal thoughts (especially in young adults)',
        'Abnormal bleeding',
        'Hyponatremia',
        'Seizures'
      ]
    },
    interactions: {
      drugs: [
        'MAOIs',
        'Other antidepressants',
        'Triptans',
        'Tramadol',
        'St. John\'s Wort',
        'NSAIDs',
        'Warfarin'
      ],
      conditions: [
        'Liver disease',
        'Seizure disorders',
        'Bipolar disorder',
        'Bleeding disorders'
      ]
    },
    precautions: [
      'May take 2-4 weeks for full effect',
      'Don\'t stop suddenly (withdrawal risk)',
      'Monitor for worsening depression or suicidal thoughts',
      'Use caution when driving or operating machinery'
    ],
    contraindications: [
      'Use of MAOIs within 14 days',
      'Taking pimozide',
      'Hypersensitivity to sertraline'
    ],
    pregnancyCategory: 'C',
    mechanism: 'Inhibits serotonin reuptake in the central nervous system',
    halfLife: '26 hours',
    requiresPrescription: true
  },

  // PAIN MEDICATIONS
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    genericName: 'ibuprofen',
    brandNames: ['Advil', 'Motrin', 'Nurofen'],
    drugClass: 'NSAID (Nonsteroidal Anti-inflammatory Drug)',
    category: 'Pain/Inflammation',
    description: 'Anti-inflammatory medication that reduces pain and inflammation',
    usedFor: [
      'Pain relief',
      'Fever reduction',
      'Inflammation',
      'Menstrual cramps',
      'Arthritis',
      'Headaches',
      'Muscle aches'
    ],
    dosageForm: ['Tablet', 'Capsule', 'Liquid gel', 'Oral suspension', 'Topical gel'],
    typicalDosage: '200-800 mg every 4-6 hours as needed (max 3200 mg/day)',
    sideEffects: {
      common: [
        'Stomach upset',
        'Heartburn',
        'Nausea',
        'Dizziness',
        'Mild headache',
        'Rash'
      ],
      serious: [
        'Gastrointestinal bleeding',
        'Ulcers',
        'Kidney problems',
        'Increased risk of heart attack and stroke',
        'Allergic reactions',
        'Liver damage'
      ]
    },
    interactions: {
      drugs: [
        'Aspirin',
        'Blood thinners',
        'Other NSAIDs',
        'Diuretics',
        'ACE inhibitors',
        'Lithium',
        'Methotrexate'
      ],
      conditions: [
        'Heart disease',
        'High blood pressure',
        'Kidney disease',
        'Liver disease',
        'Asthma',
        'Bleeding disorders',
        'Stomach ulcers'
      ]
    },
    precautions: [
      'Take with food to reduce stomach upset',
      'Use lowest effective dose for shortest duration',
      'Increased risk of heart attack and stroke',
      'Not recommended for long-term use without medical supervision'
    ],
    contraindications: [
      'Allergy to NSAIDs',
      'Active peptic ulcer disease',
      'Severe kidney disease',
      'Third trimester of pregnancy'
    ],
    pregnancyCategory: 'C',
    mechanism: 'Inhibits cyclooxygenase (COX) enzymes, reducing prostaglandin synthesis',
    halfLife: '1.8-2 hours',
    requiresPrescription: false
  },
  {
    id: 'acetaminophen',
    name: 'Acetaminophen',
    genericName: 'acetaminophen',
    brandNames: ['Tylenol'],
    drugClass: 'Analgesic/Antipyretic',
    category: 'Pain/Inflammation',
    description: 'Pain reliever and fever reducer',
    usedFor: [
      'Pain relief',
      'Fever reduction',
      'Headaches',
      'Muscle aches',
      'Arthritis',
      'Cold and flu symptoms'
    ],
    dosageForm: ['Tablet', 'Capsule', 'Liquid', 'Suppository'],
    typicalDosage: '325-650 mg every 4-6 hours as needed (max 3000 mg/day)',
    sideEffects: {
      common: [
        'Few side effects when taken as directed'
      ],
      serious: [
        'Liver damage (with overdose or chronic use)',
        'Allergic reactions',
        'Rare blood disorders'
      ]
    },
    interactions: {
      drugs: [
        'Alcohol',
        'Warfarin',
        'Isoniazid',
        'Carbamazepine',
        'Phenytoin'
      ],
      conditions: [
        'Liver disease',
        'Alcohol use disorder'
      ]
    },
    precautions: [
      'Do not exceed recommended dose',
      'Avoid alcohol while taking',
      'Check other medications for acetaminophen to avoid double-dosing',
      'Use caution in liver disease'
    ],
    contraindications: [
      'Severe liver disease',
      'Hypersensitivity to acetaminophen'
    ],
    pregnancyCategory: 'B',
    mechanism: 'Exact mechanism unknown; believed to inhibit prostaglandin synthesis in the central nervous system',
    halfLife: '1.5-3 hours',
    requiresPrescription: false
  },

  // RESPIRATORY MEDICATIONS
  {
    id: 'albuterol',
    name: 'Albuterol',
    genericName: 'albuterol',
    brandNames: ['ProAir', 'Ventolin', 'Proventil'],
    drugClass: 'Short-acting Beta-2 Agonist',
    category: 'Respiratory',
    description: 'Bronchodilator that relaxes muscles in the airways',
    usedFor: [
      'Asthma',
      'COPD (Chronic Obstructive Pulmonary Disease)',
      'Exercise-induced bronchospasm',
      'Bronchitis'
    ],
    dosageForm: ['Inhaler', 'Nebulizer solution', 'Tablet', 'Syrup'],
    typicalDosage: '2 inhalations every 4-6 hours as needed',
    sideEffects: {
      common: [
        'Tremor',
        'Nervousness',
        'Headache',
        'Throat irritation',
        'Rapid heart rate',
        'Muscle cramps'
      ],
      serious: [
        'Severe paradoxical bronchospasm',
        'Cardiovascular effects',
        'Hypokalemia',
        'Seizures',
        'Allergic reactions'
      ]
    },
    interactions: {
      drugs: [
        'Beta-blockers',
        'Diuretics',
        'Digoxin',
        'Other stimulants',
        'MAOIs',
        'Tricyclic antidepressants'
      ],
      conditions: [
        'Heart disease',
        'High blood pressure',
        'Diabetes',
        'Thyroid disorders',
        'Seizure disorders'
      ]
    },
    precautions: [
      'Use only as needed',
      'Increasing use may indicate worsening asthma',
      'Monitor heart rate and blood pressure',
      'May cause paradoxical bronchospasm'
    ],
    contraindications: [
      'Hypersensitivity to albuterol',
      'Severe tachycardia'
    ],
    pregnancyCategory: 'C',
    mechanism: 'Stimulates beta-2 receptors in the lungs, causing bronchodilation',
    halfLife: '5-6 hours',
    requiresPrescription: true
  },

  // GASTROINTESTINAL MEDICATIONS
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    genericName: 'omeprazole',
    brandNames: ['Prilosec', 'Losec'],
    drugClass: 'Proton Pump Inhibitor (PPI)',
    category: 'Gastrointestinal',
    description: 'Reduces stomach acid production',
    usedFor: [
      'Gastroesophageal reflux disease (GERD)',
      'Peptic ulcer disease',
      'Erosive esophagitis',
      'Zollinger-Ellison syndrome',
      'H. pylori infection (as part of combination therapy)'
    ],
    dosageForm: ['Capsule', 'Tablet', 'Powder for suspension'],
    typicalDosage: '20-40 mg once daily',
    sideEffects: {
      common: [
        'Headache',
        'Nausea',
        'Diarrhea',
        'Abdominal pain',
        'Constipation',
        'Flatulence'
      ],
      serious: [
        'Vitamin B12 deficiency',
        'Magnesium deficiency',
        'Increased risk of fractures',
        'Clostridium difficile infection',
        'Kidney disease',
        'Increased risk of pneumonia'
      ]
    },
    interactions: {
      drugs: [
        'Clopidogrel',
        'Diazepam',
        'Phenytoin',
        'Warfarin',
        'Cilostazol',
        'Methotrexate'
      ],
      conditions: [
        'Osteoporosis',
        'Vitamin B12 deficiency',
        'Kidney disease'
      ]
    },
    precautions: [
      'Take before meals',
      'Long-term use may increase risk of fractures',
      'May mask symptoms of gastric cancer',
      'Monitor for vitamin B12 deficiency with long-term use'
    ],
    contraindications: [
      'Hypersensitivity to omeprazole or other PPIs',
      'Concurrent use with rilpivirine'
    ],
    pregnancyCategory: 'C',
    mechanism: 'Inhibits the hydrogen-potassium ATPase enzyme system in gastric parietal cells',
    halfLife: '0.5-1.5 hours',
    requiresPrescription: false
  },

  // ALLERGY MEDICATIONS
  {
    id: 'cetirizine',
    name: 'Cetirizine',
    genericName: 'cetirizine',
    brandNames: ['Zyrtec', 'Reactine'],
    drugClass: 'Second-generation Antihistamine',
    category: 'Allergy',
    description: 'Antihistamine that reduces allergy symptoms',
    usedFor: [
      'Seasonal allergies',
      'Perennial allergies',
      'Hay fever',
      'Hives',
      'Itching'
    ],
    dosageForm: ['Tablet', 'Chewable tablet', 'Oral solution'],
    typicalDosage: '5-10 mg once daily',
    sideEffects: {
      common: [
        'Drowsiness',
        'Dry mouth',
        'Fatigue',
        'Headache',
        'Sore throat'
      ],
      serious: [
        'Allergic reactions',
        'Urinary retention',
        'Vision changes'
      ]
    },
    interactions: {
      drugs: [
        'CNS depressants',
        'Alcohol',
        'Theophylline'
      ],
      conditions: [
        'Liver disease',
        'Kidney disease'
      ]
    },
    precautions: [
      'May cause drowsiness',
      'Use caution when driving or operating machinery',
      'Avoid alcohol'
    ],
    contraindications: [
      'Hypersensitivity to cetirizine',
      'Severe kidney disease'
    ],
    pregnancyCategory: 'B',
    mechanism: 'Blocks H1 histamine receptors, reducing allergic symptoms',
    halfLife: '8-9 hours',
    requiresPrescription: false
  }
];

// Medication categories
export const medicationCategories = [
  'Cardiovascular',
  'Endocrine',
  'Mental Health',
  'Pain/Inflammation',
  'Respiratory',
  'Gastrointestinal',
  'Allergy',
  'Antibiotics',
  'Neurological',
  'Dermatological'
];

// Drug classes
export const drugClasses = [
  'ACE Inhibitor',
  'Statin',
  'Beta Blocker',
  'Biguanide',
  'SSRI',
  'NSAID',
  'Analgesic/Antipyretic',
  'Short-acting Beta-2 Agonist',
  'Proton Pump Inhibitor',
  'Second-generation Antihistamine'
];

// Search and filter functions
export function searchMedications(query: string): Medication[] {
  const lowercaseQuery = query.toLowerCase();
  return medicationsDatabase.filter(medication =>
    medication.name.toLowerCase().includes(lowercaseQuery) ||
    medication.genericName.toLowerCase().includes(lowercaseQuery) ||
    medication.brandNames?.some(brand => brand.toLowerCase().includes(lowercaseQuery)) ||
    medication.drugClass.toLowerCase().includes(lowercaseQuery) ||
    medication.category.toLowerCase().includes(lowercaseQuery) ||
    medication.usedFor.some(use => use.toLowerCase().includes(lowercaseQuery))
  );
}

export function getMedicationsByCategory(category: string): Medication[] {
  return medicationsDatabase.filter(medication => medication.category === category);
}

export function getMedicationsByDrugClass(drugClass: string): Medication[] {
  return medicationsDatabase.filter(medication => medication.drugClass === drugClass);
}

export function getMedicationById(id: string): Medication | undefined {
  return medicationsDatabase.find(medication => medication.id === id);
}

export function getMedicationsByCondition(condition: string): Medication[] {
  return medicationsDatabase.filter(medication =>
    medication.usedFor.some(use => 
      use.toLowerCase().includes(condition.toLowerCase())
    )
  );
}

// Interaction checking
export interface InteractionResult {
  medication1: Medication;
  medication2: Medication;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'None';
  description: string;
  recommendation: string;
}

export function checkMedicationInteractions(
  medicationIds: string[]
): InteractionResult[] {
  const results: InteractionResult[] = [];
  
  // This is a simplified interaction checker
  // In a real application, this would use a comprehensive drug interaction database
  for (let i = 0; i < medicationIds.length; i++) {
    for (let j = i + 1; j < medicationIds.length; j++) {
      const med1 = getMedicationById(medicationIds[i]);
      const med2 = getMedicationById(medicationIds[j]);
      
      if (!med1 || !med2) continue;
      
      // Check if med2 is in med1's interactions list
      const interacts = med1.interactions?.drugs?.some(drug => 
        drug.toLowerCase().includes(med2.genericName.toLowerCase()) ||
        med2.brandNames?.some(brand => drug.toLowerCase().includes(brand.toLowerCase()))
      );
      
      if (interacts) {
        results.push({
          medication1: med1,
          medication2: med2,
          severity: 'Moderate', // Simplified - would be more specific in real app
          description: `Potential interaction between ${med1.name} and ${med2.name}`,
          recommendation: 'Consult with healthcare provider before taking these medications together'
        });
      } else {
        results.push({
          medication1: med1,
          medication2: med2,
          severity: 'None',
          description: 'No known interaction',
          recommendation: 'No special precautions needed'
        });
      }
    }
  }
  
  return results;
}

// Medication adherence helpers
export interface MedicationSchedule {
  medicationId: string;
  dosage: string;
  frequency: 'Once daily' | 'Twice daily' | 'Three times daily' | 'Four times daily' | 'As needed' | 'Weekly' | 'Monthly' | string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime' | 'With meals' | 'Without food' | string;
  duration?: string;
  specialInstructions?: string;
}

export function generateMedicationReminders(
  schedule: MedicationSchedule
): { time: string; instruction: string }[] {
  const reminders: { time: string; instruction: string }[] = [];
  const medication = getMedicationById(schedule.medicationId);
  
  if (!medication) return reminders;
  
  switch (schedule.frequency) {
    case 'Once daily':
      if (schedule.timing === 'Morning') {
        reminders.push({ time: '08:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      } else if (schedule.timing === 'Evening') {
        reminders.push({ time: '18:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      } else if (schedule.timing === 'Bedtime') {
        reminders.push({ time: '22:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      }
      break;
    case 'Twice daily':
      reminders.push({ time: '08:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      reminders.push({ time: '20:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      break;
    case 'Three times daily':
      reminders.push({ time: '08:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      reminders.push({ time: '14:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      reminders.push({ time: '20:00', instruction: `Take ${medication.name} ${schedule.dosage}` });
      break;
    case 'With meals':
      reminders.push({ time: '08:00', instruction: `Take ${medication.name} ${schedule.dosage} with breakfast` });
      reminders.push({ time: '13:00', instruction: `Take ${medication.name} ${schedule.dosage} with lunch` });
      reminders.push({ time: '19:00', instruction: `Take ${medication.name} ${schedule.dosage} with dinner` });
      break;
  }
  
  return reminders;
}