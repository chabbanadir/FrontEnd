import { NgModule } from '@angular/core';
import {DATAModule} from "../data.module";
import {RouterModule, Routes} from "@angular/router";

import { ComponentListComponent } from './component-list/component-list.component';
import { AddComponentComponent } from './component-list/add-component/add-component.component';
import { EditComponentComponent } from './component-list/edit-component/edit-component.component';

import {ComponentService} from "./services/component.service";
import {CategoryService} from "../category/services/category.service";
import {OemService} from "../oem/services/oem.service";
import {ConfigurationService} from "../configuration/services/configuration.service";
import {CableService} from "../cable/services/cable.service";
/*
import { ComponentPartsComponent } from './component-list/component-parts/component-parts.component';
*/
import { ComponentDetailComponent } from './component-list/component-detail/component-detail.component';



const routes: Routes = [
  {
    path: '',
    component: ComponentListComponent,
    resolve: {
      uls: ComponentService,CategoryService,OemService,ConfigurationService,CableService
    },
    data: {animation: 'components'}
  }
];

@NgModule({
  declarations: [
    ComponentListComponent,
    AddComponentComponent,
    EditComponentComponent,
/*
    ComponentPartsComponent,
*/
    ComponentDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    DATAModule
  ],
  providers: [ComponentService,CategoryService,OemService,ConfigurationService,CableService]
})
export class ComponentModule { }
