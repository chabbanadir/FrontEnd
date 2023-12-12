import { NgModule } from '@angular/core';

import { CoreMenuModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';
import {HorizontalMenuComponent} from "./horizontal-menu.component";


@NgModule({
  declarations: [HorizontalMenuComponent],
  imports: [CoreMenuModule, CoreCommonModule],
  exports: [HorizontalMenuComponent]
})
export class HorizontalMenuModule {}
