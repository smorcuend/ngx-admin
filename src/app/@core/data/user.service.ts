import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flatMap, map, shareReplay, tap } from 'rxjs/operators';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';

export interface User {
  date_joined: string;
  email: number;
  groups?: any[];
  id: string;
  is_active: Boolean;
  is_staff: Boolean;
  last_login: string;
  resource_uri: string;
  segments?: any[];
  username: string;
  worker: number;
}
export interface Worker {
  avatar: string;
  id: number;
  name: string;
  resource_uri: string;
  surnames: string;
}

export interface Permissions {
  client: { global: Permission[] };
  segment: { global: Permission[]; perObject: Permission[] };
}
export interface Permission {
  codename: string;
  objectId?: string;
  objectType?: string;
}

@Injectable()
export class UserService {
  entity = 'user';
  auxEntity = 'worker';

  private username = '';

  constructor(
    private http: HttpClient,
    private storage: StorageMap,
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) {
    this.storage.get('username').subscribe((data: string) => {
      this.username = data;
    });
  }

  getUser$(): Observable<Worker> {
    if (!this.username) {
      this.router.navigate(['auth/login']);
      return new Observable<any>();
    }
    const PermissionsReq$ = (workerId: number) => {
      this.http
        .get<any>(`/api/profiles/api/users/${workerId}/crm-permissions/`)
        .subscribe((perm: Permissions) => {
          this.setAll(perm);
        });
    };

    const WorkerReq$ = (workerId: number) => {
      return this.http.get<Worker>(`/api2/v1/worker/${workerId}/`);
    };
    const UserReq$ = this.http.get<User>(`/api2/v1/user/?username=${this.username}`).pipe(
      map((response: any) => response.objects[0]),
      tap(user => PermissionsReq$(user.id)) // Side-effect - Set permissions
      // shareReplay(1)
    );

    return UserReq$.pipe(
      flatMap((user: User) => WorkerReq$(user.worker)),
      shareReplay(1)
    );
  }

  setAll(permissions: any) {
    // Map complex structure from back to plain list of permissions
    const permissionsMap = permissions;

    const permissionsClient: string[] = [
      ...permissionsMap.client.global.map((el: Permission) => `client-global-${el.codename}`)
    ];

    const permissionsSegmentGlobal: string[] = [
      ...permissionsMap.segment.global.map((el: Permission) => `segment-global-${el.codename}`)
    ];

    const permissionsSegmentGlobalPerObject: string[] = [
      ...permissionsMap.segment.perObject.map(
        (el: Permission) => `segment-perobject-${el.objectId}-${el.codename}`
      )
    ];

    const allPermissions = [
      ...permissionsClient,
      ...permissionsSegmentGlobal,
      ...permissionsSegmentGlobalPerObject
    ];

    this.permissionsService.loadPermissions(allPermissions);
  }
}
