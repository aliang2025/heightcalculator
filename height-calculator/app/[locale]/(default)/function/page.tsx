'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { HeightCalculatorData, PredictionResult } from '@/types/height.types';
import { calculateHeightPrediction } from '@/utils/height-calculations';
import HeightForm from './components/HeightForm';
import ResultPanel from './components/ResultPanel';

export default function HeightCalculatorPage() {
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
      console.error('计算过程中出现错误:', error);
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
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              身高计算机
            </Badge>
            <Badge variant="outline">免费 • 隐私保护</Badge>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            精准
            <span className="bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
              身高预测
            </span>
            计算器
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            基于科学算法预测儿童成年身高，提供个性化成长建议与专业分析报告。
            <br />
            所有计算在本地完成，确保您的隐私安全。
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* 左侧：输入表单 */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">1</span>
                </div>
                <h2 className="text-xl font-bold">输入基本信息</h2>
              </div>
              
              <HeightForm 
                onCalculate={handleCalculate}
                isCalculating={isCalculating}
                onReset={handleReset}
              />
            </Card>

            {/* 算法说明卡片 */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">📊 预测算法说明</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>Khamis-Roche 改良法：</strong>综合父母身高、当前身高和年龄的科学预测</p>
                <p>• <strong>中位父母身高法：</strong>基于遗传因素的传统预测方法</p>
                <p>• <strong>百分位追踪法：</strong>基于当前生长百分位的趋势预测</p>
              </div>
            </Card>

            {/* 隐私保护说明 */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">🔒 隐私保护承诺</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>• 所有计算在您的设备本地完成</p>
                <p>• 不会向服务器发送任何个人信息</p>
                <p>• 不保存或记录您的输入数据</p>
                <p>• 可离线使用，无需担心数据泄露</p>
              </div>
            </Card>
          </div>

          {/* 右侧：结果展示 */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">2</span>
                </div>
                <h2 className="text-xl font-bold">预测结果与分析</h2>
              </div>

              {!predictionResult && !isCalculating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">等待计算结果</h3>
                  <p className="text-gray-500">请在左侧填写完整信息，点击计算按钮开始预测</p>
                </div>
              )}

              {isCalculating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">正在计算中...</h3>
                  <p className="text-gray-500">正在运行多种算法进行综合分析</p>
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
        <div className="mt-12 text-center">
          <Separator className="mb-6" />
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            ⚠️ <strong>重要提示：</strong>本工具提供的身高预测仅供参考，不能替代医疗专业建议。
            如有关于儿童生长发育的疑问，请咨询儿科医生或生长发育专家。
          </p>
        </div>
      </div>
    </div>
  );
}
