import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'miscellaneous',
        loadChildren: () => import('./miscellaneous/miscellaneous.module')
          .then(m => m.MiscellaneousModule),
      },
      {
        path: 'ui-features',
        loadChildren: () => import('./ui-features/ui-features.module')
          .then(m => m.UiFeaturesModule),
      },
      {
        path: 'modal-overlays',
        loadChildren: () => import('./modal-overlays/modal-overlays.module')
          .then(m => m.ModalOverlaysModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
