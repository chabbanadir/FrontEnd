import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {CustomBreakPointsProvider} from "./custom-breakpoints";
import {VerticalLayoutModule} from "./vertical/vertical-layout.module";
import {HorizontalLayoutModule} from "./horizontal/horizontal-layout.module";


@NgModule({
  imports: [FlexLayoutModule.withConfig({ disableDefaultBps: true }), VerticalLayoutModule, HorizontalLayoutModule],
  providers: [CustomBreakPointsProvider],
  exports: [VerticalLayoutModule, HorizontalLayoutModule]
})
export class LayoutModule {}
