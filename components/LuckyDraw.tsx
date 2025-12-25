
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [winners, setWinners] = useState<Participant[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const [currentDisplayNames, setCurrentDisplayNames] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Participant[]>([]);
  // Fix: Provide an initial value of undefined to useRef to avoid the "Expected 1 arguments, but got 0" TypeScript error
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setCandidates([...participants]);
  }, [participants]);

  const startDraw = () => {
    if (drawing || candidates.length === 0) return;
    if (!allowRepeat && candidates.length < drawCount) {
      alert("剩餘候選人不足！");
      return;
    }

    setDrawing(true);
    let counter = 0;
    const maxCycles = 50;

    const animate = () => {
      counter++;
      const randomNames = Array.from({ length: drawCount }).map(() => {
        const idx = Math.floor(Math.random() * candidates.length);
        return candidates[idx].name;
      });
      setCurrentDisplayNames(randomNames);

      if (counter < maxCycles) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        finishDraw();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const finishDraw = () => {
    const available = [...candidates];
    const newWinners: Participant[] = [];

    for (let i = 0; i < drawCount; i++) {
      if (available.length === 0) break;
      const idx = Math.floor(Math.random() * available.length);
      const winner = available[idx];
      newWinners.push(winner);
      
      if (!allowRepeat) {
        available.splice(idx, 1);
      }
    }

    setWinners(prev => [...newWinners, ...prev]);
    if (!allowRepeat) {
      setCandidates(available);
    }
    setDrawing(false);
    setCurrentDisplayNames(newWinners.map(w => w.name));
  };

  const resetDraw = () => {
    setWinners([]);
    setCandidates([...participants]);
    setCurrentDisplayNames([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
      {/* Settings & Controls */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-cog text-indigo-500"></i>
            抽籤設定
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">一次抽取幾人？</label>
              <input 
                type="number" 
                min="1" 
                max={Math.max(1, candidates.length)}
                value={drawCount}
                onChange={(e) => setDrawCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-600">允許重複中獎</span>
              <button 
                onClick={() => setAllowRepeat(!allowRepeat)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${allowRepeat ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowRepeat ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={startDraw}
                disabled={drawing || candidates.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                  drawing || candidates.length === 0 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-1'
                }`}
              >
                {drawing ? '正在抽籤中...' : '開始抽籤'}
              </button>
              
              <button 
                onClick={resetDraw}
                className="w-full mt-3 py-2 text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors"
              >
                重置名單與結果
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <i className="fas fa-history text-indigo-500"></i>
              中獎歷史 ({winners.length})
            </span>
          </h3>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {winners.length === 0 ? (
              <div className="text-center py-10 text-slate-400 italic text-sm">尚未有中獎者</div>
            ) : (
              winners.map((winner, idx) => (
                <div key={`${winner.id}-${idx}`} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 animate-in fade-in zoom-in duration-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                    {winners.length - idx}
                  </div>
                  <span className="font-semibold text-slate-700">{winner.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Drawing Stage */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          
          <div className="text-center mb-12">
            <div className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${drawing ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-100 text-slate-400'}`}>
              <i className={`fas ${drawing ? 'fa-spinner fa-spin' : 'fa-gift'} text-4xl`}></i>
            </div>
            <h2 className="text-2xl font-black text-slate-800">
              {drawing ? '準備開獎...' : (currentDisplayNames.length > 0 ? '恭喜中獎者！' : '點擊左側按鈕開始')}
            </h2>
          </div>

          <div className="w-full flex flex-wrap justify-center gap-4">
            {currentDisplayNames.length > 0 ? (
              currentDisplayNames.map((name, i) => (
                <div 
                  key={i} 
                  className={`min-w-[200px] px-8 py-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl text-white text-center transform transition-all duration-300 animate-in zoom-in ${drawing ? 'animate-pulse' : 'scale-105'}`}
                >
                  <div className="text-xs uppercase tracking-widest opacity-70 mb-2 font-bold">Winner</div>
                  <div className="text-4xl font-black tracking-tight">{name}</div>
                </div>
              ))
            ) : (
              <div className="w-full h-40 border-4 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 font-bold text-2xl uppercase tracking-widest">
                Waiting for Draw
              </div>
            )}
          </div>

          <div className="mt-12 text-slate-400 text-sm font-medium flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              剩餘候選人: {candidates.length}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              目前規則: {allowRepeat ? '允許重複' : '不重複'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
