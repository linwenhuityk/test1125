
import React, { useState } from 'react';
import { Participant, Group } from '../types';

interface AutoGroupingProps {
  participants: Participant[];
}

const AutoGrouping: React.FC<AutoGroupingProps> = ({ participants }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [peoplePerGroup, setPeoplePerGroup] = useState(3);
  const [isGrouping, setIsGrouping] = useState(false);

  const performGrouping = () => {
    if (participants.length === 0) return;
    setIsGrouping(true);

    // Artificial delay for "calculation" feeling
    setTimeout(() => {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      const newGroups: Group[] = [];
      const numGroups = Math.ceil(shuffled.length / peoplePerGroup);

      for (let i = 0; i < numGroups; i++) {
        const start = i * peoplePerGroup;
        const end = start + peoplePerGroup;
        newGroups.push({
          id: `group-${i}`,
          name: `第 ${i + 1} 組`,
          members: shuffled.slice(start, end)
        });
      }

      setGroups(newGroups);
      setIsGrouping(false);
    }, 600);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    const rows = [["組別", "姓名"]];
    groups.forEach(group => {
      group.members.forEach(member => {
        rows.push([group.name, member.name]);
      });
    });

    // 加上 BOM (\uFEFF) 確保 Excel 開啟時能正確辨識 UTF-8 中文
    const csvContent = "\uFEFF" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupColors = [
    'border-indigo-500 bg-indigo-50',
    'border-emerald-500 bg-emerald-50',
    'border-amber-500 bg-amber-50',
    'border-rose-500 bg-rose-50',
    'border-cyan-500 bg-cyan-50',
    'border-violet-500 bg-violet-50',
    'border-orange-500 bg-orange-50',
    'border-blue-500 bg-blue-50',
  ];

  return (
    <div className="space-y-8 h-full">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-semibold text-slate-700">每組幾人？</label>
          <div className="relative">
            <i className="fas fa-users-cog absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="number" 
              min="2" 
              max={participants.length}
              value={peoplePerGroup}
              onChange={(e) => setPeoplePerGroup(parseInt(e.target.value) || 2)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="text-sm font-semibold text-slate-700">預計組數</div>
          <div className="py-3 px-6 bg-slate-100 rounded-xl text-slate-600 font-bold border border-slate-200">
            {Math.ceil(participants.length / peoplePerGroup) || 0} 組
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={performGrouping}
            disabled={isGrouping || participants.length === 0}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
              isGrouping || participants.length === 0 
              ? 'bg-slate-400' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'
            }`}
          >
            {isGrouping ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
            執行自動分組
          </button>

          {groups.length > 0 && (
            <button 
              onClick={downloadCSV}
              className="px-6 py-3 rounded-xl font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-2 shadow-sm"
            >
              <i className="fas fa-download"></i>
              下載 CSV
            </button>
          )}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {groups.map((group, idx) => (
            <div 
              key={group.id} 
              className={`rounded-2xl border-l-4 shadow-sm p-6 flex flex-col transition-all hover:shadow-md animate-in zoom-in duration-300 ${groupColors[idx % groupColors.length]}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-slate-800 text-lg">{group.name}</h4>
                <span className="bg-white/60 px-2 py-1 rounded text-xs font-bold text-slate-600">
                  {group.members.length} 人
                </span>
              </div>
              <ul className="space-y-2">
                {group.members.map((member) => (
                  <li key={member.id} className="bg-white/80 p-2 rounded-lg text-sm text-slate-700 font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
          <i className="fas fa-layer-group text-4xl mb-4 opacity-20"></i>
          <p className="font-medium">尚未分組，調整上方設定並點擊按鈕</p>
        </div>
      )}
    </div>
  );
};

export default AutoGrouping;
