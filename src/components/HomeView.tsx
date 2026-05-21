/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Flame } from 'lucide-react';
import { MealData } from '../types';
import { getTodayKST, formatKoreanDate, formatDateKey } from '../utils';
import MealCard from './MealCard';

interface HomeViewProps {
  key?: any;
  meals: MealData[];
  onNavigateToCalendar: () => void;
}

// Map high quality food photo assets matching the daily menu template
const MEAL_IMAGES: Record<string, string> = {
  '치즈돈까스 정식': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFODXlRwUqtYMPrmaI6u6ZPuMRlA3cBgi6AE_1EnWLkwhT31_w48mJnhgJq6KtvjC9z4GGNxR4ao5KtDrzrna_CudKuTGwmWlvm1Fvbc5aFh3eIEPkxhVbbAwA1WCaX75RIJkXUVgaITkyBWjvRTFQK2gTRzrh77s0Drt4MzSj4D-FlHsJu8TOWOdQwOcMjDvz2RYy35yqzUQ1dV6SvttqjuKSa3CX1Sr0VvDlKSqv_2wdW_bLK5sqgIPmPmd0e5DvE3NLewRyPHs', // Cutlet from mockup
  '수제함박스테이크 정식': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
  '얼큰순두부찌개 & 보쌈정식': 'https://images.unsplash.com/photo-1529692236671-f1f6e994a52c?auto=format&fit=crop&q=80&w=600',
  '안동찜닭 정식': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600',
  '돈코츠라멘 & 주먹밥': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600',
};

const MEAL_DESCRIPTIONS: Record<string, string> = {
  '치즈돈까스 정식': '바삭한 튀김옷 속에 고소한 모짜렐라 치즈가 듬뿍 들어간 오늘 최고의 인기 메뉴입니다.',
  '수제함박스테이크 정식': '육즙 가득한 도톰한 패티 위에 특제 데미글라스 소스를 올린 촉촉한 양식 메뉴입니다.',
  '얼큰순두부찌개 & 보쌈정식': '몽글몽글 순두부를 시원하게 끊여낸 찌개와 정성껏 삶은 쫄깃한 한방보쌈입니다.',
  '안동찜닭 정식': '달콤 짭조름한 간장 베이스에 야채와 야들야들한 닭고기, 둥근 당면을 넣고 졸인 고소한 찜닭입니다.',
  '돈코츠라멘 & 주먹밥': '장시간 고아낸 돈골 육수의 진하고 고소한 라멘 국물과 바삭한 김주먹밥 시너지!',
};

export default function HomeView({ meals, onNavigateToCalendar }: HomeViewProps) {
  const [today, setToday] = useState<Date>(getTodayKST());
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    return localStorage.getItem('school_meal_liked_today') === 'true';
  });

  // Calculate day details
  const dayOfWeekNum = today.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayOfWeekNum === 0 || dayOfWeekNum === 6;

  // For weekend (Way B): Find the next Monday's date
  let displayDate = today;
  let hasNextBadge = false;

  if (isWeekend) {
    hasNextBadge = true;
    displayDate = new Date(today);
    const dayOffset = dayOfWeekNum === 6 ? 2 : 1; // Sat -> +2 days, Sun -> +1 day
    displayDate.setDate(today.getDate() + dayOffset);
  }

  const dKey = formatDateKey(displayDate);
  const todaysMeals = meals.filter((m) => m.dateKey === dKey);
  const lunchMeal = todaysMeals.find((m) => m.mealType === 'lunch');
  const dinnerMeal = todaysMeals.find((m) => m.mealType === 'dinner');

  // Handle Heart Toggle
  const toggleHeart = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    localStorage.setItem('school_meal_liked_today', String(nextState));
  };

  const imageSrc = lunchMeal ? (MEAL_IMAGES[lunchMeal.title] || MEAL_IMAGES['치즈돈까스 정식']) : MEAL_IMAGES['치즈돈까스 정식'];
  const descText = lunchMeal ? (MEAL_DESCRIPTIONS[lunchMeal.title] || '') : '건강하고 신선한 재료로 준비한 영양 가득한 오늘의 시그니처 급식입니다.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Date and Header Section */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-gmarket text-primary font-bold text-lg">
              {formatKoreanDate(displayDate)}
            </p>
            {hasNextBadge && (
              <span className="bg-primary/15 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                다음 급식일 📅
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-on-background tracking-tight">
            오늘의 맛있는 급식 🍱
          </h2>
        </div>
      </div>

      {isWeekend && (
        <div className="bg-secondary-container/25 text-on-secondary-container text-body-md p-4 rounded-xl flex flex-col gap-1 shadow-sm border border-secondary-container/30">
          <span className="font-bold">✨ 즐거운 주말입니다!</span>
          <p className="text-xs opacity-90 leading-relaxed">
            주말 동안은 급식이 제공되지 않습니다. 다음 주 월요일의 미리 보는 식단을 소개해 드릴게요. 맛있고 든든하게 한 주를 준비하세요!
          </p>
        </div>
      )}

      {/* Hero Meal Card */}
      {lunchMeal && (
        <div className="relative w-full bg-white rounded-[24px] overflow-hidden shadow-[0px_4px_20px_rgba(79,111,0,0.08)] transition-all duration-300 hover:shadow-[0px_8px_30px_rgba(79,111,0,0.12)]">
          <div className="relative h-56 w-full">
            <img
              alt={lunchMeal.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              src={imageSrc}
            />
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold font-gmarket shadow-sm">
              오늘의 추천 급식
            </div>
          </div>
          
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-on-surface font-gmarket-bold">
                  {lunchMeal.title}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  {descText}
                </p>
              </div>
              
              <button
                onClick={toggleHeart}
                className={`p-2.5 rounded-full border border-outline-variant/10 cursor-pointer active:scale-90 transition-all ${
                  isLiked ? 'bg-error-container/20 text-error' : 'bg-surface-container text-on-surface-variant hover:bg-outline-variant/10'
                }`}
              >
                <Heart
                  className="w-5 h-5 transition-transform"
                  fill={isLiked ? '#ba1a1a' : 'transparent'}
                  stroke={isLiked ? '#ba1a1a' : '#444939'}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-secondary-container/30">
              <span className="flex items-center gap-1 text-primary font-bold font-gmarket">
                <Flame className="w-4 h-4 text-primary fill-primary/10" />
                {lunchMeal.totalCalories} kcal
              </span>
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 bg-secondary-container/40 text-secondary text-[10px] font-bold rounded">
                  인기
                </span>
                <span className="px-2 py-0.5 bg-secondary-container/40 text-secondary text-[10px] font-bold rounded">
                  고단백
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Meals Lists */}
      <section className="space-y-4">
        {lunchMeal && <MealCard meal={lunchMeal} />}
        {dinnerMeal && <MealCard meal={dinnerMeal} />}
      </section>

      {/* Direct Navigate to Calendar info card */}
      <button 
        onClick={onNavigateToCalendar}
        className="w-full py-4 text-center border-2 border-dashed border-outline-variant/30 text-on-surface-variant font-gmarket text-sm rounded-xl hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
      >
        주간 식단표 전체 일정 보러가기 →
      </button>
    </motion.div>
  );
}
