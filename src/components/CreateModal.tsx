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
  const [publicationUrl, setPublicationUrl] = useState('');

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.id) {
      showToast('Please sign in before publishing.');
      return;
    }
    if (!title || !desc) {
      showToast('Please fill out all required fields');
      return;
    }

    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (contentType === 'project') {
      createProject({
        id: `project-${Date.now()}`,
        title,
        category: (category as any) || 'Robotics',
        batch: currentUser.batch || 'Batch 7',
        year: String(new Date().getFullYear()),
        problem: 'Need to solve a relevant real-world challenge in the department ecosystem.',
        solution: desc,
        description: desc,
        technologies: tagArray.length ? tagArray : ['ROS2', 'Python', 'SLAM'],
        coverImage: '',
        supervisor: {
          id: currentUser.id || 'faculty-1',
          name: currentUser.name || 'IRE Faculty',
          designation: currentUser.headline || 'Department Member',
          avatar: currentUser.avatar || ''
        },
        teamMembers: [
          {
            id: currentUser.id,
            name: currentUser.name,
            role: 'Lead Contributor',
            avatar: currentUser.avatar
          }
        ],
        githubUrl: publicationUrl.trim() || undefined,
        demoUrl: undefined,
        docUrl: undefined,
        mediaGallery: [],
        relatedAchievements: [],
        relatedPublications: [],
        status: 'Ongoing',
        likesCount: 0
      });
    } else if (contentType === 'publication') {
      createPublication({
        id: `publication-${Date.now()}`,
        title,
        authors: [currentUser.name],
        publicationType: 'Journal',
        journal: secondaryField || 'Publication venue',
        doi: publicationUrl.trim() || 'Pending DOI',
        date: new Date().toISOString().slice(0, 10),
        abstract: desc,
        keywords: tagArray.length ? tagArray : ['Robotics', 'Autonomy'],
        researchArea: category || 'Research',
        pdfUrl: undefined,
        externalUrl: publicationUrl.trim() || undefined,
        googleScholarUrl: undefined,
        orcid: undefined,
        status: 'Published',
        visibility: 'public',
        coverImage: '',
        citations: 0
      });
    } else if (contentType === 'achievement') {
      createAchievement({
        id: `achievement-${Date.now()}`,
        title,
        category: (category as any) || 'Award',
        organization: secondaryField || 'Organization',
        personName: currentUser.name,
        personRole: currentUser.headline,
        personAvatar: currentUser.avatar,
        date: new Date().toISOString().slice(0, 10),
        description: desc,
        appliedSkills: tagArray.length ? tagArray : ['Robotics', 'Leadership'],
        image: '',
        certificateUrl: publicationUrl.trim() || undefined,
        verificationUrl: undefined,
        isVerified: true,
        relatedProjectId: undefined,
        relatedProjectName: undefined,
        collaborators: [],
        visibility: 'public'
      });
    } else if (contentType === 'article') {
      createArticle({
        id: `article-${Date.now()}`,
        title,
        subtitle: desc.slice(0, 100),
        category: category || 'Technical Blog',
        author: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.headline,
          avatar: currentUser.avatar,
          bio: currentUser.bio
        },
        date: new Date().toISOString().slice(0, 10),
        readingTime: '5 min read',
        coverImage: '',
        tags: tagArray.length ? tagArray : ['Engineering', 'IRE'],
        body: [desc],
        relatedProjectId: undefined,
        relatedResearchId: undefined,
        views: 0
      });
    } else if (contentType === 'opportunity') {
      createOpportunity({
        id: `opportunity-${Date.now()}`,
        title,
        organization: secondaryField || 'Organization',
        organizationLogo: '',
        type: (category as any) || 'Internship',
        description: desc,
        requirements: desc ? [desc] : ['Please review the full opportunity details.'],
        requiredSkills: tagArray.length ? tagArray : ['Python', 'ROS'],
        location: 'Hybrid / IRE Innovation Hub',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
        applicationUrl: publicationUrl.trim() || undefined,
        contactEmail: currentUser.email || undefined,
        postedBy: {
          name: currentUser.name,
          role: currentUser.headline,
          avatar: currentUser.avatar
        },
        isRecommended: false
      });
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-slate-200 shadow-2xl my-4 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
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

          {contentType === 'publication' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Published paper link</label>
              <input
                type="url"
                value={publicationUrl}
                onChange={(e) => setPublicationUrl(e.target.value)}
                placeholder="https://orcid.org/... or https://researchgate.net/..."
                className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          )}

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
              Publish to Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
