import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

import { CoreCommonModule } from '@core/common.module';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import {NavbarComponent} from "./navbar.component";
import {NavbarSearchComponent} from "./navbar-search/navbar-search.component";
import {NavbarBookmarkComponent} from "./navbar-bookmark/navbar-bookmark.component";
import {NavbarNotificationComponent} from "./navbar-notification/navbar-notification.component";


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

@NgModule({
  declarations: [NavbarComponent, NavbarSearchComponent, NavbarBookmarkComponent, NavbarNotificationComponent],
  imports: [RouterModule, NgbModule, CoreCommonModule, PerfectScrollbarModule, CoreTouchspinModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
    exports: [NavbarComponent, NavbarSearchComponent]
})
export class NavbarModule {}
