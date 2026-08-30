import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const contentTypeOptions = [
  { type: 'project', label: 'Project', icon: 'science' },
  { type: 'publication', label: 'Research Paper', icon: 'description' },
  { type: 'achievement', label: 'Achievement', icon: 'emoji_events' },
  { type: 'article', label: 'Technical Article', icon: 'auto_stories' },
  { type: 'opportunity', label: 'Opportunity', icon: 'work' }
] as const;

const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('Could not read the selected image.'));
  reader.readAsDataURL(file);
});

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
    showToast,
    createModalEditingItem,
    setCreateModalEditingItem,
    updatePublishedContent
  } = useApp();

  const [contentType, setContentType] = useState<'project' | 'publication' | 'achievement' | 'article' | 'opportunity'>('project');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Robotics');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('ROS2, Python, Computer Vision');
  const [secondaryField, setSecondaryField] = useState('');
  const [publicationUrl, setPublicationUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [teamMembersText, setTeamMembersText] = useState('');

  const resetForm = () => {
    setTitle('');
    setCategory('Robotics');
    setDesc('');
    setTags('ROS2, Python, Computer Vision');
    setSecondaryField('');
    setPublicationUrl('');
    setCoverImage('');
    setPdfUrl('');
    setSupervisorName('');
    setTeamMembersText('');
  };

  useEffect(() => {
    if (!isCreateModalOpen) return;
    if (createModalEditingItem) {
      const item = createModalEditingItem.item;
      setContentType(createModalEditingItem.type);
      setTitle(item.title || '');
      setCategory(item.category || item.type || 'Robotics');
      setDesc(item.description || item.abstract || item.body?.join(' ') || '');
      setTags((item.tags || item.technologies || item.keywords || []).join(', '));
      setSecondaryField(item.journal || item.organization || item.conference || '');
      setPublicationUrl(item.externalUrl || item.applicationUrl || item.certificateUrl || '');
      setCoverImage(item.coverImage || item.image || '');
      setPdfUrl(item.pdfUrl || item.docUrl || item.certificateUrl || '');
      setSupervisorName(item.supervisor?.name || '');
      setTeamMembersText((item.teamMembers || []).map((member: any) => `${member.name}${member.role ? ` - ${member.role}` : ''}`).join('\n') || '');
      return;
    }
    resetForm();
  }, [isCreateModalOpen, createModalEditingItem]);

  if (!isCreateModalOpen) return null;

  const parseTeamMembers = () => {
    if (!teamMembersText.trim()) return [] as { id: string; name: string; role: string; avatar: string }[];
    return teamMembersText.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const [namePart, ...roleParts] = trimmed.split(/\s*-\s*|\s*:\s*|\s*\|\s*/);
      const name = namePart.trim();
      const role = roleParts.join(' ').trim() || 'Team Member';
      return {
        id: `${name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        name,
        role,
        avatar: ''
      };
    }).filter(Boolean) as { id: string; name: string; role: string; avatar: string }[];
  };

  const handleImageInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Only standard image files are allowed. GIFs and videos are not supported.');
      return;
    }
    if (['image/gif', 'image/webm', 'video/mp4', 'video/quicktime'].includes(file.type)) {
      showToast('GIFs and videos are not supported for content covers. Please upload JPG, PNG, WEBP, or BMP.');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setCoverImage(dataUrl);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load the selected image.');
    }
  };

  const handlePdfInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF files are allowed.');
      event.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('PDF files must be 10 MB or smaller.');
      event.target.value = '';
      return;
    }
    try {
      setPdfUrl(await fileToDataUrl(file));
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load the selected PDF.');
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setCreateModalEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    const sharedBase = {
      id: createModalEditingItem?.item?.id || `${contentType}-${Date.now()}`,
      title,
      coverImage: coverImage || '',
      pdfUrl: pdfUrl || undefined,
      ownerId: currentUser.id
    };

    if (contentType === 'project') {
      const projectItem = {
        ...sharedBase,
        category: (category as any) || 'Robotics',
        batch: currentUser.batch || 'Batch 7',
        year: String(new Date().getFullYear()),
        problem: 'Need to solve a relevant real-world challenge in the department ecosystem.',
        solution: desc,
        description: desc,
        technologies: tagArray.length ? tagArray : ['ROS2', 'Python', 'SLAM'],
        supervisor: {
          id: currentUser.id || 'faculty-1',
          name: supervisorName || currentUser.name || 'Faculty Advisor',
          designation: currentUser.headline || 'Department Member',
          avatar: currentUser.avatar || ''
        },
        teamMembers: parseTeamMembers().length ? parseTeamMembers() : [{
          id: currentUser.id,
          name: currentUser.name,
          role: 'Lead Contributor',
          avatar: currentUser.avatar
        }],
        githubUrl: publicationUrl.trim() || undefined,
        demoUrl: undefined,
        docUrl: undefined,
        mediaGallery: coverImage ? [coverImage] : [],
        relatedAchievements: [],
        relatedPublications: [],
        status: 'Ongoing' as const,
        likesCount: 0
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('project', projectItem);
        if (ok) closeModal();
        return;
      }
      createProject(projectItem);
    } else if (contentType === 'publication') {
      const publicationItem = {
        ...sharedBase,
        authors: [currentUser.name],
        journal: secondaryField || 'Publication venue',
        doi: publicationUrl.trim() || 'Pending DOI',
        publicationType: 'Journal' as const,
        status: 'Published' as const,
        abstract: desc,
        keywords: tagArray.length ? tagArray : ['Robotics', 'Autonomy'],
        date: new Date().toISOString().slice(0, 10),
        researchArea: category || 'Research',
        externalUrl: publicationUrl.trim() || undefined,
        coverImage: coverImage || '',
        visibility: 'public' as const
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('publication', publicationItem);
        if (ok) closeModal();
        return;
      }
      createPublication(publicationItem);
    } else if (contentType === 'achievement') {
      const achievementItem = {
        ...sharedBase,
        category: (category as any) || 'Award',
        organization: secondaryField || 'Organization',
        personName: currentUser.name,
        personRole: currentUser.headline,
        personAvatar: currentUser.avatar,
        date: new Date().toISOString().slice(0, 10),
        description: desc,
        appliedSkills: tagArray.length ? tagArray : ['Robotics', 'Leadership'],
        image: coverImage || '',
        certificateUrl: publicationUrl.trim() || undefined,
        isVerified: true,
        collaborators: [],
        visibility: 'public' as const
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('achievement', achievementItem);
        if (ok) closeModal();
        return;
      }
      createAchievement(achievementItem);
    } else if (contentType === 'article') {
      const articleItem = {
        ...sharedBase,
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
        coverImage: coverImage || '',
        tags: tagArray.length ? tagArray : ['Engineering', 'IRE'],
        body: [desc],
        views: 0
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('article', articleItem);
        if (ok) closeModal();
        return;
      }
      createArticle(articleItem);
    } else if (contentType === 'opportunity') {
      const opportunityItem = {
        ...sharedBase,
        organization: secondaryField || 'Organization',
        organizationLogo: coverImage || '',
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
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('opportunity', opportunityItem);
        if (ok) closeModal();
        return;
      }
      createOpportunity(opportunityItem);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-slate-200 shadow-2xl my-4 relative animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">add_circle</span>
            <h2 className="font-heading text-sm font-bold text-slate-900">
              {createModalEditingItem ? 'Update Published Content' : 'Publish New Content'}
            </h2>
          </div>
          <button type="button" onClick={closeModal} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="px-5 pt-3.5">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {contentTypeOptions.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setContentType(item.type)}
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

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {contentType === 'project' ? 'Project Title' : contentType === 'publication' ? 'Paper Title' : 'Title'} *
            </label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Autonomous Rover 'Ares' or Edge AI for ROS2" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Category / Type</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Robotics, IoT, Competition" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">{contentType === 'publication' ? 'Journal / Conference' : contentType === 'achievement' ? 'Awarding Body' : 'Organization / Affiliation'}</label>
              <input type="text" value={secondaryField} onChange={(e) => setSecondaryField(e.target.value)} placeholder="e.g., IEEE Robotics / Cisco / MIT Lab" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
            </div>
          </div>

          {contentType === 'project' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Supervisor name</label>
                <input type="text" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} placeholder="e.g., Dr. Ashik Rahman" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Team members</label>
                <input type="text" value={teamMembersText} onChange={(e) => setTeamMembersText(e.target.value)} placeholder="Name - role, one per line" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
            </div>
          )}

          {contentType === 'publication' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Published paper link</label>
              <input type="url" value={publicationUrl} onChange={(e) => setPublicationUrl(e.target.value)} placeholder="https://orcid.org/... or https://researchgate.net/..." className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Technologies / Skills (Comma-separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., ROS2, Python, LiDAR, SLAM" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Cover photo</label>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/bmp" onChange={handleImageInput} className="w-full text-xs text-slate-700 file:mr-2 file:py-1.5 file:px-2 file:rounded file:border file:border-slate-200 file:bg-slate-100 file:text-slate-700" />
            {coverImage && <img src={coverImage} alt="Selected cover" className="mt-2 h-20 w-full object-cover rounded-lg border border-slate-200" />}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Attach PDF</label>
            <input type="file" accept="application/pdf,.pdf" onChange={handlePdfInput} className="w-full text-xs text-slate-700 file:mr-2 file:rounded file:border file:border-slate-200 file:bg-slate-100 file:px-2 file:py-1.5 file:text-slate-700" />
            {pdfUrl && <p className="mt-1 text-[10px] font-semibold text-emerald-600">PDF attached and ready to read or download.</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Detailed Description / Abstract *</label>
            <textarea required rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe the architectural problem, methodology, and outcome..." className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs">
              {createModalEditingItem ? 'Update' : 'Publish to Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
