import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DATAModule} from "../data.module";
import { CableListComponent } from './cable-list/cable-list.component';
import { AddCableComponent } from './cable-list/add-cable/add-cable.component';
import { EditCableComponent } from './cable-list/edit-cable/edit-cable.component';
import {CableService} from "./services/cable.service";
import {OemService} from "../oem/services/oem.service";

const routes: Routes = [
  {
    path: '',
    component: CableListComponent,
    resolve: {
      uls: CableService,OemService
    },
    data: {animation: 'cables'}
  }
];

@NgModule({
  declarations: [
    CableListComponent,
    AddCableComponent,
    EditCableComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    DATAModule
  ],
  providers: [CableService,OemService]
})
export class CableModule { }
