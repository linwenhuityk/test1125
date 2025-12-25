
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  participantCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, participantCount }) => {
  const menuItems = [
    { id: AppTab.LIST, icon: 'fa-users', label: '名單管理' },
    { id: AppTab.LUCKY_DRAW, icon: 'fa-gift', label: '獎品抽籤' },
    { id: AppTab.GROUPING, icon: 'fa-layer-group', label: '自動分組' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-20">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fas fa-magic text-xl"></i>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 tracking-tight">HR Magic Box</h2>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">v1.0.0</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <i className={`fas ${item.icon} w-5 text-center`}></i>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <i className="fas fa-user-check text-xs"></i>
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium">當前名單人數</p>
            <p className="text-lg font-bold text-slate-800">{participantCount}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
