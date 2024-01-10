import { NgModule } from '@angular/core';
import { ArchiveService } from './services/archive.service';
import { ArchiveListComponent } from './archive-list/archive-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CardArchiveComponent } from './archive-list/card-archive/card-archive.component';
import { CommonModule } from "@angular/common";
import { DialogComponent } from './archive-list/card-archive/dialog/dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { OemService } from '../data/oem/services/oem.service';
import { HarnessMakerService } from '../data/harness-maker/services/harness-maker.service';
import { ComponentService } from '../data/component/services/component.service';
import { CableService } from '../data/cable/services/cable.service';
import { FormsModule } from '@angular/forms';
import { FilterByOEMPipe } from './archive-list/filter-by-oem.pipe';



const routes: Routes = [
  {
    path: '',
    component: ArchiveListComponent,
  }
];

@NgModule({
  declarations: [
    ArchiveListComponent,
    CardArchiveComponent,
    DialogComponent,
    FilterByOEMPipe
  ],
  imports: [
    RouterModule.forChild(routes),
    NgxDatatableModule,
    CommonModule,
    NgSelectModule,
    FormsModule
  ],
  providers: [ArchiveService,OemService,HarnessMakerService,ComponentService,CableService]
})
export class DrawingArchiveModule { }