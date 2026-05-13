import { Routes } from '@angular/router';

import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { DriverLayout } from './layouts/driver-layout/driver-layout';

import { Home } from './features/public/home/home';
import { TrackParcel } from './features/public/track-parcel/track-parcel';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { Dashboard } from './features/admin/dashboard/dashboard';
import { ParcelList } from './features/admin/parcel-list/parcel-list';
import { ParcelDetails } from './features/admin/parcel-details/parcel-details';
import { ParcelForm } from './features/admin/parcel-form/parcel-form';

import { BranchManagement } from './features/admin/branch-management/branch-management';
import { DriverManagement } from './features/admin/driver-management/driver-management';
import { AssignDriver } from './features/admin/assign-driver/assign-driver';

import { Dashboard as DriverDashboard } from './features/driver/dashboard/dashboard';
import { AssignedParcels } from './features/driver/assigned-parcels/assigned-parcels';
import { DeliveryDetails } from './features/driver/delivery-details/delivery-details';

import { Reports } from './features/admin/reports/reports';
import { Notifications } from './features/admin/notifications/notifications';
import { ParcelLabel } from './features/admin/parcel-label/parcel-label';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'track',
        component: TrackParcel,
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard(['admin', 'staff'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'parcels',
        component: ParcelList,
      },
      {
        path: 'parcels/add',
        component: ParcelForm,
      },
      {
        path: 'parcels/:id',
        component: ParcelDetails,
      },
      {
        path: 'parcels/:id/label',
        component: ParcelLabel,
      },
      {
        path: 'branches',
        component: BranchManagement,
      },
      {
        path: 'drivers',
        component: DriverManagement,
      },
      {
        path: 'assign-driver',
        component: AssignDriver,
      },
      {
        path: 'reports',
        component: Reports,
      },
      {
        path: 'notifications',
        component: Notifications,
      },
    ],
  },
  {
    path: 'customer',
    component: CustomerLayout,
    children: [
      {
        path: 'dashboard',
        component: Home,
      },
    ],
  },
  {
    path: 'driver',
    component: DriverLayout,
    canActivate: [authGuard, roleGuard(['driver'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DriverDashboard,
      },
      {
        path: 'parcels',
        component: AssignedParcels,
      },
      {
        path: 'parcels/:id',
        component: DeliveryDetails,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
