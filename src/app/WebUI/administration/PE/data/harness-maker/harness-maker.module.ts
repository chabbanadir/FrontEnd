import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DATAModule} from "../data.module";

import { HarnessMakerListComponent } from './harness-maker-list/harness-maker-list.component';
import { AddHarnessMakerComponent } from './harness-maker-list/add-harness-maker/add-harness-maker.component';
import { EditHarnessMakerComponent } from './harness-maker-list/edit-harness-maker/edit-harness-maker.component';
import {HarnessMakerService} from "./services/harness-maker.service";

const routes: Routes = [
  {
    path: '',
    component: HarnessMakerListComponent,
    resolve: {
      uls: HarnessMakerService
    },
    data: {animation: 'harnessmakers'}
  }
];


@NgModule({
  declarations: [
    HarnessMakerListComponent,
    AddHarnessMakerComponent,
    EditHarnessMakerComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    DATAModule
  ],
  providers: [HarnessMakerService]

})
export class HarnessMakerModule { }