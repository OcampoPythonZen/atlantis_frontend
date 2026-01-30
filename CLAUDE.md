# Atlantis Frontend

## Project Overview
Mexican Nutritionists Platform - Angular frontend for nutrition professionals managing patient care.

---

## Language Rules
- **Source code** (variables, functions, comments, file names): **English**
- **UI labels** (buttons, placeholders, messages, titles): **Spanish (Mexican)**

---

## Design System

### Brand Reference
Based on: https://mynutriwolf.com

### Color Palette

#### Primary - Gold/Mustard (Brand accent, CTAs, links)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#FEFBE8` | Hover backgrounds, subtle highlights |
| `primary-100` | `#FDF4C4` | Light backgrounds |
| `primary-200` | `#FBE78B` | Borders, dividers |
| `primary-300` | `#F5D448` | Icons on dark |
| `primary-400` | `#E8C520` | Hover states |
| `primary-500` | `#CEAC06` | **Main brand color** - CTAs, links, active filters |
| `primary-600` | `#A88904` | Hover on primary buttons |
| `primary-700` | `#836607` | Active states |
| `primary-800` | `#6B510D` | Dark accents |
| `primary-900` | `#5B4310` | Text on light gold |
| `primary-950` | `#352404` | Darkest gold |

#### Teal - Health/Wellness Accent (Progress, badges, focus rings, avatars)
| Token | Hex | Usage |
|-------|-----|-------|
| `teal-50` | `#F0FAF8` | Light backgrounds |
| `teal-100` | `#D2F1EB` | Avatar placeholder bg |
| `teal-200` | `#A5E3D8` | Borders |
| `teal-300` | `#71CEC0` | Highlights |
| `teal-400` | `#5BAB9E` | **Brand teal** - Dark mode accents |
| `teal-500` | `#3D9488` | Progress bars, focus rings, buttons |
| `teal-600` | `#2F766D` | Text on light, icon color |
| `teal-700` | `#295F58` | Active states |
| `teal-800` | `#254C48` | Dark accents |
| `teal-900` | `#223F3C` | Dark mode backgrounds |
| `teal-950` | `#0F2523` | Darkest teal |

#### Navy - Professional Chrome (Headers, navbars, structure, icons)
| Token | Hex | Usage |
|-------|-----|-------|
| `navy-50` | `#EEF5F9` | Light backgrounds |
| `navy-100` | `#D5E5EF` | Icon/badge backgrounds |
| `navy-200` | `#B0CEE1` | Borders |
| `navy-300` | `#80AFCC` | Highlights |
| `navy-400` | `#4F89AF` | Dark mode accents |
| `navy-500` | `#376D93` | Focus rings, buttons |
| `navy-600` | `#2C577A` | Text on light |
| `navy-700` | `#274864` | Buttons, sidebar logo |
| `navy-800` | `#1B3A4B` | **Brand navy** - Headers, nav chrome |
| `navy-900` | `#1A3244` | Dark mode backgrounds |
| `navy-950` | `#11212D` | Darkest navy |

#### Dark - Backgrounds & Neutrals
| Token | Hex | Usage |
|-------|-----|-------|
| `dark-50` | `#FAFAFA` | Light mode background |
| `dark-100` | `#F4F4F5` | Light mode cards |
| `dark-200` | `#E4E4E7` | Light mode borders |
| `dark-300` | `#D4D4D8` | Disabled states |
| `dark-400` | `#A1A1AA` | Placeholder text |
| `dark-500` | `#71717A` | Muted text |
| `dark-600` | `#52525B` | Secondary text |
| `dark-700` | `#3F3F46` | Dark mode borders |
| `dark-800` | `#27272A` | Dark mode cards |
| `dark-900` | `#1A1A1A` | Dark mode background |
| `dark-950` | `#0F0F0F` | **Darkest background** |

#### Semantic Colors
| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Success | `#22C55E` | `#4ADE80` | Confirmations, healthy BMI |
| Warning | `#F59E0B` | `#FBBF24` | Alerts, overweight BMI |
| Error | `#EF4444` | `#F87171` | Errors, obese BMI |
| Info | `#3B82F6` | `#60A5FA` | Information, underweight BMI |

---

## Dark Mode

### Requirements
- **Must implement dark mode** toggle for the entire application
- Default: Follow system preference (`prefers-color-scheme`)
- User preference persisted in localStorage
- Smooth transition between modes

### Implementation Strategy
```typescript
// Use Tailwind's dark mode with class strategy
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

### Color Mapping
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Page background | `dark-50` | `dark-950` |
| Card background | `white` | `dark-800` |
| Primary text | `dark-900` | `dark-50` |
| Secondary text | `dark-600` | `dark-400` |
| Borders | `dark-200` | `dark-700` |
| Gold accent (CTAs) | `primary-500` | `primary-400` |
| Teal accent (health) | `teal-500` | `teal-400` |
| Navy accent (chrome) | `navy-800` | `navy-700` |
| Avatar placeholder bg | `teal-100` | `teal-900/30` |
| Avatar placeholder text | `teal-600` | `teal-400` |
| Sidebar logo bg | `navy-800` | `navy-700` |
| Sidebar logo icon | `primary-400` | `primary-400` |
| Active sidebar route | `teal-50` | `teal-900/20` |
| Progress bars | `teal-400 → teal-500` | same |
| Input focus rings | `teal-500/50` | same |
| Section header icons | `navy-600` | `navy-400` |

---

## Tailwind Configuration

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FEFBE8',
          100: '#FDF4C4',
          200: '#FBE78B',
          300: '#F5D448',
          400: '#E8C520',
          500: '#CEAC06',
          600: '#A88904',
          700: '#836607',
          800: '#6B510D',
          900: '#5B4310',
          950: '#352404',
        },
        teal: {
          50:  '#F0FAF8',
          100: '#D2F1EB',
          200: '#A5E3D8',
          300: '#71CEC0',
          400: '#5BAB9E',
          500: '#3D9488',
          600: '#2F766D',
          700: '#295F58',
          800: '#254C48',
          900: '#223F3C',
          950: '#0F2523',
        },
        navy: {
          50:  '#EEF5F9',
          100: '#D5E5EF',
          200: '#B0CEE1',
          300: '#80AFCC',
          400: '#4F89AF',
          500: '#376D93',
          600: '#2C577A',
          700: '#274864',
          800: '#1B3A4B',
          900: '#1A3244',
          950: '#11212D',
        },
        dark: {
          50:  '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#1A1A1A',
          950: '#0F0F0F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
```

---

## Component Patterns

### Buttons
```html
<!-- Primary (Gold) - CTAs, submit actions -->
<button class="bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium px-4 py-2 rounded-lg transition-colors">
  Guardar
</button>

<!-- Navy - Professional/structural actions -->
<button class="bg-navy-700 hover:bg-navy-800 text-white dark:bg-navy-600 dark:hover:bg-navy-700 font-medium px-4 py-2 rounded-lg transition-colors">
  Ver detalles
</button>

<!-- Teal - Health/wellness actions -->
<button class="bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-400 dark:text-teal-950 font-medium px-4 py-2 rounded-lg transition-colors">
  Ver progreso
</button>

<!-- Secondary -->
<button class="bg-dark-100 hover:bg-dark-200 text-dark-800 dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-dark-100 px-4 py-2 rounded-lg transition-colors">
  Cancelar
</button>

<!-- Danger -->
<button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
  Eliminar
</button>
```

### Cards
```html
<div class="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl shadow-sm p-6">
  <h3 class="text-dark-900 dark:text-dark-50 font-semibold">Título</h3>
  <p class="text-dark-600 dark:text-dark-400 mt-2">Descripción</p>
</div>
```

### Feature Icons
```html
<!-- Teal icon (health/progress) -->
<div class="bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 p-3 rounded-lg">
  <svg><!-- icon --></svg>
</div>

<!-- Navy icon (structure/appointments) -->
<div class="bg-navy-500/10 dark:bg-navy-500/20 text-navy-600 dark:text-navy-400 p-3 rounded-lg">
  <svg><!-- icon --></svg>
</div>

<!-- Gold icon (brand/premium) -->
<div class="bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 p-3 rounded-lg">
  <svg><!-- icon --></svg>
</div>
```

### Sidebar Logo
```html
<div class="w-10 h-10 bg-navy-800 dark:bg-navy-700 rounded-lg flex items-center justify-center">
  <svg class="w-6 h-6 text-primary-400"><!-- logo icon --></svg>
</div>
```

### Avatar Placeholder
```html
<div class="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
  <span class="text-sm font-semibold text-teal-600 dark:text-teal-400">AB</span>
</div>
```

---

## Spanish UI Labels Reference

### Common Actions
| English (code) | Spanish (UI) |
|----------------|--------------|
| Save | Guardar |
| Cancel | Cancelar |
| Delete | Eliminar |
| Edit | Editar |
| Add | Agregar |
| Search | Buscar |
| Filter | Filtrar |
| Back | Regresar |
| Next | Siguiente |
| Previous | Anterior |
| Close | Cerrar |
| Confirm | Confirmar |

### Domain Terms
| English (code) | Spanish (UI) |
|----------------|--------------|
| Patient | Paciente |
| Nutritionist | Nutriólogo |
| Appointment | Cita |
| Consultation | Consulta |
| Meal Plan | Plan Alimenticio |
| Weight | Peso |
| Height | Estatura |
| BMI | IMC |
| Measurements | Medidas |

### Messages
| Type | Spanish |
|------|---------|
| Success save | Guardado exitosamente |
| Confirm delete | ¿Estás seguro de eliminar? |
| Required field | Este campo es requerido |
| Invalid email | Correo electrónico inválido |
| Loading | Cargando... |
| No results | Sin resultados |