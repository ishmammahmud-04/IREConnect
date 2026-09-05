import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Achievement, Education, Experience, ExternalLinks, Project, Publication, UserRole, VerificationState } from '../types';

interface PublicProfileData {
  id: string;
  name: string;
  role: UserRole;
  verificationStatus: VerificationState;
  avatar?: string;
  bannerUrl?: string;
  department: string;
  headline: string;
  bio: string;
  location: string;
  batch?: string;
  skills?: string[];
  education?: Education[];
  email?: string | null;
  cvUrl?: string | null;
  experience?: Experience[] | null;
  externalLinks?: ExternalLinks | null;
  projects?: Project[] | null;
  achievements?: Achievement[] | null;
  publications?: Publication[] | null;
}

interface PublicProfileViewProps {
  userId: string;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({ userId }) => {
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const loadProfile = async () => {
      try {
        const { data, error: rpcError } = await supabase.rpc('get_public_profile', { target_id: userId });
        if (!active) return;
        if (rpcError) {
          setError(rpcError.message);
          setLoading(false);
          return;
        }
        if (!data) {
          setError('Profile not found or is set to private.');
          setLoading(false);
          return;
        }
        setProfile(data as PublicProfileData);
        setLoading(false);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Could not load public profile.');
        setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [userId]);

  const externalUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-slate-600">Loading public profile…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <span className="material-symbols-outlined text-[32px]">person_off</span>
        </div>
        <h1 className="font-heading text-lg font-bold text-slate-900 mb-1">Profile Unavailable</h1>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          {error || 'This profile is either private or does not exist on IRE Network.'}
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Go to IRE Network</span>
        </a>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    student: 'Student',
    alumni: 'Alumni',
    faculty: 'Faculty',
    former_faculty: 'Former Faculty',
    admin: 'Department Admin'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-blue-500/20 selection:text-blue-600 pb-16">
      {/* Top Public Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-900 hover:opacity-90">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono">
              IRE
            </span>
            <span className="font-heading font-extrabold text-sm tracking-tight">
              IRE Network
            </span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Sign In / Join
            </a>
          </div>
        </div>
      </header>

      {/* Main Profile Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          {/* Banner */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
            {profile.bannerUrl && (
              <img
                src={profile.bannerUrl}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Public Profile
              </span>
            </div>
          </div>

          {/* Profile Basic Info */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-900 text-white text-3xl font-extrabold flex items-center justify-center ring-4 ring-white shadow-md">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {profile.cvUrl && (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>View CV / Resume</span>
                </a>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                  {roleLabels[profile.role] || profile.role}
                </span>
                {profile.verificationStatus && profile.verificationStatus.includes('Verified') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {profile.headline && (
                <p className="text-sm font-medium text-slate-700 leading-snug">
                  {profile.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <span>{profile.department}</span>
                {profile.batch && <span>• Batch: {profile.batch}</span>}
                {profile.location && <span>• {profile.location}</span>}
              </div>
            </div>

            {/* External links */}
            {profile.externalLinks && Object.values(profile.externalLinks).some(Boolean) && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-4">
                {profile.externalLinks.linkedin && (
                  <a
                    href={externalUrl(profile.externalLinks.linkedin) || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    <span>LinkedIn</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                )}
                {profile.externalLinks.github && (
                  <a
                    href={externalUrl(profile.externalLinks.github) || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    <span>GitHub</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                )}
                {profile.externalLinks.googleScholar && (
                  <a
                    href={externalUrl(profile.externalLinks.googleScholar) || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    <span>Google Scholar</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                )}
                {profile.externalLinks.portfolio && (
                  <a
                    href={externalUrl(profile.externalLinks.portfolio) || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    <span>Portfolio</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    <span>{profile.email}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              About
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Technical Skills &amp; Specialties
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Experience
            </h2>
            <div className="space-y-4 divide-y divide-slate-100">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-700">{exp.organization}</p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Education
            </h2>
            <div className="space-y-3 divide-y divide-slate-100">
              {profile.education.map((edu) => (
                <div key={edu.id} className="pt-3 first:pt-0 space-y-0.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{edu.institution}</h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    {edu.degree} in {edu.field}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {profile.projects && profile.projects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Featured Projects ({profile.projects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl border border-slate-200 p-4 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <h3 className="font-heading text-sm font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications */}
        {profile.publications && profile.publications.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Publications ({profile.publications.length})
            </h2>
            <div className="space-y-3 divide-y divide-slate-100">
              {profile.publications.map((pub) => (
                <div key={pub.id} className="pt-3 first:pt-0 space-y-1">
                  <h3 className="text-xs font-bold text-slate-900">{pub.title}</h3>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">{pub.journal || pub.conference || 'Publication'}</span> • {pub.date}
                  </p>
                  {pub.doi && (
                    <p className="text-[11px] font-mono text-blue-600">DOI: {pub.doi}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Achievements &amp; Honors ({profile.achievements.length})
            </h2>
            <div className="space-y-3 divide-y divide-slate-100">
              {profile.achievements.map((ach) => (
                <div key={ach.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{ach.title}</h3>
                    <span className="text-xs text-slate-500">{ach.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center py-6 text-xs text-slate-400 space-y-1">
          <p>This is a verified public profile hosted on IRE Network.</p>
          <p>Department of IoT &amp; Robotics Engineering • UFT Bangladesh</p>
        </div>
      </main>
    </div>
  );
};
