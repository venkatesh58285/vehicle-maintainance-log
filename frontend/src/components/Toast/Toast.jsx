import React, { useState, useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDone) {
          onDone();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDone]);

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  );
};

export default Toast; 