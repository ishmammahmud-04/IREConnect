import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

interface ProfileCompletenessCardProps {
  user?: User;
}

const getProfileItems = (user: User) => [
  { label: 'Add a headline', complete: Boolean(user.headline.trim()) },
  { label: 'Write a short bio', complete: Boolean(user.bio.trim()) },
  { label: 'Add your skills', complete: user.skills.length > 0 },
  { label: 'Add education', complete: user.education.length > 0 },
  { label: 'Add experience', complete: user.experience.length > 0 },
  { label: 'Connect an external profile', complete: Object.values(user.externalLinks).some(Boolean) },
  { label: 'Upload your CV', complete: Boolean(user.cvUrl || user.cvPath) }
];

export const ProfileCompletenessCard: React.FC<ProfileCompletenessCardProps> = ({ user }) => {
  const { currentUser, setIsSettingsModalOpen } = useApp();
  const profile = user || currentUser;
  const storageKey = `ireconnect:onboarding-dismissed:${profile.id}`;
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(window.localStorage.getItem(storageKey) === 'true');
  }, [storageKey]);

  const items = useMemo(() => getProfileItems(profile), [profile]);
  const completedCount = items.filter((item) => item.complete).length;
  const isOwnProfile = profile.id === currentUser.id;

  if (!isOwnProfile || isDismissed || completedCount === items.length) return null;

  const dismiss = () => {
    window.localStorage.setItem(storageKey, 'true');
    setIsDismissed(true);
  };

  return (
    <section className="relative rounded-xl border border-blue-200 bg-blue-50/70 p-4 shadow-2xs">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss profile setup reminder"
        className="absolute right-3 top-3 rounded-lg p-1 text-blue-500 hover:bg-blue-100"
      >
        <span className="material-symbols-outlined text-[17px]">close</span>
      </button>
      <div className="pr-7">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Welcome to IREConnect</p>
        <h2 className="mt-1 font-heading text-base font-bold text-slate-900">Complete your profile</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Add a few details so classmates and collaborators can find the right context about you.
        </p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-100">
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${(completedCount / items.length) * 100}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-blue-700">{completedCount} of {items.length} complete</span>
        <button
          type="button"
          onClick={() => setIsSettingsModalOpen(true)}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700"
        >
          Update profile
        </button>
      </div>
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.label} className={`flex items-center gap-1.5 text-[11px] ${item.complete ? 'text-emerald-700' : 'text-slate-600'}`}>
            <span className="material-symbols-outlined text-[15px]">{item.complete ? 'check_circle' : 'radio_button_unchecked'}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
