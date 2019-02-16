/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { configureScope } from '@sentry/browser';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.trackPageViews();
    /* Configuring Sentry scope */
    configureScope(scope => {
      scope.setUser({
        id: 'dasdq3132hg1j23jh',
        username: 'john.doe',
        email: 'john.doe@example.com'
      });
    });
  }
}
