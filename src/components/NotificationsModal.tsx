import React from 'react';
import { AppNotification } from '../types';
import { useApp } from '../context/AppContext';

const notificationIcons: Record<AppNotification['type'], string> = {
  connection: 'person_add',
  mentorship: 'school',
  opportunity: 'work',
  announcement: 'campaign',
  event: 'event',
  verification: 'verified'
};

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsModalOpen,
    setIsNotificationsModalOpen,
    notifications,
    markNotificationsAsRead
  } = useApp();

  if (!isNotificationsModalOpen) return null;

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={() => setIsNotificationsModalOpen(false)}
    >
      <section
        className="relative my-4 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-blue-600">notifications</span>
            <h2 id="notifications-title" className="font-heading text-sm font-bold text-slate-900">
              Notifications{unreadCount > 0 ? ` (${unreadCount} new)` : ''}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markNotificationsAsRead}
                className="rounded-md px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsNotificationsModalOpen(false)}
              aria-label="Close notifications"
              className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>

        <div className="max-h-[65vh] divide-y divide-slate-100 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <span className="material-symbols-outlined text-[30px] text-slate-400">notifications_off</span>
              <p className="mt-2 text-xs font-bold text-slate-700">You are all caught up.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className={`flex gap-3 px-5 py-3.5 ${notification.isRead ? 'bg-white' : 'bg-blue-50/60'}`}
              >
                {notification.avatar ? (
                  <img
                    src={notification.avatar}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <span className="material-symbols-outlined text-[17px]">{notificationIcons[notification.type]}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xs font-bold text-slate-900">{notification.title}</h3>
                    {!notification.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{notification.message}</p>
                  <time className="mt-1 block text-[10px] font-medium text-slate-400">{notification.time}</time>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
