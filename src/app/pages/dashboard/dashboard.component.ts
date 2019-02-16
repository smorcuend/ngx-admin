import { Component, OnDestroy } from '@angular/core';
import { captureException } from '@sentry/browser';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnDestroy {
  // private alive = true;

  constructor() {
    try {
      throw new Error('test sentry');
    } catch (err) {
      captureException(err);
    }
  }

  ngOnDestroy() {
    // this.alive = false;
  }
}
