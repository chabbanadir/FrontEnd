import { NgModule } from '@angular/core';
import { CustomerNotesListComponent } from './customer-notes-list/customer-notes-list.component';
import { AddCustomerNoteComponent } from './customer-notes-list/add-customer-note/add-customer-note.component';
import { EditCustomerNoteComponent } from './customer-notes-list/edit-customer-note/edit-customer-note.component';
import {RouterModule, Routes} from "@angular/router";
import {NotesModule} from "../notes.module";
import {CustomerService} from "./services/customer.service";


const routes: Routes = [
  {
    path: '',
    component: CustomerNotesListComponent,
    resolve: {
      uls: CustomerService
    },
    data: {animation: 'CustomerNotes'}
  }
];
@NgModule({
  declarations: [
    CustomerNotesListComponent,
    AddCustomerNoteComponent,
    EditCustomerNoteComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NotesModule
  ],
  providers: [CustomerService]


})
export class CustomerModule { }
