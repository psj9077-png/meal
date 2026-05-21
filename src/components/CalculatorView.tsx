/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Check, Save } from 'lucide-react';
import { MealData } from '../types';
import { getTodayKST, getDefaultSelectedDate, formatDateKey } from '../utils';

interface CalculatorViewProps {
  key?: any;
  meals: MealData[];
}

interface DishCalculable {
  name: string;
  calories: number;
  carbs: number;   // g
  protein: number; // g
  fat: number;     // g
  category: 'rice' | 'soup' | 'side' | 'dessert';
  badge?: string;
}

// A smart dictionary mapping dish keywords to realistic nutritional breakdowns
const DISH_NUTRITION_PROFILES: Record<string, Partial<DishCalculable>> = {
  // Rice
  '친환경현미밥': { calories: 300, carbs: 65, protein: 6, fat: 1.5, category: 'rice' },
  '밥': { calories: 310, carbs: 68, protein: 5.5, fat: 1, category: 'rice' },
  '흑미밥': { calories: 305, carbs: 66, protein: 6, fat: 1.2, category: 'rice' },
  '귀리밥': { calories: 295, carbs: 60, protein: 7.5, fat: 2, category: 'rice' },
  '귀리밥 ': { calories: 295, carbs: 60, protein: 7.5, fat: 2, category: 'rice' },
  '수제함박스테이크': { calories: 320, carbs: 12, protein: 18, fat: 15, category: 'side' },

  // Soups
  '쇠고기미역국': { calories: 120, carbs: 5, protein: 10, fat: 6, category: 'soup', badge: '쇠고기 함유' },
  '크림스프': { calories: 150, carbs: 18, protein: 3, fat: 8, category: 'soup' },
  '얼큰순두부찌개': { calories: 140, carbs: 6, protein: 11, fat: 7, category: 'soup' },
  '근대된장국': { calories: 65, carbs: 7, protein: 4, fat: 1.5, category: 'soup' },
  '구수한돈코츠라멘': { calories: 420, carbs: 50, protein: 16, fat: 18, category: 'soup' },

  // Sides
  '매콤돈육강정': { calories: 280, carbs: 18, protein: 13, fat: 10, category: 'side', badge: '돼지고기' },
  '시저샐러드': { calories: 95, carbs: 6, protein: 2, fat: 7.5, category: 'side' },
  '한방돼지보쌈': { calories: 290, carbs: 3, protein: 21, fat: 14, category: 'side', badge: '돼지고기' },
  '부추무침': { calories: 35, carbs: 4, protein: 1, fat: 0.5, category: 'side' },
  '부추겉절이': { calories: 38, carbs: 4.5, protein: 1.2, fat: 0.6, category: 'side' },
  '안동찜닭무침': { calories: 260, carbs: 14, protein: 18, fat: 9, category: 'side', badge: '닭고기' },
  '감자채볶음': { calories: 110, carbs: 16, protein: 2, fat: 4.5, category: 'side' },
  '참치마요삼각주먹밥': { calories: 195, carbs: 32, protein: 5.5, fat: 4, category: 'side' },
  '야끼만두': { calories: 130, carbs: 14, protein: 3, fat: 6.5, category: 'side' },
  '배추김치': { calories: 20, carbs: 3, protein: 1.1, fat: 0.2, category: 'side' },
  '깍두기': { calories: 18, carbs: 2.8, protein: 0.8, fat: 0.1, category: 'side' },
  '숙주미나리무침': { calories: 30, carbs: 4, protein: 1.5, fat: 0.2, category: 'side' },
  '보쌈김치': { calories: 25, carbs: 3.5, protein: 1.2, fat: 0.3, category: 'side' },

  // Desserts
  '모닝빵': { calories: 125, carbs: 22, protein: 4, fat: 2.5, category: 'dessert' },
  '요구르트': { calories: 65, carbs: 15, protein: 1, fat: 0.5, category: 'dessert' },
  '방울토마토': { calories: 25, carbs: 5, protein: 1, fat: 0.2, category: 'dessert' },
  '단무지': { calories: 10, carbs: 2, protein: 0.1, fat: 0.05, category: 'dessert' },
};

export default function CalculatorView({ meals }: CalculatorViewProps) {
  const [today] = useState<Date>(getTodayKST());
  const [activeDate] = useState<Date>(() => getDefaultSelectedDate(today));
  
  // Tab category state: 'all' | 'rice' | 'soup' | 'side' | 'dessert'
  const [filter, setFilter] = useState<'all' | 'rice' | 'soup' | 'side' | 'dessert'>('all');
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  // Fetch today's (or next Monday's) lunch
  const todayLunch = useMemo(() => {
    const key = formatDateKey(activeDate);
    return meals.find((m) => m.dateKey === key && m.mealType === 'lunch');
  }, [meals, activeDate]);

  // Construct structured calculation items for each dish inside today's lunch
  const calculableDishes = useMemo<DishCalculable[]>(() => {
    if (!todayLunch) return [];

    return todayLunch.dishes.map((dishName) => {
      const p = DISH_NUTRITION_PROFILES[dishName] || {};
      
      // Dynamic fallback based on title terms if no precise profile exists
      let category: 'rice' | 'soup' | 'side' | 'dessert' = 'side';
      let calories = 150;
      let carbs = 15;
      let protein = 5;
      let fat = 3;

      if (dishName.includes('밥') || dishName.endsWith('라멘')) {
        category = 'rice';
        calories = 300;
        carbs = 62;
        protein = 5;
        fat = 1;
      } else if (dishName.includes('국') || dishName.includes('찌개') || dishName.endsWith('스프')) {
        category = 'soup';
        calories = 130;
        carbs = 8;
        protein = 8;
        fat = 5;
      } else if (dishName.includes('요구르트') || dishName.includes('우유') || dishName.endsWith('빵') || dishName.includes('에이드') || dishName.includes('푸딩') || dishName.includes('토마토')) {
        category = 'dessert';
        calories = 80;
        carbs = 18;
        protein = 1.5;
        fat = 0.5;
      }

      return {
        name: dishName,
        calories: p.calories ?? calories,
        carbs: p.carbs ?? carbs,
        protein: p.protein ?? protein,
        fat: p.fat ?? fat,
        category: p.category ?? category,
        badge: p.badge,
      };
    });
  }, [todayLunch]);

  // Map dish names to checked state (defaulting to ALL checked since the instructions request: "기본 선택 메뉴는 오늘 날짜의 중식 메뉴를 기준으로 구성")
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (!todayLunch) return {};
    const initial: Record<string, boolean> = {};
    todayLunch.dishes.forEach((dh) => {
      initial[dh] = true;
    });
    return initial;
  });

  // Calculate accumulated totals
  const totals = useMemo(() => {
    let totCal = 0;
    let totCarbs = 0;
    let totProt = 0;
    let totFat = 0;

    calculableDishes.forEach((dish) => {
      if (checkedItems[dish.name]) {
        totCal += dish.calories;
        totCarbs += dish.carbs;
        totProt += dish.protein;
        totFat += dish.fat;
      }
    });

    return {
      calories: totCal,
      carbs: totCarbs,
      protein: totProt,
      fat: totFat,
    };
  }, [calculableDishes, checkedItems]);

  // Toggle selection
  const handleToggleItem = (dishName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [dishName]: !prev[dishName],
    }));
  };

  // Filter items based on active category chip
  const filteredDishes = useMemo(() => {
    if (filter === 'all') return calculableDishes;
    return calculableDishes.filter((d) => d.category === filter);
  }, [calculableDishes, filter]);

  // Save results handler
  const handleSaveResult = () => {
    localStorage.setItem('saved_nutrition_calculation', JSON.stringify({
      date: formatDateKey(activeDate),
      calories: totals.calories,
      carbs: totals.carbs,
      protein: totals.protein,
      fat: totals.fat,
      savedAt: new Date().toISOString()
    }));
    
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2500);
  };

  // Target recommendations (Daily guidance)
  const DailyCaps = {
    calories: 2400, // standard teenage daily guidance
    carbs: 300,
    protein: 60,
    fat: 50
  };

  const calPercentage = Math.round((totals.calories / DailyCaps.calories) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Toast popup */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-primary text-white font-gmarket text-xs font-bold px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            영양 계산 결과가 성공적으로 저장되었습니다!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title & Icon */}
      <div className="flex items-center gap-2">
        <Calculator className="w-6 h-6 text-primary-container" />
        <h2 className="font-gmarket text-xl text-on-surface font-bold">영양 계산기</h2>
      </div>

      {/* Nutrition Summary Card */}
      <section className="bg-white rounded-[24px] p-5 shadow-[0px_4px_20px_rgba(79,111,0,0.08)]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="font-gmarket text-xs text-on-surface-variant font-medium">오늘의 선택 영양</p>
            <h3 className="font-gmarket-bold text-display-date text-primary mt-1">
              {totals.calories} <span className="text-lg font-gmarket">kcal</span>
            </h3>
          </div>
          <div className="bg-secondary text-white px-3.5 py-1.5 rounded-full font-gmarket text-[11px] font-bold shadow-sm">
            일일 권장량 {calPercentage}%
          </div>
        </div>

        <div className="h-[1px] bg-secondary-container/20 mb-4" />

        {/* Dynamic Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-[11px] font-gmarket font-bold">
              <span className="text-on-surface-variant">탄수화물</span>
              <span className="text-primary">{totals.carbs}g / {DailyCaps.carbs}g</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (totals.carbs / DailyCaps.carbs) * 100)}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-[11px] font-gmarket font-bold">
              <span className="text-on-surface-variant">단백질</span>
              <span className="text-primary">{totals.protein}g / {DailyCaps.protein}g</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (totals.protein / DailyCaps.protein) * 100)}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-[11px] font-gmarket font-bold">
              <span className="text-on-surface-variant">지방</span>
              <span className="text-primary">{totals.fat}g / {DailyCaps.fat}g</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (totals.fat / DailyCaps.fat) * 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Filter Chips Row */}
      <section className="no-scrollbar overflow-x-auto pb-1">
        <div className="flex gap-2">
          {(['all', 'rice', 'soup', 'side', 'dessert'] as const).map((cat) => {
            const labelMap = { all: '전체', rice: '밥류', soup: '국/찌개', side: '반찬', dessert: '디저트' };
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-gmarket text-[11px] font-bold transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-primary-container text-white border-primary-container' 
                    : 'bg-white text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                {labelMap[cat]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Lists of items inside today's lunch */}
      <section className="space-y-3.5 pb-24">
        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-on-surface-variant font-gmarket text-xs">
            이 분류에 해당하는 메뉴가 없습니다.
          </div>
        ) : (
          filteredDishes.map((dish, idx) => {
            const isChecked = !!checkedItems[dish.name];
            
            return (
              <div
                key={idx}
                onClick={() => handleToggleItem(dish.name)}
                className={`bg-white rounded-2xl p-4 shadow-[0px_4px_16px_rgba(79,111,0,0.04)] border-2 cursor-pointer transition-all duration-200 active:scale-[0.98] flex items-center justify-between ${
                  isChecked 
                    ? 'border-primary bg-[#fffbf7]' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Category icon block */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-gmarket ${
                    isChecked ? 'bg-secondary-fixed text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {dish.category === 'rice' && '🌾'}
                    {dish.category === 'soup' && '🍲'}
                    {dish.category === 'side' && '🍖'}
                    {dish.category === 'dessert' && '🍉'}
                  </div>

                  <div>
                    <h4 className="font-gmarket text-body-lg text-on-surface font-bold">
                      {dish.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <p className="text-[11px] font-gmarket text-on-surface-variant opacity-85">
                        {dish.calories} kcal · 탄수{dish.carbs}g · 단백{dish.protein}g · 지방{dish.fat}g
                      </p>
                      {dish.badge && (
                        <span className="bg-[#FFE7DD] text-[#93000a] px-1.5 py-0.5 rounded text-[8px] font-bold">
                          {dish.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Check circle */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isChecked 
                    ? 'bg-primary border-primary text-white' 
                    : 'border-outline-variant text-transparent'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Sticky Bottom Storage Button */}
      <div className="fixed bottom-20 left-0 w-full px-6 pb-4 z-40 bg-gradient-to-t from-background via-background/90 to-transparent pt-4">
        <button
          onClick={handleSaveResult}
          className="w-full max-w-[342px] mx-auto h-14 bg-primary text-white rounded-full font-gmarket text-[15px] font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-primary-container active:scale-95 cursor-pointer transition-transform"
        >
          계산 결과 저장하기
          <Save className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
