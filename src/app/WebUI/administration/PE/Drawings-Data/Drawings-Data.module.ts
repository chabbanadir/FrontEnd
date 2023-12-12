import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawingsListComponent } from './drawings-list/drawings-list.component';
import { DrawingViewComponent } from './drawing-view/drawing-view.component';
import { DrawingCardComponent } from './drawings-list/drawing-card/drawing-card.component';
import { OemService } from '../data/oem/services/oem.service';
import { HarnessMakerService } from '../data/harness-maker/services/harness-maker.service';
import { ComponentService } from '../data/component/services/component.service';

const routes = [
  { path: '', component: DrawingsListComponent },
  { path: ':id', component: DrawingViewComponent }
];

@NgModule({
  declarations: [DrawingsListComponent, DrawingViewComponent, DrawingCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [OemService,HarnessMakerService,ComponentService],
})
export class DrawingDataModule { }
