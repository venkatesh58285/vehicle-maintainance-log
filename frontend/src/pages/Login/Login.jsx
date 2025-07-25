import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { loginSchema } from '../../utils/validationSchemas';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Toast from '../../components/Toast/Toast';
import styles from './Login.module.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      showToast('Login successful!', 'success');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      showToast('Invalid credentials. Please try again.', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <Toast message={toast?.message} type={toast?.type} onDone={hideToast} />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>Login</h2>
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
        <Button type="submit">Login</Button>
        <p className={styles.link}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login; 