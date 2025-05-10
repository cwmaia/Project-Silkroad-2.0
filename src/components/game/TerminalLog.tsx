import React from 'react';

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface TerminalLogProps {
  logs?: LogEntry[];
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs = [] }) => {
  // Placeholder logs if none are provided
  const placeholderLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: new Date(),
      message: 'System initialized',
      type: 'info'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 60000),
      message: 'Connected to Silkroad network',
      type: 'success'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 120000),
      message: 'Security protocols active',
      type: 'info'
    }
  ];

  const displayLogs = logs.length > 0 ? logs : placeholderLogs;

  // Get the appropriate color class based on log type
  const getLogTypeColor = (type: string): string => {
    switch (type) {
      case 'info':
        return 'text-cyan-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-terminal-error';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-terminal-text';
    }
  };

  return (
    <div className="h-full overflow-hidden bg-black border border-neutral-700 rounded-md">
      <div className="flex justify-between items-center p-3 border-b border-neutral-700 bg-black/80">
        <h2 className="text-lg font-mono text-cyan-400">
          <span className="animate-flicker">{'>'}</span> TERMINAL LOG
        </h2>
        <div className="text-xs text-gray-500">
          {displayLogs.length} entries
        </div>
      </div>
      
      <div className="h-[calc(100%-3rem)] overflow-y-auto p-4 bg-black/80 font-mono">
        <div className="mb-4 text-cyan-400">
          <span className="animate-flicker">{'>'}</span> DISPLAYING SYSTEM LOGS...
        </div>

        <div className="space-y-2">
          {displayLogs.map((log) => (
            <div key={log.id} className="border-b border-neutral-900 pb-2">
              <div className="flex justify-between items-start">
                <span className={`${getLogTypeColor(log.type)}`}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className="text-xs text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm mt-1">{log.message}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-gray-500 text-sm">
          <span className="animate-flicker">{'>'}</span> END OF LOG
        </div>
      </div>
    </div>
  );
};

export default TerminalLog;
