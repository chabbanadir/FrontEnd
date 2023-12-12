import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {CoreCommonModule} from "../../../../../@core/common.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {ContentHeaderModule} from "../../../layout/components/content-header/content-header.module";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CorePipesModule} from "../../../../../@core/pipes/pipes.module";
import {CoreDirectivesModule} from "../../../../../@core/directives/directives";
import {CoreSidebarModule} from "../../../../../@core/components";
import {CsvModule} from "@ctrl/ngx-csv";
import {CardSnippetModule} from "../../../../../@core/components/card-snippet/card-snippet.module";
import {CoreCardModule} from "../../../../../@core/components/core-card/core-card.module";


const routes = [
  {
    path: 'oems',
    loadChildren: () => import('./oem/oem.module').then(m => m.OemModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
  },
  {
    path: 'configurations',
    loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
  },
  {
    path: 'components',
    loadChildren: () => import('./component/component.module').then(m => m.ComponentModule)
  },
  {
    path: 'cables',
    loadChildren: () => import('./cable/cable.module').then(m => m.CableModule)
  },
  {
    path: 'harnessmakers',
    loadChildren: () => import('./harness-maker/harness-maker.module').then(m => m.HarnessMakerModule)
  },
  
  // {
  //   path: 'infos',
  //   loadChildren: () => import('./info/info.module').then(m => m.InfoModule)
  // },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports:[
    CommonModule,
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    CoreCommonModule,
    FormsModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    ContentHeaderModule,
    CsvModule,
    CardSnippetModule,
    CoreCardModule
  ]
})
export class DATAModule { }
