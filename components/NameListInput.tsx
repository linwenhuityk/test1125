
import React, { useState, useEffect, useMemo } from 'react';

interface NameListInputProps {
  onUpdate: (names: string[]) => void;
  initialValue: string;
}

const NameListInput: React.FC<NameListInputProps> = ({ onUpdate, initialValue }) => {
  const [text, setText] = useState(initialValue);
  const [dragActive, setDragActive] = useState(false);

  // 取得目前名單陣列（過濾空白）
  const currentNames = useMemo(() => {
    return text.split(/\n|,/).map(s => s.trim()).filter(s => s);
  }, [text]);

  // 偵測重複項
  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    currentNames.forEach(name => {
      if (seen.has(name)) {
        dupes.add(name);
      }
      seen.add(name);
    });
    return Array.from(dupes);
  }, [currentNames]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(currentNames);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentNames, onUpdate]);

  const loadMockData = () => {
    const mockNames = [
      "陳小明", "林美玲", "張大為", "李佳穎", "王志強", 
      "吳淑芬", "劉建宏", "蔡依林", "鄭成功", "黃雅婷",
      "周杰倫", "郭雪芙", "曾國城", "蕭敬騰", "林俊傑",
      "陳零九", "邱鋒澤", "婁峻碩", "賴晏駒", "黃偉晉",
      "孫悟空", "豬八戒", "沙悟淨", "唐三藏", "白骨精",
      "陳小明", "林美玲" // 故意加入重複項
    ];
    setText(mockNames.join('\n'));
  };

  const removeDuplicates = () => {
    const uniqueNames = Array.from(new Set(currentNames));
    setText(uniqueNames.join('\n'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 頂部操作列 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button 
            onClick={loadMockData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="fas fa-vial"></i> 載入範例名單
          </button>
          {duplicates.length > 0 && (
            <button 
              onClick={removeDuplicates}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-rose-200 animate-pulse"
            >
              <i className="fas fa-user-minus"></i> 排除重複姓名 ({duplicates.length})
            </button>
          )}
        </div>
        {duplicates.length > 0 && (
          <div className="text-sm text-rose-500 font-medium">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            發現重複項：{duplicates.slice(0, 3).join('、')}{duplicates.length > 3 ? '...' : ''}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-280px)]">
        <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center gap-2">
              <i className="fas fa-edit text-indigo-500"></i>
              編輯區域
            </span>
            <span className="text-xs text-slate-400">目前共 {currentNames.length} 筆</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在此貼上姓名名單，例如：&#10;王小明&#10;李大華&#10;張美麗, 趙又廷..."
            className="flex-1 p-6 text-slate-600 focus:outline-none resize-none font-mono text-sm"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-200 relative ${
              dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-300'
            }`}
          >
            <input 
              type="file" 
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <i className="fas fa-cloud-upload-alt text-3xl"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-800">上傳 CSV / TXT</h3>
              <p className="text-sm text-slate-500 mt-2">點擊或拖放檔案</p>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
              <i className="fas fa-lightbulb"></i>
              使用提示
            </h4>
            <ul className="text-sm text-amber-700 space-y-2 list-disc ml-4">
              <li>確保每行一個姓名，或使用逗號分開。</li>
              <li>若名單有重複，系統會提示您進行排除。</li>
              <li>支援直接從 Excel 貼上整欄資料。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameListInput;
