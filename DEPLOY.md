# Deploy en Railway - Gym Management Frontend

## Configuración para Railway

### 1. Variables de Entorno Requeridas

Configura las siguientes variables de entorno en tu proyecto de Railway:

```bash
REACT_APP_API_URL=https://tu-backend-railway.railway.app/api
REACT_APP_NAME=Gym Management System
REACT_APP_VERSION=1.0.0
NODE_ENV=production
```

### 2. Pasos para el Deploy

1. **Conectar con GitHub:**
   - Ve a Railway Dashboard
   - Crea un nuevo proyecto
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

2. **Configurar Variables de Entorno:**
   - En la pestaña "Variables" de tu proyecto
   - Agrega todas las variables mencionadas arriba
   - **IMPORTANTE:** Reemplaza `tu-backend-railway.railway.app` con la URL real de tu backend

3. **Configurar Dominio Personalizado (Opcional):**
   - En la pestaña "Settings" > "Domains"
   - Agrega tu dominio personalizado si lo tienes

### 3. Verificación del Deploy

1. **Health Check:** Railway verificará automáticamente que la aplicación responda en `/`
2. **Logs:** Revisa los logs en Railway para verificar que no hay errores
3. **Funcionalidad:** Prueba las principales funcionalidades de la app

### 4. Troubleshooting

**Problema:** La app no se conecta al backend
- **Solución:** Verifica que `REACT_APP_API_URL` apunte a la URL correcta de tu backend

**Problema:** Errores de CORS
- **Solución:** Asegúrate de que tu backend permita requests desde el dominio de Railway

**Problema:** Rutas no funcionan en producción
- **Solución:** El archivo `_redirects` ya está configurado para manejar React Router

### 5. Monitoreo

- Railway proporciona métricas básicas de uso
- Revisa los logs regularmente para detectar errores
- Configura alertas si es necesario

### 6. Actualizaciones

Para actualizar la aplicación:
1. Haz push a tu rama principal en GitHub
2. Railway detectará automáticamente los cambios
3. Desplegará la nueva versión automáticamente

## Estructura de Archivos de Deploy

- `railway.json` - Configuración principal de Railway
- `railway.toml` - Configuración alternativa
- `public/_redirects` - Manejo de rutas para React Router
- `env.example` - Ejemplo de variables de entorno 