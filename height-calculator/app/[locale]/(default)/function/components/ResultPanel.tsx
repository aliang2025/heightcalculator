'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeightCalculatorData, PredictionResult } from '@/types/height.types';
import { calculateAgeInYears } from '@/utils/height-calculations';
import { generateHeightReportPDF } from '@/utils/pdf-generator';
import GrowthChart from './GrowthChart';
import { Download, TrendingUp, Users, Activity, BookOpen } from 'lucide-react';

interface ResultPanelProps {
  data: HeightCalculatorData;
  result: PredictionResult;
}

export default function ResultPanel({ data, result }: ResultPanelProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const age = calculateAgeInYears(data.birthDate);
  const heightDifference = result.primaryPrediction - data.currentHeight;
  const percentileColor = result.currentPercentile >= 50 ? 'text-green-600' : result.currentPercentile >= 25 ? 'text-yellow-600' : 'text-orange-600';
  
  const getBMICategory = (category: string) => {
    const categories = {
      'underweight': { text: '偏瘦', color: 'bg-blue-100 text-blue-700' },
      'normal': { text: '正常', color: 'bg-green-100 text-green-700' },
      'overweight': { text: '偏重', color: 'bg-yellow-100 text-yellow-700' },
      'obese': { text: '肥胖', color: 'bg-red-100 text-red-700' }
    };
    return categories[category as keyof typeof categories] || categories.normal;
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateHeightReportPDF(data, result);
    } catch (error) {
      console.error('PDF生成失败:', error);
      alert('PDF生成失败，请稍后重试');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 主要预测结果 */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-orange-900 mb-2">预测成年身高</h3>
          <div className="text-4xl font-black text-orange-600 mb-2">
            {result.primaryPrediction.toFixed(1)} cm
          </div>
          <div className="text-sm text-orange-700">
            预测范围: {result.predictionRange[0].toFixed(1)} - {result.predictionRange[1].toFixed(1)} cm
          </div>
          <Badge className="mt-2 bg-orange-100 text-orange-700">
            置信度: {result.confidence}%
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-500">预计增长</div>
            <div className="text-xl font-bold text-gray-900">
              +{heightDifference.toFixed(1)} cm
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-500">当前百分位</div>
            <div className={`text-xl font-bold ${percentileColor}`}>
              第{result.currentPercentile}百分位
            </div>
          </div>
        </div>
      </Card>

      {/* 详细分析标签页 */}
      <Tabs defaultValue="algorithms" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="algorithms" className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            算法对比
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            成长分析
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            健康状况
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            建议
          </TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms" className="space-y-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-4">多算法预测对比</h4>
            <div className="space-y-4">
              {result.algorithms.map((algorithm, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium">{algorithm.name}</h5>
                      <p className="text-sm text-gray-600">{algorithm.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{algorithm.predictedHeight.toFixed(1)} cm</div>
                      <Badge variant="outline" className="text-xs">
                        置信度 {algorithm.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={algorithm.confidence} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-4">成长阶段分析</h4>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-blue-900">{result.growthStage.description}</h5>
              <p className="text-sm text-blue-700 mt-1">
                预期年增长率: {result.growthStage.expectedGrowthRate} cm/年
              </p>
            </div>
            
            <div className="space-y-3">
              <h6 className="font-medium">关键成长因素：</h6>
              <div className="grid grid-cols-1 gap-2">
                {result.growthStage.keyFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />
            
            {/* 生长曲线图 */}
            <div className="mt-6">
              <h6 className="font-medium mb-4">生长曲线预测</h6>
              <GrowthChart data={data} result={result} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-4">健康状况评估</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">当前BMI</div>
                <div className="text-2xl font-bold">{result.bmiAnalysis.bmi}</div>
                <Badge className={getBMICategory(result.bmiAnalysis.category).color}>
                  {getBMICategory(result.bmiAnalysis.category).text}
                </Badge>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">年龄</div>
                <div className="text-2xl font-bold">{age}岁</div>
                <Badge variant="outline">
                  {data.gender === 'male' ? '男孩' : '女孩'}
                </Badge>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h6 className="font-medium text-yellow-800 mb-2">BMI建议</h6>
              <p className="text-sm text-yellow-700">{result.bmiAnalysis.recommendation}</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-4">个性化成长建议</h4>
            
            <div className="space-y-6">
              <div>
                <h6 className="font-medium text-green-700 mb-3">🥗 营养建议</h6>
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm">
                    <li>• 确保充足的蛋白质摄入，促进生长发育</li>
                    <li>• 补充钙质和维生素D，强化骨骼健康</li>
                    <li>• 多吃新鲜蔬菜水果，提供维生素和矿物质</li>
                    <li>• 控制糖分和加工食品的摄入</li>
                  </ul>
                </div>
              </div>

              <div>
                <h6 className="font-medium text-blue-700 mb-3">🏃‍♂️ 运动建议</h6>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm">
                    <li>• 每天至少1小时的中等强度运动</li>
                    <li>• 多做拉伸和跳跃类运动，如篮球、游泳</li>
                    <li>• 避免过度负重训练</li>
                    <li>• 保持运动的趣味性和多样性</li>
                  </ul>
                </div>
              </div>

              <div>
                <h6 className="font-medium text-purple-700 mb-3">😴 睡眠建议</h6>
                <div className="bg-purple-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm">
                    <li>• {age <= 6 ? '10-11小时' : age <= 12 ? '9-10小时' : '8-9小时'}的优质睡眠</li>
                    <li>• 保持规律的作息时间</li>
                    <li>• 创造良好的睡眠环境</li>
                    <li>• 避免睡前使用电子设备</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 下载报告按钮 */}
      <Card className="p-6">
        <div className="text-center">
          <h4 className="font-semibold mb-2">获取详细报告</h4>
          <p className="text-sm text-gray-600 mb-2">
            下载包含完整分析结果和建议的PDF报告
          </p>
          <p className="text-xs text-amber-600 mb-4 bg-amber-50 px-3 py-1 rounded-full inline-block">
            📝 报告为英文版本，确保兼容性
          </p>
          <Button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                生成中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                下载PDF报告
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
            <strong>免责声明：</strong>
            本预测结果仅供参考，不能替代专业医疗建议。儿童的生长发育受多种因素影响，
            如有疑问请咨询儿科医生或生长发育专家。
          </div>
        </div>
      </Card>
    </div>
  );
}
