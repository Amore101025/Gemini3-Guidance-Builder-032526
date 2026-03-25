import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Terminal, Trash2 } from 'lucide-react';

export const LiveLog = () => {
  const { logs, clearLogs } = useAppContext();
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm flex flex-col h-64">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Telemetry Terminal (Live Log)
        </h2>
        <button onClick={clearLogs} className="p-1 text-muted-foreground hover:text-destructive transition-colors" title="Clear Logs">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-black text-green-400 font-mono text-xs p-3 rounded-md">
        {logs.length === 0 ? (
          <p className="text-gray-500 italic">No logs yet. System idle.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1 leading-relaxed">
              {log}
            </div>
          ))
        )}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
};
