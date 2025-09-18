import React, { createContext, useContext, useState } from 'react';
import ProgramDetailModal from '../components/ProgramDetailModal';

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

  const openModal = (id) => {
    setProgramId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setProgramId(null);
  };

  const value = {
    isOpen,
    programId,
    openModal,
    closeModal
  };

  return (
    <ProgramModalContext.Provider value={value}>
      {children}
      <ProgramDetailModal
        isOpen={isOpen}
        programId={programId}
        onClose={closeModal}
        onLike={() => {
          // TODO: 찜하기 기능 구현
          console.log('찜하기:', programId);
        }}
        onApply={() => {
          // TODO: 신청하기 기능 구현
          console.log('신청하기:', programId);
        }}
      />
    </ProgramModalContext.Provider>
  );
};
