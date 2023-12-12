import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {NotesModule} from "../notes.module";

import { ProductionNotesListComponent } from './production-notes-list/production-notes-list.component';
import { AddProductionNoteComponent } from './production-notes-list/add-production-note/add-production-note.component';
import { EditProductionNoteComponent } from './production-notes-list/edit-production-note/edit-production-note.component';

import {ProductionService} from "./services/production.service";



const routes: Routes = [
  {
    path: '',
    component: ProductionNotesListComponent,
    resolve: {
      uls: ProductionService
    },
    data: {animation: 'ProductionNotes'}
  }
];
@NgModule({
  declarations: [
    ProductionNotesListComponent,
    AddProductionNoteComponent,
    EditProductionNoteComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NotesModule
  ],
  providers: [ProductionService]


})
export class ProductionModule { }