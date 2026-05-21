/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NutritionalInfo {
  carbohydrates: number; // 탄수화물 (g)
  protein: number;       // 단백질 (g)
  fat: number;           // 지방 (g)
}

export interface MealData {
  id: string;
  schoolName: string;
  date: Date;
  dateKey: string;       // YYYYMMDD
  dayOfWeek: string;     // 월, 화, 수, 목, 금, 토, 일
  mealType: 'lunch' | 'dinner';
  title: string;
  dishes: string[];
  totalCalories: number; // kcal
  nutrition: NutritionalInfo;
  allergens: string[];
}

export type ViewType = 'home' | 'calendar' | 'calculator' | 'profile';

export interface AllergyProfile {
  name: string;
  enabled: boolean;
}
