import { UserService, Worker } from './../../@core/data/user.service';
import {Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnDestroy {

  worker: Worker = {
    avatar: '',
    id: 0,
    name: '',
    resource_uri: '',
    surnames: ''
  };

  constructor(private userService: UserService) {
    this.userService.getUser$()
      // .pipe(tap(console.log))
      .subscribe(worker => {
        this.worker = worker;
      });
  }

  ngOnDestroy() {
    // this.alive = false;
  }
}
