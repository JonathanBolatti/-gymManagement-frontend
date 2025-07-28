import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import Button from '../ui/Button';
import Input from '../ui/Input';
import { apiService } from '../../services/api';
import { User, CreateUserRequest, UpdateUserRequest, UserRole } from '../../types';

const userSchema = yup.object({
  username: yup.string()
    .required('El nombre de usuario es requerido')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no puede exceder 20 caracteres'),
  email: yup.string()
    .required('El email es requerido')
    .email('El email debe tener un formato válido'),
  password: yup.string()
    .when('$isEditing', {
      is: false,
      then: (schema) => schema.required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
      otherwise: (schema) => schema.optional().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
  confirmPassword: yup.string()
    .when('password', {
      is: (password: string) => password && password.length > 0,
      then: (schema) => schema.required('Debes confirmar la contraseña').oneOf([yup.ref('password')], 'Las contraseñas deben coincidir'),
      otherwise: (schema) => schema.optional(),
    }),
  firstName: yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'El formato del teléfono no es válido')
    .optional(),
  role: yup.string()
    .required('El rol es requerido')
    .oneOf(Object.values(UserRole), 'Rol inválido'),
}).required();

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
  isViewMode?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
  isViewMode = false,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!user && !isViewMode;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateUserRequest & { confirmPassword?: string }>({
    resolver: yupResolver(userSchema) as any,
    context: { isEditing },
    defaultValues: {
      role: UserRole.RECEPTIONIST,
    },
  });

  const password = watch('password');

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        role: user.role,
        password: '',
        confirmPassword: '',
      } as any);
    } else {
      reset({
        role: UserRole.RECEPTIONIST,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => apiService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear usuario';
      toast.error(message);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      apiService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar usuario';
      toast.error(message);
    },
  });

  const onSubmit = (data: CreateUserRequest & { confirmPassword?: string }) => {
    const { confirmPassword, ...userData } = data;
    
    if (isEditing && user) {
      // Si no se proporcionó contraseña, no incluirla en la actualización
      if (!userData.password) {
        const { password, ...userDataWithoutPassword } = userData;
        updateUserMutation.mutate({ id: user.id, data: userDataWithoutPassword as UpdateUserRequest });
      } else {
        updateUserMutation.mutate({ id: user.id, data: userData as UpdateUserRequest });
      }
    } else {
      createUserMutation.mutate(userData);
    }
  };

  const handleClose = () => {
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {isViewMode ? 'Ver Usuario' : isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
            {/* Información de Cuenta */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">
                Información de Cuenta
              </h4>
              
              <Input
                label="Nombre de Usuario"
                type="text"
                placeholder="Ingresa el nombre de usuario"
                {...register('username')}
                error={errors.username?.message}
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
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder={isEditing ? 'Deja vacío para mantener la actual' : 'Ingresa la contraseña'}
                {...register('password')}
                error={errors.password?.message}
                disabled={isViewMode}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
              />
              
              {password && (
                <Input
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma la contraseña"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  disabled={isViewMode}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  }
                />
              )}
            </div>

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
                 label="Teléfono"
                 type="tel"
                 placeholder="Ingresa el teléfono (opcional)"
                 {...register('phone' as any)}
                 error={(errors as any).phone?.message}
                 disabled={isViewMode}
               />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  {...register('role')}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={UserRole.RECEPTIONIST}>Recepcionista</option>
                  <option value={UserRole.MANAGER}>Gerente</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={createUserMutation.isPending || updateUserMutation.isPending}
              >
                {isEditing ? 'Actualizar' : 'Crear'} Usuario
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

export default UserModal; 