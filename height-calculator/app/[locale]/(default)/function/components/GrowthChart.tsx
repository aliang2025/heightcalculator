'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { HeightCalculatorData, PredictionResult, GrowthChartData } from '@/types/height.types';
import { calculateAgeInYears, calculateAgeInMonths } from '@/utils/height-calculations';

interface GrowthChartProps {
  data: HeightCalculatorData;
  result: PredictionResult;
}

// 简化的WHO标准数据用于绘制参考线
const WHO_REFERENCE_DATA = [
  { age: 1, male_p50: 76, male_p90: 82, male_p10: 71, female_p50: 75, female_p90: 81, female_p10: 70 },
  { age: 2, male_p50: 87, male_p90: 95, male_p10: 80, female_p50: 86, female_p90: 94, female_p10: 79 },
  { age: 3, male_p50: 96, male_p90: 104, male_p10: 88, female_p50: 95, female_p90: 103, female_p10: 87 },
  { age: 4, male_p50: 103, male_p90: 112, male_p10: 95, female_p50: 102, female_p90: 111, female_p10: 94 },
  { age: 5, male_p50: 110, male_p90: 119, male_p10: 101, female_p50: 109, female_p90: 118, female_p10: 100 },
  { age: 6, male_p50: 116, male_p90: 126, male_p10: 107, female_p50: 115, female_p90: 125, female_p10: 106 },
  { age: 7, male_p50: 122, male_p90: 132, male_p10: 112, female_p50: 121, female_p90: 131, female_p10: 111 },
  { age: 8, male_p50: 128, male_p90: 138, male_p10: 118, female_p50: 127, female_p90: 137, female_p10: 117 },
  { age: 9, male_p50: 133, male_p90: 144, male_p10: 123, female_p50: 132, female_p90: 143, female_p10: 122 },
  { age: 10, male_p50: 138, male_p90: 150, male_p10: 127, female_p50: 137, female_p90: 149, female_p10: 126 },
  { age: 11, male_p50: 143, male_p90: 156, male_p10: 131, female_p50: 142, female_p90: 156, female_p10: 130 },
  { age: 12, male_p50: 149, male_p90: 163, male_p10: 136, female_p50: 148, female_p90: 163, female_p10: 135 },
  { age: 13, male_p50: 156, male_p90: 171, male_p10: 142, female_p50: 155, female_p90: 169, female_p10: 142 },
  { age: 14, male_p50: 163, male_p90: 178, male_p10: 149, female_p50: 160, female_p90: 173, female_p10: 148 },
  { age: 15, male_p50: 169, male_p90: 184, male_p10: 155, female_p50: 162, female_p90: 174, female_p10: 150 },
  { age: 16, male_p50: 173, male_p90: 188, male_p10: 160, female_p50: 163, female_p90: 175, female_p10: 151 },
  { age: 17, male_p50: 176, male_p90: 190, male_p10: 163, female_p50: 163, female_p90: 175, female_p10: 152 },
  { age: 18, male_p50: 177, male_p90: 191, male_p10: 164, female_p50: 163, female_p90: 175, female_p10: 152 }
];

export default function GrowthChart({ data, result }: GrowthChartProps) {
  const chartData = useMemo(() => {
    const currentAge = calculateAgeInYears(data.birthDate);
    const currentAgeMonths = calculateAgeInMonths(data.birthDate);
    const gender = data.gender;

    // 构建图表数据
    const chartPoints = WHO_REFERENCE_DATA.map(point => {
      const baseData: any = {
        age: point.age,
        [`标准50%`]: point[`${gender}_p50` as keyof typeof point],
        [`标准90%`]: point[`${gender}_p90` as keyof typeof point],
        [`标准10%`]: point[`${gender}_p10` as keyof typeof point],
      };

      // 添加当前身高点
      if (point.age === currentAge) {
        baseData['当前身高'] = data.currentHeight;
      }

      // 添加预测点（18岁）
      if (point.age === 18) {
        baseData['预测身高'] = result.primaryPrediction;
      }

      return baseData;
    }).filter(point => point.age >= Math.max(1, currentAge - 2) && point.age <= 18);

    // 添加预测轨迹线
    if (currentAge < 18) {
      // 在当前年龄和18岁之间插入预测轨迹点
      const predictionYears: any[] = [];
      for (let age = currentAge + 1; age <= 18; age++) {
        const progressRatio = (age - currentAge) / (18 - currentAge);
        const predictedHeight = data.currentHeight + (result.primaryPrediction - data.currentHeight) * progressRatio;
        
        const ageData = WHO_REFERENCE_DATA.find(d => d.age === age);
        predictionYears.push({
          age,
          [`标准50%`]: ageData ? ageData[`${gender}_p50` as keyof typeof ageData] as number : null,
          [`标准90%`]: ageData ? ageData[`${gender}_p90` as keyof typeof ageData] as number : null,
          [`标准10%`]: ageData ? ageData[`${gender}_p10` as keyof typeof ageData] as number : null,
          '预测轨迹': predictedHeight
        });
      }

      // 合并数据
      chartPoints.forEach(point => {
        const predYear = predictionYears.find(p => p.age === point.age);
        if (predYear) {
          point['预测轨迹'] = predYear['预测轨迹'];
        }
      });

      // 添加当前身高到预测轨迹的起点
      const currentPoint = chartPoints.find(p => p.age === currentAge);
      if (currentPoint) {
        currentPoint['预测轨迹'] = data.currentHeight;
      }
    }

    return chartPoints;
  }, [data, result]);

  const currentAge = calculateAgeInYears(data.birthDate);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="age" 
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => `${value}岁`}
          />
          <YAxis 
            domain={['dataMin - 10', 'dataMax + 10']}
            tickFormatter={(value) => `${value}cm`}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (value === null || value === undefined) return [null, name];
              return [`${Number(value).toFixed(1)}cm`, name];
            }}
            labelFormatter={(label) => `年龄: ${label}岁`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          
          {/* WHO标准参考线 */}
          <Line 
            type="monotone" 
            dataKey="标准10%" 
            stroke="#e2e8f0" 
            strokeWidth={1}
            strokeDasharray="2 2"
            dot={false}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="标准50%" 
            stroke="#94a3b8" 
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="标准90%" 
            stroke="#e2e8f0" 
            strokeWidth={1}
            strokeDasharray="2 2"
            dot={false}
            connectNulls={false}
          />

          {/* 当前身高点 */}
          <Line 
            type="monotone" 
            dataKey="当前身高" 
            stroke="#3b82f6" 
            strokeWidth={0}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            connectNulls={false}
          />

          {/* 预测轨迹 */}
          <Line 
            type="monotone" 
            dataKey="预测轨迹" 
            stroke="#f59e0b" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={false}
            connectNulls={true}
          />

          {/* 最终预测点 */}
          <Line 
            type="monotone" 
            dataKey="预测身高" 
            stroke="#ef4444" 
            strokeWidth={0}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
            connectNulls={false}
          />

          {/* 当前年龄参考线 */}
          <ReferenceLine 
            x={currentAge} 
            stroke="#6366f1" 
            strokeDasharray="3 3"
            label={{ value: "当前年龄", position: "top" }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* 图例说明 */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-gray-400"></div>
          <span>WHO标准曲线</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>当前身高</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-yellow-500" style={{ borderTop: '2px dashed' }}></div>
          <span>预测轨迹</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>预测成年身高</span>
        </div>
      </div>

      {/* 图表说明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        <p>
          📈 <strong>图表说明：</strong>
          灰色曲线代表WHO标准身高范围（10%-90%），蓝点为当前身高位置，
          黄色虚线显示预测的成长轨迹，红点为预测的成年身高。
        </p>
      </div>
    </div>
  );
}
