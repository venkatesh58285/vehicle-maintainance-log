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
    <div className="h-screen w-full bg-gradient-to-br from-gray-800 to-gray-900 px-4 md:px-8 py-6 flex justify-center items-center">
      <div className="max-w-screen-2xl mx-auto w-full flex justify-center items-center">
        <Toast message={toast?.message} type={toast?.type} onDone={hideToast} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800/90 px-9 pt-11 pb-8 rounded-2xl shadow-2xl w-full max-w-md border-l-8 border-sky-300 backdrop-blur text-gray-100 relative animate-fadeIn"
        >
          <h2 className="mb-6 text-center text-sky-300 text-2xl tracking-wide font-bold">Register</h2>
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
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-300 font-bold hover:text-white transition-colors">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register; 