# Gym Management Frontend

Frontend para el sistema de gestión de gimnasio desarrollado con React + TypeScript.

## 🚀 Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router DOM** para navegación
- **React Hook Form** para formularios
- **Yup** para validación
- **Tailwind CSS** para estilos
- **React Query** para manejo de estado server
- **Axios** para HTTP requests
- **React Hot Toast** para notificaciones
- **Heroicons** para iconos

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/           # Componentes base (Button, Input, etc.)
│   ├── layout/       # Layout y Sidebar
│   └── forms/        # Formularios específicos
├── pages/            # Páginas principales
├── hooks/            # Custom hooks
├── services/         # API calls
├── types/            # TypeScript interfaces
├── utils/            # Utilidades
└── context/          # Context API para estado global
```

## 🛠️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_NAME=Gym Management System
```

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Build para producción
npm run build

# Ejecutar tests
npm test
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación:

- **Login**: `/login` - Página de inicio de sesión
- **Dashboard**: `/dashboard` - Página principal (protegida)
- **Logout**: Automático desde el sidebar

## 📱 Páginas Disponibles

- **Login**: Autenticación de usuarios
- **Dashboard**: Vista principal con métricas
- **Miembros**: Gestión de clientes (próximamente)
- **Usuarios**: Gestión de empleados (próximamente)
- **Pagos**: Gestión de pagos (próximamente)
- **Reportes**: Reportes y estadísticas (próximamente)

## 🎨 Componentes UI

### Button
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  error={errors.email?.message}
/>
```

## 🔗 Integración con Backend

El frontend se conecta con el backend Spring Boot a través de:

- **Base URL**: Configurada en variables de entorno
- **Autenticación**: JWT tokens
- **Interceptors**: Manejo automático de tokens y refresh
- **Error Handling**: Manejo centralizado de errores

## 🚀 Próximos Pasos

1. Implementar páginas de gestión de miembros
2. Crear formularios de registro y edición
3. Implementar paginación y filtros
4. Agregar reportes y gráficos
5. Configurar despliegue en Railway

## 📞 Soporte

Para consultas sobre el frontend, contactar al equipo de desarrollo.
