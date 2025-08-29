'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { HeightCalculatorData, PredictionResult } from '@/types/height.types';
import { calculateHeightPrediction } from '@/utils/height-calculations';
import HeightForm from './components/HeightForm';
import ResultPanel from './components/ResultPanel';

export default function HeightCalculatorPage() {
  const t = useTranslations('function');
  const [calculatorData, setCalculatorData] = useState<HeightCalculatorData | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (data: HeightCalculatorData) => {
    setIsCalculating(true);
    setCalculatorData(data);
    
    try {
      // 模拟计算延迟以显示加载状态
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = calculateHeightPrediction(data);
      setPredictionResult(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setCalculatorData(null);
    setPredictionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* 页面标题 */}
        <div className="text-center mb-10 lg:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 px-4 py-2 text-sm font-medium">
              {t('title')}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">Free • Privacy Protected</Badge>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 max-w-[1800px] mx-auto">
          {/* 左侧：输入表单 */}
          <div className="space-y-6 lg:space-y-8">
            <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm lg:text-base">1</span>
                </div>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">{t('form.title')}</h2>
              </div>
              
              <HeightForm 
                onCalculate={handleCalculate}
                isCalculating={isCalculating}
                onReset={handleReset}
              />
            </Card>

            {/* 算法说明卡片 */}
            <Card className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md">
              <h3 className="font-semibold text-blue-900 mb-4 text-base lg:text-lg">📊 {t('results.algorithms.title')}</h3>
              <div className="space-y-3 text-sm lg:text-base text-blue-800">
                <p>• <strong>Khamis-Roche Method:</strong> Scientific prediction combining parental height, current height and age</p>
                <p>• <strong>Mid-Parental Height:</strong> Traditional prediction based on genetic factors</p>
                <p>• <strong>Percentile Tracking:</strong> Trend prediction based on current growth percentile</p>
              </div>
            </Card>

            {/* 隐私保护说明 */}
            <Card className="p-6 sm:p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md">
              <h3 className="font-semibold text-green-900 mb-4 text-base lg:text-lg">🔒 Privacy Protection</h3>
              <div className="space-y-3 text-sm lg:text-base text-green-800">
                <p>• All calculations completed locally on your device</p>
                <p>• No personal information sent to servers</p>
                <p>• No storage or recording of your input data</p>
                <p>• Can be used offline, no data leakage concerns</p>
              </div>
            </Card>
          </div>

          {/* 右侧：结果展示 */}
          <div className="space-y-6 lg:space-y-8">
            <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0 bg-white/80 backdrop-blur-sm min-h-[600px] lg:min-h-[700px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm lg:text-base">2</span>
                </div>
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">{t('results.title')}</h2>
              </div>

              {!predictionResult && !isCalculating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Waiting for Results</h3>
                  <p className="text-gray-500">{t('results.waiting_message')}</p>
                </div>
              )}

              {isCalculating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">{t('form.calculating')}</h3>
                  <p className="text-gray-500">Running multiple algorithms for comprehensive analysis</p>
                </div>
              )}

              {predictionResult && calculatorData && (
                <ResultPanel 
                  data={calculatorData}
                  result={predictionResult}
                />
              )}
            </Card>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-16 lg:mt-24 text-center">
          <Separator className="mb-8" />
          <p className="text-sm lg:text-base text-gray-500 max-w-4xl mx-auto leading-relaxed px-4">
            ⚠️ <strong>{t('results.disclaimer.title')}:</strong> {t('results.disclaimer.content')}
          </p>
        </div>
      </div>
    </div>
  );
}
