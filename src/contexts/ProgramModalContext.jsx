import React, { createContext, useContext, useState } from 'react';
import ProgramDetailModal from '../components/ProgramDetailModal';
import { programsService } from '../services/programs.service';

const ProgramModalContext = createContext();

export const useProgramModal = () => {
  const context = useContext(ProgramModalContext);
  if (!context) {
    throw new Error('useProgramModal must be used within a ProgramModalProvider');
  }
  return context;
};

export const ProgramModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [programId, setProgramId] = useState(null);
  const [likedPrograms, setLikedPrograms] = useState(new Set());
  const [registeredPrograms, setRegisteredPrograms] = useState(new Set());

  const openModal = (id) => {
    setProgramId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setProgramId(null);
  };

  // 찜하기 기능
  const handleLike = async (program) => {
    try {
      const isCurrentlyLiked = likedPrograms.has(program.programId);
      
      if (isCurrentlyLiked) {
        await programsService.unlikeProgram(program.programId);
        setLikedPrograms(prev => {
          const newSet = new Set(prev);
          newSet.delete(program.programId);
          return newSet;
        });
      } else {
        await programsService.likeProgram(program.programId);
        setLikedPrograms(prev => {
          const newSet = new Set(prev);
          newSet.add(program.programId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('프로그램 찜하기 실패:', error);
      // TODO: 사용자에게 에러 메시지 표시
    }
  };

  // 신청하기 기능
  const handleApply = async (program) => {
    try {
      const isCurrentlyRegistered = registeredPrograms.has(program.programId);
      
      if (isCurrentlyRegistered) {
        await programsService.unregisterProgram(program.programId);
        setRegisteredPrograms(prev => {
          const newSet = new Set(prev);
          newSet.delete(program.programId);
          return newSet;
        });
      } else {
        await programsService.registerProgram(program.programId);
        setRegisteredPrograms(prev => {
          const newSet = new Set(prev);
          newSet.add(program.programId);
          return newSet;
        });
      }
      
      return { success: true, isRegistered: !isCurrentlyRegistered };
    } catch (error) {
      console.error('프로그램 신청 실패:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    isOpen,
    programId,
    openModal,
    closeModal,
    likedPrograms,
    registeredPrograms,
    handleLike,
    handleApply
  };

  return (
    <ProgramModalContext.Provider value={value}>
      {children}
      <ProgramDetailModal
        isOpen={isOpen}
        programId={programId}
        onClose={closeModal}
        onLike={handleLike}
        onApply={handleApply}
      />
    </ProgramModalContext.Provider>
  );
};
