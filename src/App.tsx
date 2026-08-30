import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DropZone } from './components/convert/DropZone';
import { MusicList } from './components/convert/MusicList';
import { BottomBar } from './components/convert/BottomBar';
import { HistoryList } from './components/history/HistoryList';
import { SettingsView } from './components/settings/SettingsView';
import { MiniPlayer } from './components/player/MiniPlayer';
import { PlayerProvider } from './context/PlayerContext';

import { useMusicStore } from './store/useMusicStore';
import { useHistoryStore } from './store/useHistoryStore';
import { useSettingsStore } from './store/useSettingsStore';

import { extractFilesFromDataTransfer } from './utils/folderScanner';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('convert');

  const { settings, updateSettings } = useSettingsStore();
  const { history, addHistoryRecord, removeHistoryRecord, clearHistory, exportHistoryJson } =
    useHistoryStore();
  const {
    items,
    isConverting,
    overallProgress,
    completedCount,
    failedCount,
    addFiles,
    updateItemTargetFormat,
    batchSetTargetFormat,
    removeItem,
    clearAll,
    startConversion,
  } = useMusicStore();

  // Global window drag and drop
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleGlobalDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        const files = await extractFilesFromDataTransfer(e.dataTransfer.items);
        if (files.length > 0) {
          addFiles(files);
          setActiveTab('convert');
        }
      } else if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        addFiles(Array.from(e.dataTransfer.files));
        setActiveTab('convert');
      }
    };

    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, [addFiles]);

  const handleStartConvert = () => {
    startConversion(settings, record => {
      addHistoryRecord(record);
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      {/* 1. Title bar */}
      <TitleBar language={settings.language} />

      {/* 2. Main content with Left Sidebar + Right View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingCount={items.filter(i => i.status === 'ready').length}
          historyCount={history.length}
          language={settings.language}
        />

        {/* Right Main Body */}
        <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-[var(--bg-main)]">
          {activeTab === 'convert' && (
            <div className="flex-1 relative flex flex-col h-full overflow-hidden">
              {items.length === 0 ? (
                <DropZone onFilesSelected={addFiles} language={settings.language} />
              ) : (
                <>
                  <MusicList
                    items={items}
                    onFormatChange={updateItemTargetFormat}
                    onRemove={removeItem}
                    onAddMore={addFiles}
                    isConverting={isConverting}
                    language={settings.language}
                  />
                  <BottomBar
                    items={items}
                    totalCount={items.length}
                    completedCount={completedCount}
                    failedCount={failedCount}
                    isConverting={isConverting}
                    overallProgress={overallProgress}
                    onBatchFormatChange={batchSetTargetFormat}
                    onClearAll={clearAll}
                    onStartConvert={handleStartConvert}
                    language={settings.language}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryList
              history={history}
              onRemove={removeHistoryRecord}
              onClear={clearHistory}
              onExport={exportHistoryJson}
              language={settings.language}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={updateSettings}
              onWatcherTriggerFiles={files => {
                addFiles(files);
                setActiveTab('convert');
              }}
            />
          )}
        </main>
      </div>

      {/* 3. Bottom Mini Player (persistent across all views) */}
      <MiniPlayer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
};

export default App;
