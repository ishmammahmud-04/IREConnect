import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { FacultyProfileView } from './FacultyProfileView';
import { ProfileCompletenessCard } from './ProfileCompletenessCard';

interface ProfileViewProps {
  userOverride?: User | null;
  onBack?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userOverride, onBack }) => {
  const {
    currentUser,
    projects,
    achievements,
    publications,
    articles,
    opportunities,
    setSelectedProject,
    setSelectedAchievement,
    setSelectedPublication,
    setSelectedArticle,
    setSelectedOpportunity,
    setIsSettingsModalOpen,
    openMentorshipRequest,
    sendConnectionRequest,
    showToast,
    getConnectionCount
    , getConnectionStatus,
    openChat
  } = useApp();

  const user = userOverride || currentUser;
  const isOwnProfile = user.id === currentUser.id;
  const isConnected = getConnectionStatus(user.id) === 'connected';
  const canView = (visibility: User['privacy'][keyof User['privacy']]) =>
    isOwnProfile || visibility === 'public' || (visibility === 'department' && user.department === currentUser.department) || (visibility === 'connections' && isConnected);
  const canViewExperience = canView(user.privacy?.experience || 'private');
  const canViewProjects = canView(user.privacy?.projects || 'private');
  const canViewAchievements = canView(user.privacy?.achievements || 'private');
  const canViewPublications = canView(user.privacy?.publications || 'private');
  const canViewCv = canView(user.privacy?.cv || 'private');
  const canViewExternalLinks = canView(user.privacy?.externalLinks || 'private');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const clampZoom = (value: number) => Math.min(3, Math.max(1, Number(value.toFixed(2))));

  const openImageViewer = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const closeImageViewer = () => {
    setZoomedImage(null);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.25 : 0.25;
    setZoomLevel((current) => clampZoom(current + delta));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;
    setPan({ x: dragStartRef.current.panX + dx / 1.2, y: dragStartRef.current.panY + dy / 1.2 });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    dragStartRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (user.role === 'faculty' || user.role === 'former_faculty') {
    return <FacultyProfileView facultyUser={user} onBack={onBack} />;
  }

  const sameOwner = (ownerId?: string) => Boolean(ownerId && user.id && String(ownerId) === String(user.id));
  const userProjects = (projects || []).filter((p) =>
    sameOwner(p.ownerId) || p.teamMembers?.some(
      (m) =>
        m.id === user.id ||
        (m.name && user.name && m.name.toLowerCase() === user.name.toLowerCase())
    )
  );
  const userAchievements = (achievements || []).filter(
    (a) => sameOwner(a.ownerId) || Boolean(
      a.personName &&
      user.name &&
      a.personName.toLowerCase() === user.name.toLowerCase()
    )
  );
  const userPublications = (publications || []).filter((p) =>
    sameOwner(p.ownerId) || p.authors?.some(
      (a) => a && user.name && a.toLowerCase().includes(user.name.toLowerCase())
    )
  );
  const userArticles = (articles || []).filter((article) => sameOwner(article.ownerId) || article.author?.id === user.id);
  const userOpportunities = (opportunities || []).filter((opportunity) => sameOwner(opportunity.ownerId));
  const postedContentCount = userProjects.length + userAchievements.length + userPublications.length + userArticles.length + userOpportunities.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeImageViewer}
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeImageViewer();
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-end gap-2 w-full">
              <button type="button" onClick={() => setZoomLevel((value) => clampZoom(value - 0.25))} className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/20">−</button>
              <button type="button" onClick={() => setZoomLevel(1)} className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/20">Reset</button>
              <span className="min-w-12 text-center text-xs font-bold text-white">{zoomLevel.toFixed(2)}x</span>
              <button type="button" onClick={() => setZoomLevel((value) => clampZoom(value + 0.25))} className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/20">+</button>
              <button type="button" onClick={closeImageViewer} className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/20">Close</button>
            </div>
            <div
              className="w-full overflow-hidden rounded-xl border border-white/20 bg-slate-950/80 p-2 select-none"
              onWheel={handleWheelZoom}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <img
                src={zoomedImage}
                alt="Expanded profile media"
                className="max-h-[80vh] w-full object-contain rounded-lg transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
                style={{
                  transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Back button if viewing another profile */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Directory</span>
        </button>
      )}

      {/* Profile Header Identity Card */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="relative h-28 md:h-36 w-full overflow-hidden bg-slate-900">
          {user.bannerUrl && (
            <button
              type="button"
              onClick={() => openImageViewer(user.bannerUrl!)}
              className="block h-full w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="View profile banner in full size"
            >
              <img src={user.bannerUrl} alt="Profile banner" className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]" />
            </button>
          )}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-5 px-5 pb-5 pt-4 md:px-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => openImageViewer(user.avatar)}
              className="block rounded-xl overflow-hidden border-3 border-white shadow-xs bg-slate-100"
              aria-label="View profile photo in full size"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
              />
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="absolute bottom-1 right-1 w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs hover:bg-slate-800 transition-transform"
                title="Edit Photo"
              >
                <span className="material-symbols-outlined text-[13px]">edit</span>
              </button>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-0.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
              <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900">
                {user.name}
              </h1>
              <span className="material-symbols-outlined text-blue-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>

            {user.bio && <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-xl">{user.bio}</p>}
            {user.headline && <p className="text-xs text-slate-500">{user.headline}</p>}
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 justify-center">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">settings</span>
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#0077b5] text-white text-xs font-bold hover:bg-[#005f93] transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Edit LinkedIn Link</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { if (getConnectionStatus(user.id) === 'none') sendConnectionRequest(user.id); }}
                  disabled={getConnectionStatus(user.id) !== 'none'}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs ${getConnectionStatus(user.id) === 'connected' ? 'bg-emerald-100 text-emerald-700' : getConnectionStatus(user.id) === 'pending' ? 'bg-slate-100 text-slate-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  <span className="material-symbols-outlined text-[15px]">person_add</span>
                  <span>{getConnectionStatus(user.id) === 'connected' ? 'Connected' : getConnectionStatus(user.id) === 'pending' ? 'Pending' : 'Connect'}</span>
                </button>
                {getConnectionStatus(user.id) === 'connected' && (
                  <button
                    onClick={() => openChat(user)}
                    className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">mail</span>
                    <span>Message</span>
                  </button>
                )}
                {user.isAvailableForMentorship && (
                  <button
                    onClick={() => openMentorshipRequest(user)}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">school</span>
                    <span>Request Mentorship</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2 border-t border-slate-100 mt-5 pt-3 text-center">
          <div>
            <span className="text-base md:text-lg font-mono font-bold text-slate-900 block">
              {getConnectionCount(user.id)}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Connections</span>
          </div>
          <div>
            <span className="text-base md:text-lg font-mono font-bold text-slate-900 block">
              {userProjects.length}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Projects</span>
          </div>
          <div>
            <span className="text-base md:text-lg font-mono font-bold text-slate-900 block">
              {userAchievements.length}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Awards</span>
          </div>
          <div>
            <span className="text-base md:text-lg font-mono font-bold text-slate-900 block">
              {userPublications.length}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Papers</span>
          </div>
        </div>
      </section>

      <ProfileCompletenessCard user={user} />

      {/* Grid: Bio, CV, Skills */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Biography & Summary */}
        <div className="md:col-span-8 space-y-4">
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
            <h2 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">person</span>
              <span>Professional Summary</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {user.bio}
            </p>
          </section>

          {/* Education & Experience */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h2 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">school</span>
              <span>Education &amp; Experience</span>
            </h2>

            <div className="space-y-3 divide-y divide-slate-100">
              {(user.education || []).map((edu) => (
                <div key={edu.id} className="pt-2.5 first:pt-0">
                  <h3 className="font-bold text-xs text-slate-900">{edu.institution}</h3>
                  <p className="text-xs text-slate-600">{edu.degree} — {edu.field}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{edu.startYear} – {edu.endYear}</p>
                </div>
              ))}

              {canViewExperience && (user.experience || []).map((exp) => (
                <div key={exp.id} className="pt-2.5 first:pt-0">
                  <h3 className="font-bold text-xs text-slate-900">{exp.position}</h3>
                  <p className="text-xs text-blue-600 font-medium">{exp.organization}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{exp.startDate} – {exp.endDate}</p>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: CV, Skills, External Links */}
        <div className="md:col-span-4 space-y-4">
          {/* CV Card */}
          <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">description</span>
              <span>Curriculum Vitae (CV)</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Verified PDF resume containing academic history, research projects, and skills.
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              {canViewCv && user.cvUrl ? (
                <>
                  <a
                    href={user.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                    <span>View CV (PDF)</span>
                  </a>
                  <a
                    href={user.cvUrl}
                    download
                    className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>Download Resume</span>
                  </a>
                </>
              ) : canViewCv ? (
                <div className="text-[11px] text-slate-500 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-center">
                  No CV uploaded yet.
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-center">
                  CV is private.
                </div>
              )}
            </div>
          </section>

          {/* Skills Chips */}
          <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">build</span>
              <span>Skills &amp; Technologies</span>
            </h2>
            <div className="flex flex-wrap gap-1">
              {(user.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* External Profiles */}
          <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">link</span>
              <span>Connected Links</span>
            </h2>
            <div className="space-y-1.5 text-xs">
              {canViewExternalLinks && user.externalLinks?.linkedin && (
                <a
                  href={`https://${user.externalLinks.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold text-[#0077b5]">in</span> LinkedIn
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
                </a>
              )}
              {canViewExternalLinks && user.externalLinks?.github && (
                <a
                  href={`https://${user.externalLinks.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">code</span> GitHub
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
                </a>
              )}
              {canViewExternalLinks && user.externalLinks?.googleScholar && (
                <a
                  href={`https://${user.externalLinks.googleScholar}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">school</span> Scholar
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
                </a>
              )}
              {canViewExternalLinks && user.externalLinks?.orcid && (
                <a
                  href={`https://orcid.org/${user.externalLinks.orcid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#a6ce39] font-bold text-[11px]">iD</span> ORCID
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
                </a>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Projects Showcase on Profile */}
      {canViewProjects && userProjects.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Showcased Projects ({userProjects.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {proj.category}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <h3 className="font-heading text-xs md:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(proj.technologies || []).slice(0, 3).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {canViewPublications && userPublications.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            Published Papers &amp; Journals ({userPublications.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userPublications.map((publication) => (
              <button
                type="button"
                key={publication.id}
                onClick={() => setSelectedPublication(publication)}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-blue-500 hover:shadow-xs"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <span className="material-symbols-outlined text-[20px]">article</span>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
                    {publication.publicationType} · {publication.status}
                  </span>
                  <h3 className="font-heading text-xs md:text-sm font-bold leading-snug text-slate-900">
                    {publication.title}
                  </h3>
                  <p className="truncate text-[11px] text-slate-500">
                    {publication.journal} · {publication.date}
                  </p>
                  {publication.pdfUrl && (
                    <span className="inline-flex items-center gap-1 pt-1 text-[10px] font-bold text-blue-600">
                      <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
                      PDF available
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Achievements on Profile */}
      {canViewAchievements && userAchievements.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            Achievements &amp; Honors ({userAchievements.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userAchievements.map((ach) => (
              <div
                key={ach.id}
                onClick={() => setSelectedAchievement(ach)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 font-mono">{ach.category} • {ach.date}</span>
                  <h3 className="font-heading text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {postedContentCount > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h2 className="font-heading text-sm font-bold text-slate-900">
            Posted Content ({postedContentCount})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {canViewProjects && userProjects.map((project) => (
              <button type="button" key={`project-${project.id}`} onClick={() => setSelectedProject(project)} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-500 hover:bg-slate-50">
                <span className="material-symbols-outlined text-blue-600">science</span>
                <span className="min-w-0"><strong className="block truncate text-xs text-slate-900">{project.title}</strong><span className="text-[10px] text-slate-500">Project</span></span>
              </button>
            ))}
            {canViewAchievements && userAchievements.map((achievement) => (
              <button type="button" key={`achievement-${achievement.id}`} onClick={() => setSelectedAchievement(achievement)} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-500 hover:bg-slate-50">
                <span className="material-symbols-outlined text-amber-600">emoji_events</span>
                <span className="min-w-0"><strong className="block truncate text-xs text-slate-900">{achievement.title}</strong><span className="text-[10px] text-slate-500">Award</span></span>
              </button>
            ))}
            {canViewPublications && userPublications.map((publication) => (
              <button type="button" key={`publication-${publication.id}`} onClick={() => setSelectedPublication(publication)} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-500 hover:bg-slate-50">
                <span className="material-symbols-outlined text-emerald-600">article</span>
                <span className="min-w-0"><strong className="block truncate text-xs text-slate-900">{publication.title}</strong><span className="text-[10px] text-slate-500">Paper / Journal</span></span>
              </button>
            ))}
            {userArticles.map((article) => (
              <button type="button" key={`article-${article.id}`} onClick={() => setSelectedArticle(article)} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-500 hover:bg-slate-50">
                <span className="material-symbols-outlined text-indigo-600">auto_stories</span>
                <span className="min-w-0"><strong className="block truncate text-xs text-slate-900">{article.title}</strong><span className="text-[10px] text-slate-500">Article</span></span>
              </button>
            ))}
            {userOpportunities.map((opportunity) => (
              <button type="button" key={`opportunity-${opportunity.id}`} onClick={() => setSelectedOpportunity(opportunity)} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-500 hover:bg-slate-50">
                <span className="material-symbols-outlined text-rose-600">work</span>
                <span className="min-w-0"><strong className="block truncate text-xs text-slate-900">{opportunity.title}</strong><span className="text-[10px] text-slate-500">Opportunity</span></span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
