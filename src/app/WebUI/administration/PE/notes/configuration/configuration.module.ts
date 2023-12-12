import { NgModule } from '@angular/core';
import { ConfigurationListComponent } from './configuration-list/configuration-list.component';
import { AddConfigurationComponent } from './configuration-list/add-configuration/add-configuration.component';
import { EditConfigurationComponent } from './configuration-list/edit-configuration/edit-configuration.component';
import {RouterModule, Routes} from "@angular/router";
import {ConfigurationNotesService} from "./services/configuration.service";

import {NotesModule} from "../notes.module";



const routes: Routes = [
  {
    path: '',
    component: ConfigurationListComponent,
    resolve: {
      uls: ConfigurationNotesService
    },
    data: {animation: 'ConfigurationNotes'}
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
    NotesModule
  ],
  providers: [ConfigurationNotesService ]
})
export class ComponentModule { }