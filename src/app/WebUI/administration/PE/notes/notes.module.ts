import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {NgApexchartsModule} from "ng-apexcharts";
import {CoreCommonModule} from "../../../../../@core/common.module";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CorePipesModule} from "../../../../../@core/pipes/pipes.module";
import {CoreDirectivesModule} from "../../../../../@core/directives/directives";
import {CoreSidebarModule} from "../../../../../@core/components";
import {ContentHeaderModule} from "../../../layout/components/content-header/content-header.module";
import {CsvModule} from "@ctrl/ngx-csv";
import {CardSnippetModule} from "../../../../../@core/components/card-snippet/card-snippet.module";
import {CoreCardModule} from "../../../../../@core/components/core-card/core-card.module";
import {RouterModule} from "@angular/router";


const routes = [
  {
    path: 'configurations',
    loadChildren: () => import('./configuration/configuration.module').then(m => m.ComponentModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'production',
    loadChildren: () => import('./production/production.module').then(m => m.ProductionModule)
  },
  {
    path: 'Packaging',
    loadChildren: () => import('./packaging/packaging.module').then(m => m.PackagingModule)
  }
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
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
    CoreCardModule  ]
})
export class NotesModule { }
