# Atlantis Frontend - Sistema de Autenticación

Plataforma profesional para nutriólogos mexicanos con sistema de autenticación completo.

## Características Implementadas

### Sistema de Autenticación
- ✅ **Login (Iniciar Sesión)** - Formulario con email, contraseña y "Recordar sesión"
- ✅ **Registro (Crear Cuenta)** - Formulario completo con validación de contraseña
- ✅ **Recuperar Contraseña** - Flujo de recuperación por email
- ✅ **Guards de Rutas** - Protección de rutas autenticadas
- ✅ **Logout** - Cerrar sesión con limpieza de estado

### UI/UX Moderno
- ✅ **Dark Mode** - Toggle con persistencia en localStorage
- ✅ **Diseño Responsive** - Mobile-first, optimizado para todos los dispositivos
- ✅ **Split Layout** - Panel de branding + formularios en desktop
- ✅ **Animaciones Suaves** - Transiciones fade, slide, scale
- ✅ **Paleta Gold/Mustard** - Según especificaciones de CLAUDE.md
- ✅ **Labels en Español** - Interfaz completamente en español mexicano

### Arquitectura Angular 17+
- ✅ **Standalone Components** - Sin NgModules
- ✅ **Signal-based State** - Gestión reactiva con signals
- ✅ **Reactive Forms** - Validación completa con mensajes personalizados
- ✅ **Lazy Loading** - Módulo de auth cargado bajo demanda
- ✅ **TypeScript Strict Mode** - Tipado completo

### Componentes UI Reutilizables
- ✅ `InputComponent` - Input con label y errores
- ✅ `PasswordInputComponent` - Input de contraseña con toggle de visibilidad
- ✅ `CheckboxComponent` - Checkbox estilizado
- ✅ `ButtonComponent` - Botón con estados de carga
- ✅ `SpinnerComponent` - Indicador de carga animado
- ✅ `PasswordStrengthComponent` - Indicador visual de fortaleza de contraseña
- ✅ `ThemeToggleComponent` - Toggle de dark mode

## Estructura del Proyecto

```
src/app/
├── core/
│   ├── auth/
│   │   ├── guards/           # authGuard, guestGuard
│   │   ├── services/         # AuthService (mock)
│   │   ├── store/            # AuthStore (signals)
│   │   └── models/           # Interfaces TypeScript
│   └── services/
│       └── theme.service.ts  # Dark mode service
│
├── shared/
│   ├── components/
│   │   ├── ui/               # Componentes reutilizables
│   │   └── layout/           # ThemeToggle
│   └── validators/           # Custom validators
│
└── features/
    ├── auth/
    │   ├── pages/            # AuthPageComponent
    │   ├── containers/       # Login, Register, ForgotPassword
    │   ├── components/       # AuthBranding, PasswordInput
    │   └── facades/          # AuthFacade
    └── dashboard/
        └── dashboard.component.ts
```

## Instalación y Ejecución

### Instalar dependencias
```bash
npm install
```

### Ejecutar en desarrollo
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Compilar para producción
```bash
npm run build
```

Los archivos compilados se generarán en `dist/atlantis-frontend/`

## Rutas Disponibles

| Ruta | Descripción | Guard |
|------|-------------|-------|
| `/` | Redirige a `/dashboard` | - |
| `/auth/login` | Formulario de inicio de sesión | guestGuard |
| `/auth/register` | Formulario de registro | guestGuard |
| `/auth/forgot-password` | Recuperación de contraseña | guestGuard |
| `/dashboard` | Dashboard principal (requiere auth) | authGuard |

## Credenciales de Prueba

El sistema actualmente usa un servicio mock. Puedes ingresar cualquier email/contraseña para probar:

**Ejemplo:**
- Email: `test@example.com`
- Contraseña: `Password123`

## Paleta de Colores

### Primary (Gold/Mustard)
- `primary-500`: `#C8A228` - Color principal de botones y enlaces
- `primary-400`: `#D4B84A` - Hover en dark mode
- `primary-600`: `#A68520` - Hover en light mode

### Dark (Neutrales)
- `dark-950`: `#0F0F0F` - Fondo en dark mode
- `dark-50`: `#FAFAFA` - Fondo en light mode
- `dark-900`: `#1A1A1A` - Texto principal en light mode
- `dark-50`: `#FAFAFA` - Texto principal en dark mode

## Características Técnicas

### Validación de Formularios
- Email: Validación de formato
- Contraseña: Mínimo 8 caracteres, mayúsculas, minúsculas, números
- Confirm Password: Debe coincidir con contraseña
- Términos: Debe aceptarse para registrarse

### Estado de la Aplicación
- **AuthStore**: Gestiona user, tokens, loading, error
- **ThemeService**: Gestiona dark mode con persistencia
- **AuthFacade**: Capa de abstracción para operaciones de auth

### Persistencia
- Dark mode: `localStorage.getItem('atlantis-theme')`
- User (si "Recordar sesión"): `localStorage.getItem('atlantis-user')`

## Próximos Pasos

### Backend Integration
1. Reemplazar `AuthService` mock con llamadas HTTP reales
2. Implementar interceptor para JWT tokens
3. Configurar refresh token logic

### Funcionalidades Adicionales
1. Gestión de pacientes
2. Agenda de citas
3. Planes alimenticios
4. Dashboard con estadísticas

## Tecnologías

- **Angular**: 17+
- **TypeScript**: 5.x (strict mode)
- **Tailwind CSS**: 3.x
- **RxJS**: 7.x
- **Angular CDK**: Utilities de accesibilidad

## Licencia

Proyecto privado - Atlantis Frontend 2024

---

**Desarrollado con:**
- Angular 17+ Standalone Components
- Signals para state management
- Tailwind CSS para estilos
- Dark mode nativo
- Diseño responsive mobile-first
