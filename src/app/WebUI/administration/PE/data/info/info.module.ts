import { HarnessMakerService } from './../harness-maker/services/harness-maker.service';
import { HarnessMakerModel } from './../../../../../Domain/Entities/MasterData/HarnessMaker.model';
import { NgModule } from '@angular/core';
import {DATAModule} from "../data.module";
import {RouterModule, Routes} from "@angular/router";


import {InfoService} from "./services/info.service";
import {CategoryService} from "../category/services/category.service";
import {OemService} from "../oem/services/oem.service";
import {ComponentService} from "../component/services/component.service";


import {ConfigurationService} from "../configuration/services/configuration.service";
import {CableService} from "../cable/services/cable.service";
/*
import { ComponentPartsComponent } from './component-list/component-parts/component-parts.component';
*/



const routes: Routes = [
  {
    path: '',
    //component: ComponentListComponent,
    resolve: {
      uls: InfoService,ComponentService,CategoryService,OemService,ConfigurationService,CableService,HarnessMakerService
    },
    data: {animation: 'components'}
  }
];

@NgModule({
  declarations: [
    // ComponentListComponent,
    // AddComponentComponent,
    // EditComponentComponent,
/*
    ComponentPartsComponent,
*/
    //ComponentDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    DATAModule
  ],
  providers: [InfoService,ComponentService,CategoryService,OemService,ConfigurationService,CableService,HarnessMakerService]
})
export class InfoModule { }
