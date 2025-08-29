import type { 
  HeightCalculatorData, 
  PredictionResult, 
  AlgorithmResult, 
  BMIAnalysis,
  GrowthStage,
  GrowthStandard 
} from '@/types/height.types';

/**
 * 翻译算法名称和描述的辅助函数
 * 这些翻译将在前端通过国际化系统覆盖
 */
export function translateAlgorithmInfo(name: string, description: string, locale?: string) {
  // 算法名称翻译
  const nameTranslations: { [key: string]: { en: string; zh: string } } = {
    'Khamis-Roche 改良法': {
      en: 'Modified Khamis-Roche Method',
      zh: 'Khamis-Roche 改良法'
    },
    '中位父母身高法': {
      en: 'Mid-Parental Height Method',
      zh: '中位父母身高法'
    },
    '百分位追踪法': {
      en: 'Percentile Tracking Method',
      zh: '百分位追踪法'
    }
  };

  // 描述翻译
  const descriptionTranslations: { [key: string]: { en: string; zh: string } } = {
    '基于父母身高、当前身高和年龄的综合预测模型，适用于2-18岁儿童。': {
      en: 'Comprehensive prediction model based on parental height, current height, and age, suitable for children aged 2-18.',
      zh: '基于父母身高、当前身高和年龄的综合预测模型，适用于2-18岁儿童。'
    },
    '基于父母身高的简化预测方法，遗传因素占主导。': {
      en: 'Simplified prediction method based on parental height, with genetic factors being dominant.',
      zh: '基于父母身高的简化预测方法，遗传因素占主导。'
    },
    '假设儿童保持当前身高百分位直至成年的预测方法。': {
      en: 'Prediction method assuming children maintain their current height percentile until adulthood.',
      zh: '假设儿童保持当前身高百分位直至成年的预测方法。'
    }
  };

  const targetLocale = locale || 'zh';
  const translatedName = nameTranslations[name]?.[targetLocale as 'en' | 'zh'] || name;
  const translatedDescription = descriptionTranslations[description]?.[targetLocale as 'en' | 'zh'] || description;

  return { name: translatedName, description: translatedDescription };
}

/**
 * 翻译BMI建议的辅助函数
 */
export function translateBMIRecommendation(recommendation: string, locale?: string) {
  const translations: { [key: string]: { en: string; zh: string } } = {
    '体重偏轻，建议增加营养摄入，咨询儿科医生。': {
      en: 'Underweight, recommend increasing nutritional intake and consulting a pediatrician.',
      zh: '体重偏轻，建议增加营养摄入，咨询儿科医生。'
    },
    '体重正常，保持均衡饮食和适量运动。': {
      en: 'Normal weight, maintain balanced diet and moderate exercise.',
      zh: '体重正常，保持均衡饮食和适量运动。'
    },
    '体重偏重，建议控制饮食，增加体育锻炼。': {
      en: 'Overweight, recommend controlling diet and increasing physical exercise.',
      zh: '体重偏重，建议控制饮食，增加体育锻炼。'
    },
    '体重过重，建议咨询医生制定健康的减重计划。': {
      en: 'Obese, recommend consulting a doctor to develop a healthy weight loss plan.',
      zh: '体重过重，建议咨询医生制定健康的减重计划。'
    }
  };

  const targetLocale = locale || 'zh';
  return translations[recommendation]?.[targetLocale as 'en' | 'zh'] || recommendation;
}

// WHO 标准身高数据 (简化版本，实际应用中需要完整数据)
const WHO_HEIGHT_STANDARDS: GrowthStandard[] = [
  // 0-18岁的标准身高数据 (按月龄)
  { age: 0, male: { p3: 46.1, p10: 47.5, p25: 49.0, p50: 50.4, p75: 51.8, p90: 53.2, p97: 54.7 }, female: { p3: 45.4, p10: 46.8, p25: 48.2, p50: 49.6, p75: 51.0, p90: 52.4, p97: 53.9 } },
  { age: 12, male: { p3: 71.0, p10: 72.8, p25: 74.7, p50: 76.6, p75: 78.5, p90: 80.4, p97: 82.3 }, female: { p3: 69.8, p10: 71.6, p25: 73.5, p50: 75.4, p75: 77.3, p90: 79.2, p97: 81.1 } },
  { age: 24, male: { p3: 82.3, p10: 84.4, p25: 86.6, p50: 88.8, p75: 91.0, p90: 93.2, p97: 95.4 }, female: { p3: 81.2, p10: 83.3, p25: 85.5, p50: 87.7, p75: 89.9, p90: 92.1, p97: 94.3 } },
  { age: 36, male: { p3: 90.3, p10: 92.6, p25: 95.0, p50: 97.4, p75: 99.8, p90: 102.2, p97: 104.6 }, female: { p3: 89.0, p10: 91.4, p25: 93.8, p50: 96.2, p75: 98.6, p90: 101.0, p97: 103.4 } },
  { age: 60, male: { p3: 103.2, p10: 106.0, p25: 108.9, p50: 111.8, p75: 114.7, p90: 117.6, p97: 120.5 }, female: { p3: 102.0, p10: 104.8, p25: 107.7, p50: 110.6, p75: 113.5, p90: 116.4, p97: 119.3 } },
  { age: 120, male: { p3: 133.5, p10: 137.2, p25: 141.0, p50: 144.8, p75: 148.6, p90: 152.4, p97: 156.2 }, female: { p3: 133.2, p10: 136.9, p25: 140.7, p50: 144.5, p75: 148.3, p90: 152.1, p97: 155.9 } },
  { age: 180, male: { p3: 157.2, p10: 162.0, p25: 166.8, p50: 171.6, p75: 176.4, p90: 181.2, p97: 186.0 }, female: { p3: 150.7, p10: 154.7, p25: 158.7, p50: 162.7, p75: 166.7, p90: 170.7, p97: 174.7 } },
  { age: 216, male: { p3: 162.1, p10: 167.6, p25: 173.1, p50: 178.6, p75: 184.1, p90: 189.6, p97: 195.1 }, female: { p3: 151.2, p10: 155.4, p25: 159.6, p50: 163.8, p75: 168.0, p90: 172.2, p97: 176.4 } }
];

/**
 * 计算年龄（月龄）
 */
export function calculateAgeInMonths(birthDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - birthDate.getTime();
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // 平均每月天数
  return Math.round(diffMonths);
}

/**
 * 计算年龄（年）
 */
export function calculateAgeInYears(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * 单位转换
 */
export function convertHeight(height: number, from: 'metric' | 'imperial', to: 'metric' | 'imperial'): number {
  if (from === to) return height;
  
  if (from === 'imperial' && to === 'metric') {
    return height * 2.54; // inches to cm
  } else if (from === 'metric' && to === 'imperial') {
    return height / 2.54; // cm to inches
  }
  
  return height;
}

/**
 * 体重单位转换函数
 * @param weight 体重数值
 * @param from 源单位
 * @param to 目标单位
 * @returns 转换后的体重数值，保留一位小数
 */
export function convertWeight(weight: number, from: 'metric' | 'imperial', to: 'metric' | 'imperial'): number {
  if (from === to) return weight;
  
  if (from === 'imperial' && to === 'metric') {
    return Math.round((weight / 2.20462) * 10) / 10; // lbs to kg
  } else if (from === 'metric' && to === 'imperial') {
    return Math.round((weight * 2.20462) * 10) / 10; // kg to lbs
  }
  
  return weight;
}

/**
 * 查找最接近的标准数据
 */
function findClosestStandard(ageMonths: number): GrowthStandard {
  const closest = WHO_HEIGHT_STANDARDS.reduce((prev, curr) => {
    return Math.abs(curr.age - ageMonths) < Math.abs(prev.age - ageMonths) ? curr : prev;
  });
  
  return closest;
}

/**
 * 计算身高百分位
 */
export function calculateHeightPercentile(height: number, ageMonths: number, gender: 'male' | 'female'): number {
  const standard = findClosestStandard(ageMonths);
  const percentiles = standard[gender];
  
  if (height <= percentiles.p3) return 3;
  if (height <= percentiles.p10) return 10;
  if (height <= percentiles.p25) return 25;
  if (height <= percentiles.p50) return 50;
  if (height <= percentiles.p75) return 75;
  if (height <= percentiles.p90) return 90;
  if (height <= percentiles.p97) return 97;
  
  return 97; // 超过97百分位
}

/**
 * Khamis-Roche 身高预测算法
 */
function khamisRocheMethod(data: HeightCalculatorData): AlgorithmResult {
  const { gender, currentHeight, fatherHeight, motherHeight } = data;
  const ageYears = calculateAgeInYears(data.birthDate);
  
  // 中位父母身高计算
  const midParentalHeight = gender === 'male' 
    ? (fatherHeight + motherHeight + 13) / 2
    : (fatherHeight + motherHeight - 13) / 2;
  
  // 年龄修正系数
  let ageCorrection = 1;
  if (ageYears < 4) ageCorrection = 0.4;
  else if (ageYears < 8) ageCorrection = 0.6;
  else if (ageYears < 12) ageCorrection = 0.7;
  else if (ageYears < 16) ageCorrection = 0.8;
  else ageCorrection = 0.9;
  
  // 当前身高百分位影响
  const ageMonths = calculateAgeInMonths(data.birthDate);
  const currentPercentile = calculateHeightPercentile(currentHeight, ageMonths, gender);
  const percentileAdjustment = (currentPercentile - 50) * 0.1;
  
  // 最终预测
  const prediction = midParentalHeight * 0.6 + currentHeight * ageCorrection + percentileAdjustment;
  
  // 置信度计算
  let confidence = 85;
  if (ageYears >= 2 && ageYears <= 16) confidence = 90;
  if (ageYears >= 4 && ageYears <= 14) confidence = 95;
  
  return {
    name: 'Khamis-Roche 改良法',
    predictedHeight: Math.round(prediction * 10) / 10,
    confidence,
    description: '基于父母身高、当前身高和年龄的综合预测模型，适用于2-18岁儿童。'
  };
}

/**
 * 中位父母身高法
 */
function midParentalMethod(data: HeightCalculatorData): AlgorithmResult {
  const { gender, fatherHeight, motherHeight } = data;
  
  const prediction = gender === 'male' 
    ? (fatherHeight + motherHeight + 13) / 2
    : (fatherHeight + motherHeight - 13) / 2;
  
  return {
    name: '中位父母身高法',
    predictedHeight: Math.round(prediction * 10) / 10,
    confidence: 75,
    description: '基于父母身高的简化预测方法，遗传因素占主导。'
  };
}

/**
 * 百分位追踪法
 */
function percentileTrackingMethod(data: HeightCalculatorData): AlgorithmResult {
  const { gender, currentHeight } = data;
  const ageMonths = calculateAgeInMonths(data.birthDate);
  const currentPercentile = calculateHeightPercentile(currentHeight, ageMonths, gender);
  
  // 假设保持当前百分位到成年
  const adultStandard = WHO_HEIGHT_STANDARDS[WHO_HEIGHT_STANDARDS.length - 1];
  const adultPercentiles = adultStandard[gender];
  
  let prediction = adultPercentiles.p50; // 默认50百分位
  
  if (currentPercentile <= 10) prediction = adultPercentiles.p10;
  else if (currentPercentile <= 25) prediction = adultPercentiles.p25;
  else if (currentPercentile <= 50) prediction = adultPercentiles.p50;
  else if (currentPercentile <= 75) prediction = adultPercentiles.p75;
  else if (currentPercentile <= 90) prediction = adultPercentiles.p90;
  else prediction = adultPercentiles.p97;
  
  return {
    name: '百分位追踪法',
    predictedHeight: Math.round(prediction * 10) / 10,
    confidence: 80,
    description: '假设儿童保持当前身高百分位直至成年的预测方法。'
  };
}

/**
 * 计算 BMI 分析
 */
export function calculateBMI(height: number, weight: number, ageMonths: number, gender: 'male' | 'female'): BMIAnalysis {
  const heightM = height / 100; // 转换为米
  const bmi = weight / (heightM * heightM);
  
  // 简化的BMI分类（实际应用中应该使用年龄性别特定的BMI百分位）
  let category: BMIAnalysis['category'];
  let recommendation: string;
  
  if (bmi < 16) {
    category = 'underweight';
    recommendation = '体重偏轻，建议增加营养摄入，咨询儿科医生。';
  } else if (bmi < 25) {
    category = 'normal';
    recommendation = '体重正常，保持均衡饮食和适量运动。';
  } else if (bmi < 30) {
    category = 'overweight';
    recommendation = '体重偏重，建议控制饮食，增加体育锻炼。';
  } else {
    category = 'obese';
    recommendation = '体重过重，建议咨询医生制定健康的减重计划。';
  }
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    percentile: 50, // 简化处理
    recommendation
  };
}

/**
 * 确定成长阶段
 */
export function determineGrowthStage(ageMonths: number): GrowthStage {
  const ageYears = ageMonths / 12;
  
  if (ageYears < 1) {
    return {
      stage: 'infant',
      description: '婴儿期 (0-1岁)',
      expectedGrowthRate: 25,
      keyFactors: ['充足睡眠', '母乳喂养', '定期体检']
    };
  } else if (ageYears < 3) {
    return {
      stage: 'toddler',
      description: '幼儿期 (1-3岁)',
      expectedGrowthRate: 12,
      keyFactors: ['均衡营养', '户外活动', '规律作息']
    };
  } else if (ageYears < 6) {
    return {
      stage: 'preschool',
      description: '学龄前期 (3-6岁)',
      expectedGrowthRate: 7,
      keyFactors: ['多样化饮食', '体育锻炼', '充足睡眠']
    };
  } else if (ageYears < 12) {
    return {
      stage: 'school-age',
      description: '学龄期 (6-12岁)',
      expectedGrowthRate: 6,
      keyFactors: ['营养均衡', '体育运动', '学习与休息平衡']
    };
  } else if (ageYears < 18) {
    return {
      stage: 'adolescent',
      description: '青春期 (12-18岁)',
      expectedGrowthRate: 8,
      keyFactors: ['充足蛋白质', '力量训练', '心理健康']
    };
  } else {
    return {
      stage: 'adult',
      description: '成年期 (18岁+)',
      expectedGrowthRate: 0,
      keyFactors: ['保持健康', '定期检查', '良好习惯']
    };
  }
}

/**
 * 主预测函数
 */
export function calculateHeightPrediction(data: HeightCalculatorData): PredictionResult {
  const ageMonths = calculateAgeInMonths(data.birthDate);
  
  // 运行多种算法
  const algorithms = [
    khamisRocheMethod(data),
    midParentalMethod(data),
    percentileTrackingMethod(data)
  ];
  
  // 主预测结果（使用Khamis-Roche作为主算法）
  const primaryPrediction = algorithms[0].predictedHeight;
  
  // 预测范围（所有算法结果的范围）
  const predictions = algorithms.map(a => a.predictedHeight);
  const predictionRange: [number, number] = [
    Math.min(...predictions),
    Math.max(...predictions)
  ];
  
  // 当前百分位
  const currentPercentile = calculateHeightPercentile(data.currentHeight, ageMonths, data.gender);
  
  // BMI分析
  const bmiAnalysis = calculateBMI(data.currentHeight, data.currentWeight, ageMonths, data.gender);
  
  // 成长阶段
  const growthStage = determineGrowthStage(ageMonths);
  
  // 整体置信度
  const confidence = algorithms[0].confidence;
  
  return {
    primaryPrediction,
    predictionRange,
    currentPercentile,
    confidence,
    algorithms,
    bmiAnalysis,
    growthStage
  };
}
