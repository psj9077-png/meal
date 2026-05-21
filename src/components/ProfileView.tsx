/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Plus, ChevronRight, LogOut, Check, X } from 'lucide-react';

export default function ProfileView() {
  // Reactive user profile state
  const [name, setName] = useState<string>(() => localStorage.getItem('profile_name') || '김학생');
  const [studentDetails, setStudentDetails] = useState<string>(
    () => localStorage.getItem('profile_details') || '2학년 3반 15번'
  );
  
  // Edit profile dialog state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editDetails, setEditDetails] = useState<string>('');

  // Switches
  const [allergyAlert, setAllergyAlert] = useState<boolean>(() => {
    return localStorage.getItem('settings_allergy_alert') !== 'false';
  });
  const [dailyAlert, setDailyAlert] = useState<boolean>(() => {
    return localStorage.getItem('settings_daily_alert') !== 'false';
  });

  // Allergy chips list
  const [allergies, setAllergies] = useState<string[]>(() => {
    const saved = localStorage.getItem('profile_allergies');
    return saved ? JSON.parse(saved) : ['우유', '땅콩'];
  });

  // Allergy selector modal
  const [allergyModal, setAllergyModal] = useState<boolean>(false);
  const popularAllergens = ['대두', '밀', '쇠고기', '돼지고기', '난류', '우유', '땅콩', '새우', '오징어', '복숭아'];

  const toggleAllergyAlert = () => {
    const next = !allergyAlert;
    setAllergyAlert(next);
    localStorage.setItem('settings_allergy_alert', String(next));
  };

  const toggleDailyAlert = () => {
    const next = !dailyAlert;
    setDailyAlert(next);
    localStorage.setItem('settings_daily_alert', String(next));
  };

  const handleEditProfile = () => {
    setEditName(name);
    setEditDetails(studentDetails);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (editName.trim()) {
      setName(editName);
      localStorage.setItem('profile_name', editName);
    }
    if (editDetails.trim()) {
      setStudentDetails(editDetails);
      localStorage.setItem('profile_details', editDetails);
    }
    setIsEditing(false);
  };

  const handleAddAllergen = (allergen: string) => {
    let next: string[];
    if (allergies.includes(allergen)) {
      next = allergies.filter((a) => a !== allergen);
    } else {
      next = [...allergies, allergen];
    }
    setAllergies(next);
    localStorage.setItem('profile_allergies', JSON.stringify(next));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Title */}
      <h2 className="font-gmarket text-xl text-on-surface font-bold pb-1">내 프로필</h2>

      {/* Profile Card Section */}
      <section className="mb-6">
        <div className="relative bg-gradient-to-br from-white via-white to-secondary-container/20 rounded-2xl p-5 shadow-[0px_4px_20px_rgba(79,111,0,0.08)] flex items-center gap-5 overflow-hidden border border-outline-variant/10">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-container/20 rounded-full blur-3xl"></div>
          
          {/* Avatar frame */}
          <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md flex-shrink-0 overflow-hidden">
            <img
              alt="Student Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqwlM29HRYO8RsKveHxu_27tr_qMP2Isgxy53N3GHUPDoFM_ZXCphimkd0OIR3p0xyoxKsw1fb_e3H5sQuNTR0qyVElJiDtS3LiXf0qTIBvyleQq4maVaxOI6BG4LuHjjtJCwjHP8-xdpy5IJggmBf3OjJTZZ1AMT4RrX8r1EttmhAt7H4R-DskaHdIdiU43l-96BJoruRj4Z-lfp8BlPXOIh_FDG3mkANCkWa0_aRPqV9qWyGxzgyfxGzvgqUUxgFnKaYE1cOMSA"
            />
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-gmarket text-display-date text-on-surface font-bold">
                {name}
              </h2>
              <button
                onClick={handleEditProfile}
                className="flex items-center justify-center p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="font-gmarket text-xs text-on-surface-variant opacity-85">{studentDetails}</p>
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className="space-y-4">
        {/* Allergy alert card */}
        <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_20px_rgba(79,111,0,0.08)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-gmarket text-headline-md text-on-surface mb-1">알레르기 경고 알림</h3>
              <p className="font-gmarket text-xs text-on-surface-variant opacity-80 leading-relaxed">
                식단에 등록된 알레르기 유발 물질 포함 시 알림
              </p>
            </div>
            
            {/* Custom switch */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allergyAlert}
                onChange={toggleAllergyAlert}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-outline-variant/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {allergies.map((allergen, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-gmarket text-[11px] font-bold"
              >
                {allergen}
              </span>
            ))}
            <button
              onClick={() => setAllergyModal(true)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant font-gmarket text-[11px] font-bold active:scale-95 transition-transform hover:bg-surface-container-high cursor-pointer"
            >
              <Plus className="w-3 h-3 mr-1" /> 추가
            </button>
          </div>
        </div>

        {/* Daily menu alert card */}
        <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_20px_rgba(79,111,0,0.08)] flex justify-between items-center border border-outline-variant/10">
          <div>
            <h3 className="font-gmarket text-headline-md text-on-surface mb-1">일일 식단 알림</h3>
            <p className="font-gmarket text-xs text-on-surface-variant opacity-80">
              매일 아침 8시에 오늘의 메뉴 알림
            </p>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dailyAlert}
              onChange={toggleDailyAlert}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-outline-variant/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Menu list */}
        <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(79,111,0,0.08)] overflow-hidden border border-outline-variant/10">
          <button className="w-full px-5 py-4.5 flex justify-between items-center border-b border-surface-container-highest hover:bg-surface-container-low transition-colors cursor-pointer text-left">
            <span className="font-gmarket text-body-lg text-on-surface">고객센터 / 문의하기</span>
            <ChevronRight className="w-5 h-5 text-outline" />
          </button>
          
          <button className="w-full px-5 py-4.5 flex justify-between items-center border-b border-surface-container-highest hover:bg-surface-container-low transition-colors cursor-pointer text-left">
            <span className="font-gmarket text-body-lg text-on-surface">이용약관</span>
            <ChevronRight className="w-5 h-5 text-outline" />
          </button>
          
          <button className="w-full px-5 py-4.5 flex justify-between items-center hover:bg-error-container/10 transition-colors cursor-pointer group text-left">
            <span className="font-gmarket text-body-lg text-error group-hover:font-bold transition-all">
              로그아웃
            </span>
            <LogOut className="w-5 h-5 text-error" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 mb-4 text-center">
        <p className="font-gmarket text-xs text-outline mb-1">© 2026 씨마스고등학교 급식</p>
        <p className="font-gmarket text-xs text-on-surface-variant opacity-70">
          건강하고 맛있는 학교 식단을 지원합니다.
        </p>
      </footer>

      {/* Profile Edit Dialog Overlay */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-6 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[24px] p-6 max-w-sm w-full space-y-4"
            >
              <h3 className="font-gmarket-bold text-lg text-primary text-center">프로필 편집 ✏️</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-gmarket text-on-surface-variant block mb-1">이름</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border-2 border-outline-variant/45 rounded-xl px-4 py-2.5 font-gmarket text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div>
                  <label className="text-xs font-gmarket text-on-surface-variant block mb-1">상세 정보</label>
                  <input
                    type="text"
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                    className="w-full border-2 border-outline-variant/45 rounded-xl px-4 py-2.5 font-gmarket text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-surface-container rounded-full text-on-surface-variant font-gmarket text-xs font-bold active:scale-95 transition-transform cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 bg-primary text-white rounded-full font-gmarket text-xs font-bold active:scale-95 transition-transform cursor-pointer"
                >
                  저장
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Allergy Selector Modal */}
      <AnimatePresence>
        {allergyModal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-5 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[24px] p-6 max-w-sm w-full space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-gmarket-bold text-base text-primary">알레르기 유발 물질 추가</h3>
                <button onClick={() => setAllergyModal(false)} className="text-on-surface hover:text-error">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                {popularAllergens.map((alg) => {
                  const hasAllergy = allergies.includes(alg);
                  return (
                    <button
                      key={alg}
                      onClick={() => handleAddAllergen(alg)}
                      className={`py-2 px-3 rounded-xl border text-left flex justify-between items-center text-xs font-gmarket transition-all cursor-pointer ${
                        hasAllergy 
                          ? 'border-primary bg-secondary-container/20 text-primary font-bold' 
                          : 'border-outline-variant/30 bg-surface text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {alg}
                      {hasAllergy && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setAllergyModal(false)}
                className="w-full py-3 bg-primary text-white rounded-full font-gmarket text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-transform"
              >
                선택 완료
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
