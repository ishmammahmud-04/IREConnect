import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LinkedInImportModal: React.FC = () => {
  const {
    isLinkedInModalOpen,
    setIsLinkedInModalOpen,
    currentUser,
    applyLinkedInData
  } = useApp();

  const [importExperience, setImportExperience] = useState(true);
  const [importEducation, setImportEducation] = useState(true);
  const [importSkills, setImportSkills] = useState(true);

  if (!isLinkedInModalOpen) return null;

  const mockLinkedInData = {
    headline: 'Robotics Software Engineer & Autonomous Systems Researcher @ IRE',
    skills: ['ROS2', 'Embedded C++', 'Computer Vision', 'PyTorch', 'SLAM', 'LiDAR Sensor Fusion'],
    experience: [
      {
        id: 'li-exp-1',
        position: 'Autonomous Systems Intern',
        organization: 'Boston Dynamics Labs',
        startDate: 'Jun 2025',
        endDate: 'Sep 2025',
        description: 'Developed trajectory generation algorithms for quadruped balancing robots.'
      },
      {
        id: 'li-exp-2',
        position: 'Undergraduate Research Assistant',
        organization: 'IRE Robotics & Embedded Systems Lab',
        startDate: 'Jan 2024',
        endDate: 'Present',
        description: 'Implemented real-time sensor calibration and SLAM nodes on low-power microcontrollers.'
      }
    ],
    education: [
      {
        id: 'li-edu-1',
        institution: 'Institute of Robotics & Embedded Systems',
        degree: 'Bachelor of Science (B.Sc)',
        field: 'Internet of Things & Robotics Engineering',
        startYear: 2022,
        endYear: 2026
      }
    ]
  };

  const handleApplySync = () => {
    applyLinkedInData({
      headline: mockLinkedInData.headline,
      skills: importSkills ? mockLinkedInData.skills : currentUser.skills,
      experience: importExperience ? mockLinkedInData.experience : currentUser.experience,
      education: importEducation ? mockLinkedInData.education : currentUser.education
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#0077b5] text-white flex items-center justify-center font-bold text-xs">
              in
            </span>
            <div>
              <h2 className="font-heading text-sm font-bold text-slate-900">
                LinkedIn Profile Data Sync &amp; Review
              </h2>
              <p className="text-[11px] text-slate-500">
                Selectively import verified work experience, education, and skills.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLinkedInModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Review Body */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Synchronized Profile Banner */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            />
            <div>
              <p className="font-bold text-xs text-slate-900">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500">{mockLinkedInData.headline}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#0077b5] font-mono font-bold mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0077b5]"></span>
                Connected to linkedin.com/in/{currentUser.name.toLowerCase().replace(' ', '')}
              </span>
            </div>
          </div>

          {/* Section 1: Work Experience */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={importExperience}
                  onChange={(e) => setImportExperience(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#0077b5] rounded"
                />
                <span>Import Work Experience ({mockLinkedInData.experience.length} records)</span>
              </label>
            </div>

            {importExperience && (
              <div className="space-y-1.5 pl-5">
                {mockLinkedInData.experience.map((exp) => (
                  <div key={exp.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900 text-xs">{exp.position}</p>
                    <p className="text-[11px] text-[#0077b5] font-mono">{exp.organization} • {exp.startDate} - {exp.endDate}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Education */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={importEducation}
                  onChange={(e) => setImportEducation(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#0077b5] rounded"
                />
                <span>Import Education History ({mockLinkedInData.education.length} records)</span>
              </label>
            </div>

            {importEducation && (
              <div className="space-y-1.5 pl-5">
                {mockLinkedInData.education.map((edu) => (
                  <div key={edu.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900 text-xs">{edu.institution}</p>
                    <p className="text-[11px] text-slate-500">{edu.degree} — {edu.field} ({edu.startYear} - {edu.endYear})</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Skills */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-900">
                <input
                  type="checkbox"
                  checked={importSkills}
                  onChange={(e) => setImportSkills(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#0077b5] rounded"
                />
                <span>Sync Verified Skills ({mockLinkedInData.skills.length} skills)</span>
              </label>
            </div>

            {importSkills && (
              <div className="flex flex-wrap gap-1 pl-5 pt-0.5">
                {mockLinkedInData.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-blue-50 text-[#0077b5] rounded text-[10px] font-bold border border-blue-200/60 font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={() => setIsLinkedInModalOpen(false)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplySync}
            className="px-4 py-1.5 rounded-lg bg-[#0077b5] text-white text-xs font-bold hover:bg-[#005f93] transition-all shadow-2xs"
          >
            Apply Selected Updates to Profile
          </button>
        </div>
      </div>
    </div>
  );
};
