import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { maintenanceLogSchema } from '../../utils/validationSchemas';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import Toast from '../../components/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import useAuth from '../../hooks/useAuth';

const AddEditMaintenance = () => {
  const { vehicleId, logId } = useParams();
  const isEdit = Boolean(logId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(maintenanceLogSchema),
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios.get(`/api/logs/${logId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(res => {
          const { title, description, date, mileage, cost, nextDueDate } = res.data;
          setValue('title', title);
          setValue('description', description);
          setValue('date', date ? date.substring(0, 10) : '');
          setValue('mileage', mileage);
          setValue('cost', cost);
          setValue('nextDueDate', nextDueDate ? nextDueDate.substring(0, 10) : '');
        })
        .catch(() => showToast('Failed to load log', 'error'))
        .finally(() => setLoading(false));
    }
  }, [isEdit, logId, setValue, showToast, user.token]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/logs/${logId}`, data, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showToast('Log updated!', 'success');
      } else {
        await axios.post('/api/logs', { ...data, vehicleId }, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showToast('Log added!', 'success');
      }
      setTimeout(() => navigate(`/history/${vehicleId || data.vehicleId}`), 1200);
    } catch (error) {
      showToast('Error saving log', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="h-screen w-full bg-gray-900 text-gray-100 px-4 md:px-8 py-6 flex justify-center items-center">
      <div className="max-w-screen-2xl mx-auto w-full flex justify-center items-center">
        <Toast message={toast?.message} type={toast?.type} onDone={hideToast} />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md text-gray-100">
          <h2 className="mb-5 text-center text-sky-300 text-2xl font-bold">{isEdit ? 'Edit Maintenance Log' : 'Add Maintenance Log'}</h2>
          <InputField label="Title" name="title" register={register} error={errors.title} />
          <InputField label="Description" name="description" register={register} error={errors.description} />
          <InputField label="Date" name="date" type="date" register={register} error={errors.date} />
          <InputField label="Mileage" name="mileage" type="number" register={register} error={errors.mileage} />
          <InputField label="Cost" name="cost" type="number" register={register} error={errors.cost} />
          <InputField label="Next Due Date" name="nextDueDate" type="date" register={register} error={errors.nextDueDate} />
          <Button type="submit">{isEdit ? 'Update' : 'Add'} Log</Button>
        </form>
      </div>
    </div>
  );
};

export default AddEditMaintenance; 