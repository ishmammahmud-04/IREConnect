import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const MentorshipModal: React.FC = () => {
  const {
    isMentorshipModalOpen,
    setIsMentorshipModalOpen,
    selectedMentorForRequest,
    submitMentorshipRequest
  } = useApp();

  const [topic, setTopic] = useState('Research Supervision & Thesis Advice');
  const [goals, setGoals] = useState('');
  const [frequency, setFrequency] = useState('Bi-weekly (1 hour)');

  if (!isMentorshipModalOpen || !selectedMentorForRequest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMentorshipRequest({
      mentorId: selectedMentorForRequest.id,
      topic,
      goals,
      preferredFrequency: frequency
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">school</span>
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Request Mentorship Session
            </h2>
          </div>
          <button
            onClick={() => setIsMentorshipModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Mentor Info Preview */}
        <div className="p-4 space-y-3.5">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <img
              src={selectedMentorForRequest.avatar}
              alt={selectedMentorForRequest.name}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-900">{selectedMentorForRequest.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{selectedMentorForRequest.headline}</p>
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
                Available for: {selectedMentorForRequest.mentorshipCategories?.join(', ') || 'Robotics, IoT'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Focus Topic / Goal *</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Research Supervision & Thesis Advice">Research Supervision &amp; Thesis Advice</option>
                <option value="Robotics Industry Career Guidance">Robotics Industry Career Guidance</option>
                <option value="Graduate School & PhD Applications">Graduate School &amp; PhD Applications</option>
                <option value="ROS2 & Embedded Coding Architecture">ROS2 &amp; Embedded Coding Architecture</option>
                <option value="Startup & Technology Commercialization">Startup &amp; Commercialization</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Preferred Meeting Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="One-time 45min consultation">One-time 45min consultation</option>
                <option value="Bi-weekly (1 hour)">Bi-weekly (1 hour)</option>
                <option value="Monthly project review">Monthly project review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Personal Goals &amp; Context *</label>
              <textarea
                required
                rows={3}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Briefly introduce your current project or academic challenges and what you hope to achieve..."
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              ></textarea>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsMentorshipModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
