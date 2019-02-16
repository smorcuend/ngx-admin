import { AvatarModule } from 'ngx-avatar';
import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
import { ProfileComponent } from './profile.component';


@NgModule({
  imports: [
    ThemeModule,
    AvatarModule
  ],
  declarations: [
    ProfileComponent,
  ],
})
export class ProfileModule { }
