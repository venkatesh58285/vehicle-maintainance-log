import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { registrationSchema } from '../../utils/validationSchemas';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Toast from '../../components/Toast/Toast';
import styles from './Register.module.css';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registrationSchema),
  });
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password);
      showToast('Registration successful! Please login.', 'success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <Toast message={toast?.message} type={toast?.type} onDone={hideToast} />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Register</h2>
        <InputField
          label="Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword}
        />
        <Button type="submit">Register</Button>
        <p className={styles.link}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register; 