import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Education, Experience, ExternalLinks, VisibilityLevel, PrivacySettings, NotificationSettings } from '../types';

export const PrivacySettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    currentUser,
    updateUserPrivacy,
    updateNotificationSettings,
    updateProfileBio,
    updateProfileDetails,
    showToast,
    updateProfileImage,
    isUploadingProfileImage
  } = useApp();

  const [cvVis, setCvVis] = useState<VisibilityLevel>('department');
  const [emailVis, setEmailVis] = useState<VisibilityLevel>('private');
  const [phoneVis, setPhoneVis] = useState<VisibilityLevel>('connections');
  const [projectsVis, setProjectsVis] = useState<VisibilityLevel>('public');
  const [experienceVis, setExperienceVis] = useState<VisibilityLevel>('public');
  const [shortBio, setShortBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [educationText, setEducationText] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [googleScholar, setGoogleScholar] = useState('');
  const [orcid, setOrcid] = useState('');
  
  const [allowMentorship, setAllowMentorship] = useState<boolean>(true);
  const [notifAnnouncements, setNotifAnnouncements] = useState<boolean>(true);
  const [notifOpportunityAlerts, setNotifOpportunityAlerts] = useState<boolean>(true);
  const [notifConnectionRequests, setNotifConnectionRequests] = useState<boolean>(true);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [cameraType, setCameraType] = useState<'avatar' | 'banner' | null>(null);

  const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = event.target.files?.[0];
    if (file) await updateProfileImage(file, type);
    event.target.value = '';
  };

  useEffect(() => {
    if (cameraType && cameraVideoRef.current && cameraStreamRef.current) {
      cameraVideoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraType]);

  useEffect(() => {
    if (!isSettingsModalOpen) closeCamera();
    return () => cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, [isSettingsModalOpen]);

  const openCamera = async (type: 'avatar' | 'banner') => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('Camera access is not available in this browser.');
      return;
    }
    try {
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: type === 'avatar' ? 'user' : 'environment' }, audio: false });
      cameraStreamRef.current = stream;
      setCameraType(type);
      if (cameraVideoRef.current) cameraVideoRef.current.srcObject = stream;
    } catch {
      showToast('Camera permission was denied or the camera is unavailable.');
    }
  };

  const closeCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setCameraType(null);
  };

  const captureCameraImage = async () => {
    if (!cameraVideoRef.current || !cameraType) return;
    const video = cameraVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (!blob) {
      showToast('Could not capture the camera image.');
      return;
    }
    await updateProfileImage(new File([blob], `${cameraType}-${Date.now()}.jpg`, { type: 'image/jpeg' }), cameraType);
    closeCamera();
  };

  // Sync state when modal opens or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setCvVis(currentUser.privacy?.cv || 'department');
      setEmailVis(currentUser.privacy?.email || 'private');
      setPhoneVis(currentUser.privacy?.phone || 'connections');
      setProjectsVis(currentUser.privacy?.projects || 'public');
      setExperienceVis(currentUser.privacy?.experience || 'public');
      setShortBio(currentUser.bio || '');
      setHeadline(currentUser.headline || '');
      setSkillsText((currentUser.skills || []).join(', '));
      setEducationText((currentUser.education || []).map((item) => [item.institution, item.degree, item.field, item.startYear, item.endYear].join(' | ')).join('\n'));
      setExperienceText((currentUser.experience || []).map((item) => [item.position, item.organization, item.startDate, item.endDate, item.description].join(' | ')).join('\n'));
      setLinkedin(currentUser.externalLinks?.linkedin || '');
      setGithub(currentUser.externalLinks?.github || '');
      setGoogleScholar(currentUser.externalLinks?.googleScholar || '');
      setOrcid(currentUser.externalLinks?.orcid || '');
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

    updateUserPrivacy(updatedPrivacy);
    updateNotificationSettings(updatedNotifications);
    updateProfileBio(shortBio);
    const education: Education[] = educationText.split('\n').map((line, index) => line.split('|').map((part) => part.trim())).filter((parts) => parts.length >= 5 && parts[0]).map(([institution, degree, field, startYear, endYear], index) => ({ id: currentUser.education[index]?.id || `education-${Date.now()}-${index}`, institution, degree, field, startYear: Number(startYear) || new Date().getFullYear(), endYear: Number(endYear) || 'Present' }));
    const experience: Experience[] = experienceText.split('\n').map((line, index) => line.split('|').map((part) => part.trim())).filter((parts) => parts.length >= 5 && parts[0]).map(([position, organization, startDate, endDate, description], index) => ({ id: currentUser.experience[index]?.id || `experience-${Date.now()}-${index}`, position, organization, startDate, endDate, description }));
    const externalLinks: ExternalLinks = { linkedin: linkedin.trim(), github: github.trim(), googleScholar: googleScholar.trim(), orcid: orcid.trim() };
    updateProfileDetails({ headline, skills: skillsText.split(',').map((skill) => skill.trim()).filter(Boolean), education, experience, externalLinks });

    showToast('Privacy & notification preferences saved successfully');
    setIsSettingsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-slate-200 shadow-2xl my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">lock</span>
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Privacy &amp; Notification Settings
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
          <div className="space-y-2 border-b border-slate-100 pb-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Profile Photos</p>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" disabled={isUploadingProfileImage} onClick={() => avatarInputRef.current?.click()} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <span className="material-symbols-outlined mr-1 align-middle text-[15px]">upload</span>Photo from device
                </button>
                <button type="button" disabled={isUploadingProfileImage} onClick={() => void openCamera('avatar')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <span className="material-symbols-outlined mr-1 align-middle text-[15px]">photo_camera</span>Take profile photo
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" disabled={isUploadingProfileImage} onClick={() => bannerInputRef.current?.click()} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <span className="material-symbols-outlined mr-1 align-middle text-[15px]">upload</span>Banner from device
                </button>
                <button type="button" disabled={isUploadingProfileImage} onClick={() => void openCamera('banner')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <span className="material-symbols-outlined mr-1 align-middle text-[15px]">photo_camera</span>Take banner photo
                </button>
              </div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => void handleImageSelected(event, 'avatar')} />
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => void handleImageSelected(event, 'banner')} />
            <p className="text-[10px] text-slate-500">{isUploadingProfileImage ? 'Uploading image...' : 'Camera access depends on your browser and device permissions.'}</p>
          </div>

          {cameraType && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <video ref={cameraVideoRef} autoPlay playsInline muted className="aspect-video w-full rounded-lg bg-slate-900 object-cover" />
              <div className="flex gap-2">
                <button type="button" onClick={captureCameraImage} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">Take photo</button>
                <button type="button" onClick={closeCamera} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">Cancel</button>
              </div>
            </div>
          )}
          <div className="space-y-1.5 border-b border-slate-100 pb-3.5">
            <label htmlFor="short-profile-bio" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Short bio</label>
            <textarea
              id="short-profile-bio"
              value={shortBio}
              maxLength={280}
              onChange={(event) => setShortBio(event.target.value)}
              rows={3}
              placeholder="Tell people what you work on or what you are interested in."
              className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-right text-[10px] text-slate-400">{shortBio.length}/280</p>
          </div>
          <div className="space-y-2 border-b border-slate-100 pb-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Profile details</p>
            <input value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={120} placeholder="Headline, for example: Robotics researcher" className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            <input value={skillsText} onChange={(event) => setSkillsText(event.target.value)} placeholder="Skills, separated by commas" className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            <textarea value={educationText} onChange={(event) => setEducationText(event.target.value)} rows={3} placeholder="Education: institution | degree | field | start year | end year" className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            <textarea value={experienceText} onChange={(event) => setExperienceText(event.target.value)} rows={3} placeholder="Experience: position | organization | start date | end date | description" className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            <div className="grid grid-cols-2 gap-2">
              <input value={linkedin} onChange={(event) => setLinkedin(event.target.value)} placeholder="LinkedIn URL" className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              <input value={github} onChange={(event) => setGithub(event.target.value)} placeholder="GitHub URL" className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              <input value={googleScholar} onChange={(event) => setGoogleScholar(event.target.value)} placeholder="Google Scholar URL" className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
              <input value={orcid} onChange={(event) => setOrcid(event.target.value)} placeholder="ORCID iD" className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" />
            </div>
            <p className="text-[10px] text-slate-500">Use one education or experience entry per line. Separate each part with |.</p>
          </div>
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

