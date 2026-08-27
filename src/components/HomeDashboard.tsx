import React from 'react';
import { useApp } from '../context/AppContext';

export const HomeDashboard: React.FC = () => {
  const {
    currentUser,
    announcements,
    projects,
    opportunities,
    users,
    setCurrentTab,
    setSelectedProject,
    setSelectedOpportunity,
    setSelectedUserForProfile,
    setSelectedArticle,
    articles,
    sendConnectionRequest,
    setIsCreateModalOpen,
    networkStats
  } = useApp();

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner / Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0F172A] text-white p-5 md:p-6 shadow-sm border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-bold tracking-widest uppercase border border-blue-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              IRE Department Network
            </div>
            <h1 className="font-heading text-[22px] md:text-[28px] font-bold text-white tracking-tight leading-tight">
              Welcome back, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Keep up with department projects, publications, opportunities, and announcements.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Publish Milestone</span>
            </button>
            <button
              onClick={() => setCurrentTab('discover')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">explore</span>
              <span>Discover Hub</span>
            </button>
          </div>
        </div>

        {/* Department statistics */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-5 pt-4 border-t border-slate-800">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cohorts &amp; Students</span>
            </div>
            <span className="text-[18px] md:text-[22px] font-bold text-white block mt-0.5">{networkStats.students}+</span>
          </div>
          <div className="border-l border-slate-800 pl-3 md:pl-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Global Alumni</span>
            </div>
            <span className="text-[18px] md:text-[22px] font-bold text-white block mt-0.5">{networkStats.alumni}+</span>
          </div>
          <div className="border-l border-slate-800 pl-3 md:pl-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Projects</span>
            </div>
            <span className="text-[18px] md:text-[22px] font-bold text-white block mt-0.5">{networkStats.projects}</span>
          </div>
        </div>
      </section>

      {/* Quick Access Bento Grid */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">
            Quick Department Access
          </h2>
          <button
            onClick={() => setCurrentTab('department')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Department Hub</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          <button
            onClick={() => setCurrentTab('department')}
            className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-100">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block leading-tight">Announcements</span>
              <span className="text-[10px] text-slate-500">Exam &amp; Lab notices</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('department')}
            className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-indigo-100">
              <span className="material-symbols-outlined text-[18px]">event</span>
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block leading-tight">Symposiums &amp; Events</span>
              <span className="text-[10px] text-slate-500">Workshops &amp; RSVP</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('department')}
            className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-100">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block leading-tight">Hall of Fame</span>
              <span className="text-[10px] text-slate-500">Competition Laureates</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('department')}
            className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all text-left group flex flex-col justify-between h-24"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform border border-slate-200">
              <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block leading-tight">History &amp; Archive</span>
              <span className="text-[10px] text-slate-500">Former faculty &amp; origins</span>
            </div>
          </button>
        </div>
      </section>

      {/* Department Updates Carousel */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">
            Department Updates &amp; Notices
          </h2>
          <button
            onClick={() => setCurrentTab('department')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setCurrentTab('department')}
              className={`snap-start shrink-0 w-[280px] md:w-[320px] bg-white rounded-xl border p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
                ann.isPinned ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ann.category === 'Exam Notice'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : ann.category === 'Workshop'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {ann.isPinned && (
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        push_pin
                      </span>
                    )}
                    {ann.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                </div>
                <h3 className="font-heading text-[14px] font-bold text-slate-900 mb-1 line-clamp-2 leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ann.description}
                </p>
              </div>
              {ann.image && (
                <div className="mt-3 rounded-lg overflow-hidden h-20 bg-slate-100 border border-slate-100">
                  <img src={ann.image} alt={ann.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Editorial Highlight */}
      {articles.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 md:p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-600 text-[18px]">auto_awesome</span>
              <h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">
                Featured Technical Article
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('discover')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Explore Discover Hub →
            </button>
          </div>

          <div
            onClick={() => setSelectedArticle(articles[0])}
            className="flex flex-col md:flex-row gap-4 items-center cursor-pointer group"
          >
            <div className="w-full md:w-5/12 aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
              <img
                src={articles[0].coverImage}
                alt={articles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="w-full md:w-7/12 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                  {articles[0].category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{articles[0].readingTime}</span>
              </div>
              <h3 className="font-heading text-[17px] md:text-[20px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {articles[0].title}
              </h3>
              <p className="text-xs md:text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
                {articles[0].subtitle}
              </p>
              <div className="flex items-center gap-2.5 pt-1.5">
                <img
                  src={articles[0].author.avatar}
                  alt={articles[0].author.name}
                  className="w-7 h-7 rounded-md object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{articles[0].author.name}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{articles[0].author.role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Connections */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">
            Recommended Connections
          </h2>
          <button
            onClick={() => setCurrentTab('network')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            People Directory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {otherUsers.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer"
                  onClick={() => setSelectedUserForProfile(user)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3
                      onClick={() => setSelectedUserForProfile(user)}
                      className="font-bold text-xs text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                    >
                      {user.name}
                    </h3>
                    <span className="material-symbols-outlined text-blue-600 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{user.headline}</p>
                  <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                    {user.batch || user.role} • {user.mutualConnectionsCount || 3} mutuals
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100">
                {(user.skills || []).slice(0, 3).map((skill) => (
                  <span key={skill} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-medium rounded">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-2.5 pt-2 flex gap-1.5">
                <button
                  onClick={() => sendConnectionRequest(user.id)}
                  className="flex-1 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors"
                >
                  Connect
                </button>
                <button
                  onClick={() => setSelectedUserForProfile(user)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                >
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">
              Featured Department Projects
            </h2>
            <p className="text-xs text-slate-500">
              Student builders, faculty supervision, and IEEE publications.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('discover')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            All Projects
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(0, 2).map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 shadow-2xs">
                  {proj.category}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-[#0F172A]/90 text-blue-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  {proj.batch}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h3 className="font-heading text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(proj.technologies || []).slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    {proj.supervisor?.avatar && (
                      <img
                        src={proj.supervisor.avatar}
                        alt={proj.supervisor.name || 'Supervisor'}
                        className="w-5 h-5 rounded object-cover border border-slate-200"
                      />
                    )}
                    <span className="truncate max-w-[140px]">Sup: {proj.supervisor?.name || 'Faculty Advisor'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-slate-700">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    <span>{proj.teamMembers?.length || 0} Members</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Opportunities */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="font-heading text-[16px] md:text-[18px] font-bold text-slate-900">
              Upcoming Opportunities
            </h2>
            <p className="text-xs text-slate-500">
              Matched directly to your skills: Python, ROS, Computer Vision.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('opportunities')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Explore Board
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {opportunities.slice(0, 2).map((opp) => (
            <div
              key={opp.id}
              onClick={() => setSelectedOpportunity(opp)}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2.5 mb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                      {opp.type}
                    </span>
                    <h3 className="font-heading text-[15px] font-bold text-slate-900 mt-1 leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-700">{opp.organization}</p>
                  </div>
                  {opp.organizationLogo ? (
                    <img
                      src={opp.organizationLogo}
                      alt={opp.organization}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs border border-slate-200">
                      {opp.organization.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {opp.location}
                </span>
                <span className="font-bold text-rose-600">Deadline: {opp.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
