/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MealData } from './types';
import { formatDateKey } from './utils';

// Static Meal Recipes and templates for Monday-Friday
const LUNCH_TEMPLATES = [
  {
    title: '수제함박스테이크 정식',
    dishes: ['밥', '수제함박스테이크', '시저샐러드', '크림스프', '깍두기', '모닝빵'],
    totalCalories: 810,
    nutrition: { carbohydrates: 95, protein: 32, fat: 28 },
    allergens: ['난류', '우유', '대두', '밀', '토마토', '쇠고기'],
  },
  {
    title: '치즈돈까스 정식',
    dishes: ['친환경현미밥', '쇠고기미역국', '매콤돈육강정', '숙주미나리무침', '배추김치'],
    totalCalories: 845,
    nutrition: { carbohydrates: 110, protein: 32, fat: 25 },
    allergens: ['대두', '밀', '쇠고기', '돼지고기'],
  },
  {
    title: '얼큰순두부찌개 & 보쌈정식',
    dishes: ['흑미밥', '얼큰순두부찌개', '한방돼지보쌈', '부추무침', '보쌈김치'],
    totalCalories: 815,
    nutrition: { carbohydrates: 98, protein: 38, fat: 22 },
    allergens: ['대두', '밀', '돼지고기', '새우'],
  },
  {
    title: '안동찜닭 정식',
    dishes: ['귀리밥', '안동찜닭무침', '근대된장국', '감자채볶음', '깍두기', '방울토마토'],
    totalCalories: 795,
    nutrition: { carbohydrates: 100, protein: 35, fat: 20 },
    allergens: ['밀', '대두', '닭고기', '토마토'],
  },
  {
    title: '돈코츠라멘 & 주먹밥',
    dishes: ['구수한돈코츠라멘', '참치마요삼각주먹밥', '야끼만두', '부추겉절이', '단무지'],
    totalCalories: 860,
    nutrition: { carbohydrates: 120, protein: 25, fat: 28 },
    allergens: ['난류', '우유', '대두', '밀', '돼지고기'],
  }
];

const DINNER_TEMPLATES = [
  {
    title: '스팸마요덮밥 & 에이드',
    dishes: ['스팸마요덮밥', '가쓰오우동국', '단무지무침', '배추김치', '레몬에이드'],
    totalCalories: 750,
    nutrition: { carbohydrates: 110, protein: 22, fat: 24 },
    allergens: ['난류', '우유', '대두', '밀', '돼지고기'],
  },
  {
    title: '참치마요덮밥 & 떡볶이',
    dishes: ['참치마요덮밥', '유부장국', '매콤떡볶이', '깍두기', '요구르트'],
    totalCalories: 720,
    nutrition: { carbohydrates: 105, protein: 24, fat: 18 },
    allergens: ['난류', '우유', '대두', '밀'],
  },
  {
    title: '새우볶음밥 & 짜장소스',
    dishes: ['새우볶음밥', '짜장소스', '맑은탕국', '탕수만두', '배추김치'],
    totalCalories: 760,
    nutrition: { carbohydrates: 115, protein: 20, fat: 22 },
    allergens: ['새우', '오징어', '대두', '밀', '조개류'],
  },
  {
    title: '치킨마요덮밥 & 비빔만두',
    dishes: ['치킨마요덮밥', '계란파국', '비빔야채만두', '배추김치', '바나나'],
    totalCalories: 780,
    nutrition: { carbohydrates: 108, protein: 26, fat: 25 },
    allergens: ['난류', '대두', '밀', '닭고기'],
  },
  {
    title: '베이컨김치볶음밥',
    dishes: ['베이컨김치볶음밥', '팽이버섯된장국', '크리스피해쉬브라운', '깍두기', '초코우유'],
    totalCalories: 730,
    nutrition: { carbohydrates: 103, protein: 18, fat: 24 },
    allergens: ['우유', '대두', '밀', '돼지고기'],
  }
];

const KOREAN_WEEKDAYS = ['월', '화', '수', '목', '금'];

/**
 * Generates dynamic meals for Monday-Friday based on week dates
 */
export function generateMealsForWeek(weekDates: Date[]): MealData[] {
  const result: MealData[] = [];
  
  // Create 10 meals total: 5 Lunch + 5 Dinner
  for (let i = 0; i < 5; i++) {
    const currentDate = weekDates[i];
    const dKey = formatDateKey(currentDate);
    const dayName = KOREAN_WEEKDAYS[i];
    
    // Lunch Template mapping
    const lunchT = LUNCH_TEMPLATES[i % LUNCH_TEMPLATES.length];
    result.push({
      id: `${dKey}_lunch`,
      schoolName: '씨마스고등학교',
      date: currentDate,
      dateKey: dKey,
      dayOfWeek: dayName,
      mealType: 'lunch',
      title: lunchT.title,
      dishes: lunchT.dishes,
      totalCalories: lunchT.totalCalories,
      nutrition: lunchT.nutrition,
      allergens: lunchT.allergens,
    });
    
    // Dinner Template mapping
    const dinnerT = DINNER_TEMPLATES[i % DINNER_TEMPLATES.length];
    result.push({
      id: `${dKey}_dinner`,
      schoolName: '씨마스고등학교',
      date: currentDate,
      dateKey: dKey,
      dayOfWeek: dayName,
      mealType: 'dinner',
      title: dinnerT.title,
      dishes: dinnerT.dishes,
      totalCalories: dinnerT.totalCalories,
      nutrition: dinnerT.nutrition,
      allergens: dinnerT.allergens,
    });
  }
  
  return result;
}
