import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title = 'Are you sure?', message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false, isLoading = false }) => (
  <Modal isOpen={isOpen} onClose={onCancel} size="sm">
    <div className="flex flex-col items-center text-center gap-4">
      <div className={`p-3 rounded-full ${isDangerous ? 'bg-danger/10' : 'bg-warning/10'}`}>
        <AlertTriangle className={`h-8 w-8 ${isDangerous ? 'text-danger' : 'text-warning'}`} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        {message && <p className="text-text-muted text-sm">{message}</p>}
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="ghost" className="flex-1 border border-border-color" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button variant={isDangerous ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm} isLoading={isLoading}>
          {confirmText}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
