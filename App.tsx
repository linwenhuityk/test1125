
import React, { useState, useCallback } from 'react';
import { AppTab, Participant } from './types';
import NameListInput from './components/NameListInput';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LIST);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleUpdateParticipants = (newList: string[]) => {
    const formatted: Participant[] = newList.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name: name.trim()
    })).filter(p => p.name.length > 0);
    setParticipants(formatted);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} participantCount={participants.length} />
      
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {activeTab === AppTab.LIST && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-3xl font-bold text-slate-900">名單管理</h1>
                <p className="text-slate-500 mt-1">上傳 CSV 或貼上姓名以開始使用</p>
              </header>
              <NameListInput 
                onUpdate={handleUpdateParticipants} 
                initialValue={participants.map(p => p.name).join('\n')}
              />
            </div>
          )}

          {activeTab === AppTab.LUCKY_DRAW && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
              <header>
                <h1 className="text-3xl font-bold text-slate-900">獎品抽籤</h1>
                <p className="text-slate-500 mt-1">設定抽取規則並開始隨機動畫抽獎</p>
              </header>
              <LuckyDraw participants={participants} />
            </div>
          )}

          {activeTab === AppTab.GROUPING && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-3xl font-bold text-slate-900">自動分組</h1>
                <p className="text-slate-500 mt-1">智慧分配團隊成員，實現最佳化分組</p>
              </header>
              <AutoGrouping participants={participants} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
