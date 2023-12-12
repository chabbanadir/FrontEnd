import { NgModule } from '@angular/core';
import { PackagingNotesListComponent } from './packaging-notes-list/packaging-notes-list.component';
import { AddPackagingNoteComponent } from './packaging-notes-list/add-packaging-note/add-packaging-note.component';
import { EditPackagingNoteComponent } from './packaging-notes-list/edit-packaging-note/edit-packaging-note.component';
import {RouterModule, Routes} from "@angular/router";
import {NotesModule} from "../notes.module";
import {PackagingService} from "./services/packaging.service";

const routes: Routes = [
  {
    path: '',
    component: PackagingNotesListComponent,
    resolve: {
      uls: PackagingService
    },
    data: {animation: 'PackagingNotes'}
  }
];
@NgModule({
  declarations: [
    PackagingNotesListComponent,
    AddPackagingNoteComponent,
    EditPackagingNoteComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NotesModule
  ],
  providers: [PackagingService]


})
export class PackagingModule { }