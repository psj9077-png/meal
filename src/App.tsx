/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Bell, Settings, Home, Calendar, Calculator, User } from 'lucide-react';
import { ViewType } from './types';
import { getTodayKST, getWeekDates } from './utils';
import { generateMealsForWeek } from './data';
import HomeView from './components/HomeView';
import CalendarView from './components/CalendarView';
import CalculatorView from './components/CalculatorView';
import ProfileView from './components/ProfileView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewType>('home');

  // Dynamically generate 5 days (Monday to Friday) of nutritious school meals in KST context
  const todayKST = useMemo(() => getTodayKST(), []);
  const currentWeekDates = useMemo(() => getWeekDates(todayKST), [todayKST]);
  
  // Create meal items database dynamically for the active week
  const mealsDb = useMemo(() => generateMealsForWeek(currentWeekDates), [currentWeekDates]);

  return (
    <div className="bg-background text-on-surface font-gmarket flex justify-center min-h-screen">
      <div className="w-full max-w-[390px] bg-background min-h-screen relative flex flex-col shadow-[0px_0px_50px_rgba(79,111,0,0.04)]">
        
        {/* TopAppBar header */}
        <header className="fixed top-0 left-0 right-0 mx-auto max-w-[390px] h-16 px-6 flex justify-between items-center z-50 bg-surface border-b border-outline-variant/10 shadow-[0px_4px_20px_rgba(79,111,0,0.04)]">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary stroke-[2.5]" />
            <h1 className="font-gmarket-bold text-base font-bold text-primary">
              씨마스고등학교 급식
            </h1>
          </div>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary-container/10 active:scale-95 transition-all text-on-surface-variant cursor-pointer">
            {activeTab === 'profile' ? (
              <Settings className="w-5 h-5 stroke-[2]" />
            ) : (
              <Bell className="w-5 h-5 stroke-[2]" />
            )}
          </button>
        </header>

        {/* Scrollable Center Main Screen */}
        <main className="flex-1 pt-20 pb-32 px-6 overflow-y-auto w-full no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <HomeView 
                key="home" 
                meals={mealsDb} 
                onNavigateToCalendar={() => setActiveTab('calendar')} 
              />
            )}
            {activeTab === 'calendar' && (
              <CalendarView 
                key="calendar" 
                meals={mealsDb} 
              />
            )}
            {activeTab === 'calculator' && (
              <CalculatorView 
                key="calculator" 
                meals={mealsDb} 
              />
            )}
            {activeTab === 'profile' && (
              <ProfileView 
                key="profile" 
              />
            )}
          </AnimatePresence>
        </main>

        {/* Floating / Sticky Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-[390px] h-20 bg-surface border-t border-outline-variant/20 flex justify-around items-center px-2 pb-safe z-50 rounded-t-2xl shadow-[0px_-4px_20px_rgba(79,111,0,0.03)]">
          
          {/* NAV HOME */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-primary text-white rounded-full px-5 py-2 shadow-md hover:opacity-95'
                : 'text-on-surface-variant hover:bg-secondary-container/15 px-4 py-2 rounded-xl'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-bold mt-1">홈</span>
          </button>

          {/* NAV CALENDAR */}
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-primary text-white rounded-full px-5 py-2 shadow-md hover:opacity-95'
                : 'text-on-surface-variant hover:bg-secondary-container/15 px-4 py-2 rounded-xl'
            }`}
          >
            <Calendar className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-bold mt-1">식단표</span>
          </button>

          {/* NAV CALCULATOR */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-primary text-white rounded-full px-5 py-2 shadow-md hover:opacity-95'
                : 'text-on-surface-variant hover:bg-secondary-container/15 px-4 py-2 rounded-xl'
            }`}
          >
            <Calculator className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-bold mt-1">영양계산</span>
          </button>

          {/* NAV PROFILE */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary text-white rounded-full px-5 py-2 shadow-md hover:opacity-95'
                : 'text-on-surface-variant hover:bg-secondary-container/15 px-4 py-2 rounded-xl'
            }`}
          >
            <User className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-bold mt-1">프로필</span>
          </button>

        </nav>

      </div>
    </div>
  );
}
