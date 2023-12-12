import { NgModule } from '@angular/core';
import { ArchiveService } from './services/archive.service';
import { ArchiveListComponent } from './archive-list/archive-list.component';
import { RouterModule, Routes } from '@angular/router';
import { EditArchiveComponent } from './archive-list/edit-archive/edit-archive.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CardArchiveComponent } from './archive-list/card-archive/card-archive.component';


const routes: Routes = [
  {
    path: '',
    component: ArchiveListComponent,
  }
];

@NgModule({
  declarations: [
    ArchiveListComponent,
    EditArchiveComponent,
    CardArchiveComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    NgxDatatableModule,
  ],
  providers: [ArchiveService ]
})
export class DrawingArchiveModule { }