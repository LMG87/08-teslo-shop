import { Routes } from '@angular/router';
import { isAdminGuard } from '@auth/guards/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canMatch: [NotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'admin',
    canMatch: [isAdminGuard],
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes'),
  },
];
