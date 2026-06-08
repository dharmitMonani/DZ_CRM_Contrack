import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmClass = 'btn-danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className={`${confirmClass} text-sm`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
