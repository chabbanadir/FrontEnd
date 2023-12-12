import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CoreCardModule} from "../../../../../../@core/components/core-card/core-card.module";
import {CoreCommonModule} from "../../../../../../@core/common.module";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {Ng2FlatpickrModule} from "ng2-flatpickr";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CorePipesModule} from "../../../../../../@core/pipes/pipes.module";
import {CoreDirectivesModule} from "../../../../../../@core/directives/directives";
import {CoreSidebarModule} from "../../../../../../@core/components";
import {CsvModule} from "@ctrl/ngx-csv";

import {CoreTouchspinModule} from "@core/components/core-touchspin/core-touchspin.module";
import {CardSnippetModule} from "@core/components/card-snippet/card-snippet.module";
import {DragulaModule, DragulaService} from 'ng2-dragula';
import {GojsAngularModule} from "gojs-angular";
import {DragDropModule} from "@angular/cdk/drag-drop";

import { Step8Component } from './home/step8/step8.component';
import {SpreadSheetsModule} from "@grapecity/spread-sheets-angular";
import {HomeComponent} from "./home/home.component";
import {ContentHeaderModule} from "../../../../layout/components/content-header/content-header.module";


import { Step1Component } from './home/step1/step1.component';
import { Step2Component } from './home/step2/step2.component';
import { Step3Component } from './home/step3/step3.component';
import { Step5Component } from "./home/step5/step5.component";
import { Step4Component } from "./home/step4/step4.component";
import { Step6Component } from "./home/step6/step6.component";
import { Step7Component } from './home/step7/step7.component';


import {OemService} from "../../data/oem/services/oem.service";
import {HarnessMakerService} from "../../data/harness-maker/services/harness-maker.service";
import {ComponentService} from "../../data/component/services/component.service";
import {ConfigurationService} from "../../data/configuration/services/configuration.service";
import {ConfigurationNotesService} from "../../notes/configuration/services/configuration.service";
import {DrawingService} from "./services/drawing.service";
import {PackagingService} from "../../notes/packaging/services/packaging.service";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {OemService,HarnessMakerService,ComponentService , ConfigurationService,ConfigurationNotesService ,DrawingService,PackagingService },
    data: {animation: 'newPN'}
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
    Step7Component,
    Step8Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,

    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,

    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    ContentHeaderModule,
    CsvModule,
    CardSnippetModule,
    CoreCardModule,
    CoreTouchspinModule,
    DragulaModule,
    GojsAngularModule,
    DragDropModule,
    SpreadSheetsModule,
  ],
  providers:[OemService,HarnessMakerService,ComponentService ,ConfigurationService,ConfigurationNotesService,DrawingService, DragulaService,PackagingService ]
})
export class NewPNModule { }
