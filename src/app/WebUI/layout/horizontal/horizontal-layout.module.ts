import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import {NavbarModule} from "../components/navbar/navbar.module";
import {FooterModule} from "../components/footer/footer.module";
import {ContentModule} from "../components/content/content.module";
import {HorizontalLayoutComponent} from "./horizontal-layout.component";
import {MenuModule} from "../components/menu/menu.module";


@NgModule({
  declarations: [HorizontalLayoutComponent],
  imports: [RouterModule, CoreCommonModule, CoreSidebarModule, NavbarModule, ContentModule, MenuModule, FooterModule],
  exports: [HorizontalLayoutComponent]
})
export class HorizontalLayoutModule {}
