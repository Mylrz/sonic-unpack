import React from 'react';
import { Disc3, History, Settings, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../../types/settings';
import { getTranslation } from '../../i18n';

export type NavTab = 'convert' | 'history' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingCount?: number;
  historyCount?: number;
  language?: SupportedLanguage;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingCount = 0,
  historyCount = 0,
  language = 'zh-CN',
}) => {
  const t = getTranslation(language);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'convert',
      label: t.tabConvert,
      icon: <Disc3 className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'history',
      label: t.tabHistory,
      icon: <History className="w-4 h-4" />,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    {
      id: 'settings',
      label: t.tabSettings,
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-52 h-full flex flex-col justify-between border-r border-[var(--border-color)] bg-[var(--bg-surface)] p-3 select-none flex-shrink-0">
      {/* Navigation list */}
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-[var(--text-muted)] tracking-wider uppercase">
          {t.navTitle}
        </div>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-smooth ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:bg-neutral-50 dark:hover:bg-neutral-850 hover:text-[var(--text-main)]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={isActive ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-neutral-200 dark:bg-neutral-700 text-[var(--text-main)]'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-[var(--border-color)] space-y-1">
        <div className="flex items-center space-x-1.5 text-xs text-[var(--text-main)] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t.offlineBadge}</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          {t.offlineDesc}
        </p>
      </div>
    </aside>
  );
};
