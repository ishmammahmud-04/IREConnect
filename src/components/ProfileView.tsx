import React from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { FacultyProfileView } from './FacultyProfileView';

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
    setSelectedProject,
    setSelectedAchievement,
    setIsSettingsModalOpen,
    setIsLinkedInModalOpen,
    openMentorshipRequest,
    sendConnectionRequest,
    showToast
  } = useApp();

  const user = userOverride || currentUser;
  const isOwnProfile = user.id === currentUser.id;

  // Route to specialized Faculty view if role is faculty or former_faculty
  if (user.role === 'faculty' || user.role === 'former_faculty') {
    return <FacultyProfileView facultyUser={user} onBack={onBack} />;
  }

  const userProjects = (projects || []).filter((p) =>
    p.teamMembers?.some(
      (m) =>
        m.id === user.id ||
        (m.name && user.name && m.name.toLowerCase() === user.name.toLowerCase())
    )
  );
  const userAchievements = (achievements || []).filter(
    (a) =>
      a.personName &&
      user.name &&
      a.personName.toLowerCase() === user.name.toLowerCase()
  );
  const userPublications = (publications || []).filter((p) =>
    p.authors?.some(
      (a) => a && user.name && a.toLowerCase().includes(user.name.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
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
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-slate-900"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-5 pt-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover border-3 border-white shadow-xs bg-slate-100"
            />
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

            <p className="text-xs font-mono font-bold text-blue-600">
              {user.batch || user.role.toUpperCase()} • Class of {user.graduationYear || '2026'}
            </p>
            <p className="text-xs md:text-sm text-slate-700 font-medium">{user.headline}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center md:justify-start gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {user.location}
            </p>
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
                  onClick={() => setIsLinkedInModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#0077b5] text-white text-xs font-bold hover:bg-[#005f93] transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[15px]">sync</span>
                  <span>LinkedIn Sync</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => sendConnectionRequest(user.id)}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[15px]">person_add</span>
                  <span>Connect</span>
                </button>
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
              {user.mutualConnectionsCount || 500}+
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

              {(user.experience || []).map((exp) => (
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
              <button
                onClick={() => showToast('Opening PDF viewer for Sarah Chen CV...')}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px]">visibility</span>
                <span>View CV (PDF)</span>
              </button>
              <button
                onClick={() => showToast('Downloading Verified Academic CV...')}
                className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Download Resume</span>
              </button>
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
              {user.externalLinks?.linkedin && (
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
              {user.externalLinks?.github && (
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
              {user.externalLinks?.googleScholar && (
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
              {user.externalLinks?.orcid && (
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
      {userProjects.length > 0 && (
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

      {/* Achievements on Profile */}
      {userAchievements.length > 0 && (
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
    </div>
  );
};
