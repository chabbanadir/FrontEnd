import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ContentHeaderModule} from "../../layout/components/content-header/content-header.module";
import { ArchiveListComponent } from './drawing-archive/archive-list//archive-list.component';
import { EditArchiveComponent } from './drawing-archive/archive-list/edit-archive/edit-archive.component';


const routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'data',
        loadChildren: () => import("./data/data.module").then(m => m.DATAModule)
    },
    {
        path: 'notes',
        loadChildren: () => import("./notes/notes.module").then(m => m.NotesModule)
    },
    {
        path: 'drawingGenerator',
        loadChildren: () => import("./drawing-generator/drawing-generator.module").then(m => m.DrawingGeneratorModule)
    },
    {
        path: 'drawingArchive',
        loadChildren: () => import("./drawing-archive/drawing-archive.module").then(m => m.DrawingArchiveModule)
    }
];

@NgModule({
    declarations: [HomeComponent],
    imports: [
        RouterModule.forChild(routes),
        ContentHeaderModule
    ],
    exports: [HomeComponent]
})
export class PEModule {
}
