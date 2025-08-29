'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { HeightCalculatorData, Gender, Unit } from '@/types/height.types';
import { calculateAgeInYears, convertHeight } from '@/utils/height-calculations';

interface HeightFormProps {
  onCalculate: (data: HeightCalculatorData) => void;
  isCalculating: boolean;
  onReset: () => void;
}

export default function HeightForm({ onCalculate, isCalculating, onReset }: HeightFormProps) {
  const [formData, setFormData] = useState<Partial<HeightCalculatorData>>({
    gender: undefined,
    birthDate: undefined,
    currentHeight: undefined,
    currentWeight: undefined,
    fatherHeight: undefined,
    motherHeight: undefined,
    unit: 'metric'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [completeness, setCompleteness] = useState(0);

  // 计算表单完成度
  useEffect(() => {
    const requiredFields = ['gender', 'birthDate', 'currentHeight', 'currentWeight', 'fatherHeight', 'motherHeight'];
    const completedFields = requiredFields.filter(field => {
      const value = formData[field as keyof HeightCalculatorData];
      if (typeof value === 'string') {
        return value !== undefined && value !== null && value !== '';
      }
      return value !== undefined && value !== null;
    });
    
    setCompleteness(Math.round((completedFields.length / requiredFields.length) * 100));
  }, [formData]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.gender) {
      newErrors.gender = '请选择性别';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '请选择出生日期';
    } else {
      const age = calculateAgeInYears(formData.birthDate);
      if (age < 1 || age > 18) {
        newErrors.birthDate = '年龄应在1-18岁之间';
      }
    }

    if (!formData.currentHeight || formData.currentHeight <= 0) {
      newErrors.currentHeight = '请输入有效的身高';
    } else {
      const heightCm = formData.unit === 'imperial' ? convertHeight(formData.currentHeight, 'imperial', 'metric') : formData.currentHeight;
      if (heightCm < 50 || heightCm > 220) {
        newErrors.currentHeight = '身高应在50-220cm之间';
      }
    }

    if (!formData.currentWeight || formData.currentWeight <= 0) {
      newErrors.currentWeight = '请输入有效的体重';
    } else {
      if (formData.currentWeight < 5 || formData.currentWeight > 150) {
        newErrors.currentWeight = '体重应在5-150kg之间';
      }
    }

    if (!formData.fatherHeight || formData.fatherHeight <= 0) {
      newErrors.fatherHeight = '请输入父亲身高';
    } else {
      const heightCm = formData.unit === 'imperial' ? convertHeight(formData.fatherHeight, 'imperial', 'metric') : formData.fatherHeight;
      if (heightCm < 140 || heightCm > 220) {
        newErrors.fatherHeight = '父亲身高应在140-220cm之间';
      }
    }

    if (!formData.motherHeight || formData.motherHeight <= 0) {
      newErrors.motherHeight = '请输入母亲身高';
    } else {
      const heightCm = formData.unit === 'imperial' ? convertHeight(formData.motherHeight, 'imperial', 'metric') : formData.motherHeight;
      if (heightCm < 130 || heightCm > 200) {
        newErrors.motherHeight = '母亲身高应在130-200cm之间';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 确保所有数据都转换为公制
      const dataInMetric: HeightCalculatorData = {
        gender: formData.gender!,
        birthDate: formData.birthDate!,
        currentHeight: formData.unit === 'imperial' ? convertHeight(formData.currentHeight!, 'imperial', 'metric') : formData.currentHeight!,
        currentWeight: formData.currentWeight!,
        fatherHeight: formData.unit === 'imperial' ? convertHeight(formData.fatherHeight!, 'imperial', 'metric') : formData.fatherHeight!,
        motherHeight: formData.unit === 'imperial' ? convertHeight(formData.motherHeight!, 'imperial', 'metric') : formData.motherHeight!,
        unit: formData.unit!
      };
      
      onCalculate(dataInMetric);
    }
  };

  const handleReset = () => {
    setFormData({
      gender: undefined,
      birthDate: undefined,
      currentHeight: undefined,
      currentWeight: undefined,
      fatherHeight: undefined,
      motherHeight: undefined,
      unit: 'metric'
    });
    setErrors({});
    onReset();
  };

  const toggleUnit = () => {
    const newUnit: Unit = formData.unit === 'metric' ? 'imperial' : 'metric';
    
    // 转换已输入的身高数据
    const convertedData = { ...formData, unit: newUnit };
    
    if (formData.currentHeight) {
      convertedData.currentHeight = convertHeight(formData.currentHeight, formData.unit!, newUnit);
    }
    if (formData.fatherHeight) {
      convertedData.fatherHeight = convertHeight(formData.fatherHeight, formData.unit!, newUnit);
    }
    if (formData.motherHeight) {
      convertedData.motherHeight = convertHeight(formData.motherHeight, formData.unit!, newUnit);
    }
    
    setFormData(convertedData);
  };

  const isMetric = formData.unit === 'metric';
  const heightUnit = isMetric ? 'cm' : 'in';
  const weightUnit = isMetric ? 'kg' : 'lbs';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 进度指示器 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">表单完成度</span>
          <Badge variant={completeness === 100 ? "default" : "secondary"}>
            {completeness}%
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
      </div>

      {/* 单位切换 */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">测量单位</Label>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isMetric ? 'font-semibold' : 'text-gray-500'}`}>公制 (cm/kg)</span>
            <Switch
              checked={!isMetric}
              onCheckedChange={toggleUnit}
            />
            <span className={`text-sm ${!isMetric ? 'font-semibold' : 'text-gray-500'}`}>英制 (in/lbs)</span>
          </div>
        </div>
      </Card>

      {/* 基本信息 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">👶 儿童基本信息</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">性别 *</Label>
            <Select 
              value={formData.gender || ''} 
              onValueChange={(value: Gender) => setFormData({...formData, gender: value})}
            >
              <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                <SelectValue placeholder="选择性别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">男孩 👦</SelectItem>
                <SelectItem value="female">女孩 👧</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div>
            <Label htmlFor="birthDate">出生日期 *</Label>
            <Input
              type="date"
              id="birthDate"
              value={formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({...formData, birthDate: new Date(e.target.value)})}
              className={errors.birthDate ? 'border-red-500' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentHeight">当前身高 * ({heightUnit})</Label>
            <Input
              type="number"
              id="currentHeight"
              placeholder={`请输入身高 (${heightUnit})`}
              value={formData.currentHeight || ''}
              onChange={(e) => setFormData({...formData, currentHeight: parseFloat(e.target.value) || undefined})}
              className={errors.currentHeight ? 'border-red-500' : ''}
              step="0.1"
            />
            {errors.currentHeight && <p className="text-red-500 text-xs mt-1">{errors.currentHeight}</p>}
          </div>

          <div>
            <Label htmlFor="currentWeight">当前体重 * ({weightUnit})</Label>
            <Input
              type="number"
              id="currentWeight"
              placeholder={`请输入体重 (${weightUnit})`}
              value={formData.currentWeight || ''}
              onChange={(e) => setFormData({...formData, currentWeight: parseFloat(e.target.value) || undefined})}
              className={errors.currentWeight ? 'border-red-500' : ''}
              step="0.1"
            />
            {errors.currentWeight && <p className="text-red-500 text-xs mt-1">{errors.currentWeight}</p>}
          </div>
        </div>
      </div>

      <Separator />

      {/* 父母信息 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">👨‍👩‍👧‍👦 父母身高信息</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fatherHeight">父亲身高 * ({heightUnit})</Label>
            <Input
              type="number"
              id="fatherHeight"
              placeholder={`父亲身高 (${heightUnit})`}
              value={formData.fatherHeight || ''}
              onChange={(e) => setFormData({...formData, fatherHeight: parseFloat(e.target.value) || undefined})}
              className={errors.fatherHeight ? 'border-red-500' : ''}
              step="0.1"
            />
            {errors.fatherHeight && <p className="text-red-500 text-xs mt-1">{errors.fatherHeight}</p>}
          </div>

          <div>
            <Label htmlFor="motherHeight">母亲身高 * ({heightUnit})</Label>
            <Input
              type="number"
              id="motherHeight"
              placeholder={`母亲身高 (${heightUnit})`}
              value={formData.motherHeight || ''}
              onChange={(e) => setFormData({...formData, motherHeight: parseFloat(e.target.value) || undefined})}
              className={errors.motherHeight ? 'border-red-500' : ''}
              step="0.1"
            />
            {errors.motherHeight && <p className="text-red-500 text-xs mt-1">{errors.motherHeight}</p>}
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isCalculating || completeness < 100}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              计算中...
            </>
          ) : (
            <>
              🧮 开始计算
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          disabled={isCalculating}
        >
          重置
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        * 为必填项目。所有信息将在本地处理，确保隐私安全。
      </p>
    </form>
  );
}
