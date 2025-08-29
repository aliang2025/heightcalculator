'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { HeightCalculatorData, Gender, Unit } from '@/types/height.types';
import { calculateAgeInYears, convertHeight, convertWeight } from '@/utils/height-calculations';

interface HeightFormProps {
  onCalculate: (data: HeightCalculatorData) => void;
  isCalculating: boolean;
  onReset: () => void;
}

export default function HeightForm({ onCalculate, isCalculating, onReset }: HeightFormProps) {
  const t = useTranslations('function.form');
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
      newErrors.gender = t('errors.gender_required');
    }

    if (!formData.birthDate) {
      newErrors.birthDate = t('errors.birth_date_required');
    } else {
      const age = calculateAgeInYears(formData.birthDate);
      if (age < 1 || age > 18) {
        newErrors.birthDate = t('errors.age_invalid');
      }
    }

    if (!formData.currentHeight || formData.currentHeight <= 0) {
      newErrors.currentHeight = t('errors.height_required');
    } else {
      const heightCm = formData.unit === 'imperial' ? convertHeight(formData.currentHeight, 'imperial', 'metric') : formData.currentHeight;
      if (heightCm < 50 || heightCm > 220) {
        newErrors.currentHeight = t('errors.height_invalid');
      }
    }

    if (!formData.currentWeight || formData.currentWeight <= 0) {
      newErrors.currentWeight = t('errors.weight_required');
    } else {
      if (formData.currentWeight < 5 || formData.currentWeight > 150) {
        newErrors.currentWeight = t('errors.weight_invalid');
      }
    }

    if (!formData.fatherHeight || formData.fatherHeight <= 0) {
      newErrors.fatherHeight = t('errors.father_height_required');
    } else {
      const heightCm = formData.unit === 'imperial' ? convertHeight(formData.fatherHeight, 'imperial', 'metric') : formData.fatherHeight;
      if (heightCm < 140 || heightCm > 220) {
        newErrors.fatherHeight = t('errors.height_invalid');
      }
    }

    if (!formData.motherHeight || formData.motherHeight <= 0) {
      newErrors.motherHeight = t('errors.mother_height_required');
    } else {
      const heightCm = formData.unit === 'imperial' ? convertHeight(formData.motherHeight, 'imperial', 'metric') : formData.motherHeight;
      if (heightCm < 130 || heightCm > 200) {
        newErrors.motherHeight = t('errors.height_invalid');
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
    
    // 转换已输入的身高和体重数据
    const convertedData = { ...formData, unit: newUnit };
    
    // 转换身高数据
    if (formData.currentHeight) {
      convertedData.currentHeight = convertHeight(formData.currentHeight, formData.unit!, newUnit);
    }
    if (formData.fatherHeight) {
      convertedData.fatherHeight = convertHeight(formData.fatherHeight, formData.unit!, newUnit);
    }
    if (formData.motherHeight) {
      convertedData.motherHeight = convertHeight(formData.motherHeight, formData.unit!, newUnit);
    }
    
    // 转换体重数据
    if (formData.currentWeight) {
      convertedData.currentWeight = convertWeight(formData.currentWeight, formData.unit!, newUnit);
    }
    
    setFormData(convertedData);
  };

  const isMetric = formData.unit === 'metric';
  const heightUnit = isMetric ? 'cm' : 'in';
  const weightUnit = isMetric ? 'kg' : 'lbs';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
      {/* 进度指示器 */}
      <div className="mb-6 lg:mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm lg:text-base font-medium text-gray-700">{t('progress')}</span>
          <Badge variant={completeness === 100 ? "default" : "secondary"} className="text-sm px-3 py-1">
            {completeness}%
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
      </div>

      {/* 单位切换 */}
      <Card className="p-4 lg:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <div className="flex items-center justify-between">
          <Label className="text-sm lg:text-base font-medium text-gray-700">{t('unit_label')}</Label>
          <div className="flex items-center space-x-3">
            <span className={`text-sm lg:text-base ${isMetric ? 'font-semibold text-orange-600' : 'text-gray-500'}`}>{t('metric')}</span>
            <Switch
              checked={!isMetric}
              onCheckedChange={toggleUnit}
            />
            <span className={`text-sm lg:text-base ${!isMetric ? 'font-semibold text-orange-600' : 'text-gray-500'}`}>{t('imperial')}</span>
          </div>
        </div>
      </Card>

      {/* 基本信息 */}
      <div className="space-y-4 lg:space-y-6">
        <h3 className="font-semibold text-gray-900 text-lg lg:text-xl">👶 {t('child_info')}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <Label htmlFor="gender">{t('gender')} *</Label>
            <Select 
              value={formData.gender || ''} 
              onValueChange={(value: Gender) => setFormData({...formData, gender: value})}
            >
              <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('gender_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('gender_male')} 👦</SelectItem>
                <SelectItem value="female">{t('gender_female')} 👧</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <div>
            <Label htmlFor="birthDate">{t('birth_date')} *</Label>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <Label htmlFor="currentHeight" className="text-sm lg:text-base font-medium text-gray-700">{t('current_height')} * ({heightUnit})</Label>
            <Input
              type="number"
              id="currentHeight"
              placeholder={t('current_height_placeholder').replace('(cm)', `(${heightUnit})`)}
              value={formData.currentHeight || ''}
              onChange={(e) => setFormData({...formData, currentHeight: parseFloat(e.target.value) || undefined})}
              className={`mt-2 h-12 text-base ${errors.currentHeight ? 'border-red-500' : 'border-gray-300 focus:border-orange-500'}`}
              step="0.1"
            />
            {errors.currentHeight && <p className="text-red-500 text-xs mt-1">{errors.currentHeight}</p>}
          </div>

          <div>
            <Label htmlFor="currentWeight" className="text-sm lg:text-base font-medium text-gray-700">{t('current_weight')} * ({weightUnit})</Label>
            <Input
              type="number"
              id="currentWeight"
              placeholder={t('current_weight_placeholder').replace('(kg)', `(${weightUnit})`)}
              value={formData.currentWeight || ''}
              onChange={(e) => setFormData({...formData, currentWeight: parseFloat(e.target.value) || undefined})}
              className={`mt-2 h-12 text-base ${errors.currentWeight ? 'border-red-500' : 'border-gray-300 focus:border-orange-500'}`}
              step="0.1"
            />
            {errors.currentWeight && <p className="text-red-500 text-xs mt-1">{errors.currentWeight}</p>}
          </div>
        </div>
      </div>

      <Separator />

      {/* 父母信息 */}
      <div className="space-y-4 lg:space-y-6">
        <h3 className="font-semibold text-gray-900 text-lg lg:text-xl">👨‍👩‍👧‍👦 {t('parent_info')}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <Label htmlFor="fatherHeight" className="text-sm lg:text-base font-medium text-gray-700">{t('father_height')} * ({heightUnit})</Label>
            <Input
              type="number"
              id="fatherHeight"
              placeholder={t('father_height_placeholder').replace('(cm)', `(${heightUnit})`)}
              value={formData.fatherHeight || ''}
              onChange={(e) => setFormData({...formData, fatherHeight: parseFloat(e.target.value) || undefined})}
              className={`mt-2 h-12 text-base ${errors.fatherHeight ? 'border-red-500' : 'border-gray-300 focus:border-orange-500'}`}
              step="0.1"
            />
            {errors.fatherHeight && <p className="text-red-500 text-xs mt-1">{errors.fatherHeight}</p>}
          </div>

          <div>
            <Label htmlFor="motherHeight" className="text-sm lg:text-base font-medium text-gray-700">{t('mother_height')} * ({heightUnit})</Label>
            <Input
              type="number"
              id="motherHeight"
              placeholder={t('mother_height_placeholder').replace('(cm)', `(${heightUnit})`)}
              value={formData.motherHeight || ''}
              onChange={(e) => setFormData({...formData, motherHeight: parseFloat(e.target.value) || undefined})}
              className={`mt-2 h-12 text-base ${errors.motherHeight ? 'border-red-500' : 'border-gray-300 focus:border-orange-500'}`}
              step="0.1"
            />
            {errors.motherHeight && <p className="text-red-500 text-xs mt-1">{errors.motherHeight}</p>}
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-6 lg:pt-8">
        <Button 
          type="submit" 
          disabled={isCalculating || completeness < 100}
          className="flex-1 h-12 lg:h-14 text-base lg:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              {t('calculating')}
            </>
          ) : (
            <>
              🧮 {t('calculate_button')}
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset}
          disabled={isCalculating}
          className="sm:flex-none px-6 lg:px-8 h-12 lg:h-14 text-base lg:text-lg border-gray-300 hover:border-orange-500 hover:text-orange-600"
        >
          {t('reset_button')}
        </Button>
      </div>

      <p className="text-xs lg:text-sm text-gray-500 text-center bg-gray-50 p-3 lg:p-4 rounded-lg border border-gray-200">
        {t('privacy_note')}
      </p>
    </form>
  );
}
