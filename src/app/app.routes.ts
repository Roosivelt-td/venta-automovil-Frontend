// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard';import { ComprasListComponent } from './components/dashboard/compras/compras-list/compras-list';
import { AuthGuard } from './guards/auth.guard';
import {UsuarioList} from './components/dashboard/usuario-list/usuario-list';

export const routes: Routes = [
    // Rutas públicas (sin layout)
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },

    // Rutas privadas (con layout)
    {
      path: '',
      component: MainLayoutComponent,
      canActivate: [AuthGuard], // Protege todas las rutas hijas
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'usuarios', component: UsuarioList },
        { path: 'compras', component: ComprasListComponent },
        { path: 'compra', redirectTo: 'compras' },

        { path: '**', redirectTo: 'dashboard'},
        // Otras rutas del panel aquí
      ]
    },

    // Redirecciones globales

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }  //Redirige rutas desconocidas
];
