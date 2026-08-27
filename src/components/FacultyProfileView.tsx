import React from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

interface FacultyProfileViewProps {
  facultyUser: User;
  onBack?: () => void;
}

export const FacultyProfileView: React.FC<FacultyProfileViewProps> = ({ facultyUser, onBack }) => {
  const {
    projects,
    publications,
    setSelectedProject,
    setSelectedPublication,
    openMentorshipRequest,
    showToast
  } = useApp();

  const supervisedProjects = (projects || []).filter(
    (p) =>
      p.supervisor?.id === facultyUser.id ||
      (p.supervisor?.name &&
        facultyUser.name &&
        p.supervisor.name.toLowerCase().includes(facultyUser.name.toLowerCase()))
  );

  const facultyPublications = (publications || []).filter((p) =>
    p.authors?.some(
      (a) =>
        a &&
        facultyUser.name &&
        a.toLowerCase().includes(facultyUser.name.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300 pb-16">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Directory</span>
        </button>
      )}

      {/* Faculty Hero Banner */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 md:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start gap-5">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-100 shrink-0">
            <img
              src={facultyUser.avatar}
              alt={facultyUser.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900">
                {facultyUser.name}
              </h1>
              {facultyUser.isFormerFaculty ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                  Former Faculty ({facultyUser.periodServed || 'Emeritus'})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Current Faculty
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm font-semibold text-blue-600">
              {facultyUser.designation || 'Professor of Robotics & Autonomous Systems'}
            </p>

            {facultyUser.currentAffiliation && (
              <p className="text-xs text-slate-700 font-medium">
                Current Affiliation: {facultyUser.currentAffiliation}
              </p>
            )}

            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {facultyUser.bio}
            </p>

            {/* Specialization Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(facultyUser.specialization || facultyUser.skills || []).map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200/60"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0 self-stretch md:self-start">
            <button
              onClick={() => openMentorshipRequest(facultyUser)}
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[15px]">school</span>
              <span>Request Supervision</span>
            </button>
            <button
              onClick={() => showToast('Opening official academic CV...')}
              className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Academic CV</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2-Column Bento: Courses & Supervised Students */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Courses & Supervision */}
        <div className="md:col-span-5 space-y-4">
          {/* Courses Taught */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">menu_book</span>
              <span>Courses Taught</span>
            </h2>

            <div className="space-y-2">
              {(facultyUser.coursesTaught || [
                { code: 'IRE-301', name: 'Intro to Robotics & Actuators', term: 'Fall 2024', level: 'UG' },
                { code: 'IRE-540', name: 'Ethics in AI & Autonomy', term: 'Spring 2024', level: 'PG' },
                { code: 'IRE-601', name: 'Advanced Machine Learning & SLAM', term: 'Fall 2023', level: 'PG' }
              ]).map((course) => (
                <div
                  key={course.code}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{course.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {course.code} • {course.term}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Supervised Students */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">groups</span>
              <span>Supervised Students &amp; Mentees</span>
            </h2>
            <p className="text-xs text-slate-600">
              Currently advising 4 PhD candidates, 8 Masters researchers, and 12 Undergraduate thesis teams.
            </p>

            <div className="flex items-center pt-2">
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0nMIqwp8dEAIp1pfG9DjJgfIzhCHpLMM2NDqNuC_uUFJKnR4kUc-EOItJyCOJugS5UDIbhOmuUPAUX79ykTOwkvizL7A28qE0yQXJoqdQ9-IO1yBq_lsz-pc5MU2jEhTq_Y7KjyHSKdhfJUEZW_IuQ9YY7yrJBDbcEVGlBwVmABP8dx8-8FjgebJ3PcNKM8StMIgytp__tQv4YvHrOACsqYhhT6D0Pc5Aj9YQOFJkuZg1yXq1KggaPg"
                  alt="Sarah Chen"
                  title="Sarah Chen (Lead Systems)"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDFPXrS5u1ogF44Q_T_g2VNa4OWqAIIz5Ac5x3JLhHeYTZrUA1NO-bpT5a70ju-WjYzvEhWnKwQIvpAsOxyQqycK-Zi1vTalHYE-QT19_rHaJ8NEj5zqu0xORSmm7yVV9Qvl5XZjhY4ZDxfcWORkv-qvCc7Xxl51v0Ip73Anh8tImIBMnMiY6TzLe9a3agECw-LnOdoircpd3LLU9x_XJ3Cw-LSdmKheP-TA6u5ZBYkC4r6j1dX1WjZg"
                  alt="Ahmed Rahman"
                  title="Ahmed Rahman"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMRWUSpMcD-KgjKr7bRdIfjGk5t3KQneSAX12W6I7phnf9mU4oqy3Y3C6SmNTgqRVkNo2AdXNTJudZE6zkCDXB5z1z0-QzWKEZCTqAu-gJln787hTfjNmZBGkbupwm_y-x7IyGmvsuCQfpJiwntXajpAi_ndhwQFKlT_YMLcAe-IHF8osYoqdzeorKCa1_V1k3A9RedRhAHUwD8zRIupSvlDJT45aBUaMwLu4WfBEQw8TXfnTU0su7qQ"
                  alt="David Kim"
                  title="David Kim"
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                  +12
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Publications & Supervised Projects */}
        <div className="md:col-span-7 space-y-4">
          {/* Supervised Projects Carousel */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-600 text-[16px]">science</span>
                <span>Supervised Projects ({supervisedProjects.length})</span>
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supervisedProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="h-28 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/90 text-[9px] font-bold text-white uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>
                  <div className="p-3 space-y-0.5">
                    <h3 className="font-heading text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Publications */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h2 className="font-heading text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[16px]">article</span>
              <span>Recent Peer-Reviewed Publications</span>
            </h2>

            <div className="space-y-2.5 divide-y divide-slate-100">
              {facultyPublications.map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => setSelectedPublication(pub)}
                  className="pt-2.5 first:pt-0 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer group"
                >
                  <h3 className="font-heading text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {pub.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pub.authors.join(', ')}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-mono mt-1">
                    <span>{pub.journal}</span>
                    <span>•</span>
                    <span>{pub.date}</span>
                    <span>•</span>
                    <span>{pub.citations || 42} Citations</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
