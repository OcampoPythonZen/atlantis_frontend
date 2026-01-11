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

#### Primary - Gold/Mustard
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#FDF9E9` | Hover backgrounds, subtle highlights |
| `primary-100` | `#FAF0C8` | Light backgrounds |
| `primary-200` | `#F5E08F` | Borders, dividers |
| `primary-300` | `#E8C94D` | Icons on dark |
| `primary-400` | `#D4B84A` | Hover states |
| `primary-500` | `#C8A228` | **Main brand color** - CTAs, links |
| `primary-600` | `#A68520` | Hover on primary buttons |
| `primary-700` | `#856A1A` | Active states |
| `primary-800` | `#6B5516` | Dark accents |
| `primary-900` | `#584612` | Text on light gold |
| `primary-950` | `#2F2409` | Darkest gold |

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
| Primary accent | `primary-500` | `primary-400` |

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
          50:  '#FDF9E9',
          100: '#FAF0C8',
          200: '#F5E08F',
          300: '#E8C94D',
          400: '#D4B84A',
          500: '#C8A228',
          600: '#A68520',
          700: '#856A1A',
          800: '#6B5516',
          900: '#584612',
          950: '#2F2409',
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
<!-- Primary (Gold) -->
<button class="bg-primary-500 hover:bg-primary-600 text-dark-950 font-medium px-4 py-2 rounded-lg transition-colors">
  Guardar
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

### Feature Icons (Gold style from Nutriwolf)
```html
<div class="bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 p-3 rounded-lg">
  <svg><!-- icon --></svg>
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