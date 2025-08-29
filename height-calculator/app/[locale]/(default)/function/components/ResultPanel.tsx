'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeightCalculatorData, PredictionResult } from '@/types/height.types';
import { calculateAgeInYears, translateAlgorithmInfo, translateBMIRecommendation } from '@/utils/height-calculations';
import { generateHeightReportPDF } from '@/utils/pdf-generator';
import GrowthChart from './GrowthChart';
import { Download, TrendingUp, Users, Activity, BookOpen } from 'lucide-react';

interface ResultPanelProps {
  data: HeightCalculatorData;
  result: PredictionResult;
}

export default function ResultPanel({ data, result }: ResultPanelProps) {
  const t = useTranslations('function.results');
  const params = useParams();
  const locale = params.locale as string;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const age = calculateAgeInYears(data.birthDate);
  const heightDifference = result.primaryPrediction - data.currentHeight;
  const percentileColor = result.currentPercentile >= 50 ? 'text-green-600' : result.currentPercentile >= 25 ? 'text-yellow-600' : 'text-orange-600';
  
  const getBMICategory = (category: string) => {
    const categories = {
      'underweight': { text: t('bmi.categories.underweight'), color: 'bg-blue-100 text-blue-700' },
      'normal': { text: t('bmi.categories.normal'), color: 'bg-green-100 text-green-700' },
      'overweight': { text: t('bmi.categories.overweight'), color: 'bg-yellow-100 text-yellow-700' },
      'obese': { text: t('bmi.categories.obese'), color: 'bg-red-100 text-red-700' }
    };
    return categories[category as keyof typeof categories] || categories.normal;
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateHeightReportPDF(data, result, locale);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed, please try again later');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 主要预测结果 */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-orange-900 mb-2">{t('prediction.primary_title')}</h3>
          <div className="text-4xl font-black text-orange-600 mb-2">
            {result.primaryPrediction.toFixed(1)} cm
          </div>
          <div className="text-sm text-orange-700">
            {t('prediction.range_title')}: {result.predictionRange[0].toFixed(1)} - {result.predictionRange[1].toFixed(1)} {t('prediction.cm_unit')}
          </div>
          <Badge className="mt-2 bg-orange-100 text-orange-700">
            {t('prediction.confidence_title')}: {result.confidence}{t('prediction.confidence_unit')}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-500">{t('prediction.expected_growth')}</div>
            <div className="text-xl font-bold text-gray-900">
              +{heightDifference.toFixed(1)} cm
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-500">{t('prediction.percentile_title')}</div>
            <div className={`text-xl font-bold ${percentileColor}`}>
              {result.currentPercentile}th Percentile
            </div>
          </div>
        </div>
      </Card>

      {/* 详细分析标签页 */}
      <Tabs defaultValue="algorithms" className="w-full">
        <TabsList className="grid w-full grid-cols-2 xl:grid-cols-4 gap-1 p-1">
          <TabsTrigger 
            value="algorithms" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-2 py-3 min-h-[60px] data-[state=active]:bg-white"
          >
            <TrendingUp className="w-4 h-4 flex-shrink-0" />
            <span className="text-center leading-tight">{t('tabs.analysis')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="growth" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-2 py-3 min-h-[60px] data-[state=active]:bg-white"
          >
            <Activity className="w-4 h-4 flex-shrink-0" />
            <span className="text-center leading-tight">{t('tabs.growth_chart')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-2 py-3 min-h-[60px] data-[state=active]:bg-white"
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="text-center leading-tight">{t('tabs.health')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations" 
            className="flex flex-col items-center justify-center gap-1 text-xs px-2 py-3 min-h-[60px] data-[state=active]:bg-white"
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="text-center leading-tight break-words hyphens-auto">{t('tabs.recommendations')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms" className="space-y-4 lg:space-y-6">
          <Card className="p-4 sm:p-6 lg:p-8">
            <h4 className="font-semibold mb-4 lg:mb-6 text-lg lg:text-xl">{t('algorithms.title')}</h4>
            <div className="space-y-4">
              {result.algorithms.map((algorithm, index) => {
                // 翻译算法名称和描述
                const translatedAlgorithm = translateAlgorithmInfo(algorithm.name, algorithm.description, locale);
                
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2 gap-6">
                      <div className="flex-1 min-w-0 max-w-[60%]">
                        <h5 className="font-medium break-words">{translatedAlgorithm.name}</h5>
                        <p className="text-sm text-gray-600 mt-1 break-words leading-relaxed">{translatedAlgorithm.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0 min-w-[140px]">
                        <div className="text-lg font-bold">{algorithm.predictedHeight.toFixed(1)} cm</div>
                        <Badge variant="outline" className="text-xs mt-1 whitespace-nowrap">
                          {t('algorithms.confidence')} {algorithm.confidence}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={algorithm.confidence} className="h-2 mt-3" />
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4 lg:space-y-6">
          <Card className="p-4 sm:p-6 lg:p-8">
            <h4 className="font-semibold mb-4 lg:mb-6 text-lg lg:text-xl">{t('growth_chart.title')}</h4>
            <div className="bg-blue-50 rounded-lg p-4 lg:p-6 mb-4 lg:mb-6">
              <h5 className="font-medium text-blue-900 text-base lg:text-lg">{t('growth_analysis.title')}</h5>
              <p className="text-sm lg:text-base text-blue-700 mt-1 lg:mt-2">
                {t('growth_analysis.current_age')}: {age} {t('growth_analysis.years')} | {t('growth_analysis.predicted_growth')}: +{heightDifference.toFixed(1)} {t('prediction.cm_unit')}
              </p>
            </div>
            
            {/* 生长曲线图 */}
            <div className="mt-6 lg:mt-8">
              <h6 className="font-medium mb-4 lg:mb-6 text-base lg:text-lg">{t('growth_chart.title')}</h6>
              <div className="h-80 lg:h-96">
                <GrowthChart data={data} result={result} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4 lg:space-y-6">
          <Card className="p-4 sm:p-6 lg:p-8">
            <h4 className="font-semibold mb-4 lg:mb-6 text-lg lg:text-xl">{t('bmi.title')}</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">{t('bmi.current_bmi')}</div>
                <div className="text-2xl font-bold">{result.bmiAnalysis.bmi}</div>
                <Badge className={getBMICategory(result.bmiAnalysis.category).color}>
                  {getBMICategory(result.bmiAnalysis.category).text}
                </Badge>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">{t('basic_info.age')}</div>
                <div className="text-2xl font-bold">{age} {t('basic_info.years')}</div>
                <Badge variant="outline">
                  {data.gender === 'male' ? t('basic_info.boy') : t('basic_info.girl')}
                </Badge>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h6 className="font-medium text-yellow-800 mb-2">{t('bmi.recommendation')}</h6>
              <p className="text-sm text-yellow-700">{translateBMIRecommendation(result.bmiAnalysis.recommendation, locale)}</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 lg:space-y-6">
          <Card className="p-4 sm:p-6 lg:p-8">
            <h4 className="font-semibold mb-4 lg:mb-6 text-lg lg:text-xl">{t('recommendations.title')}</h4>
            
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h6 className="font-medium text-green-700 mb-3 lg:mb-4 text-base lg:text-lg">🥗 {t('recommendations.nutrition.title')}</h6>
                <div className="bg-green-50 rounded-lg p-4 lg:p-6">
                  <p className="text-sm lg:text-base leading-relaxed">{t('recommendations.nutrition.content')}</p>
                </div>
              </div>

              <div>
                <h6 className="font-medium text-blue-700 mb-3 lg:mb-4 text-base lg:text-lg">🏃‍♂️ {t('recommendations.exercise.title')}</h6>
                <div className="bg-blue-50 rounded-lg p-4 lg:p-6">
                  <p className="text-sm lg:text-base leading-relaxed">{t('recommendations.exercise.content')}</p>
                </div>
              </div>

              <div>
                <h6 className="font-medium text-purple-700 mb-3 lg:mb-4 text-base lg:text-lg">😴 {t('recommendations.sleep.title')}</h6>
                <div className="bg-purple-50 rounded-lg p-4 lg:p-6">
                  <p className="text-sm lg:text-base leading-relaxed">{t('recommendations.sleep.content')}</p>
                </div>
              </div>

              <div>
                <h6 className="font-medium text-orange-700 mb-3 lg:mb-4 text-base lg:text-lg">🌱 {t('recommendations.lifestyle.title')}</h6>
                <div className="bg-orange-50 rounded-lg p-4 lg:p-6">
                  <p className="text-sm lg:text-base leading-relaxed">{t('recommendations.lifestyle.content')}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 下载报告按钮 */}
      <Card className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h4 className="font-semibold mb-3 lg:mb-4 text-lg lg:text-xl">{t('download.title')}</h4>
          <p className="text-sm lg:text-base text-gray-600 mb-3 lg:mb-4 max-w-md mx-auto">
            {t('download.description')}
          </p>
          <p className="text-xs lg:text-sm text-amber-600 mb-6 lg:mb-8 bg-amber-50 px-4 py-2 rounded-full inline-block">
            📝 {t('pdf_note')}
          </p>
          <Button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="h-12 lg:h-14 px-8 lg:px-12 text-base lg:text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('download.generating')}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t('download_pdf')}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 免责声明 */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <div className="text-amber-600 mt-1">⚠️</div>
          <div className="text-sm text-amber-700">
            <strong>{t('disclaimer.title')}:</strong>
            {t('disclaimer.content')}
          </div>
        </div>
      </Card>
    </div>
  );
}
