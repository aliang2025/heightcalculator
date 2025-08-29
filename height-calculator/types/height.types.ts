export type Gender = 'male' | 'female';
export type Unit = 'metric' | 'imperial';

export interface HeightCalculatorData {
  gender: Gender;
  birthDate: Date;
  currentHeight: number;
  currentWeight: number;
  fatherHeight: number;
  motherHeight: number;
  unit: Unit;
}

export interface AlgorithmResult {
  name: string;
  predictedHeight: number;
  confidence: number;
  description: string;
}

export interface PredictionResult {
  primaryPrediction: number;
  predictionRange: [number, number];
  currentPercentile: number;
  confidence: number;
  algorithms: AlgorithmResult[];
  bmiAnalysis: BMIAnalysis;
  growthStage: GrowthStage;
}

export interface BMIAnalysis {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  percentile: number;
  recommendation: string;
}

export interface GrowthStage {
  stage: 'infant' | 'toddler' | 'preschool' | 'school-age' | 'adolescent' | 'adult';
  description: string;
  expectedGrowthRate: number; // cm per year
  keyFactors: string[];
}

export interface GrowthChartData {
  age: number;
  height: number;
  percentile?: number;
  predicted?: boolean;
}

export interface NutritionRecommendation {
  category: string;
  recommendations: string[];
  foods: string[];
}

export interface LifestyleRecommendation {
  exercise: string[];
  sleep: {
    hours: number;
    tips: string[];
  };
  nutrition: NutritionRecommendation[];
  lifestyle: string[];
}

export interface HeightReport {
  personalInfo: HeightCalculatorData;
  predictions: PredictionResult;
  recommendations: LifestyleRecommendation;
  chartData: GrowthChartData[];
  generatedAt: Date;
}

// 标准生长数据接口
export interface GrowthStandard {
  age: number; // 月龄
  male: {
    p3: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97: number;
  };
  female: {
    p3: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97: number;
  };
}

// 表单验证错误
export interface ValidationError {
  field: string;
  message: string;
}

// 计算配置
export interface CalculationConfig {
  algorithms: ('khamis-roche' | 'mid-parental' | 'percentile-tracking')[];
  includeGrowthChart: boolean;
  includeBMI: boolean;
  includeRecommendations: boolean;
}
