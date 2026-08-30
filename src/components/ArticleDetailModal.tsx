import React from 'react';
import { useApp } from '../context/AppContext';

export const ArticleDetailModal: React.FC = () => {
  const { selectedArticle, setSelectedArticle, toggleSaveItem, isItemSaved, showToast, currentUser, deletePublishedContent, setCreateModalEditingItem, setIsCreateModalOpen } = useApp();

  if (!selectedArticle) return null;

  const isSaved = isItemSaved(selectedArticle.id);
  const canManage = selectedArticle.ownerId === currentUser.id;
  const handleDelete = async () => {
    if (await deletePublishedContent('article', selectedArticle.id)) setSelectedArticle(null);
  };
  const handleEdit = () => {
    setCreateModalEditingItem({ type: 'article', item: selectedArticle });
    setIsCreateModalOpen(true);
    setSelectedArticle(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard for sharing!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 relative animate-in zoom-in-95 duration-200">
        {/* Sticky Detail Top Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleSaveItem(selectedArticle.id)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                isSaved ? 'text-blue-600' : 'text-slate-500'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Bookmark'}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title="Share"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            {canManage && (
              <>
                <button onClick={handleEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Edit article"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                <button onClick={() => void handleDelete()} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete article"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </>
            )}
            <button
              onClick={() => setSelectedArticle(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="w-full aspect-[21/8] bg-slate-100 overflow-hidden relative">
          <img
            src={selectedArticle.coverImage}
            alt={selectedArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-8 max-w-3xl mx-auto space-y-5">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block font-mono">
              {selectedArticle.category}
            </span>
            <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
              {selectedArticle.title}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedArticle.subtitle}
            </p>

            {/* Author Card */}
            <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedArticle.author.avatar}
                  alt={selectedArticle.author.name}
                  className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{selectedArticle.author.name}</h4>
                  <p className="text-[10px] text-slate-500">{selectedArticle.author.role}</p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500 font-mono">
                <p>Published {selectedArticle.date}</p>
                <p className="text-blue-600 font-bold flex items-center justify-end gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  {selectedArticle.readingTime}
                </p>
              </div>
            </div>
          </div>

          {/* Article Text */}
          <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed font-normal">
            {(Array.isArray(selectedArticle.body)
              ? selectedArticle.body
              : [selectedArticle.body || '']
            ).map((para, idx) => (
              <p key={idx} className={idx === 0 ? "first-letter:text-3xl first-letter:font-bold first-letter:text-slate-900 first-letter:float-left first-letter:mr-2 first-letter:mt-0.5" : ""}>
                {para}
              </p>
            ))}

            {/* Blockquote feature */}
            <blockquote className="my-4 pl-3.5 border-l-2 border-blue-600 py-2 bg-blue-50/50 rounded-r-lg italic text-xs text-slate-800 font-medium">
              "The real challenge was not assembling the hardware; it was tuning the PID controllers to ensure the rover moved exactly as the navigation stack intended."
              <footer className="text-[10px] text-slate-500 font-normal not-italic mt-1">
                   — IRE Network contributor
              </footer>
            </blockquote>

            {/* Code / Architecture Diagram Section */}
            <div className="my-4 rounded-lg bg-slate-900 text-white p-4 font-mono text-xs overflow-x-auto space-y-1.5 border border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1.5 border-b border-slate-800 font-sans">
                <span>ros_node_bridge.py</span>
                <span>Python 3.10 • ROS Noetic</span>
              </div>
              <pre className="text-blue-300">
{`import rospy
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

def scan_callback(msg):
    # Process 360-degree LiDAR point cloud ranges
    min_dist = min(msg.ranges)
    cmd = Twist()
    if min_dist < 0.45:
        cmd.angular.z = 0.75  # Autonomous obstacle avoidance trajectory
    else:
        cmd.linear.x = 0.3
    pub.publish(cmd)`}
              </pre>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">Tags:</span>
            {(selectedArticle.tags || []).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/60 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
