import { APIInterceptor } from './api-interceptor.service';
import { AppConfigModule } from './../app-config.module';
import { ModuleWithProviders, NgModule, Optional, SkipSelf, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbAuthModule,
  NbAuthSimpleToken,
  NbPasswordAuthStrategy,
  NbDummyAuthStrategy,
  NbAuthService,
  NbPasswordAuthStrategyOptions,
  NbAuthSimpleInterceptor,
  getDeepFromObject
} from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService, StateService, LayoutService } from './utils';
import {
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthGuard } from './auth-guard.service';

import { StorageModule } from '@ngx-pwa/local-storage';
import { MockDataModule } from './data/mock-data.module';

@Injectable()
export class NbSimpleRoleProvider extends NbRoleProvider {
  constructor(private authService: NbAuthService) {
    super();
  }

  getRole(): Observable<string> {
    return this.authService.onTokenChange().pipe(
      map((token: NbAuthSimpleToken) => {
        return token.isValid() ? 'user' : 'guest';
      })
    );
  }
}

export function getterHeader(
  module: string,
  res: HttpResponse<any>,
  options: NbPasswordAuthStrategyOptions
) {
  const username = res.body['username'];
  localStorage.setItem('ngx_username', username);
  return `ApiKey ${username}:${getDeepFromObject(res.body, options.token.key)}`; // Hack
}

export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    strategies: [
      // NbDummyAuthStrategy.setup({
      //   name: 'email',
      //   delay: 3000,
      // }),
      NbDummyAuthStrategy.setup({
        name: 'logout',
        delay: 2000
      }),
      // NbPasswordAuthStrategy.setup({
      //   name: 'username',
      //   baseEndpoint: `/api/`,
      //   token: {
      //     class: NbAuthSimpleToken,
      //     key: 'key',
      //     getter: getterHeader
      //   },
      //   login: {
      //     endpoint: 'api2/v1/apikey/',
      //   },
      //   // logout: { }
      // })
    ],
    forms: {
      login: {
        strategy: 'username',
        redirectDelay: 1000
      },
      logout: {
        strategy: 'logout'
      },
      register: {},
      validation: {
        email: {
          required: true,
          regexp: '(w+)'
        }
      }
    }
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        // view: ['dashboard'],
        view: '*'
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*'
      },
      admin: {
        parent: 'user',
        create: '*',
        edit: '*',
        remove: '*'
      }
    }
  }).providers,

  {
    provide: NbRoleProvider,
    useClass: NbSimpleRoleProvider
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NbAuthSimpleInterceptor,
    multi: true,

  },
  AuthGuard,
  AnalyticsService,
  LayoutService,
  StateService,
  StorageModule
];

@NgModule({
  imports: [CommonModule, AppConfigModule],
  exports: [NbAuthModule],
  declarations: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS]
    };
  }
}
