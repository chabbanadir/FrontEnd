import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OemListComponent} from './oem-list/oem-list.component';
import {OemService} from './services/oem.service';
import {AddOemComponent} from "./oem-list/add-oem/add-oem.component";
import {EditOemComponent} from "./oem-list/edit-oem/edit-oem.component";
import {DATAModule} from "../data.module";


// routing
const routes: Routes = [
    {
        path: '',
        component: OemListComponent,
        resolve: {
            uls: OemService
        },
        data: {animation: 'OEM'}
    }
];

@NgModule({
    declarations: [
        OemListComponent,
        AddOemComponent,
        EditOemComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        DATAModule
    ],
    providers: [OemService]

})
export class OemModule {
}
