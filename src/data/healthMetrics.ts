// Comprehensive health metrics and reference ranges
export interface HealthMetric {
  id: string;
  name: string;
  category: string;
  unit: string;
  description: string;
  normalRanges: {
    male?: { min: number; max: number; ageRange?: string };
    female?: { min: number; max: number; ageRange?: string };
    general?: { min: number; max: number; ageRange?: string };
  };
  riskLevels: {
    low: { min: number; max: number };
    moderate: { min: number; max: number };
    high: { min: number; max: number };
  };
  factors?: string[];
  recommendations?: string[];
}

export const healthMetrics: HealthMetric[] = [
  // CARDIOVASCULAR METRICS
  {
    id: 'blood-pressure-systolic',
    name: 'Systolic Blood Pressure',
    category: 'Cardiovascular',
    unit: 'mmHg',
    description: 'Pressure in arteries when heart beats',
    normalRanges: {
      general: { min: 90, max: 120 }
    },
    riskLevels: {
      low: { min: 90, max: 120 },
      moderate: { min: 121, max: 139 },
      high: { min: 140, max: 200 }
    },
    factors: ['Age', 'Weight', 'Exercise', 'Stress', 'Diet', 'Smoking'],
    recommendations: [
      'Maintain healthy weight',
      'Exercise regularly',
      'Limit sodium intake',
      'Manage stress',
      'Avoid smoking'
    ]
  },
  {
    id: 'blood-pressure-diastolic',
    name: 'Diastolic Blood Pressure',
    category: 'Cardiovascular',
    unit: 'mmHg',
    description: 'Pressure in arteries when heart rests',
    normalRanges: {
      general: { min: 60, max: 80 }
    },
    riskLevels: {
      low: { min: 60, max: 80 },
      moderate: { min: 81, max: 89 },
      high: { min: 90, max: 120 }
    }
  },
  {
    id: 'resting-heart-rate',
    name: 'Resting Heart Rate',
    category: 'Cardiovascular',
    unit: 'bpm',
    description: 'Heart rate when at complete rest',
    normalRanges: {
      general: { min: 60, max: 100 }
    },
    riskLevels: {
      low: { min: 60, max: 100 },
      moderate: { min: 101, max: 110 },
      high: { min: 111, max: 150 }
    },
    factors: ['Fitness level', 'Age', 'Medications', 'Stress', 'Caffeine'],
    recommendations: [
      'Regular cardiovascular exercise',
      'Manage stress levels',
      'Limit caffeine intake',
      'Get adequate sleep'
    ]
  },
  {
    id: 'vo2-max',
    name: 'VO2 Max',
    category: 'Cardiovascular',
    unit: 'ml/kg/min',
    description: 'Maximum oxygen consumption during exercise',
    normalRanges: {
      male: { min: 40, max: 60, ageRange: '20-40' },
      female: { min: 35, max: 55, ageRange: '20-40' }
    },
    riskLevels: {
      low: { min: 45, max: 70 },
      moderate: { min: 35, max: 44 },
      high: { min: 20, max: 34 }
    }
  },

  // METABOLIC METRICS
  {
    id: 'bmi',
    name: 'Body Mass Index',
    category: 'Body Composition',
    unit: 'kg/m²',
    description: 'Weight relative to height',
    normalRanges: {
      general: { min: 18.5, max: 24.9 }
    },
    riskLevels: {
      low: { min: 18.5, max: 24.9 },
      moderate: { min: 25, max: 29.9 },
      high: { min: 30, max: 50 }
    },
    factors: ['Diet', 'Exercise', 'Genetics', 'Age', 'Muscle mass'],
    recommendations: [
      'Maintain balanced diet',
      'Regular physical activity',
      'Monitor portion sizes',
      'Focus on whole foods'
    ]
  },
  {
    id: 'body-fat-percentage',
    name: 'Body Fat Percentage',
    category: 'Body Composition',
    unit: '%',
    description: 'Percentage of body weight that is fat',
    normalRanges: {
      male: { min: 10, max: 20 },
      female: { min: 16, max: 25 }
    },
    riskLevels: {
      low: { min: 10, max: 25 },
      moderate: { min: 26, max: 35 },
      high: { min: 36, max: 50 }
    }
  },
  {
    id: 'waist-circumference',
    name: 'Waist Circumference',
    category: 'Body Composition',
    unit: 'cm',
    description: 'Measurement around the waist',
    normalRanges: {
      male: { min: 70, max: 94 },
      female: { min: 65, max: 80 }
    },
    riskLevels: {
      low: { min: 65, max: 94 },
      moderate: { min: 95, max: 102 },
      high: { min: 103, max: 150 }
    }
  },

  // BLOOD CHEMISTRY
  {
    id: 'total-cholesterol',
    name: 'Total Cholesterol',
    category: 'Blood Chemistry',
    unit: 'mg/dL',
    description: 'Total amount of cholesterol in blood',
    normalRanges: {
      general: { min: 125, max: 200 }
    },
    riskLevels: {
      low: { min: 125, max: 200 },
      moderate: { min: 201, max: 239 },
      high: { min: 240, max: 400 }
    },
    factors: ['Diet', 'Exercise', 'Genetics', 'Weight', 'Age'],
    recommendations: [
      'Limit saturated fats',
      'Increase fiber intake',
      'Regular exercise',
      'Maintain healthy weight'
    ]
  },
  {
    id: 'ldl-cholesterol',
    name: 'LDL Cholesterol',
    category: 'Blood Chemistry',
    unit: 'mg/dL',
    description: 'Low-density lipoprotein (bad cholesterol)',
    normalRanges: {
      general: { min: 50, max: 100 }
    },
    riskLevels: {
      low: { min: 50, max: 100 },
      moderate: { min: 101, max: 159 },
      high: { min: 160, max: 300 }
    }
  },
  {
    id: 'hdl-cholesterol',
    name: 'HDL Cholesterol',
    category: 'Blood Chemistry',
    unit: 'mg/dL',
    description: 'High-density lipoprotein (good cholesterol)',
    normalRanges: {
      male: { min: 40, max: 100 },
      female: { min: 50, max: 100 }
    },
    riskLevels: {
      low: { min: 60, max: 100 },
      moderate: { min: 40, max: 59 },
      high: { min: 20, max: 39 }
    }
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    category: 'Blood Chemistry',
    unit: 'mg/dL',
    description: 'Type of fat found in blood',
    normalRanges: {
      general: { min: 50, max: 150 }
    },
    riskLevels: {
      low: { min: 50, max: 150 },
      moderate: { min: 151, max: 199 },
      high: { min: 200, max: 500 }
    }
  },
  {
    id: 'blood-glucose-fasting',
    name: 'Fasting Blood Glucose',
    category: 'Blood Chemistry',
    unit: 'mg/dL',
    description: 'Blood sugar level after 8+ hours fasting',
    normalRanges: {
      general: { min: 70, max: 99 }
    },
    riskLevels: {
      low: { min: 70, max: 99 },
      moderate: { min: 100, max: 125 },
      high: { min: 126, max: 300 }
    },
    factors: ['Diet', 'Exercise', 'Weight', 'Stress', 'Sleep'],
    recommendations: [
      'Limit refined sugars',
      'Regular physical activity',
      'Maintain healthy weight',
      'Monitor carbohydrate intake'
    ]
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    category: 'Blood Chemistry',
    unit: '%',
    description: 'Average blood sugar over 2-3 months',
    normalRanges: {
      general: { min: 4.0, max: 5.6 }
    },
    riskLevels: {
      low: { min: 4.0, max: 5.6 },
      moderate: { min: 5.7, max: 6.4 },
      high: { min: 6.5, max: 12.0 }
    }
  },

  // COMPLETE BLOOD COUNT
  {
    id: 'hemoglobin',
    name: 'Hemoglobin',
    category: 'Blood Count',
    unit: 'g/dL',
    description: 'Protein that carries oxygen in red blood cells',
    normalRanges: {
      male: { min: 13.8, max: 17.2 },
      female: { min: 12.1, max: 15.1 }
    },
    riskLevels: {
      low: { min: 12, max: 17 },
      moderate: { min: 10, max: 11.9 },
      high: { min: 6, max: 9.9 }
    }
  },
  {
    id: 'white-blood-cells',
    name: 'White Blood Cells',
    category: 'Blood Count',
    unit: '10³/μL',
    description: 'Cells that fight infection',
    normalRanges: {
      general: { min: 4.5, max: 11.0 }
    },
    riskLevels: {
      low: { min: 4.5, max: 11.0 },
      moderate: { min: 11.1, max: 15.0 },
      high: { min: 15.1, max: 30.0 }
    }
  },

  // LIVER FUNCTION
  {
    id: 'alt',
    name: 'ALT (Alanine Aminotransferase)',
    category: 'Liver Function',
    unit: 'U/L',
    description: 'Enzyme that indicates liver health',
    normalRanges: {
      male: { min: 10, max: 40 },
      female: { min: 7, max: 35 }
    },
    riskLevels: {
      low: { min: 7, max: 40 },
      moderate: { min: 41, max: 80 },
      high: { min: 81, max: 200 }
    }
  },

  // KIDNEY FUNCTION
  {
    id: 'creatinine',
    name: 'Creatinine',
    category: 'Kidney Function',
    unit: 'mg/dL',
    description: 'Waste product filtered by kidneys',
    normalRanges: {
      male: { min: 0.7, max: 1.3 },
      female: { min: 0.6, max: 1.1 }
    },
    riskLevels: {
      low: { min: 0.6, max: 1.3 },
      moderate: { min: 1.4, max: 2.0 },
      high: { min: 2.1, max: 10.0 }
    }
  },

  // THYROID FUNCTION
  {
    id: 'tsh',
    name: 'TSH (Thyroid Stimulating Hormone)',
    category: 'Thyroid Function',
    unit: 'mIU/L',
    description: 'Hormone that regulates thyroid function',
    normalRanges: {
      general: { min: 0.4, max: 4.0 }
    },
    riskLevels: {
      low: { min: 0.4, max: 4.0 },
      moderate: { min: 4.1, max: 10.0 },
      high: { min: 10.1, max: 50.0 }
    }
  },

  // VITAMINS & MINERALS
  {
    id: 'vitamin-d',
    name: 'Vitamin D',
    category: 'Vitamins',
    unit: 'ng/mL',
    description: 'Vitamin essential for bone health',
    normalRanges: {
      general: { min: 30, max: 100 }
    },
    riskLevels: {
      low: { min: 30, max: 100 },
      moderate: { min: 20, max: 29 },
      high: { min: 0, max: 19 }
    },
    factors: ['Sun exposure', 'Diet', 'Supplements', 'Skin color', 'Geographic location'],
    recommendations: [
      'Get adequate sun exposure',
      'Consider vitamin D supplements',
      'Eat vitamin D rich foods',
      'Regular testing'
    ]
  },
  {
    id: 'vitamin-b12',
    name: 'Vitamin B12',
    category: 'Vitamins',
    unit: 'pg/mL',
    description: 'Vitamin essential for nerve function',
    normalRanges: {
      general: { min: 300, max: 900 }
    },
    riskLevels: {
      low: { min: 300, max: 900 },
      moderate: { min: 200, max: 299 },
      high: { min: 0, max: 199 }
    }
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'Minerals',
    unit: 'μg/dL',
    description: 'Mineral essential for oxygen transport',
    normalRanges: {
      male: { min: 65, max: 175 },
      female: { min: 50, max: 170 }
    },
    riskLevels: {
      low: { min: 50, max: 175 },
      moderate: { min: 30, max: 49 },
      high: { min: 0, max: 29 }
    }
  }
];

// Health metric categories
export const healthCategories = [
  'Cardiovascular',
  'Body Composition',
  'Blood Chemistry',
  'Blood Count',
  'Liver Function',
  'Kidney Function',
  'Thyroid Function',
  'Vitamins',
  'Minerals'
];

// Risk assessment functions
export function assessRiskLevel(
  metricId: string,
  value: number,
  gender?: 'male' | 'female'
): 'low' | 'moderate' | 'high' | 'unknown' {
  const metric = healthMetrics.find(m => m.id === metricId);
  if (!metric) return 'unknown';

  const { low, moderate, high } = metric.riskLevels;

  if (value >= low.min && value <= low.max) return 'low';
  if (value >= moderate.min && value <= moderate.max) return 'moderate';
  if (value >= high.min && value <= high.max) return 'high';

  return 'unknown';
}

export function isInNormalRange(
  metricId: string,
  value: number,
  gender?: 'male' | 'female'
): boolean {
  const metric = healthMetrics.find(m => m.id === metricId);
  if (!metric) return false;

  let range = metric.normalRanges.general;
  
  if (gender && metric.normalRanges[gender]) {
    range = metric.normalRanges[gender];
  }

  if (!range) return false;

  return value >= range.min && value <= range.max;
}

export function getMetricRecommendations(metricId: string): string[] {
  const metric = healthMetrics.find(m => m.id === metricId);
  return metric?.recommendations || [];
}

export function getMetricsByCategory(category: string): HealthMetric[] {
  return healthMetrics.filter(metric => metric.category === category);
}

// Health score calculation
export function calculateHealthScore(
  metrics: Array<{ metricId: string; value: number; weight?: number }>,
  gender?: 'male' | 'female'
): number {
  if (metrics.length === 0) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  metrics.forEach(({ metricId, value, weight = 1 }) => {
    const riskLevel = assessRiskLevel(metricId, value, gender);
    let score = 0;

    switch (riskLevel) {
      case 'low': score = 100; break;
      case 'moderate': score = 60; break;
      case 'high': score = 20; break;
      default: score = 50; break;
    }

    totalScore += score * weight;
    totalWeight += weight;
  });

  return Math.round(totalScore / totalWeight);
}

// Trend analysis
export interface HealthTrend {
  metricId: string;
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
  recommendation: string;
}

export function analyzeHealthTrends(
  historicalData: Array<{
    metricId: string;
    values: Array<{ value: number; date: Date }>;
  }>,
  timeframeDays: number = 30
): HealthTrend[] {
  return historicalData.map(({ metricId, values }) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);
    
    const recentValues = values
      .filter(v => v.date >= cutoffDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (recentValues.length < 2) {
      return {
        metricId,
        trend: 'stable',
        changePercent: 0,
        recommendation: 'Need more data points for trend analysis'
      };
    }

    const firstValue = recentValues[0].value;
    const lastValue = recentValues[recentValues.length - 1].value;
    const changePercent = ((lastValue - firstValue) / firstValue) * 100;

    let trend: 'improving' | 'stable' | 'declining';
    let recommendation: string;

    const metric = healthMetrics.find(m => m.id === metricId);
    const isLowerBetter = ['blood-pressure-systolic', 'blood-pressure-diastolic', 'total-cholesterol', 'ldl-cholesterol', 'triglycerides', 'blood-glucose-fasting', 'hba1c'].includes(metricId);

    if (Math.abs(changePercent) < 5) {
      trend = 'stable';
      recommendation = 'Maintain current lifestyle habits';
    } else if (changePercent > 0) {
      trend = isLowerBetter ? 'declining' : 'improving';
      recommendation = isLowerBetter ? 
        'Consider lifestyle modifications to improve this metric' :
        'Great progress! Continue current healthy habits';
    } else {
      trend = isLowerBetter ? 'improving' : 'declining';
      recommendation = isLowerBetter ?
        'Excellent improvement! Keep up the good work' :
        'Focus on improving this metric through targeted interventions';
    }

    return {
      metricId,
      trend,
      changePercent: Math.abs(changePercent),
      recommendation
    };
  });
}