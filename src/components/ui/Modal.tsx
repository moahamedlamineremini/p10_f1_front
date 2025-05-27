import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-200 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-accent-700 bg-accent-900">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button onClick={onClose} className="text-accent-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6 text-white">
        {children}
      </div>
    </div>
  );
};

export default Modal;
