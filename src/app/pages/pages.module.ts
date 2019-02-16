import { DashboardModule } from './dashboard/dashboard.module';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ProfileModule } from './profile/profile.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    ProfileModule,
    DashboardModule,
    MiscellaneousModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
