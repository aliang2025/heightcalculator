import jsPDF from 'jspdf';
import { HeightCalculatorData, PredictionResult } from '@/types/height.types';
import { calculateAgeInYears, translateAlgorithmInfo } from './height-calculations';

// PDF文本翻译映射
const pdfTexts = {
  en: {
    title: 'Height Prediction Analysis Report',
    basicInfo: 'Basic Information',
    gender: 'Gender',
    age: 'Age',
    currentHeight: 'Current Height',
    currentWeight: 'Current Weight',
    fatherHeight: 'Father Height',
    motherHeight: 'Mother Height',
    predictionResults: 'Prediction Results',
    predictedAdultHeight: 'Predicted Adult Height',
    predictionRange: 'Prediction Range',
    confidence: 'Confidence',
    currentPercentile: 'Current Height Percentile',
    algorithmComparison: 'Algorithm Comparison',
    bmiAnalysis: 'BMI Analysis',
    currentBMI: 'Current BMI',
    weightStatus: 'Weight Status',
    recommendation: 'Recommendation',
    growthRecommendations: 'Growth Recommendations',
    disclaimer: 'Disclaimer',
    disclaimerText: 'This prediction is for reference only. Actual height is influenced by genetics, nutrition, diseases and other factors. Consult a professional doctor for health concerns.',
    boy: 'Boy',
    girl: 'Girl',
    years: 'years old',
    cm: 'cm',
    kg: 'kg',
    percent: '%',
    percentile: 'th percentile'
  },
  zh: {
    title: '身高预测分析报告',
    basicInfo: '基本信息',
    gender: '性别',
    age: '年龄',
    currentHeight: '当前身高',
    currentWeight: '当前体重',
    fatherHeight: '父亲身高',
    motherHeight: '母亲身高',
    predictionResults: '预测结果',
    predictedAdultHeight: '预测成年身高',
    predictionRange: '预测范围',
    confidence: '置信度',
    currentPercentile: '当前身高百分位',
    algorithmComparison: '算法对比',
    bmiAnalysis: 'BMI分析',
    currentBMI: '当前BMI',
    weightStatus: '体重状态',
    recommendation: '建议',
    growthRecommendations: '成长建议',
    disclaimer: '免责声明',
    disclaimerText: '本预测结果仅供参考，实际身高受遗传、营养、疾病等多种因素影响。如有健康疑问，请咨询专业医生。',
    boy: '男孩',
    girl: '女孩',
    years: '岁',
    cm: '厘米',
    kg: '公斤',
    percent: '%',
    percentile: '百分位'
  }
};

export async function generateHeightReportPDF(
  data: HeightCalculatorData, 
  result: PredictionResult,
  locale: string = 'en'
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // 获取对应语言的文本
  const t = pdfTexts[locale as 'en' | 'zh'] || pdfTexts.en;
  
  const lineHeight = 7;
  let currentY = 20;
  
  // 页面标题
  pdf.setFontSize(20);
  pdf.text(t.title, pageWidth / 2, currentY, { align: 'center' });
  currentY += 15;
  
  // 基本信息
  pdf.setFontSize(14);
  pdf.text(t.basicInfo, 20, currentY);
  currentY += 10;
  
  pdf.setFontSize(10);
  const age = calculateAgeInYears(data.birthDate);
  const basicInfo = [
    `${t.gender}: ${data.gender === 'male' ? t.boy : t.girl}`,
    `${t.age}: ${age} ${t.years}`,
    `${t.currentHeight}: ${data.currentHeight.toFixed(1)}${t.cm}`,
    `${t.currentWeight}: ${data.currentWeight.toFixed(1)}${t.kg}`,
    `${t.fatherHeight}: ${data.fatherHeight.toFixed(1)}${t.cm}`,
    `${t.motherHeight}: ${data.motherHeight.toFixed(1)}${t.cm}`
  ];
  
  basicInfo.forEach(info => {
    pdf.text(info, 20, currentY);
    currentY += lineHeight;
  });
  
  currentY += 10;
  
  // 预测结果
  pdf.setFontSize(14);
  pdf.text(t.predictionResults, 20, currentY);
  currentY += 10;
  
  pdf.setFontSize(12);
  pdf.text(`Predicted Adult Height: ${result.primaryPrediction.toFixed(1)}cm`, 20, currentY);
  currentY += lineHeight;
  
  pdf.setFontSize(10);
  pdf.text(`Prediction Range: ${result.predictionRange[0].toFixed(1)} - ${result.predictionRange[1].toFixed(1)}cm`, 20, currentY);
  currentY += lineHeight;
  
  pdf.text(`Current Height Percentile: ${result.currentPercentile}th percentile`, 20, currentY);
  currentY += lineHeight;
  
  pdf.text(`Prediction Confidence: ${result.confidence}%`, 20, currentY);
  currentY += 15;
  
  // 算法对比
  pdf.setFontSize(14);
  pdf.text('Algorithm Comparison', 20, currentY);
  currentY += 10;
  
  pdf.setFontSize(10);
  result.algorithms.forEach((algorithm, index) => {
    // 翻译算法名称
    const algorithmNameEn = translateAlgorithmName(algorithm.name);
    pdf.text(`${index + 1}. ${algorithmNameEn}`, 20, currentY);
    currentY += lineHeight;
    pdf.text(`   Predicted Height: ${algorithm.predictedHeight.toFixed(1)}cm (Confidence: ${algorithm.confidence}%)`, 25, currentY);
    currentY += lineHeight;
    pdf.text(`   ${translateAlgorithmDescription(algorithm.description)}`, 25, currentY);
    currentY += lineHeight + 3;
  });
  
  currentY += 10;
  
  // BMI分析
  pdf.setFontSize(14);
  pdf.text('Health Status Analysis', 20, currentY);
  currentY += 10;
  
  pdf.setFontSize(10);
  const bmiInfo = [
    `Current BMI: ${result.bmiAnalysis.bmi}`,
    `BMI Category: ${getBMICategoryTextEn(result.bmiAnalysis.category)}`,
    `Recommendation: ${translateBMIRecommendation(result.bmiAnalysis.recommendation)}`
  ];
  
  bmiInfo.forEach(info => {
    pdf.text(info, 20, currentY);
    currentY += lineHeight;
  });
  
  currentY += 15;
  
  // 成长建议
  pdf.setFontSize(14);
  pdf.text('Personalized Growth Recommendations', 20, currentY);
  currentY += 10;
  
  pdf.setFontSize(12);
  pdf.text('Nutrition Recommendations:', 20, currentY);
  currentY += lineHeight;
  
  pdf.setFontSize(10);
  const nutritionTips = [
    '• Ensure adequate protein intake to promote growth and development',
    '• Supplement calcium and vitamin D to strengthen bone health',
    '• Eat more fresh vegetables and fruits for vitamins and minerals',
    '• Control sugar and processed food intake'
  ];
  
  nutritionTips.forEach(tip => {
    pdf.text(tip, 25, currentY);
    currentY += lineHeight;
  });
  
  currentY += 5;
  
  pdf.setFontSize(12);
  pdf.text('Exercise Recommendations:', 20, currentY);
  currentY += lineHeight;
  
  pdf.setFontSize(10);
  const exerciseTips = [
    '• At least 1 hour of moderate-intensity exercise daily',
    '• Do more stretching and jumping exercises like basketball and swimming',
    '• Avoid excessive weight training',
    '• Keep exercise fun and varied'
  ];
  
  exerciseTips.forEach(tip => {
    pdf.text(tip, 25, currentY);
    currentY += lineHeight;
  });
  
  currentY += 5;
  
  pdf.setFontSize(12);
  pdf.text('Sleep Recommendations:', 20, currentY);
  currentY += lineHeight;
  
  pdf.setFontSize(10);
  const sleepHours = age <= 6 ? '10-11 hours' : age <= 12 ? '9-10 hours' : '8-9 hours';
  const sleepTips = [
    `• ${sleepHours} of quality sleep`,
    '• Maintain regular sleep schedule',
    '• Create a good sleep environment',
    '• Avoid electronic devices before bedtime'
  ];
  
  sleepTips.forEach(tip => {
    pdf.text(tip, 25, currentY);
    currentY += lineHeight;
  });
  
  // 检查是否需要新页面
  if (currentY > pageHeight - 30) {
    pdf.addPage();
    currentY = 20;
  }
  
  currentY += 20;
  
  // 免责声明
  pdf.setFontSize(10);
  pdf.text('Disclaimer:', 20, currentY);
  currentY += lineHeight;
  
  const disclaimer = [
    'The height prediction results provided in this report are for reference only',
    'and cannot replace professional medical advice.',
    'Children\'s growth and development are influenced by multiple factors including',
    'genetics, nutrition, exercise, sleep, etc.',
    'If you have questions about child growth and development, please consult',
    'a pediatrician or growth development specialist.',
    'This tool does not collect or store any personal information,',
    'all calculations are completed locally.'
  ];
  
  disclaimer.forEach(text => {
    pdf.text(text, 20, currentY);
    currentY += lineHeight;
  });
  
  // 页脚
  pdf.setFontSize(8);
  pdf.text(`Generated: ${new Date().toLocaleString('en-US')}`, 20, pageHeight - 10);
  pdf.text('Height Calculator - Free Online Height Prediction Tool', pageWidth - 20, pageHeight - 10, { align: 'right' });
  
  // 下载PDF
  pdf.save(`Height_Prediction_Report_${data.gender === 'male' ? 'Boy' : 'Girl'}_${age}years_${new Date().toLocaleDateString('en-US').replace(/\//g, '-')}.pdf`);
}

// 翻译算法名称
function translateAlgorithmName(name: string): string {
  const translations: { [key: string]: string } = {
    'Khamis-Roche 改良法': 'Modified Khamis-Roche Method',
    '中位父母身高法': 'Mid-Parental Height Method',
    '百分位追踪法': 'Percentile Tracking Method'
  };
  return translations[name] || name;
}

// 翻译算法描述
function translateAlgorithmDescription(description: string): string {
  const translations: { [key: string]: string } = {
    '基于父母身高、当前身高和年龄的综合预测模型，适用于2-18岁儿童。': 'Comprehensive prediction model based on parental height, current height and age, suitable for children aged 2-18.',
    '基于父母身高的简化预测方法，遗传因素占主导。': 'Simplified prediction method based on parental height, with genetic factors being dominant.',
    '假设儿童保持当前身高百分位直至成年的预测方法。': 'Prediction method assuming children maintain their current height percentile until adulthood.'
  };
  return translations[description] || description;
}

// 英文BMI分类
function getBMICategoryTextEn(category: string): string {
  const categories: { [key: string]: string } = {
    'underweight': 'Underweight',
    'normal': 'Normal',
    'overweight': 'Overweight',
    'obese': 'Obese'
  };
  return categories[category] || 'Normal';
}

// 翻译BMI建议
function translateBMIRecommendation(recommendation: string): string {
  const translations: { [key: string]: string } = {
    '体重偏轻，建议增加营养摄入，咨询儿科医生。': 'Weight is light, recommend increasing nutritional intake and consulting a pediatrician.',
    '体重正常，保持均衡饮食和适量运动。': 'Weight is normal, maintain a balanced diet and moderate exercise.',
    '体重偏重，建议控制饮食，增加体育锻炼。': 'Weight is heavy, recommend controlling diet and increasing physical exercise.',
    '体重过重，建议咨询医生制定健康的减重计划。': 'Weight is excessive, recommend consulting a doctor to develop a healthy weight loss plan.'
  };
  return translations[recommendation] || recommendation;
}

function getBMICategoryText(category: string): string {
  const categories: { [key: string]: string } = {
    'underweight': '偏瘦',
    'normal': '正常',
    'overweight': '偏重',
    'obese': '肥胖'
  };
  return categories[category] || '正常';
}
