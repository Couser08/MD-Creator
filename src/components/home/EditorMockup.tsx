import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewDocument } from '../../db';
import { MockupMacBookFrame } from './mockup/MockupMacBookFrame';
import { MockupWorkspace } from './mockup/MockupWorkspace';
import { useMockupSimulation } from './mockup/useMockupSimulation';
import { ViewMode, SideTab } from './mockup/mockupData';

export const EditorMockup: React.FC = () => {
  const navigate = useNavigate();
  const [mockupTheme, setMockupTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [activeSideTab, setActiveSideTab] = useState<SideTab>('write');

  const {
    activeDocId,
    content,
    setContent,
    currentDoc,
    stats,
    sparks,
    isAutoTyping,
    emitSparks,
    handleSelectDoc,
    handleToggleTask,
    handleInsertSnippet,
    startAutoType,
    stopAutoType,
  } = useMockupSimulation();

  // Open active mock document inside the real Editor app
  const handleOpenInFullApp = async () => {
    try {
      const newId = await createNewDocument(currentDoc.title.replace('.md', ''), content);
      navigate(`/editor/${newId}`);
    } catch {
      navigate('/editor');
    }
  };

  return (
    <MockupMacBookFrame>
      <MockupWorkspace
        mockupTheme={mockupTheme}
        setMockupTheme={setMockupTheme}
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeSideTab={activeSideTab}
        setActiveSideTab={setActiveSideTab}
        activeDocId={activeDocId}
        currentDoc={currentDoc}
        content={content}
        setContent={setContent}
        stats={stats}
        sparks={sparks}
        isAutoTyping={isAutoTyping}
        emitSparks={emitSparks}
        handleSelectDoc={handleSelectDoc}
        handleToggleTask={handleToggleTask}
        handleInsertSnippet={handleInsertSnippet}
        startAutoType={startAutoType}
        stopAutoType={stopAutoType}
        onOpenInFullApp={handleOpenInFullApp}
      />
    </MockupMacBookFrame>
  );
};
