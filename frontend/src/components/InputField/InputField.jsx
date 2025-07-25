import React from 'react';
import styles from './InputField.module.css';

const InputField = ({ label, name, type = 'text', register, error }) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} {...register(name)} className={error ? styles.errorInput : ''} />
      {error && <p className={styles.errorMessage}>{error.message}</p>}
    </div>
  );
};

export default InputField; 