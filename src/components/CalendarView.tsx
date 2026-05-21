/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar } from 'lucide-react';
import { MealData } from '../types';
import { 
  getTodayKST, 
  getWeekDates, 
  getWeekOfMonth, 
  formatDateKey, 
  getDefaultSelectedDate 
} from '../utils';
import MealCard from './MealCard';

interface CalendarViewProps {
  key?: any;
  meals: MealData[];
}

const WEEKDAYS_SHORT = ['월', '화', '수', '목', '금'];

export default function CalendarView({ meals }: CalendarViewProps) {
  // Get current week dates (Monday - Friday) based on KST today
  const [today] = useState<Date>(getTodayKST());
  const [weekDates] = useState<Date[]>(() => getWeekDates(today));
  
  // Choose default selected date
  const [selectedDate, setSelectedDate] = useState<Date>(() => getDefaultSelectedDate(today));

  const weekTitle = getWeekOfMonth(selectedDate);
  const selectedKey = formatDateKey(selectedDate);

  // Filter meals for the selected date
  const filteredMeals = meals.filter((meal) => meal.dateKey === selectedKey);
  const lunchMeal = filteredMeals.find((meal) => meal.mealType === 'lunch');
  const dinnerMeal = filteredMeals.find((meal) => meal.mealType === 'dinner');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Title & Icon */}
      <div className="flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary" strokeWidth={2.5} />
        <h2 className="font-gmarket text-xl text-on-surface font-bold">주간 식단표</h2>
      </div>

      {/* Week Title Indicator */}
      <h3 className="font-gmarket-bold text-display-date text-primary text-center py-1">
        {weekTitle} 📅
      </h3>

      {/* Weekday Selection Bar */}
      <div className="bg-white rounded-2xl p-2.5 shadow-[0px_4px_20px_rgba(79,111,0,0.05)] border border-outline-variant/10">
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {weekDates.map((date, idx) => {
            const dateKey = formatDateKey(date);
            const isSelected = formatDateKey(selectedDate) === dateKey;
            const isRealToday = formatDateKey(today) === dateKey;
            
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center py-3.5 rounded-xl cursor-pointer transition-all duration-250 active:scale-95 ${
                  isSelected 
                    ? 'bg-primary text-white font-bold shadow-md' 
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="text-[11px] opacity-70 mb-1">
                  {WEEKDAYS_SHORT[idx]}
                </span>
                <span className={`text-[15px] font-gmarket font-bold relative ${isRealToday && !isSelected ? 'text-primary' : ''}`}>
                  {date.getDate()}
                  {isRealToday && (
                    <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Meals List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedKey}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {lunchMeal ? (
              <MealCard meal={lunchMeal} />
            ) : (
              <div className="text-center py-6 text-on-surface-variant font-gmarket text-sm">
                해당 날짜의 중식 정보가 없습니다.
              </div>
            )}

            {dinnerMeal ? (
              <MealCard meal={dinnerMeal} />
            ) : (
              <div className="text-center py-6 text-on-surface-variant font-gmarket text-sm">
                해당 날짜의 석식 정보가 없습니다.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
