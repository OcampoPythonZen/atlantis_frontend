import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/auth-page/auth-page.component')
      .then(m => m.AuthPageComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./containers/login-form/login-form.component')
          .then(m => m.LoginFormComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./containers/register-form/register-form.component')
          .then(m => m.RegisterFormComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./containers/forgot-password-form/forgot-password-form.component')
          .then(m => m.ForgotPasswordFormComponent)
      }
    ]
  }
];
