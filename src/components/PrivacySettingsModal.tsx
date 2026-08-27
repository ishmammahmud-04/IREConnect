import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VisibilityLevel, PrivacySettings, NotificationSettings } from '../types';

export const PrivacySettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    currentUser,
    setCurrentUser,
    showToast
  } = useApp();

  const [cvVis, setCvVis] = useState<VisibilityLevel>('department');
  const [emailVis, setEmailVis] = useState<VisibilityLevel>('private');
  const [phoneVis, setPhoneVis] = useState<VisibilityLevel>('connections');
  const [projectsVis, setProjectsVis] = useState<VisibilityLevel>('public');
  const [experienceVis, setExperienceVis] = useState<VisibilityLevel>('public');
  
  const [allowMentorship, setAllowMentorship] = useState<boolean>(true);
  const [notifAnnouncements, setNotifAnnouncements] = useState<boolean>(true);
  const [notifOpportunityAlerts, setNotifOpportunityAlerts] = useState<boolean>(true);
  const [notifConnectionRequests, setNotifConnectionRequests] = useState<boolean>(true);

  // Sync state when modal opens or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setCvVis(currentUser.privacy?.cv || 'department');
      setEmailVis(currentUser.privacy?.email || 'private');
      setPhoneVis(currentUser.privacy?.phone || 'connections');
      setProjectsVis(currentUser.privacy?.projects || 'public');
      setExperienceVis(currentUser.privacy?.experience || 'public');
      setAllowMentorship(currentUser.isAvailableForMentorship ?? true);
      setNotifAnnouncements(currentUser.notificationSettings?.announcements ?? true);
      setNotifOpportunityAlerts(currentUser.notificationSettings?.opportunityAlerts ?? true);
      setNotifConnectionRequests(currentUser.notificationSettings?.connectionRequests ?? true);
    }
  }, [currentUser, isSettingsModalOpen]);

  if (!isSettingsModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPrivacy: PrivacySettings = {
      cv: cvVis,
      email: emailVis,
      phone: phoneVis,
      experience: experienceVis,
      projects: projectsVis,
      achievements: currentUser?.privacy?.achievements || 'public',
      publications: currentUser?.privacy?.publications || 'public',
      externalLinks: currentUser?.privacy?.externalLinks || 'public'
    };

    const updatedNotifications: NotificationSettings = {
      connectionRequests: notifConnectionRequests,
      acceptedConnections: currentUser?.notificationSettings?.acceptedConnections ?? true,
      opportunityAlerts: notifOpportunityAlerts,
      deadlineReminders: currentUser?.notificationSettings?.deadlineReminders ?? true,
      announcements: notifAnnouncements,
      events: currentUser?.notificationSettings?.events ?? false,
      contentInteractions: currentUser?.notificationSettings?.contentInteractions ?? true,
      mentorshipRequests: allowMentorship
    };

    setCurrentUser({
      ...currentUser,
      privacy: updatedPrivacy,
      notificationSettings: updatedNotifications,
      isAvailableForMentorship: allowMentorship
    });

    showToast('Privacy & notification preferences saved successfully');
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">lock</span>
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Privacy &amp; Ecosystem Settings
            </h2>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5">
          {/* Visibility Section */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Data &amp; Contact Visibility</p>
            
            {/* CV Visibility */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Curriculum Vitae (CV) Access</label>
              <select
                value={cvVis}
                onChange={(e) => setCvVis(e.target.value as VisibilityLevel)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="public">Public (Everyone on Internet)</option>
                <option value="department">Verified Department Only (Students, Faculty, Alumni)</option>
                <option value="connections">Direct Connections Only</option>
                <option value="private">Private (Only Me)</option>
              </select>
            </div>

            {/* Email & Phone Visibility */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Email Visibility</label>
                <select
                  value={emailVis}
                  onChange={(e) => setEmailVis(e.target.value as VisibilityLevel)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="public">Public</option>
                  <option value="department">Department</option>
                  <option value="connections">Connections</option>
                  <option value="private">Private (Hidden)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Phone Visibility</label>
                <select
                  value={phoneVis}
                  onChange={(e) => setPhoneVis(e.target.value as VisibilityLevel)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="private">Private (Hidden)</option>
                  <option value="connections">Connections</option>
                  <option value="department">Department</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>

            {/* Projects & Experience Visibility */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Projects Showcase</label>
                <select
                  value={projectsVis}
                  onChange={(e) => setProjectsVis(e.target.value as VisibilityLevel)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="public">Public to All</option>
                  <option value="department">Department Only</option>
                  <option value="connections">Connections Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Experience History</label>
                <select
                  value={experienceVis}
                  onChange={(e) => setExperienceVis(e.target.value as VisibilityLevel)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="public">Public to All</option>
                  <option value="department">Department Only</option>
                  <option value="connections">Connections Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mentorship & Notification Toggles */}
          <div className="space-y-2 pt-2.5 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Mentorship &amp; Notifications</p>
            
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="text-xs text-slate-800 font-medium block">Accept Inbound Mentorship Requests</span>
                <span className="text-[10px] text-slate-500">Show "Request Mentorship" button on your profile</span>
              </div>
              <input
                type="checkbox"
                checked={allowMentorship}
                onChange={(e) => setAllowMentorship(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-slate-800 font-medium">Department Official Bulletins &amp; Alerts</span>
              <input
                type="checkbox"
                checked={notifAnnouncements}
                onChange={(e) => setNotifAnnouncements(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-slate-800 font-medium">Auto-Notify on New Opportunity Matches</span>
              <input
                type="checkbox"
                checked={notifOpportunityAlerts}
                onChange={(e) => setNotifOpportunityAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs text-slate-800 font-medium">Notify on Inbound Connection Requests</span>
              <input
                type="checkbox"
                checked={notifConnectionRequests}
                onChange={(e) => setNotifConnectionRequests(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
            >
              Save Privacy Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

