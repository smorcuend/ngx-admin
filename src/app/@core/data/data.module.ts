import { WebStorageModule, SessionStorageService } from 'ngx-store';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';

const SERVICES = [UserService, SessionStorageService];

@NgModule({
  imports: [CommonModule, WebStorageModule],
  providers: [...SERVICES]
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [...SERVICES]
    };
  }
}
