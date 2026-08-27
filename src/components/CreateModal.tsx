import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CreateModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    createProject,
    createPublication,
    createAchievement,
    createArticle,
    createOpportunity,
    currentUser,
    showToast
  } = useApp();

  const [contentType, setContentType] = useState<'project' | 'publication' | 'achievement' | 'article' | 'opportunity'>('project');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Robotics');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('ROS2, Python, Computer Vision');
  const [secondaryField, setSecondaryField] = useState('');

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) {
      showToast('Please fill out all required fields');
      return;
    }

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (contentType === 'project') {
      createProject({
        title,
        category,
        batch: currentUser.batch || 'Batch 7',
        year: 2026,
        description: desc,
        problem: 'Real-time sensor latency and state estimation in unstructured domains.',
        solution: desc,
        technologies: tagArray.length ? tagArray : ['ROS2', 'Python', 'SLAM'],
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        supervisor: {
          id: 'faculty-1',
          name: 'Dr. Elena Rossi',
          designation: 'Professor of Robotics',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgOGZj8HWKLLzxuYNF87_mV90sB7EpQ2qveajHTqIiMBO54cvKdOyNYGxalRJh-785QcWWJsmGS16fZOtVy8SmyzrIKH5mvvMZMPWwEiL1s5CSbu2cwJ_D1FHfAyLEiohba15xIpx6rZpidAv2jbvVaX8Wp17gF4GLd5sbIAp6JQiSAAyIWeYBh5vfW1rk25cn0lFiYTm6in1m-Vu7acXo9fWYxiUUY0A1ybOUC6SxLU_XTu6VIeH3DA'
        },
        teamMembers: [
          {
            id: currentUser.id,
            name: currentUser.name,
            role: 'Lead Contributor',
            avatar: currentUser.avatar
          }
        ],
        githubUrl: 'https://github.com/ire-lab/autonomous-system',
        createdAt: 'Just now'
      });
    } else if (contentType === 'publication') {
      createPublication({
        title,
        authors: [currentUser.name, 'Dr. Elena Rossi'],
        journal: secondaryField || 'IEEE Transactions on Robotics',
        doi: '10.1109/TRO.2026.994411',
        publicationType: 'Journal',
        status: 'Published',
        abstract: desc,
        keywords: tagArray.length ? tagArray : ['Robotics', 'Autonomy'],
        date: 'May 2026',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
      });
    } else if (contentType === 'achievement') {
      createAchievement({
        title,
        category: category || 'Award',
        organization: secondaryField || 'National Robotics Council',
        date: 'May 2026',
        description: desc,
        appliedSkills: tagArray.length ? tagArray : ['Robotics', 'Leadership'],
        personName: currentUser.name,
        personRole: currentUser.headline,
        personAvatar: currentUser.avatar,
        image: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&auto=format&fit=crop&q=80'
      });
    } else if (contentType === 'article') {
      createArticle({
        title,
        subtitle: desc.slice(0, 100),
        category: category || 'Technical Blog',
        author: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.headline,
          avatar: currentUser.avatar
        },
        date: 'May 2026',
        readingTime: '5 min read',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        tags: tagArray.length ? tagArray : ['Engineering', 'IRE'],
        body: [desc, 'This study provides empirical benchmarks and real-world deployment telemetry recorded in our department laboratory.']
      });
    } else if (contentType === 'opportunity') {
      createOpportunity({
        title,
        type: (category as any) || 'Internship',
        organization: secondaryField || 'Robotics Innovation Labs',
        location: 'Hybrid / IRE Innovation Hub',
        deadline: 'June 30, 2026',
        description: desc,
        skillsRequired: tagArray.length ? tagArray : ['Python', 'ROS'],
        postedBy: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.headline
        }
      });
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">add_circle</span>
            <h2 className="font-heading text-sm font-bold text-slate-900">Publish New Content</h2>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="px-5 pt-3.5">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { type: 'project', label: 'Project', icon: 'science' },
              { type: 'publication', label: 'Research Paper', icon: 'description' },
              { type: 'achievement', label: 'Achievement', icon: 'emoji_events' },
              { type: 'article', label: 'Technical Article', icon: 'auto_stories' },
              { type: 'opportunity', label: 'Opportunity', icon: 'work' }
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setContentType(item.type as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 whitespace-nowrap transition-all border ${
                  contentType === item.type
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {contentType === 'project' ? 'Project Title' : contentType === 'publication' ? 'Paper Title' : 'Title'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Autonomous Rover 'Ares' or Edge AI for ROS2"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Category / Type</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Robotics, IoT, Competition"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {contentType === 'publication' ? 'Journal / Conference' : contentType === 'achievement' ? 'Awarding Body' : 'Organization / Affiliation'}
              </label>
              <input
                type="text"
                value={secondaryField}
                onChange={(e) => setSecondaryField(e.target.value)}
                placeholder="e.g., IEEE Robotics / Cisco / MIT Lab"
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Technologies / Skills (Comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., ROS2, Python, LiDAR, SLAM"
              className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Detailed Description / Abstract *</label>
            <textarea
              required
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the architectural problem, methodology, and outcome..."
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            ></textarea>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
            >
              Publish to IRE Ecosystem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
