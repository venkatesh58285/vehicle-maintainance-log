import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { vehicleSchema } from '../../utils/validationSchemas';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import Toast from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import useAuth from '../../hooks/useAuth';
import styles from './AddEditVehicle.module.css';

const AddEditVehicle = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(vehicleSchema),
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios.get(`/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => {
          const { make, model, year, licensePlate, vin } = res.data;
          setValue('make', make);
          setValue('model', model);
          setValue('year', year);
          setValue('licensePlate', licensePlate);
          setValue('vin', vin);
        })
        .catch(() => showToast('Failed to load vehicle', 'error'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, setValue, showToast, user.token]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/vehicles/${id}`, data, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showToast('Vehicle updated!', 'success');
      } else {
        await axios.post('/api/vehicles', data, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showToast('Vehicle added!', 'success');
      }
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (error) {
      showToast('Error saving vehicle', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.container}>
      <Toast message={toast?.message} type={toast?.type} onDone={hideToast} />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2>{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
        <InputField label="Make" name="make" register={register} error={errors.make} />
        <InputField label="Model" name="model" register={register} error={errors.model} />
        <InputField label="Year" name="year" type="number" register={register} error={errors.year} />
        <InputField label="License Plate" name="licensePlate" register={register} error={errors.licensePlate} />
        <InputField label="VIN" name="vin" register={register} error={errors.vin} />
        <Button type="submit">{isEdit ? 'Update' : 'Add'} Vehicle</Button>
      </form>
    </div>
  );
};

export default AddEditVehicle; 