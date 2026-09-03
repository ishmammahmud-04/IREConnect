import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageCropModal } from './ImageCropModal';

const contentTypeOptions = [
  { type: 'project', label: 'Project', icon: 'science' },
  { type: 'publication', label: 'Research Paper', icon: 'description' },
  { type: 'achievement', label: 'Achievement', icon: 'emoji_events' },
  { type: 'article', label: 'Technical Article', icon: 'auto_stories' },
  { type: 'opportunity', label: 'Opportunity', icon: 'work' },
  { type: 'announcement', label: 'Announcement', icon: 'campaign' }
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
    createAnnouncement,
    currentUser,
    showToast,
    createModalEditingItem,
    createModalInitialType,
    setCreateModalEditingItem,
    updatePublishedContent
  } = useApp();

  const [contentType, setContentType] = useState<'project' | 'publication' | 'achievement' | 'article' | 'opportunity' | 'announcement'>('project');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [secondaryField, setSecondaryField] = useState('');
  const [publicationUrl, setPublicationUrl] = useState('');
  const [authorsText, setAuthorsText] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [batch, setBatch] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [publicationType, setPublicationType] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pendingCropCover, setPendingCropCover] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [teamMembersText, setTeamMembersText] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDesc('');
    setTags('');
    setSecondaryField('');
    setPublicationUrl('');
    setAuthorsText('');
    setProblem('');
    setSolution('');
    setBatch('');
    setYear('');
    setStatus('');
    setDemoUrl('');
    setDocUrl('');
    setSubtitle('');
    setPublicationType('');
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
      setCategory(item.category || item.type || '');
      setDesc(item.description || item.abstract || item.body?.join(' ') || '');
      setTags((item.tags || item.technologies || item.keywords || []).join(', '));
      setSecondaryField(item.journal || item.organization || item.conference || '');
      setPublicationUrl(item.externalUrl || item.applicationUrl || item.certificateUrl || '');
      setAuthorsText((item.authors || []).join(', '));
      setProblem(item.problem || '');
      setSolution(item.solution || '');
      setBatch(item.batch || '');
      setYear(item.year || '');
      setStatus(item.status || '');
      setDemoUrl(item.demoUrl || '');
      setDocUrl(item.docUrl || '');
      setSubtitle(item.subtitle || '');
      setPublicationType(item.publicationType || '');
      setCoverImage(item.coverImage || item.image || '');
      setPdfUrl(item.pdfUrl || item.docUrl || item.certificateUrl || '');
      setSupervisorName(item.supervisor?.name || '');
      setTeamMembersText((item.teamMembers || []).map((member: any) => `${member.name}${member.role ? ` - ${member.role}` : ''}`).join('\n') || '');
      return;
    }
    const requestedType = ['project', 'publication', 'achievement', 'article', 'opportunity', 'announcement'].includes(createModalInitialType || '')
      ? createModalInitialType as 'project' | 'publication' | 'achievement' | 'article' | 'opportunity' | 'announcement'
      : 'project';
    setContentType(requestedType);
    resetForm();
  }, [isCreateModalOpen, createModalEditingItem, createModalInitialType]);

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
      event.target.value = '';
      return;
    }
    if (['image/gif', 'image/webm', 'video/mp4', 'video/quicktime'].includes(file.type)) {
      showToast('GIFs and videos are not supported for content covers. Please upload JPG, PNG, WEBP, or BMP.');
      event.target.value = '';
      return;
    }

    try {
      setPendingCropCover(file);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not load the selected image.');
    } finally {
      event.target.value = '';
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

  const selectContentType = (type: typeof contentType) => {
    if (type !== contentType) resetForm();
    setContentType(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!currentUser.id) {
      showToast('Please sign in before publishing.');
      return;
    }
    const trimmedTitle = title.trim();
    const trimmedDesc = desc.trim();
    const trimmedPublicationUrl = publicationUrl.trim();
    const trimmedDemoUrl = demoUrl.trim();
    const trimmedDocUrl = docUrl.trim();
    const trimmedYear = year.trim();
    const trimmedCategory = category.trim();
    const trimmedSecondaryField = secondaryField.trim();
    const trimmedSubtitle = subtitle.trim();
    const trimmedAuthors = authorsText.trim();
    const trimmedProblem = problem.trim();
    const trimmedSolution = solution.trim();
    const trimmedSupervisorName = supervisorName.trim();
    const nextErrors: Record<string, string> = {};
    if (!trimmedTitle) nextErrors.title = 'Title is required.';
    if (!trimmedDesc) nextErrors.description = 'Description or abstract is required.';

    const validateUrl = (value: string, field: string) => {
      if (!value) return;
      try {
        const parsed = new URL(value);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
      } catch {
        nextErrors[field] = 'Enter a valid http:// or https:// URL.';
      }
    };
    validateUrl(trimmedDemoUrl, 'demoUrl');
    validateUrl(trimmedDocUrl, 'docUrl');
    if (contentType !== 'publication') validateUrl(trimmedPublicationUrl, 'publicationUrl');
    if (contentType === 'publication' && trimmedPublicationUrl && !/^10\.\d{4,9}\/\S+$/i.test(trimmedPublicationUrl)) {
      validateUrl(trimmedPublicationUrl, 'publicationUrl');
    }
    if (['publication', 'achievement', 'opportunity'].includes(contentType) && trimmedYear) {
      const isDate = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(trimmedYear);
      if (!isDate) nextErrors.year = 'Use a date in YYYY, YYYY-MM, or YYYY-MM-DD format.';
      else {
        const [dateYear, month, day] = trimmedYear.split('-').map(Number);
        if (month && (month < 1 || month > 12) || day && (day < 1 || day > 31)) {
          nextErrors.year = 'Enter a valid date.';
        }
      }
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      showToast('Please review the highlighted fields before publishing.');
      return;
    }

    setIsSubmitting(true);
    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const sharedBase = {
      id: createModalEditingItem?.item?.id || `${contentType}-${Date.now()}`,
      title: trimmedTitle,
      coverImage: coverImage || '',
      pdfUrl: pdfUrl.trim() || undefined,
      ownerId: currentUser.id
    };

    if (contentType === 'announcement') {
      await createAnnouncement({
        id: sharedBase.id,
        title: trimmedTitle,
        description: trimmedDesc,
        category: (trimmedCategory || 'General') as 'Competition' | 'Workshop' | 'General' | 'Exam Notice' | 'Announcement',
        isPinned: false,
        author: currentUser.name,
        date: 'Just now'
      });
      closeModal();
    } else if (contentType === 'project') {
      const projectItem = {
        ...sharedBase,
        category: trimmedCategory as any,
        batch: batch.trim(),
        year: trimmedYear,
        problem: trimmedProblem,
        solution: trimmedSolution,
        description: trimmedDesc,
        technologies: tagArray,
        supervisor: {
          id: currentUser.id,
          name: trimmedSupervisorName,
          designation: currentUser.headline,
          avatar: currentUser.avatar || ''
        },
        teamMembers: parseTeamMembers().length ? parseTeamMembers() : [{
          id: currentUser.id,
          name: currentUser.name,
          role: 'Lead Contributor',
          avatar: currentUser.avatar
        }],
        githubUrl: trimmedPublicationUrl || undefined,
        demoUrl: trimmedDemoUrl || undefined,
        docUrl: trimmedDocUrl || undefined,
        mediaGallery: coverImage ? [coverImage] : [],
        relatedAchievements: [],
        relatedPublications: [],
        status: status as 'Active' | 'Completed' | 'Published' | 'Ongoing',
        likesCount: 0
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('project', projectItem);
        if (ok) closeModal();
        setIsSubmitting(false);
        return;
      }
      createProject(projectItem);
    } else if (contentType === 'publication') {
      const publicationItem = {
        ...sharedBase,
        authors: trimmedAuthors.split(',').map((author) => author.trim()).filter(Boolean),
        journal: trimmedSecondaryField,
        doi: trimmedPublicationUrl,
        publicationType: publicationType as 'Research Paper' | 'Journal' | 'Conference Proceedings' | 'Book Chapter' | 'Thesis',
        status: status as 'Published' | 'Accepted' | 'Under Review' | 'Preprint',
        abstract: trimmedDesc,
        keywords: tagArray,
        date: trimmedYear,
        researchArea: trimmedCategory,
        externalUrl: trimmedPublicationUrl || undefined,
        coverImage: coverImage || '',
        visibility: 'public' as const
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('publication', publicationItem);
        if (ok) closeModal();
        setIsSubmitting(false);
        return;
      }
      createPublication(publicationItem);
    } else if (contentType === 'achievement') {
      const achievementItem = {
        ...sharedBase,
        category: (trimmedCategory as any) || 'Award',
        organization: trimmedSecondaryField,
        personName: currentUser.name,
        personRole: currentUser.headline,
        personAvatar: currentUser.avatar,
        date: trimmedYear,
        description: desc,
        appliedSkills: tagArray,
        image: coverImage || '',
        certificateUrl: publicationUrl.trim() || undefined,
        isVerified: false,
        collaborators: [],
        visibility: 'public' as const
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('achievement', achievementItem);
        if (ok) closeModal();
        setIsSubmitting(false);
        return;
      }
      createAchievement(achievementItem);
    } else if (contentType === 'article') {
      const articleItem = {
        ...sharedBase,
        subtitle: trimmedSubtitle,
        category: trimmedCategory,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.headline,
          avatar: currentUser.avatar,
          bio: currentUser.bio
        },
        date: trimmedYear,
        readingTime: `${Math.max(1, Math.ceil(trimmedDesc.split(/\s+/).filter(Boolean).length / 200))} min read`,
        coverImage: coverImage || '',
        tags: tagArray,
        body: [trimmedDesc],
        views: 0
      };
      if (createModalEditingItem) {
        const ok = await updatePublishedContent('article', articleItem);
        if (ok) closeModal();
        setIsSubmitting(false);
        return;
      }
      createArticle(articleItem);
    } else if (contentType === 'opportunity') {
      const opportunityItem = {
        ...sharedBase,
        organization: trimmedSecondaryField,
        organizationLogo: coverImage || '',
        type: (category as any) || 'Internship',
        description: trimmedDesc,
        requirements: [],
        requiredSkills: tagArray,
        location: '',
        deadline: trimmedYear,
        applicationUrl: trimmedPublicationUrl || undefined,
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
        setIsSubmitting(false);
        return;
      }
      createOpportunity(opportunityItem);
    }

    closeModal();
    setIsSubmitting(false);
  };

  return (
    <>
      {pendingCropCover && (
        <ImageCropModal
          file={pendingCropCover}
          mode="cover"
          onClose={() => setPendingCropCover(null)}
          onApply={async (croppedFile) => {
            const dataUrl = await fileToDataUrl(croppedFile);
            setCoverImage(dataUrl);
            setPendingCropCover(null);
          }}
        />
      )}
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
                onClick={() => selectContentType(item.type)}
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

        <form onSubmit={handleSubmit} className="p-5 space-y-3" noValidate>
          <p className="text-[11px] text-slate-500">Fields marked <span className="font-bold text-red-600">*</span> are required. Please check highlighted fields before publishing.</p>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {contentType === 'project' ? 'Project Title' : contentType === 'publication' ? 'Paper Title' : 'Title'} *
            </label>
            <input type="text" required value={title} onChange={(e) => { setTitle(e.target.value); setFieldErrors((errors) => ({ ...errors, title: '' })); }} aria-invalid={Boolean(fieldErrors.title)} aria-describedby={fieldErrors.title ? 'title-error' : undefined} placeholder="Enter a clear title" className={`w-full h-8 px-2.5 rounded-lg border bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 ${fieldErrors.title ? 'border-red-400' : 'border-slate-200'}`} />
            {fieldErrors.title && <p id="title-error" className="mt-1 text-[11px] text-red-600">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Category / Type</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter category or type" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">{contentType === 'publication' ? 'Journal / Conference' : contentType === 'achievement' ? 'Awarding Body' : 'Organization / Affiliation'}</label>
              <input type="text" value={secondaryField} onChange={(e) => setSecondaryField(e.target.value)} placeholder="Enter organization, journal, or venue" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
            </div>
          </div>

          {contentType === 'project' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Problem / motivation</label>
                <textarea rows={2} value={problem} onChange={(e) => setProblem(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Solution / approach</label>
                <textarea rows={2} value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Supervisor name</label>
                <input type="text" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} placeholder="e.g., Dr. Ashik Rahman" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Team members</label>
                <input type="text" value={teamMembersText} onChange={(e) => setTeamMembersText(e.target.value)} placeholder="Name - role, one per line" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              </div>
              <input type="text" value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="Batch or graduation year" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Project year" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600">
                <option value="">Select status</option><option>Active</option><option>Completed</option><option>Published</option><option>Ongoing</option>
              </select>
              <input type="url" value={demoUrl} onChange={(e) => { setDemoUrl(e.target.value); setFieldErrors((errors) => ({ ...errors, demoUrl: '' })); }} aria-invalid={Boolean(fieldErrors.demoUrl)} placeholder="Demo URL (optional)" className={`w-full h-8 px-2.5 rounded-lg border bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 ${fieldErrors.demoUrl ? 'border-red-400' : 'border-slate-200'}`} />
              <input type="url" value={docUrl} onChange={(e) => { setDocUrl(e.target.value); setFieldErrors((errors) => ({ ...errors, docUrl: '' })); }} aria-invalid={Boolean(fieldErrors.docUrl)} placeholder="Documentation URL (optional)" className={`w-full h-8 px-2.5 rounded-lg border bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 ${fieldErrors.docUrl ? 'border-red-400' : 'border-slate-200'}`} />
            </div>
          )}

          {contentType === 'publication' && (
            <div className="space-y-2">
              <input type="text" value={authorsText} onChange={(e) => setAuthorsText(e.target.value)} placeholder="Authors, comma-separated" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              <select value={publicationType} onChange={(e) => setPublicationType(e.target.value)} className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"><option value="">Select publication type</option><option>Research Paper</option><option>Journal</option><option>Conference Proceedings</option><option>Book Chapter</option><option>Thesis</option></select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600"><option value="">Select publication status</option><option>Published</option><option>Accepted</option><option>Under Review</option><option>Preprint</option></select>
              <input type="text" value={year} onChange={(e) => { setYear(e.target.value); setFieldErrors((errors) => ({ ...errors, year: '' })); }} aria-invalid={Boolean(fieldErrors.year)} placeholder="Publication date (YYYY or YYYY-MM-DD)" className={`w-full h-8 px-2.5 rounded-lg border bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 ${fieldErrors.year ? 'border-red-400' : 'border-slate-200'}`} />
              <input type="text" value={publicationUrl} onChange={(e) => { setPublicationUrl(e.target.value); setFieldErrors((errors) => ({ ...errors, publicationUrl: '' })); }} aria-invalid={Boolean(fieldErrors.publicationUrl)} placeholder="DOI or external URL (optional)" className={`w-full h-8 px-2.5 rounded-lg border bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 ${fieldErrors.publicationUrl ? 'border-red-400' : 'border-slate-200'}`} />
            </div>
          )}

          {contentType === 'article' && (
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle (optional)" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
          )}

          {(contentType === 'achievement' || contentType === 'opportunity') && (
            <input type="text" value={year} onChange={(e) => { setYear(e.target.value); setFieldErrors((errors) => ({ ...errors, year: '' })); }} aria-invalid={Boolean(fieldErrors.year)} placeholder={contentType === 'achievement' ? 'Achievement date (YYYY-MM-DD, optional)' : 'Deadline (YYYY-MM-DD, optional)'} className={`w-full h-8 px-2.5 rounded-lg border bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 ${fieldErrors.year ? 'border-red-400' : 'border-slate-200'}`} />
          )}

          {contentType === 'opportunity' && (
            <div className="space-y-2">
              <textarea rows={2} value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Requirements (one per line)" className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
              <input type="text" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="Location (optional)" className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600" />
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
            <textarea required rows={5} value={desc} onChange={(e) => { setDesc(e.target.value); setFieldErrors((errors) => ({ ...errors, description: '' })); }} aria-invalid={Boolean(fieldErrors.description)} aria-describedby={fieldErrors.description ? 'description-error' : undefined} placeholder="Enter the full description, abstract, or article content..." className={`w-full p-2.5 rounded-lg border bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 ${fieldErrors.description ? 'border-red-400' : 'border-slate-200'}`} />
            {fieldErrors.description && <p id="description-error" className="mt-1 text-[11px] text-red-600">{fieldErrors.description}</p>}
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={closeModal} className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Saving…' : createModalEditingItem ? 'Update' : 'Publish to Department'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};
