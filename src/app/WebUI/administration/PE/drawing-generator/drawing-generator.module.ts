import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ContentHeaderModule} from "../../../layout/components/content-header/content-header.module";


const routes = [
  {
    path: 'newPN',
    loadChildren: () => import("./new-pn/new-pn.module").then(m => m.NewPNModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class DrawingGeneratorModule { }
