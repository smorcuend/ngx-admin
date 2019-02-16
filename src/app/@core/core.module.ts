import { AppConfigModule, APP_DI_CONFIG } from './../app-config.module';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  Injectable
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbAuthModule,
  NbAuthSimpleToken,
  NbPasswordAuthStrategy,
  NbDummyAuthStrategy,
  NbAuthService,
  NbPasswordAuthStrategyOptions,
  NbAuthSimpleInterceptor
} from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { Observable } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService, StateService, LayoutService } from './utils';
import { map } from 'rxjs/operators';
import { HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { AuthGuard } from './auth-guard.service';
import { WebStorageModule } from 'ngx-store';

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
  sessionStorage.setItem('ngx_username', username);
  return `ApiKey ${username}:${getDeepFromObject(res.body, options.token.key)}`; // Hack
}

export const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'logout',
        delay: 3000
      }),
      NbPasswordAuthStrategy.setup({
        name: 'username',
        baseEndpoint: APP_DI_CONFIG.API_URL + '/api2/v1',
        token: {
          class: NbAuthSimpleToken,
          key: 'key',
          getter: getterHeader
        },
        login: {
          endpoint: '/apikey/'
        }
        // logout: {
        //   alwaysFail: false,
        //   endpoint: '',
        //   method: null,
        //   redirect: {
        //     success: '/',
        //     failure: '/',
        //   },
        // }
      })
    ],
    forms: {
      login: {
        strategy: 'username'
        // socialLinks: socialLinks,
      },
      logout: {
        strategy: 'logout'
        // socialLinks: socialLinks,
      },
      register: {
        // socialLinks: socialLinks,
      },
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
    useClass: NbAuthSimpleInterceptor,
    multi: true
  },
  AuthGuard,
  AnalyticsService,
  LayoutService,
  StateService,
  WebStorageModule
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

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS]
    };
  }
}
