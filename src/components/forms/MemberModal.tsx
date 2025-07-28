import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

import Button from '../ui/Button';
import Input from '../ui/Input';
import { apiService } from '../../services/api';
import { Member, CreateMemberRequest, UpdateMemberRequest, MembershipType, Gender } from '../../types';

const memberSchema = yup.object({
  firstName: yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: yup.string()
    .required('El email es requerido')
    .email('El email debe tener un formato válido'),
  phone: yup.string()
    .required('El teléfono es requerido')
    .matches(/^\+?[1-9]\d{1,14}$/, 'El formato del teléfono no es válido'),
  dateOfBirth: yup.string()
    .required('La fecha de nacimiento es requerida'),
  gender: yup.string()
    .required('El género es requerido')
    .oneOf(Object.values(Gender), 'Género inválido'),
  address: yup.string()
    .required('La dirección es requerida'),
  emergencyContact: yup.string()
    .required('El contacto de emergencia es requerido'),
  emergencyPhone: yup.string()
    .required('El teléfono de emergencia es requerido')
    .matches(/^\+?[1-9]\d{1,14}$/, 'El formato del teléfono no es válido'),
  membershipType: yup.string()
    .required('El tipo de membresía es requerido')
    .oneOf(Object.values(MembershipType), 'Tipo de membresía inválido'),
  startDate: yup.string()
    .required('La fecha de inicio es requerida'),
  endDate: yup.string()
    .required('La fecha de fin es requerida'),
  notes: yup.string(),
}).required();

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  member?: Member | null;
  isViewMode?: boolean;
}

const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  member,
  isViewMode = false,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!member && !isViewMode;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMemberRequest>({
    resolver: yupResolver(memberSchema) as any,
    defaultValues: {
      membershipType: MembershipType.BASIC,
      gender: Gender.MALE,
    },
  });

  // Reset form when member changes
  useEffect(() => {
    if (member) {
      reset({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        dateOfBirth: member.dateOfBirth,
        gender: member.gender,
        address: member.address,
        emergencyContact: member.emergencyContact,
        emergencyPhone: member.emergencyPhone,
        membershipType: member.membershipType,
        startDate: member.startDate,
        endDate: member.endDate,
        notes: member.notes || '',
      });
    } else {
      reset({
        membershipType: MembershipType.BASIC,
        gender: Gender.MALE,
      });
    }
  }, [member, reset]);

  // Create member mutation
  const createMemberMutation = useMutation({
    mutationFn: (data: CreateMemberRequest) => apiService.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro creado exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear miembro';
      toast.error(message);
    },
  });

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMemberRequest }) =>
      apiService.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Miembro actualizado exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar miembro';
      toast.error(message);
    },
  });

  const onSubmit = (data: CreateMemberRequest) => {
    if (isEditing && member) {
      updateMemberMutation.mutate({ id: member.id, data: data as UpdateMemberRequest });
    } else {
      createMemberMutation.mutate(data);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {isViewMode ? 'Ver Miembro' : isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">
                Información Personal
              </h4>
              
              <Input
                label="Nombre"
                type="text"
                placeholder="Ingresa el nombre"
                {...register('firstName')}
                error={errors.firstName?.message}
                disabled={isViewMode}
              />
              
              <Input
                label="Apellido"
                type="text"
                placeholder="Ingresa el apellido"
                {...register('lastName')}
                error={errors.lastName?.message}
                disabled={isViewMode}
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="Ingresa el email"
                {...register('email')}
                error={errors.email?.message}
                disabled={isViewMode}
              />
              
              <Input
                label="Teléfono"
                type="tel"
                placeholder="Ingresa el teléfono"
                {...register('phone')}
                error={errors.phone?.message}
                disabled={isViewMode}
              />
              
              <Input
                label="Fecha de Nacimiento"
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
                disabled={isViewMode}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  {...register('gender')}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={Gender.MALE}>Masculino</option>
                  <option value={Gender.FEMALE}>Femenino</option>
                  <option value={Gender.OTHER}>Otro</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
              
              <Input
                label="Dirección"
                type="text"
                placeholder="Ingresa la dirección"
                {...register('address')}
                error={errors.address?.message}
                disabled={isViewMode}
              />
            </div>

            {/* Información de Emergencia y Membresía */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">
                Contacto de Emergencia
              </h4>
              
              <Input
                label="Contacto de Emergencia"
                type="text"
                placeholder="Nombre del contacto"
                {...register('emergencyContact')}
                error={errors.emergencyContact?.message}
                disabled={isViewMode}
              />
              
              <Input
                label="Teléfono de Emergencia"
                type="tel"
                placeholder="Teléfono del contacto"
                {...register('emergencyPhone')}
                error={errors.emergencyPhone?.message}
                disabled={isViewMode}
              />
              
              <h4 className="text-md font-medium text-gray-700 border-b pb-2 pt-4">
                Membresía
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Membresía
                </label>
                <select
                  {...register('membershipType')}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={MembershipType.BASIC}>Básica</option>
                  <option value={MembershipType.PREMIUM}>Premium</option>
                  <option value={MembershipType.VIP}>VIP</option>
                </select>
                {errors.membershipType && (
                  <p className="mt-1 text-sm text-red-600">{errors.membershipType.message}</p>
                )}
              </div>
              
              <Input
                label="Fecha de Inicio"
                type="date"
                {...register('startDate')}
                error={errors.startDate?.message}
                disabled={isViewMode}
              />
              
              <Input
                label="Fecha de Fin"
                type="date"
                {...register('endDate')}
                error={errors.endDate?.message}
                disabled={isViewMode}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  {...register('notes')}
                  disabled={isViewMode}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Notas adicionales..."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          {!isViewMode && (
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={createMemberMutation.isPending || updateMemberMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={createMemberMutation.isPending || updateMemberMutation.isPending}
              >
                {isEditing ? 'Actualizar' : 'Crear'} Miembro
              </Button>
            </div>
          )}
          
          {isViewMode && (
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MemberModal; 