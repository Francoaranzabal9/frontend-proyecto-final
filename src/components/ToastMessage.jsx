import React, { useEffect } from 'react';

const ToastMessage = ({ message, type, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast-container">
      <div className={`toast-message toast-${type}`}>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    </div>
  );
};

export default ToastMessage;
