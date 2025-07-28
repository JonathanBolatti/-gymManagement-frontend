import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  UsersIcon,
  CreditCardIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Datos de ejemplo - en el futuro vendrán de la API
  const stats = [
    {
      name: 'Total Miembros',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
    {
      name: 'Miembros Activos',
      value: '1,089',
      change: '+8%',
      changeType: 'positive',
      icon: UsersIcon,
    },
    {
      name: 'Pagos del Mes',
      value: '$45,678',
      change: '+15%',
      changeType: 'positive',
      icon: CreditCardIcon,
    },
    {
      name: 'Asistencia Promedio',
      value: '78%',
      change: '+5%',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al sistema de gestión del gimnasio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Nuevo miembro registrado
                </p>
                <p className="text-sm text-gray-500">
                  Juan Pérez se registró como miembro Premium
                </p>
              </div>
              <div className="text-sm text-gray-500">
                2 min
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCardIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Pago procesado
                </p>
                <p className="text-sm text-gray-500">
                  María García renovó su membresía
                </p>
              </div>
              <div className="text-sm text-gray-500">
                15 min
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Reporte generado
                </p>
                <p className="text-sm text-gray-500">
                  Reporte mensual de asistencia completado
                </p>
              </div>
              <div className="text-sm text-gray-500">
                1 hora
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => navigate('/members')}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <UserGroupIcon className="w-4 h-4 mr-2" />
              Nuevo Miembro
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Registrar Pago
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Ver Reportes
            </button>
            <button 
              onClick={() => navigate('/users')}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <UsersIcon className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 