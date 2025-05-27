import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-accent-900 border border-accent-600 rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-accent-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-accent-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
