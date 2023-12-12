import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DATAModule} from "../data.module";

import { ConfigurationListComponent } from './configuration-list/configuration-list.component';
import { AddConfigurationComponent } from './configuration-list/add-configuration/add-configuration.component';
import { EditConfigurationComponent } from './configuration-list/edit-configuration/edit-configuration.component';

import {ConfigurationService} from "./services/configuration.service";
import {OemService} from "../oem/services/oem.service";
import {ConfigurationNotesService} from "../../notes/configuration/services/configuration.service";

const routes: Routes = [
  {
    path: '',
    component: ConfigurationListComponent,
    resolve: {
      uls: ConfigurationService,OemService,ConfigurationNotesService
    },
    data: {animation: 'configurations'}
  }
];


@NgModule({
  declarations: [
    ConfigurationListComponent,
    AddConfigurationComponent,
    EditConfigurationComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    DATAModule
  ],
  providers: [ConfigurationService,OemService,ConfigurationNotesService]

})
export class ConfigurationModule { }
