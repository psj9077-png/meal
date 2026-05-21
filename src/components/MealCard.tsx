/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MealData } from '../types';

interface MealCardProps {
  meal: MealData;
}

export default function MealCard({ meal }: MealCardProps) {
  const isLunch = meal.mealType === 'lunch';
  
  // Choose styling depending on Lunch or Dinner
  const accentBorderColor = isLunch ? 'border-primary' : 'border-secondary';
  const badgeColor = isLunch ? 'bg-primary text-white' : 'bg-secondary text-white';
  
  return (
    <div className={`bg-white rounded-[24px] p-5 shadow-[0px_4px_20px_rgba(79,111,0,0.08)] border-l-4 ${accentBorderColor} transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0px_6px_24px_rgba(79,111,0,0.12)]`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-gmarket text-lg font-bold text-on-surface">
          {isLunch ? '중식 ☀️' : '석식 🌙'}
        </h4>
        <span className={`px-3 py-1 ${badgeColor} text-xs font-bold rounded-full font-gmarket`}>
          {meal.totalCalories} kcal
        </span>
      </div>
      
      <ul className="space-y-3 pl-1 mb-5">
        {meal.dishes.map((dish, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${isLunch ? 'bg-primary/40' : 'bg-secondary/40'}`} />
            <span className="text-on-surface font-medium text-body-lg">{dish}</span>
          </li>
        ))}
      </ul>
      
      {meal.allergens.length > 0 && (
        <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap gap-1.5">
          {meal.allergens.map((allergen, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isLunch 
                  ? 'bg-error-container/20 text-error' 
                  : 'bg-tertiary-container/20 text-tertiary-container'
              }`}
            >
              {allergen}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
